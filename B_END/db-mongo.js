const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();
const mongoose = require('mongoose');
mongoose.set('bufferCommands', false);

// Import Mongoose Models
const Student = require('./models/Student');
const Teacher = require('./models/Teacher');
const Admin = require('./models/Admin');
const Attendance = require('./models/Attendance');
const Deed = require('./models/Deed');
const Badge = require('./models/Badge');
const Observation = require('./models/Observation');
const Event = require('./models/Event');
const Announcement = require('./models/Announcement');
const Material = require('./models/Material');
const { SEED_DATA } = require('./seed-mongo');

class MongoDatabase {
  constructor() {
    this.isConnected = false;
    this.isConnecting = false;
    this.connectionError = null;
    this.retryTimer = null;
    this.initMemoryStore();
    this.setupListeners();
    this.init();
  }

  initMemoryStore() {
    const clone = (data) => JSON.parse(JSON.stringify(data || []));
    this.memStore = {
      students: clone(SEED_DATA.students),
      teachers: clone(SEED_DATA.teachers),
      admins: clone(SEED_DATA.admins),
      events: clone(SEED_DATA.events),
      announcements: clone(SEED_DATA.announcements),
      materials: clone(SEED_DATA.materials),
      deeds: clone(SEED_DATA.deeds),
      badges: clone(SEED_DATA.badges),
      observations: clone(SEED_DATA.observations),
      attendance: []
    };
  }

  get isLive() {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  setupListeners() {
    mongoose.connection.on('connected', () => {
      this.isConnected = true;
      this.isConnecting = false;
      this.connectionError = null;
      console.log('✅ MongoDB connection established.');
    });

    mongoose.connection.on('error', (err) => {
      this.isConnected = false;
      this.connectionError = err.message;
      console.warn('⚠️ MongoDB connection error (using high-speed offline fallback):', err.message);
      this.scheduleRetry();
    });

    mongoose.connection.on('disconnected', () => {
      this.isConnected = false;
      console.warn('⚠️ MongoDB disconnected. Using in-memory fallback store...');
      this.scheduleRetry();
    });

    mongoose.connection.on('reconnected', () => {
      this.isConnected = true;
      this.isConnecting = false;
      this.connectionError = null;
      console.log('✅ MongoDB reconnected successfully.');
    });
  }

  async init(customUri = null) {
    if (this.isConnecting) return;
    if (this.isConnected && mongoose.connection.readyState === 1 && !customUri) return;

    const uri = customUri || process.env.MONGODB_URI;
    if (!uri) {
      this.connectionError = 'MONGODB_URI is not defined in environment.';
      console.warn('⚠️ MONGODB_URI missing in .env - Running in offline fallback mode.');
      return;
    }

    this.isConnecting = true;

    try {
      if (mongoose.connection.readyState !== 0 && customUri) {
        await mongoose.disconnect();
      }
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 8000,
          socketTimeoutMS: 30000,
          maxPoolSize: 10,
          minPoolSize: 1
        });
      }
      this.isConnected = true;
      this.isConnecting = false;
      this.connectionError = null;
      console.log(`✅ Connected to MongoDB Atlas successfully: ${uri.replace(/\/\/.*@/, '//***:***@')}`);
    } catch (err) {
      this.isConnected = false;
      this.isConnecting = false;
      this.connectionError = err.message;
      console.warn(`⚠️ MongoDB Atlas offline or network isolated: ${err.message}. Seamlessly using in-memory store.`);
      this.scheduleRetry();
    }
  }

  scheduleRetry() {
    if (this.retryTimer) return;
    this.retryTimer = setTimeout(async () => {
      this.retryTimer = null;
      if (!this.isConnected && !this.isConnecting && mongoose.connection.readyState === 0) {
        await this.init();
      }
    }, 15000);
  }

  async reconnect(newUri = null) {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    if (newUri) {
      process.env.MONGODB_URI = newUri;
      if (mongoose.connection.readyState !== 0) {
        try { await mongoose.disconnect(); } catch (e) {}
      }
    }
    await this.init(newUri);
    return {
      success: this.isConnected,
      database: this.isConnected ? 'mongodb' : 'memory_fallback',
      error: this.connectionError
    };
  }

  // --- Safe Helper for PIN upgrades ---
  async updateStudentPin(regNo, newPin) {
    const s = this.memStore.students.find(x => x.regNo === regNo);
    if (s) s.pin = newPin;
    if (this.isLive) {
      try { await Student.updateOne({ regNo }, { $set: { pin: newPin } }); } catch (e) {}
    }
  }

  async updateTeacherPin(id, newPin) {
    const t = this.memStore.teachers.find(x => x.id === id);
    if (t) t.pin = newPin;
    if (this.isLive) {
      try { await Teacher.updateOne({ id }, { $set: { pin: newPin } }); } catch (e) {}
    }
  }

  async updateAdminPin(id, newPin) {
    const a = this.memStore.admins.find(x => x.id === id);
    if (a) a.pin = newPin;
    if (this.isLive) {
      try { await Admin.updateOne({ id }, { $set: { pin: newPin } }); } catch (e) {}
    }
  }

  // ==========================================
  // --- Students CRUD ---
  // ==========================================
  async getAllStudents() {
    if (this.isLive) {
      try {
        const list = await Student.find({}).lean();
        const obj = {};
        list.forEach(s => { obj[s.regNo] = s; });
        return obj;
      } catch (err) {
        console.warn('MongoDB getAllStudents failed, using memory store:', err.message);
      }
    }
    const obj = {};
    this.memStore.students.forEach(s => { obj[s.regNo] = s; });
    return obj;
  }

  async getStudent(regNo) {
    if (this.isLive) {
      try {
        const found = await Student.findOne({ regNo }).lean();
        if (found) return found;
      } catch (err) {
        console.warn('MongoDB getStudent failed, using memory store:', err.message);
      }
    }
    return this.memStore.students.find(s => s.regNo === regNo) || null;
  }

  async saveStudent(studentData) {
    const { regNo } = studentData;
    if (!regNo) throw new Error('regNo is required');

    // Update memory store
    const idx = this.memStore.students.findIndex(s => s.regNo === regNo);
    if (idx >= 0) {
      this.memStore.students[idx] = { ...this.memStore.students[idx], ...studentData };
    } else {
      this.memStore.students.push({
        attendance: [],
        examMarks: [],
        ...studentData
      });
    }
    const memResult = this.memStore.students.find(s => s.regNo === regNo);

    if (this.isLive) {
      try {
        const updated = await Student.findOneAndUpdate(
          { regNo },
          { $set: studentData },
          { returnDocument: 'after', upsert: true, runValidators: true }
        ).lean();
        return updated || memResult;
      } catch (err) {
        console.warn('MongoDB saveStudent failed, saved to memory store:', err.message);
      }
    }
    return memResult;
  }

  // --- Grading Standards & Helpers ---
  static calculateDhammaGrade(marks) {
    const m = Number(marks);
    if (isNaN(m)) return 'W';
    if (m >= 75) return 'A';
    if (m >= 65) return 'B';
    if (m >= 50) return 'C';
    if (m >= 35) return 'S';
    return 'W';
  }

  static calculateDhammaGradeLabel(grade) {
    switch (grade) {
      case 'A': return 'විශිෂ්ට සාමාර්ථය (Distinction)';
      case 'B': return 'ඉතා හොඳ සාමාර්ථය (Very Good)';
      case 'C': return 'සම්මාන සාමාර්ථය (Credit)';
      case 'S': return 'සාමාන්‍ය සාමාර්ථය (Simple Pass)';
      case 'W':
      default: return 'අසමත් / ප්‍රගතිය වැඩිදියුණු විය යුතුය (Needs Improvement)';
    }
  }

  async deleteStudent(regNo) {
    if (!regNo) return false;

    // Remove from memory store
    this.memStore.badges = this.memStore.badges.filter(b => b.regNo !== regNo);
    this.memStore.deeds = this.memStore.deeds.filter(d => d.regNo !== regNo);
    this.memStore.observations = this.memStore.observations.filter(o => o.regNo !== regNo);
    const beforeLen = this.memStore.students.length;
    this.memStore.students = this.memStore.students.filter(s => s.regNo !== regNo);
    const memDeleted = this.memStore.students.length < beforeLen;

    if (this.isLive) {
      try {
        await Badge.deleteMany({ regNo });
        await Deed.deleteMany({ regNo });
        await Observation.deleteMany({ regNo });
        await Attendance.updateMany(
          { 'records.regNo': regNo },
          { $pull: { records: { regNo } } }
        );
        const res = await Student.deleteOne({ regNo });
        return res.deletedCount > 0;
      } catch (err) {
        console.warn('MongoDB deleteStudent failed, removed from memory store:', err.message);
      }
    }
    return memDeleted;
  }

  // --- Student Profile with Populated Relations & Class Rank ---
  async getStudentProfileWithRelations(regNo) {
    if (!regNo) return null;
    const student = await this.getStudent(regNo);
    if (!student) return null;

    let approvedBadges = [];
    let allBadges = [];
    let deeds = [];
    let observations = [];

    if (this.isLive) {
      try {
        [approvedBadges, allBadges, deeds, observations] = await Promise.all([
          Badge.find({ regNo, status: 'approved' }).sort({ date: -1 }).lean(),
          Badge.find({ regNo }).sort({ date: -1 }).lean(),
          Deed.find({ regNo }).sort({ date: -1 }).lean(),
          Observation.find({ regNo }).sort({ date: -1 }).lean()
        ]);
      } catch (err) {
        approvedBadges = this.memStore.badges.filter(b => b.regNo === regNo && b.status === 'approved');
        allBadges = this.memStore.badges.filter(b => b.regNo === regNo);
        deeds = this.memStore.deeds.filter(d => d.regNo === regNo);
        observations = this.memStore.observations.filter(o => o.regNo === regNo);
      }
    } else {
      approvedBadges = this.memStore.badges.filter(b => b.regNo === regNo && b.status === 'approved');
      allBadges = this.memStore.badges.filter(b => b.regNo === regNo);
      deeds = this.memStore.deeds.filter(d => d.regNo === regNo);
      observations = this.memStore.observations.filter(o => o.regNo === regNo);
    }

    let rankInfo = null;
    if (student.grade) {
      try {
        const classRankings = await this.calculateClassRankings(student.grade);
        const studentEntry = (classRankings.students || []).find(s => s.regNo === regNo);
        if (studentEntry) {
          rankInfo = {
            rank: studentEntry.rank,
            totalStudents: classRankings.totalStudents,
            rankLabel: `${String(studentEntry.rank).padStart(2, '0')} / ${String(classRankings.totalStudents).padStart(2, '0')}`,
            cumulativeAverage: studentEntry.cumulativeAverage,
            overallGrade: studentEntry.overallGrade,
            classAverage: classRankings.classAverage
          };
        }
      } catch (e) {}
    }

    return {
      ...student,
      approvedBadges,
      allBadges,
      deeds,
      observations,
      rankInfo
    };
  }

  // --- Pinpoint Class Rankings & 3-Term Performance Aggregator ---
  async calculateClassRankings(grade, year = '2026') {
    if (!grade) throw new Error('Grade is required for class ranking calculation.');

    let students = [];
    if (this.isLive) {
      try {
        students = await Student.find({
          $or: [
            { grade: grade },
            { grade: new RegExp(grade.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }
          ]
        }).lean();
      } catch (err) {
        students = this.memStore.students.filter(s => s.grade && s.grade.toLowerCase().includes(grade.toLowerCase()));
      }
    } else {
      students = this.memStore.students.filter(s => s.grade && s.grade.toLowerCase().includes(grade.toLowerCase()));
    }

    const rankingRows = [];

    students.forEach(student => {
      const marksList = (student.examMarks || []).filter(
        m => String(m.year || '2026') === String(year)
      );

      const subjectMap = {};
      marksList.forEach(m => {
        const sub = m.subject || 'බුද්ධ ධර්මය';
        if (!subjectMap[sub]) {
          subjectMap[sub] = { term1: null, term2: null, term3: null, remarks: '' };
        }
        const t = String(m.term || '1');
        if (t === '1') subjectMap[sub].term1 = Number(m.marks);
        else if (t === '2') subjectMap[sub].term2 = Number(m.marks);
        else if (t === '3') subjectMap[sub].term3 = Number(m.marks);

        if (m.remarks) subjectMap[sub].remarks = m.remarks;
      });

      let totalCumulativeMarks = 0;
      let totalMarkEntries = 0;
      let term1Sum = 0, term1Count = 0;
      let term2Sum = 0, term2Count = 0;
      let term3Sum = 0, term3Count = 0;

      const subjectBreakdown = Object.keys(subjectMap).map(sub => {
        const d = subjectMap[sub];
        let subSum = 0;
        let subCount = 0;
        if (d.term1 !== null) { subSum += d.term1; subCount++; term1Sum += d.term1; term1Count++; }
        if (d.term2 !== null) { subSum += d.term2; subCount++; term2Sum += d.term2; term2Count++; }
        if (d.term3 !== null) { subSum += d.term3; subCount++; term3Sum += d.term3; term3Count++; }

        totalCumulativeMarks += subSum;
        totalMarkEntries += subCount;

        const subAvg = subCount > 0 ? Number((subSum / subCount).toFixed(1)) : 0;
        const subGrade = MongoDatabase.calculateDhammaGrade(subAvg);

        return {
          subject: sub,
          term1: d.term1,
          term2: d.term2,
          term3: d.term3,
          average: subAvg,
          grade: subGrade,
          remarks: d.remarks
        };
      });

      const term1Avg = term1Count > 0 ? Number((term1Sum / term1Count).toFixed(1)) : null;
      const term2Avg = term2Count > 0 ? Number((term2Sum / term2Count).toFixed(1)) : null;
      const term3Avg = term3Count > 0 ? Number((term3Sum / term3Count).toFixed(1)) : null;

      const cumulativeAverage = totalMarkEntries > 0
        ? Number((totalCumulativeMarks / totalMarkEntries).toFixed(1))
        : 0;
      const overallGrade = MongoDatabase.calculateDhammaGrade(cumulativeAverage);
      const overallGradeLabel = MongoDatabase.calculateDhammaGradeLabel(overallGrade);

      rankingRows.push({
        regNo: student.regNo,
        name: student.name,
        grade: student.grade,
        term1Avg,
        term2Avg,
        term3Avg,
        totalCumulativeMarks,
        totalMarkEntries,
        subjectCount: Object.keys(subjectMap).length,
        cumulativeAverage,
        overallGrade,
        overallGradeLabel,
        subjectBreakdown
      });
    });

    rankingRows.sort((a, b) => {
      if (b.cumulativeAverage !== a.cumulativeAverage) {
        return b.cumulativeAverage - a.cumulativeAverage;
      }
      if (b.totalCumulativeMarks !== a.totalCumulativeMarks) {
        return b.totalCumulativeMarks - a.totalCumulativeMarks;
      }
      return a.name.localeCompare(b.name);
    });

    for (let i = 0; i < rankingRows.length; i++) {
      if (i > 0) {
        const prev = rankingRows[i - 1];
        const curr = rankingRows[i];
        if (curr.cumulativeAverage === prev.cumulativeAverage && curr.totalCumulativeMarks === prev.totalCumulativeMarks) {
          curr.rank = prev.rank;
        } else {
          curr.rank = i + 1;
        }
      } else {
        rankingRows[i].rank = 1;
      }
    }

    const totalStudents = rankingRows.length;
    const gradeCounts = { A: 0, B: 0, C: 0, S: 0, W: 0 };
    let totalAvgSum = 0;
    let highestAvg = 0;
    let lowestAvg = totalStudents > 0 ? 100 : 0;

    rankingRows.forEach(r => {
      gradeCounts[r.overallGrade] = (gradeCounts[r.overallGrade] || 0) + 1;
      totalAvgSum += r.cumulativeAverage;
      if (r.cumulativeAverage > highestAvg) highestAvg = r.cumulativeAverage;
      if (r.cumulativeAverage < lowestAvg) lowestAvg = r.cumulativeAverage;
    });

    const classAverage = totalStudents > 0 ? Number((totalAvgSum / totalStudents).toFixed(1)) : 0;
    const passCount = totalStudents - (gradeCounts['W'] || 0);
    const passRate = totalStudents > 0 ? Math.round((passCount / totalStudents) * 100) : 0;

    return {
      grade,
      year,
      totalStudents,
      classAverage,
      highestAverage: highestAvg,
      lowestAverage: lowestAvg,
      passRate,
      gradeCounts,
      students: rankingRows
    };
  }

  // --- Student Exam Marks ---
  async saveStudentExamMark(regNo, examData) {
    if (!regNo) throw new Error('regNo is required');
    const term = String(examData.term || '1');
    const year = String(examData.year || '2026');
    const subject = String(examData.subject || '').trim();
    if (!subject) throw new Error('Subject is required.');

    const marks = Number(examData.marks);
    if (isNaN(marks) || marks < 0 || marks > 100) {
      throw new Error('Marks must be a valid number between 0 and 100.');
    }

    const grade = MongoDatabase.calculateDhammaGrade(marks);
    const remarks = examData.remarks || '';
    const newMarkEntry = { term, year, subject, marks, grade, remarks };

    // Update in memory store
    const memStudent = this.memStore.students.find(s => s.regNo === regNo);
    if (memStudent) {
      if (!Array.isArray(memStudent.examMarks)) memStudent.examMarks = [];
      const exIdx = memStudent.examMarks.findIndex(
        m => String(m.term || '1') === term && String(m.year || '2026') === year && m.subject === subject
      );
      if (exIdx >= 0) memStudent.examMarks[exIdx] = newMarkEntry;
      else memStudent.examMarks.push(newMarkEntry);
    }

    if (this.isLive) {
      try {
        const student = await Student.findOne({ regNo });
        if (student) {
          const marksList = Array.isArray(student.examMarks) ? student.examMarks : [];
          const existingIndex = marksList.findIndex(
            m => String(m.term || '1') === term && String(m.year || '2026') === year && m.subject === subject
          );
          if (existingIndex >= 0) marksList[existingIndex] = newMarkEntry;
          else marksList.push(newMarkEntry);

          student.examMarks = marksList;
          student.markModified('examMarks');
          await student.save();
          return student.toObject();
        }
      } catch (err) {
        console.warn('MongoDB saveStudentExamMark failed, saved to memory:', err.message);
      }
    }

    if (!memStudent) throw new Error('Student not found: ' + regNo);
    return memStudent;
  }

  async deleteStudentExamMark(regNo, term, subject, year = '2026') {
    if (!regNo) throw new Error('regNo is required');
    const termStr = String(term || '1');
    const yearStr = String(year || '2026');

    let memDeleted = false;
    const memStudent = this.memStore.students.find(s => s.regNo === regNo);
    if (memStudent && Array.isArray(memStudent.examMarks)) {
      const orig = memStudent.examMarks.length;
      memStudent.examMarks = memStudent.examMarks.filter(
        m => !(String(m.term || '1') === termStr && String(m.year || '2026') === yearStr && m.subject === subject)
      );
      memDeleted = memStudent.examMarks.length < orig;
    }

    if (this.isLive) {
      try {
        const student = await Student.findOne({ regNo });
        if (student) {
          const originalLength = (student.examMarks || []).length;
          student.examMarks = (student.examMarks || []).filter(
            m => !(String(m.term || '1') === termStr && String(m.year || '2026') === yearStr && m.subject === subject)
          );
          if (student.examMarks.length !== originalLength) {
            await student.save();
            return true;
          }
        }
      } catch (err) {
        console.warn('MongoDB deleteStudentExamMark failed:', err.message);
      }
    }
    return memDeleted;
  }

  // ==========================================
  // --- Teachers CRUD ---
  // ==========================================
  async getAllTeachers() {
    if (this.isLive) {
      try {
        return await Teacher.find({}).lean();
      } catch (err) {
        console.warn('MongoDB getAllTeachers failed, using memory store:', err.message);
      }
    }
    return this.memStore.teachers;
  }

  async getTeacher(id) {
    if (this.isLive) {
      try {
        const found = await Teacher.findOne({ id }).lean();
        if (found) return found;
      } catch (err) {
        console.warn('MongoDB getTeacher failed, using memory store:', err.message);
      }
    }
    return this.memStore.teachers.find(t => t.id === id) || null;
  }

  async saveTeacher(teacherData) {
    const { id } = teacherData;
    if (!id) throw new Error('Teacher id is required');

    const idx = this.memStore.teachers.findIndex(t => t.id === id);
    if (idx >= 0) {
      this.memStore.teachers[idx] = { ...this.memStore.teachers[idx], ...teacherData };
    } else {
      this.memStore.teachers.push({ ...teacherData });
    }
    const memResult = this.memStore.teachers.find(t => t.id === id);

    if (this.isLive) {
      try {
        const updated = await Teacher.findOneAndUpdate(
          { id },
          { $set: teacherData },
          { returnDocument: 'after', upsert: true }
        ).lean();
        return updated || memResult;
      } catch (err) {
        console.warn('MongoDB saveTeacher failed, saved to memory store:', err.message);
      }
    }
    return memResult;
  }

  async deleteTeacher(id) {
    if (!id) return false;
    const beforeLen = this.memStore.teachers.length;
    this.memStore.teachers = this.memStore.teachers.filter(t => t.id !== id);
    const memDeleted = this.memStore.teachers.length < beforeLen;

    if (this.isLive) {
      try {
        const res = await Teacher.deleteOne({ id });
        return res.deletedCount > 0;
      } catch (err) {
        console.warn('MongoDB deleteTeacher failed, removed from memory:', err.message);
      }
    }
    return memDeleted;
  }

  // ==========================================
  // --- Attendance Management ---
  // ==========================================
  async getAttendance(query = {}) {
    let result = [];
    if (this.isLive) {
      try {
        const filter = {};
        if (query.date) filter.date = query.date;
        if (query.grade) filter.grade = query.grade;
        if (query.type) filter.type = query.type;
        result = await Attendance.find(filter).sort({ date: -1 }).lean();
        if (result.length > 0) return result;
      } catch (err) {}
    }

    let list = this.memStore.attendance;
    if (query.date) list = list.filter(a => a.date === query.date);
    if (query.grade) list = list.filter(a => a.grade && a.grade.includes(query.grade));
    if (query.type) list = list.filter(a => a.type === query.type);
    return list;
  }

  async recordAttendance(attendanceData) {
    const { date, grade, type, records } = attendanceData;
    if (!date || !records) throw new Error('date and records are required');

    const entry = {
      date,
      grade: grade || '10 ශ්‍රේණිය',
      type: type || 'dhamma_school',
      records: records || []
    };

    // Update in memory store
    const existingIdx = this.memStore.attendance.findIndex(
      a => a.date === date && a.grade === grade && a.type === type
    );
    if (existingIdx >= 0) this.memStore.attendance[existingIdx] = entry;
    else this.memStore.attendance.push(entry);

    // Also update student attendance arrays in memory
    for (const r of (records || [])) {
      const student = this.memStore.students.find(s => s.regNo === r.regNo);
      if (student) {
        if (!Array.isArray(student.attendance)) student.attendance = [];
        const attIdx = student.attendance.findIndex(a => a.date === date);
        const attEntry = {
          date,
          status: r.status || 'present',
          type: type || 'dhamma_school',
          event: r.event,
          broughtFlowers: r.broughtFlowers || false,
          score: r.score || 10,
          remarks: r.remarks || ''
        };
        if (attIdx >= 0) student.attendance[attIdx] = attEntry;
        else student.attendance.unshift(attEntry);
      }
    }

    if (this.isLive) {
      try {
        const saved = await Attendance.findOneAndUpdate(
          { date, grade, type },
          { $set: attendanceData },
          { returnDocument: 'after', upsert: true }
        ).lean();

        for (const r of (records || [])) {
          await Student.updateOne(
            { regNo: r.regNo },
            {
              $pull: { attendance: { date } }
            }
          );
          await Student.updateOne(
            { regNo: r.regNo },
            {
              $push: {
                attendance: {
                  $each: [{
                    date,
                    status: r.status || 'present',
                    type: type || 'dhamma_school',
                    event: r.event,
                    broughtFlowers: r.broughtFlowers || false,
                    score: r.score || 10,
                    remarks: r.remarks || ''
                  }],
                  $position: 0
                }
              }
            }
          );
        }
        return saved || entry;
      } catch (err) {
        console.warn('MongoDB recordAttendance failed, recorded to memory:', err.message);
      }
    }

    return entry;
  }

  // ==========================================
  // --- Good Deeds (යහපත් ක්‍රියා) ---
  // ==========================================
  async getAllDeeds(regNo = null) {
    if (this.isLive) {
      try {
        const filter = regNo ? { regNo } : {};
        return await Deed.find(filter).sort({ date: -1 }).lean();
      } catch (err) {}
    }
    if (regNo) return this.memStore.deeds.filter(d => d.regNo === regNo);
    return this.memStore.deeds;
  }

  async addDeed(deedData) {
    const id = deedData.id || 'deed-' + Date.now();
    const doc = { id, ...deedData };
    this.memStore.deeds.unshift(doc);

    if (this.isLive) {
      try {
        const created = await Deed.create(doc);
        return created.toObject();
      } catch (err) {
        console.warn('MongoDB addDeed failed, saved to memory:', err.message);
      }
    }
    return doc;
  }

  async deleteDeed(id) {
    const orig = this.memStore.deeds.length;
    this.memStore.deeds = this.memStore.deeds.filter(d => d.id !== id);
    const memDeleted = this.memStore.deeds.length < orig;

    if (this.isLive) {
      try {
        const res = await Deed.deleteOne({ id });
        return res.deletedCount > 0;
      } catch (err) {}
    }
    return memDeleted;
  }

  // ==========================================
  // --- Badges & Honors (කුසලතා සම්මාන) ---
  // ==========================================
  async getAllBadges(regNo = null, status = null) {
    if (this.isLive) {
      try {
        const filter = {};
        if (regNo) filter.regNo = regNo;
        if (status) filter.status = status;
        return await Badge.find(filter).sort({ date: -1 }).lean();
      } catch (err) {}
    }
    let list = this.memStore.badges;
    if (regNo) list = list.filter(b => b.regNo === regNo);
    if (status) list = list.filter(b => b.status === status);
    return list;
  }

  async nominateBadge(badgeData) {
    const id = badgeData.id || 'badge-' + Date.now();
    const badge = { id, status: 'pending', ...badgeData };
    this.memStore.badges.unshift(badge);

    if (this.isLive) {
      try {
        const created = await Badge.create(badge);
        return created.toObject();
      } catch (err) {
        console.warn('MongoDB nominateBadge failed, saved to memory:', err.message);
      }
    }
    return badge;
  }

  async updateBadgeStatus(id, status) {
    const b = this.memStore.badges.find(x => x.id === id);
    if (b) b.status = status;

    if (this.isLive) {
      try {
        const updated = await Badge.findOneAndUpdate(
          { id },
          { $set: { status } },
          { returnDocument: 'after' }
        ).lean();
        return updated || b;
      } catch (err) {}
    }
    return b;
  }

  async updateBadge(id, updateData) {
    const idx = this.memStore.badges.findIndex(x => x.id === id);
    if (idx >= 0) this.memStore.badges[idx] = { ...this.memStore.badges[idx], ...updateData };
    const b = this.memStore.badges[idx];

    if (this.isLive) {
      try {
        const updated = await Badge.findOneAndUpdate(
          { id },
          { $set: updateData },
          { returnDocument: 'after' }
        ).lean();
        return updated || b;
      } catch (err) {}
    }
    return b;
  }

  async deleteBadge(id) {
    const orig = this.memStore.badges.length;
    this.memStore.badges = this.memStore.badges.filter(b => b.id !== id);
    const memDeleted = this.memStore.badges.length < orig;

    if (this.isLive) {
      try {
        const res = await Badge.deleteOne({ id });
        return res.deletedCount > 0;
      } catch (err) {}
    }
    return memDeleted;
  }

  // ==========================================
  // --- Teacher Observations ---
  // ==========================================
  async getAllObservations(regNo = null) {
    if (this.isLive) {
      try {
        const filter = regNo ? { regNo } : {};
        return await Observation.find(filter).sort({ date: -1 }).lean();
      } catch (err) {}
    }
    if (regNo) return this.memStore.observations.filter(o => o.regNo === regNo);
    return this.memStore.observations;
  }

  async addObservation(obsData) {
    const id = obsData.id || 'obs-' + Date.now();
    const doc = { id, ...obsData };
    this.memStore.observations.unshift(doc);

    if (this.isLive) {
      try {
        const created = await Observation.create(doc);
        return created.toObject();
      } catch (err) {}
    }
    return doc;
  }

  async deleteObservation(id) {
    const orig = this.memStore.observations.length;
    this.memStore.observations = this.memStore.observations.filter(o => o.id !== id);
    const memDeleted = this.memStore.observations.length < orig;

    if (this.isLive) {
      try {
        const res = await Observation.deleteOne({ id });
        return res.deletedCount > 0;
      } catch (err) {}
    }
    return memDeleted;
  }

  // ==========================================
  // --- Events ---
  // ==========================================
  async getAllEvents() {
    if (this.isLive) {
      try {
        return await Event.find({}).sort({ date: 1 }).lean();
      } catch (err) {}
    }
    return this.memStore.events;
  }

  async saveEvent(eventData) {
    const id = eventData.id || 'ev-' + Date.now();
    const event = { ...eventData, id };
    const idx = this.memStore.events.findIndex(e => e.id === id);
    if (idx >= 0) this.memStore.events[idx] = event;
    else this.memStore.events.push(event);

    if (this.isLive) {
      try {
        const updated = await Event.findOneAndUpdate(
          { id },
          { $set: event },
          { returnDocument: 'after', upsert: true }
        ).lean();
        return updated || event;
      } catch (err) {}
    }
    return event;
  }

  async deleteEvent(id) {
    const orig = this.memStore.events.length;
    this.memStore.events = this.memStore.events.filter(e => e.id !== id);
    const memDeleted = this.memStore.events.length < orig;

    if (this.isLive) {
      try {
        const res = await Event.deleteOne({ id });
        return res.deletedCount > 0;
      } catch (err) {}
    }
    return memDeleted;
  }

  // ==========================================
  // --- Announcements ---
  // ==========================================
  async getAllAnnouncements(audience = null) {
    if (this.isLive) {
      try {
        const filter = audience ? { audience: { $in: [audience, 'all'] } } : {};
        return await Announcement.find(filter).sort({ date: -1 }).lean();
      } catch (err) {}
    }
    if (audience) return this.memStore.announcements.filter(a => !a.audience || a.audience === audience || a.audience === 'all');
    return this.memStore.announcements;
  }

  async addAnnouncement(annData) {
    const id = annData.id || 'ann-' + Date.now();
    const doc = { id, ...annData };
    this.memStore.announcements.unshift(doc);

    if (this.isLive) {
      try {
        const created = await Announcement.create(doc);
        return created.toObject();
      } catch (err) {}
    }
    return doc;
  }

  async deleteAnnouncement(id) {
    const orig = this.memStore.announcements.length;
    this.memStore.announcements = this.memStore.announcements.filter(a => a.id !== id);
    const memDeleted = this.memStore.announcements.length < orig;

    if (this.isLive) {
      try {
        const res = await Announcement.deleteOne({ id });
        return res.deletedCount > 0;
      } catch (err) {}
    }
    return memDeleted;
  }

  // ==========================================
  // --- Study Materials ---
  // ==========================================
  async getAllMaterials(grade = null) {
    if (this.isLive) {
      try {
        const filter = grade ? { grade } : {};
        return await Material.find(filter).sort({ date: -1 }).lean();
      } catch (err) {}
    }
    if (grade) return this.memStore.materials.filter(m => m.grade === grade || m.grade === 'all');
    return this.memStore.materials;
  }

  async addMaterial(matData) {
    const id = matData.id || 'mat-' + Date.now();
    const doc = { id, ...matData };
    this.memStore.materials.unshift(doc);

    if (this.isLive) {
      try {
        const created = await Material.create(doc);
        return created.toObject();
      } catch (err) {}
    }
    return doc;
  }

  async deleteMaterial(id) {
    const orig = this.memStore.materials.length;
    this.memStore.materials = this.memStore.materials.filter(m => m.id !== id);
    const memDeleted = this.memStore.materials.length < orig;

    if (this.isLive) {
      try {
        const res = await Material.deleteOne({ id });
        return res.deletedCount > 0;
      } catch (err) {}
    }
    return memDeleted;
  }

  // ==========================================
  // --- Admin Accounts ---
  // ==========================================
  async getAdmin(id) {
    if (this.isLive) {
      try {
        const found = await Admin.findOne({ id }).lean();
        if (found) return found;
      } catch (err) {}
    }
    return this.memStore.admins.find(a => a.id === id) || null;
  }

  async saveAdmin(adminData) {
    const { id } = adminData;
    if (!id) throw new Error('Admin id is required');

    const idx = this.memStore.admins.findIndex(a => a.id === id);
    if (idx >= 0) this.memStore.admins[idx] = { ...this.memStore.admins[idx], ...adminData };
    else this.memStore.admins.push({ ...adminData });
    const memResult = this.memStore.admins.find(a => a.id === id);

    if (this.isLive) {
      try {
        const updated = await Admin.findOneAndUpdate(
          { id },
          { $set: adminData },
          { returnDocument: 'after', upsert: true }
        ).lean();
        return updated || memResult;
      } catch (err) {}
    }
    return memResult;
  }

  // ==========================================
  // --- Analytics & Summary Statistics ---
  // ==========================================
  async getAnalytics() {
    const studentsObj = await this.getAllStudents();
    const teachersList = await this.getAllTeachers();
    const eventsList = await this.getAllEvents();
    const badgesList = await this.getAllBadges();
    const deedsList = await this.getAllDeeds();

    const students = Object.values(studentsObj);
    const totalStudents = students.length;
    const totalTeachers = teachersList.length;
    const totalEvents = eventsList.length;
    const totalBadges = badgesList.length;
    const approvedBadges = badgesList.filter(b => b.status === 'approved').length;
    const pendingBadges = badgesList.filter(b => b.status === 'pending').length;
    const totalDeeds = deedsList.length;

    let totalAttendanceEntries = 0;
    let presentCount = 0;
    students.forEach(s => {
      (s.attendance || []).forEach(a => {
        totalAttendanceEntries++;
        if (String(a.status).toLowerCase() === 'present') presentCount++;
      });
    });
    const avgAttendance = totalAttendanceEntries > 0
      ? Math.round((presentCount / totalAttendanceEntries) * 100)
      : 85;

    let totalCumulativeSum = 0;
    let totalMarksCount = 0;
    students.forEach(s => {
      (s.examMarks || []).forEach(m => {
        if (!isNaN(Number(m.marks))) {
          totalCumulativeSum += Number(m.marks);
          totalMarksCount++;
        }
      });
    });
    const avgMarks = totalMarksCount > 0
      ? Number((totalCumulativeSum / totalMarksCount).toFixed(1))
      : 76.5;

    const gradeBreakdown = {};
    students.forEach(s => {
      const g = s.grade || '10 ශ්‍රේණිය';
      gradeBreakdown[g] = (gradeBreakdown[g] || 0) + 1;
    });

    return {
      totalStudents,
      totalTeachers,
      totalEvents,
      totalBadges,
      approvedBadges,
      pendingBadges,
      totalDeeds,
      avgAttendance,
      avgMarks,
      gradeBreakdown
    };
  }

  // ==========================================
  // --- Formal Reports Generator ---
  // ==========================================
  async getReports(type = 'attendance', grade = 'all') {
    const studentsObj = await this.getAllStudents();
    let students = Object.values(studentsObj);
    if (grade && grade !== 'all') {
      students = students.filter(s => s.grade && s.grade.includes(grade));
    }

    const rows = [];
    if (type === 'attendance') {
      students.forEach(s => {
        const att = s.attendance || [];
        const dhammaSessions = att.filter(a => a.type === 'dhamma_school');
        const silSessions = att.filter(a => a.type === 'sil_day');
        const presentDhamma = dhammaSessions.filter(a => String(a.status).toLowerCase() === 'present').length;
        const presentSil = silSessions.filter(a => String(a.status).toLowerCase() === 'present').length;
        const total = dhammaSessions.length + silSessions.length;
        const totalPresent = presentDhamma + presentSil;
        const rate = total > 0 ? Math.round((totalPresent / total) * 100) : 0;

        rows.push({
          regNo: s.regNo,
          name: s.name,
          grade: s.grade,
          dhammaAttendance: `${presentDhamma} / ${dhammaSessions.length}`,
          silAttendance: `${presentSil} / ${silSessions.length}`,
          totalSessions: total,
          overallRate: `${rate}%`,
          status: rate >= 75 ? 'විශිෂ්ටයි' : (rate >= 50 ? 'සාමාන්‍යයි' : 'ප්‍රමාණවත් නොවේ')
        });
      });
    } else if (type === 'deeds') {
      const allDeeds = await this.getAllDeeds();
      students.forEach(s => {
        const studentDeeds = allDeeds.filter(d => d.regNo === s.regNo);
        rows.push({
          regNo: s.regNo,
          name: s.name,
          grade: s.grade,
          deedCount: studentDeeds.length,
          lastDeedDate: studentDeeds[0] ? studentDeeds[0].date : 'නැත',
          recentDeed: studentDeeds[0] ? studentDeeds[0].title : '-'
        });
      });
    } else if (type === 'achievements') {
      const allBadges = await this.getAllBadges();
      students.forEach(s => {
        const studentBadges = allBadges.filter(b => b.regNo === s.regNo && b.status === 'approved');
        const totalPoints = studentBadges.reduce((sum, b) => sum + (Number(b.points) || 50), 0);
        rows.push({
          regNo: s.regNo,
          name: s.name,
          grade: s.grade,
          badgeCount: studentBadges.length,
          totalPoints,
          recentBadge: studentBadges[0] ? studentBadges[0].badge : '-'
        });
      });
    } else if (type === 'examMarks') {
      students.forEach(s => {
        const marks = s.examMarks || [];
        const avg = marks.length > 0
          ? (marks.reduce((acc, m) => acc + (Number(m.marks) || 0), 0) / marks.length).toFixed(1)
          : '0.0';
        rows.push({
          regNo: s.regNo,
          name: s.name,
          grade: s.grade,
          subjectCount: marks.length,
          averageMarks: `${avg}%`,
          gradeResult: MongoDatabase.calculateDhammaGrade(avg)
        });
      });
    }
    return rows;
  }

  // ==========================================
  // --- Bulk Data Management ---
  // ==========================================
  async bulkImportStudents(studentsList) {
    if (!Array.isArray(studentsList) || studentsList.length === 0) {
      throw new Error('Students array is required and cannot be empty.');
    }
    const { hashPin } = require('./auth');
    const defaultHashedPin = hashPin('1234');
    let importedCount = 0;
    let updatedCount = 0;
    const errors = [];

    for (const [idx, s] of studentsList.entries()) {
      try {
        const regNo = String(s.regNo || s['ඇතුළත්වීමේ අංකය'] || '').trim();
        const name = String(s.name || s['නම'] || '').trim();
        if (!regNo || !name) {
          errors.push(`Row ${idx + 1}: regNo and name are required.`);
          continue;
        }

        const grade = String(s.grade || s['ශ්‍රේණිය'] || '10 ශ්‍රේණිය (Grade 10)').trim();
        const englishName = String(s.englishName || s['ඉංග්‍රීසි නම'] || '').trim();
        const guardianName = String(s.guardianName || s['භාරකරුගේ නම'] || '').trim();
        const contact = String(s.contact || s['දුරකථන අංකය'] || '').trim();
        const address = String(s.address || s['ලිපිනය'] || '').trim();
        const dob = String(s.dob || s['උපන් දිනය'] || '').trim();

        const studentData = {
          regNo,
          name,
          englishName,
          grade,
          guardianName,
          contact,
          address,
          dob,
          pin: defaultHashedPin
        };

        const existingIdx = this.memStore.students.findIndex(x => x.regNo === regNo);
        if (existingIdx >= 0) {
          this.memStore.students[existingIdx] = { ...this.memStore.students[existingIdx], ...studentData };
          updatedCount++;
        } else {
          this.memStore.students.push({ attendance: [], examMarks: [], ...studentData });
          importedCount++;
        }

        if (this.isLive) {
          try {
            const existing = await Student.findOne({ regNo }).lean();
            if (existing) {
              await Student.updateOne({ regNo }, { $set: studentData });
            } else {
              await Student.create({ ...studentData, attendance: [], examMarks: [] });
            }
          } catch (err) {}
        }
      } catch (err) {
        errors.push(`Row ${idx + 1} (${s.regNo || 'unknown'}): ${err.message}`);
      }
    }

    return { success: true, imported: importedCount, importedCount, updatedCount, totalProcessed: studentsList.length, errors };
  }

  async bulkImportExamMarks(marksList) {
    if (!Array.isArray(marksList) || marksList.length === 0) {
      throw new Error('Marks array is required and cannot be empty.');
    }

    let successCount = 0;
    const errors = [];

    for (const [idx, m] of marksList.entries()) {
      try {
        const regNo = String(m.regNo || m['ඇතුළත්වීමේ අංකය'] || '').trim();
        const term = String(m.term || m['වාරය'] || '1').trim();
        const year = String(m.year || m['වර්ෂය'] || '2026').trim();
        const subject = String(m.subject || m['විෂයය'] || '').trim();
        const marks = Number(m.marks !== undefined ? m.marks : m['ලකුණු']);
        const remarks = String(m.remarks || m['සටහන්'] || '').trim();

        if (!regNo || !subject || isNaN(marks)) {
          errors.push(`Row ${idx + 1}: regNo, subject, and numeric marks are required.`);
          continue;
        }

        await this.saveStudentExamMark(regNo, { term, year, subject, marks, remarks });
        successCount++;
      } catch (err) {
        errors.push(`Row ${idx + 1} (${m.regNo || 'unknown'}): ${err.message}`);
      }
    }

    return { success: true, imported: successCount, successCount, totalProcessed: marksList.length, errors };
  }
}

const mongoDbInstance = new MongoDatabase();
module.exports = mongoDbInstance;
