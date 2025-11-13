# 🤖 AI Code Review Prompts Library

Collection of specialized prompts for AI-assisted code reviews.

## 📋 Quick Reference

- [General Reviews](#general-reviews)
- [Security Reviews](#security-reviews)
- [Performance Reviews](#performance-reviews)
- [Testing Reviews](#testing-reviews)
- [Architecture Reviews](#architecture-reviews)
- [Language-Specific Reviews](#language-specific-reviews)
- [Framework-Specific Reviews](#framework-specific-reviews)

## 🔍 General Reviews

### Comprehensive Code Review

```
Perform a comprehensive code review of the following code:

**Context**: [Brief description of what this code does]
**Technology**: [Language/Framework]

Review for:
1. Code quality and readability
2. Potential bugs and edge cases
3. Security vulnerabilities
4. Performance issues
5. Best practices adherence
6. Maintainability concerns

For each issue found:
- Specify the severity (Critical/High/Medium/Low)
- Explain the problem clearly
- Provide a specific fix or improvement
- Include code examples where helpful

[CODE]
```

### Quick Review

```
Quick review of this code:
- Does it work correctly?
- Any obvious bugs?
- Security issues?
- Major performance problems?
- Follows basic best practices?

[CODE]
```

### Explain This Code

```
Explain this code as if I'm a [junior/senior] developer:
- What does it do?
- How does it work?
- Are there any tricky parts?
- What could be improved?
- What are potential issues?

[CODE]
```

## 🔒 Security Reviews

### General Security Scan

```
Perform a security review of this code:

Check for:
1. **Input Validation**: Is all user input validated and sanitized?
2. **Authentication**: Are auth checks properly implemented?
3. **Authorization**: Are permission checks in place?
4. **Injection Attacks**: SQL injection, NoSQL injection, command injection?
5. **XSS**: Cross-site scripting vulnerabilities?
6. **CSRF**: Cross-site request forgery protection?
7. **Secrets**: Any hardcoded credentials or API keys?
8. **Dependencies**: Any known vulnerable dependencies?
9. **Data Exposure**: Sensitive data properly protected?
10. **Rate Limiting**: DoS protection in place?

For each vulnerability:
- Severity: Critical/High/Medium/Low
- Location: Where in the code
- Risk: What could happen
- Fix: How to remediate with code example

[CODE]
```

### Authentication Review

```
Review the authentication implementation:

Check:
- Password handling (hashing, salting, strength)
- Token generation and validation (JWT, sessions)
- Session management
- Multi-factor authentication (if applicable)
- Account lockout mechanisms
- Password reset flow security
- Secure cookie handling

Identify vulnerabilities and suggest improvements.

[CODE]
```

### API Security Review

```
Review this API endpoint for security:

Check:
- Input validation
- Authentication required?
- Authorization checks
- Rate limiting
- CORS configuration
- SQL injection prevention
- Request size limits
- Error message exposure
- Logging (are sensitive data logged?)

[CODE]
```

### Data Protection Review

```
Review data protection in this code:

Check:
- PII handling
- Data encryption (at rest, in transit)
- Secure data deletion
- Access controls
- Audit logging
- Compliance (GDPR, CCPA, etc.)

[CODE]
```

## ⚡ Performance Reviews

### General Performance Analysis

```
Analyze the performance of this code:

Evaluate:
1. **Time Complexity**: What's the Big O?
2. **Space Complexity**: Memory usage
3. **Database Queries**: Are they optimized?
4. **N+1 Problems**: Any N+1 query issues?
5. **Caching**: Opportunities for caching?
6. **Async Operations**: Are async ops used effectively?
7. **Resource Cleanup**: Are resources properly released?

For each issue:
- Current performance impact
- Specific optimization
- Code example of fix
- Expected improvement

[CODE]
```

### Database Query Optimization

```
Review these database queries for optimization:

Check:
- Are indexes being used?
- N+1 query problems?
- Unnecessary data fetching?
- Join optimization
- Query complexity
- Connection pooling
- Batch operations where possible

Suggest optimizations with examples.

[QUERIES/CODE]
```

### Frontend Performance Review

```
Review this frontend code for performance:

Check:
- Bundle size impact
- Unnecessary re-renders
- Memory leaks
- Lazy loading opportunities
- Code splitting
- Image optimization
- Network request optimization
- Virtual scrolling needs

[CODE]
```

### API Performance Review

```
Review this API endpoint for performance:

Check:
- Response time
- Database query efficiency
- Caching strategy
- Pagination implementation
- Response payload size
- Concurrent request handling
- Rate limiting impact

[CODE]
```

## 🧪 Testing Reviews

### Test Coverage Review

```
Review the test coverage for this code:

Analyze:
1. **Main Paths**: Are all main code paths tested?
2. **Edge Cases**: Are edge cases covered?
3. **Error Scenarios**: Are error cases tested?
4. **Integration Points**: Are integrations tested?
5. **Test Quality**: Are tests meaningful?
6. **Test Data**: Is test data realistic?
7. **Assertions**: Are assertions comprehensive?

Code to test:
[CODE]

Current tests:
[TESTS]

Suggest:
- Missing test cases
- Improvements to existing tests
- Better test structure
```

### Test Quality Review

```
Review these tests for quality:

Check:
- Are tests isolated?
- Are they deterministic?
- Clear test names?
- Good assertions?
- No test interdependencies?
- Proper mocking?
- Fast execution?
- Easy to maintain?

[TESTS]
```

### TDD Review

```
Review this code for TDD best practices:

Check:
- Tests written first?
- Red-Green-Refactor cycle followed?
- Tests drive design?
- Minimal code to pass tests?
- Tests independent?
- Good test structure (AAA pattern)?

[CODE + TESTS]
```

## 🏗️ Architecture Reviews

### Design Pattern Review

```
Review the design patterns used in this code:

Evaluate:
- Which patterns are used?
- Are they appropriate for the problem?
- Are they implemented correctly?
- Any anti-patterns?
- Better pattern suggestions?
- Trade-offs of current approach?

[CODE]
```

### SOLID Principles Review

```
Review this code against SOLID principles:

Check:
1. **Single Responsibility**: Does each class have one reason to change?
2. **Open/Closed**: Open for extension, closed for modification?
3. **Liskov Substitution**: Can derived classes replace base classes?
4. **Interface Segregation**: Are interfaces focused and minimal?
5. **Dependency Inversion**: Depends on abstractions, not concretions?

For each principle:
- Is it followed?
- If violated, how?
- Suggested refactoring

[CODE]
```

### Microservices Review

```
Review this microservice for best practices:

Check:
- Single responsibility
- Independent deployability
- Data ownership
- API design
- Error handling
- Service discovery
- Circuit breaker pattern
- Observability (logging, metrics, tracing)
- Resilience patterns

[CODE]
```

### Code Organization Review

```
Review the code organization and structure:

Evaluate:
- File/folder structure
- Module boundaries
- Separation of concerns
- Code coupling
- Code cohesion
- Dependency direction
- Naming consistency

Suggest improvements.

[PROJECT STRUCTURE / CODE]
```

## 💻 Language-Specific Reviews

### JavaScript/TypeScript

```
Review this JavaScript/TypeScript code:

Check:
- Type safety (TypeScript specific)
- Async/await usage
- Promise handling
- Error handling
- Memory leaks (closures, event listeners)
- ES6+ best practices
- Lodash vs native methods
- Bundle size impact

[CODE]
```

### Python

```
Review this Python code:

Check:
- Pythonic idioms
- PEP 8 compliance
- Type hints
- Exception handling
- Context managers
- List comprehensions vs loops
- Generator usage
- Import organization

[CODE]
```

### Go

```
Review this Go code:

Check:
- Error handling patterns
- Goroutine usage
- Channel operations
- Context usage
- Defer statements
- Struct composition
- Interface design
- Error wrapping (Go 1.13+)

[CODE]
```

### Java

```
Review this Java code:

Check:
- Exception handling
- Resource management (try-with-resources)
- Stream API usage
- Null safety
- Immutability
- Design patterns
- Thread safety
- Memory management

[CODE]
```

## 🚀 Framework-Specific Reviews

### React

```
Review this React component:

Check:
- Component structure (functional vs class)
- Hooks usage (rules of hooks)
- State management
- Props validation
- Re-rendering optimization (memo, useMemo, useCallback)
- Key props in lists
- Effect dependencies
- Accessibility
- Error boundaries

[CODE]
```

### Node.js/Express

```
Review this Express.js code:

Check:
- Middleware organization
- Error handling
- Async error handling
- Route structure
- Input validation
- Security middleware (helmet, cors, rate-limiting)
- Database connection handling
- Environment variables

[CODE]
```

### Django

```
Review this Django code:

Check:
- Model design
- QuerySet optimization
- View structure
- Form handling
- Template usage
- URL routing
- Middleware
- Settings security
- Migrations

[CODE]
```

### Spring Boot

```
Review this Spring Boot code:

Check:
- Dependency injection
- Component scanning
- Exception handling
- Transaction management
- REST API design
- Configuration properties
- Security configuration
- Repository patterns

[CODE]
```

### Flutter

```
Review this Flutter code:

Check:
- Widget composition
- State management
- Build method optimization
- Async operations
- Navigation
- Platform integration
- Performance (const constructors)
- Accessibility

[CODE]
```

## 🎯 Specialized Reviews

### API Design Review

```
Review this API design:

Check:
- RESTful principles
- Endpoint naming
- HTTP methods usage
- Status codes
- Error responses
- Versioning strategy
- Pagination
- Filtering and sorting
- Documentation
- Rate limiting

[API SPECIFICATION]
```

### Database Schema Review

```
Review this database schema:

Check:
- Normalization
- Indexes
- Foreign keys
- Data types
- Constraints
- Migration strategy
- Performance implications
- Scalability

[SCHEMA]
```

### Configuration Review

```
Review this configuration:

Check:
- Environment-specific configs
- Secret management
- Default values
- Validation
- Documentation
- Backward compatibility

[CONFIG FILES]
```

### Documentation Review

```
Review the documentation:

Check:
- Completeness
- Accuracy
- Clarity
- Examples
- Edge cases mentioned
- API documentation
- Setup instructions
- Troubleshooting guide

[DOCUMENTATION]
```

## 🔄 Refactoring Prompts

### General Refactoring

```
Suggest refactoring for this code:

Goals:
- Improve readability
- Reduce complexity
- Follow best practices
- Better naming
- Extract reusable parts
- Modern syntax/patterns

For each suggestion:
- Show before/after
- Explain benefits
- Note any trade-offs

[CODE]
```

### Extract Function/Method

```
This code could benefit from extracting functions:

Identify:
- Repeated code blocks
- Complex expressions
- Long methods
- Multiple responsibilities

Suggest extractions with:
- Function name
- Parameters
- Return value
- Refactored code

[CODE]
```

### Simplify Conditional Logic

```
Simplify the conditional logic in this code:

Suggest:
- Early returns
- Guard clauses
- Lookup tables vs if/else
- Polymorphism vs conditionals
- Ternary operators where appropriate

[CODE]
```

## 💡 Learning Prompts

### Explain Trade-offs

```
Explain the trade-offs of this implementation:

Compare:
- Current approach
- Alternative approaches
- Pros and cons of each
- When to use each
- Performance implications
- Maintainability implications

[CODE]
```

### Best Practices

```
What are the best practices for [specific technology/pattern]?

For this code:
[CODE]

Explain:
- What's done well
- What could be improved
- Why improvements matter
- Industry standards
- Common pitfalls to avoid
```

### Learning from Code

```
Teach me about this code:

[CODE]

Explain:
- Key concepts used
- Why this approach?
- What makes it good/bad?
- Common mistakes to avoid
- Related patterns or concepts
- How would an expert write this?
```

## 📝 Review Response Templates

### Accepting Suggestion

```markdown
✅ Good catch! I'll update this to:
[CODE]

This is better because [reason].
```

### Requesting Clarification

```markdown
🤔 Could you elaborate on [specific point]?

I chose [current approach] because [reason].
Is there a specific concern with this?
```

### Alternative Proposal

```markdown
💡 I see your point. What about this alternative:
[CODE]

This way we get [benefit] while avoiding [issue].
Thoughts?
```

## 🎓 Usage Tips

1. **Be Specific**: Include context about your project, technology stack, and constraints
2. **Provide Examples**: Show actual code, not pseudocode
3. **Set Expectations**: Specify what aspects you want reviewed
4. **Iterate**: Use follow-up prompts to dive deeper into specific issues
5. **Learn**: Ask "why" questions to understand recommendations

## 🔗 Related Resources

- [AI Code Review Guidelines](../../docs/ai-collaboration/ai-code-review-guidelines.md)
- [Prompting Best Practices](../../docs/ai-collaboration/prompting-best-practices.md)
- [Code Review Checklist](../../docs/coding-guidelines/code-review-checklist.md)

---

**Last Updated**: 2025-11-13
**Version**: 1.0.0

_Comprehensive prompts for effective AI-assisted code reviews_ 🚀
