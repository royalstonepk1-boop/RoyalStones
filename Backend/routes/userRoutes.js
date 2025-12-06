const express = require('express');
const router = express.Router();
const { register, getProfile, updateProfile } = require('../controller/userController');
const { authMiddleware } = require('../middleware/auth');

router.post('/register', register);
router.get('/me', authMiddleware, getProfile);
router.put('/me', authMiddleware, updateProfile);

module.exports = router;
