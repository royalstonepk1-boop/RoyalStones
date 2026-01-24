const User = require('../models/User');
// const { createFirebaseUser } = require('../helper/firebaseAuth');

async function registerWithEmail(req, res) {
  try {
    const {uid, email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email & password required' });

    // Create firebase user
    // const fbUser = await createFirebaseUser(email, password, name);

    // create local user
    const user = await User.create({
      firebaseUid: uid,
      name,
      email,
      role: 'user',
    });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
async function registerWithGoogle(req, res) {
  try {
    const {uid, email, name } = req.body;
    // console.log(req.body);
    const user = await User.create({
      firebaseUid: uid,
      name,
      email,
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

async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
async function getAdmin(req, res) {
  try {
    const users = await User.find({ role: 'admin' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getProfileByEmail(req, res) {
  try {
    const { email } = req.query;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


async function updateProfile(req, res) {
  try {
    const updates = req.body;
    // console.log('Update request body:', updates ,req.user._id);
    // If updating addresses, ensure it's an array
    if (updates.addresses && !Array.isArray(updates.addresses)) {
      return res.status(400).json({ message: 'Addresses must be an array' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id, 
      updates, 
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // console.log('Updated user:', user);
    res.json(user);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: err.message });
  }
}

module.exports = { registerWithEmail, registerWithGoogle , getProfile, getProfileByEmail, updateProfile ,getAllUsers ,getAdmin };
