# ☁️ Serverless Architecture Template

Template para aplicaciones serverless con AWS Lambda, API Gateway, y servicios cloud-native.

## 📋 Overview

Arquitectura serverless lista para producción con:
- **Compute**: AWS Lambda, Google Cloud Functions, Azure Functions
- **API**: API Gateway, HTTP triggers
- **Storage**: S3, DynamoDB, Firestore
- **Auth**: Cognito, Auth0, Firebase Auth
- **Events**: EventBridge, SQS, SNS
- **Monitoring**: CloudWatch, X-Ray, Application Insights
- **IaC**: Serverless Framework, SAM, Terraform

## ✨ Features

### Serverless Components
- ⚡ **Functions**: Funciones individuales escalables
- 🚪 **API Gateway**: REST y WebSocket APIs
- 💾 **Database**: DynamoDB, Aurora Serverless, Firestore
- 📁 **Storage**: S3, Cloud Storage
- 🔐 **Authentication**: Cognito, Auth0
- 📨 **Messaging**: SQS, SNS, EventBridge
- 🔄 **Step Functions**: Orquestación de workflows
- 🧪 **Testing**: Local testing con SAM/Serverless Offline

### Cloud Providers Support
- ☁️ **AWS**: Lambda + API Gateway + DynamoDB
- ☁️ **Google Cloud**: Cloud Functions + Firestore
- ☁️ **Azure**: Azure Functions + Cosmos DB
- ☁️ **Multi-cloud**: Abstracciones para portabilidad

### Developer Experience
- 🚀 **Hot Reload**: Desarrollo local rápido
- 🧪 **Unit Testing**: Jest, Mocha
- 📦 **Deployment**: CI/CD automatizado
- 📊 **Monitoring**: Logs y métricas centralizados
- 🔍 **Debugging**: Local debugging
- 📝 **TypeScript**: Type safety completo

## 🏗️ Estructura del Proyecto

```
serverless/
├── functions/
│   ├── auth/
│   │   ├── login/
│   │   │   ├── handler.ts
│   │   │   ├── schema.ts
│   │   │   └── handler.test.ts
│   │   ├── register/
│   │   └── refresh-token/
│   │
│   ├── users/
│   │   ├── get-user/
│   │   ├── update-user/
│   │   ├── list-users/
│   │   └── delete-user/
│   │
│   ├── products/
│   │   ├── create-product/
│   │   ├── get-product/
│   │   ├── update-product/
│   │   └── delete-product/
│   │
│   ├── orders/
│   │   ├── create-order/
│   │   ├── process-payment/
│   │   └── send-notification/
│   │
│   └── webhooks/
│       ├── stripe-webhook/
│       └── sendgrid-webhook/
│
├── layers/
│   ├── common/
│   │   ├── utils/
│   │   ├── middleware/
│   │   └── database/
│   └── models/
│       └── schemas/
│
├── config/
│   ├── aws/
│   │   ├── serverless.yml
│   │   ├── resources/
│   │   │   ├── dynamodb.yml
│   │   │   ├── s3.yml
│   │   │   └── cognito.yml
│   │   └── iam/
│   │       └── policies.yml
│   │
│   ├── gcp/
│   │   └── serverless.yml
│   │
│   └── azure/
│       └── function.json
│
├── docs/
│   ├── api/
│   ├── architecture/
│   ├── deployment/
│   └── local-development/
│
├── scripts/
│   ├── deploy.sh
│   ├── test-local.sh
│   └── seed-data.sh
│
├── tests/
│   ├── integration/
│   └── e2e/
│
├── serverless.yml          # Main config
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerrequisitos

- Node.js 18+
- AWS CLI configurado (o GCP SDK, Azure CLI)
- Serverless Framework: `npm install -g serverless`
- Docker (para testing local)

### Setup

1. **Copiar template**
   ```bash
   cp -r templates/projects/serverless/* mi-serverless-app/
   cd mi-serverless-app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar credenciales AWS**
   ```bash
   aws configure
   # Ingresar Access Key ID y Secret Access Key
   ```

4. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env
   ```

### Development Local

```bash
# Iniciar offline (simula AWS localmente)
npm run dev

# O con Serverless Offline
serverless offline start

# Invocar función local
serverless invoke local --function getUser --data '{"pathParameters":{"id":"123"}}'

# DynamoDB local
docker run -p 8000:8000 amazon/dynamodb-local
```

### Deploy

```bash
# Deploy a dev
npm run deploy:dev

# Deploy a staging
npm run deploy:staging

# Deploy a production
npm run deploy:prod

# Deploy función específica
serverless deploy function --function getUser --stage prod
```

## 📖 Function Examples

### HTTP API Handler (AWS Lambda)

```typescript
// functions/users/get-user/handler.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { success, error } from '../../../layers/common/utils/response';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    
    if (!id) {
      return error(400, 'User ID is required');
    }
    
    const result = await docClient.send(new GetCommand({
      TableName: process.env.USERS_TABLE!,
      Key: { id },
    }));
    
    if (!result.Item) {
      return error(404, 'User not found');
    }
    
    return success(result.Item);
  } catch (err) {
    console.error('Error getting user:', err);
    return error(500, 'Internal server error');
  }
};
```

### Event-Driven Handler (SQS)

```typescript
// functions/orders/process-payment/handler.ts
import { SQSHandler } from 'aws-lambda';
import { processPayment } from '../../../layers/common/services/payment';
import { sendNotification } from '../../../layers/common/services/notification';

export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    try {
      const order = JSON.parse(record.body);
      
      // Process payment
      const paymentResult = await processPayment({
        orderId: order.id,
        amount: order.total,
        customerId: order.customerId,
      });
      
      if (paymentResult.success) {
        // Send confirmation
        await sendNotification({
          userId: order.userId,
          type: 'order_confirmed',
          data: { orderId: order.id },
        });
      }
      
      console.log(`Processed order ${order.id}`);
    } catch (err) {
      console.error('Error processing order:', err);
      // Message will return to queue for retry
      throw err;
    }
  }
};
```

### Scheduled Handler (Cron)

```typescript
// functions/maintenance/cleanup-old-data/handler.ts
import { ScheduledHandler } from 'aws-lambda';
import { DynamoDBClient, ScanCommand, BatchWriteItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({});

export const handler: ScheduledHandler = async (event) => {
  console.log('Starting cleanup job');
  
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  
  // Scan for old items
  const result = await client.send(new ScanCommand({
    TableName: process.env.LOGS_TABLE!,
    FilterExpression: 'createdAt < :timestamp',
    ExpressionAttributeValues: {
      ':timestamp': { N: thirtyDaysAgo.toString() },
    },
  }));
  
  if (result.Items && result.Items.length > 0) {
    // Delete old items in batches
    const deleteRequests = result.Items.map(item => ({
      DeleteRequest: { Key: { id: item.id } },
    }));
    
    await client.send(new BatchWriteItemCommand({
      RequestItems: {
        [process.env.LOGS_TABLE!]: deleteRequests,
      },
    }));
    
    console.log(`Deleted ${result.Items.length} old items`);
  }
};
```

### WebSocket Handler

```typescript
// functions/websocket/connect/handler.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async (event) => {
  const connectionId = event.requestContext.connectionId!;
  
  // Store connection
  await docClient.send(new PutCommand({
    TableName: process.env.CONNECTIONS_TABLE!,
    Item: {
      connectionId,
      connectedAt: Date.now(),
    },
  }));
  
  return { statusCode: 200, body: 'Connected' };
};

// functions/websocket/message/handler.ts
export const sendMessage: APIGatewayProxyHandler = async (event) => {
  const { connectionId } = event.requestContext;
  const { message, recipientId } = JSON.parse(event.body || '{}');
  
  // Get recipient connection
  const connection = await getConnection(recipientId);
  
  if (connection) {
    const apiGateway = new ApiGatewayManagementApiClient({
      endpoint: `https://${event.requestContext.domainName}/${event.requestContext.stage}`,
    });
    
    await apiGateway.send(new PostToConnectionCommand({
      ConnectionId: connection.connectionId,
      Data: JSON.stringify({ message, from: connectionId }),
    }));
  }
  
  return { statusCode: 200, body: 'Message sent' };
};
```

## ⚙️ Serverless Configuration

### serverless.yml (AWS)

```yaml
service: serverless-app

frameworkVersion: '3'

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  stage: ${opt:stage, 'dev'}
  memorySize: 512
  timeout: 30
  
  environment:
    STAGE: ${self:provider.stage}
    USERS_TABLE: ${self:service}-users-${self:provider.stage}
    PRODUCTS_TABLE: ${self:service}-products-${self:provider.stage}
    
  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - dynamodb:Query
            - dynamodb:Scan
            - dynamodb:GetItem
            - dynamodb:PutItem
            - dynamodb:UpdateItem
            - dynamodb:DeleteItem
          Resource:
            - !GetAtt UsersTable.Arn
            - !GetAtt ProductsTable.Arn
        - Effect: Allow
          Action:
            - s3:GetObject
            - s3:PutObject
          Resource:
            - !Sub '${FilesBucket.Arn}/*'

plugins:
  - serverless-webpack
  - serverless-offline
  - serverless-plugin-tracing
  - serverless-prune-plugin

functions:
  # Auth
  login:
    handler: functions/auth/login/handler.handler
    events:
      - http:
          path: auth/login
          method: post
          cors: true
  
  # Users
  getUser:
    handler: functions/users/get-user/handler.handler
    events:
      - http:
          path: users/{id}
          method: get
          cors: true
          authorizer:
            name: authorizerFunc
            type: TOKEN
  
  createUser:
    handler: functions/users/create-user/handler.handler
    events:
      - http:
          path: users
          method: post
          cors: true
  
  # Orders (Event-driven)
  processOrder:
    handler: functions/orders/process-order/handler.handler
    events:
      - sqs:
          arn: !GetAtt OrdersQueue.Arn
          batchSize: 10
  
  # Scheduled
  cleanupOldData:
    handler: functions/maintenance/cleanup/handler.handler
    events:
      - schedule:
          rate: cron(0 2 * * ? *)  # Daily at 2 AM UTC
          enabled: true

resources:
  Resources:
    # DynamoDB Tables
    UsersTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:provider.environment.USERS_TABLE}
        BillingMode: PAY_PER_REQUEST
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
    
    ProductsTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:provider.environment.PRODUCTS_TABLE}
        BillingMode: PAY_PER_REQUEST
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
    
    # S3 Bucket
    FilesBucket:
      Type: AWS::S3::Bucket
      Properties:
        BucketName: ${self:service}-files-${self:provider.stage}
        CorsConfiguration:
          CorsRules:
            - AllowedOrigins:
                - '*'
              AllowedMethods:
                - GET
                - PUT
                - POST
              AllowedHeaders:
                - '*'
    
    # SQS Queue
    OrdersQueue:
      Type: AWS::SQS::Queue
      Properties:
        QueueName: ${self:service}-orders-${self:provider.stage}
        VisibilityTimeout: 180
        MessageRetentionPeriod: 1209600  # 14 days
        RedrivePolicy:
          deadLetterTargetArn: !GetAtt OrdersDLQ.Arn
          maxReceiveCount: 3
    
    OrdersDLQ:
      Type: AWS::SQS::Queue
      Properties:
        QueueName: ${self:service}-orders-dlq-${self:provider.stage}

custom:
  webpack:
    webpackConfig: webpack.config.js
    includeModules: true
  
  prune:
    automatic: true
    number: 3
```

## 🎯 Best Practices

### Architecture
- ✅ Funciones pequeñas y enfocadas (Single Responsibility)
- ✅ Stateless functions
- ✅ Event-driven cuando sea posible
- ✅ Uso de layers para código compartido
- ✅ Cold start optimization

### Performance
- ✅ Optimizar tamaño de deployment package
- ✅ Provisioned concurrency para funciones críticas
- ✅ Caching con DynamoDB DAX o ElastiCache
- ✅ Optimizar dependencias
- ✅ Lazy loading de módulos

### Security
- ✅ Least privilege IAM policies
- ✅ Secrets en Systems Manager/Secrets Manager
- ✅ API Gateway authorizers
- ✅ VPC para funciones que acceden a recursos privados
- ✅ Encripción en tránsito y reposo

### Cost Optimization
- ✅ Right-sizing de memoria
- ✅ Timeout apropiado
- ✅ Uso de Reserved Concurrency
- ✅ Cleanup de logs antiguos
- ✅ Monitoring de costos

## 🧪 Testing

```bash
# Unit tests
npm test

# Integration tests (local)
npm run test:integration

# E2E tests
npm run test:e2e

# Load testing
artillery run tests/load/scenarios.yml
```

## 📊 Monitoring

```bash
# Ver logs
serverless logs --function getUser --tail

# Ver métricas
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Duration \
  --dimensions Name=FunctionName,Value=getUser \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Average
```

## 📚 Recursos

- [API Documentation](./docs/api/README.md)
- [Architecture](./docs/architecture/README.md)
- [Local Development](./docs/local-development/README.md)
- [Deployment Guide](./docs/deployment/README.md)

---

_Serverless architecture - Escala infinita, paga por uso_ ☁️
