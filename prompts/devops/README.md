# 🚀 DevOps Prompts

Prompts especializados para infraestructura, CI/CD, deployment y operaciones.

## 📋 Categorías

### Docker & Containers
- [Dockerfile](./dockerfile.md) - Crear Dockerfiles optimizados
- [Docker Compose](./docker-compose.md) - Orchestración con Compose
- [Multi-stage Build](./multi-stage-build.md) - Builds multi-etapa
- [Container Optimization](./container-optimization.md) - Optimizar contenedores

### CI/CD Pipelines
- [GitHub Actions](./github-actions.md) - Workflows de GitHub Actions
- [GitLab CI](./gitlab-ci.md) - Pipelines GitLab CI
- [Jenkins Pipeline](./jenkins-pipeline.md) - Pipelines Jenkins
- [Deployment Pipeline](./deployment-pipeline.md) - Pipeline completo

### Cloud Deployment
- [AWS Deployment](./aws-deployment.md) - Deploy en AWS
- [Azure Deployment](./azure-deployment.md) - Deploy en Azure
- [GCP Deployment](./gcp-deployment.md) - Deploy en GCP
- [Kubernetes](./kubernetes.md) - Configuración Kubernetes

### Monitoring & Logging
- [Prometheus Setup](./prometheus-setup.md) - Configurar Prometheus
- [Grafana Dashboard](./grafana-dashboard.md) - Dashboards Grafana
- [Logging Strategy](./logging-strategy.md) - Estrategia de logs
- [Alert Rules](./alert-rules.md) - Reglas de alertas

### Infrastructure as Code
- [Terraform](./terraform.md) - Infraestructura con Terraform
- [Ansible](./ansible.md) - Configuración con Ansible
- [CloudFormation](./cloudformation.md) - AWS CloudFormation

## 🎯 Guía de Uso

### Stack Soportado

- **Containers:** Docker, Kubernetes, Docker Compose
- **CI/CD:** GitHub Actions, GitLab CI, Jenkins, CircleCI
- **Cloud:** AWS, Azure, GCP, DigitalOcean
- **IaC:** Terraform, Ansible, CloudFormation, Pulumi
- **Monitoring:** Prometheus, Grafana, ELK Stack, Datadog

### Variables Comunes

- `{{app_name}}`: Nombre de la aplicación
- `{{environment}}`: dev, staging, production
- `{{cloud_provider}}`: AWS, Azure, GCP
- `{{runtime}}`: Node.js, Python, Go, etc.

## 💡 Tips Generales

### Docker

- Multi-stage builds para tamaño pequeño
- .dockerignore para excluir archivos
- No usar root user en contenedores
- Health checks para containers
- Versionar imágenes apropiadamente

### CI/CD

- Tests en cada stage del pipeline
- Parallel jobs para velocidad
- Secrets management apropiado
- Artifact versioning
- Rollback strategy clara

### Deployment

- Blue-green deployments
- Canary releases para cambios grandes
- Automatic rollback en failures
- Zero-downtime deployments
- Health checks post-deployment

## 📚 Recursos Adicionales

- [Docker Guide](../../docs/docker/README.md)
- [CI/CD Best Practices](../../docs/cicd/README.md)
- [Monitoring & Secrets](../../docs/monitoring-secrets/README.md)

---

_DevOps Prompts - Automatizando infraestructura y deployments_ 🚀
