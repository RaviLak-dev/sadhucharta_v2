const { handleRoutes } = require('./routes');
const EventEmitter = require('events');

function testEndpoint(method, url, body = null) {
  return new Promise((resolve) => {
    const req = new EventEmitter();
    req.method = method;
    req.url = url;
    req.headers = {};

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
      end: (data) => {
        if (data) responseData += data;
        let parsed = responseData;
        try {
          parsed = JSON.parse(responseData);
        } catch (e) {}
        resolve({ status: statusCode, headers, data: parsed });
      }
    };

    Promise.resolve(handleRoutes(req, res, body)).catch(err => {
      resolve({ status: 500, headers: {}, data: { error: err.message } });
    });
  });
}

async function runDirectTests() {
  console.log('--- Running Direct In-Process API Route Tests ---');
  let passed = 0;
  let failed = 0;

  const db = require('./db');
  if (typeof db.ensureReady === 'function') {
    await db.ensureReady();
  }

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Health
  const health = await testEndpoint('GET', '/api/health');
  assert(health.status === 200 && health.data.status === 'ok', 'GET /api/health responds with 200 OK');

  // 2. Auth Student
  const studentLogin = await testEndpoint('POST', '/api/auth/login', {
    role: 'student',
    username: 'DPS/2026/104',
    pin: '1234'
  });
  assert(studentLogin.status === 200 && studentLogin.data.success === true, 'Student authentication succeeds');

  // 3. Auth Teacher
  const teacherLogin = await testEndpoint('POST', '/api/auth/login', {
    role: 'teacher',
    username: 'TCH/2026/01',
    pin: '1234'
  });
  assert(teacherLogin.status === 200 && teacherLogin.data.success === true, 'Teacher authentication succeeds');

  // 4. Auth Admin
  const adminLogin = await testEndpoint('POST', '/api/auth/login', {
    role: 'admin',
    username: 'PRIN/2026/01',
    pin: '1234'
  });
  assert(adminLogin.status === 200 && adminLogin.data.success === true, 'Admin authentication succeeds');

  // 5. GET Students
  const studentsRes = await testEndpoint('GET', '/api/students');
  assert(studentsRes.status === 200 && studentsRes.data.data['DPS/2026/104'], 'GET /api/students returns student records');

  // 6. POST Student
  const newStudentRes = await testEndpoint('POST', '/api/students', {
    regNo: 'DPS/2026/999',
    name: 'ටෙස්ට් සිසුවා (Test Student)',
    englishName: 'Test Student',
    grade: '10 ශ්‍රේණිය (Grade 10)',
    pin: '1234',
    contact: '077 000 0000',
    address: 'කොළඹ'
  });
  assert(newStudentRes.status === 201 && newStudentRes.data.data.regNo === 'DPS/2026/999', 'POST /api/students creates student');

  // 7. GET Single Student
  const singleStudent = await testEndpoint('GET', '/api/students/DPS%2F2026%2F999');
  assert(singleStudent.status === 200 && singleStudent.data.data.name.includes('Test'), 'GET /api/students/:regNo finds newly created student');

  // 8. DELETE Student
  const deleteStudentRes = await testEndpoint('DELETE', '/api/students/DPS%2F2026%2F999');
  assert(deleteStudentRes.status === 200 && deleteStudentRes.data.success === true, 'DELETE /api/students/:regNo removes student');

  // 9. GET Teachers
  const teachersRes = await testEndpoint('GET', '/api/teachers');
  assert(teachersRes.status === 200 && teachersRes.data.data.length >= 3, 'GET /api/teachers returns teacher list');

  // 10. GET Badges
  const badgesRes = await testEndpoint('GET', '/api/badges');
  assert(badgesRes.status === 200 && badgesRes.data.data.length >= 3, 'GET /api/badges returns badge list');

  // 11. Nominate Badge
  const newBadgeRes = await testEndpoint('POST', '/api/badges/nominate', {
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
  const approveBadgeRes = await testEndpoint('PUT', `/api/badges/${badgeId}/status`, { status: 'approved' });
  assert(approveBadgeRes.status === 200 && approveBadgeRes.data.data.status === 'approved', 'PUT /api/badges/:id/status approves badge');

  // 13. GET Events
  const eventsRes = await testEndpoint('GET', '/api/events');
  assert(eventsRes.status === 200 && eventsRes.data.data.length >= 3, 'GET /api/events returns event list');

  // 14. GET Materials
  const materialsRes = await testEndpoint('GET', '/api/materials');
  assert(materialsRes.status === 200 && materialsRes.data.data.length >= 3, 'GET /api/materials returns study materials');

  // 15. Announcements CRUD & Audience Selective Visibility
  const annRes = await testEndpoint('GET', '/api/announcements');
  assert(annRes.status === 200 && Array.isArray(annRes.data.data), 'GET /api/announcements returns announcements list');

  const testTeacherAnnId = 'test-ann-teacher-' + Date.now();
  const testStudentAnnId = 'test-ann-student-' + Date.now();
  const testAllAnnId = 'test-ann-all-' + Date.now();

  // Create Teacher-only announcement
  const createTeacherAnn = await testEndpoint('POST', '/api/announcements', {
    id: testTeacherAnnId,
    title: 'ආචාර්ය මණ්ඩල විශේෂ සාකච්ඡාව',
    audience: 'teachers',
    audienceLabel: 'ආචාර්ය මණ්ඩලය පමණක් (Teachers Only)',
    urgency: 'important',
    body: 'හෙට දින පැවැත්වෙන ගුරු මණ්ඩල රැස්වීමට සියලු ආචාර්යවරුන් සහභාගි වන්න.',
    date: '2026-06-01',
    author: 'ප්‍රධානාචාර්ය කාර්යාලය'
  });
  assert(createTeacherAnn.status === 201, 'POST /api/announcements creates teacher-only notice');

  // Create Student-only announcement
  const createStudentAnn = await testEndpoint('POST', '/api/announcements', {
    id: testStudentAnnId,
    title: 'ශිෂ්‍ය බුද්ධ ධර්ම රචනා තරගාවලිය',
    audience: 'students',
    audienceLabel: 'ශිෂ්‍යයන් පමණක් (Students Only)',
    urgency: 'normal',
    body: 'සියලුම සිසුන් තම රචනා ලබන ඉරිදාට පෙර භාරදිය යුතුය.',
    date: '2026-06-01',
    author: 'ප්‍රධානාචාර්ය කාර්යාලය'
  });
  assert(createStudentAnn.status === 201, 'POST /api/announcements creates student-only notice');

  // Create All announcement
  const createAllAnn = await testEndpoint('POST', '/api/announcements', {
    id: testAllAnnId,
    title: 'වාර්ෂික මහා පිංකම් මාලාව',
    audience: 'all',
    audienceLabel: 'සියලු දෙනා වෙත (All)',
    urgency: 'urgent',
    body: 'දහම් පාසල් ප්‍රජාවගේම සහභාගිත්වයෙන් පැවැත්වෙන පිංකම.',
    date: '2026-06-01',
    author: 'ප්‍රධානාචාර්ය කාර්යාලය'
  });
  assert(createAllAnn.status === 201, 'POST /api/announcements creates all-audience notice');

  // Verify Teacher Portal audience query
  const teacherAudienceRes = await testEndpoint('GET', '/api/announcements?audience=teachers');
  const teacherAnnList = teacherAudienceRes.data.data;
  const teacherSeesTeacherNotice = teacherAnnList.some(a => a.id === testTeacherAnnId);
  const teacherSeesAllNotice = teacherAnnList.some(a => a.id === testAllAnnId);
  const teacherSeesStudentNotice = teacherAnnList.some(a => a.id === testStudentAnnId);
  assert(teacherSeesTeacherNotice && teacherSeesAllNotice && !teacherSeesStudentNotice, 
    'GET /api/announcements?audience=teachers shows teacher & all notices, but strictly hides student notices');

  // Verify Student Portal audience query
  const studentAudienceRes = await testEndpoint('GET', '/api/announcements?audience=students');
  const studentAnnList = studentAudienceRes.data.data;
  const studentSeesStudentNotice = studentAnnList.some(a => a.id === testStudentAnnId);
  const studentSeesAllNotice = studentAnnList.some(a => a.id === testAllAnnId);
  const studentSeesTeacherNotice = studentAnnList.some(a => a.id === testTeacherAnnId);
  assert(studentSeesStudentNotice && studentSeesAllNotice && !studentSeesTeacherNotice, 
    'GET /api/announcements?audience=students shows student & all notices, but strictly hides teacher notices');

  // Clean up test announcements
  await testEndpoint('DELETE', `/api/announcements/${testTeacherAnnId}`);
  await testEndpoint('DELETE', `/api/announcements/${testStudentAnnId}`);
  await testEndpoint('DELETE', `/api/announcements/${testAllAnnId}`);

  // 16. GET Analytics
  const analyticsRes = await testEndpoint('GET', '/api/analytics');
  assert(analyticsRes.status === 200 && analyticsRes.data.data.totalStudents >= 5, 'GET /api/analytics returns accurate statistics');

  // 17. GET Reports
  const reportRes = await testEndpoint('GET', '/api/reports?type=attendance');
  assert(reportRes.status === 200 && reportRes.data.data.length >= 5, 'GET /api/reports?type=attendance returns report rows');

  // 18. POST Attendance (Dhamma School)
  const attSundayRes = await testEndpoint('POST', '/api/attendance', {
    date: '2026-06-07',
    type: 'dhamma_school',
    category: 'දහම් පාසල් ඉරිදා පැමිණීම',
    grade: '10 ශ්‍රේණිය (Grade 10)',
    teacherId: 'TCH/2026/01',
    teacherName: 'ධර්මසේන අමරසිංහ මයා',
    records: [
      { regNo: 'DPS/2026/104', status: 'present', remarks: 'වේලාවට පැමිණියා' },
      { regNo: 'DPS/2026/105', status: 'absent', remarks: 'නොපැමිණි' }
    ]
  });
  assert(attSundayRes.status === 201 && attSundayRes.data.success === true, 'POST /api/attendance records Sunday session');

  // 19. POST Attendance (Sil Day)
  const attSilRes = await testEndpoint('POST', '/api/attendance', {
    date: '2026-06-28',
    type: 'sil_day',
    category: 'පෝහෝ දින අටසිල් සමාදානය',
    grade: '10 ශ්‍රේණිය (Grade 10)',
    teacherId: 'TCH/2026/01',
    teacherName: 'ධර්මසේන අමරසිංහ මයා',
    records: [
      { regNo: 'DPS/2026/104', status: 'present', remarks: 'අටසිල් සමාදන් විය' }
    ]
  });
  assert(attSilRes.status === 201 && attSilRes.data.success === true, 'POST /api/attendance records Sil Day session');

  // 20. Verify student record has updated attendance in MongoDB
  const studentCheck = await testEndpoint('GET', '/api/students/DPS%2F2026%2F104');
  const studentAtt = studentCheck.data.data.attendance || [];
  const foundSunday = studentAtt.some(a => a.date === '2026-06-07' && a.status === 'present');
  const foundSil = studentAtt.some(a => a.date === '2026-06-28' && a.type === 'sil_day');
  assert(foundSunday && foundSil, 'Student attendance subdocuments in MongoDB accurately updated');

  // 21. POST Term 1 Exam Marks
  const t1Res = await testEndpoint('POST', '/api/students/DPS%2F2026%2F104/exams', {
    term: '1',
    year: '2026',
    subject: 'බුද්ධ ධර්මය',
    marks: 88,
    remarks: 'පළමු වාරයේ විශිෂ්ට දක්ෂතාවයක්'
  });
  assert(t1Res.status === 201 && t1Res.data.success, 'POST /api/students/:regNo/exams records Term 1 mark');

  // 22. POST Term 2 Exam Marks
  const t2Res = await testEndpoint('POST', '/api/students/DPS%2F2026%2F104/exams', {
    term: '2',
    year: '2026',
    subject: 'බුද්ධ ධර්මය',
    marks: 92,
    remarks: 'දෙවන වාරයේ ලකුණු ඉහළ යාමක්'
  });
  assert(t2Res.status === 201 && t2Res.data.success, 'POST /api/students/:regNo/exams records Term 2 mark');

  // 23. POST Term 3 Exam Marks
  const t3Res = await testEndpoint('POST', '/api/students/DPS%2F2026%2F104/exams', {
    term: '3',
    year: '2026',
    subject: 'බුද්ධ ධර්මය',
    marks: 95,
    remarks: 'අවසාන වාරයේ විශිෂ්ටතම සාමාර්ථයක්'
  });
  assert(t3Res.status === 201 && t3Res.data.success, 'POST /api/students/:regNo/exams records Term 3 mark');

  // 24. GET Exam Marks with Term Filter
  const t1QueryRes = await testEndpoint('GET', '/api/students/DPS%2F2026%2F104/exams?term=1');
  const t2QueryRes = await testEndpoint('GET', '/api/students/DPS%2F2026%2F104/exams?term=2');
  const t3QueryRes = await testEndpoint('GET', '/api/students/DPS%2F2026%2F104/exams?term=3');
  assert(
    t1QueryRes.data.data.every(m => String(m.term || '1') === '1') &&
    t2QueryRes.data.data.every(m => String(m.term || '1') === '2') &&
    t3QueryRes.data.data.every(m => String(m.term || '1') === '3'),
    'GET /api/students/:regNo/exams?term=X filters accurately by examination term'
  );

  // 25. Verify Student Profile has 3-term marks stored in MongoDB
  const studentFullExams = await testEndpoint('GET', '/api/students/DPS%2F2026%2F104');
  const allMarks = studentFullExams.data.data.examMarks || [];
  const hasT1 = allMarks.some(m => String(m.term || '1') === '1' && m.subject === 'බුද්ධ ධර්මය');
  const hasT2 = allMarks.some(m => String(m.term || '1') === '2' && m.subject === 'බුද්ධ ධර්මය');
  const hasT3 = allMarks.some(m => String(m.term || '1') === '3' && m.subject === 'බුද්ධ ධර්මය');
  assert(hasT1 && hasT2 && hasT3, 'Student has Term 1, Term 2, and Term 3 examination marks securely stored in MongoDB');

  // 26. POST General Good Deed (Temple Cleaning)
  const cleanDeedId = 'test-clean-' + Date.now();
  const cleanDeedRes = await testEndpoint('POST', '/api/deeds', {
    id: cleanDeedId,
    studentName: 'සමන් කුමාර',
    regNo: 'DPS/2026/104',
    title: 'විහාර මළුව සහ බෝධිය පිරිසිදු කිරීම',
    category: 'ආගමික වතාවත්',
    date: '2026-06-08',
    score: 10,
    remarks: 'පූජනීය විහාර පරිශ්‍රය හා මළුව ශ්‍රමදානයෙන් පිරිසිදු කර දායක විය.'
  });
  assert(cleanDeedRes.status === 201 && cleanDeedRes.data.success, 'POST /api/deeds records temple cleaning good deed with 10 marks');

  // 27. GET Deeds Query by Student regNo
  const deedsQueryRes = await testEndpoint('GET', '/api/deeds?regNo=DPS%2F2026%2F104');
  const foundCleanDeed = deedsQueryRes.data.data.some(d => d.id === cleanDeedId && d.score === 10);
  assert(foundCleanDeed, 'GET /api/deeds?regNo=... returns student good deeds');

  // 28. Verify Student Attendance Subdocument updated with general good deed
  const studentDeedsCheck = await testEndpoint('GET', '/api/students/DPS%2F2026%2F104');
  const studentAttArray = studentDeedsCheck.data.data.attendance || [];
  const foundInStudentAtt = studentAttArray.find(a => a.event && a.event.includes('පිරිසිදු කිරීම'));
  assert(
    Boolean(foundInStudentAtt && foundInStudentAtt.score === 10 && foundInStudentAtt.status === 'present'),
    'Student attendance subdocument in MongoDB reflects good deed with score 10'
  );

  // 29. POST Social Care Good Deed
  const socialDeedId = 'test-social-' + Date.now();
  const socialDeedRes = await testEndpoint('POST', '/api/deeds', {
    id: socialDeedId,
    studentName: 'සමන් කුමාර',
    regNo: 'DPS/2026/104',
    title: 'වැඩිහිටි සහ ගිලාන උපස්ථානය',
    category: 'සමාජ සත්කාරක',
    date: '2026-06-09',
    score: 10,
    remarks: 'වැඩිහිටියන්ට කාරුණිකව සැලකීම.'
  });
  assert(socialDeedRes.status === 201 && socialDeedRes.data.success, 'POST /api/deeds records social care good deed');

  // 30. DELETE Deed removes and cleans up
  const deleteDeedRes = await testEndpoint('DELETE', `/api/deeds/${socialDeedId}`);
  assert(deleteDeedRes.status === 200, 'DELETE /api/deeds/:id removes deed successfully');

  // 31. POST Attendance with broughtFlowers: true (in Attendance System)
  const testAttDate = '2026-07-19';
  const attFlowerSessionRes = await testEndpoint('POST', '/api/attendance', {
    date: testAttDate,
    type: 'dhamma_school',
    category: 'දහම් පාසල් ඉරිදා පැමිණීම',
    grade: '10 ශ්‍රේණිය (Grade 10)',
    teacherId: 'TCH/2026/01',
    teacherName: 'ධර්මසේන අමරසිංහ මයා',
    records: [
      { regNo: 'DPS/2026/104', status: 'present', broughtFlowers: true, flowerScore: 10, remarks: 'නියමිත වේලාවට පැමිණියා' },
      { regNo: 'DPS/2026/105', status: 'present', broughtFlowers: false, remarks: 'නියමිත වේලාවට පැමිණියා' }
    ]
  });
  assert(attFlowerSessionRes.status === 201 && attFlowerSessionRes.data.success, 'POST /api/attendance saves session with broughtFlowers flag');

  // 32. Verify Student attendance in MongoDB Atlas has broughtFlowers: true
  const studentAttCheck = await testEndpoint('GET', '/api/students/DPS%2F2026%2F104');
  const studentAttList = studentAttCheck.data.data.attendance || [];
  const foundFlowerAtt = studentAttList.find(a => a.date === testAttDate);
  assert(
    Boolean(foundFlowerAtt && foundFlowerAtt.broughtFlowers === true && foundFlowerAtt.remarks.includes('මල්')),
    'Student attendance subdocument stores broughtFlowers: true and flower remarks'
  );

  // 33. Verify Attendance system keeps flower offering strictly within Attendance (not registered as a separate Deed)
  const deedsAfterAtt = await testEndpoint('GET', '/api/deeds?regNo=DPS%2F2026%2F104');
  const hasSeparateFlowerDeed = deedsAfterAtt.data.data.some(d => d.date === testAttDate && d.title.includes('මල්'));
  assert(!hasSeparateFlowerDeed, 'Flower offering is maintained strictly within Attendance and not created as a separate Deed');

  // 34. Database Relations: GET /api/students/:regNo returns populated relations & rankInfo
  const studentRelRes = await testEndpoint('GET', '/api/students/DPS%2F2026%2F104');
  assert(
    Boolean(studentRelRes.status === 200 && Array.isArray(studentRelRes.data.data.approvedBadges) && Array.isArray(studentRelRes.data.data.deeds)),
    'GET /api/students/:regNo returns populated relations (approvedBadges, deeds, observations)'
  );

  // 35. Pinpoint Class Rankings API: GET /api/grades/:grade/rankings
  const gradeRankingsRes = await testEndpoint('GET', '/api/grades/10%20%E0%B7%81%E0%B7%8A%E2%80%8D%E0%B6%BB%E0%B7%9A%E0%B6%AB%E0%B7%92%E0%B6%BA/rankings');
  assert(
    Boolean(gradeRankingsRes.status === 200 && gradeRankingsRes.data.success && Array.isArray(gradeRankingsRes.data.data.students)),
    'GET /api/grades/:grade/rankings returns pinpoint class rankings and student matrix'
  );
  if (gradeRankingsRes.data.data.students.length > 0) {
    const firstStudent = gradeRankingsRes.data.data.students[0];
    assert(
      firstStudent.rank === 1 && typeof firstStudent.cumulativeAverage === 'number',
      `Rank 1 assigned to top student (${firstStudent.name}) with cumulative avg ${firstStudent.cumulativeAverage}%`
    );
  }

  // 36. Exam Reports API: dynamic marks calculation (no hardcoded mock data)
  const reportExamRes = await testEndpoint('GET', '/api/reports?type=exams');
  assert(
    Boolean(reportExamRes.status === 200 && Array.isArray(reportExamRes.data.data)),
    'GET /api/reports?type=exams returns calculated student exam summaries'
  );

  // 37. Marking Scale Cutoffs: Verify strict Sri Lankan Dhamma school boundary accuracy
  const dbModule = require('./db-mongo');
  assert(dbModule.constructor.calculateDhammaGrade(100) === 'A', '100 marks -> A');
  assert(dbModule.constructor.calculateDhammaGrade(75) === 'A', '75 marks -> A');
  assert(dbModule.constructor.calculateDhammaGrade(74) === 'B', '74 marks -> B');
  assert(dbModule.constructor.calculateDhammaGrade(65) === 'B', '65 marks -> B');
  assert(dbModule.constructor.calculateDhammaGrade(64) === 'C', '64 marks -> C');
  assert(dbModule.constructor.calculateDhammaGrade(50) === 'C', '50 marks -> C');
  assert(dbModule.constructor.calculateDhammaGrade(49) === 'S', '49 marks -> S');
  assert(dbModule.constructor.calculateDhammaGrade(35) === 'S', '35 marks -> S');
  assert(dbModule.constructor.calculateDhammaGrade(34) === 'W', '34 marks -> W');
  assert(dbModule.constructor.calculateDhammaGrade(0) === 'W', '0 marks -> W');

  // 38. Mark Validation: Reject out-of-range marks (> 100 or < 0)
  const invalidMarkRes = await testEndpoint('POST', '/api/students/DPS%2F2026%2F104/exams', {
    term: '1',
    subject: 'බුද්ධ ධර්මය',
    marks: 120
  });
  assert(invalidMarkRes.status === 400, 'POST exam mark with marks > 100 correctly rejected with 400');

  // 39. Referential Integrity & Cascading Deletion
  const tempRegNo = 'DPS/2026/CASCADE_TEST';
  await testEndpoint('POST', '/api/students', {
    regNo: tempRegNo,
    name: 'කැස්කේඩ් පිරික්සුම් සිසුවා',
    grade: '10 ශ්‍රේණිය'
  });
  await testEndpoint('POST', '/api/badges/nominate', {
    id: 'badge-cascade-test',
    regNo: tempRegNo,
    studentName: 'කැස්කේඩ් සිසුවා',
    grade: '10 ශ්‍රේණිය',
    badge: 'පිරිසිදුකම පිළිබඳ පදක්කම'
  });
  await testEndpoint('POST', '/api/deeds', {
    id: 'deed-cascade-test',
    regNo: tempRegNo,
    studentName: 'කැස්කේඩ් සිසුවා',
    title: 'මළුව අමදින ලදී',
    score: 10
  });
  await testEndpoint('POST', '/api/observations', {
    id: 'obs-cascade-test',
    regNo: tempRegNo,
    studentName: 'කැස්කේඩ් සිසුවා',
    grade: '10 ශ්‍රේණිය',
    category: 'විනය',
    rating: 'විශිෂ්ටයි'
  });

  // Now delete student and verify all associated sub-records cascade-delete
  const deleteTempStudent = await testEndpoint('DELETE', `/api/students/${encodeURIComponent(tempRegNo)}`);
  assert(deleteTempStudent.status === 200, 'DELETE /api/students/:regNo succeeds');

  const checkBadgeOrphan = await testEndpoint('GET', `/api/badges?regNo=${encodeURIComponent(tempRegNo)}`);
  const checkDeedOrphan = await testEndpoint('GET', `/api/deeds?regNo=${encodeURIComponent(tempRegNo)}`);
  const checkObsOrphan = await testEndpoint('GET', `/api/observations?regNo=${encodeURIComponent(tempRegNo)}`);
  assert(
    checkBadgeOrphan.data.data.length === 0 && checkDeedOrphan.data.data.length === 0 && checkObsOrphan.data.data.length === 0,
    'Cascading delete successfully purges all orphaned Badges, Deeds, and Observations'
  );

  // 40. Security: scrypt PIN Hashing & Verification
  const authModule = require('./auth');
  const samplePin = 'Daham2026';
  const hashedPin = authModule.hashPin(samplePin);
  assert(hashedPin.startsWith('scrypt:') && hashedPin.split(':').length === 3, 'auth.hashPin produces salt:hash format');
  assert(authModule.verifyPin(samplePin, hashedPin), 'auth.verifyPin returns true for matching PIN and hash');
  assert(!authModule.verifyPin('WrongPin', hashedPin), 'auth.verifyPin returns false for wrong PIN');
  assert(authModule.verifyPin('1234', '1234'), 'auth.verifyPin transparently verifies plain text legacy PIN');
  assert(authModule.isLegacyPlainText('1234'), 'auth.isLegacyPlainText correctly identifies plain text PIN');
  assert(!authModule.isLegacyPlainText(hashedPin), 'auth.isLegacyPlainText correctly identifies scrypt hashed PIN');

  // 41. Security: RFC 7519 JWT Token Generation & Verification
  const tokenPayload = { role: 'teacher', username: 'TCH/2026/01', name: 'ධර්මසේන අමරසිංහ' };
  const token = authModule.generateToken(tokenPayload);
  assert(typeof token === 'string' && token.split('.').length === 3, 'auth.generateToken produces standard 3-segment JWT');
  const decodedPayload = authModule.verifyToken(token);
  assert(decodedPayload && decodedPayload.username === 'TCH/2026/01' && decodedPayload.role === 'teacher', 'auth.verifyToken verifies signature and decodes claims');
  const tamperedToken = token.slice(0, -5) + 'xxxxx';
  assert(authModule.verifyToken(tamperedToken) === null, 'auth.verifyToken rejects tampered token');

  // 42. Auth: Zero-Disruption Login & JWT Issuance with Auto-Upgrade
  const loginRes = await testEndpoint('POST', '/api/auth/login', {
    role: 'student',
    username: 'DPS/2026/104',
    pin: '1234'
  });
  assert(loginRes.status === 200 && Boolean(loginRes.data.token), 'Login issues valid JWT token');
  const decodedLoginToken = await authModule.verifyAnyToken(loginRes.data.token, db.firebaseAuth || null);
  assert(decodedLoginToken && decodedLoginToken.username === 'DPS/2026/104', 'Login token has correct student username claim');

  // Verify PIN was migrated to scrypt in MongoDB
  const studentDocAfterLogin = await db.getStudent('DPS/2026/104');
  assert(studentDocAfterLogin.pin.startsWith('scrypt:'), 'Student PIN automatically upgraded to scrypt hash on successful login');

  // 43. Excel Export: GET /api/students/export with UTF-8 BOM
  const exportStudentsRes = await testEndpoint('GET', '/api/students/export');
  assert(exportStudentsRes.status === 200, 'GET /api/students/export returns 200');
  assert(exportStudentsRes.headers['Content-Type'] && exportStudentsRes.headers['Content-Type'].includes('text/csv'), 'GET /api/students/export has text/csv Content-Type');
  assert(typeof exportStudentsRes.data === 'string' && exportStudentsRes.data.startsWith('\uFEFF'), 'GET /api/students/export prepends UTF-8 BOM (\\uFEFF) for Excel compatibility');
  assert(exportStudentsRes.data.includes('ඇතුළත්වීමේ අංකය'), 'GET /api/students/export contains Sinhala CSV header');

  // 44. Excel Template: GET /api/students/template
  const templateStudentsRes = await testEndpoint('GET', '/api/students/template');
  assert(templateStudentsRes.status === 200 && typeof templateStudentsRes.data === 'string' && templateStudentsRes.data.startsWith('\uFEFF'), 'GET /api/students/template returns UTF-8 BOM CSV template');

  // 45. Bulk Import: POST /api/students/bulk-import
  const bulkTestStudents = [
    {
      regNo: 'DPS/2026/801',
      name: 'බුද්ධික ප්‍රනාන්දු',
      englishName: 'Buddhika Fernando',
      grade: '10 ශ්‍රේණිය (Grade 10)',
      guardianName: 'එම්. ප්‍රනාන්දු',
      contact: '071 111 2222',
      address: 'කඩුවෙල'
    },
    {
      regNo: 'DPS/2026/802',
      name: 'හර්ෂණී විජේසිංහ',
      englishName: 'Harshani Wijesinghe',
      grade: '10 ශ්‍රේණිය (Grade 10)',
      guardianName: 'ඩබ්. විජේසිංහ',
      contact: '077 333 4444',
      address: 'නුගේගොඩ'
    }
  ];
  const bulkStudentRes = await testEndpoint('POST', '/api/students/bulk-import', { students: bulkTestStudents });
  assert(bulkStudentRes.status === 201 && bulkStudentRes.data.success && bulkStudentRes.data.imported === 2, 'POST /api/students/bulk-import imports multiple students');
  const importedStudent = await db.getStudent('DPS/2026/801');
  assert(importedStudent && importedStudent.pin.startsWith('scrypt:'), 'Bulk imported student has secure scrypt hashed PIN by default');

  // Clean up bulk test students
  await testEndpoint('DELETE', `/api/students/${encodeURIComponent('DPS/2026/801')}`);
  await testEndpoint('DELETE', `/api/students/${encodeURIComponent('DPS/2026/802')}`);

  // 46. Excel Export: GET /api/exams/export with UTF-8 BOM
  const exportExamsRes = await testEndpoint('GET', '/api/exams/export');
  assert(exportExamsRes.status === 200 && typeof exportExamsRes.data === 'string' && exportExamsRes.data.startsWith('\uFEFF'), 'GET /api/exams/export prepends UTF-8 BOM (\\uFEFF) for Excel compatibility');
  assert(exportExamsRes.data.includes('වාරය (Term)'), 'GET /api/exams/export contains Sinhala CSV header');

  // 47. Excel Template: GET /api/exams/template
  const templateExamsRes = await testEndpoint('GET', '/api/exams/template');
  assert(templateExamsRes.status === 200 && typeof templateExamsRes.data === 'string' && templateExamsRes.data.startsWith('\uFEFF'), 'GET /api/exams/template returns UTF-8 BOM CSV template');

  // 48. Bulk Import: POST /api/exams/bulk-import
  const bulkTestMarks = [
    {
      regNo: 'DPS/2026/104',
      term: '2',
      year: '2026',
      subject: 'පාලි භාෂාව',
      marks: 96,
      remarks: 'විශිෂ්ට සාමාර්ථයකි'
    },
    {
      regNo: 'DPS/2026/104',
      term: '2',
      year: '2026',
      subject: 'බෞද්ධ කලාව හා නිර්මාණ',
      marks: 82,
      remarks: 'ඉතා හොඳයි'
    }
  ];
  const bulkExamRes = await testEndpoint('POST', '/api/exams/bulk-import', { marks: bulkTestMarks });
  assert(bulkExamRes.status === 201 && bulkExamRes.data.success && bulkExamRes.data.imported === 2, 'POST /api/exams/bulk-import saves multiple marks with accurate grading');
  const checkUpdatedStudent = await db.getStudent('DPS/2026/104');
  const foundPali = (checkUpdatedStudent.examMarks || []).find(m => m.subject === 'පාලි භාෂාව' && String(m.term) === '2');
  assert(foundPali && foundPali.marks === 96 && foundPali.grade === 'A', 'Bulk imported exam mark has accurate grade A calculated automatically');

  console.log(`\n=======================================================`);
  console.log(`  Route Unit Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`=======================================================`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runDirectTests();

