# 📖 Daham Pasala Sadhu Charya - Comprehensive System Documentation
### දහම් පාසල් ශිෂ්‍ය සාධු චර්යා සහ අධ්‍යාපනික කළමනාකරණ ඩිජිටල් පද්ධතිය
**System Version:** 2.0.0 (Production / Hybrid Cloud)  
**Target Organization:** ශ්‍රී සුගත ධර්ම විද්‍යාලය (Sri Sugatha Dhamma School)  
**Supported Runtimes:** Node.js 22.x LTS, Vercel Serverless Functions, Modern Web Browsers  
**Database Engines:** Google Cloud Firestore (Primary) & MongoDB / Mongoose (Secondary) with In-Memory Resilient Fallback

---

## 📑 පටුන / Table of Contents
1. [පද්ධති හැඳින්වීම සහ අරමුණ (System Overview & Mission)](#1-පද්ධති-හැඳින්වීම-සහ-අරමුණ-system-overview--mission)
2. [පද්ධති ගෘහ නිර්මාණ ශිල්පය (System Architecture)](#2-පද්ධති-ගෘහ-නිර්මාණ-ශිල්පය-system-architecture)
   - [2.1 Frontend Dual-Mode Client Architecture](#21-frontend-dual-mode-client-architecture)
   - [2.2 Serverless & Standalone Backend Architecture](#22-serverless--standalone-backend-architecture)
   - [2.3 Multi-Engine Database Architecture](#23-multi-engine-database-architecture)
3. [ද්වාර සහ පරිශීලක භූමිකා (Portals & User Roles)](#3-ද්වාර-සහ-පරිශීලක-භූමිකා-portals--user-roles)
   - [3.1 භූමිකා තේරීමේ ද්වාරය (Onboarding Portal)](#31-භූමිකා-තේරීමේ-ද්වාරය-onboarding-portal)
   - [3.2 පරිපාලන ද්වාරය (Administrator Portal)](#32-පරිපාලන-ද්වාරය-administrator-portal)
   - [3.3 ආචාර්ය ද්වාරය (Teacher Portal)](#33-ආචාර්ය-ද්වාරය-teacher-portal)
   - [3.4 ශිෂ්‍ය ද්වාරය (Student & Parent Portal)](#34-ශිෂ්‍ය-ද්වාරය-student--parent-portal)
4. [ආරක්ෂණ සහ අනන්‍යතා තහවුරු කිරීමේ ක්‍රමවේදය (Security & Authentication)](#4-ආරක්ෂණ-සහ-අනන්‍යතා-තහවුරු-කිරීමේ-ක්‍රමවේදය-security--authentication)
   - [4.1 Scrypt PIN Hashing & Zero-Disruption Upgrade](#41-scrypt-pin-hashing--zero-disruption-upgrade)
   - [4.2 Token Generation & Claims](#42-token-generation--claims)
   - [4.3 Cloud Firestore Security Rules](#43-cloud-firestore-security-rules)
5. [සම්පූර්ණ REST API විස්තරය (Complete REST API Reference)](#5-සම්පූර්ණ-rest-api-විස්තරය-complete-rest-api-reference)
6. [දත්ත ආකෘති සහ ව්‍යුහය (Data Models & Schema Reference)](#6-දත්ත-ආකෘති-සහ-ව්‍යුහය-data-models--schema-reference)
7. [පරිසර විචල්‍යයන් සහ වින්‍යාසය (Environment Variables & Configuration)](#7-පරිසර-විචල්‍යයන්-සහ-වින්‍යාසය-environment-variables--configuration)
8. [ස්ථාපනය සහ ධාවනය කිරීමේ මාර්ගෝපදේශය (Deployment & Setup Guide)](#8-ස්ථාපනය-සහ-ධාවනය-කිරීමේ-මාර්ගෝපදේශය-deployment--setup-guide)
   - [8.1 Local Development Setup](#81-local-development-setup)
   - [8.2 Vercel Cloud Deployment](#82-vercel-cloud-deployment)
   - [8.3 Google Cloud / Firebase Setup](#83-google-cloud--firebase-setup)
9. [ප්‍රකාශනයට පෙර පිරික්සුම් ලැයිස්තුව (Pre-Publish Checklist)](#9-ප්‍රකාශනයට-පෙර-පිරික්සුම්-ලැයිස්තුව-pre-publish-checklist)
10. [දෝෂ නිරාකරණය සහ නිතර අසන ප්‍රශ්න (Troubleshooting & FAQs)](#10-දෝෂ-නිරාකරණය-සහ-නිතර-අසන-ප්‍රශ්න-troubleshooting--faqs)

---

## 1. පද්ධති හැඳින්වීම සහ අරමුණ (System Overview & Mission)

**Daham Pasala Sadhu Charya (දහම් පාසල් ශිෂ්‍ය සාධු චර්යා ඩිජිටල් පද්ධතිය)** යනු ශ්‍රී ලාංකික දහම් පාසල් පද්ධතියේ ශිෂ්‍ය ප්‍රගතිය, ආදර්ශමත් සාධු චර්යාව, විභාග ලකුණු, පෝදා අටසිල් සහ දහම් පාසල් පැමිණීම ඩිජිටල්කරණය කිරීම සඳහා නිර්මාණය කරන ලද නවීන වෙබ් පද්ධතියකි.

### ප්‍රධාන අරමුණු (Key Objectives):
1. **ශිෂ්‍ය චර්යා හා කුසලතා ඇගයීම (Virtue & Merit Tracking):** විභාග ලකුණු වලට පමණක් සීමා නොවී, සමාජ සත්කාර, ආගමික වතාවත්, මල් පූජා සහ යහපත් ක්‍රියා (Good Deeds) වෙනුවෙන් ලකුණු හා කුසලතා පදක්කම් (Merit Badges) පිරිනැමීම.
2. **ශිෂ්‍ය ඩිජිටල් අනන්‍යතාව (Digital Student Identity):** එක් එක් ශිෂ්‍යයාට ඡායාරූපය, QR කේතය සහ ප්‍රධාන විස්තර ඇතුළත් ඩිජිටල් හැඳුනුම්පතක් (Digital ID Card) ලබා දීම.
3. **පන්ති ප්‍රගති වාර්තා සහ ශ්‍රේණිගත කිරීම් (Rankings & Report Cards):** වාර විභාග ලකුණු පදනම් කරගත් ස්වයංක්‍රීය ශ්‍රේණි (A, B, C, S, W) ගණනය, පන්ති ශ්‍රේණිගත කිරීම් (Class Ranks) සහ නිල PDF ප්‍රගති වාර්තා (Report Cards) මුද්‍රණය.
4. **නොබැඳි සහ සබැඳි ද්විත්ව ක්‍රියාකාරීත්වය (Offline & Cloud Resilience):** අන්තර්ජාලය නොමැති අවස්ථාවලදී දේශීය බ්‍රවුසරයේ (`localStorage`) ක්‍රියාත්මක වෙමින්, අන්තර්ජාලය සහ සේවාදායකය සම්බන්ධ වූ විගස වලාකුළු දත්ත සමුදාය (Cloud Firestore / MongoDB) හා ස්වයංක්‍රීයව සමමුහුර්ත වීම (Auto-Sync).

---

## 2. පද්ධති ගෘහ නිර්මාණ ශිල්පය (System Architecture)

පද්ධතිය ස්ථර 3 කින් යුත් (Three-Tier) පරිපූර්ණ ආකෘතියකින් සමන්විත වේ:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION TIER (F_END)                       │
│  OnboardingPage.html  │  Admin.html  │  Teacher.html  │  Student.html   │
│                                                                        │
│            Unified API Client & State Coordinator (api.js)             │
│   ┌───────────────────────────┐      ┌──────────────────────────────┐  │
│   │   localStorage Fallback   │ ◄──► │  Dynamic HTTP/HTTPS Client   │  │
│   └───────────────────────────┘      └──────────────┬───────────────┘  │
└─────────────────────────────────────────────────────┼──────────────────┘
                                                      │ JSON over HTTP
                                                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       APPLICATION SERVER TIER                          │
│                                                                        │
│   Vercel Serverless Function (api/index.js)   OR   Node Server (B_END) │
│                                  │                                     │
│                     Central Router (B_END/routes.js)                   │
│                     Auth & Security (B_END/auth.js)                    │
│                                  │                                     │
│                     Database Dispatcher (B_END/db.js)                  │
└──────────────────────────────────┼─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          PERSISTENCE TIER                              │
│                                                                        │
│  ┌────────────────────────┐  ┌────────────────┐  ┌──────────────────┐  │
│  │ Google Cloud Firestore │  │ MongoDB Atlas  │  │ Resilient Memory │  │
│  │ (Firebase Admin SDK)   │  │ (Mongoose ORM) │  │ Fallback Store   │  │
│  └────────────────────────┘  └────────────────┘  └──────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Frontend Dual-Mode Client Architecture
`F_END/JS/api.js` මඟින් සම්පූර්ණ ඉදිරිපස අන්තයේ දත්ත ගලායාම පාලනය කරයි:
- **`getApiBase()` Dynamic Detection:**
  - `file://` ප්‍රොටෝකෝලයෙන් විවෘත කළහොත්: `http://localhost:5001/api` වෙත යොමු කරයි.
  - දේශීය `localhost` විකල්ප තොටකින් (Live Server, port 5500 ආදිය) විවෘත කළහොත්: `http://localhost:5001/api` වෙත යොමු කරයි.
  - Vercel හෝ Cloud Hosting මඟින් විවෘත කළහොත්: එම ඩොමේනයේ `/api` (Same-origin relative path) භාවිතා කරයි.
  - `window.DAP_API_BASE` ගෝලීය විචල්‍යයක් මඟින් ඕනෑම මොහොතක සජීවී API ලිපිනය වෙනස් කළ හැක.
- **Dual-Mode Fallback & Auto-Sync:**
  - සෑම API ඉල්ලීමක්ම ප්‍රථමයෙන් සජීවී Backend වෙත යොමු කෙරේ (`shouldCallBackend()`).
  - Backend සම්බන්ධතාව නොමැති නම් පමණක් සුරක්ෂිතව දේශීය බ්‍රවුසරයේ `localStorage` මත ක්‍රියාත්මක වේ.
  - Backend යළි සක්‍රීය වූ විට බ්‍රවුසර තිරයේ ඉහළ දකුණු කෙළවරේ ඇති තත්ත්ව ලාංඡනය (Status Pill) ක්ෂණිකව කොළ/තැඹිලි පැහැයෙන් යාවත්කාලීන වේ.
- **Health Check Polling & Visual Status Badge:**
  - තත්පර 20 කට වරක් `/api/health` මඟින් පසුපස අන්තය හා දත්ත සමුදා තත්ත්වය පරික්ෂා කරයි.
  - `Backend: Firebase (Live)` (තැඹිලි), `Backend: MongoDB (Live)` (කොළ), `Backend: Memory Only` (රතු), හෝ `Local Browser Mode (Offline)` (කහ) ලෙස පැහැදිලිව පරිශීලකයාට දර්ශනය වේ.

### 2.2 Serverless & Standalone Backend Architecture
- **Vercel Serverless Function (`api/index.js`):**
  - Vercel Cloud පරිසරයේ තනි Serverless Function එකක් ලෙස `/api/*` සියලුම ඉල්ලීම් භාර ගනී.
  - `vercel.json` හි `"rewrites"` මඟින් `/api/(.*)` මාර්ග `api/index.js` වෙත යොමු කෙරේ.
  - `includeFiles: "B_END/*.js"` මඟින් Vercel බණ්ඩලයට සියලුම පසුපස ගොනු ඇතුළත් කෙරේ.
  - සම්පූර්ණ CORS ශීර්ෂක (Access-Control-Allow-Origin: *) සකසා ඇත.
  - 15MB දක්වා Base64 ඡායාරූප දත්ත භාරගත හැකි Streaming Body Parser අන්තර්ගතයි.
- **Standalone Node.js Server (`B_END/server.js`):**
  - බාහිර Express රාමු නොමැතිව Native Node.js `http` මොඩියුලය මත ක්‍රියාත්මක වේ.
  - ඉතා වේගවත් වන අතර අවම මතක ධාරිතාවක් (Low Memory Footprint) වැය කරයි.

### 2.3 Multi-Engine Database Architecture
- **Firebase Firestore (`B_END/db-firebase.js`):**
  - Google Cloud Firestore මත පදනම් වූ නිෂ්පාදන මට්ටමේ දත්ත සමුදාය.
  - Firebase Admin SDK මඟින් සේවාදායකයේ (Server-side) සිට ක්‍රියාත්මක වන බැවින් සෘජු බ්‍රවුසර ප්‍රවේශ අවදානම් නොමැත.
  - පහත ක්‍රම 5 න් ඕනෑම ක්‍රමයකින් Service Account අක්තපත්‍ර හඳුනා ගනී:
    1. `FIREBASE_SERVICE_ACCOUNT_JSON` පරිසර විචල්‍යය (Plain JSON හෝ Base64 string).
    2. `FIREBASE_SERVICE_ACCOUNT_PATH` හෝ `GOOGLE_APPLICATION_CREDENTIALS` ගොනු මාර්ගය.
    3. `FIREBASE_CLIENT_EMAIL` සහ `FIREBASE_PRIVATE_KEY` පරිසර විචල්‍යයන්.
    4. `B_END/` හෝ Root ෆෝල්ඩරයේ ඇති `*firebase-adminsdk*.json` හෝ `serviceAccountKey.json` ගොනුව.
    5. Google Application Default Credentials (GCP පරිසරයේදී).
- **MongoDB & Mongoose (`B_END/db-mongo.js`):**
  - දේශීය හෝ MongoDB Atlas ක්ලවුඩ් පරිසරය සඳහා පූර්ණ Mongoose Schemas සහිත විකල්ප දත්ත සමුදාය.
- **Resilient Memory Fallback Store (`B_END/seed-data.js`):**
  - අන්තර්ජාල බිඳවැටීමකදී හෝ දත්ත සමුදා යතුරු නොමැති අවස්ථාවක පවා පද්ධතිය බිඳ නොවැටී (Zero-Downtime) මතකයේ (In-Memory) ධාවනය වීමට ඉඩ සලසයි.

---

## 3. ද්වාර සහ පරිශීලක භූමිකා (Portals & User Roles)

පද්ධතිය ප්‍රධාන පරිශීලක ද්වාර (Portals) 4 කින් සමන්විත වේ:

```
                                  ┌────────────────────────┐
                                  │   Onboarding Portal    │
                                  │ (OnboardingPage.html)  │
                                  └───────────┬────────────┘
                        ┌─────────────────────┼─────────────────────┐
                        ▼                     ▼                     ▼
             ┌────────────────────┐ ┌───────────────────┐ ┌───────────────────┐
             │    Admin Portal    │ │  Teacher Portal   │ │  Student Portal   │
             │    (Admin.html)    │ │  (Teacher.html)   │ │  (Student.html)   │
             └────────────────────┘ └───────────────────┘ └───────────────────┘
```

### 3.1 භූමිකා තේරීමේ ද්වාරය (Onboarding Portal)
- **ගොනු:** `F_END/Pages/OnboardingPage.html`, `F_END/JS/onboarding.js`
- **කාර්යභාරය:**
  - පද්ධතියට පිවිසෙන ප්‍රධාන දොරටුවයි (Landing Page).
  - ශිෂ්‍ය, ආචාර්ය, සහ පරිපාලන යන භූමිකා 3 න් සුදුසු අංශය තේරීමට ඉඩ සලසයි.
  - පෙර පිවිසුණු සක්‍රීය සැසියක් (Active Session) ඇත්නම්, එය හඳුනාගෙන අදාළ ද්වාරයට සෘජුව පිවිසීමේ කෙටිමං (Shortcut Badges) පෙන්වයි.
  - අඳුරු මාදිලිය (Dark Mode) සහ සිංහල/ඉංග්‍රීසි සුහද අතුරුමුහුණත.

### 3.2 පරිපාලන ද්වාරය (Administrator Portal)
- **ගොනු:** `F_END/Pages/Admin.html`, `F_END/JS/admin.js`
- **ප්‍රවේශය:** පරිපාලක අංකය (Admin ID: උදා. `PRIN/2026/01`) සහ රහස් අංකය (PIN).
- **ප්‍රධාන හැකියාවන්:**
  1. **ශිෂ්‍ය කළමනාකරණය (Student Management):**
     - නව සිසුන් ලියාපදිංචි කිරීම (ඇතුළත්වීමේ අංකය, සම්පූර්ණ නම, ඉංග්‍රීසි නම, ශ්‍රේණිය, උපන් දිනය, ඡායාරූපය, භාරකරුගේ විස්තර, ලිපිනය, දුරකථන අංකය).
     - ශිෂ්‍ය තොරතුරු යාවත්කාලීන කිරීම සහ ඉවත් කිරීම (Delete with Confirmation).
     - ඡායාරූප සජීවීව බැලීම (Image Preview) සහ කැමරාවෙන් හෝ ගොනුවෙන් ලබාගැනීම.
  2. **ආචාර්ය මණ්ඩල කළමනාකරණය (Teacher Management):**
     - නව ආචාර්යවරුන් ලියාපදිංචි කිරීම, පන්ති සහ විෂයයන් පැවරීම (Class Assignment).
  3. **දින දර්ශනය සහ වැඩසටහන් (Event Calendar):**
     - පාසල් උත්සව, ශ්‍රමදාන, මව්පිය රැස්වීම් සහ විශේෂ පෝදා වැඩසටහන් ප්‍රකාශයට පත් කිරීම.
  4. **කුසලතා පදක්කම් අනුමත කිරීම (Badge Approvals):**
     - ආචාර්යවරුන් විසින් සිසුන් වෙනුවෙන් නිර්දේශ කරන ලද පදක්කම් (Pending Badges) සමාලෝචනය කර අනුමත කිරීම (Approve) හෝ ප්‍රතික්ෂේප කිරීම (Reject).
  5. **නිල නිවේදන (Official Announcements):**
     - සියලු දෙනාට, ආචාර්යවරුන්ට පමණක්, හෝ සිසුන්ට පමණක් අදාළ වන පරිදි නිවේදන නිකුත් කිරීම.
  6. **දත්ත ආයාත සහ අපනයන (Data Import / Export):**
     - ශිෂ්‍ය නාමලේඛන සහ විභාග ලකුණු Microsoft Excel සඳහා සුදුසු Sinhala UTF-8 BOM සහිත CSV ලෙස Export කිරීම.
     - CSV ගොනු මඟින් තොග පිටින් සිසුන් ලියාපදිංචි කිරීම (Bulk Import).
  7. **විධායක විශ්ලේෂණ (Executive Analytics):**
     - මුළු සිසුන්, ගුරුවරුන්, සාමාන්‍ය පැමිණීමේ ප්‍රතිශතය, ශ්‍රේණි අනුව ශිෂ්‍ය ව්‍යාප්තිය පෙන්වන ප්‍රස්ථාරික තොරතුරු පුවරුව.

### 3.3 ආචාර්ය ද්වාරය (Teacher Portal)
- **ගොනු:** `F_END/Pages/Teacher.html`, `F_END/JS/teacher.js`
- **ප්‍රවේශය:** ගුරු අංකය (Teacher ID: උදා. `TCH/2026/01`) සහ රහස් අංකය (PIN).
- **ප්‍රධාන හැකියාවන්:**
  1. **දෛනික හා පෝදා පැමිණීම සටහන් කිරීම (Attendance Logging):**
     - තමන්ට අදාළ ශ්‍රේණියේ සිසුන්ගේ දහම් පාසල් ඉරිදා පැමිණීම.
     - පෝහෝ දින අටසිල් සමාදන් වීමේ පැමිණීම.
     - බුද්ධ වන්දනාව සඳහා මල් රැගෙන ඒම (Flower Offering) සටහන් කිරීම.
  2. **වාර විභාග ලකුණු ඇතුළත් කිරීම (Exam Marks & Grading):**
     - 1 වන, 2 වන, සහ 3 වන වාර විභාග ලකුණු ඇතුළත් කිරීම (බුද්ධ ධර්මය, බෞද්ධ සංස්කෘතිය, පාලි භාෂාව ආදී විෂයයන්).
     - ලකුණු අනුව ස්වයංක්‍රීය සාමාර්ථය (A: 75+, B: 65-74, C: 50-64, S: 35-49, W: 0-34) ගණනය.
  3. **යහපත් ක්‍රියා සහ චර්යා සටහන් (Good Deeds & Behavior):**
     - විහාරස්ථාන පවිත්‍ර කිරීම, වැඩිහිටියන්ට උපකාර කිරීම වැනි යහපත් ක්‍රියා සටහන් කිරීම (+10 Points).
     - ශිෂ්‍ය චර්යා නිරීක්ෂණ (Observations) සටහන් කිරීම.
  4. **කුසලතා සම්මාන නිර්දේශ කිරීම (Badge Nominations):**
     - දක්ෂ සිසුන් සඳහා විශේෂ පදක්කම් (ධර්ම ඥාන, ආදර්ශමත් චරිත, පරිසර හිතකාමී ආදී) ප්‍රධානාචාර්යතුමන් වෙත නිර්දේශ කිරීම.
  5. **පන්ති ශ්‍රේණිගත කිරීම සහ ප්‍රගති වාර්තා (Rankings & Report Cards):**
     - පන්තියේ සිසුන්ගේ සාමාන්‍ය ලකුණු අනුව 1, 2, 3 ආදී ස්ථාන ස්වයංක්‍රීයව ශ්‍රේණිගත කිරීම.
     - දෙමව්පියන්ට ලබාදීම සඳහා එක් එක් ශිෂ්‍යයාගේ අත්සන් සහිත නිල ප්‍රගති වාර්තාව (PDF Report Card) තනි ක්ලික් කිරීමකින් බාගත කිරීම.

### 3.4 ශිෂ්‍ය ද්වාරය (Student & Parent Portal)
- **ගොනු:** `F_END/Pages/Student.html`, `F_END/JS/student.js`
- **ප්‍රවේශය:** ශිෂ්‍ය ඇතුළත්වීමේ අංකය (Student RegNo: උදා. `DPS/2026/104`) සහ රහස් අංකය (PIN).
- **ප්‍රධාන හැකියාවන්:**
  1. **ඩිජිටල් ශිෂ්‍ය හැඳුනුම්පත (Digital Student ID Card):**
     - ශිෂ්‍ය ඡායාරූපය, ශ්‍රේණිය, ඇතුළත්වීමේ දිනය සහ වලංගු QR කේතය සහිත ඩිජිටල් හැඳුනුම්පත.
  2. **පෞද්ගලික පැමිණීමේ ඉතිහාසය (Attendance Timeline):**
     - ඉරිදා දහම් පාසල් සහ පෝදා සීල සමාදාන සහභාගීත්ව ප්‍රස්ථාරය සහ දින දර්ශනය.
  3. **වාර විභාග ප්‍රගති වාර්තාව (Exam Performance & Report Card):**
     - විෂය අනුව ලකුණු, සාමාර්ථ සහ ගුරු භවතුන්ගේ නිර්දේශ නැරඹීම.
  4. **සාධු චර්යා සහ පදක්කම් ගැලරිය (Good Deeds & Badge Showcase):**
     - තමන් උපයාගත් යහපත් ක්‍රියා ලකුණු (Merit Points) සහ අනුමත වූ සම්මාන පදක්කම් නැරඹීම.
  5. **ධර්ම අධ්‍යයන ද්‍රව්‍ය බාගත කිරීම (Dhamma Study Materials):**
     - අදාළ ශ්‍රේණියට ගුරුවරුන් විසින් ලබාදුන් සටහන් සහ ප්‍රශ්න පත්‍ර බාගත කිරීම.

---

## 4. ආරක්ෂණ සහ අනන්‍යතා තහවුරු කිරීමේ ක්‍රමවේදය (Security & Authentication)

### 4.1 Scrypt PIN Hashing & Zero-Disruption Upgrade
පද්ධතියේ කිසිදු මුරපදයක් (PIN) සේවාදායකයේ හෝ දත්ත සමුදායේ Plain Text ලෙස ගබඩා නොවේ:
- **ඇල්ගොරිතමය:** Node.js Cryptographic Scrypt (`crypto.scryptSync`) with 16-byte cryptographically secure random salt.
- **ගබඩා ආකෘතිය:** `scrypt:<salt_hex>:<hash_hex>`.
- **Zero-Disruption Auto-Upgrade:**
  - පද්ධතිය ස්ථාපනය කරන විට පැවති පැරණි සාමාන්‍ය PIN (උදා: `1234`) මඟින් පරිශීලකයා ප්‍රථම වරට පිවිසෙන අවස්ථාවේදීම, කිසිදු බාධාවකින් තොරව එම PIN අංකය ස්වයංක්‍රීයව `scrypt` hash එකක් බවට පත් වී දත්ත සමුදායේ සුරැකේ.
- **Timing Safe Comparison:** මුරපද පරීක්ෂා කිරීමේදී Timing Attack අවදානම් වැළැක්වීමට `crypto.timingSafeEqual` භාවිතා කරයි.
- **Sanitization:** සියලුම ශිෂ්‍ය, ආචාර්ය, සහ පරිපාලන තොරතුරු ලබාගැනීමේ API ඇමතුම් වලදී `sanitizePublicUser()` මඟින් `pin` සහ `pinHash` ක්ෂේත්‍ර ඉවත් කර පිරිසිදු දත්ත පමණක් ලබාදෙයි.

### 4.2 Token Generation & Claims
- පරිශීලකයා නිවැරදිව පිවිසුණු පසු RFC 7519 ප්‍රමිතියට අනුකූල HMAC-SHA256 JSON Web Token (JWT) එකක් නිකුත් කරයි.
- Firebase Auth සක්‍රීය නම්, Firebase Custom Token එකක් නිකුත් කර ක්ලවුඩ් පරිසරයේදී අදාළ Claims (`role`, `entityId`, `grade`) ආරක්ෂිතව සකසයි.

### 4.3 Cloud Firestore Security Rules
`firestore.rules` ගොනුවේ අඩංගු නීති මඟින් දත්ත ආරක්ෂාව තහවුරු කරයි:
- **Fail-Closed Write Policy:** සියලුම Collections (`students`, `teachers`, `admins`, `attendance`, `deeds`, `badges`, `observations`, `events`, `announcements`, `materials`) සඳහා බ්‍රවුසරයෙන් කෙරෙන සෘජු ලිවීම් සම්පූර්ණයෙන්ම තහනම් කර ඇත (`allow write: if false;`).
- සියලුම දත්ත වෙනස්කම් සිදුවන්නේ සේවාදායකයේ (B_END / Vercel API) ඇති Firebase Admin SDK හරහා පමණි.
- ශිෂ්‍යයන්ට කියවීමේ අවසර ඇත්තේ තමන්ගේම ශිෂ්‍ය වාර්තාවට පමණි (`request.auth.token.entityId == resource.data.regNo`).

---

## 5. සම්පූර්ණ REST API විස්තරය (Complete REST API Reference)

පද්ධතියේ සියලුම සේවාදායක මාර්ග (Endpoints) සහ ඒවායේ ක්‍රියාකාරීත්වය:

| කාණ්ඩය | ක්‍රමය (Method) | මාර්ගය (Endpoint) | විස්තරය |
|---|---|---|---|
| **Health** | `GET` | `/api/health` | පද්ධති තත්ත්වය, ක්‍රියාකාරී දත්ත සමුදාය, සහ ප්‍රධාන වාර්තා ගණන |
| **Database** | `GET` | `/api/db/status` | දත්ත සමුදා සම්බන්ධතා තත්ත්වය සහ විස්තර |
| **Database** | `POST` | `/api/db/reconnect` | දත්ත සමුදාය යළි සම්බන්ධ කිරීම (`{ uri }`) |
| **Auth** | `POST` | `/api/auth/login` | ශිෂ්‍ය, ආචාර්ය, හෝ පරිපාලක පිවිසුම (`{ role, username, pin }`) |
| **Auth** | `GET` | `/api/auth/verify` | සක්‍රීය JWT / Firebase Token වලංගුභාවය පරීක්ෂාව |
| **Students** | `GET` | `/api/students` | සියලුම ශිෂ්‍ය ලැයිස්තුව ලබාගැනීම |
| **Students** | `GET` | `/api/students/:regNo` | එක් ශිෂ්‍යයෙකුගේ සම්පූර්ණ තොරතුරු (පැමිණීම්, ලකුණු, පදක්කම් සහිතව) |
| **Students** | `POST` | `/api/students` | නව ශිෂ්‍යයෙකු ලියාපදිංචි කිරීම |
| **Students** | `PUT` | `/api/students/:regNo` | ශිෂ්‍ය තොරතුරු සංශෝධනය කිරීම |
| **Students** | `DELETE`| `/api/students/:regNo` | ශිෂ්‍ය වාර්තාව සහ ඊට අදාළ සියලු උප වාර්තා ඉවත් කිරීම |
| **Students** | `GET` | `/api/students/export` | ශිෂ්‍ය නාමලේඛනය UTF-8 BOM CSV ගොනුවක් ලෙස බාගත කිරීම (`?grade=...`) |
| **Students** | `GET` | `/api/students/template`| ශිෂ්‍ය ආයාත කිරීම සඳහා හිස් CSV ආකෘතිය බාගත කිරීම |
| **Students** | `POST` | `/api/students/bulk-import` | CSV මඟින් සිසුන් තොග පිටින් පද්ධතියට එක් කිරීම |
| **Exams** | `GET` | `/api/students/:regNo/exams` | ශිෂ්‍යයාගේ විභාග ලකුණු ලබාගැනීම (`?term=1`) |
| **Exams** | `POST` | `/api/students/:regNo/exams` | විභාග ලකුණු ඇතුළත් කිරීම හෝ සංශෝධනය කිරීම |
| **Exams** | `DELETE`| `/api/students/:regNo/exams` | විෂයයක විභාග ලකුණු ඉවත් කිරීම |
| **Exams** | `GET` | `/api/grades/:grade/rankings`| පන්තියේ වාර විභාග ශ්‍රේණිගත කිරීම් (Rankings) ගණනය කර ලබාගැනීම |
| **Exams** | `GET` | `/api/exams/export` | විභාග ලකුණු CSV ගොනුවක් ලෙස බාගත කිරීම |
| **Exams** | `GET` | `/api/exams/template` | විභාග ලකුණු ආයාත කිරීම සඳහා CSV ආකෘතිය |
| **Exams** | `POST` | `/api/exams/bulk-import` | විභාග ලකුණු තොග පිටින් ආයාත කිරීම |
| **Teachers** | `GET` | `/api/teachers` | සියලුම ආචාර්ය මණ්ඩල ලැයිස්තුව ලබාගැනීම |
| **Teachers** | `POST` | `/api/teachers` | නව ආචාර්යවරයෙකු ලියාපදිංචි කිරීම හෝ යාවත්කාලීන කිරීම |
| **Teachers** | `PUT` | `/api/teachers/:id` | ආචාර්ය තොරතුරු යාවත්කාලීන කිරීම |
| **Teachers** | `DELETE`| `/api/teachers/:id` | ආචාර්ය වාර්තාව ඉවත් කිරීම |
| **Attendance**| `GET` | `/api/attendance` | පැමිණීම් වාර්තා ලබාගැනීම (`?grade=...&date=...`) |
| **Attendance**| `POST` | `/api/attendance` | දිනක පන්ති හෝ පෝදා පැමිණීම් සැසියක් සටහන් කිරීම |
| **Deeds** | `GET` | `/api/deeds` | යහපත් ක්‍රියා ලැයිස්තුව ලබාගැනීම (`?regNo=...`) |
| **Deeds** | `POST` | `/api/deeds` | නව යහපත් ක්‍රියාවක් සටහන් කිරීම (+10 ලකුණු) |
| **Deeds** | `DELETE`| `/api/deeds/:id` | යහපත් ක්‍රියා සටහනක් ඉවත් කිරීම |
| **Badges** | `GET` | `/api/badges` | පදක්කම් ලැයිස්තුව (`?regNo=...&status=pending|approved`) |
| **Badges** | `POST` | `/api/badges/nominate` | ආචාර්යවරයෙකු විසින් පදක්කමක් නිර්දේශ කිරීම (Pending) |
| **Badges** | `PUT` | `/api/badges/:id/status`| ප්‍රධානාචාර්යතුමන් විසින් පදක්කම අනුමත හෝ ප්‍රතික්ෂේප කිරීම |
| **Badges** | `PUT` | `/api/badges/:id` | පදක්කම් විස්තර සංශෝධනය කිරීම |
| **Badges** | `DELETE`| `/api/badges/:id` | පදක්කමක් ඉවත් කිරීම |
| **Observations**| `GET`| `/api/observations` | ශිෂ්‍ය චර්යා නිරීක්ෂණ ලබාගැනීම (`?regNo=...`) |
| **Observations**| `POST`| `/api/observations` | නව චර්යා නිරීක්ෂණයක් සටහන් කිරීම |
| **Events** | `GET` | `/api/events` | පාසල් දින දර්ශනයේ වැඩසටහන් ලබාගැනීම |
| **Events** | `POST` | `/api/events` | නව වැඩසටහනක් එක් කිරීම හෝ යාවත්කාලීන කිරීම |
| **Events** | `DELETE`| `/api/events/:id` | වැඩසටහනක් ඉවත් කිරීම |
| **Announce** | `GET` | `/api/announcements` | නිල නිවේදන ලබාගැනීම (`?audience=teachers|students|all`) |
| **Announce** | `POST` | `/api/announcements` | නව නිවේදනයක් නිකුත් කිරීම |
| **Announce** | `DELETE`| `/api/announcements/:id`| නිවේදනයක් ඉවත් කිරීම |
| **Materials** | `GET` | `/api/materials` | අධ්‍යයන ද්‍රව්‍ය සහ නිබන්ධන ලබාගැනීම (`?grade=...`) |
| **Materials** | `POST` | `/api/materials` | නව අධ්‍යයන ද්‍රව්‍යයක් එක් කිරීම |
| **Materials** | `DELETE`| `/api/materials/:id` | අධ්‍යයන ද්‍රව්‍යයක් ඉවත් කිරීම |
| **Analytics** | `GET` | `/api/analytics` | පද්ධතියේ සමස්ත සංඛ්‍යාලේඛන සහ ප්‍රස්තාරික දත්ත |
| **Reports** | `GET` | `/api/reports` | විධායක වාර්තා ලබාගැනීම (`?type=attendance|exams|deeds|teachers`) |

---

## 6. දත්ත ආකෘති සහ ව්‍යුහය (Data Models & Schema Reference)

### 6.1 Students Collection (`students/{docId}`)
```json
{
  "regNo": "DPS/2026/104",
  "name": "සමන් කුමාර පෙරේරා",
  "englishName": "Saman Kumara Perera",
  "grade": "10 ශ්‍රේණිය (Grade 10)",
  "pin": "scrypt:4a8b...:9c1e...",
  "dob": "2010-04-15",
  "photo": "https://images.unsplash.com/... or base64 data URI",
  "guardianName": "කේ. එම්. පෙරේරා මයා",
  "contact": "077 345 6789",
  "address": "නො. 42, පන්සල පාර, කොළඹ 05",
  "attendance": [
    { "date": "2026-05-03", "status": "present", "type": "dhamma_school", "score": 10 }
  ],
  "examMarks": [
    { "subject": "බුද්ධ ධර්මය", "marks": 92, "grade": "A", "term": "1", "year": "2026", "remarks": "විශිෂ්ටයි" }
  ],
  "recommendation": "යහපත් චරිතයකින් යුක්තයි"
}
```

### 6.2 Teachers Collection (`teachers/{docId}`)
```json
{
  "id": "TCH/2026/01",
  "name": "ධර්මසේන අමරසිංහ මයා",
  "grade": "10 ශ්‍රේණිය (Grade 10)",
  "subject": "බුද්ධ ධර්මය",
  "phone": "077 123 4567",
  "role": "ප්‍රධාන ආචාර්ය",
  "status": "active",
  "pin": "scrypt:..."
}
```

### 6.3 Badges Collection (`badges/{docId}`)
```json
{
  "id": "badge_1716000000_1",
  "regNo": "DPS/2026/104",
  "title": "ශීලාචාර චරිත සම්මානය",
  "category": "චරිත සංවර්ධන",
  "status": "approved",
  "icon": "fa-award",
  "nominatedBy": "TCH/2026/01",
  "date": "2026-05-15",
  "description": "අඛණ්ඩව පෝදා අටසිල් සමාදන් වීම උදෙසා"
}
```

---

## 7. පරිසර විචල්‍යයන් සහ වින්‍යාසය (Environment Variables & Configuration)

`B_END/.env` (දේශීය ධාවනය සඳහා) සහ Vercel Environment Variables (Cloud ධාවනය සඳහා) පහත පරිදි සකසන්න:

```env
# ==============================================================
# 1. සේවාදායක වින්‍යාසය (Server Configuration)
# ==============================================================
PORT=5001
NODE_ENV=production

# දත්ත සමුදාය තෝරාගැනීම: firebase (default) හෝ mongodb
DB_PROVIDER=firebase

# ==============================================================
# 2. Google Cloud / Firebase Firestore Configuration
# ==============================================================
FIREBASE_PROJECT_ID=daham-pasala-sadhu-2026
FIRESTORE_DATABASE_ID=(default)

# ක්‍රමය A (Vercel සඳහා වඩාත් නිර්දේශිතයි):
# Google Cloud Console වෙතින් බාගත කළ Service Account JSON ගොනුවේ සම්පූර්ණ අන්තර්ගතය
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"daham-pasala-sadhu-2026",...}

# ක්‍රමය B (දේශීය පරිගණකයේ ගොනුවක් ලෙස තබා ගැනීමට):
# FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# ක්‍රමය C (වෙන් වෙන් පරිසර විචල්‍යයන් ලෙස):
# FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@daham-pasala-sadhu-2026.iam.gserviceaccount.com
# FIREBASE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n"

# ==============================================================
# 3. ආරක්ෂණ සහ JWT යතුරු (Security & Session Keys)
# ==============================================================
JWT_SECRET=daham-pasala-secure-jwt-key-2026-buddhist-council

# ==============================================================
# 4. විකල්ප MongoDB වින්‍යාසය (DB_PROVIDER=mongodb වූ විට පමණි)
# ==============================================================
# MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/daham_pasala
```

---

## 8. ස්ථාපනය සහ ධාවනය කිරීමේ මාර්ගෝපදේශය (Deployment & Setup Guide)

### 8.1 Local Development Setup

1. **Repository එක Clone කර ගැනීම:**
   ```bash
   git clone https://github.com/RaviLak-dev/sadhucharta_v2.git
   cd sadhucharta_v2
   ```

2. **Dependencies ස්ථාපනය කිරීම:**
   ```bash
   npm install
   cd B_END && npm install && cd ..
   ```

3. **පසුපස සේවාදායකය (Backend) ආරම්භ කිරීම:**
   ```bash
   npm start
   # Server runs at http://localhost:5001
   ```

4. **ඉදිරිපස අන්තය (Frontend) විවෘත කිරීම:**
   - బ්‍රවුසරයෙන් සෘජුවම `http://localhost:5001` වෙත පිවිසෙන්න.
   - (හෝ VS Code Live Server මඟින් `F_END/Pages/OnboardingPage.html` විවෘත කරන්න).

---

### 8.2 Vercel Cloud Deployment

පද්ධතිය Vercel හි Zero-Configuration Serverless Architecture එකක් ලෙස ක්‍රියාත්මක වන පරිදි සම්පූර්ණයෙන්ම සකසා ඇත:

1. **Vercel Dashboard එකට පිවිසෙන්න (`vercel.com`).**
2. **"Add New Project"** තෝරා GitHub Repository එක (`sadhucharta_v2`) සම්බන්ධ කරන්න.
3. **Project Settings පරීක්ෂා කරන්න:**
   - **Framework Preset:** `Other` (හෝ Auto-detected `null`).
   - **Root Directory:** `.` (ප්‍රධාන ෆෝල්ඩරයම තබන්න; `F_END` ලෙස වෙනස් නොකරන්න).
   - **Build Command:** හිස්ව තබන්න (No build step required).
   - **Output Directory:** `.` (ප්‍රධාන ෆෝල්ඩරය).
   - **Node.js Version:** `22.x`.
4. **Environment Variables ඇතුළත් කරන්න:**
   - `DB_PROVIDER`: `firebase`
   - `FIREBASE_PROJECT_ID`: `daham-pasala-sadhu-2026`
   - `FIREBASE_SERVICE_ACCOUNT_JSON`: ඔබගේ Firebase Service Account JSON හි සම්පූර්ණ අන්තර්ගතය Paste කරන්න.
   - `JWT_SECRET`: ශක්තිමත් රහස් අක්ෂර මාලාවක්.
5. **Deploy බොත්තම ක්ලික් කරන්න.**
6. සාර්ථකව Deploy වූ පසු ලැබෙන URL එක (උදා: `https://sadhucharta-v2.vercel.app`) මඟින් ඕනෑම උපාංගයකින් පද්ධතිය භාවිතා කළ හැක.

---

### 8.3 Google Cloud / Firebase Setup

1. **Firebase Console (`console.firebase.google.com`)** වෙත ගොස් `daham-pasala-sadhu-2026` ව්‍යාපෘතිය තෝරන්න.
2. **Firestore Database** සක්‍රීය කරන්න (Native Mode තෝරා ආසන්න කලාපයක් තෝරන්න: `asia-south1` - Mumbai නිර්දේශිතයි).
3. **Project Settings -> Service Accounts** වෙත පිවිසෙන්න.
4. **"Generate new private key"** ක්ලික් කර JSON ගොනුව බාගත කරන්න.
5. එම ගොනුවේ අන්තර්ගතය Vercel හි `FIREBASE_SERVICE_ACCOUNT_JSON` පරිසර විචල්‍යයට එක් කරන්න.
6. **Firestore Rules Deploy කිරීම:**
   - පද්ධතියේ ඇති `firestore.rules` ගොනුව Firebase Console හි Firestore Rules ටැබ් එකට Paste කර "Publish" කරන්න:
   ```bash
   firebase deploy --only firestore:rules
   ```

---

## 9. ප්‍රකාශනයට පෙර පිරික්සුම් ලැයිස්තුව (Pre-Publish Checklist)

පාසලට හෝ පොදු පරිශීලනයට ලබාදීමට පෙර පහත පියවර සම්පූර්ණ වී ඇත්දැයි තහවුරු කරගන්න:

- [x] **Firebase Service Account JSON සක්‍රීයද:** Vercel Environment Variables වල `FIREBASE_SERVICE_ACCOUNT_JSON` නිවැරදිව ලබාදී තිබීම.
- [x] **Vercel Root Directory නිවැරදිද:** Settings -> General -> Root Directory අගය `.` වී තිබීම (`F_END` නොවේ).
- [x] **Node.js Version ගැලපේද:** Vercel Settings හි Node.js 22.x තෝරා තිබීම.
- [x] **Firestore Security Rules ප්‍රකාශිතද:** `firestore.rules` මඟින් සෘජු Client Writes අවහිර කර තිබීම.
- [x] **පෙරනිමි රහස් අංක (Default PINs) වෙනස් කිරීම:** ප්‍රධානාචාර්ය සහ ආචාර්යවරුන්ගේ මූලික PIN අංක පළමු පිවිසුමෙන් පසු සුරක්ෂිතව වෙනස් කරවීම.
- [x] **තත්ත්ව ලාංඡනය (Status Pill) කොළ/තැඹිලි පැහැයෙන් දිස්වීම:** බ්‍රවුසරයේ ඉහළ කෙළවරේ `Backend: Firebase (Live)` ලෙස දිස්වීම.
- [x] **Sinhala Excel CSV සහයෝගය:** UTF-8 BOM සහිතව ශිෂ්‍ය දත්ත අපනයනය පරික්ෂා කර තිබීම.
- [x] **PDF ප්‍රගති වාර්තා පරීක්ෂාව:** Teacher සහ Student ද්වාරයන්ගෙන් වාර්තා කාඩ්පත් නිවැරදිව සිංහල අකුරු සහිතව PDF ලෙස මුද්‍රණය වීම.

---

## 10. දෝෂ නිරාකරණය සහ නිතර අසන ප්‍රශ්න (Troubleshooting & FAQs)

### ප්‍රශ්නය 1: බ්‍රවුසරයේ ඉහළ "Local Browser Mode (Offline)" හෝ "Memory Only" ලෙස දිස්වන්නේ ඇයි?
**පිළිතුර:**
1. ඔබ Vercel හි Deploy කර ඇත්නම්, Vercel Environment Variables වල `FIREBASE_SERVICE_ACCOUNT_JSON` ලබාදී නොතිබීම හෝ අගය වැරදි වීම ප්‍රධාන හේතුවයි.
2. Vercel හි Serverless Cold Start එකක් සිදුවන අවස්ථාවේ පළමු තත්පර 1-2 තුළ Badge එක Local පෙන්විය හැකි අතර, තත්පර කිහිපයකින් ස්වයංක්‍රීයව `Firebase (Live)` බවට පත්වේ. Badge එක මත ක්ලික් කිරීමෙන් ක්ෂණිකව Re-check කළ හැක.
3. දේශීය පරිගණකයේ ධාවනය කරන්නේ නම් `B_END/.env` ගොනුව පරීක්ෂා කරන්න.

### ප්‍රශ්නය 2: Vercel මතදී සිසුවෙකු ඇතුළත් කළ විට Firebase එකට එකතු නොවන්නේ ඇයි?
**පිළිතුර:**
1. පද්ධතියේ Frontend එක Backend හා සම්බන්ධ නොවී Offline පවතින විට, සිසුන් ලියාපදිංචි වන්නේ බ්‍රවුසරයේ `localStorage` එකට පමණි.
2. විසඳුම: Vercel Dashboard -> Settings -> Environment Variables වෙත ගොස් `FIREBASE_SERVICE_ACCOUNT_JSON` නිවැරදිව ලබාදී Redeploy කරන්න. ඉන්පසු Badge එක `Backend: Firebase (Live)` බවට පත් වූ පසු සිසුන් ඇතුළත් කරන්න.

### ප්‍රශ්නය 3: ආරම්භක දත්ත (Seed Data) නැවත ලබාගන්නේ කෙසේද?
**පිළිතුර:**
පද්ධතිය ප්‍රථම වරට හිස් Firestore හෝ MongoDB දත්ත සමුදායකට සම්බන්ධ වූ විට, `B_END/seed-data.js` හි අඩංගු මූලික ශිෂ්‍ය, ආචාර්ය සහ වැඩසටහන් දත්ත ස්වයංක්‍රීයව දත්ත සමුදායට ඇතුළත් වේ.

---
**සකස් කළේ:** දහම් පාසල් මෘදුකාංග සංවර්ධන කණ්ඩායම  
**ප්‍රකාශන හිමිකම:** © 2026 ශ්‍රී සුගත ධර්ම විද්‍යාලය. All Rights Reserved.
