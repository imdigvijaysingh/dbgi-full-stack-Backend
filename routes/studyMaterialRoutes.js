const express = require('express');
const router = express.Router();
const { createStudyMaterial, getMyStudyMaterials } = require('../controllers/studyMaterialController');
const { protect } = require('../middleware/authMiddleware');
const { protectStudent } = require('../middleware/studentAuthMiddleware');

router.post('/', protect, createStudyMaterial); // Admin
router.get('/my', protectStudent, getMyStudyMaterials); // Student

module.exports = router;
