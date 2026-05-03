const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user chats
router.get('/', auth, async (req, res) => {
  try {
    const chats = await req.user.populate({
      path: 'chats',
      populate: [
        { path: 'latestMessage' },
        { path: 'users', select: 'name profilePic isOnline' }
      ]
    });
    
    res.json(chats.chats || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create chat (1:1)
router.post('/', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    // Logic to create/find chat between req.user and userId
    res.json({ message: 'Chat created' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
