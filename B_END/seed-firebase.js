/**
 * Daham Pasala - Firebase Cloud Firestore & Firebase Auth Seeder (seed-firebase.js)
 */

const db = require('./db-firebase');

async function runSeed() {
  try {
    await db.ensureReady(5000);
    if (!db.isLive) {
      console.error('❌ Cannot seed Cloud Firestore:', db.connectionError || 'Firebase not connected.');
      console.error('   Place your Firebase serviceAccountKey.json in B_END/ or configure FIREBASE_SERVICE_ACCOUNT_PATH in B_END/.env.');
      process.exit(1);
    }

    await db.seedCloudFirestore();
    console.log('🎉 Firebase Firestore & Authentication seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Firebase seeding failed:', err.message || err);
    process.exit(1);
  }
}

if (require.main === module) {
  runSeed();
}

module.exports = { runSeed };
