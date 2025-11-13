# 🔧 Backend Architecture Patterns

Complete guide to backend architecture patterns including when to use each, implementation examples, and decision criteria.

## Overview

Backend architecture patterns define how to structure server-side code for maintainability, scalability, and testability.

---

## 1. Layered Architecture

### Description

Layered Architecture organizes code into horizontal layers, where each layer depends only on layers below it. The most common arrangement is a 3-tier architecture: Presentation, Business Logic, and Data Access.

### Structure

```
┌─────────────────────────────────┐
│     Presentation Layer          │  ← Controllers, Routes, DTOs
├─────────────────────────────────┤
│     Business Logic Layer        │  ← Services, Domain Logic
├─────────────────────────────────┤
│     Data Access Layer           │  ← Repositories, ORM
├─────────────────────────────────┤
│         Database                │
└─────────────────────────────────┘
```

### When to Use

✅ **Use When:**
- Building small to medium applications
- Team is new to architecture patterns
- Quick time to market is priority
- Requirements are well-understood and stable
- Monolithic deployment is acceptable

❌ **Avoid When:**
- Need to swap frameworks frequently
- Complex domain logic requiring isolation
- Microservices architecture planned
- High testing complexity is acceptable

### Implementation Example (Node.js/TypeScript)

```typescript
// 1. Presentation Layer - Controller
// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  constructor(private userService: UserService) {}

  async getUser(req: Request, res: Response) {
    try {
      const user = await this.userService.getUser(req.params.id);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

// 2. Business Logic Layer - Service
// src/services/user.service.ts
import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.model';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    // Business validation
    if (!userData.email || !userData.password) {
      throw new Error('Email and password required');
    }
    
    // Check if user exists
    const existing = await this.userRepository.findByEmail(userData.email);
    if (existing) {
      throw new Error('User already exists');
    }
    
    return await this.userRepository.create(userData);
  }
}

// 3. Data Access Layer - Repository
// src/repositories/user.repository.ts
import { User } from '../models/user.model';
import { db } from '../database';

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return await db.users.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await db.users.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    return await db.users.create(userData);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    await db.users.update(userData, { where: { id } });
    return await this.findById(id);
  }
}
```

### Pros and Cons

**Pros:**
- ✅ Simple and easy to understand
- ✅ Well-known pattern, easy to onboard developers
- ✅ Clear separation of concerns
- ✅ Good for CRUD applications

**Cons:**
- ❌ Tight coupling between layers
- ❌ Difficult to test in isolation
- ❌ Framework dependencies spread across layers
- ❌ Database changes can ripple up

---

## 2. Clean Architecture

### Description

Clean Architecture enforces strict separation between business logic and external concerns. The core principle is the Dependency Rule: dependencies point inward, and inner layers know nothing about outer layers.

### Structure

```
┌─────────────────────────────────────────────┐
│        Frameworks & Drivers                 │  ← Web, DB, UI
│  ┌───────────────────────────────────────┐  │
│  │    Interface Adapters                 │  │  ← Controllers, Presenters
│  │  ┌─────────────────────────────────┐  │  │
│  │  │    Application Business Rules   │  │  │  ← Use Cases
│  │  │  ┌───────────────────────────┐  │  │  │
│  │  │  │  Enterprise Business Rules│  │  │  │  ← Entities
│  │  │  └───────────────────────────┘  │  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### When to Use

✅ **Use When:**
- Building complex, long-lived applications
- Need high testability
- Want framework independence
- Domain logic is complex and valuable
- Team has experience with architectural patterns

❌ **Avoid When:**
- Building simple CRUD apps
- Time to market is critical
- Team is small or inexperienced
- Requirements change drastically

### Implementation Example (Node.js/TypeScript)

```typescript
// 1. Domain Layer - Entity
// src/domain/entities/user.entity.ts
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    private passwordHash: string,
    public readonly createdAt: Date
  ) {}

  verifyPassword(password: string): boolean {
    // Domain logic for password verification
    return bcrypt.compareSync(password, this.passwordHash);
  }

  updatePassword(newPassword: string): void {
    // Business rule: password must be at least 8 characters
    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
    this.passwordHash = bcrypt.hashSync(newPassword, 10);
  }
}

// 2. Domain Layer - Repository Interface
// src/domain/repositories/user.repository.interface.ts
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}

// 3. Application Layer - Use Case
// src/application/use-cases/create-user.use-case.ts
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

export interface CreateUserDTO {
  email: string;
  name: string;
  password: string;
}

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: CreateUserDTO): Promise<User> {
    // Validation
    if (!dto.email || !dto.password) {
      throw new Error('Email and password are required');
    }

    // Business rule: check if user already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create entity
    const passwordHash = bcrypt.hashSync(dto.password, 10);
    const user = new User(
      generateId(),
      dto.email,
      dto.name,
      passwordHash,
      new Date()
    );

    // Persist
    return await this.userRepository.save(user);
  }
}

// 4. Infrastructure Layer - Repository Implementation
// src/infrastructure/repositories/user.repository.ts
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { PrismaClient } from '@prisma/client';

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({ where: { id } });
    if (!userData) return null;
    return this.toDomain(userData);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({ where: { email } });
    if (!userData) return null;
    return this.toDomain(userData);
  }

  async save(user: User): Promise<User> {
    const userData = await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        name: user.name,
      },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    });
    return this.toDomain(userData);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  private toDomain(data: any): User {
    return new User(
      data.id,
      data.email,
      data.name,
      data.passwordHash,
      data.createdAt
    );
  }
}

// 5. Interface Adapters - Controller
// src/interface-adapters/controllers/user.controller.ts
import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';

export class UserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async createUser(req: Request, res: Response) {
    try {
      const user = await this.createUserUseCase.execute(req.body);
      res.status(201).json({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
```

### Pros and Cons

**Pros:**
- ✅ Highly testable (business logic isolated)
- ✅ Framework independent
- ✅ Database independent
- ✅ Enforces separation of concerns
- ✅ Easy to understand dependencies

**Cons:**
- ❌ More complex initial setup
- ❌ More files and boilerplate
- ❌ Steeper learning curve
- ❌ Can be overkill for simple apps

---

## 3. Hexagonal Architecture (Ports & Adapters)

### Description

Hexagonal Architecture isolates the core business logic from external concerns through ports (interfaces) and adapters (implementations). The application core defines ports, and adapters implement them.

### Structure

```
         ┌──────────────────────────────┐
         │      Primary Adapters        │
         │   (REST, GraphQL, CLI)       │
         └──────────┬───────────────────┘
                    │
         ┌──────────▼───────────────────┐
         │      Primary Ports           │
         │    (Input Interfaces)        │
         ├──────────────────────────────┤
         │                              │
         │    Application Core          │
         │    (Business Logic)          │
         │                              │
         ├──────────────────────────────┤
         │    Secondary Ports           │
         │   (Output Interfaces)        │
         └──────────┬───────────────────┘
                    │
         ┌──────────▼───────────────────┐
         │    Secondary Adapters        │
         │  (DB, Email, External APIs)  │
         └──────────────────────────────┘
```

### When to Use

✅ **Use When:**
- Domain-driven design approach
- Need to swap infrastructure frequently
- Multiple input sources (REST, CLI, GraphQL)
- Testing infrastructure changes often
- Complex domain logic

❌ **Avoid When:**
- Simple CRUD applications
- Small team with limited experience
- Tight deadlines
- Infrastructure is stable and known

### Implementation Example (Node.js/TypeScript)

```typescript
// 1. Core Domain - Entity
// src/core/domain/user.ts
export class User {
  constructor(
    public id: string,
    public email: string,
    public name: string
  ) {}
}

// 2. Primary Port (Input) - Application Service Interface
// src/core/ports/in/user-service.port.ts
import { User } from '../../domain/user';

export interface CreateUserCommand {
  email: string;
  name: string;
  password: string;
}

export interface UserServicePort {
  createUser(command: CreateUserCommand): Promise<User>;
  getUser(id: string): Promise<User>;
}

// 3. Secondary Port (Output) - Repository Interface
// src/core/ports/out/user-repository.port.ts
import { User } from '../../domain/user';

export interface UserRepositoryPort {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}

// 4. Secondary Port (Output) - Email Interface
// src/core/ports/out/email-service.port.ts
export interface EmailServicePort {
  sendWelcomeEmail(email: string, name: string): Promise<void>;
}

// 5. Core Application Service (uses ports)
// src/core/services/user.service.ts
import { UserServicePort, CreateUserCommand } from '../ports/in/user-service.port';
import { UserRepositoryPort } from '../ports/out/user-repository.port';
import { EmailServicePort } from '../ports/out/email-service.port';
import { User } from '../domain/user';

export class UserService implements UserServicePort {
  constructor(
    private userRepository: UserRepositoryPort,
    private emailService: EmailServicePort
  ) {}

  async createUser(command: CreateUserCommand): Promise<User> {
    // Business validation
    const existing = await this.userRepository.findByEmail(command.email);
    if (existing) {
      throw new Error('User already exists');
    }

    // Create user
    const user = new User(
      generateId(),
      command.email,
      command.name
    );

    // Save
    const savedUser = await this.userRepository.save(user);

    // Send welcome email (async, non-blocking)
    await this.emailService.sendWelcomeEmail(user.email, user.name);

    return savedUser;
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

// 6. Primary Adapter - REST Controller
// src/adapters/in/rest/user.controller.ts
import { Request, Response } from 'express';
import { UserServicePort } from '../../../core/ports/in/user-service.port';

export class UserController {
  constructor(private userService: UserServicePort) {}

  async createUser(req: Request, res: Response) {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const user = await this.userService.getUser(req.params.id);
      res.json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

// 7. Secondary Adapter - Prisma Repository
// src/adapters/out/persistence/prisma-user.repository.ts
import { UserRepositoryPort } from '../../../core/ports/out/user-repository.port';
import { User } from '../../../core/domain/user';
import { PrismaClient } from '@prisma/client';

export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private prisma: PrismaClient) {}

  async save(user: User): Promise<User> {
    const saved = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
    return new User(saved.id, saved.email, saved.name);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return new User(user.id, user.email, user.name);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return new User(user.id, user.email, user.name);
  }
}

// 8. Secondary Adapter - Email Service
// src/adapters/out/email/sendgrid-email.service.ts
import { EmailServicePort } from '../../../core/ports/out/email-service.port';
import sgMail from '@sendgrid/mail';

export class SendGridEmailService implements EmailServicePort {
  constructor(apiKey: string) {
    sgMail.setApiKey(apiKey);
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    await sgMail.send({
      to: email,
      from: 'noreply@example.com',
      subject: 'Welcome!',
      text: `Welcome ${name}!`,
    });
  }
}
```

### Pros and Cons

**Pros:**
- ✅ Core business logic completely isolated
- ✅ Easy to swap implementations (DB, APIs, etc.)
- ✅ Highly testable with mocks
- ✅ Clear boundaries between layers
- ✅ Multiple adapters for same port

**Cons:**
- ❌ More abstractions and interfaces
- ❌ Can feel over-engineered for simple apps
- ❌ Requires discipline to maintain boundaries
- ❌ Initial setup complexity

---

## 4. Microservices Architecture

### Description

Microservices Architecture structures an application as a collection of loosely coupled, independently deployable services. Each service owns its data and communicates with others via APIs or message queues.

### Structure

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   User       │     │   Order      │     │   Payment    │
│   Service    │────▶│   Service    │────▶│   Service    │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
┌──────▼───────┐     ┌──────▼───────┐     ┌──────▼───────┐
│   User DB    │     │   Order DB   │     │  Payment DB  │
└──────────────┘     └──────────────┘     └──────────────┘
```

### When to Use

✅ **Use When:**
- Large, complex applications
- Different parts scale independently
- Multiple teams working on different services
- Need to use different technologies per service
- Continuous deployment requirements

❌ **Avoid When:**
- Small applications
- Limited team size
- Tight coupling between features
- Simple data relationships
- Limited DevOps capability

### Implementation Example

```typescript
// User Service
// user-service/src/index.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.get('/users/:id', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
  });
  res.json(user);
});

app.post('/users', async (req, res) => {
  const user = await prisma.user.create({
    data: req.body,
  });
  
  // Publish event to message queue
  await messageQueue.publish('user.created', {
    userId: user.id,
    email: user.email,
  });
  
  res.status(201).json(user);
});

app.listen(3001);

// Order Service
// order-service/src/index.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const app = express();
const prisma = new PrismaClient();

app.post('/orders', async (req, res) => {
  const { userId, items } = req.body;
  
  // Call User Service to verify user exists
  try {
    await axios.get(`http://user-service:3001/users/${userId}`);
  } catch (error) {
    return res.status(400).json({ error: 'User not found' });
  }
  
  // Create order
  const order = await prisma.order.create({
    data: {
      userId,
      items,
      status: 'pending',
    },
  });
  
  // Publish event
  await messageQueue.publish('order.created', {
    orderId: order.id,
    userId: order.userId,
    total: order.total,
  });
  
  res.status(201).json(order);
});

// Subscribe to user events
messageQueue.subscribe('user.created', async (event) => {
  console.log('New user created:', event.userId);
  // Could send welcome discount, etc.
});

app.listen(3002);

// API Gateway
// api-gateway/src/index.ts
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// Route to User Service
app.use('/api/users', createProxyMiddleware({
  target: 'http://user-service:3001',
  changeOrigin: true,
  pathRewrite: { '^/api/users': '/users' },
}));

// Route to Order Service
app.use('/api/orders', createProxyMiddleware({
  target: 'http://order-service:3002',
  changeOrigin: true,
  pathRewrite: { '^/api/orders': '/orders' },
}));

app.listen(3000);
```

### Communication Patterns

**1. Synchronous (REST/gRPC)**
```typescript
// Service-to-service HTTP call
const user = await axios.get(`http://user-service/users/${userId}`);
```

**2. Asynchronous (Message Queue)**
```typescript
// Publish event
await messageQueue.publish('order.created', orderData);

// Subscribe to events
messageQueue.subscribe('payment.completed', async (event) => {
  await updateOrderStatus(event.orderId, 'paid');
});
```

### Pros and Cons

**Pros:**
- ✅ Independent deployment and scaling
- ✅ Technology diversity (use best tool per service)
- ✅ Team autonomy
- ✅ Fault isolation
- ✅ Easy to understand individual services

**Cons:**
- ❌ Operational complexity
- ❌ Distributed system challenges
- ❌ Data consistency difficulties
- ❌ Testing complexity
- ❌ Network latency and failures

---

## 5. CQRS (Command Query Responsibility Segregation)

### Description

CQRS separates read and write operations into different models. Commands modify state, Queries retrieve state. Often paired with Event Sourcing.

### Structure

```
           ┌─────────────┐
           │   Client    │
           └──────┬──────┘
                  │
        ┌─────────┴─────────┐
        │                   │
  ┌─────▼──────┐     ┌──────▼─────┐
  │  Commands  │     │  Queries   │
  │   (Write)  │     │   (Read)   │
  └─────┬──────┘     └──────┬─────┘
        │                   │
  ┌─────▼──────┐     ┌──────▼─────┐
  │ Write Model│     │ Read Model │
  │  (Domain)  │     │  (DTO/VM)  │
  └─────┬──────┘     └──────┬─────┘
        │                   │
  ┌─────▼──────┐     ┌──────▼─────┐
  │ Write DB   │     │  Read DB   │
  │ (Postgres) │────▶│  (MongoDB) │
  └────────────┘     └────────────┘
        Event Sync
```

### When to Use

✅ **Use When:**
- Complex domain with different read/write needs
- High read-to-write ratio
- Need to optimize reads and writes separately
- Event sourcing is beneficial
- Scalability is critical

❌ **Avoid When:**
- Simple CRUD applications
- Reads and writes are similar
- Eventual consistency is unacceptable
- Team lacks experience with pattern
- Small scale applications

### Implementation Example (Node.js/TypeScript)

```typescript
// 1. Command - Write Side
// src/commands/create-order.command.ts
export class CreateOrderCommand {
  constructor(
    public readonly userId: string,
    public readonly items: OrderItem[],
    public readonly total: number
  ) {}
}

// 2. Command Handler
// src/commands/handlers/create-order.handler.ts
import { CreateOrderCommand } from '../create-order.command';
import { OrderRepository } from '../../write-model/repositories/order.repository';
import { EventBus } from '../../infrastructure/event-bus';

export class CreateOrderCommandHandler {
  constructor(
    private orderRepository: OrderRepository,
    private eventBus: EventBus
  ) {}

  async handle(command: CreateOrderCommand): Promise<string> {
    // Validate business rules
    if (command.total <= 0) {
      throw new Error('Order total must be positive');
    }

    // Create aggregate
    const order = new Order(
      generateId(),
      command.userId,
      command.items,
      command.total,
      'pending'
    );

    // Save to write database
    await this.orderRepository.save(order);

    // Publish domain event
    await this.eventBus.publish(new OrderCreatedEvent(
      order.id,
      order.userId,
      order.total,
      new Date()
    ));

    return order.id;
  }
}

// 3. Query - Read Side
// src/queries/get-order.query.ts
export class GetOrderQuery {
  constructor(public readonly orderId: string) {}
}

// 4. Query Handler
// src/queries/handlers/get-order.handler.ts
import { GetOrderQuery } from '../get-order.query';
import { OrderReadModel } from '../../read-model/order.read-model';

export class GetOrderQueryHandler {
  constructor(private orderReadRepository: OrderReadRepository) {}

  async handle(query: GetOrderQuery): Promise<OrderReadModel | null> {
    // Read from optimized read database
    return await this.orderReadRepository.findById(query.orderId);
  }
}

// 5. Read Model (Denormalized for queries)
// src/read-model/order.read-model.ts
export interface OrderReadModel {
  id: string;
  userId: string;
  userName: string;  // Denormalized from User
  userEmail: string; // Denormalized from User
  items: Array<{
    productId: string;
    productName: string;  // Denormalized from Product
    quantity: number;
    price: number;
  }>;
  total: number;
  status: string;
  createdAt: Date;
}

// 6. Event Handler - Sync Read Model
// src/events/handlers/order-created.handler.ts
import { OrderCreatedEvent } from '../order-created.event';
import { OrderReadRepository } from '../../read-model/repositories/order-read.repository';
import { UserRepository } from '../../read-model/repositories/user.repository';

export class OrderCreatedEventHandler {
  constructor(
    private orderReadRepository: OrderReadRepository,
    private userRepository: UserRepository
  ) {}

  async handle(event: OrderCreatedEvent): Promise<void> {
    // Get user details
    const user = await this.userRepository.findById(event.userId);

    // Create denormalized read model
    const readModel: OrderReadModel = {
      id: event.orderId,
      userId: event.userId,
      userName: user.name,
      userEmail: user.email,
      items: event.items,
      total: event.total,
      status: 'pending',
      createdAt: event.createdAt,
    };

    // Save to read database (could be MongoDB, ElasticSearch, etc.)
    await this.orderReadRepository.save(readModel);
  }
}

// 7. API Controller
// src/controllers/order.controller.ts
import { Request, Response } from 'express';
import { CreateOrderCommandHandler } from '../commands/handlers/create-order.handler';
import { GetOrderQueryHandler } from '../queries/handlers/get-order.handler';

export class OrderController {
  constructor(
    private createOrderHandler: CreateOrderCommandHandler,
    private getOrderHandler: GetOrderQueryHandler
  ) {}

  // Write endpoint
  async createOrder(req: Request, res: Response) {
    try {
      const command = new CreateOrderCommand(
        req.body.userId,
        req.body.items,
        req.body.total
      );
      const orderId = await this.createOrderHandler.handle(command);
      res.status(201).json({ orderId });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Read endpoint
  async getOrder(req: Request, res: Response) {
    try {
      const query = new GetOrderQuery(req.params.id);
      const order = await this.getOrderHandler.handle(query);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
```

### Pros and Cons

**Pros:**
- ✅ Optimized reads and writes independently
- ✅ Scalability (read/write databases separate)
- ✅ Complex queries without impacting writes
- ✅ Better performance for read-heavy systems
- ✅ Event sourcing integration

**Cons:**
- ❌ Increased complexity
- ❌ Eventual consistency challenges
- ❌ Data duplication
- ❌ More infrastructure to manage
- ❌ Learning curve

---

## Decision Matrix

### Choose Based on Project Characteristics

| Characteristic | Layered | Clean | Hexagonal | Microservices | CQRS |
|----------------|---------|-------|-----------|---------------|------|
| **Complexity** | Low | Medium | Medium-High | High | High |
| **Team Size** | 1-5 | 3-10 | 5-15 | 10+ | 5+ |
| **Scalability** | Limited | Good | Good | Excellent | Excellent |
| **Testability** | Medium | High | High | Medium | High |
| **Learning Curve** | Low | Medium | Medium-High | High | High |
| **Time to Market** | Fast | Medium | Medium | Slow | Slow |
| **Flexibility** | Low | High | High | Excellent | High |

### Migration Paths

```
Layered → Clean → Hexagonal
  ↓                    ↓
  └──────→ Microservices ←──────┘
                ↓
              CQRS (within services)
```

## Related Documentation

- [Mobile Architecture Patterns](./mobile-patterns.md)
- [Frontend Architecture Patterns](./frontend-patterns.md)
- [Database Patterns](./database-patterns.md)
- [Integration Patterns](./integration-patterns.md)
- [Backend Development Guide](../stack-guides/backend.md)
- [API Design Guide](../api/README.md)

---

**Last Updated**: 2025-11-13
