const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  studentName: { type: String, required: true },
  regNo: { type: String, required: true, ref: 'Student', index: true },
  grade: { type: String, required: true, index: true },
  badge: { type: String, required: true },
  points: { type: Number, default: 50 },
  date: { type: String, required: true },
  teacher: { type: String, ref: 'Teacher' },
  remarks: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

badgeSchema.index({ regNo: 1, status: 1 });

module.exports = mongoose.models.Badge || mongoose.model('Badge', badgeSchema);

