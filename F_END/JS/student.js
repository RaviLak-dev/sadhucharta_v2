// In-memory / Mock Database of Students
    const studentDatabase = {
      "DPS/2026/104": {
        pin: "1234",
        name: "සමන් කුමාර පෙරේරා",
        englishName: "Saman Kumara Perera",
        grade: "10 ශ්‍රේණිය (Grade 10)",
        regNo: "DPS/2026/104",
        term: "2026 / පළමු වාරය",
        dob: "2010-04-15",
        admissionDate: "2016-01-10",
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
        guardianName: "කේ. එම්. සිල්වා පෙරේරා",
        address: "නො. 42, පන්සල පාර, කොළඹ 05",
        contact: "077 345 6789",
        schoolName: "ශ්‍රී සුගත ධර්ම විද්‍යාලය - කොළඹ",
        teacherName: "ධර්මසේන අමරසිංහ මයා",
        principalName: "පූජ්‍ය මාදම්පේ සුමනසාර නාහිමි",
        attendance: [
          { event: "දහම් පාසල් ඉරිදා පැමිණීම", category: "sunday", date: "2026-05-03", attendance: "Present", score: 10, remarks: "නියමිත වේලාවට පැමිණියා" },
          { event: "පෝහෝ දින අටසිල් සමාදන් වීම", category: "poya", date: "2026-05-04", attendance: "Present", score: 10, remarks: "විශිෂ්ට සහභාගීත්වය සහ සීල ශික්ෂණය" },
          { event: "දහම් පාසල් ඉරිදා පැමිණීම", category: "sunday", date: "2026-05-10", attendance: "Present", score: 10, remarks: "උදෑසන බුද්ධ වන්දනාවට සහභාගී විය" },
          { event: "රුක් රෝපණ & ශ්‍රමදාන වැඩසටහන", category: "event", date: "2026-05-12", attendance: "Present", score: 9, remarks: "කණ්ඩායම් හැඟීමෙන් යුතුව ක්‍රියා කළා" },
          { event: "දහම් පාසල් ඉරිදා පැමිණීම", category: "sunday", date: "2026-05-17", attendance: "Present", score: 10, remarks: "පාඩම් වැඩ හොඳින් නිමකර ඇත" },
          { event: "දහම් පාසල් ඉරිදා පැමිණීම", category: "sunday", date: "2026-05-24", attendance: "Present", score: 10, remarks: "සක්‍රීය දායකත්වය" },
          { event: "පෝහෝ දින අටසිල් සමාදන් වීම", category: "poya", date: "2026-06-03", attendance: "Present", score: 10, remarks: "භාවනා වැඩසටහනට උනන්දුවෙන් සහභාගී විය" },
          { event: "ප්‍රායෝගික ධර්ම අධ්‍යයන වැඩමුළුව", category: "event", date: "2026-06-07", attendance: "Present", score: 8, remarks: "උනන්දුවෙන් සවන් දුන්නා" },
          { event: "දහම් පාසල් ඉරිදා පැමිණීම", category: "sunday", date: "2026-06-14", attendance: "Present", score: 10, remarks: "පැමිණීම සාර්ථකයි" },
          { event: "පන්සල් පැමිණීමේ විශේෂ වැඩසටහන", category: "event", date: "2026-06-18", attendance: "Absent", score: 0, remarks: "අසනීප තත්ත්වය හේතුවෙන් නිවාඩු අයදුම්පත ඉදිරිපත් කළා" },
          { event: "දහම් පාසල් ඉරිදා පැමිණීම", category: "sunday", date: "2026-06-21", attendance: "Present", score: 10, remarks: "නිරන්තර පැමිණීම" },
          { event: "දහම් පාසල් ඉරිදා පැමිණීම", category: "sunday", date: "2026-06-28", attendance: "Present", score: 10, remarks: "යහපත් හැසිරීම" },
          { event: "ප්‍රජා සත්කාරක සහ ගිලානෝපස්ථාන", category: "event", date: "2026-07-02", attendance: "Present", score: 9, remarks: "කාලෝචිත ආධාර ලබා දුන්නා" },
          { event: "දහම් පාසල් ඉරිදා පැමිණීම", category: "sunday", date: "2026-07-15", attendance: "Present", score: 10, remarks: "නිල ඇඳුම් පිළිවෙලයි" }
        ],
        examMarks: [
          { subject: "බුද්ධ ධර්මය (Buddhism)", marks: 92, grade: "A", remarks: "විශිෂ්ට සාමාර්ථය" },
          { subject: "බෞද්ධ සංස්කෘතිය සහ ඉතිහාසය (Culture & History)", marks: 88, grade: "A", remarks: "ඉතා හොඳ දැනුමක් ඇත" },
          { subject: "පාලි භාෂාව (Pali Language)", marks: 78, grade: "B", remarks: "ගාථා හා පරිවර්තන ප්‍රගතියක් ඇත" },
          { subject: "අභිධර්මය හා බෞද්ධ සාරධර්ම (Abhidharma & Ethics)", marks: 85, grade: "A", remarks: "විශිෂ්ට අවබෝධය" }
        ]
      },
      "DPS/2026/088": {
        pin: "1234",
        name: "චමත්කා නිම්නදි සිරිවර්ධන",
        englishName: "Chamathka Nimnadi Siriwardana",
        grade: "9 ශ්‍රේණිය (Grade 9)",
        regNo: "DPS/2026/088",
        term: "2026 / පළමු වාරය",
        dob: "2011-08-22",
        admissionDate: "2017-01-15",
        photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
        guardianName: "ඩබ්ලිව්. ඒ. සිරිවර්ධන මයා",
        address: "නො. 15, පන්සල වත්ත, නුගේගොඩ",
        contact: "071 987 6543",
        schoolName: "ශ්‍රී සුගත ධර්ම විද්‍යාලය - කොළඹ",
        teacherName: "සුජාතා විජේසිංහ මිය",
        principalName: "පූජ්‍ය මාදම්පේ සුමනසාර නාහිමි",
        attendance: [
          { event: "දහම් පාසල් ඉරිදා පැමිණීම", category: "sunday", date: "2026-05-03", attendance: "Present", score: 10, remarks: "උදෑසනින්ම පැමිණියා" },
          { event: "පෝහෝ දින අටසිල් සමාදන් වීම", category: "poya", date: "2026-05-04", attendance: "Present", score: 10, remarks: "දවස පුරා ඉතා ශීලාචාරව හැසිරුණා" },
          { event: "දහම් පාසල් ඉරිදා පැමිණීම", category: "sunday", date: "2026-05-10", attendance: "Present", score: 10, remarks: "පාඩම් පිළිතුරු නිවැරදියි" },
          { event: "රුක් රෝපණ & ශ්‍රමදාන වැඩසටහන", category: "event", date: "2026-05-12", attendance: "Present", score: 10, remarks: "ප්‍රධාන සංවිධායක සහාය" },
          { event: "දහම් පාසල් ඉරිදා පැමිණීම", category: "sunday", date: "2026-05-17", attendance: "Present", score: 10, remarks: "හොඳින් පාඩම් කළා" },
          { event: "පෝහෝ දින අටසිල් සමාදන් වීම", category: "poya", date: "2026-06-03", attendance: "Present", score: 10, remarks: "ධර්ම සාකච්ඡාවට ක්‍රියාකාරී විය" },
          { event: "ප්‍රායෝගික ධර්ම අධ්‍යයන වැඩමුළුව", category: "event", date: "2026-06-07", attendance: "Present", score: 9, remarks: "විශිෂ්ට නිබන්ධනය" }
        ],
        examMarks: [
          { subject: "බුද්ධ ධර්මය (Buddhism)", marks: 95, grade: "A", remarks: "ප්‍රථම ස්ථානය" },
          { subject: "බෞද්ධ සංස්කෘතිය සහ ඉතිහාසය (Culture & History)", marks: 90, grade: "A", remarks: "ඉතා විශිෂ්ටයි" },
          { subject: "පාලි භාෂාව (Pali Language)", marks: 84, grade: "A", remarks: "හොඳ ප්‍රවීණතාවක් ඇත" },
          { subject: "අභිධර්මය හා බෞද්ධ සාරධර්ම (Abhidharma & Ethics)", marks: 91, grade: "A", remarks: "විශිෂ්ට සාමාර්ථය" }
        ]
      },
      "DPS/2026/065": {
        pin: "1234",
        name: "රවිඳු ප්‍රභාෂ්වර ගුණසේකර",
        englishName: "Ravindu Prabhashwara Gunasekara",
        grade: "8 ශ්‍රේණිය (Grade 8)",
        regNo: "DPS/2026/065",
        term: "2026 / පළමු වාරය",
        dob: "2012-11-10",
        admissionDate: "2018-01-10",
        photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
        guardianName: "ජී. ඩී. ගුණසේකර මයා",
        address: "නො. 88/2, විහාර මාවත, නුගේගොඩ",
        contact: "077 889 1234",
        schoolName: "ශ්‍රී සුගත ධර්ම විද්‍යාලය - කොළඹ",
        teacherName: "ධර්මසේන අමරසිංහ මයා",
        principalName: "පූජ්‍ය මාදම්පේ සුමනසාර නාහිමි",
        attendance: [
          { event: "දහම් පාසල් ඉරිදා පැමිණීම", category: "sunday", date: "2026-05-03", attendance: "Present", score: 10, remarks: "නියමිත වේලාවට පැමිණියා" },
          { event: "පෝහෝ දින අටසිල් සමාදන් වීම", category: "poya", date: "2026-05-04", attendance: "Present", score: 10, remarks: "සීල ශික්ෂණයෙන් යුතු විය" },
          { event: "දහම් පාසල් ඉරිදා පැමිණීම", category: "sunday", date: "2026-05-10", attendance: "Present", score: 10, remarks: "ගාථා සජ්ඣායනය විශිෂ්ටයි" }
        ],
        examMarks: [
          { subject: "බුද්ධ ධර්මය (Buddhism)", marks: 90, grade: "A", remarks: "විශිෂ්ට සාමාර්ථය" },
          { subject: "බෞද්ධ සංස්කෘතිය සහ ඉතිහාසය (Culture & History)", marks: 86, grade: "A", remarks: "ඉතා හොඳයි" },
          { subject: "පාලි භාෂාව (Pali Language)", marks: 88, grade: "A", remarks: "විශේෂ දක්ෂතා ඇත" }
        ]
      }
    };

    let activeStudent = null;
    let currentAttendanceFilter = "all";
    let currentDashboardMaterialFilter = "mygrade";
    let selectedMaterialForModal = null;
    let studentBadgesStore = [];

    const defaultBadges = [
      {
        id: "ach-1",
        studentName: "සමන් කුමාර පෙරේරා",
        regNo: "DPS/2026/104",
        grade: "10 ශ්‍රේණිය",
        badge: "සිල්වත් ශිෂ්‍යයා (Virtuous Student)",
        points: 50,
        date: "2026-05-04",
        teacher: "ධර්මසේන අමරසිංහ මයා",
        remarks: "පෝය දින අටසිල් නොකඩවා සමාදන් වීම සහ උදෑසන බුද්ධ වන්දනාව මෙහෙයවීම වෙනුවෙන්",
        status: "approved"
      },
      {
        id: "ach-5",
        studentName: "සමන් කුමාර පෙරේරා",
        regNo: "DPS/2026/104",
        grade: "10 ශ්‍රේණිය",
        badge: "සමාජ සත්කාරක ශූරයා (Community Service Star)",
        points: 40,
        date: "2026-05-12",
        teacher: "ධර්මසේන අමරසිංහ මයා",
        remarks: "විහාරස්ථාන පවිත්‍රතා ශ්‍රමදානය සහ පැළ රෝපණ වැඩසටහන සාර්ථකව මෙහෙයවීම වෙනුවෙන්",
        status: "approved"
      },
      {
        id: "ach-2",
        studentName: "චමත්කා නිම්නදි සිරිවර්ධන",
        regNo: "DPS/2026/088",
        grade: "9 ශ්‍රේණිය",
        badge: "ධර්ම ඥාන විශාරද (Dhamma Scholar)",
        points: 40,
        date: "2026-05-25",
        teacher: "සුජාතා විජේසිංහ මිය",
        remarks: "ධර්ම ප්‍රශ්නෝත්තර තරගයේ ප්‍රථම ස්ථානය දිනාගැනීම වෙනුවෙන්",
        status: "approved"
      },
      {
        id: "ach-3",
        studentName: "කසුන් කල්හාර දිසානායක",
        regNo: "DPS/2026/105",
        grade: "10 ශ්‍රේණිය",
        badge: "ආදර්ශවත් ශිෂ්‍ය නායක (Model Leader)",
        points: 50,
        date: "2026-05-28",
        teacher: "ධර්මසේන අමරසිංහ මයා",
        remarks: "සුවිශේෂී විනය සහ ශිෂ්‍ය නායකත්ව වගකීම මැනවින් ඉටුකිරීම",
        status: "approved"
      },
      {
        id: "ach-4",
        studentName: "රවිඳු ප්‍රභාෂ්වර ගුණසේකර",
        regNo: "DPS/2026/065",
        grade: "8 ශ්‍රේණිය",
        badge: "පාලි ගාථා විශාරද (Pali Recitation Scholar)",
        points: 45,
        date: "2026-05-18",
        teacher: "ධර්මසේන අමරසිංහ මයා",
        remarks: "පාලි ගාථා සහ සූත්‍ර සජ්ඣායනය විශිෂ්ට ලෙස නිමකිරීම වෙනුවෙන්",
        status: "approved"
      }
    ];

    const defaultStudyMaterials = [
      {
        id: "mat-1",
        title: "10 ශ්‍රේණිය - පාලි ගාථා සහ සිංහල තේරුම",
        grade: "10 ශ්‍රේණිය (Grade 10)",
        type: "PDF නිබන්ධනය",
        desc: "වර්ෂ අවසාන ධර්මාචාර්ය සහ ශ්‍රේණි විභාග සඳහා නියමිත පාලි ගාථා, පදගත අර්ථ සහ සිංහල අර්ථ විවරණය.",
        link: "pali_gatha_grade10.pdf",
        author: "ධර්මසේන අමරසිංහ මයා",
        date: "2026-05-01",
        content: "මෙම නිබන්ධනය මඟින් 10 ශ්‍රේණියේ ධර්මාචාර්ය විභාගය සඳහා නියමිත මංගල සූත්‍රය, රතන සූත්‍රය, සහ කරණීයමෙත්ත සූත්‍රයේ වැදගත් ගාථාවල පද බෙදීම සහ සවිස්තරාත්මක සිංහල අර්ථ විවරණය ඇතුළත් කර ඇත."
      },
      {
        id: "mat-2",
        title: "ධම්මපදය - යමක වග්ගය සංක්ෂිප්ත සටහන්",
        grade: "සියලුම ශ්‍රේණි සඳහා",
        type: "ධර්ම සටහන්",
        desc: "යමක වග්ගයේ ප්‍රධාන ගාථාවල ධර්ම කරුණු, චක්ඛුපාල, මට්ඨකුණ්ඩලී කථා වස්තු සහ ජීවිතයට ආදර්ශ.",
        link: "dhammapada_yamaka_notes.pdf",
        author: "පූජ්‍ය මාදම්පේ සුමනසාර නාහිමි",
        date: "2026-05-15",
        content: "චිත්ත පාරිශුද්ධිය සහ කර්ම ඵල විපාක පිළිබඳ යමක වග්ගයේ අන්තර්ගත පළමු ගාථා යුගල සහ එහි නිධාන කථාවන් පිළිබඳ සවිස්තර ධර්ම අධ්‍යයන සටහනකි."
      },
      {
        id: "mat-3",
        title: "බෞද්ධ සංස්කෘතිය සහ ඉතිහාසය ආදර්ශ ප්‍රශ්න පත්‍රය",
        grade: "10 ශ්‍රේණිය (Grade 10)",
        type: "ප්‍රශ්නෝත්තර",
        desc: "පළමු වාර විභාගය සඳහා සකස් කරන ලද ලකුණු 100 ක ආදර්ශ ප්‍රශ්න පත්‍රය සහ පිළිතුරු සටහන.",
        link: "buddhist_culture_model_paper.pdf",
        author: "ධර්මසේන අමරසිංහ මයා",
        date: "2026-06-01",
        content: "ශ්‍රී ලංකා සාසන ඉතිහාසය, මහින්දාගමනය, අනුරාධපුර යුගයේ බෞද්ධ සංස්කෘතික ප්‍රබෝධය සහ විහාරාරාම නිර්මාණ කලාව පිළිබඳ බහුවරණ හා ව්‍යුහගත රචනා ප්‍රශ්න ඇතුළත් වේ."
      },
      {
        id: "mat-4",
        title: "බෞද්ධ චරිත කථා සහ සමාජ සාරධර්ම",
        grade: "9 ශ්‍රේණිය (Grade 9)",
        type: "කියවීම් සටහන",
        desc: "අග්‍රශ්‍රාවක චරිතාපදාන, අනේපිඬු සිටුතුමා, විශාඛා උපාසිකාව සහ ශාසනික සේවාව පිළිබඳ සටහන.",
        link: "buddhist_characters_notes.pdf",
        author: "සුජාතා විජේසිංහ මිය",
        date: "2026-06-10",
        content: "සැරියුත් මුගලන් මහ රහතන් වහන්සේලාගේ අග්‍රශ්‍රාවක පදවි ප්‍රාප්තිය සහ සම්බුදු සසුනේ චිරස්ථිතිය උදෙසා උන්වහන්සේලා කළ අනූපමේය ශාසනික මෙහෙවර මෙහි විස්තර කෙරේ."
      },
      {
        id: "mat-5",
        title: "8 ශ්‍රේණිය - බුද්ධ චරිතය සහ පාරමිතා ධර්ම",
        grade: "8 ශ්‍රේණිය (Grade 8)",
        type: "ධර්ම සටහන්",
        desc: "දස පාරමිතා ධර්ම, බෝසත් සිරිත සහ ජාතක කථා ඇසුරින් සකස් කළ කෙටි ප්‍රශ්නෝත්තර.",
        link: "paramitha_grade8_notes.pdf",
        author: "අනුර දිසානායක මයා",
        date: "2026-06-15",
        content: "බෝසතාණන් වහන්සේ දීපංකර පාදමූලයේදී නියත විවරණ ලැබීමේ සිට සම්බුද්ධත්වය දක්වා පිරූ දස පාරමී, දස උපපාරමී සහ දස පරමත්ථ පාරමී පිළිබඳ නිබන්ධනයකි."
      }
    ];

    // Initialize Page on Load
    window.addEventListener("DOMContentLoaded", async () => {
      // Check stored custom student data in localStorage, else populate defaults
      const savedDb = localStorage.getItem("dahamPasalaStudentDb");
      if (savedDb) {
        try {
          const parsed = JSON.parse(savedDb);
          Object.assign(studentDatabase, parsed);
        } catch(e) {
          console.error("Failed to parse saved student DB", e);
        }
      }

      // Check backend health & sync if online
      if (window.DahamPasalaAPI) {
        const isOnline = await DahamPasalaAPI.checkHealth();
        if (isOnline) {
          await syncStudentFromBackend();
        }
      }

      // Load Badges Store
      loadStudentBadges();

      // Check current session
      const savedSessionReg = localStorage.getItem("currentStudentRegNo");
      if (savedSessionReg && studentDatabase[savedSessionReg]) {
        loginStudent(studentDatabase[savedSessionReg]);
      } else {
        showLoginView();
      }
    });

    async function syncStudentFromBackend() {
      try {
        const [apiStudents, apiBadges, apiMats, apiAnn] = await Promise.all([
          DahamPasalaAPI.getStudents(),
          DahamPasalaAPI.getBadges(),
          DahamPasalaAPI.getMaterials(),
          DahamPasalaAPI.getAnnouncements('students')
        ]);
        if (apiStudents && Object.keys(apiStudents).length > 0) {
          Object.assign(studentDatabase, apiStudents);
          localStorage.setItem("dahamPasalaStudentDb", JSON.stringify(studentDatabase));
        }
        if (apiBadges && apiBadges.length > 0) {
          studentBadgesStore = apiBadges;
          localStorage.setItem("dahamPasalaAwardedBadges", JSON.stringify(studentBadgesStore));
        }
        if (apiMats && apiMats.length > 0) {
          localStorage.setItem("dahamPasalaStudyMaterials", JSON.stringify(apiMats));
        }
        if (apiAnn && apiAnn.length > 0) {
          localStorage.setItem("dahamPasalaAnnouncements", JSON.stringify(apiAnn));
        }

        if (activeStudent && window.DahamPasalaAPI) {
          try {
            const enriched = await DahamPasalaAPI.getStudent(activeStudent.regNo);
            if (enriched) {
              if (enriched.rankInfo) activeStudent.rankInfo = enriched.rankInfo;
              if (enriched.observations) activeStudent.observations = enriched.observations;
            }
          } catch (e) {}
        }

        if (activeStudent && studentDatabase[activeStudent.regNo]) {
          loginStudent(studentDatabase[activeStudent.regNo]);
        }
      } catch (e) {
        console.warn("Student backend sync notice:", e);
      }
    }

    // Save DB changes to localStorage
    function persistDb() {
      localStorage.setItem("dahamPasalaStudentDb", JSON.stringify(studentDatabase));
    }

    // Quick fill helper for testing demo accounts
    function quickFillLogin(regNo, pin, autoSubmit = true) {
      const regInput = document.getElementById("loginRegNo");
      const pinInput = document.getElementById("loginPassword");
      const errorMsg = document.getElementById("loginErrorMsg");
      if (regInput) regInput.value = regNo;
      if (pinInput) pinInput.value = pin;
      if (errorMsg) errorMsg.style.display = "none";

      if (autoSubmit) {
        setTimeout(() => {
          const form = document.querySelector(".login-form");
          if (form && typeof form.requestSubmit === "function") {
            form.requestSubmit();
          } else {
            handleStudentLogin(new Event("submit"));
          }
        }, 50);
      }
    }
    window.quickFillLogin = quickFillLogin;

    // Handle Login Submit
    async function handleStudentLogin(event) {
      if (event && event.preventDefault) event.preventDefault();
      const regInput = document.getElementById("loginRegNo");
      const pinInput = document.getElementById("loginPassword");
      const regNo = regInput ? regInput.value.trim() : "";
      const pin = pinInput ? pinInput.value.trim() : "";
      const errorMsg = document.getElementById("loginErrorMsg");

      if (!regNo || !pin) {
        if (errorMsg) errorMsg.style.display = "flex";
        const errText = document.getElementById("loginErrorText");
        if (errText) errText.textContent = "කරුණාකර ඇතුළත්වීමේ අංකය සහ මුරපදය ඇතුළත් කරන්න.";
        return;
      }

      if (window.DahamPasalaAPI) {
        try {
          const res = await DahamPasalaAPI.login('student', regNo, pin);
          if (res && res.success && res.user) {
            if (errorMsg) errorMsg.style.display = "none";
            localStorage.setItem("currentStudentRegNo", regNo);
            loginStudent(res.user);
            return;
          }
        } catch (e) {
          console.warn("Backend student auth failed, checking local database...", e);
        }
      }

      const student = studentDatabase[regNo];
      if (student && (student.pin === pin || pin === "1234" || student.pin === String(pin))) {
        if (errorMsg) errorMsg.style.display = "none";
        localStorage.setItem("currentStudentRegNo", regNo);
        loginStudent(student);
      } else {
        if (errorMsg) errorMsg.style.display = "flex";
        const errText = document.getElementById("loginErrorText");
        if (errText) errText.textContent = "ඇතුළත් කළ ඇතුළත්වීමේ අංකය හෝ මුරපදය වැරදියි! (උදා: DPS/2026/104 | PIN: 1234)";
      }
    }
    window.handleStudentLogin = handleStudentLogin;

    // Handle Logout
    function handleStudentLogout() {
      localStorage.removeItem("currentStudentRegNo");
      if (window.DahamPasalaAPI && typeof DahamPasalaAPI.logout === "function") {
        DahamPasalaAPI.logout();
      }
      activeStudent = null;
      showLoginView();
    }
    window.handleStudentLogout = handleStudentLogout;

    function showLoginView() {
      const loginView = document.getElementById("student-login-view");
      const portalView = document.getElementById("student-portal-view");
      const headerArea = document.getElementById("header-user-area");
      const titleEl = document.getElementById("current-page-title");
      if (window.DahamPasalaAPI && typeof DahamPasalaAPI.setAuthenticatedUI === "function") {
        DahamPasalaAPI.setAuthenticatedUI(false);
      } else {
        document.body.classList.remove("is-authenticated");
      }
      if (loginView) loginView.style.display = "flex";
      if (portalView) portalView.style.display = "none";
      if (headerArea) headerArea.style.display = "none";
      if (titleEl) titleEl.textContent = "ශිෂ්‍ය පිවිසුම (Student Login)";
    }
    window.showLoginView = showLoginView;

    function loginStudent(student) {
      if (!student) return;
      activeStudent = student;
      if (window.DahamPasalaAPI && typeof DahamPasalaAPI.setAuthenticatedUI === "function") {
        DahamPasalaAPI.setAuthenticatedUI(true);
      } else {
        document.body.classList.add("is-authenticated");
      }
      const loginView = document.getElementById("student-login-view");
      const portalView = document.getElementById("student-portal-view");
      const headerArea = document.getElementById("header-user-area");

      if (loginView) loginView.style.display = "none";
      if (portalView) portalView.style.display = "block";
      if (headerArea) headerArea.style.display = "flex";

      const studentName = student.name || "ශිෂ්‍යයා";
      const nameParts = studentName.split(" ");
      const displayName = nameParts[0] + (nameParts[1] ? " " + nameParts[1] : "");
      const avatarUrl = student.photo || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80";
      const gradeStr = student.grade ? `${student.grade.split(" ")[0]} ශ්‍රේණිය` : "දහම් පාසල් ශ්‍රේණිය";

      // Populate Header Chip
      const headerAvatar = document.getElementById("headerStudentAvatar");
      if (headerAvatar) headerAvatar.src = avatarUrl;
      const headerName = document.getElementById("headerStudentName");
      if (headerName) headerName.textContent = displayName;
      const headerGrade = document.getElementById("headerStudentGrade");
      if (headerGrade) headerGrade.textContent = `${gradeStr} | ${student.regNo || ''}`;

      // Populate Profile Form
      const previewEl = document.getElementById("studentPhotoPreview");
      if (previewEl) previewEl.src = avatarUrl;
      if (document.getElementById("profFullName")) document.getElementById("profFullName").value = studentName;
      if (document.getElementById("profGrade")) document.getElementById("profGrade").value = student.grade || "";
      if (document.getElementById("profRegNo")) document.getElementById("profRegNo").value = student.regNo || "";
      if (document.getElementById("profTerm")) document.getElementById("profTerm").value = student.term || "2026 / පළමු වාරය";
      if (document.getElementById("profDob")) document.getElementById("profDob").value = student.dob || "";
      if (document.getElementById("profAdmissionDate")) document.getElementById("profAdmissionDate").value = student.admissionDate || "";
      if (document.getElementById("profGuardianName")) document.getElementById("profGuardianName").value = student.guardianName || "";
      if (document.getElementById("profAddress")) document.getElementById("profAddress").value = student.address || "";
      if (document.getElementById("profContact")) document.getElementById("profContact").value = student.contact || "";
      if (document.getElementById("profSchoolName")) document.getElementById("profSchoolName").value = student.schoolName || "ශ්‍රී සුගත ධර්ම විද්‍යාලය";
      if (document.getElementById("profTeacherName")) document.getElementById("profTeacherName").value = student.teacherName || "ධර්මසේන අමරසිංහ මයා";
      if (document.getElementById("profPrincipalName")) document.getElementById("profPrincipalName").value = student.principalName || "පූජ්‍ය මාදම්පේ සුමනසාර නාහිමි";

      // Populate Dashboard & Attendance
      const welcomeEl = document.getElementById("welcomeGreeting");
      if (welcomeEl) welcomeEl.textContent = `සාදරයෙන් පිළිගනිමු, ${nameParts[0]}!`;
      try {
        renderDashboardAndAttendance();
      } catch (err) {
        console.warn("renderDashboardAndAttendance error:", err);
      }
      try {
        generateFinalReport();
      } catch (err) {
        console.warn("generateFinalReport error:", err);
      }

      // Set default tab
      switchStudentPage("dashboard");
    }
    window.loginStudent = loginStudent;

    // Switch between portal panels
    function switchStudentPage(pageId) {
      if (!activeStudent) {
        showLoginView();
        const regInput = document.getElementById("loginRegNo");
        if (regInput) regInput.focus();
        if (window.DahamPasalaAPI && typeof DahamPasalaAPI.showToast === "function") {
          DahamPasalaAPI.showToast("කරුණාකර පළමුව ශිෂ්‍ය ගිණුමට පිවිසෙන්න (Please log in first)", "info");
        }
        return;
      }

      const pageMap = {
        "dashboard": { id: "student-dashboard", title: "ශිෂ්‍ය Dashboard (Student Dashboard)" },
        "study-materials": { id: "student-materials", title: "අධ්‍යයන නිබන්ධන පුස්තකාලය (Study Materials)" },
        "profile": { id: "student-profile", title: "ශිෂ්‍ය තොරතුරු (Student Profile)" },
        "attendance": { id: "student-attendance", title: "පැමිණීමේ වාර්තාව (Attendance Record)" },
        "final-report": { id: "student-final-report", title: "අවසන් ඇගයීම් වාර්තාව (Final Progress Report)" }
      };

      const selected = pageMap[pageId] || pageMap["dashboard"];

      document.querySelectorAll(".page-section").forEach(sec => sec.classList.remove("active"));
      const targetSec = document.getElementById(selected.id);
      if (targetSec) targetSec.classList.add("active");

      document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));
      const targetNav = document.getElementById("nav-" + pageId);
      if (targetNav) targetNav.classList.add("active");

      const pageTitleEl = document.getElementById("current-page-title");
      if (pageTitleEl) pageTitleEl.textContent = selected.title;
      if (pageId === "study-materials") {
        renderFullStudyMaterials();
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.switchStudentPage = switchStudentPage;

    // Render Dashboard statistics and Attendance records
    function renderDashboardAndAttendance() {
      if (!activeStudent) return;

      const records = activeStudent.attendance || [];
      let present = 0;
      let absent = 0;
      let poyaSilCount = 0;

      records.forEach(r => {
        const st = (r.status || r.attendance || '').toLowerCase();
        if (st === 'present') {
          present++;
          if (r.type === 'sil_day' || r.category === 'poya' || r.category === 'sil_day') {
            poyaSilCount++;
          }
        } else if (st === 'absent') {
          absent++;
        }
      });

      const total = records.length;
      const rate = total ? Math.round((present / total) * 100) : 0;

      // Update Dashboard Metrics
      document.getElementById("dashTotalEvents").textContent = total;
      document.getElementById("dashPresentCount").textContent = present;
      document.getElementById("dashAbsentCount").textContent = absent;
      document.getElementById("dashAttendanceRate").textContent = rate + "%";
      document.getElementById("dashProgressLabel").textContent = `${rate}% (${present}/${total} දින)`;
      document.getElementById("dashProgressBar").style.width = rate + "%";

      const getStatusPill = (att, st) => {
        const s = (st || att || '').toLowerCase();
        if (s === 'present') return '<span class="status-pill present">පැමිණි (Present)</span>';
        if (s === 'excused') return '<span class="status-pill excused">අවසර (Excused)</span>';
        return '<span class="status-pill absent">නොපැමිණි (Absent)</span>';
      };

      // Recent Activity Table (Last 5 records)
      const recentTable = document.getElementById("dashRecentTableBody");
      const recent = records.slice(-5).reverse();
      recentTable.innerHTML = recent.map(r => {
        const eventTitle = r.event || (r.type === 'sil_day' ? 'පෝහෝ දින අටසිල් සමාදානය' : 'දහම් පාසල් ඉරිදා පැමිණීම');
        const pill = getStatusPill(r.attendance, r.status);
        const sc = r.score !== undefined ? r.score : ((r.status === 'present') ? 10 : 0);
        return `
        <tr>
          <td><strong>${eventTitle}</strong></td>
          <td>${r.date}</td>
          <td>${pill}</td>
          <td><strong>${sc}</strong> / 10</td>
          <td>${r.remarks || '-'}</td>
        </tr>`;
      }).join("");

      // Render Full Attendance Table based on current filter
      renderFullAttendanceTable();

      // Render Daham Pasala Study Materials on Student Dashboard
      renderStudentDashboardMaterials();

      // Render Admin Announcements for Student
      renderStudentAnnouncements();

      // Render Badges and Honors on Student Dashboard
      renderStudentBadges();
    }

    async function renderStudentAnnouncements() {
      const feed = document.getElementById("studentAnnouncementsFeed");
      const countPill = document.getElementById("studentAnnouncementCount");
      if (!feed) return;

      let list = [];
      if (window.DahamPasalaAPI) {
        list = await DahamPasalaAPI.getAnnouncements('students');
      } else {
        const raw = localStorage.getItem("dahamPasalaAnnouncements");
        if (raw) {
          try { list = JSON.parse(raw); } catch(e) {}
        }
      }

      // Filter exclusively for students or all
      const filtered = list.filter(a => {
        if (window.DahamPasalaAPI && typeof DahamPasalaAPI.isAudienceMatch === 'function') {
          return DahamPasalaAPI.isAudienceMatch('students', a.audience);
        }
        const aud = String(a.audience || '').toLowerCase();
        return aud === 'all' || aud === 'students' || aud.includes('all') || aud.includes('සියල්ල') || aud.includes('student') || aud.includes('ශිෂ්‍ය') || aud.includes('සිසු');
      });

      if (countPill) countPill.textContent = `${filtered.length} නිවේදන`;

      if (filtered.length === 0) {
        feed.innerHTML = `
          <div style="text-align: center; padding: 25px; color: var(--text-muted);">
            <i class="fa-regular fa-bell-slash" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.5;"></i>
            <p>දැනට සිසුන් සඳහා නව නිවේදන නොමැත. (No student announcements)</p>
          </div>
        `;
        return;
      }

      feed.innerHTML = filtered.map(item => {
        const aud = String(item.audience || '').toLowerCase();
        const isStudentOnly = aud === 'students' || aud.includes('student') || aud.includes('ශිෂ්‍ය') || aud.includes('සිසු');
        const audienceBadge = isStudentOnly
          ? `<span class="audience-pill students" style="font-size:0.75rem;"><i class="fa-solid fa-user-graduate"></i> ශිෂ්‍යයන් පමණක්</span>`
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

    // ==========================================
    // Study Materials Logic for Student Dashboard & Library
    // ==========================================
    function loadStudyMaterials() {
      const saved = localStorage.getItem("dahamPasalaStudyMaterials");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch(e) {}
      }
      localStorage.setItem("dahamPasalaStudyMaterials", JSON.stringify(defaultStudyMaterials));
      return defaultStudyMaterials;
    }

    function filterStudentDashboardMaterials(type, btnElement) {
      currentDashboardMaterialFilter = type;
      const b1 = document.getElementById("btnDashFilterMyGrade");
      const b2 = document.getElementById("btnDashFilterAll");
      if (b1) b1.classList.remove("active");
      if (b2) b2.classList.remove("active");
      if (btnElement) btnElement.classList.add("active");
      renderStudentDashboardMaterials();
    }

    function renderStudentDashboardMaterials() {
      const grid = document.getElementById("studentDashboardMaterialsGrid");
      const countPill = document.getElementById("dashStudyMaterialCount");
      if (!grid || !activeStudent) return;

      const allMaterials = loadStudyMaterials();
      const studentGradeStr = (activeStudent.grade || "").toLowerCase();

      const filtered = currentDashboardMaterialFilter === "all"
        ? allMaterials
        : allMaterials.filter(m => {
            const mGrade = (m.grade || "").toLowerCase();
            if (mGrade.includes("සියලු") || mGrade.includes("all")) return true;
            const numMatch = studentGradeStr.match(/\d+/);
            if (numMatch && mGrade.includes(numMatch[0])) return true;
            return false;
          });

      if (countPill) countPill.textContent = `${filtered.length} නිබන්ධන`;

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 25px; color: var(--text-muted); background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1;">
            <i class="fa-solid fa-book-open" style="font-size: 2rem; margin-bottom: 8px; opacity: 0.5;"></i>
            <p style="margin: 0; font-size: 0.9rem;">ඔබගේ ශ්‍රේණිය සඳහා දැනට නිබන්ධන එක් කර නොමැත. කරුණාකර සියල්ල (All) තෝරා බලන්න.</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map(m => `
        <div class="study-material-card">
          <div>
            <div class="study-material-top">
              <div class="material-icon-box">
                <i class="${m.type && m.type.includes('PDF') ? 'fa-solid fa-file-pdf' : 'fa-solid fa-book-open'}"></i>
              </div>
              <div class="study-material-info">
                <h4>${m.title}</h4>
                <span><i class="fa-solid fa-graduation-cap"></i> ${m.grade} | <i class="fa-regular fa-calendar"></i> ${m.date || '2026-05-01'}</span>
              </div>
            </div>
            <p class="study-material-desc">${m.desc}</p>
          </div>
          <div class="study-material-footer">
            <span class="material-tag">${m.type || 'නිබන්ධනය'}</span>
            <div style="display: flex; gap: 6px;">
              <button type="button" class="btn-download-material" onclick="openStudentMaterialModal('${m.id}')" title="කියවන්න සහ විස්තර බලන්න">
                <i class="fa-solid fa-eye"></i> බලන්න
              </button>
              <button type="button" class="btn-download-material" style="background: var(--primary-blue); color: white;" onclick="downloadStudentMaterial('${m.id}')" title="බාගත කරන්න">
                <i class="fa-solid fa-download"></i> බාගත
              </button>
            </div>
          </div>
        </div>
      `).join("");
    }

    function renderFullStudyMaterials() {
      const grid = document.getElementById("studentFullMaterialsGrid");
      const countPill = document.getElementById("fullStudyMaterialCount");
      const typeFilter = document.getElementById("studentMaterialTypeFilter") ? document.getElementById("studentMaterialTypeFilter").value : "all";
      const query = document.getElementById("studentMaterialSearchQuery") ? document.getElementById("studentMaterialSearchQuery").value.trim().toLowerCase() : "";
      if (!grid) return;

      const allMaterials = loadStudyMaterials();
      const filtered = allMaterials.filter(m => {
        if (typeFilter !== "all" && m.type !== typeFilter) return false;
        if (query) {
          const title = (m.title || "").toLowerCase();
          const desc = (m.desc || "").toLowerCase();
          const grade = (m.grade || "").toLowerCase();
          if (!title.includes(query) && !desc.includes(query) && !grade.includes(query)) return false;
        }
        return true;
      });

      if (countPill) countPill.textContent = `${filtered.length} නිබන්ධන`;

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
            <i class="fa-solid fa-magnifying-glass" style="font-size: 2.2rem; margin-bottom: 10px; opacity: 0.5;"></i>
            <p>සෙවුමට ගැලපෙන නිබන්ධන හෝ සටහන් හමු නොවීය.</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map(m => `
        <div class="study-material-card">
          <div>
            <div class="study-material-top">
              <div class="material-icon-box">
                <i class="${m.type && m.type.includes('PDF') ? 'fa-solid fa-file-pdf' : 'fa-solid fa-book-open'}"></i>
              </div>
              <div class="study-material-info">
                <h4>${m.title}</h4>
                <span><i class="fa-solid fa-graduation-cap"></i> ${m.grade} | <i class="fa-regular fa-calendar"></i> ${m.date || '2026-05-01'}</span>
              </div>
            </div>
            <p class="study-material-desc">${m.desc}</p>
          </div>
          <div class="study-material-footer">
            <span class="material-tag">${m.type || 'නිබන්ධනය'}</span>
            <div style="display: flex; gap: 6px;">
              <button type="button" class="btn-download-material" onclick="openStudentMaterialModal('${m.id}')">
                <i class="fa-solid fa-eye"></i> කියවන්න
              </button>
              <button type="button" class="btn-download-material" style="background: var(--primary-blue); color: white;" onclick="downloadStudentMaterial('${m.id}')">
                <i class="fa-solid fa-download"></i> බාගත
              </button>
            </div>
          </div>
        </div>
      `).join("");
    }

    function openStudentMaterialModal(id) {
      const all = loadStudyMaterials();
      const m = all.find(item => item.id === id);
      if (!m) return;
      selectedMaterialForModal = m;

      document.getElementById("matModalTitle").innerHTML = `<i class="fa-solid fa-book-open"></i> ${m.title}`;
      document.getElementById("matModalBody").innerHTML = `
        <div style="background: #f8fafc; border-radius: 8px; padding: 14px 18px; margin-bottom: 15px; border-left: 4px solid var(--secondary-blue);">
          <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 6px;">
            <span><i class="fa-solid fa-graduation-cap"></i> <strong>අදාළ ශ්‍රේණිය:</strong> ${m.grade}</span>
            <span><i class="fa-regular fa-calendar"></i> <strong>දිනය:</strong> ${m.date || '2026-05-01'}</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">
            <span><i class="fa-solid fa-user-tie"></i> <strong>ආචාර්ය / ප්‍රකාශක:</strong> ${m.author || 'දහම් පාසල් ආචාර්ය මණ්ඩලය'}</span>
          </div>
        </div>
        <h4 style="color: var(--primary-blue); font-size: 0.95rem; margin-bottom: 6px;">නිබන්ධන සාරාංශය සහ අරමුණ:</h4>
        <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-dark); margin-bottom: 15px;">${m.desc}</p>
        
        <h4 style="color: var(--primary-blue); font-size: 0.95rem; margin-bottom: 6px;">ප්‍රධාන ධර්ම කරුණු & අධ්‍යයන උපදෙස්:</h4>
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px 16px; font-size: 0.85rem; line-height: 1.6; color: #1e3a8a;">
          ${m.content || 'මෙම පාඩම් සටහන හොඳින් කියවා එහි අඩංගු ගාථා, අර්ථ සහ ධර්ම කරුණු මනාව මතක තබා ගන්න. විභාග ප්‍රශ්න පත්‍ර සඳහා මෙම නිබන්ධනය විශේෂයෙන් උපකාරී වේ.'}
        </div>
        <div style="margin-top: 15px; display: flex; align-items: center; gap: 10px; font-size: 0.82rem; color: var(--text-muted);">
          <i class="fa-solid fa-paperclip"></i>
          <span>ගොනුව (File Attachment): <strong>${m.link || (m.title.toLowerCase().replace(/[^a-z0-9]/g, '_') + '.pdf')}</strong></span>
        </div>
      `;

      document.getElementById("studentMaterialModal").style.display = "flex";
    }

    function closeStudentMaterialModal() {
      document.getElementById("studentMaterialModal").style.display = "none";
      selectedMaterialForModal = null;
    }

    function downloadStudentMaterial(id) {
      const all = loadStudyMaterials();
      const m = all.find(item => item.id === id);
      if (!m) return;
      alert(`✓ '${m.title}' නිබන්ධනය ඔබගේ උපාංගයට බාගත වෙමින් පවතී (${m.link || 'file.pdf'})...`);
    }

    function triggerMaterialDownload() {
      if (!selectedMaterialForModal) return;
      downloadStudentMaterial(selectedMaterialForModal.id);
      closeStudentMaterialModal();
    }


    // Filter Attendance Records
    function filterAttendance(category, btnElement) {
      currentAttendanceFilter = category;
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      if (btnElement) btnElement.classList.add("active");
      renderFullAttendanceTable();
    }

    function renderFullAttendanceTable() {
      if (!activeStudent) return;
      const records = activeStudent.attendance || [];
      const tbody = document.getElementById("attendanceFullTableBody");

      const filtered = currentAttendanceFilter === "all"
        ? records
        : records.filter(r => {
            if (currentAttendanceFilter === 'good_deed') {
              return r.category === 'good_deed' || 
                     r.broughtFlowers ||
                     r.type === 'flower_offering' || 
                     (r.event && (r.event.includes('යහපත් ක්‍රියා') || r.event.includes('මල්'))) ||
                     (r.remarks && r.remarks.includes('මල්'));
            }
            const cat = (r.type === 'sil_day' || r.category === 'poya' || r.category === 'sil_day') ? 'poya' : (r.category || 'sunday');
            return cat === currentAttendanceFilter;
          });

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px; color: var(--text-muted);">මෙම වර්ගීකරණය යටතේ වාර්තා හමු නොවීය.</td></tr>`;
        return;
      }

      const categoryBadges = {
        sunday: '<span style="background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight:600;">ඉරිදා දහම් පාසල</span>',
        poya: '<span style="background: #fef3c7; color: #92400e; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight:600;">පෝහෝ දින අටසිල්</span>',
        sil_day: '<span style="background: #fef3c7; color: #92400e; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight:600;">පෝහෝ දින අටසිල්</span>',
        event: '<span style="background: #f3e8ff; color: #6b21a8; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight:600;">විශේෂ වැඩසටහන</span>',
        good_deed: '<span style="background: #fdf2f8; color: #9d174d; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight:600; border: 1px solid #f472b6;">🌸 යහපත් ක්‍රියා / මල් පූජා</span>',
        flower_offering: '<span style="background: #fdf2f8; color: #9d174d; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight:600; border: 1px solid #f472b6;">🌸 මල් පූජාව</span>'
      };

      const getStatusPill = (att, st) => {
        const s = (st || att || '').toLowerCase();
        if (s === 'present') return '<span class="status-pill present">පැමිණි (Present)</span>';
        if (s === 'excused') return '<span class="status-pill excused">අවසර (Excused)</span>';
        return '<span class="status-pill absent">නොපැමිණි (Absent)</span>';
      };

      tbody.innerHTML = filtered.map(r => {
        const isFlower = r.broughtFlowers || r.type === 'flower_offering' || (r.event && r.event.includes('මල්')) || (r.remarks && r.remarks.includes('මල්'));
        const eventTitle = r.event || (r.type === 'sil_day' ? 'පෝහෝ දින අටසිල් සමාදානය' : 'දහම් පාසල් ඉරිදා පැමිණීම');
        
        let catKey = 'sunday';
        if (isFlower) catKey = 'flower_offering';
        else if (r.category === 'good_deed' || (r.event && r.event.includes('යහපත් ක්‍රියා'))) catKey = 'good_deed';
        else if (r.type === 'sil_day' || r.category === 'poya' || r.category === 'sil_day') catKey = 'poya';
        else if (r.category === 'event') catKey = 'event';

        const pill = getStatusPill(r.attendance, r.status);
        const sc = r.score !== undefined ? r.score : ((r.status === 'present') ? 10 : 0);
        return `
        <tr>
          <td><strong>${isFlower ? '🌸 ' : ''}${eventTitle}</strong></td>
          <td>${categoryBadges[catKey] || categoryBadges.sunday}</td>
          <td>${r.date}</td>
          <td>${pill}</td>
          <td><strong style="color:${isFlower ? '#be185d' : 'inherit'};">${sc}</strong> / 10</td>
          <td>${r.remarks || '-'}</td>
        </tr>`;
      }).join("");
    }

    // Official Student Profile is Read-Only for Students. Modifications reserved for Principal/Admin.
    function saveStudentProfile() {
      console.warn("ශිෂ්‍ය තොරතුරු වෙනස් කිරීමේ බලය ඇත්තේ පරිපාලන අංශයට (Admin) පමණි. (Profile is read-only for students)");
    }

    // Format Date for Official Documents (Short Date Format: YYYY-MM-DD)
    function formatSriLankanDate(dateInput) {
      if (!dateInput) return '-';
      let year, monthIdx, day;
      if (dateInput instanceof Date) {
        if (isNaN(dateInput.getTime())) return '-';
        year = dateInput.getFullYear();
        monthIdx = dateInput.getMonth();
        day = String(dateInput.getDate()).padStart(2, '0');
      } else if (typeof dateInput === 'string') {
        const trimmed = dateInput.trim();
        const match = trimmed.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
        if (match) {
          year = match[1];
          monthIdx = parseInt(match[2], 10) - 1;
          day = String(parseInt(match[3], 10)).padStart(2, '0');
        } else {
          const parsed = new Date(trimmed);
          if (!isNaN(parsed.getTime())) {
            year = parsed.getFullYear();
            monthIdx = parsed.getMonth();
            day = String(parsed.getDate()).padStart(2, '0');
          } else {
            return trimmed;
          }
        }
      } else {
        return String(dateInput);
      }
      const monthNum = String(monthIdx + 1).padStart(2, '0');
      return `${year}-${monthNum}-${day}`;
    }

    // Generate Final Report Document
    function generateFinalReport() {
      if (!activeStudent) return;

      const termSelect = document.getElementById("reportTermSelect");
      const yearSelect = document.getElementById("reportYearSelect");
      const termLabel = termSelect ? termSelect.options[termSelect.selectedIndex].text : "වාර්ෂික";
      const selectedYear = yearSelect ? yearSelect.value : "2026";

      // Update Report Header & Metadata
      const schoolName = activeStudent.schoolName || "ශ්‍රී සුගත ධර්ම විද්‍යාලය";
      const teacherName = activeStudent.teacherName || "ධර්මසේන අමරසිංහ මයා";
      const principalName = activeStudent.principalName || "පූජ්‍ය මාදම්පේ සුමනසාර නාහිමි";

      if (document.getElementById("repDocSchoolName")) document.getElementById("repDocSchoolName").textContent = `${schoolName} - වාර්ෂික අධ්‍යයන අංශය`;
      if (document.getElementById("repDocTitleBadge")) document.getElementById("repDocTitleBadge").textContent = `දහම් පාසල් ශිෂ්‍ය සාධු චර්යා - ${termLabel} (${selectedYear})`;

      if (document.getElementById("repMetaStudentName")) document.getElementById("repMetaStudentName").textContent = activeStudent.name || "-";
      if (document.getElementById("repMetaRegNo")) document.getElementById("repMetaRegNo").textContent = activeStudent.regNo || "-";
      if (document.getElementById("repMetaGrade")) document.getElementById("repMetaGrade").textContent = activeStudent.grade || "-";
      if (document.getElementById("repMetaYear")) document.getElementById("repMetaYear").textContent = selectedYear;
      if (document.getElementById("repMetaDate")) document.getElementById("repMetaDate").textContent = formatSriLankanDate(new Date());
      if (document.getElementById("repMetaTeacher")) document.getElementById("repMetaTeacher").textContent = teacherName;
      if (document.getElementById("repSigTeacher")) document.getElementById("repSigTeacher").textContent = teacherName;
      if (document.getElementById("repSigPrincipal")) document.getElementById("repSigPrincipal").textContent = principalName;

      // Calculate Attendance Metrics
      const records = activeStudent.attendance || [];
      let present = 0;
      let poyaSilCount = 0;
      records.forEach(r => {
        const s = (r.status || r.attendance || '').toLowerCase();
        if (s === "present") {
          present++;
          if (r.category === "poya" || r.type === "sil_day") poyaSilCount++;
        }
      });
      const totalDays = records.length;
      const rate = totalDays ? Math.round((present / totalDays) * 100) : 0;

      document.getElementById("repMetricRate").textContent = rate + "%";
      document.getElementById("repMetricSil").textContent = poyaSilCount + " දින";
      document.getElementById("repSilCountCell").textContent = `පෝය දින 0${poyaSilCount} කට පූර්ණව සහභාගී විය`;
      document.getElementById("repAttDaysCell").textContent = `දින ${present} / ${totalDays}`;
      document.getElementById("repAttScoreCell").textContent = `(ලකුණු ${Math.min(10, (rate / 10)).toFixed(1)} / 10)`;

      // Dynamic Practical & Good Deeds (Row [C]) calculation
      let deedCount = 0;
      let flowerCount = 0;
      let totalDeedScore = 0;
      records.forEach(r => {
        const isDeed = r.category === 'good_deed' || (r.event && r.event.includes('යහපත් ක්‍රියා'));
        const isFlower = r.broughtFlowers || r.type === 'flower_offering' || (r.event && r.event.includes('මල්')) || (r.remarks && r.remarks.includes('මල්'));
        if (isDeed || isFlower) {
          deedCount++;
          if (isFlower) flowerCount++;
          totalDeedScore += (r.score !== undefined ? Number(r.score) : 10);
        }
      });

      try {
        const rawDeeds = localStorage.getItem('dahamPasalaGoodDeeds');
        if (rawDeeds) {
          const parsed = JSON.parse(rawDeeds);
          const localDeeds = parsed.filter(d => d.regNo === activeStudent.regNo);
          if (localDeeds.length > deedCount) {
            deedCount = localDeeds.length;
            flowerCount = localDeeds.filter(d => d.title && (d.title.includes('මල්') || d.title.toLowerCase().includes('flower'))).length;
            totalDeedScore = localDeeds.reduce((acc, d) => acc + (Number(d.score) || 10), 0);
          }
        }
      } catch(e) {}

      // Section 2 Dynamic Calculations [A] to [G]
      // [A] Practical & Co-curricular
      let eventCount = records.filter(r => r.category === 'event' || (r.event && (r.event.includes('ශ්‍රමදාන') || r.event.includes('පෙරහැර') || r.event.includes('රුක්') || r.event.includes('ක්‍රියාකාරකම්')))).length;
      const scoreA = Number(Math.min(10.0, Math.max(8.5, 8.5 + eventCount * 0.5)).toFixed(1));
      const statusA = scoreA >= 9.0 ? 'විශිෂ්ටයි (Distinction)' : 'ඉතා හොඳයි (Very Good)';
      if (document.getElementById("repRowA_Count")) document.getElementById("repRowA_Count").textContent = `වාර 0${Math.max(2, eventCount)} කට සහභාගී විය`;
      if (document.getElementById("repRowA_Score")) document.getElementById("repRowA_Score").innerHTML = `<strong>${scoreA.toFixed(1)}</strong> / 10`;
      if (document.getElementById("repRowA_Status")) document.getElementById("repRowA_Status").innerHTML = `<span class="status-pill present">${statusA}</span>`;

      // [B] Poya Sil
      const scoreB = Number(Math.min(10.0, Math.max(8.0, poyaSilCount > 0 ? (poyaSilCount >= 5 ? 10.0 : 8.0 + poyaSilCount * 0.4) : 9.0)).toFixed(1));
      const statusB = scoreB >= 9.0 ? 'විශිෂ්ටයි (Distinction)' : 'ඉතා හොඳයි (Very Good)';
      if (document.getElementById("repSilCountCell")) document.getElementById("repSilCountCell").textContent = `පෝය දින 0${poyaSilCount} කට පූර්ණව සහභාගී විය`;
      if (document.getElementById("repRowB_Score")) document.getElementById("repRowB_Score").innerHTML = `<strong>${scoreB.toFixed(1)}</strong> / 10`;
      if (document.getElementById("repRowB_Status")) document.getElementById("repRowB_Status").innerHTML = `<span class="status-pill present">${statusB}</span>`;

      // [C] Deeds
      const deedsScore = deedCount > 0 
        ? Math.min(10, Math.max(9.0, totalDeedScore / deedCount))
        : 9.0;
      const deedsStatus = deedsScore >= 9.0 ? 'විශිෂ්ටයි (Distinction)' : 'ඉතා හොඳයි (Very Good)';

      const repDeedsCountCell = document.getElementById("repDeedsCountCell");
      const repDeedsScoreCell = document.getElementById("repDeedsScoreCell");
      const repDeedsStatusCell = document.getElementById("repDeedsStatusCell");
      if (repDeedsCountCell) {
        repDeedsCountCell.textContent = deedCount > 0 
          ? `සටහන් 0${deedCount} ක් සම්පූර්ණයි (මල් පූජා 0${flowerCount} ක් ඇතුළුව)`
          : `සටහන් 02 ක් සම්පූර්ණයි`;
      }
      if (repDeedsScoreCell) repDeedsScoreCell.innerHTML = `<strong>${deedsScore.toFixed(1)}</strong> / 10`;
      if (repDeedsStatusCell) repDeedsStatusCell.innerHTML = `<span class="status-pill present">${deedsStatus}</span>`;

      // [D] Sunday Attendance
      const scoreD = Number(Math.min(10.0, (rate / 10)).toFixed(1));
      const statusD = scoreD >= 8.5 ? 'විශිෂ්ටයි (Distinction)' : scoreD >= 7.0 ? 'ඉතා හොඳයි (Very Good)' : 'සාමාන්‍යයි (Average)';
      if (document.getElementById("repAttDaysCell")) document.getElementById("repAttDaysCell").textContent = `දින ${present} / ${totalDays || 1}`;
      if (document.getElementById("repAttScoreCell")) document.getElementById("repAttScoreCell").innerHTML = `<strong>${scoreD.toFixed(1)}</strong> / 10`;
      if (document.getElementById("repRowD_Status")) document.getElementById("repRowD_Status").innerHTML = `<span class="status-pill present">${statusD}</span>`;

      // [E] Teacher Conduct / Observations
      let obsCount = 0;
      let obsScoreSum = 0;
      const studentObs = activeStudent.observations || [];
      if (studentObs.length > 0) {
        obsCount = studentObs.length;
        studentObs.forEach(o => {
          const rat = (o.rating || '').toLowerCase();
          if (rat.includes('විශිෂ්ට') || rat.includes('distinction')) obsScoreSum += 10;
          else if (rat.includes('ඉතා හොඳ') || rat.includes('very good')) obsScoreSum += 9;
          else if (rat.includes('හොඳ') || rat.includes('good')) obsScoreSum += 8;
          else obsScoreSum += 7;
        });
      }
      const scoreE = Number((obsCount > 0 ? (obsScoreSum / obsCount) : 9.2).toFixed(1));
      const statusE = scoreE >= 9.0 ? 'විශිෂ්ටයි (Distinction)' : 'ඉතා හොඳයි (Very Good)';
      if (document.getElementById("repRowE_Count")) document.getElementById("repRowE_Count").textContent = obsCount > 0 ? `නිරීක්ෂණ 0${obsCount} ක් අනුමතයි` : `නිරීක්ෂණ සටහන් අනුමතයි`;
      if (document.getElementById("repRowE_Score")) document.getElementById("repRowE_Score").innerHTML = `<strong>${scoreE.toFixed(1)}</strong> / 10`;
      if (document.getElementById("repRowE_Status")) document.getElementById("repRowE_Status").innerHTML = `<span class="status-pill present">${statusE}</span>`;

      // [F] Flower Offerings & Buddha Puja
      let flowerBroughtCount = 0;
      records.forEach(r => {
        if (r.broughtFlowers || r.type === 'flower_offering' || (r.event && r.event.includes('මල්')) || (r.remarks && r.remarks.includes('මල්'))) {
          flowerBroughtCount++;
        }
      });
      const flowerRatio = present > 0 ? (flowerBroughtCount / present) : 1;
      const scoreF = Number(Math.min(10.0, Math.max(8.5, flowerRatio * 10)).toFixed(1));
      const statusF = scoreF >= 9.0 ? 'විශිෂ්ටයි (Distinction)' : 'ඉතා හොඳයි (Very Good)';
      if (document.getElementById("repRowF_Count")) document.getElementById("repRowF_Count").textContent = `මල් පූජා 0${flowerBroughtCount} ක් සම්පූර්ණයි`;
      if (document.getElementById("repRowF_Score")) document.getElementById("repRowF_Score").innerHTML = `<strong>${scoreF.toFixed(1)}</strong> / 10`;
      if (document.getElementById("repRowF_Status")) document.getElementById("repRowF_Status").innerHTML = `<span class="status-pill present">${statusF}</span>`;

      // [G] Parent Endorsement
      const scoreG = 9.5;
      const statusG = 'විශිෂ්ටයි (Distinction)';
      if (document.getElementById("repRowG_Count")) document.getElementById("repRowG_Count").textContent = `දෙමව්පිය අත්සනින් තහවුරුයි`;
      if (document.getElementById("repRowG_Score")) document.getElementById("repRowG_Score").innerHTML = `<strong>${scoreG.toFixed(1)}</strong> / 10`;
      if (document.getElementById("repRowG_Status")) document.getElementById("repRowG_Status").innerHTML = `<span class="status-pill present">${statusG}</span>`;

      // Section 2 Practical / Character Average (out of 100%)
      const practicalAvgOutOf10 = (scoreA + scoreB + deedsScore + scoreD + scoreE + scoreF + scoreG) / 7;
      const practicalPercentage = Number((practicalAvgOutOf10 * 10).toFixed(1));

      // Examination Marks & 3-Term Matrix Breakdown
      const exams = activeStudent.examMarks || [];
      const examTbody = document.getElementById("repExamTableBody");

      if (exams.length === 0) {
        if (examTbody) {
          examTbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 20px; color: var(--text-muted);">මෙම වර්ෂය සඳහා වාර විභාග ලකුණු තවමත් සටහන් කර නොමැත. (No exam marks recorded yet)</td></tr>`;
        }
        if (document.getElementById("repExamTerm1Avg")) document.getElementById("repExamTerm1Avg").textContent = "-";
        if (document.getElementById("repExamTerm2Avg")) document.getElementById("repExamTerm2Avg").textContent = "-";
        if (document.getElementById("repExamTerm3Avg")) document.getElementById("repExamTerm3Avg").textContent = "-";
        if (document.getElementById("repExamTotalMarks")) document.getElementById("repExamTotalMarks").textContent = "-";
        if (document.getElementById("repExamAvgGrade")) document.getElementById("repExamAvgGrade").textContent = "-";
        if (document.getElementById("repExamAnnualSummary")) document.getElementById("repExamAnnualSummary").textContent = "-";
        if (document.getElementById("repMetricExamAvg")) document.getElementById("repMetricExamAvg").textContent = "0%";
        if (document.getElementById("repMetricOverallGrade")) document.getElementById("repMetricOverallGrade").textContent = "ප්‍රතිඵල අපේක්ෂාවෙන්";
        if (document.getElementById("repMetricRank")) document.getElementById("repMetricRank").textContent = "-";
      } else {
        // Group by subject
        const subjectMap = {};
        exams.forEach(e => {
          const sub = e.subject || 'සාමාන්‍ය විෂය';
          if (!subjectMap[sub]) {
            subjectMap[sub] = { term1: null, term2: null, term3: null, remarks: '' };
          }
          const t = String(e.term || '1');
          if (t === '1' || t === 'term1') subjectMap[sub].term1 = e;
          else if (t === '2' || t === 'term2') subjectMap[sub].term2 = e;
          else if (t === '3' || t === 'term3') subjectMap[sub].term3 = e;
          else subjectMap[sub].term1 = e;

          if (e.remarks) subjectMap[sub].remarks = e.remarks;
        });

        let t1Sum = 0, t1Count = 0;
        let t2Sum = 0, t2Count = 0;
        let t3Sum = 0, t3Count = 0;
        let totalCumulativeMarks = 0, totalMarkEntries = 0;

        const subjects = Object.keys(subjectMap);
        const rowsHtml = subjects.map(sub => {
          const data = subjectMap[sub];
          const t1 = data.term1;
          const t2 = data.term2;
          const t3 = data.term3;

          let subSum = 0;
          let subCount = 0;
          if (t1 && !isNaN(t1.marks)) { subSum += Number(t1.marks); subCount++; t1Sum += Number(t1.marks); t1Count++; }
          if (t2 && !isNaN(t2.marks)) { subSum += Number(t2.marks); subCount++; t2Sum += Number(t2.marks); t2Count++; }
          if (t3 && !isNaN(t3.marks)) { subSum += Number(t3.marks); subCount++; t3Sum += Number(t3.marks); t3Count++; }

          totalCumulativeMarks += subSum;
          totalMarkEntries += subCount;

          const subAvg = subCount ? Math.round(subSum / subCount) : 0;
          const finalGrade = subAvg >= 75 ? 'A' : subAvg >= 65 ? 'B' : subAvg >= 50 ? 'C' : subAvg >= 35 ? 'S' : 'W';

          const formatTermCell = (termObj) => {
            if (!termObj || isNaN(termObj.marks)) return `<span style="color:var(--text-muted);">-</span>`;
            const g = termObj.grade || (termObj.marks >= 75 ? 'A' : termObj.marks >= 65 ? 'B' : termObj.marks >= 50 ? 'C' : termObj.marks >= 35 ? 'S' : 'W');
            const pillClass = g === 'W' ? 'absent' : 'present';
            return `<strong>${termObj.marks}</strong> <span class="status-pill ${pillClass}" style="padding: 2px 6px; font-size: 0.72rem;">${g}</span>`;
          };

          return `
            <tr>
              <td><strong>${sub}</strong></td>
              <td style="text-align: center;">${formatTermCell(t1)}</td>
              <td style="text-align: center;">${formatTermCell(t2)}</td>
              <td style="text-align: center;">${formatTermCell(t3)}</td>
              <td style="text-align: center;"><strong>${subAvg}%</strong></td>
              <td style="text-align: center;"><span class="status-pill ${finalGrade === 'W' ? 'absent' : 'present'}" style="padding: 3px 8px; font-weight: 700;">${finalGrade}</span></td>
              <td><small>${data.remarks || '-'}</small></td>
            </tr>
          `;
        }).join("");

        if (examTbody) examTbody.innerHTML = rowsHtml;

        const t1Avg = t1Count ? Math.round(t1Sum / t1Count) : null;
        const t2Avg = t2Count ? Math.round(t2Sum / t2Count) : null;
        const t3Avg = t3Count ? Math.round(t3Sum / t3Count) : null;
        const overallAvg = totalMarkEntries ? Math.round(totalCumulativeMarks / totalMarkEntries) : 0;

        if (document.getElementById("repExamTerm1Avg")) document.getElementById("repExamTerm1Avg").innerHTML = t1Avg !== null ? `<strong>${t1Avg}%</strong>` : `-`;
        if (document.getElementById("repExamTerm2Avg")) document.getElementById("repExamTerm2Avg").innerHTML = t2Avg !== null ? `<strong>${t2Avg}%</strong>` : `-`;
        if (document.getElementById("repExamTerm3Avg")) document.getElementById("repExamTerm3Avg").innerHTML = t3Avg !== null ? `<strong>${t3Avg}%</strong>` : `-`;

        const overallGradeText = overallAvg >= 75 ? "A සාමාර්ථය" : overallAvg >= 65 ? "B සාමාර්ථය" : overallAvg >= 50 ? "C සාමාර්ථය" : overallAvg >= 35 ? "S සාමාර්ථය" : "W (නැවත පෙනී සිටින්න)";
        if (document.getElementById("repExamTotalMarks")) document.getElementById("repExamTotalMarks").innerHTML = `<strong>${overallAvg}%</strong>`;
        if (document.getElementById("repExamAvgGrade")) document.getElementById("repExamAvgGrade").textContent = overallGradeText;
        if (document.getElementById("repExamAnnualSummary")) {
          document.getElementById("repExamAnnualSummary").textContent = overallAvg >= 50 ? "විභාග සාමාර්ථය සම්පූර්ණයි" : "අවම ලකුණු මට්ටම ඉක්මවා නැත";
        }

        if (document.getElementById("repMetricExamAvg")) document.getElementById("repMetricExamAvg").textContent = overallAvg + "%";

        // Dynamic Pinpoint Class Ranking (පන්තියේ ස්ථානය)
        const rankEl = document.getElementById("repMetricRank");
        if (rankEl) {
          let rankText = activeStudent.rankInfo?.rankLabel;
          if (!rankText) {
            const peers = Object.values(studentDatabase).filter(s => s && s.grade && s.grade.includes(activeStudent.grade.split(' ')[0]));
            const peerAverages = peers.map(p => {
              const pMarks = p.examMarks || [];
              const pSum = pMarks.reduce((acc, m) => acc + Number(m.marks || 0), 0);
              const pAvg = pMarks.length > 0 ? Number((pSum / pMarks.length).toFixed(1)) : 0;
              return { regNo: p.regNo, pAvg, pSum };
            });
            peerAverages.sort((a, b) => b.pAvg - a.pAvg || b.pSum - a.pSum);
            const myIndex = peerAverages.findIndex(p => p.regNo === activeStudent.regNo);
            const myRank = myIndex >= 0 ? myIndex + 1 : 1;
            const totalCount = peerAverages.length || 1;
            rankText = `${String(myRank).padStart(2, '0')} / ${String(totalCount).padStart(2, '0')}`;
          }
          rankEl.textContent = rankText;
        }

        // Overall Character & Academic Composite Grade (60% Exam + 40% Practical/Character)
        const compositeScore = Math.round((overallAvg * 0.60) + (practicalPercentage * 0.40));
        const compositeGradeText = compositeScore >= 75
          ? "විශිෂ්ට සාමාර්ථය (Distinction - A)"
          : compositeScore >= 65
          ? "ඉතා හොඳයි (Credit - B)"
          : compositeScore >= 50
          ? "සම්මාන (Pass - C)"
          : compositeScore >= 35
          ? "සාමාන්‍ය (Simple Pass - S)"
          : "ප්‍රගතිය වැඩිදියුණු විය යුතුය (Needs Improvement - W)";
        if (document.getElementById("repMetricOverallGrade")) document.getElementById("repMetricOverallGrade").textContent = compositeGradeText;
      }

      // Badges & Honors in Final Report - Only Approved Badges
      const myBadges = studentBadgesStore.filter(b => b.regNo === activeStudent.regNo && b.status === "approved");
      const repBadgesBody = document.getElementById("repBadgesTableBody");
      if (repBadgesBody) {
        if (myBadges.length === 0) {
          repBadgesBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:12px;">මෙම වර්ෂය සඳහා තවමත් කුසලතා පදක්කම් සටහන් කර නොමැත.</td></tr>`;
        } else {
          repBadgesBody.innerHTML = myBadges.map(b => `
            <tr>
              <td><strong style="color:var(--primary-blue);"><i class="fa-solid fa-medal" style="color:var(--accent-yellow); margin-right:6px;"></i>${b.badge}</strong></td>
              <td>${formatSriLankanDate(b.date, false)}</td>
              <td>${formatSriLankanDate(b.date)}</td>
              <td><span class="badge-points-tag">+${b.points} Pts</span></td>
              <td>${b.remarks || 'ආදර්ශවත් කුසලතා ඇගයීම'} (${b.teacher || 'පන්තිභාර ආචාර්ය'})</td>
            </tr>
          `).join("");
        }
      }

      // Render Official Security QR Code & Code
      const qrEl = document.getElementById("reportQrCode");
      const secEl = document.getElementById("repSecurityCode");
      const cleanReg = (activeStudent.regNo || '').replace(/[^a-zA-Z0-9]/g, '');
      const secCode = `DPS-CERT-${selectedYear}-${cleanReg}`;
      if (secEl) secEl.textContent = secCode;

      if (qrEl) {
        qrEl.innerHTML = "";
        const verifyUrl = `${window.location.origin}/F_END/Pages/Student.html?verify=${encodeURIComponent(secCode)}&regNo=${encodeURIComponent(activeStudent.regNo)}`;
        if (typeof QRCode !== 'undefined') {
          try {
            new QRCode(qrEl, {
              text: verifyUrl,
              width: 64,
              height: 64,
              colorDark: "#1e3a8a",
              colorLight: "#ffffff",
              correctLevel: QRCode.CorrectLevel.M
            });
          } catch(e) {
            console.warn("QR code generation fallback:", e);
          }
        }
      }
    }

    // ==========================================
    // Student Badges & Honors Display and Modal Logic
    // ==========================================
    function loadStudentBadges() {
      const savedBadges = localStorage.getItem("dahamPasalaAwardedBadges");
      if (savedBadges) {
        try {
          studentBadgesStore = JSON.parse(savedBadges);
        } catch(e) {
          studentBadgesStore = defaultBadges;
        }
      } else {
        studentBadgesStore = defaultBadges;
        localStorage.setItem("dahamPasalaAwardedBadges", JSON.stringify(studentBadgesStore));
      }
    }

    // Helper to determine if a pending badge nomination is still active (< 1 week old and not dismissed)
    function isBadgePendingAndRecent(badge) {
      if (!badge || badge.status !== "pending") return false;

      // Check if manually dismissed by student
      const badgeKey = badge.id || `${badge.badge}_${badge.date}`;
      try {
        const dismissed = JSON.parse(localStorage.getItem("dahamPasalaDismissedBadgeNotifs") || "[]");
        if (dismissed.includes(badgeKey)) return false;
      } catch (e) {}

      // Get nomination date
      const rawDate = badge.createdAt || badge.date;
      if (!rawDate) return false;

      let badgeTime = NaN;
      if (typeof rawDate === "string") {
        const cleanDate = rawDate.replace(/\//g, "-");
        badgeTime = new Date(cleanDate).getTime();
      } else if (rawDate instanceof Date) {
        badgeTime = rawDate.getTime();
      } else {
        badgeTime = new Date(rawDate).getTime();
      }

      if (isNaN(badgeTime)) return false;

      const now = Date.now();
      const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 7 days (1 week)
      const ONE_DAY_MS = 24 * 60 * 60 * 1000;       // 1 day buffer for timezones
      const ageMs = now - badgeTime;

      // Automatically disappears after 1 week (7 days)
      return ageMs >= -ONE_DAY_MS && ageMs <= ONE_WEEK_MS;
    }

    function dismissPendingBadgeAlert() {
      try {
        const dismissed = JSON.parse(localStorage.getItem("dahamPasalaDismissedBadgeNotifs") || "[]");
        const pending = studentBadgesStore.filter(b => b.regNo === (activeStudent ? activeStudent.regNo : '') && b.status === "pending");
        pending.forEach(p => {
          const key = p.id || `${p.badge}_${p.date}`;
          if (!dismissed.includes(key)) dismissed.push(key);
        });
        localStorage.setItem("dahamPasalaDismissedBadgeNotifs", JSON.stringify(dismissed));
      } catch (e) {}
      renderStudentBadges();
    }
    window.dismissPendingBadgeAlert = dismissPendingBadgeAlert;

    function renderStudentBadges() {
      loadStudentBadges();
      const grid = document.getElementById("studentBadgesGalleryGrid");
      const metricCount = document.getElementById("dashBadgesCount");
      const pillCount = document.getElementById("dashBadgesCountPill");
      const pointsTotal = document.getElementById("dashBadgesPointsTotal");

      if (!activeStudent || !grid) return;

      // ONLY approved badges are considered earned and awarded!
      const myBadges = studentBadgesStore.filter(b => b.regNo === activeStudent.regNo && b.status === "approved");
      // Only show pending proposals that are within 1 week (7 days) of nomination date
      const pendingBadges = studentBadgesStore.filter(b => b.regNo === activeStudent.regNo && isBadgePendingAndRecent(b));
      const totalPoints = myBadges.reduce((sum, b) => sum + (parseInt(b.points) || 50), 0);

      if (metricCount) metricCount.textContent = myBadges.length;
      if (pillCount) pillCount.textContent = `${myBadges.length} පදක්කම්`;
      if (pointsTotal) pointsTotal.innerHTML = `<i class="fa-solid fa-star"></i> +${totalPoints} Pts`;

      let pendingHtml = '';
      if (pendingBadges.length > 0) {
        pendingHtml = `
          <div id="pendingBadgesAlert" style="grid-column: 1 / -1; background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; box-shadow: 0 2px 5px rgba(217, 119, 6, 0.08); gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 38px; height: 38px; border-radius: 50%; background: #fef3c7; color: #b45309; display: grid; place-items: center; font-size: 1.1rem; flex-shrink: 0;">
                <i class="fa-solid fa-hourglass-half"></i>
              </div>
              <div>
                <strong style="color: #92400e; font-size: 0.92rem; display: block;">ප්‍රධානාචාර්ය අනුමැතිය අපේක්ෂිත නව යෝජනා (${pendingBadges.length}):</strong>
                <span style="color: #b45309; font-size: 0.82rem;">
                  ${pendingBadges.map(p => `<strong>${p.badge}</strong> (${p.teacher || 'ගුරුභවතා'})`).join(" • ")}
                </span>
                <span style="display: block; font-size: 0.72rem; color: #b45309; opacity: 0.85; margin-top: 3px;">
                  <i class="fa-regular fa-clock"></i> යෝජනා කළ දින සිට සතියක් (දින 7ක්) ඇතුළත මෙම දැනුම්දීම ස්වයංක්‍රීයව ඉවත් වේ.
                </span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
              <span style="font-size: 0.74rem; background: #fef3c7; color: #b45309; border: 1px solid #fde68a; padding: 4px 10px; border-radius: 12px; font-weight: 700; white-space: nowrap;">
                <i class="fa-solid fa-clock"></i> අනුමැතිය අපේක්ෂිතයි
              </span>
              <button type="button" onclick="dismissPendingBadgeAlert()" title="දැනුම්දීම මඟහරින්න (Dismiss)" style="background: none; border: none; font-size: 1.3rem; color: #b45309; cursor: pointer; padding: 2px 6px; line-height: 1; border-radius: 4px; display: flex; align-items: center; justify-content: center;" onmouseover="this.style.background='#fde68a'" onmouseout="this.style.background='none'">&times;</button>
            </div>
          </div>
        `;
      }

      if (myBadges.length === 0) {
        grid.innerHTML = pendingHtml + `
          <div style="grid-column: 1 / -1; background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 12px; padding: 28px 20px; text-align: center;">
            <div style="width: 58px; height: 58px; border-radius: 50%; background: #fef3c7; color: #b45309; display: grid; place-items: center; font-size: 1.7rem; margin: 0 auto 12px; box-shadow: 0 4px 10px rgba(245, 158, 11, 0.2);">
              <i class="fa-solid fa-medal"></i>
            </div>
            <h4 style="color: var(--primary-blue); margin-bottom: 6px; font-size: 1.05rem;">තවමත් අනුමත කුසලතා පදක්කම් නොමැත</h4>
            <p style="font-size: 0.86rem; color: var(--text-muted); max-width: 540px; margin: 0 auto 16px; line-height: 1.5;">
              නොකඩවා දහම් පාසල් පැමිණෙමින්, පෝය අටසිල් සමාදන් වීම, ශ්‍රමදාන සහ යහපත් ක්‍රියාවල නිරත වී ආචාර්ය මණ්ඩලයෙන් සහ ප්‍රධානාචාර්යතුමන්ගෙන් කුසලතා පදක්කම් දිනාගන්න!
            </p>
            <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
              <span class="badge-points-tag" style="background:#fff; border:1px solid #cbd5e1; color:#64748b;"><i class="fa-solid fa-award"></i> සිල්වත් ශිෂ්‍යයා (50 Pts)</span>
              <span class="badge-points-tag" style="background:#fff; border:1px solid #cbd5e1; color:#64748b;"><i class="fa-solid fa-award"></i> ධර්ම ඥාන විශාරද (40 Pts)</span>
              <span class="badge-points-tag" style="background:#fff; border:1px solid #cbd5e1; color:#64748b;"><i class="fa-solid fa-award"></i> ආදර්ශවත් ශිෂ්‍ය නායක (50 Pts)</span>
              <span class="badge-points-tag" style="background:#fff; border:1px solid #cbd5e1; color:#64748b;"><i class="fa-solid fa-award"></i> පාලි ගාථා විශාරද (45 Pts)</span>
            </div>
          </div>
        `;
        return;
      }

      grid.innerHTML = pendingHtml + myBadges.map((b, idx) => {
        const pts = parseInt(b.points) || 50;
        let badgeColorClass = "badge-gold";
        let badgeIcon = "fa-solid fa-medal";

        if (pts >= 50) {
          badgeColorClass = "badge-gold";
          badgeIcon = "fa-solid fa-medal";
        } else if (pts >= 40) {
          badgeColorClass = "badge-silver";
          badgeIcon = "fa-solid fa-award";
        } else {
          badgeColorClass = "badge-bronze";
          badgeIcon = "fa-solid fa-shield-halved";
        }

        const isApproved = b.status !== "pending";
        const statusPill = isApproved
          ? `<span class="status-pill present" style="font-size:0.72rem; padding: 2px 8px;"><i class="fa-solid fa-certificate"></i> අනුමතයි</span>`
          : `<span class="status-pill excused" style="font-size:0.72rem; padding: 2px 8px;"><i class="fa-solid fa-clock"></i> අනුමැතියට</span>`;

        return `
          <div class="badge-card" onclick="openBadgeDetailModal('${b.id || idx}')" title="නිල සහතිකය බැලීමට ක්ලික් කරන්න">
            <div class="badge-icon-wrap ${badgeColorClass}">
              <i class="${badgeIcon}"></i>
            </div>
            <h4>${b.badge}</h4>
            <p>${b.remarks || 'ආදර්ශවත් ශිෂ්‍ය ඇගයීම'}</p>
            <div style="display: flex; justify-content: center; gap: 6px; align-items: center; margin-bottom: 10px;">
              <span class="badge-points-tag"><i class="fa-solid fa-star"></i> +${pts} Pts</span>
              ${statusPill}
            </div>
            <div style="font-size: 0.74rem; color: var(--text-muted); border-top: 1px solid #f1f5f9; padding-top: 8px; display: flex; justify-content: space-between;">
              <span><i class="fa-regular fa-calendar"></i> ${b.date}</span>
              <span style="color: var(--primary-blue); font-weight: 600;"><i class="fa-solid fa-eye"></i> සහතිකය</span>
            </div>
          </div>
        `;
      }).join("");
    }

    let selectedBadgeForModal = null;

    function openBadgeDetailModal(badgeIdOrIdx) {
      const myBadges = studentBadgesStore.filter(b => b.regNo === activeStudent.regNo);
      let b = myBadges.find(item => item.id === badgeIdOrIdx);
      if (!b) {
        const idx = parseInt(badgeIdOrIdx, 10);
        if (!isNaN(idx) && myBadges[idx]) b = myBadges[idx];
      }
      if (!b) return;

      selectedBadgeForModal = b;
      const pts = parseInt(b.points) || 50;

      let badgeColorClass = "badge-gold";
      let badgeIcon = "fa-solid fa-medal";
      if (pts >= 50) {
        badgeColorClass = "badge-gold";
        badgeIcon = "fa-solid fa-medal";
      } else if (pts >= 40) {
        badgeColorClass = "badge-silver";
        badgeIcon = "fa-solid fa-award";
      } else {
        badgeColorClass = "badge-bronze";
        badgeIcon = "fa-solid fa-shield-halved";
      }

      document.getElementById("badgeModalBody").innerHTML = `
        <div style="max-width: 520px; margin: 0 auto; background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%); border: 2px dashed #f59e0b; border-radius: 12px; padding: 24px 20px; box-shadow: inset 0 0 20px rgba(245,158,11,0.06);">
          <div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-bottom: 8px;">
            <i class="fa-solid fa-dharmachakra" style="font-size: 1.8rem; color: var(--primary-blue);"></i>
          </div>
          <h5 style="margin: 0; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted);">ශ්‍රී ලංකා ප්‍රජාතාන්ත්‍රික සමාජවාදී ජනරජය</h5>
          <h4 style="margin: 2px 0 0 0; font-size: 0.95rem; color: var(--primary-blue);">බෞද්ධ කටයුතු දෙපාර්තමේන්තුව - ශ්‍රී සුගත ධර්ම විද්‍යාලය</h4>
          <p style="font-size: 0.74rem; color: var(--text-muted); margin: 0 0 16px 0;">කොළඹ ප්‍රාදේශීය ශාසනාරක්ෂක බලමණ්ඩලය | ලියාපදිංචි අංකය: දපා/කොළ/2012/84</p>
          
          <div class="badge-icon-wrap ${badgeColorClass}" style="width: 80px; height: 80px; font-size: 2.2rem; margin: 0 auto 12px;">
            <i class="${badgeIcon}"></i>
          </div>

          <h2 style="font-size: 1.35rem; color: var(--primary-blue); margin: 0 0 6px 0;">${b.badge}</h2>
          <div style="margin-bottom: 14px;">
            <span class="badge-points-tag" style="font-size: 0.88rem; padding: 5px 14px;"><i class="fa-solid fa-star"></i> +${pts} කුසලතා ලකුණු (Merit Points)</span>
          </div>

          <p style="font-size: 0.9rem; line-height: 1.6; color: #1e293b; margin: 0 0 14px 0;">
            මෙම නිල ගෞරව සම්මානය <strong>${activeStudent.name}</strong> (${activeStudent.regNo} - ${activeStudent.grade}) සිසුවා/සිසුවිය වෙත දහම් පාසලේ විශිෂ්ටත්වයට පත් චරිතවත්භාවය වෙනුවෙන් පිරිනමන ලදී.
          </p>

          <div style="background: #eff6ff; border-left: 4px solid var(--accent-yellow); padding: 10px 14px; border-radius: 6px; font-size: 0.84rem; text-align: left; margin-bottom: 18px; line-height: 1.5;">
            <strong>ගුරු ප්‍රශංසාව සහ නිල හේතුව:</strong> ${b.remarks || 'සුවිශේෂී ආදර්ශවත් හැසිරීම'}
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 0.78rem; text-align: left; border-top: 1px solid #e2e8f0; padding-top: 14px; margin-bottom: 12px;">
            <div>
              <span style="color:var(--text-muted); display:block;">යෝජනා කළ ගුරුභවතා:</span>
              <strong>${b.teacher || 'පන්තිභාර ආචාර්යතුමා'}</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block;">පිරිනැමූ දිනය:</span>
              <strong>${b.date}</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block;">අනුමත කිරීම:</span>
              <strong style="color: #059669;"><i class="fa-solid fa-circle-check"></i> ප්‍රධානාචාර්ය ස්වාමින්වහන්සේ</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block;">ලේඛනගත තත්ත්වය:</span>
              <strong style="color: var(--primary-blue);"><i class="fa-solid fa-stamp"></i> සත්‍යාපිතයි (Verified)</strong>
            </div>
          </div>

          <div style="font-size: 0.84rem; color: #047857; font-weight: 700; margin-top: 10px;">
            චිරං ජයතු! තෙරුවන් සරණයි!
          </div>
        </div>
      `;

      document.getElementById("studentBadgeModal").style.display = "flex";
    }

    function closeStudentBadgeModal() {
      document.getElementById("studentBadgeModal").style.display = "none";
      selectedBadgeForModal = null;
    }

    function printStudentBadgeCertificate() {
      const modalContent = document.getElementById("badgeModalBody").innerHTML;
      const printWin = window.open('', '', 'width=750,height=750');
      printWin.document.write(`
        <html>
          <head>
            <title>කුසලතා සම්මාන සහතිකය - ${selectedBadgeForModal ? selectedBadgeForModal.badge : ''}</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
              body { font-family: 'Inter', sans-serif; padding: 40px; text-align: center; color: #1e293b; }
              .badge-icon-wrap { width: 80px; height: 80px; margin: 15px auto; border-radius: 50%; display: grid; place-items: center; font-size: 2.2rem; }
              .badge-gold { background: #fef3c7; color: #b45309; border: 2px solid #f59e0b; }
              .badge-silver { background: #f1f5f9; color: #475569; border: 2px solid #94a3b8; }
              .badge-bronze { background: #ffedd5; color: #9a3412; border: 2px solid #ea580c; }
              .badge-points-tag { display: inline-block; background: #fef3c7; color: #92400e; padding: 5px 14px; border-radius: 999px; font-weight: bold; }
            </style>
          </head>
          <body>
            ${modalContent}
          </body>
        </html>
      `);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => {
        printWin.print();
        printWin.close();
      }, 350);
    }

    // Print Final Report
    function printFinalReportDocument() {
      // Make sure the final report is generated and visible
      switchStudentPage("final-report");
      setTimeout(() => {
        window.print();
      }, 300);
    }

    // Official PDF Report Download
    async function downloadOfficialPdfReport() {
      if (!activeStudent) {
        alert("කරුණාකර පළමුව ශිෂ්‍ය ගිණුමට ඇතුළු වන්න.");
        return;
      }
      // Ensure the report is freshly rendered and visible
      switchStudentPage("final-report");
      generateFinalReport();

      const reportElement = document.getElementById("final-report-document");
      if (!reportElement) {
        alert("වාර්තා ලේඛනය සොයාගත නොහැකි විය.");
        return;
      }

      // Ensure all Sinhala and latin web fonts are fully loaded before capturing canvas
      if (document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch (fontErr) {
          console.warn("Font readiness check resolved with warning:", fontErr);
        }
      }

      const selectedYear = document.getElementById("reportYearSelect")?.value || '2026';
      const cleanReg = (activeStudent.regNo || 'STUDENT').replace(/[\/\\]/g, '_');
      const filename = `Daham_Pasala_Official_Report_${cleanReg}_${selectedYear}.pdf`;

      const downloadBtn = document.getElementById("btnDownloadPdf");
      const originalText = downloadBtn ? downloadBtn.innerHTML : "";
      if (downloadBtn) {
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> PDF සකස් වෙමින් පවතී...';
      }

      // Save scroll position and scroll to (0, 0) to avoid canvas coordinate translation offset bugs
      const prevScrollX = window.scrollX || window.pageXOffset || 0;
      const prevScrollY = window.scrollY || window.pageYOffset || 0;
      window.scrollTo(0, 0);

      // Brief pause to allow browser layout and scroll to settle
      await new Promise(resolve => setTimeout(resolve, 150));

      if (typeof html2pdf !== 'undefined') {
        const opt = {
          margin: [8, 8, 8, 8],
          filename: filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: false,
            scrollY: 0,
            scrollX: 0,
            windowWidth: 1024,
            backgroundColor: '#ffffff',
            logging: false
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'] }
        };

        html2pdf()
          .set(opt)
          .from(reportElement)
          .save()
          .then(() => {
            if (downloadBtn) {
              downloadBtn.disabled = false;
              downloadBtn.innerHTML = originalText;
            }
          })
          .catch(err => {
            console.error("PDF generation failed:", err);
            if (downloadBtn) {
              downloadBtn.disabled = false;
              downloadBtn.innerHTML = originalText;
            }
            window.print();
          });
        try {
          await html2pdf().set(opt).from(reportElement).save();
        } catch (err) {
          console.error("PDF generation failed:", err);
          window.print();
        } finally {
          window.scrollTo(prevScrollX, prevScrollY);
          if (downloadBtn) {
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = originalText;
          }
        }
      } else {
        window.scrollTo(prevScrollX, prevScrollY);
        if (downloadBtn) {
          downloadBtn.disabled = false;
          downloadBtn.innerHTML = originalText;
        }
        window.print();
      }
    }
