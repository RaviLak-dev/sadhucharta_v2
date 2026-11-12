const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const {
  initializeApp,
  getApps,
  getApp,
  deleteApp,
  cert,
  applicationDefault
} = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const { SEED_DATA } = require('./seed-mongo');
const {
  hashPin,
  getFirebaseUid,
  syncAndIssueFirebaseSession
} = require('./auth');

const DEFAULT_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'daham-pasala-sadhu-2026';
const DEFAULT_DATABASE_ID = process.env.FIRESTORE_DATABASE_ID || '(default)';

/**
 * Pure Firebase (Cloud Firestore + Firebase Auth) database adapter
 * with automatic high-speed in-memory fallback for offline/dev resilience.
 */
class FirebaseDatabase {
  constructor() {
    this.provider = 'firebase';
    this.projectId = DEFAULT_PROJECT_ID;
    this.databaseId = DEFAULT_DATABASE_ID;
    this.credentialMode = 'unconfigured';
    this.isConnected = false;
    this.isConnecting = false;
    this.connectionError = null;
    this.lastWriteError = null;
    this.app = null;
    this.firestore = null;
    this.auth = null;
    this.retryTimer = null;
    this.initPromise = null;

    this.initMemoryStore();
    this.initPromise = this.init();
  }

  get isLive() {
    return Boolean(this.isConnected && this.firestore);
  }

  get firebaseAuth() {
    return this.isConnected ? this.auth : null;
  }

  static toDocId(rawId) {
    return String(rawId || '')
      .trim()
      .replace(/\//g, '__')
      .replace(/[^a-zA-Z0-9_.-]/g, '_');
  }

  static stripPin(record) {
    if (!record || typeof record !== 'object') return record;
    const { pin, pinHash, ...rest } = record;
    return rest;
  }

  static calculateDhammaGrade(marks) {
    const m = Number(marks);
    if (isNaN(m)) return 'W';
    if (m >= 75) return 'A';
    if (m >= 65) return 'B';
    if (m >= 50) return 'C';
    if (m >= 35) return 'S';
    return 'W';
  }

  static calculateDhammaGradeLabel(grade) {
    switch (grade) {
      case 'A': return 'විශිෂ්ට සාමාර්ථය (Distinction)';
      case 'B': return 'ඉතා හොඳ සාමාර්ථය (Very Good)';
      case 'C': return 'සම්මාන සාමාර්ථය (Credit)';
      case 'S': return 'සාමාන්‍ය සාමාර්ථය (Simple Pass)';
      case 'W':
      default: return 'අසමත් / ප්‍රගතිය වැඩිදියුණු විය යුතුය (Needs Improvement)';
    }
  }

  initMemoryStore() {
    const clone = (data) => JSON.parse(JSON.stringify(data || []));
    this.memStore = {
      students: clone(SEED_DATA.students),
      teachers: clone(SEED_DATA.teachers),
      admins: clone(SEED_DATA.admins),
      events: clone(SEED_DATA.events),
      announcements: clone(SEED_DATA.announcements),
      materials: clone(SEED_DATA.materials),
      deeds: clone(SEED_DATA.deeds),
      badges: clone(SEED_DATA.badges),
      observations: clone(SEED_DATA.observations),
      attendance: []
    };
  }

  static parseServiceAccountJson(raw) {
    let trimmed = String(raw || '').trim();
    if ((trimmed.startsWith("'") && trimmed.endsWith("'")) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
      try {
        const unquoted = JSON.parse(trimmed);
        if (typeof unquoted === 'string') trimmed = unquoted.trim();
      } catch (e) {
        trimmed = trimmed.slice(1, -1).trim();
      }
    }
    // Support optional base64-encoded service account JSON (useful in strict env var UIs)
    if (trimmed && !trimmed.startsWith('{') && /^[A-Za-z0-9+/=\s]+$/.test(trimmed)) {
      try {
        const decoded = Buffer.from(trimmed.replace(/\s+/g, ''), 'base64').toString('utf8').trim();
        if (decoded.startsWith('{')) trimmed = decoded;
      } catch (_) {}
    }
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed.private_key === 'string') {
      parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }
    return parsed;
  }

  /**
   * Locate Firebase service account credentials from env vars or local JSON key files.
   */
  resolveFirebaseCredentials() {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const parsed = FirebaseDatabase.parseServiceAccountJson(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      return {
        mode: 'env_json',
        projectId: parsed.project_id || DEFAULT_PROJECT_ID,
        credential: cert(parsed)
      };
    }

    const explicitPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (explicitPath) {
      const resolved = path.isAbsolute(explicitPath)
        ? explicitPath
        : path.resolve(__dirname, explicitPath);
      if (fs.existsSync(resolved)) {
        const parsed = JSON.parse(fs.readFileSync(resolved, 'utf8'));
        return {
          mode: 'service_account_file',
          projectId: parsed.project_id || DEFAULT_PROJECT_ID,
          credential: cert(parsed)
        };
      }
    }

    if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      const cleanEmail = String(process.env.FIREBASE_CLIENT_EMAIL).trim().replace(/^["']|["']$/g, '');
      const cleanKey = String(process.env.FIREBASE_PRIVATE_KEY).trim().replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');
      return {
        mode: 'env_fields',
        projectId: DEFAULT_PROJECT_ID,
        credential: cert({
          projectId: DEFAULT_PROJECT_ID,
          clientEmail: cleanEmail,
          privateKey: cleanKey
        })
      };
    }

    // Search standard local filenames in B_END/ and workspace root
    const searchDirs = [__dirname, path.resolve(__dirname, '..')];
    for (const dir of searchDirs) {
      if (!fs.existsSync(dir)) continue;
      const entries = fs.readdirSync(dir);
      const candidate = entries.find((f) =>
        f === 'serviceAccountKey.json' ||
        f === 'firebase-service-account.json' ||
        (f.endsWith('.json') && f.includes('firebase-adminsdk'))
      );
      if (candidate) {
        const fullPath = path.join(dir, candidate);
        const parsed = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        return {
          mode: 'local_key_file',
          projectId: parsed.project_id || DEFAULT_PROJECT_ID,
          credential: cert(parsed)
        };
      }
    }

    if (process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST) {
      return {
        mode: 'emulator',
        projectId: DEFAULT_PROJECT_ID,
        credential: null
      };
    }

    if (process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || process.env.K_SERVICE) {
      return {
        mode: 'adc',
        projectId: process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || DEFAULT_PROJECT_ID,
        credential: applicationDefault()
      };
    }

    return null;
  }

  async init(customConfig = null) {
    if (this.isConnecting) return this.initPromise;
    if (this.isConnected && !customConfig) return true;

    this.isConnecting = true;

    try {
      const resolved = customConfig || this.resolveFirebaseCredentials();
      if (!resolved) {
        this.isConnected = false;
        this.isConnecting = false;
        this.credentialMode = 'offline_fallback';
        this.connectionError =
          'Firebase service account key missing. Place serviceAccountKey.json in B_END/ or set FIREBASE_SERVICE_ACCOUNT_PATH in B_END/.env.';
        console.warn(`⚠️ ${this.connectionError} Using in-memory fallback store.`);
        return false;
      }

      this.projectId = resolved.projectId || DEFAULT_PROJECT_ID;
      this.credentialMode = resolved.mode;

      const existingApps = getApps();
      if (existingApps.length > 0) {
        if (customConfig) {
          await Promise.all(existingApps.map(a => deleteApp(a).catch(() => {})));
          this.app = null;
        } else {
          this.app = getApp();
        }
      }

      if (!this.app || customConfig) {
        const appOptions = { projectId: this.projectId };
        if (resolved.credential) {
          appOptions.credential = resolved.credential;
        }
        this.app = initializeApp(appOptions);
      }

      this.firestore = this.databaseId && this.databaseId !== '(default)'
        ? getFirestore(this.app, this.databaseId)
        : getFirestore(this.app);

      try {
        const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
        this.firestore.settings({
          ignoreUndefinedProperties: true,
          ...(isServerless ? { preferRest: true } : {})
        });
      } catch (e) {
        // settings() may already have been applied on hot reload
      }
      this.auth = getAuth(this.app);

      // Verify connectivity with a fast read
      const pingSnap = await this.firestore.collection('students').limit(1).get();

      this.isConnected = true;
      this.isConnecting = false;
      this.connectionError = null;
      console.log(`✅ Connected to Firebase Cloud Firestore & Auth (${this.projectId}, mode: ${this.credentialMode})`);

      if (pingSnap.empty) {
        await this.seedIfEmpty();
      }
      return true;
    } catch (err) {
      this.isConnected = false;
      this.isConnecting = false;
      this.connectionError = err.message || String(err);
      console.warn(`⚠️ Firebase connection unavailable (${this.connectionError}). Seamlessly using in-memory store.`);
      if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
        this.scheduleRetry();
      }
      return false;
    }
  }

  scheduleRetry() {
    if (this.retryTimer) return;
    this.retryTimer = setTimeout(async () => {
      this.retryTimer = null;
      if (!this.isConnected && !this.isConnecting) {
        await this.init();
      }
    }, 20000);
    if (typeof this.retryTimer.unref === 'function') {
      this.retryTimer.unref();
    }
  }

  async reconnect(customConfig = null) {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    this.isConnected = false;
    this.app = null;
    const ok = await this.init(customConfig || null);
    return {
      success: ok,
      provider: 'firebase',
      projectId: this.projectId,
      database: ok ? 'firebase' : 'memory_fallback',
      credentialMode: this.credentialMode,
      error: this.connectionError
    };
  }

  /**
   * Wait briefly for initial async connection if a route executes immediately at startup.
   */
  async ensureReady(maxWaitMs = (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME ? 8000 : 2000)) {
    if (this.isLive || !this.initPromise) return;
    await Promise.race([
      this.initPromise.catch(() => {}),
      new Promise(resolve => setTimeout(resolve, maxWaitMs))
    ]);
  }

  // ==========================================
  // --- Private Auth Credential Store ---
  // ==========================================
  async _saveAuthCredential(role, entityId, rawOrHashedPin, uid = null) {
    if (!entityId) return null;
    const pinHash = rawOrHashedPin && String(rawOrHashedPin).startsWith('scrypt:')
      ? String(rawOrHashedPin)
      : hashPin(rawOrHashedPin || '1234');
    const resolvedUid = uid || getFirebaseUid(role, entityId);
    const credDocId = `${role}__${FirebaseDatabase.toDocId(entityId)}`;

    if (this.isLive) {
      try {
        await this.firestore.collection('auth_credentials').doc(credDocId).set({
          role,
          entityId,
          uid: resolvedUid,
          pinHash,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('Firestore auth_credentials write notice:', err.message);
      }
    }
    return pinHash;
  }

  async _getAuthCredential(role, entityId) {
    if (!entityId) return null;
    if (this.isLive) {
      try {
        const credDocId = `${role}__${FirebaseDatabase.toDocId(entityId)}`;
        const snap = await this.firestore.collection('auth_credentials').doc(credDocId).get();
        if (snap.exists) {
          return snap.data();
        }
      } catch (err) {}
    }
    return null;
  }

  async createAuthSession({ role, entityId, name, grade = '', photo = '' }) {
    await this.ensureReady();
    if (!this.isLive || !this.auth) return null;
    return syncAndIssueFirebaseSession(this.auth, { role, entityId, name, grade, photo });
  }

  async updateStudentPin(regNo, newPin) {
    const hashed = String(newPin).startsWith('scrypt:') ? newPin : hashPin(newPin);
    const s = this.memStore.students.find(x => x.regNo === regNo);
    if (s) s.pin = hashed;
    await this._saveAuthCredential('student', regNo, hashed);
  }

  async updateTeacherPin(id, newPin) {
    const hashed = String(newPin).startsWith('scrypt:') ? newPin : hashPin(newPin);
    const t = this.memStore.teachers.find(x => x.id === id);
    if (t) t.pin = hashed;
    await this._saveAuthCredential('teacher', id, hashed);
  }

  async updateAdminPin(id, newPin) {
    const hashed = String(newPin).startsWith('scrypt:') ? newPin : hashPin(newPin);
    const a = this.memStore.admins.find(x => x.id === id);
    if (a) a.pin = hashed;
    await this._saveAuthCredential('admin', id, hashed);
  }

  // ==========================================
  // --- Seeding Helper ---
  // ==========================================
  async seedIfEmpty() {
    if (!this.isLive) return false;
    try {
      const [sSnap, tSnap, aSnap] = await Promise.all([
        this.firestore.collection('students').limit(1).get(),
        this.firestore.collection('teachers').limit(1).get(),
        this.firestore.collection('admins').limit(1).get()
      ]);
      if (!sSnap.empty || !tSnap.empty || !aSnap.empty) {
        return false;
      }
      await this.seedCloudFirestore();
      return true;
    } catch (err) {
      console.warn('Firestore auto-seed check skipped:', err.message);
      return false;
    }
  }

  async seedCloudFirestore() {
    if (!this.isLive) {
      throw new Error('Firebase Firestore is not connected.');
    }

    for (const s of SEED_DATA.students) {
      await this.saveStudent(s);
    }
    for (const t of SEED_DATA.teachers) {
      await this.saveTeacher(t);
    }
    for (const a of SEED_DATA.admins) {
      await this.saveAdmin(a);
    }
    for (const ev of SEED_DATA.events) {
      await this.saveEvent(ev);
    }
    for (const d of SEED_DATA.deeds) {
      await this.firestore.collection('deeds').doc(FirebaseDatabase.toDocId(d.id)).set(d, { merge: true });
    }
    for (const b of SEED_DATA.badges) {
      await this.firestore.collection('badges').doc(FirebaseDatabase.toDocId(b.id)).set(b, { merge: true });
    }
    for (const ann of SEED_DATA.announcements) {
      await this.firestore.collection('announcements').doc(FirebaseDatabase.toDocId(ann.id)).set(ann, { merge: true });
    }
    for (const mat of SEED_DATA.materials) {
      await this.firestore.collection('materials').doc(FirebaseDatabase.toDocId(mat.id)).set(mat, { merge: true });
    }

    console.log('🌱 Cloud Firestore seeded with initial Daham Pasala records.');
    return true;
  }

  // ==========================================
  // --- Students CRUD ---
  // ==========================================
  async getAllStudents() {
    await this.ensureReady();
    if (this.isLive) {
      try {
        const snap = await this.firestore.collection('students').get();
        const obj = {};
        snap.forEach(doc => {
          const data = doc.data();
          if (data && data.regNo) obj[data.regNo] = data;
        });
        return obj;
      } catch (err) {
        console.warn('Firestore getAllStudents failed, using memory store:', err.message);
      }
    }
    const obj = {};
    this.memStore.students.forEach(s => {
      obj[s.regNo] = FirebaseDatabase.stripPin(s);
    });
    return obj;
  }

  async getStudent(regNo) {
    await this.ensureReady();
    if (this.isLive) {
      try {
        const docId = FirebaseDatabase.toDocId(regNo);
        const snap = await this.firestore.collection('students').doc(docId).get();
        if (snap.exists) {
          const student = snap.data();
          const cred = await this._getAuthCredential('student', regNo);
          if (cred && cred.pinHash) {
            student.pin = cred.pinHash;
          }
          return student;
        }
      } catch (err) {
        console.warn('Firestore getStudent failed, using memory store:', err.message);
      }
    }
    return this.memStore.students.find(s => s.regNo === regNo) || null;
  }

  async saveStudent(studentData) {
    await this.ensureReady();
    const { regNo } = studentData;
    if (!regNo) throw new Error('regNo is required');

    const uid = studentData.uid || getFirebaseUid('student', regNo);
    const now = new Date().toISOString();

    const idx = this.memStore.students.findIndex(s => s.regNo === regNo);
    const existingMem = idx >= 0 ? this.memStore.students[idx] : null;
    const rawPin = studentData.pin !== undefined ? studentData.pin : (existingMem && existingMem.pin ? existingMem.pin : '1234');
    const hashedPin = String(rawPin).startsWith('scrypt:') ? rawPin : hashPin(rawPin);

    const mergedMem = {
      attendance: [],
      examMarks: [],
      ...(existingMem || {}),
      ...studentData,
      uid,
      pin: hashedPin,
      updatedAt: now
    };
    if (!mergedMem.createdAt) mergedMem.createdAt = now;

    if (idx >= 0) this.memStore.students[idx] = mergedMem;
    else this.memStore.students.push(mergedMem);

    this.lastWriteError = null;
    if (this.isLive) {
      try {
        const docId = FirebaseDatabase.toDocId(regNo);
        const publicDoc = FirebaseDatabase.stripPin(mergedMem);
        await this.firestore.collection('students').doc(docId).set(publicDoc, { merge: true });
        await this._saveAuthCredential('student', regNo, hashedPin, uid);
        if (this.auth) {
          await syncAndIssueFirebaseSession(this.auth, {
            role: 'student',
            entityId: regNo,
            name: publicDoc.name,
            grade: publicDoc.grade || '',
            photo: publicDoc.photo || ''
          }).catch(() => {});
        }
        return publicDoc;
      } catch (err) {
        this.lastWriteError = err.message || String(err);
        console.warn('Firestore saveStudent failed, saved to memory store:', err.message);
      }
    }
    return FirebaseDatabase.stripPin(mergedMem);
  }

  async deleteStudent(regNo) {
    await this.ensureReady();
    if (!regNo) return false;

    this.memStore.badges = this.memStore.badges.filter(b => b.regNo !== regNo);
    this.memStore.deeds = this.memStore.deeds.filter(d => d.regNo !== regNo);
    this.memStore.observations = this.memStore.observations.filter(o => o.regNo !== regNo);
    const beforeLen = this.memStore.students.length;
    this.memStore.students = this.memStore.students.filter(s => s.regNo !== regNo);
    const memDeleted = this.memStore.students.length < beforeLen;

    if (this.isLive) {
      try {
        const docId = FirebaseDatabase.toDocId(regNo);
        const studentRef = this.firestore.collection('students').doc(docId);
        const existing = await studentRef.get();

        const [badgeSnap, deedSnap, obsSnap] = await Promise.all([
          this.firestore.collection('badges').where('regNo', '==', regNo).get(),
          this.firestore.collection('deeds').where('regNo', '==', regNo).get(),
          this.firestore.collection('observations').where('regNo', '==', regNo).get()
        ]);

        const batch = this.firestore.batch();
        badgeSnap.forEach(d => batch.delete(d.ref));
        deedSnap.forEach(d => batch.delete(d.ref));
        obsSnap.forEach(d => batch.delete(d.ref));
        batch.delete(this.firestore.collection('auth_credentials').doc(`student__${docId}`));
        batch.delete(studentRef);
        await batch.commit();

        if (this.auth) {
          await this.auth.deleteUser(getFirebaseUid('student', regNo)).catch(() => {});
        }
        return existing.exists || memDeleted;
      } catch (err) {
        console.warn('Firestore deleteStudent failed, removed from memory store:', err.message);
      }
    }
    return memDeleted;
  }

  async getStudentProfileWithRelations(regNo) {
    if (!regNo) return null;
    const student = await this.getStudent(regNo);
    if (!student) return null;

    const [allBadges, deeds, observations] = await Promise.all([
      this.getAllBadges(regNo),
      this.getAllDeeds(regNo),
      this.getAllObservations(regNo)
    ]);
    const approvedBadges = allBadges.filter(b => b.status === 'approved');

    let rankInfo = null;
    if (student.grade) {
      try {
        const classRankings = await this.calculateClassRankings(student.grade);
        const studentEntry = (classRankings.students || []).find(s => s.regNo === regNo);
        if (studentEntry) {
          rankInfo = {
            rank: studentEntry.rank,
            totalStudents: classRankings.totalStudents,
            rankLabel: `${String(studentEntry.rank).padStart(2, '0')} / ${String(classRankings.totalStudents).padStart(2, '0')}`,
            cumulativeAverage: studentEntry.cumulativeAverage,
            overallGrade: studentEntry.overallGrade,
            classAverage: classRankings.classAverage
          };
        }
      } catch (e) {}
    }

    return {
      ...FirebaseDatabase.stripPin(student),
      approvedBadges,
      allBadges,
      deeds,
      observations,
      rankInfo
    };
  }

  // --- Class Rankings & Exam Marks ---
  async calculateClassRankings(grade, year = '2026') {
    if (!grade) throw new Error('Grade is required for class ranking calculation.');

    const allStudentsObj = await this.getAllStudents();
    const target = grade.toLowerCase();
    const students = Object.values(allStudentsObj).filter(
      s => s.grade && s.grade.toLowerCase().includes(target)
    );

    const rankingRows = [];
    students.forEach(student => {
      const marksList = (student.examMarks || []).filter(
        m => String(m.year || '2026') === String(year)
      );

      const subjectMap = {};
      marksList.forEach(m => {
        const sub = m.subject || 'බුද්ධ ධර්මය';
        if (!subjectMap[sub]) {
          subjectMap[sub] = { term1: null, term2: null, term3: null, remarks: '' };
        }
        const t = String(m.term || '1');
        if (t === '1') subjectMap[sub].term1 = Number(m.marks);
        else if (t === '2') subjectMap[sub].term2 = Number(m.marks);
        else if (t === '3') subjectMap[sub].term3 = Number(m.marks);
        if (m.remarks) subjectMap[sub].remarks = m.remarks;
      });

      let totalCumulativeMarks = 0;
      let totalMarkEntries = 0;
      let term1Sum = 0, term1Count = 0;
      let term2Sum = 0, term2Count = 0;
      let term3Sum = 0, term3Count = 0;

      const subjectBreakdown = Object.keys(subjectMap).map(sub => {
        const d = subjectMap[sub];
        let subSum = 0;
        let subCount = 0;
        if (d.term1 !== null) { subSum += d.term1; subCount++; term1Sum += d.term1; term1Count++; }
        if (d.term2 !== null) { subSum += d.term2; subCount++; term2Sum += d.term2; term2Count++; }
        if (d.term3 !== null) { subSum += d.term3; subCount++; term3Sum += d.term3; term3Count++; }

        totalCumulativeMarks += subSum;
        totalMarkEntries += subCount;
        const subAvg = subCount > 0 ? Number((subSum / subCount).toFixed(1)) : 0;

        return {
          subject: sub,
          term1: d.term1,
          term2: d.term2,
          term3: d.term3,
          average: subAvg,
          grade: FirebaseDatabase.calculateDhammaGrade(subAvg),
          remarks: d.remarks
        };
      });

      const cumulativeAverage = totalMarkEntries > 0
        ? Number((totalCumulativeMarks / totalMarkEntries).toFixed(1))
        : 0;
      const overallGrade = FirebaseDatabase.calculateDhammaGrade(cumulativeAverage);

      rankingRows.push({
        regNo: student.regNo,
        name: student.name,
        grade: student.grade,
        term1Avg: term1Count > 0 ? Number((term1Sum / term1Count).toFixed(1)) : null,
        term2Avg: term2Count > 0 ? Number((term2Sum / term2Count).toFixed(1)) : null,
        term3Avg: term3Count > 0 ? Number((term3Sum / term3Count).toFixed(1)) : null,
        totalCumulativeMarks,
        totalMarkEntries,
        subjectCount: Object.keys(subjectMap).length,
        cumulativeAverage,
        overallGrade,
        overallGradeLabel: FirebaseDatabase.calculateDhammaGradeLabel(overallGrade),
        subjectBreakdown
      });
    });

    rankingRows.sort((a, b) => {
      if (b.cumulativeAverage !== a.cumulativeAverage) return b.cumulativeAverage - a.cumulativeAverage;
      if (b.totalCumulativeMarks !== a.totalCumulativeMarks) return b.totalCumulativeMarks - a.totalCumulativeMarks;
      return a.name.localeCompare(b.name);
    });

    for (let i = 0; i < rankingRows.length; i++) {
      if (i > 0) {
        const prev = rankingRows[i - 1];
        const curr = rankingRows[i];
        curr.rank = (curr.cumulativeAverage === prev.cumulativeAverage && curr.totalCumulativeMarks === prev.totalCumulativeMarks)
          ? prev.rank
          : i + 1;
      } else {
        rankingRows[i].rank = 1;
      }
    }

    const totalStudents = rankingRows.length;
    const gradeCounts = { A: 0, B: 0, C: 0, S: 0, W: 0 };
    let totalAvgSum = 0;
    let highestAvg = 0;
    let lowestAvg = totalStudents > 0 ? 100 : 0;

    rankingRows.forEach(r => {
      gradeCounts[r.overallGrade] = (gradeCounts[r.overallGrade] || 0) + 1;
      totalAvgSum += r.cumulativeAverage;
      if (r.cumulativeAverage > highestAvg) highestAvg = r.cumulativeAverage;
      if (r.cumulativeAverage < lowestAvg) lowestAvg = r.cumulativeAverage;
    });

    const passCount = totalStudents - (gradeCounts.W || 0);
    return {
      grade,
      year,
      totalStudents,
      classAverage: totalStudents > 0 ? Number((totalAvgSum / totalStudents).toFixed(1)) : 0,
      highestAverage: highestAvg,
      lowestAverage: lowestAvg,
      passRate: totalStudents > 0 ? Math.round((passCount / totalStudents) * 100) : 0,
      gradeCounts,
      students: rankingRows
    };
  }

  async saveStudentExamMark(regNo, examData) {
    if (!regNo) throw new Error('regNo is required');
    const term = String(examData.term || '1');
    const year = String(examData.year || '2026');
    const subject = String(examData.subject || '').trim();
    if (!subject) throw new Error('Subject is required.');

    const marks = Number(examData.marks);
    if (isNaN(marks) || marks < 0 || marks > 100) {
      throw new Error('Marks must be a valid number between 0 and 100.');
    }

    const newMarkEntry = {
      term,
      year,
      subject,
      marks,
      grade: FirebaseDatabase.calculateDhammaGrade(marks),
      remarks: examData.remarks || ''
    };

    const student = await this.getStudent(regNo);
    if (!student) throw new Error('Student not found: ' + regNo);

    const marksList = Array.isArray(student.examMarks) ? [...student.examMarks] : [];
    const existingIdx = marksList.findIndex(
      m => String(m.term || '1') === term && String(m.year || '2026') === year && m.subject === subject
    );
    if (existingIdx >= 0) marksList[existingIdx] = newMarkEntry;
    else marksList.push(newMarkEntry);

    return this.saveStudent({ ...student, regNo, examMarks: marksList });
  }

  async deleteStudentExamMark(regNo, term, subject, year = '2026') {
    if (!regNo) throw new Error('regNo is required');
    const termStr = String(term || '1');
    const yearStr = String(year || '2026');

    const student = await this.getStudent(regNo);
    if (!student || !Array.isArray(student.examMarks)) return false;

    const origLen = student.examMarks.length;
    const filtered = student.examMarks.filter(
      m => !(String(m.term || '1') === termStr && String(m.year || '2026') === yearStr && m.subject === subject)
    );
    if (filtered.length === origLen) return false;

    await this.saveStudent({ ...student, regNo, examMarks: filtered });
    return true;
  }

  // ==========================================
  // --- Teachers CRUD ---
  // ==========================================
  async getAllTeachers() {
    await this.ensureReady();
    if (this.isLive) {
      try {
        const snap = await this.firestore.collection('teachers').get();
        return snap.docs.map(d => d.data());
      } catch (err) {
        console.warn('Firestore getAllTeachers failed, using memory store:', err.message);
      }
    }
    return this.memStore.teachers.map(FirebaseDatabase.stripPin);
  }

  async getTeacher(id) {
    await this.ensureReady();
    if (this.isLive) {
      try {
        const docId = FirebaseDatabase.toDocId(id);
        const snap = await this.firestore.collection('teachers').doc(docId).get();
        if (snap.exists) {
          const teacher = snap.data();
          const cred = await this._getAuthCredential('teacher', id);
          if (cred && cred.pinHash) {
            teacher.pin = cred.pinHash;
          }
          return teacher;
        }
      } catch (err) {
        console.warn('Firestore getTeacher failed, using memory store:', err.message);
      }
    }
    return this.memStore.teachers.find(t => t.id === id) || null;
  }

  async saveTeacher(teacherData) {
    await this.ensureReady();
    const { id } = teacherData;
    if (!id) throw new Error('Teacher id is required');

    const uid = teacherData.uid || getFirebaseUid('teacher', id);
    const now = new Date().toISOString();

    const idx = this.memStore.teachers.findIndex(t => t.id === id);
    const existingMem = idx >= 0 ? this.memStore.teachers[idx] : null;
    const rawPin = teacherData.pin !== undefined ? teacherData.pin : (existingMem && existingMem.pin ? existingMem.pin : '1234');
    const hashedPin = String(rawPin).startsWith('scrypt:') ? rawPin : hashPin(rawPin);

    const mergedMem = {
      ...(existingMem || {}),
      ...teacherData,
      uid,
      pin: hashedPin,
      updatedAt: now
    };
    if (!mergedMem.createdAt) mergedMem.createdAt = now;

    if (idx >= 0) this.memStore.teachers[idx] = mergedMem;
    else this.memStore.teachers.push(mergedMem);

    this.lastWriteError = null;
    if (this.isLive) {
      try {
        const docId = FirebaseDatabase.toDocId(id);
        const publicDoc = FirebaseDatabase.stripPin(mergedMem);
        await this.firestore.collection('teachers').doc(docId).set(publicDoc, { merge: true });
        await this._saveAuthCredential('teacher', id, hashedPin, uid);
        if (this.auth) {
          await syncAndIssueFirebaseSession(this.auth, {
            role: 'teacher',
            entityId: id,
            name: publicDoc.name,
            grade: publicDoc.grade || '',
            photo: publicDoc.photo || publicDoc.avatar || ''
          }).catch(() => {});
        }
        return publicDoc;
      } catch (err) {
        this.lastWriteError = err.message || String(err);
        console.warn('Firestore saveTeacher failed, saved to memory store:', err.message);
      }
    }
    return FirebaseDatabase.stripPin(mergedMem);
  }

  async deleteTeacher(id) {
    await this.ensureReady();
    if (!id) return false;
    const beforeLen = this.memStore.teachers.length;
    this.memStore.teachers = this.memStore.teachers.filter(t => t.id !== id);
    const memDeleted = this.memStore.teachers.length < beforeLen;

    if (this.isLive) {
      try {
        const docId = FirebaseDatabase.toDocId(id);
        const ref = this.firestore.collection('teachers').doc(docId);
        const existing = await ref.get();
        const batch = this.firestore.batch();
        batch.delete(ref);
        batch.delete(this.firestore.collection('auth_credentials').doc(`teacher__${docId}`));
        await batch.commit();
        if (this.auth) {
          await this.auth.deleteUser(getFirebaseUid('teacher', id)).catch(() => {});
        }
        return existing.exists || memDeleted;
      } catch (err) {
        console.warn('Firestore deleteTeacher failed, removed from memory:', err.message);
      }
    }
    return memDeleted;
  }

  // ==========================================
  // --- Attendance Management ---
  // ==========================================
  async getAllAttendance() {
    return this.getAttendance({});
  }

  async getAttendance(query = {}) {
    await this.ensureReady();
    if (this.isLive) {
      try {
        let ref = this.firestore.collection('attendance');
        if (query.date) ref = ref.where('date', '==', query.date);
        if (query.grade) ref = ref.where('grade', '==', query.grade);
        if (query.type) ref = ref.where('type', '==', query.type);
        const snap = await ref.get();
        return snap.docs.map(d => d.data()).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
      } catch (err) {}
    }

    let list = this.memStore.attendance;
    if (query.date) list = list.filter(a => a.date === query.date);
    if (query.grade) list = list.filter(a => a.grade && a.grade.includes(query.grade));
    if (query.type) list = list.filter(a => a.type === query.type);
    return list;
  }

  async recordAttendance(attendanceData) {
    await this.ensureReady();
    const { date, grade, type, records } = attendanceData;
    if (!date || !records) throw new Error('date and records are required');

    const safeGrade = grade || '10 ශ්‍රේණිය';
    const safeType = type || 'dhamma_school';
    const entry = {
      id: attendanceData.id || `${date}__${FirebaseDatabase.toDocId(safeGrade)}__${safeType}`,
      date,
      grade: safeGrade,
      type: safeType,
      records: records || [],
      updatedAt: new Date().toISOString()
    };

    const existingIdx = this.memStore.attendance.findIndex(
      a => a.date === date && a.grade === safeGrade && a.type === safeType
    );
    if (existingIdx >= 0) this.memStore.attendance[existingIdx] = entry;
    else this.memStore.attendance.push(entry);

    for (const r of (records || [])) {
      const baseRemarks = r.remarks || '';
      const finalRemarks = r.broughtFlowers && !baseRemarks.includes('මල්')
        ? (baseRemarks ? `${baseRemarks} | 🌸 මල් රැගෙන එන ලදී` : '🌸 මල් රැගෙන එන ලදී')
        : baseRemarks;
      await this._upsertStudentAttendanceEntry(r.regNo, {
        date,
        status: r.status || 'present',
        type: safeType,
        event: r.event,
        broughtFlowers: Boolean(r.broughtFlowers),
        score: r.score || 10,
        remarks: finalRemarks
      });
    }

    if (this.isLive) {
      try {
        await this.firestore.collection('attendance').doc(FirebaseDatabase.toDocId(entry.id)).set(entry, { merge: true });
      } catch (err) {
        console.warn('Firestore recordAttendance failed, recorded to memory:', err.message);
      }
    }
    return entry;
  }

  // ==========================================
  // --- Good Deeds (යහපත් ක්‍රියා) ---
  // ==========================================
  async getAllDeeds(regNo = null) {
    await this.ensureReady();
    if (this.isLive) {
      try {
        let ref = this.firestore.collection('deeds');
        if (regNo) ref = ref.where('regNo', '==', regNo);
        const snap = await ref.get();
        return snap.docs.map(d => d.data()).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
      } catch (err) {}
    }
    if (regNo) return this.memStore.deeds.filter(d => d.regNo === regNo);
    return this.memStore.deeds;
  }

  async _upsertStudentAttendanceEntry(regNo, attEntry, matchByEvent = false) {
    if (!regNo || !attEntry) return;
    const student = await this.getStudent(regNo);
    if (!student) return;

    const att = Array.isArray(student.attendance) ? [...student.attendance] : [];
    const attIdx = matchByEvent
      ? att.findIndex(a => a.date === attEntry.date && a.event === attEntry.event)
      : att.findIndex(a => a.date === attEntry.date && a.type === attEntry.type);

    if (attIdx >= 0) att[attIdx] = attEntry;
    else att.unshift(attEntry);

    const memStudent = this.memStore.students.find(s => s.regNo === regNo);
    if (memStudent) memStudent.attendance = att;

    if (this.isLive) {
      try {
        await this.firestore
          .collection('students')
          .doc(FirebaseDatabase.toDocId(regNo))
          .set({ attendance: att, updatedAt: new Date().toISOString() }, { merge: true });
      } catch (e) {}
    }
  }

  async addDeed(deedData) {
    await this.ensureReady();
    const id = deedData.id || 'deed-' + Date.now();
    const doc = { id, ...deedData, createdAt: deedData.createdAt || new Date().toISOString() };
    this.memStore.deeds.unshift(doc);

    if (this.isLive) {
      try {
        await this.firestore.collection('deeds').doc(FirebaseDatabase.toDocId(id)).set(doc, { merge: true });
      } catch (err) {
        console.warn('Firestore addDeed failed, saved to memory:', err.message);
      }
    }

    if (doc.regNo) {
      await this._upsertStudentAttendanceEntry(doc.regNo, {
        date: doc.date || new Date().toISOString().split('T')[0],
        status: 'present',
        type: 'good_deed',
        event: doc.title || doc.deed || 'යහපත් ක්‍රියාවක්',
        score: Number(doc.score || doc.points || 10),
        remarks: doc.remarks || ''
      }, true);
    }
    return doc;
  }

  async deleteDeed(id) {
    await this.ensureReady();
    const orig = this.memStore.deeds.length;
    this.memStore.deeds = this.memStore.deeds.filter(d => d.id !== id);
    const memDeleted = this.memStore.deeds.length < orig;

    if (this.isLive) {
      try {
        const ref = this.firestore.collection('deeds').doc(FirebaseDatabase.toDocId(id));
        const snap = await ref.get();
        await ref.delete();
        return snap.exists || memDeleted;
      } catch (err) {}
    }
    return memDeleted;
  }

  // ==========================================
  // --- Badges & Honors ---
  // ==========================================
  async getAllBadges(regNo = null, status = null) {
    await this.ensureReady();
    if (this.isLive) {
      try {
        let ref = this.firestore.collection('badges');
        if (regNo) ref = ref.where('regNo', '==', regNo);
        if (status) ref = ref.where('status', '==', status);
        const snap = await ref.get();
        return snap.docs.map(d => d.data()).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
      } catch (err) {}
    }
    let list = this.memStore.badges;
    if (regNo) list = list.filter(b => b.regNo === regNo);
    if (status) list = list.filter(b => b.status === status);
    return list;
  }

  async nominateBadge(badgeData) {
    await this.ensureReady();
    const id = badgeData.id || 'badge-' + Date.now();
    const badge = { id, status: 'pending', ...badgeData, createdAt: badgeData.createdAt || new Date().toISOString() };
    this.memStore.badges.unshift(badge);

    if (this.isLive) {
      try {
        await this.firestore.collection('badges').doc(FirebaseDatabase.toDocId(id)).set(badge, { merge: true });
      } catch (err) {
        console.warn('Firestore nominateBadge failed, saved to memory:', err.message);
      }
    }
    return badge;
  }

  async updateBadgeStatus(id, status) {
    return this.updateBadge(id, { status });
  }

  async updateBadge(id, updateData) {
    await this.ensureReady();
    const idx = this.memStore.badges.findIndex(x => x.id === id);
    if (idx >= 0) {
      this.memStore.badges[idx] = { ...this.memStore.badges[idx], ...updateData, updatedAt: new Date().toISOString() };
    }
    const memBadge = idx >= 0 ? this.memStore.badges[idx] : null;

    if (this.isLive) {
      try {
        const ref = this.firestore.collection('badges').doc(FirebaseDatabase.toDocId(id));
        const snap = await ref.get();
        if (snap.exists) {
          const updated = { ...snap.data(), ...updateData, updatedAt: new Date().toISOString() };
          await ref.set(updated, { merge: true });
          return updated;
        }
      } catch (err) {}
    }
    return memBadge;
  }

  async deleteBadge(id) {
    await this.ensureReady();
    const orig = this.memStore.badges.length;
    this.memStore.badges = this.memStore.badges.filter(b => b.id !== id);
    const memDeleted = this.memStore.badges.length < orig;

    if (this.isLive) {
      try {
        const ref = this.firestore.collection('badges').doc(FirebaseDatabase.toDocId(id));
        const snap = await ref.get();
        await ref.delete();
        return snap.exists || memDeleted;
      } catch (err) {}
    }
    return memDeleted;
  }

  // ==========================================
  // --- Teacher Observations ---
  // ==========================================
  async getAllObservations(regNo = null) {
    await this.ensureReady();
    if (this.isLive) {
      try {
        let ref = this.firestore.collection('observations');
        if (regNo) ref = ref.where('regNo', '==', regNo);
        const snap = await ref.get();
        return snap.docs.map(d => d.data()).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
      } catch (err) {}
    }
    if (regNo) return this.memStore.observations.filter(o => o.regNo === regNo);
    return this.memStore.observations;
  }

  async addObservation(obsData) {
    await this.ensureReady();
    const id = obsData.id || 'obs-' + Date.now();
    const doc = { id, ...obsData, createdAt: obsData.createdAt || new Date().toISOString() };
    this.memStore.observations.unshift(doc);

    if (this.isLive) {
      try {
        await this.firestore.collection('observations').doc(FirebaseDatabase.toDocId(id)).set(doc, { merge: true });
      } catch (err) {}
    }
    return doc;
  }

  async deleteObservation(id) {
    await this.ensureReady();
    const orig = this.memStore.observations.length;
    this.memStore.observations = this.memStore.observations.filter(o => o.id !== id);
    const memDeleted = this.memStore.observations.length < orig;

    if (this.isLive) {
      try {
        const ref = this.firestore.collection('observations').doc(FirebaseDatabase.toDocId(id));
        const snap = await ref.get();
        await ref.delete();
        return snap.exists || memDeleted;
      } catch (err) {}
    }
    return memDeleted;
  }

  // ==========================================
  // --- Events ---
  // ==========================================
  async getAllEvents() {
    await this.ensureReady();
    if (this.isLive) {
      try {
        const snap = await this.firestore.collection('events').get();
        return snap.docs.map(d => d.data()).sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));
      } catch (err) {}
    }
    return this.memStore.events;
  }

  async saveEvent(eventData) {
    await this.ensureReady();
    const id = eventData.id || 'ev-' + Date.now();
    const event = { ...eventData, id, updatedAt: new Date().toISOString() };
    const idx = this.memStore.events.findIndex(e => e.id === id);
    if (idx >= 0) this.memStore.events[idx] = event;
    else this.memStore.events.push(event);

    if (this.isLive) {
      try {
        await this.firestore.collection('events').doc(FirebaseDatabase.toDocId(id)).set(event, { merge: true });
      } catch (err) {}
    }
    return event;
  }

  async deleteEvent(id) {
    await this.ensureReady();
    const orig = this.memStore.events.length;
    this.memStore.events = this.memStore.events.filter(e => e.id !== id);
    const memDeleted = this.memStore.events.length < orig;

    if (this.isLive) {
      try {
        const ref = this.firestore.collection('events').doc(FirebaseDatabase.toDocId(id));
        const snap = await ref.get();
        await ref.delete();
        return snap.exists || memDeleted;
      } catch (err) {}
    }
    return memDeleted;
  }

  // ==========================================
  // --- Announcements ---
  // ==========================================
  async getAllAnnouncements(audience = null) {
    await this.ensureReady();
    if (this.isLive) {
      try {
        const snap = await this.firestore.collection('announcements').get();
        let list = snap.docs.map(d => d.data()).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
        if (audience) {
          list = list.filter(a => !a.audience || a.audience === audience || a.audience === 'all');
        }
        return list;
      } catch (err) {}
    }
    if (audience) return this.memStore.announcements.filter(a => !a.audience || a.audience === audience || a.audience === 'all');
    return this.memStore.announcements;
  }

  async addAnnouncement(annData) {
    await this.ensureReady();
    const id = annData.id || 'ann-' + Date.now();
    const doc = { id, ...annData, createdAt: annData.createdAt || new Date().toISOString() };
    this.memStore.announcements.unshift(doc);

    if (this.isLive) {
      try {
        await this.firestore.collection('announcements').doc(FirebaseDatabase.toDocId(id)).set(doc, { merge: true });
      } catch (err) {}
    }
    return doc;
  }

  async deleteAnnouncement(id) {
    await this.ensureReady();
    const orig = this.memStore.announcements.length;
    this.memStore.announcements = this.memStore.announcements.filter(a => a.id !== id);
    const memDeleted = this.memStore.announcements.length < orig;

    if (this.isLive) {
      try {
        const ref = this.firestore.collection('announcements').doc(FirebaseDatabase.toDocId(id));
        const snap = await ref.get();
        await ref.delete();
        return snap.exists || memDeleted;
      } catch (err) {}
    }
    return memDeleted;
  }

  // ==========================================
  // --- Study Materials ---
  // ==========================================
  async getAllMaterials(grade = null) {
    await this.ensureReady();
    if (this.isLive) {
      try {
        const snap = await this.firestore.collection('materials').get();
        let list = snap.docs.map(d => d.data()).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
        if (grade) {
          list = list.filter(m => m.grade === grade || m.grade === 'all');
        }
        return list;
      } catch (err) {}
    }
    if (grade) return this.memStore.materials.filter(m => m.grade === grade || m.grade === 'all');
    return this.memStore.materials;
  }

  async addMaterial(matData) {
    await this.ensureReady();
    const id = matData.id || 'mat-' + Date.now();
    const doc = { id, ...matData, createdAt: matData.createdAt || new Date().toISOString() };
    this.memStore.materials.unshift(doc);

    if (this.isLive) {
      try {
        const payload = { ...doc };
        // Guard against Firestore 1 MiB document size limit for large base64 PDF blobs
        if (payload.fileData && Buffer.byteLength(String(payload.fileData), 'utf8') > 850 * 1024) {
          console.warn(`⚠️ Material ${id} exceeds Firestore 1MiB document limit; storing metadata in Firestore & file payload in memory.`);
          delete payload.fileData;
        }
        await this.firestore.collection('materials').doc(FirebaseDatabase.toDocId(id)).set(payload, { merge: true });
      } catch (err) {
        console.warn('Firestore addMaterial failed, saved to memory:', err.message);
      }
    }
    return doc;
  }

  async deleteMaterial(id) {
    await this.ensureReady();
    const orig = this.memStore.materials.length;
    this.memStore.materials = this.memStore.materials.filter(m => m.id !== id);
    const memDeleted = this.memStore.materials.length < orig;

    if (this.isLive) {
      try {
        const ref = this.firestore.collection('materials').doc(FirebaseDatabase.toDocId(id));
        const snap = await ref.get();
        await ref.delete();
        return snap.exists || memDeleted;
      } catch (err) {}
    }
    return memDeleted;
  }

  // ==========================================
  // --- Admin Accounts ---
  // ==========================================
  async getAdmin(id) {
    await this.ensureReady();
    if (this.isLive) {
      try {
        const docId = FirebaseDatabase.toDocId(id);
        const snap = await this.firestore.collection('admins').doc(docId).get();
        if (snap.exists) {
          const adminDoc = snap.data();
          const cred = await this._getAuthCredential('admin', id);
          if (cred && cred.pinHash) {
            adminDoc.pin = cred.pinHash;
          }
          return adminDoc;
        }
      } catch (err) {}
    }
    return this.memStore.admins.find(a => a.id === id) || null;
  }

  async saveAdmin(adminData) {
    await this.ensureReady();
    const { id } = adminData;
    if (!id) throw new Error('Admin id is required');

    const uid = adminData.uid || getFirebaseUid('admin', id);
    const now = new Date().toISOString();

    const idx = this.memStore.admins.findIndex(a => a.id === id);
    const existingMem = idx >= 0 ? this.memStore.admins[idx] : null;
    const rawPin = adminData.pin !== undefined ? adminData.pin : (existingMem && existingMem.pin ? existingMem.pin : '1234');
    const hashedPin = String(rawPin).startsWith('scrypt:') ? rawPin : hashPin(rawPin);

    const mergedMem = {
      ...(existingMem || {}),
      ...adminData,
      uid,
      pin: hashedPin,
      updatedAt: now
    };
    if (!mergedMem.createdAt) mergedMem.createdAt = now;

    if (idx >= 0) this.memStore.admins[idx] = mergedMem;
    else this.memStore.admins.push(mergedMem);

    if (this.isLive) {
      try {
        const docId = FirebaseDatabase.toDocId(id);
        const publicDoc = FirebaseDatabase.stripPin(mergedMem);
        await this.firestore.collection('admins').doc(docId).set(publicDoc, { merge: true });
        await this._saveAuthCredential('admin', id, hashedPin, uid);
        if (this.auth) {
          await syncAndIssueFirebaseSession(this.auth, {
            role: 'admin',
            entityId: id,
            name: publicDoc.name,
            photo: publicDoc.avatar || ''
          }).catch(() => {});
        }
        return publicDoc;
      } catch (err) {}
    }
    return FirebaseDatabase.stripPin(mergedMem);
  }

  // ==========================================
  // --- Analytics & Reports ---
  // ==========================================
  async getAnalytics() {
    const [studentsObj, teachersList, eventsList, badgesList, deedsList] = await Promise.all([
      this.getAllStudents(),
      this.getAllTeachers(),
      this.getAllEvents(),
      this.getAllBadges(),
      this.getAllDeeds()
    ]);

    const students = Object.values(studentsObj);
    let totalAttendanceEntries = 0;
    let presentCount = 0;
    let totalCumulativeSum = 0;
    let totalMarksCount = 0;
    const gradeBreakdown = {};

    students.forEach(s => {
      const g = s.grade || '10 ශ්‍රේණිය';
      gradeBreakdown[g] = (gradeBreakdown[g] || 0) + 1;
      (s.attendance || []).forEach(a => {
        totalAttendanceEntries++;
        if (String(a.status).toLowerCase() === 'present') presentCount++;
      });
      (s.examMarks || []).forEach(m => {
        if (!isNaN(Number(m.marks))) {
          totalCumulativeSum += Number(m.marks);
          totalMarksCount++;
        }
      });
    });

    return {
      totalStudents: students.length,
      totalTeachers: teachersList.length,
      totalEvents: eventsList.length,
      totalBadges: badgesList.length,
      approvedBadges: badgesList.filter(b => b.status === 'approved').length,
      pendingBadges: badgesList.filter(b => b.status === 'pending').length,
      totalDeeds: deedsList.length,
      avgAttendance: totalAttendanceEntries > 0 ? Math.round((presentCount / totalAttendanceEntries) * 100) : 85,
      avgMarks: totalMarksCount > 0 ? Number((totalCumulativeSum / totalMarksCount).toFixed(1)) : 76.5,
      gradeBreakdown
    };
  }

  async getReports(type = 'attendance', grade = 'all') {
    const studentsObj = await this.getAllStudents();
    let students = Object.values(studentsObj);
    if (grade && grade !== 'all') {
      students = students.filter(s => s.grade && s.grade.includes(grade));
    }

    const rows = [];
    if (type === 'attendance') {
      students.forEach(s => {
        const att = s.attendance || [];
        const dhammaSessions = att.filter(a => a.type === 'dhamma_school');
        const silSessions = att.filter(a => a.type === 'sil_day');
        const presentDhamma = dhammaSessions.filter(a => String(a.status).toLowerCase() === 'present').length;
        const presentSil = silSessions.filter(a => String(a.status).toLowerCase() === 'present').length;
        const total = dhammaSessions.length + silSessions.length;
        const rate = total > 0 ? Math.round(((presentDhamma + presentSil) / total) * 100) : 0;
        rows.push({
          regNo: s.regNo,
          name: s.name,
          grade: s.grade,
          dhammaAttendance: `${presentDhamma} / ${dhammaSessions.length}`,
          silAttendance: `${presentSil} / ${silSessions.length}`,
          totalSessions: total,
          overallRate: `${rate}%`,
          status: rate >= 75 ? 'විශිෂ්ටයි' : (rate >= 50 ? 'සාමාන්‍යයි' : 'ප්‍රමාණවත් නොවේ')
        });
      });
    } else if (type === 'deeds') {
      const allDeeds = await this.getAllDeeds();
      students.forEach(s => {
        const studentDeeds = allDeeds.filter(d => d.regNo === s.regNo);
        rows.push({
          regNo: s.regNo,
          name: s.name,
          grade: s.grade,
          deedCount: studentDeeds.length,
          lastDeedDate: studentDeeds[0] ? studentDeeds[0].date : 'නැත',
          recentDeed: studentDeeds[0] ? (studentDeeds[0].title || studentDeeds[0].deed) : '-'
        });
      });
    } else if (type === 'achievements') {
      const allBadges = await this.getAllBadges();
      students.forEach(s => {
        const studentBadges = allBadges.filter(b => b.regNo === s.regNo && b.status === 'approved');
        const totalPoints = studentBadges.reduce((sum, b) => sum + (Number(b.points) || 50), 0);
        rows.push({
          regNo: s.regNo,
          name: s.name,
          grade: s.grade,
          badgeCount: studentBadges.length,
          totalPoints,
          recentBadge: studentBadges[0] ? studentBadges[0].badge : '-'
        });
      });
    } else if (type === 'examMarks') {
      students.forEach(s => {
        const marks = s.examMarks || [];
        const avg = marks.length > 0
          ? (marks.reduce((acc, m) => acc + (Number(m.marks) || 0), 0) / marks.length).toFixed(1)
          : '0.0';
        rows.push({
          regNo: s.regNo,
          name: s.name,
          grade: s.grade,
          subjectCount: marks.length,
          averageMarks: `${avg}%`,
          gradeResult: FirebaseDatabase.calculateDhammaGrade(avg)
        });
      });
    }
    return rows;
  }

  // ==========================================
  // --- Bulk Data Management ---
  // ==========================================
  async bulkImportStudents(studentsList) {
    if (!Array.isArray(studentsList) || studentsList.length === 0) {
      throw new Error('Students array is required and cannot be empty.');
    }
    const defaultHashedPin = hashPin('1234');
    let importedCount = 0;
    let updatedCount = 0;
    const errors = [];

    for (const [idx, s] of studentsList.entries()) {
      try {
        const regNo = String(s.regNo || s['ඇතුළත්වීමේ අංකය'] || '').trim();
        const name = String(s.name || s['නම'] || '').trim();
        if (!regNo || !name) {
          errors.push(`Row ${idx + 1}: regNo and name are required.`);
          continue;
        }

        const existing = await this.getStudent(regNo);
        const studentData = {
          regNo,
          name,
          englishName: String(s.englishName || s['ඉංග්‍රීසි නම'] || '').trim(),
          grade: String(s.grade || s['ශ්‍රේණිය'] || '10 ශ්‍රේණිය (Grade 10)').trim(),
          guardianName: String(s.guardianName || s['භාරකරුගේ නම'] || '').trim(),
          contact: String(s.contact || s['දුරකථන අංකය'] || '').trim(),
          address: String(s.address || s['ලිපිනය'] || '').trim(),
          dob: String(s.dob || s['උපන් දිනය'] || '').trim(),
          pin: defaultHashedPin
        };

        await this.saveStudent(studentData);
        if (existing) updatedCount++;
        else importedCount++;
      } catch (err) {
        errors.push(`Row ${idx + 1} (${s.regNo || 'unknown'}): ${err.message}`);
      }
    }

    return {
      success: true,
      imported: importedCount,
      importedCount,
      updatedCount,
      totalProcessed: studentsList.length,
      errors
    };
  }

  async bulkImportExamMarks(marksList) {
    if (!Array.isArray(marksList) || marksList.length === 0) {
      throw new Error('Marks array is required and cannot be empty.');
    }
    let successCount = 0;
    const errors = [];

    for (const [idx, m] of marksList.entries()) {
      try {
        const regNo = String(m.regNo || m['ඇතුළත්වීමේ අංකය'] || '').trim();
        const term = String(m.term || m['වාරය'] || '1').trim();
        const year = String(m.year || m['වර්ෂය'] || '2026').trim();
        const subject = String(m.subject || m['විෂයය'] || '').trim();
        const marks = Number(m.marks !== undefined ? m.marks : m['ලකුණු']);
        const remarks = String(m.remarks || m['සටහන්'] || '').trim();

        if (!regNo || !subject || isNaN(marks)) {
          errors.push(`Row ${idx + 1}: regNo, subject, and numeric marks are required.`);
          continue;
        }
        await this.saveStudentExamMark(regNo, { term, year, subject, marks, remarks });
        successCount++;
      } catch (err) {
        errors.push(`Row ${idx + 1} (${m.regNo || 'unknown'}): ${err.message}`);
      }
    }

    return {
      success: true,
      imported: successCount,
      successCount,
      totalProcessed: marksList.length,
      errors
    };
  }
}

const firebaseDbInstance = new FirebaseDatabase();
module.exports = firebaseDbInstance;
