# ✅ AI Code Review Quick Checklist

Quick reference checklist for AI-assisted code reviews.

## 🚀 Before Submitting PR

### Self-Review with AI
- [ ] Run code through AI for initial review
- [ ] Address obvious issues found by AI
- [ ] Check for security vulnerabilities
- [ ] Verify test coverage
- [ ] Update documentation

### Automated Checks
- [ ] All tests pass locally
- [ ] Linter passes without warnings
- [ ] Build completes successfully
- [ ] No console.log or debug statements
- [ ] Git commit messages are clear

## 🤖 AI-Assisted Review Process

### Initial Analysis
- [ ] Use AI to understand code changes
- [ ] Get AI explanation of complex logic
- [ ] Check for common patterns and anti-patterns
- [ ] Identify potential edge cases
- [ ] Review error handling

### Security Review
- [ ] Input validation present
- [ ] No hardcoded secrets
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] Authentication/authorization checks
- [ ] Dependency vulnerabilities checked

### Performance Review
- [ ] No N+1 query problems
- [ ] Efficient algorithms used
- [ ] Appropriate caching
- [ ] No memory leaks
- [ ] Database queries optimized

### Code Quality
- [ ] Readable and maintainable
- [ ] Follows project conventions
- [ ] Proper naming conventions
- [ ] No code duplication
- [ ] Appropriate comments
- [ ] Low complexity

### Testing
- [ ] Tests included for new code
- [ ] Tests cover edge cases
- [ ] Tests are meaningful
- [ ] Integration tests if needed
- [ ] Coverage >80%

### Documentation
- [ ] README updated if needed
- [ ] API docs updated
- [ ] CHANGELOG updated
- [ ] Complex logic documented
- [ ] Examples provided

## 👤 Human Review Focus

After AI review, humans should focus on:

- [ ] Business logic correctness
- [ ] Architecture alignment
- [ ] User experience
- [ ] Product requirements
- [ ] Domain-specific considerations
- [ ] Trade-off decisions

## 💬 Feedback Guidelines

### Giving Feedback
- [ ] Be specific and actionable
- [ ] Provide code examples
- [ ] Explain the "why"
- [ ] Suggest alternatives
- [ ] Acknowledge good code

### Receiving Feedback
- [ ] Read all comments carefully
- [ ] Ask for clarification if needed
- [ ] Address each point
- [ ] Update code accordingly
- [ ] Thank reviewers

## 🎯 Quick AI Prompts

### General Review
```
Review this code for quality, security, and best practices:
[CODE]
```

### Security Focus
```
Perform security review - check for vulnerabilities:
[CODE]
```

### Performance Focus
```
Analyze performance and suggest optimizations:
[CODE]
```

### Testing Focus
```
Review test coverage and suggest additional tests:
[CODE] [TESTS]
```

## ✨ Best Practices

- [ ] Use AI for initial pass, human for final approval
- [ ] Iterate on AI feedback
- [ ] Learn from AI suggestions
- [ ] Document decisions
- [ ] Keep reviews focused and small
- [ ] Review within 24 hours
- [ ] Be respectful and constructive

## 📊 Metrics to Track

- [ ] Review turnaround time
- [ ] Issues found in review vs production
- [ ] Test coverage trends
- [ ] Code quality scores
- [ ] Time saved with AI

## 🔗 Quick Links

- **[Full Guidelines](../docs/ai-collaboration/ai-code-review-guidelines.md)** - Complete guide
- **[Prompt Library](./ai-code-review-prompts.md)** - Detailed prompts
- **[Coding Standards](../docs/coding-guidelines/README.md)** - Style guide
- **[Security Checklist](../tools/security/security-checklist.md)** - Security guide

## 🎨 Review Status Indicators

Use these in PR comments:

- 🔴 **Critical** - Must fix before merge
- 🟡 **Important** - Should fix before merge
- 🟢 **Optional** - Nice to have
- 💡 **Suggestion** - Consider this approach
- ❓ **Question** - Needs clarification
- ✅ **Approved** - Looks good!

---

**Version**: 1.0.0
**Last Updated**: 2025-11-13

_Quick reference for efficient AI-assisted code reviews_ ⚡
