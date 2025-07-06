const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Reward management routes
router.get('/', protect, (req, res) => {
  res.json({ success: true, message: 'Get user rewards - To be implemented' });
});

router.post('/:id/redeem', protect, (req, res) => {
  res.json({ success: true, message: 'Redeem reward - To be implemented' });
});

router.get('/available', protect, (req, res) => {
  res.json({ success: true, message: 'Get available rewards - To be implemented' });
});

module.exports = router;
