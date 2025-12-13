const express = require('express');
const router = express.Router();
const { registerWithEmail,registerWithGoogle, getProfile, getProfileByEmail,updateProfile } = require('../controller/userController');
const { authMiddleware } = require('../middleware/auth');

router.post('/registerWithEmail', registerWithEmail);
router.post('/registerWithGoogle', registerWithGoogle);
router.get('/me', authMiddleware, getProfile);
router.get('/email', authMiddleware, getProfileByEmail);
router.put('/me', authMiddleware, updateProfile);

module.exports = router;
