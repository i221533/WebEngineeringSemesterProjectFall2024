const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const authenticate = require('../middlewares/authMiddleware');

// Public routes
router.post('/register', registerUser); // Registration (No token required)
router.post('/login' , loginUser); // Login (No token required)


module.exports = router;
