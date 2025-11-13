# 🎯 Initial Setup Guide

Complete guide for getting started with the project from scratch.

## Prerequisites

Before you begin, ensure you have:
- A GitHub account
- Basic command line knowledge
- Text editor or IDE installed
- Internet connection

## Step 1: Clone the Repository

### Using HTTPS
```bash
git clone https://github.com/<username>/<repository>.git
cd <repository>
```

### Using SSH
```bash
git clone git@github.com:<username>/<repository>.git
cd <repository>
```

### Verify Clone
```bash
# Check you're in the right directory
ls -la

# You should see:
# - .git/
# - README.md
# - package.json (or equivalent)
# - src/ or similar source directory
```

## Step 2: Understand Project Structure

```
project-root/
├── .github/          # GitHub workflows and configs
├── agents/           # AI agent configurations
├── docs/             # Documentation
├── prompts/          # AI prompts library
├── templates/        # Code templates
├── tools/            # Development tools
├── src/              # Source code (varies by project)
├── tests/            # Test files
├── .env.example      # Environment template
├── .gitignore        # Git ignore rules
├── README.md         # Project overview
├── INSTRUCTIONS.md   # This guide
└── package.json      # Dependencies (Node.js projects)
```

### Key Directories
- **`/docs`** - All documentation organized by topic
- **`/prompts`** - Reusable AI prompts by technology stack
- **`/templates`** - Boilerplate code and patterns
- **`/tools`** - Development utilities and scripts
- **`/agents`** - Specialized AI agent configurations

## Step 3: Configure Git

### Set Your Identity
```bash
# Set your name and email
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Verify
git config --list | grep user
```

### Configure Git Settings
```bash
# Set default branch name
git config --global init.defaultBranch main

# Enable colored output
git config --global color.ui auto

# Set default editor
git config --global core.editor "code --wait"  # VS Code
# or
git config --global core.editor "vim"          # Vim
```

### Set Up Git Hooks (Optional but Recommended)
```bash
# If using Husky (Node.js projects)
npm install

# Hooks will be automatically installed
```

## Step 4: Install System Prerequisites

### macOS

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install basic tools
brew install git
brew install curl
brew install wget
```

### Linux (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Install basic tools
sudo apt install -y git curl wget build-essential
```

### Windows

```powershell
# Install Chocolatey (if not installed)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Git
choco install git -y

# Install other tools
choco install curl wget -y
```

## Step 5: Install Runtime Environment

Choose based on your project type:

### Node.js Projects

```bash
# Install nvm (Node Version Manager)
# macOS/Linux:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Windows: Download from https://github.com/coreybutler/nvm-windows

# Install Node.js (check .nvmrc or README for version)
nvm install 18
nvm use 18
nvm alias default 18

# Verify
node --version
npm --version
```

### Python Projects

```bash
# Install pyenv
# macOS:
brew install pyenv

# Linux:
curl https://pyenv.run | bash

# Install Python (check .python-version or README)
pyenv install 3.11.0
pyenv global 3.11.0

# Verify
python --version
pip --version
```

### Multiple Runtimes

If your project uses multiple languages, install all required runtimes. Check the README.md or package files for requirements.

## Step 6: Install Dependencies

### Node.js

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

### Python

```bash
# Using pip
pip install -r requirements.txt

# Using poetry
poetry install

# Using pipenv
pipenv install
```

### Other Languages

```bash
# Ruby
bundle install

# Go
go mod download

# Rust
cargo build
```

## Step 7: Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit the file with your values
# See environment-config.md for detailed instructions
nano .env  # or use your preferred editor
```

**Important**: Never commit `.env` to version control!

## Step 8: Verify Installation

### Run Build

```bash
# Node.js
npm run build

# Python
python setup.py build

# Adjust based on your project
```

### Run Tests

```bash
# Node.js
npm test

# Python
pytest

# Adjust based on your project
```

### Start Development Server

```bash
# Node.js
npm run dev

# Python (Flask example)
python app.py

# Adjust based on your project
```

## Step 9: Verify Everything Works

### Checklist
- [ ] Repository cloned successfully
- [ ] Git configured with your identity
- [ ] Runtime environment installed
- [ ] Dependencies installed without errors
- [ ] `.env` file created and configured
- [ ] Project builds successfully
- [ ] Tests run and pass
- [ ] Development server starts
- [ ] Can access the application (if applicable)

### Test Commands

```bash
# Check Git status
git status

# Verify Node.js/npm (if applicable)
node --version
npm --version

# Verify Python (if applicable)
python --version
pip --version

# Run linter
npm run lint  # or equivalent

# Run formatter
npm run format  # or equivalent
```

## Troubleshooting

### Issue: "Command not found"

**Solution**: Ensure the tool is installed and in your PATH

```bash
# Check PATH
echo $PATH

# Reload shell configuration
source ~/.bashrc  # or ~/.zshrc
```

### Issue: "Permission denied"

**Solution**: Fix file permissions or use appropriate installation method

```bash
# Fix script permissions
chmod +x script-name.sh

# Install globally with proper permissions (Node.js)
npm install -g <package> --unsafe-perm
```

### Issue: "Version mismatch"

**Solution**: Use version managers to match required versions

```bash
# Check required version
cat .nvmrc  # Node.js
cat .python-version  # Python

# Install and use correct version
nvm install
nvm use
```

### Issue: "Dependencies fail to install"

**Solution**: Clear cache and retry

```bash
# Node.js
rm -rf node_modules
npm cache clean --force
npm install

# Python
pip cache purge
pip install -r requirements.txt
```

## Next Steps

Now that you have the basic setup complete:

1. **Configure Environment** - [Environment Configuration](./environment-config.md)
2. **Install Additional Tools** - [Tool Installation](./tool-installation.md)
3. **Set Up Your IDE** - [IDE & Editor Setup](./ide-setup.md)
4. **Read Coding Guidelines** - [Coding Guidelines](../coding-guidelines/README.md)
5. **Explore the Project** - Review README.md and existing code

## Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Hello World](https://guides.github.com/activities/hello-world/)
- [Command Line Basics](https://www.learnenough.com/command-line-tutorial)
- [Environment Variables Explained](https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html)

## Quick Reference

### Essential Commands

```bash
# Clone repository
git clone <url>

# Install dependencies
npm install  # or pip install, etc.

# Copy environment template
cp .env.example .env

# Run development server
npm run dev

# Run tests
npm test

# Check status
git status
```

### Common Paths

```bash
# Project root
cd /path/to/project

# Source code
cd src/

# Documentation
cd docs/

# Tests
cd tests/
```

---

**Estimated Time**: 20-30 minutes  
**Difficulty**: Beginner  
**Last Updated**: 2025-11-13

_Initial Setup - Your first steps to productivity_ 🎯
