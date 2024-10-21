const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/guest-token', (req, res) => {
  const guestToken = jwt.sign({ role: 'guest', id: 'guest-id' }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ guestToken });
});

module.exports = router;