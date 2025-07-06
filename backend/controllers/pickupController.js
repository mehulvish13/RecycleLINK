const { validationResult } = require('express-validator');
const { Pickup } = require('../models/Pickup');
const { User } = require('../models/User');
const { EWasteItem } = require('../models/EWasteItem');
const { asyncHandler } = require('../middleware/errorHandler');
const axios = require('axios');

// @desc    Create new pickup
// @route   POST /api/pickups
// @access  Private
const createPickup = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const pickupData = {
    ...req.body,
    userId: req.user.id,
  };

  // Get coordinates from address if not provided
  if (!pickupData.latitude || !pickupData.longitude) {
    try {
      const coordinates = await getCoordinatesFromAddress(
        `${pickupData.pickupAddress}, ${pickupData.city}, ${pickupData.state}, ${pickupData.pincode}`
      );
      pickupData.latitude = coordinates.lat;
      pickupData.longitude = coordinates.lng;
    } catch (error) {
      console.log('Geocoding failed:', error.message);
    }
  }

  const pickup = await Pickup.create(pickupData);

  // Update user's total pickups
  await User.increment('totalPickups', { where: { id: req.user.id } });

  res.status(201).json({
    success: true,
    data: pickup,
  });
});

// @desc    Get all pickups for logged in user
// @route   GET /api/pickups
// @access  Private
const getPickups = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;

  const where = { userId: req.user.id };
  if (status) {
    where.status = status;
  }

  const pickups = await Pickup.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName', 'email', 'phone'],
      },
      {
        model: User,
        as: 'recycler',
        attributes: ['firstName', 'lastName', 'email', 'phone'],
      },
    ],
    order: [[sortBy, sortOrder]],
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit),
  });

  res.status(200).json({
    success: true,
    count: pickups.count,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: pickups.count,
      pages: Math.ceil(pickups.count / parseInt(limit)),
    },
    data: pickups.rows,
  });
});

// @desc    Get single pickup
// @route   GET /api/pickups/:id
// @access  Private
const getPickup = asyncHandler(async (req, res) => {
  const pickup = await Pickup.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName', 'email', 'phone'],
      },
      {
        model: User,
        as: 'recycler',
        attributes: ['firstName', 'lastName', 'email', 'phone'],
      },
      {
        model: EWasteItem,
        as: 'items',
      },
    ],
  });

  if (!pickup) {
    return res.status(404).json({
      success: false,
      error: 'Pickup not found',
    });
  }

  // Check ownership or role
  if (pickup.userId !== req.user.id && 
      pickup.recyclerId !== req.user.id && 
      req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to access this pickup',
    });
  }

  res.status(200).json({
    success: true,
    data: pickup,
  });
});

// @desc    Update pickup
// @route   PUT /api/pickups/:id
// @access  Private
const updatePickup = asyncHandler(async (req, res) => {
  let pickup = await Pickup.findByPk(req.params.id);

  if (!pickup) {
    return res.status(404).json({
      success: false,
      error: 'Pickup not found',
    });
  }

  // Check ownership
  if (pickup.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to update this pickup',
    });
  }

  // Prevent updating completed or cancelled pickups
  if (['completed', 'cancelled'].includes(pickup.status)) {
    return res.status(400).json({
      success: false,
      error: 'Cannot update completed or cancelled pickup',
    });
  }

  pickup = await pickup.update(req.body);

  res.status(200).json({
    success: true,
    data: pickup,
  });
});

// @desc    Delete pickup
// @route   DELETE /api/pickups/:id
// @access  Private
const deletePickup = asyncHandler(async (req, res) => {
  const pickup = await Pickup.findByPk(req.params.id);

  if (!pickup) {
    return res.status(404).json({
      success: false,
      error: 'Pickup not found',
    });
  }

  // Check ownership
  if (pickup.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to delete this pickup',
    });
  }

  // Only allow deletion of pending pickups
  if (pickup.status !== 'pending') {
    return res.status(400).json({
      success: false,
      error: 'Can only delete pending pickups',
    });
  }

  await pickup.destroy();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Schedule pickup (assign recycler)
// @route   PUT /api/pickups/:id/schedule
// @access  Private (Recycler/Admin)
const schedulePickup = asyncHandler(async (req, res) => {
  const pickup = await Pickup.findByPk(req.params.id);

  if (!pickup) {
    return res.status(404).json({
      success: false,
      error: 'Pickup not found',
    });
  }

  if (pickup.status !== 'pending') {
    return res.status(400).json({
      success: false,
      error: 'Can only schedule pending pickups',
    });
  }

  const updatedPickup = await pickup.update({
    recyclerId: req.user.id,
    status: 'scheduled',
  });

  res.status(200).json({
    success: true,
    data: updatedPickup,
  });
});

// @desc    Complete pickup
// @route   PUT /api/pickups/:id/complete
// @access  Private (Recycler/Admin)
const completePickup = asyncHandler(async (req, res) => {
  const pickup = await Pickup.findByPk(req.params.id);

  if (!pickup) {
    return res.status(404).json({
      success: false,
      error: 'Pickup not found',
    });
  }

  if (pickup.recyclerId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to complete this pickup',
    });
  }

  const { actualWeight, actualValue, notes } = req.body;

  const updatedPickup = await pickup.update({
    status: 'completed',
    actualWeight: actualWeight || pickup.estimatedWeight,
    actualValue: actualValue || pickup.estimatedValue,
    notes,
    pickupCompletedAt: new Date(),
  });

  // Calculate and create rewards
  try {
    await calculateAndCreateRewards(updatedPickup);
  } catch (error) {
    console.log('Reward calculation failed:', error);
  }

  res.status(200).json({
    success: true,
    data: updatedPickup,
  });
});

// @desc    Get pickups assigned to recycler
// @route   GET /api/pickups/recycler/assigned
// @access  Private (Recycler/Admin)
const getPickupsByRecycler = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const where = { recyclerId: req.user.id };
  if (status) {
    where.status = status;
  }

  const pickups = await Pickup.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName', 'email', 'phone'],
      },
    ],
    order: [['scheduledDate', 'ASC']],
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit),
  });

  res.status(200).json({
    success: true,
    count: pickups.count,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: pickups.count,
      pages: Math.ceil(pickups.count / parseInt(limit)),
    },
    data: pickups.rows,
  });
});

// @desc    Track pickup by tracking number
// @route   GET /api/pickups/:id/track
// @access  Public
const trackPickup = asyncHandler(async (req, res) => {
  const pickup = await Pickup.findOne({
    where: { trackingNumber: req.params.id },
    attributes: [
      'id', 'trackingNumber', 'status', 'scheduledDate', 
      'scheduledTime', 'pickupCompletedAt', 'city', 'state'
    ],
    include: [
      {
        model: User,
        as: 'recycler',
        attributes: ['firstName', 'lastName', 'phone'],
      },
    ],
  });

  if (!pickup) {
    return res.status(404).json({
      success: false,
      error: 'Pickup not found',
    });
  }

  res.status(200).json({
    success: true,
    data: pickup,
  });
});

// @desc    Rate pickup
// @route   POST /api/pickups/:id/rate
// @access  Private
const ratePickup = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const pickup = await Pickup.findByPk(req.params.id);

  if (!pickup) {
    return res.status(404).json({
      success: false,
      error: 'Pickup not found',
    });
  }

  // Check ownership
  if (pickup.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to rate this pickup',
    });
  }

  // Can only rate completed pickups
  if (pickup.status !== 'completed') {
    return res.status(400).json({
      success: false,
      error: 'Can only rate completed pickups',
    });
  }

  const { rating, feedback } = req.body;

  const updatedPickup = await pickup.update({
    rating,
    feedback,
  });

  res.status(200).json({
    success: true,
    data: updatedPickup,
  });
});

// Helper function to get coordinates from address
const getCoordinatesFromAddress = async (address) => {
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    throw new Error('Google Maps API key not configured');
  }

  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
  );

  if (response.data.status === 'OK' && response.data.results.length > 0) {
    return response.data.results[0].geometry.location;
  }

  throw new Error('Address geocoding failed');
};

// Helper function to calculate and create rewards
const calculateAndCreateRewards = async (pickup) => {
  try {
    // Call AI model for reward prediction
    const response = await axios.post(`${process.env.AI_MODEL_SERVER_URL}/predict-incentive`, {
      weight: pickup.actualWeight,
      deviceTypes: [], // This would come from EWasteItems
      location: { city: pickup.city, state: pickup.state },
      userFrequency: pickup.user?.totalPickups || 1,
    });

    const rewardValue = response.data.predicted_value || 100; // Fallback value

    // Create reward (this would be implemented in the reward controller)
    console.log(`Creating reward of ${rewardValue} for pickup ${pickup.id}`);
  } catch (error) {
    console.log('AI prediction failed, using default reward calculation');
    // Fallback reward calculation
    const baseReward = pickup.actualWeight * 10; // 10 INR per kg
    console.log(`Creating fallback reward of ${baseReward} for pickup ${pickup.id}`);
  }
};

module.exports = {
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
};
