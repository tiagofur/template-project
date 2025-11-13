# ♿ Checklist de Accesibilidad React

## Introducción

Esta checklist asegura que tus componentes React cumplan con las pautas WCAG 2.1 nivel AA y proporcionen una experiencia excelente para todos los usuarios, incluyendo aquellos que usan tecnologías asistivas.

## 🎯 Niveles de Conformidad WCAG

- **Nivel A**: Requisitos básicos mínimos
- **Nivel AA**: Estándar recomendado (objetivo de esta guía)
- **Nivel AAA**: Máximo nivel de accesibilidad

## 📋 Checklist Completo

### 1. Estructura Semántica HTML

#### Elementos Semánticos
- [ ] Usar `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`
- [ ] Un solo `<main>` por página
- [ ] Landmarks claramente definidos
- [ ] Headings en orden jerárquico (h1 → h2 → h3)
- [ ] No saltar niveles de heading

```tsx
// ✅ Correcto
<main>
  <h1>Título Principal</h1>
  <article>
    <h2>Sección 1</h2>
    <h3>Subsección 1.1</h3>
  </article>
  <article>
    <h2>Sección 2</h2>
  </article>
</main>

// ❌ Incorrecto
<div>
  <h1>Título</h1>
  <h3>Salta h2</h3> {/* ❌ Salta nivel */}
</div>
```

#### Listas
- [ ] Usar `<ul>`, `<ol>`, `<dl>` para contenido de lista
- [ ] No usar listas solo para indentación visual

```tsx
// ✅ Correcto
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/home">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

// ❌ Incorrecto
<div>
  <div><a href="/home">Home</a></div>
  <div><a href="/about">About</a></div>
</div>
```

### 2. Navegación por Teclado

#### Elementos Interactivos
- [ ] Todos los elementos interactivos accesibles con Tab
- [ ] Orden de tabulación lógico (sin `tabindex` positivo)
- [ ] Focus visible en todos los elementos
- [ ] Enter/Space activan botones
- [ ] Escape cierra modals/dropdowns

```tsx
// ✅ Button accesible por teclado
function Button({ onClick, children }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      {children}
    </button>
  );
}
```

#### Focus Management
- [ ] Focus indicator visible (no `outline: none` sin reemplazo)
- [ ] Focus trap en modals
- [ ] Restaurar focus al cerrar modals/dialogs
- [ ] Skip links para saltar al contenido principal

```tsx
// ✅ Skip Link
function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2"
      >
        Skip to main content
      </a>
      <header>...</header>
      <main id="main-content">{children}</main>
    </>
  );
}
```

#### Keyboard Shortcuts
- [ ] Arrow keys para navegación en lists/tabs/menus
- [ ] Home/End para inicio/fin
- [ ] Documenta atajos de teclado

```tsx
// ✅ Tab navigation con arrow keys
function Tabs() {
  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = useRef<HTMLButtonElement[]>([]);
  
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (index + 1) % tabRefs.current.length;
      tabRefs.current[nextIndex]?.focus();
      setActiveTab(nextIndex);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (index - 1 + tabRefs.current.length) % tabRefs.current.length;
      tabRefs.current[prevIndex]?.focus();
      setActiveTab(prevIndex);
    }
  };
  
  return (
    <div role="tablist">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          ref={(el) => (tabRefs.current[index] = el!)}
          role="tab"
          aria-selected={activeTab === index}
          tabIndex={activeTab === index ? 0 : -1}
          onKeyDown={(e) => handleKeyDown(e, index)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

### 3. ARIA Labels y Roles

#### Labels
- [ ] Cada input tiene un label asociado
- [ ] Usar `aria-label` cuando no hay label visible
- [ ] `aria-labelledby` para labels complejos
- [ ] `aria-describedby` para descripciones adicionales

```tsx
// ✅ Form inputs con labels
function LoginForm() {
  return (
    <form>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          aria-describedby="email-hint"
          aria-required="true"
        />
        <span id="email-hint" className="text-sm text-gray-600">
          We'll never share your email
        </span>
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          aria-required="true"
          aria-invalid={hasError}
          aria-describedby={hasError ? "password-error" : undefined}
        />
        {hasError && (
          <span id="password-error" role="alert" className="text-red-600">
            Password must be at least 8 characters
          </span>
        )}
      </div>
    </form>
  );
}
```

#### Roles
- [ ] Usar roles ARIA cuando HTML semántico no es suficiente
- [ ] `role="button"` para divs clickeables (mejor usar `<button>`)
- [ ] `role="navigation"` para navegación
- [ ] `role="alert"` para mensajes importantes

```tsx
// ✅ Custom button con role
function IconButton({ onClick, label }: IconButtonProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={label}
      className="cursor-pointer focus:ring-2"
    >
      <Icon />
    </div>
  );
}

// ✅✅ Mejor: usar button nativo
function IconButton({ onClick, label }: IconButtonProps) {
  return (
    <button onClick={onClick} aria-label={label}>
      <Icon />
    </button>
  );
}
```

#### Estados ARIA
- [ ] `aria-expanded` para elementos expandibles
- [ ] `aria-selected` para opciones seleccionadas
- [ ] `aria-checked` para checkboxes custom
- [ ] `aria-pressed` para toggle buttons
- [ ] `aria-current` para página/item actual
- [ ] `aria-hidden` para ocultar de screen readers

```tsx
// ✅ Accordion accesible
function Accordion({ title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();
  const buttonId = useId();
  
  return (
    <div>
      <button
        id={buttonId}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        {title}
        <ChevronIcon className={isOpen ? 'rotate-180' : ''} aria-hidden="true" />
      </button>
      
      <div
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
      >
        {children}
      </div>
    </div>
  );
}
```

### 4. Live Regions (Contenido Dinámico)

- [ ] `aria-live="polite"` para actualizaciones no urgentes
- [ ] `aria-live="assertive"` para actualizaciones urgentes
- [ ] `role="status"` para mensajes de estado
- [ ] `role="alert"` para errores/warnings

```tsx
// ✅ Toast notifications accesibles
function Toast({ message, type }: ToastProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`toast toast-${type}`}
    >
      {message}
    </div>
  );
}

// ✅ Loading state
function DataTable({ data, loading }: DataTableProps) {
  return (
    <div>
      {loading && (
        <div role="status" aria-live="polite">
          Loading data...
        </div>
      )}
      
      {data && (
        <table>
          <caption className="sr-only">User data</caption>
          {/* table content */}
        </table>
      )}
    </div>
  );
}
```

### 5. Contraste de Color

#### Requisitos WCAG AA
- [ ] Ratio mínimo 4.5:1 para texto normal (<18px o <14px bold)
- [ ] Ratio mínimo 3:1 para texto grande (≥18px o ≥14px bold)
- [ ] Ratio mínimo 3:1 para componentes UI e iconos
- [ ] No depender solo del color para transmitir información

```tsx
// ✅ Estados con más que solo color
function StatusBadge({ status }: { status: 'success' | 'error' | 'warning' }) {
  const config = {
    success: { icon: '✓', label: 'Success', color: 'bg-green-100 text-green-800' },
    error: { icon: '✗', label: 'Error', color: 'bg-red-100 text-red-800' },
    warning: { icon: '!', label: 'Warning', color: 'bg-yellow-100 text-yellow-800' },
  };
  
  const { icon, label, color } = config[status];
  
  return (
    <span className={`${color} px-2 py-1 rounded`}>
      <span aria-hidden="true">{icon}</span>
      <span className="ml-1">{label}</span>
    </span>
  );
}
```

#### Herramientas de Testing
- [ ] [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ ] Chrome DevTools Contrast ratio
- [ ] [Colour Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

### 6. Formularios Accesibles

#### Estructura
- [ ] Todos los inputs tienen labels
- [ ] Required fields marcados visualmente y con `aria-required`
- [ ] Error messages asociados con `aria-describedby`
- [ ] `aria-invalid` en campos con error
- [ ] Autocomplete attributes apropiados

```tsx
// ✅ Form field accesible completo
function FormField({
  label,
  name,
  type = 'text',
  required = false,
  error,
  hint,
  ...props
}: FormFieldProps) {
  const inputId = useId();
  const errorId = useId();
  const hintId = useId();
  
  return (
    <div>
      <label htmlFor={inputId}>
        {label}
        {required && <span aria-label="required">*</span>}
      </label>
      
      {hint && (
        <p id={hintId} className="text-sm text-gray-600">
          {hint}
        </p>
      )}
      
      <input
        id={inputId}
        name={name}
        type={type}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={
          [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined
        }
        {...props}
      />
      
      {error && (
        <p id={errorId} role="alert" className="text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
```

#### Autocomplete
- [ ] Usar autocomplete para datos comunes

```tsx
<input
  type="email"
  name="email"
  autoComplete="email"
/>

<input
  type="tel"
  name="phone"
  autoComplete="tel"
/>

<input
  type="text"
  name="name"
  autoComplete="name"
/>
```

### 7. Imágenes y Media

#### Alt Text
- [ ] Todas las imágenes tienen `alt`
- [ ] Alt text descriptivo para imágenes informativas
- [ ] `alt=""` para imágenes decorativas
- [ ] No usar "imagen de" o "foto de"

```tsx
// ✅ Imágenes accesibles
<img 
  src="user-avatar.jpg" 
  alt="John Doe" 
/>

<img 
  src="decorative-line.svg" 
  alt="" 
  aria-hidden="true"
/>

// Icon con label
<button>
  <TrashIcon aria-hidden="true" />
  <span>Delete</span>
</button>

// Icon button
<button aria-label="Delete item">
  <TrashIcon aria-hidden="true" />
</button>
```

#### Video y Audio
- [ ] Subtítulos para videos (captions)
- [ ] Transcripciones para audio
- [ ] Controles accesibles por teclado
- [ ] No autoplay con sonido

```tsx
// ✅ Video accesible
<video controls>
  <source src="video.mp4" type="video/mp4" />
  <track
    kind="captions"
    src="captions.vtt"
    srclang="es"
    label="Español"
    default
  />
  Your browser doesn't support video.
</video>
```

### 8. Modals y Dialogs

#### Accesibilidad de Modal
- [ ] Focus trap dentro del modal
- [ ] Escape cierra el modal
- [ ] Focus retorna al elemento que abrió el modal
- [ ] `role="dialog"` o `role="alertdialog"`
- [ ] `aria-modal="true"`
- [ ] `aria-labelledby` apunta al título
- [ ] Background no accesible cuando modal está abierto

```tsx
// ✅ Modal accesible
function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      dialogRef.current?.focus();
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <h2 id="modal-title">{title}</h2>
        
        {children}
        
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
```

### 9. Tablas

- [ ] `<caption>` para describir la tabla
- [ ] `<th>` para headers con `scope`
- [ ] Tablas complejas con `headers` attribute

```tsx
// ✅ Tabla accesible
function DataTable({ data }: { data: User[] }) {
  return (
    <table>
      <caption className="sr-only">
        User information including name, email, and role
      </caption>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Role</th>
        </tr>
      </thead>
      <tbody>
        {data.map((user) => (
          <tr key={user.id}>
            <th scope="row">{user.name}</th>
            <td>{user.email}</td>
            <td>{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### 10. Responsive y Touch Targets

- [ ] Targets táctiles mínimo 44x44px (WCAG 2.1)
- [ ] Spacing adecuado entre elementos interactivos
- [ ] Viewport meta tag configurado
- [ ] Zoom habilitado (no `user-scalable=no`)

```tsx
// ✅ Touch targets adecuados
<button className="min-h-[44px] min-w-[44px] p-3">
  Click me
</button>

// ✅ Viewport meta
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

### 11. Enlaces y Navegación

- [ ] Texto de enlace descriptivo (no "click aquí")
- [ ] Enlaces externos indicados
- [ ] `aria-current="page"` para página actual
- [ ] Breadcrumbs con estructura apropiada

```tsx
// ❌ Enlace no descriptivo
<a href="/article">Click here</a>

// ✅ Enlace descriptivo
<a href="/article">Read full article about accessibility</a>

// ✅ Enlace externo
<a 
  href="https://example.com" 
  target="_blank"
  rel="noopener noreferrer"
>
  Visit example.com
  <span className="sr-only">(opens in new window)</span>
  <ExternalLinkIcon aria-hidden="true" />
</a>

// ✅ Nav con current page
<nav aria-label="Main">
  <ul>
    <li>
      <a href="/home" aria-current="page">Home</a>
    </li>
    <li>
      <a href="/about">About</a>
    </li>
  </ul>
</nav>
```

## 🧪 Testing de Accesibilidad

### Herramientas Automatizadas

#### 1. eslint-plugin-jsx-a11y

```bash
npm install --save-dev eslint-plugin-jsx-a11y
```

```json
// .eslintrc.json
{
  "extends": [
    "plugin:jsx-a11y/recommended"
  ]
}
```

#### 2. axe-core con React Testing Library

```bash
npm install --save-dev jest-axe
```

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should not have accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

#### 3. Chrome DevTools Lighthouse

- [ ] Run Lighthouse accessibility audit
- [ ] Aim for score > 90
- [ ] Fix all issues found

#### 4. Browser Extensions

- [ ] [axe DevTools](https://www.deque.com/axe/devtools/)
- [ ] [WAVE](https://wave.webaim.org/extension/)
- [ ] [IBM Equal Access Accessibility Checker](https://www.ibm.com/able/toolkit/tools)

### Testing Manual

#### Screen Readers
- [ ] Test con NVDA (Windows)
- [ ] Test con JAWS (Windows)
- [ ] Test con VoiceOver (Mac/iOS)
- [ ] Test con TalkBack (Android)

#### Keyboard Navigation
- [ ] Navigate página completa solo con teclado
- [ ] Verificar focus order lógico
- [ ] Probar todos los elementos interactivos
- [ ] Verificar modals y dropdowns

#### Zoom y Responsiveness
- [ ] Test con 200% zoom
- [ ] Verificar en diferentes tamaños de pantalla
- [ ] Test en modo landscape y portrait

## 📊 Niveles de Prioridad

### 🔴 Crítico (Bloqueante)
- Keyboard navigation rota
- Imágenes sin alt
- Inputs sin labels
- Contrast ratio < 3:1
- Modals sin focus trap

### 🟡 Alto (Importante)
- Contrast ratio < 4.5:1
- Headings fuera de orden
- ARIA roles incorrectos
- Links no descriptivos

### 🟢 Medio (Mejora)
- Missing landmarks
- Touch targets < 44px
- Autocomplete faltante
- Redundant ARIA

## 📚 Recursos

### Documentación
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### Herramientas
- [WebAIM](https://webaim.org/)
- [a11y Project](https://www.a11yproject.com/)
- [Inclusive Components](https://inclusive-components.design/)

### Cursos
- [Web Accessibility by Google](https://www.udacity.com/course/web-accessibility--ud891)
- [Digital Accessibility Foundations](https://www.w3.org/WAI/fundamentals/)

---

**Última actualización**: 2024

_Esta checklist debe ser revisada periódicamente y actualizada con nuevas mejores prácticas._
