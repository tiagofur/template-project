# 📱 Mobile Project Setup Guide

Guía completa para configurar un proyecto de aplicación móvil desde cero con mejores prácticas.

## 📋 Tabla de Contenidos

- [Decisiones Iniciales](#decisiones-iniciales)
- [Setup React Native](#setup-react-native)
- [Setup Flutter](#setup-flutter)
- [Estructura de Proyecto](#estructura-de-proyecto)
- [Navegación](#navegación)
- [State Management](#state-management)
- [Setup de Testing](#setup-de-testing)
- [Checklist Final](#checklist-final)

## 🎯 Decisiones Iniciales

### 1. Seleccionar Framework

#### React Native + Expo
**Cuándo elegir:**
- Experiencia en React/JavaScript
- Rapid prototyping
- OTA updates necesarios
- Code sharing con web

**Stack recomendado:**
```
Framework: React Native
Platform: Expo (managed workflow)
Navegación: React Navigation
State: Redux Toolkit / Zustand
Backend: Firebase / Supabase
Testing: Jest + React Native Testing Library
```

#### Flutter
**Cuándo elegir:**
- Performance crítica
- UI muy personalizada
- Hot reload más rápido
- Equipo dispuesto a aprender Dart

**Stack recomendado:**
```
Framework: Flutter
Lenguaje: Dart
State: Provider / Riverpod / Bloc
Backend: Firebase / Supabase
Testing: Flutter Test
Navigation: GoRouter
```

## ⚛️ Setup React Native

### Opción 1: Expo (Recomendado para empezar)

```bash
# Instalar Expo CLI
npm install -g expo-cli

# Crear proyecto
npx create-expo-app my-app
cd my-app

# Instalar dependencias adicionales
npx expo install react-native-safe-area-context
npx expo install @react-navigation/native @react-navigation/stack
npx expo install expo-font expo-splash-screen

# Iniciar proyecto
npx expo start
```

### Opción 2: React Native CLI (Bare workflow)

```bash
# Crear proyecto
npx react-native init MyApp --template react-native-template-typescript
cd MyApp

# iOS (requiere Mac)
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

### Estructura de Proyecto (Expo + React Native)

```
my-app/
├── app/                    # Expo Router (si usas file-based routing)
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── profile.tsx
│   ├── _layout.tsx
│   └── +not-found.tsx
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   └── layout/
│   │       └── Screen.tsx
│   ├── features/
│   │   └── auth/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── screens/
│   │       └── types.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useTheme.ts
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   └── types.ts
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/
│   │   └── api.ts
│   ├── store/
│   │   └── index.ts
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   └── typography.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       └── helpers.ts
├── assets/
│   ├── fonts/
│   ├── images/
│   └── icons/
├── .env.example
├── app.json
├── package.json
└── tsconfig.json
```

### Configurar React Navigation

```bash
npx expo install react-native-screens react-native-safe-area-context
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
```

```typescript
// src/navigation/AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/screens/HomeScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import SettingsScreen from '@/screens/SettingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Main" 
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Configurar Theme

```typescript
// src/theme/colors.ts
export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  danger: '#FF3B30',
  warning: '#FF9500',
  info: '#5AC8FA',
  light: '#F2F2F7',
  dark: '#1C1C1E',
  text: {
    primary: '#000000',
    secondary: '#3C3C43',
    tertiary: '#8E8E93',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F2F2F7',
  },
};

// src/theme/spacing.ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

// src/theme/typography.ts
export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal' as const,
  },
};
```

### Setup API Client

```typescript
// src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      // Navigate to login
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 🎨 Setup Flutter

### Crear Proyecto

```bash
# Verificar instalación
flutter doctor

# Crear proyecto
flutter create my_app
cd my_app

# Ejecutar en emulador/dispositivo
flutter run
```

### Estructura de Proyecto (Flutter)

```
my_app/
├── lib/
│   ├── core/
│   │   ├── constants/
│   │   │   └── app_constants.dart
│   │   ├── theme/
│   │   │   ├── app_theme.dart
│   │   │   └── app_colors.dart
│   │   ├── utils/
│   │   │   └── helpers.dart
│   │   └── widgets/
│   │       ├── custom_button.dart
│   │       └── custom_input.dart
│   ├── features/
│   │   └── auth/
│   │       ├── data/
│   │       │   ├── models/
│   │       │   ├── repositories/
│   │       │   └── datasources/
│   │       ├── domain/
│   │       │   ├── entities/
│   │       │   ├── repositories/
│   │       │   └── usecases/
│   │       └── presentation/
│   │           ├── pages/
│   │           ├── widgets/
│   │           └── providers/
│   ├── routes/
│   │   └── app_router.dart
│   └── main.dart
├── assets/
│   ├── fonts/
│   ├── images/
│   └── icons/
├── test/
├── pubspec.yaml
└── README.md
```

### Configurar Dependencies (pubspec.yaml)

```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # State Management
  provider: ^6.0.5
  # o riverpod: ^2.3.0
  # o flutter_bloc: ^8.1.0
  
  # Navigation
  go_router: ^10.0.0
  
  # Network
  http: ^1.1.0
  dio: ^5.3.0
  
  # Storage
  shared_preferences: ^2.2.0
  
  # UI
  google_fonts: ^5.1.0
  flutter_svg: ^2.0.7
  cached_network_image: ^3.2.3
  
  # Utils
  intl: ^0.18.0
  uuid: ^3.0.7

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.0
  mockito: ^5.4.0
```

### Configurar Theme (Flutter)

```dart
// lib/core/theme/app_colors.dart
import 'package:flutter/material.dart';

class AppColors {
  static const Color primary = Color(0xFF007AFF);
  static const Color secondary = Color(0xFF5856D6);
  static const Color success = Color(0xFF34C759);
  static const Color danger = Color(0xFFFF3B30);
  static const Color warning = Color(0xFFFF9500);
  
  static const Color textPrimary = Color(0xFF000000);
  static const Color textSecondary = Color(0xFF3C3C43);
  static const Color backgroundPrimary = Color(0xFFFFFFFF);
  static const Color backgroundSecondary = Color(0xFFF2F2F7);
}

// lib/core/theme/app_theme.dart
import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primary,
        brightness: Brightness.light,
      ),
      appBarTheme: const AppBarTheme(
        centerTitle: true,
        elevation: 0,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.symmetric(
            horizontal: 24,
            vertical: 12,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
    );
  }
  
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primary,
        brightness: Brightness.dark,
      ),
    );
  }
}
```

### Configurar Navigation (Flutter)

```dart
// lib/routes/app_router.dart
import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';

final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/profile',
      builder: (context, state) => const ProfileScreen(),
    ),
    GoRoute(
      path: '/settings',
      builder: (context, state) => const SettingsScreen(),
    ),
  ],
);
```

### Main App (Flutter)

```dart
// lib/main.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_theme.dart';
import 'routes/app_router.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'My App',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      routerConfig: router,
    );
  }
}
```

## 🧪 Setup de Testing

### React Native + Jest

```bash
npm install --save-dev @testing-library/react-native @testing-library/jest-native
```

```javascript
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
};
```

```typescript
// src/components/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button onPress={onPress}>Click me</Button>
    );
    
    fireEvent.press(getByText('Click me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

### Flutter Testing

```dart
// test/widget_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:my_app/main.dart';

void main() {
  testWidgets('Counter increments smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());

    expect(find.text('0'), findsOneWidget);
    expect(find.text('1'), findsNothing);

    await tester.tap(find.byIcon(Icons.add));
    await tester.pump();

    expect(find.text('0'), findsNothing);
    expect(find.text('1'), findsOneWidget);
  });
}
```

## 🔐 Variables de Entorno

### React Native / Expo

```bash
# .env.example
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_APP_NAME=My App
EXPO_PUBLIC_ENABLE_ANALYTICS=false
```

### Flutter

```dart
// lib/core/constants/app_constants.dart
class AppConstants {
  static const String apiUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://localhost:3000/api',
  );
  
  static const String appName = String.fromEnvironment(
    'APP_NAME',
    defaultValue: 'My App',
  );
}
```

## ✅ Checklist Final

### Setup Básico
- [ ] Proyecto creado (Expo/Flutter)
- [ ] Dependencias instaladas
- [ ] Git inicializado
- [ ] .gitignore configurado
- [ ] Running en emulador/dispositivo

### UI/UX
- [ ] Theme configurado
- [ ] Componentes básicos creados
- [ ] Navegación implementada
- [ ] Splash screen configurada
- [ ] App icon configurado

### State Management
- [ ] Store configurado
- [ ] Estados básicos implementados
- [ ] Persistence configurada (si necesario)

### API Integration
- [ ] HTTP client configurado
- [ ] Auth interceptors
- [ ] Error handling
- [ ] Loading states

### Testing
- [ ] Framework de testing configurado
- [ ] Tests de componentes básicos
- [ ] Coverage threshold

### Permissions
- [ ] Camera (si necesario)
- [ ] Location (si necesario)
- [ ] Notifications (si necesario)
- [ ] Storage (si necesario)

### Performance
- [ ] Images optimizadas
- [ ] Lazy loading
- [ ] Memoization donde necesario

### Deployment
- [ ] App signing configurado
- [ ] Build variants (dev/staging/prod)
- [ ] CI/CD pipeline (opcional)

## 🚀 Próximos Pasos

1. **Authentication**
   - Login/Register
   - Token management
   - Biometric auth (opcional)

2. **Offline Support**
   - Local storage
   - Sync strategy
   - Offline indicators

3. **Push Notifications**
   - Firebase/OneSignal setup
   - Notification handlers
   - Deep linking

4. **Analytics**
   - Firebase Analytics
   - Crash reporting
   - User tracking

5. **Deployment**
   - iOS App Store
   - Google Play Store
   - Beta testing (TestFlight/Internal Testing)

## 📚 Recursos

- [Mobile Tools](./README.md)
- [Best Practices](../BEST_PRACTICES.md)
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Flutter Docs](https://flutter.dev/)
- [React Navigation](https://reactnavigation.org/)

---

_Mobile Setup Guide - Construyendo apps móviles modernas desde cero_ 📱
