const express = require('express');
const {
  getTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonialController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getTestimonials)
  .post(protect, createTestimonial);

router.route('/all')
  .get(protect, getAllTestimonials);

router.route('/:id')
  .put(protect, updateTestimonial)
  .delete(protect, deleteTestimonial);

module.exports = router;
