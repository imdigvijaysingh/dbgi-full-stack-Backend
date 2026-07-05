const Testimonial = require('../models/Testimonial');
const logActivity = require('../utils/logger');

// @desc    Get all active testimonials
// @route   GET /api/v1/testimonials
// @access  Public
exports.getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort('-createdAt');
    res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all testimonials (including inactive)
// @route   GET /api/v1/testimonials/all
// @access  Private
exports.getAllTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort('-createdAt');
    res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Create new testimonial
// @route   POST /api/v1/testimonials
// @access  Private
exports.createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    await logActivity('Added', 'Testimonial', `By ${testimonial.author}`, req.user || 'Admin User');
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update testimonial
// @route   PUT /api/v1/testimonials/:id
// @access  Private
exports.updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!testimonial) {
      return res.status(404).json({ success: false, error: 'Testimonial not found' });
    }

    await logActivity('Updated', 'Testimonial', `By ${testimonial.author}`, req.user || 'Admin User');

    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/v1/testimonials/:id
// @access  Private
exports.deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ success: false, error: 'Testimonial not found' });
    }

    await logActivity('Deleted', 'Testimonial', `By ${testimonial.author}`, req.user || 'Admin User');

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
