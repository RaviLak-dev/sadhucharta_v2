const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  grade: { type: String, required: true },
  grade: { type: String, required: true, index: true },
  subject: { type: String, default: 'බුද්ධ ධර්මය' },
  phone: { type: String },
  pin: { type: String, default: '1234' },
  role: { type: String, default: 'පන්තිභාර ආචාර්ය' },
  status: { type: String, default: 'ක්‍රියාකාරී' },
  photo: { type: String },
  avatar: { type: String }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Relational Virtuals
teacherSchema.virtual('students', {
  ref: 'Student',
  localField: 'grade',
  foreignField: 'grade'
});

teacherSchema.virtual('attendanceSessions', {
  ref: 'Attendance',
  localField: 'id',
  foreignField: 'teacherId'
});

teacherSchema.virtual('materials', {
  ref: 'Material',
  localField: 'grade',
  foreignField: 'grade'
});

module.exports = mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema);

