const mongoose = require('mongoose');

const deedSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  studentName: { type: String, required: true },
  regNo: { type: String, required: true, ref: 'Student', index: true },
  title: { type: String, required: true },
  category: { type: String, default: 'සමාජ සත්කාරක' },
  date: { type: String, required: true },
  score: { type: Number, default: 10 },
  remarks: { type: String }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

deedSchema.index({ regNo: 1, date: -1 });

module.exports = mongoose.models.Deed || mongoose.model('Deed', deedSchema);

