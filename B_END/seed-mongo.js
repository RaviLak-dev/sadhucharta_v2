/**
 * Daham Pasala - Pure MongoDB Database Seeder (seed-mongo.js)
 * Self-contained seeder for MongoDB Atlas.
 */

require('dotenv').config();
const mongoose = require('mongoose');

const Student = require('./models/Student');
const Teacher = require('./models/Teacher');
const Admin = require('./models/Admin');
const Attendance = require('./models/Attendance');
const Deed = require('./models/Deed');
const Badge = require('./models/Badge');
const Observation = require('./models/Observation');
const Event = require('./models/Event');
const Announcement = require('./models/Announcement');
const Material = require('./models/Material');
const { SEED_DATA } = require('./seed-data');

async function seedMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI missing.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB Atlas.');

    for (const s of SEED_DATA.students) {
      await Student.updateOne({ regNo: s.regNo }, { $set: s }, { upsert: true });
    }
    console.log(`🌱 Students: ${SEED_DATA.students.length} seeded.`);

    for (const t of SEED_DATA.teachers) {
      await Teacher.updateOne({ id: t.id }, { $set: t }, { upsert: true });
    }
    console.log(`🌱 Teachers: ${SEED_DATA.teachers.length} seeded.`);

    for (const a of SEED_DATA.admins) {
      await Admin.updateOne({ id: a.id }, { $set: a }, { upsert: true });
    }
    console.log(`🌱 Admins: ${SEED_DATA.admins.length} seeded.`);

    for (const e of SEED_DATA.events) {
      await Event.updateOne({ id: e.id }, { $set: e }, { upsert: true });
    }
    console.log(`🌱 Events: ${SEED_DATA.events.length} seeded.`);

    for (const d of SEED_DATA.deeds) {
      await Deed.updateOne({ id: d.id }, { $set: d }, { upsert: true });
    }
    console.log(`🌱 Deeds: ${SEED_DATA.deeds.length} seeded.`);

    for (const b of SEED_DATA.badges) {
      await Badge.updateOne({ id: b.id }, { $set: b }, { upsert: true });
    }
    console.log(`🌱 Badges: ${SEED_DATA.badges.length} seeded.`);

    console.log('🎉 Seeding complete.');
  } catch (e) {
    console.error('Seeding error:', e.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

if (require.main === module) {
  seedMongo();
}

module.exports = { SEED_DATA, seedMongo };
