# 🔄 Guía de Estrategias de State Management en React

## Introducción

Esta guía compara las principales soluciones de gestión de estado en React y proporciona estrategias para elegir la opción correcta según las necesidades del proyecto.

## Tipos de Estado

### 1. **Local State** (useState, useReducer)
Estado que solo necesita un componente o sus hijos directos.

```typescript
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### 2. **Shared State** (Context API, Zustand, Redux)
Estado compartido entre múltiples componentes no relacionados.

### 3. **Server State** (TanStack Query, SWR)
Datos que vienen del servidor y necesitan caching, sincronización.

### 4. **URL State** (React Router)
Estado reflejado en la URL (parámetros, query strings).

## Matriz de Decisión

| Solución | Complejidad | Performance | DevEx | Mejor Para |
|----------|-------------|-------------|-------|------------|
| **useState** | Baja | Excelente | Excelente | Estado local simple |
| **useReducer** | Media | Excelente | Buena | Estado local complejo |
| **Context API** | Media | Buena* | Buena | Estado compartido simple |
| **Zustand** | Baja | Excelente | Excelente | Apps medianas/grandes |
| **Redux Toolkit** | Alta | Excelente | Buena | Apps enterprise complejas |
| **TanStack Query** | Media | Excelente | Excelente | Server state caching |

*Context puede causar re-renders innecesarios sin optimización

## Context API

### Cuándo Usar
- ✅ Estado compartido simple (tema, auth, idioma)
- ✅ No requiere dependencies externas
- ✅ Cambios de estado infrecuentes
- ⚠️ Puede causar re-renders en toda la jerarquía

### Implementación Básica

```typescript
import { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Uso:
function App() {
  return (
    <ThemeProvider>
      <MyApp />
    </ThemeProvider>
  );
}

function ThemedButton() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Current: {theme}</button>;
}
```

### Optimización de Context con Split

```typescript
// Separar estado de acciones para optimizar re-renders
const ThemeStateContext = createContext<'light' | 'dark'>('light');
const ThemeActionsContext = createContext<{ toggleTheme: () => void }>(
  {} as any
);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const actions = useMemo(
    () => ({
      toggleTheme: () => setTheme(prev => prev === 'light' ? 'dark' : 'light'),
    }),
    []
  );
  
  return (
    <ThemeStateContext.Provider value={theme}>
      <ThemeActionsContext.Provider value={actions}>
        {children}
      </ThemeActionsContext.Provider>
    </ThemeStateContext.Provider>
  );
}

// Componente que solo lee estado (se re-renderiza)
export function useThemeState() {
  return useContext(ThemeStateContext);
}

// Componente que solo usa acciones (NO se re-renderiza)
export function useThemeActions() {
  return useContext(ThemeActionsContext);
}
```

## Zustand

### Cuándo Usar
- ✅ Apps medianas a grandes
- ✅ Necesitas API simple y minimalista
- ✅ Quieres evitar providers/wrappers
- ✅ Performance es crítica

### Instalación

```bash
npm install zustand
```

### Store Básico

```typescript
import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// Uso:
function Counter() {
  const { count, increment, decrement } = useCounterStore();
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

### Store con Middleware (Persist, DevTools, Immer)

```typescript
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

export const useTodoStore = create<TodoState>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set) => ({
          todos: [],
          
          addTodo: (text) =>
            set((state) => {
              state.todos.push({
                id: Math.random().toString(36),
                text,
                completed: false,
              });
            }),
          
          toggleTodo: (id) =>
            set((state) => {
              const todo = state.todos.find((t) => t.id === id);
              if (todo) todo.completed = !todo.completed;
            }),
          
          deleteTodo: (id) =>
            set((state) => {
              state.todos = state.todos.filter((t) => t.id !== id);
            }),
        }))
      ),
      {
        name: 'todo-storage',
        partialize: (state) => ({ todos: state.todos }),
      }
    ),
    { name: 'TodoStore' }
  )
);
```

### Selectors para Optimización

```typescript
// ❌ Re-renderiza en cualquier cambio del store
function TodoCount() {
  const store = useTodoStore();
  return <div>Total: {store.todos.length}</div>;
}

// ✅ Solo re-renderiza cuando el count cambia
function TodoCount() {
  const count = useTodoStore((state) => state.todos.length);
  return <div>Total: {count}</div>;
}

// ✅ Selector con comparación custom
function CompletedTodos() {
  const completed = useTodoStore(
    (state) => state.todos.filter((t) => t.completed),
    (a, b) => a.length === b.length  // shallow comparison
  );
  return <div>Completed: {completed.length}</div>;
}
```

### Slices Pattern (Múltiples Stores)

```typescript
// authSlice.ts
export interface AuthSlice {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const createAuthSlice = (set: any): AuthSlice => ({
  user: null,
  login: async (email, password) => {
    const user = await api.login(email, password);
    set({ user });
  },
  logout: () => set({ user: null }),
});

// uiSlice.ts
export interface UISlice {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

export const createUISlice = (set: any): UISlice => ({
  theme: 'light',
  sidebarOpen: true,
  toggleTheme: () =>
    set((state: any) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),
  toggleSidebar: () =>
    set((state: any) => ({ sidebarOpen: !state.sidebarOpen })),
});

// store.ts - Combinar slices
import { create } from 'zustand';
import { AuthSlice, createAuthSlice } from './authSlice';
import { UISlice, createUISlice } from './uiSlice';

type StoreState = AuthSlice & UISlice;

export const useStore = create<StoreState>()((...a) => ({
  ...createAuthSlice(...a),
  ...createUISlice(...a),
}));
```

## Redux Toolkit

### Cuándo Usar
- ✅ Apps enterprise muy complejas
- ✅ Necesitas time-travel debugging
- ✅ Equipo familiarizado con Redux
- ✅ Patrones predecibles son críticos
- ⚠️ Más boilerplate que Zustand

### Instalación

```bash
npm install @reduxjs/toolkit react-redux
```

### Store Setup

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import todosReducer from './slices/todosSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Typed Hooks

```typescript
// hooks/redux.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Slice con createSlice

```typescript
// slices/todosSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodosState {
  items: Todo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodosState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk
export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async () => {
    const response = await fetch('/api/todos');
    return response.json();
  }
);

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.items.push({
        id: Math.random().toString(36),
        text: action.payload,
        completed: false,
      });
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.items.find((t) => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch';
      });
  },
});

export const { addTodo, toggleTodo, deleteTodo } = todosSlice.actions;
export default todosSlice.reducer;
```

### Uso en Componentes

```typescript
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { addTodo, toggleTodo, fetchTodos } from '../slices/todosSlice';

function TodoList() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.todos);
  
  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);
  
  const handleAdd = (text: string) => {
    dispatch(addTodo(text));
  };
  
  const handleToggle = (id: string) => {
    dispatch(toggleTodo(id));
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {items.map((todo) => (
        <div key={todo.id} onClick={() => handleToggle(todo.id)}>
          {todo.text} - {todo.completed ? '✓' : '○'}
        </div>
      ))}
    </div>
  );
}
```

## TanStack Query (React Query)

### Cuándo Usar
- ✅ Gestión de server state (API data)
- ✅ Necesitas caching automático
- ✅ Sincronización en background
- ✅ Optimistic updates

### Instalación

```bash
npm install @tanstack/react-query
```

### Setup

```typescript
// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      cacheTime: 1000 * 60 * 10, // 10 minutos
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MyApp />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
```

### Queries

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface User {
  id: string;
  name: string;
  email: string;
}

// Fetch users
function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json() as Promise<User[]>;
    },
  });
}

// Fetch single user
function useUser(userId: string) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json() as Promise<User>;
    },
    enabled: !!userId, // Solo fetch si userId existe
  });
}

// Uso en componente
function UserList() {
  const { data: users, isLoading, error } = useUsers();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {users?.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### Mutations

```typescript
function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newUser: Omit<User, 'id'>) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidar y re-fetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Optimistic update
function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (user: User) => {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      return response.json();
    },
    onMutate: async (updatedUser) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ['users', updatedUser.id] });
      
      // Snapshot previous value
      const previousUser = queryClient.getQueryData(['users', updatedUser.id]);
      
      // Optimistically update
      queryClient.setQueryData(['users', updatedUser.id], updatedUser);
      
      return { previousUser };
    },
    onError: (err, updatedUser, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(
          ['users', updatedUser.id],
          context.previousUser
        );
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
    },
  });
}

// Uso
function EditUserForm({ userId }: { userId: string }) {
  const { data: user } = useUser(userId);
  const updateUser = useUpdateUser();
  
  const handleSubmit = (formData: User) => {
    updateUser.mutate(formData, {
      onSuccess: () => {
        toast.success('User updated!');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Estrategia Combinada

Muchas apps usan una combinación:

```typescript
// Zustand para UI state
const useUIStore = create((set) => ({
  theme: 'light',
  sidebarOpen: true,
  toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
}));

// TanStack Query para server state
function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
}

// Context para auth (cambio infrecuente)
const AuthContext = createContext<AuthState | undefined>(undefined);

// Local state para formularios
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // ...
}
```

## Mejores Prácticas

### 1. Colocar Estado lo Más Cerca Posible

```typescript
// ❌ Estado global innecesario
const useGlobalStore = create((set) => ({
  modalOpen: false,
  formData: {},
  // ... mucho estado local
}));

// ✅ Estado local donde se usa
function MyComponent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
}
```

### 2. Normalizar Datos Complejos

```typescript
// ❌ Datos anidados
{
  posts: [
    {
      id: '1',
      author: { id: '1', name: 'John' },
      comments: [
        { id: '1', author: { id: '2', name: 'Jane' } }
      ]
    }
  ]
}

// ✅ Datos normalizados
{
  posts: { '1': { id: '1', authorId: '1', commentIds: ['1'] } },
  users: { '1': { id: '1', name: 'John' }, '2': { id: '2', name: 'Jane' } },
  comments: { '1': { id: '1', authorId: '2', postId: '1' } }
}
```

### 3. Derivar Estado en Lugar de Almacenarlo

```typescript
// ❌ Estado duplicado
const [users, setUsers] = useState([]);
const [activeUsers, setActiveUsers] = useState([]);

// ✅ Derivar con useMemo
const [users, setUsers] = useState([]);
const activeUsers = useMemo(
  () => users.filter(u => u.isActive),
  [users]
);
```

### 4. Separar Concerns

```typescript
// ✅ Separar lógica de UI
// hooks/useUserData.ts
export function useUserData(userId: string) {
  const { data, loading, error } = useQuery(['user', userId], fetchUser);
  
  return {
    user: data,
    loading,
    error,
  };
}

// UserProfile.tsx
function UserProfile({ userId }: { userId: string }) {
  const { user, loading, error } = useUserData(userId);
  
  // Solo UI logic aquí
}
```

## Checklist de State Management

- [ ] **Identificar tipo de estado**: Local, shared, server, URL
- [ ] **Elegir solución apropiada**: Basado en complejidad y necesidades
- [ ] **Evitar prop drilling**: Usar context/store para estado compartido
- [ ] **Optimizar re-renders**: Selectors, memoization, split contexts
- [ ] **Normalizar datos**: Evitar duplicación y nesting profundo
- [ ] **Derivar estado**: Calcular en lugar de almacenar
- [ ] **Separar concerns**: Lógica separada de presentación
- [ ] **Testing**: Unit tests para reducers/stores
- [ ] **DevTools**: Usar Redux/Zustand DevTools para debugging
- [ ] **Documentar**: Documentar decisiones de arquitectura

## Recursos Adicionales

- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TanStack Query](https://tanstack.com/query/latest)
- [React State Management in 2024](https://react.dev/learn/managing-state)

---

**Última actualización**: 2024
