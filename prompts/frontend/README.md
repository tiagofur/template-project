# 🎨 Frontend Prompts

Prompts especializados para desarrollo frontend, componentes UI, state management y experiencia de usuario.

## 📋 Categorías

### React Components
- [React Component](./react-component.md) - Crear componentes React reutilizables
- [React Hook](./react-hook.md) - Custom hooks para lógica reutilizable
- [Form Component](./form-component.md) - Formularios con validación
- [Data Table](./data-table.md) - Tablas con paginación y filtros
- [Modal Dialog](./modal-dialog.md) - Diálogos modales accesibles

### State Management
- [Redux Setup](./redux-setup.md) - Configurar Redux Toolkit
- [Zustand Store](./zustand-store.md) - State management con Zustand
- [Context API](./context-api.md) - Context API para estado global
- [React Query](./react-query.md) - Manejo de datos del servidor

### UI/UX Implementation
- [Responsive Layout](./responsive-layout.md) - Layouts responsive
- [Theme System](./theme-system.md) - Sistema de temas dark/light
- [Animation](./animation.md) - Animaciones y transiciones
- [Loading States](./loading-states.md) - Estados de carga

### Performance & SEO
- [Code Splitting](./code-splitting.md) - Dividir código para performance
- [Image Optimization](./image-optimization.md) - Optimizar imágenes
- [SEO Meta Tags](./seo-meta-tags.md) - Meta tags para SEO
- [Performance Optimization](./performance-optimization.md) - Optimizar rendimiento

### Accessibility
- [Accessible Form](./accessible-form.md) - Formularios accesibles
- [Keyboard Navigation](./keyboard-navigation.md) - Navegación por teclado
- [ARIA Implementation](./aria-implementation.md) - Atributos ARIA
- [Screen Reader](./screen-reader.md) - Soporte para lectores de pantalla

## 🎯 Guía de Uso

### Selección de Prompt

1. **Identifica el componente** que necesitas crear
2. **Revisa la categoría** correspondiente
3. **Lee el contexto** y prerequisitos
4. **Adapta a tu proyecto** según tu stack

### Stack Soportado

Los prompts funcionan con:

- **React:** Create React App, Next.js, Vite, Remix
- **Vue:** Vue 3, Nuxt.js
- **Angular:** Angular 15+
- **Styling:** Tailwind CSS, CSS Modules, Styled Components, Emotion
- **State:** Redux, Zustand, MobX, Recoil

### Variables Comunes

- `{{component_name}}`: Nombre del componente
- `{{styling_solution}}`: Solución de estilos (Tailwind, CSS Modules, etc.)
- `{{state_manager}}`: Gestor de estado (Redux, Zustand, etc.)
- `{{ui_library}}`: Librería UI (Material-UI, Chakra UI, etc.)
- `{{framework}}`: Framework (React, Vue, Angular)

## 💡 Tips Generales

### Componentes

- Hazlos pequeños y reutilizables
- Un componente = una responsabilidad
- Usa TypeScript para type safety
- Implementa prop validation
- Documenta props y uso

### State Management

- Usa estado local cuando sea posible
- Estado global solo para datos compartidos
- Normaliza la estructura del estado
- Evita duplicación de datos
- Implementa selectors memoizados

### Performance

- Usa React.memo para componentes puros
- Implementa lazy loading
- Optimiza re-renders
- Code splitting por rutas
- Virtualiza listas largas

### Accesibilidad

- Usa HTML semántico
- Implementa ARIA labels
- Soporte para teclado
- Contraste de colores adecuado
- Textos alternativos para imágenes

## 📚 Recursos Adicionales

- [React Component Guide](../../docs/react/component-guide.md)
- [State Management Guide](../../docs/react/state-management-guide.md)
- [Accessibility Checklist](../../docs/react/accessibility-checklist.md)
- [SEO Guide](../../docs/react/seo-guide.md)

---

_Frontend Prompts - Construyendo interfaces excepcionales_ 🎨
