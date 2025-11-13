# ⚛️ Documentación React

Guías completas sobre desarrollo web moderno con React, incluyendo componentes modulares, state management, accesibilidad, performance y SEO.

## 📚 Guías Disponibles

### [🧩 Guía de Componentes](./component-guide.md)
Patrones y mejores prácticas para crear componentes React modulares y reutilizables.

**Contenido:**
- Principios de diseño de componentes
- Compound Components
- Render Props y HOCs
- Custom Hooks
- Performance optimization
- Testing strategies

### [🔄 Estrategias de State Management](./state-management-guide.md)
Comparación detallada y guía de implementación para gestión de estado en React.

**Soluciones cubiertas:**
- Context API
- Zustand
- Redux Toolkit
- TanStack Query (React Query)
- Estrategias combinadas

### [♿ Checklist de Accesibilidad](./accessibility-checklist.md)
Checklist completo para cumplir con WCAG 2.1 nivel AA y crear aplicaciones accesibles.

**Incluye:**
- Semantic HTML
- ARIA labels y roles
- Keyboard navigation
- Screen reader support
- Contrast ratios
- Form accessibility
- Testing tools

### [🔍 Guía de SEO Básico](./seo-guide.md)
Optimización de aplicaciones React para motores de búsqueda.

**Temas:**
- Meta tags y Open Graph
- Structured data (Schema.org)
- Server-Side Rendering con Next.js
- Pre-rendering para SPAs
- Core Web Vitals
- Sitemap y robots.txt

## 🚀 Inicio Rápido

### Setup Básico con Vite

```bash
# Crear nuevo proyecto
npm create vite@latest my-app -- --template react-ts

# Instalar dependencias
cd my-app
npm install

# Iniciar dev server
npm run dev
```

### Setup con Next.js (Recomendado para SEO)

```bash
# Crear proyecto Next.js con TypeScript
npx create-next-app@latest my-app --typescript --tailwind --app

# Iniciar dev server
cd my-app
npm run dev
```

## 🛠️ Stack Recomendado

### Core
- **React 18+**: Concurrent features, Suspense
- **TypeScript**: Type safety
- **Vite** o **Next.js**: Build tools

### State Management
- **Zustand**: Apps medianas/grandes (simplicidad)
- **Redux Toolkit**: Apps enterprise (escalabilidad)
- **TanStack Query**: Server state caching
- **Context API**: Estado simple compartido

### Styling
- **Tailwind CSS**: Utility-first (recomendado)
- **CSS Modules**: Scoped CSS tradicional
- **Styled Components**: CSS-in-JS

### UI Components
- **Radix UI**: Componentes accesibles headless
- **shadcn/ui**: Componentes copiables con Radix
- **Headless UI**: Componentes accesibles (Tailwind)

### Forms
- **React Hook Form**: Performance optimizado
- **Zod**: Schema validation

### Routing
- **React Router v6**: SPAs
- **Next.js Router**: SSR/SSG apps

## 📋 Checklist de Proyecto

### Inicial
- [ ] Setup TypeScript con strict mode
- [ ] Configurar ESLint y Prettier
- [ ] Instalar eslint-plugin-jsx-a11y
- [ ] Setup folder structure
- [ ] Configurar tailwind.config.js

### Desarrollo
- [ ] Implementar componentes modulares
- [ ] Definir estrategia de state management
- [ ] Aplicar accessibility guidelines
- [ ] Optimizar performance (memoization, code splitting)
- [ ] Escribir tests unitarios

### Pre-Producción
- [ ] Auditoría de accesibilidad (Lighthouse, axe)
- [ ] Optimización de bundle size
- [ ] Core Web Vitals > 90
- [ ] SEO meta tags completos
- [ ] Structured data implementado
- [ ] Sitemap y robots.txt

### Testing
- [ ] Unit tests (componentes, hooks)
- [ ] Integration tests
- [ ] E2E tests (Playwright, Cypress)
- [ ] Accessibility tests (jest-axe)
- [ ] Visual regression tests (opcional)

## 🎯 Patrones Comunes

### Component Pattern

```typescript
// components/Card/Card.tsx
interface CardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ 
  title, 
  description, 
  children, 
  className 
}: CardProps) {
  return (
    <div className={`rounded-lg border p-4 ${className}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-gray-600 text-sm">{description}</p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  );
}
```

### Custom Hook Pattern

```typescript
// hooks/useToggle.ts
import { useState, useCallback } from 'react';

export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);
  
  const setTrue = useCallback(() => {
    setValue(true);
  }, []);
  
  const setFalse = useCallback(() => {
    setValue(false);
  }, []);
  
  return { value, toggle, setTrue, setFalse };
}

// Uso:
const { value: isOpen, toggle, setFalse } = useToggle();
```

### State Management Pattern (Zustand)

```typescript
// store/useAppStore.ts
import { create } from 'zustand';

interface AppState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),
}));
```

## 🧪 Testing

### Component Test

```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Accessibility Test

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should not have accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## 📊 Performance Metrics

### Core Web Vitals

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| **FID** | ≤ 100ms | 100ms - 300ms | > 300ms |
| **CLS** | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |

### Bundle Size Targets

- Initial bundle: < 200 KB
- Route chunks: < 100 KB
- Shared vendor: < 150 KB

## 🔧 Herramientas Esenciales

### Development
- **VS Code**: Editor recomendado
- **ES7+ React/Redux/React-Native snippets**: Snippets
- **Prettier**: Code formatting
- **ESLint**: Linting

### Testing
- **Jest**: Test runner
- **React Testing Library**: Component testing
- **Playwright/Cypress**: E2E testing
- **jest-axe**: Accessibility testing

### Performance
- **Lighthouse**: Performance audit
- **webpack-bundle-analyzer**: Bundle analysis
- **React DevTools Profiler**: Component profiling

### SEO
- **Google Search Console**: Indexing monitoring
- **Schema Markup Validator**: Structured data validation
- **PageSpeed Insights**: Core Web Vitals

## 📚 Recursos Adicionales

### Documentación Oficial
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)

### Cursos y Tutoriales
- [React Official Tutorial](https://react.dev/learn)
- [TypeScript for React Developers](https://react-typescript-cheatsheet.netlify.app/)
- [Web.dev React Performance](https://web.dev/react/)

### Comunidad
- [React Discord](https://discord.gg/react)
- [Reactiflux](https://www.reactiflux.com/)
- [r/reactjs](https://www.reddit.com/r/reactjs/)

## 🤝 Contribuir

¿Encontraste un error o quieres mejorar la documentación?

1. Crea un issue describiendo el problema o mejora
2. Haz fork del repositorio
3. Crea un branch con tus cambios
4. Envía un pull request

## 📝 Notas

- Todas las guías están escritas con React 18+ en mente
- Los ejemplos usan TypeScript
- Se asume uso de módulos ES6
- Ejemplos de styling usan Tailwind CSS

---

**Última actualización**: 2024

_Estas guías se actualizan regularmente para reflejar las mejores prácticas actuales._
