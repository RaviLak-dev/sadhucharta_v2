/**
 * Shared initial seed data for Daham Pasala Sadhu Charya.
 * Zero external dependencies so Firebase / serverless cold starts stay fast.
 */
const SEED_DATA = {
  students: [
    {
      pin: "1234",
      name: "සමන් කුමාර පෙරේරා",
      englishName: "Saman Kumara Perera",
      grade: "10 ශ්‍රේණිය (Grade 10)",
      regNo: "DPS/2026/104",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      guardianName: "කේ. එම්. පෙරේරා මයා",
      contact: "077 345 6789",
      address: "නො. 42, පන්සල පාර, කොළඹ 05",
      attendance: [
        { date: "2026-05-03", status: "present", type: "dhamma_school" },
        { date: "2026-05-10", status: "present", type: "dhamma_school" },
        { date: "2026-05-17", status: "present", type: "dhamma_school" },
        { date: "2026-05-24", status: "present", type: "sil_day" }
      ],
      examMarks: [
        { subject: "බුද්ධ ධර්මය", marks: 92, grade: "A" },
        { subject: "බෞද්ධ සංස්කෘතිය", marks: 88, grade: "A" },
        { subject: "පාලි භාෂාව", marks: 84, grade: "A" }
      ],
      recommendation: "මෙම ශිෂ්‍යයා වර්ෂය තුළ දහම් පාසලේ නීති රීති වලට ගරු කරමින්, ගුරු දෙගුරුන්ට කීකරුව ආදර්ශවත් යහපත් චරිතයකින් යුතුව අධ්‍යයන කටයුතුවල නිරත විය."
    },
    {
      pin: "1234",
      name: "කසුන් කල්හාර දිසානායක",
      englishName: "Kasun Kalhara Dissanayake",
      grade: "10 ශ්‍රේණිය (Grade 10)",
      regNo: "DPS/2026/105",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
      guardianName: "ඩී. එම්. දිසානායක මයා",
      contact: "071 889 4433",
      address: "නො. 18, විහාර මාවත, නුගේගොඩ",
      attendance: [
        { date: "2026-05-03", status: "present", type: "dhamma_school" },
        { date: "2026-05-10", status: "present", type: "dhamma_school" },
        { date: "2026-05-24", status: "present", type: "sil_day" }
      ],
      examMarks: [
        { subject: "බුද්ධ ධර්මය", marks: 85, grade: "A" },
        { subject: "බෞද්ධ සංස්කෘතිය", marks: 78, grade: "B" },
        { subject: "පාලි භාෂාව", marks: 80, grade: "A" }
      ],
      recommendation: "දහම් පාසල් ශිෂ්‍ය නායකයෙකු ලෙස සුවිශේෂී විනයකින් හා වගකීමකින් යුතුව කටයුතු කළ ආදර්ශවත් ශිෂ්‍යයෙකි."
    },
    {
      pin: "1234",
      name: "චමත්කා නිම්නදි සිරිවර්ධන",
      englishName: "Chamathka Nimnadi Siriwardana",
      grade: "9 ශ්‍රේණිය (Grade 9)",
      regNo: "DPS/2026/088",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      guardianName: "ඩබ්ලිව්. ඒ. සිරිවර්ධන මයා",
      contact: "071 987 6543",
      address: "නො. 15, පන්සල වත්ත, නුගේගොඩ",
      attendance: [
        { date: "2026-05-03", status: "present", type: "dhamma_school" },
        { date: "2026-05-10", status: "present", type: "dhamma_school" },
        { date: "2026-05-17", status: "present", type: "dhamma_school" },
        { date: "2026-05-24", status: "present", type: "sil_day" }
      ],
      examMarks: [
        { subject: "බුද්ධ ධර්මය", marks: 95, grade: "A" },
        { subject: "බෞද්ධ සංස්කෘතිය", marks: 91, grade: "A" }
      ],
      recommendation: "දහම් පාසලේ සියලුම ආගමික කටයුතු වලට ඉතා උනන්දුවෙන් සහභාගී වන ආදර්ශවත් සිසුවියකි."
    },
    {
      pin: "1234",
      name: "දිනුක ලක්ෂාන් අබේරත්න",
      englishName: "Dinuka Lakshan Abeyrathne",
      grade: "9 ශ්‍රේණිය (Grade 9)",
      regNo: "DPS/2026/089",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      guardianName: "එච්. අබේරත්න මයා",
      contact: "078 665 1122",
      address: "නො. 7/A, පන්සල පාර, මහරගම",
      attendance: [
        { date: "2026-05-03", status: "present", type: "dhamma_school" },
        { date: "2026-05-10", status: "present", type: "dhamma_school" }
      ],
      examMarks: [
        { subject: "බුද්ධ ධර්මය", marks: 82, grade: "A" },
        { subject: "බෞද්ධ සංස්කෘතිය", marks: 74, grade: "B" }
      ],
      recommendation: "සමාජ සත්කාරක සහ ශ්‍රමදාන කටයුතු වලදී ඉතා උනන්දුවෙන් පෙරමුණ ගන්නා ශිෂ්‍යයෙකි."
    },
    {
      pin: "1234",
      name: "සනුදි තත්සරණි ජයසිංහ",
      englishName: "Sanudi Tathsarani Jayasinghe",
      grade: "8 ශ්‍රේණිය (Grade 8)",
      regNo: "DPS/2026/054",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      guardianName: "පී. ජයසිංහ මයා",
      contact: "072 334 5566",
      address: "නො. 22, විහාර මාවත, හෝමාගම",
      attendance: [
        { date: "2026-05-03", status: "present", type: "dhamma_school" },
        { date: "2026-05-10", status: "present", type: "dhamma_school" },
        { date: "2026-05-17", status: "present", type: "dhamma_school" }
      ],
      examMarks: [
        { subject: "බුද්ධ ධර්මය", marks: 90, grade: "A" },
        { subject: "බෞද්ධ සංස්කෘතිය", marks: 86, grade: "A" }
      ],
      recommendation: "පාලි ගාථා සජ්ඣායනා සඳහා සුවිශේෂී දක්ෂතාවයක් දක්වන ශිෂ්‍යාවකි."
    }
  ],
  teachers: [
    {
      id: "TCH/2026/01",
      name: "ධර්මසේන අමරසිංහ මයා",
      grade: "10 ශ්‍රේණිය",
      subject: "බුද්ධ ධර්මය සහ පාලි භාෂාව",
      phone: "077 445 6789",
      pin: "1234",
      role: "පන්තිභාර ආචාර්ය",
      status: "ක්‍රියාකාරී",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "TCH/2026/02",
      name: "සුජාතා විජේසිංහ මිය",
      grade: "9 ශ්‍රේණිය",
      subject: "බෞද්ධ සංස්කෘතිය සහ සාරධර්ම",
      phone: "071 889 1122",
      pin: "1234",
      role: "පන්තිභාර ආචාරිනී",
      status: "ක්‍රියාකාරී",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "TCH/2026/03",
      name: "ආනන්ද රණවීර මයා",
      grade: "8 ශ්‍රේණිය",
      subject: "අභිධර්මය සහ බුද්ධ චරිතය",
      phone: "076 554 9900",
      pin: "1234",
      role: "පන්තිභාර ආචාර්ය",
      status: "ක්‍රියාකාරී",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    }
  ],
  admins: [
    {
      id: "PRIN/2026/01",
      pin: "1234",
      name: "පූජ්‍ය මාදම්පේ සුමනසාර නාහිමි",
      role: "ප්‍රධානාචාර්ය ස්වාමින්වහන්සේ",
      avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "ADM/2026/01",
      pin: "1234",
      name: "කේ. ඩී. ගුණවර්ධන මයා",
      role: "පරිපාලන ලේකම්",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
    }
  ],
  events: [
    {
      id: "ev1",
      title: "පොසොන් මහා බත් දන්සැල සහ සැදැහැති පහන් කූඩු ප්‍රදර්ශනය",
      category: "වාර්ෂික විශේෂ උත්සව",
      date: "2026-06-14",
      time: "පෙ.ව. 8.30 - ප.ව. 4.00",
      venue: "ප්‍රධාන විහාර පරිශ්‍රය",
      grades: "සියලුම ශ්‍රේණි (All Grades)",
      description: "දහම් පාසල් සිසු දරුවන්ගේ නිර්මාණශීලී පහන් කූඩු ප්‍රදර්ශනය සහ ප්‍රජා සත්කාරක දන්සැල."
    },
    {
      id: "ev2",
      title: "සමස්ත ලංකා දහම් පාසල් ශිෂ්‍ය නිපුණතා කුසලතා ඇගයීම",
      category: "ධර්ම අධ්‍යයන හා තරග",
      date: "2026-07-05",
      time: "පෙ.ව. 8.00 - ප.ව. 2.00",
      venue: "ධර්ම ශාලාව",
      grades: "8, 9, 10 ශ්‍රේණි",
      description: "බුද්ධ ධර්මය, පාලි ගාථා ගායනා සහ කථික තරගාවලිය."
    },
    {
      id: "ev-3",
      title: "අන්තර් දහම් පාසල් ධර්ම ප්‍රශ්න විචාර සහ ගාථා සජ්ඣායනා තරගය",
      category: "ධර්ම අධ්‍යයන හා තරග",
      date: "2026-06-21",
      time: "පෙ.ව. 9.00 - ප.ව. 1.00",
      venue: "පෙ.ව. 9.00 - ශ්‍රවණාගාරය",
      grades: "සියලුම ශ්‍රේණි (All Grades)",
      description: "ප්‍රාදේශීය ශාසනාරක්ෂක බලමණ්ඩල තරගාවලිය වෙනුවෙන් දක්ෂතා දක්වන ශිෂ්‍ය ශිෂ්‍යාවන් තෝරාගැනීම."
    }
  ],
  deeds: [
    {
      id: "deed-1",
      regNo: "DPS/2026/104",
      studentName: "සමන් කුමාර පෙරේරා",
      grade: "10 ශ්‍රේණිය",
      deed: "විහාර මළුව සහ බෝධි ප්‍රාකාරය අතුගා පිරිසිදු කිරීම",
      category: "temple_service",
      points: 10,
      date: "2026-05-17"
    }
  ],
  badges: [
    {
      id: "ach-1",
      studentName: "සමන් කුමාර පෙරේරා",
      regNo: "DPS/2026/104",
      grade: "10 ශ්‍රේණිය",
      badge: "සිල්වත් ශිෂ්‍යයා (Virtuous Student)",
      points: 50,
      date: "2026-05-24",
      teacher: "ධර්මසේන අමරසිංහ මයා",
      remarks: "පෝය දින අටසිල් සමාදන් වී විනයගරුකව වැඩසටහන් වල නිරත වීම.",
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
      remarks: "ධර්ම ප්‍රශ්නෝත්තර තරගයේ ප්‍රථම ස්ථානය වෙනුවෙන්",
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
      remarks: "සුවිශේෂී විනය සහ ශිෂ්‍ය නායකත්ව වගකීම ඉටුකිරීම",
      status: "pending"
    }
  ],
  announcements: [
    {
      id: "ann-1",
      title: "වෙසක් පොහොය දින අටසිල් සමාදානය සඳහා සුදු වතින් සැරසී පැමිණීම",
      audience: "සියල්ලන් වෙත (All)",
      urgency: "important",
      body: "එළඹෙන වෙසක් පුන් පොහෝ දින පෙ.ව. 6.30 ට පෙර සියලුම ශිෂ්‍ය ශිෂ්‍යාවන් සුදුවතින් සැරසී විහාරස්ථානයට පැමිණිය යුතු බව දන්වමු.",
      date: "2026-05-20",
      author: "පූජ්‍ය මාදම්පේ සුමනසාර නාහිමි"
    },
    {
      id: "ann-2",
      title: "පළමු වාර විභාග ප්‍රශ්න පත්‍ර භාරදීම - ආචාර්ය මණ්ඩලය වෙත",
      audience: "ආචාර්ය මණ්ඩලය (Teachers Only)",
      urgency: "normal",
      body: "සියලුම පන්තිභාර ආචාර්යවරුන් ජුනි මස 10 වන දිනට පෙර පළමු වාර ඇගයීම් ප්‍රශ්න පත්‍ර ලේකම් කාර්යාලය වෙත භාරදීමට කාරුණික වන්න.",
      date: "2026-05-18",
      author: "කේ. ඩී. ගුණවර්ධන මයා (ලේකම්)"
    }
  ],
  materials: [
    {
      id: "mat-1",
      title: "10 ශ්‍රේණිය - පාලි ගාථා සහ සිංහල තේරුම",
      grade: "10 ශ්‍රේණිය (Grade 10)",
      type: "PDF නිබන්ධනය",
      desc: "වර්ෂ අවසාන ධර්මාචාර්ය සහ ශ්‍රේණි විභාග සඳහා නියමිත පාලි ගාථා, පදගත අර්ථ සහ සිංහල අර්ථ විවරණය.",
      link: "pali_gatha_grade10.pdf",
      author: "ධර්මසේන අමරසිංහ මයා",
      date: "2026-05-01"
    },
    {
      id: "mat-2",
      title: "ධම්මපදය - යමක වග්ගය සංක්ෂිප්ත සටහන්",
      grade: "සියලුම ශ්‍රේණි සඳහා",
      type: "ධර්ම සටහන්",
      desc: "යමක වග්ගයේ ප්‍රධාන ගාථාවල ධර්ම කරුණු, චක්ඛුපාල, මට්ඨකුණ්ඩලී කථා වස්තු සහ ජීවිතයට ආදර්ශ.",
      link: "dhammapada_yamaka_notes.pdf",
      author: "පූජ්‍ය මාදම්පේ සුමනසාර නාහිමි",
      date: "2026-05-15"
    },
    {
      id: "mat-3",
      title: "බෞද්ධ සංස්කෘතිය සහ ඉතිහාසය ආදර්ශ ප්‍රශ්න පත්‍රය",
      grade: "10 ශ්‍රේණිය (Grade 10)",
      type: "ප්‍රශ්නෝත්තර",
      desc: "පළමු වාර විභාගය සඳහා සකස් කරන ලද ලකුණු 100 ක ආදර්ශ ප්‍රශ්න පත්‍රය සහ පිළිතුරු සටහන.",
      link: "buddhist_culture_model_paper.pdf",
      author: "ධර්මසේන අමරසිංහ මයා",
      date: "2026-06-01"
    }
  ]
};

module.exports = { SEED_DATA };
