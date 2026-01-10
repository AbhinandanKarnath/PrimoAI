const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updatePassword,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { profileUpdateValidation, validate } = require('../middleware/validator');

// All routes are protected
router.use(protect);

router.route('/profile').get(getProfile).put(profileUpdateValidation, validate, updateProfile);

router.put('/password', updatePassword);

module.exports = router;
