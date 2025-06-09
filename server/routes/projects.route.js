const express = require('express');
const { createProject, deleteProject, addProjectImage, removeProjectImage, removeProjectVideo, addProjectVideo, updateProject, getCategoryWithProjects, getSingleProject } = require('../controllers/projects.controller');
const { protectRoute } = require('../middleware/isLoggedIn');
const router = express.Router();

router.post('/create/:id', protectRoute, createProject);

router.post('/update/:id', protectRoute, updateProject);

router.post('/add-image/:id', protectRoute, addProjectImage);

router.put('/add-video/:id', protectRoute, addProjectVideo);

router.put('/remove-image/:projectId', protectRoute, removeProjectImage);

router.put('/remove-video/:projectId', protectRoute, removeProjectVideo);

router.delete('/delete/:id', protectRoute, deleteProject);

router.get('/:id', protectRoute,  getCategoryWithProjects);

router.get('/single/:id', protectRoute, getSingleProject);

module.exports = router;