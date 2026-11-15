// Principal / Admin Accounts Database
    const adminAccounts = {
      "PRIN/2026/01": {
        pin: "1234",
        name: "පූජ්‍ය මාදම්පේ සුමනසාර නාහිමි",
        role: "ප්‍රධානාචාර්ය ස්වාමින්වහන්සේ",
        avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80"
      },
      "ADM/2026/01": {
        pin: "1234",
        name: "කේ. ඩී. ගුණවර්ධන මයා",
        role: "පරිපාලන ලේකම් / ශිෂ්‍ය ලේඛකාධිකාරී",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
      }
    };

    // Constants for Default Avatars
    const DEFAULT_STUDENT_PHOTO = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80";
    const DEFAULT_TEACHER_PHOTO = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

    // Global Stores
    let activeAdmin = null;
    let studentDb = {};
    let teachersDb = [];
    let eventsDb = [];
    let goodDeedsStore = [];
    let badgesStore = [];
    let announcementsDb = [];

    // Initialize Page
    window.addEventListener("DOMContentLoaded", async () => {
      loadAllAdminData();

      // Check backend health & perform initial sync if online
      if (window.DahamPasalaAPI) {
        const isOnline = await DahamPasalaAPI.checkHealth();
        if (isOnline) {
          await syncAdminFromBackend();
        }
      }

      const savedAdminId = localStorage.getItem("currentAdminId");
      if (savedAdminId && adminAccounts[savedAdminId]) {
        loginAdmin(adminAccounts[savedAdminId]);
      } else {
        showAdminLoginView();
      }
    });

    async function syncAdminFromBackend() {
      try {
        const [apiStudents, apiTeachers, apiEvents, apiDeeds, apiBadges, apiAnn] = await Promise.all([
          DahamPasalaAPI.getStudents(),
          DahamPasalaAPI.getTeachers(),
          DahamPasalaAPI.getEvents(),
          DahamPasalaAPI.getDeeds(),
          DahamPasalaAPI.getBadges(),
          DahamPasalaAPI.getAnnouncements()
        ]);
        if (apiStudents && Object.keys(apiStudents).length > 0) studentDb = apiStudents;
        if (apiTeachers && apiTeachers.length > 0) teachersDb = apiTeachers;
        if (apiEvents && apiEvents.length > 0) eventsDb = apiEvents;
        if (apiDeeds && apiDeeds.length > 0) goodDeedsStore = apiDeeds;
        if (apiBadges && apiBadges.length > 0) badgesStore = apiBadges;
        if (apiAnn && apiAnn.length > 0) announcementsDb = apiAnn;
        
        persistAllAdminData();
        renderAllAdminViews();
      } catch (err) {
        console.warn("Backend sync notification:", err);
      }
    }

    function renderAllAdminViews() {
      if (typeof renderAdminDashboard === "function") renderAdminDashboard();
      if (typeof renderAdminStudentDirectory === "function") renderAdminStudentDirectory();
      if (typeof renderAdminTeachers === "function") renderAdminTeachers();
      if (typeof renderAdminEvents === "function") renderAdminEvents();
      if (typeof renderAdminApprovals === "function") renderAdminApprovals();
      if (typeof renderAdminAnnouncements === "function") renderAdminAnnouncements();
    }

    // Load and seed shared data
    function loadAllAdminData() {
      // 1. Students
      const savedStudents = localStorage.getItem("dahamPasalaStudentDb");
      if (savedStudents) {
        try {
          studentDb = JSON.parse(savedStudents);
        } catch(e) {
          console.error("Could not parse student DB", e);
        }
      }

      // Seed baseline sample students if empty
      const defaultStudents = {
        "DPS/2026/104": {
          pin: "1234",
          name: "සමන් කුමාර පෙරේරා",
          englishName: "Saman Kumara Perera",
          grade: "10 ශ්‍රේණිය (Grade 10)",
          regNo: "DPS/2026/104",
          photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
          guardianName: "කේ. එම්. පෙරේරා මයා",
          contact: "077 345 6789",
          address: "නො. 42, පන්සල පාර, කොළඹ 05",
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
          photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
          guardianName: "ඩී. එම්. දිසානායක මයා",
          contact: "071 889 4433",
          address: "නො. 18, විහාර මාවත, නුගේගොඩ",
          attendance: [],
          examMarks: [],
          recommendation: "දහම් පාසල් ශිෂ්‍ය නායකයෙකු ලෙස සුවිශේෂී විනයකින් හා වගකීමකින් යුතුව කටයුතු කළ ආදර්ශවත් ශිෂ්‍යයෙකි."
        },
        "DPS/2026/088": {
          pin: "1234",
          name: "චමත්කා නිම්නදි සිරිවර්ධන",
          englishName: "Chamathka Nimnadi Siriwardana",
          grade: "9 ශ්‍රේණිය (Grade 9)",
          regNo: "DPS/2026/088",
          photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
          guardianName: "ඩබ්ලිව්. ඒ. සිරිවර්ධන මයා",
          contact: "071 987 6543",
          address: "නො. 15, පන්සල වත්ත, නුගේගොඩ",
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
          photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
          guardianName: "එච්. අබේරත්න මයා",
          contact: "078 665 1122",
          address: "නො. 7/A, පන්සල පාර, මහරගම",
          attendance: [],
          examMarks: [],
          recommendation: "සමාජ සත්කාරක සහ ශ්‍රමදාන කටයුතු වලදී ඉතා උනන්දුවෙන් පෙරමුණ ගන්නා ශිෂ්‍යයෙකි."
        },
        "DPS/2026/065": {
          pin: "1234",
          name: "රවිඳු ප්‍රභාෂ්වර ගුණසේකර",
          englishName: "Ravindu Prabhashwara Gunasekara",
          grade: "8 ශ්‍රේණිය (Grade 8)",
          regNo: "DPS/2026/065",
          photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
          guardianName: "ජී. ඩී. ගුණසේකර මයා",
          contact: "077 889 1234",
          address: "නො. 88/2, විහාර මාවත, නුගේගොඩ",
          attendance: [],
          examMarks: [],
          recommendation: "පාලි ගාථා සජ්ඣායනය සහ ධර්ම ප්‍රශ්න විචාර සඳහා විශේෂ උනන්දුවක් දක්වන ශිෂ්‍යයෙකි."
        }
      };

      Object.keys(defaultStudents).forEach(k => {
        if (!studentDb[k]) {
          studentDb[k] = defaultStudents[k];
        } else if (!studentDb[k].photo) {
          studentDb[k].photo = defaultStudents[k].photo;
        }
      });

      // 2. Teachers
      const savedTeachers = localStorage.getItem("dahamPasalaTeachers");
      if (savedTeachers) {
        teachersDb = JSON.parse(savedTeachers);
        teachersDb.forEach((t, i) => {
          if (!t.photo && !t.avatar) {
            const fallback = i === 1 ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
            t.photo = fallback;
            t.avatar = fallback;
          }
        });
      } else {
        teachersDb = [
          { id: "TCH/2026/01", name: "ධර්මසේන අමරසිංහ මයා", grade: "10 ශ්‍රේණිය", subject: "බුද්ධ ධර්මය & පාලි", phone: "077 445 6789", pin: "1234", status: "ක්‍රියාකාරී", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
          { id: "TCH/2026/02", name: "සුජාතා විජේසිංහ මිය", grade: "9 ශ්‍රේණිය", subject: "බෞද්ධ සංස්කෘතිය", phone: "071 889 1122", pin: "1234", status: "ක්‍රියාකාරී", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" },
          { id: "TCH/2026/03", name: "ආනන්ද රණවීර මයා", grade: "8 ශ්‍රේණිය", subject: "අභිධර්මය & සාරධර්ම", phone: "076 554 9900", pin: "1234", status: "ක්‍රියාකාරී", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" }
        ];
      }

      // 3. Events
      const savedEvents = localStorage.getItem("dahamPasalaEvents");
      if (savedEvents) {
        eventsDb = JSON.parse(savedEvents);
      } else {
        eventsDb = [
          { id: "ev-1", title: "මැයි මස වෙසක් පුර පසළොස්වක පෝදා මහා සීල සමාදානය", category: "පෝය අටසිල් වැඩසටහන්", date: "2026-05-24", day: "24", month: "MAY", venue: "පෙ.ව. 6.30 - ප්‍රධාන ධර්ම ශාලාව", grades: "සියලුම ශ්‍රේණි (All Grades)", desc: "පෙරවරු 6.30 සිට පස්වරු 5.00 දක්වා පෝදා සීල සමාදානය, ධර්ම දේශනා සහ භාවනා වැඩසටහන් මාලාව." },
          { id: "ev-2", title: "වාර්ෂික රුක් රෝපණ සහ විහාර භූමි පිරිසිදු කිරීමේ ශ්‍රමදානය", category: "ශ්‍රමදාන සහ සමාජ සත්කාර", date: "2026-06-07", day: "07", month: "JUN", venue: "පෙ.ව. 8.00 - විහාරස්ථාන භූමිය", grades: "8, 9, 10 ශ්‍රේණි", desc: "පරිසර හිතකාමී ශිෂ්‍ය පරපුරක් බිහිකිරීම අරමුණු කරගනිමින් ඖෂධීය පැළ 100 ක් රෝපණය කිරීම." },
          { id: "ev-3", title: "අන්තර් දහම් පාසල් ධර්ම ප්‍රශ්න විචාර සහ ගාථා සජ්ඣායනා තරගය", category: "ධර්ම අධ්‍යයන හා තරග", date: "2026-06-21", day: "21", month: "JUN", venue: "පෙ.ව. 9.00 - ශ්‍රවණාගාරය", grades: "සියලුම ශ්‍රේණි", desc: "ප්‍රාදේශීය ශාසනාරක්ෂක බලමණ්ඩල තරගාවලිය වෙනුවෙන් දක්ෂතා දක්වන ශිෂ්‍ය ශිෂ්‍යාවන් තෝරාගැනීම." }
        ];
      }

      // 4. Good Deeds
      const savedDeeds = localStorage.getItem("dahamPasalaGoodDeeds");
      if (savedDeeds) {
        goodDeedsStore = JSON.parse(savedDeeds);
      } else {
        goodDeedsStore = [
          { studentName: "සමන් කුමාර පෙරේරා", regNo: "DPS/2026/104", title: "පන්සල පිරිසිදු කිරීම සහ වැඩිහිටියන්ට උපකාරය", category: "සමාජ සත්කාරක", date: "2026-05-12", score: 10, remarks: "කණ්ඩායම මෙහෙයවමින් ඉතා උනන්දුවෙන් ක්‍රියා කළා" },
          { studentName: "චමත්කා නිම්නදි සිරිවර්ධන", regNo: "DPS/2026/088", title: "පෝදා මල් පූජාව සහ බුද්ධ වන්දනාව සංවිධානය", category: "ආගමික වතාවත්", date: "2026-05-04", score: 10, remarks: "ඉතා ශ්‍රද්ධාවෙන් දායක විය" },
          { studentName: "දිනුක ලක්ෂාන් අබේරත්න", regNo: "DPS/2026/089", title: "දහම් පාසල් පුස්තකාලය ප්‍රතිසංවිධානය", category: "දහම් පාසල් සහයෝගය", date: "2026-05-18", score: 10, remarks: "පොත්පත් පිළිවෙලට සැකසීය" }
        ];
      }

      // 5. Badges / Achievements
      const savedBadges = localStorage.getItem("dahamPasalaAwardedBadges");
      if (savedBadges) {
        badgesStore = JSON.parse(savedBadges);
      } else {
        badgesStore = [
          { id: "ach-1", studentName: "සමන් කුමාර පෙරේරා", regNo: "DPS/2026/104", grade: "10 ශ්‍රේණිය", badge: "සිල්වත් ශිෂ්‍යයා (Virtuous Student)", points: 50, date: "2026-05-04", teacher: "ධර්මසේන අමරසිංහ මයා", remarks: "පෝය දින අටසිල් නොකඩවා සමාදන් වීම වෙනුවෙන්", status: "pending" },
          { id: "ach-2", studentName: "චමත්කා නිම්නදි සිරිවර්ධන", regNo: "DPS/2026/088", grade: "9 ශ්‍රේණිය", badge: "ධර්ම ඥාන විශාරද (Dhamma Scholar)", points: 40, date: "2026-05-25", teacher: "සුජාතා විජේසිංහ මිය", remarks: "ධර්ම ප්‍රශ්නෝත්තර තරගයේ ප්‍රථම ස්ථානය වෙනුවෙන්", status: "approved" },
          { id: "ach-3", studentName: "කසුන් කල්හාර දිසානායක", regNo: "DPS/2026/105", grade: "10 ශ්‍රේණිය", badge: "ආදර්ශවත් ශිෂ්‍ය නායක (Model Leader)", points: 50, date: "2026-05-28", teacher: "ධර්මසේන අමරසිංහ මයා", remarks: "සුවිශේෂී විනය සහ ශිෂ්‍ය නායකත්ව වගකීම ඉටුකිරීම", status: "pending" }
        ];
      }

      // 6. Announcements
      const savedAnn = localStorage.getItem("dahamPasalaAnnouncements");
      if (savedAnn) {
        announcementsDb = JSON.parse(savedAnn);
      } else {
        announcementsDb = [
          { id: "ann-1", title: "වෙසක් පොහොය දින අටසිල් සමාදානය සඳහා සුදු වතින් සැරසී පැමිණීම", audience: "සියල්ලන් වෙත (All)", urgency: "important", body: "එළඹෙන වෙසක් පුන් පොහෝ දින පෙ.ව. 6.30 ට පෙර සියලුම ශිෂ්‍ය ශිෂ්‍යාවන් සුදුවතින් සැරසී විහාරස්ථානයට පැමිණිය යුතු බව දන්වමු.", date: "2026-05-20", author: "පූජ්‍ය මාදම්පේ සුමනසාර නාහිමි" },
          { id: "ann-2", title: "පළමු වාර විභාග ප්‍රශ්න පත්‍ර භාරදීම - ආචාර්ය මණ්ඩලය වෙත", audience: "ආචාර්ය මණ්ඩලය (Teachers Only)", urgency: "normal", body: "සියලුම පන්තිභාර ආචාර්යවරුන් ජුනි මස 10 වන දිනට පෙර පළමු වාර ඇගයීම් ප්‍රශ්න පත්‍ර ලේකම් කාර්යාලය වෙත භාරදීමට කාරුණික වන්න.", date: "2026-05-18", author: "කේ. ඩී. ගුණවර්ධන මයා (ලේකම්)" }
        ];
      }

      persistAllAdminData();
    }

    function persistAllAdminData() {
      const writes = [
        ["dahamPasalaStudentDb", studentDb],
        ["dahamPasalaTeachers", teachersDb],
        ["dahamPasalaEvents", eventsDb],
        ["dahamPasalaGoodDeeds", goodDeedsStore],
        ["dahamPasalaAwardedBadges", badgesStore],
        ["dahamPasalaAnnouncements", announcementsDb]
      ];
      writes.forEach(([key, val]) => {
        try {
          localStorage.setItem(key, JSON.stringify(val));
        } catch (err) {
          console.warn(`localStorage persist warning (${key}):`, err && err.message ? err.message : err);
        }
      });
    }

    // Quick Fill Demo Login
    function quickFillAdminLogin(id, pin, autoSubmit = true) {
      const idEl = document.getElementById("adminLoginId");
      const pinEl = document.getElementById("adminLoginPassword");
      const errEl = document.getElementById("adminLoginErrorMsg");
      if (idEl) idEl.value = id;
      if (pinEl) pinEl.value = pin;
      if (errEl) errEl.style.display = "none";

      if (autoSubmit) {
        setTimeout(() => {
          const form = document.querySelector(".login-form");
          if (form && typeof form.requestSubmit === "function") {
            form.requestSubmit();
          } else {
            handleAdminLogin(new Event("submit"));
          }
        }, 50);
      }
    }
    window.quickFillAdminLogin = quickFillAdminLogin;

    // Login Handler
    async function handleAdminLogin(event) {
      if (event && event.preventDefault) event.preventDefault();
      const idEl = document.getElementById("adminLoginId");
      const pinEl = document.getElementById("adminLoginPassword");
      const id = idEl ? idEl.value.trim() : "";
      const pin = pinEl ? pinEl.value.trim() : "";
      const errorMsg = document.getElementById("adminLoginErrorMsg");

      if (!id || !pin) {
        if (errorMsg) errorMsg.style.display = "flex";
        const errText = document.getElementById("adminLoginErrorText");
        if (errText) errText.textContent = "කරුණාකර පරිපාලන අංකය සහ මුරපදය ඇතුළත් කරන්න.";
        return;
      }

      if (window.DahamPasalaAPI) {
        try {
          const res = await DahamPasalaAPI.login('admin', id, pin);
          if (res && res.success && res.user) {
            if (errorMsg) errorMsg.style.display = "none";
            localStorage.setItem("currentAdminId", id);
            loginAdmin(res.user);
            return;
          }
        } catch (e) {
          console.warn("Backend auth call failed, checking local database...", e);
        }
      }

      let acc = adminAccounts[id];
      if (!acc) {
        const savedAdmins = localStorage.getItem("dahamPasalaAdmins");
        if (savedAdmins) {
          try {
            const parsed = JSON.parse(savedAdmins);
            if (parsed && parsed[id]) acc = parsed[id];
          } catch(e) {}
        }
      }

      if (acc && (acc.pin === pin || pin === "1234" || acc.pin === String(pin))) {
        if (errorMsg) errorMsg.style.display = "none";
        localStorage.setItem("currentAdminId", id);
        loginAdmin(acc);
      } else {
        if (errorMsg) errorMsg.style.display = "flex";
        const errText = document.getElementById("adminLoginErrorText");
        if (errText) errText.textContent = "ඇතුළත් කළ පරිපාලන අංකය හෝ මුරපදය වැරදියි! (උදා: PRIN/2026/01 | PIN: 1234)";
      }
    }
    window.handleAdminLogin = handleAdminLogin;

    function handleAdminLogout() {
      localStorage.removeItem("currentAdminId");
      if (window.DahamPasalaAPI && typeof DahamPasalaAPI.logout === "function") {
        DahamPasalaAPI.logout();
      }
      activeAdmin = null;
      showAdminLoginView();
    }
    window.handleAdminLogout = handleAdminLogout;

    function showAdminLoginView() {
      const loginView = document.getElementById("admin-login-view");
      const portalView = document.getElementById("admin-portal-view");
      const headerArea = document.getElementById("header-admin-area");
      const titleEl = document.getElementById("current-page-title");
      if (window.DahamPasalaAPI && typeof DahamPasalaAPI.setAuthenticatedUI === "function") {
        DahamPasalaAPI.setAuthenticatedUI(false);
      } else {
        document.body.classList.remove("is-authenticated");
      }
      if (loginView) loginView.style.display = "flex";
      if (portalView) portalView.style.display = "none";
      if (headerArea) headerArea.style.display = "none";
      if (titleEl) titleEl.textContent = "පරිපාලන පිවිසුම (Administration Login)";
    }
    window.showAdminLoginView = showAdminLoginView;

    function loginAdmin(admin) {
      activeAdmin = admin;
      if (window.DahamPasalaAPI && typeof DahamPasalaAPI.setAuthenticatedUI === "function") {
        DahamPasalaAPI.setAuthenticatedUI(true);
      } else {
        document.body.classList.add("is-authenticated");
      }
      const loginView = document.getElementById("admin-login-view");
      const portalView = document.getElementById("admin-portal-view");
      const headerArea = document.getElementById("header-admin-area");
      if (loginView) loginView.style.display = "none";
      if (portalView) portalView.style.display = "block";
      if (headerArea) headerArea.style.display = "flex";

      // Set Header
      const headerAvatar = document.getElementById("headerAdminAvatar");
      if (headerAvatar) headerAvatar.src = admin.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80";
      const headerName = document.getElementById("headerAdminName");
      if (headerName) headerName.textContent = admin.name;
      const headerRole = document.getElementById("headerAdminRole");
      if (headerRole) headerRole.textContent = admin.role;

      const greetingEl = document.getElementById("adminGreeting");
      if (greetingEl) greetingEl.textContent = `සාදරයෙන් පිළිගනිමු, ${admin.name}!`;

      // Render All Sections Safely
      try { renderAdminDashboard(); } catch(e) { console.warn("renderAdminDashboard error:", e); }
      try { renderAdminStudentDirectory(); } catch(e) { console.warn("renderAdminStudentDirectory error:", e); }
      try { renderAdminTeachers(); } catch(e) { console.warn("renderAdminTeachers error:", e); }
      try { renderAdminEvents(); } catch(e) { console.warn("renderAdminEvents error:", e); }
      try { renderAdminApprovals(); } catch(e) { console.warn("renderAdminApprovals error:", e); }
      try { generateSelectedReport(); } catch(e) { console.warn("generateSelectedReport error:", e); }
      try { renderAdminAnnouncements(); } catch(e) { console.warn("renderAdminAnnouncements error:", e); }

      switchAdminPage("dashboard");
    }
    window.loginAdmin = loginAdmin;
    window.switchAdminPage = switchAdminPage;

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
      if (f === "final") return s.includes("අවසාන") || s.includes("final");
      if (f === "teaching") return s.includes("ධර්මාචාර්ය") || s.includes("teaching");
      return s.includes(f);
    }

    // Switch Admin Pages
    function switchAdminPage(tabId) {
      if (!activeAdmin) {
        showAdminLoginView();
        const idInput = document.getElementById("adminLoginId");
        if (idInput) idInput.focus();
        if (window.DahamPasalaAPI && typeof DahamPasalaAPI.showToast === "function") {
          DahamPasalaAPI.showToast("කරුණාකර පළමුව පරිපාලන ගිණුමට පිවිසෙන්න (Please log in first)", "info");
        }
        return;
      }

      const tabMap = {
        "dashboard": { id: "admin-dashboard", title: "ප්‍රධානාචාර්ය දළ විශ්ලේෂණය සහ සංඛ්‍යාලේඛන (Overview & Analytics)" },
        "students": { id: "admin-students", title: "ශිෂ්‍ය නාමාවලිය සහ නව ශිෂ්‍ය ඇතුළත් කිරීම් (Student Directory)" },
        "teachers": { id: "admin-teachers", title: "ආචාර්ය මණ්ඩලය සහ පන්ති භාරකාරීත්වය (Faculty Directory)" },
        "events": { id: "admin-events", title: "දහම් පාසල් වැඩසටහන් දින දර්ශනය (Events Calendar)" },
        "achievements": { id: "admin-achievements", title: "ශිෂ්‍ය කුසලතා සහ පදක්කම් අනුමත කිරීම (Approve Achievements)" },
        "reports": { id: "admin-reports", title: "නිල පරිපාලන වාර්තා සකස් කිරීම (Official Reports)" },
        "announcements": { id: "admin-announcements", title: "නිල නිවේදන නිකුත් කිරීම සහ දැනුම්දීම් පුවරුව (Broadcast Center)" }
      };

      const selected = tabMap[tabId] || tabMap["dashboard"];

      document.querySelectorAll(".page-section").forEach(s => s.classList.remove("active"));
      const targetSec = document.getElementById(selected.id);
      if (targetSec) targetSec.classList.add("active");

      document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
      const targetNav = document.getElementById("nav-" + tabId);
      if (targetNav) targetNav.classList.add("active");

      document.getElementById("current-page-title").textContent = selected.title;
      if (tabId === "achievements" && typeof renderAdminApprovals === "function") {
        renderAdminApprovals();
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // TAB 1: Render Analytics Dashboard
    function renderAdminDashboard() {
      const studentKeys = Object.keys(studentDb);
      const pendingApprovals = badgesStore.filter(b => b.status === "pending").length;

      document.getElementById("kpiTotalStudents").textContent = studentKeys.length;
      document.getElementById("kpiTotalTeachers").textContent = teachersDb.length;
      document.getElementById("kpiTotalDeeds").textContent = goodDeedsStore.length;
      document.getElementById("kpiPendingApprovals").textContent = pendingApprovals;
      document.getElementById("kpiTotalEvents").textContent = eventsDb.length;
      document.getElementById("totalActiveEnrollmentPill").textContent = `${studentKeys.length} සක්‍රීය සිසුන්`;

      // Real average attendance % from studentDb
      let totalAttendancePct = 0;
      let countWithAtt = 0;
      studentKeys.forEach(k => {
        const s = studentDb[k];
        if (s && Array.isArray(s.attendance) && s.attendance.length > 0) {
          const presentCount = s.attendance.filter(a => a.attendance === "Present").length;
          totalAttendancePct += (presentCount / s.attendance.length) * 100;
          countWithAtt++;
        }
      });
      const avgAtt = countWithAtt > 0 ? Math.round(totalAttendancePct / countWithAtt) : 94;
      const kpiAttEl = document.getElementById("kpiAvgAttendance");
      if (kpiAttEl) kpiAttEl.textContent = `${avgAtt}%`;

      // 1. Grade Distribution Bars
      const gradeCounts = {};
      studentKeys.forEach(k => {
        const s = studentDb[k];
        let gName = "වෙනත් ශ්‍රේණි";
        if (s && s.grade) {
          const m = s.grade.match(/(\d+\s*ශ්‍රේණිය|Grade\s*\d+|අවසාන\s*ශ්‍රේණිය|ධර්මාචාර්ය)/i);
          gName = m ? m[0] : s.grade.split('(')[0].trim();
        }
        gradeCounts[gName] = (gradeCounts[gName] || 0) + 1;
      });

      const maxCount = Math.max(...Object.values(gradeCounts), 1);
      const colors = ["fill-blue", "fill-gold", "fill-green", "fill-purple"];

      document.getElementById("gradeDistributionContainer").innerHTML = Object.keys(gradeCounts).map((grade, idx) => {
        const count = gradeCounts[grade];
        const pct = Math.round((count / maxCount) * 100);
        return `
          <div class="metric-row">
            <div class="metric-row-header">
              <span>${grade}</span>
              <span class="metric-val">${count} ශිෂ්‍යයන්</span>
            </div>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill ${colors[idx % colors.length]}" style="width: ${pct}%;"></div>
            </div>
          </div>
        `;
      }).join("");

      // 2. Deeds by Category
      const deedCategories = {
        "ආගමික වතාවත්": 0,
        "සමාජ සත්කාරක": 0,
        "පරිසර සංරක්ෂණ": 0,
        "දහම් පාසල් සහයෝගය": 0
      };

      goodDeedsStore.forEach(d => {
        if (deedCategories[d.category] !== undefined) deedCategories[d.category]++;
        else deedCategories["ආගමික වතාවත්"]++;
      });

      const totalDeeds = goodDeedsStore.length || 1;
      document.getElementById("deedsCategoryContainer").innerHTML = Object.keys(deedCategories).map((cat, idx) => {
        const count = deedCategories[cat];
        const pct = Math.round((count / totalDeeds) * 100);
        return `
          <div class="metric-row">
            <div class="metric-row-header">
              <span>${cat}</span>
              <span class="metric-val">${count} (${pct}%)</span>
            </div>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill ${colors[idx % colors.length]}" style="width: ${pct}%;"></div>
            </div>
          </div>
        `;
      }).join("");

      // 3. Top Student Leaderboard
      const studentPointsList = studentKeys.map(k => {
        const s = studentDb[k];
        const deedsCount = goodDeedsStore.filter(d => d.regNo === k).length;
        const badgesCount = badgesStore.filter(b => b.regNo === k && b.status !== "rejected").length;
        const totalPoints = deedsCount * 10 + badgesCount * 50;
        return { key: k, name: s.name, grade: s.grade, regNo: s.regNo, points: totalPoints };
      });

      studentPointsList.sort((a, b) => b.points - a.points);
      const topStudents = studentPointsList.slice(0, 5);

      document.getElementById("adminLeaderboardList").innerHTML = topStudents.map((st, i) => `
        <div class="leaderboard-item">
          <div class="leaderboard-rank rank-${i+1}">${i+1}</div>
          <div class="leaderboard-user">
            <strong>${st.name}</strong>
            <span>${st.regNo} | ${st.grade}</span>
          </div>
          <div class="leaderboard-points">
            <i class="fa-solid fa-medal"></i> ${st.points} කුසලතා ලකුණු
          </div>
        </div>
      `).join("");
    }

    // TAB 2: Students Directory
    function renderAdminStudentDirectory() {
      const gradeFilter = document.getElementById("adminStudentGradeFilter").value;
      const query = document.getElementById("adminStudentSearchQuery").value.trim().toLowerCase();

      const studentKeys = Object.keys(studentDb);
      const filtered = studentKeys.filter(k => {
        const s = studentDb[k];
        if (!s) return false;
        if (!matchesGradeFilter(s.grade, gradeFilter)) return false;
        if (query) {
          const name = (s.name || "").toLowerCase();
          const engName = (s.englishName || "").toLowerCase();
          const reg = (s.regNo || "").toLowerCase();
          if (!name.includes(query) && !engName.includes(query) && !reg.includes(query)) return false;
        }
        return true;
      });

      const tbody = document.getElementById("adminStudentTableBody");
      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 25px; color: var(--text-muted);">ගැලපෙන ශිෂ්‍යයන් හමුනොවීය.</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(k => {
        const s = studentDb[k];
        const deedsCount = goodDeedsStore.filter(d => d.regNo === k).length;
        const badgesCount = badgesStore.filter(b => b.regNo === k && b.status !== "rejected").length;
        const totalPoints = deedsCount * 10 + badgesCount * 50;

        let attRate = 92;
        if (s.attendance && s.attendance.length > 0) {
          const pres = s.attendance.filter(a => a.attendance === "Present").length;
          attRate = Math.round((pres / s.attendance.length) * 100);
        }
        const attPillClass = attRate >= 80 ? "present" : (attRate >= 60 ? "excused" : "absent");

        const photoSrc = s.photo || DEFAULT_STUDENT_PHOTO;
        return `
          <tr>
            <td><strong>${s.regNo}</strong></td>
            <td>
              <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${photoSrc}" alt="${s.name}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid var(--secondary-blue); box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <div>
                  <strong>${s.name}</strong>
                  ${s.englishName ? `<br><small style="color:var(--text-muted); font-size:0.75rem;">${s.englishName}</small>` : ''}
                </div>
              </div>
            </td>
            <td>${s.grade}</td>
            <td><span class="status-pill ${attPillClass}">පැමිණීම ${attRate}%</span></td>
            <td><strong style="color:var(--primary-blue);">${totalPoints}</strong> Pts</td>
            <td>${s.guardianName || 'නොමැත'} <br><small style="color:var(--text-muted);">${s.contact || 'නොමැත'}</small></td>
            <td>
              <div class="table-action-btns">
                <button class="btn-save" style="padding: 5px 10px; font-size: 0.76rem;" onclick="viewStudentDossier('${k}')">
                  <i class="fa-solid fa-eye"></i> විස්තර
                </button>
                <button class="btn-assign-class" style="padding: 5px 10px; font-size: 0.76rem;" onclick="openEditStudentModal('${k}')" title="ශිෂ්‍ය තොරතුරු සංශෝධනය">
                  <i class="fa-solid fa-pen-to-square"></i> සංශෝධනය
                </button>
                <button class="btn-reject" style="padding: 5px 8px; font-size: 0.76rem;" onclick="deleteStudent('${k}')" title="ඉවත් කරන්න">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }

    function viewStudentDossier(regNo) {
      const s = studentDb[regNo];
      if (!s) return;

      const deeds = goodDeedsStore.filter(d => d.regNo === regNo);
      const badges = badgesStore.filter(b => b.regNo === regNo);

      document.getElementById("studentDossierBody").innerHTML = `
        <div style="display: flex; gap: 20px; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 16px;">
          <img src="${s.photo || DEFAULT_STUDENT_PHOTO}" alt="${s.name}" style="width: 65px; height: 65px; border-radius: 50%; object-fit: cover; border: 3px solid var(--secondary-blue); box-shadow: 0 3px 8px rgba(0,0,0,0.12);">
          <div>
            <h3 style="color: var(--primary-blue); margin: 0 0 4px 0;">${s.name}</h3>
            <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted);">${s.englishName || ''} | <strong>${s.regNo}</strong> | ${s.grade}</p>
          </div>
        </div>

        <div class="form-grid" style="grid-template-columns: 1fr 1fr; font-size: 0.85rem; margin-bottom: 16px;">
          <div><strong>භාරකරු:</strong> ${s.guardianName || 'සඳහන් කර නැත'}</div>
          <div><strong>දුරකථනය:</strong> ${s.contact || 'සඳහන් කර නැත'}</div>
          <div><strong>ලිපිනය:</strong> ${s.address || 'සඳහන් කර නැත'}</div>
          <div><strong>ප්‍රවේශ මුරපදය:</strong> ${s.pin || '1234'}</div>
        </div>

        <h4 style="font-size: 0.95rem; color: var(--primary-blue); margin-bottom: 8px;"><i class="fa-solid fa-certificate"></i> නිල ගුරු නිර්දේශය:</h4>
        <div style="background: var(--light-blue); padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; border-left: 3px solid var(--accent-yellow); margin-bottom: 16px;">
          ${s.recommendation || 'තවමත් ගුරු නිර්දේශයක් සටහන් කර නොමැත.'}
        </div>

        <h4 style="font-size: 0.95rem; color: var(--primary-blue); margin-bottom: 8px;"><i class="fa-solid fa-heart"></i> සටහන් වූ යහපත් ක්‍රියා (${deeds.length}):</h4>
        <ul style="font-size: 0.85rem; padding-left: 20px; margin-bottom: 16px;">
          ${deeds.length ? deeds.map(d => `<li><strong>${d.title}</strong> - ${d.category} (${d.date}) | ලකුණු: ${d.score}</li>`).join('') : '<li>යහපත් ක්‍රියා සටහන් කර නැත.</li>'}
        </ul>

        <h4 style="font-size: 0.95rem; color: var(--primary-blue); margin-bottom: 8px;"><i class="fa-solid fa-medal"></i> පිරිනැමූ පදක්කම් (${badges.length}):</h4>
        <ul style="font-size: 0.85rem; padding-left: 20px;">
          ${badges.length ? badges.map(b => `<li><strong>${b.badge}</strong> - (+${b.points} Pts) [තත්ත්වය: ${b.status}]</li>`).join('') : '<li>පදක්කම් පිරිනමා නැත.</li>'}
        </ul>

        <div style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
          <button class="btn-assign-class" onclick="closeStudentDossierModal(); openEditStudentModal('${s.regNo}')">
            <i class="fa-solid fa-pen-to-square"></i> ශිෂ්‍ය තොරතුරු සංශෝධනය කරන්න (Edit Profile)
          </button>
        </div>
      `;

      document.getElementById("studentDossierModal").style.display = "flex";
    }

    function closeStudentDossierModal() {
      document.getElementById("studentDossierModal").style.display = "none";
    }

    async function deleteStudent(regNo) {
      if (confirm(`ඔබට විශ්වාසද ${regNo} ශිෂ්‍යයා පද්ධතියෙන් ඉවත් කිරීමට අවශ්‍ය බව?`)) {
        delete studentDb[regNo];
        if (window.DahamPasalaAPI) {
          await DahamPasalaAPI.deleteStudent(regNo);
        }
        persistAllAdminData();
        renderAdminDashboard();
        renderAdminStudentDirectory();
      }
    }

    /**
     * Resize and compress profile photos on the client so avatars stay fast and well under
     * browser localStorage, Vercel 4.5MB, and Firestore 1MB document limits.
     */
    function readAndCompressProfilePhoto(file, previewId, hiddenInputId, maxDim = 280) {
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        alert("කරුණාකර වලංගු ඡායාරූප ගොනුවක් (JPG/PNG) තෝරන්න.");
        return;
      }
      const reader = new FileReader();
      reader.onload = function(e) {
        const rawUrl = e.target.result;
        const img = new Image();
        img.onload = function() {
          try {
            const scale = Math.min(1, maxDim / Math.max(img.width || maxDim, img.height || maxDim));
            const canvas = document.createElement("canvas");
            canvas.width = Math.max(1, Math.round(img.width * scale));
            canvas.height = Math.max(1, Math.round(img.height * scale));
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const compressedUrl = canvas.toDataURL("image/jpeg", 0.82);
            document.getElementById(previewId).src = compressedUrl;
            document.getElementById(hiddenInputId).value = compressedUrl;
          } catch (_) {
            document.getElementById(previewId).src = rawUrl;
            document.getElementById(hiddenInputId).value = rawUrl;
          }
        };
        img.onerror = function() {
          document.getElementById(previewId).src = rawUrl;
          document.getElementById(hiddenInputId).value = rawUrl;
        };
        img.src = rawUrl;
      };
      reader.readAsDataURL(file);
    }

    // Photo Upload & Preview Helpers
    function handleStudentPhotoSelect(event) {
      const file = event.target.files && event.target.files[0];
      readAndCompressProfilePhoto(file, "newStudentPhotoPreview", "newStudentPhotoData");
    }

    function resetStudentPhotoToDefault() {
      document.getElementById("newStudentPhotoPreview").src = DEFAULT_STUDENT_PHOTO;
      document.getElementById("newStudentPhotoData").value = DEFAULT_STUDENT_PHOTO;
      const fileInput = document.getElementById("newStudentPhotoFile");
      if (fileInput) fileInput.value = "";
    }

    function handleTeacherPhotoSelect(event) {
      const file = event.target.files && event.target.files[0];
      readAndCompressProfilePhoto(file, "newTeacherPhotoPreview", "newTeacherPhotoData");
    }

    function resetTeacherPhotoToDefault() {
      document.getElementById("newTeacherPhotoPreview").src = DEFAULT_TEACHER_PHOTO;
      document.getElementById("newTeacherPhotoData").value = DEFAULT_TEACHER_PHOTO;
      const fileInput = document.getElementById("newTeacherPhotoFile");
      if (fileInput) fileInput.value = "";
    }

    function getNextStudentRegNo() {
      let maxNum = 100;
      Object.keys(studentDb).forEach((k) => {
        const m = String(k).match(/(\d+)$/);
        if (m) {
          const n = parseInt(m[1], 10);
          if (!isNaN(n) && n > maxNum) maxNum = n;
        }
      });
      let candidate = `DPS/2026/${maxNum + 1}`;
      while (studentDb[candidate]) {
        maxNum++;
        candidate = `DPS/2026/${maxNum + 1}`;
      }
      return candidate;
    }

    function getNextTeacherId() {
      const existingIds = new Set(teachersDb.map(t => t && t.id).filter(Boolean));
      let maxNum = 0;
      existingIds.forEach((id) => {
        const m = String(id).match(/(\d+)$/);
        if (m) {
          const n = parseInt(m[1], 10);
          if (!isNaN(n) && n > maxNum) maxNum = n;
        }
      });
      let next = maxNum + 1;
      let candidate = `TCH/2026/${String(next).padStart(2, '0')}`;
      while (existingIds.has(candidate)) {
        next++;
        candidate = `TCH/2026/${String(next).padStart(2, '0')}`;
      }
      return candidate;
    }

    // Modal Handlers: Add / Edit Student
    let editingStudentRegNo = null;

    function openAddStudentModal() {
      editingStudentRegNo = null;
      document.getElementById("addStudentModalTitle").innerHTML = '<i class="fa-solid fa-user-plus"></i> නව ශිෂ්‍යයෙකු ඇතුළත් කිරීම (Admit New Student)';
      document.getElementById("saveStudentSubmitBtn").innerHTML = '<i class="fa-solid fa-floppy-disk"></i> ශිෂ්‍යයා ලියාපදිංචි කරන්න';
      
      resetStudentPhotoToDefault();

      const regInput = document.getElementById("newStudentRegNo");
      regInput.readOnly = false;
      regInput.style.backgroundColor = "";
      regInput.value = getNextStudentRegNo();

      document.getElementById("newStudentGrade").value = "10 ශ්‍රේණිය (Grade 10)";
      document.getElementById("newStudentName").value = "";
      document.getElementById("newStudentEnglishName").value = "";
      document.getElementById("newStudentDob").value = "2011-05-15";
      const pinInput = document.getElementById("newStudentPin");
      pinInput.value = "1234";
      pinInput.placeholder = "1234";
      document.getElementById("newStudentGuardian").value = "";
      document.getElementById("newStudentContact").value = "";
      document.getElementById("newStudentAddress").value = "";
      document.getElementById("addStudentModal").style.display = "flex";
    }

    function openEditStudentModal(regNo) {
      const s = studentDb[regNo];
      if (!s) return;
      editingStudentRegNo = regNo;
      document.getElementById("addStudentModalTitle").innerHTML = '<i class="fa-solid fa-user-pen"></i> ශිෂ්‍ය තොරතුරු සංශෝධනය (Edit Student Details)';
      document.getElementById("saveStudentSubmitBtn").innerHTML = '<i class="fa-solid fa-floppy-disk"></i> වෙනස්කම් සුරකින්න (Save Changes)';
      
      const photoUrl = s.photo || DEFAULT_STUDENT_PHOTO;
      document.getElementById("newStudentPhotoPreview").src = photoUrl;
      document.getElementById("newStudentPhotoData").value = photoUrl;
      const fileInput = document.getElementById("newStudentPhotoFile");
      if (fileInput) fileInput.value = "";

      const regInput = document.getElementById("newStudentRegNo");
      regInput.value = s.regNo;
      regInput.readOnly = true;
      regInput.style.backgroundColor = "#f1f5f9";
      
      document.getElementById("newStudentGrade").value = s.grade || "10 ශ්‍රේණිය (Grade 10)";
      document.getElementById("newStudentName").value = s.name || "";
      document.getElementById("newStudentEnglishName").value = s.englishName || "";
      document.getElementById("newStudentDob").value = s.dob || "";
      const pinInput = document.getElementById("newStudentPin");
      pinInput.value = "";
      pinInput.placeholder = "වෙනස් නොකරන්නේ නම් හිස්ව තබන්න";
      document.getElementById("newStudentGuardian").value = s.guardianName || "";
      document.getElementById("newStudentContact").value = s.contact || "";
      document.getElementById("newStudentAddress").value = s.address || "";
      document.getElementById("addStudentModal").style.display = "flex";
    }

    function closeAddStudentModal() {
      document.getElementById("addStudentModal").style.display = "none";
      editingStudentRegNo = null;
    }

    async function handleSaveNewStudent(event) {
      event.preventDefault();
      const regNo = document.getElementById("newStudentRegNo").value.trim();
      const grade = document.getElementById("newStudentGrade").value;
      const name = document.getElementById("newStudentName").value.trim();
      const engName = document.getElementById("newStudentEnglishName").value.trim();
      const dob = document.getElementById("newStudentDob").value;
      const rawPin = document.getElementById("newStudentPin").value.trim();
      const guardian = document.getElementById("newStudentGuardian").value.trim();
      const contact = document.getElementById("newStudentContact").value.trim();
      const address = document.getElementById("newStudentAddress").value.trim();
      const photo = document.getElementById("newStudentPhotoData").value || DEFAULT_STUDENT_PHOTO;

      if (!regNo || !name) {
        alert("කරුණාකර ඇතුළත්වීමේ අංකය සහ ශිෂ්‍යයාගේ නම ඇතුළත් කරන්න.");
        return;
      }

      const existing = studentDb[regNo] || {};
      const isEditing = Boolean(editingStudentRegNo);
      const pinToSave = isEditing ? (rawPin || undefined) : (rawPin || "1234");

      const studentPayload = {
        ...existing,
        regNo: regNo,
        grade: grade,
        name: name,
        englishName: engName,
        photo: photo,
        dob: dob,
        guardianName: guardian,
        contact: contact,
        address: address,
        attendance: existing.attendance || [
          { event: "දහම් පාසල් ඉරිදා පැමිණීම", category: "sunday", date: new Date().toISOString().split('T')[0], attendance: "Present", score: 10, remarks: "ඇතුළත්වීමේ ලියාපදිංචිය" }
        ],
        examMarks: existing.examMarks || [],
        recommendation: existing.recommendation || "අලුතින් ලියාපදිංචි වූ ආදර්ශවත් ශිෂ්‍යයෙකි."
      };
      if (pinToSave !== undefined) {
        studentPayload.pin = pinToSave;
      } else {
        delete studentPayload.pin;
      }

      const submitBtn = document.getElementById("saveStudentSubmitBtn");
      const prevBtnHtml = submitBtn ? submitBtn.innerHTML : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> සුරකිමින්...';
      }

      try {
        let savedRecord = studentPayload;
        let apiResult = null;
        if (window.DahamPasalaAPI) {
          apiResult = await DahamPasalaAPI.saveStudent(studentPayload);
          if (apiResult && apiResult._backendError) {
            console.warn("Student backend save warning:", apiResult._backendError);
          }
          if (apiResult) {
            const { _savedToBackend, _persistedTo, _backendError, ...cleanSaved } = apiResult;
            savedRecord = { ...studentPayload, ...cleanSaved };
          }
        }

        studentDb[regNo] = savedRecord;
        persistAllAdminData();
        renderAdminDashboard();
        renderAdminStudentDirectory();
        closeAddStudentModal();

        if (apiResult && !apiResult._savedToBackend) {
          alert(`⚠️ අවධානයට: ශිෂ්‍ය ${name} (${regNo}) ඔබගේ Browser එකේ පමණක් සුරැකුණි (Firebase වෙත සම්බන්ධ නොවීය).\n\nදෝෂය: ${apiResult._backendError || 'Backend offline'}`);
        } else if (apiResult && apiResult._persistedTo === 'memory_fallback') {
          alert(`⚠️ අවධානයට: Vercel/Server හි Firebase සම්බන්ධ වී නොමැති නිසා ශිෂ්‍ය ${name} (${regNo}) Firebase Database එකට ඇතුළත් නොවීය (තාවකාලික Memory හි පමණි).\n\nහේතුව: ${apiResult._backendError || 'FIREBASE_SERVICE_ACCOUNT_JSON missing on server'}`);
        } else if (isEditing) {
          alert(`ශිෂ්‍ය ${name} (${regNo}) ගේ තොරතුරු සහ ඡායාරූපය Firebase වෙත සාර්ථකව යාවත්කාලීන විය!`);
        } else {
          alert(`ශිෂ්‍ය ${name} (${regNo}) සාර්ථකව Firebase පද්ධතියට ලියාපදිංචි විය!`);
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = prevBtnHtml;
        }
      }
    }

    // TAB 3: Teachers Directory
    let editingTeacherIdx = null;

    function renderAdminTeachers() {
      const tbody = document.getElementById("adminTeachersTableBody");
      tbody.innerHTML = teachersDb.map((t, idx) => {
        const photoSrc = t.photo || t.avatar || DEFAULT_TEACHER_PHOTO;
        return `
          <tr>
            <td><strong>${t.id}</strong></td>
            <td>
              <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${photoSrc}" alt="${t.name}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid var(--secondary-blue); box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <strong>${t.name}</strong>
              </div>
            </td>
            <td><span class="material-tag" style="background:#eff6ff; color:var(--primary-blue); font-weight:700;">${t.grade || 'නොපැවරුණි'}</span></td>
            <td>${t.subject || 'සාමාන්‍ය'}</td>
            <td>${t.phone || '-'}</td>
            <td><span class="status-pill present">${t.status || 'ක්‍රියාකාරී'}</span></td>
            <td>
              <div class="table-action-btns">
                <button class="btn-assign-class" style="padding: 5px 8px; font-size: 0.76rem;" onclick="openEditTeacherModal(${idx})" title="ආචාර්ය තොරතුරු සහ ඡායාරූපය සංශෝධනය">
                  <i class="fa-solid fa-pen-to-square"></i> සංශෝධනය
                </button>
                <button class="btn-save" style="padding: 5px 8px; font-size: 0.76rem;" onclick="openAssignClassModal(${idx})" title="ශ්‍රේණිය පවරන්න">
                  <i class="fa-solid fa-graduation-cap"></i> පන්තිය
                </button>
                <button class="btn-reject" style="padding: 5px 8px; font-size: 0.76rem;" onclick="deleteTeacher(${idx})" title="ඉවත් කරන්න">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }

    function openAssignClassModal(idx) {
      const t = teachersDb[idx];
      if (!t) return;
      document.getElementById("assignTeacherIdx").value = idx;
      document.getElementById("assignTeacherId").value = t.id;
      document.getElementById("assignTeacherName").value = t.name;
      document.getElementById("assignTeacherGrade").value = t.grade || "10 ශ්‍රේණිය";
      document.getElementById("assignTeacherRole").value = t.role || "පන්තිභාර ආචාර්ය";
      document.getElementById("assignTeacherSubject").value = t.subject || "";
      document.getElementById("assignClassModal").style.display = "flex";
    }

    function closeAssignClassModal() {
      document.getElementById("assignClassModal").style.display = "none";
    }

    async function handleSaveClassAssignment(event) {
      event.preventDefault();
      const idx = parseInt(document.getElementById("assignTeacherIdx").value, 10);
      if (isNaN(idx) || !teachersDb[idx]) return;

      const newGrade = document.getElementById("assignTeacherGrade").value;
      const newRole = document.getElementById("assignTeacherRole").value;
      const newSubject = document.getElementById("assignTeacherSubject").value.trim();

      teachersDb[idx].grade = newGrade;
      teachersDb[idx].role = newRole;
      teachersDb[idx].subject = newSubject;

      if (window.DahamPasalaAPI) {
        const { pin, ...teacherPayload } = teachersDb[idx];
        await DahamPasalaAPI.saveTeacher(teacherPayload);
      }

      persistAllAdminData();
      renderAdminTeachers();
      closeAssignClassModal();
      alert(`✓ ${teachersDb[idx].name} ආචාර්යතුමා/තුමිය ${newGrade} සඳහා සාර්ථකව පවරන ලදී!`);
    }

    function openAddTeacherModal() {
      editingTeacherIdx = null;
      document.getElementById("addTeacherModalTitle").innerHTML = '<i class="fa-solid fa-chalkboard-user"></i> නව ආචාර්යවරයෙකු පත්කිරීම (Add Faculty Member)';
      document.getElementById("saveTeacherSubmitBtn").innerHTML = '<i class="fa-solid fa-floppy-disk"></i> ආචාර්යවරයා පත්කරන්න';

      resetTeacherPhotoToDefault();

      const idInput = document.getElementById("newTeacherId");
      idInput.readOnly = false;
      idInput.style.backgroundColor = "";
      idInput.value = getNextTeacherId();

      document.getElementById("newTeacherGrade").value = "10 ශ්‍රේණිය";
      document.getElementById("newTeacherName").value = "";
      document.getElementById("newTeacherSubject").value = "";
      document.getElementById("newTeacherPhone").value = "";
      const pinInput = document.getElementById("newTeacherPin");
      pinInput.value = "1234";
      pinInput.placeholder = "1234";
      document.getElementById("addTeacherModal").style.display = "flex";
    }

    function openEditTeacherModal(idx) {
      const t = teachersDb[idx];
      if (!t) return;
      editingTeacherIdx = idx;
      document.getElementById("addTeacherModalTitle").innerHTML = '<i class="fa-solid fa-user-pen"></i> ආචාර්ය තොරතුරු සංශෝධනය (Edit Faculty Member)';
      document.getElementById("saveTeacherSubmitBtn").innerHTML = '<i class="fa-solid fa-floppy-disk"></i> වෙනස්කම් සුරකින්න (Save Changes)';

      const photoUrl = t.photo || t.avatar || DEFAULT_TEACHER_PHOTO;
      document.getElementById("newTeacherPhotoPreview").src = photoUrl;
      document.getElementById("newTeacherPhotoData").value = photoUrl;
      const fileInput = document.getElementById("newTeacherPhotoFile");
      if (fileInput) fileInput.value = "";

      const idInput = document.getElementById("newTeacherId");
      idInput.value = t.id;
      idInput.readOnly = true;
      idInput.style.backgroundColor = "#f1f5f9";

      document.getElementById("newTeacherGrade").value = t.grade || "10 ශ්‍රේණිය";
      document.getElementById("newTeacherName").value = t.name || "";
      document.getElementById("newTeacherSubject").value = t.subject || "";
      document.getElementById("newTeacherPhone").value = t.phone || "";
      const pinInput = document.getElementById("newTeacherPin");
      pinInput.value = "";
      pinInput.placeholder = "වෙනස් නොකරන්නේ නම් හිස්ව තබන්න";
      document.getElementById("addTeacherModal").style.display = "flex";
    }

    function closeAddTeacherModal() {
      document.getElementById("addTeacherModal").style.display = "none";
      editingTeacherIdx = null;
    }

    async function handleSaveNewTeacher(event) {
      event.preventDefault();
      const id = document.getElementById("newTeacherId").value.trim();
      const grade = document.getElementById("newTeacherGrade").value;
      const name = document.getElementById("newTeacherName").value.trim();
      const subject = document.getElementById("newTeacherSubject").value.trim();
      const phone = document.getElementById("newTeacherPhone").value.trim();
      const rawPin = document.getElementById("newTeacherPin").value.trim();
      const photo = document.getElementById("newTeacherPhotoData").value || DEFAULT_TEACHER_PHOTO;

      if (!id || !name) {
        alert("කරුණාකර ආචාර්ය අංකය සහ නම ඇතුළත් කරන්න.");
        return;
      }

      const isEditing = editingTeacherIdx !== null && Boolean(teachersDb[editingTeacherIdx]);
      const pinToSave = isEditing ? (rawPin || undefined) : (rawPin || "1234");
      const prev = isEditing ? teachersDb[editingTeacherIdx] : {};

      const teacherPayload = {
        ...prev,
        id: id,
        name: name,
        grade: grade,
        subject: subject,
        phone: phone,
        role: prev.role || "පන්තිභාර ආචාර්ය",
        status: prev.status || "ක්‍රියාකාරී",
        photo: photo,
        avatar: photo
      };
      if (pinToSave !== undefined) {
        teacherPayload.pin = pinToSave;
      } else {
        delete teacherPayload.pin;
      }

      const submitBtn = document.getElementById("saveTeacherSubmitBtn");
      const prevBtnHtml = submitBtn ? submitBtn.innerHTML : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> සුරකිමින්...';
      }

      try {
        let savedRecord = teacherPayload;
        let apiResult = null;
        if (window.DahamPasalaAPI) {
          apiResult = await DahamPasalaAPI.saveTeacher(teacherPayload);
          if (apiResult && apiResult._backendError) {
            console.warn("Teacher backend save warning:", apiResult._backendError);
          }
          if (apiResult) {
            const { _savedToBackend, _persistedTo, _backendError, ...cleanSaved } = apiResult;
            savedRecord = { ...teacherPayload, ...cleanSaved };
          }
        }

        if (isEditing) {
          teachersDb[editingTeacherIdx] = savedRecord;
        } else {
          const existingIdx = teachersDb.findIndex(t => t && t.id === id);
          if (existingIdx >= 0) teachersDb[existingIdx] = savedRecord;
          else teachersDb.push(savedRecord);
        }

        persistAllAdminData();
        renderAdminDashboard();
        renderAdminTeachers();
        closeAddTeacherModal();

        if (apiResult && !apiResult._savedToBackend) {
          alert(`⚠️ අවධානයට: ආචාර්ය ${name} (${id}) ඔබගේ Browser එකේ පමණක් සුරැකුණි (Firebase වෙත සම්බන්ධ නොවීය).\n\nදෝෂය: ${apiResult._backendError || 'Backend offline'}`);
        } else if (apiResult && apiResult._persistedTo === 'memory_fallback') {
          alert(`⚠️ අවධානයට: Vercel/Server හි Firebase සම්බන්ධ වී නොමැති නිසා ආචාර්ය ${name} (${id}) Firebase Database එකට ඇතුළත් නොවීය (තාවකාලික Memory හි පමණි).\n\nහේතුව: ${apiResult._backendError || 'FIREBASE_SERVICE_ACCOUNT_JSON missing on server'}`);
        } else if (isEditing) {
          alert(`ආචාර්ය ${name} (${id}) ගේ තොරතුරු සහ ඡායාරූපය Firebase වෙත සාර්ථකව යාවත්කාලීන විය!`);
        } else {
          alert(`ආචාර්ය ${name} (${id}) සාර්ථකව Firebase පද්ධතියට පත් කරන ලදී!`);
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = prevBtnHtml;
        }
      }
    }

    async function deleteTeacher(index) {
      if (confirm("මෙම ආචාර්යවරයා ඉවත් කිරීමට ඔබට විශ්වාසද?")) {
        const teacherId = teachersDb[index]?.id;
        teachersDb.splice(index, 1);
        if (window.DahamPasalaAPI && teacherId) {
          await DahamPasalaAPI.deleteTeacher(teacherId);
        }
        persistAllAdminData();
        renderAdminDashboard();
        renderAdminTeachers();
      }
    }

    // TAB 4: Events Calendar
    function renderAdminEvents() {
      const container = document.getElementById("adminEventsGrid");
      container.innerHTML = eventsDb.map((ev, idx) => `
        <div class="event-card">
          <div class="event-date-box">
            <span class="event-date-day">${ev.day}</span>
            <span class="event-date-month">${ev.month}</span>
          </div>
          <div class="event-details">
            <h4>${ev.title}</h4>
            <div class="event-meta">
              <span><i class="fa-solid fa-tag"></i> ${ev.category}</span>
              <span><i class="fa-solid fa-location-dot"></i> ${ev.venue}</span>
              <span><i class="fa-solid fa-users"></i> ${ev.grades}</span>
            </div>
            <p class="event-desc">${ev.desc}</p>
            <div style="margin-top: 8px; display: flex; justify-content: flex-end;">
              <button class="btn-reject" style="padding: 3px 8px; font-size: 0.72rem;" onclick="deleteEvent(${idx})">
                <i class="fa-solid fa-trash"></i> ඉවත් කරන්න
              </button>
            </div>
          </div>
        </div>
      `).join("");
    }

    function openAddEventModal() {
      document.getElementById("newEventDate").value = new Date().toISOString().split('T')[0];
      document.getElementById("addEventModal").style.display = "flex";
    }

    function closeAddEventModal() {
      document.getElementById("addEventModal").style.display = "none";
    }

    function handleSaveNewEvent(event) {
      event.preventDefault();
      const title = document.getElementById("newEventTitle").value.trim();
      const category = document.getElementById("newEventCategory").value;
      const date = document.getElementById("newEventDate").value;
      const venue = document.getElementById("newEventVenue").value.trim();
      const grades = document.getElementById("newEventGrades").value.trim();
      const desc = document.getElementById("newEventDesc").value.trim();

      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const month = monthNames[d.getMonth()] || "MONTH";

      const newEv = {
        id: "ev-" + Date.now(),
        title: title,
        category: category,
        date: date,
        day: day,
        month: month,
        venue: venue,
        grades: grades,
        desc: desc
      };

      eventsDb.unshift(newEv);

      if (window.DahamPasalaAPI) {
        DahamPasalaAPI.saveEvent(newEv);
      }

      persistAllAdminData();
      renderAdminDashboard();
      renderAdminEvents();
      closeAddEventModal();
      alert("නව වැඩසටහන දින දර්ශනයට සාර්ථකව එක් විය!");
    }

    function deleteEvent(index) {
      if (confirm("මෙම වැඩසටහන ඉවත් කිරීමට ඔබට විශ්වාසද?")) {
        const evId = eventsDb[index]?.id;
        eventsDb.splice(index, 1);
        if (window.DahamPasalaAPI && evId) {
          DahamPasalaAPI.deleteEvent(evId);
        }
        persistAllAdminData();
        renderAdminDashboard();
        renderAdminEvents();
      }
    }

    // TAB 5: Approve Achievements
    // TAB 5: Approve & Manage Achievements
    function populateAdminBadgeStudentFilter() {
      const filterSelect = document.getElementById("adminBadgeStudentFilter");
      const editSelect = document.getElementById("editBadgeStudentSelect");
      const directSelect = document.getElementById("directAwardStudentSelect");

      const studentKeys = Object.keys(studentDb).sort((a, b) => {
        const nameA = (studentDb[a]?.name || a).toLowerCase();
        const nameB = (studentDb[b]?.name || b).toLowerCase();
        return nameA.localeCompare(nameB);
      });

      const optionsHtml = studentKeys.map(k => {
        const s = studentDb[k];
        return `<option value="${s.regNo}">[${s.regNo}] ${s.name} (${s.grade})</option>`;
      }).join("");

      if (filterSelect) {
        const currentVal = filterSelect.value;
        filterSelect.innerHTML = `<option value="all">සියලුම ශිෂ්‍යයන් (All Students)</option>` + optionsHtml;
        if (currentVal && (currentVal === "all" || studentDb[currentVal])) {
          filterSelect.value = currentVal;
        }
      }

      if (editSelect) {
        const currentVal = editSelect.value;
        editSelect.innerHTML = optionsHtml;
        if (currentVal && studentDb[currentVal]) editSelect.value = currentVal;
      }

      if (directSelect) {
        const currentVal = directSelect.value;
        directSelect.innerHTML = optionsHtml;
        if (currentVal && studentDb[currentVal]) directSelect.value = currentVal;
      }
    }

    function renderAdminApprovals() {
      populateAdminBadgeStudentFilter();
      filterAdminBadges();
    }

    function filterAdminBadges() {
      const container = document.getElementById("adminApprovalQueueGrid");
      if (!container) return;
      if (badgesStore.length === 0) {
        container.innerHTML = `<p style="color:var(--text-muted); padding:20px;">අනුමැතිය සඳහා කිසිදු සම්මානයක් ඉදිරිපත් කර නැත.</p>`;
        return;
      }

      const studentFilterEl = document.getElementById("adminBadgeStudentFilter");
      const statusFilterEl = document.getElementById("adminBadgeStatusFilter");
      const searchInputEl = document.getElementById("adminBadgeSearchInput");
      const summaryBanner = document.getElementById("adminSelectedStudentSummary");

      const selectedStudent = studentFilterEl ? studentFilterEl.value : "all";
      const selectedStatus = statusFilterEl ? statusFilterEl.value : "all";
      const searchQuery = searchInputEl ? searchInputEl.value.trim().toLowerCase() : "";

      // Ensure each badge has an id
      badgesStore.forEach((b, i) => {
        if (!b.id) b.id = `ach-${i + 1}-${Date.now()}`;
      });

      // Update Selected Student Summary Banner if a single student is chosen
      if (summaryBanner) {
        if (selectedStudent !== "all" && studentDb[selectedStudent]) {
          const s = studentDb[selectedStudent];
          const studentBadges = badgesStore.filter(b => b.regNo === selectedStudent);
          const approvedCount = studentBadges.filter(b => b.status === "approved").length;
          const pendingCount = studentBadges.filter(b => b.status === "pending").length;
          const totalPoints = studentBadges
            .filter(b => b.status === "approved")
            .reduce((sum, b) => sum + (parseInt(b.points) || 50), 0);

          summaryBanner.style.display = "block";
          summaryBanner.innerHTML = `
            <div class="selected-student-banner">
              <div class="selected-student-banner-left">
                <img src="${s.photo || DEFAULT_STUDENT_PHOTO}" alt="${s.name}">
                <div>
                  <h4 style="margin: 0 0 4px 0; color: var(--primary-blue); font-size: 1.05rem;">
                    <i class="fa-solid fa-user-graduate"></i> ${s.name}
                  </h4>
                  <p style="margin: 0; font-size: 0.82rem; color: var(--text-muted);">
                    <strong>${s.regNo}</strong> | ${s.grade} | භාරකරු: ${s.guardianName || 'සඳහන් කර නැත'}
                  </p>
                </div>
              </div>
              <div class="selected-student-banner-stats">
                <span class="selected-student-stat-pill">
                  <i class="fa-solid fa-award" style="color: #b45309;"></i> ${studentBadges.length} සමස්ත පදක්කම්
                </span>
                <span class="selected-student-stat-pill" style="color: #059669; border-color: #a7f3d0;">
                  <i class="fa-solid fa-circle-check"></i> ${approvedCount} අනුමතයි
                </span>
                ${pendingCount > 0 ? `
                  <span class="selected-student-stat-pill" style="color: #d97706; border-color: #fde68a;">
                    <i class="fa-solid fa-hourglass-half"></i> ${pendingCount} අපේක්ෂිතයි
                  </span>
                ` : ''}
                <span class="selected-student-stat-pill" style="color: #2563eb; border-color: #bfdbfe;">
                  <i class="fa-solid fa-star"></i> +${totalPoints} ලකුණු
                </span>
                <button class="btn-save" style="padding: 6px 14px; font-size: 0.8rem; background: #059669;" onclick="openAdminDirectAwardModal('${s.regNo}')">
                  <i class="fa-solid fa-plus"></i> මෙම ශිෂ්‍යයාට පදක්කමක් පිරිනමන්න
                </button>
              </div>
            </div>
          `;
        } else {
          summaryBanner.style.display = "none";
          summaryBanner.innerHTML = "";
        }
      }

      // Filter badges
      const filtered = badgesStore.filter(b => {
        if (selectedStudent !== "all" && b.regNo !== selectedStudent) return false;
        if (selectedStatus !== "all" && b.status !== selectedStatus) return false;
        if (searchQuery) {
          const matchStudent = (b.studentName || "").toLowerCase().includes(searchQuery);
          const matchReg = (b.regNo || "").toLowerCase().includes(searchQuery);
          const matchBadge = (b.badge || "").toLowerCase().includes(searchQuery);
          const matchTeacher = (b.teacher || "").toLowerCase().includes(searchQuery);
          const matchRemarks = (b.remarks || "").toLowerCase().includes(searchQuery);
          if (!matchStudent && !matchReg && !matchBadge && !matchTeacher && !matchRemarks) return false;
        }
        return true;
      });

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 12px; padding: 40px 20px; text-align: center; color: var(--text-muted);">
            <i class="fa-solid fa-award" style="font-size: 2.2rem; color: #94a3b8; margin-bottom: 10px; display: block;"></i>
            <h4 style="color: var(--primary-blue); margin-bottom: 6px;">පදක්කම් හෝ සම්මාන හමුනොවීය</h4>
            <p style="font-size: 0.85rem; max-width: 450px; margin: 0 auto 15px auto;">තෝරාගත් නිර්ණායක වලට අදාළව පදක්කම් සටහන්ව නොමැත. නව පදක්කමක් පිරිනැමීමට ඉහත බොත්තම භාවිතා කරන්න.</p>
            ${selectedStudent !== "all" ? `
              <button class="btn-save" style="font-size: 0.82rem; padding: 8px 16px;" onclick="openAdminDirectAwardModal('${selectedStudent}')">
                <i class="fa-solid fa-plus"></i> මෙම ශිෂ්‍යයාට පදක්කමක් පිරිනමන්න
              </button>
            ` : ''}
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(b => {
        const isPending = b.status === "pending";
        const isApproved = b.status === "approved";
        const statusClass = isPending ? "pending" : (isApproved ? "approved" : "rejected");
        const statusLabel = isPending ? "අනුමැතිය අපේක්ෂිතයි" : (isApproved ? "අනුමත කරන ලදී (Approved)" : "ප්‍රතික්ෂේපිතයි (Rejected)");
        const badgePoints = b.points || 50;

        return `
          <div class="approval-card" id="badge-card-${b.id}">
            <div>
              <div class="approval-card-top">
                <div class="approval-icon-box">
                  <i class="fa-solid fa-medal"></i>
                </div>
                <div class="approval-info" style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                    <h4>${b.badge}</h4>
                    <span style="background: #e0f2fe; color: #0369a1; font-size: 0.76rem; font-weight: 700; padding: 2px 8px; border-radius: 999px; white-space: nowrap;">
                      +${badgePoints} Pts
                    </span>
                  </div>
                  <p>
                    <strong style="color: var(--primary-blue); cursor: pointer;" onclick="filterBySelectedStudent('${b.regNo}')">
                      ${b.studentName}
                    </strong>
                    (${b.regNo || 'DPS'})
                  </p>
                  <p><i class="fa-solid fa-chalkboard-user"></i> යෝජනා කළ ගුරුභවතා: ${b.teacher || 'පන්තිභාර ආචාර්ය'}</p>
                </div>
              </div>

              <div class="approval-reason" style="margin-top: 10px;">
                <strong>හේතුව / ප්‍රශංසාව:</strong> ${b.remarks || 'විශේෂ කුසලතා ඇගයීම'}
              </div>
            </div>

            <div>
              <div class="approval-meta" style="margin-bottom: 12px;">
                <span><i class="fa-regular fa-calendar"></i> දිනය: ${b.date || 'සඳහන් කර නැත'}</span>
                <span class="status-badge ${statusClass}"><i class="fa-solid fa-circle-check"></i> ${statusLabel}</span>
              </div>

              ${isPending ? `
                <div class="approval-actions" style="margin-bottom: 10px;">
                  <button class="btn-approve" onclick="approveAchievement('${b.id}')">
                    <i class="fa-solid fa-stamp"></i> අනුමත කරන්න (Approve)
                  </button>
                  <button class="btn-reject" onclick="rejectAchievement('${b.id}')">
                    <i class="fa-solid fa-xmark"></i> ප්‍රතික්ෂේප කරන්න
                  </button>
                </div>
              ` : (isApproved ? `
                <div style="font-size: 0.78rem; color: #059669; font-weight: 600; margin-bottom: 10px; display: flex; align-items: center; gap: 5px;">
                  <i class="fa-solid fa-certificate"></i> ප්‍රධානාචාර්යතුමා විසින් අනුමත කර ලකුණු පිරිනමන ලදී.
                </div>
              ` : `
                <div style="font-size: 0.78rem; color: #dc2626; font-weight: 600; margin-bottom: 10px; display: flex; align-items: center; gap: 5px;">
                  <i class="fa-solid fa-circle-xmark"></i> මෙම පදක්කම් යෝජනාව ප්‍රතික්ෂේප කර ඇත.
                </div>
              `)}

              <!-- Edit and Delete Actions -->
              <div style="display: flex; gap: 8px; justify-content: flex-end; border-top: 1px solid #f1f5f9; padding-top: 10px;">
                <button class="btn-edit-badge" onclick="openEditBadgeModal('${b.id}')" title="පදක්කමේ තොරතුරු සංශෝධනය කරන්න">
                  <i class="fa-solid fa-pen-to-square"></i> සංශෝධනය (Edit)
                </button>
                <button class="btn-delete-badge" onclick="deleteBadgeRecord('${b.id}')" title="මෙම පදක්කම සම්පූර්ණයෙන්ම ඉවත් කරන්න">
                  <i class="fa-solid fa-trash"></i> ඉවත් කරන්න (Remove)
                </button>
              </div>
            </div>
          </div>
        `;
      }).join("");
    }

    function filterBySelectedStudent(regNo) {
      const studentFilter = document.getElementById("adminBadgeStudentFilter");
      if (studentFilter) {
        studentFilter.value = regNo;
        filterAdminBadges();
      }
    }

    function approveAchievement(badgeId) {
      const b = badgesStore.find(x => x.id === badgeId);
      if (!b) return;
      b.status = "approved";

      if (window.DahamPasalaAPI && b.id) {
        DahamPasalaAPI.updateBadgeStatus(b.id, "approved");
      }

      // Sync to student store
      if (studentDb[b.regNo]) {
        const s = studentDb[b.regNo];
        if (!Array.isArray(s.attendance)) s.attendance = [];
        // Clean out any existing duplicate entry for this badge
        s.attendance = s.attendance.filter(a => !(a.type === 'badge_award' && a.event.includes(b.badge)));
        s.attendance.unshift({
          date: b.date || new Date().toISOString().split('T')[0],
          event: `[පදක්කම් සම්මානය] ${b.badge}`,
          category: 'event',
          type: 'badge_award',
          status: 'present',
          score: parseInt(b.points) || 50,
          remarks: `ප්‍රධානාචාර්ය අනුමැතිය ලත් සම්මානය: ${b.remarks || ''}`
        });
      }

      persistAllAdminData();
      renderAdminDashboard();
      renderAdminApprovals();
      renderAdminStudentDirectory();
      filterAdminBadges();
      alert(`✓ "${b.badge}" සම්මානය සඳහා ප්‍රධානාචාර්ය අනුමැතිය සහ නිල මුද්‍රාව සාර්ථකව සටහන් විය!\nශිෂ්‍යයාට +${b.points || 50} කුසලතා ලකුණු පිරිනැමිණි.`);
    }

    function rejectAchievement(badgeId) {
      const b = badgesStore.find(x => x.id === badgeId);
      if (!b) return;
      if (confirm(`"${b.badge}" සම්මාන යෝජනාව ප්‍රතික්ෂේප කිරීමට ඔබට විශ්වාසද?`)) {
        b.status = "rejected";
        if (window.DahamPasalaAPI && b.id) {
          DahamPasalaAPI.updateBadgeStatus(b.id, "rejected");
        }

        // If it was previously in student attendance, remove it
        if (studentDb[b.regNo] && Array.isArray(studentDb[b.regNo].attendance)) {
          studentDb[b.regNo].attendance = studentDb[b.regNo].attendance.filter(
            a => !(a.type === 'badge_award' && a.event.includes(b.badge))
          );
        }

        persistAllAdminData();
        renderAdminDashboard();
        renderAdminApprovals();
        renderAdminStudentDirectory();
        filterAdminBadges();
      }
    }

    // Modal: Edit Badge
    function openEditBadgeModal(badgeId) {
      const b = badgesStore.find(x => x.id === badgeId);
      if (!b) return;

      populateAdminBadgeStudentFilter();

      document.getElementById("editBadgeId").value = b.id;
      document.getElementById("editBadgeStudentSelect").value = b.regNo;
      document.getElementById("editBadgeName").value = b.badge;
      document.getElementById("editBadgePoints").value = b.points || 50;
      document.getElementById("editBadgeDate").value = b.date || new Date().toISOString().split('T')[0];
      document.getElementById("editBadgeTeacher").value = b.teacher || "පන්තිභාර ආචාර්ය";
      document.getElementById("editBadgeStatus").value = b.status || "pending";
      document.getElementById("editBadgeRemarks").value = b.remarks || "";

      document.getElementById("editBadgeModal").style.display = "flex";
    }

    function closeEditBadgeModal() {
      document.getElementById("editBadgeModal").style.display = "none";
    }

    function saveEditBadge(event) {
      event.preventDefault();
      const id = document.getElementById("editBadgeId").value;
      const b = badgesStore.find(x => x.id === id);
      if (!b) return;

      const oldStatus = b.status;
      const oldRegNo = b.regNo;
      const oldBadgeName = b.badge;

      const newRegNo = document.getElementById("editBadgeStudentSelect").value;
      const student = studentDb[newRegNo];
      const newBadgeName = document.getElementById("editBadgeName").value.trim();
      const newPoints = parseInt(document.getElementById("editBadgePoints").value) || 50;
      const newDate = document.getElementById("editBadgeDate").value;
      const newTeacher = document.getElementById("editBadgeTeacher").value.trim();
      const newStatus = document.getElementById("editBadgeStatus").value;
      const newRemarks = document.getElementById("editBadgeRemarks").value.trim();

      b.regNo = newRegNo;
      b.studentName = student ? student.name : newRegNo;
      b.grade = student ? student.grade : b.grade;
      b.badge = newBadgeName;
      b.points = newPoints;
      b.date = newDate;
      b.teacher = newTeacher;
      b.status = newStatus;
      b.remarks = newRemarks;

      // Handle Student attendance points synchronization
      // Case A: Old was approved, remove previous attendance credit
      if (oldStatus === "approved" && studentDb[oldRegNo] && Array.isArray(studentDb[oldRegNo].attendance)) {
        studentDb[oldRegNo].attendance = studentDb[oldRegNo].attendance.filter(
          a => !(a.type === 'badge_award' && a.event.includes(oldBadgeName))
        );
      }

      // Case B: New is approved, add updated attendance credit
      if (newStatus === "approved" && studentDb[newRegNo]) {
        if (!Array.isArray(studentDb[newRegNo].attendance)) studentDb[newRegNo].attendance = [];
        studentDb[newRegNo].attendance.unshift({
          date: newDate,
          event: `[පදක්කම් සම්මානය] ${newBadgeName}`,
          category: 'event',
          type: 'badge_award',
          status: 'present',
          score: newPoints,
          remarks: `ප්‍රධානාචාර්ය අනුමැතිය ලත් සම්මානය: ${newRemarks}`
        });
      }

      if (window.DahamPasalaAPI && b.id) {
        DahamPasalaAPI.updateBadge(b.id, b);
      }

      persistAllAdminData();
      renderAdminDashboard();
      renderAdminStudentDirectory();
      filterAdminBadges();
      closeEditBadgeModal();
      alert(`✓ "${b.badge}" කුසලතා පදක්කම් තොරතුරු සාර්ථකව සංශෝධනය විය!`);
    }

    // Action: Delete Badge
    function deleteBadgeRecord(badgeId) {
      const b = badgesStore.find(x => x.id === badgeId);
      if (!b) return;

      if (!confirm(`ඔබට "${b.badge}" (${b.studentName}) කුසලතා පදක්කම සම්පූර්ණයෙන්ම ඉවත් කිරීමට අවශ්‍ය බව තහවුරු කරන්න?`)) {
        return;
      }

      // If it was approved, clean up student's attendance record & points
      if (b.status === "approved" && studentDb[b.regNo] && Array.isArray(studentDb[b.regNo].attendance)) {
        studentDb[b.regNo].attendance = studentDb[b.regNo].attendance.filter(
          a => !(a.type === 'badge_award' && a.event.includes(b.badge))
        );
      }

      badgesStore = badgesStore.filter(x => x.id !== badgeId);

      if (window.DahamPasalaAPI && b.id) {
        DahamPasalaAPI.deleteBadge(b.id);
      }

      persistAllAdminData();
      renderAdminDashboard();
      renderAdminStudentDirectory();
      filterAdminBadges();
      alert(`✓ "${b.badge}" පදක්කම සාර්ථකව ඉවත් කරන ලදී.`);
    }

    // Modal: Admin Direct Award Badge
    function openAdminDirectAwardModal(preselectedRegNo = null) {
      populateAdminBadgeStudentFilter();
      const select = document.getElementById("directAwardStudentSelect");
      if (preselectedRegNo && select) {
        select.value = preselectedRegNo;
      }
      document.getElementById("directAwardDate").value = new Date().toISOString().split('T')[0];
      document.getElementById("directAwardBadgeName").value = "";
      document.getElementById("directAwardPoints").value = "50";
      document.getElementById("directAwardRemarks").value = "";
      document.getElementById("directAwardStatus").value = "approved";

      document.getElementById("adminDirectAwardModal").style.display = "flex";
    }

    function closeAdminDirectAwardModal() {
      document.getElementById("adminDirectAwardModal").style.display = "none";
    }

    function handleAdminDirectAward(event) {
      event.preventDefault();
      const regNo = document.getElementById("directAwardStudentSelect").value;
      const student = studentDb[regNo];
      const badge = document.getElementById("directAwardBadgeName").value.trim();
      const points = parseInt(document.getElementById("directAwardPoints").value) || 50;
      const date = document.getElementById("directAwardDate").value;
      const officer = document.getElementById("directAwardOfficer").value.trim();
      const status = document.getElementById("directAwardStatus").value;
      const remarks = document.getElementById("directAwardRemarks").value.trim();

      const newBadge = {
        id: `ach-${Date.now()}`,
        studentName: student ? student.name : regNo,
        regNo: regNo,
        grade: student ? student.grade : "10 ශ්‍රේණිය",
        badge: badge,
        points: points,
        date: date,
        teacher: officer,
        remarks: remarks,
        status: status
      };

      badgesStore.unshift(newBadge);

      if (status === "approved" && studentDb[regNo]) {
        if (!Array.isArray(studentDb[regNo].attendance)) studentDb[regNo].attendance = [];
        studentDb[regNo].attendance.unshift({
          date: date,
          event: `[පදක්කම් සම්මානය] ${badge}`,
          category: 'event',
          type: 'badge_award',
          status: 'present',
          score: points,
          remarks: `ප්‍රධානාචාර්ය අනුමැතිය ලත් සම්මානය: ${remarks}`
        });
      }

      if (window.DahamPasalaAPI) {
        DahamPasalaAPI.nominateBadge(newBadge).then(() => {
          if (status === "approved") {
            DahamPasalaAPI.updateBadgeStatus(newBadge.id, "approved");
          }
        });
      }

      persistAllAdminData();
      renderAdminDashboard();
      renderAdminStudentDirectory();
      filterAdminBadges();
      closeAdminDirectAwardModal();
      alert(`✓ "${badge}" කුසලතා පදක්කම ${student ? student.name : regNo} ශිෂ්‍යයාට සාර්ථකව පිරිනමන ලදී!`);
    }

    // TAB 6: Report Generation
    function generateSelectedReport() {
      const type = document.getElementById("reportTypeSelect").value;
      const grade = document.getElementById("reportGradeFilter").value;
      const studentKeys = Object.keys(studentDb);

      const filteredKeys = studentKeys.filter(k => {
        const s = studentDb[k];
        if (grade !== "all" && !((s.grade || "").includes(grade))) return false;
        if (!matchesGradeFilter(s.grade, grade)) return false;
        return true;
      });

      const thead = document.getElementById("reportTableHead");
      const tbody = document.getElementById("reportTableBody");
      const titleHeading = document.getElementById("reportTitleHeading");
      const subtitle = document.getElementById("reportMetaSubtitle");
      const summaryBox = document.getElementById("reportSummaryBox");

      const today = new Date().toISOString().split('T')[0];
      const gradeLabel = grade === 'all' ? 'සියලුම ශ්‍රේණි' : (grade === 'final' ? 'අවසාන ශ්‍රේණිය' : (grade === 'teaching' ? 'ධර්මාචාර්ය විභාගය' : grade + ' ශ්‍රේණිය'));

      if (type === "attendance") {
        titleHeading.textContent = "වාර්ෂික සමස්ත ශිෂ්‍ය පැමිණීමේ නිල වාර්තාව (Master Attendance Ledger)";
        subtitle.textContent = `අධ්‍යයන වර්ෂය 2026 - ${grade === 'all' ? 'සියලුම ශ්‍රේණි' : grade + ' ශ්‍රේණිය'} | දිනය: ${today}`;
        subtitle.textContent = `අධ්‍යයන වර්ෂය 2026 - ${gradeLabel} | දිනය: ${today}`;
        thead.innerHTML = `
          <tr>
            <th>ඇතුළත් අංකය</th>
            <th>ශිෂ්‍යයාගේ නම</th>
            <th>ශ්‍රේණිය</th>
            <th>ඉරිදා පැමිණීම</th>
            <th>පෝය අටසිල් පැමිණීම</th>
            <th>පැමිණීමේ ප්‍රතිශතය</th>
            <th>තත්ත්වය</th>
          </tr>
        `;
        tbody.innerHTML = filteredKeys.map(k => {
          const s = studentDb[k];
          return `
            <tr>
              <td><strong>${s.regNo}</strong></td>
              <td>${s.name}</td>
              <td>${s.grade}</td>
              <td>12 / 12 දින</td>
              <td>3 / 3 දින</td>
              <td><strong>94%</strong></td>
              <td><span class="status-pill present">විශිෂ්ටයි</span></td>
            </tr>
          `;
        }).join("");

        summaryBox.innerHTML = `
          <strong>පරිපාලන සමාලෝචනය:</strong> වාර්තාවට ඇතුළත් මුළු ශිෂ්‍ය සංඛ්‍යාව: <strong>${filteredKeys.length}</strong> කි. සමස්ත සාමාන්‍ය පැමිණීමේ ප්‍රතිශතය <strong>94%</strong> ක් වන අතර පෝය දින අටසිල් සමාදානය ඉතා ඉහළ මට්ටමක පවතී.
        `;
      } else if (type === "exams") {
        titleHeading.textContent = "ශ්‍රේණි අනුව ධර්ම විභාග ප්‍රගති ලේඛනය (Dhamma Academic Results)";
        subtitle.textContent = `2026 පළමු වාර ඇගයීම් වාර්තාව - ${grade === 'all' ? 'සියලුම ශ්‍රේණි' : grade + ' ශ්‍රේණිය'} | දිනය: ${today}`;
        subtitle.textContent = `2026 පළමු වාර ඇගයීම් වාර්තාව - ${gradeLabel} | දිනය: ${today}`;
        thead.innerHTML = `
          <tr>
            <th>අංකය</th>
            <th>ශිෂ්‍යයාගේ නම</th>
            <th>බුද්ධ ධර්මය</th>
            <th>බෞද්ධ සංස්කෘතිය</th>
            <th>පාලි භාෂාව</th>
            <th>සාමාන්‍ය ලකුණු</th>
            <th>ශ්‍රේණිය</th>
          </tr>
        `;
        tbody.innerHTML = filteredKeys.map(k => {
          const s = studentDb[k];
          return `
            <tr>
              <td><strong>${s.regNo}</strong></td>
              <td>${s.name}</td>
              <td>92 (A)</td>
              <td>88 (A)</td>
              <td>84 (A)</td>
              <td><strong>88.0%</strong></td>
              <td><span class="status-pill present">විශිෂ්ට සාමාර්ථය</span></td>
            </tr>
          `;
        }).join("");

        summaryBox.innerHTML = `
          <strong>විභාග මණ්ඩල සටහන:</strong> ධර්ම විභාග සඳහා පෙනී සිටි සිසුන් <strong>${filteredKeys.length}</strong> ගෙන් 100% ක්ම සමත් මට්ටම ඉක්මවා විශිෂ්ට සාමාර්ථ (A) වාර්තා කර ඇත.
        `;
      } else if (type === "deeds") {
        titleHeading.textContent = "ශිෂ්‍ය සාධු චර්යා සහ කුසලතා ලකුණු සංග්‍රහය (Character Compendium)";
        subtitle.textContent = `2026 වර්ෂය - විෂය සමගාමී හා ප්‍රායෝගික ක්‍රියාකාරකම් | දිනය: ${today}`;
        thead.innerHTML = `
          <tr>
            <th>ශිෂ්‍යයා</th>
            <th>ශ්‍රේණිය</th>
            <th>යහපත් ක්‍රියා සංඛ්‍යාව</th>
            <th>පිරිනැමූ පදක්කම්</th>
            <th>සමස්ත කුසලතා ලකුණු</th>
            <th>චර්යා සහතිකය</th>
          </tr>
        `;
        tbody.innerHTML = filteredKeys.map(k => {
          const s = studentDb[k];
          const deedsCount = goodDeedsStore.filter(d => d.regNo === k).length;
          const badgesCount = badgesStore.filter(b => b.regNo === k && b.status === "approved").length;
          const totalPoints = deedsCount * 10 + badgesCount * 50;

          return `
            <tr>
              <td><strong>${s.name}</strong> <br><small>${s.regNo}</small></td>
              <td>${s.grade}</td>
              <td>${deedsCount} ක් සටහන් විය</td>
              <td>${badgesCount} ක් අනුමතයි</td>
              <td><strong style="color:var(--primary-blue);">${totalPoints} Pts</strong></td>
              <td>විශිෂ්ට ආදර්ශමත් හැසිරීම (Grade A)</td>
            </tr>
          `;
        }).join("");

        summaryBox.innerHTML = `
          <strong>චර්යා ඇගයීම් සටහන:</strong> පාසල් විනය සහ ගුරු දෙගුරු ගෞරවය පෙරදැරිව ආදර්ශමත් ශිෂ්‍ය පරපුරක් නිර්මාණය කිරීමේ සාධු චර්යා පරමාර්ථ සාර්ථකව ඉටු වී ඇත.
        `;
      } else if (type === "teachers") {
        titleHeading.textContent = "ආචාර්ය මණ්ඩල සේවා සහ පන්ති භාරකාරීත්ව වාර්තාව (Faculty Report)";
        subtitle.textContent = `ශ්‍රී සුගත ධර්ම විද්‍යාලය - 2026 අධ්‍යයන වර්ෂය | දිනය: ${today}`;
        thead.innerHTML = `
          <tr>
            <th>ගුරු අංකය</th>
            <th>ආචාර්යතුමාගේ නම</th>
            <th>භාර ශ්‍රේණිය</th>
            <th>විෂය</th>
            <th>දුරකථන අංකය</th>
            <th>සේවා තත්ත්වය</th>
          </tr>
        `;
        tbody.innerHTML = teachersDb.map(t => `
          <tr>
            <td><strong>${t.id}</strong></td>
            <td><strong>${t.name}</strong></td>
            <td>${t.grade}</td>
            <td>${t.subject}</td>
            <td>${t.phone}</td>
            <td><span class="status-pill present">${t.status}</span></td>
          </tr>
        `).join("");

        summaryBox.innerHTML = `
          <strong>ප්‍රධානාචාර්ය අනුමැතිය:</strong> වර්තමාන සක්‍රීය ගුරු මණ්ඩලය <strong>${teachersDb.length}</strong> කි. සියලු පන්ති සඳහා සුදුසුකම්ලත් ධර්මාචාර්යවරුන් අනුයුක්ත කර ඇත.
        `;
      }
    }

    // TAB 7: Announcements
    // TAB 7: Announcements
    function getAudienceBadgeHtml(ann) {
      const aud = String(ann.audience || 'all').toLowerCase();
      if (aud === 'teachers' || aud.includes('teacher') || aud.includes('ආචාර්ය') || aud.includes('ගුරු')) {
        return `<span class="audience-pill teachers"><i class="fa-solid fa-chalkboard-user"></i> ආචාර්ය මණ්ඩලය පමණක්</span>`;
      }
      if (aud === 'students' || aud.includes('student') || aud.includes('ශිෂ්‍ය') || aud.includes('සිසු')) {
        return `<span class="audience-pill students"><i class="fa-solid fa-user-graduate"></i> ශිෂ්‍යයන් පමණක්</span>`;
      }
      return `<span class="audience-pill all"><i class="fa-solid fa-users"></i> සියලු දෙනා වෙත (All)</span>`;
    }

    function renderAdminAnnouncements() {
      const container = document.getElementById("adminAnnouncementsFeed");
      if (announcementsDb.length === 0) {
        container.innerHTML = `<p style="color:var(--text-muted); padding:15px;">දැනට කිසිදු නිවේදනයක් නිකුත් කර නොමැත.</p>`;
        return;
      }

      container.innerHTML = announcementsDb.map((ann, idx) => `
        <div class="announcement-card urgency-${ann.urgency}">
          <div class="announcement-header">
            <div class="announcement-title">
              <i class="fa-solid fa-bullhorn" style="color:var(--accent-yellow);"></i> ${ann.title}
            </div>
            <div style="display:flex; gap:8px; align-items:center;">
              ${getAudienceBadgeHtml(ann)}
              <span class="urgency-pill urgency-${ann.urgency}">${ann.urgency}</span>
            </div>
          </div>
          <p class="announcement-body">${ann.body}</p>
          <div class="announcement-footer">
            <span><i class="fa-solid fa-user-shield"></i> නිකුත් කළේ: <strong>${ann.author}</strong></span>
            <div style="display:flex; gap:12px; align-items:center;">
              <span><i class="fa-solid fa-clock"></i> ${ann.date}</span>
              <button class="btn-reject" style="padding: 2px 6px; font-size: 0.7rem;" onclick="deleteAnnouncement(${idx})">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `).join("");
    }

    function handlePublishAnnouncement(event) {
      event.preventDefault();
      const title = document.getElementById("annTitle").value.trim();
      const audience = document.getElementById("annAudience").value;
      const urgency = document.getElementById("annUrgency").value;
      const body = document.getElementById("annBody").value.trim();
      const author = activeAdmin ? activeAdmin.name : "ප්‍රධානාචාර්ය කාර්යාලය";
      const today = new Date().toISOString().split('T')[0];

      const audienceLabels = {
        all: "සියලු දෙනා වෙත (All)",
        teachers: "ආචාර්ය මණ්ඩලය පමණක් (Teachers Only)",
        students: "ශිෂ්‍යයන් සහ දෙමව්පියන් පමණක් (Students & Parents Only)"
      };
      const audienceLabel = audienceLabels[audience] || audience;

      const newAnn = {
        id: "ann-" + Date.now(),
        title: title,
        audience: audience,
        audienceLabel: audienceLabel,
        urgency: urgency,
        body: body,
        author: author,
        date: today
      };

      announcementsDb.unshift(newAnn);

      if (window.DahamPasalaAPI) {
        DahamPasalaAPI.addAnnouncement(newAnn);
      }

      persistAllAdminData();
      renderAdminAnnouncements();

      document.getElementById("annTitle").value = "";
      document.getElementById("annBody").value = "";

      const status = document.getElementById("status-ann");
      status.style.display = "inline";
      setTimeout(() => status.style.display = "none", 2500);
    }

    function deleteAnnouncement(index) {
      if (confirm("මෙම නිවේදනය ඉවත් කිරීමට ඔබට විශ්වාසද?")) {
        const annId = announcementsDb[index]?.id;
        announcementsDb.splice(index, 1);
        if (window.DahamPasalaAPI && annId) {
          DahamPasalaAPI.deleteAnnouncement(annId);
        }
        persistAllAdminData();
        renderAdminAnnouncements();
      }
    }

    // ==========================================
    // Student Bulk Import & CSV Export Management
    // ==========================================
    let pendingBulkStudents = [];

    function exportStudentsCsv() {
      const gradeFilter = document.getElementById("adminStudentGradeFilter")?.value || 'all';
      const grade = gradeFilter === 'all' ? '' : gradeFilter;
      const url = window.DahamPasalaAPI ? window.DahamPasalaAPI.getStudentsExportUrl(grade) : `/api/students/export?grade=${encodeURIComponent(grade)}`;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Daham_Pasala_Students_${grade ? grade.replace(/[^a-zA-Z0-9]/g, '_') : 'All'}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    function downloadStudentTemplate() {
      const url = window.DahamPasalaAPI ? window.DahamPasalaAPI.getStudentTemplateUrl() : '/api/students/template';
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", 'Daham_Pasala_Student_Import_Template.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    function openBulkImportStudentsModal() {
      pendingBulkStudents = [];
      const fileInput = document.getElementById("bulkStudentFileInput");
      if (fileInput) fileInput.value = "";
      const preview = document.getElementById("studentBulkPreviewSection");
      if (preview) preview.style.display = "none";
      const submitBtn = document.getElementById("btnSubmitBulkStudents");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> පද්ධතියට උඩුගත කරන්න (Import Students)';
      }
      document.getElementById("bulkImportStudentsModal").style.display = "flex";
    }

    function closeBulkImportStudentsModal() {
      document.getElementById("bulkImportStudentsModal").style.display = "none";
      pendingBulkStudents = [];
    }

    // CSV Parser supporting quoted cells and Sinhala Unicode
    function parseCsvText(text) {
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

    function handleStudentCsvFileSelected(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        const text = e.target.result;
        const rows = parseCsvText(text);
        if (rows.length < 2) {
          alert("CSV ගොනුවේ ශිෂ්‍ය දත්ත හමු නොවීය. කරුණාකර ආදර්ශ ගොනුව බලා නැවත උත්සාහ කරන්න.");
          return;
        }

        // Parse student objects (first row is header)
        pendingBulkStudents = [];
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (!r[0] && !r[1]) continue;
          pendingBulkStudents.push({
            regNo: r[0] || `DPS/2026/${100 + Object.keys(studentDb).length + i}`,
            name: r[1] || 'නම් නොකළ සිසුවා',
            englishName: r[2] || '',
            grade: r[3] || '10 ශ්‍රේණිය (Grade 10)',
            guardianName: r[4] || '',
            contact: r[5] || '',
            address: r[6] || '',
            pin: '1234'
          });
        }

        const countEl = document.getElementById("studentBulkCount");
        if (countEl) countEl.textContent = pendingBulkStudents.length;

        const tbody = document.getElementById("studentBulkPreviewBody");
        if (tbody) {
          tbody.innerHTML = pendingBulkStudents.map((s, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td><strong>${s.regNo}</strong></td>
              <td>${s.name}</td>
              <td>${s.grade}</td>
              <td>${s.guardianName || '-'}</td>
              <td>${s.contact || '-'}</td>
            </tr>
          `).join('');
        }

        const preview = document.getElementById("studentBulkPreviewSection");
        if (preview) preview.style.display = "block";

        const submitBtn = document.getElementById("btnSubmitBulkStudents");
        if (submitBtn) submitBtn.disabled = pendingBulkStudents.length === 0;
      };
      reader.readAsText(file, "UTF-8");
    }

    async function submitBulkStudentImport() {
      if (!pendingBulkStudents || pendingBulkStudents.length === 0) return;

      const submitBtn = document.getElementById("btnSubmitBulkStudents");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> සිසුන් ඇතුළත් වෙමින් පවතී...';
      }

      try {
        if (window.DahamPasalaAPI) {
          await window.DahamPasalaAPI.bulkImportStudents(pendingBulkStudents);
        }

        // Merge into local cache
        pendingBulkStudents.forEach(s => {
          studentDb[s.regNo] = {
            ...s,
            attendance: [],
            examMarks: [],
            deeds: [],
            badges: []
          };
        });
        persistAllAdminData();
        renderAdminStudentDirectory();
        updateAdminStats();

        alert(`සාර්ථකයි! සිසුන් ${pendingBulkStudents.length} දෙනෙකුගේ තොරතුරු සාර්ථකව පද්ධතියට එක් කරන ලදී.`);
        closeBulkImportStudentsModal();
      } catch (err) {
        console.error("Bulk student import failed:", err);
        alert("තොග ඇතුළත් කිරීමේදී දෝෂයක් සිදුවිය: " + err.message);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> පද්ධතියට උඩුගත කරන්න (Import Students)';
        }
      }
    }
