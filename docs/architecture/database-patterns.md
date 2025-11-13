# 💾 Database Architecture Patterns

Complete guide to data access and persistence patterns for managing database interactions.

## Overview

Database patterns help abstract data access, separate concerns, and provide clean interfaces for working with persistent data.

---

## 1. Repository Pattern

### Description

The Repository pattern provides an abstraction layer between the business logic and data access logic. It centralizes data access logic and provides a collection-like interface for accessing domain objects.

### Structure

```
┌─────────────────┐
│ Business Logic  │
└────────┬────────┘
         │ uses
┌────────▼────────┐
│   Repository    │  ← Interface/Abstract
└────────┬────────┘
         │ implements
┌────────▼────────┐
│ Repository Impl │  ← Concrete Implementation
└────────┬────────┘
         │ uses
┌────────▼────────┐
│   Data Source   │  ← Database, API, Cache
└─────────────────┘
```

### When to Use

✅ **Use When:**
- Want to decouple business logic from data access
- Need to swap data sources (DB, API, cache)
- Want testable data access layer
- Multiple data sources for same entity
- Need centralized data access logic

❌ **Avoid When:**
- Very simple CRUD with no business logic
- Single data source that never changes
- Over-abstraction for tiny apps

### Implementation Example (TypeScript + TypeORM)

```typescript
// 1. Domain Entity
// src/domain/entities/User.ts
export class User {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}

// 2. Repository Interface
// src/domain/repositories/IUserRepository.ts
import { User } from '../entities/User';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(limit?: number, offset?: number): Promise<User[]>;
  save(user: User): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
}

// 3. Database Model (TypeORM)
// src/infrastructure/database/models/UserModel.ts
import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserModel {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

// 4. Repository Implementation
// src/infrastructure/repositories/UserRepository.ts
import { Repository } from 'typeorm';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { UserModel } from '../database/models/UserModel';
import { AppDataSource } from '../database/data-source';

export class UserRepository implements IUserRepository {
  private repository: Repository<UserModel>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserModel);
  }

  async findById(id: string): Promise<User | null> {
    const model = await this.repository.findOne({ where: { id } });
    return model ? this.toDomain(model) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const model = await this.repository.findOne({ where: { email } });
    return model ? this.toDomain(model) : null;
  }

  async findAll(limit: number = 100, offset: number = 0): Promise<User[]> {
    const models = await this.repository.find({
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
    return models.map(this.toDomain);
  }

  async save(user: User): Promise<User> {
    const model = this.repository.create({
      id: user.id,
      email: user.email,
      name: user.name,
    });
    const saved = await this.repository.save(model);
    return this.toDomain(saved);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    await this.repository.update(id, userData);
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) throw new Error('User not found');
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }

  // Mapper method
  private toDomain(model: UserModel): User {
    return new User(
      model.id,
      model.email,
      model.name,
      model.createdAt,
      model.updatedAt
    );
  }
}

// 5. Usage in Service
// src/application/services/UserService.ts
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async createUser(email: string, name: string): Promise<User> {
    // Business logic
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const user = new User(
      generateId(),
      email,
      name,
      new Date(),
      new Date()
    );

    return await this.userRepository.save(user);
  }

  async listUsers(page: number = 1, pageSize: number = 20): Promise<{ users: User[], total: number }> {
    const offset = (page - 1) * pageSize;
    const [users, total] = await Promise.all([
      this.userRepository.findAll(pageSize, offset),
      this.userRepository.count(),
    ]);

    return { users, total };
  }
}
```

### Advanced: Generic Repository

```typescript
// Generic Repository Interface
// src/domain/repositories/IRepository.ts
export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(limit?: number, offset?: number): Promise<T[]>;
  save(entity: T): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
}

// Generic Repository Implementation
// src/infrastructure/repositories/BaseRepository.ts
import { Repository, EntityTarget } from 'typeorm';
import { IRepository } from '../../domain/repositories/IRepository';
import { AppDataSource } from '../database/data-source';

export abstract class BaseRepository<TDomain, TModel> implements IRepository<TDomain> {
  protected repository: Repository<TModel>;

  constructor(entity: EntityTarget<TModel>) {
    this.repository = AppDataSource.getRepository(entity);
  }

  async findById(id: string): Promise<TDomain | null> {
    const model = await this.repository.findOne({ where: { id } as any });
    return model ? this.toDomain(model) : null;
  }

  async findAll(limit: number = 100, offset: number = 0): Promise<TDomain[]> {
    const models = await this.repository.find({
      take: limit,
      skip: offset,
    });
    return models.map(m => this.toDomain(m));
  }

  async save(entity: TDomain): Promise<TDomain> {
    const model = this.toModel(entity);
    const saved = await this.repository.save(model as any);
    return this.toDomain(saved);
  }

  async update(id: string, entity: Partial<TDomain>): Promise<TDomain> {
    await this.repository.update(id, entity as any);
    const updated = await this.repository.findOne({ where: { id } as any });
    if (!updated) throw new Error('Entity not found');
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }

  protected abstract toDomain(model: TModel): TDomain;
  protected abstract toModel(entity: TDomain): TModel;
}

// Specific Repository extending Base
export class UserRepository extends BaseRepository<User, UserModel> {
  constructor() {
    super(UserModel);
  }

  protected toDomain(model: UserModel): User {
    return new User(
      model.id,
      model.email,
      model.name,
      model.createdAt,
      model.updatedAt
    );
  }

  protected toModel(entity: User): UserModel {
    const model = new UserModel();
    model.id = entity.id;
    model.email = entity.email;
    model.name = entity.name;
    return model;
  }

  // Add custom methods specific to User
  async findByEmail(email: string): Promise<User | null> {
    const model = await this.repository.findOne({ where: { email } });
    return model ? this.toDomain(model) : null;
  }
}
```

### Testing with Repository Pattern

```typescript
// test/services/UserService.test.ts
import { UserService } from '../../src/application/services/UserService';
import { IUserRepository } from '../../src/domain/repositories/IUserRepository';
import { User } from '../../src/domain/entities/User';

// Mock Repository
class MockUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return Array.from(this.users.values()).find(u => u.email === email) || null;
  }

  async save(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  // ... other methods
}

describe('UserService', () => {
  let userService: UserService;
  let mockRepository: MockUserRepository;

  beforeEach(() => {
    mockRepository = new MockUserRepository();
    userService = new UserService(mockRepository);
  });

  it('should create a new user', async () => {
    const user = await userService.createUser('test@example.com', 'Test User');
    
    expect(user.email).toBe('test@example.com');
    expect(user.name).toBe('Test User');
  });

  it('should throw error when email already exists', async () => {
    await userService.createUser('test@example.com', 'Test User');
    
    await expect(
      userService.createUser('test@example.com', 'Another User')
    ).rejects.toThrow('User with this email already exists');
  });
});
```

### Pros and Cons

**Pros:**
- ✅ Decouples business logic from data access
- ✅ Easy to test with mock repositories
- ✅ Centralized data access logic
- ✅ Easy to swap data sources
- ✅ Consistent interface for data operations

**Cons:**
- ❌ Additional abstraction layer
- ❌ More code to write and maintain
- ❌ Can be overkill for simple apps
- ❌ May hide complex queries

---

## 2. Data Mapper Pattern

### Description

The Data Mapper pattern separates the in-memory objects (domain entities) from the database. A mapper class handles the transfer of data between objects and database, keeping both independent.

### Structure

```
┌─────────────────┐
│ Domain Entity   │  ← Pure business object
└─────────────────┘
         ↕
┌─────────────────┐
│  Data Mapper    │  ← Transforms data
└────────┬────────┘
         │
┌────────▼────────┐
│    Database     │  ← Persistence
└─────────────────┘
```

### When to Use

✅ **Use When:**
- Domain objects should be persistence-ignorant
- Complex mapping between object model and database schema
- Domain model differs significantly from database structure
- Need to support multiple persistence strategies
- Using Domain-Driven Design

❌ **Avoid When:**
- Simple CRUD operations
- Object structure matches database 1:1
- Using Active Record pattern
- Small applications

### Implementation Example (TypeScript)

```typescript
// 1. Domain Entity (Persistence Ignorant)
// src/domain/entities/Order.ts
export class Order {
  constructor(
    public id: string,
    public customerId: string,
    public items: OrderItem[],
    public status: OrderStatus,
    public createdAt: Date
  ) {}

  get total(): number {
    return this.items.reduce((sum, item) => sum + item.subtotal, 0);
  }

  addItem(item: OrderItem): void {
    this.items.push(item);
  }

  canBeCancelled(): boolean {
    return this.status === OrderStatus.Pending || this.status === OrderStatus.Processing;
  }

  cancel(): void {
    if (!this.canBeCancelled()) {
      throw new Error('Order cannot be cancelled');
    }
    this.status = OrderStatus.Cancelled;
  }
}

export class OrderItem {
  constructor(
    public productId: string,
    public quantity: number,
    public unitPrice: number
  ) {}

  get subtotal(): number {
    return this.quantity * this.unitPrice;
  }
}

export enum OrderStatus {
  Pending = 'pending',
  Processing = 'processing',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

// 2. Database Models (Different structure from domain)
// src/infrastructure/database/models/OrderModel.ts
import { Entity, Column, PrimaryColumn, OneToMany, CreateDateColumn } from 'typeorm';

@Entity('orders')
export class OrderModel {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  customerId!: string;

  @Column()
  status!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => OrderItemModel, item => item.order, { cascade: true })
  items!: OrderItemModel[];
}

@Entity('order_items')
export class OrderItemModel {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  orderId!: string;

  @Column('uuid')
  productId!: string;

  @Column('int')
  quantity!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal!: number;

  @ManyToOne(() => OrderModel, order => order.items)
  order!: OrderModel;
}

// 3. Data Mapper
// src/infrastructure/mappers/OrderMapper.ts
import { Order, OrderItem, OrderStatus } from '../../domain/entities/Order';
import { OrderModel, OrderItemModel } from '../database/models/OrderModel';
import { v4 as uuidv4 } from 'uuid';

export class OrderMapper {
  // Map from database model to domain entity
  static toDomain(model: OrderModel): Order {
    const items = model.items.map(itemModel => 
      new OrderItem(
        itemModel.productId,
        itemModel.quantity,
        parseFloat(itemModel.unitPrice.toString())
      )
    );

    return new Order(
      model.id,
      model.customerId,
      items,
      model.status as OrderStatus,
      model.createdAt
    );
  }

  // Map from domain entity to database model
  static toModel(entity: Order): OrderModel {
    const model = new OrderModel();
    model.id = entity.id;
    model.customerId = entity.customerId;
    model.status = entity.status;
    model.totalAmount = entity.total;
    model.createdAt = entity.createdAt;
    
    model.items = entity.items.map(item => {
      const itemModel = new OrderItemModel();
      itemModel.id = uuidv4();
      itemModel.orderId = entity.id;
      itemModel.productId = item.productId;
      itemModel.quantity = item.quantity;
      itemModel.unitPrice = item.unitPrice;
      itemModel.subtotal = item.subtotal;
      return itemModel;
    });

    return model;
  }

  // Map collection
  static toDomainList(models: OrderModel[]): Order[] {
    return models.map(model => this.toDomain(model));
  }

  // Partial update mapping
  static toModelUpdate(id: string, entity: Partial<Order>): Partial<OrderModel> {
    const update: Partial<OrderModel> = {
      id,
    };

    if (entity.status !== undefined) {
      update.status = entity.status;
    }

    if (entity.items !== undefined) {
      update.totalAmount = entity.items.reduce((sum, item) => sum + item.subtotal, 0);
    }

    return update;
  }
}

// 4. Repository using Data Mapper
// src/infrastructure/repositories/OrderRepository.ts
import { Repository } from 'typeorm';
import { Order } from '../../domain/entities/Order';
import { OrderModel } from '../database/models/OrderModel';
import { OrderMapper } from '../mappers/OrderMapper';
import { AppDataSource } from '../database/data-source';

export class OrderRepository {
  private repository: Repository<OrderModel>;

  constructor() {
    this.repository = AppDataSource.getRepository(OrderModel);
  }

  async findById(id: string): Promise<Order | null> {
    const model = await this.repository.findOne({
      where: { id },
      relations: ['items'],
    });

    return model ? OrderMapper.toDomain(model) : null;
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    const models = await this.repository.find({
      where: { customerId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });

    return OrderMapper.toDomainList(models);
  }

  async save(order: Order): Promise<Order> {
    const model = OrderMapper.toModel(order);
    const saved = await this.repository.save(model);
    return OrderMapper.toDomain(saved);
  }

  async update(order: Order): Promise<Order> {
    // Delete old items
    await this.repository
      .createQueryBuilder()
      .delete()
      .from('order_items')
      .where('orderId = :orderId', { orderId: order.id })
      .execute();

    // Save updated order with new items
    const model = OrderMapper.toModel(order);
    const updated = await this.repository.save(model);
    return OrderMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

// 5. Usage in Service
// src/application/services/OrderService.ts
import { Order, OrderItem, OrderStatus } from '../../domain/entities/Order';
import { OrderRepository } from '../../infrastructure/repositories/OrderRepository';

export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  async createOrder(customerId: string, items: { productId: string, quantity: number, unitPrice: number }[]): Promise<Order> {
    const orderItems = items.map(
      item => new OrderItem(item.productId, item.quantity, item.unitPrice)
    );

    const order = new Order(
      generateId(),
      customerId,
      orderItems,
      OrderStatus.Pending,
      new Date()
    );

    return await this.orderRepository.save(order);
  }

  async getOrder(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }

  async cancelOrder(id: string): Promise<Order> {
    const order = await this.getOrder(id);
    
    // Business logic is in the domain entity
    order.cancel();
    
    return await this.orderRepository.update(order);
  }

  async addItemToOrder(orderId: string, item: { productId: string, quantity: number, unitPrice: number }): Promise<Order> {
    const order = await this.getOrder(orderId);
    
    const orderItem = new OrderItem(item.productId, item.quantity, item.unitPrice);
    order.addItem(orderItem);
    
    return await this.orderRepository.update(order);
  }
}
```

### Advanced: Complex Mapping

```typescript
// Complex mapping with different structures
export class UserProfileMapper {
  static toDomain(userModel: UserModel, profileModel: ProfileModel, addressModels: AddressModel[]): UserProfile {
    return new UserProfile(
      userModel.id,
      userModel.email,
      new Profile(
        profileModel.firstName,
        profileModel.lastName,
        profileModel.bio,
        profileModel.avatarUrl
      ),
      addressModels.map(addr => new Address(
        addr.street,
        addr.city,
        addr.state,
        addr.zipCode,
        addr.country,
        addr.isPrimary
      ))
    );
  }

  static async toModels(entity: UserProfile): Promise<{
    user: UserModel;
    profile: ProfileModel;
    addresses: AddressModel[];
  }> {
    const userModel = new UserModel();
    userModel.id = entity.id;
    userModel.email = entity.email;

    const profileModel = new ProfileModel();
    profileModel.userId = entity.id;
    profileModel.firstName = entity.profile.firstName;
    profileModel.lastName = entity.profile.lastName;
    profileModel.bio = entity.profile.bio;
    profileModel.avatarUrl = entity.profile.avatarUrl;

    const addressModels = entity.addresses.map(addr => {
      const model = new AddressModel();
      model.userId = entity.id;
      model.street = addr.street;
      model.city = addr.city;
      model.state = addr.state;
      model.zipCode = addr.zipCode;
      model.country = addr.country;
      model.isPrimary = addr.isPrimary;
      return model;
    });

    return { user: userModel, profile: profileModel, addresses: addressModels };
  }
}
```

### Pros and Cons

**Pros:**
- ✅ Domain entities remain persistence-ignorant
- ✅ Flexibility in mapping between models
- ✅ Can support complex transformations
- ✅ Domain model independent of database schema
- ✅ Easier to refactor database without changing domain

**Cons:**
- ❌ Additional mapping code
- ❌ Performance overhead from transformations
- ❌ More complex than Active Record
- ❌ Requires discipline to maintain separation

---

## Comparison

| Aspect | Repository | Data Mapper |
|--------|-----------|-------------|
| **Purpose** | Abstract data access | Separate domain from persistence |
| **Complexity** | Medium | Medium-High |
| **Use Case** | Data access abstraction | Domain-driven design |
| **Domain Awareness** | May have some | None (persistence ignorant) |
| **Flexibility** | High | Very High |
| **Boilerplate** | Medium | High |

## Combining Both Patterns

Repository and Data Mapper patterns work well together:

```typescript
// Repository using Data Mapper
export class UserRepository implements IUserRepository {
  private repository: Repository<UserModel>;
  
  constructor() {
    this.repository = AppDataSource.getRepository(UserModel);
  }

  async findById(id: string): Promise<User | null> {
    const model = await this.repository.findOne({ where: { id } });
    return model ? UserMapper.toDomain(model) : null;
  }

  async save(user: User): Promise<User> {
    const model = UserMapper.toModel(user);
    const saved = await this.repository.save(model);
    return UserMapper.toDomain(saved);
  }
}
```

## Related Documentation

- [Backend Architecture Patterns](./backend-patterns.md)
- [Integration Patterns](./integration-patterns.md)
- [Database Guide](../stack-guides/database.md)
- [PostgreSQL Guide](../postgresql/README.md)

---

**Last Updated**: 2025-11-13
