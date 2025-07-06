const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Pickup = sequelize.define('Pickup', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  recyclerId: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  pickupAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 6],
    },
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
  },
  scheduledDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  scheduledTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'scheduled', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
  },
  estimatedWeight: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  actualWeight: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  estimatedValue: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  actualValue: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  contactPerson: {
    type: DataTypes.STRING,
  },
  contactPhone: {
    type: DataTypes.STRING,
  },
  pickupCompletedAt: {
    type: DataTypes.DATE,
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5,
    },
  },
  feedback: {
    type: DataTypes.TEXT,
  },
  trackingNumber: {
    type: DataTypes.STRING,
    unique: true,
  },
  routeOptimizationData: {
    type: DataTypes.JSONB,
  },
}, {
  hooks: {
    beforeCreate: (pickup) => {
      // Generate tracking number
      pickup.trackingNumber = 'RL' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();
    },
  },
  indexes: [
    {
      fields: ['userId'],
    },
    {
      fields: ['recyclerId'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['scheduledDate'],
    },
    {
      fields: ['trackingNumber'],
      unique: true,
    },
  ],
});

module.exports = { Pickup };
