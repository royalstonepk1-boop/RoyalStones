const User = require('../models/User');
const { createFirebaseUser } = require('../helper/firebaseAuth');

async function register(req, res) {
  try {
    const { email, password, name, phone } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email & password required' });

    // Create firebase user
    const fbUser = await createFirebaseUser(email, password, name);

    // create local user
    const user = await User.create({
      firebaseUid: fbUser.uid,
      name,
      email,
      phone,
      role: 'user',
    });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateProfile(req, res) {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { register, getProfile, updateProfile };
