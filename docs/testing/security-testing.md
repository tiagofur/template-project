# 🔐 Security Testing Guide

Guía completa para implementar security testing y asegurar la protección de la aplicación.

## 🎯 Overview

El security testing identifica vulnerabilidades y asegura que la aplicación está protegida contra amenazas comunes de seguridad.

## 📋 Table of Contents

- [Security Testing Types](#security-testing-types)
- [OWASP Top 10](#owasp-top-10)
- [Authentication Testing](#authentication-testing)
- [Authorization Testing](#authorization-testing)
- [Input Validation](#input-validation)
- [Dependency Scanning](#dependency-scanning)
- [Security Tools](#security-tools)
- [Best Practices](#best-practices)

## 🎭 Security Testing Types

### Static Application Security Testing (SAST)

```yaml
# Example: CodeQL workflow
name: "CodeQL Analysis"

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  analyze:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: javascript, typescript
      
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2
```

### Dynamic Application Security Testing (DAST)

```yaml
# Example: OWASP ZAP scan
- name: ZAP Scan
  uses: zaproxy/action-baseline@v0.7.0
  with:
    target: 'http://localhost:3000'
    rules_file_name: '.zap/rules.tsv'
    cmd_options: '-a'
```

### Software Composition Analysis (SCA)

```bash
# Dependency scanning
npm audit --production
snyk test
```

## 🛡️ OWASP Top 10

### 1. Broken Access Control

**Test:**
```javascript
// test-access-control.spec.js
describe('Access Control', () => {
  it('should prevent unauthorized access to admin routes', async () => {
    const response = await request(app)
      .get('/api/admin/users')
      .set('Authorization', 'Bearer regular_user_token')
      .expect(403);
    
    expect(response.body.message).toContain('Insufficient permissions');
  });
  
  it('should prevent horizontal privilege escalation', async () => {
    const user1Token = await getAuthToken(user1);
    
    // Try to access user2's data with user1's token
    const response = await request(app)
      .get(`/api/users/${user2.id}/profile`)
      .set('Authorization', `Bearer ${user1Token}`)
      .expect(403);
    
    expect(response.body.message).toContain('Access denied');
  });
  
  it('should prevent vertical privilege escalation', async () => {
    const userToken = await getAuthToken(regularUser);
    
    // Try to perform admin action
    const response = await request(app)
      .delete(`/api/users/${someUser.id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });
});
```

### 2. Cryptographic Failures

**Test:**
```javascript
describe('Cryptographic Security', () => {
  it('should hash passwords before storing', async () => {
    const password = 'PlainTextPassword123!';
    
    const user = await createUser({
      email: 'test@example.com',
      password: password,
    });
    
    // Password should be hashed
    expect(user.password).not.toBe(password);
    expect(user.password).toHaveLength(60); // bcrypt hash length
  });
  
  it('should use secure password hashing algorithm', async () => {
    const password = 'TestPassword123!';
    const hash = await hashPassword(password);
    
    // Should start with $2b$ (bcrypt)
    expect(hash).toMatch(/^\$2[aby]\$/);
  });
  
  it('should encrypt sensitive data at rest', async () => {
    const sensitiveData = 'SSN: 123-45-6789';
    
    const encrypted = await encryptData(sensitiveData);
    
    expect(encrypted).not.toBe(sensitiveData);
    expect(encrypted).toMatch(/^[A-Za-z0-9+/]+=*$/); // Base64 pattern
  });
});
```

### 3. Injection

**Test:**
```javascript
describe('SQL Injection Prevention', () => {
  it('should sanitize user input', async () => {
    const maliciousInput = "'; DROP TABLE users; --";
    
    const response = await request(app)
      .get(`/api/users/search?q=${maliciousInput}`)
      .expect(200);
    
    // Should not execute SQL injection
    const users = await userRepository.findAll();
    expect(users.length).toBeGreaterThan(0); // Table still exists
  });
  
  it('should use parameterized queries', async () => {
    const email = "test@example.com' OR '1'='1";
    
    const user = await userRepository.findByEmail(email);
    
    // Should return null, not all users
    expect(user).toBeNull();
  });
});

describe('NoSQL Injection Prevention', () => {
  it('should prevent NoSQL injection in MongoDB', async () => {
    const maliciousEmail = { $ne: null };
    
    const response = await request(app)
      .post('/api/login')
      .send({
        email: maliciousEmail,
        password: 'anything',
      })
      .expect(400);
    
    expect(response.body.message).toContain('Invalid input');
  });
});

describe('XSS Prevention', () => {
  it('should sanitize HTML input', async () => {
    const xssPayload = '<script>alert("XSS")</script>';
    
    const response = await request(app)
      .post('/api/comments')
      .send({ content: xssPayload })
      .expect(201);
    
    const sanitized = response.body.data.content;
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toContain('&lt;script&gt;');
  });
});
```

### 4. Insecure Design

**Test:**
```javascript
describe('Security Design', () => {
  it('should implement rate limiting', async () => {
    const attempts = 10;
    const requests = [];
    
    for (let i = 0; i < attempts; i++) {
      requests.push(
        request(app)
          .post('/api/login')
          .send({ email: 'test@test.com', password: 'wrong' })
      );
    }
    
    const responses = await Promise.all(requests);
    const tooManyRequests = responses.filter(r => r.status === 429);
    
    expect(tooManyRequests.length).toBeGreaterThan(0);
  });
  
  it('should enforce account lockout after failed attempts', async () => {
    const email = 'lockout@test.com';
    const wrongPassword = 'WrongPassword123!';
    
    // Try to login 5 times with wrong password
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/login')
        .send({ email, password: wrongPassword });
    }
    
    // Account should be locked now
    const response = await request(app)
      .post('/api/login')
      .send({ email, password: 'CorrectPassword123!' })
      .expect(423);
    
    expect(response.body.message).toContain('Account locked');
  });
});
```

### 5. Security Misconfiguration

**Test:**
```javascript
describe('Security Headers', () => {
  it('should set security headers', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);
    
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-xss-protection']).toBe('1; mode=block');
    expect(response.headers['strict-transport-security']).toBeDefined();
  });
  
  it('should not expose sensitive information in errors', async () => {
    const response = await request(app)
      .get('/api/nonexistent')
      .expect(404);
    
    expect(response.body.message).not.toContain('Error:');
    expect(response.body.stack).toBeUndefined();
  });
  
  it('should disable directory listing', async () => {
    const response = await request(app)
      .get('/uploads/')
      .expect(404);
  });
});
```

### 6. Vulnerable and Outdated Components

**Automated Scanning:**
```bash
# Check for vulnerable dependencies
npm audit

# Fix automatically
npm audit fix

# Snyk scanning
snyk test

# Generate security report
npm audit --json > security-audit.json
```

**Test:**
```javascript
describe('Dependency Security', () => {
  it('should have no high severity vulnerabilities', async () => {
    const { execSync } = require('child_process');
    
    const auditOutput = execSync('npm audit --json', {
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    
    const audit = JSON.parse(auditOutput);
    const highSeverity = Object.values(audit.vulnerabilities || {})
      .filter(v => v.severity === 'high' || v.severity === 'critical');
    
    expect(highSeverity.length).toBe(0);
  });
});
```

### 7. Identification and Authentication Failures

**Test:**
```javascript
describe('Authentication Security', () => {
  it('should enforce strong password policy', async () => {
    const weakPasswords = [
      'password',
      '12345678',
      'qwerty',
      'Password1', // Missing special char
    ];
    
    for (const password of weakPasswords) {
      const response = await request(app)
        .post('/api/register')
        .send({
          email: 'test@example.com',
          password: password,
        })
        .expect(400);
      
      expect(response.body.message).toContain('password');
    }
  });
  
  it('should use secure session management', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'user@example.com',
        password: 'SecurePass123!',
      })
      .expect(200);
    
    const sessionCookie = response.headers['set-cookie'][0];
    
    expect(sessionCookie).toContain('Secure');
    expect(sessionCookie).toContain('HttpOnly');
    expect(sessionCookie).toContain('SameSite=Strict');
  });
  
  it('should implement session timeout', async () => {
    const { token } = await login();
    
    // Wait for session timeout (simulate)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Old token should be invalid
    const response = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });
});
```

### 8. Software and Data Integrity Failures

**Test:**
```javascript
describe('Data Integrity', () => {
  it('should validate JWT signatures', async () => {
    const tamperedToken = validToken.slice(0, -10) + 'tampered12';
    
    const response = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${tamperedToken}`)
      .expect(401);
    
    expect(response.body.message).toContain('Invalid token');
  });
  
  it('should verify data integrity with checksums', async () => {
    const data = 'Important data';
    const checksum = generateChecksum(data);
    
    // Store data with checksum
    await storeData(data, checksum);
    
    // Verify integrity
    const retrieved = await retrieveData();
    const isValid = verifyChecksum(retrieved.data, retrieved.checksum);
    
    expect(isValid).toBe(true);
  });
});
```

### 9. Security Logging and Monitoring Failures

**Test:**
```javascript
describe('Security Logging', () => {
  it('should log failed login attempts', async () => {
    const logSpy = jest.spyOn(logger, 'warn');
    
    await request(app)
      .post('/api/login')
      .send({
        email: 'test@example.com',
        password: 'WrongPassword',
      })
      .expect(401);
    
    expect(logSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'login_failed',
        email: 'test@example.com',
      })
    );
  });
  
  it('should log suspicious activities', async () => {
    const logSpy = jest.spyOn(logger, 'error');
    
    // Multiple rapid requests from same IP
    for (let i = 0; i < 100; i++) {
      await request(app).get('/api/users');
    }
    
    expect(logSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'rate_limit_exceeded',
      })
    );
  });
});
```

### 10. Server-Side Request Forgery (SSRF)

**Test:**
```javascript
describe('SSRF Prevention', () => {
  it('should validate URLs before making requests', async () => {
    const maliciousUrl = 'http://localhost:9200/_cluster/health';
    
    const response = await request(app)
      .post('/api/fetch-url')
      .send({ url: maliciousUrl })
      .expect(400);
    
    expect(response.body.message).toContain('Invalid URL');
  });
  
  it('should block requests to internal IPs', async () => {
    const internalUrls = [
      'http://127.0.0.1',
      'http://localhost',
      'http://169.254.169.254', // AWS metadata
      'http://192.168.1.1',
    ];
    
    for (const url of internalUrls) {
      const response = await request(app)
        .post('/api/fetch-url')
        .send({ url })
        .expect(400);
      
      expect(response.body.message).toContain('Blocked');
    }
  });
});
```

## 🔑 Authentication Testing

### Password Security

```javascript
describe('Password Security', () => {
  it('should enforce minimum password length', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        email: 'test@example.com',
        password: 'Short1!', // Only 7 chars
      })
      .expect(400);
    
    expect(response.body.errors).toContain(
      'Password must be at least 8 characters'
    );
  });
  
  it('should require password complexity', async () => {
    const weakPasswords = [
      'onlylowercase',
      'ONLYUPPERCASE',
      '12345678',
      'NoSpecialChar1',
    ];
    
    for (const password of weakPasswords) {
      const response = await request(app)
        .post('/api/register')
        .send({
          email: 'test@example.com',
          password: password,
        })
        .expect(400);
      
      expect(response.body.message).toContain('complexity');
    }
  });
  
  it('should prevent common passwords', async () => {
    const commonPasswords = [
      'Password123!',
      'Qwerty123!',
      'Admin123!',
    ];
    
    for (const password of commonPasswords) {
      const response = await request(app)
        .post('/api/register')
        .send({
          email: 'test@example.com',
          password: password,
        })
        .expect(400);
      
      expect(response.body.message).toContain('common');
    }
  });
});
```

### Multi-Factor Authentication

```javascript
describe('MFA Security', () => {
  it('should require MFA for sensitive operations', async () => {
    const { token } = await login(user);
    
    const response = await request(app)
      .post('/api/account/delete')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
    
    expect(response.body.message).toContain('MFA required');
  });
  
  it('should validate TOTP codes correctly', async () => {
    const { token, secret } = await setupMFA(user);
    const validCode = generateTOTP(secret);
    
    const response = await request(app)
      .post('/api/account/delete')
      .set('Authorization', `Bearer ${token}`)
      .send({ mfaCode: validCode })
      .expect(200);
  });
  
  it('should reject expired TOTP codes', async () => {
    const { token } = await setupMFA(user);
    const expiredCode = '123456'; // Old/invalid code
    
    const response = await request(app)
      .post('/api/account/delete')
      .set('Authorization', `Bearer ${token}`)
      .send({ mfaCode: expiredCode })
      .expect(401);
    
    expect(response.body.message).toContain('Invalid MFA code');
  });
});
```

## 🛡️ Authorization Testing

### Role-Based Access Control

```javascript
describe('RBAC', () => {
  it('should enforce role permissions', async () => {
    const roles = [
      { role: 'admin', canDelete: true },
      { role: 'moderator', canDelete: true },
      { role: 'user', canDelete: false },
    ];
    
    for (const { role, canDelete } of roles) {
      const user = await createUserWithRole(role);
      const token = await getAuthToken(user);
      
      const response = await request(app)
        .delete('/api/posts/123')
        .set('Authorization', `Bearer ${token}`);
      
      if (canDelete) {
        expect(response.status).toBe(200);
      } else {
        expect(response.status).toBe(403);
      }
    }
  });
});
```

## ✅ Input Validation

### Sanitization Tests

```javascript
describe('Input Sanitization', () => {
  it('should sanitize HTML in user input', async () => {
    const xssAttempts = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      '<svg onload=alert("XSS")>',
    ];
    
    for (const payload of xssAttempts) {
      const response = await request(app)
        .post('/api/posts')
        .send({ title: 'Test', content: payload })
        .expect(201);
      
      expect(response.body.data.content).not.toContain('<script>');
      expect(response.body.data.content).not.toContain('onerror=');
    }
  });
  
  it('should validate email format', async () => {
    const invalidEmails = [
      'notanemail',
      '@example.com',
      'user@',
      'user space@example.com',
    ];
    
    for (const email of invalidEmails) {
      const response = await request(app)
        .post('/api/register')
        .send({ email, password: 'ValidPass123!' })
        .expect(400);
      
      expect(response.body.errors).toContain('Invalid email');
    }
  });
});
```

## 📦 Dependency Scanning

### NPM Audit

```bash
# Run audit
npm audit

# Check for specific severity
npm audit --audit-level=moderate

# Generate JSON report
npm audit --json > audit-report.json

# Fix vulnerabilities automatically
npm audit fix

# Force fix (may introduce breaking changes)
npm audit fix --force
```

### Snyk Integration

```bash
# Authenticate
snyk auth

# Test for vulnerabilities
snyk test

# Monitor project
snyk monitor

# Test with custom severity threshold
snyk test --severity-threshold=high

# Generate HTML report
snyk test --json | snyk-to-html -o snyk-report.html
```

## 🛠️ Security Tools

### OWASP ZAP

```yaml
# ZAP Baseline Scan
- name: OWASP ZAP Baseline Scan
  uses: zaproxy/action-baseline@v0.7.0
  with:
    target: 'http://localhost:3000'
    rules_file_name: '.zap/rules.tsv'
    cmd_options: '-a'
```

### Security Headers Check

```javascript
// test-security-headers.js
import request from 'supertest';
import app from '../src/app';

describe('Security Headers', () => {
  let response;
  
  beforeAll(async () => {
    response = await request(app).get('/');
  });
  
  it('should have X-Frame-Options header', () => {
    expect(response.headers['x-frame-options']).toBe('DENY');
  });
  
  it('should have X-Content-Type-Options header', () => {
    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });
  
  it('should have X-XSS-Protection header', () => {
    expect(response.headers['x-xss-protection']).toBe('1; mode=block');
  });
  
  it('should have Strict-Transport-Security header', () => {
    expect(response.headers['strict-transport-security'])
      .toContain('max-age=');
  });
  
  it('should have Content-Security-Policy header', () => {
    expect(response.headers['content-security-policy']).toBeDefined();
  });
});
```

## 📋 Best Practices

### Security Testing Checklist

```markdown
## Authentication & Authorization
- [ ] Password strength requirements enforced
- [ ] Account lockout after failed attempts
- [ ] Secure session management
- [ ] Multi-factor authentication for sensitive operations
- [ ] Role-based access control implemented
- [ ] Token expiration and refresh logic

## Input Validation
- [ ] All user inputs validated
- [ ] SQL injection prevention
- [ ] XSS prevention with output encoding
- [ ] CSRF protection
- [ ] File upload restrictions
- [ ] Command injection prevention

## Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] Passwords properly hashed (bcrypt)
- [ ] HTTPS enforced
- [ ] Secure cookie flags set
- [ ] PII handling compliant with regulations
- [ ] Data backup encrypted

## API Security
- [ ] Rate limiting implemented
- [ ] API authentication required
- [ ] Input validation on all endpoints
- [ ] Proper error handling (no sensitive info)
- [ ] CORS configured correctly
- [ ] API versioning strategy

## Infrastructure
- [ ] Security headers configured
- [ ] Dependencies up to date
- [ ] No secrets in code
- [ ] Security logging enabled
- [ ] Intrusion detection configured
- [ ] Regular security updates
```

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [Snyk Documentation](https://docs.snyk.io/)
- [OWASP ZAP](https://www.zaproxy.org/)

---

_Security Testing - Protegiendo tu aplicación_ 🔐
