const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const { uploadMedia, getMedia, deleteMedia, deleteMediaBulk, updateMediaCategory } = require('../controllers/mediaController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Setup multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'devbhoomi_uploads',
      resource_type: 'auto',
      public_id: `${Date.now()}-${file.originalname.replace(/\.\w+$/, '').replace(/\s+/g, '-')}`
    };
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50000000 }, // 50MB limit for videos
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp|mp4|webm|ogg|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Error: Images, Videos, and PDFs Only!'));
    }
  }
});

router.post('/upload', protect, upload.array('media', 20), uploadMedia);
router.post('/delete-bulk', protect, deleteMediaBulk);
router.get('/', getMedia);
router.put('/:id', protect, updateMediaCategory);
router.delete('/:id', protect, deleteMedia);

module.exports = router;
