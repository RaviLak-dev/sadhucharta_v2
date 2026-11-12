const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  pin: { type: String, default: '1234' },
  avatar: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

