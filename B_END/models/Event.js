const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  category: { type: String, default: 'සාමාන්‍ය වැඩසටහන්' },
  date: { type: String, required: true },
  day: { type: String },
  month: { type: String },
  venue: { type: String },
  grades: { type: String },
  desc: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.models.Event || mongoose.model('Event', eventSchema);

