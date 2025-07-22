const express = require('express');
const User = require('../models/User');
const Plan = require('../models/Plan');
const Server = require('../models/Server');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

// Get dashboard stats
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const [userCount, serverCount, planCount, activeServers] = await Promise.all([
      User.countDocuments(),
      Server.countDocuments({ status: { $ne: 'deleted' } }),
      Plan.countDocuments({ isActive: true }),
      Server.countDocuments({ status: 'running' })
    ]);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username email createdAt subscriptionStatus');

    const recentServers = await Server.find({ status: { $ne: 'deleted' } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('owner', 'username')
      .populate('plan', 'displayName');

    res.json({
      stats: {
        totalUsers: userCount,
        totalServers: serverCount,
        totalPlans: planCount,
        activeServers
      },
      recentUsers,
      recentServers
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .populate('currentPlan', 'displayName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all servers
router.get('/servers', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const servers = await Server.find({ status: { $ne: 'deleted' } })
      .populate('owner', 'username email')
      .populate('plan', 'displayName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Server.countDocuments({ status: { $ne: 'deleted' } });

    res.json({
      servers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalServers: total
      }
    });
  } catch (error) {
    console.error('Get servers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Suspend/Unsuspend user
router.put('/users/:id/suspend', adminAuth, async (req, res) => {
  try {
    const { suspend } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (suspend) {
      user.subscriptionStatus = 'suspended';
      // Stop all user servers
      await Server.updateMany(
        { owner: userId, status: 'running' },
        { status: 'suspended' }
      );
    } else {
      user.subscriptionStatus = user.currentPlan ? 'active' : 'inactive';
      // Reactivate suspended servers
      await Server.updateMany(
        { owner: userId, status: 'suspended' },
        { status: 'stopped' }
      );
    }

    await user.save();

    res.json({
      message: `User ${suspend ? 'suspended' : 'unsuspended'} successfully`,
      user: {
        id: user._id,
        username: user.username,
        subscriptionStatus: user.subscriptionStatus
      }
    });
  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Initialize default plans
router.post('/init-plans', adminAuth, async (req, res) => {
  try {
    // Check if plans already exist
    const existingPlans = await Plan.countDocuments();
    if (existingPlans > 0) {
      return res.status(400).json({ message: 'Plans already initialized' });
    }

    const defaultPlans = [
      {
        name: 'free',
        displayName: 'Free Plan',
        description: 'Perfect for testing and small projects. Limited time offer!',
        price: 0,
        currency: 'INR',
        billingCycle: 'one-time',
        features: {
          ram: 1,
          storage: 5,
          playerSlots: 5,
          cpuCores: 1,
          bandwidth: 50,
          backups: false,
          ddosProtection: false,
          customDomain: false,
          priority_support: false
        },
        isFree: true,
        maxServers: 1
      },
      {
        name: 'starter',
        displayName: 'Starter',
        description: 'Great for small communities and friends',
        price: 100,
        currency: 'INR',
        billingCycle: 'monthly',
        features: {
          ram: 2,
          storage: 10,
          playerSlots: 10,
          cpuCores: 1,
          bandwidth: 100,
          backups: true,
          ddosProtection: false,
          customDomain: false,
          priority_support: false
        },
        isFree: false,
        maxServers: 1
      },
      {
        name: 'basic',
        displayName: 'Basic',
        description: 'Perfect for growing communities',
        price: 250,
        currency: 'INR',
        billingCycle: 'monthly',
        features: {
          ram: 4,
          storage: 20,
          playerSlots: 20,
          cpuCores: 2,
          bandwidth: 200,
          backups: true,
          ddosProtection: true,
          customDomain: false,
          priority_support: false
        },
        isFree: false,
        maxServers: 2
      },
      {
        name: 'premium',
        displayName: 'Premium',
        description: 'For serious communities and content creators',
        price: 500,
        currency: 'INR',
        billingCycle: 'monthly',
        features: {
          ram: 8,
          storage: 50,
          playerSlots: 50,
          cpuCores: 4,
          bandwidth: 500,
          backups: true,
          ddosProtection: true,
          customDomain: true,
          priority_support: true
        },
        isFree: false,
        maxServers: 3
      },
      {
        name: 'enterprise',
        displayName: 'Enterprise',
        description: 'Maximum performance for large communities',
        price: 1000,
        currency: 'INR',
        billingCycle: 'monthly',
        features: {
          ram: 16,
          storage: 100,
          playerSlots: 100,
          cpuCores: 8,
          bandwidth: 1000,
          backups: true,
          ddosProtection: true,
          customDomain: true,
          priority_support: true
        },
        isFree: false,
        maxServers: 5
      },
      {
        name: 'ultimate',
        displayName: 'Ultimate',
        description: 'Unlimited power for the biggest servers',
        price: 2000,
        currency: 'INR',
        billingCycle: 'monthly',
        features: {
          ram: 32,
          storage: 200,
          playerSlots: 200,
          cpuCores: 16,
          bandwidth: 2000,
          backups: true,
          ddosProtection: true,
          customDomain: true,
          priority_support: true
        },
        isFree: false,
        maxServers: 10
      },
      {
        name: 'mega',
        displayName: 'Mega',
        description: 'For the most demanding server networks',
        price: 5000,
        currency: 'INR',
        billingCycle: 'monthly',
        features: {
          ram: 64,
          storage: 500,
          playerSlots: 500,
          cpuCores: 32,
          bandwidth: 5000,
          backups: true,
          ddosProtection: true,
          customDomain: true,
          priority_support: true
        },
        isFree: false,
        maxServers: 20
      }
    ];

    const createdPlans = await Plan.insertMany(defaultPlans);

    res.status(201).json({
      message: 'Default plans created successfully',
      plans: createdPlans
    });
  } catch (error) {
    console.error('Init plans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;