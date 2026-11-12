const mongoose = require('mongoose');

const observationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  studentName: { type: String, required: true },
  regNo: { type: String, required: true, ref: 'Student', index: true },
  grade: { type: String, index: true },
  category: { type: String, required: true },
  rating: { type: String, default: 'හොඳයි (Good)' },
  date: { type: String, required: true },
  teacher: { type: String, ref: 'Teacher' },
  remarks: { type: String }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

observationSchema.index({ regNo: 1, date: -1 });

module.exports = mongoose.models.Observation || mongoose.model('Observation', observationSchema);

