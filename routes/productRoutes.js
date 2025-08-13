const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validatePagination, validateProduct } = require('../middleware/validation');

router.get('/', auth, validatePagination, productController.list);
router.post('/', auth, upload.single('image'), validateProduct, productController.create);

module.exports = router;