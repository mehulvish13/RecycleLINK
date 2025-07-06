const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin role
router.use(protect);
router.use(authorize('admin'));

// Admin dashboard routes
router.get('/dashboard', (req, res) => {
  res.json({ success: true, message: 'Admin dashboard data - To be implemented' });
});

router.get('/users', (req, res) => {
  res.json({ success: true, message: 'Get all users - To be implemented' });
});

router.get('/pickups', (req, res) => {
  res.json({ success: true, message: 'Get all pickups - To be implemented' });
});

router.get('/analytics', (req, res) => {
  res.json({ success: true, message: 'Analytics data - To be implemented' });
});

router.get('/compliance-report', (req, res) => {
  res.json({ success: true, message: 'Compliance report - To be implemented' });
});

module.exports = router;
