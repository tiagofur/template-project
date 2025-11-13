# 🎨 Frontend Development Guide

Modern frontend development best practices with React and TypeScript.

> **📚 Architecture Patterns:** For comprehensive architecture patterns including Atomic Design and MVVM, see the [Frontend Architecture Patterns Guide](../architecture/frontend-patterns.md).

## React Best Practices

### Component Structure
```typescript
// ✅ Functional components with TypeScript
interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user.id)}>Edit</button>
    </div>
  );
};
```

### Hooks
```typescript
// Custom hook
function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    fetchUser(id)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);
  
  return { user, loading, error };
}
```

### State Management
```typescript
// Zustand store
import create from 'zustand';

interface UserStore {
  users: User[];
  addUser: (user: User) => void;
  removeUser: (id: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  removeUser: (id) => set((state) => ({
    users: state.users.filter(u => u.id !== id)
  }))
}));
```

## Performance Optimization

```typescript
// React.memo for expensive components
export const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* render */}</div>;
});

// useMemo for expensive calculations
const filteredData = useMemo(() => {
  return data.filter(item => item.isActive);
}, [data]);

// useCallback for stable function references
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// Code splitting
const LazyComponent = lazy(() => import('./HeavyComponent'));
```

## Related Documentation

- **[Frontend Architecture Patterns](../architecture/frontend-patterns.md)** - Atomic Design, MVVM
- Full [React Guide](../react/README.md)
- [Frontend Tools](../../tools/frontend/README.md)
- [Frontend Prompts](../../prompts/frontend/README.md)

---

**Last Updated**: 2025-11-13
