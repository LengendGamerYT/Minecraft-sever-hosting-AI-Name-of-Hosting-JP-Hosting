const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly', 'one-time'],
    default: 'monthly'
  },
  features: {
    ram: {
      type: Number,
      required: true // in GB
    },
    storage: {
      type: Number,
      required: true // in GB
    },
    playerSlots: {
      type: Number,
      required: true
    },
    cpuCores: {
      type: Number,
      required: true
    },
    bandwidth: {
      type: Number,
      required: true // in GB
    },
    backups: {
      type: Boolean,
      default: false
    },
    ddosProtection: {
      type: Boolean,
      default: false
    },
    customDomain: {
      type: Boolean,
      default: false
    },
    priority_support: {
      type: Boolean,
      default: false
    }
  },
  isFree: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  stripeProductId: {
    type: String,
    default: null
  },
  stripePriceId: {
    type: String,
    default: null
  },
  maxServers: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

planSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Plan', planSchema);