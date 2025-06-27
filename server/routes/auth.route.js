const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
const { signup, login, logout, updateProfile, updateUserData, updateInfo, getMe, deleteUser, getData, me, getCollections, getProjectsList, getProject } = require('../controllers/user.controller');
const { protectRoute } = require('../middleware/isLoggedIn');
const User = require('../models/user');
const bcrypt = require("bcrypt");



router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.redirect('http://localhost:5173/');
  }
);


router.get('/me', protectRoute, me);

router.get('/:username', getData);

router.get('/:username/collections', getCollections);

router.get('/:username/:collectionSlug', getProjectsList);

router.get('/:username/:collectionSlug/:projectSlug', getProject);

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);


router.put('/update-user', protectRoute, updateUserData);
    
router.post('/update-profile',protectRoute, updateProfile);

router.put('/update-info', protectRoute, updateInfo);

router.post('/change-password', protectRoute, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Old password is incorrect' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedPassword;
  await user.save();

  res.json({ message: 'Password changed successfully' });
});



router.post('/create-password', protectRoute, async (req, res) => {
  const { newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (user.password) {
    return res.status(400).json({ message: 'You already have a password' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedPassword;
  await user.save();

  res.json({ message: 'Password created successfully' });
});


router.delete('/delete', protectRoute, deleteUser);

module.exports = router;
