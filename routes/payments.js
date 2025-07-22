const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Plan = require('../models/Plan');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { planId } = req.body;
    
    const plan = await Plan.findById(planId);
    if (!plan || plan.isFree) {
      return res.status(400).json({ message: 'Invalid plan for payment' });
    }

    const user = req.user;

    // Create or retrieve Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.username,
        metadata: {
          userId: user._id.toString()
        }
      });
      customerId = customer.id;
      
      user.stripeCustomerId = customerId;
      await user.save();
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(plan.price * 100), // Convert to paise for INR
      currency: 'inr',
      customer: customerId,
      metadata: {
        planId: planId,
        userId: user._id.toString(),
        planName: plan.name
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: plan.price,
      currency: 'INR'
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ message: 'Payment processing error' });
  }
});

// Handle successful payment
router.post('/confirm-payment', auth, async (req, res) => {
  try {
    const { paymentIntentId, planId } = req.body;
    
    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not successful' });
    }

    const plan = await Plan.findById(planId);
    const user = req.user;

    // Update user subscription
    user.currentPlan = planId;
    user.subscriptionStatus = 'active';
    
    // Set subscription end date based on billing cycle
    const endDate = new Date();
    if (plan.billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan.billingCycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    user.subscriptionEndDate = endDate;

    await user.save();

    res.json({
      message: 'Payment successful and subscription activated',
      subscription: {
        plan: plan.displayName,
        status: 'active',
        endDate: endDate
      }
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: 'Payment confirmation failed' });
  }
});

// Get payment history
router.get('/history', auth, async (req, res) => {
  try {
    const user = req.user;
    
    if (!user.stripeCustomerId) {
      return res.json({ payments: [] });
    }

    const payments = await stripe.paymentIntents.list({
      customer: user.stripeCustomerId,
      limit: 10,
    });

    const paymentHistory = payments.data.map(payment => ({
      id: payment.id,
      amount: payment.amount / 100,
      currency: payment.currency.toUpperCase(),
      status: payment.status,
      created: new Date(payment.created * 1000),
      planName: payment.metadata.planName
    }));

    res.json({ payments: paymentHistory });
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({ message: 'Failed to fetch payment history' });
  }
});

// Cancel subscription
router.post('/cancel-subscription', auth, async (req, res) => {
  try {
    const user = req.user;
    
    user.subscriptionStatus = 'cancelled';
    await user.save();

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ message: 'Failed to cancel subscription' });
  }
});

module.exports = router;