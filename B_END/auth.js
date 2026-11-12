const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'daham-pasala-secure-jwt-key-2026-buddhist-council';
const DEFAULT_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days

/**
 * Hash a plain text PIN or password using Node's crypto.scrypt
 * Returns format: 'scrypt:<salt>:<hash>'
 */
function hashPin(pin) {
  if (!pin) throw new Error('PIN is required for hashing');
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(pin), salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

/**
 * Verify a plain text PIN against a stored hash or legacy plain text string.
 * Supports auto-migration from legacy plain text (e.g. '1234' or 'Daham12345').
 */
function verifyPin(pin, storedHash) {
  if (!storedHash || !pin) return false;
  const pinStr = String(pin).trim();

  // 1. Scrypt format: 'scrypt:salt:hash'
  if (storedHash.startsWith('scrypt:')) {
    const parts = storedHash.split(':');
    if (parts.length !== 3) return false;
    const [, salt, originalHash] = parts;
    const hash = crypto.scryptSync(pinStr, salt, 64).toString('hex');
    try {
      return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'));
    } catch (e) {
      return false;
    }
  }

  // 2. Legacy plain text fallback (for automatic zero-disruption migration)
  return storedHash === pinStr;
}

/**
 * Generates an RFC 7519 compliant JSON Web Token (JWT) using HMAC-SHA256
 */
function generateToken(payload, expiresInSeconds = DEFAULT_EXPIRY_SECONDS) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresInSeconds;
  const body = Buffer.from(JSON.stringify({ ...payload, iat, exp })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

/**
 * Verifies and decodes an RFC 7519 compliant JSON Web Token (JWT)
 * Returns the decoded payload or null if invalid/expired.
 */
function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, body, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');

  if (signature !== expectedSignature) {
    return null; // Signature mismatch
  }

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired token
    }
    return payload;
  } catch (e) {
    return null;
  }
}

function isLegacyPlainText(storedHash) {
  if (!storedHash || typeof storedHash !== 'string') return false;
  return !storedHash.startsWith('scrypt:');
}

/**
 * Build a deterministic, Firebase-safe UID for role + RegNo/ID.
 */
function getFirebaseUid(role, entityId) {
  const safeRole = String(role || 'user').toLowerCase().replace(/[^a-z0-9]/g, '');
  const safeId = String(entityId || '').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  return `${safeRole}__${safeId}`.slice(0, 128);
}

/**
 * Build a deterministic internal email for Firebase Auth user records.
 */
function getFirebaseEmail(role, entityId) {
  const safeRole = String(role || 'user').toLowerCase().replace(/[^a-z0-9]/g, '');
  const safeId = String(entityId || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `${safeId}.${safeRole}@dahampasala.local`;
}

/**
 * Exchange a Firebase custom token for a genuine Firebase ID Token via Identity Toolkit.
 * Supports both production Firebase Auth and local Auth Emulator.
 */
async function exchangeCustomTokenForIdToken(customToken, webApiKey = process.env.FIREBASE_WEB_API_KEY) {
  if (!customToken || !webApiKey || typeof fetch !== 'function') return null;

  const emulatorHost = process.env.FIREBASE_AUTH_EMULATOR_HOST;
  const endpoint = emulatorHost
    ? `http://${emulatorHost}/identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${encodeURIComponent(webApiKey)}`
    : `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${encodeURIComponent(webApiKey)}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: customToken, returnSecureToken: true }),
      signal: controller.signal
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.idToken) {
      return {
        idToken: data.idToken,
        refreshToken: data.refreshToken || null,
        expiresIn: Number(data.expiresIn) || 3600
      };
    }
  } catch (e) {
    // Fallback cleanly to local JWT when offline
  }
  return null;
}

/**
 * Ensure user exists in Firebase Authentication with custom role claims,
 * then mint a custom token (and exchange for a Firebase ID token when available).
 */
async function syncAndIssueFirebaseSession(firebaseAuth, { role, entityId, name, grade = '', photo = '' }) {
  if (!firebaseAuth || !entityId) return null;

  const uid = getFirebaseUid(role, entityId);
  const email = getFirebaseEmail(role, entityId);
  const claims = {
    role,
    entityId,
    username: entityId,
    grade: grade || ''
  };

  try {
    let existing = null;
    try {
      existing = await firebaseAuth.getUser(uid);
    } catch (e) {
      if (e && e.code !== 'auth/user-not-found') throw e;
    }

    const userProps = {
      email,
      displayName: name || entityId
    };
    if (photo && /^https?:\/\//i.test(photo)) {
      userProps.photoURL = photo;
    }

    if (!existing) {
      await firebaseAuth.createUser({ uid, ...userProps, emailVerified: false });
    } else if (existing.displayName !== userProps.displayName || existing.email !== userProps.email) {
      await firebaseAuth.updateUser(uid, userProps);
    }

    await firebaseAuth.setCustomUserClaims(uid, claims);

    // Custom token signing requires either a Service Account private key or Auth Emulator.
    const firebaseCustomToken = await firebaseAuth.createCustomToken(uid, claims);
    const exchanged = await exchangeCustomTokenForIdToken(firebaseCustomToken);

    return {
      uid,
      email,
      firebaseCustomToken,
      idToken: exchanged ? exchanged.idToken : null,
      refreshToken: exchanged ? exchanged.refreshToken : null,
      authProvider: exchanged ? 'firebase' : 'firebase_custom_token'
    };
  } catch (err) {
    console.warn('⚠️ Firebase Auth sync fallback notice:', err.message || err);
    return null;
  }
}

/**
 * Verify either a local fallback HS256 JWT or a genuine Firebase ID Token.
 */
async function verifyAnyToken(token, firebaseAuth = null) {
  const localPayload = verifyToken(token);
  if (localPayload) {
    return { ...localPayload, authProvider: 'local_jwt' };
  }
  if (firebaseAuth && token) {
    try {
      const decoded = await firebaseAuth.verifyIdToken(token);
      return {
        uid: decoded.uid,
        id: decoded.entityId || decoded.uid,
        regNo: decoded.role === 'student' ? decoded.entityId : undefined,
        username: decoded.entityId || decoded.username || decoded.uid,
        role: decoded.role || 'student',
        grade: decoded.grade || '',
        authProvider: 'firebase'
      };
    } catch (e) {
      return null;
    }
  }
  return null;
}

/**
 * Middleware helper to extract Bearer token from request headers
 */
function extractAuthUser(req) {
  const authHeader = req.headers && (req.headers['authorization'] || req.headers['Authorization']);
  if (!authHeader) return null;

  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;

  const token = match[1];
  return verifyToken(token);
}

async function extractAuthUserAsync(req, firebaseAuth = null) {
  const authHeader = req.headers && (req.headers['authorization'] || req.headers['Authorization']);
  if (!authHeader) return null;

  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;

  return verifyAnyToken(match[1], firebaseAuth);
}

module.exports = {
  hashPin,
  verifyPin,
  isLegacyPlainText,
  generateToken,
  verifyToken,
  verifyAnyToken,
  extractAuthUser,
  extractAuthUserAsync,
  getFirebaseUid,
  getFirebaseEmail,
  exchangeCustomTokenForIdToken,
  syncAndIssueFirebaseSession
};
