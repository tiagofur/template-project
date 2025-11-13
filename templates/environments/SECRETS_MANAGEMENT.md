# 🔐 Secrets Management Guide

Comprehensive guide for securely managing secrets, API keys, and sensitive configuration across all environments.

## 📋 Table of Contents

- [Overview](#overview)
- [Security Principles](#security-principles)
- [Secrets Management Solutions](#secrets-management-solutions)
- [Implementation Guide](#implementation-guide)
- [Environment-Specific Practices](#environment-specific-practices)
- [Secret Rotation](#secret-rotation)
- [Incident Response](#incident-response)

## Overview

### What Are Secrets?

Secrets are sensitive pieces of information that should never be exposed:

- API keys and tokens
- Database passwords
- Private encryption keys
- OAuth client secrets
- JWT signing keys
- Third-party service credentials
- SSL/TLS certificates

### Why Secrets Management Matters

1. **Security**: Prevent unauthorized access to systems
2. **Compliance**: Meet regulatory requirements (GDPR, HIPAA, PCI-DSS)
3. **Auditability**: Track who accessed what and when
4. **Rotation**: Regularly update credentials without downtime
5. **Separation**: Different secrets for different environments

## Security Principles

### The Golden Rules

#### ❌ NEVER

1. **Commit secrets to version control**
   ```bash
   # BAD - Never do this
   git add .env
   git commit -m "Add configuration"
   ```

2. **Hardcode secrets in source code**
   ```typescript
   // BAD - Hardcoded secret
   const apiKey = "your-actual-api-key-hardcoded-here";
   ```

3. **Share secrets via insecure channels**
   - Email
   - Slack/Teams messages
   - SMS
   - Unencrypted files

4. **Reuse secrets across environments**
   ```bash
   # BAD - Same secret everywhere
   PROD_JWT_SECRET=same_secret
   DEV_JWT_SECRET=same_secret
   ```

5. **Log secrets**
   ```typescript
   // BAD - Logging secrets
   console.log(`API Key: ${process.env.API_KEY}`);
   ```

#### ✅ ALWAYS

1. **Use environment variables**
   ```typescript
   // GOOD - Use environment variable
   const apiKey = process.env.API_KEY;
   ```

2. **Use .env.example for templates**
   ```bash
   # .env.example (committed)
   DATABASE_URL=postgresql://user:password@host:port/db
   JWT_SECRET=your-secret-here
   
   # .env (never committed)
   DATABASE_URL=postgresql://admin:realP@ss@prod-db:5432/myapp
   JWT_SECRET=actual-secret-key-very-long
   ```

3. **Keep .env in .gitignore**
   ```bash
   # .gitignore
   .env
   .env.local
   .env.*.local
   *.pem
   *.key
   ```

4. **Use secrets management services**
   - AWS Secrets Manager
   - HashiCorp Vault
   - Azure Key Vault
   - Google Secret Manager

5. **Implement secret rotation**
   - Regular scheduled rotation
   - Immediate rotation on suspected compromise
   - Zero-downtime rotation strategies

## Secrets Management Solutions

### 1. Environment Variables (Development Only)

**Best for**: Local development

```bash
# .env
DATABASE_URL=postgresql://localhost:5432/myapp_dev
JWT_SECRET=dev-secret-only-for-local
```

**Pros**:
- Simple and fast
- No additional infrastructure
- Good for local development

**Cons**:
- Not suitable for production
- No rotation capabilities
- No audit logging
- Limited access control

### 2. AWS Secrets Manager

**Best for**: AWS-based production systems

#### Setup

```bash
# Install AWS CLI
aws configure

# Create a secret
aws secretsmanager create-secret \
  --name myapp/production/database \
  --secret-string '{"username":"admin","password":"SuperSecret123!"}'
```

#### Retrieve Secrets

```typescript
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManager({ region: 'us-east-1' });

async function getSecret(secretName: string): Promise<any> {
  try {
    const response = await client.getSecretValue({
      SecretId: secretName,
    });
    
    return JSON.parse(response.SecretString);
  } catch (error) {
    console.error(`Error retrieving secret ${secretName}:`, error);
    throw error;
  }
}

// Usage
const dbCredentials = await getSecret('myapp/production/database');
const dbUrl = `postgresql://${dbCredentials.username}:${dbCredentials.password}@prod-db:5432/myapp`;
```

#### Automatic Rotation

```typescript
// Lambda function for automatic rotation
export async function handler(event: any) {
  const secretId = event.SecretId;
  const token = event.Token;
  const step = event.Step;
  
  switch (step) {
    case 'createSecret':
      // Generate new credentials
      const newPassword = generateSecurePassword();
      await client.putSecretValue({
        SecretId: secretId,
        SecretString: JSON.stringify({ password: newPassword }),
        VersionStages: ['AWSPENDING'],
        ClientRequestToken: token,
      });
      break;
      
    case 'setSecret':
      // Update database with new credentials
      await updateDatabasePassword(newPassword);
      break;
      
    case 'testSecret':
      // Test new credentials
      await testDatabaseConnection(newPassword);
      break;
      
    case 'finishSecret':
      // Mark new version as current
      await client.updateSecretVersionStage({
        SecretId: secretId,
        VersionStage: 'AWSCURRENT',
        MoveToVersionId: token,
      });
      break;
  }
}
```

### 3. HashiCorp Vault

**Best for**: Multi-cloud or on-premise deployments

#### Setup

```bash
# Start Vault server (dev mode)
vault server -dev

# Set environment variable
export VAULT_ADDR='http://127.0.0.1:8200'

# Write a secret
vault kv put secret/myapp/database \
  username=admin \
  password=SuperSecret123!

# Read a secret
vault kv get secret/myapp/database
```

#### Application Integration

```typescript
import * as vault from 'node-vault';

const vaultClient = vault({
  apiVersion: 'v1',
  endpoint: process.env.VAULT_ADDR,
  token: process.env.VAULT_TOKEN,
});

async function getSecret(path: string): Promise<any> {
  try {
    const result = await vaultClient.read(path);
    return result.data;
  } catch (error) {
    console.error(`Error reading secret from ${path}:`, error);
    throw error;
  }
}

// Usage
const dbSecret = await getSecret('secret/myapp/database');
console.log(`Database user: ${dbSecret.username}`);
```

#### Dynamic Secrets

```typescript
// Configure PostgreSQL secrets engine
await vaultClient.write('database/config/myapp', {
  plugin_name: 'postgresql-database-plugin',
  allowed_roles: 'myapp-role',
  connection_url: 'postgresql://{{username}}:{{password}}@localhost:5432/myapp',
  username: 'vault',
  password: 'vault_password',
});

// Create role
await vaultClient.write('database/roles/myapp-role', {
  db_name: 'myapp',
  creation_statements: [
    'CREATE ROLE "{{name}}" WITH LOGIN PASSWORD \'{{password}}\' VALID UNTIL \'{{expiration}}\';',
    'GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO "{{name}}";',
  ],
  default_ttl: '1h',
  max_ttl: '24h',
});

// Get dynamic credentials
const creds = await vaultClient.read('database/creds/myapp-role');
console.log(`Username: ${creds.data.username}`);
console.log(`Password: ${creds.data.password}`);
```

### 4. Azure Key Vault

**Best for**: Azure-based deployments

```typescript
import { SecretClient } from '@azure/keyvault-secrets';
import { DefaultAzureCredential } from '@azure/identity';

const credential = new DefaultAzureCredential();
const vaultUrl = `https://${process.env.KEY_VAULT_NAME}.vault.azure.net`;
const client = new SecretClient(vaultUrl, credential);

async function getSecret(secretName: string): Promise<string> {
  const secret = await client.getSecret(secretName);
  return secret.value;
}

// Usage
const dbPassword = await getSecret('database-password');
```

### 5. Google Secret Manager

**Best for**: GCP-based deployments

```typescript
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

async function getSecret(secretName: string): Promise<string> {
  const [version] = await client.accessSecretVersion({
    name: `projects/${process.env.GCP_PROJECT}/secrets/${secretName}/versions/latest`,
  });
  
  return version.payload.data.toString();
}

// Usage
const apiKey = await getSecret('openai-api-key');
```

## Implementation Guide

### Step 1: Audit Current Secrets

```bash
# Find potential secrets in codebase
grep -r "password\|secret\|key\|token" --include="*.ts" --include="*.js"

# Check for committed secrets
git log -p | grep -i "password\|secret\|key"

# Use tools like truffleHog
trufflehog git https://github.com/your/repo
```

### Step 2: Create Secrets Inventory

```markdown
| Secret Name | Purpose | Environments | Rotation Period | Owner |
|-------------|---------|--------------|-----------------|-------|
| JWT_SECRET | Token signing | All | 90 days | Backend Team |
| DB_PASSWORD | Database access | Prod | 30 days | DevOps |
| STRIPE_SECRET | Payment processing | Prod | Manual | Finance |
```

### Step 3: Migrate to Secrets Manager

```typescript
// Before
const dbPassword = "hardcoded_password";

// After
const dbPassword = await getSecret('database-password');
```

### Step 4: Update Deployment Process

```yaml
# GitHub Actions
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy
        run: |
          # Secrets are retrieved at runtime by the application
          npm run deploy
```

## Environment-Specific Practices

### Development Environment

```bash
# Use .env file (never committed)
DATABASE_URL=postgresql://localhost:5432/myapp_dev
JWT_SECRET=dev-secret-change-in-production

# Or use direnv for auto-loading
echo "export DATABASE_URL=postgresql://localhost:5432/myapp_dev" > .envrc
direnv allow
```

### Test Environment

```bash
# Use environment-specific secrets
TEST_DATABASE_URL=postgresql://test-db:5432/myapp_test
TEST_JWT_SECRET=test-secret-for-ci-only

# GitHub Actions Secrets
# Set in repository settings → Secrets
```

### Staging Environment

```bash
# Use secrets manager
aws secretsmanager get-secret-value \
  --secret-id myapp/staging/database \
  --query SecretString \
  --output text
```

### Production Environment

```bash
# Use secrets manager with strict access control
aws secretsmanager get-secret-value \
  --secret-id myapp/production/database \
  --query SecretString \
  --output text

# Enable audit logging
aws cloudtrail create-trail \
  --name myapp-secrets-audit \
  --s3-bucket-name myapp-audit-logs
```

## Secret Rotation

### Why Rotate Secrets?

1. Limit exposure window
2. Reduce impact of breaches
3. Comply with security policies
4. Test rotation procedures

### Rotation Strategies

#### 1. Blue-Green Rotation

```typescript
// Maintain two active secrets
async function rotateSecret() {
  // 1. Create new secret (green)
  const newSecret = generateSecret();
  await secretsManager.createVersion('myapp/jwt', newSecret);
  
  // 2. Deploy with dual-secret support
  const oldSecret = await secretsManager.getVersion('myapp/jwt', 'v1');
  const newSecret = await secretsManager.getVersion('myapp/jwt', 'v2');
  
  // Accept both old and new for transition period
  function verifyToken(token: string) {
    try {
      return jwt.verify(token, newSecret);
    } catch {
      return jwt.verify(token, oldSecret); // Fallback to old
    }
  }
  
  // 3. Wait for old tokens to expire
  await sleep(JWT_EXPIRY_TIME);
  
  // 4. Remove old secret (blue)
  await secretsManager.deleteVersion('myapp/jwt', 'v1');
}
```

#### 2. Automated Rotation

```typescript
// Schedule automatic rotation
const rotation = {
  enabled: true,
  interval: 30, // days
  
  async rotate(secretName: string) {
    console.log(`Starting rotation for ${secretName}`);
    
    // 1. Generate new credentials
    const newCreds = await this.generateNewCredentials();
    
    // 2. Update secrets manager
    await secretsManager.updateSecret(secretName, newCreds);
    
    // 3. Update dependent systems
    await this.updateDatabasePassword(newCreds.password);
    
    // 4. Verify new credentials work
    await this.testConnection(newCreds);
    
    // 5. Notify team
    await this.sendNotification(`Rotated ${secretName}`);
    
    console.log(`Completed rotation for ${secretName}`);
  }
};
```

### Rotation Checklist

- [ ] Identify all secrets that need rotation
- [ ] Document rotation procedures
- [ ] Test rotation in staging first
- [ ] Schedule rotation during low-traffic periods
- [ ] Notify team before rotation
- [ ] Monitor for errors after rotation
- [ ] Verify all services using new secrets
- [ ] Update documentation
- [ ] Archive old secrets securely

## Incident Response

### If a Secret is Compromised

#### Immediate Actions (First Hour)

1. **Revoke the compromised secret**
   ```bash
   aws secretsmanager delete-secret \
     --secret-id myapp/production/compromised \
     --force-delete-without-recovery
   ```

2. **Generate and deploy new secret**
   ```bash
   NEW_SECRET=$(openssl rand -hex 32)
   aws secretsmanager create-secret \
     --name myapp/production/new \
     --secret-string "$NEW_SECRET"
   ```

3. **Update all services**
   ```bash
   # Rolling update with new secret
   kubectl rollout restart deployment/myapp
   ```

4. **Revoke active sessions/tokens**
   ```typescript
   // Invalidate all JWT tokens by changing secret
   await redisClient.flushdb(); // Clear session cache
   ```

#### Investigation (First 24 Hours)

5. **Audit logs**
   ```bash
   # Check who accessed the secret
   aws cloudtrail lookup-events \
     --lookup-attributes AttributeKey=ResourceName,AttributeValue=myapp/production/compromised
   ```

6. **Check for unauthorized access**
   ```bash
   # Review database logs
   # Review application logs
   # Check for unusual API calls
   ```

7. **Document incident**
   - What happened
   - When it was discovered
   - What secrets were compromised
   - What actions were taken
   - Who was notified

#### Prevention (Ongoing)

8. **Improve security**
   - Enable MFA for access
   - Restrict IAM permissions
   - Implement secret scanning in CI/CD
   - Add monitoring and alerting

### Secret Scanning Tools

```yaml
# .github/workflows/secret-scan.yml
name: Secret Scan
on: [push, pull_request]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      
      - name: TruffleHog Scan
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main
          head: HEAD
```

## Best Practices Summary

### Development
- Use .env files (never committed)
- Different secrets from production
- Shared via password manager
- Documented in .env.example

### Testing
- Mock secrets where possible
- Separate test credentials
- Stored in CI/CD secrets
- Automatically rotated

### Staging
- Production-like secrets
- Stored in secrets manager
- Regular rotation (30 days)
- Monitoring enabled

### Production
- Secrets manager required
- Strict access control
- Automatic rotation
- Full audit logging
- Encryption at rest
- MFA for access

## 🔗 Related Documentation

- [Environment Configuration](../environments/README.md)
- [Security Best Practices](../../docs/security/README.md)
- [Deployment Guide](../../docs/cicd/README.md)

---

**Last Updated**: 2025-11-13  
**Maintained By**: Security Team
