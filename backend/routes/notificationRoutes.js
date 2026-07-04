const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, notificationController.getNotifications);
router.put('/read/:id', protect, notificationController.markAsRead);

module.exports = router;
