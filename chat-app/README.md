# WhatsApp-like Real-Time Chat Application

## Architecture Overview
- **Monolith initially** (for simplicity, easy deployment), designed for microservices split.
- **Backend**: Node.js + Express + Socket.IO + MongoDB
- **Frontend**: React + Tailwind CSS + Socket.IO-client
- **Storage**: AWS S3 for media
- **Auth**: JWT + Google OAuth
- **Real-time**: Socket.IO (WebSockets)
- **Scaling**: PM2 clustering, Redis pub/sub, message queues (BullMQ)

## Folder Structure
```
chat-app/
├── backend/
│   ├── src/
│   │   ├── models/     # Mongoose schemas (User, Chat, Message)
│   │   ├── routes/     # REST APIs (auth, users, chats)
│   │   ├── sockets/    # Socket.IO events
│   │   ├── middleware/ # Auth, validation
│   │   ├── config/     # DB, AWS, JWT secrets
│   │   └── server.js   # Entry point
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/ # ChatList, ChatWindow, MessageBubble
│   │   ├── hooks/      # useAuth, useSocket
│   │   ├── pages/      # Login, Chat
│   │   └── App.js
│   ├── package.json
│   └── tailwind.config.js
├── docs/
│   └── architecture.md
└── docker-compose.yml
```

## Quick Start
1. Backend: `cd backend && npm install && npm start`
2. Frontend: `cd frontend && npm install && npm start`
3. MongoDB: Use Docker or Atlas
4. Env vars: See .env.example

## Features Implemented
- User auth (email/password + Google)
- 1:1 & group chats
- Real-time messaging with status (sent/delivered/read)
- Typing indicators, online presence
- Media upload (images/files to S3)
- Responsive UI

## Scaling Strategy
- Horizontal scaling with PM2 + Nginx
- Redis for Socket.IO adapter
- MongoDB sharding
- BullMQ for push notifications


