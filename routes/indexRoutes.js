const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

router.get('/guest-token', async (req, res) => {
  try {
    // Create a new guest user
    const guestUsername = `guest_${Date.now()}`;
    const guestUser = new User({
        username: guestUsername,
        email: `${guestUsername}@example.com`,
        password: 'temporaryPassword', // You can hash this password if required
        role: 'user',
        isGuest: true,
        tokenExpiresAt: Date.now() + 60 * 60 * 1000
    });

    // Save guest user to DB
    await guestUser.save();

    // Create JWT token with expiration (e.g., 1 hour)
    const token = jwt.sign(
        { userId: guestUser._id, username: guestUser.username }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );

    // Send back the token
    res.json({ guestToken: token });
} catch (error) {
    console.error('Error creating guest user:', error);
    res.status(500).json({ error: 'Error creating guest token' });
}
});

module.exports = router;