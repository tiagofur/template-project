# 📱 Mobile Tools

Herramientas especializadas para desarrollo de aplicaciones móviles multiplataforma y nativas.

## 📋 Tabla de Contenidos

- [Frameworks Multiplataforma](#frameworks-multiplataforma)
- [Frameworks Nativos](#frameworks-nativos)
- [Development Tools](#development-tools)
- [Testing Tools](#testing-tools)
- [Build y Deployment](#build-y-deployment)
- [Performance](#performance)
- [Backend Services](#backend-services)
- [UI/UX Tools](#uiux-tools)

## 🚀 Frameworks Multiplataforma

### Flutter ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Framework UI de Google para apps multiplataforma

**Instalación:**
```bash
# macOS/Linux
wget https://storage.googleapis.com/flutter_infra/releases/stable/macos/flutter_macos_X.X.X-stable.zip
# o usar snap en Linux
snap install flutter --classic

# Verificar instalación
flutter doctor
```

**Casos de Uso:**
- Apps iOS/Android
- Web apps
- Desktop apps
- UI compleja y personalizada

**Pros:**
- ✅ Hot reload rápido
- ✅ Un codebase para todo
- ✅ Performance nativa
- ✅ Widget library rica
- ✅ Dart language

**Contras:**
- ❌ Bundle size grande
- ❌ Curva de aprendizaje Dart
- ❌ Menos librerías que React Native

**Recursos:**
- [Flutter Docs](https://flutter.dev/docs)
- [Pub.dev](https://pub.dev/) - Packages
- [Flutter Awesome](https://flutterawesome.com/)

---

### React Native ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Framework de Facebook para apps móviles con React

**Instalación:**
```bash
npx react-native init MyApp
# o con Expo
npx create-expo-app MyApp
```

**Casos de Uso:**
- Apps iOS/Android
- Cross-platform con JavaScript
- Equipos web que van a mobile

**Pros:**
- ✅ JavaScript/React
- ✅ Hot reload
- ✅ Gran comunidad
- ✅ Muchas librerías
- ✅ Code sharing con web

**Contras:**
- ❌ Requiere native modules
- ❌ Performance vs nativo
- ❌ Fragmentación de versiones

**Recursos:**
- [React Native Docs](https://reactnative.dev/)
- [React Native Directory](https://reactnative.directory/)

---

### Expo ⭐⭐⭐
**Nivel:** Esencial (con React Native)  
**Descripción:** Plataforma para desarrollo React Native

**Instalación:**
```bash
npm install -g expo-cli
expo init my-project
```

**Casos de Uso:**
- Rapid prototyping
- Managed workflow
- OTA updates
- Sin native code

**Pros:**
- ✅ Zero config
- ✅ Muchas APIs built-in
- ✅ OTA updates
- ✅ Expo Go app para testing
- ✅ EAS Build/Submit

**Contras:**
- ❌ Limited native modules
- ❌ Bundle size más grande
- ❌ Menos control

**Recursos:**
- [Expo Docs](https://docs.expo.dev/)
- [Expo Snacks](https://snack.expo.dev/)

---

### Ionic ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Framework híbrido con web technologies

**Instalación:**
```bash
npm install -g @ionic/cli
ionic start myApp
```

**Casos de Uso:**
- Hybrid apps
- Web + Mobile
- PWA
- Equipos web

**Pros:**
- ✅ Web technologies (HTML/CSS/JS)
- ✅ Framework agnostic
- ✅ PWA support
- ✅ Capacitor/Cordova

**Contras:**
- ❌ Performance vs nativo
- ❌ UI puede sentirse web

## 📱 Frameworks Nativos

### Swift (iOS) ⭐⭐⭐
**Nivel:** Esencial (iOS)  
**Descripción:** Lenguaje de Apple para iOS/macOS

**Instalación:**
```bash
# Requiere Xcode (macOS only)
# Descarga desde App Store
```

**Casos de Uso:**
- Apps iOS/macOS nativas
- Performance crítica
- APIs nativas iOS

**Pros:**
- ✅ Performance nativa
- ✅ Todas las APIs iOS
- ✅ SwiftUI moderno
- ✅ Type-safe

**Recursos:**
- [Swift Docs](https://swift.org/documentation/)
- [SwiftUI Tutorials](https://developer.apple.com/tutorials/swiftui)

---

### Kotlin (Android) ⭐⭐⭐
**Nivel:** Esencial (Android)  
**Descripción:** Lenguaje oficial para Android

**Instalación:**
```bash
# Requiere Android Studio
# Descarga desde developer.android.com
```

**Casos de Uso:**
- Apps Android nativas
- Kotlin Multiplatform
- Performance crítica

**Pros:**
- ✅ Performance nativa
- ✅ Todas las APIs Android
- ✅ Jetpack Compose
- ✅ Null-safe

**Recursos:**
- [Kotlin Docs](https://kotlinlang.org/docs/home.html)
- [Jetpack Compose](https://developer.android.com/jetpack/compose)

## 🛠️ Development Tools

### Android Studio ⭐⭐⭐
**Nivel:** Esencial (Android)  
**Descripción:** IDE oficial para Android

**Instalación:**
- Descarga desde [developer.android.com](https://developer.android.com/studio)

**Casos de Uso:**
- Desarrollo Android
- React Native (Android)
- Flutter (Android)

**Pros:**
- ✅ Emulador integrado
- ✅ Layout editor
- ✅ Profiling tools
- ✅ Gradle integration

---

### Xcode ⭐⭐⭐
**Nivel:** Esencial (iOS)  
**Descripción:** IDE oficial para iOS/macOS

**Instalación:**
- Descarga desde App Store (macOS only)

**Casos de Uso:**
- Desarrollo iOS/macOS
- React Native (iOS)
- Flutter (iOS)

**Pros:**
- ✅ Simulador iOS
- ✅ Interface Builder
- ✅ Instruments (profiling)
- ✅ TestFlight integration

---

### Visual Studio Code ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Editor para desarrollo móvil multiplataforma

**Instalación:**
```bash
# Descarga desde code.visualstudio.com
```

**Extensiones Recomendadas:**
- Flutter
- React Native Tools
- Dart
- ES7+ React/Redux snippets

**Pros:**
- ✅ Ligero y rápido
- ✅ Extensiones ricas
- ✅ Integrated terminal
- ✅ Git integration

---

### React Native Debugger ⭐⭐
**Nivel:** Recomendado (React Native)  
**Descripción:** Debugger standalone para React Native

**Instalación:**
```bash
brew install --cask react-native-debugger
```

**Casos de Uso:**
- Debugging React Native
- Redux DevTools
- Network inspection

## 🧪 Testing Tools

### Detox ⭐⭐⭐
**Nivel:** Esencial (React Native)  
**Descripción:** E2E testing para React Native

**Instalación:**
```bash
npm install detox --save-dev
```

**Casos de Uso:**
- E2E testing
- Gray box testing
- CI/CD integration

**Pros:**
- ✅ Fast y stable
- ✅ Cross-platform
- ✅ Auto-synchronization
- ✅ CI/CD ready

**Recursos:**
- [Detox Docs](https://wix.github.io/Detox/)

---

### Maestro ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Mobile UI testing framework

**Instalación:**
```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

**Casos de Uso:**
- E2E testing
- Flow testing
- Simple syntax

**Pros:**
- ✅ Simple YAML syntax
- ✅ Cross-platform
- ✅ Cloud testing
- ✅ Fast

---

### Appium ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Automation framework para apps móviles

**Instalación:**
```bash
npm install -g appium
```

**Casos de Uso:**
- Cross-platform testing
- Native/hybrid apps
- Multiple languages

**Pros:**
- ✅ Standard WebDriver
- ✅ Multiple languages
- ✅ Native/hybrid support

---

### Jest + React Native Testing Library ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Unit testing para React Native

**Instalación:**
```bash
npm install --save-dev @testing-library/react-native
```

**Casos de Uso:**
- Unit testing
- Component testing
- Integration testing

## 📦 Build y Deployment

### Fastlane ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Automation para iOS y Android

**Instalación:**
```bash
# macOS
brew install fastlane

# o con gem
sudo gem install fastlane
```

**Casos de Uso:**
- Build automation
- App Store deployment
- Screenshots automation
- Code signing

**Pros:**
- ✅ Automation completa
- ✅ iOS y Android
- ✅ CI/CD integration
- ✅ Plugins extensivos

**Recursos:**
- [Fastlane Docs](https://docs.fastlane.tools/)

---

### EAS (Expo Application Services) ⭐⭐⭐
**Nivel:** Esencial (Expo)  
**Descripción:** Build y submit service de Expo

**Instalación:**
```bash
npm install -g eas-cli
eas build:configure
```

**Casos de Uso:**
- Cloud builds
- OTA updates
- App submission

**Pros:**
- ✅ Cloud builds
- ✅ No Mac needed (iOS)
- ✅ OTA updates
- ✅ Easy setup

---

### CodePush ⭐⭐
**Nivel:** Recomendado (React Native)  
**Descripción:** OTA updates para React Native

**Instalación:**
```bash
npm install --save react-native-code-push
```

**Casos de Uso:**
- Hot fixes
- A/B testing
- Gradual rollouts

**Pros:**
- ✅ Instant updates
- ✅ No app store review
- ✅ Rollback capability

## ⚡ Performance

### Flipper ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Platform para debugging mobile apps

**Instalación:**
```bash
# Descarga desde fbflipper.com
```

**Casos de Uso:**
- Performance monitoring
- Network inspection
- Layout inspection
- Crash reports

**Pros:**
- ✅ Extensible con plugins
- ✅ React DevTools
- ✅ Network inspector
- ✅ Layout inspector

**Recursos:**
- [Flipper Docs](https://fbflipper.com/docs/)

---

### Firebase Performance Monitoring ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Performance monitoring de Firebase

**Instalación:**
```bash
# Flutter
flutter pub add firebase_performance

# React Native
npm install @react-native-firebase/perf
```

**Casos de Uso:**
- App performance monitoring
- Network monitoring
- Custom traces

---

### Sentry ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Error tracking para mobile

**Instalación:**
```bash
# React Native
npm install @sentry/react-native

# Flutter
flutter pub add sentry_flutter
```

**Casos de Uso:**
- Error tracking
- Crash reporting
- Performance monitoring

## ☁️ Backend Services

### Firebase ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Backend as a Service de Google

**Instalación:**
```bash
# Flutter
flutter pub add firebase_core

# React Native
npm install @react-native-firebase/app
```

**Servicios:**
- Authentication
- Firestore (Database)
- Cloud Storage
- Cloud Functions
- Push Notifications
- Analytics

**Pros:**
- ✅ Backend completo
- ✅ Real-time sync
- ✅ Free tier generoso
- ✅ Fácil integración

---

### Supabase ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Alternativa open-source a Firebase

**Instalación:**
```bash
npm install @supabase/supabase-js
```

**Servicios:**
- PostgreSQL database
- Authentication
- Storage
- Real-time subscriptions
- Edge Functions

**Pros:**
- ✅ Open source
- ✅ PostgreSQL
- ✅ SQL queries
- ✅ Self-hostable

---

### AWS Amplify ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Framework de AWS para mobile/web

**Instalación:**
```bash
npm install aws-amplify
```

**Servicios:**
- Authentication (Cognito)
- API (GraphQL/REST)
- Storage (S3)
- DataStore (offline-first)

## 🎨 UI/UX Tools

### React Native Paper ⭐⭐
**Nivel:** Recomendado (React Native)  
**Descripción:** Material Design para React Native

**Instalación:**
```bash
npm install react-native-paper
```

**Casos de Uso:**
- Material Design UI
- Pre-built components
- Theming

---

### NativeBase ⭐⭐
**Nivel:** Recomendado (React Native)  
**Descripción:** Component library para React Native

**Instalación:**
```bash
npm install native-base
```

**Casos de Uso:**
- Cross-platform UI
- Accessible components
- Theming system

---

### Lottie ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Animaciones after effects

**Instalación:**
```bash
# React Native
npm install lottie-react-native

# Flutter
flutter pub add lottie
```

**Casos de Uso:**
- Animaciones complejas
- Loading animations
- Onboarding screens

**Pros:**
- ✅ Animaciones de diseñadores
- ✅ Performance nativa
- ✅ Small file size

---

### Figma ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Design tool colaborativo

**Instalación:**
- Web app o desktop app desde [figma.com](https://www.figma.com/)

**Casos de Uso:**
- UI/UX Design
- Prototyping
- Design systems
- Handoff a developers

**Pros:**
- ✅ Colaboración real-time
- ✅ Plugins extensivos
- ✅ Design tokens
- ✅ Dev handoff

## 📚 Recursos Adicionales

- [React Native Directory](https://reactnative.directory/)
- [Awesome Flutter](https://github.com/Solido/awesome-flutter)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design Guidelines](https://material.io/design)

## 🔗 Links Útiles

- [Tools Collection Home](../README.md)
- [Backend Tools](../backend/README.md)
- [Frontend Tools](../frontend/README.md)
- [DevOps Tools](../devops/README.md)

---

_Mobile Tools - Construyendo apps móviles excepcionales_ 📱
