# 🔒 Security Prompts

Prompts especializados para seguridad, auditorías, vulnerabilidades y compliance.

## 📋 Categorías

### Security Audits
- [Security Audit](./security-audit.md) - Auditoría de seguridad completa
- [Code Security Review](./code-security-review.md) - Revisión de código
- [Dependency Audit](./dependency-audit.md) - Auditoría de dependencias
- [Penetration Test](./penetration-test.md) - Tests de penetración

### Vulnerability Assessment
- [OWASP Top 10](./owasp-top-10.md) - Prevenir OWASP Top 10
- [SQL Injection Prevention](./sql-injection.md) - Prevenir SQL injection
- [XSS Prevention](./xss-prevention.md) - Prevenir XSS
- [CSRF Protection](./csrf-protection.md) - Protección CSRF
- [Security Headers](./security-headers.md) - Headers de seguridad

### Authentication & Authorization
- [Secure Auth Flow](./secure-auth-flow.md) - Flujo de autenticación seguro
- [OAuth Implementation](./oauth-implementation.md) - Implementar OAuth
- [MFA Setup](./mfa-setup.md) - Multi-factor authentication
- [JWT Security](./jwt-security.md) - JWT seguro
- [Session Management](./session-management.md) - Manejo de sesiones

### Data Protection
- [Data Encryption](./data-encryption.md) - Encriptación de datos
- [PII Protection](./pii-protection.md) - Proteger datos personales
- [Secure Storage](./secure-storage.md) - Almacenamiento seguro
- [Data Masking](./data-masking.md) - Enmascaramiento de datos
- [Backup Security](./backup-security.md) - Backups seguros

### Secure Coding
- [Input Validation](./input-validation.md) - Validación de entrada
- [Output Encoding](./output-encoding.md) - Codificación de salida
- [Error Handling](./error-handling-security.md) - Manejo de errores seguro
- [Secrets Management](./secrets-management.md) - Manejo de secretos
- [API Security](./api-security.md) - Seguridad en APIs

### Compliance
- [GDPR Compliance](./gdpr-compliance.md) - Cumplir con GDPR
- [HIPAA Compliance](./hipaa-compliance.md) - Cumplir con HIPAA
- [PCI DSS](./pci-dss.md) - Payment Card Industry DSS
- [SOC 2](./soc2.md) - SOC 2 compliance
- [Security Policy](./security-policy.md) - Política de seguridad

## 🎯 Guía de Uso

### Stack Soportado

- **SAST:** SonarQube, CodeQL, Semgrep, ESLint
- **DAST:** OWASP ZAP, Burp Suite
- **Dependency:** Snyk, Dependabot, npm audit
- **Secrets:** HashiCorp Vault, AWS Secrets Manager
- **Monitoring:** SIEM tools, Security logs

### Variables Comunes

- `{{app_name}}`: Nombre de la aplicación
- `{{threat_model}}`: Modelo de amenazas
- `{{compliance_standard}}`: GDPR, HIPAA, PCI-DSS
- `{{security_level}}`: Basic, Enhanced, Maximum

## 💡 Tips Generales

### Security by Design

- Threat modeling desde el inicio
- Principle of least privilege
- Defense in depth
- Fail securely
- Security testing continuo

### Common Vulnerabilities

- **Injection:** Validar y sanitizar inputs
- **Broken Auth:** MFA, strong passwords, session management
- **Sensitive Data:** Encrypt at rest and in transit
- **XXE:** Disable external entities
- **Broken Access Control:** Implement proper authorization

### Best Practices

- Never trust user input
- Encrypt sensitive data
- Use prepared statements
- Implement rate limiting
- Keep dependencies updated
- Log security events
- Regular security audits
- Security training para el equipo

### Incident Response

- Detection mechanisms
- Response procedures
- Communication plan
- Recovery procedures
- Post-incident analysis

## 🚨 Security Checklist

### Application Security
- [ ] Input validation en todos los endpoints
- [ ] Output encoding para prevenir XSS
- [ ] Prepared statements para prevenir SQL injection
- [ ] CSRF tokens en formularios
- [ ] Security headers configurados
- [ ] HTTPS en producción
- [ ] Rate limiting implementado
- [ ] Logging de eventos de seguridad

### Authentication & Authorization
- [ ] Passwords hasheados con bcrypt/argon2
- [ ] MFA disponible
- [ ] Session timeout apropiado
- [ ] Secure password reset flow
- [ ] Account lockout después de intentos fallidos
- [ ] Authorization checks en cada endpoint

### Data Protection
- [ ] Datos sensibles encriptados
- [ ] PII protegida apropiadamente
- [ ] Backups encriptados
- [ ] Secure data deletion
- [ ] Data retention policy implementada

### Infrastructure
- [ ] Firewall configurado
- [ ] Regular security updates
- [ ] Least privilege access
- [ ] Secrets no en código
- [ ] Security monitoring activo

## 📚 Recursos Adicionales

- [OWASP Top 10](https://owasp.org/Top10/)
- [Security Testing Guide](../../docs/testing/security-testing.md)
- [Monitoring & Secrets](../../docs/monitoring-secrets/README.md)

---

_Security Prompts - Construyendo aplicaciones seguras_ 🔒
