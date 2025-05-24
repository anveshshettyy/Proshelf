const express = require('express');
const { createProject } = require('../controllers/projects.controller');
const { protectRoute } = require('../middleware/isLoggedIn');
const router = express.Router();

router.post('/create/:id', protectRoute, createProject);

module.exports = router;