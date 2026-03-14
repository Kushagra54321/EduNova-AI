const express = require('express');
const router = express.Router();
const { registerUser, authUser, resetPassword, guestLogin, autoLogin } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/reset-password', resetPassword);
router.post('/guest-login', guestLogin);
router.post('/auto-login', autoLogin);

module.exports = router;
