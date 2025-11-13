# 🐍 Python Guidelines

Python-specific coding standards and best practices.

## PEP 8 Compliance

Follow [PEP 8](https://peps.python.org/pep-0008/) style guide.

### Naming Conventions

```python
# Classes: PascalCase
class UserService:
    pass

# Functions/variables: snake_case
def get_user_by_id(user_id):
    user_name = "John"

# Constants: UPPER_SNAKE_CASE
MAX_RETRIES = 3

# Private: _prefix
class Example:
    def __init__(self):
        self._private_field = None
```

## Type Hints

```python
from typing import List, Optional, Dict

def process_users(users: List[Dict[str, str]]) -> Optional[str]:
    """Process a list of users and return the first name."""
    if not users:
        return None
    return users[0].get('name')
```

## Docstrings

```python
def calculate_total(items: List[dict], tax_rate: float = 0.0) -> float:
    """
    Calculate total price of items including tax.
    
    Args:
        items: List of items with 'price' key
        tax_rate: Tax rate as decimal (default: 0.0)
    
    Returns:
        Total price with tax applied
    
    Raises:
        ValueError: If items is empty or tax_rate is negative
    """
    if not items:
        raise ValueError("Items list cannot be empty")
    if tax_rate < 0:
        raise ValueError("Tax rate cannot be negative")
    
    subtotal = sum(item['price'] for item in items)
    return subtotal * (1 + tax_rate)
```

## Virtual Environments

```bash
# Create virtual environment
python -m venv venv

# Activate
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt
```

## Common Patterns

### Context Managers
```python
# ✅ Use with statement
with open('file.txt', 'r') as f:
    content = f.read()

# ✅ Custom context manager
from contextlib import contextmanager

@contextmanager
def database_connection():
    conn = create_connection()
    try:
        yield conn
    finally:
        conn.close()
```

### List Comprehensions
```python
# ✅ List comprehension
squares = [x**2 for x in range(10)]

# ✅ With condition
even_squares = [x**2 for x in range(10) if x % 2 == 0]

# ❌ Avoid too complex comprehensions
# Use regular loops if it's hard to read
```

### Generators
```python
# ✅ Generator for large sequences
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b
```

## Error Handling

```python
# ✅ Specific exceptions
try:
    user = get_user(user_id)
except UserNotFoundError:
    logger.error(f"User {user_id} not found")
    raise
except DatabaseError as e:
    logger.error(f"Database error: {e}")
    raise

# ✅ Custom exceptions
class ValidationError(Exception):
    """Raised when validation fails"""
    pass
```

## Testing with pytest

```python
import pytest

def test_add():
    assert add(2, 3) == 5

def test_divide_by_zero():
    with pytest.raises(ZeroDivisionError):
        divide(10, 0)

@pytest.fixture
def sample_user():
    return User(name="John", email="john@example.com")

def test_user_creation(sample_user):
    assert sample_user.name == "John"
```

---

**Last Updated**: 2025-11-13
