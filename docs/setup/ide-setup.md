# 💻 IDE & Editor Setup

Optimize your development environment for maximum productivity.

## Popular IDEs and Editors

- **VS Code** - Recommended for most developers
- **IntelliJ IDEA / WebStorm** - Great for Java/JavaScript
- **PyCharm** - Excellent for Python
- **Android Studio** - For Android/Flutter
- **Xcode** - For iOS development
- **Vim/Neovim** - For terminal enthusiasts

## VS Code Setup (Recommended)

### Installation
```bash
# macOS
brew install --cask visual-studio-code

# Linux
sudo snap install code --classic

# Windows
choco install vscode
```

### Essential Extensions

**General Development**
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension eamodio.gitlens
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension streetsidesoftware.code-spell-checker
```

**Frontend Development**
```bash
code --install-extension bradlc.vscode-tailwindcss
code --install-extension formulahendry.auto-rename-tag
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension styled-components.vscode-styled-components
```

**Backend Development**
```bash
code --install-extension ms-python.python
code --install-extension ms-python.vscode-pylance
code --install-extension golang.go
code --install-extension ms-vscode.cpptools
```

**DevOps & Containers**
```bash
code --install-extension ms-azuretools.vscode-docker
code --install-extension ms-kubernetes-tools.vscode-kubernetes-tools
code --install-extension hashicorp.terraform
```

**Testing & Quality**
```bash
code --install-extension orta.vscode-jest
code --install-extension hbenl.vscode-test-explorer
code --install-extension SonarSource.sonarlint-vscode
```

**AI & Productivity**
```bash
code --install-extension github.copilot
code --install-extension github.copilot-chat
code --install-extension tabnine.tabnine-vscode
```

### Workspace Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "files.autoSave": "onFocusChange",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "javascript.updateImportsOnFileMove.enabled": "always",
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter",
    "editor.formatOnSave": true
  },
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "git.autofetch": true,
  "git.confirmSync": false
}
```

### Recommended Extensions File

Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "eamodio.gitlens",
    "github.copilot",
    "ms-azuretools.vscode-docker",
    "ms-python.python"
  ]
}
```

### Keybindings (Optional)

Create `.vscode/keybindings.json` for custom shortcuts:

```json
[
  {
    "key": "ctrl+shift+f",
    "command": "editor.action.formatDocument"
  },
  {
    "key": "ctrl+shift+o",
    "command": "editor.action.organizeImports"
  }
]
```

## Language-Specific Setup

### JavaScript/TypeScript

**ESLint Configuration** (`.eslintrc.json`):
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "root": true
}
```

**Prettier Configuration** (`.prettierrc`):
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### Python

**Install formatter and linter**:
```bash
pip install black flake8 pylint
```

**Configure in VS Code** (`settings.json`):
```json
{
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter",
    "editor.formatOnSave": true
  },
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "python.linting.flake8Enabled": true
}
```

## Debugging Setup

### VS Code Launch Configuration

Create `.vscode/launch.json`:

**Node.js**:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Program",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/src/index.js"
    },
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to Process",
      "port": 9229
    }
  ]
}
```

**Python**:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: Current File",
      "type": "python",
      "request": "launch",
      "program": "${file}",
      "console": "integratedTerminal"
    }
  ]
}
```

## EditorConfig

Create `.editorconfig` for consistent formatting:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false

[*.py]
indent_size = 4

[Makefile]
indent_style = tab
```

## Git Integration

### VS Code Git Configuration

```json
{
  "git.autofetch": true,
  "git.confirmSync": false,
  "git.enableSmartCommit": true,
  "gitlens.hovers.enabled": true,
  "gitlens.currentLine.enabled": true
}
```

### Git Hooks with Husky

```bash
# Install Husky
npm install --save-dev husky lint-staged

# Initialize
npx husky-init
```

**Configure** (package.json):
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

## IntelliJ IDEA / WebStorm Setup

### Essential Plugins
- ESLint
- Prettier
- GitLens
- Docker
- Database Tools

### Settings
- Enable ESLint: Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
- Enable Prettier: Settings → Languages & Frameworks → JavaScript → Prettier
- Format on save: Settings → Tools → Actions on Save → Reformat code

## PyCharm Setup

### Essential Plugins
- Black Formatter
- mypy
- Docker
- Database Tools

### Settings
- External tool: Black formatter
- Enable pylint and flake8
- Configure virtual environment
- Enable auto-import optimization

## Terminal Setup

### Integrated Terminal in VS Code

```json
{
  "terminal.integrated.defaultProfile.osx": "zsh",
  "terminal.integrated.defaultProfile.linux": "bash",
  "terminal.integrated.defaultProfile.windows": "PowerShell",
  "terminal.integrated.fontSize": 14,
  "terminal.integrated.fontFamily": "Fira Code, Monaco, monospace"
}
```

### Oh My Zsh (Optional)
```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

## Productivity Tips

### VS Code Shortcuts

| Action | macOS | Windows/Linux |
|--------|-------|---------------|
| Command Palette | Cmd+Shift+P | Ctrl+Shift+P |
| Quick Open | Cmd+P | Ctrl+P |
| Toggle Terminal | Ctrl+` | Ctrl+` |
| Format Document | Shift+Alt+F | Shift+Alt+F |
| Go to Definition | F12 | F12 |
| Find References | Shift+F12 | Shift+F12 |
| Multi-cursor | Cmd+D | Ctrl+D |

### Recommended Fonts
- **Fira Code** - With ligatures
- **JetBrains Mono** - Optimized for coding
- **Cascadia Code** - Microsoft's coding font

```json
{
  "editor.fontFamily": "Fira Code, Monaco, 'Courier New', monospace",
  "editor.fontLigatures": true,
  "editor.fontSize": 14
}
```

## Verification Checklist

- [ ] IDE/Editor installed
- [ ] Essential extensions installed
- [ ] Workspace settings configured
- [ ] Linters and formatters working
- [ ] Format on save enabled
- [ ] Git integration working
- [ ] Debugging configuration set up
- [ ] Terminal configured
- [ ] Keyboard shortcuts customized (optional)

## Troubleshooting

### Extensions not working
```bash
# Reload VS Code
Cmd+Shift+P → "Reload Window"

# Check extension is enabled
# Extensions panel → Search extension → Enable
```

### Formatter not running
```bash
# Check default formatter
# Settings → Search "default formatter"
# Set to esbenp.prettier-vscode

# Check format on save
# Settings → Search "format on save"
# Enable checkbox
```

### ESLint errors not showing
```bash
# Check ESLint is installed
npm list eslint

# Restart ESLint server
Cmd+Shift+P → "ESLint: Restart ESLint Server"
```

## Next Steps

- [Coding Guidelines](../coding-guidelines/README.md) - Learn coding standards
- [AI Collaboration](../ai-collaboration/README.md) - Work with AI agents
- [Stack Guides](../stack-guides/README.md) - Technology-specific guides

---

**Estimated Time**: 30-45 minutes  
**Difficulty**: Intermediate  
**Last Updated**: 2025-11-13
