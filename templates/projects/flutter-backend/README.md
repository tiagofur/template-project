# 🦋 Flutter Backend Template

Backend especializado para aplicaciones Flutter con integración nativa y optimizaciones específicas.

## 📋 Overview

Backend diseñado específicamente para Flutter apps con:
- **API RESTful**: Endpoints optimizados para Dart/Flutter
- **Type-safe**: Esquemas compatibles con generación de código Dart
- **Real-time**: Stream support para actualizaciones reactivas
- **State Sync**: Sincronización de estado con Riverpod/Bloc
- **Platform Channels**: Soporte para funcionalidades nativas
- **Firebase Integration**: Auth, Firestore, Storage, Functions

## ✨ Features

### Flutter-Specific
- 🎯 **Type-safe API**: Generación automática de modelos Dart
- 🔄 **Stream API**: Endpoints con soporte de streams
- 📱 **Platform Support**: iOS, Android, Web, Desktop
- 🔥 **Firebase Suite**: Integración completa
- 🎨 **Material Design**: Respuestas optimizadas para Flutter widgets
- 📦 **Code Generation**: Freezed, JSON Serializable, Retrofit
- 🔔 **Push Notifications**: FCM nativo
- 💾 **Local Storage**: Sincronización con Hive/Drift

### Backend Features
- 🚀 **Node.js + TypeScript**: Performance y type safety
- 🗄️ **PostgreSQL/MongoDB**: Base de datos flexible
- 🔐 **Firebase Auth**: Autenticación integrada
- 📁 **Cloud Storage**: Firebase Storage o S3
- ⚡ **GraphQL**: Opcional para queries flexibles
- 🧪 **Testing**: Jest, Supertest
- 🐳 **Docker**: Containerización
- ☁️ **Cloud Functions**: Serverless integration

## 🏗️ Estructura del Proyecto

```
flutter-backend/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth/           # Firebase Auth integration
│   │   │   ├── users/          # User management
│   │   │   ├── data-sync/      # State synchronization
│   │   │   └── streams/        # Real-time streams
│   │   ├── services/
│   │   │   ├── firebase/       # Firebase services
│   │   │   ├── storage/        # File storage
│   │   │   └── notifications/  # Push notifications
│   │   ├── models/             # Data models
│   │   ├── types/              # TypeScript types
│   │   └── server.ts
│   ├── schemas/                # OpenAPI/JSON schemas
│   │   └── export-dart.ts      # Dart code generator
│   ├── tests/
│   └── package.json
│
├── config/
│   ├── firebase/
│   │   ├── serviceAccountKey.json
│   │   └── firebase-config.json
│   └── openapi/
│       └── api-spec.yaml
│
├── docs/
│   ├── api/                    # API documentation
│   ├── flutter-integration/    # Flutter setup guide
│   ├── code-generation/        # Dart code gen
│   └── deployment/
│
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🚀 Quick Start

### Prerrequisitos

- Node.js 18+
- Flutter SDK
- Firebase Account
- Docker (opcional)

### Backend Setup

1. **Copiar template**
   ```bash
   cp -r templates/projects/flutter-backend/* mi-flutter-backend/
   cd mi-flutter-backend
   ```

2. **Configurar Firebase**
   - Crear proyecto en Firebase Console
   - Habilitar Authentication, Firestore, Storage
   - Descargar `google-services.json` (Android) y `GoogleService-Info.plist` (iOS)
   - Descargar `serviceAccountKey.json` para backend
   - Colocar en `config/firebase/`

3. **Configurar variables**
   ```bash
   cp .env.example .env
   # Editar credenciales
   ```

4. **Instalar y ejecutar**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

### Flutter App Integration

1. **Agregar dependencias** (`pubspec.yaml`)
   ```yaml
   dependencies:
     flutter:
       sdk: flutter
     
     # State Management
     flutter_riverpod: ^2.4.0
     # or flutter_bloc: ^8.1.3
     
     # HTTP Client
     dio: ^5.3.3
     retrofit: ^4.0.3
     
     # Code Generation
     freezed_annotation: ^2.4.1
     json_annotation: ^4.8.1
     
     # Firebase
     firebase_core: ^2.17.0
     firebase_auth: ^4.10.1
     cloud_firestore: ^4.9.3
     firebase_storage: ^11.2.8
     
   dev_dependencies:
     # Code Generators
     build_runner: ^2.4.6
     freezed: ^2.4.5
     json_serializable: ^6.7.1
     retrofit_generator: ^7.0.8
   ```

2. **Generar código Dart desde API**
   ```bash
   # En backend
   npm run generate:dart
   
   # Copiar modelos generados a Flutter app
   cp backend/generated/dart/* flutter_app/lib/models/
   ```

3. **Configurar API Client**
   ```dart
   // lib/services/api_client.dart
   import 'package:dio/dio.dart';
   import 'package:retrofit/retrofit.dart';
   
   part 'api_client.g.dart';
   
   @RestApi(baseUrl: "https://api.yourdomain.com/v1")
   abstract class ApiClient {
     factory ApiClient(Dio dio, {String baseUrl}) = _ApiClient;
     
     @POST("/auth/login")
     Future<User> login(@Body() LoginRequest request);
     
     @GET("/users/{id}")
     Future<User> getUser(@Path("id") String id);
     
     @GET("/posts")
     Future<List<Post>> getPosts(@Query("page") int page);
   }
   ```

## 📖 Integración Flutter

### Authentication con Firebase

**Backend**
```typescript
// backend/src/api/auth/controller.ts
export const verifyToken = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const user = await getUserByFirebaseUid(decodedToken.uid);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
```

**Flutter App**
```dart
// lib/services/auth_service.dart
class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final ApiClient _apiClient;
  
  Future<User> signInWithEmail(String email, String password) async {
    // Sign in with Firebase
    final credential = await _auth.signInWithEmailAndPassword(
      email: email,
      password: password,
    );
    
    // Get Firebase ID token
    final idToken = await credential.user!.getIdToken();
    
    // Verify with backend and get user data
    return await _apiClient.verifyToken(idToken);
  }
}
```

### State Management con Riverpod

```dart
// lib/providers/auth_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

final authServiceProvider = Provider((ref) => AuthService());

final authStateProvider = StreamProvider<User?>((ref) {
  final authService = ref.watch(authServiceProvider);
  return authService.authStateChanges();
});

final userProvider = FutureProvider<User?>((ref) async {
  final authService = ref.watch(authServiceProvider);
  return authService.getCurrentUser();
});
```

### Real-time Data Sync

**Backend (Server-Sent Events)**
```typescript
// backend/src/api/streams/posts.ts
export const streamPosts = (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  const sendUpdate = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };
  
  // Subscribe to database changes
  const unsubscribe = subscribeToPostChanges(sendUpdate);
  
  req.on('close', () => {
    unsubscribe();
    res.end();
  });
};
```

**Flutter (Stream)**
```dart
// lib/services/posts_service.dart
class PostsService {
  Stream<List<Post>> watchPosts() async* {
    final response = await _dio.get(
      '/posts/stream',
      options: Options(
        responseType: ResponseType.stream,
      ),
    );
    
    await for (final data in response.data.stream) {
      final posts = (jsonDecode(data) as List)
          .map((json) => Post.fromJson(json))
          .toList();
      yield posts;
    }
  }
}

// Usage in widget
class PostsList extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final postsStream = ref.watch(postsStreamProvider);
    
    return postsStream.when(
      data: (posts) => ListView.builder(
        itemCount: posts.length,
        itemBuilder: (context, index) => PostCard(post: posts[index]),
      ),
      loading: () => CircularProgressIndicator(),
      error: (error, stack) => ErrorWidget(error),
    );
  }
}
```

### File Upload

**Backend**
```typescript
// backend/src/api/files/upload.ts
export const uploadFile = async (req: Request, res: Response) => {
  const file = req.file;
  const bucket = admin.storage().bucket();
  const fileName = `uploads/${Date.now()}_${file.originalname}`;
  const fileUpload = bucket.file(fileName);
  
  await fileUpload.save(file.buffer, {
    metadata: {
      contentType: file.mimetype,
    },
  });
  
  const url = await fileUpload.getSignedUrl({
    action: 'read',
    expires: '03-01-2500',
  });
  
  res.json({
    success: true,
    data: {
      url: url[0],
      path: fileName,
    },
  });
};
```

**Flutter**
```dart
// lib/services/file_upload_service.dart
import 'package:image_picker/image_picker.dart';

class FileUploadService {
  final ApiClient _apiClient;
  
  Future<String> uploadImage() async {
    final picker = ImagePicker();
    final image = await picker.pickImage(source: ImageSource.gallery);
    
    if (image == null) return '';
    
    final formData = FormData.fromMap({
      'file': await MultipartFile.fromFile(
        image.path,
        filename: image.name,
      ),
    });
    
    final response = await _apiClient.uploadFile(formData);
    return response.url;
  }
}
```

### Push Notifications

**Backend**
```typescript
// backend/src/services/notifications/fcm.ts
export const sendNotification = async (
  token: string,
  title: string,
  body: string,
  data?: any
) => {
  const message = {
    token,
    notification: { title, body },
    data,
    android: {
      priority: 'high' as const,
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
        },
      },
    },
  };
  
  return await admin.messaging().send(message);
};
```

**Flutter**
```dart
// lib/services/notification_service.dart
import 'package:firebase_messaging/firebase_messaging.dart';

class NotificationService {
  final FirebaseMessaging _fcm = FirebaseMessaging.instance;
  
  Future<void> initialize() async {
    // Request permission
    await _fcm.requestPermission();
    
    // Get FCM token
    final token = await _fcm.getToken();
    print('FCM Token: $token');
    
    // Send token to backend
    await _apiClient.registerDevice(token!);
    
    // Handle foreground messages
    FirebaseMessaging.onMessage.listen((message) {
      print('Notification: ${message.notification?.title}');
      _showLocalNotification(message);
    });
    
    // Handle background messages
    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  }
}

// Top-level function for background messages
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  print('Background message: ${message.messageId}');
}
```

## 🎯 Best Practices

### Data Models
- ✅ Usar Freezed para modelos inmutables
- ✅ JSON serialization con json_serializable
- ✅ Validación en backend y frontend
- ✅ Type-safe en ambos lados

### State Management
- ✅ Riverpod para estado global
- ✅ Bloc para flujos complejos
- ✅ Provider para dependencias
- ✅ Estado local cuando sea suficiente

### Performance
- ✅ Lazy loading de imágenes
- ✅ Paginación en listas largas
- ✅ Caché de datos con Hive
- ✅ Debounce en búsquedas
- ✅ Optimistic updates

### Security
- ✅ Firebase Security Rules
- ✅ Validación server-side
- ✅ HTTPS siempre
- ✅ Sanitizar inputs
- ✅ Rate limiting

## 🧪 Testing

**Backend**
```bash
npm test
npm run test:watch
npm run test:coverage
```

**Flutter**
```bash
flutter test
flutter test --coverage
flutter drive --target=test_driver/app.dart
```

## 🚀 Deployment

### Backend to Cloud Run

```bash
gcloud run deploy flutter-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Flutter App

```bash
# Android
flutter build apk --release
flutter build appbundle --release

# iOS
flutter build ios --release

# Web
flutter build web --release
```

## 📚 Recursos

- [API Documentation](./docs/api/README.md)
- [Flutter Integration Guide](./docs/flutter-integration/README.md)
- [Code Generation](./docs/code-generation/README.md)
- [Firebase Setup](./docs/firebase/README.md)

---

_Backend optimizado para Flutter apps_ 🦋
