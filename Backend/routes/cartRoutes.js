const express = require('express');
const { addToCart, getCart, removeFromCart,getCartItems } = require('../controllers/cartController');
const router = express.Router();


router.post('/add', addToCart);


router.get('/cartitems/:email', getCart);
router.get('/usercart/:email', getCartItems);

router.delete('/remove/:email/:productId', removeFromCart);

module.exports = router;
