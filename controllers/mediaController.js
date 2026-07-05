const path = require('path');
const Media = require('../models/Media');
const fs = require('fs');
const logActivity = require('../utils/logger');

// @desc    Upload media
// @route   POST /api/v1/media/upload
// @access  Private
exports.uploadMedia = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'Please upload at least one file' });
    }

    const mediaDocs = req.files.map(file => {
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
      return {
        filename: file.filename,
        url: fileUrl,
        mimetype: file.mimetype,
        size: file.size
      };
    });

    const media = await Media.insertMany(mediaDocs);
    await logActivity('Added', 'Media', `Uploaded ${media.length} files`, req.user || 'Admin User');

    res.status(201).json({
      success: true,
      data: media
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all media
// @route   GET /api/v1/media
// @access  Public
exports.getMedia = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.category) {
      query.category = req.query.category;
    }
    const media = await Media.find(query).sort('-uploadedAt');
    res.status(200).json({
      success: true,
      count: media.length,
      data: media
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update media category
// @route   PUT /api/v1/media/:id
// @access  Private
exports.updateMediaCategory = async (req, res, next) => {
  try {
    const media = await Media.findByIdAndUpdate(req.params.id, { category: req.body.category }, {
      new: true,
      runValidators: true
    });

    if (!media) {
      return res.status(404).json({ success: false, error: 'Media not found' });
    }

    res.status(200).json({
      success: true,
      data: media
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete media
// @route   DELETE /api/v1/media/:id
// @access  Private
exports.deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ success: false, error: 'Media not found' });
    }

    // Try to delete the physical file
    const filePath = path.join(__dirname, '..', 'uploads', media.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await media.deleteOne();
    await logActivity('Deleted', 'Media', `Deleted file: ${media.filename}`, req.user || 'Admin User');

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete multiple media
// @route   POST /api/v1/media/delete-bulk
// @access  Private
exports.deleteMediaBulk = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'Please provide media IDs to delete' });
    }

    const mediaItems = await Media.find({ _id: { $in: ids } });
    
    // Delete physical files
    mediaItems.forEach(media => {
      const filePath = path.join(__dirname, '..', 'uploads', media.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Media.deleteMany({ _id: { $in: ids } });
    await logActivity('Deleted', 'Media', `Deleted ${mediaItems.length} files in bulk`, req.user || 'Admin User');

    res.status(200).json({ success: true, count: mediaItems.length, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
