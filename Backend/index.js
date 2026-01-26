require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const fs = require("fs");
const bodyParser = require('body-parser');
const connectDB = require('./config/mongo');
const { lemonSqueezyWebhook } = require('./controller/orderController');

const app = express();
const PORT = process.env.PORT || 4000;

// connect DB
connectDB();

const serviceKeys={
  "type":process.env.TYPE,
  "project_id":process.env.PROJECT_ID,
  "private_key_id":process.env.PRIVATE_KEY_ID,
  "private_key":process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
  "client_email":process.env.CLIENT_EMAIL,
  "client_id":process.env.CLIENT_ID,
  "auth_uri":process.env.AUTH_URI,
  "token_uri":process.env.TOKEN_URI,
  "auth_provider_x509_cert_url":process.env.AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url":process.env.CLIENT_X509_CERT_URL,
  "universe_domain":process.env.UNIVERSE_DOMAIN
}
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceKeys)
  });
}

app.post('/api/orders/lemonsqueezy-webhook', 
  express.raw({ type: 'application/json' }), 
  lemonSqueezyWebhook  // <-- Direct function call, no router
);
  
// middleware
// app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(cors({ origin: "*" || true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// routes (mount)
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/conversations', require('./routes/conversationRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/adminlogs', require('./routes/adminLogRoutes'));
app.use('/api/delivery', require('./routes/deliveryRoutes'));

app.get('/', (req, res) => res.send('Royal Stones API is running'));

app.listen(PORT,"0.0.0.0", () => console.log(`Server listening on port ${PORT}`));
// app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
