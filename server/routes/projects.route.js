const express = require('express');
const { createProject, deleteProject, addProjectImage, removeProjectImage, removeProjectVideo, addProjectVideo } = require('../controllers/projects.controller');
const { protectRoute } = require('../middleware/isLoggedIn');
const router = express.Router();

router.post('/create/:id', protectRoute, createProject);

router.post('/add-image/:id', protectRoute, addProjectImage);

router.put('/add-video/:id', protectRoute, addProjectVideo);

router.put('/remove-image/:projectId', removeProjectImage);

router.put('/remove-video/:projectId', removeProjectVideo);

router.delete('/delete/:id', protectRoute, deleteProject);

module.exports = router;