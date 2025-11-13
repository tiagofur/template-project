# 🧩 Guía de Componentes React

## Introducción

Esta guía establece las mejores prácticas para crear componentes React modulares, reutilizables y mantenibles. Enfocamos en patrones modernos usando React 18+ y TypeScript.

## Principios de Diseño

### 1. Single Responsibility Principle (SRP)

Cada componente debe tener una sola responsabilidad clara.

**❌ Mal ejemplo:**
```typescript
// Componente hace demasiado
function UserDashboard() {
  const [user, setUser] = useState();
  const [posts, setPosts] = useState();
  const [notifications, setNotifications] = useState();
  
  // Lógica de autenticación
  // Lógica de posts
  // Lógica de notificaciones
  // Render complejo
}
```

**✅ Buen ejemplo:**
```typescript
// Componentes separados con responsabilidades claras
function UserDashboard() {
  return (
    <div>
      <UserProfile />
      <UserPosts />
      <UserNotifications />
    </div>
  );
}
```

### 2. Composition over Inheritance

Usa composición y children para reutilización en lugar de herencia.

**✅ Pattern de Composición:**
```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className }: CardProps) {
  return (
    <div className={`rounded-lg border p-4 ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="font-bold mb-2">{children}</div>;
}

function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="text-gray-600">{children}</div>;
}

// Uso:
<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

### 3. Props Interface Clara

Define interfaces TypeScript explícitas para todas las props.

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  children,
  type = 'button',
}: ButtonProps) {
  // Implementation
}
```

## Patrones de Componentes

### 1. Compound Components

Para componentes complejos con múltiples sub-componentes relacionados.

```typescript
import { createContext, useContext, useState } from 'react';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within Tabs');
  }
  return context;
}

export function Tabs({ 
  children, 
  defaultTab 
}: { 
  children: React.ReactNode; 
  defaultTab: string;
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }: { children: React.ReactNode }) {
  return <div className="tab-list flex gap-2">{children}</div>;
}

function Tab({ 
  value, 
  children 
}: { 
  value: string; 
  children: React.ReactNode;
}) {
  const { activeTab, setActiveTab } = useTabs();
  
  return (
    <button
      className={`tab ${activeTab === value ? 'active' : ''}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

function TabPanel({ 
  value, 
  children 
}: { 
  value: string; 
  children: React.ReactNode;
}) {
  const { activeTab } = useTabs();
  
  if (activeTab !== value) return null;
  
  return <div className="tab-panel">{children}</div>;
}

// Export as compound component
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

// Uso:
<Tabs defaultTab="profile">
  <Tabs.List>
    <Tabs.Tab value="profile">Profile</Tabs.Tab>
    <Tabs.Tab value="settings">Settings</Tabs.Tab>
  </Tabs.List>
  
  <Tabs.Panel value="profile">
    <ProfileContent />
  </Tabs.Panel>
  <Tabs.Panel value="settings">
    <SettingsContent />
  </Tabs.Panel>
</Tabs>
```

### 2. Render Props

Para compartir lógica entre componentes de manera flexible.

```typescript
interface MousePosition {
  x: number;
  y: number;
}

interface MouseTrackerProps {
  children: (position: MousePosition) => React.ReactNode;
}

function MouseTracker({ children }: MouseTrackerProps) {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });
  
  const handleMouseMove = (e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };
  
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return <>{children(position)}</>;
}

// Uso:
<MouseTracker>
  {({ x, y }) => (
    <div>
      Mouse position: {x}, {y}
    </div>
  )}
</MouseTracker>
```

### 3. Higher-Order Components (HOC)

Para agregar funcionalidad adicional a componentes.

```typescript
function withLoading<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WithLoadingComponent({
    isLoading,
    ...props
  }: P & { isLoading: boolean }) {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    
    return <Component {...(props as P)} />;
  };
}

// Uso:
const UserListWithLoading = withLoading(UserList);

<UserListWithLoading isLoading={loading} users={users} />
```

### 4. Custom Hooks para Lógica Reutilizable

Extraer lógica compleja a custom hooks.

```typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue] as const;
}

// Uso en componente:
function UserPreferences() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme ({theme})
    </button>
  );
}
```

## Estructura de Archivos

### Organización por Feature

```
features/
  auth/
    components/
      LoginForm.tsx
      LoginForm.test.tsx
      RegisterForm.tsx
      RegisterForm.test.tsx
    hooks/
      useAuth.ts
      useAuth.test.ts
    types/
      auth.types.ts
    index.ts  # Public API del feature
```

### Componente Individual

```
Button/
  Button.tsx          # Implementación principal
  Button.test.tsx     # Tests
  Button.stories.tsx  # Storybook (opcional)
  Button.module.css   # Estilos (si no usas CSS-in-JS)
  index.ts            # Re-export
```

### Ejemplo de index.ts (Public API)

```typescript
// features/auth/index.ts
export { LoginForm } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';
export { useAuth } from './hooks/useAuth';
export type { User, AuthState } from './types/auth.types';
```

## Optimización de Performance

### 1. React.memo para Prevenir Re-renders

```typescript
interface UserCardProps {
  user: User;
  onSelect: (id: string) => void;
}

export const UserCard = React.memo(
  ({ user, onSelect }: UserCardProps) => {
    return (
      <div onClick={() => onSelect(user.id)}>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    );
  },
  // Custom comparison (opcional)
  (prevProps, nextProps) => {
    return prevProps.user.id === nextProps.user.id;
  }
);
```

### 2. useMemo para Cálculos Costosos

```typescript
function UserList({ users, searchTerm }: UserListProps) {
  // Memoize expensive filtering
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [users, searchTerm]);
  
  return (
    <div>
      {filteredUsers.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

### 3. useCallback para Funciones

```typescript
function TodoList({ todos }: TodoListProps) {
  const [items, setItems] = useState(todos);
  
  // Memoize callback
  const handleToggle = useCallback((id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }, []);
  
  return (
    <div>
      {items.map(item => (
        <TodoItem 
          key={item.id} 
          item={item} 
          onToggle={handleToggle}  // Stable reference
        />
      ))}
    </div>
  );
}
```

### 4. Code Splitting con React.lazy

```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

## Error Boundaries

```typescript
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.message}</pre>
          </details>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Uso:
<ErrorBoundary fallback={<ErrorFallback />}>
  <MyComponent />
</ErrorBoundary>
```

## Testing de Componentes

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
  
  it('applies correct variant class', () => {
    render(<Button variant="outline">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-outline');
  });
});
```

## Checklist de Componente de Calidad

- [ ] **TypeScript**: Props y state tipados
- [ ] **Naming**: Nombres descriptivos en PascalCase
- [ ] **Single Responsibility**: Una responsabilidad por componente
- [ ] **Props Interface**: Interface clara y documentada
- [ ] **Default Props**: Valores por defecto cuando sea apropiado
- [ ] **Accesibilidad**: ARIA labels, keyboard navigation
- [ ] **Performance**: Memoización donde sea necesario
- [ ] **Error Handling**: Manejo de errores apropiado
- [ ] **Tests**: Cobertura de casos principales
- [ ] **Documentation**: JSDoc para componentes públicos
- [ ] **Storybook**: Stories para componentes UI (opcional)
- [ ] **No Side Effects**: Componentes puros cuando sea posible

## Recursos Adicionales

- [React Component Patterns](https://react.dev/learn)
- [TypeScript React Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Última actualización**: 2024
