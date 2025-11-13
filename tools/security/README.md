# 🔒 Security Tools

Herramientas especializadas para seguridad, análisis de vulnerabilidades, auditorías y protección de aplicaciones.

## 📋 Tabla de Contenidos

- [Static Application Security Testing (SAST)](#static-application-security-testing-sast)
- [Dynamic Application Security Testing (DAST)](#dynamic-application-security-testing-dast)
- [Dependency Scanning](#dependency-scanning)
- [Secret Management](#secret-management)
- [Container Security](#container-security)
- [Infrastructure Security](#infrastructure-security)
- [Security Monitoring](#security-monitoring)
- [Penetration Testing](#penetration-testing)

## 🔍 Static Application Security Testing (SAST)

### SonarQube ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Platform de code quality y security

**Instalación:**
```bash
docker run -d -p 9000:9000 sonarqube:community
```

**Casos de Uso:**
- Static code analysis
- Security vulnerabilities
- Code smells
- Quality gates

**Security Features:**
- SQL injection detection
- XSS vulnerabilities
- Hardcoded credentials
- OWASP Top 10

**Pros:**
- ✅ Multi-language support
- ✅ Security hotspots
- ✅ Quality gates
- ✅ CI/CD integration

**Recursos:**
- [SonarQube Docs](https://docs.sonarqube.org/)
- [Security Rules](https://rules.sonarsource.com/)

---

### Semgrep ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Fast static analysis tool

**Instalación:**
```bash
# macOS/Linux
brew install semgrep

# Python
pip install semgrep
```

**Uso:**
```bash
# Scan current directory
semgrep --config=auto .

# Use specific rules
semgrep --config=p/security-audit .
semgrep --config=p/owasp-top-ten .

# CI mode
semgrep ci
```

**Casos de Uso:**
- Security scanning
- Custom rules
- CI/CD integration
- Code patterns

**Pros:**
- ✅ Muy rápido
- ✅ Custom rules
- ✅ Multi-language
- ✅ Low false positives
- ✅ Free tier generoso

**Recursos:**
- [Semgrep Docs](https://semgrep.dev/docs/)
- [Semgrep Registry](https://semgrep.dev/explore)

---

### CodeQL ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Semantic code analysis engine

**Instalación:**
```bash
# GitHub Actions (recomendado)
# Ver ejemplo en .github/workflows/codeql.yml
```

**GitHub Actions Setup:**
```yaml
name: "CodeQL"
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: github/codeql-action/init@v2
        with:
          languages: javascript
      - uses: github/codeql-action/analyze@v2
```

**Casos de Uso:**
- Security vulnerabilities
- Code quality
- Custom queries
- Variant analysis

**Pros:**
- ✅ Semantic analysis
- ✅ GitHub integration
- ✅ Free para OSS
- ✅ Custom queries

**Recursos:**
- [CodeQL Docs](https://codeql.github.com/docs/)
- [CodeQL Queries](https://github.com/github/codeql)

---

### ESLint Security Plugins ⭐⭐
**Nivel:** Recomendado (JavaScript)  
**Descripción:** Security linting para JavaScript

**Instalación:**
```bash
npm install --save-dev eslint-plugin-security eslint-plugin-no-secrets
```

**Configuración:**
```json
{
  "plugins": ["security", "no-secrets"],
  "extends": ["plugin:security/recommended"]
}
```

**Casos de Uso:**
- Security linting
- Detect eval usage
- Detect secrets
- Regular expression DoS

---

### Bandit ⭐⭐
**Nivel:** Recomendado (Python)  
**Descripción:** Security linter para Python

**Instalación:**
```bash
pip install bandit
```

**Uso:**
```bash
bandit -r ./myapp
bandit -r ./myapp -f json -o report.json
```

**Casos de Uso:**
- Python security issues
- Common vulnerabilities
- Hardcoded passwords

## 🌐 Dynamic Application Security Testing (DAST)

### OWASP ZAP ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Web application security scanner

**Instalación:**
```bash
# Docker
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://example.com

# Desktop
# Descarga desde zaproxy.org
```

**Casos de Uso:**
- Web app scanning
- API security testing
- Automated scanning
- Manual pentesting

**Modos:**
- **Baseline Scan**: Quick scan
- **Full Scan**: Deep scan
- **API Scan**: OpenAPI/GraphQL

**Pros:**
- ✅ Free y open source
- ✅ Active community
- ✅ API support
- ✅ CI/CD integration

**Recursos:**
- [ZAP Docs](https://www.zaproxy.org/docs/)
- [ZAP Docker](https://www.zaproxy.org/docs/docker/)

---

### Burp Suite ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Web security testing platform

**Casos de Uso:**
- Manual pentesting
- Intercepting proxy
- Web vulnerability scanning
- API testing

**Pros:**
- ✅ Industry standard
- ✅ Powerful features
- ✅ Extensions ecosystem

**Contras:**
- ❌ Paid (Pro version)
- ❌ Desktop only

---

### Nuclei ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Fast vulnerability scanner

**Instalación:**
```bash
# macOS/Linux
brew install nuclei

# Go
go install -v github.com/projectdiscovery/nuclei/v2/cmd/nuclei@latest
```

**Uso:**
```bash
nuclei -u https://example.com
nuclei -l urls.txt -t cves/
nuclei -u https://example.com -severity critical,high
```

**Casos de Uso:**
- CVE scanning
- Misconfigurations
- Exposed panels
- Custom templates

**Pros:**
- ✅ Muy rápido
- ✅ Template-based
- ✅ Active templates
- ✅ CI/CD friendly

## 📦 Dependency Scanning

### Snyk ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Developer security platform

**Instalación:**
```bash
npm install -g snyk
snyk auth
```

**Uso:**
```bash
# Scan project
snyk test

# Monitor project
snyk monitor

# Fix vulnerabilities
snyk fix
```

**Casos de Uso:**
- Dependency vulnerabilities
- Container scanning
- IaC scanning
- License compliance

**Pros:**
- ✅ Multi-ecosystem
- ✅ Auto-fix PRs
- ✅ IDE integration
- ✅ Container scanning

**Recursos:**
- [Snyk Docs](https://docs.snyk.io/)
- [Snyk Database](https://security.snyk.io/)

---

### Dependabot ⭐⭐⭐
**Nivel:** Esencial (GitHub)  
**Descripción:** Automated dependency updates

**Configuración:**
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

**Casos de Uso:**
- Dependency updates
- Security updates
- Automated PRs

**Pros:**
- ✅ GitHub native
- ✅ Free
- ✅ Auto PRs
- ✅ Version updates

---

### npm audit / yarn audit ⭐⭐⭐
**Nivel:** Esencial (Node.js)  
**Descripción:** Built-in security auditing

**Uso:**
```bash
# npm
npm audit
npm audit fix
npm audit fix --force

# yarn
yarn audit
yarn audit --level moderate
```

**Casos de Uso:**
- Quick vulnerability check
- Dependency auditing
- Auto-fix

---

### pip-audit ⭐⭐
**Nivel:** Recomendado (Python)  
**Descripción:** Python dependency auditing

**Instalación:**
```bash
pip install pip-audit
```

**Uso:**
```bash
pip-audit
pip-audit --fix
pip-audit --format json
```

---

### OWASP Dependency-Check ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Software composition analysis

**Instalación:**
```bash
# CLI
brew install dependency-check

# Maven plugin
<plugin>
    <groupId>org.owasp</groupId>
    <artifactId>dependency-check-maven</artifactId>
</plugin>
```

**Casos de Uso:**
- Java dependencies
- Multi-language support
- CI/CD integration

## 🔑 Secret Management

### HashiCorp Vault ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Secrets management platform

**Instalación:**
```bash
brew install vault

# Start dev server
vault server -dev
```

**Casos de Uso:**
- Secret storage
- Dynamic secrets
- Encryption as a service
- PKI/Certificates

**Ejemplo:**
```bash
# Store secret
vault kv put secret/myapp/config api_key="secret123"

# Retrieve secret
vault kv get secret/myapp/config

# Generate dynamic DB creds
vault read database/creds/my-role
```

**Pros:**
- ✅ Encryption at rest
- ✅ Dynamic secrets
- ✅ Audit logging
- ✅ Multi-cloud

**Recursos:**
- [Vault Docs](https://www.vaultproject.io/docs)
- [Vault Tutorials](https://learn.hashicorp.com/vault)

---

### AWS Secrets Manager ⭐⭐
**Nivel:** Recomendado (AWS)  
**Descripción:** AWS secret management service

**Uso:**
```bash
# Create secret
aws secretsmanager create-secret --name MySecret --secret-string '{"key":"value"}'

# Retrieve secret
aws secretsmanager get-secret-value --secret-id MySecret
```

**Casos de Uso:**
- AWS secrets
- Rotation policies
- RDS integration

---

### dotenv / .env files ⭐⭐⭐
**Nivel:** Esencial (Development)  
**Descripción:** Environment variables management

**Instalación:**
```bash
# Node.js
npm install dotenv

# Python
pip install python-dotenv
```

**Best Practices:**
- ✅ Never commit .env to git
- ✅ Use .env.example template
- ✅ Encrypt production secrets
- ✅ Rotate regularly

**⚠️ IMPORTANT:** 
```bash
# Add to .gitignore
.env
.env.local
.env.*.local
```

---

### git-secrets ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Prevent committing secrets

**Instalación:**
```bash
brew install git-secrets
```

**Setup:**
```bash
# Initialize
cd myrepo
git secrets --install

# Add patterns
git secrets --register-aws
git secrets --add 'password\s*=\s*.+'

# Scan
git secrets --scan
```

---

### TruffleHog ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Find secrets in git history

**Instalación:**
```bash
# Docker
docker run -it trufflesecurity/trufflehog:latest

# Binary
brew install trufflehog
```

**Uso:**
```bash
# Scan git repo
trufflehog git https://github.com/user/repo

# Scan filesystem
trufflehog filesystem ./path

# Scan Docker image
trufflehog docker --image myimage:latest
```

## 🐳 Container Security

### Trivy ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Comprehensive vulnerability scanner

**Instalación:**
```bash
brew install trivy
```

**Uso:**
```bash
# Scan container image
trivy image nginx:latest

# Scan filesystem
trivy fs .

# Scan IaC
trivy config .

# Output formats
trivy image --format json nginx:latest
trivy image --severity HIGH,CRITICAL nginx:latest
```

**Casos de Uso:**
- Container image scanning
- IaC scanning
- Dependency scanning
- Misconfiguration detection

**Pros:**
- ✅ Fast scanning
- ✅ Comprehensive
- ✅ CI/CD friendly
- ✅ Multiple scanners

**Recursos:**
- [Trivy Docs](https://aquasecurity.github.io/trivy/)

---

### Docker Bench Security ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Docker security best practices checker

**Uso:**
```bash
docker run -it --net host --pid host --userns host --cap-add audit_control \
  -v /var/lib:/var/lib:ro \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -v /etc:/etc:ro \
  docker/docker-bench-security
```

**Casos de Uso:**
- Docker host security
- Container configuration
- CIS benchmark compliance

---

### Clair ⭐⭐
**Nivel:** Especializado  
**Descripción:** Container vulnerability scanner

**Casos de Uso:**
- Static container analysis
- Vulnerability database
- CI/CD integration

---

### Falco ⭐⭐
**Nivel:** Especializado  
**Descripción:** Runtime security monitoring

**Casos de Uso:**
- Runtime threat detection
- Kubernetes security
- Syscall monitoring

## 🏗️ Infrastructure Security

### Checkov ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** IaC security scanner

**Instalación:**
```bash
pip install checkov
```

**Uso:**
```bash
# Scan Terraform
checkov -d ./terraform

# Scan CloudFormation
checkov -f cloudformation.yaml

# Scan Kubernetes
checkov -d ./k8s

# Scan Dockerfile
checkov -f Dockerfile
```

**Casos de Uso:**
- Terraform scanning
- CloudFormation scanning
- Kubernetes scanning
- Docker scanning

**Pros:**
- ✅ Multi-platform IaC
- ✅ 1000+ policies
- ✅ Custom policies
- ✅ CI/CD integration

---

### tfsec ⭐⭐
**Nivel:** Recomendado (Terraform)  
**Descripción:** Static analysis for Terraform

**Instalación:**
```bash
brew install tfsec
```

**Uso:**
```bash
tfsec .
tfsec --format json .
tfsec --minimum-severity HIGH .
```

**Casos de Uso:**
- Terraform security
- Misconfigurations
- Best practices

---

### kube-bench ⭐⭐
**Nivel:** Recomendado (Kubernetes)  
**Descripción:** CIS Kubernetes Benchmark

**Uso:**
```bash
kubectl apply -f https://raw.githubusercontent.com/aquasecurity/kube-bench/main/job.yaml
```

**Casos de Uso:**
- Kubernetes security audit
- CIS compliance
- Configuration checks

## 📡 Security Monitoring

### Sentry ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Error tracking y monitoring

**Instalación:**
```bash
# Node.js
npm install @sentry/node

# Python
pip install sentry-sdk
```

**Casos de Uso:**
- Error tracking
- Performance monitoring
- Security events
- Release tracking

**Pros:**
- ✅ Real-time errors
- ✅ Stack traces
- ✅ Breadcrumbs
- ✅ Release tracking

---

### Wazuh ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Security monitoring platform

**Casos de Uso:**
- Intrusion detection
- Log analysis
- Compliance monitoring
- Vulnerability detection

---

### OSSEC ⭐
**Nivel:** Especializado  
**Descripción:** Host-based intrusion detection

**Casos de Uso:**
- File integrity monitoring
- Log analysis
- Rootkit detection

## 🎯 Penetration Testing

### Metasploit ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Penetration testing framework

**Instalación:**
```bash
# Kali Linux (pre-installed)
# macOS
brew install metasploit
```

**Casos de Uso:**
- Penetration testing
- Exploit development
- Vulnerability validation

**⚠️ WARNING:** Only use on systems you own or have permission to test

---

### Nikto ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Web server scanner

**Instalación:**
```bash
# Docker
docker run --rm sullo/nikto -h https://example.com
```

**Casos de Uso:**
- Web server testing
- Configuration issues
- Outdated software

---

### sqlmap ⭐⭐
**Nivel:** Especializado  
**Descripción:** SQL injection testing

**Instalación:**
```bash
# Python
pip install sqlmap

# Kali (pre-installed)
```

**⚠️ WARNING:** Only for authorized testing

## 🛡️ Security Best Practices

### OWASP Top 10 (2021)

1. **A01:2021 – Broken Access Control**
2. **A02:2021 – Cryptographic Failures**
3. **A03:2021 – Injection**
4. **A04:2021 – Insecure Design**
5. **A05:2021 – Security Misconfiguration**
6. **A06:2021 – Vulnerable Components**
7. **A07:2021 – Identification and Authentication Failures**
8. **A08:2021 – Software and Data Integrity Failures**
9. **A09:2021 – Security Logging and Monitoring Failures**
10. **A10:2021 – Server-Side Request Forgery**

### Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Implement authentication properly
- [ ] Validate all inputs
- [ ] Sanitize outputs
- [ ] Use parameterized queries
- [ ] Hash passwords (bcrypt, argon2)
- [ ] Implement rate limiting
- [ ] Use CSP headers
- [ ] Enable CORS properly
- [ ] Keep dependencies updated
- [ ] Scan for vulnerabilities
- [ ] Monitor security events
- [ ] Implement logging
- [ ] Regular security audits
- [ ] Penetration testing
- [ ] Security training

### DevSecOps Pipeline

```
Code → SAST → Dependency Scan → Build → Container Scan → 
Deploy → DAST → Runtime Protection → Monitoring
```

## 📚 Recursos Adicionales

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [Security Headers](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)

## 🔗 Links Útiles

- [Tools Collection Home](../README.md)
- [Backend Tools](../backend/README.md)
- [DevOps Tools](../devops/README.md)
- [QA Tools](../qa/README.md)

---

_Security Tools - Protegiendo tus aplicaciones y datos_ 🔒
