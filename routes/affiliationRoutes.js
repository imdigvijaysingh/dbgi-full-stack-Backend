const express = require('express');
const {
  getAffiliations,
  getAllAffiliations,
  createAffiliation,
  updateAffiliation,
  deleteAffiliation
} = require('../controllers/affiliationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAffiliations);
router.get('/all', protect, getAllAffiliations);
router.post('/', protect, createAffiliation);
router.put('/:id', protect, updateAffiliation);
router.delete('/:id', protect, deleteAffiliation);

module.exports = router;
