const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EWasteItem = sequelize.define('EWasteItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  pickupId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Pickups',
      key: 'id',
    },
  },
  deviceType: {
    type: DataTypes.ENUM(
      'smartphone', 'laptop', 'desktop', 'tablet', 'television', 
      'refrigerator', 'washing_machine', 'air_conditioner', 'microwave',
      'printer', 'keyboard', 'mouse', 'monitor', 'speaker', 'camera',
      'battery', 'charger', 'cable', 'other'
    ),
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
  },
  model: {
    type: DataTypes.STRING,
  },
  condition: {
    type: DataTypes.ENUM('working', 'partially_working', 'not_working', 'damaged'),
    allowNull: false,
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
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1,
    },
  },
  description: {
    type: DataTypes.TEXT,
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
  classificationConfidence: {
    type: DataTypes.DECIMAL(5, 4),
    comment: 'AI model confidence score for device classification',
  },
  materialComposition: {
    type: DataTypes.JSONB,
    comment: 'Estimated material breakdown (e.g., {"plastic": 0.3, "metal": 0.5, "electronic": 0.2})',
  },
  recyclingInstructions: {
    type: DataTypes.TEXT,
  },
  hazardousComponents: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  refurbishmentPotential: {
    type: DataTypes.ENUM('high', 'medium', 'low', 'none'),
    defaultValue: 'none',
  },
  marketValue: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    comment: 'Current market value if refurbished',
  },
  processedAt: {
    type: DataTypes.DATE,
  },
  recycledAt: {
    type: DataTypes.DATE,
  },
  disposalMethod: {
    type: DataTypes.ENUM('recycling', 'refurbishment', 'safe_disposal', 'component_extraction'),
  },
  complianceStatus: {
    type: DataTypes.ENUM('pending', 'compliant', 'non_compliant'),
    defaultValue: 'pending',
  },
}, {
  indexes: [
    {
      fields: ['pickupId'],
    },
    {
      fields: ['deviceType'],
    },
    {
      fields: ['condition'],
    },
    {
      fields: ['brand'],
    },
  ],
});

module.exports = { EWasteItem };
