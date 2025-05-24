const express = require('express');
const { createCategory, deleteCategory, renameCategory } = require('../controllers/category.controller');
const { protectRoute } = require('../middleware/isLoggedIn');
const router = express.Router();


router.post('/create/:id', protectRoute, createCategory);

router.put('/rename/:categoryId', protectRoute, renameCategory);

router.delete('/delete/:categoryId', protectRoute, deleteCategory);


module.exports = router;