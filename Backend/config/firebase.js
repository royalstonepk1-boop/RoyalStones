const admin = require("firebase-admin");
require("dotenv").config();

try {
  // 1. Build the credentials object directly from your .env variables
  const serviceAccount = {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    // The replace handles the newline characters in the private key string
    private_key: process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.replace(/\\n/g, "\n") : undefined,
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN,
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