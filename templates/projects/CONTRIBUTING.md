# 🤝 Contributing to Project Templates

Thank you for considering contributing to our project templates! This guide will help you understand how to contribute effectively.

## 📋 Table of Contents

- [How to Contribute](#how-to-contribute)
- [Template Guidelines](#template-guidelines)
- [Documentation Standards](#documentation-standards)
- [Testing Requirements](#testing-requirements)
- [Submission Process](#submission-process)

## 🚀 How to Contribute

### Types of Contributions

We welcome the following types of contributions:

1. **New Templates**: Add templates for new technology stacks
2. **Template Improvements**: Enhance existing templates
3. **Bug Fixes**: Fix issues in templates
4. **Documentation**: Improve documentation
5. **Examples**: Add code examples and use cases

### Before You Start

1. Check existing [Issues](https://github.com/tiagofur/template-project/issues)
2. Check [Pull Requests](https://github.com/tiagofur/template-project/pulls)
3. Open a new issue to discuss major changes

## 📐 Template Guidelines

### Template Structure

Every template should follow this structure:

```
templates/projects/[template-name]/
├── README.md                    # Main documentation
├── .env.example                # Environment variables
├── .gitignore                  # Git ignore rules
├── docker-compose.yml          # Docker configuration (if applicable)
├── package.json                # Dependencies (if applicable)
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD workflow
├── docs/                       # Detailed documentation
│   ├── architecture/
│   ├── deployment/
│   └── troubleshooting.md
├── config/                     # Configuration files
└── [source-directories]/       # Source code structure
```

### README Requirements

Every template README must include:

1. **Overview**: Clear description of what the template does
2. **Features**: List of key features
3. **Tech Stack**: Technologies used
4. **Quick Start**: Step-by-step setup instructions
5. **Configuration**: Environment variables and settings
6. **Usage Examples**: Code examples
7. **Best Practices**: Recommended patterns
8. **Deployment**: How to deploy
9. **Troubleshooting**: Common issues and solutions

### Template Checklist

Before submitting a new template, ensure:

- [ ] README.md is complete and follows the standard format
- [ ] .env.example includes all required variables with descriptions
- [ ] .gitignore excludes build artifacts and sensitive files
- [ ] Docker configuration works (if applicable)
- [ ] CI/CD workflow is configured
- [ ] Documentation is comprehensive
- [ ] Code examples are tested and working
- [ ] Best practices are documented
- [ ] Template follows security best practices

## 📚 Documentation Standards

### Writing Style

- Use clear, concise language
- Write for developers of all experience levels
- Include code examples
- Provide context for decisions
- Use proper Markdown formatting

### Code Examples

```markdown
# Good Example
\`\`\`typescript
// Get user by ID
export const getUser = async (id: string): Promise<User> => {
  const user = await db.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};
\`\`\`

# Bad Example
\`\`\`typescript
// Code without context or explanation
const getUser = (id) => db.user.findUnique({ where: { id } });
\`\`\`
```

### Documentation Sections

1. **Overview**: What and why
2. **Prerequisites**: What's needed before starting
3. **Installation**: Step-by-step setup
4. **Configuration**: How to configure
5. **Usage**: How to use
6. **Examples**: Real-world examples
7. **Best Practices**: Recommendations
8. **Troubleshooting**: Common issues

## 🧪 Testing Requirements

### Manual Testing

Before submitting:

1. **Fresh Installation**: Test from scratch
   ```bash
   cp -r templates/projects/[template] test-project/
   cd test-project
   # Follow README instructions
   ```

2. **Environment Setup**: Verify all environment variables work

3. **Docker**: Test Docker configuration
   ```bash
   docker-compose up -d
   # Verify all services start correctly
   ```

4. **CI/CD**: Test workflow locally if possible

### What to Test

- [ ] Installation from scratch works
- [ ] All commands in README work
- [ ] Docker services start correctly
- [ ] Environment variables are documented
- [ ] Code examples run successfully
- [ ] Links in documentation work
- [ ] No sensitive data is included

## 📝 Submission Process

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
git clone https://github.com/YOUR-USERNAME/template-project.git
cd template-project
```

### 2. Create a Branch

```bash
# Create descriptive branch name
git checkout -b add-[template-name]-template
# or
git checkout -b fix-[template-name]-issue
# or
git checkout -b improve-[template-name]-docs
```

### 3. Make Changes

- Follow the template guidelines
- Write comprehensive documentation
- Test thoroughly
- Keep commits focused and descriptive

### 4. Commit Changes

Use conventional commit messages:

```bash
# New template
git commit -m "feat: add [stack-name] project template"

# Template improvement
git commit -m "feat: add Docker support to full-stack template"

# Bug fix
git commit -m "fix: correct database URL in serverless template"

# Documentation
git commit -m "docs: improve Flutter backend setup guide"
```

### 5. Push and Create PR

```bash
git push origin your-branch-name
```

Then create a Pull Request on GitHub with:

- **Title**: Clear, descriptive title
- **Description**: What changes were made and why
- **Testing**: How you tested the changes
- **Screenshots**: If applicable
- **Checklist**: Complete the PR template checklist

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New template
- [ ] Template improvement
- [ ] Bug fix
- [ ] Documentation update

## Checklist
- [ ] README is complete
- [ ] .env.example is documented
- [ ] Code is tested
- [ ] Documentation is clear
- [ ] No sensitive data included
- [ ] Follows template guidelines

## Testing
How did you test these changes?

## Screenshots (if applicable)
Add screenshots here
```

## 🎯 Best Practices for Contributors

### Do's ✅

- Keep templates simple and focused
- Document everything clearly
- Use widely-adopted technologies
- Follow security best practices
- Test thoroughly before submitting
- Respond to feedback promptly
- Keep PRs focused on one thing

### Don'ts ❌

- Don't include sensitive data (API keys, passwords)
- Don't add unnecessary dependencies
- Don't make breaking changes without discussion
- Don't copy code without attribution
- Don't submit untested templates
- Don't ignore code review feedback

## 🔍 Code Review Process

1. **Automated Checks**: CI/CD must pass
2. **Maintainer Review**: Core team reviews code
3. **Feedback**: Address review comments
4. **Approval**: Get approval from maintainer
5. **Merge**: Template is merged and published

## 📞 Getting Help

- **Questions**: Open a [Discussion](https://github.com/tiagofur/template-project/discussions)
- **Bugs**: Open an [Issue](https://github.com/tiagofur/template-project/issues)
- **Ideas**: Start a [Discussion](https://github.com/tiagofur/template-project/discussions)

## 🏆 Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Credited in documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to making these templates better! 🎉
