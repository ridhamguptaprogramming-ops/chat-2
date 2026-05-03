const User = require('../models/User');

let onlineUsers = new Map(); // userId -> socketId

const initSocket = (io) => {
  io.on('connection', async (socket) => {
    console.log('User connected:', socket.id);

    // Join user room
    socket.on('join', async (userId) => {
      onlineUsers.set(userId, socket.id);
      await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date() });
      
      socket.join(userId);
      io.emit('user_online', userId);
      
      // Send online users list to all
      const onlineList = Array.from(onlineUsers.keys());
      socket.emit('online_users', onlineList);
    });

    // Typing indicator
    socket.on('typing', ({ chatId, userId, isTyping }) => {
      socket.to(chatId).emit('typing', { userId, isTyping });
    });

    // Message sent
    socket.on('send_message', ({ chatId, content, messageType }) => {
      // Broadcast to chat room
      socket.to(chatId).emit('receive_message', { 
        chatId, 
        content, 
        senderId: socket.userId, 
        messageType,
        timestamp: new Date()
      });
    });

    // Message status update
    socket.on('message_status', ({ messageId, status, recipients }) => {
      socket.to(recipients).emit('message_status_update', { messageId, status });
    });

    socket.on('disconnect', async () => {
      const userId = Array.from(onlineUsers.entries())
        .find(([_, sid]) => sid === socket.id)?.[0];
      
      if (userId) {
        onlineUsers.delete(userId);
        await User.findByIdAndUpdate(userId, { 
          isOnline: false, 
          lastSeen: new Date() 
        });
        io.emit('user_offline', userId);
      }
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = { initSocket };
