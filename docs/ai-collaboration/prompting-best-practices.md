# 📚 Prompting Best Practices

Master the art of writing effective AI prompts for development tasks.

## Anatomy of a Good Prompt

### Structure
```
1. Role/Context - Set the stage
2. Task - What to accomplish
3. Requirements - Specifications and constraints
4. Format - Expected output structure
5. Examples - Sample input/output (optional)
```

### Example
```
Context: "I'm building a Node.js REST API for user management"
Task: "Create an endpoint to register new users"
Requirements:
- Use Express.js and TypeScript
- Validate email format and password strength
- Hash passwords with bcrypt
- Return JWT token on success
- Handle duplicate email errors
Format: "Include types, error handling, and inline comments"
```

## Prompting Techniques

### 1. Be Specific and Clear
```
❌ "Make this better"
✅ "Optimize this function to reduce time complexity from O(n²) to O(n log n)"

❌ "Add error handling"
✅ "Add try-catch blocks with specific error types. Log errors and return appropriate HTTP status codes"
```

### 2. Provide Relevant Context
```
✅ "This is a React component in a Next.js app using TypeScript and Tailwind CSS.
The app follows atomic design principles."
```

### 3. Specify Constraints
```
✅ "Must work in IE11, use only ES5 syntax, no external dependencies"
✅ "Follow our existing pattern in src/services/BaseService.ts"
✅ "Maximum bundle size: 50KB, must lazy load"
```

### 4. Request Explanations
```
✅ "Explain your approach and why you chose this pattern"
✅ "Add comments explaining the algorithm"
✅ "What are the trade-offs of this solution?"
```

### 5. Include Examples
```
✅ "Input: [{id: 1, name: 'John'}, {id: 2, name: 'Jane'}]
Output: Map<number, string> with id as key and name as value"
```

## Templates by Task Type

### Code Generation
```
"Create a {{language}} {{component_type}} that {{functionality}}.
Requirements:
- Use {{technology/framework}}
- Follow {{pattern}} pattern
- Include {{features}}
- Handle {{edge_cases}}
Testing: {{test_requirements}}"
```

### Code Review
```
"Review this {{language}} code for:
- Security vulnerabilities
- Performance issues
- Best practices violations
- Potential bugs
Provide specific suggestions with examples."
```

### Refactoring
```
"Refactor this code to:
- Improve readability
- Follow {{pattern}} pattern
- Reduce complexity
Keep the same functionality and add tests."
```

### Bug Fixing
```
"This code has a bug: {{describe_bug}}
Expected: {{expected_behavior}}
Actual: {{actual_behavior}}
Fix the bug and explain what caused it."
```

### Documentation
```
"Add {{doc_type}} documentation to this {{code_type}}.
Include:
- Description of purpose
- Parameter descriptions
- Return value
- Usage examples
- Edge cases"
```

## Anti-Patterns to Avoid

### Too Vague
```
❌ "Write some code"
❌ "Fix this"
❌ "Make it work"
```

### Too Broad
```
❌ "Build a complete authentication system"
Better: Break into smaller tasks
✅ "Create a login endpoint with email/password validation"
```

### Missing Context
```
❌ "Add authentication"
✅ "Add JWT authentication to our Express API. We already have User model in models/User.ts"
```

### No Success Criteria
```
❌ "Optimize this function"
✅ "Optimize to handle 10,000 items in < 100ms"
```

## Advanced Techniques

### Chain of Thought
```
"Let's solve this step by step:
1. First, analyze the input data structure
2. Then, determine the optimal algorithm
3. Finally, implement with error handling"
```

### Few-Shot Learning
```
"Here are examples of our coding style:
Example 1: [code]
Example 2: [code]
Now create a similar function for [task]"
```

### Constraints First
```
"Before implementing, consider:
- Performance: Must handle 1M records
- Memory: Max 100MB
- Compatibility: Node 14+
Now implement the solution"
```

## Checklist for Effective Prompts

- [ ] Clear and specific task description
- [ ] Relevant context provided
- [ ] Technical constraints specified
- [ ] Expected output format defined
- [ ] Examples included (if helpful)
- [ ] Success criteria stated
- [ ] Edge cases mentioned
- [ ] Coding standards referenced

## Examples by Use Case

### API Endpoint
```
"Create a REST API endpoint:
- Path: POST /api/users
- Framework: Express + TypeScript
- Body: { email, password, name }
- Validation: email format, password min 8 chars
- Response: { user, token } or error
- Database: PostgreSQL with Prisma
- Include: Input validation, error handling, tests"
```

### React Component
```
"Create a React component:
- Name: UserCard
- Props: user { name, email, avatar, role }
- Features: Click to expand, show/hide email
- Styling: Tailwind CSS, responsive
- State: Use hooks
- Include: PropTypes/TypeScript, tests"
```

### Database Query
```
"Write a SQL query:
- Get all orders with items and user info
- Filter: Last 30 days, status='completed'
- Join: orders, order_items, products, users
- Sort: Most recent first
- Include: Total amount calculation
- Optimize: Use indexes, limit results"
```

---

**Last Updated**: 2025-11-13
