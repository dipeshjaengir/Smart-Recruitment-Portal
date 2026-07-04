const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');

const scheduleRules = [
  body('applicationId').isMongoId().withMessage('Valid application ID required'),
  body('date').notEmpty().withMessage('Interview date is required'),
  body('time').notEmpty().withMessage('Interview time slot is required'),
  body('platform').notEmpty().withMessage('Platform (e.g. Zoom, Meet) is required'),
  body('meetingLink').isURL().withMessage('Valid meeting link URL is required'),
  body('notes').optional().trim()
];

router.post('/', protect, authorize('recruiter', 'admin'), scheduleRules, validate, interviewController.scheduleInterview);
router.get('/candidate', protect, authorize('candidate'), interviewController.getCandidateInterviews);
router.get('/recruiter', protect, authorize('recruiter'), interviewController.getRecruiterInterviews);

router.put('/:id', protect, authorize('recruiter', 'admin'), [
  body('status').isIn(['scheduled', 'completed', 'cancelled']).withMessage('Invalid status')
], validate, interviewController.updateInterviewStatus);

module.exports = router;
