

const STRIPE_PUBLISHABLE_KEY="pk_test_51QOpTACKRhyXOJRYBFqxtnQ2Nw1UPduX3BnSFWoG6IMAVysqaVs0j23z076QzR6KrnhlVb2weUtH3oF4NLBt6lJR00Xs9AZAoD"
const STRIPE_SECRET_KEY="sk_test_51QOpTACKRhyXOJRYidGi3bZ0jSl07bTuXDpStasWUa2MLfVFD7CCA1CvBN0fcezphEvZyanbc4vnRx0HiKIJquKq00ZMwRSQf8"


const stripe = require('stripe')(STRIPE_SECRET_KEY)

exports.renderBuyPage = (req, res) => {
  res.render('buy', { 
    key: STRIPE_PUBLISHABLE_KEY,
    amount: 2000 // Example amount, replace with your actual amount
  });
};

exports.payment = async (req, res) => {
  try {
    const { amount, productName } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: productName,
          },
          unit_amount: amount, // This should already be in cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/payment/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/payment/failure`,
    });

    return res.json({ id: session.id }); // Ensure return here
  } catch (error) {
    console.error('Stripe session creation error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

exports.success = (req, res) => {
  res.render('success');



};

exports.failure = (req, res) => {
    return  res.redirect('http://localhost:5173/place-order'); // Adjust the route as needed

};

