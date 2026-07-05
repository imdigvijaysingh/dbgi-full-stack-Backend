const Affiliation = require('../models/Affiliation');
const logActivity = require('../utils/logger');

// @desc    Get all active affiliations
// @route   GET /api/v1/affiliations
// @access  Public
exports.getAffiliations = async (req, res, next) => {
  try {
    const affiliations = await Affiliation.find({ isActive: true }).sort('-createdAt');
    res.status(200).json({ success: true, count: affiliations.length, data: affiliations });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all affiliations (including inactive)
// @route   GET /api/v1/affiliations/all
// @access  Private
exports.getAllAffiliations = async (req, res, next) => {
  try {
    const affiliations = await Affiliation.find().sort('-createdAt');
    res.status(200).json({ success: true, count: affiliations.length, data: affiliations });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Create new affiliation
// @route   POST /api/v1/affiliations
// @access  Private
exports.createAffiliation = async (req, res, next) => {
  try {
    const affiliation = await Affiliation.create(req.body);
    await logActivity('Added', 'Affiliation', `"${affiliation.title}"`, req.user || 'Admin User');
    res.status(201).json({ success: true, data: affiliation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update affiliation
// @route   PUT /api/v1/affiliations/:id
// @access  Private
exports.updateAffiliation = async (req, res, next) => {
  try {
    const affiliation = await Affiliation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!affiliation) {
      return res.status(404).json({ success: false, error: 'Affiliation not found' });
    }

    await logActivity('Updated', 'Affiliation', `"${affiliation.title}"`, req.user || 'Admin User');

    res.status(200).json({ success: true, data: affiliation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete affiliation
// @route   DELETE /api/v1/affiliations/:id
// @access  Private
exports.deleteAffiliation = async (req, res, next) => {
  try {
    const affiliation = await Affiliation.findByIdAndDelete(req.params.id);

    if (!affiliation) {
      return res.status(404).json({ success: false, error: 'Affiliation not found' });
    }

    await logActivity('Deleted', 'Affiliation', `"${affiliation.title}"`, req.user || 'Admin User');

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
