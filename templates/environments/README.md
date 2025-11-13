# 🌍 Environment Configuration Templates

Comprehensive environment configuration templates for all deployment stages: development, test, staging, production, and preview environments.

## 📋 Available Environments

### 1. **Development** (`.env.development`)
- **Purpose**: Local development environment
- **Use Case**: Daily development work on developer machines
- **Features**:
  - Debug mode enabled
  - Verbose logging
  - All feature flags enabled for testing
  - Local database connections
  - Hot reload enabled
  - Source maps enabled

### 2. **Test** (`.env.test`)
- **Purpose**: Automated testing environment
- **Use Case**: CI/CD pipelines, unit tests, integration tests
- **Features**:
  - Isolated test databases
  - Mock external services
  - Headless browser testing
  - Fast execution (reduced timeouts)
  - Minimal logging
  - Test data cleanup

### 3. **Staging** (`.env.staging`)
- **Purpose**: Pre-production testing environment
- **Use Case**: QA testing, client demos, final validation before production
- **Features**:
  - Mirrors production configuration
  - Real external service integrations (test mode)
  - Monitoring and analytics enabled
  - SSL/TLS enabled
  - Uses test payment keys
  - Full feature parity with production

### 4. **Production** (`.env.production`)
- **Purpose**: Live production environment
- **Use Case**: Serving real users and production traffic
- **Features**:
  - Maximum security hardening
  - Live payment processing
  - Multi-region support
  - Auto-scaling enabled
  - Comprehensive monitoring
  - Audit logging
  - Backup and disaster recovery
  - Strict rate limiting

### 5. **Preview** (`.env.preview`)
- **Purpose**: Temporary preview deployments for pull requests
- **Use Case**: Testing feature branches, PR reviews, stakeholder previews
- **Features**:
  - Isolated per PR/branch
  - Auto-generated URLs
  - Auto-cleanup after PR merge/close
  - Full feature testing capability
  - Team access via magic links
  - Debug information visible

## 🚀 Quick Start

### Step 1: Choose Your Environment Template

```bash
# For local development
cp templates/environments/.env.development .env

# For testing
cp templates/environments/.env.test .env.test

# For staging deployment
cp templates/environments/.env.staging .env.staging

# For production deployment
cp templates/environments/.env.production .env.production
```

### Step 2: Fill in Required Values

Edit the copied file and replace placeholder values:

```bash
# Required secrets (NEVER commit these)
- ${PROD_DB_PASSWORD} → your-actual-password
- ${PROD_JWT_SECRET} → generate-32-char-secret
- ${PROD_API_KEYS} → your-real-api-keys
```

### Step 3: Validate Configuration

```bash
# Use the validation script
npm run validate:env

# Or manually check
node scripts/validate-env.js
```

## 🔐 Security Best Practices

### DO ✅

1. **Use Environment Variables**: Store all secrets as environment variables
2. **Use Secret Managers**: AWS Secrets Manager, HashiCorp Vault, Azure Key Vault
3. **Rotate Secrets Regularly**: Implement secret rotation policies
4. **Separate Environments**: Use different credentials for each environment
5. **Audit Access**: Log all secret access and usage
6. **Encrypt at Rest**: Ensure secrets are encrypted when stored
7. **Use Strong Secrets**: Minimum 32 characters, random generation
8. **Implement RBAC**: Role-based access control for secrets
9. **Version Control .example Files**: Commit templates, not actual secrets
10. **Review Before Deploying**: Double-check all configurations

### DON'T ❌

1. **Commit Secrets**: Never commit `.env` files with real secrets
2. **Share Secrets**: Don't send secrets via email, Slack, etc.
3. **Reuse Secrets**: Don't use same secrets across environments
4. **Hardcode Secrets**: Never put secrets directly in code
5. **Log Secrets**: Don't log environment variables containing secrets
6. **Use Weak Secrets**: Avoid short or predictable secrets
7. **Share .env Files**: Don't share actual .env files between team members
8. **Commit to Public Repos**: Extra caution with public repositories
9. **Use Default Secrets**: Change all default/placeholder values
10. **Ignore Warnings**: Take security warnings seriously

## 📚 Configuration by Category

### Database Configuration

```bash
# PostgreSQL
DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require

# MongoDB
MONGODB_URI=mongodb://user:pass@host:port/db?authSource=admin

# Redis
REDIS_URL=redis://user:pass@host:port
```

**Best Practices**:
- Enable SSL/TLS connections (`sslmode=require`)
- Use connection pooling
- Set appropriate timeouts
- Use read replicas for scaling
- Enable automatic failover

### API Keys Management

```bash
# Development
OPENAI_API_KEY=sk-dev-...  # Lower tier, limited quota

# Staging
OPENAI_API_KEY=sk-staging-...  # Test tier, moderate quota

# Production
OPENAI_API_KEY=${VAULT_OPENAI_KEY}  # Production tier, full quota
```

**Best Practices**:
- Use different API keys per environment
- Implement rate limiting
- Monitor API usage
- Set spending limits
- Rotate keys regularly

### Feature Flags

```bash
# Development - All features enabled
FEATURE_NEW_UI=true
FEATURE_BETA_FEATURES=true
FEATURE_EXPERIMENTAL=true

# Production - Controlled rollout
FEATURE_NEW_UI=false
FEATURE_BETA_FEATURES=false
FEATURE_EXPERIMENTAL=false
```

**Best Practices**:
- Use feature flags for gradual rollouts
- Test features in staging before production
- Implement percentage-based rollouts
- Monitor feature performance
- Clean up old feature flags

## 🔧 Environment-Specific Configuration

### Development Environment

**Focus**: Developer productivity and debugging

```bash
# Debugging enabled
DEBUG=true
LOG_LEVEL=debug
VERBOSE_LOGGING=true

# Fast feedback
HOT_RELOAD=true
SOURCE_MAPS=true

# Local services
DATABASE_URL=postgresql://localhost:5432/myapp_dev
REDIS_URL=redis://localhost:6379
```

### Test Environment

**Focus**: Fast, reliable, isolated testing

```bash
# Speed optimization
TEST_TIMEOUT=5000
CACHE_ENABLED=false

# Isolation
TEST_DATABASE_URL=postgresql://localhost:5432/myapp_test_${TEST_ID}

# Mock services
EMAIL_ENABLED=false
PAYMENT_PROCESSING_MODE=mock
```

### Staging Environment

**Focus**: Production parity and pre-release validation

```bash
# Production-like
NODE_ENV=staging
SSL_ENABLED=true

# Real integrations (test mode)
STRIPE_SECRET_KEY=sk_test_...
EMAIL_ENABLED=true

# Monitoring
SENTRY_ENABLED=true
APM_ENABLED=true
```

### Production Environment

**Focus**: Security, performance, reliability

```bash
# Security hardened
NODE_ENV=production
DEBUG=false
FORCE_HTTPS=true

# Performance optimized
CACHE_ENABLED=true
CONNECTION_POOL_SIZE=50

# Monitoring and alerts
SENTRY_ENABLED=true
DATADOG_ENABLED=true
PAGERDUTY_ENABLED=true
```

### Preview Environment

**Focus**: Feature validation and stakeholder review

```bash
# PR-specific
PR_NUMBER=${PR_NUMBER}
BRANCH_NAME=${BRANCH_NAME}

# Isolated resources
DB_NAME=myapp_preview_${PR_NUMBER}
S3_PREFIX=pr-${PR_NUMBER}/

# Auto-cleanup
PREVIEW_LIFETIME_HOURS=72
CLEANUP_ON_PR_CLOSE=true
```

## 🛠️ Tools and Scripts

### Environment Validation

Create `scripts/validate-env.js`:

```javascript
const required = {
  development: ['DATABASE_URL', 'JWT_SECRET'],
  production: ['DATABASE_URL', 'JWT_SECRET', 'SENTRY_DSN'],
};

const env = process.env.NODE_ENV || 'development';
const missing = required[env].filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing required variables: ${missing.join(', ')}`);
  process.exit(1);
}
```

### Secret Generation

```bash
# Generate secure random secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use OpenSSL
openssl rand -hex 32
```

### Environment Sync

Create `scripts/sync-env.js` to sync from secret managers:

```javascript
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();

async function syncSecrets() {
  const secret = await secretsManager.getSecretValue({
    SecretId: 'myapp/production'
  }).promise();
  
  // Write to .env or export to environment
  console.log(secret.SecretString);
}
```

## 📊 Environment Comparison Matrix

| Feature | Development | Test | Staging | Production | Preview |
|---------|-------------|------|---------|------------|---------|
| Debug Mode | ✅ On | ❌ Off | ❌ Off | ❌ Off | ⚠️ Limited |
| Source Maps | ✅ Yes | ❌ No | ✅ Yes | ❌ No | ✅ Yes |
| Minification | ❌ No | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| SSL/TLS | ❌ No | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| Monitoring | ❌ No | ❌ No | ✅ Yes | ✅ Yes | ⚠️ Limited |
| Real Payments | ❌ No | ❌ No | ⚠️ Test | ✅ Live | ❌ No |
| Email Sending | ❌ No | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| Rate Limiting | ⚠️ Lenient | ⚠️ Lenient | ⚠️ Moderate | ✅ Strict | ⚠️ Moderate |
| Auto-scaling | ❌ No | ❌ No | ✅ Yes | ✅ Yes | ⚠️ Limited |
| Backups | ❌ No | ❌ No | ✅ Yes | ✅ Yes | ❌ No |

## 🔗 Related Documentation

- [Environment Setup Guide](../../docs/setup/environment-config.md)
- [Security Best Practices](../../docs/security/README.md)
- [Feature Flags Guide](../feature-flags/README.md)
- [Deployment Guide](../../docs/cicd/README.md)
- [Secrets Management](./SECRETS_MANAGEMENT.md)

## 📞 Support

For questions or issues:
- Check the [troubleshooting guide](./TROUBLESHOOTING.md)
- Review [common issues](./COMMON_ISSUES.md)
- Contact DevOps team

## 📝 Changelog

- **v1.0.0** (2025-11-13): Initial environment templates
  - Development environment
  - Test environment
  - Staging environment
  - Production environment
  - Preview environment

---

**Last Updated**: 2025-11-13  
**Maintained By**: DevOps Team
