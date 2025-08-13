const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const auth = require('../middleware/auth');
const { validateSearch } = require('../middleware/searchValidation');

// Search products endpoint
router.get('/', auth, validateSearch, searchController.searchProducts);

// Get available categories endpoint
router.get('/categories', auth, searchController.getCategories);

module.exports = router;