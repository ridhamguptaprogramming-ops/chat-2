const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: String,
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  },
  messageStatus: {
    sent: { type: Boolean, default: true },
    delivered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    read: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  isMedia: { type: Boolean, default: false },
  mediaUrl: String,
  mediaType: String, // 'image', 'video', 'file'
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
