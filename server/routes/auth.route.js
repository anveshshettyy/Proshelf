const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
const { signup, login, logout, updateProfile, updateUserData } = require('../controllers/user.controller');
const { protectRoute } = require('../middleware/isLoggedIn');
const User = require('../models/user');

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.redirect('http://localhost:5173/profile');
  }
);


router.get('/api/me', protectRoute, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password"); 
  res.json({ user });
});


router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.put('/update-user', protectRoute, updateUserData);
    
router.post('/update-profile',protectRoute, updateProfile);

module.exports = router;
