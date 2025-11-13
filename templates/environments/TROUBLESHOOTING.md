# 🔧 Environment Configuration Troubleshooting

Common issues and solutions for environment configuration problems.

## 📋 Common Issues

### Environment Variables Not Loading

#### Symptom
```
Error: Missing required environment variable: DATABASE_URL
```

#### Solutions

1. **Check .env file exists**
   ```bash
   ls -la .env
   # If not found, create it
   cp templates/environments/.env.development .env
   ```

2. **Verify .env is being loaded**
   ```typescript
   // Add at top of entry file
   require('dotenv').config();
   console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
   ```

3. **Check for syntax errors in .env**
   ```bash
   # Bad - spaces around =
   DATABASE_URL = postgresql://...
   
   # Good - no spaces
   DATABASE_URL=postgresql://...
   ```

4. **Restart the application**
   ```bash
   # Environment variables are loaded at startup
   # Changes require restart
   npm run dev
   ```

### Database Connection Failed

#### Symptom
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

#### Solutions

1. **Check database is running**
   ```bash
   # PostgreSQL
   pg_isready
   # or
   sudo systemctl status postgresql
   
   # Docker
   docker ps | grep postgres
   ```

2. **Verify connection string**
   ```bash
   # Check format
   DATABASE_URL=postgresql://username:password@host:port/database
   
   # Test connection
   psql "postgresql://username:password@host:port/database"
   ```

3. **Check firewall/network**
   ```bash
   # Test port connectivity
   nc -zv localhost 5432
   telnet localhost 5432
   ```

4. **Verify credentials**
   ```bash
   # Try connecting manually
   psql -h localhost -U postgres -d myapp_dev
   ```

### Redis Connection Issues

#### Symptom
```
Error: Redis connection to localhost:6379 failed
```

#### Solutions

1. **Check Redis is running**
   ```bash
   # Check status
   redis-cli ping
   # Should return PONG
   
   # Docker
   docker ps | grep redis
   ```

2. **Verify Redis URL**
   ```bash
   # Format
   REDIS_URL=redis://localhost:6379
   
   # With password
   REDIS_URL=redis://:password@localhost:6379
   
   # With SSL
   REDIS_URL=rediss://host:6380
   ```

3. **Check Redis authentication**
   ```bash
   # If password protected
   redis-cli -a yourpassword ping
   ```

### JWT Token Issues

#### Symptom
```
Error: invalid signature
JsonWebTokenError: jwt malformed
```

#### Solutions

1. **Check JWT secrets match**
   ```bash
   # Secrets must be consistent across instances
   # Verify JWT_SECRET is set
   echo $JWT_SECRET
   ```

2. **Generate proper secrets**
   ```bash
   # Must be at least 32 characters
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Clear old tokens**
   ```bash
   # Clear Redis cache
   redis-cli FLUSHALL
   
   # Or clear specific keys
   redis-cli KEYS "session:*" | xargs redis-cli DEL
   ```

### CORS Errors

#### Symptom
```
Access to fetch at 'http://api.example.com' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

#### Solutions

1. **Check CORS_ORIGIN setting**
   ```bash
   # Development
   CORS_ORIGIN=http://localhost:3000,http://localhost:5173
   
   # Production
   CORS_ORIGIN=https://myapp.com
   ```

2. **Update CORS middleware**
   ```typescript
   app.use(cors({
     origin: process.env.CORS_ORIGIN.split(','),
     credentials: true,
   }));
   ```

3. **Check for typos in URLs**
   ```bash
   # Common mistakes
   http://localhost:3000/  # Trailing slash
   http://localhost:3000   # Correct
   ```

### SSL/TLS Certificate Errors

#### Symptom
```
Error: self signed certificate in certificate chain
Error: unable to verify the first certificate
```

#### Solutions

1. **Development - Disable SSL verification (not for production)**
   ```bash
   # Node.js
   NODE_TLS_REJECT_UNAUTHORIZED=0
   
   # PostgreSQL
   DATABASE_URL=postgresql://...?sslmode=disable
   ```

2. **Production - Use proper certificates**
   ```bash
   # Point to certificate files
   SSL_CERT_PATH=/etc/ssl/certs/server.crt
   SSL_KEY_PATH=/etc/ssl/private/server.key
   SSL_CA_PATH=/etc/ssl/certs/ca-bundle.crt
   ```

3. **Update certificate authority**
   ```bash
   # Update CA certificates
   sudo update-ca-certificates
   ```

### Port Already in Use

#### Symptom
```
Error: listen EADDRINUSE: address already in use :::3000
```

#### Solutions

1. **Find and kill process**
   ```bash
   # Find process using port
   lsof -ti:3000
   
   # Kill process
   kill -9 $(lsof -ti:3000)
   ```

2. **Use different port**
   ```bash
   PORT=3001 npm run dev
   ```

3. **Check for zombie processes**
   ```bash
   # List all node processes
   ps aux | grep node
   
   # Kill all node processes
   pkill -9 node
   ```

### Environment-Specific Issues

#### Development Environment

**Issue: Can't connect to local database**
```bash
# Solution: Ensure database is created
createdb myapp_dev

# Or using Docker
docker run --name postgres-dev \
  -e POSTGRES_DB=myapp_dev \
  -p 5432:5432 \
  -d postgres:14
```

**Issue: Hot reload not working**
```bash
# Solution: Check file watching limits
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

#### Test Environment

**Issue: Tests failing with timeout**
```bash
# Solution: Increase test timeout
TEST_TIMEOUT=30000

# Or in test file
jest.setTimeout(30000);
```

**Issue: Test database not clean**
```bash
# Solution: Add cleanup hooks
beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE users CASCADE`;
});
```

#### Staging/Production

**Issue: Secrets not found**
```bash
# Solution: Verify IAM permissions
aws iam get-role --role-name myapp-ecs-role

# Check secrets manager access
aws secretsmanager list-secrets

# Test retrieval
aws secretsmanager get-secret-value --secret-id myapp/production/database
```

**Issue: High database latency**
```bash
# Solution: Check connection pool settings
DB_POOL_MAX=50  # Increase pool size
DB_POOL_IDLE_TIMEOUT=30000  # Keep connections alive longer

# Enable connection pooling
DATABASE_URL=postgresql://...?pool_size=50
```

## 🔍 Debugging Tools

### Check All Environment Variables

```bash
# List all environment variables
node -e "console.log(JSON.stringify(process.env, null, 2))"

# Check specific variable
node -e "console.log('DATABASE_URL:', process.env.DATABASE_URL)"
```

### Validate Environment Configuration

```bash
# Run validation script
node scripts/validate-env.js

# Check output for errors and warnings
```

### Test Database Connection

```bash
# PostgreSQL
psql $DATABASE_URL -c "SELECT version();"

# MongoDB
mongosh $MONGODB_URI --eval "db.adminCommand('ping')"

# Redis
redis-cli -u $REDIS_URL ping
```

### Test API Endpoints

```bash
# Health check
curl http://localhost:3000/api/health

# With authentication
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/users/me
```

### Check Logs

```bash
# Application logs
tail -f logs/dev.log

# Docker logs
docker logs -f myapp-backend

# Kubernetes logs
kubectl logs -f deployment/myapp
```

## 📊 Performance Issues

### Slow Database Queries

**Check query performance**
```sql
-- PostgreSQL
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

-- Enable query logging
ALTER DATABASE myapp SET log_statement = 'all';
```

**Solutions:**
```bash
# Enable query logging
DEBUG_SQL=true

# Add indexes
npm run migration:create add-user-email-index

# Optimize connection pool
DB_POOL_MIN=10
DB_POOL_MAX=50
```

### Memory Leaks

**Monitor memory usage**
```bash
# Node.js heap snapshot
node --inspect index.js

# Check memory usage
node -e "console.log(process.memoryUsage())"
```

**Solutions:**
```bash
# Increase memory limit
NODE_OPTIONS="--max-old-space-size=4096"

# Enable garbage collection logging
NODE_OPTIONS="--trace-gc"
```

### High CPU Usage

**Profile application**
```bash
# Node.js profiler
node --prof index.js

# Generate report
node --prof-process isolate-*.log > profile.txt
```

## 🚨 Emergency Procedures

### Critical Production Issue

1. **Immediate Response**
   ```bash
   # Rollback to previous version
   kubectl rollout undo deployment/myapp
   
   # Or scale down to 0
   kubectl scale deployment/myapp --replicas=0
   ```

2. **Investigate**
   ```bash
   # Check recent changes
   git log --oneline -10
   
   # Review error logs
   kubectl logs -l app=myapp --tail=100
   
   # Check monitoring
   # Visit Sentry/DataDog/CloudWatch
   ```

3. **Fix and Redeploy**
   ```bash
   # Fix issue
   # Test locally
   npm run test
   
   # Deploy fix
   kubectl set image deployment/myapp myapp=myapp:fixed
   ```

### Compromised Secrets

1. **Immediately revoke**
   ```bash
   # Rotate database password
   aws secretsmanager rotate-secret \
     --secret-id myapp/production/database
   ```

2. **Deploy new secrets**
   ```bash
   # Update application with new secrets
   kubectl rollout restart deployment/myapp
   ```

3. **Audit access**
   ```bash
   # Check CloudTrail logs
   aws cloudtrail lookup-events \
     --lookup-attributes AttributeKey=ResourceName,AttributeValue=myapp/production
   ```

## 📞 Getting Help

### Before Asking for Help

1. Check this troubleshooting guide
2. Review error messages carefully
3. Check application logs
4. Verify environment variables are set
5. Try with a fresh install

### When Asking for Help

Include:
- Environment (dev/staging/production)
- Full error message
- Steps to reproduce
- What you've already tried
- Relevant configuration (without secrets!)

## 🔗 Related Documentation

- [Environment Setup Guide](./SETUP_GUIDE.md)
- [Database Configuration](./DATABASE_API_CONFIG.md)
- [Security Guide](./SECURITY_GUIDE.md)
- [Secrets Management](./SECRETS_MANAGEMENT.md)

---

**Last Updated**: 2025-11-13  
**Maintained By**: DevOps Team
