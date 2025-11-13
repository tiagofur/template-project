# 🎨 Frontend Project Setup Guide

Guía completa para configurar un proyecto frontend moderno desde cero con mejores prácticas.

## 📋 Tabla de Contenidos

- [Decisiones Iniciales](#decisiones-iniciales)
- [Setup React](#setup-react)
- [Setup Vue](#setup-vue)
- [Estructura de Proyecto](#estructura-de-proyecto)
- [Configuración de Estilos](#configuración-de-estilos)
- [Setup de Testing](#setup-de-testing)
- [State Management](#state-management)
- [Checklist Final](#checklist-final)

## 🎯 Decisiones Iniciales

### 1. Seleccionar Framework

#### React Stack
**Cuándo elegir:**
- Gran ecosistema de librerías
- Necesitas flexibilidad
- Equipo con experiencia React
- SPA o aplicación compleja

**Stack recomendado:**
```
Framework: React 18+
Meta-framework: Next.js 14+
Build tool: Vite
Lenguaje: TypeScript
Styling: Tailwind CSS
State: Redux Toolkit / Zustand
Testing: Vitest + React Testing Library
```

#### Vue Stack
**Cuándo elegir:**
- Curva de aprendizaje suave
- Aplicaciones progresivas
- Documentación en español
- Developer experience excelente

**Stack recomendado:**
```
Framework: Vue 3
Meta-framework: Nuxt 3
Build tool: Vite
Lenguaje: TypeScript
Styling: Tailwind CSS
State: Pinia
Testing: Vitest + Vue Testing Library
```

## ⚛️ Setup React

### Opción 1: Vite + React (Recomendado)

```bash
# Crear proyecto
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install

# Dependencias adicionales
npm install react-router-dom
npm install @tanstack/react-query axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Opción 2: Next.js (Full-Stack)

```bash
# Crear proyecto
npx create-next-app@latest my-app
cd my-app

# Seleccionar opciones:
# ✔ TypeScript? Yes
# ✔ ESLint? Yes
# ✔ Tailwind CSS? Yes
# ✔ src/ directory? Yes
# ✔ App Router? Yes
# ✔ Import alias (@/*)? Yes

npm run dev
```

### Estructura de Proyecto (Vite + React)

```
my-app/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   │       └── index.css
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   └── Input.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── Layout.tsx
│   ├── features/
│   │   └── auth/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── services/
│   │       └── types.ts
│   ├── hooks/
│   │   └── useLocalStorage.ts
│   ├── lib/
│   │   ├── api.ts
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   └── NotFound.tsx
│   ├── routes/
│   │   └── index.tsx
│   ├── store/
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

### Configurar Tailwind CSS

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
      },
    },
  },
  plugins: [],
}
```

```css
/* src/assets/styles/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition;
  }
}
```

### Configurar React Router

```typescript
// src/routes/index.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import About from '@/pages/About';
import NotFound from '@/pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
```

```typescript
// src/App.tsx
import Routes from './routes';

function App() {
  return <Routes />;
}

export default App;
```

### Setup API Client

```typescript
// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 💚 Setup Vue

### Opción 1: Vite + Vue (Recomendado)

```bash
# Crear proyecto
npm create vite@latest my-app -- --template vue-ts
cd my-app
npm install

# Dependencias adicionales
npm install vue-router pinia
npm install axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Opción 2: Nuxt 3 (Full-Stack)

```bash
# Crear proyecto
npx nuxi@latest init my-app
cd my-app
npm install

npm run dev
```

### Estructura de Proyecto (Vite + Vue)

```
my-app/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   │       └── main.css
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.vue
│   │   │   └── Input.vue
│   │   └── layout/
│   │       ├── Header.vue
│   │       ├── Footer.vue
│   │       └── Layout.vue
│   ├── composables/
│   │   └── useAuth.ts
│   ├── router/
│   │   └── index.ts
│   ├── stores/
│   │   └── user.ts
│   ├── views/
│   │   ├── Home.vue
│   │   └── About.vue
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── api.ts
│   │   └── helpers.ts
│   ├── App.vue
│   ├── main.ts
│   └── vite-env.d.ts
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

### Configurar Vue Router

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
```

### Setup Pinia (State Management)

```typescript
// src/stores/user.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));

  const isAuthenticated = computed(() => !!token.value);

  function setUser(userData: User) {
    user.value = userData;
  }

  function setToken(newToken: string) {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
  }

  return {
    user,
    token,
    isAuthenticated,
    setUser,
    setToken,
    logout,
  };
});
```

## 🧪 Setup de Testing

### Vitest + React Testing Library

```bash
npm install -D vitest @vitest/ui
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D jsdom
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

```typescript
// src/test/setup.ts
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

```typescript
// src/components/Button.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Scripts de Testing

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\""
  }
}
```

## 🎨 Configuración de Estilos

### CSS Modules

```typescript
// Button.module.css
.button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
}

.primary {
  background-color: #3B82F6;
  color: white;
}
```

```typescript
// Button.tsx
import styles from './Button.module.css';

export default function Button({ variant = 'primary', children }) {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      {children}
    </button>
  );
}
```

### Styled Components

```bash
npm install styled-components
npm install -D @types/styled-components
```

```typescript
import styled from 'styled-components';

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  background-color: ${props => props.variant === 'primary' ? '#3B82F6' : '#6B7280'};
  color: white;
  
  &:hover {
    opacity: 0.9;
  }
`;

export default Button;
```

## 🗄️ State Management

### Redux Toolkit (React)

```bash
npm install @reduxjs/toolkit react-redux
```

```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```typescript
// src/store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
```

### Zustand (React - Alternative Ligera)

```bash
npm install zustand
```

```typescript
// src/store/useUserStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);
```

## 🔐 Variables de Entorno

### .env.example

```bash
# API
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=My App

# Auth
VITE_AUTH_DOMAIN=auth.example.com
VITE_AUTH_CLIENT_ID=your-client-id

# Feature Flags
VITE_ENABLE_ANALYTICS=false
```

## ✅ Checklist Final

### Setup Básico
- [ ] Proyecto creado con Vite/Next.js
- [ ] TypeScript configurado
- [ ] ESLint y Prettier instalados
- [ ] Tailwind CSS configurado
- [ ] Git inicializado

### Routing y Navigation
- [ ] React Router / Vue Router configurado
- [ ] Rutas principales definidas
- [ ] Layout components creados
- [ ] 404 page implementada

### State Management
- [ ] Store configurado (Redux/Pinia/Zustand)
- [ ] Actions/mutations definidas
- [ ] Persistence (si necesario)

### API Integration
- [ ] Axios/fetch configurado
- [ ] API client con interceptors
- [ ] Error handling
- [ ] Loading states

### Styling
- [ ] Design system básico
- [ ] Componentes comunes (Button, Input, etc.)
- [ ] Responsive design
- [ ] Dark mode (opcional)

### Testing
- [ ] Testing framework configurado
- [ ] Tests de componentes básicos
- [ ] Coverage threshold definido

### Performance
- [ ] Code splitting configurado
- [ ] Lazy loading en rutas
- [ ] Imágenes optimizadas
- [ ] Bundle analyzer (opcional)

### Security
- [ ] Variables de entorno
- [ ] XSS protection
- [ ] CSRF tokens (si aplica)
- [ ] Content Security Policy

### Documentation
- [ ] README con instrucciones
- [ ] .env.example actualizado
- [ ] Component documentation
- [ ] Storybook (opcional)

## 🚀 Próximos Pasos

1. **UI Component Library**
   - Implementar design system
   - Storybook para documentación
   - Accessibility testing

2. **Autenticación**
   - Login/Register flows
   - Protected routes
   - Token refresh

3. **Performance**
   - Lighthouse audit
   - Bundle optimization
   - Lazy loading

4. **Testing**
   - E2E tests con Playwright
   - Visual regression tests
   - Integration tests

5. **CI/CD**
   - GitHub Actions
   - Automated tests
   - Deployment pipeline

## 📚 Recursos

- [Frontend Tools](./README.md)
- [Best Practices](../BEST_PRACTICES.md)
- [React Docs](https://react.dev/)
- [Vue Docs](https://vuejs.org/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind Docs](https://tailwindcss.com/)

---

_Frontend Setup Guide - Construyendo interfaces modernas desde cero_ 🎨
