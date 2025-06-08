const express = require('express');
const { createCategory, deleteCategory, renameCategory, category } = require('../controllers/category.controller');
const { protectRoute } = require('../middleware/isLoggedIn');
const router = express.Router();

router.get('/', protectRoute, category);

router.post('/create/:id', protectRoute, createCategory);

router.put('/edit/:categoryId', protectRoute, renameCategory);

router.delete('/delete/:categoryId', protectRoute, deleteCategory);


module.exports = router;