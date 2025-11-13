# 🚀 DevOps Tools

Herramientas especializadas para infraestructura, CI/CD, containers, orquestación y despliegues.

## 📋 Tabla de Contenidos

- [Containerización](#containerización)
- [Orquestación](#orquestación)
- [CI/CD](#cicd)
- [Infrastructure as Code](#infrastructure-as-code)
- [Monitoring y Logging](#monitoring-y-logging)
- [Cloud Platforms](#cloud-platforms)
- [Configuration Management](#configuration-management)
- [Security y Compliance](#security-y-compliance)

## 🐳 Containerización

### Docker ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Plataforma de containerización líder

**Instalación:**
```bash
# macOS
brew install --cask docker

# Linux
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Verificar
docker --version
```

**Casos de Uso:**
- Desarrollo local
- Microservicios
- CI/CD pipelines
- Deployment consistency

**Pros:**
- ✅ Portabilidad completa
- ✅ Ecosistema maduro
- ✅ Docker Hub
- ✅ Multi-platform

**Contras:**
- ❌ Overhead en Windows/macOS
- ❌ Learning curve para principiantes

**Comandos Esenciales:**
```bash
docker build -t myapp:1.0 .
docker run -p 3000:3000 myapp:1.0
docker-compose up -d
docker ps
docker logs container_name
```

**Recursos:**
- [Docker Docs](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

### Docker Compose ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Herramienta para multi-container apps

**Instalación:**
```bash
# Incluido con Docker Desktop
# Linux
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

**Casos de Uso:**
- Local development stacks
- Multi-container apps
- Testing environments

**Ejemplo docker-compose.yml:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: password
  redis:
    image: redis:7-alpine
```

---

### Podman ⭐⭐
**Nivel:** Especializado  
**Descripción:** Alternativa daemonless a Docker

**Instalación:**
```bash
# macOS
brew install podman

# Linux
sudo apt-get install podman
```

**Casos de Uso:**
- Rootless containers
- Security-focused deployments
- Kubernetes YAML compatible

**Pros:**
- ✅ No daemon
- ✅ Rootless
- ✅ Docker compatible
- ✅ Systemd integration

## ☸️ Orquestación

### Kubernetes ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Plataforma de orquestación de containers

**Instalación:**
```bash
# kubectl
brew install kubectl

# Minikube (local)
brew install minikube
minikube start

# k3d (local)
brew install k3d
```

**Casos de Uso:**
- Container orchestration
- Microservices
- Auto-scaling
- Service discovery
- Load balancing

**Pros:**
- ✅ Estándar de industria
- ✅ Auto-scaling
- ✅ Self-healing
- ✅ Declarative config

**Contras:**
- ❌ Complejidad alta
- ❌ Curva de aprendizaje
- ❌ Resource overhead

**Comandos Esenciales:**
```bash
kubectl get pods
kubectl apply -f deployment.yaml
kubectl logs pod-name
kubectl describe pod pod-name
kubectl port-forward pod-name 8080:80
```

**Recursos:**
- [Kubernetes Docs](https://kubernetes.io/docs/)
- [Kubernetes Patterns](https://k8spatterns.io/)

---

### Helm ⭐⭐⭐
**Nivel:** Esencial (Kubernetes)  
**Descripción:** Package manager para Kubernetes

**Instalación:**
```bash
brew install helm
```

**Casos de Uso:**
- Kubernetes package management
- Template deployments
- Release management

**Comandos Esenciales:**
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install my-release bitnami/postgresql
helm upgrade my-release bitnami/postgresql
helm rollback my-release
```

---

### Docker Swarm ⭐
**Nivel:** Especializado  
**Descripción:** Orquestación nativa de Docker

**Casos de Uso:**
- Simpler than Kubernetes
- Docker-native orchestration
- Small deployments

**Pros:**
- ✅ Más simple que K8s
- ✅ Docker nativo
- ✅ Easy setup

**Contras:**
- ❌ Menos features
- ❌ Menor adopción

## 🔄 CI/CD

### GitHub Actions ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** CI/CD integrado en GitHub

**Ejemplo Workflow:**
```yaml
name: CI/CD
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build
```

**Casos de Uso:**
- Automated testing
- Build automation
- Deployment pipelines
- Release automation

**Pros:**
- ✅ GitHub integration
- ✅ Marketplace rico
- ✅ Free tier generoso
- ✅ Matrix builds

**Recursos:**
- [Actions Docs](https://docs.github.com/en/actions)
- [Marketplace](https://github.com/marketplace?type=actions)

---

### GitLab CI/CD ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** CI/CD integrado en GitLab

**Ejemplo .gitlab-ci.yml:**
```yaml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - npm ci
    - npm run build

test:
  stage: test
  script:
    - npm test

deploy:
  stage: deploy
  script:
    - ./deploy.sh
  only:
    - main
```

**Pros:**
- ✅ All-in-one DevOps
- ✅ Auto DevOps
- ✅ Built-in registry
- ✅ Review apps

---

### Jenkins ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Automation server open-source

**Instalación:**
```bash
# Docker
docker run -p 8080:8080 jenkins/jenkins:lts

# macOS
brew install jenkins-lts
```

**Casos de Uso:**
- Complex pipelines
- Self-hosted CI/CD
- Legacy systems

**Pros:**
- ✅ Extremadamente flexible
- ✅ Plugins infinitos
- ✅ Self-hosted

**Contras:**
- ❌ UI anticuada
- ❌ Mantenimiento intenso
- ❌ Plugin management complejo

---

### CircleCI ⭐⭐
**Nivel:** Recomendado  
**Descripción:** CI/CD platform cloud

**Ejemplo .circleci/config.yml:**
```yaml
version: 2.1
jobs:
  build:
    docker:
      - image: cimg/node:18.0
    steps:
      - checkout
      - run: npm ci
      - run: npm test
workflows:
  build-test:
    jobs:
      - build
```

**Pros:**
- ✅ Fast builds
- ✅ Docker support
- ✅ SSH debugging
- ✅ Orbs (reusable config)

---

### ArgoCD ⭐⭐
**Nivel:** Recomendado (Kubernetes)  
**Descripción:** GitOps continuous delivery para K8s

**Instalación:**
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

**Casos de Uso:**
- GitOps workflows
- Kubernetes deployments
- Multi-cluster management

**Pros:**
- ✅ GitOps native
- ✅ Visual UI
- ✅ Multi-cluster
- ✅ Declarative

## 🏗️ Infrastructure as Code

### Terraform ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Infrastructure as Code tool

**Instalación:**
```bash
brew install terraform
```

**Ejemplo main.tf:**
```hcl
provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  
  tags = {
    Name = "WebServer"
  }
}
```

**Casos de Uso:**
- Multi-cloud infrastructure
- Infrastructure provisioning
- State management

**Pros:**
- ✅ Multi-cloud
- ✅ Declarative
- ✅ State management
- ✅ Provider ecosystem

**Comandos:**
```bash
terraform init
terraform plan
terraform apply
terraform destroy
```

**Recursos:**
- [Terraform Docs](https://www.terraform.io/docs)
- [Terraform Registry](https://registry.terraform.io/)

---

### Pulumi ⭐⭐
**Nivel:** Recomendado  
**Descripción:** IaC con lenguajes de programación

**Instalación:**
```bash
brew install pulumi
```

**Casos de Uso:**
- IaC con TypeScript/Python/Go
- Complex logic in IaC
- Testing infrastructure code

**Pros:**
- ✅ Real programming languages
- ✅ Type safety
- ✅ Testing capabilities
- ✅ Multi-cloud

---

### AWS CloudFormation ⭐⭐
**Nivel:** Especializado (AWS)  
**Descripción:** IaC nativo de AWS

**Casos de Uso:**
- AWS-only infrastructure
- Native AWS integration
- Stack management

**Pros:**
- ✅ AWS native
- ✅ No cost
- ✅ Deep AWS integration

**Contras:**
- ❌ AWS only
- ❌ YAML/JSON verbose
- ❌ Limited logic

---

### Ansible ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Configuration management y automation

**Instalación:**
```bash
pip install ansible
```

**Casos de Uso:**
- Configuration management
- Application deployment
- Server provisioning

**Pros:**
- ✅ Agentless
- ✅ YAML playbooks
- ✅ Large module library
- ✅ Idempotent

## 📊 Monitoring y Logging

### Prometheus ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Monitoring y alerting toolkit

**Instalación:**
```bash
# Docker
docker run -p 9090:9090 prom/prometheus

# Kubernetes
helm install prometheus prometheus-community/prometheus
```

**Casos de Uso:**
- Metrics collection
- Time-series database
- Alerting
- Kubernetes monitoring

**Pros:**
- ✅ Pull-based model
- ✅ PromQL query language
- ✅ Service discovery
- ✅ Kubernetes native

**Recursos:**
- [Prometheus Docs](https://prometheus.io/docs/)
- [PromQL Guide](https://prometheus.io/docs/prometheus/latest/querying/basics/)

---

### Grafana ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Analytics y monitoring platform

**Instalación:**
```bash
# Docker
docker run -d -p 3000:3000 grafana/grafana

# Kubernetes
helm install grafana grafana/grafana
```

**Casos de Uso:**
- Metrics visualization
- Dashboards
- Alerting
- Multi-source data

**Pros:**
- ✅ Beautiful dashboards
- ✅ Multi-datasource
- ✅ Alerting
- ✅ Plugin ecosystem

---

### ELK Stack ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Elasticsearch, Logstash, Kibana

**Componentes:**
- **Elasticsearch**: Search y analytics
- **Logstash**: Log processing pipeline
- **Kibana**: Visualization

**Instalación:**
```bash
# Docker Compose
version: '3'
services:
  elasticsearch:
    image: elasticsearch:8.5.0
  logstash:
    image: logstash:8.5.0
  kibana:
    image: kibana:8.5.0
```

**Casos de Uso:**
- Centralized logging
- Log analysis
- Search
- Visualization

**Alternativa:** Loki + Promtail (más ligero)

---

### Datadog ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Monitoring y analytics platform

**Instalación:**
```bash
DD_API_KEY=<key> DD_SITE="datadoghq.com" bash -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_script.sh)"
```

**Casos de Uso:**
- APM
- Infrastructure monitoring
- Log management
- Real User Monitoring

**Pros:**
- ✅ All-in-one
- ✅ Beautiful UI
- ✅ Integraciones amplias
- ✅ AI-powered insights

**Contras:**
- ❌ Costoso
- ❌ Vendor lock-in

---

### New Relic ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Observability platform

**Casos de Uso:**
- APM
- Infrastructure monitoring
- Browser monitoring
- Mobile monitoring

## ☁️ Cloud Platforms

### AWS (Amazon Web Services) ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Plataforma cloud líder

**CLI Installation:**
```bash
brew install awscli
aws configure
```

**Servicios Clave:**
- **EC2**: Virtual servers
- **S3**: Object storage
- **RDS**: Managed databases
- **Lambda**: Serverless functions
- **ECS/EKS**: Container orchestration
- **CloudFront**: CDN

**Pros:**
- ✅ Más features
- ✅ Global infrastructure
- ✅ Mature ecosystem

---

### Google Cloud Platform (GCP) ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Cloud platform de Google

**CLI Installation:**
```bash
brew install --cask google-cloud-sdk
gcloud init
```

**Servicios Clave:**
- **Compute Engine**: VMs
- **Cloud Storage**: Object storage
- **Cloud SQL**: Managed databases
- **Cloud Functions**: Serverless
- **GKE**: Kubernetes managed
- **BigQuery**: Data warehouse

---

### Azure ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Cloud platform de Microsoft

**CLI Installation:**
```bash
brew install azure-cli
az login
```

**Servicios Clave:**
- **Virtual Machines**
- **Blob Storage**
- **Azure SQL Database**
- **Azure Functions**
- **AKS**: Kubernetes

---

### Vercel ⭐⭐
**Nivel:** Recomendado (Frontend)  
**Descripción:** Platform para frontend frameworks

**Instalación:**
```bash
npm install -g vercel
vercel login
```

**Casos de Uso:**
- Next.js deployment
- Frontend hosting
- Serverless functions
- Preview deployments

**Pros:**
- ✅ Zero-config
- ✅ Global CDN
- ✅ Preview URLs
- ✅ Edge functions

---

### Netlify ⭐⭐
**Nivel:** Recomendado (Frontend)  
**Descripción:** Platform para JAMstack

**Casos de Uso:**
- Static sites
- Serverless functions
- Forms handling
- A/B testing

## 🔐 Security y Compliance

### Vault ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Secrets management

**Instalación:**
```bash
brew install vault
vault server -dev
```

**Casos de Uso:**
- Secrets storage
- Encryption as a service
- Dynamic secrets

---

### Trivy ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Vulnerability scanner

**Instalación:**
```bash
brew install trivy
```

**Casos de Uso:**
- Container scanning
- IaC scanning
- Dependency scanning

**Uso:**
```bash
trivy image nginx:latest
trivy fs .
```

---

### SonarQube ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Code quality y security

**Instalación:**
```bash
docker run -d -p 9000:9000 sonarqube
```

**Casos de Uso:**
- Code quality
- Security vulnerabilities
- Code smells
- Technical debt

## 📚 Recursos Adicionales

- [DevOps Roadmap](https://roadmap.sh/devops)
- [12 Factor App](https://12factor.net/)
- [Cloud Native Computing Foundation](https://www.cncf.io/)
- [Kubernetes Patterns](https://k8spatterns.io/)

## 🔗 Links Útiles

- [Tools Collection Home](../README.md)
- [Backend Tools](../backend/README.md)
- [Frontend Tools](../frontend/README.md)
- [Security Tools](../security/README.md)

---

_DevOps Tools - Automatizando y escalando tu infraestructura_ 🚀
