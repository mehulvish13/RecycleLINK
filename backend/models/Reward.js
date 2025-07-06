const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Reward = sequelize.define('Reward', {
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
  pickupId: {
    type: DataTypes.UUID,
    references: {
      model: 'Pickups',
      key: 'id',
    },
  },
  type: {
    type: DataTypes.ENUM('points', 'coupon', 'cashback', 'voucher', 'discount'),
    allowNull: false,
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'INR',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'redeemed', 'expired', 'cancelled'),
    defaultValue: 'pending',
  },
  issuedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  expiresAt: {
    type: DataTypes.DATE,
  },
  redeemedAt: {
    type: DataTypes.DATE,
  },
  redemptionCode: {
    type: DataTypes.STRING,
    unique: true,
  },
  minimumOrderValue: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  maximumDiscount: {
    type: DataTypes.DECIMAL(10, 2),
  },
  applicableCategories: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  partnerName: {
    type: DataTypes.STRING,
  },
  partnerLogo: {
    type: DataTypes.STRING,
  },
  termsAndConditions: {
    type: DataTypes.TEXT,
  },
  usageInstructions: {
    type: DataTypes.TEXT,
  },
  mlPredictionData: {
    type: DataTypes.JSONB,
    comment: 'ML model data used for reward calculation',
  },
  redemptionChannel: {
    type: DataTypes.ENUM('online', 'offline', 'app', 'website'),
  },
  isTransferable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  transferredTo: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  transferredAt: {
    type: DataTypes.DATE,
  },
}, {
  hooks: {
    beforeCreate: (reward) => {
      // Generate redemption code
      reward.redemptionCode = 'RW' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 6).toUpperCase();
      
      // Set expiry date if not provided (default 6 months)
      if (!reward.expiresAt) {
        reward.expiresAt = new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000);
      }
    },
  },
  indexes: [
    {
      fields: ['userId'],
    },
    {
      fields: ['pickupId'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['type'],
    },
    {
      fields: ['redemptionCode'],
      unique: true,
    },
    {
      fields: ['expiresAt'],
    },
  ],
});

module.exports = { Reward };
