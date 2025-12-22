const express = require('express');
const router = express.Router();
const { registerWithEmail,registerWithGoogle, getProfile, getProfileByEmail,updateProfile, getAllUsers } = require('../controller/userController');
const { authMiddleware } = require('../middleware/auth');

router.post('/registerWithEmail', registerWithEmail);
router.post('/registerWithGoogle', registerWithGoogle);
router.get('/', authMiddleware, getAllUsers);
router.get('/me', authMiddleware, getProfile);
router.get('/email', authMiddleware, getProfileByEmail);
router.put('/me', authMiddleware, updateProfile);

module.exports = router;
