const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// E-waste item management routes
router.post('/classify', protect, upload.single('image'), (req, res) => {
  res.json({ 
    success: true, 
    message: 'Image classification - To be implemented',
    data: {
      deviceType: 'smartphone',
      confidence: 0.95,
      estimatedValue: 150
    }
  });
});

router.get('/categories', (req, res) => {
  res.json({ 
    success: true, 
    data: [
      'smartphone', 'laptop', 'desktop', 'tablet', 'television',
      'refrigerator', 'washing_machine', 'air_conditioner', 'microwave',
      'printer', 'keyboard', 'mouse', 'monitor', 'speaker', 'camera',
      'battery', 'charger', 'cable', 'other'
    ]
  });
});

router.get('/material-value', (req, res) => {
  res.json({ success: true, message: 'Get material value estimation - To be implemented' });
});

module.exports = router;
