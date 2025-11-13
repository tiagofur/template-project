# ⚡ WebSocket Integration Guide

Guía completa para comunicación en tiempo real con WebSocket y Socket.IO.

## 🚀 Quick Start

### Socket.IO Setup

```bash
npm install socket.io @types/socket.io
```

```typescript
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

httpServer.listen(3000);
```

## 🔐 Authentication

```typescript
import jwt from 'jsonwebtoken';

io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication required'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.data.user = decoded;
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  const user = socket.data.user;
  console.log(`User ${user.id} connected`);
});
```

## 📨 Events

### Server Events

```typescript
io.on('connection', (socket) => {
  // Listen to events
  socket.on('message', (data) => {
    console.log('Received:', data);
    
    // Send to sender only
    socket.emit('message-received', { id: data.id });
    
    // Send to all except sender
    socket.broadcast.emit('new-message', data);
    
    // Send to all
    io.emit('message-broadcast', data);
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('user-typing', {
      userId: socket.data.user.id,
      ...data,
    });
  });

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', {
      userId: socket.data.user.id,
    });
  });

  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    socket.to(roomId).emit('user-left', {
      userId: socket.data.user.id,
    });
  });
});
```

### Client Events

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token',
  },
});

// Connection events
socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

// Custom events
socket.emit('message', { text: 'Hello!' });

socket.on('new-message', (data) => {
  console.log('New message:', data);
});

// Join room
socket.emit('join-room', 'room-123');
```

## 🏠 Rooms & Namespaces

### Rooms (Dynamic Groups)

```typescript
// Join room
socket.join('room-123');

// Leave room
socket.leave('room-123');

// Send to room
io.to('room-123').emit('message', data);

// Send to multiple rooms
io.to('room-1').to('room-2').emit('message', data);

// Get rooms
const rooms = socket.rooms; // Set of room IDs

// Check if in room
const inRoom = socket.rooms.has('room-123');
```

### Namespaces (Static Separation)

```typescript
// Create namespace
const chatNamespace = io.of('/chat');
const notificationNamespace = io.of('/notifications');

chatNamespace.on('connection', (socket) => {
  console.log('Chat connection');
  
  socket.on('message', (data) => {
    chatNamespace.emit('new-message', data);
  });
});

notificationNamespace.on('connection', (socket) => {
  console.log('Notification connection');
  
  socket.on('subscribe', (channel) => {
    socket.join(channel);
  });
});

// Client
const chatSocket = io('http://localhost:3000/chat');
const notifSocket = io('http://localhost:3000/notifications');
```

## 💓 Heartbeat & Reconnection

### Server Heartbeat

```typescript
const HEARTBEAT_INTERVAL = 25000; // 25 seconds

io.on('connection', (socket) => {
  let heartbeatTimeout: NodeJS.Timeout;

  const sendHeartbeat = () => {
    socket.emit('ping');
    
    heartbeatTimeout = setTimeout(() => {
      console.log('Heartbeat timeout, disconnecting');
      socket.disconnect();
    }, HEARTBEAT_INTERVAL);
  };

  socket.on('pong', () => {
    clearTimeout(heartbeatTimeout);
    setTimeout(sendHeartbeat, HEARTBEAT_INTERVAL);
  });

  sendHeartbeat();
});
```

### Client Reconnection

```typescript
const socket = io('http://localhost:3000', {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
});

socket.on('reconnect_attempt', (attempt) => {
  console.log(`Reconnection attempt ${attempt}`);
});

socket.on('reconnect', (attempt) => {
  console.log(`Reconnected after ${attempt} attempts`);
});

socket.on('reconnect_error', (error) => {
  console.error('Reconnection error:', error);
});

socket.on('reconnect_failed', () => {
  console.error('Failed to reconnect');
});

// Heartbeat response
socket.on('ping', () => {
  socket.emit('pong');
});
```

## 🔄 Message Acknowledgements

```typescript
// Server
socket.on('message', (data, callback) => {
  console.log('Received:', data);
  
  // Send acknowledgement
  callback({
    status: 'received',
    timestamp: Date.now(),
  });
});

// Client
socket.emit('message', { text: 'Hello' }, (ack) => {
  console.log('Acknowledged:', ack);
});

// With timeout
socket.timeout(5000).emit('message', data, (err, response) => {
  if (err) {
    console.error('Timeout or error:', err);
  } else {
    console.log('Response:', response);
  }
});
```

## 📊 Room Management

```typescript
class RoomManager {
  private rooms = new Map<string, Set<string>>();

  join(socketId: string, roomId: string) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId)!.add(socketId);
  }

  leave(socketId: string, roomId: string) {
    this.rooms.get(roomId)?.delete(socketId);
    
    if (this.rooms.get(roomId)?.size === 0) {
      this.rooms.delete(roomId);
    }
  }

  leaveAll(socketId: string) {
    for (const [roomId, sockets] of this.rooms.entries()) {
      sockets.delete(socketId);
      
      if (sockets.size === 0) {
        this.rooms.delete(roomId);
      }
    }
  }

  getRoomSockets(roomId: string): string[] {
    return Array.from(this.rooms.get(roomId) || []);
  }

  getUserRooms(socketId: string): string[] {
    const rooms: string[] = [];
    
    for (const [roomId, sockets] of this.rooms.entries()) {
      if (sockets.has(socketId)) {
        rooms.push(roomId);
      }
    }
    
    return rooms;
  }
}
```

## 🔌 NestJS Integration

```typescript
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any
  ) {
    this.server.emit('new-message', {
      id: client.id,
      ...data,
    });
    
    return { status: 'received' };
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string
  ) {
    client.join(roomId);
    client.to(roomId).emit('user-joined', client.id);
  }
}
```

## 🌍 Scaling with Redis

```typescript
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient({ url: 'redis://localhost:6379' });
const subClient = pubClient.duplicate();

await Promise.all([
  pubClient.connect(),
  subClient.connect(),
]);

io.adapter(createAdapter(pubClient, subClient));

// Now Socket.IO works across multiple servers
```

## 🔒 Security

```typescript
// Rate limiting
const rateLimiter = new Map<string, number[]>();

io.use((socket, next) => {
  const socketId = socket.id;
  const now = Date.now();
  const window = 60000; // 1 minute
  const maxRequests = 100;

  if (!rateLimiter.has(socketId)) {
    rateLimiter.set(socketId, []);
  }

  const timestamps = rateLimiter.get(socketId)!;
  const recentRequests = timestamps.filter(t => now - t < window);

  if (recentRequests.length >= maxRequests) {
    return next(new Error('Rate limit exceeded'));
  }

  recentRequests.push(now);
  rateLimiter.set(socketId, recentRequests);
  next();
});

// Input validation
socket.on('message', (data) => {
  if (typeof data.text !== 'string' || data.text.length > 1000) {
    socket.emit('error', { message: 'Invalid message' });
    return;
  }

  // Process message
});

// Sanitize output
import DOMPurify from 'isomorphic-dompurify';

socket.on('message', (data) => {
  const sanitized = DOMPurify.sanitize(data.text);
  io.emit('new-message', { text: sanitized });
});
```

## 🧪 Testing

```typescript
import { io as Client, Socket } from 'socket.io-client';
import { createServer } from 'http';
import { Server } from 'socket.io';

describe('WebSocket', () => {
  let io: Server;
  let serverSocket: Socket;
  let clientSocket: Socket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = (httpServer.address() as any).port;
      clientSocket = Client(`http://localhost:${port}`);
      
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
      
      clientSocket.on('connect', done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  it('should send and receive message', (done) => {
    clientSocket.on('hello', (data) => {
      expect(data).toBe('world');
      done();
    });

    serverSocket.emit('hello', 'world');
  });
});
```

## 📚 Resources

- [Socket.IO Docs](https://socket.io/docs/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Socket.IO Redis Adapter](https://socket.io/docs/v4/redis-adapter/)

---

_WebSocket Integration Guide_ ⚡
