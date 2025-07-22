const express = require('express');
const Server = require('../models/Server');
const Plan = require('../models/Plan');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get user's servers
router.get('/', auth, async (req, res) => {
  try {
    const servers = await Server.find({ 
      owner: req.user._id,
      status: { $ne: 'deleted' }
    }).populate('plan');

    res.json({ servers });
  } catch (error) {
    console.error('Get servers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific server
router.get('/:id', auth, async (req, res) => {
  try {
    const server = await Server.findOne({
      _id: req.params.id,
      owner: req.user._id
    }).populate('plan');

    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    res.json({ server });
  } catch (error) {
    console.error('Get server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new server
router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      description,
      planId,
      minecraftVersion,
      serverType,
      configuration
    } = req.body;

    // Validation
    if (!name || !planId) {
      return res.status(400).json({ message: 'Server name and plan are required' });
    }

    // Get plan details
    const plan = await Plan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(400).json({ message: 'Invalid or inactive plan' });
    }

    const user = req.user;

    // Check if user can use free plan
    if (plan.isFree && user.hasUsedFreePlan) {
      return res.status(400).json({ message: 'Free plan already used' });
    }

    // Check if user has active subscription for paid plans
    if (!plan.isFree && user.subscriptionStatus !== 'active') {
      return res.status(400).json({ message: 'Active subscription required for paid plans' });
    }

    // Check server limits
    const existingServers = await Server.countDocuments({
      owner: user._id,
      status: { $ne: 'deleted' }
    });

    const maxServers = user.currentPlan ? user.currentPlan.maxServers : plan.maxServers;
    if (existingServers >= maxServers) {
      return res.status(400).json({ message: 'Server limit reached for current plan' });
    }

    // Generate unique port
    const port = await Server.generatePort();

    // Create server
    const server = new Server({
      name,
      description,
      owner: user._id,
      plan: planId,
      minecraftVersion: minecraftVersion || '1.20.1',
      serverType: serverType || 'vanilla',
      port,
      configuration: {
        ...configuration,
        maxPlayers: Math.min(configuration?.maxPlayers || 20, plan.features.playerSlots)
      }
    });

    // Set expiration for free servers (7 days)
    if (plan.isFree) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);
      server.expiresAt = expirationDate;
    }

    await server.save();

    // Update user if using free plan
    if (plan.isFree) {
      user.hasUsedFreePlan = true;
      await user.save();
    }

    // Add server to user's servers
    user.servers.push(server._id);
    await user.save();

    // Simulate server deployment (in production, this would interact with Docker/Kubernetes)
    setTimeout(async () => {
      try {
        server.status = 'running';
        server.ipAddress = '127.0.0.1'; // In production, this would be the actual server IP
        server.lastStarted = new Date();
        await server.save();
      } catch (error) {
        console.error('Server deployment error:', error);
      }
    }, 5000);

    res.status(201).json({
      message: 'Server created successfully',
      server: await Server.findById(server._id).populate('plan')
    });
  } catch (error) {
    console.error('Create server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
router.post('/:id/start', auth, async (req, res) => {
  try {
    const server = await Server.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    if (server.isExpired()) {
      return res.status(400).json({ message: 'Server has expired' });
    }

    if (server.status === 'running') {
      return res.status(400).json({ message: 'Server is already running' });
    }

    server.status = 'running';
    server.lastStarted = new Date();
    await server.save();

    res.json({ message: 'Server started successfully', server });
  } catch (error) {
    console.error('Start server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Stop server
router.post('/:id/stop', auth, async (req, res) => {
  try {
    const server = await Server.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    if (server.status === 'stopped') {
      return res.status(400).json({ message: 'Server is already stopped' });
    }

    server.status = 'stopped';
    server.lastStopped = new Date();
    await server.save();

    res.json({ message: 'Server stopped successfully', server });
  } catch (error) {
    console.error('Stop server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete server
router.delete('/:id', auth, async (req, res) => {
  try {
    const server = await Server.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    // Soft delete
    server.status = 'deleted';
    server.isActive = false;
    await server.save();

    // Remove from user's servers
    const user = await User.findById(req.user._id);
    user.servers = user.servers.filter(serverId => !serverId.equals(server._id));
    await user.save();

    res.json({ message: 'Server deleted successfully' });
  } catch (error) {
    console.error('Delete server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update server configuration
router.put('/:id/config', auth, async (req, res) => {
  try {
    const { configuration } = req.body;
    
    const server = await Server.findOne({
      _id: req.params.id,
      owner: req.user._id
    }).populate('plan');

    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    // Validate configuration against plan limits
    if (configuration.maxPlayers > server.plan.features.playerSlots) {
      return res.status(400).json({ 
        message: `Max players cannot exceed ${server.plan.features.playerSlots} for your plan` 
      });
    }

    server.configuration = { ...server.configuration, ...configuration };
    await server.save();

    res.json({ message: 'Server configuration updated', server });
  } catch (error) {
    console.error('Update server config error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;