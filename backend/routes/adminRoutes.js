const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');

router.get('/users', protect, authorize('admin'), adminController.getAllUsers);
router.put('/users/block/:id', protect, authorize('admin'), adminController.blockUser);
router.put('/users/unblock/:id', protect, authorize('admin'), adminController.unblockUser);

router.get('/analytics', protect, authorize('admin', 'recruiter'), adminController.getDashboardAnalytics);

router.post(
  '/skills', 
  protect, 
  authorize('admin'), 
  [body('name').notEmpty().withMessage('Skill name is required')], 
  validate, 
  adminController.createPredefinedSkill
);

router.post(
  '/categories', 
  protect, 
  authorize('admin'), 
  [body('name').notEmpty().withMessage('Category name is required')], 
  validate, 
  adminController.createPredefinedCategory
);

router.put(
  '/settings/weights', 
  protect, 
  authorize('admin'), 
  [
    body('skills').optional().isInt({ min: 0, max: 100 }),
    body('experience').optional().isInt({ min: 0, max: 100 }),
    body('education').optional().isInt({ min: 0, max: 100 }),
    body('keywords').optional().isInt({ min: 0, max: 100 }),
    body('projectsCertificates').optional().isInt({ min: 0, max: 100 })
  ], 
  validate, 
  adminController.updateAIFrictionWeights
);

module.exports = router;
