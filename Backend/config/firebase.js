const admin = require("firebase-admin");
require("dotenv").config();

try {
  // 1. Build the credentials object directly from your .env variables
  const serviceAccount = {
    type: process.env.type,
    project_id: process.env.project_id,
    private_key_id: process.env.private_key_id,
    // The replace handles the newline characters in the private key string
    private_key: process.env.private_key ? process.env.private_key.replace(/\\n/g, "\n") : undefined,
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url,
    universe_domain: process.env.universe_domain,
  };

  // 2. Validate that critical keys exist
  if (!serviceAccount.project_id || !serviceAccount.private_key) {
    throw new Error("Missing Firebase credentials in .env file");
  }

  // 3. Initialize Admin if not already started
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Auth initialized successfully using Environment Variables");
  }
} catch (err) {
  console.error("Failed to initialize firebase admin:", err.message);
}

module.exports = { admin };