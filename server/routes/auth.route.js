const express = require('express');
const router = express.Router();
const { signup, login, logout, updateProfile } = require('../controllers/user.controller');
const { protectRoute } = require('../middleware/isLoggedIn');

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);
    
router.post('/update-profile',protectRoute, updateProfile);

module.exports = router;
