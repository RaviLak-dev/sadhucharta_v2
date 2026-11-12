const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();
const http = require('http');
const fs = require('fs');
const url = require('url');
const { handleRoutes } = require('./routes');

const PORT = process.env.PORT || 5001;
const ROOT_DIR = path.resolve(__dirname, '..');
const F_END_DIR = path.resolve(ROOT_DIR, 'F_END');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function serveStaticFile(req, res) {
  let pathname = '/';
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch (e) {
    pathname = '/';
  }

  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const onboardingAliases = new Set([
    '/',
    '/index.html',
    '/index',
    '/OnBordingPage.html',
    '/Onboarding',
    '/F_END',
    '/F_END/index.html',
    '/Pages',
    '/Pages/index.html',
    '/F_END/Pages',
    '/F_END/Pages/index.html',
    '/F_END/Pages/OnBordingPage.html'
  ]);

  if (onboardingAliases.has(normalizedPath)) {
    pathname = '/F_END/Pages/OnboardingPage.html';
  }

  const relPath = pathname.replace(/^\/+/, '');
  const candidatePaths = [
    path.join(ROOT_DIR, relPath),
    path.join(F_END_DIR, relPath),
    path.join(F_END_DIR, 'Pages', relPath)
  ];

  if (!path.extname(relPath) && relPath) {
    candidatePaths.push(path.join(F_END_DIR, 'Pages', `${relPath}.html`));
  }

  const allowedPrefix = F_END_DIR + path.sep;
  let resolvedPath = null;
  for (const p of candidatePaths) {
    const normalized = path.normalize(p);
    if (normalized.startsWith(allowedPrefix) && fs.existsSync(normalized) && fs.statSync(normalized).isFile()) {
      resolvedPath = normalized;
      break;
    }
  }

  if (!resolvedPath) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end('<h1>404 Not Found</h1><p>Daham Pasala Portal - File not found.</p><p><a href="/">Return to Home</a></p>');
  }

  const ext = path.extname(resolvedPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(resolvedPath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('Internal Server Error reading static file');
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  // 1. Enable CORS for all origins (supports Live Server, file://, localhost, etc.)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');

  // 2. Preflight request handling
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // 3. Static frontend assets & pages serving (non-/api routes)
  let reqPath = '/';
  try {
    reqPath = new URL(req.url, 'http://localhost').pathname;
  } catch (e) {}

  if (!reqPath.startsWith('/api')) {
    if (req.method === 'GET' || req.method === 'HEAD') {
      return serveStaticFile(req, res);
    }
    res.writeHead(405, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }

  // 4. Collect request body for API calls
  let rawBody = '';
  req.on('data', chunk => {
    rawBody += chunk;
    // Prevent huge body attacks (15MB max for base64 photos)
    if (rawBody.length > 15 * 1024 * 1024) {
      res.writeHead(413, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Payload Too Large' }));
      req.destroy();
    }
  });

  req.on('end', () => {
    let body = {};
    if (rawBody.trim()) {
      try {
        body = JSON.parse(rawBody);
      } catch (err) {
        console.warn('Could not parse JSON body, treating as text');
        body = { raw: rawBody };
      }
    }

    (async () => {
      try {
        await handleRoutes(req, res, body);
      } catch (err) {
        console.error('Unhandled Server Error:', err);
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            success: false,
            error: 'Internal Server Error',
            message: err.message
          }));
        }
      }
    })();
  });
});

// Guard against unhandled errors and rejections to ensure 24/7 uptime
process.on('uncaughtException', (err) => {
  console.error('🚨 Uncaught Exception:', err.message || err);
});

process.on('unhandledRejection', (reason) => {
  console.error('🚨 Unhandled Rejection:', (reason && reason.message) || reason);
});

server.on('error', (err) => {
  console.error('🚨 Server listen error:', err.message);
});

if (require.main === module) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`  ☸️  Daham Pasala Sadhu Charya Backend Server Online`);
    console.log(`  📡  Listening on: http://localhost:${PORT}`);
    console.log(`  🩺  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });

  // Handle graceful termination
  process.on('SIGTERM', () => {
    console.log('Stopping Daham Pasala backend server...');
    server.close(() => process.exit(0));
  });

  process.on('SIGINT', () => {
    console.log('Received SIGINT. Stopping server...');
    server.close(() => process.exit(0));
  });
}

server.PORT = PORT;
module.exports = server;

