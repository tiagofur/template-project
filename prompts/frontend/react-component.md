# React Component

**Categoría:** Frontend  
**Nivel:** Básico  
**Tecnologías:** React, TypeScript

## Objetivo

Crear un componente React modular, reutilizable y bien tipado que siga las mejores prácticas modernas de React.

## Contexto

Este prompt genera componentes React funcionales con TypeScript, hooks, y estructura clara. Ideal para crear componentes UI consistentes y mantenibles.

## Prompt

```
Crea un componente React llamado {{ComponentName}} usando TypeScript y {{styling_solution}}.

Requisitos:

1. Estructura del componente:
   - Functional component con TypeScript
   - Props interface bien definida
   - PropTypes o Zod para validación en runtime (opcional)
   - Exportación named y default

2. Props necesarias:
   {{list_required_props}}

3. Funcionalidad:
   {{describe_functionality}}

4. Estado interno (si es necesario):
   - Usa useState para estado local
   - useEffect para side effects
   - useMemo/useCallback para optimización

5. Styling:
   - Usa {{styling_solution}}
   - Responsive design (mobile-first)
   - Variables para colores y espaciado
   - Estados hover, active, disabled

6. Accesibilidad:
   - ARIA labels apropiados
   - Navegación por teclado
   - Roles semánticos
   - Focus indicators visibles

7. Testing:
   - Tests unitarios básicos
   - Test de renderizado
   - Test de interacciones
   - Test de props

8. Documentación:
   - JSDoc para el componente
   - Ejemplos de uso
   - Props documentation
   - Storybook story (opcional)

Estructura de archivos:
```
ComponentName/
├── ComponentName.tsx
├── ComponentName.module.css (si usa CSS Modules)
├── ComponentName.test.tsx
├── ComponentName.stories.tsx (opcional)
├── types.ts
└── index.ts
```
```

## Ejemplo de Uso

### Variables a reemplazar:

- `{{ComponentName}}`: "Button"
- `{{styling_solution}}`: "Tailwind CSS"
- `{{list_required_props}}`: "label, onClick, variant (primary/secondary), disabled"
- `{{describe_functionality}}`: "Botón reutilizable con diferentes variantes visuales, estados de carga, y soporte para iconos"

### Prompt adaptado:

```
Crea un componente React llamado Button usando TypeScript y Tailwind CSS.

Requisitos:

1. Estructura del componente:
   - Functional component con TypeScript
   - Props interface bien definida
   - Exportación named y default

2. Props necesarias:
   label, onClick, variant (primary/secondary), disabled

3. Funcionalidad:
   Botón reutilizable con diferentes variantes visuales, estados de carga, y soporte para iconos

[... resto del prompt ...]
```

## Resultados Esperados

### 1. Componente Principal (Button.tsx)

```typescript
import React from 'react';
import { ButtonProps } from './types';

/**
 * Button component - Reusable button with multiple variants
 * 
 * @example
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onClick,
  className = '',
  ...rest
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-500'
  };
  
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };
  
  const disabledClasses = 'opacity-50 cursor-not-allowed';
  
  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${disabled || loading ? disabledClasses : ''}
    ${className}
  `.trim();
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };
  
  return (
    <button
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading ? (
        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : icon && iconPosition === 'left' ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' ? (
        <span className="ml-2">{icon}</span>
      ) : null}
    </button>
  );
};

Button.displayName = 'Button';

export default Button;
```

### 2. Types (types.ts)

```typescript
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';
export type IconPosition = 'left' | 'right';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children: React.ReactNode;
  
  /** Visual variant of the button */
  variant?: ButtonVariant;
  
  /** Size of the button */
  size?: ButtonSize;
  
  /** Whether the button is disabled */
  disabled?: boolean;
  
  /** Whether the button is in loading state */
  loading?: boolean;
  
  /** Optional icon to display */
  icon?: React.ReactNode;
  
  /** Position of the icon */
  iconPosition?: IconPosition;
  
  /** Click handler */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  
  /** Additional CSS classes */
  className?: string;
}
```

### 3. Tests (Button.test.tsx)

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
  
  it('shows loading state', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });
  
  it('applies variant classes correctly', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');
    
    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-gray-200');
  });
  
  it('renders with icon', () => {
    const Icon = () => <span data-testid="icon">🚀</span>;
    render(<Button icon={<Icon />}>With Icon</Button>);
    
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
```

### 4. Index (index.ts)

```typescript
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './types';
```

## Tips Adicionales

### Variaciones del componente:

1. **Con animaciones:**
   ```
   Agrega animaciones usando Framer Motion para hover y click.
   ```

2. **Con tooltip:**
   ```
   Agrega soporte para tooltip usando Radix UI o Headless UI.
   ```

3. **Como link:**
   ```
   Agrega variante que funcione como link de React Router o Next.js Link.
   ```

4. **Con dropdown:**
   ```
   Convierte en ButtonGroup con menú dropdown.
   ```

### Optimizaciones:

```
Optimiza re-renders usando React.memo y useCallback para onClick.
Implementa debouncing para clicks rápidos.
```

### Storybook:

```
Crea Storybook stories para todas las variantes y estados.
Incluye controles para todas las props.
```

## Casos de Uso

- ✅ Botones de acción
- ✅ Formularios
- ✅ Navegación
- ✅ CTAs (Call to Action)
- ✅ Componentes de UI libraries

## Tecnologías Compatibles

- **Frameworks:** React, Next.js, Remix, Gatsby
- **Styling:** Tailwind CSS, CSS Modules, Styled Components, Emotion, Sass
- **Testing:** Jest, React Testing Library, Vitest

---

_React Component - Construyendo bloques reutilizables_ ⚛️
