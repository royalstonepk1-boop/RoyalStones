const { admin } = require('../config/firebase');

async function createFirebaseUser(email, password, displayName) {
  const userRecord = await admin.auth().createUser({
    email,
    password,
    displayName,
  });
  return userRecord;
}

async function verifyIdToken(idToken) {
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    return decoded;
  } catch (err) {
    throw new Error('Invalid Firebase ID token');
  }
}

module.exports = { createFirebaseUser, verifyIdToken };
