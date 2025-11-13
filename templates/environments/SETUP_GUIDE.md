# 🚀 Environment Setup Guide

Step-by-step guide to configure your application for different environments.

## 📋 Quick Navigation

- [Development Setup](#development-setup)
- [Test Setup](#test-setup)
- [Staging Setup](#staging-setup)
- [Production Setup](#production-setup)
- [Preview Setup](#preview-setup)

---

## Development Setup

### Prerequisites

- Node.js 18+ or your runtime
- PostgreSQL 14+ (or your database)
- Redis 6+ (for caching)
- Git

### Step 1: Clone and Install

```bash
# Clone repository
git clone https://github.com/your-org/your-app.git
cd your-app

# Install dependencies
npm install
```

### Step 2: Create Environment File

```bash
# Copy the development template
cp templates/environments/.env.development .env

# Or manually create .env
touch .env
```

### Step 3: Configure Database

```bash
# Install PostgreSQL locally or use Docker
docker run --name postgres-dev \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=myapp_dev \
  -p 5432:5432 \
  -d postgres:14

# Update .env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/myapp_dev
```

### Step 4: Configure Redis

```bash
# Install Redis locally or use Docker
docker run --name redis-dev \
  -p 6379:6379 \
  -d redis:6

# Update .env
REDIS_URL=redis://localhost:6379
```

### Step 5: Generate Secrets

```bash
# Generate JWT secrets
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_ACCESS_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Add to .env
echo "JWT_SECRET=$JWT_SECRET" >> .env
echo "JWT_ACCESS_SECRET=$JWT_ACCESS_SECRET" >> .env
echo "JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET" >> .env
```

### Step 6: Run Migrations

```bash
# TypeORM
npm run migration:run

# Prisma
npx prisma migrate dev

# Sequelize
npm run db:migrate
```

### Step 7: Seed Database (Optional)

```bash
npm run db:seed
```

### Step 8: Start Development Server

```bash
# Start backend
npm run dev

# Start frontend (separate terminal)
cd frontend && npm run dev
```

### Step 9: Verify Setup

```bash
# Check backend
curl http://localhost:3000/api/health

# Open frontend
open http://localhost:5173
```

### Development Checklist

- [ ] .env file created and configured
- [ ] Database running and connected
- [ ] Redis running and connected
- [ ] Migrations executed
- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Health check endpoint returns 200
- [ ] Can create test user
- [ ] Can authenticate

---

## Test Setup

### For Local Testing

```bash
# Copy test template
cp templates/environments/.env.test .env.test

# Create test database
createdb myapp_test

# Run tests
npm run test

# Run with coverage
npm run test:coverage
```

### For CI/CD (GitHub Actions)

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: myapp_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:6
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/myapp_test
          REDIS_URL: redis://localhost:6379
          NODE_ENV: test
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## Staging Setup

### Prerequisites

- AWS account (or your cloud provider)
- Domain name
- SSL certificate
- Access to secrets manager

### Step 1: Create Database

```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier myapp-staging \
  --db-instance-class db.t3.small \
  --engine postgres \
  --engine-version 14.7 \
  --master-username postgres \
  --master-user-password $(openssl rand -base64 32) \
  --allocated-storage 20 \
  --backup-retention-period 7 \
  --multi-az

# Get connection endpoint
aws rds describe-db-instances \
  --db-instance-identifier myapp-staging \
  --query 'DBInstances[0].Endpoint.Address'
```

### Step 2: Create Redis Cluster

```bash
# Create ElastiCache Redis
aws elasticache create-cache-cluster \
  --cache-cluster-id myapp-staging-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1
```

### Step 3: Store Secrets

```bash
# Create secrets in AWS Secrets Manager
aws secretsmanager create-secret \
  --name myapp/staging/database \
  --secret-string '{
    "username": "postgres",
    "password": "generated-password",
    "host": "myapp-staging.xyz.rds.amazonaws.com",
    "port": 5432,
    "database": "myapp_staging"
  }'

# Store JWT secrets
aws secretsmanager create-secret \
  --name myapp/staging/jwt \
  --secret-string '{
    "secret": "generated-jwt-secret",
    "accessSecret": "generated-access-secret",
    "refreshSecret": "generated-refresh-secret"
  }'
```

### Step 4: Configure Application

```bash
# Set environment in deployment
export NODE_ENV=staging
export AWS_REGION=us-east-1

# Application retrieves secrets at startup
```

### Step 5: Deploy

```bash
# Build application
npm run build

# Deploy to ECS/EKS/EC2
# Or use deployment platform (Vercel, Railway, etc.)
```

---

## Production Setup

### Prerequisites

- Production AWS account (isolated from staging)
- Production domain and SSL certificate
- Multi-region setup (optional)
- Monitoring and alerting configured

### Step 1: Infrastructure as Code

```terraform
# terraform/main.tf
resource "aws_db_instance" "production" {
  identifier           = "myapp-production"
  engine              = "postgres"
  engine_version      = "14.7"
  instance_class      = "db.r5.large"
  allocated_storage   = 100
  storage_encrypted   = true
  
  # High availability
  multi_az            = true
  
  # Backups
  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  
  # Monitoring
  enabled_cloudwatch_logs_exports = ["postgresql"]
  performance_insights_enabled    = true
  
  # Security
  publicly_accessible = false
  vpc_security_group_ids = [aws_security_group.db.id]
}

resource "aws_elasticache_replication_group" "production" {
  replication_group_id       = "myapp-production"
  replication_group_description = "Production Redis cluster"
  engine                     = "redis"
  engine_version            = "6.x"
  node_type                 = "cache.r5.large"
  
  # High availability
  automatic_failover_enabled = true
  multi_az_enabled          = true
  num_cache_clusters        = 3
  
  # Security
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
}
```

### Step 2: Secrets Management

```bash
# Production secrets with strict access control
aws secretsmanager create-secret \
  --name myapp/production/database \
  --secret-string file://db-secret.json \
  --tags Key=Environment,Value=production Key=Application,Value=myapp

# Enable automatic rotation
aws secretsmanager rotate-secret \
  --secret-id myapp/production/database \
  --rotation-lambda-arn arn:aws:lambda:region:account:function:rotate-db-secret \
  --rotation-rules AutomaticallyAfterDays=30
```

### Step 3: Monitoring Setup

```bash
# Configure CloudWatch alarms
aws cloudwatch put-metric-alarm \
  --alarm-name myapp-prod-high-error-rate \
  --alarm-description "Alert on high error rate" \
  --metric-name ErrorRate \
  --namespace MyApp \
  --statistic Average \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:region:account:myapp-alerts
```

### Step 4: Deploy with Zero Downtime

```bash
# Blue-green deployment or rolling update
kubectl set image deployment/myapp \
  myapp=myapp:${NEW_VERSION} \
  --record

# Monitor rollout
kubectl rollout status deployment/myapp

# Rollback if needed
kubectl rollout undo deployment/myapp
```

---

## Preview Setup

### For Pull Request Previews

```yaml
# .github/workflows/preview.yml
name: Preview Deployment
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  deploy-preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          alias-domains: |
            preview-${{ github.event.pull_request.number }}.myapp.com
      
      - name: Comment PR
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `✅ Preview deployed to https://preview-${{ github.event.pull_request.number }}.myapp.com`
            })
```

## 🔍 Validation

### Validate Environment

```bash
# Run validation script
node scripts/validate-env.js

# Expected output:
# ✅ All required variables present
# ✅ All variables properly formatted
# ⚠️  Some recommended variables missing
```

### Health Checks

```bash
# Check application health
curl https://api.myapp.com/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-11-13T12:00:00Z",
  "checks": {
    "database": { "status": "healthy", "responseTime": 5 },
    "redis": { "status": "healthy", "responseTime": 2 }
  }
}
```

## 🔗 Related Documentation

- [Environment Templates](./README.md)
- [Secrets Management](./SECRETS_MANAGEMENT.md)
- [Database Configuration](./DATABASE_API_CONFIG.md)
- [Security Guide](./SECURITY_GUIDE.md)

---

**Last Updated**: 2025-11-13  
**Maintained By**: DevOps Team
