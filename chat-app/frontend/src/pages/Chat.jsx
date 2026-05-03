import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { MessageCircle, Users, Send, Image, Mic } from 'lucide-react';

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Load chats
      axios.get('/api/chats')
        .then(res => setChats(res.data))
        .catch(console.error);
      
      // Init socket
      const newSocket = io('http://localhost:5000');
      newSocket.emit('join', 'user123'); // Replace with real user ID
      
      newSocket.on('receive_message', (msg) => {
        if (msg.chatId === selectedChat?._id) {
          setMessages(prev => [...prev, msg]);
        }
      });
      
      newSocket.on('typing', ({ userId, isTyping }) => {
        setTyping(isTyping ? 'Someone is typing...' : '');
      });
      
      setSocket(newSocket);
      
      return () => newSocket.disconnect();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket && selectedChat) {
      socket.emit('send_message', {
        chatId: selectedChat._id,
        content: newMessage,
        messageType: 'text'
      });
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Sidebar - Chat List */}
      <div className="w-80 bg-gray-900 border-r border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageCircle size={24} />
            Chats
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <div
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className="p-4 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-b-0 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                {chat.chatName?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{chat.chatName || 'Chat'}</p>
                <p className="text-sm text-gray-400 truncate">
                  {chat.latestMessage?.content || 'No messages yet'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="p-4 bg-gray-800 border-b border-gray-700 flex items-center gap-4">
              <div className="w-10 h-10 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-semibold">{selectedChat.chatName}</p>
                <p className="text-sm text-green-400">Online</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {typing && <div className="text-sm text-gray-400">{typing}</div>}
              {messages.map((msg, idx) => (
                <div key={idx} className={`chat-bubble ${msg.senderId === 'user123' ? 'sent' : 'received'}`}>
                  <p>{msg.content}</p>
                  <p className="text-xs opacity-75 mt-1">12:34</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 bg-gray-900 border-t border-gray-700">
              <div className="flex items-end gap-2">
                <button className="p-3 hover:bg-gray-800 rounded-full transition-colors">
                  <Image size={20} />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl px-5 py-3 focus:outline-none focus:border-green-500"
                />
                <button 
                  type="submit" 
                  className="p-3 bg-green-500 hover:bg-green-600 rounded-full transition-colors"
                  disabled={!newMessage.trim()}
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
