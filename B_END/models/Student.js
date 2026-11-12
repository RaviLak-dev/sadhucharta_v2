const mongoose = require('mongoose');

const attendanceSubSchema = new mongoose.Schema({
  date: { type: String, required: true },
  status: { type: String, enum: ['present', 'absent', 'excused', 'Present', 'Absent'], default: 'present' },
  type: { type: String, default: 'dhamma_school' },
  event: { type: String },
  category: { type: String },
  score: { type: Number, default: 10 },
  broughtFlowers: { type: Boolean, default: false },
  remarks: { type: String }
}, { _id: false });

const examMarkSubSchema = new mongoose.Schema({
  term: { type: String, default: '1' },
  year: { type: String, default: '2026' },
  subject: { type: String, required: true },
  marks: { type: Number, required: true },
  grade: { type: String, default: 'A' },
  remarks: { type: String, default: '' }
}, { _id: false });

const studentSchema = new mongoose.Schema({
  regNo: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  englishName: { type: String },
  grade: { type: String, required: true, index: true },
  pin: { type: String, default: '1234' },
  dob: { type: String },
  photo: { type: String },
  guardianName: { type: String },
  contact: { type: String },
  address: { type: String },
  recommendation: { type: String },
  teacherName: { type: String },
  attendance: [attendanceSubSchema],
  examMarks: [examMarkSubSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound Indexes for fast querying
studentSchema.index({ grade: 1, regNo: 1 });
studentSchema.index({ 'examMarks.term': 1, 'examMarks.year': 1 });

// Relational Virtuals linking to foreign collections
studentSchema.virtual('badges', {
  ref: 'Badge',
  localField: 'regNo',
  foreignField: 'regNo'
});

studentSchema.virtual('deeds', {
  ref: 'Deed',
  localField: 'regNo',
  foreignField: 'regNo'
});

studentSchema.virtual('observations', {
  ref: 'Observation',
  localField: 'regNo',
  foreignField: 'regNo'
});

module.exports = mongoose.models.Student || mongoose.model('Student', studentSchema);

