const express = require('express');
const router = express.Router();
const { createNotification, getMyNotifications } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const { protectStudent } = require('../middleware/studentAuthMiddleware');

router.post('/', protect, createNotification); // Admin
router.get('/my', protectStudent, getMyNotifications); // Student

module.exports = router;
