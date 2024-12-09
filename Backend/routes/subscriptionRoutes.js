const express = require('express');
const { addSubscription, getSubscriptions } = require('../controllers/subscriptionController');

const router = express.Router();

// Add a subscription
router.post('/add', addSubscription);

// Get all subscriptions
router.get('/subcriptions', getSubscriptions);

module.exports = router;
