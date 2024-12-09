const Subscription = require('../models/Subscription');

// Add a subscription
exports.addSubscription = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({ message: 'This email is already subscribed' });
    }

    const newSubscription = new Subscription({ email });
    await newSubscription.save();
    res.status(201).json({ message: 'Subscription added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding subscription', error: error.message });
  }
};

// Get all subscriptions
exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find().select('email subscribedAt -_id');
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving subscriptions', error: error.message });
  }
};
