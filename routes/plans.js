const express = require('express');
const Plan = require('../models/Plan');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Get all active plans
router.get('/', async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ price: 1 });
    res.json({ plans });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific plan
router.get('/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.json({ plan });
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create plan (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const {
      name,
      displayName,
      description,
      price,
      currency,
      billingCycle,
      features,
      isFree,
      maxServers,
      stripeProductId,
      stripePriceId
    } = req.body;

    // Validation
    if (!name || !displayName || !description || price === undefined || !features) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    // Check if plan name already exists
    const existingPlan = await Plan.findOne({ name });
    if (existingPlan) {
      return res.status(400).json({ message: 'Plan name already exists' });
    }

    // Ensure only one free plan exists
    if (isFree) {
      const existingFreePlan = await Plan.findOne({ isFree: true });
      if (existingFreePlan) {
        return res.status(400).json({ message: 'Free plan already exists' });
      }
    }

    const plan = new Plan({
      name,
      displayName,
      description,
      price,
      currency: currency || 'USD',
      billingCycle: billingCycle || 'monthly',
      features,
      isFree: isFree || false,
      maxServers: maxServers || 1,
      stripeProductId,
      stripePriceId
    });

    await plan.save();

    res.status(201).json({
      message: 'Plan created successfully',
      plan
    });
  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update plan (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const planId = req.params.id;
    const updates = req.body;

    // Don't allow updating certain fields
    delete updates._id;
    delete updates.createdAt;

    const plan = await Plan.findByIdAndUpdate(
      planId,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.json({
      message: 'Plan updated successfully',
      plan
    });
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete plan (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Soft delete by setting isActive to false
    plan.isActive = false;
    await plan.save();

    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get free plan
router.get('/free/available', auth, async (req, res) => {
  try {
    const user = req.user;
    
    if (user.hasUsedFreePlan) {
      return res.status(400).json({ 
        message: 'Free plan already used',
        canUseFree: false
      });
    }

    const freePlan = await Plan.findOne({ isFree: true, isActive: true });
    
    if (!freePlan) {
      return res.status(404).json({ message: 'Free plan not available' });
    }

    res.json({
      canUseFree: true,
      plan: freePlan
    });
  } catch (error) {
    console.error('Get free plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;