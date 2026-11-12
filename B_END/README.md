# Daham Pasala Sadhu Charya - Backend Server (B_END)

දහම් පාසල් ශිෂ්‍ය සාධුවරයා ඩිජිටල් පද්ධතියේ REST API පසුපස අන්තය (Backend Server).

## 🚀 Quick Start (ආරම්භ කිරීම)

To run the backend server:

```bash
cd "B_END"
npm start
```

Default listening URL:
- **Server Address:** `http://localhost:5001`
- **Health Check Endpoint:** `http://localhost:5001/api/health`

---

## 🍃 MongoDB Integration & Setup

The backend connects to MongoDB using Mongoose and supports both local MongoDB and MongoDB Atlas (Cloud).

### 1. Configure Connection (`.env`)
Copy `.env.example` to `.env` or edit `.env` directly:

```env
PORT=5001

# Option A: Local MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/daham_pasala

# Option B: MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/daham_pasala?retryWrites=true&w=majority

USE_MONGO=true
```

### 2. Seed MongoDB Collections
To populate your MongoDB database with the default Daham Pasala seed records (Students, Teachers, Events, Badges, Deeds, Materials, Announcements):

```bash
cd "B_END"
npm run seed:mongo
```

To clear and force re-seed:
```bash
npm run seed:mongo -- --force
```

### 3. Resilient Dual-Adapter Architecture
- If MongoDB is running and connected, all queries read and write directly to MongoDB.
- If MongoDB is temporarily stopped or offline, the server gracefully falls back to the human-readable JSON database (`B_END/data/*.json`) with zero downtime.

---

## 🗄 Mongoose Schemas & Collections

Defined in `B_END/models/`:
- `Student`: `models/Student.js` - ශිෂ්‍ය තොරතුරු, පැමිණීම්, විභාග ලකුණු, ඡායාරූප
- `Teacher`: `models/Teacher.js` - ආචාර්ය මණ්ඩල තොරතුරු, පැවරුම් පන්ති
- `Admin`: `models/Admin.js` - ප්‍රධානාචාර්ය / පරිපාලන ගිණුම්
- `Attendance`: `models/Attendance.js` - පන්ති පැමිණීම් සහ පෝදා අටසිල් පැමිණීම්
- `Deed`: `models/Deed.js` - ශිෂ්‍ය යහපත් ක්‍රියාකාරකම්
- `Badge`: `models/Badge.js` - කුසලතා සම්මාන සහ පදක්කම්
- `Observation`: `models/Observation.js` - ශිෂ්‍ය චර්යා නිරීක්ෂණ
- `Event`: `models/Event.js` - පාසල් දින දර්ශනය සහ වැඩසටහන්
- `Announcement`: `models/Announcement.js` - නිල නිවේදන
- `Material`: `models/Material.js` - ධර්ම නිබන්ධන සහ අධ්‍යයන ද්‍රව්‍ය

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend status, DB mode (`mongodb` / `json_file_fallback`), & counters |
| `POST` | `/api/auth/login` | Student, Teacher, and Admin authentication |
| `GET` | `/api/students` | Get all students (Dictionary / Object) |
| `GET` | `/api/students/:regNo` | Get single student details |
| `POST` | `/api/students` | Register or update student with photo |
| `DELETE`| `/api/students/:regNo` | Remove student |
| `GET` | `/api/teachers` | Get all faculty members |
| `POST` | `/api/teachers` | Register or update teacher |
| `DELETE`| `/api/teachers/:id` | Remove teacher |
| `GET` | `/api/attendance` | Get attendance session logs |
| `POST` | `/api/attendance` | Record class or Sil day attendance session |
| `GET` | `/api/deeds` | Get good deeds |
| `POST` | `/api/deeds` | Record a good deed |
| `DELETE`| `/api/deeds/:id` | Delete deed |
| `GET` | `/api/badges` | Get badges (supports `?status=pending`) |
| `POST` | `/api/badges/nominate` | Nominate badge (status: pending) |
| `PUT` | `/api/badges/:id/status`| Approve or reject badge (`status: approved`) |
| `GET` | `/api/events` | List upcoming school events |
| `POST` | `/api/events` | Add or update calendar event |
| `DELETE`| `/api/events/:id` | Delete calendar event |
| `GET` | `/api/announcements` | Get official announcements |
| `POST` | `/api/announcements` | Publish new announcement |
| `DELETE`| `/api/announcements/:id`| Remove announcement |
| `GET` | `/api/materials` | Get downloadable study materials |
| `POST` | `/api/materials` | Upload study material |
| `DELETE`| `/api/materials/:id` | Remove study material |
| `GET` | `/api/analytics` | Executive statistics & KPI metrics |
| `GET` | `/api/reports` | Exportable report datasets (`type=attendance\|exams\|deeds\|teachers`) |
