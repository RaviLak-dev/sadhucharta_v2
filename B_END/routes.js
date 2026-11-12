const db = require('./db');
const { hashPin, verifyPin, generateToken, extractAuthUserAsync } = require('./auth');

function sanitizePublicUser(record) {
  if (!record || typeof record !== 'object') return record;
  const { pin, pinHash, ...clean } = record;
  return clean;
}

async function completeRoleLogin({ res, role, userDoc, entityId, pin, updatePinFn }) {
  if (!userDoc || !verifyPin(pin, userDoc.pin)) {
    return false;
  }

  // Zero disruption: auto-upgrade legacy plaintext PINs to scrypt hashes
  if (!userDoc.pin || !userDoc.pin.startsWith('scrypt:')) {
    const newHashed = hashPin(pin);
    await updatePinFn(entityId, newHashed);
    userDoc.pin = newHashed;
  }

  const firebaseSession = typeof db.createAuthSession === 'function'
    ? await db.createAuthSession({
        role,
        entityId,
        name: userDoc.name,
        grade: userDoc.grade || '',
        photo: userDoc.photo || userDoc.avatar || ''
      })
    : null;

  const fallbackJwt = generateToken({
    id: entityId,
    regNo: role === 'student' ? entityId : undefined,
    username: entityId,
    role,
    name: userDoc.name,
    grade: userDoc.grade || ''
  });

  const token = (firebaseSession && firebaseSession.idToken) || fallbackJwt;
  const cleanUser = sanitizePublicUser(userDoc);
  if (firebaseSession && firebaseSession.uid) {
    cleanUser.uid = firebaseSession.uid;
  }

  sendJson(res, 200, {
    success: true,
    token,
    firebaseIdToken: firebaseSession ? firebaseSession.idToken : null,
    firebaseCustomToken: firebaseSession ? firebaseSession.firebaseCustomToken : null,
    firebaseUid: firebaseSession ? firebaseSession.uid : null,
    authProvider: firebaseSession ? firebaseSession.authProvider : 'local_jwt',
    user: cleanUser,
    role
  });
  return true;
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8'
  });
  res.end(JSON.stringify(data));
}

function sendCsv(res, filename, csvContent) {
  res.writeHead(200, {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': `attachment; filename="${filename}"`
  });
  // Prepend UTF-8 BOM for Microsoft Excel native Sinhala script support
  res.end('\uFEFF' + csvContent);
}

function isAudienceMatch(targetAudience, itemAudience) {
  if (!targetAudience || targetAudience === 'all') return true;
  if (!itemAudience) return true;

  const aud = String(itemAudience).toLowerCase().trim();
  const target = String(targetAudience).toLowerCase().trim();

  // If announcement is explicitly for all/everyone, it matches any viewer
  if (aud === 'all' || aud.includes('සියල්ල') || aud.includes('everyone') || aud.includes('(all)')) {
    return true;
  }

  if (target === 'teachers' || target === 'teacher') {
    return aud === 'teachers' || aud.includes('teacher') || aud.includes('ආචාර්ය') || aud.includes('ගුරු');
  }

  if (target === 'students' || target === 'student') {
    return aud === 'students' || aud.includes('student') || aud.includes('ශිෂ්‍ය') || aud.includes('සිසු') || aud.includes('දෙමව්පිය') || aud.includes('parent');
  }

  return aud === target || aud.includes(target);
}

async function handleRoutes(req, res, body) {
  const reqUrl = new URL(req.url, 'http://localhost');
  const pathname = reqUrl.pathname.replace(/\/+$/, ''); // strip trailing slash
  
  const method = req.method;
  const query = Object.fromEntries(reqUrl.searchParams.entries());

  // 1. Health Check
  if (pathname === '/api/health' && method === 'GET') {
    if (typeof db.ensureReady === 'function') {
      await db.ensureReady();
    }
    let studentCount = 0;
    let teacherCount = 0;
    let eventCount = 0;
    try {
      const [students, teachers, events] = await Promise.all([
        db.getAllStudents(),
        db.getAllTeachers(),
        db.getAllEvents()
      ]);
      studentCount = Object.keys(students || {}).length;
      teacherCount = (teachers || []).length;
      eventCount = (events || []).length;
    } catch (e) {
      console.warn('Health check count query skipped:', e.message);
    }
    const activeProvider = db.provider || 'mongodb';
    return sendJson(res, 200, {
      status: 'ok',
      server: 'online',
      provider: activeProvider,
      projectId: db.projectId || process.env.FIREBASE_PROJECT_ID || null,
      database: db.isConnected ? activeProvider : (db.isConnecting ? 'connecting' : 'disconnected'),
      credentialMode: db.credentialMode || null,
      databaseError: db.connectionError || null,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      counts: {
        students: studentCount,
        teachers: teacherCount,
        events: eventCount
      }
    });
  }

  // 1.1 DB Status & Reconnect
  if (pathname === '/api/db/status' && method === 'GET') {
    const uri = process.env.MONGODB_URI || '';
    const activeProvider = db.provider || 'mongodb';
    return sendJson(res, 200, {
      isConnected: db.isConnected,
      isConnecting: db.isConnecting,
      provider: activeProvider,
      projectId: db.projectId || process.env.FIREBASE_PROJECT_ID || null,
      credentialMode: db.credentialMode || null,
      database: db.isConnected ? activeProvider : 'memory_fallback',
      error: db.connectionError,
      uri: activeProvider === 'firebase' ? `firebase://${db.projectId || process.env.FIREBASE_PROJECT_ID || 'default'}` : uri.replace(/\/\/.*@/, '//***:***@')
    });
  }

  if (pathname === '/api/db/reconnect' && method === 'POST') {
    const { uri } = body || {};
    const result = await db.reconnect(uri || null);
    return sendJson(res, result.success ? 200 : 400, result);
  }

  // 2. Auth Login with Scrypt PIN Verification, Auto-Upgrade & Firebase Auth / JWT
  if (pathname === '/api/auth/login' && method === 'POST') {
    const { role, username, pin } = body || {};
    if (!username || !pin) {
      return sendJson(res, 400, { success: false, message: 'Username and PIN are required.' });
    }

    const cleanId = username.trim();
    const roleConfig = {
      student: {
        fetchUser: () => db.getStudent(cleanId),
        updatePin: (id, hash) => db.updateStudentPin(id, hash),
        errorMessage: 'වැරදි ශිෂ්‍ය අංකය හෝ රහස් අංකයකි (Invalid Student ID or PIN).'
      },
      teacher: {
        fetchUser: () => db.getTeacher(cleanId),
        updatePin: (id, hash) => db.updateTeacherPin(id, hash),
        errorMessage: 'වැරදි ගුරු අංකය හෝ රහස් අංකයකි (Invalid Teacher ID or PIN).'
      },
      admin: {
        fetchUser: () => db.getAdmin(cleanId),
        updatePin: (id, hash) => db.updateAdminPin(id, hash),
        errorMessage: 'වැරදි පරිපාලක අංකය හෝ රහස් අංකයකි (Invalid Admin ID or PIN).'
      }
    };

    const handler = roleConfig[role];
    if (!handler) {
      return sendJson(res, 400, { success: false, message: 'Invalid role specified.' });
    }

    const userDoc = await handler.fetchUser();
    const ok = await completeRoleLogin({
      res,
      role,
      userDoc,
      entityId: cleanId,
      pin,
      updatePinFn: handler.updatePin
    });
    if (ok) return;

    return sendJson(res, 401, { success: false, message: handler.errorMessage });
  }

  // 2.1 Auth Session Verification (Firebase ID Token or Fallback JWT)
  if (pathname === '/api/auth/verify' && method === 'GET') {
    const authUser = await extractAuthUserAsync(req, db.firebaseAuth || null);
    if (!authUser) {
      return sendJson(res, 401, { success: false, message: 'Invalid or expired authentication token.' });
    }
    return sendJson(res, 200, { success: true, user: authUser });
  }

  // 3. Students
  // GET /api/students/export (CSV with UTF-8 BOM for Microsoft Excel)
  if (pathname === '/api/students/export' && method === 'GET') {
    const studentsObj = await db.getAllStudents();
    let studentsList = Object.values(studentsObj);
    if (query.grade) {
      studentsList = studentsList.filter(s => s.grade && s.grade.includes(query.grade));
    }
    const header = ['ඇතුළත්වීමේ අංකය (Admission No)', 'ශිෂ්‍යයාගේ නම (Student Name)', 'ඉංග්‍රීසි නම (English Name)', 'ශ්‍රේණිය (Grade)', 'භාරකරුගේ නම (Guardian)', 'දුරකථන අංකය (Contact)', 'ලිපිනය (Address)'].join(',');
    const rows = studentsList.map(s => [
      `"${s.regNo || ''}"`,
      `"${(s.name || '').replace(/"/g, '""')}"`,
      `"${(s.englishName || '').replace(/"/g, '""')}"`,
      `"${(s.grade || '').replace(/"/g, '""')}"`,
      `"${(s.guardianName || '').replace(/"/g, '""')}"`,
      `"${(s.contact || '').replace(/"/g, '""')}"`,
      `"${(s.address || '').replace(/"/g, '""')}"`
    ].join(','));
    const gradeSlug = query.grade ? query.grade.replace(/[^a-zA-Z0-9]/g, '_') : 'All';
    return sendCsv(res, `Daham_Pasala_Students_${gradeSlug}_${Date.now()}.csv`, [header, ...rows].join('\r\n'));
  }

  // GET /api/students/template (Sample CSV for bulk upload)
  if (pathname === '/api/students/template' && method === 'GET') {
    const template = [
      'ඇතුළත්වීමේ අංකය (Admission No),ශිෂ්‍යයාගේ නම (Student Name),ඉංග්‍රීසි නම (English Name),ශ්‍රේණිය (Grade),භාරකරුගේ නම (Guardian),දුරකථන අංකය (Contact),ලිපිනය (Address)',
      'DPS/2026/101,කසුන් මධුසංඛ,Kasun Madhusankha,10 ශ්‍රේණිය (Grade 10),එස්. පී. සුනිල්,077 123 4567,කොළඹ 05',
      'DPS/2026/102,නිලූකා ප්‍රියදර්ශනී,Niluka Priyadarshani,10 ශ්‍රේණිය (Grade 10),ආර්. කේ. සරත්,071 987 6543,මහරගම'
    ].join('\r\n');
    return sendCsv(res, 'Daham_Pasala_Student_Import_Template.csv', template);
  }

  // POST /api/students/bulk-import
  if (pathname === '/api/students/bulk-import' && method === 'POST') {
    const list = Array.isArray(body) ? body : (body && body.students ? body.students : []);
    try {
      const result = await db.bulkImportStudents(list);
      return sendJson(res, 201, result);
    } catch (e) {
      return sendJson(res, 400, { success: false, message: e.message });
    }
  }

  // GET /api/exams/export (CSV export for exam marks)
  if (pathname === '/api/exams/export' && method === 'GET') {
    const studentsObj = await db.getAllStudents();
    let studentsList = Object.values(studentsObj);
    if (query.grade) {
      studentsList = studentsList.filter(s => s.grade && s.grade.includes(query.grade));
    }
    const termFilter = query.term || 'all';
    const yearFilter = query.year || '2026';
    const header = ['ඇතුළත්වීමේ අංකය (Admission No)', 'ශිෂ්‍යයාගේ නම (Student Name)', 'ශ්‍රේණිය (Grade)', 'වාරය (Term)', 'වර්ෂය (Year)', 'විෂයය (Subject)', 'ලකුණු (Marks)', 'සාමාර්ථය (Grade)', 'සටහන් (Remarks)'].join(',');
    const rows = [];
    studentsList.forEach(s => {
      const marks = s.examMarks || [];
      marks.forEach(m => {
        if (termFilter !== 'all' && String(m.term || '1') !== String(termFilter)) return;
        if (yearFilter !== 'all' && String(m.year || '2026') !== String(yearFilter)) return;
        rows.push([
          `"${s.regNo || ''}"`,
          `"${(s.name || '').replace(/"/g, '""')}"`,
          `"${(s.grade || '').replace(/"/g, '""')}"`,
          `"${m.term || '1'}"`,
          `"${m.year || '2026'}"`,
          `"${(m.subject || '').replace(/"/g, '""')}"`,
          `"${m.marks || 0}"`,
          `"${m.grade || 'A'}"`,
          `"${(m.remarks || '').replace(/"/g, '""')}"`
        ].join(','));
      });
    });
    return sendCsv(res, `Daham_Pasala_Exam_Marks_${Date.now()}.csv`, [header, ...rows].join('\r\n'));
  }

  // GET /api/exams/template
  if (pathname === '/api/exams/template' && method === 'GET') {
    const template = [
      'ඇතුළත්වීමේ අංකය (Admission No),වාරය (Term),වර්ෂය (Year),විෂයය (Subject),ලකුණු (Marks),සටහන් (Remarks)',
      'DPS/2026/104,1,2026,බුද්ධ ධර්මය,92,විශිෂ්ට සාමාර්ථයකි',
      'DPS/2026/104,1,2026,බෞද්ධ සංස්කෘතිය,88,ඉතා හොඳයි'
    ].join('\r\n');
    return sendCsv(res, 'Daham_Pasala_Exam_Marks_Template.csv', template);
  }

  // POST /api/exams/bulk-import
  if (pathname === '/api/exams/bulk-import' && method === 'POST') {
    const list = Array.isArray(body) ? body : (body && body.marks ? body.marks : []);
    try {
      const result = await db.bulkImportExamMarks(list);
      return sendJson(res, 201, result);
    } catch (e) {
      return sendJson(res, 400, { success: false, message: e.message });
    }
  }

  // GET /api/students
  if (pathname === '/api/students' && method === 'GET') {
    const students = await db.getAllStudents();
    return sendJson(res, 200, { success: true, data: students });
  }

  // 3.1 Student Exam Marks
  // /api/students/:regNo/exams
  const studentExamMatch = pathname.match(/^\/api\/students\/(.+)\/exams$/);
  if (studentExamMatch) {
    const regNo = decodeURIComponent(studentExamMatch[1]);
    if (method === 'GET') {
      const student = await db.getStudent(regNo);
      if (!student) return sendJson(res, 404, { success: false, message: 'Student not found.' });
      let marks = student.examMarks || [];
      if (query.term) {
        marks = marks.filter(m => String(m.term || '1') === String(query.term));
      }
      return sendJson(res, 200, { success: true, data: marks });
    }

    if (method === 'POST') {
      try {
        const student = await db.saveStudentExamMark(regNo, body);
        return sendJson(res, 201, { success: true, data: student.examMarks, student });
      } catch (e) {
        return sendJson(res, 400, { success: false, message: e.message });
      }
    }

    if (method === 'DELETE') {
      const term = query.term || (body && body.term);
      const subject = query.subject || (body && body.subject);
      const year = query.year || (body && body.year) || '2026';
      const deleted = await db.deleteStudentExamMark(regNo, term, subject, year);
      return sendJson(res, deleted ? 200 : 404, { success: deleted });
    }
  }

  // 3.2 Grade Class Rankings
  // GET /api/grades/:grade/rankings
  const gradeRankingsMatch = pathname.match(/^\/api\/grades\/(.+)\/rankings$/);
  if (gradeRankingsMatch && method === 'GET') {
    const grade = decodeURIComponent(gradeRankingsMatch[1]);
    const year = query.year || '2026';
    try {
      const rankings = await db.calculateClassRankings(grade, year);
      return sendJson(res, 200, { success: true, data: rankings });
    } catch (e) {
      return sendJson(res, 400, { success: false, message: e.message });
    }
  }

  // GET /api/students/:regNo
  const studentMatch = pathname.match(/^\/api\/students\/([^/]+)$/);
  if (studentMatch && method === 'GET') {
    const regNo = decodeURIComponent(studentMatch[1]);
    const student = query.basic === 'true'
      ? await db.getStudent(regNo)
      : await db.getStudentProfileWithRelations(regNo);
    if (student) {
      return sendJson(res, 200, { success: true, data: sanitizePublicUser(student) });
    }
    return sendJson(res, 404, { success: false, message: 'Student not found.' });
  }

  // POST /api/students
  if (pathname === '/api/students' && method === 'POST') {
    try {
      const student = await db.saveStudent(body);
      return sendJson(res, 201, { success: true, data: sanitizePublicUser(student) });
    } catch (e) {
      return sendJson(res, 400, { success: false, message: e.message });
    }
  }

  // PUT /api/students/:regNo
  if (studentMatch && method === 'PUT') {
    const regNo = decodeURIComponent(studentMatch[1]);
    try {
      const student = await db.saveStudent({ ...body, regNo });
      return sendJson(res, 200, { success: true, data: sanitizePublicUser(student) });
    } catch (e) {
      return sendJson(res, 400, { success: false, message: e.message });
    }
  }

  // DELETE /api/students/:regNo
  if (studentMatch && method === 'DELETE') {
    const regNo = decodeURIComponent(studentMatch[1]);
    const deleted = await db.deleteStudent(regNo);
    return sendJson(res, deleted ? 200 : 404, { success: deleted });
  }

  // 4. Teachers
  // GET /api/teachers
  if (pathname === '/api/teachers' && method === 'GET') {
    const teachers = await db.getAllTeachers();
    return sendJson(res, 200, { success: true, data: (teachers || []).map(sanitizePublicUser) });
  }

  // POST /api/teachers
  if (pathname === '/api/teachers' && method === 'POST') {
    if (!body || !body.id || !body.name) {
      return sendJson(res, 400, { success: false, message: 'Teacher ID and Name are required.' });
    }
    const teacher = await db.saveTeacher(body);
    return sendJson(res, 201, { success: true, data: sanitizePublicUser(teacher) });
  }

  // PUT /api/teachers/:id
  const teacherMatch = pathname.match(/^\/api\/teachers\/(.+)$/);
  if (teacherMatch && method === 'PUT') {
    const id = decodeURIComponent(teacherMatch[1]);
    const teacher = await db.saveTeacher({ ...body, id });
    return sendJson(res, 200, { success: true, data: sanitizePublicUser(teacher) });
  }

  // DELETE /api/teachers/:id
  if (teacherMatch && method === 'DELETE') {
    const id = decodeURIComponent(teacherMatch[1]);
    const deleted = await db.deleteTeacher(id);
    return sendJson(res, deleted ? 200 : 404, { success: deleted });
  }

  // 5. Attendance
  // GET /api/attendance
  if (pathname === '/api/attendance' && method === 'GET') {
    let logs = await db.getAllAttendance();
    if (query.grade) {
      logs = logs.filter(l => l.grade === query.grade);
    }
    if (query.date) {
      logs = logs.filter(l => l.date === query.date);
    }
    return sendJson(res, 200, { success: true, data: logs });
  }

  // POST /api/attendance
  if (pathname === '/api/attendance' && method === 'POST') {
    if (!body || !body.date || !body.records) {
      return sendJson(res, 400, { success: false, message: 'Date and records are required.' });
    }
    const log = await db.recordAttendance(body);
    return sendJson(res, 201, { success: true, data: log });
  }

  // 6. Deeds
  // GET /api/deeds
  if (pathname === '/api/deeds' && method === 'GET') {
    let deeds = await db.getAllDeeds();
    if (query.regNo) {
      deeds = deeds.filter(d => d.regNo === query.regNo);
    }
    return sendJson(res, 200, { success: true, data: deeds });
  }

  // POST /api/deeds
  if (pathname === '/api/deeds' && method === 'POST') {
    const deed = await db.addDeed(body);
    return sendJson(res, 201, { success: true, data: deed });
  }

  // DELETE /api/deeds/:id
  const deedMatch = pathname.match(/^\/api\/deeds\/(.+)$/);
  if (deedMatch && method === 'DELETE') {
    const id = decodeURIComponent(deedMatch[1]);
    const deleted = await db.deleteDeed(id);
    return sendJson(res, deleted ? 200 : 404, { success: deleted });
  }

  // 7. Badges
  // GET /api/badges
  if (pathname === '/api/badges' && method === 'GET') {
    let badges = await db.getAllBadges();
    if (query.regNo) {
      badges = badges.filter(b => b.regNo === query.regNo);
    }
    if (query.status) {
      badges = badges.filter(b => b.status === query.status);
    }
    return sendJson(res, 200, { success: true, data: badges });
  }

  // POST /api/badges/nominate
  if (pathname === '/api/badges/nominate' && method === 'POST') {
    const badge = await db.nominateBadge(body);
    return sendJson(res, 201, { success: true, data: badge });
  }

  // PUT /api/badges/:id/status
  const badgeStatusMatch = pathname.match(/^\/api\/badges\/(.+)\/status$/);
  if (badgeStatusMatch && method === 'PUT') {
    const id = decodeURIComponent(badgeStatusMatch[1]);
    const status = (body && body.status) || 'approved';
    const updated = await db.updateBadgeStatus(id, status);
    if (updated) {
      return sendJson(res, 200, { success: true, data: updated });
    }
    return sendJson(res, 404, { success: false, message: 'Badge not found.' });
  }

  // PUT /api/badges/:id (Edit Badge Details)
  const badgeIdMatch = pathname.match(/^\/api\/badges\/([^/]+)$/);
  if (badgeIdMatch && method === 'PUT') {
    const id = decodeURIComponent(badgeIdMatch[1]);
    const updated = await db.updateBadge(id, body);
    if (updated) {
      return sendJson(res, 200, { success: true, data: updated });
    }
    return sendJson(res, 404, { success: false, message: 'Badge not found.' });
  }

  // DELETE /api/badges/:id (Remove Badge)
  if (badgeIdMatch && method === 'DELETE') {
    const id = decodeURIComponent(badgeIdMatch[1]);
    const result = await db.deleteBadge(id);
    if (result) {
      return sendJson(res, 200, { success: true, message: 'Badge removed successfully.' });
    }
    return sendJson(res, 404, { success: false, message: 'Badge not found.' });
  }

  // 8. Observations
  // GET /api/observations
  if (pathname === '/api/observations' && method === 'GET') {
    let obs = await db.getAllObservations();
    if (query.regNo) {
      obs = obs.filter(o => o.regNo === query.regNo);
    }
    return sendJson(res, 200, { success: true, data: obs });
  }

  // POST /api/observations
  if (pathname === '/api/observations' && method === 'POST') {
    const obs = await db.addObservation(body);
    return sendJson(res, 201, { success: true, data: obs });
  }

  // 9. Events
  // GET /api/events
  if (pathname === '/api/events' && method === 'GET') {
    const events = await db.getAllEvents();
    return sendJson(res, 200, { success: true, data: events });
  }

  // POST /api/events
  if (pathname === '/api/events' && method === 'POST') {
    const event = await db.saveEvent(body);
    return sendJson(res, 201, { success: true, data: event });
  }

  // DELETE /api/events/:id
  const eventMatch = pathname.match(/^\/api\/events\/(.+)$/);
  if (eventMatch && method === 'DELETE') {
    const id = decodeURIComponent(eventMatch[1]);
    const deleted = await db.deleteEvent(id);
    return sendJson(res, deleted ? 200 : 404, { success: deleted });
  }

  // 10. Announcements
  // GET /api/announcements
  if (pathname === '/api/announcements' && method === 'GET') {
    let ann = await db.getAllAnnouncements();
    if (query.audience) {
      ann = ann.filter(a => isAudienceMatch(query.audience, a.audience));
    }
    return sendJson(res, 200, { success: true, data: ann });
  }

  // POST /api/announcements
  if (pathname === '/api/announcements' && method === 'POST') {
    const ann = await db.addAnnouncement(body);
    return sendJson(res, 201, { success: true, data: ann });
  }

  // DELETE /api/announcements/:id
  const annMatch = pathname.match(/^\/api\/announcements\/(.+)$/);
  if (annMatch && method === 'DELETE') {
    const id = decodeURIComponent(annMatch[1]);
    const deleted = await db.deleteAnnouncement(id);
    return sendJson(res, deleted ? 200 : 404, { success: deleted });
  }

  // 11. Study Materials
  // GET /api/materials
  if (pathname === '/api/materials' && method === 'GET') {
    let mats = await db.getAllMaterials();
    if (query.grade) {
      mats = mats.filter(m => m.grade.includes(query.grade) || m.grade.includes('සියලුම') || m.grade.includes('All'));
    }
    return sendJson(res, 200, { success: true, data: mats });
  }

  // POST /api/materials
  if (pathname === '/api/materials' && method === 'POST') {
    const mat = await db.addMaterial(body);
    return sendJson(res, 201, { success: true, data: mat });
  }

  // DELETE /api/materials/:id
  const matMatch = pathname.match(/^\/api\/materials\/(.+)$/);
  if (matMatch && method === 'DELETE') {
    const id = decodeURIComponent(matMatch[1]);
    const deleted = await db.deleteMaterial(id);
    return sendJson(res, deleted ? 200 : 404, { success: deleted });
  }

  // 12. Analytics
  if (pathname === '/api/analytics' && method === 'GET') {
    const students = await db.getAllStudents();
    const teachers = await db.getAllTeachers();
    const events = await db.getAllEvents();
    const deeds = await db.getAllDeeds();
    const badges = await db.getAllBadges();
    const announcements = await db.getAllAnnouncements();

    const studentKeys = Object.keys(students);
    const totalStudents = studentKeys.length;

    // Calculate attendance %
    let totalPresent = 0;
    let totalDays = 0;
    const gradeCounts = {};

    studentKeys.forEach(k => {
      const s = students[k];
      const g = s.grade || 'Unknown';
      gradeCounts[g] = (gradeCounts[g] || 0) + 1;

      if (Array.isArray(s.attendance) && s.attendance.length > 0) {
        totalDays += s.attendance.length;
        totalPresent += s.attendance.filter(a => a.status === 'present').length;
      }
    });

    const attendanceRate = totalDays > 0 ? Math.round((totalPresent / totalDays) * 100) : 91;

    return sendJson(res, 200, {
      success: true,
      data: {
        database: db.isConnected ? (db.provider || 'firebase') : 'memory_fallback',
        totalStudents,
        totalTeachers: teachers.length,
        totalEvents: events.length,
        totalAnnouncements: announcements.length,
        totalDeeds: deeds.length,
        totalBadges: badges.length,
        pendingBadges: badges.filter(b => b.status === 'pending').length,
        approvedBadges: badges.filter(b => b.status === 'approved').length,
        averageAttendanceRate: attendanceRate,
        gradeCounts
      }
    });
  }

  // 13. Reports
  if (pathname === '/api/reports' && method === 'GET') {
    const type = query.type || 'attendance';
    const gradeFilter = query.grade || 'all';
    const students = await db.getAllStudents();
    let studentKeys = Object.keys(students);

    if (gradeFilter !== 'all') {
      studentKeys = studentKeys.filter(k => (students[k].grade || '').includes(gradeFilter));
    }

    if (type === 'attendance') {
      const rows = studentKeys.map(k => {
        const s = students[k];
        const att = Array.isArray(s.attendance) ? s.attendance : [];
        const dhammaPresent = att.filter(a => a.status === 'present' && a.type !== 'sil_day').length;
        const silPresent = att.filter(a => a.status === 'present' && a.type === 'sil_day').length;
        const totalPresents = dhammaPresent + silPresent;
        const totalLogs = att.length || 1;
        const pct = Math.round((totalPresents / Math.max(totalLogs, 4)) * 100);

        return {
          regNo: s.regNo,
          name: s.name,
          grade: s.grade,
          dhammaSchoolAttendance: `${dhammaPresent}/3 සැසි`,
          silDayAttendance: `${silPresent}/1 පෝය`,
          totalAttendancePercentage: `${pct}%`,
          status: pct >= 80 ? 'විශිෂ්ටයි' : 'තව සහභාගී විය යුතුයි'
        };
      });
      return sendJson(res, 200, { success: true, type: 'attendance', count: rows.length, data: rows });
    }

    if (type === 'exams') {
      const rows = studentKeys.map(k => {
        const s = students[k];
        const marks = Array.isArray(s.examMarks) ? s.examMarks : [];

        const getSubjectAvg = (subPattern) => {
          const subMarks = marks.filter(m => m.subject && m.subject.includes(subPattern));
          if (subMarks.length === 0) return null;
          return Math.round(subMarks.reduce((acc, m) => acc + Number(m.marks), 0) / subMarks.length);
        };

        const buddhismAvg = getSubjectAvg('බුද්ධ') ?? getSubjectAvg('ධර්ම') ?? (marks[0] ? marks[0].marks : null);
        const cultureAvg = getSubjectAvg('සංස්කෘති') ?? getSubjectAvg('චරිත') ?? (marks[1] ? marks[1].marks : null);
        const paliAvg = getSubjectAvg('පාලි') ?? getSubjectAvg('භාෂා') ?? (marks[2] ? marks[2].marks : null);

        const totalMarksSum = marks.reduce((acc, m) => acc + Number(m.marks || 0), 0);
        const avg = marks.length > 0 ? Number((totalMarksSum / marks.length).toFixed(1)) : 0;

        let gradeLetter = 'W';
        if (avg >= 75) gradeLetter = 'A';
        else if (avg >= 65) gradeLetter = 'B';
        else if (avg >= 50) gradeLetter = 'C';
        else if (avg >= 35) gradeLetter = 'S';

        const gradeLabels = {
          'A': 'විශිෂ්ට සාමාර්ථය (Distinction)',
          'B': 'ඉතා හොඳ සාමාර්ථය (Very Good)',
          'C': 'සම්මාන සාමාර්ථය (Credit)',
          'S': 'සාමාන්‍ය සාමාර්ථය (Simple Pass)',
          'W': 'ප්‍රගතිය වැඩිදියුණු විය යුතුය (Needs Improvement)'
        };

        return {
          regNo: s.regNo,
          name: s.name,
          grade: s.grade,
          buddhismMarks: buddhismAvg !== null ? `${buddhismAvg}%` : '-',
          cultureMarks: cultureAvg !== null ? `${cultureAvg}%` : '-',
          paliMarks: paliAvg !== null ? `${paliAvg}%` : '-',
          totalMarkEntries: marks.length,
          average: `${avg}%`,
          grade: gradeLetter,
          performance: gradeLabels[gradeLetter]
        };
      });
      return sendJson(res, 200, { success: true, type: 'exams', count: rows.length, data: rows });
    }

    if (type === 'deeds') {
      const allDeeds = await db.getAllDeeds();
      const allBadges = await db.getAllBadges();
      const rows = studentKeys.map(k => {
        const s = students[k];
        const deedsCount = allDeeds.filter(d => d.regNo === k).length;
        const badgesCount = allBadges.filter(b => b.regNo === k && b.status === 'approved').length;
        const points = deedsCount * 10 + badgesCount * 50;
        return {
          regNo: s.regNo,
          name: s.name,
          grade: s.grade,
          deedsCount,
          approvedBadgesCount: badgesCount,
          totalPoints: points,
          certificate: 'විශිෂ්ට ආදර්ශමත් හැසිරීම (Grade A)'
        };
      });
      return sendJson(res, 200, { success: true, type: 'deeds', count: rows.length, data: rows });
    }

    if (type === 'teachers') {
      const teachers = await db.getAllTeachers();
      return sendJson(res, 200, { success: true, type: 'teachers', count: teachers.length, data: teachers });
    }

    return sendJson(res, 400, { success: false, message: `Unknown report type: ${type}` });
  }

  // Not Found
  return sendJson(res, 404, { success: false, message: `Endpoint ${method} ${pathname} not found.` });
}

module.exports = { handleRoutes };
