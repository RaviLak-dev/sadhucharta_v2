const http = require('http');
const { handleRoutes } = require('./routes');
const EventEmitter = require('events');

const PORT = 5001;
const BASE_URL = `http://localhost:${PORT}`;
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve) => {
    const req = new EventEmitter();
    req.method = method;
    req.url = path;
    req.headers = { 'content-type': 'application/json' };

    let statusCode = 200;
    let headers = {};
    let responseData = '';

    const res = {
      writeHead: (code, hdrs) => {
        statusCode = code;
        if (hdrs) Object.assign(headers, hdrs);
      },
      setHeader: (k, v) => {
        headers[k] = v;
      },
      end: (dataChunk) => {
        if (dataChunk) responseData += dataChunk;
        let parsed = responseData;
        try {
          parsed = JSON.parse(responseData);
        } catch (e) {}
        resolve({ status: statusCode, headers, data: parsed });
      }
    };

    Promise.resolve(handleRoutes(req, res, data)).catch(err => {
      resolve({ status: 500, headers: {}, data: { error: err.message } });
    });
  });
}


async function runTests() {
  console.log('--- Starting Daham Pasala Backend Test Suite ---');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health
    const health = await makeRequest('/api/health');
    assert(health.status === 200 && health.data.status === 'ok', 'GET /api/health responds with 200 OK');

    // 2. Auth Student
    const studentLogin = await makeRequest('/api/auth/login', 'POST', {
      role: 'student',
      username: 'DPS/2026/104',
      pin: '1234'
    });
    assert(studentLogin.status === 200 && studentLogin.data.success === true, 'Student authentication succeeds');

    // 3. Auth Teacher
    const teacherLogin = await makeRequest('/api/auth/login', 'POST', {
      role: 'teacher',
      username: 'TCH/2026/01',
      pin: '1234'
    });
    assert(teacherLogin.status === 200 && teacherLogin.data.success === true, 'Teacher authentication succeeds');

    // 4. Auth Admin
    const adminLogin = await makeRequest('/api/auth/login', 'POST', {
      role: 'admin',
      username: 'PRIN/2026/01',
      pin: '1234'
    });
    assert(adminLogin.status === 200 && adminLogin.data.success === true, 'Admin authentication succeeds');

    // 5. GET Students
    const studentsRes = await makeRequest('/api/students');
    assert(studentsRes.status === 200 && studentsRes.data.data['DPS/2026/104'], 'GET /api/students returns student records');

    // 6. POST Student
    const newStudentRes = await makeRequest('/api/students', 'POST', {
      regNo: 'DPS/2026/999',
      name: 'ටෙස්ට් සිසුවා (Test Student)',
      englishName: 'Test Student',
      grade: '10 ශ්‍රේණිය (Grade 10)',
      pin: '1234',
      contact: '077 000 0000',
      address: 'කොළඹ',
      attendance: []
    });
    assert(newStudentRes.status === 201 && newStudentRes.data.data.regNo === 'DPS/2026/999', 'POST /api/students adds student');

    // 7. GET Single Student
    const singleStudent = await makeRequest('/api/students/DPS%2F2026%2F999');
    assert(singleStudent.status === 200 && singleStudent.data.data.name.includes('Test'), 'GET /api/students/:regNo finds newly created student');

    // 8. DELETE Student
    const deleteStudentRes = await makeRequest('/api/students/DPS%2F2026%2F999', 'DELETE');
    assert(deleteStudentRes.status === 200 && deleteStudentRes.data.success === true, 'DELETE /api/students/:regNo removes student');

    // 9. GET Teachers
    const teachersRes = await makeRequest('/api/teachers');
    assert(teachersRes.status === 200 && teachersRes.data.data.length >= 3, 'GET /api/teachers returns teacher list');

    // 10. GET Badges
    const badgesRes = await makeRequest('/api/badges');
    assert(badgesRes.status === 200 && badgesRes.data.data.length >= 3, 'GET /api/badges returns badge list');

    // 11. Nominate Badge
    const newBadgeRes = await makeRequest('/api/badges/nominate', 'POST', {
      studentName: 'සමන් කුමාර පෙරේරා',
      regNo: 'DPS/2026/104',
      grade: '10 ශ්‍රේණිය',
      badge: 'විශිෂ්ට නායකත්ව සම්මානය',
      points: 50,
      teacher: 'ධර්මසේන අමරසිංහ මයා',
      remarks: 'නියමු පරීක්ෂණය'
    });
    assert(newBadgeRes.status === 201 && newBadgeRes.data.data.status === 'pending', 'POST /api/badges/nominate creates pending badge');

    // 12. Approve Badge
    const badgeId = newBadgeRes.data.data.id;
    const approveBadgeRes = await makeRequest(`/api/badges/${badgeId}/status`, 'PUT', { status: 'approved' });
    assert(approveBadgeRes.status === 200 && approveBadgeRes.data.data.status === 'approved', 'PUT /api/badges/:id/status approves badge');

    // 13. GET Events
    const eventsRes = await makeRequest('/api/events');
    assert(eventsRes.status === 200 && eventsRes.data.data.length >= 3, 'GET /api/events returns event list');

    // 14. GET Materials
    const materialsRes = await makeRequest('/api/materials');
    assert(materialsRes.status === 200 && materialsRes.data.data.length >= 3, 'GET /api/materials returns study materials');

    // 15. GET Announcements
    const annRes = await makeRequest('/api/announcements');
    assert(annRes.status === 200 && annRes.data.data.length >= 2, 'GET /api/announcements returns announcements');

    // 16. GET Analytics
    const analyticsRes = await makeRequest('/api/analytics');
    assert(analyticsRes.status === 200 && analyticsRes.data.data.totalStudents >= 5, 'GET /api/analytics returns accurate statistics');

    // 17. GET Reports
    const reportRes = await makeRequest('/api/reports?type=attendance');
    assert(reportRes.status === 200 && reportRes.data.data.length >= 5, 'GET /api/reports?type=attendance returns report rows');

  } catch (err) {
    console.error('Test Suite Error:', err);
    failed++;
  }

  console.log(`\n=======================================================`);
  console.log(`  Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`=======================================================`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

// Start server in-process if not already running, then test
const server = require('./server');
setTimeout(runTests, 500);
runTests();

