const path = require('path');

try {
  const dotenv = require('dotenv');
  dotenv.config({ path: path.resolve(__dirname, '../B_END/.env') });
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  dotenv.config();
} catch (_) {
  // On Vercel, environment variables are already injected into process.env
}

const { handleRoutes } = require('../B_END/routes');

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');
}

function parseRawBody(raw) {
  if (!raw || !raw.trim()) return {};
  try {
    return JSON.parse(raw);
  } catch (err) {
    return { raw };
  }
}

function readRequestBody(req) {
  if (req.body !== undefined) {
    if (Buffer.isBuffer(req.body)) {
      return Promise.resolve(parseRawBody(req.body.toString('utf8')));
    }
    if (typeof req.body === 'string') {
      return Promise.resolve(parseRawBody(req.body));
    }
    if (typeof req.body === 'object' && req.body !== null) {
      return Promise.resolve(req.body);
    }
    return Promise.resolve({});
  }

  if (req.method === 'GET' || req.method === 'HEAD' || req.readableEnded) {
    return Promise.resolve({});
  }

  return new Promise((resolve, reject) => {
    let rawBody = '';
    let aborted = false;

    req.on('data', (chunk) => {
      if (aborted) return;
      rawBody += chunk;
      if (rawBody.length > 15 * 1024 * 1024) {
        aborted = true;
        const err = new Error('Payload Too Large');
        err.statusCode = 413;
        reject(err);
      }
    });

    req.on('end', () => {
      if (!aborted) {
        resolve(parseRawBody(rawBody));
      }
    });

    req.on('error', (err) => {
      if (!aborted) reject(err);
    });
  });
}

function normalizeRequestUrl(req) {
  const parsed = new URL(req.url || '/api', 'http://localhost');
  const vercelPath = parsed.searchParams.get('__vercel_path');

  if (vercelPath !== null) {
    parsed.searchParams.delete('__vercel_path');
    const cleanSubPath = String(vercelPath).replace(/^\/+/, '');
    const qs = parsed.searchParams.toString();
    req.url = `/api${cleanSubPath ? `/${cleanSubPath}` : ''}${qs ? `?${qs}` : ''}`;
    return;
  }

  if (parsed.pathname === '/api' || parsed.pathname === '/api/') {
    const headerUri = req.headers['x-vercel-original-url'] || req.headers['x-forwarded-uri'];
    if (headerUri && String(headerUri).startsWith('/api/')) {
      req.url = String(headerUri);
    }
  }
}

module.exports = async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  try {
    normalizeRequestUrl(req);
    const body = await readRequestBody(req);
    await handleRoutes(req, res, body);
  } catch (err) {
    console.error('Vercel API Error:', err);
    if (!res.headersSent) {
      const status = err.statusCode || 500;
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: false,
        error: status === 413 ? 'Payload Too Large' : 'Internal Server Error',
        message: err.message
      }));
    }
  }
};
