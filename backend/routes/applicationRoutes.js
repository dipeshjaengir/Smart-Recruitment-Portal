const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');

router.post(
  '/apply', 
  protect, 
  authorize('candidate'), 
  [body('jobId').isMongoId().withMessage('Valid job ID is required')],
  validate, 
  applicationController.applyJob
);

router.get(
  '/candidate', 
  protect, 
  authorize('candidate'), 
  applicationController.getCandidateApplications
);

router.get(
  '/job/:jobId', 
  protect, 
  authorize('recruiter', 'admin'), 
  applicationController.getJobApplications
);

router.put(
  '/status/:id', 
  protect, 
  authorize('recruiter', 'admin'), 
  [
    body('status').isIn(['applied', 'shortlisted', 'interviewing', 'accepted', 'rejected']).withMessage('Invalid application status'),
    body('comment').optional().trim()
  ],
  validate, 
  applicationController.updateApplicationStatus
);

router.get(
  '/export/csv/:jobId',
  protect,
  authorize('recruiter', 'admin'),
  applicationController.exportApplicationsCSV
);

module.exports = router;
