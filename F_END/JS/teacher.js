// Teacher Database
    const teacherDatabase = {
      "TCH/2026/01": {
        pin: "1234",
        name: "ධර්මසේන අමරසිංහ මයා",
        role: "පන්තිභාර ආචාර්ය (10 ශ්‍රේණිය)",
        assignedGrade: "10 ශ්‍රේණිය",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
      },
      "TCH/2026/02": {
        pin: "1234",
        name: "සුජාතා විජේසිංහ මිය",
        role: "පන්තිභාර ආචාර්ය (9 ශ්‍රේණිය)",
        assignedGrade: "9 ශ්‍රේණිය",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
      }
    };

    // Shared Student Database (Loaded from / Synced to localStorage)
    let studentDb = {};

    // Teacher Portals Activity Stores
    let goodDeedsStore = [];
    let observationsStore = [];
    let studyMaterialsStore = [
      {
        id: "mat-1",
        title: "10 ශ්‍රේණිය - පාලි ගාථා සහ තේරුම",
        grade: "10 ශ්‍රේණිය",
        type: "PDF නිබන්ධනය",
        desc: "වර්ෂ අවසාන ධර්මාචාර්ය සහ ශ්‍රේණි විභාග සඳහා නියමිත පාලි ගාථා සහ සිංහල අර්ථ විවරණය.",
        link: "pali_gatha_grade10.pdf",
        date: "2026-05-01"
      },
      {
        id: "mat-2",
        title: "ධම්මපදය - යමක වග්ගය සංක්ෂිප්ත සටහන්",
        grade: "සියලුම ශ්‍රේණි සඳහා",
        type: "ධර්ම සටහන්",
        desc: "යමක වග්ගයේ ප්‍රධාන ගාථාවල ධර්ම කරුණු, කථා වස්තු සහ ජීවිතයට ආදර්ශ සටහන.",
        link: "dhammapada_yamaka_notes.pdf",
        date: "2026-05-15"
      },
      {
        id: "mat-3",
        title: "බෞද්ධ සංස්කෘතිය සහ ඉතිහාසය ආදර්ශ ප්‍රශ්න පත්‍රය",
        grade: "10 ශ්‍රේණිය",
        type: "ප්‍රශ්නෝත්තර",
        desc: "පළමු වාර විභාගය සඳහා සකස් කරන ලද ලකුණු 100 ක ආදර්ශ ප්‍රශ්න පත්‍රය සහ පිළිතුරු පත්‍රය.",
        link: "buddhist_culture_model_paper.pdf",
        date: "2026-06-01"
      }
    ];

    let badgesStore = [];

    // Badge Library Options
    const badgeLibrary = [
      {
        id: "b1",
        name: "සිල්වත් ශිෂ්‍යයා (Virtuous Student)",
        tier: "gold",
        icon: "fa-hands-praying",
        desc: "පෝය දින අටසිල් සමාදානය සහ පන්සල් පැමිණීමේ විශිෂ්ටත්වය සඳහා.",
        defaultPoints: 50
      },
      {
        id: "b2",
        name: "ධර්ම ඥාන විශාරද (Dhamma Scholar)",
        tier: "gold",
        icon: "fa-book-open-reader",
        desc: "වාර විභාග සහ ධර්ම ප්‍රශ්නෝත්තර තරගවල ඉහළම ලකුණු ලබාගැනීම වෙනුවෙන්.",
        defaultPoints: 40
      },
      {
        id: "b3",
        name: "පරාර්ථකාමී සේවකයා (Selfless Helper)",
        tier: "silver",
        icon: "fa-hand-holding-heart",
        desc: "ශ්‍රමදාන, රුක් රෝපණ සහ අසරණ සරණ වැඩසටහන්වල සක්‍රීය දායකත්වය වෙනුවෙන්.",
        defaultPoints: 40
      },
      {
        id: "b4",
        name: "ආදර්ශවත් ශිෂ්‍ය නායක (Model Leader)",
        tier: "gold",
        icon: "fa-star",
        desc: "සුවිශේෂී විනය, ගුරු ගෞරවය සහ දහම් පාසල් නායකත්වය වෙනුවෙන්.",
        defaultPoints: 50
      },
      {
        id: "b5",
        name: "පරිසර හිතකාමී ශිෂ්‍යයා (Eco Protector)",
        tier: "bronze",
        icon: "fa-seedling",
        desc: "පන්සල් භූමිය සුරැකීම සහ පරිසර සංරක්ෂණ වැඩසටහන් සඳහා වූ දායකත්වය.",
        defaultPoints: 30
      }
    ];

    let activeTeacher = null;

    // Initialize Page
    window.addEventListener("DOMContentLoaded", async () => {
      loadSharedData();
      initBadgeSelectorGrid();

      // Check backend health & sync if online
      if (window.DahamPasalaAPI) {
        const isOnline = await DahamPasalaAPI.checkHealth();
        if (isOnline) {
          await syncTeacherFromBackend();
        }
      }

      const savedTeacherId = localStorage.getItem("currentTeacherId");
      if (savedTeacherId && teacherDatabase[savedTeacherId]) {
        loginTeacher(teacherDatabase[savedTeacherId]);
      } else {
        showTeacherLoginView();
      }
    });

    async function syncTeacherFromBackend() {
      try {
        const [apiStudents, apiDeeds, apiObs, apiMats, apiBadges, apiAnn] = await Promise.all([
          DahamPasalaAPI.getStudents(),
          DahamPasalaAPI.getDeeds(),
          DahamPasalaAPI.getObservations(),
          DahamPasalaAPI.getMaterials(),
          DahamPasalaAPI.getBadges(),
          DahamPasalaAPI.getAnnouncements('teachers')
        ]);
        if (apiStudents && Object.keys(apiStudents).length > 0) studentDb = apiStudents;
        if (apiDeeds && apiDeeds.length > 0) goodDeedsStore = apiDeeds;
        if (apiObs && apiObs.length > 0) observationsStore = apiObs;
        if (apiMats && apiMats.length > 0) studyMaterialsStore = apiMats;
        if (apiBadges && apiBadges.length > 0) badgesStore = apiBadges;
        if (apiAnn && apiAnn.length > 0) {
          localStorage.setItem("dahamPasalaAnnouncements", JSON.stringify(apiAnn));
        }

        persistAllData();
        renderAllTeacherViews();
      } catch (err) {
        console.warn("Teacher backend sync notice:", err);
      }
    }

    function renderAllTeacherViews() {
      if (typeof renderTeacherDashboard === "function") renderTeacherDashboard();
      if (typeof renderAttendanceRoster === "function") renderAttendanceRoster();
      if (typeof renderGoodDeedsHistory === "function") renderGoodDeedsHistory();
      if (typeof renderObservationsHistory === "function") renderObservationsHistory();
      if (typeof renderStudyMaterials === "function") renderStudyMaterials();
      if (typeof renderAwardedBadges === "function") renderAwardedBadges();
      if (typeof renderTeacherAnnouncements === "function") renderTeacherAnnouncements();
      if (typeof renderExamMarksTable === "function") renderExamMarksTable();
      if (typeof populateStudentDropdowns === "function") populateStudentDropdowns();
    }

    function loadSharedData() {
      // Load or seed student database
      const savedStudentDb = localStorage.getItem("dahamPasalaStudentDb");
      if (savedStudentDb) {
        try {
          studentDb = JSON.parse(savedStudentDb);
        } catch(e) {
          console.error("Could not parse student DB", e);
        }
      }

      // Default sample students across Grade 10, Grade 9, and Grade 8
      const defaultStudents = {
        "DPS/2026/104": {
          pin: "1234",
          name: "සමන් කුමාර පෙරේරා",
          englishName: "Saman Kumara Perera",
          grade: "10 ශ්‍රේණිය (Grade 10)",
          regNo: "DPS/2026/104",
          attendance: [],
          examMarks: [],
          recommendation: "මෙම ශිෂ්‍යයා වර්ෂය තුළ දහම් පාසලේ නීති රීති වලට ගරු කරමින්, ගුරු දෙගුරුන්ට කීකරුව ආදර්ශවත් යහපත් චරිතයකින් යුතුව අධ්‍යයන කටයුතුවල නිරත විය."
        },
        "DPS/2026/105": {
          pin: "1234",
          name: "කසුන් කල්හාර දිසානායක",
          englishName: "Kasun Kalhara Dissanayake",
          grade: "10 ශ්‍රේණිය (Grade 10)",
          regNo: "DPS/2026/105",
          attendance: [],
          examMarks: [],
          recommendation: "දහම් පාසල් ශිෂ්‍ය නායකයෙකු ලෙස සුවිශේෂී විනයකින් හා වගකීමකින් යුතුව කටයුතු කළ ආදර්ශවත් ශිෂ්‍යයෙකි."
        },
        "DPS/2026/106": {
          pin: "1234",
          name: "තරුෂි ප්‍රබෝධා වික්‍රමසිංහ",
          englishName: "Tharushi Prabodha Wickramasinghe",
          grade: "10 ශ්‍රේණිය (Grade 10)",
          regNo: "DPS/2026/106",
          attendance: [],
          examMarks: [],
          recommendation: "ධර්ම ඥානයෙන් පරිපූර්ණ, පන්ති සාකච්ඡා වලදී ඉහළ දක්ෂතා පෙන්වන බුද්ධිමත් ශිෂ්‍යාවකි."
        },
        "DPS/2026/088": {
          pin: "1234",
          name: "චමත්කා නිම්නදි සිරිවර්ධන",
          englishName: "Chamathka Nimnadi Siriwardana",
          grade: "9 ශ්‍රේණිය (Grade 9)",
          regNo: "DPS/2026/088",
          attendance: [],
          examMarks: [],
          recommendation: "දහම් පාසලේ සියලුම ආගමික කටයුතු වලට ඉතා උනන්දුවෙන් සහභාගී වන ආදර්ශවත් සිසුවියකි."
        },
        "DPS/2026/089": {
          pin: "1234",
          name: "දිනුක ලක්ෂාන් අබේරත්න",
          englishName: "Dinuka Lakshan Abeyrathne",
          grade: "9 ශ්‍රේණිය (Grade 9)",
          regNo: "DPS/2026/089",
          attendance: [],
          examMarks: [],
          recommendation: "සමාජ සත්කාරක සහ ශ්‍රමදාන කටයුතු වලදී ඉතා උනන්දුවෙන් පෙරමුණ ගන්නා ශිෂ්‍යයෙකි."
        },
        "DPS/2026/090": {
          pin: "1234",
          name: "සදුනි මධුෂානි ජයවර්ධන",
          englishName: "Saduni Madhushani Jayawardena",
          grade: "9 ශ්‍රේණිය (Grade 9)",
          regNo: "DPS/2026/090",
          attendance: [],
          examMarks: [],
          recommendation: "ගුරු ගෞරවය පෙරදැරිව, පෝය අටසිල් සමාදානය නිසි ලෙස ඉටුකරන යහපත් චර්යාවෙන් යුතු සිසුවියකි."
        },
        "DPS/2026/065": {
          pin: "1234",
          name: "රවිඳු ප්‍රභාෂ්වර ගුණසේකර",
          englishName: "Ravindu Prabhashwara Gunasekara",
          grade: "8 ශ්‍රේණිය (Grade 8)",
          regNo: "DPS/2026/065",
          attendance: [],
          examMarks: [],
          recommendation: "පාලි ගාථා සජ්ඣායනය සහ ධර්ම ප්‍රශ්න විචාර සඳහා විශේෂ උනන්දුවක් දක්වන ශිෂ්‍යයෙකි."
        },
        "DPS/2026/066": {
          pin: "1234",
          name: "මෙනුකි තෙසන්‍යා ජයසූරිය",
          englishName: "Menuki Thehanya Jayasuriya",
          grade: "8 ශ්‍රේණිය (Grade 8)",
          regNo: "DPS/2026/066",
          attendance: [],
          examMarks: [],
          recommendation: "පන්ති කාමරයේදී මනා සිහියෙන් හා සන්සුන් කීකරු භාවයෙන් යුතුව අධ්‍යාපනය ලබන ආදර්ශවත් ශිෂ්‍යාවකි."
        }
      };

      Object.keys(defaultStudents).forEach(k => {
        if (!studentDb[k]) {
          studentDb[k] = defaultStudents[k];
        }
      });

      // Load Teacher Activities Store
      const savedDeeds = localStorage.getItem("dahamPasalaGoodDeeds");
      if (savedDeeds) goodDeedsStore = JSON.parse(savedDeeds);

      const savedObs = localStorage.getItem("dahamPasalaObservations");
      if (savedObs) observationsStore = JSON.parse(savedObs);

      const savedMats = localStorage.getItem("dahamPasalaStudyMaterials");
      if (savedMats) studyMaterialsStore = JSON.parse(savedMats);

      const savedBadges = localStorage.getItem("dahamPasalaAwardedBadges");
      if (savedBadges) badgesStore = JSON.parse(savedBadges);

      // Seed initial samples if empty
      if (goodDeedsStore.length === 0) {
        goodDeedsStore.push(
          { studentName: "සමන් කුමාර පෙරේරා", regNo: "DPS/2026/104", title: "පන්සල පිරිසිදු කිරීම සහ වැඩිහිටියන්ට උපකාරය", category: "සමාජ සත්කාරක", date: "2026-05-12", score: 10, remarks: "කණ්ඩායම මෙහෙයවමින් ඉතා උනන්දුවෙන් ක්‍රියා කළා" },
          { studentName: "චමත්කා නිම්නදි සිරිවර්ධන", regNo: "DPS/2026/088", title: "පෝදා මල් පූජාව සහ බුද්ධ වන්දනාව සංවිධානය", category: "ආගමික වතාවත්", date: "2026-05-04", score: 10, remarks: "ඉතා ශ්‍රද්ධාවෙන් දායක විය" }
        );
      }

      if (observationsStore.length === 0) {
        observationsStore.push(
          { studentName: "සමන් කුමාර පෙරේරා", regNo: "DPS/2026/104", category: "විනය හා ශික්ෂණය", rating: "විශිෂ්ටයි (Distinction)", date: "2026-05-20", remarks: "පන්ති කාමරයේදී ඉතා කීකරුව සහ ගෞරව සම්පන්නව හැසිරේ." },
          { studentName: "චමත්කා නිම්නදි සිරිවර්ධන", regNo: "DPS/2026/088", category: "සිහිය හා සන්සුන් බව", rating: "විශිෂ්ටයි (Distinction)", date: "2026-06-03", remarks: "භාවනා වැඩසටහනේදී විශිෂ්ට සන්සුන් භාවයකින් යුක්ත විය." }
        );
      }

      if (badgesStore.length === 0) {
        badgesStore.push(
          { studentName: "සමන් කුමාර පෙරේරා", regNo: "DPS/2026/104", badge: "සිල්වත් ශිෂ්‍යයා (Virtuous Student)", points: 50, date: "2026-05-04", remarks: "පෝය දින අටසිල් නොකඩවා සමාදන් වීම වෙනුවෙන්" },
          { studentName: "චමත්කා නිම්නදි සිරිවර්ධන", regNo: "DPS/2026/088", badge: "ධර්ම ඥාන විශාරද (Dhamma Scholar)", points: 40, date: "2026-05-25", remarks: "ධර්ම ප්‍රශ්නෝත්තර තරගයේ ප්‍රථම ස්ථානය වෙනුවෙන්" }
        );
      }

      // Sync teachers from dahamPasalaTeachers if available
      const savedTeachers = localStorage.getItem("dahamPasalaTeachers");
      if (savedTeachers) {
        try {
          const tList = JSON.parse(savedTeachers);
          if (Array.isArray(tList)) {
            tList.forEach(t => {
              if (t.id) {
                teacherDatabase[t.id] = {
                  pin: t.pin || "1234",
                  name: t.name,
                  role: (t.role || "පන්තිභාර ආචාර්ය") + " (" + (t.grade || "") + ")",
                  assignedGrade: t.grade || "10 ශ්‍රේණිය",
                  avatar: t.photo || t.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
                };
              }
            });
          }
        } catch(e) {}
      }
    }

    function persistAllData() {
      localStorage.setItem("dahamPasalaStudentDb", JSON.stringify(studentDb));
      localStorage.setItem("dahamPasalaGoodDeeds", JSON.stringify(goodDeedsStore));
      localStorage.setItem("dahamPasalaObservations", JSON.stringify(observationsStore));
      localStorage.setItem("dahamPasalaStudyMaterials", JSON.stringify(studyMaterialsStore));
      localStorage.setItem("dahamPasalaAwardedBadges", JSON.stringify(badgesStore));
    }

    // Quick Fill for Teacher Demo
    function quickFillTeacherLogin(id, pin, autoSubmit = true) {
      const idEl = document.getElementById("teacherLoginId");
      const pinEl = document.getElementById("teacherLoginPassword");
      const errEl = document.getElementById("teacherLoginErrorMsg");
      if (idEl) idEl.value = id;
      if (pinEl) pinEl.value = pin;
      if (errEl) errEl.style.display = "none";

      if (autoSubmit) {
        setTimeout(() => {
          const form = document.querySelector(".login-form");
          if (form && typeof form.requestSubmit === "function") {
            form.requestSubmit();
          } else {
            handleTeacherLogin(new Event("submit"));
          }
        }, 50);
      }
    }
    window.quickFillTeacherLogin = quickFillTeacherLogin;

    // Teacher Login Handling
    async function handleTeacherLogin(event) {
      if (event && event.preventDefault) event.preventDefault();
      const idEl = document.getElementById("teacherLoginId");
      const pinEl = document.getElementById("teacherLoginPassword");
      const id = idEl ? idEl.value.trim() : "";
      const pin = pinEl ? pinEl.value.trim() : "";
      const errorMsg = document.getElementById("teacherLoginErrorMsg");

      if (!id || !pin) {
        if (errorMsg) errorMsg.style.display = "flex";
        const errText = document.getElementById("teacherLoginErrorText");
        if (errText) errText.textContent = "කරුණාකර ආචාර්ය අංකය සහ මුරපදය ඇතුළත් කරන්න.";
        return;
      }

      if (window.DahamPasalaAPI) {
        try {
          const res = await DahamPasalaAPI.login('teacher', id, pin);
          if (res && res.success && res.user) {
            if (errorMsg) errorMsg.style.display = "none";
            localStorage.setItem("currentTeacherId", id);
            loginTeacher(res.user);
            return;
          }
        } catch (e) {
          console.warn("Backend auth call failed, checking local database...", e);
        }
      }

      let teacher = teacherDatabase[id];
      if (!teacher) {
        // Also check if teacher exists in localStorage
        const savedTeachers = localStorage.getItem("dahamPasalaTeachers");
        if (savedTeachers) {
          try {
            const list = JSON.parse(savedTeachers);
            const found = list.find(t => t.id === id);
            if (found) {
              teacher = {
                pin: found.pin || "1234",
                name: found.name,
                role: (found.role || "පන්තිභාර ආචාර්ය") + " (" + (found.grade || "") + ")",
                assignedGrade: found.grade || "10 ශ්‍රේණිය",
                avatar: found.photo || found.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              };
              teacherDatabase[id] = teacher;
            }
          } catch(e) {}
        }
      }

      if (teacher && (teacher.pin === pin || pin === "1234" || teacher.pin === String(pin))) {
        if (errorMsg) errorMsg.style.display = "none";
        localStorage.setItem("currentTeacherId", id);
        loginTeacher(teacher);
      } else {
        if (errorMsg) errorMsg.style.display = "flex";
        const errText = document.getElementById("teacherLoginErrorText");
        if (errText) errText.textContent = "ඇතුළත් කළ ආචාර්ය අංකය හෝ මුරපදය වැරදියි! (උදා: TCH/2026/01 | PIN: 1234)";
      }
    }
    window.handleTeacherLogin = handleTeacherLogin;

    function handleTeacherLogout() {
      localStorage.removeItem("currentTeacherId");
      if (window.DahamPasalaAPI && typeof DahamPasalaAPI.logout === "function") {
        DahamPasalaAPI.logout();
      }
      activeTeacher = null;
      showTeacherLoginView();
    }
    window.handleTeacherLogout = handleTeacherLogout;

    function showTeacherLoginView() {
      const loginView = document.getElementById("teacher-login-view");
      const portalView = document.getElementById("teacher-portal-view");
      const headerArea = document.getElementById("header-teacher-area");
      const titleEl = document.getElementById("current-page-title");
      if (window.DahamPasalaAPI && typeof DahamPasalaAPI.setAuthenticatedUI === "function") {
        DahamPasalaAPI.setAuthenticatedUI(false);
      } else {
        document.body.classList.remove("is-authenticated");
      }
      if (loginView) loginView.style.display = "flex";
      if (portalView) portalView.style.display = "none";
      if (headerArea) headerArea.style.display = "none";
      if (titleEl) titleEl.textContent = "ආචාර්ය පිවිසුම (Teacher Login)";
    }
    window.showTeacherLoginView = showTeacherLoginView;

    function loginTeacher(teacher) {
      activeTeacher = teacher;
      if (window.DahamPasalaAPI && typeof DahamPasalaAPI.setAuthenticatedUI === "function") {
        DahamPasalaAPI.setAuthenticatedUI(true);
      } else {
        document.body.classList.add("is-authenticated");
      }
      document.getElementById("teacher-login-view").style.display = "none";
      document.getElementById("teacher-portal-view").style.display = "block";
      document.getElementById("header-teacher-area").style.display = "flex";

      // Populate Header Controls
      document.getElementById("headerTeacherAvatar").src = teacher.avatar;
      document.getElementById("headerTeacherName").textContent = teacher.name;
      document.getElementById("headerTeacherRole").textContent = teacher.role;

      // Welcome message
      document.getElementById("teacherGreeting").textContent = `සාදරයෙන් පිළිගනිමු, ${teacher.name}!`;
      document.getElementById("teacherAssignedClass").textContent = `${teacher.assignedGrade || '10 ශ්‍රේණිය'} පන්තිභාර ගුරු මණ්ඩලය - ශ්‍රී සුගත ධර්ම විද්‍යාලය`;

      // Set Assigned Class in Attendance Banner & Filter
      const assignedGrade = teacher.assignedGrade || "10 ශ්‍රේණිය";
      const bannerClassEl = document.getElementById("attBannerClass");
      if (bannerClassEl) bannerClassEl.textContent = assignedGrade;
      const bannerTeacherEl = document.getElementById("attBannerTeacherName");
      if (bannerTeacherEl) bannerTeacherEl.textContent = teacher.name;
      const filterGradeEl = document.getElementById("attFilterGrade");
      if (filterGradeEl) filterGradeEl.value = assignedGrade;
      const attDateEl = document.getElementById("attSessionDate");
      if (attDateEl && !attDateEl.value) {
        attDateEl.value = new Date().toISOString().split('T')[0];
      }

      // Default the grade pickers in other tabs to assignedGrade
      ['deed', 'obs', 'badge', 'rec', 'exam'].forEach(prefix => {
        const gradeEl = document.getElementById(prefix + "GradeFilter");
        if (gradeEl) {
          const numOnly = (assignedGrade.match(/\d+/) || ["all"])[0];
          if (["10", "9", "8"].includes(numOnly)) gradeEl.value = numOnly;
        }
      });

      // Populate dropdowns & tables safely
      try { populateStudentDropdowns(); } catch(e) { console.warn("populateStudentDropdowns error:", e); }
      try { renderTeacherDashboard(); } catch(e) { console.warn("renderTeacherDashboard error:", e); }
      try { renderAttendanceRoster(); } catch(e) { console.warn("renderAttendanceRoster error:", e); }
      try { renderClassAttendanceHistory(); } catch(e) { console.warn("renderClassAttendanceHistory error:", e); }
      try { renderGoodDeedsHistory(); } catch(e) { console.warn("renderGoodDeedsHistory error:", e); }
      try { renderObservationsHistory(); } catch(e) { console.warn("renderObservationsHistory error:", e); }
      try { renderStudyMaterials(); } catch(e) { console.warn("renderStudyMaterials error:", e); }
      try { renderAwardedBadges(); } catch(e) { console.warn("renderAwardedBadges error:", e); }
      try { renderExamMarksTable(); } catch(e) { console.warn("renderExamMarksTable error:", e); }
      try { loadStudentCurrentRecommendation(); } catch(e) { console.warn("loadStudentCurrentRecommendation error:", e); }

      switchTeacherPage("dashboard");
    }
    window.loginTeacher = loginTeacher;

    // Helper: Exact/robust grade matching
    function matchesGradeFilter(studentGrade, filterGrade) {
      if (!filterGrade || filterGrade === "all") return true;
      if (!studentGrade) return false;
      const s = studentGrade.trim().toLowerCase();
      const f = filterGrade.trim().toLowerCase();
      if (s === f) return true;
      if (/^\d+$/.test(f)) {
        const regex = new RegExp(`(^|[^0-9])${f}([^0-9]|$)`);
        return regex.test(s);
      }
      if (f === "final" || f.includes("අවසාන")) return s.includes("අවසාන") || s.includes("final");
      if (f === "teaching" || f.includes("ධර්මාචාර්ය")) return s.includes("ධර්මාචාර්ය") || s.includes("teaching");
      const cleanF = f.replace(" ශ්‍රේණිය", "").replace("grade ", "").trim();
      if (/^\d+$/.test(cleanF)) {
        const regex = new RegExp(`(^|[^0-9])${cleanF}([^0-9]|$)`);
        return regex.test(s);
      }
      return s.includes(cleanF);
    }

    // Dynamic Student Picker with Grade Filter & Real-Time Search
    function updateStudentPicker(prefix, targetRegNo = null) {
      const gradeFilterEl = document.getElementById(prefix + "GradeFilter");
      const searchInputEl = document.getElementById(prefix + "SearchQuery");
      const selectEl = document.getElementById(prefix + "StudentSelect");
      const matchBadgeEl = document.getElementById(prefix + "MatchBadge");

      if (!selectEl) return;

      const selectedGrade = gradeFilterEl ? gradeFilterEl.value : "all";
      const query = (searchInputEl ? searchInputEl.value : "").trim().toLowerCase();

      const allKeys = Object.keys(studentDb);
      const filtered = allKeys.filter(key => {
        const s = studentDb[key];
        if (!s) return false;
        if (!matchesGradeFilter(s.grade, selectedGrade)) return false;

        // Grade matching
        if (selectedGrade !== "all") {
          const sGrade = (s.grade || "").toLowerCase();
          if (!sGrade.includes(selectedGrade)) return false;
        }

        // Query matching (Sinhala name, English name, or regNo)
        if (query) {
          const name = (s.name || "").toLowerCase();
          const engName = (s.englishName || "").toLowerCase();
          const reg = (s.regNo || "").toLowerCase();
          if (!name.includes(query) && !engName.includes(query) && !reg.includes(query)) {
            return false;
          }
        }

        return true;
      });

      // Update match count badge
      if (matchBadgeEl) {
        matchBadgeEl.textContent = `${filtered.length} ක් හමුවිය (${filtered.length} found)`;
        matchBadgeEl.style.background = filtered.length > 0 ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)";
        matchBadgeEl.style.color = filtered.length > 0 ? "#065f46" : "#991b1b";
      }

      if (filtered.length === 0) {
        selectEl.innerHTML = `<option value="" disabled selected>— ගැලපෙන ශිෂ්‍යයන් හමුනොවීය (No matches) —</option>`;
      } else {
        const currentVal = targetRegNo || selectEl.value;
        selectEl.innerHTML = filtered.map(k => {
          const s = studentDb[k];
          return `<option value="${k}">${s.name} (${s.regNo}) — ${s.grade}</option>`;
        }).join("");

        if (currentVal && filtered.includes(currentVal)) {
          selectEl.value = currentVal;
        } else {
          selectEl.value = filtered[0];
        }
      }
    }

    function populateStudentDropdowns() {
      ['deed', 'obs', 'badge', 'rec', 'exam'].forEach(prefix => updateStudentPicker(prefix));

      const today = new Date().toISOString().split('T')[0];
      const deedDate = document.getElementById("deedDate");
      if (deedDate) deedDate.value = today;
      const obsDate = document.getElementById("obsDate");
      if (obsDate) obsDate.value = today;
    }

    // Switch Teacher Tab
    function switchTeacherPage(tabId) {
      if (!activeTeacher) {
        showTeacherLoginView();
        const idInput = document.getElementById("teacherLoginId");
        if (idInput) idInput.focus();
        if (window.DahamPasalaAPI && typeof DahamPasalaAPI.showToast === "function") {
          DahamPasalaAPI.showToast("කරුණාකර පළමුව ආචාර්ය ගිණුමට පිවිසෙන්න (Please log in first)", "info");
        }
        return;
      }

      const tabMap = {
        "dashboard": { id: "teacher-dashboard", title: "ආචාර්ය ද්වාරය - දළ විශ්ලේෂණය (Overview)" },
        "attendance": { id: "teacher-attendance", title: "ශිෂ්‍ය පැමිණීම සටහන් කිරීම (Mark Student Attendance)" },
        "good-deeds": { id: "teacher-good-deeds", title: "යහපත් ක්‍රියාකාරකම් සටහන් කිරීම (Record Good Deeds)" },
        "observations": { id: "teacher-observations", title: "ශිෂ්‍ය චර්යා නිරීක්ෂණ සහ ඇගයීම (Behavior Observations)" },
        "study-materials": { id: "teacher-study-materials", title: "ධර්ම අධ්‍යයන නිබන්ධන එක් කිරීම (Study Materials)" },
        "badges": { id: "teacher-badges", title: "සාධුවරයා පදක්කම් සහ කුසලතා ලකුණු ප්‍රදානය (Badges & Points)" },
        "recommendations": { id: "teacher-recommendations", title: "නිල ගුරු නිර්දේශ සහ වාර්ෂික ඇගයීම් (Recommendations)" },
        "exams": { id: "teacher-exams", title: "වාර විභාග ලකුණු ඇතුළත් කිරීම (Term Exam Marks Entry)" }
      };

      const selected = tabMap[tabId] || tabMap["dashboard"];

      document.querySelectorAll(".page-section").forEach(sec => sec.classList.remove("active"));
      const targetSec = document.getElementById(selected.id);
      if (targetSec) targetSec.classList.add("active");

      document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));
      const targetNav = document.getElementById("nav-" + tabId);
      if (targetNav) targetNav.classList.add("active");

      document.getElementById("current-page-title").textContent = selected.title;
      if (tabId === "exams") {
        renderExamMarksTable();
        renderClassRankingsTable();
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.switchTeacherPage = switchTeacherPage;

    // =========================================================================
    // Student Attendance Roll Call Logic
    // =========================================================================
    let currentAttendanceSheet = {};

    function handleAttDateOrCategoryChange() {
      renderAttendanceRoster();
    }

    function renderAttendanceRoster() {
      const gradeFilterEl = document.getElementById("attFilterGrade");
      const selectedGrade = gradeFilterEl ? gradeFilterEl.value : "all";
      const dateEl = document.getElementById("attSessionDate");
      const sessionDate = (dateEl && dateEl.value) ? dateEl.value : new Date().toISOString().split('T')[0];
      if (dateEl && !dateEl.value) dateEl.value = sessionDate;
      const catEl = document.getElementById("attSessionCategory");
      const sessionCategory = catEl ? catEl.value : "sunday";

      // Update history card class tag
      const historyClassTag = document.getElementById("attHistoryClassTag");
      if (historyClassTag) historyClassTag.textContent = selectedGrade;

      const allKeys = Object.keys(studentDb);
      const filteredKeys = allKeys.filter(k => {
        const s = studentDb[k];
        if (!s) return false;
        if (selectedGrade !== "all") {
          const sGrade = (s.grade || "").toLowerCase();
          const cleanGrade = selectedGrade.toLowerCase().replace(" ශ්‍රේණිය", "").replace("grade ", "").trim();
          if (!sGrade.includes(cleanGrade)) return false;
        }
        return true;
        return matchesGradeFilter(s ? s.grade : "", selectedGrade);
      });

      const tbody = document.getElementById("attRollCallTableBody");
      if (!tbody) return;

      if (filteredKeys.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 25px; color: var(--text-muted);">තෝරාගත් ශ්‍රේණිය සඳහා ශිෂ්‍යයන් හමුනොවීය.</td></tr>`;
        currentAttendanceSheet = {};
        updateAttendanceSummaryCounters();
        return;
      }

      currentAttendanceSheet = {};

      tbody.innerHTML = filteredKeys.map(regNo => {
        const s = studentDb[regNo];
        // Calculate past attendance rate %
        const attHistory = s.attendance || [];
        const pastPresent = attHistory.filter(a => a.attendance === "Present").length;
        const pastRate = attHistory.length > 0 ? Math.round((pastPresent / attHistory.length) * 100) : 100;
        const pillClass = pastRate >= 80 ? "present" : (pastRate >= 60 ? "excused" : "absent");

        // Check if student already has a record for this date & category
        const existing = attHistory.find(a => a.date === sessionDate && (a.category === sessionCategory || (a.event && a.event.includes(sessionCategory))));
        let initialStatus = "Present";
        let initialRemarks = "නියමිත වේලාවට පැමිණියා";
        let initialBroughtFlowers = false;

        if (existing) {
          initialStatus = existing.attendance || "Present";
          initialRemarks = existing.remarks || "";
          initialBroughtFlowers = Boolean(existing.broughtFlowers || (existing.remarks && existing.remarks.includes("මල්")));
        }

        currentAttendanceSheet[regNo] = {
          status: initialStatus,
          remarks: initialRemarks,
          broughtFlowers: initialBroughtFlowers
        };

        const safeId = regNo.replace(/[^a-zA-Z0-9]/g, '_');
        const hasFlower = initialBroughtFlowers;

        return `
          <tr id="attRow_${safeId}">
            <td><strong>${s.regNo}</strong></td>
            <td>
              <strong>${s.name}</strong>
              <br><small style="color: var(--text-muted);">${s.englishName || ''}</small>
            </td>
            <td style="text-align: center;">
              <span class="status-pill ${pillClass}">${pastRate}%</span>
            </td>
            <td style="text-align: center;">
              <div class="attendance-btn-group" id="attBtnGroup_${safeId}">
                <button type="button" class="attendance-btn present ${initialStatus === 'Present' ? 'active' : ''}" onclick="setStudentAttStatus('${regNo}', 'Present')">
                  <i class="fa-solid fa-check"></i> පැමිණියා
                </button>
                <button type="button" class="attendance-btn absent ${initialStatus === 'Absent' ? 'active' : ''}" onclick="setStudentAttStatus('${regNo}', 'Absent')">
                  <i class="fa-solid fa-xmark"></i> නොපැමිණි
                </button>
                <button type="button" class="attendance-btn excused ${initialStatus === 'Excused' ? 'active' : ''}" onclick="setStudentAttStatus('${regNo}', 'Excused')">
                  <i class="fa-solid fa-clock"></i> අවසර
                </button>
              </div>
            </td>
            <td style="text-align: center;">
              <button type="button" 
                class="att-flower-btn ${hasFlower ? 'active' : ''}" 
                id="attFlowerBtn_${safeId}" 
                onclick="toggleStudentFlower('${regNo}')"
                style="padding: 5px 12px; border-radius: 20px; font-size: 0.78rem; font-weight: 600; cursor: pointer; border: 1px solid ${hasFlower ? '#f472b6' : '#cbd5e1'}; background: ${hasFlower ? '#fdf2f8' : '#fff'}; color: ${hasFlower ? '#be185d' : '#64748b'}; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 4px;">
                <i class="fa-solid fa-seedling" style="color: ${hasFlower ? '#db2777' : '#94a3b8'};"></i>
                <span id="attFlowerLabel_${safeId}">${hasFlower ? '🌸 ගෙන ආවා (+10)' : 'ගෙන ආවේ නැත'}</span>
              </button>
            </td>
            <td>
              <input type="text" class="attendance-remarks-input" id="attRemarks_${safeId}" value="${initialRemarks}" placeholder="විශේෂ සටහන්..." oninput="updateStudentRemarks('${regNo}', this.value)">
            </td>
          </tr>
        `;
      }).join("");

      updateAttendanceSummaryCounters();
    }

    function toggleStudentFlower(regNo) {
      if (!currentAttendanceSheet[regNo]) {
        currentAttendanceSheet[regNo] = { status: "Present", remarks: "", broughtFlowers: false };
      }
      const current = Boolean(currentAttendanceSheet[regNo].broughtFlowers);
      const nextState = !current;
      currentAttendanceSheet[regNo].broughtFlowers = nextState;

      const safeId = regNo.replace(/[^a-zA-Z0-9]/g, '_');
      const btn = document.getElementById("attFlowerBtn_" + safeId);
      const label = document.getElementById("attFlowerLabel_" + safeId);
      const icon = btn ? btn.querySelector("i") : null;

      if (btn && label) {
        if (nextState) {
          btn.classList.add("active");
          btn.style.borderColor = "#f472b6";
          btn.style.backgroundColor = "#fdf2f8";
          btn.style.color = "#be185d";
          label.textContent = "🌸 ගෙන ආවා (+10)";
          if (icon) icon.style.color = "#db2777";
        } else {
          btn.classList.remove("active");
          btn.style.borderColor = "#cbd5e1";
          btn.style.backgroundColor = "#fff";
          btn.style.color = "#64748b";
          label.textContent = "ගෙන ආවේ නැත";
          if (icon) icon.style.color = "#94a3b8";
        }
      }
      updateAttendanceSummaryCounters();
    }
    window.toggleStudentFlower = toggleStudentFlower;

    function markAllFlowers(brought) {
      Object.keys(currentAttendanceSheet).forEach(regNo => {
        currentAttendanceSheet[regNo].broughtFlowers = brought;
        const safeId = regNo.replace(/[^a-zA-Z0-9]/g, '_');
        const btn = document.getElementById("attFlowerBtn_" + safeId);
        const label = document.getElementById("attFlowerLabel_" + safeId);
        const icon = btn ? btn.querySelector("i") : null;
        if (btn && label) {
          if (brought) {
            btn.classList.add("active");
            btn.style.borderColor = "#f472b6";
            btn.style.backgroundColor = "#fdf2f8";
            btn.style.color = "#be185d";
            label.textContent = "🌸 ගෙන ආවා (+10)";
            if (icon) icon.style.color = "#db2777";
          } else {
            btn.classList.remove("active");
            btn.style.borderColor = "#cbd5e1";
            btn.style.backgroundColor = "#fff";
            btn.style.color = "#64748b";
            label.textContent = "ගෙන ආවේ නැත";
            if (icon) icon.style.color = "#94a3b8";
          }
        }
      });
      updateAttendanceSummaryCounters();
    }
    window.markAllFlowers = markAllFlowers;

    function setStudentAttStatus(regNo, status) {
      if (!currentAttendanceSheet[regNo]) {
        currentAttendanceSheet[regNo] = { status: status, remarks: "", broughtFlowers: false };
      } else {
        currentAttendanceSheet[regNo].status = status;
      }

      const safeId = regNo.replace(/[^a-zA-Z0-9]/g, '_');
      const group = document.getElementById("attBtnGroup_" + safeId);
      if (group) {
        group.querySelectorAll(".attendance-btn").forEach(btn => btn.classList.remove("active"));
        const targetBtn = group.querySelector(".attendance-btn." + status.toLowerCase());
        if (targetBtn) targetBtn.classList.add("active");
      }

      const remarksInput = document.getElementById("attRemarks_" + safeId);
      if (remarksInput) {
        if (status === "Absent" && (!remarksInput.value || remarksInput.value === "නියමිත වේලාවට පැමිණියා")) {
          remarksInput.value = "නොපැමිණි බව සටහන් විය";
          currentAttendanceSheet[regNo].remarks = remarksInput.value;
        } else if (status === "Present" && (!remarksInput.value || remarksInput.value === "නොපැමිණි බව සටහන් විය")) {
          remarksInput.value = "නියමිත වේලාවට පැමිණියා";
          currentAttendanceSheet[regNo].remarks = remarksInput.value;
        } else if (status === "Excused" && (!remarksInput.value || remarksInput.value === "නියමිත වේලාවට පැමිණියා")) {
          remarksInput.value = "අසනීප නිවාඩු අවසරය";
          currentAttendanceSheet[regNo].remarks = remarksInput.value;
        }
      }

      updateAttendanceSummaryCounters();
    }

    function updateStudentRemarks(regNo, text) {
      if (currentAttendanceSheet[regNo]) {
        currentAttendanceSheet[regNo].remarks = text;
      }
    }

    function markAllAttendance(status) {
      Object.keys(currentAttendanceSheet).forEach(regNo => {
        setStudentAttStatus(regNo, status);
      });
    }

    function updateAttendanceSummaryCounters() {
      const keys = Object.keys(currentAttendanceSheet);
      let present = 0, absent = 0, excused = 0, flowers = 0;
      keys.forEach(k => {
        const st = currentAttendanceSheet[k].status;
        if (st === "Present") present++;
        else if (st === "Absent") absent++;
        else if (st === "Excused") excused++;
        if (currentAttendanceSheet[k].broughtFlowers) flowers++;
      });

      const totalEl = document.getElementById("attCountTotal");
      if (totalEl) totalEl.textContent = keys.length;
      const presEl = document.getElementById("attCountPresent");
      if (presEl) presEl.textContent = present;
      const absEl = document.getElementById("attCountAbsent");
      if (absEl) absEl.textContent = absent;
      const excEl = document.getElementById("attCountExcused");
      if (excEl) excEl.textContent = excused;
      const flwEl = document.getElementById("attCountFlowers");
      if (flwEl) flwEl.textContent = flowers;
    }

    function handleSaveAttendance() {
      const dateEl = document.getElementById("attSessionDate");
      const sessionDate = dateEl ? dateEl.value : "";
      if (!sessionDate) {
        alert("කරුණාකර පැමිණීමේ දිනය තෝරන්න!");
        return;
      }

      const catEl = document.getElementById("attSessionCategory");
      const category = catEl ? catEl.value : "sunday";
      const catTitles = {
        "sunday": "දහම් පාසල් ඉරිදා පැමිණීම",
        "poya": "පෝහෝ දින අටසිල් සමාදන් වීම",
        "event": "විශේෂ වැඩසටහන් සහභාගීත්වය"
      };
      const eventTitle = catTitles[category] || "දහම් පාසල් ඉරිදා පැමිණීම";

      const keys = Object.keys(currentAttendanceSheet);
      if (keys.length === 0) {
        alert("සුරැකීමට ශිෂ්‍ය ලේඛනයක් නොමැත!");
        return;
      }

      let presentCount = 0, absentCount = 0, excusedCount = 0;

      keys.forEach(regNo => {
        const entry = currentAttendanceSheet[regNo];
        const s = studentDb[regNo];
        if (!s) return;
        if (!Array.isArray(s.attendance)) s.attendance = [];

        if (entry.status === "Present") presentCount++;
        else if (entry.status === "Absent") absentCount++;
        else if (entry.status === "Excused") excusedCount++;

        const broughtFlowers = Boolean(entry.broughtFlowers);
        let remarks = entry.remarks || (entry.status === "Present" ? "නියමිත වේලාවට පැමිණියා" : "නොපැමිණි බව සටහන් විය");
        if (broughtFlowers && !remarks.includes("මල්")) {
          remarks += " (🌸 බුද්ධ පූජාවට මල් ගෙන ආවා)";
        }

        const score = entry.status === "Present" ? 10 : (entry.status === "Excused" ? 5 : 0);
        const record = {
          event: eventTitle,
          category: category,
          type: (category === 'poya') ? 'sil_day' : 'dhamma_school',
          date: sessionDate,
          attendance: entry.status,
          score: score,
          broughtFlowers: broughtFlowers,
          remarks: remarks
        };

        const existingIdx = s.attendance.findIndex(a => a.date === sessionDate && (a.category === category || a.event === eventTitle));
        if (existingIdx >= 0) {
          s.attendance[existingIdx] = record;
        } else {
          s.attendance.push(record);
        }
      });

      // Save Student DB
      localStorage.setItem("dahamPasalaStudentDb", JSON.stringify(studentDb));

      // Append Attendance Session Log
      const selectedGrade = document.getElementById("attFilterGrade") ? document.getElementById("attFilterGrade").value : (activeTeacher ? activeTeacher.assignedGrade : "10 ශ්‍රේණිය");
      let logs = [];
      const savedLogs = localStorage.getItem("dahamPasalaAttendanceLogs");
      if (savedLogs) {
        try { logs = JSON.parse(savedLogs); } catch(e) {}
      }
      const existingLogIdx = logs.findIndex(l => l.date === sessionDate && l.category === eventTitle && l.grade === selectedGrade);
      const sessionLog = {
        id: "att-" + Date.now(),
        date: sessionDate,
        category: eventTitle,
        grade: selectedGrade,
        total: keys.length,
        present: presentCount,
        absent: absentCount,
        excused: excusedCount,
        teacherName: activeTeacher ? activeTeacher.name : "පන්තිභාර ආචාර්ය"
      };

      if (existingLogIdx >= 0) {
        logs[existingLogIdx] = sessionLog;
      } else {
        logs.unshift(sessionLog);
      }
      localStorage.setItem("dahamPasalaAttendanceLogs", JSON.stringify(logs));

      // Dual-Mode Sync to Backend (Pure MongoDB)
      if (window.DahamPasalaAPI) {
        const mappedType = (category === 'poya') ? 'sil_day' : 'dhamma_school';
        DahamPasalaAPI.recordAttendance({
          id: sessionLog.id,
          date: sessionDate,
          type: mappedType,
          category: eventTitle,
          grade: selectedGrade,
          teacherId: activeTeacher ? activeTeacher.id : "TCH/2026/01",
          teacherName: activeTeacher ? activeTeacher.name : "පන්තිභාර ආචාර්ය",
          total: keys.length,
          present: presentCount,
          absent: absentCount,
          excused: excusedCount,
          records: keys.map(k => ({
            regNo: k,
            status: (currentAttendanceSheet[k]?.status || "Present").toLowerCase(),
            broughtFlowers: Boolean(currentAttendanceSheet[k]?.broughtFlowers),
            flowerScore: currentAttendanceSheet[k]?.broughtFlowers ? 10 : 0,
            remarks: currentAttendanceSheet[k]?.remarks || ""
          }))
        });
      }

      // Show Status Toast
      const flowerCount = keys.filter(k => currentAttendanceSheet[k]?.broughtFlowers).length;
      const statusEl = document.getElementById("status-att");
      if (statusEl) {
        statusEl.textContent = flowerCount > 0 
          ? `✓ අද දින පැමිණීම (මල් පූජා ${flowerCount} ක් සමඟ) සාර්ථකව සුරැකිණි!`
          : `✓ අද දින පැමිණීම සාර්ථකව පද්ධතියට සුරැකිණි!`;
        statusEl.style.display = "inline";
        setTimeout(() => { statusEl.style.display = "none"; }, 3500);
      }

      renderAttendanceRoster();
      renderClassAttendanceHistory();
      renderGoodDeedsHistory();
      renderTeacherDashboard();

      alert(`✓ ${sessionDate} දින ${selectedGrade} සඳහා ${eventTitle} සාර්ථකව පද්ධතියට සුරැකිණි!\n(පැමිණි: ${presentCount}, නොපැමිණි: ${absentCount}, අවසර: ${excusedCount}, මල් රැගෙන ආ: ${flowerCount})`);
    }

    async function renderClassAttendanceHistory() {
      const selectedGrade = document.getElementById("attFilterGrade") ? document.getElementById("attFilterGrade").value : "10 ශ්‍රේණිය";
      let logs = [];

      // Fetch fresh attendance from backend if online
      if (window.DahamPasalaAPI) {
        try {
          const apiLogs = await DahamPasalaAPI.getAttendance({ grade: selectedGrade === "all" ? "" : selectedGrade });
          if (Array.isArray(apiLogs) && apiLogs.length > 0) {
            logs = apiLogs;
            localStorage.setItem("dahamPasalaAttendanceLogs", JSON.stringify(logs));
          }
        } catch (e) {}
      }

      if (logs.length === 0) {
        const savedLogs = localStorage.getItem("dahamPasalaAttendanceLogs");
        if (savedLogs) {
          try { logs = JSON.parse(savedLogs); } catch(e) {}
        }
      }

      const filtered = logs.filter(l => selectedGrade === "all" || l.grade === selectedGrade);
      const tbody = document.getElementById("attHistoryTableBody");
      if (!tbody) return;

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 20px; color: var(--text-muted);">${selectedGrade} සඳහා මෑත පැමිණීම් වාර්තා නොමැත.</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(l => {
        const rate = l.total > 0 ? Math.round((l.present / l.total) * 100) : 0;
        const pillClass = rate >= 80 ? "present" : (rate >= 60 ? "excused" : "absent");
        return `
          <tr>
            <td><strong>${l.date}</strong></td>
            <td>${l.category}</td>
            <td><span class="material-tag" style="background:#eff6ff; color:var(--primary-blue);">${l.grade}</span></td>
            <td><strong style="color:#16a34a;">${l.present}</strong> / ${l.total}</td>
            <td><strong style="color:#dc2626;">${l.absent}</strong></td>
            <td><span class="status-pill ${pillClass}">${rate}%</span></td>
            <td><small>${l.teacherName}</small></td>
          </tr>
        `;
      }).join("");
    }

    // Render Dashboard Overview with Grade & Live Search Filtering
    function renderTeacherDashboard() {
      const studentKeys = Object.keys(studentDb);
      document.getElementById("statTotalStudents").textContent = studentKeys.length;
      document.getElementById("statTotalDeeds").textContent = goodDeedsStore.length;
      document.getElementById("statTotalObservations").textContent = observationsStore.length;
      document.getElementById("statTotalBadges").textContent = badgesStore.length;

      const gradeFilter = document.getElementById("rosterGradeFilter") ? document.getElementById("rosterGradeFilter").value : "all";
      const query = document.getElementById("rosterSearchQuery") ? document.getElementById("rosterSearchQuery").value.trim().toLowerCase() : "";

      const filteredKeys = studentKeys.filter(k => {
        const s = studentDb[k];
        if (!s) return false;
        if (!matchesGradeFilter(s ? s.grade : "", gradeFilter)) {
          return false;
        }
        if (query) {
          const name = (s.name || "").toLowerCase();
          const engName = (s.englishName || "").toLowerCase();
          const reg = (s.regNo || "").toLowerCase();
          if (!name.includes(query) && !engName.includes(query) && !reg.includes(query)) {
            return false;
          }
        }
        return true;
      });

      const tbody = document.getElementById("teacherRosterTableBody");
      if (filteredKeys.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 25px; color: var(--text-muted);">තෝරාගත් ශ්‍රේණියට හෝ සෙවුම් පදයට ගැලපෙන ශිෂ්‍යයන් හමුනොවීය. (No matching students found)</td></tr>`;
        return;
      }

      tbody.innerHTML = filteredKeys.map(k => {
        const s = studentDb[k];
        const studentDeeds = goodDeedsStore.filter(d => d.regNo === k).length;
        const studentBadges = badgesStore.filter(b => b.regNo === k).length;

        return `
          <tr>
            <td><strong>${s.regNo}</strong></td>
            <td><strong>${s.name}</strong></td>
            <td>${s.grade}</td>
            <td><span class="status-pill present">පැමිණීම 92%</span></td>
            <td><strong>${studentDeeds * 10 + studentBadges * 50}</strong> කුසලතා ලකුණු</td>
            <td>
              <button class="btn-save" style="padding: 5px 10px; font-size: 0.76rem;" onclick="quickActionToStudent('${k}', 'good-deeds')">
                <i class="fa-solid fa-heart"></i> ක්‍රියා
              </button>
              <button class="btn-save" style="padding: 5px 10px; font-size: 0.76rem; background: var(--secondary-blue);" onclick="quickActionToStudent('${k}', 'badges')">
                <i class="fa-solid fa-medal"></i> පදක්කම්
              </button>
              <button class="btn-save" style="padding: 5px 10px; font-size: 0.76rem; background: #059669;" onclick="quickActionToStudent('${k}', 'recommendations')">
                <i class="fa-solid fa-certificate"></i> නිර්දේශ
              </button>
            </td>
          </tr>
        `;
      }).join("");

      renderTeacherAnnouncements();
    }

    async function renderTeacherAnnouncements() {
      const feed = document.getElementById("teacherAnnouncementsFeed");
      const countPill = document.getElementById("teacherAnnouncementCount");
      if (!feed) return;

      let list = [];
      if (window.DahamPasalaAPI) {
        list = await DahamPasalaAPI.getAnnouncements('teachers');
      } else {
        const raw = localStorage.getItem("dahamPasalaAnnouncements");
        if (raw) {
          try { list = JSON.parse(raw); } catch(e) {}
        }
      }

      // Filter exclusively for teachers or all
      const filtered = list.filter(a => {
        if (window.DahamPasalaAPI && typeof DahamPasalaAPI.isAudienceMatch === 'function') {
          return DahamPasalaAPI.isAudienceMatch('teachers', a.audience);
        }
        const aud = String(a.audience || '').toLowerCase();
        return aud === 'all' || aud === 'teachers' || aud.includes('all') || aud.includes('සියල්ල') || aud.includes('teacher') || aud.includes('ආචාර්ය');
      });

      if (countPill) countPill.textContent = `${filtered.length} නිවේදන`;

      if (filtered.length === 0) {
        feed.innerHTML = `
          <div style="text-align: center; padding: 25px; color: var(--text-muted);">
            <i class="fa-regular fa-bell-slash" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.5;"></i>
            <p>දැනට ආචාර්ය මණ්ඩලය සඳහා නව නිවේදන නොමැත. (No active teacher notices)</p>
          </div>
        `;
        return;
      }

      feed.innerHTML = filtered.map(item => {
        const aud = String(item.audience || '').toLowerCase();
        const isTeacherOnly = aud === 'teachers' || aud.includes('teacher') || aud.includes('ආචාර්ය') || aud.includes('ගුරු');
        const audienceBadge = isTeacherOnly
          ? `<span class="audience-pill teachers" style="font-size:0.75rem;"><i class="fa-solid fa-chalkboard-user"></i> ආචාර්ය මණ්ඩලය පමණක්</span>`
          : `<span class="audience-pill all" style="font-size:0.75rem;"><i class="fa-solid fa-users"></i> සියලු දෙනා වෙත (All)</span>`;

        return `
        <div class="announcement-item ${item.urgency === 'urgent' ? 'urgent' : ''}">
          <div class="announcement-top">
            <h4 class="announcement-title">
              ${item.urgency === 'urgent' ? '<i class="fa-solid fa-triangle-exclamation" style="color: #dc2626; margin-right: 6px;"></i>' : ''}
              ${item.title}
            </h4>
            <div style="display: flex; gap: 6px; align-items: center;">
              ${audienceBadge}
              <span class="announcement-badge ${item.urgency || 'general'}">${item.urgency === 'urgent' ? 'හදිසි' : item.urgency === 'important' ? 'වැදගත්' : 'සාමාන්‍ය'}</span>
            </div>
          </div>
          <p class="announcement-body">${item.body}</p>
          <div class="announcement-meta">
            <span><i class="fa-regular fa-calendar"></i> ${item.date || ''}</span>
            <span><i class="fa-solid fa-landmark-dome"></i> ${item.author || 'පරිපාලන කාර්යාලය'}</span>
          </div>
        </div>
      `;
      }).join("");
    }

    function quickActionToStudent(regNo, tabId) {
      switchTeacherPage(tabId);
      const s = studentDb[regNo];
      let prefix = "";
      if (tabId === 'good-deeds') prefix = "deed";
      if (tabId === 'observations') prefix = "obs";
      if (tabId === 'badges') prefix = "badge";
      if (tabId === 'recommendations') prefix = "rec";

      if (prefix && s) {
        const gradeEl = document.getElementById(prefix + "GradeFilter");
        const searchEl = document.getElementById(prefix + "SearchQuery");
        if (searchEl) searchEl.value = "";
        if (gradeEl) {
          if (s.grade && s.grade.includes("10")) gradeEl.value = "10";
          else if (s.grade && s.grade.includes("9")) gradeEl.value = "9";
          else if (s.grade && s.grade.includes("8")) gradeEl.value = "8";
          else gradeEl.value = "all";
          const numMatch = (s.grade || "").match(/\b(\d+)\b/);
          if (numMatch && gradeEl.querySelector(`option[value="${numMatch[1]}"]`)) {
            gradeEl.value = numMatch[1];
          } else if (s.grade && s.grade.toLowerCase().includes("final") && gradeEl.querySelector('option[value="final"]')) {
            gradeEl.value = "final";
          } else if (s.grade && (s.grade.includes("ධර්මාචාර්ය") || s.grade.toLowerCase().includes("teaching")) && gradeEl.querySelector('option[value="teaching"]')) {
            gradeEl.value = "teaching";
          } else {
            gradeEl.value = "all";
          }
        }
        updateStudentPicker(prefix, regNo);
        if (prefix === "rec") {
          loadStudentCurrentRecommendation();
        }
      }
    }



    // Save Good Deed
    function handleSaveGoodDeed(event) {
      if (event && event.preventDefault) event.preventDefault();
      const regNo = document.getElementById("deedStudentSelect").value;
      if (!regNo) {
        alert("කරුණාකර අදාළ ශිෂ්‍යයා තෝරාගන්න.");
        return;
      }
      const student = studentDb[regNo];
      const title = document.getElementById("deedTitle").value.trim() || "විහාර මළුව පිරිසිදු කිරීම";
      const category = document.getElementById("deedCategory").value;
      const date = document.getElementById("deedDate").value || new Date().toISOString().split("T")[0];
      const score = parseInt(document.getElementById("deedScore").value) || 10;
      const remarks = document.getElementById("deedRemarks").value.trim() || "ආචාර්ය මණ්ඩලයේ ප්‍රශංසාව හිමිවිය";

      const deedObj = {
        studentName: student ? student.name : regNo,
        regNo: regNo,
        title: title,
        category: category,
        date: date,
        score: score,
        remarks: remarks
      };

      goodDeedsStore.unshift(deedObj);

      if (window.DahamPasalaAPI) {
        DahamPasalaAPI.addDeed(deedObj);
      }

      // Append to student's personal attendance/deeds record as well
      if (student) {
        if (!student.attendance) student.attendance = [];
        student.attendance.unshift({
          event: `[යහපත් ක්‍රියා] ${title}`,
          category: "good_deed",
          type: "good_deed",
          date: date,
          status: "present",
          score: score,
          remarks: `ගුරු සටහන: ${remarks}`
        });
      }

      persistAllData();
      renderGoodDeedsHistory();
      renderTeacherDashboard();

      document.getElementById("deedTitle").value = "";
      document.getElementById("deedRemarks").value = "";

      const status = document.getElementById("status-good-deed");
      if (status) {
        status.textContent = "✓ යහපත් ක්‍රියාව සාර්ථකව සටහන් විය!";
        status.style.display = "inline";
        setTimeout(() => status.style.display = "none", 3000);
      }
    }
    window.handleSaveGoodDeed = handleSaveGoodDeed;

    function renderGoodDeedsHistory() {
      const tbody = document.getElementById("goodDeedsHistoryTableBody");
      if (!tbody) return;
      tbody.innerHTML = goodDeedsStore.map(d => `
        <tr>
          <td><strong>${d.studentName}</strong> <br><small style="color:var(--text-muted);">${d.regNo}</small></td>
          <td><strong>${d.title}</strong></td>
          <td><span class="material-tag">${d.category}</span></td>
          <td>${d.date}</td>
          <td><strong>${d.score}</strong> / 10</td>
          <td>${d.remarks}</td>
        </tr>
      `).join("");
    }

    // Save Observation
    function handleSaveObservation(event) {
      event.preventDefault();
      const regNo = document.getElementById("obsStudentSelect").value;
      const student = studentDb[regNo];
      const category = document.getElementById("obsCategory").value;
      const rating = document.getElementById("obsRating").value;
      const date = document.getElementById("obsDate").value;
      const remarks = document.getElementById("obsRemarks").value.trim();

      const obsObj = {
        studentName: student ? student.name : regNo,
        regNo: regNo,
        category: category,
        rating: rating,
        date: date,
        remarks: remarks
      };

      observationsStore.unshift(obsObj);

      if (window.DahamPasalaAPI) {
        DahamPasalaAPI.addObservation(obsObj);
      }

      persistAllData();
      renderObservationsHistory();
      renderTeacherDashboard();

      document.getElementById("obsRemarks").value = "";

      const status = document.getElementById("status-obs");
      status.style.display = "inline";
      setTimeout(() => status.style.display = "none", 2500);
    }

    function renderObservationsHistory() {
      const tbody = document.getElementById("observationsHistoryTableBody");
      tbody.innerHTML = observationsStore.map(o => {
        let ratingClass = "obs-rating-good";
        if (o.rating.includes("Distinction") || o.rating.includes("විශිෂ්ටයි")) ratingClass = "obs-rating-distinction";
        if (o.rating.includes("Needs") || o.rating.includes("වැඩිදියුණු")) ratingClass = "obs-rating-needs-work";

        return `
          <tr>
            <td><strong>${o.studentName}</strong> <br><small style="color:var(--text-muted);">${o.regNo}</small></td>
            <td><strong>${o.category}</strong></td>
            <td>${o.date}</td>
            <td><span class="obs-rating-pill ${ratingClass}">${o.rating}</span></td>
            <td>${o.remarks}</td>
          </tr>
        `;
      }).join("");
    }

    // Upload Study Material
    function handleUploadStudyMaterial(event) {
      event.preventDefault();
      const title = document.getElementById("matTitle").value.trim();
      const grade = document.getElementById("matGrade").value;
      const type = document.getElementById("matType").value;
      const link = document.getElementById("matLink").value.trim();
      const desc = document.getElementById("matDesc").value.trim();

      const matObj = {
        id: "mat-" + Date.now(),
        title: title,
        grade: grade,
        type: type,
        link: link,
        desc: desc,
        date: new Date().toISOString().split('T')[0]
      };

      studyMaterialsStore.unshift(matObj);

      if (window.DahamPasalaAPI) {
        DahamPasalaAPI.addMaterial(matObj);
      }

      persistAllData();
      renderStudyMaterials();

      document.getElementById("matTitle").value = "";
      document.getElementById("matDesc").value = "";

      const status = document.getElementById("status-mat");
      status.style.display = "inline";
      setTimeout(() => status.style.display = "none", 2500);
    }

    function renderStudyMaterials() {
      const container = document.getElementById("studyMaterialsContainer");
      container.innerHTML = studyMaterialsStore.map(m => `
        <div class="study-material-card">
          <div>
            <div class="study-material-top">
              <div class="material-icon-box">
                <i class="fa-solid fa-book-open"></i>
              </div>
              <div class="study-material-info">
                <h4>${m.title}</h4>
                <span>${m.grade} | ${m.date}</span>
              </div>
            </div>
            <p class="study-material-desc">${m.desc}</p>
          </div>
          <div class="study-material-footer">
            <span class="material-tag">${m.type}</span>
            <button class="btn-download-material" onclick="alert('නිබන්ධනය බාගත කිරීම: ' + '${m.title}')">
              <i class="fa-solid fa-download"></i> බාගත කරන්න
            </button>
          </div>
        </div>
      `).join("");
    }

    // Badges Selector Grid & Awarding
    function initBadgeSelectorGrid() {
      const grid = document.getElementById("badgeSelectorGrid");
      grid.innerHTML = badgeLibrary.map((b, idx) => `
        <div class="badge-card ${idx === 0 ? 'selected' : ''}" onclick="selectBadgeCard(this, '${b.name}', ${b.defaultPoints})">
          <div class="badge-icon-wrap badge-${b.tier}">
            <i class="fa-solid ${b.icon}"></i>
          </div>
          <h4>${b.name}</h4>
          <p>${b.desc}</p>
          <span class="badge-points-tag">+${b.defaultPoints} Points</span>
        </div>
      `).join("");
    }

    function selectBadgeCard(cardElement, badgeName, defaultPoints) {
      document.querySelectorAll(".badge-card").forEach(c => c.classList.remove("selected"));
      cardElement.classList.add("selected");
      document.getElementById("selectedBadgeName").value = badgeName;
      document.getElementById("badgePoints").value = defaultPoints;
    }

    function handleAwardBadge(event) {
      event.preventDefault();
      const regNo = document.getElementById("badgeStudentSelect").value;
      const student = studentDb[regNo];
      const badge = document.getElementById("selectedBadgeName").value;
      const points = parseInt(document.getElementById("badgePoints").value) || 50;
      const remarks = document.getElementById("badgeRemarks").value.trim();
      const today = new Date().toISOString().split('T')[0];

      const badgeObj = {
        id: `ach-${Date.now()}`,
        studentName: student ? student.name : regNo,
        regNo: regNo,
        grade: student ? student.grade : "10 ශ්‍රේණිය",
        badge: badge,
        points: points,
        date: today,
        remarks: remarks,
        teacher: activeTeacher ? activeTeacher.name : "පන්තිභාර ආචාර්ය",
        status: "pending" // Marked as pending until Admin / Principal approves!
      };

      badgesStore.unshift(badgeObj);

      if (window.DahamPasalaAPI) {
        DahamPasalaAPI.nominateBadge(badgeObj);
      }

      // NOTE: Points are credited to student ONLY after Admin approval!
      persistAllData();
      renderAwardedBadges();
      renderTeacherDashboard();

      document.getElementById("badgeRemarks").value = "";

      const status = document.getElementById("status-badge");
      if (status) {
        status.textContent = "✓ පදක්කම අනුමැතිය සඳහා යොමු කරන ලදී!";
        status.style.display = "inline";
        setTimeout(() => status.style.display = "none", 3000);
      }

      alert(`✓ "${badge}" කුසලතා පදක්කම ${student ? student.name : regNo} ශිෂ්‍යයා වෙනුවෙන් සාර්ථකව යෝජනා කරන ලදී!\n(ප්‍රධානාචාර්යතුමා / පරිපාලක විසින් අනුමත කළ පසු ශිෂ්‍යයාට ප්‍රදානය කෙරේ)`);
    }

    function renderAwardedBadges() {
      const tbody = document.getElementById("awardedBadgesTableBody");
      if (!tbody) return;

      tbody.innerHTML = badgesStore.map(b => {
        const isApproved = b.status === "approved";
        const isRejected = b.status === "rejected";
        const statusBadge = isApproved
          ? `<span class="status-badge approved" style="display:inline-block; padding:3px 8px; border-radius:12px; font-size:0.75rem; background:#dcfce7; color:#15803d; font-weight:600;"><i class="fa-solid fa-circle-check"></i> අනුමතයි</span>`
          : (isRejected
              ? `<span class="status-badge rejected" style="display:inline-block; padding:3px 8px; border-radius:12px; font-size:0.75rem; background:#fee2e2; color:#b91c1c; font-weight:600;"><i class="fa-solid fa-circle-xmark"></i> ප්‍රතික්ෂේපිතයි</span>`
              : `<span class="status-badge pending" style="display:inline-block; padding:3px 8px; border-radius:12px; font-size:0.75rem; background:#fef3c7; color:#b45309; font-weight:600;"><i class="fa-solid fa-clock"></i> අනුමැතිය අපේක්ෂාවෙන්</span>`);

        return `
        <tr>
          <td><strong>${b.studentName}</strong> <br><small style="color:var(--text-muted);">${b.regNo}</small></td>
          <td><strong style="color: var(--primary-blue);"><i class="fa-solid fa-medal" style="color: var(--accent-yellow);"></i> ${b.badge}</strong></td>
          <td><span class="badge-points-tag">+${b.points} Pts</span></td>
          <td>${b.date}</td>
          <td>${statusBadge}</td>
          <td>${b.remarks || '-'}</td>
        </tr>`;
      }).join("");
    }

    // Recommendation Management & Live Sync
    function loadStudentCurrentRecommendation() {
      const regNo = document.getElementById("recStudentSelect").value;
      const student = studentDb[regNo];
      if (student) {
        document.getElementById("recText").value = student.recommendation ||
          `${student.name} ශිෂ්‍යයා වර්ෂය තුළ දහම් පාසලේ නීති රීති වලට ගරු කරමින්, ගුරු දෙගුරුන්ට කීකරුව ආදර්ශවත් යහපත් චරිතයකින් යුතුව අධ්‍යයන කටයුතුවල නිරත වූ බවත්, සියලුම ආගමික කටයුතු සඳහා උනන්දුවෙන් දායක වූ බවත් සහතික කරමි.`;
      } else {
        const recEl = document.getElementById("recText");
        if (recEl) recEl.value = "";
      }
    }

    function handleSaveRecommendation(event) {
      event.preventDefault();
      const regNo = document.getElementById("recStudentSelect").value;
      const student = studentDb[regNo];
      const recText = document.getElementById("recText").value.trim();
      const teacherSigner = document.getElementById("recTeacherSigner").value.trim();

      if (student) {
        student.recommendation = recText;
        student.teacherName = teacherSigner;
        if (window.DahamPasalaAPI) {
          DahamPasalaAPI.saveStudent(student);
        }
      }

      persistAllData();

      const status = document.getElementById("status-rec");
      status.style.display = "inline";
      setTimeout(() => status.style.display = "none", 2500);
    }

    // ==========================================
    // Term Examination Marks Management
    // ==========================================
    function calculateGrade(marks) {
      const m = Number(marks);
      if (m >= 75) return { grade: 'A', text: 'A - විශිෂ්ට' };
      if (m >= 65) return { grade: 'B', text: 'B - ඉතා හොඳ' };
      if (m >= 50) return { grade: 'C', text: 'C - සම්මාන' };
      if (m >= 35) return { grade: 'S', text: 'S - සාමාන්‍ය' };
      return { grade: 'W', text: 'W - අසමත්' };
    }

    function updateLiveGradePreview() {
      const marksEl = document.getElementById("examMarksInput");
      const previewEl = document.getElementById("examGradePreview");
      if (!marksEl || !previewEl) return;
      const val = marksEl.value;
      if (val === "" || isNaN(val)) {
        previewEl.textContent = "ශ්‍රේණිය: -";
        previewEl.className = "status-pill present";
        return;
      }
      const res = calculateGrade(val);
      previewEl.textContent = `ශ්‍රේණිය: ${res.text}`;
      previewEl.className = `status-pill ${res.grade === 'W' ? 'absent' : 'present'}`;
    }

    function handleSubjectSelectionChange() {
      const select = document.getElementById("examSubjectSelect");
      const customInput = document.getElementById("examCustomSubject");
      if (!select || !customInput) return;
      if (select.value === "custom") {
        customInput.style.display = "block";
        customInput.required = true;
        customInput.focus();
      } else {
        customInput.style.display = "none";
        customInput.required = false;
      }
    }

    function loadStudentExamMarksForCurrentTerm() {
      renderExamMarksTable();
    }

    async function handleSaveExamMark(event) {
      event.preventDefault();
      const regNo = document.getElementById("examStudentSelect").value;
      const student = studentDb[regNo];
      if (!student) {
        alert("කරුණාකර වලංගු ශිෂ්‍යයෙකු තෝරන්න.");
        return;
      }

      const term = document.getElementById("examTermSelect").value;
      const year = (document.getElementById("examYearInput")?.value || "2026").trim();
      const subjectSelect = document.getElementById("examSubjectSelect").value;
      const subject = subjectSelect === "custom"
        ? document.getElementById("examCustomSubject").value.trim()
        : subjectSelect;

      if (!subject) {
        alert("කරුණාකර විෂය නාමය ඇතුළත් කරන්න.");
        return;
      }

      const marks = Number(document.getElementById("examMarksInput").value);
      const grade = calculateGrade(marks).grade;
      const remarks = (document.getElementById("examRemarksInput")?.value || "").trim();

      const markObj = {
        term,
        year,
        subject,
        marks,
        grade,
        remarks
      };

      if (!Array.isArray(student.examMarks)) student.examMarks = [];
      const idx = student.examMarks.findIndex(
        m => String(m.term || '1') === String(term) && String(m.year || '2026') === String(year) && m.subject === subject
      );
      if (idx >= 0) {
        student.examMarks[idx] = markObj;
      } else {
        student.examMarks.push(markObj);
      }

      persistAllData();

      if (window.DahamPasalaAPI) {
        await DahamPasalaAPI.saveStudentExamMark(regNo, markObj);
      }

      renderExamMarksTable();

      // Reset marks input
      document.getElementById("examMarksInput").value = "";
      if (document.getElementById("examRemarksInput")) document.getElementById("examRemarksInput").value = "";
      updateLiveGradePreview();

      const status = document.getElementById("status-exam");
      if (status) {
        status.style.display = "inline";
        setTimeout(() => status.style.display = "none", 2500);
      }
    }

    function renderExamMarksTable() {
      const tbody = document.getElementById("examMarksTableBody");
      if (!tbody) return;

      const termFilter = document.getElementById("examRosterTermFilter") ? document.getElementById("examRosterTermFilter").value : "all";
      const gradeFilter = document.getElementById("examGradeFilter") ? document.getElementById("examGradeFilter").value : "all";

      const rows = [];
      const termLabels = {
        "1": "1 වන වාරය (Term 1)",
        "2": "2 වන වාරය (Term 2)",
        "3": "3 වන වාරය (Term 3)"
      };

      Object.keys(studentDb).forEach(regNo => {
        const s = studentDb[regNo];
        if (!s) return;

        if (!matchesGradeFilter(s.grade, gradeFilter)) {
          return;
        }

        const marksList = s.examMarks || [];
        marksList.forEach(m => {
          const mTerm = String(m.term || '1');
          if (termFilter !== "all" && mTerm !== termFilter) return;

          rows.push({
            regNo: s.regNo,
            studentName: s.name,
            grade: s.grade,
            term: mTerm,
            termLabel: termLabels[mTerm] || `${mTerm} වන වාරය`,
            subject: m.subject,
            marks: m.marks,
            gradeResult: m.grade || 'A',
            remarks: m.remarks || '-',
            year: m.year || '2026'
          });
        });
      });

      if (rows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 25px; color: var(--text-muted);">වාර විභාග ලකුණු තවමත් සටහන් කර නොමැත. (No exam marks recorded yet)</td></tr>`;
        return;
      }

      rows.sort((a, b) => a.term.localeCompare(b.term) || a.studentName.localeCompare(b.studentName));

      tbody.innerHTML = rows.map(r => `
        <tr>
          <td><strong>${r.regNo}</strong></td>
          <td><strong>${r.studentName}</strong></td>
          <td>${r.grade}</td>
          <td><span class="audience-pill all"><i class="fa-solid fa-calendar-check"></i> ${r.termLabel}</span></td>
          <td><strong>${r.subject}</strong></td>
          <td><strong>${r.marks}</strong> / 100</td>
          <td><span class="status-pill ${r.gradeResult === 'W' ? 'absent' : 'present'}">${r.gradeResult}</span></td>
          <td><small>${r.remarks}</small></td>
          <td>
            <button class="btn-reject" style="padding: 4px 8px; font-size: 0.72rem;" onclick="handleDeleteExamMark('${r.regNo}', '${r.term}', '${encodeURIComponent(r.subject)}', '${r.year}')" title="ඉවත් කරන්න">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      `).join("");

      // Also refresh the Class Rankings & Performance summary table
      renderClassRankingsTable();
    }

    async function renderClassRankingsTable() {
      const tbody = document.getElementById("classRankingsTableBody");
      if (!tbody) return;

      const activeTeacherGrade = activeTeacher?.grade || "10 ශ්‍රේණිය";
      const gradeBadge = document.getElementById("rankingsGradeBadge");
      if (gradeBadge) gradeBadge.innerHTML = `<i class="fa-solid fa-chalkboard-user"></i> ${activeTeacherGrade}`;

      let rankingData = null;
      if (window.DahamPasalaAPI) {
        try {
          rankingData = await DahamPasalaAPI.getGradeRankings(activeTeacherGrade);
        } catch (e) {}
      }

      // If offline or fallback, calculate locally with pinpoint accuracy
      if (!rankingData || !rankingData.students) {
        const studentList = Object.values(studentDb).filter(s => s && s.grade && s.grade.includes(activeTeacherGrade.split(' ')[0]));
        const rows = studentList.map(s => {
          const marks = s.examMarks || [];
          let t1Sum = 0, t1Count = 0;
          let t2Sum = 0, t2Count = 0;
          let t3Sum = 0, t3Count = 0;
          let totalSum = 0, totalCount = 0;

          marks.forEach(m => {
            const t = String(m.term || '1');
            const sc = Number(m.marks || 0);
            if (t === '1') { t1Sum += sc; t1Count++; }
            else if (t === '2') { t2Sum += sc; t2Count++; }
            else if (t === '3') { t3Sum += sc; t3Count++; }
            totalSum += sc; totalCount++;
          });

          const t1Avg = t1Count ? Number((t1Sum / t1Count).toFixed(1)) : null;
          const t2Avg = t2Count ? Number((t2Sum / t2Count).toFixed(1)) : null;
          const t3Avg = t3Count ? Number((t3Sum / t3Count).toFixed(1)) : null;
          const cumAvg = totalCount ? Number((totalSum / totalCount).toFixed(1)) : 0;
          const grade = cumAvg >= 75 ? 'A' : cumAvg >= 65 ? 'B' : cumAvg >= 50 ? 'C' : cumAvg >= 35 ? 'S' : 'W';

          return {
            regNo: s.regNo,
            name: s.name,
            term1Avg: t1Avg,
            term2Avg: t2Avg,
            term3Avg: t3Avg,
            cumulativeAverage: cumAvg,
            totalCumulativeMarks: totalSum,
            overallGrade: grade
          };
        });

        rows.sort((a, b) => b.cumulativeAverage - a.cumulativeAverage || b.totalCumulativeMarks - a.totalCumulativeMarks);
        rows.forEach((r, idx) => {
          if (idx > 0 && r.cumulativeAverage === rows[idx - 1].cumulativeAverage && r.totalCumulativeMarks === rows[idx - 1].totalCumulativeMarks) {
            r.rank = rows[idx - 1].rank;
          } else {
            r.rank = idx + 1;
          }
        });
        rankingData = { students: rows };
      }

      const students = rankingData.students || [];
      if (students.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 25px; color: var(--text-muted);">පන්ති ශ්‍රේණියේ ශිෂ්‍යයන් හමු නොවීය.</td></tr>`;
        return;
      }

      const getMedal = (rank) => {
        if (rank === 1) return '<span style="font-size:1.2rem; margin-right:4px;">🥇</span> <strong>01</strong>';
        if (rank === 2) return '<span style="font-size:1.2rem; margin-right:4px;">🥈</span> <strong>02</strong>';
        if (rank === 3) return '<span style="font-size:1.2rem; margin-right:4px;">🥉</span> <strong>03</strong>';
        return `<strong>${String(rank).padStart(2, '0')}</strong>`;
      };

      const getGradeDescription = (grade) => {
        switch (grade) {
          case 'A': return 'විශිෂ්ට සාමාර්ථය (Distinction)';
          case 'B': return 'ඉතා හොඳ සාමාර්ථය (Very Good)';
          case 'C': return 'සම්මාන සාමාර්ථය (Credit)';
          case 'S': return 'සාමාන්‍ය සාමාර්ථය (Simple Pass)';
          case 'W':
          default: return 'අසමත් (Needs Improvement)';
        }
      };

      tbody.innerHTML = students.map(s => `
        <tr style="${s.rank <= 3 ? 'background: rgba(254, 240, 138, 0.15);' : ''}">
          <td style="text-align: center;">${getMedal(s.rank)}</td>
          <td><strong>${s.regNo}</strong></td>
          <td><strong>${s.name}</strong></td>
          <td style="text-align: center;">${s.term1Avg !== null ? `${s.term1Avg}%` : '-'}</td>
          <td style="text-align: center;">${s.term2Avg !== null ? `${s.term2Avg}%` : '-'}</td>
          <td style="text-align: center;">${s.term3Avg !== null ? `${s.term3Avg}%` : '-'}</td>
          <td style="text-align: center;"><strong style="font-size: 1.05rem; color: var(--primary-blue);">${s.cumulativeAverage}%</strong></td>
          <td style="text-align: center;">
            <span class="status-pill ${s.overallGrade === 'W' ? 'absent' : 'present'}" style="font-weight: 700;">${s.overallGrade}</span>
          </td>
          <td><small>${getGradeDescription(s.overallGrade)}</small></td>
        </tr>
      `).join("");
    }

    async function handleDeleteExamMark(regNo, term, encodedSubject, year) {
      const subject = decodeURIComponent(encodedSubject);
      if (!confirm(`${regNo} ශිෂ්‍යයාගේ ${term} වන වාරයේ "${subject}" විෂය ලකුණු ඉවත් කිරීමට ඔබට විශ්වාසද?`)) {
        return;
      }

      const student = studentDb[regNo];
      if (student && Array.isArray(student.examMarks)) {
        student.examMarks = student.examMarks.filter(
          m => !(String(m.term || '1') === String(term) && String(m.year || '2026') === String(year) && m.subject === subject)
        );
      }

      persistAllData();

      if (window.DahamPasalaAPI) {
        await DahamPasalaAPI.deleteStudentExamMark(regNo, term, subject, year);
      }

      renderExamMarksTable();
      renderClassRankingsTable();
    }

    // ==========================================
    // Exam Marks Bulk CSV Import & Export Management
    // ==========================================
    let pendingBulkExamMarks = [];

    function exportExamMarksCsv() {
      const gradeFilter = document.getElementById("examGradeFilter")?.value || 'all';
      const grade = gradeFilter === 'all' ? '' : gradeFilter;
      const term = document.getElementById("examTermSelect")?.value || 'all';
      const year = document.getElementById("examYearInput")?.value || '2026';
      const url = window.DahamPasalaAPI 
        ? window.DahamPasalaAPI.getExamsExportUrl(grade, term, year)
        : `/api/exams/export?grade=${encodeURIComponent(grade)}&term=${encodeURIComponent(term)}&year=${encodeURIComponent(year)}`;
      
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Daham_Pasala_Exam_Marks_${year}_Term${term}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    function downloadExamTemplate() {
      const url = window.DahamPasalaAPI ? window.DahamPasalaAPI.getExamsTemplateUrl() : '/api/exams/template';
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", 'Daham_Pasala_Exam_Marks_Template.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    function openBulkImportExamsModal() {
      pendingBulkExamMarks = [];
      const fileInput = document.getElementById("bulkExamFileInput");
      if (fileInput) fileInput.value = "";
      const preview = document.getElementById("examBulkPreviewSection");
      if (preview) preview.style.display = "none";
      const submitBtn = document.getElementById("btnSubmitBulkExams");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> ලකුණු පද්ධතියට උඩුගත කරන්න (Import Marks)';
      }
      document.getElementById("bulkImportExamsModal").style.display = "flex";
    }

    function closeBulkImportExamsModal() {
      document.getElementById("bulkImportExamsModal").style.display = "none";
      pendingBulkExamMarks = [];
    }

    // CSV Parser supporting quoted cells and UTF-8 BOM
    function parseExamCsvText(text) {
      if (!text) return [];
      if (text.charCodeAt(0) === 0xFEFF) {
        text = text.slice(1);
      }
      const lines = text.split(/\r\n|\n|\r/).filter(l => l.trim().length > 0);
      if (lines.length < 2) return [];

      function parseLine(line) {
        const row = [];
        let inQuotes = false;
        let cell = '';
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          const next = line[i + 1];
          if (char === '"') {
            if (inQuotes && next === '"') {
              cell += '"';
              i++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === ',' && !inQuotes) {
            row.push(cell.trim());
            cell = '';
          } else {
            cell += char;
          }
        }
        row.push(cell.trim());
        return row;
      }

      return lines.map(parseLine);
    }

    function handleExamCsvFileSelected(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        const text = e.target.result;
        const rows = parseExamCsvText(text);
        if (rows.length < 2) {
          alert("CSV ගොනුවේ විභාග ලකුණු දත්ත හමු නොවීය. කරුණාකර ආදර්ශ ගොනුව බලා නැවත උත්සාහ කරන්න.");
          return;
        }

        // Expected Columns:
        // regNo, term, year, subject, marks, remarks OR
        // regNo, name, grade, term, year, subject, marks, grade, remarks
        pendingBulkExamMarks = [];
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (!r[0]) continue;

          let regNo, term, year, subject, marks, remarks;
          if (r.length >= 7 && (r[3] === '1' || r[3] === '2' || r[3] === '3')) {
            // Full export format: regNo, name, grade, term, year, subject, marks, grade, remarks
            regNo = r[0];
            term = r[3] || '1';
            year = r[4] || '2026';
            subject = r[5] || 'බුද්ධ ධර්මය';
            marks = Number(r[6] || 0);
            remarks = r[8] || '';
          } else {
            // Template format: regNo, term, year, subject, marks, remarks
            regNo = r[0];
            term = r[1] || '1';
            year = r[2] || '2026';
            subject = r[3] || 'බුද්ධ ධර්මය';
            marks = Number(r[4] || 0);
            remarks = r[5] || '';
          }

          if (isNaN(marks)) marks = 0;
          marks = Math.max(0, Math.min(100, marks));
          const calculatedGrade = calculateGrade(marks).grade;

          pendingBulkExamMarks.push({
            regNo,
            term: String(term),
            year: String(year),
            subject,
            marks,
            grade: calculatedGrade,
            remarks
          });
        }

        const countEl = document.getElementById("examBulkCount");
        if (countEl) countEl.textContent = pendingBulkExamMarks.length;

        const tbody = document.getElementById("examBulkPreviewBody");
        if (tbody) {
          tbody.innerHTML = pendingBulkExamMarks.map((m, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td><strong>${m.regNo}</strong></td>
              <td style="text-align: center;">${m.term}</td>
              <td style="text-align: center;">${m.year}</td>
              <td>${m.subject}</td>
              <td style="text-align: center;"><strong>${m.marks}</strong></td>
              <td style="text-align: center;"><span class="status-pill ${m.grade === 'W' ? 'absent' : 'present'}">${m.grade}</span></td>
            </tr>
          `).join('');
        }

        const preview = document.getElementById("examBulkPreviewSection");
        if (preview) preview.style.display = "block";

        const submitBtn = document.getElementById("btnSubmitBulkExams");
        if (submitBtn) submitBtn.disabled = pendingBulkExamMarks.length === 0;
      };
      reader.readAsText(file, "UTF-8");
    }

    async function submitBulkExamImport() {
      if (!pendingBulkExamMarks || pendingBulkExamMarks.length === 0) return;

      const submitBtn = document.getElementById("btnSubmitBulkExams");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ලකුණු ඇතුළත් වෙමින් පවතී...';
      }

      try {
        if (window.DahamPasalaAPI) {
          await window.DahamPasalaAPI.bulkImportExamMarks(pendingBulkExamMarks);
        }

        // Merge into local cache
        pendingBulkExamMarks.forEach(m => {
          const student = studentDb[m.regNo];
          if (student) {
            if (!Array.isArray(student.examMarks)) student.examMarks = [];
            const idx = student.examMarks.findIndex(
              existing => String(existing.term || '1') === String(m.term) && 
                          String(existing.year || '2026') === String(m.year) && 
                          existing.subject === m.subject
            );
            if (idx >= 0) {
              student.examMarks[idx] = m;
            } else {
              student.examMarks.push(m);
            }
          }
        });

        persistAllData();
        renderExamMarksTable();
        renderClassRankingsTable();

        alert(`සාර්ථකයි! විභාග ලකුණු ${pendingBulkExamMarks.length} ක් සාර්ථකව පද්ධතියට එක් කරන ලදී.`);
        closeBulkImportExamsModal();
      } catch (err) {
        console.error("Bulk exam marks import failed:", err);
        alert("තොග ඇතුළත් කිරීමේදී දෝෂයක් සිදුවිය: " + err.message);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> ලකුණු පද්ධතියට උඩුගත කරන්න (Import Marks)';
        }
      }
    }
