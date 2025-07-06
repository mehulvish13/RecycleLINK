const express = require('express');
const { body } = require('express-validator');
const {
  createPickup,
  getPickups,
  getPickup,
  updatePickup,
  deletePickup,
  schedulePickup,
  completePickup,
  getPickupsByRecycler,
  trackPickup,
  ratePickup,
} = require('../controllers/pickupController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const pickupValidation = [
  body('pickupAddress').notEmpty().withMessage('Pickup address is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('pincode').isLength({ min: 6, max: 6 }).withMessage('Pincode must be 6 digits'),
  body('scheduledDate').isISO8601().withMessage('Valid scheduled date is required'),
  body('scheduledTime').notEmpty().withMessage('Scheduled time is required'),
  body('contactPerson').optional().isLength({ min: 2, max: 50 }),
  body('contactPhone').optional().isMobilePhone('en-IN'),
];

const ratingValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('feedback').optional().isLength({ max: 500 }).withMessage('Feedback must be under 500 characters'),
];

// Routes
router.route('/')
  .get(protect, getPickups)
  .post(protect, pickupValidation, createPickup);

router.route('/:id')
  .get(protect, getPickup)
  .put(protect, updatePickup)
  .delete(protect, deletePickup);

router.put('/:id/schedule', protect, authorize('recycler', 'admin'), schedulePickup);
router.put('/:id/complete', protect, authorize('recycler', 'admin'), completePickup);
router.get('/recycler/assigned', protect, authorize('recycler', 'admin'), getPickupsByRecycler);
router.get('/:id/track', trackPickup);
router.post('/:id/rate', protect, ratingValidation, ratePickup);

module.exports = router;
