const express = require('express');
const {
  getNotices,
  getAllNotices,
  createNotice,
  updateNotice,
  deleteNotice
} = require('../controllers/noticeController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getNotices)
  .post(protect, createNotice);

router.route('/all')
  .get(protect, getAllNotices);

router.route('/:id')
  .put(protect, updateNotice)
  .delete(protect, deleteNotice);

module.exports = router;
