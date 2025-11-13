# 📱 Guía Completa de Expo

Documentación completa para desarrollo de aplicaciones móviles con React Native y Expo.

## 📚 Contenido

- [Inicio Rápido](#inicio-rápido)
- [Navegación](#navegación)
- [Estado](#estado)
- [Performance](#performance)
- [Deployment](#deployment)

## 🚀 Inicio Rápido

### Instalación

```bash
# Instalar Expo CLI globalmente
npm install -g expo-cli

# Crear nuevo proyecto
npx create-expo-app my-app --template

# Navegar al proyecto
cd my-app

# Iniciar desarrollo
npx expo start
```

### Configuración TypeScript

```bash
# Añadir TypeScript
npx expo install typescript @types/react @types/react-native

# Crear tsconfig.json
npx expo customize tsconfig.json
```

### Estructura Inicial

```
my-app/
├── app/                 # Expo Router screens
├── components/          # Componentes reutilizables
├── hooks/              # Custom hooks
├── services/           # API services
├── store/              # State management
├── utils/              # Utilidades
├── constants/          # Constantes
├── assets/             # Imágenes, fuentes
├── app.json            # Configuración Expo
└── package.json
```

## 🧭 Navegación

### Opción 1: Expo Router (Recomendado)

Expo Router es un sistema de navegación basado en archivos, similar a Next.js.

#### Instalación

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

#### Estructura de Carpetas

```
app/
├── _layout.tsx          # Layout raíz
├── index.tsx            # Home screen
├── (tabs)/              # Tab navigation group
│   ├── _layout.tsx
│   ├── index.tsx
│   └── settings.tsx
├── (auth)/              # Auth stack group
│   ├── login.tsx
│   └── register.tsx
├── modal.tsx            # Modal screen
└── [id].tsx            # Dynamic route
```

#### Ejemplo de Layout

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="modal" 
        options={{ presentation: 'modal' }} 
      />
    </Stack>
  );
}
```

#### Navegación Programática

```typescript
import { router } from 'expo-router';

// Navegar a una pantalla
router.push('/profile');

// Navegar con parámetros
router.push({ pathname: '/user/[id]', params: { id: '123' } });

// Regresar
router.back();

// Reemplazar
router.replace('/login');
```

#### Deep Linking

```json
// app.json
{
  "expo": {
    "scheme": "myapp",
    "web": {
      "bundler": "metro"
    }
  }
}
```

### Opción 2: React Navigation

#### Instalación

```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
```

#### Stack Navigator

```typescript
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}
```

#### Tab Navigator

```typescript
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
```

## 🔄 Estado

### Zustand (Recomendado para simplicidad)

#### Instalación

```bash
npm install zustand
```

#### Store Básico

```typescript
import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
```

#### Uso en Componente

```typescript
import { useCounterStore } from '@/store/counterStore';

function Counter() {
  const { count, increment, decrement } = useCounterStore();

  return (
    <View>
      <Text>{count}</Text>
      <Button title="+" onPress={increment} />
      <Button title="-" onPress={decrement} />
    </View>
  );
}
```

#### Persistencia con AsyncStorage

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### Redux Toolkit

#### Instalación

```bash
npm install @reduxjs/toolkit react-redux
```

#### Store Setup

```typescript
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### Slice

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```

### React Query (TanStack Query)

Para gestión de estado del servidor.

#### Instalación

```bash
npm install @tanstack/react-query
```

#### Setup

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* App content */}
    </QueryClientProvider>
  );
}
```

#### Uso

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorView error={error} />;

  return <UserListView users={data} />;
}
```

## ⚡ Performance

### Optimización de Componentes

#### 1. Memoización

```typescript
import { memo, useMemo, useCallback } from 'react';

// Memoizar componente
const ExpensiveComponent = memo(({ data }) => {
  return <View>...</View>;
});

// Memoizar valores computados
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.name.localeCompare(b.name));
}, [data]);

// Memoizar callbacks
const handlePress = useCallback(() => {
  console.log('Pressed');
}, []);
```

#### 2. FlatList Optimization

```typescript
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <ItemComponent item={item} />}
  // Performance optimizations
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={10}
  windowSize={10}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

### Optimización de Imágenes

#### Usar expo-image

```typescript
import { Image } from 'expo-image';

<Image
  source={{ uri: imageUrl }}
  placeholder={blurhash}
  contentFit="cover"
  transition={200}
  style={{ width: 300, height: 200 }}
/>
```

#### Lazy Loading

```typescript
import { Suspense, lazy } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function Screen() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Bundle Size Optimization

#### 1. Metro Config

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.minifierConfig = {
  compress: {
    drop_console: true, // Remove console.log in production
  },
};

config.transformer.getTransformOptions = async () => ({
  transform: {
    inlineRequires: true, // Better performance
  },
});

module.exports = config;
```

#### 2. Analizar Bundle

```bash
# Instalar herramienta
npx expo install @expo/webpack-config

# Analizar
npx expo export --platform web
npx source-map-explorer web-build/static/js/*.js
```

### Herramientas de Profiling

```typescript
// React DevTools Profiler
import { Profiler } from 'react';

function onRenderCallback(
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

<Profiler id="MyComponent" onRender={onRenderCallback}>
  <MyComponent />
</Profiler>
```

## 🚀 Deployment

### Configuración EAS

#### 1. Instalar EAS CLI

```bash
npm install -g eas-cli
```

#### 2. Login

```bash
eas login
```

#### 3. Configurar Proyecto

```bash
eas build:configure
```

#### 4. Configuración eas.json

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json"
      }
    }
  }
}
```

### Builds

#### Development Build

```bash
# iOS
eas build --profile development --platform ios

# Android
eas build --profile development --platform android
```

#### Production Build

```bash
# Ambas plataformas
eas build --profile production --platform all

# Solo iOS
eas build --profile production --platform ios

# Solo Android
eas build --profile production --platform android
```

### Submit a Stores

#### App Store (iOS)

```bash
eas submit --platform ios
```

**Requisitos:**
- Apple Developer Account ($99/año)
- App Store Connect configurado
- Certificados y profiles

#### Google Play (Android)

```bash
eas submit --platform android
```

**Requisitos:**
- Google Play Console account ($25 una vez)
- Service account JSON key
- App configurada en Play Console

### OTA Updates

#### Configurar Updates

```bash
# Instalar
npx expo install expo-updates

# Configurar en app.json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/[project-id]"
    }
  }
}
```

#### Publicar Update

```bash
# Update de producción
eas update --branch production --message "Bug fixes"

# Update de staging
eas update --branch staging --message "New features"
```

#### Channels y Branches

```bash
# Crear canal
eas channel:create production

# Ver canales
eas channel:list

# Vincular branch a canal
eas channel:edit production --branch production
```

### Variables de Entorno

#### En Desarrollo (.env)

```bash
# .env
API_URL=http://localhost:3000
STRIPE_KEY=pk_test_123
```

#### En app.json

```json
{
  "expo": {
    "extra": {
      "apiUrl": process.env.API_URL,
      "stripeKey": process.env.STRIPE_KEY
    }
  }
}
```

#### Acceso en Código

```typescript
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.apiUrl;
```

#### En EAS Build

```bash
# En eas.json
{
  "build": {
    "production": {
      "env": {
        "API_URL": "https://api.production.com"
      }
    }
  }
}
```

### Monitoreo y Analytics

#### Expo Analytics

```typescript
import * as Analytics from 'expo-firebase-analytics';

// Track screen
Analytics.logEvent('screen_view', {
  screen_name: 'Home',
  screen_class: 'HomeScreen',
});

// Track event
Analytics.logEvent('purchase', {
  item_id: '123',
  value: 29.99,
});
```

#### Sentry (Error Tracking)

```bash
npm install @sentry/react-native
```

```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'your-sentry-dsn',
  enableInExpoDevelopment: false,
  debug: __DEV__,
});
```

## 📚 Recursos Adicionales

### Documentación Oficial
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)
- [EAS Update](https://docs.expo.dev/eas-update/introduction/)

### Bibliotecas Útiles
- [expo-image](https://docs.expo.dev/versions/latest/sdk/image/)
- [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [expo-camera](https://docs.expo.dev/versions/latest/sdk/camera/)
- [expo-location](https://docs.expo.dev/versions/latest/sdk/location/)
- [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/)

### Herramientas de Desarrollo
- [Expo Go](https://expo.dev/client) - Testing en dispositivos
- [Expo Dev Client](https://docs.expo.dev/develop/development-builds/introduction/) - Custom development builds
- [Flipper](https://fbflipper.com/) - Debugging
- [Reactotron](https://github.com/infinitered/reactotron) - State debugging

---

_Guía creada por React Native Expo Specialist Agent_ 📱✨
