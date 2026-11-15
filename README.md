# 🌸 Daham Pasala Sadhu Charya (දහම් පාසල් ශිෂ්‍ය සාධු චර්යා පද්ධතිය)

> **ඩිජිටල් ශිෂ්‍ය කළමනාකරණ, සාධු චර්යා ඇගයීම් සහ අධ්‍යාපනික ප්‍රගති පාලන පද්ධතිය**  
> *A Modern Buddhist Sunday School Student Management & Character Building Digital Platform*

[![Node.js Version](https://img.shields.io/badge/Node.js-22.x%20LTS-brightgreen.svg)](https://nodejs.org)
[![Database](https://img.shields.io/badge/Database-Firebase%20Firestore%20%7C%20MongoDB-orange.svg)](https://firebase.google.com)
[![Platform](https://img.shields.io/badge/Platform-Vercel%20Serverless%20%7C%20Standalone%20Node-blue.svg)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)

---

## 📌 පද්ධති සාරාංශය (Overview)

**Daham Pasala Sadhu Charya** යනු ශ්‍රී ලාංකික දහම් පාසල් පරිපාලනය, ආචාර්ය මණ්ඩලය, සිසුන් සහ දෙමාපියන් එකිනෙක යා කරන පුළුල් ඩිජිටල් වේදිකාවකි. මෙම පද්ධතිය මඟින් විභාග ලකුණු වලට අමතරව ශිෂ්‍යයන්ගේ සීල සමාදානය, දහම් පාසල් පැමිණීම, මල් පූජා සහ යහපත් ක්‍රියා (Good Deeds) වෙනුවෙන් කුසලතා පදක්කම් (Merit Badges) පිරිනමමින් සමස්ත චරිත සංවර්ධනය ඇගයීමට ලක් කෙරේ.

---

## ✨ ප්‍රධාන අංග (Key Features)

- **🚪 බහු-ද්වාර පද්ධතිය (Multi-Portal Interface):**
  - **පරිපාලන ද්වාරය (Admin Portal):** ශිෂ්‍ය ලියාපදිංචිය, ආචාර්ය පැවරුම්, පදක්කම් අනුමත කිරීම්, දින දර්ශනය, CSV ආයාත/අපනයන, සහ විධායක විශ්ලේෂණ.
  - **ආචාර්ය ද්වාරය (Teacher Portal):** දෛනික සහ පෝදා පැමිණීම්, වාර විභාග ලකුණු ඇතුළත් කිරීම, පන්ති ශ්‍රේණිගත කිරීම් (Rankings), සහ නිල PDF ප්‍රගති වාර්තා කාඩ්පත් මුද්‍රණය.
  - **ශිෂ්‍ය ද්වාරය (Student Portal):** QR කේතය සහිත ඩිජිටල් ශිෂ්‍ය හැඳුනුම්පත (Digital ID Card), විභාග ප්‍රගතිය, යහපත් ක්‍රියා ලකුණු පුවරුව, සහ ධර්ම අධ්‍යයන ද්‍රව්‍ය.
  - **භූමිකා තේරීමේ ද්වාරය (Onboarding Portal):** පහසු පිවිසුම් හා සක්‍රීය සැසි කෙටිමං.
- **🛡️ ශක්තිමත් ආරක්ෂාව (High-Grade Security):**
  - Node.js `scrypt` cryptographic salt-hash මඟින් PIN මුරපද සුරැකීම සහ පැරණි Plaintext PIN ස්වයංක්‍රීයව ආරක්ෂිත කිරීම.
  - Cloud Firestore Security Rules මඟින් සෘජු Client Writes සම්පූර්ණයෙන්ම අවහිර කර, Backend Admin SDK මඟින් පමණක් දත්ත ගබඩා කිරීම.
- **☁️ Cloud & Offline Dual-Mode Resilience:**
  - අන්තර්ජාලය ඇති විට සජීවී Firebase / MongoDB සමඟ ක්‍රියා කරමින්, නොබැඳි අවස්ථාවල දේශීය బ්‍රවුසරයේ (`localStorage`) බිඳවැටීමකින් තොරව ක්‍රියා කිරීම.
  - බ්‍රවුසරයේ තත්ත්ව ලාංඡනය (Status Pill) මඟින් සජීවී දත්ත සමුදා තත්ත්වය පරිශීලකයාට පැහැදිලිව පෙන්වීම.

---

## 📁 ව්‍යාපෘති ව්‍යුහය (Project Directory Structure)

```text
sadu charya/
├── DOCUMENTATION.md        # 📖 සම්පූර්ණ පද්ධති ලියකියවිල්ල (Full System Documentation)
├── README.md               # 🌟 ව්‍යාපෘති මූලික හැඳින්වීම සහ ඉක්මන් ආරම්භය
├── package.json            # Node.js dependencies සහ scripts
├── vercel.json             # Vercel Serverless Functions සහ Routing සැකසුම්
├── firestore.rules         # Google Cloud Firestore Fail-Closed ආරක්ෂණ නීති
├── index.html              # ප්‍රධාන පිවිසුම (OnboardingPage වෙත Redirect වේ)
│
├── api/                    # ☁️ Vercel Cloud Serverless Function
│   └── index.js            # Unified Serverless Entrypoint (/api/*)
│
├── B_END/                  # ⚙️ පසුපස අන්තය (Backend Server & Services)
│   ├── server.js           # Standalone Native Node.js HTTP Server (Port 5001)
│   ├── routes.js           # REST API Routes (CRUD, Auth, Export, Rankings)
│   ├── auth.js             # Scrypt PIN Hashing, JWT Tokens, Role Validation
│   ├── db.js               # Multi-engine Database Dispatcher
│   ├── db-firebase.js      # Pure Firebase Admin SDK & Cloud Firestore Adapter
│   ├── db-mongo.js         # MongoDB & Mongoose Database Adapter
│   ├── seed-data.js        # ස්වයංක්‍රීය මූලික දත්ත කට්ටලය (Zero external deps)
│   ├── test-direct.js      # In-Process API Unit Tests (79 Tests)
│   └── .env.example        # පරිසර විචල්‍ය ආදර්ශ සැකසුම්
│
└── F_END/                  # 🎨 ඉදිරිපස අන්තය (Frontend Web Portals)
    ├── Pages/
    │   ├── OnboardingPage.html   # භූමිකා තෝරාගැනීමේ ප්‍රධාන පිටුව
    │   ├── Admin.html            # ප්‍රධානාචාර්ය / පරිපාලන ද්වාරය
    │   ├── Teacher.html          # ආචාර්ය මණ්ඩල ද්වාරය
    │   └── Student.html          # ශිෂ්‍ය සහ මව්පිය ද්වාරය
    ├── JS/
    │   ├── api.js                # Unified Frontend API Client (Dual-Mode)
    │   ├── admin.js              # Admin portal logic
    │   ├── teacher.js            # Teacher portal logic
    │   ├── student.js            # Student portal logic
    │   └── onboarding.js         # Role selector logic
    ├── CSS/
    │   └── style.css             # පද්ධතියේ ප්‍රධාන ශෛලීන් (Themes & Dark Mode)
    └── Images/
        └── dharmachakra.svg      # ධර්මචක්‍ර ලාංඡනය
```

---

## 🚀 ඉක්මන් ආරම්භය (Quick Start)

### 1. දේශීයව ධාවනය කිරීම (Local Setup)

```bash
# 1. පද්ධතිය බාගත කර ෆෝල්ඩරයට පිවිසෙන්න
cd sadu\ charya

# 2. Dependencies ස්ථාපනය කරන්න
npm install
cd B_END && npm install && cd ..

# 3. Backend සේවාදායකය ආරම්භ කරන්න
npm start
```

දැන් ඔබගේ වෙබ් බ්‍රවුසරයෙන් **`http://localhost:5001`** වෙත පිවිසෙන්න.

---

### 2. Vercel මත Deploy කිරීම (Cloud Deployment)

1. මෙම Repository එක GitHub වෙත Push කරන්න.
2. [Vercel Dashboard](https://vercel.com) වෙත පිවිස **"Add New Project"** තෝරන්න.
3. **Build & Development Settings:**
   - **Framework Preset:** `Other` (හෝ Auto-detected `null`).
   - **Root Directory:** `.` (ප්‍රධාන ෆෝල්ඩරයම තබන්න).
   - **Node.js Version:** `22.x`.
4. **Environment Variables** තුළ පහත අගයන් එක් කරන්න:
   - `DB_PROVIDER`: `firebase`
   - `FIREBASE_PROJECT_ID`: `daham-pasala-sadhu-2026`
   - `FIREBASE_SERVICE_ACCOUNT_JSON`: ඔබගේ Firebase Service Account JSON හි සම්පූර්ණ අන්තර්ගතය.
   - `JWT_SECRET`: ඕනෑම ශක්තිමත් ආරක්ෂිත අක්ෂර මාලාවක්.
5. **Deploy** ක්ලික් කරන්න.

---

## 🔑 පෙරනිමි පිවිසුම් තොරතුරු (Default Logins for Demo)

| භූමිකාව (Role) | පරිශීලක අංකය (ID / RegNo) | පෙරනිමි PIN |
|---|---|---|
| **පරිපාලක (Admin)** | `PRIN/2026/01` | `1234` |
| **ආචාර්ය (Teacher)** | `TCH/2026/01` | `1234` |
| **ශිෂ්‍ය (Student)** | `DPS/2026/104` | `1234` |

*(ප්‍රථම පිවිසුමෙන් පසු PIN අංකය ස්වයංක්‍රීයව `scrypt` hash එකක් බවට පත්වන අතර, පරිශීලකයන්ට එය සංශෝධනය කළ හැක).*

---

## 🧪 පරීක්ෂණ ධාවනය කිරීම (Automated Tests)

පද්ධතියේ සියලුම REST API Endpoints, Authentication, Hashing, CSV Export, සහ Class Rankings පරීක්ෂා කිරීමට:

```bash
node B_END/test-direct.js
# Route Unit Test Results: 79 Passed, 0 Failed
```

---

## 📚 සම්පූර්ණ ලියකියවිල්ල (Full Documentation)

සම්පූර්ණ REST API විස්තරය, සියලුම දත්ත ආකෘති, Firebase Security Rules, සහ ගැඹුරු සැකසුම් මාර්ගෝපදේශය සඳහා **[`DOCUMENTATION.md`](DOCUMENTATION.md)** ගොනුව පරිශීලනය කරන්න.

---
**ශ්‍රී සුගත ධර්ම විද්‍යාලය - කොළඹ**  
*Daham Pasala Sadhu Charya System © 2026*
