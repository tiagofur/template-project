# 📦 Monorepo Template

Template de monorepo moderno con múltiples packages y apps usando workspace managers.

## 📋 Overview

Monorepo completo con:
- **Workspace Manager**: npm workspaces, Yarn workspaces, pnpm workspaces, o Turborepo
- **Build System**: Turborepo para builds incrementales
- **Shared Packages**: Librerías compartidas entre apps
- **Multiple Apps**: Web, Mobile, API en un solo repo
- **Unified Tooling**: Linting, testing, y deployment configurados
- **CI/CD**: GitHub Actions optimizado para monorepos

## ✨ Features

### Workspace Management
- 📦 **Package Management**: npm/yarn/pnpm workspaces
- ⚡ **Turborepo**: Builds y tests incrementales
- 🔄 **Dependency Management**: Dependencias compartidas
- 🎯 **Task Orchestration**: Tareas paralelas y en pipeline
- 💾 **Remote Caching**: Cache distribuido para CI/CD
- 📊 **Dependency Graph**: Visualización de dependencias

### Apps Included
- 🌐 **Web App**: Next.js/React application
- 📱 **Mobile App**: React Native application
- 🔌 **API**: Express/NestJS backend
- 📚 **Docs**: Documentation site (Docusaurus)
- 🎨 **Design System**: Storybook

### Shared Packages
- 🎨 **UI Components**: Componentes compartidos
- 🔧 **Utils**: Utilidades comunes
- 🎯 **TypeScript Config**: Configuraciones compartidas
- 📐 **ESLint Config**: Reglas de linting
- 🎨 **Tailwind Config**: Configuración de estilos
- 📝 **Types**: TypeScript types compartidos

## 🏗️ Estructura del Proyecto

```
monorepo/
├── apps/
│   ├── web/                    # Next.js web app
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── next.config.js
│   │
│   ├── mobile/                 # React Native app
│   │   ├── src/
│   │   ├── android/
│   │   ├── ios/
│   │   └── package.json
│   │
│   ├── api/                    # Express/NestJS API
│   │   ├── src/
│   │   ├── prisma/
│   │   └── package.json
│   │
│   ├── docs/                   # Docusaurus docs
│   │   ├── docs/
│   │   ├── blog/
│   │   └── package.json
│   │
│   └── admin/                  # Admin dashboard
│       ├── src/
│       └── package.json
│
├── packages/
│   ├── ui/                     # Shared UI components
│   │   ├── src/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── utils/                  # Shared utilities
│   │   ├── src/
│   │   │   ├── date/
│   │   │   ├── string/
│   │   │   └── validation/
│   │   └── package.json
│   │
│   ├── types/                  # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── api/
│   │   │   ├── models/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── config-typescript/      # Shared TS config
│   │   ├── base.json
│   │   ├── react.json
│   │   └── package.json
│   │
│   ├── config-eslint/          # Shared ESLint config
│   │   ├── index.js
│   │   ├── react.js
│   │   └── package.json
│   │
│   └── database/               # Shared database models
│       ├── prisma/
│       ├── src/
│       └── package.json
│
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI pipeline
│       ├── deploy-web.yml      # Deploy web app
│       ├── deploy-api.yml      # Deploy API
│       └── release.yml         # Release workflow
│
├── docs/                       # Repository documentation
│   ├── architecture/
│   ├── getting-started/
│   └── contributing/
│
├── scripts/                    # Build/deployment scripts
│   ├── setup.sh
│   ├── build-all.sh
│   └── deploy.sh
│
├── turbo.json                  # Turborepo config
├── package.json                # Root package.json
├── pnpm-workspace.yaml         # pnpm workspace config
└── README.md
```

## 🚀 Quick Start

### Prerrequisitos

- Node.js 18+
- pnpm 8+ (recomendado) o npm/yarn
- Git

### Setup

1. **Copiar template**
   ```bash
   cp -r templates/projects/monorepo/* mi-monorepo/
   cd mi-monorepo
   ```

2. **Instalar dependencias**
   ```bash
   # Con pnpm (recomendado)
   pnpm install
   
   # O con npm
   npm install
   
   # O con yarn
   yarn install
   ```

3. **Setup base de datos**
   ```bash
   # Generar Prisma client
   pnpm --filter database prisma generate
   
   # Ejecutar migraciones
   pnpm --filter database prisma migrate dev
   ```

4. **Iniciar desarrollo**
   ```bash
   # Todos los apps en dev mode
   pnpm dev
   
   # O apps específicos
   pnpm --filter web dev
   pnpm --filter api dev
   pnpm --filter mobile start
   ```

## 📖 Workspace Management

### Agregar Dependencias

```bash
# Agregar a un workspace específico
pnpm --filter web add react-query

# Agregar a todos los workspaces
pnpm add -w typescript

# Agregar dependencia interna
# En apps/web/package.json
{
  "dependencies": {
    "@monorepo/ui": "workspace:*",
    "@monorepo/utils": "workspace:*"
  }
}
```

### Ejecutar Scripts

```bash
# Ejecutar en workspace específico
pnpm --filter web build
pnpm --filter api test

# Ejecutar en todos
pnpm -r build        # Recursive
pnpm -r test

# Con Turborepo (más rápido)
turbo build          # Build all con cache
turbo test           # Test all con cache
turbo dev            # Dev mode all
```

### Crear Nuevo Package

```bash
# Crear estructura
mkdir packages/my-package
cd packages/my-package

# Inicializar
pnpm init

# package.json básico
{
  "name": "@monorepo/my-package",
  "version": "0.0.1",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "lint": "eslint src/",
    "test": "jest"
  }
}
```

## ⚙️ Turborepo Configuration

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"],
      "env": ["NODE_ENV"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "cache": false
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "deploy": {
      "dependsOn": ["build", "test", "lint"],
      "outputs": []
    }
  },
  "remoteCache": {
    "signature": true
  }
}
```

## 📦 Shared Packages Usage

### UI Components

```typescript
// packages/ui/src/Button/Button.tsx
export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Usage in apps/web
import { Button } from '@monorepo/ui';

export default function HomePage() {
  return (
    <div>
      <Button variant="primary" size="lg">
        Click me
      </Button>
    </div>
  );
}
```

### Shared Utils

```typescript
// packages/utils/src/date/formatDate.ts
export function formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
  // Implementation
  return formattedDate;
}

// packages/utils/src/index.ts
export * from './date/formatDate';
export * from './string/capitalize';
export * from './validation/email';

// Usage in apps
import { formatDate, isValidEmail } from '@monorepo/utils';

const formatted = formatDate(new Date());
const valid = isValidEmail('test@example.com');
```

### Shared Types

```typescript
// packages/types/src/models/User.ts
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
}

// packages/types/src/api/responses.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Usage in API
import { User, CreateUserInput, ApiResponse } from '@monorepo/types';

export const createUser = async (
  input: CreateUserInput
): Promise<ApiResponse<User>> => {
  // Implementation
};

// Usage in Web
import { User, ApiResponse } from '@monorepo/types';

const fetchUser = async (id: string): Promise<ApiResponse<User>> => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
};
```

### Shared Database

```typescript
// packages/database/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// packages/database/src/client.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Usage in API
import { prisma } from '@monorepo/database';

export const getUser = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    include: { posts: true },
  });
};
```

## 🎯 Best Practices

### Structure
- ✅ Packages pequeños y enfocados
- ✅ Apps independientes y desacopladas
- ✅ Shared code en packages
- ✅ Dependencias internas versionadas
- ✅ Convenciones de naming consistentes

### Dependencies
- ✅ Hoisting de dependencias comunes
- ✅ Versiones sincronizadas
- ✅ Peer dependencies explícitas
- ✅ Dev dependencies en root cuando sea posible

### Build & Deploy
- ✅ Build incrementales con Turborepo
- ✅ Remote caching habilitado
- ✅ Deploy solo apps cambiadas
- ✅ Rollback granular por app
- ✅ Versioning semántico

### Testing
- ✅ Tests unitarios por package
- ✅ Integration tests por app
- ✅ E2E tests en root
- ✅ Coverage >80%

## 🧪 Testing

```bash
# Test all
turbo test

# Test específico
pnpm --filter web test
pnpm --filter api test

# Test con coverage
turbo test -- --coverage

# E2E tests
pnpm test:e2e
```

## 🚀 Deployment

```bash
# Build all
turbo build

# Build específico
pnpm --filter web build
pnpm --filter api build

# Deploy (ejemplo con Vercel)
vercel --prod

# Deploy API (ejemplo con Railway)
railway up --service api
```

## 📊 Monitoring

```bash
# Analizar bundle size
pnpm --filter web analyze

# Dependency graph
pnpm ls --depth=0

# Outdated packages
pnpm outdated -r
```

## 🔧 Troubleshooting

### Clear all caches

```bash
# Turborepo cache
turbo daemon stop
rm -rf .turbo

# pnpm cache
pnpm store prune

# Node modules
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
pnpm install
```

### Rebuild all

```bash
turbo build --force
```

## 📚 Recursos

- [Turborepo Docs](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Monorepo Best Practices](./docs/best-practices.md)
- [Contributing Guide](./docs/contributing.md)

---

_Monorepo moderno - Un repositorio, múltiples proyectos_ 📦
