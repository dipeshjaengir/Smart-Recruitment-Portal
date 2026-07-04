const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');

const jobRules = [
  body('title').notEmpty().withMessage('Job title is required'),
  body('description').notEmpty().withMessage('Job description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('skillsRequired').notEmpty().withMessage('Required skills field is required'),
  body('experienceRequired').isInt({ min: 0 }).withMessage('Experience must be a positive integer'),
  body('educationRequired').notEmpty().withMessage('Education requirement is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('workMode').isIn(['remote', 'hybrid', 'onsite']).withMessage('Invalid work mode'),
  body('jobType').isIn(['full-time', 'part-time', 'contract', 'internship']).withMessage('Invalid job type')
];

router.post('/', protect, authorize('recruiter', 'admin'), jobRules, validate, jobController.createJob);
router.get('/', jobController.getJobs);
router.get('/recruiter', protect, authorize('recruiter'), jobController.getRecruiterJobs);

router.get('/:id', jobController.getJobById);
router.put('/:id', protect, authorize('recruiter', 'admin'), jobController.updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), jobController.deleteJob);

router.post('/save/:id', protect, authorize('candidate'), jobController.saveJob);
router.post('/unsave/:id', protect, authorize('candidate'), jobController.unsaveJob);

module.exports = router;
