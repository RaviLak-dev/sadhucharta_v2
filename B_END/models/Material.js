const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  grade: { type: String, required: true, index: true },
  type: { type: String, default: 'PDF නිබන්ධනය' },
  link: { type: String },
  desc: { type: String },
  date: { type: String, required: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.models.Material || mongoose.model('Material', materialSchema);

