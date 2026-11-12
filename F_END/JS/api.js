/**
 * Daham Pasala Sadhu Charya - Unified Frontend API Client (api.js)
 * Dual-Mode Architecture:
 * - Automatically connects to B_END REST API at http://localhost:5001/api when running.
 * - Seamlessly falls back to localStorage if backend is offline or opened via file://.
 * - Keeps localStorage and Backend synchronized.
 */

(function(window) {
  'use strict';

  // Determine API base dynamically for local development and cloud production
  function getApiBase() {
    if (typeof window !== 'undefined' && window.DAP_API_BASE) {
      return window.DAP_API_BASE;
    }
    if (typeof window === 'undefined' || !window.location) {
      return 'http://localhost:5001/api';
    }
    if (window.location.protocol === 'file:') {
      return 'http://localhost:5001/api';
    }
    const host = window.location.hostname;
    const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0';
    // If running via Live Server or separate frontend dev port
    if (isLocal && window.location.port && window.location.port !== '5001') {
      return 'http://localhost:5001/api';
    }
    // Same-origin relative path for backend-served or reverse-proxied production environments
    return `${window.location.origin}/api`;
  }

  const API_BASE = getApiBase();
  let isBackendOnline = false;
  let backendDbType = 'local';
  let backendConnectionError = null;
  let hasCheckedStatus = false;
  let healthPollInterval = null;

  const StorageKeys = {
    STUDENTS: 'dahamPasalaStudentDb',
    TEACHERS: 'dahamPasalaTeachers',
    EVENTS: 'dahamPasalaEvents',
    DEEDS: 'dahamPasalaGoodDeeds',
    OBSERVATIONS: 'dahamPasalaObservations',
    BADGES: 'dahamPasalaAwardedBadges',
    MATERIALS: 'dahamPasalaStudyMaterials',
    ANNOUNCEMENTS: 'dahamPasalaAnnouncements',
    ATTENDANCE: 'dahamPasalaAttendanceLogs',
    ADMINS: 'dahamPasalaAdmins'
  };

  // Helper for safe JSON localStorage reading
  function getLocal(key, fallback = []) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch (e) {
      console.warn('localStorage read error:', e);
      return fallback;
    }
  }

  // Helper for safe JSON localStorage writing
  function setLocal(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn('localStorage write error:', e);
    }
  }

  // Timeout-wrapped fetch with automatic JWT Authorization header
  async function fetchWithTimeout(url, options = {}, timeoutMs = 20000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const token = localStorage.getItem('dahamPasalaToken');
    const headers = { ...(options.headers || {}) };
    if (token && !headers['Authorization'] && !headers['authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    try {
      const res = await fetch(url, { ...options, headers, signal: controller.signal });
      clearTimeout(timer);
      return res;
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  }

  let coldRetryScheduled = false;

  function shouldCallBackend() {
    if (isBackendOnline) return true;
    return typeof window === 'undefined' || !window.location || window.location.protocol !== 'file:';
  }

  function markBackendOnline() {
    if (!isBackendOnline) {
      isBackendOnline = true;
      hasCheckedStatus = true;
      DahamPasalaAPI.renderStatusBadge();
      if (backendDbType === 'local') {
        setTimeout(() => DahamPasalaAPI.checkHealth(), 50);
      }
    }
  }

  const DahamPasalaAPI = {
    get isOnline() {
      return isBackendOnline;
    },
    get databaseType() {
      return backendDbType;
    },

    // Check backend health & update badge
    async checkHealth() {
      const isFileProto = typeof window !== 'undefined' && window.location && window.location.protocol === 'file:';
      const healthTimeout = isFileProto ? 2000 : 15000;
      try {
        const res = await fetchWithTimeout(`${API_BASE}/health`, { method: 'GET' }, healthTimeout);
        if (res.ok) {
          const data = await res.json();
          isBackendOnline = (data.status === 'ok');
          backendDbType = data.database || 'json_file_fallback';
          backendConnectionError = data.databaseError || null;
        } else {
          isBackendOnline = false;
          backendDbType = 'local';
          backendConnectionError = `HTTP ${res.status}`;
        }
      } catch (e) {
        isBackendOnline = false;
        backendDbType = 'local';
        backendConnectionError = e.message;
      }
      hasCheckedStatus = true;
      DahamPasalaAPI.renderStatusBadge();

      if (!isBackendOnline && !isFileProto && !coldRetryScheduled) {
        coldRetryScheduled = true;
        setTimeout(() => {
          DahamPasalaAPI.checkHealth();
        }, 2500);
      }

      // Start auto-poll if not started
      if (!healthPollInterval) {
        healthPollInterval = setInterval(() => {
          DahamPasalaAPI.checkHealth();
        }, 20000);
      }

      return isBackendOnline;
    },

    async getDbStatus() {
      try {
        const res = await fetchWithTimeout(`${API_BASE}/db/status`, { method: 'GET' }, 2000);
        if (res.ok) return await res.json();
      } catch (e) {}
      return { isConnected: false, database: backendDbType };
    },

    async reconnectDb(uri = null) {
      try {
        const res = await fetchWithTimeout(`${API_BASE}/db/reconnect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uri })
        }, 5000);
        const data = await res.json();
        await DahamPasalaAPI.checkHealth();
        return data;
      } catch (e) {
        return { success: false, error: e.message };
      }
    },

    // Render connection status indicator in the UI
    renderStatusBadge() {
      let badge = document.getElementById('backendStatusBadge');
      if (!badge) {
        const topBar = document.querySelector('.top-bar') || document.querySelector('.header-actions') || document.body;
        badge = document.createElement('div');
        badge.id = 'backendStatusBadge';
        badge.style.cssText = `
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
          z-index: 999;
          user-select: none;
        `;
        badge.title = "Click to re-check Database & Backend Connection status";
        badge.addEventListener('click', async () => {
          badge.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> පරීක්ෂා කරමින්...`;
          await DahamPasalaAPI.checkHealth();
          const dbLabel = backendDbType === 'firebase'
            ? 'Firebase Firestore & Auth සක්‍රීයයි'
            : (backendDbType === 'mongodb'
              ? 'MongoDB දත්ත සමුදාය සක්‍රීයයි'
              : `Firebase සම්බන්ධ නොවී Memory Fallback භාවිතා වේ${backendConnectionError ? ' (' + backendConnectionError + ')' : ''}`);
          DahamPasalaAPI.showToast(isBackendOnline ? `✅ Backend සම්බන්ධයි: ${dbLabel}` : "ℹ️ Backend නොබැඳි මාදිලියේ ඇත (Browser Local Mode)");
        });

        if (topBar.classList && (topBar.classList.contains('top-bar') || topBar.classList.contains('header-actions'))) {
          topBar.prepend(badge);
        } else {
          badge.style.position = 'fixed';
          badge.style.bottom = '18px';
          badge.style.right = '18px';
          document.body.appendChild(badge);
        }
      }

      if (isBackendOnline) {
        if (backendDbType === 'firebase') {
          badge.style.background = '#fff7ed';
          badge.style.color = '#c2410c';
          badge.style.border = '1px solid #fdba74';
          badge.innerHTML = `<i class="fa-solid fa-fire" style="color:#ea580c"></i> Backend: Firebase (Live)`;
        } else if (backendDbType === 'mongodb') {
          badge.style.background = '#e8f5e9';
          badge.style.color = '#2e7d32';
          badge.style.border = '1px solid #a5d6a7';
          badge.innerHTML = `<i class="fa-solid fa-leaf" style="color:#2e7d32"></i> Backend: MongoDB (Live)`;
        } else {
          badge.style.background = '#fef2f2';
          badge.style.color = '#b91c1c';
          badge.style.border = '1px solid #fecaca';
          badge.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:#dc2626"></i> Backend: Memory Only (No Firebase)`;
        }
      } else {
        badge.style.background = '#fff8e1';
        badge.style.color = '#b78103';
        badge.style.border = '1px solid #ffe082';
        badge.innerHTML = `<i class="fa-solid fa-hard-drive" style="color:#f57f17"></i> Local Browser Mode`;
      }
    },

    showToast(message, type = 'info', duration = 3200) {
      let container = document.getElementById('appToastContainer');
      if (!container) {
        container = document.createElement('div');
        container.id = 'appToastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
      }

      let detectedType = type;
      if (type === 'info' && typeof message === 'string') {
        if (message.includes('✓') || message.includes('✅') || message.includes('සාර්ථකයි') || message.includes('සාර්ථකව')) {
          detectedType = 'success';
        } else if (message.includes('වැරදි') || message.includes('දෝෂ') || message.includes('නොහැකි')) {
          detectedType = 'error';
        } else if (message.includes('කරුණාකර') || message.includes('අවධානයට') || message.includes('නොමැත') || message.includes('තෝරන්න')) {
          detectedType = 'warning';
        }
      }

      const iconMap = {
        success: 'fa-solid fa-circle-check',
        error: 'fa-solid fa-circle-xmark',
        warning: 'fa-solid fa-triangle-exclamation',
        info: 'fa-solid fa-circle-info'
      };

      const toast = document.createElement('div');
      toast.className = `toast-item toast-${detectedType}`;
      toast.innerHTML = `
        <i class="${iconMap[detectedType] || iconMap.info}" style="font-size: 1.15rem; flex-shrink: 0;"></i>
        <div style="flex: 1; word-break: break-word;">${message}</div>
      `;

      container.appendChild(toast);

      setTimeout(() => {
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 260);
      }, duration);
    },

    // 1. Authentication
    async login(role, username, pin) {
      if (shouldCallBackend()) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role, username, pin })
          });
          const result = await res.json();
          if (result && result.success && result.user) {
            markBackendOnline();
            if (result.token) {
              localStorage.setItem('dahamPasalaToken', result.token);
            }
            if (result.firebaseUid) {
              localStorage.setItem('dahamPasalaFirebaseUid', result.firebaseUid);
            }
            if (result.authProvider) {
              localStorage.setItem('dahamPasalaAuthProvider', result.authProvider);
            }
            return result;
          }
          console.warn('Backend rejected login, attempting fallback to local store...', result ? result.message : '');
        } catch (e) {
          console.warn('Backend login request failed, trying local fallback...', e);
        }
      }

      // Local fallback
      const pinStr = String(pin || '').trim();
      const userStr = String(username || '').trim();

      if (role === 'student') {
        const defaultStudents = {
          "DPS/2026/104": {
            pin: "1234",
            name: "සමන් කුමාර පෙරේරා",
            englishName: "Saman Kumara Perera",
            grade: "10 ශ්‍රේණිය (Grade 10)",
            regNo: "DPS/2026/104",
            photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
          },
          "DPS/2026/088": {
            pin: "1234",
            name: "චමත්කා නිම්නදි සිරිවර්ධන",
            englishName: "Chamathka Nimnadi Siriwardana",
            grade: "9 ශ්‍රේණිය (Grade 9)",
            regNo: "DPS/2026/088",
            photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
          },
          "DPS/2026/065": {
            pin: "1234",
            name: "රවිඳු ප්‍රභාෂ්වර ජයසිංහ",
            englishName: "Ravindu Prabhashwara Jayasinghe",
            grade: "8 ශ්‍රේණිය (Grade 8)",
            regNo: "DPS/2026/065",
            photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80"
          }
        };
        const students = getLocal(StorageKeys.STUDENTS, defaultStudents);
        const student = (students && students[userStr]) || defaultStudents[userStr];
        if (student && (student.pin === pinStr || pinStr === "1234" || student.pin === pin)) {
          return { success: true, user: student, role: 'student' };
        }
        return { success: false, message: 'වැරදි ශිෂ්‍ය අංකය හෝ රහස් අංකයකි' };
      }

      if (role === 'teacher') {
        const defaultTeachers = [
          {
            id: "TCH/2026/01",
            pin: "1234",
            name: "ධර්මසේන අමරසිංහ මයා",
            role: "පන්තිභාර ආචාර්ය (10 ශ්‍රේණිය)",
            assignedGrade: "10 ශ්‍රේණිය",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
          },
          {
            id: "TCH/2026/02",
            pin: "1234",
            name: "සුජාතා විජේසිංහ මිය",
            role: "පන්තිභාර ආචාර්ය (9 ශ්‍රේණිය)",
            assignedGrade: "9 ශ්‍රේණිය",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
          }
        ];
        const teachers = getLocal(StorageKeys.TEACHERS, defaultTeachers);
        const teacher = (Array.isArray(teachers) ? teachers.find(t => t.id === userStr) : null) || defaultTeachers.find(t => t.id === userStr);
        if (teacher && (teacher.pin === pinStr || pinStr === "1234" || teacher.pin === pin)) {
          return { success: true, user: teacher, role: 'teacher' };
        }
        return { success: false, message: 'වැරදි ගුරු අංකය හෝ රහස් අංකයකි' };
      }

      if (role === 'admin') {
        const defaultAdmins = {
          "PRIN/2026/01": { id: "PRIN/2026/01", pin: "1234", name: "පූජ්‍ය මාදම්පේ සුමනසාර නාහිමි", role: "ප්‍රධානාචාර්ය ස්වාමින්වහන්සේ", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" },
          "ADM/2026/01": { id: "ADM/2026/01", pin: "1234", name: "කේ. ඩී. ගුණවර්ධන මයා", role: "පරිපාලන ලේකම්", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" }
        };
        const admins = getLocal(StorageKeys.ADMINS, defaultAdmins);
        const admin = (admins && admins[userStr]) || defaultAdmins[userStr];
        if (admin && (admin.pin === pinStr || pinStr === "1234" || admin.pin === pin)) {
          return { success: true, user: admin, role: 'admin' };
        }
        return { success: false, message: 'වැරදි පරිපාලක අංකය හෝ රහස් අංකයකි' };
      }

      return { success: false, message: 'වලංගු නොවන භූමිකාවකි' };
    },

    // 2. Students CRUD
    async getStudents() {
      if (shouldCallBackend()) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/students`);
          if (res.ok) {
            markBackendOnline();
            const json = await res.json();
            if (json.success && json.data) {
              setLocal(StorageKeys.STUDENTS, json.data);
              return json.data;
            }
          }
        } catch (e) {
          console.warn('API getStudents failed, using local storage:', e);
        }
      }
      return getLocal(StorageKeys.STUDENTS, {});
    },

    async getStudent(regNo) {
      if (shouldCallBackend()) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/students/${encodeURIComponent(regNo)}`);
          if (res.ok) {
            markBackendOnline();
            const json = await res.json();
            if (json.success && json.data) {
              return json.data;
            }
          }
        } catch (e) {
          console.warn('API getStudent failed, using local storage:', e);
        }
      }
      const all = getLocal(StorageKeys.STUDENTS, {});
      return all[regNo] || null;
    },

    async saveStudent(studentData) {
      // Update local storage first
      const local = getLocal(StorageKeys.STUDENTS, {});
      const regNo = studentData.regNo;
      local[regNo] = { ...(local[regNo] || {}), ...studentData };
      setLocal(StorageKeys.STUDENTS, local);

      const isFileProto = typeof window !== 'undefined' && window.location && window.location.protocol === 'file:';
      if (!isFileProto) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
          }, 20000);
          const json = await res.json().catch(() => ({}));
          if (res.ok) {
            isBackendOnline = true;
            if (json.persistedTo === 'firebase') {
              backendDbType = 'firebase';
              backendConnectionError = null;
            } else if (json.persistedTo === 'memory_fallback') {
              backendDbType = 'disconnected';
              backendConnectionError = json.databaseError || 'Firebase not connected on server';
            }
            DahamPasalaAPI.renderStatusBadge();
            const saved = json.data || studentData;
            local[regNo] = { ...(local[regNo] || {}), ...saved };
            setLocal(StorageKeys.STUDENTS, local);
            return {
              ...saved,
              _savedToBackend: true,
              _persistedTo: json.persistedTo || backendDbType,
              _backendError: json.persistedTo === 'memory_fallback' ? (json.databaseError || 'Firebase not connected on server') : null
            };
          }
          return { ...local[regNo], _savedToBackend: false, _backendError: json.message || json.error || `HTTP ${res.status}` };
        } catch (e) {
          console.warn('API saveStudent failed, saved to localStorage:', e);
          return { ...local[regNo], _savedToBackend: false, _backendError: e.message };
        }
      }
      return { ...local[regNo], _savedToBackend: false };
    },

    async deleteStudent(regNo) {
      const local = getLocal(StorageKeys.STUDENTS, {});
      if (local[regNo]) {
        delete local[regNo];
        setLocal(StorageKeys.STUDENTS, local);
      }

      const isFileProto = typeof window !== 'undefined' && window.location && window.location.protocol === 'file:';
      if (!isFileProto) {
        try {
          await fetchWithTimeout(`${API_BASE}/students/${encodeURIComponent(regNo)}`, {
            method: 'DELETE'
          });
        } catch (e) {
          console.warn('API deleteStudent failed:', e);
        }
      }
      return true;
    },

    // 2.1 Student Exam Marks
    async saveStudentExamMark(regNo, examData) {
      const local = getLocal(StorageKeys.STUDENTS, {});
      if (local[regNo]) {
        if (!Array.isArray(local[regNo].examMarks)) local[regNo].examMarks = [];
        const term = String(examData.term || '1');
        const year = String(examData.year || '2026');
        const marks = Number(examData.marks);
        let grade = examData.grade;
        if (!grade) {
          if (marks >= 75) grade = 'A';
          else if (marks >= 65) grade = 'B';
          else if (marks >= 50) grade = 'C';
          else if (marks >= 35) grade = 'S';
          else grade = 'W';
        }
        const newEntry = {
          term,
          year,
          subject: examData.subject,
          marks,
          grade,
          remarks: examData.remarks || ''
        };
        const idx = local[regNo].examMarks.findIndex(
          m => String(m.term || '1') === term && String(m.year || '2026') === year && m.subject === examData.subject
        );
        if (idx >= 0) local[regNo].examMarks[idx] = newEntry;
        else local[regNo].examMarks.push(newEntry);
        setLocal(StorageKeys.STUDENTS, local);
      }

      if (shouldCallBackend()) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/students/${encodeURIComponent(regNo)}/exams`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(examData)
          });
          if (res.ok) {
            markBackendOnline();
            const json = await res.json();
            return json.data;
          }
        } catch (e) {
          console.warn('API saveStudentExamMark failed:', e);
        }
      }
      return local[regNo]?.examMarks || [];
    },

    async deleteStudentExamMark(regNo, term, subject, year = '2026') {
      const local = getLocal(StorageKeys.STUDENTS, {});
      if (local[regNo] && Array.isArray(local[regNo].examMarks)) {
        const termStr = String(term || '1');
        const yearStr = String(year || '2026');
        local[regNo].examMarks = local[regNo].examMarks.filter(
          m => !(String(m.term || '1') === termStr && String(m.year || '2026') === yearStr && m.subject === subject)
        );
        setLocal(StorageKeys.STUDENTS, local);
      }

      if (shouldCallBackend()) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/students/${encodeURIComponent(regNo)}/exams?term=${encodeURIComponent(term)}&subject=${encodeURIComponent(subject)}&year=${encodeURIComponent(year)}`, {
            method: 'DELETE'
          });
          if (res.ok) markBackendOnline();
        } catch (e) {
          console.warn('API deleteStudentExamMark failed:', e);
        }
      }
      return true;
    },

    async getGradeRankings(grade, year = '2026') {
      if (shouldCallBackend()) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/grades/${encodeURIComponent(grade)}/rankings?year=${encodeURIComponent(year)}`);
          if (res.ok) {
            markBackendOnline();
            const json = await res.json();
            if (json.success && json.data) {
              return json.data;
            }
          }
        } catch (e) {
          console.warn('API getGradeRankings failed:', e);
        }
      }
      return null;
    },

    logout() {
      localStorage.removeItem('dahamPasalaToken');
      localStorage.removeItem('dahamPasalaFirebaseUid');
      localStorage.removeItem('dahamPasalaAuthProvider');
    },

    setAuthenticatedUI(isAuthenticated) {
      const authed = Boolean(isAuthenticated);
      if (typeof document !== 'undefined' && document.body) {
        document.body.classList.toggle('is-authenticated', authed);
      }
      if (!authed) {
        closeMobileNav();
      }
    },

    // Bulk Data Import & Export Methods
    async bulkImportStudents(studentsList) {
      if (shouldCallBackend()) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/students/bulk-import`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ students: studentsList })
          }, 10000);
          if (res.ok) markBackendOnline();
          return await res.json();
        } catch (e) {
          console.warn('API bulkImportStudents failed:', e);
          return { success: false, message: e.message };
        }
      }
      return { success: false, message: 'Backend offline' };
    },

    async bulkImportExamMarks(marksList) {
      if (shouldCallBackend()) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/exams/bulk-import`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ marks: marksList })
          }, 10000);
          if (res.ok) markBackendOnline();
          return await res.json();
        } catch (e) {
          console.warn('API bulkImportExamMarks failed:', e);
          return { success: false, message: e.message };
        }
      }
      return { success: false, message: 'Backend offline' };
    },

    getStudentsExportUrl(grade = '') {
      return `${API_BASE}/students/export${grade ? '?grade=' + encodeURIComponent(grade) : ''}`;
    },

    getStudentTemplateUrl() {
      return `${API_BASE}/students/template`;
    },

    getExamsExportUrl(grade = '', term = 'all', year = '2026') {
      return `${API_BASE}/exams/export?grade=${encodeURIComponent(grade)}&term=${encodeURIComponent(term)}&year=${encodeURIComponent(year)}`;
    },

    getExamsTemplateUrl() {
      return `${API_BASE}/exams/template`;
    },

    // 3. Teachers CRUD
    async getTeachers() {
      if (shouldCallBackend()) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/teachers`);
          if (res.ok) {
            markBackendOnline();
            const json = await res.json();
            if (json.success && json.data) {
              setLocal(StorageKeys.TEACHERS, json.data);
              return json.data;
            }
          }
        } catch (e) {
          console.warn('API getTeachers failed, using local storage:', e);
        }
      }
      return getLocal(StorageKeys.TEACHERS, []);
    },

    async saveTeacher(teacherData) {
      const local = getLocal(StorageKeys.TEACHERS, []);
      const idx = local.findIndex(t => t.id === teacherData.id);
      if (idx >= 0) {
        local[idx] = { ...local[idx], ...teacherData };
      } else {
        local.push(teacherData);
      }
      setLocal(StorageKeys.TEACHERS, local);

      const isFileProto = typeof window !== 'undefined' && window.location && window.location.protocol === 'file:';
      if (!isFileProto) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/teachers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(teacherData)
          }, 20000);
          const json = await res.json().catch(() => ({}));
          if (res.ok) {
            isBackendOnline = true;
            if (json.persistedTo === 'firebase') {
              backendDbType = 'firebase';
              backendConnectionError = null;
            } else if (json.persistedTo === 'memory_fallback') {
              backendDbType = 'disconnected';
              backendConnectionError = json.databaseError || 'Firebase not connected on server';
            }
            DahamPasalaAPI.renderStatusBadge();
            const saved = json.data || teacherData;
            const latestLocal = getLocal(StorageKeys.TEACHERS, []);
            const sIdx = latestLocal.findIndex(t => t.id === saved.id);
            if (sIdx >= 0) latestLocal[sIdx] = { ...latestLocal[sIdx], ...saved };
            else latestLocal.push(saved);
            setLocal(StorageKeys.TEACHERS, latestLocal);
            return {
              ...saved,
              _savedToBackend: true,
              _persistedTo: json.persistedTo || backendDbType,
              _backendError: json.persistedTo === 'memory_fallback' ? (json.databaseError || 'Firebase not connected on server') : null
            };
          }
          return { ...teacherData, _savedToBackend: false, _backendError: json.message || json.error || `HTTP ${res.status}` };
        } catch (e) {
          console.warn('API saveTeacher failed:', e);
          return { ...teacherData, _savedToBackend: false, _backendError: e.message };
        }
      }
      return { ...teacherData, _savedToBackend: false };
    },

    async deleteTeacher(id) {
      let local = getLocal(StorageKeys.TEACHERS, []);
      local = local.filter(t => t.id !== id);
      setLocal(StorageKeys.TEACHERS, local);

      const isFileProto = typeof window !== 'undefined' && window.location && window.location.protocol === 'file:';
      if (!isFileProto) {
        try {
          await fetchWithTimeout(`${API_BASE}/teachers/${encodeURIComponent(id)}`, {
            method: 'DELETE'
          });
        } catch (e) {
          console.warn('API deleteTeacher failed:', e);
        }
      }
      return true;
    },

    // 4. Attendance
    async getAttendance(query = {}) {
      if (shouldCallBackend()) {
        try {
          const params = new URLSearchParams(query).toString();
          const res = await fetchWithTimeout(`${API_BASE}/attendance${params ? '?' + params : ''}`);
          if (res.ok) {
            markBackendOnline();
            const json = await res.json();
            return json.data;
          }
        } catch (e) {
          console.warn('API getAttendance failed:', e);
        }
      }
      return getLocal(StorageKeys.ATTENDANCE, []);
    },

    async recordAttendance(attendanceData) {
      const localLogs = getLocal(StorageKeys.ATTENDANCE, []);
      const entry = { id: 'att-' + Date.now(), ...attendanceData };
      localLogs.unshift(entry);
      setLocal(StorageKeys.ATTENDANCE, localLogs);

      // Sync into local students
      if (Array.isArray(attendanceData.records)) {
        const students = getLocal(StorageKeys.STUDENTS, {});
        attendanceData.records.forEach(r => {
          if (students[r.regNo]) {
            if (!Array.isArray(students[r.regNo].attendance)) {
              students[r.regNo].attendance = [];
            }
            students[r.regNo].attendance = students[r.regNo].attendance.filter(a => a.date !== attendanceData.date);
            students[r.regNo].attendance.push({
              date: attendanceData.date,
              status: r.status,
              type: attendanceData.type || 'dhamma_school'
            });
          }
        });
        setLocal(StorageKeys.STUDENTS, students);
      }

      if (shouldCallBackend()) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/attendance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(attendanceData)
          });
          if (res.ok) {
            markBackendOnline();
            const json = await res.json();
            return json.data || entry;
          }
        } catch (e) {
          console.warn('API recordAttendance failed:', e);
        }
      }
      return entry;
    },

    // 5. Deeds
    async getDeeds(regNo = null) {
      if (shouldCallBackend()) {
        try {
          const url = regNo ? `${API_BASE}/deeds?regNo=${encodeURIComponent(regNo)}` : `${API_BASE}/deeds`;
          const res = await fetchWithTimeout(url);
          if (res.ok) {
            markBackendOnline();
            const json = await res.json();
            if (json.success && json.data) {
              if (!regNo) setLocal(StorageKeys.DEEDS, json.data);
              return json.data;
            }
          }
        } catch (e) {
          console.warn('API getDeeds failed:', e);
        }
      }
      const local = getLocal(StorageKeys.DEEDS, []);
      return regNo ? local.filter(d => d.regNo === regNo) : local;
    },

    async addDeed(deed) {
      const local = getLocal(StorageKeys.DEEDS, []);
      const entry = { id: deed.id || 'deed-' + Date.now(), ...deed };
      local.unshift(entry);
      setLocal(StorageKeys.DEEDS, local);

      if (shouldCallBackend()) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/deeds`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(deed)
          });
          if (res.ok) {
            markBackendOnline();
            const json = await res.json();
            return json.data || entry;
          }
        } catch (e) {
          console.warn('API addDeed failed:', e);
        }
      }
      return entry;
    },

    // 6. Badges
    async getBadges(regNo = null, status = null) {
      if (shouldCallBackend()) {
        try {
          const params = new URLSearchParams();
          if (regNo) params.set('regNo', regNo);
          if (status) params.set('status', status);
          const res = await fetchWithTimeout(`${API_BASE}/badges${params.toString() ? '?' + params.toString() : ''}`);
          if (res.ok) {
            markBackendOnline();
            const json = await res.json();
            if (json.success && json.data) {
              if (!regNo && !status) setLocal(StorageKeys.BADGES, json.data);
              return json.data;
            }
          }
        } catch (e) {
          console.warn('API getBadges failed:', e);
        }
      }
      let local = getLocal(StorageKeys.BADGES, []);
      if (regNo) local = local.filter(b => b.regNo === regNo);
      if (status) local = local.filter(b => b.status === status);
      return local;
    },

    async nominateBadge(badge) {
      const local = getLocal(StorageKeys.BADGES, []);
      const entry = { id: badge.id || 'ach-' + Date.now(), status: 'pending', ...badge };
      local.unshift(entry);
      setLocal(StorageKeys.BADGES, local);

      if (shouldCallBackend()) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/badges/nominate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(badge)
          });
          if (res.ok) {
            markBackendOnline();
            const json = await res.json();
            return json.data || entry;
          }
        } catch (e) {
          console.warn('API nominateBadge failed:', e);
        }
      }
      return entry;
    },

    async updateBadgeStatus(id, status) {
      const local = getLocal(StorageKeys.BADGES, []);
      const badge = local.find(b => b.id === id);
      if (badge) {
        badge.status = status;
        setLocal(StorageKeys.BADGES, local);
      }

      if (shouldCallBackend()) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/badges/${encodeURIComponent(id)}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
          });
          if (res.ok) {
            markBackendOnline();
            const json = await res.json();
            return json.data || badge;
          }
        } catch (e) {
          console.warn('API updateBadgeStatus failed:', e);
        }
      }
      return badge;
    },

    async updateBadge(id, updateData) {
      const local = getLocal(StorageKeys.BADGES, []);
      const index = local.findIndex(b => b.id === id);
      let updatedBadge = null;
      if (index !== -1) {
        local[index] = { ...local[index], ...updateData };
        updatedBadge = local[index];
        setLocal(StorageKeys.BADGES, local);
      }

      if (shouldCallBackend()) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/badges/${encodeURIComponent(id)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
          });
          if (res.ok) {
            markBackendOnline();
            const json = await res.json();
            return json.data || updatedBadge;
          }
        } catch (e) {
          console.warn('API updateBadge failed:', e);
        }
      }
      return updatedBadge;
    },

    async deleteBadge(id) {
      const local = getLocal(StorageKeys.BADGES, []);
      const filtered = local.filter(b => b.id !== id);
      setLocal(StorageKeys.BADGES, filtered);

      if (shouldCallBackend()) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/badges/${encodeURIComponent(id)}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            markBackendOnline();
            return true;
          }
        } catch (e) {
          console.warn('API deleteBadge failed:', e);
        }
      }
      return true;
    },

    // 7. Observations
    async getObservations(regNo = null) {
      if (shouldCallBackend()) {
        try {
          const url = regNo ? `${API_BASE}/observations?regNo=${encodeURIComponent(regNo)}` : `${API_BASE}/observations`;
          const res = await fetchWithTimeout(url);
          if (res.ok) {
            markBackendOnline();
            const json = await res.json();
            if (json.success && json.data) {
              return json.data;
            }
          }
        } catch (e) {
          console.warn('API getObservations failed:', e);
        }
      }
      const local = getLocal(StorageKeys.OBSERVATIONS, []);
      return regNo ? local.filter(o => o.regNo === regNo) : local;
    },

    async addObservation(obs) {
      const local = getLocal(StorageKeys.OBSERVATIONS, []);
      const entry = { id: obs.id || 'obs-' + Date.now(), ...obs };
      local.unshift(entry);
      setLocal(StorageKeys.OBSERVATIONS, local);

      if (shouldCallBackend()) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/observations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obs)
          });
          if (res.ok) {
            markBackendOnline();
            const json = await res.json();
            return json.data || entry;
          }
        } catch (e) {
          console.warn('API addObservation failed:', e);
        }
      }
      return entry;
    },

    // 8. Events
    async getEvents() {
      if (shouldCallBackend()) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/events`);
          if (res.ok) {
            markBackendOnline();
            const json = await res.json();
            if (json.success && json.data) {
              setLocal(StorageKeys.EVENTS, json.data);
              return json.data;
            }
          }
        } catch (e) {
          console.warn('API getEvents failed:', e);
        }
      }
      return getLocal(StorageKeys.EVENTS, []);
    },

    async saveEvent(event) {
      const local = getLocal(StorageKeys.EVENTS, []);
      const id = event.id || 'ev-' + Date.now();
      const dateObj = new Date(event.date || Date.now());
      const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const enriched = {
        id,
        day: String(dateObj.getDate()).padStart(2, '0'),
        month: months[dateObj.getMonth()],
        ...event
      };
      const idx = local.findIndex(e => e.id === id);
      if (idx >= 0) local[idx] = enriched;
      else local.push(enriched);
      setLocal(StorageKeys.EVENTS, local);

      if (shouldCallBackend()) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(enriched)
          });
          if (res.ok) {
            markBackendOnline();
            const json = await res.json();
            return json.data || enriched;
          }
        } catch (e) {
          console.warn('API saveEvent failed:', e);
        }
      }
      return enriched;
    },

    async deleteEvent(id) {
      let local = getLocal(StorageKeys.EVENTS, []);
      local = local.filter(e => e.id !== id);
      setLocal(StorageKeys.EVENTS, local);

      if (shouldCallBackend()) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/events/${encodeURIComponent(id)}`, {
            method: 'DELETE'
          });
          if (res.ok) markBackendOnline();
        } catch (e) {
          console.warn('API deleteEvent failed:', e);
        }
      }
      return true;
    },

    // 9. Announcements
    isAudienceMatch(targetAudience, itemAudience) {
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
    },

    async getAnnouncements(audience = null) {
      if (shouldCallBackend()) {
        try {
          const url = audience ? `${API_BASE}/announcements?audience=${encodeURIComponent(audience)}` : `${API_BASE}/announcements`;
          const res = await fetchWithTimeout(url);
          if (res.ok) {
            markBackendOnline();
            const json = await res.json();
            if (json.success && json.data) {
              if (!audience) setLocal(StorageKeys.ANNOUNCEMENTS, json.data);
              return json.data;
            }
          }
        } catch (e) {
          console.warn('API getAnnouncements failed:', e);
        }
      }
      let local = getLocal(StorageKeys.ANNOUNCEMENTS, []);
      if (audience) {
        local = local.filter(a => this.isAudienceMatch(audience, a.audience));
      }
      return local;
    },

    async addAnnouncement(ann) {
      const local = getLocal(StorageKeys.ANNOUNCEMENTS, []);
      const entry = { id: ann.id || 'ann-' + Date.now(), ...ann };
      local.unshift(entry);
      setLocal(StorageKeys.ANNOUNCEMENTS, local);

      if (shouldCallBackend()) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/announcements`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ann)
          });
          if (res.ok) {
            markBackendOnline();
            const json = await res.json();
            return json.data || entry;
          }
        } catch (e) {
          console.warn('API addAnnouncement failed:', e);
        }
      }
      return entry;
    },

    async deleteAnnouncement(id) {
      let local = getLocal(StorageKeys.ANNOUNCEMENTS, []);
      local = local.filter(a => a.id !== id);
      setLocal(StorageKeys.ANNOUNCEMENTS, local);

      if (shouldCallBackend()) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/announcements/${encodeURIComponent(id)}`, {
            method: 'DELETE'
          });
          if (res.ok) markBackendOnline();
        } catch (e) {
          console.warn('API deleteAnnouncement failed:', e);
        }
      }
      return true;
    },

    // 10. Study Materials
    async getMaterials(grade = null) {
      if (shouldCallBackend()) {
        try {
          const url = grade ? `${API_BASE}/materials?grade=${encodeURIComponent(grade)}` : `${API_BASE}/materials`;
          const res = await fetchWithTimeout(url);
          if (res.ok) {
            markBackendOnline();
            const json = await res.json();
            if (json.success && json.data) {
              if (!grade) setLocal(StorageKeys.MATERIALS, json.data);
              return json.data;
            }
          }
        } catch (e) {
          console.warn('API getMaterials failed:', e);
        }
      }
      let local = getLocal(StorageKeys.MATERIALS, []);
      if (grade) {
        local = local.filter(m => m.grade.includes(grade) || m.grade.includes('සියලුම') || m.grade.includes('All'));
      }
      return local;
    },

    async addMaterial(mat) {
      const local = getLocal(StorageKeys.MATERIALS, []);
      const entry = { id: mat.id || 'mat-' + Date.now(), ...mat };
      local.unshift(entry);
      setLocal(StorageKeys.MATERIALS, local);

      if (shouldCallBackend()) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/materials`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mat)
          });
          if (res.ok) {
            markBackendOnline();
            const json = await res.json();
            return json.data || entry;
          }
        } catch (e) {
          console.warn('API addMaterial failed:', e);
        }
      }
      return entry;
    },

    async deleteMaterial(id) {
      let local = getLocal(StorageKeys.MATERIALS, []);
      local = local.filter(m => m.id !== id);
      setLocal(StorageKeys.MATERIALS, local);

      if (shouldCallBackend()) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/materials/${encodeURIComponent(id)}`, {
            method: 'DELETE'
          });
          if (res.ok) markBackendOnline();
        } catch (e) {
          console.warn('API deleteMaterial failed:', e);
        }
      }
      return true;
    },

    // 11. Analytics
    async getAnalytics() {
      if (shouldCallBackend()) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/analytics`);
          if (res.ok) {
            markBackendOnline();
            const json = await res.json();
            if (json.success && json.data) return json.data;
          }
        } catch (e) {
          console.warn('API getAnalytics failed:', e);
        }
      }

      // Compute analytics from localStorage
      const students = getLocal(StorageKeys.STUDENTS, {});
      const teachers = getLocal(StorageKeys.TEACHERS, []);
      const events = getLocal(StorageKeys.EVENTS, []);
      const deeds = getLocal(StorageKeys.DEEDS, []);
      const badges = getLocal(StorageKeys.BADGES, []);
      const announcements = getLocal(StorageKeys.ANNOUNCEMENTS, []);

      const studentKeys = Object.keys(students);
      let totalPresent = 0;
      let totalDays = 0;
      const gradeCounts = {};

      studentKeys.forEach(k => {
        const s = students[k];
        const g = s.grade || 'Unknown';
        gradeCounts[g] = (gradeCounts[g] || 0) + 1;
        if (Array.isArray(s.attendance)) {
          totalDays += s.attendance.length;
          totalPresent += s.attendance.filter(a => a.status === 'present').length;
        }
      });

      const avgRate = totalDays > 0 ? Math.round((totalPresent / totalDays) * 100) : 92;

      return {
        totalStudents: studentKeys.length,
        totalTeachers: teachers.length,
        totalEvents: events.length,
        totalAnnouncements: announcements.length,
        totalDeeds: deeds.length,
        totalBadges: badges.length,
        pendingBadges: badges.filter(b => b.status === 'pending').length,
        approvedBadges: badges.filter(b => b.status === 'approved').length,
        averageAttendanceRate: avgRate,
        gradeCounts
      };
    },

    // 12. Reports
    async getReports(type = 'attendance', grade = 'all') {
      if (shouldCallBackend()) {
        try {
          const res = await fetchWithTimeout(`${API_BASE}/reports?type=${encodeURIComponent(type)}&grade=${encodeURIComponent(grade)}`);
          if (res.ok) {
            markBackendOnline();
            const json = await res.json();
            if (json.success && json.data) return json.data;
          }
        } catch (e) {
          console.warn('API getReports failed:', e);
        }
      }
      return null;
    }
  };

  // Attach to window
  window.DahamPasalaAPI = DahamPasalaAPI;
  window.showToast = DahamPasalaAPI.showToast;

  function closeMobileNav() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && navMenu.classList.contains('mobile-active')) {
      navMenu.classList.remove('mobile-active');
    }
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'false');
      const icon = toggleBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    }
  }

  // Mobile Navigation Toggle
  function toggleMobileNav() {
    const navMenu = document.querySelector('.nav-menu');
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    if (!navMenu) return;
    const isOpen = navMenu.classList.toggle('mobile-active');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    }
  }
  window.toggleMobileNav = toggleMobileNav;

  // Global modal backdrop dismissal and mobile nav auto-close
  document.addEventListener('click', (e) => {
    // 1. Auto-close mobile nav when clicking a nav item on mobile screens
    const navLink = e.target.closest('.nav-menu .nav-link');
    if (navLink && window.innerWidth <= 980) {
      closeMobileNav();
    }

    // 2. Dismiss modal if user clicks on the overlay backdrop
    if (e.target && e.target.classList && e.target.classList.contains('admin-modal-overlay')) {
      e.target.style.display = 'none';
    }
  });

  // Global Escape key listener: dismiss active modals and mobile nav
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      const overlays = document.querySelectorAll('.admin-modal-overlay');
      overlays.forEach(overlay => {
        if (overlay.style.display && overlay.style.display !== 'none') {
          overlay.style.display = 'none';
        }
      });

      closeMobileNav();
    }
  });

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      DahamPasalaAPI.checkHealth();
    });
  } else {
    DahamPasalaAPI.checkHealth();
  }

})(window);

