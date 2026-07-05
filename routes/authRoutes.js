const express = require('express');
const { register, login, getMe, updateCredentials, getUsersCount } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateCredentials);
router.get('/users/count', protect, getUsersCount);

module.exports = router;
