# Architecture Design

## System Design (WhatsApp-scale thinking)

```
Load Balancer (Nginx) 
    ↓
[Socket.IO Servers] (PM2 clustering, Redis adapter)
    ↓
MongoDB Sharded Cluster + Redis (sessions, pub/sub)
    ↓
BullMQ (message queue) → Push notifications (FCM/APNs)
    ↓
AWS S3 (media storage)
```

## Key Design Decisions

### 1. **Monolith → Microservices Path**
- Start monolith for speed
- Split later: auth-service, chat-service, notification-service

### 2. **Real-time Architecture**
```
Socket.IO + Redis Adapter:
- Sticky sessions NOT required
- Horizontal scaling across multiple Node instances
- Rooms for 1:1 (userId1_userId2) and groups
```

### 3. **Data Model**
```
User → hasMany → Chats ← hasMany → Messages
Chat: { users[], latestMessage, groupAdmin }
Message: { sender, content, status: {delivered:[], read:[]}}
```

### 4. **Scaling Strategy**
```
1. Vertical: More CPU/RAM per server
2. Horizontal: More servers + Redis pub/sub
3. Sharding: MongoDB by chatId hash
4. Caching: Redis for online status, recent messages
5. Queue: BullMQ for non-critical tasks
```

### 5. **High Concurrency Handling**
- Socket.IO ACKs for delivery confirmation
- Message batching for groups
- Rate limiting per user/chat
- Connection limits per server

### 6. **Security**
```
✅ E2E Encryption (Signal Protocol later)
✅ JWT + Refresh tokens
✅ Socket auth with JWT
✅ Media URL expiration (S3 pre-signed)
✅ Input validation (express-validator)
✅ Rate limiting (express-rate-limit)
```

## Deployment Flow

```bash
# Backend
cd backend
npm install
cp .env.example .env  # Configure
npm start

# Frontend
cd frontend  
npm install
npm run dev

# Production
docker-compose up
```

## Production Deployment

```
Frontend: Vercel/Netlify
Backend: Railway/DigitalOcean App Platform
DB: MongoDB Atlas
Redis: Upstash
Storage: AWS S3 + CloudFront CDN
Monitoring: Sentry + Prometheus
```

## Scaling to Millions

1. **Message Sharding**: Partition by chatId
2. **Geo-replication**: Multi-region Socket.IO
3. **Edge Computing**: Socket.IO edge gateways
4. **Protocol Buffers**: Replace JSON for efficiency
5. **WebRTC**: P2P media for 1:1 calls

## Trade-offs

| Tech | Pros | Cons |
|------|------|------|
| **Socket.IO** | Easy, fallback to polling | Heavier than raw WS |
| **MongoDB** | Flexible schema | Complex transactions |
| **Node.js** | Great for I/O | Single-threaded CPU |

**Alternative Stack**: Go + Fiber + PostgreSQL (if strict consistency needed)

