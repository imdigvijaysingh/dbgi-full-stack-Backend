const StudyMaterial = require('../models/StudyMaterial');
const Student = require('../models/Student');
const Notification = require('../models/Notification');

const getYouTubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// @desc    Create a new study material (Admin)
// @route   POST /api/v1/study-materials
// @access  Private/Admin
const createStudyMaterial = async (req, res) => {
  try {
    let { title, description, type, url, thumbnailUrl, targetClass } = req.body;
    
    if (type === 'youtube') {
      const videoId = getYouTubeVideoId(url);
      if (videoId) {
        thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    }

    const material = await StudyMaterial.create({ title, description, type, url, thumbnailUrl, targetClass });
    
    // Notify class
    await Notification.create({
      title: `New Study Material: ${title}`,
      message: `New study material (${type}) has been uploaded.`,
      targetType: 'class',
      targetId: targetClass
    });

    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Get study materials for logged in student
// @route   GET /api/v1/study-materials/my
// @access  Private/Student
const getMyStudyMaterials = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id);
    if (!student || !student.currentClass) {
       return res.json([]);
    }
    
    const materials = await StudyMaterial.find({ targetClass: student.currentClass.className }).sort({ createdAt: -1 });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createStudyMaterial, getMyStudyMaterials };
