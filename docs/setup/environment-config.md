# ⚙️ Environment Configuration

Guide for configuring environment variables and managing secrets across different environments.

> **📦 Comprehensive Environment Configuration System**  
> For complete environment templates and detailed guides, see:
> - **[Environment Templates](../../templates/environments/README.md)** - Pre-configured templates for all environments
> - **[Setup Guide](../../templates/environments/SETUP_GUIDE.md)** - Step-by-step setup for each environment
> - **[Secrets Management](../../templates/environments/SECRETS_MANAGEMENT.md)** - Secure secret handling
> - **[Security Guide](../../templates/environments/SECURITY_GUIDE.md)** - Security best practices
> - **[Database & API Config](../../templates/environments/DATABASE_API_CONFIG.md)** - Database and API setup
> - **[Troubleshooting](../../templates/environments/TROUBLESHOOTING.md)** - Common issues and solutions
> - **[Feature Flags](../../templates/feature-flags/README.md)** - Feature flag implementation

## Overview

Environment configuration is crucial for:
- Separating configuration from code
- Managing secrets securely
- Supporting multiple environments (dev, staging, production)
- Enabling team collaboration without sharing sensitive data

## Quick Start

```bash
# 1. Copy the example file
cp .env.example .env

# 2. Edit with your values
nano .env

# 3. Never commit .env to Git!
# It should already be in .gitignore
```

## Environment Files

### `.env.example`
- **Purpose**: Template showing required variables
- **Committed**: ✅ Yes, to version control
- **Contains**: Variable names with placeholder/example values

### `.env`
- **Purpose**: Your actual configuration with real values
- **Committed**: ❌ Never commit to version control
- **Contains**: Real API keys, passwords, secrets

### `.env.local`, `.env.development`, `.env.production`
- **Purpose**: Environment-specific configurations
- **Committed**: ❌ Usually not committed
- **Contains**: Environment-specific values

## Required Variables

Check `.env.example` for all required variables. Common ones include:

### Application Settings
```bash
# Application
NODE_ENV=development
APP_NAME=my-app
APP_URL=http://localhost:3000
PORT=3000
```

### Database Configuration
```bash
# PostgreSQL example
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp_dev
DB_USER=postgres
DB_PASSWORD=your_password
```

### API Keys and Secrets
```bash
# Authentication
JWT_SECRET=your-secret-key-here
SESSION_SECRET=another-secret-key

# Third-party services
OPENAI_API_KEY=sk-...
GITHUB_TOKEN=ghp_...
STRIPE_API_KEY=sk_test_...
```

### Email Configuration
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## Setting Up Variables

### 1. Copy Template
```bash
cp .env.example .env
```

### 2. Edit Values
Use your preferred editor:
```bash
# Using nano
nano .env

# Using vim
vim .env

# Using VS Code
code .env
```

### 3. Fill in Required Values

**For Development**:
- Use local database connections
- Use test API keys when available
- Set DEBUG=true or LOG_LEVEL=debug
- Use localhost URLs

**For Production** (set in deployment platform):
- Use production database URLs
- Use production API keys
- Set DEBUG=false
- Use actual domain URLs

## Environment-Specific Configuration

### Development (`.env` or `.env.development`)
```bash
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug
DATABASE_URL=postgresql://localhost:5432/myapp_dev
API_URL=http://localhost:3000/api
```

### Staging (`.env.staging`)
```bash
NODE_ENV=staging
DEBUG=false
LOG_LEVEL=info
DATABASE_URL=postgresql://staging-db:5432/myapp_staging
API_URL=https://staging.myapp.com/api
```

### Production (set in deployment platform)
```bash
NODE_ENV=production
DEBUG=false
LOG_LEVEL=error
DATABASE_URL=postgresql://prod-db:5432/myapp_prod
API_URL=https://api.myapp.com
```

## Obtaining API Keys

### GitHub
1. Go to Settings → Developer settings → Personal access tokens
2. Generate new token with required scopes
3. Copy token to `GITHUB_TOKEN` in `.env`

### OpenAI
1. Visit https://platform.openai.com/api-keys
2. Create new secret key
3. Copy to `OPENAI_API_KEY` in `.env`

### Database
```bash
# Local PostgreSQL
# Install PostgreSQL, then:
createdb myapp_dev
# Use: postgresql://postgres:password@localhost:5432/myapp_dev

# Cloud database (e.g., Supabase)
# Get connection string from dashboard
# Format: postgresql://user:pass@host:port/db?options
```

## Loading Environment Variables

### Node.js (dotenv)
```javascript
// Load at the top of your entry file
require('dotenv').config();

// Or ES modules
import 'dotenv/config';

// Access variables
const apiKey = process.env.OPENAI_API_KEY;
```

### Python (python-dotenv)
```python
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv('OPENAI_API_KEY')
```

### Docker
```yaml
# docker-compose.yml
services:
  app:
    env_file:
      - .env
    environment:
      - NODE_ENV=production
```

## Security Best Practices

### ❌ Never Do This
```bash
# Don't commit .env files
git add .env  # ❌

# Don't share secrets in code
const apiKey = "sk-real-key-here";  # ❌

# Don't log secrets
console.log(process.env.API_KEY);  # ❌
```

### ✅ Always Do This
```bash
# Keep .env in .gitignore
echo ".env" >> .gitignore  # ✅

# Use environment variables
const apiKey = process.env.API_KEY;  # ✅

# Use secret management in production
# AWS Secrets Manager, HashiCorp Vault, etc.  # ✅
```

### Verify .gitignore
```bash
# Check .env is ignored
git status

# If .env shows up, add to .gitignore:
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

## Deployment Configuration

### Vercel
```bash
# Add via CLI
vercel env add API_KEY

# Or in dashboard
# Settings → Environment Variables
```

### Netlify
```bash
# In netlify.toml
[build.environment]
  NODE_ENV = "production"

# Secrets in dashboard
# Site settings → Build & deploy → Environment
```

### Heroku
```bash
heroku config:set API_KEY=value
heroku config:set DATABASE_URL=postgresql://...
```

### Docker
```bash
# Pass at runtime
docker run -e API_KEY=value myapp

# Or use env file
docker run --env-file .env myapp
```

## Troubleshooting

### Variables Not Loading
```bash
# Check file exists
ls -la .env

# Verify dotenv is installed
npm list dotenv

# Load explicitly
require('dotenv').config({ path: '.env' });

# Check for syntax errors in .env
# No spaces around =
# No quotes needed for most values
```

### Wrong Environment
```bash
# Check which env file is loaded
console.log(process.env.NODE_ENV);

# Explicitly set environment
NODE_ENV=development npm run dev
```

### Variables Undefined
```bash
# Restart dev server after changing .env
# Some frameworks cache environment

# Check variable name spelling
# Environment variables are case-sensitive
```

## Validation

### Check Required Variables
```javascript
// validate-env.js
const required = [
  'DATABASE_URL',
  'JWT_SECRET',
  'API_KEY'
];

required.forEach(key => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});
```

### Use Schema Validation
```javascript
// Using envalid (Node.js)
const { cleanEnv, str, port } = require('envalid');

const env = cleanEnv(process.env, {
  DATABASE_URL: str(),
  PORT: port({ default: 3000 }),
  API_KEY: str()
});
```

## Environment Checklist

- [ ] `.env.example` exists with all required variables
- [ ] `.env` created from example
- [ ] All required variables have values
- [ ] `.env` is in `.gitignore`
- [ ] Secrets never committed to Git
- [ ] Production secrets configured in deployment platform
- [ ] Environment loading works in code
- [ ] Validation checks for required variables

## Next Steps

- [Tool Installation](./tool-installation.md) - Install development tools
- [IDE Setup](./ide-setup.md) - Configure your editor
- [Backend Guide](../stack-guides/backend.md) - If working with APIs/databases
- [Security Guide](../stack-guides/security.md) - Security best practices

---

**Estimated Time**: 15-20 minutes  
**Difficulty**: Beginner  
**Last Updated**: 2025-11-13

_Environment Configuration - Keep your secrets safe_ ⚙️
