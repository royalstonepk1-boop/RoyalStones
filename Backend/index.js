require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/mongo');

const app = express();
const PORT = process.env.PORT || 4000;

// connect DB
connectDB();

// middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

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

app.get('/', (req, res) => res.send('Royal Stones API is running'));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
