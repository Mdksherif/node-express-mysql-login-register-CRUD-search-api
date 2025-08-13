const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { validateUser, validateUserId } = require('../middleware/validation');

router.post('/', auth, validateUser, userController.create);
router.get('/', auth, userController.list);
router.get('/:id', auth, validateUserId, userController.get);
router.put('/:id', auth, validateUserId, validateUser, userController.update);
router.delete('/:id', auth, validateUserId, userController.delete);

module.exports = router;
