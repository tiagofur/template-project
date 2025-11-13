# 🚀 Setup & Configuration

Complete guide for setting up your development environment and configuring the project.

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Detailed Guides](#detailed-guides)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

## Overview

This section covers everything you need to get started with development, from initial environment setup to advanced configuration.

### What You'll Learn
- Set up your development environment from scratch
- Configure environment variables and secrets
- Install and configure required tools
- Set up your IDE or editor for optimal productivity
- Verify your setup is working correctly

### Time Required
- **Minimal Setup**: 15-30 minutes
- **Full Setup**: 1-2 hours
- **Advanced Configuration**: 2-4 hours

## Quick Start

For experienced developers who want to get started immediately:

```bash
# 1. Clone and navigate
git clone <repository-url>
cd <project-name>

# 2. Copy environment template
cp .env.example .env
# Edit .env with your values

# 3. Install dependencies (example for Node.js)
npm install

# 4. Run the project
npm run dev

# 5. Run tests
npm test
```

For detailed instructions, continue with the guides below.

## Detailed Guides

### 1. [Initial Setup](./initial-setup.md)
**Start here if you're new to the project**

Learn how to:
- ✅ Clone the repository
- ✅ Understand the project structure
- ✅ Set up Git configuration
- ✅ Install system prerequisites
- ✅ Verify your installation

**Time**: 20-30 minutes  
**Difficulty**: Beginner

---

### 2. [Environment Configuration](./environment-config.md)
**Configure your environment variables and secrets**

Learn how to:
- ✅ Set up `.env` files
- ✅ Manage secrets securely
- ✅ Configure different environments (dev, staging, prod)
- ✅ Use environment-specific settings
- ✅ Troubleshoot configuration issues

**Time**: 15-20 minutes  
**Difficulty**: Beginner

---

### 3. [Tool Installation](./tool-installation.md)
**Install all required development tools**

Learn how to:
- ✅ Install runtime environments (Node.js, Python, etc.)
- ✅ Set up package managers
- ✅ Install development dependencies
- ✅ Configure version managers
- ✅ Install optional tools

**Time**: 30-60 minutes  
**Difficulty**: Intermediate

---

### 4. [IDE & Editor Setup](./ide-setup.md)
**Optimize your development environment**

Learn how to:
- ✅ Configure VS Code, IntelliJ, or other editors
- ✅ Install recommended extensions/plugins
- ✅ Set up linters and formatters
- ✅ Configure debugging
- ✅ Customize for productivity

**Time**: 30-45 minutes  
**Difficulty**: Intermediate

---

## Setup by Role

### Backend Developer
1. [Initial Setup](./initial-setup.md)
2. [Environment Configuration](./environment-config.md) - Focus on database and API keys
3. [Tool Installation](./tool-installation.md) - Install backend runtimes
4. [IDE Setup](./ide-setup.md) - Backend-specific extensions
5. Next: [Backend Stack Guide](../stack-guides/backend.md)

### Frontend Developer
1. [Initial Setup](./initial-setup.md)
2. [Environment Configuration](./environment-config.md) - Focus on API endpoints
3. [Tool Installation](./tool-installation.md) - Install Node.js and npm
4. [IDE Setup](./ide-setup.md) - Frontend-specific extensions
5. Next: [Frontend Stack Guide](../stack-guides/frontend.md)

### Mobile Developer
1. [Initial Setup](./initial-setup.md)
2. [Environment Configuration](./environment-config.md) - Focus on platform SDKs
3. [Tool Installation](./tool-installation.md) - Install Flutter/React Native
4. [IDE Setup](./ide-setup.md) - Mobile development tools
5. Next: [Mobile Stack Guide](../stack-guides/mobile.md)

### DevOps Engineer
1. [Initial Setup](./initial-setup.md)
2. [Environment Configuration](./environment-config.md) - All environments
3. [Tool Installation](./tool-installation.md) - Docker, Kubernetes, cloud CLIs
4. [IDE Setup](./ide-setup.md) - Infrastructure tools
5. Next: [DevOps Stack Guide](../stack-guides/devops.md)

### QA Engineer
1. [Initial Setup](./initial-setup.md)
2. [Environment Configuration](./environment-config.md) - Test environments
3. [Tool Installation](./tool-installation.md) - Testing frameworks
4. [IDE Setup](./ide-setup.md) - Testing tools
5. Next: [Testing Strategy](../qa-deploy/testing-strategy.md)

## Common Setup Scenarios

### Scenario 1: New Team Member
**Goal**: Get productive on day one

```bash
# Day 1 Morning
1. Complete Initial Setup
2. Configure Environment
3. Install Tools
4. Set up IDE

# Day 1 Afternoon
5. Build the project
6. Run tests
7. Review coding guidelines
8. Make first small change
```

### Scenario 2: New Machine/OS
**Goal**: Migrate your setup

```bash
1. Export settings from old machine
2. Follow Initial Setup on new machine
3. Restore settings
4. Verify all tools work
5. Test build and deployment
```

### Scenario 3: Contributing to Open Source
**Goal**: Make your first contribution

```bash
1. Fork and clone
2. Minimal environment setup
3. Install only required tools
4. Make focused change
5. Run affected tests
6. Submit PR
```

## Verification Checklist

After completing setup, verify everything works:

### Basic Verification
- [ ] Repository cloned successfully
- [ ] `.env` file configured
- [ ] Dependencies installed without errors
- [ ] Project builds successfully
- [ ] Tests run and pass
- [ ] Development server starts
- [ ] IDE recognizes project structure

### Advanced Verification
- [ ] Hot reload works
- [ ] Debugger attaches correctly
- [ ] Linters run automatically
- [ ] Code formatting works
- [ ] Git hooks execute
- [ ] Database connection works
- [ ] API calls succeed in dev mode

### Integration Verification
- [ ] Can create new branch
- [ ] Can commit changes
- [ ] Can push to remote
- [ ] CI/CD pipeline triggers
- [ ] Can create pull request
- [ ] Can run tests locally matching CI

## Troubleshooting

### Common Issues

#### "Dependencies failed to install"
```bash
# Clear cache and retry
rm -rf node_modules
npm cache clean --force
npm install
```

#### "Environment variables not working"
```bash
# Check .env file exists and is loaded
ls -la .env
# Restart your development server
# Some tools require restart to load new env vars
```

#### "Port already in use"
```bash
# Find and kill process using the port
lsof -ti:3000 | xargs kill -9
# Or change the port in your configuration
```

#### "Permission denied"
```bash
# Fix file permissions
chmod +x script-name.sh
# Or use sudo (carefully)
sudo npm install -g <package>
```

### Getting Help

1. **Check the specific guide** - Each setup guide has its own troubleshooting section
2. **Search existing issues** - Someone may have solved your problem
3. **Check tool documentation** - Verify you're using the right versions
4. **Ask the team** - Open a discussion or issue
5. **System-specific help** - OS-specific forums and communities

## Next Steps

After completing setup:

1. **Read Coding Guidelines** - [Coding Guidelines](../coding-guidelines/README.md)
2. **Explore Stack Guides** - [Stack-Specific Guides](../stack-guides/README.md)
3. **Learn AI Collaboration** - [AI Collaboration](../ai-collaboration/README.md)
4. **Review Workflow** - [Development Workflow](../workflow/README.md)
5. **Use Prompt Library** - [Prompts Library](../../prompts/README.md)

## Additional Resources

### Internal Documentation
- [Project Setup Guide](../../project-setup.md) - Original setup instructions
- [Tools Collection](../../tools/README.md) - Development tools and utilities
- [Contributing Guide](../../CONTRIBUTING.md) - How to contribute

### External Resources
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Node.js Documentation](https://nodejs.org/docs/)

## Maintenance

This documentation is reviewed and updated:
- **Quarterly** - Major review for accuracy
- **When tools change** - Version updates
- **When process changes** - Workflow modifications
- **On feedback** - User-reported issues

**Last Updated**: 2025-11-13  
**Maintainers**: Development Team

---

_Setup - Get started in minutes, not hours_ 🚀
