const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  audience: { type: String, default: 'all' },
  audienceLabel: { type: String, default: 'සියලු දෙනා වෙත (All)' },
  urgency: { type: String, enum: ['normal', 'important', 'urgent'], default: 'normal' },
  body: { type: String, required: true },
  date: { type: String, required: true },
  author: { type: String, default: 'ප්‍රධානාචාර්ය කාර්යාලය' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

announcementSchema.index({ audience: 1, date: -1 });

module.exports = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);

