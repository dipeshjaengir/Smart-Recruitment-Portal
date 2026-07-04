const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', protect, profileController.getProfile);

router.put(
  '/candidate', 
  protect, 
  authorize('candidate'), 
  profileController.updateCandidateProfile
);

router.put(
  '/recruiter', 
  protect, 
  authorize('recruiter'), 
  profileController.updateRecruiterProfile
);

router.post(
  '/resume', 
  protect, 
  authorize('candidate'), 
  upload.single('resume'), 
  profileController.uploadResume
);

router.post(
  '/image', 
  protect, 
  upload.single('profileImage'), 
  profileController.uploadProfileImage
);

module.exports = router;
