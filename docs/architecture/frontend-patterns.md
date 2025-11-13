# 🎨 Frontend Architecture Patterns

Complete guide to frontend architecture patterns for building maintainable, scalable user interfaces.

## Overview

Frontend architecture patterns help organize component hierarchies, manage state, and separate concerns in client-side applications.

---

## 1. Atomic Design

### Description

Atomic Design is a methodology for creating design systems with five distinct levels: Atoms, Molecules, Organisms, Templates, and Pages. It provides a mental model for thinking about UI components as a hierarchy from smallest to largest.

### Structure

```
Pages (Full implementations)
  └── Templates (Page layouts)
      └── Organisms (Complex components)
          └── Molecules (Simple groups)
              └── Atoms (Basic elements)
```

### Component Hierarchy

```
┌─────────────────────────────────────────┐
│              5. Pages                   │  ← /users, /dashboard
│  Specific instances of templates        │
├─────────────────────────────────────────┤
│            4. Templates                 │  ← UserListTemplate
│  Page-level layouts & structure         │
├─────────────────────────────────────────┤
│           3. Organisms                  │  ← Header, UserCard
│  Complex UI components                  │
├─────────────────────────────────────────┤
│           2. Molecules                  │  ← SearchBox, FormField
│  Simple groups of atoms                 │
├─────────────────────────────────────────┤
│             1. Atoms                    │  ← Button, Input, Label
│  Basic HTML elements                    │
└─────────────────────────────────────────┘
```

### When to Use

✅ **Use When:**
- Building design systems or component libraries
- Need consistent UI across large applications
- Multiple teams working on same codebase
- Want to promote component reusability
- Creating documentation for designers/developers

❌ **Avoid When:**
- Small applications with few components
- Rapid prototyping with changing requirements
- Team unfamiliar with the methodology
- Components don't fit the hierarchy naturally

### Implementation Example (React + TypeScript)

```tsx
// 1. ATOMS - Basic building blocks
// src/components/atoms/Button/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  onClick,
  disabled = false,
}) => {
  const baseClasses = 'rounded font-semibold transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  const sizeClasses = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// src/components/atoms/Input/Input.tsx
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  error = false,
  disabled = false,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`
        px-4 py-2 border rounded w-full
        ${error ? 'border-red-500' : 'border-gray-300'}
        focus:outline-none focus:ring-2
        ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'}
        disabled:bg-gray-100 disabled:cursor-not-allowed
      `}
    />
  );
};

// src/components/atoms/Label/Label.tsx
interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}

export const Label: React.FC<LabelProps> = ({
  htmlFor,
  children,
  required = false,
}) => {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

// 2. MOLECULES - Simple component groups
// src/components/molecules/FormField/FormField.tsx
import { Label } from '../../atoms/Label/Label';
import { Input } from '../../atoms/Input/Input';

interface FormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
}) => {
  return (
    <div className="mb-4">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        error={!!error}
        placeholder={placeholder}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// src/components/molecules/SearchBox/SearchBox.tsx
import { Input } from '../../atoms/Input/Input';
import { Button } from '../../atoms/Button/Button';
import { useState } from 'react';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch,
  placeholder = 'Search...',
}) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <Input
          value={query}
          onChange={setQuery}
          placeholder={placeholder}
        />
      </div>
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
};

// 3. ORGANISMS - Complex components
// src/components/organisms/UserCard/UserCard.tsx
import { Button } from '../../atoms/Button/Button';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
}

interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-16 h-16 rounded-full"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-2xl text-gray-600">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
            {user.role}
          </span>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button size="small" onClick={() => onEdit(user.id)}>
          Edit
        </Button>
        <Button
          size="small"
          variant="danger"
          onClick={() => onDelete(user.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

// src/components/organisms/Header/Header.tsx
import { SearchBox } from '../../molecules/SearchBox/SearchBox';
import { Button } from '../../atoms/Button/Button';

interface HeaderProps {
  logoUrl: string;
  onSearch: (query: string) => void;
  onLogin: () => void;
  isAuthenticated: boolean;
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  logoUrl,
  onSearch,
  onLogin,
  isAuthenticated,
  userName,
}) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <img src={logoUrl} alt="Logo" className="h-8" />
          <div className="flex-1 max-w-md mx-8">
            <SearchBox onSearch={onSearch} />
          </div>
          <div>
            {isAuthenticated ? (
              <span className="text-gray-700">Welcome, {userName}</span>
            ) : (
              <Button onClick={onLogin}>Login</Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// 4. TEMPLATES - Page layouts
// src/components/templates/UserListTemplate/UserListTemplate.tsx
import { Header } from '../../organisms/Header/Header';

interface UserListTemplateProps {
  header: React.ReactNode;
  searchBar: React.ReactNode;
  userList: React.ReactNode;
  pagination: React.ReactNode;
}

export const UserListTemplate: React.FC<UserListTemplateProps> = ({
  header,
  searchBar,
  userList,
  pagination,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {header}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">{searchBar}</div>
        <div className="space-y-4">{userList}</div>
        <div className="mt-8">{pagination}</div>
      </main>
    </div>
  );
};

// 5. PAGES - Specific instances
// src/pages/UsersPage.tsx
import { useState, useEffect } from 'react';
import { UserListTemplate } from '../components/templates/UserListTemplate/UserListTemplate';
import { Header } from '../components/organisms/Header/Header';
import { UserCard } from '../components/organisms/UserCard/UserCard';
import { SearchBox } from '../components/molecules/SearchBox/SearchBox';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch users
    fetchUsers().then(setUsers);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Perform search
  };

  const handleEdit = (id: string) => {
    // Handle edit
  };

  const handleDelete = (id: string) => {
    // Handle delete
  };

  return (
    <UserListTemplate
      header={
        <Header
          logoUrl="/logo.png"
          onSearch={handleSearch}
          onLogin={() => {}}
          isAuthenticated={true}
          userName="John Doe"
        />
      }
      searchBar={
        <SearchBox
          onSearch={handleSearch}
          placeholder="Search users..."
        />
      }
      userList={
        <>
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </>
      }
      pagination={<div>Pagination component</div>}
    />
  );
};
```

### Folder Structure

```
src/
├── components/
│   ├── atoms/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── Button.stories.tsx
│   │   ├── Input/
│   │   ├── Label/
│   │   └── ...
│   ├── molecules/
│   │   ├── FormField/
│   │   ├── SearchBox/
│   │   └── ...
│   ├── organisms/
│   │   ├── Header/
│   │   ├── UserCard/
│   │   └── ...
│   └── templates/
│       ├── UserListTemplate/
│       └── ...
└── pages/
    ├── UsersPage.tsx
    ├── DashboardPage.tsx
    └── ...
```

### Pros and Cons

**Pros:**
- ✅ Promotes reusability
- ✅ Consistent design system
- ✅ Easy to understand component hierarchy
- ✅ Great for design-dev collaboration
- ✅ Scalable for large applications
- ✅ Works well with Storybook

**Cons:**
- ❌ Can be over-structured for simple apps
- ❌ Sometimes unclear which level a component belongs to
- ❌ May lead to over-abstraction
- ❌ Initial setup time

---

## 2. MVVM (Model-View-ViewModel)

### Description

MVVM separates the UI (View) from business logic (ViewModel) and data (Model). The ViewModel exposes data and commands to the View through data binding, keeping the View logic-free.

### Structure

```
┌──────────┐
│   View   │  ← React Components (UI only)
└────┬─────┘
     │ binds to
┌────▼─────────┐
│  ViewModel   │  ← State, Logic, Commands
└────┬─────────┘
     │ uses
┌────▼─────┐
│  Model   │  ← Data, Business Logic, API
└──────────┘
```

### When to Use

✅ **Use When:**
- Complex state management requirements
- Need to separate UI from business logic
- Want testable view logic
- Building data-driven applications
- Multiple views for same data

❌ **Avoid When:**
- Simple applications with minimal logic
- Static content websites
- Team unfamiliar with the pattern
- Rapid prototyping phase

### Implementation Example (React + TypeScript + MobX)

```typescript
// 1. MODEL - Data and business logic
// src/models/User.model.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export class UserModel {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public role: string
  ) {}

  static fromJSON(json: any): UserModel {
    return new UserModel(
      json.id,
      json.email,
      json.name,
      json.role
    );
  }

  toJSON(): User {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
    };
  }

  get displayName(): string {
    return `${this.name} (${this.role})`;
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }
}

// 2. SERVICE - API calls
// src/services/UserService.ts
import axios from 'axios';
import { UserModel } from '../models/User.model';

export class UserService {
  private baseUrl = '/api/users';

  async getUsers(): Promise<UserModel[]> {
    const response = await axios.get(this.baseUrl);
    return response.data.map(UserModel.fromJSON);
  }

  async getUser(id: string): Promise<UserModel> {
    const response = await axios.get(`${this.baseUrl}/${id}`);
    return UserModel.fromJSON(response.data);
  }

  async createUser(user: Partial<UserModel>): Promise<UserModel> {
    const response = await axios.post(this.baseUrl, user);
    return UserModel.fromJSON(response.data);
  }

  async updateUser(id: string, user: Partial<UserModel>): Promise<UserModel> {
    const response = await axios.put(`${this.baseUrl}/${id}`, user);
    return UserModel.fromJSON(response.data);
  }

  async deleteUser(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }
}

// 3. VIEWMODEL - State and presentation logic
// src/viewmodels/UserListViewModel.ts
import { makeAutoObservable, runInAction } from 'mobx';
import { UserModel } from '../models/User.model';
import { UserService } from '../services/UserService';

export class UserListViewModel {
  users: UserModel[] = [];
  isLoading = false;
  error: string | null = null;
  searchQuery = '';
  selectedUserId: string | null = null;

  constructor(private userService: UserService) {
    makeAutoObservable(this);
  }

  // Computed values
  get filteredUsers(): UserModel[] {
    if (!this.searchQuery) return this.users;
    
    const query = this.searchQuery.toLowerCase();
    return this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }

  get selectedUser(): UserModel | null {
    if (!this.selectedUserId) return null;
    return this.users.find((u) => u.id === this.selectedUserId) || null;
  }

  get hasUsers(): boolean {
    return this.users.length > 0;
  }

  get adminUsers(): UserModel[] {
    return this.users.filter((u) => u.isAdmin());
  }

  // Commands (actions)
  async loadUsers(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const users = await this.userService.getUsers();
      runInAction(() => {
        this.users = users;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to load users';
        this.isLoading = false;
      });
    }
  }

  async createUser(userData: Partial<UserModel>): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const user = await this.userService.createUser(userData);
      runInAction(() => {
        this.users.push(user);
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to create user';
        this.isLoading = false;
      });
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.userService.deleteUser(id);
      runInAction(() => {
        this.users = this.users.filter((u) => u.id !== id);
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to delete user';
      });
    }
  }

  setSearchQuery(query: string): void {
    this.searchQuery = query;
  }

  selectUser(id: string | null): void {
    this.selectedUserId = id;
  }

  clearError(): void {
    this.error = null;
  }
}

// 4. VIEW - React component (presentation only)
// src/views/UserListView.tsx
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { UserListViewModel } from '../viewmodels/UserListViewModel';

interface UserListViewProps {
  viewModel: UserListViewModel;
}

export const UserListView: React.FC<UserListViewProps> = observer(
  ({ viewModel }) => {
    useEffect(() => {
      viewModel.loadUsers();
    }, [viewModel]);

    if (viewModel.isLoading) {
      return <div className="text-center py-8">Loading...</div>;
    }

    if (viewModel.error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {viewModel.error}
          <button
            onClick={() => viewModel.clearError()}
            className="ml-4 underline"
          >
            Dismiss
          </button>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Users</h1>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search users..."
            value={viewModel.searchQuery}
            onChange={(e) => viewModel.setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        {/* Stats */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {viewModel.filteredUsers.length} of {viewModel.users.length} users
          ({viewModel.adminUsers.length} admins)
        </div>

        {/* User List */}
        {viewModel.hasUsers ? (
          <div className="space-y-4">
            {viewModel.filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`
                  bg-white p-4 rounded-lg shadow
                  ${viewModel.selectedUserId === user.id ? 'ring-2 ring-blue-500' : ''}
                `}
                onClick={() => viewModel.selectUser(user.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{user.displayName}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      viewModel.deleteUser(user.id);
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">No users found</div>
        )}

        {/* Selected User Detail */}
        {viewModel.selectedUser && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">Selected User:</h3>
            <p>Name: {viewModel.selectedUser.name}</p>
            <p>Email: {viewModel.selectedUser.email}</p>
            <p>Role: {viewModel.selectedUser.role}</p>
          </div>
        )}
      </div>
    );
  }
);

// 5. Setup - Dependency Injection
// src/pages/UsersPage.tsx
import React, { useMemo } from 'react';
import { UserListView } from '../views/UserListView';
import { UserListViewModel } from '../viewmodels/UserListViewModel';
import { UserService } from '../services/UserService';

export const UsersPage: React.FC = () => {
  const viewModel = useMemo(() => {
    const userService = new UserService();
    return new UserListViewModel(userService);
  }, []);

  return <UserListView viewModel={viewModel} />;
};
```

### Testing ViewModels

```typescript
// src/viewmodels/__tests__/UserListViewModel.test.ts
import { UserListViewModel } from '../UserListViewModel';
import { UserService } from '../../services/UserService';
import { UserModel } from '../../models/User.model';

// Mock the service
jest.mock('../../services/UserService');

describe('UserListViewModel', () => {
  let viewModel: UserListViewModel;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    mockUserService = new UserService() as jest.Mocked<UserService>;
    viewModel = new UserListViewModel(mockUserService);
  });

  it('should load users', async () => {
    const mockUsers = [
      new UserModel('1', 'test@example.com', 'Test User', 'user'),
    ];
    mockUserService.getUsers.mockResolvedValue(mockUsers);

    await viewModel.loadUsers();

    expect(viewModel.users).toEqual(mockUsers);
    expect(viewModel.isLoading).toBe(false);
  });

  it('should filter users by search query', async () => {
    viewModel.users = [
      new UserModel('1', 'alice@example.com', 'Alice', 'user'),
      new UserModel('2', 'bob@example.com', 'Bob', 'admin'),
    ];

    viewModel.setSearchQuery('alice');

    expect(viewModel.filteredUsers).toHaveLength(1);
    expect(viewModel.filteredUsers[0].name).toBe('Alice');
  });

  it('should handle errors', async () => {
    mockUserService.getUsers.mockRejectedValue(new Error('Network error'));

    await viewModel.loadUsers();

    expect(viewModel.error).toBe('Failed to load users');
    expect(viewModel.isLoading).toBe(false);
  });
});
```

### Pros and Cons

**Pros:**
- ✅ Clear separation of concerns
- ✅ Highly testable (ViewModels can be tested without UI)
- ✅ Reusable ViewModels across different Views
- ✅ Data binding simplifies UI updates
- ✅ Business logic separate from presentation

**Cons:**
- ❌ Learning curve for state management library
- ❌ More boilerplate code
- ❌ Can be complex for simple UIs
- ❌ Requires discipline to maintain separation

---

## Combining Patterns

### Atomic Design + MVVM

You can combine Atomic Design for component structure with MVVM for state management:

```typescript
// ViewModel handles state and logic
class ProductListViewModel {
  products: Product[] = [];
  // ... state management
}

// Atomic components are pure presentation
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  // Pure presentation, no business logic
};

// View connects ViewModel to Atomic components
const ProductListView: React.FC<{ viewModel: ProductListViewModel }> = 
  observer(({ viewModel }) => {
    return (
      <div>
        {viewModel.products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  });
```

## Decision Matrix

| Pattern | Best For | Complexity | Reusability | Testability |
|---------|----------|------------|-------------|-------------|
| **Atomic Design** | Design systems, component libraries | Medium | High | Medium |
| **MVVM** | Complex state management | Medium-High | Medium | High |

## Related Documentation

- [Backend Architecture Patterns](./backend-patterns.md)
- [Mobile Architecture Patterns](./mobile-patterns.md)
- [React Guide](../react/README.md)
- [State Management Guide](../react/state-management-guide.md)
- [Component Guide](../react/component-guide.md)

---

**Last Updated**: 2025-11-13
