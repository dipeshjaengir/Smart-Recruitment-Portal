const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');

const registerRules = [
  body('email').isEmail().withMessage('Please supply a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').optional().isIn(['candidate', 'recruiter']).withMessage('Invalid role specification'),
  body('name').notEmpty().withMessage('Name field cannot be left blank')
];

const loginRules = [
  body('email').isEmail().withMessage('Please supply a valid email address'),
  body('password').notEmpty().withMessage('Password field cannot be left blank')
];

router.post('/register', registerRules, validate, authController.register);
router.post('/verify-otp', [
  body('email').isEmail().withMessage('Valid email required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits')
], validate, authController.verifyOTP);
router.post('/resend-otp', [body('email').isEmail()], validate, authController.resendOTP);
router.post('/login', loginRules, validate, authController.login);

router.get('/me', protect, authController.getMe);
router.post('/forgot-password', [body('email').isEmail()], validate, authController.forgotPassword);
router.post('/reset-password/:token', [
  body('password').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], validate, authController.resetPassword);

router.put('/change-password', protect, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], validate, authController.changePassword);

module.exports = router;
