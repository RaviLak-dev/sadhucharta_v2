const mongoose = require('mongoose');

const attendanceRecordSubSchema = new mongoose.Schema({
  regNo: { type: String, required: true, ref: 'Student' },
  status: { type: String, enum: ['present', 'absent', 'excused', 'Present', 'Absent'], default: 'present' },
  broughtFlowers: { type: Boolean, default: false },
  flowerScore: { type: Number, default: 0 },
  remarks: { type: String }
}, { _id: false });

const attendanceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  date: { type: String, required: true, index: true },
  type: { type: String, enum: ['dhamma_school', 'sil_day'], default: 'dhamma_school' },
  category: { type: String },
  grade: { type: String, required: true, index: true },
  teacherId: { type: String, ref: 'Teacher', index: true },
  teacherName: { type: String },
  total: { type: Number },
  present: { type: Number },
  absent: { type: Number },
  excused: { type: Number },
  records: [attendanceRecordSubSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for uniqueness & fast querying per grade session
attendanceSchema.index({ date: 1, grade: 1, type: 1 });

module.exports = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);

