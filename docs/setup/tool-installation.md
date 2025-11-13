# 🔧 Tool Installation

Guide for installing all required development tools and dependencies.

## Overview

This guide covers installation of:
- Runtime environments (Node.js, Python, etc.)
- Package managers
- Development tools
- Version managers
- Optional productivity tools

## Quick Reference

| Tool | Purpose | Required For |
|------|---------|--------------|
| Node.js | JavaScript runtime | Frontend, some backend |
| Python | Python runtime | Backend, scripts |
| Docker | Containerization | All roles |
| Git | Version control | All roles |
| IDE/Editor | Code editing | All roles |

## Runtime Environments

### Node.js (JavaScript/TypeScript)

**Using nvm (Recommended)**

```bash
# macOS/Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.bashrc  # or ~/.zshrc

# Install Node.js
nvm install 18
nvm use 18
nvm alias default 18

# Verify
node --version
npm --version
```

**Windows**
```powershell
# Download from: https://github.com/coreybutler/nvm-windows
# Or use installer: https://nodejs.org/
```

### Python

**Using pyenv (Recommended)**

```bash
# macOS
brew install pyenv

# Linux
curl https://pyenv.run | bash

# Install Python
pyenv install 3.11.0
pyenv global 3.11.0

# Verify
python --version
pip --version
```

## Package Managers

### npm (Node.js - comes with Node)
```bash
npm --version

# Update npm
npm install -g npm@latest
```

### yarn (Alternative to npm)
```bash
npm install -g yarn
yarn --version
```

### pnpm (Fast npm alternative)
```bash
npm install -g pnpm
pnpm --version
```

### pip (Python - comes with Python)
```bash
pip --version

# Upgrade pip
pip install --upgrade pip
```

## Development Tools

### Git
```bash
# macOS
brew install git

# Linux (Ubuntu/Debian)
sudo apt install git

# Windows
choco install git

# Verify
git --version
```

### Docker
```bash
# macOS/Windows: Download Docker Desktop
# https://www.docker.com/products/docker-desktop

# Linux
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Verify
docker --version
docker-compose --version
```

### Build Tools

**macOS**
```bash
xcode-select --install
```

**Linux**
```bash
sudo apt install build-essential
```

**Windows**
```powershell
choco install visualstudio2019buildtools
```

## Development Dependencies

### Node.js Project
```bash
cd project-directory
npm install

# Or for clean install
npm ci
```

### Python Project
```bash
# Using pip
pip install -r requirements.txt

# Using poetry
pip install poetry
poetry install

# Using pipenv
pip install pipenv
pipenv install
```

## Optional but Recommended

### GitHub CLI
```bash
# macOS
brew install gh

# Linux
# See: https://github.com/cli/cli/blob/trunk/docs/install_linux.md

# Windows
choco install gh

# Authenticate
gh auth login
```

### Useful Global Packages

**Node.js**
```bash
# TypeScript
npm install -g typescript

# Linting/Formatting
npm install -g eslint prettier

# Testing
npm install -g jest

# Utilities
npm install -g nodemon http-server
```

**Python**
```bash
# Linting/Formatting
pip install black flake8 pylint

# Testing
pip install pytest pytest-cov

# Utilities
pip install ipython requests
```

## Version Managers

### asdf (Universal version manager)
```bash
# Install asdf
git clone https://github.com/asdf-vm/asdf.git ~/.asdf

# Add plugins
asdf plugin add nodejs
asdf plugin add python

# Install versions
asdf install nodejs 18.0.0
asdf install python 3.11.0

# Set global versions
asdf global nodejs 18.0.0
asdf global python 3.11.0
```

## Tool Verification

Run these commands to verify installations:

```bash
# Runtime environments
node --version
npm --version
python --version
pip --version

# Development tools
git --version
docker --version

# Package managers
npm --version
pip --version

# Optional tools
gh --version
typescript --version (if installed globally)
```

## Platform-Specific Notes

### macOS
- Use Homebrew for most installations
- Xcode Command Line Tools required for compilation
- May need to grant security permissions for some tools

### Linux
- Use apt/yum/pacman based on distribution
- May need sudo for global installations
- Build tools essential for native dependencies

### Windows
- Use Chocolatey or official installers
- WSL2 recommended for better compatibility
- PowerShell vs CMD considerations

## Troubleshooting

### "Command not found"
```bash
# Add to PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Permission errors
```bash
# Use npm without sudo (Node.js)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Version conflicts
```bash
# Use version manager to switch
nvm use 16  # Node.js
pyenv local 3.9.0  # Python
```

## Installation Checklist

- [ ] Runtime environment installed (Node.js/Python/etc.)
- [ ] Package manager working (npm/pip/etc.)
- [ ] Git installed and configured
- [ ] Docker installed (if needed)
- [ ] Project dependencies installed
- [ ] Optional tools installed as needed
- [ ] All tools verified with `--version`
- [ ] PATH configured correctly

## Next Steps

- [IDE Setup](./ide-setup.md) - Configure your editor
- [Coding Guidelines](../coding-guidelines/README.md) - Learn coding standards
- [Stack Guides](../stack-guides/README.md) - Technology-specific guides

---

**Estimated Time**: 30-60 minutes  
**Difficulty**: Intermediate  
**Last Updated**: 2025-11-13
