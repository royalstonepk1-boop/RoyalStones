const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

try {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (!serviceAccountPath) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_PATH not set in .env");
  }

  const fullPath = path.resolve(serviceAccountPath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Service account file not found: ${fullPath}`);
  }

  console.log("Using Firebase service account:", fullPath);

  const serviceAccount = JSON.parse(fs.readFileSync(fullPath, "utf8"));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log("Firebase Auth initialized successfully");
  
} catch (err) {
  console.error("Failed to initialize firebase admin:", err);
}

module.exports = { admin };
