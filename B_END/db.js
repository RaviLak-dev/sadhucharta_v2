const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

/**
 * Daham Pasala Database Adapter
 * Defaults to Firebase (Cloud Firestore + Firebase Auth).
 * Set DB_PROVIDER=mongodb (or USE_FIREBASE=false) in .env to switch back to MongoDB.
 */
const provider = String(process.env.DB_PROVIDER || '').toLowerCase();
const useMongo = provider === 'mongo' || provider === 'mongodb' || process.env.USE_FIREBASE === 'false';

module.exports = useMongo ? require('./db-mongo') : require('./db-firebase');
