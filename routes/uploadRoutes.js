const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadMedia, getMedia, deleteMedia, deleteMediaBulk } = require('../controllers/mediaController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/\\s+/g, '-')}`);
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
router.delete('/:id', protect, deleteMedia);

module.exports = router;
