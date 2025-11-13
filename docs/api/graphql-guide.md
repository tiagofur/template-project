# 📊 GraphQL Integration Guide

Guía completa para implementación de APIs GraphQL eficientes y escalables.

## 🚀 Quick Start

### 1. Setup Apollo Server

```bash
npm install apollo-server-express graphql type-graphql reflect-metadata
npm install -D @graphql-codegen/cli @graphql-codegen/typescript
```

```typescript
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/user.resolver';

async function startServer() {
  const schema = await buildSchema({
    resolvers: [UserResolver],
    validate: false,
  });

  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({
      user: req.user,
      loaders: createLoaders(),
    }),
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
}
```

## 📝 Schema Design

### Type Definitions

```graphql
type User {
  id: ID!
  email: String!
  name: String!
  posts: [Post!]!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  comments: [Comment!]!
  published: Boolean!
}

type Comment {
  id: ID!
  content: String!
  author: User!
  post: Post!
}

type Query {
  user(id: ID!): User
  users(limit: Int, cursor: String): UserConnection!
  post(id: ID!): Post
  posts(filter: PostFilter): [Post!]!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
  
  createPost(input: CreatePostInput!): Post!
  publishPost(id: ID!): Post!
}

type Subscription {
  postPublished: Post!
  commentAdded(postId: ID!): Comment!
}

# Input types
input CreateUserInput {
  email: String!
  name: String!
  password: String!
}

input PostFilter {
  authorId: ID
  published: Boolean
  search: String
}

# Relay-style pagination
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type UserEdge {
  node: User!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

## 🔧 Resolvers

### TypeGraphQL Resolvers

```typescript
import { Resolver, Query, Mutation, Arg, Ctx, FieldResolver, Root } from 'type-graphql';
import { User, Post } from './types';
import { CreateUserInput } from './inputs';

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  async user(@Arg('id') id: string, @Ctx() ctx: Context): Promise<User | null> {
    // Use DataLoader to prevent N+1
    return ctx.loaders.userLoader.load(id);
  }

  @Query(() => [User])
  async users(
    @Arg('limit', { defaultValue: 10 }) limit: number,
    @Ctx() ctx: Context
  ): Promise<User[]> {
    return ctx.services.user.findAll({ limit });
  }

  @Mutation(() => User)
  async createUser(
    @Arg('input') input: CreateUserInput,
    @Ctx() ctx: Context
  ): Promise<User> {
    return ctx.services.user.create(input);
  }

  @FieldResolver(() => [Post])
  async posts(@Root() user: User, @Ctx() ctx: Context): Promise<Post[]> {
    return ctx.loaders.postsByUserLoader.load(user.id);
  }
}
```

## 🔄 DataLoader (N+1 Prevention)

```typescript
import DataLoader from 'dataloader';

export function createLoaders() {
  return {
    userLoader: new DataLoader<string, User>(async (ids) => {
      const users = await User.findByIds(ids);
      const userMap = new Map(users.map(u => [u.id, u]));
      return ids.map(id => userMap.get(id)!);
    }),

    postsByUserLoader: new DataLoader<string, Post[]>(async (userIds) => {
      const posts = await Post.find({
        where: { authorId: In(userIds as string[]) }
      });
      
      const postsByUser = new Map<string, Post[]>();
      posts.forEach(post => {
        const userId = post.authorId;
        if (!postsByUser.has(userId)) {
          postsByUser.set(userId, []);
        }
        postsByUser.get(userId)!.push(post);
      });
      
      return userIds.map(id => postsByUser.get(id) || []);
    }),
  };
}
```

## 🔐 Authentication & Authorization

```typescript
import { Ctx, UseMiddleware } from 'type-graphql';
import { AuthChecker } from 'type-graphql';

// Auth checker
export const authChecker: AuthChecker<Context> = ({ context }, roles) => {
  if (!context.user) {
    return false;
  }

  if (roles.length === 0) {
    return true; // Just needs to be authenticated
  }

  return roles.some(role => context.user.roles.includes(role));
};

// Use in schema
const schema = await buildSchema({
  resolvers: [UserResolver],
  authChecker,
});

// Protected resolver
@Resolver()
export class UserResolver {
  @Authorized() // Requires authentication
  @Query(() => User)
  me(@Ctx() ctx: Context): User {
    return ctx.user;
  }

  @Authorized(['ADMIN']) // Requires ADMIN role
  @Query(() => [User])
  allUsers(): Promise<User[]> {
    return User.find();
  }
}
```

## 📄 Pagination

```typescript
import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class PageInfo {
  @Field()
  hasNextPage: boolean;

  @Field()
  hasPreviousPage: boolean;

  @Field({ nullable: true })
  startCursor?: string;

  @Field({ nullable: true })
  endCursor?: string;
}

@ObjectType()
export class UserEdge {
  @Field()
  cursor: string;

  @Field(() => User)
  node: User;
}

@ObjectType()
export class UserConnection {
  @Field(() => [UserEdge])
  edges: UserEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;

  @Field(() => Int)
  totalCount: number;
}

@Resolver()
export class UserResolver {
  @Query(() => UserConnection)
  async users(
    @Arg('first', { nullable: true }) first?: number,
    @Arg('after', { nullable: true }) after?: string
  ): Promise<UserConnection> {
    const limit = first || 10;
    const users = await User.paginate(after, limit);
    
    return {
      edges: users.map(user => ({
        cursor: encodeCursor(user.id),
        node: user,
      })),
      pageInfo: {
        hasNextPage: users.length === limit,
        hasPreviousPage: !!after,
        startCursor: users[0] ? encodeCursor(users[0].id) : null,
        endCursor: users[users.length - 1] ? encodeCursor(users[users.length - 1].id) : null,
      },
      totalCount: await User.count(),
    };
  }
}
```

## 🔔 Subscriptions

```typescript
import { Resolver, Subscription, Root, PubSub, Publisher } from 'type-graphql';
import { PubSubEngine } from 'graphql-subscriptions';

@Resolver()
export class PostResolver {
  @Subscription(() => Post, {
    topics: 'POST_PUBLISHED',
  })
  postPublished(@Root() post: Post): Post {
    return post;
  }

  @Mutation(() => Post)
  async publishPost(
    @Arg('id') id: string,
    @PubSub() pubSub: PubSubEngine
  ): Promise<Post> {
    const post = await Post.publish(id);
    
    // Trigger subscription
    await pubSub.publish('POST_PUBLISHED', post);
    
    return post;
  }

  @Subscription(() => Comment, {
    topics: 'COMMENT_ADDED',
    filter: ({ args, payload }) => payload.postId === args.postId,
  })
  commentAdded(
    @Arg('postId') postId: string,
    @Root() comment: Comment
  ): Comment {
    return comment;
  }
}
```

## ⚡ Performance Optimization

### Query Complexity

```typescript
import { createComplexityLimitRule } from 'graphql-validation-complexity';

const server = new ApolloServer({
  schema,
  validationRules: [
    createComplexityLimitRule(1000, {
      scalarCost: 1,
      objectCost: 10,
      listFactor: 20,
    }),
  ],
});
```

### Depth Limiting

```typescript
import depthLimit from 'graphql-depth-limit';

const server = new ApolloServer({
  schema,
  validationRules: [depthLimit(7)],
});
```

### Persisted Queries

```typescript
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';

const server = new ApolloServer({
  schema,
  persistedQueries: {
    cache: new RedisCache({
      host: 'localhost',
    }),
  },
});
```

## 🧪 Testing

```typescript
import { createTestClient } from 'apollo-server-testing';

describe('UserResolver', () => {
  it('should get user by id', async () => {
    const { query } = createTestClient(server);
    
    const GET_USER = gql`
      query GetUser($id: ID!) {
        user(id: $id) {
          id
          name
          email
        }
      }
    `;

    const { data } = await query({
      query: GET_USER,
      variables: { id: '1' },
    });

    expect(data.user).toMatchObject({
      id: '1',
      name: 'John Doe',
    });
  });
});
```

## 📚 Resources

- [GraphQL Docs](https://graphql.org/learn/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [TypeGraphQL](https://typegraphql.com/)
- [DataLoader](https://github.com/graphql/dataloader)

---

_GraphQL Integration Guide_ 📊
