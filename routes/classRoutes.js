const express = require('express');
const {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass
} = require('../controllers/classController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .get(getClasses)
  .post(protect, createClass);

router
  .route('/:id')
  .get(getClass)
  .put(protect, updateClass)
  .delete(protect, deleteClass);

module.exports = router;
