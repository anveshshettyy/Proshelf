const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
const { signup, login, logout, updateProfile, updateUserData, updateInfo, getMe, deleteUser, getData, me, getCollections, getProjectsList, getProject, changePassword, createPassword } = require('../controllers/user.controller');
const { protectRoute } = require('../middleware/isLoggedIn');
const User = require('../models/user');
const bcrypt = require("bcrypt");

// Google OAuth routes
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
      sameSite: 'None',
    });

    res.redirect(process.env.CLIENT_URL);
  }
);

// Protected routes
router.get('/me', protectRoute, me);

// Public profile routes (most specific first)
router.get('/:username/collections', getCollections);
router.get('/:username/:collectionSlug/:projectSlug', getProject);
router.get('/:username/:collectionSlug', getProjectsList);
router.get('/:username', getData);

// Authentication routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Protected user routes
router.put('/update-user', protectRoute, updateUserData);
router.post('/update-profile',protectRoute, updateProfile);
router.put('/update-info', protectRoute, updateInfo);
router.post('/change-password', protectRoute, changePassword);
router.post('/create-password', protectRoute, createPassword);
router.delete('/delete', protectRoute, deleteUser);

module.exports = router;
