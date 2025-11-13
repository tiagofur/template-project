# 📱 Mobile Backend Template

Backend optimizado para aplicaciones móviles con soporte para iOS y Android.

## 📋 Overview

Backend robusto diseñado específicamente para aplicaciones móviles con:
- **API RESTful**: Endpoints optimizados para mobile
- **Push Notifications**: Firebase Cloud Messaging (FCM) y APNs
- **Authentication**: JWT + OAuth 2.0 (Google, Apple, Facebook)
- **File Upload**: Manejo de imágenes y archivos multimedia
- **Real-time**: WebSockets para chat y actualizaciones en tiempo real
- **Offline Support**: Sincronización de datos offline
- **Analytics**: Tracking de eventos y usuarios

## ✨ Features

### Core Features
- 🔐 **Authentication Multi-platform**: JWT, OAuth, Biometric
- 📲 **Push Notifications**: FCM para Android/iOS
- 📁 **File Management**: Upload de imágenes, videos, documentos
- 💬 **Real-time Messaging**: WebSocket para chat
- 🔄 **Data Sync**: Sincronización offline-first
- 📊 **Analytics**: Eventos de usuario y métricas
- 🌍 **Geolocation**: Servicios basados en ubicación
- 💳 **In-App Purchases**: Integración con App Store y Play Store

### Technical Features
- 🚀 **High Performance**: Optimizado para latencia baja
- 📦 **Efficient Payloads**: Respuestas comprimidas
- 🔒 **Security**: Encriptación end-to-end
- 📈 **Scalability**: Auto-scaling horizontal
- 🧪 **Testing**: Unit, Integration, E2E tests
- 📝 **API Documentation**: Swagger/OpenAPI
- 🐳 **Docker**: Containerización completa
- ☁️ **Cloud Ready**: Deploy a AWS/GCP/Azure

## 🏗️ Estructura del Proyecto

```
mobile-backend/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth/           # Autenticación
│   │   │   ├── users/          # Gestión de usuarios
│   │   │   ├── notifications/  # Push notifications
│   │   │   ├── files/          # Upload de archivos
│   │   │   ├── chat/           # Mensajería en tiempo real
│   │   │   └── sync/           # Sincronización de datos
│   │   ├── services/
│   │   │   ├── fcm/            # Firebase Cloud Messaging
│   │   │   ├── apns/           # Apple Push Notification Service
│   │   │   ├── s3/             # File storage
│   │   │   └── socket/         # WebSocket service
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── utils/
│   │   └── server.ts
│   ├── prisma/                 # Database schema
│   ├── tests/
│   └── package.json
│
├── config/
│   ├── firebase/               # Firebase config
│   ├── nginx/                  # Nginx config
│   └── ssl/                    # SSL certificates
│
├── docs/
│   ├── api/                    # API documentation
│   ├── authentication/         # Auth flows
│   ├── push-notifications/     # Push setup guide
│   └── deployment/             # Deploy guides
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🚀 Quick Start

### Prerrequisitos

- Node.js 18+
- Docker y Docker Compose
- Firebase Account (para push notifications)
- PostgreSQL o MongoDB
- Redis (para caching y sessions)

### Instalación

1. **Copiar template**
   ```bash
   cp -r templates/projects/mobile-backend/* mi-mobile-backend/
   cd mi-mobile-backend
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus credenciales
   ```

3. **Configurar Firebase**
   - Crear proyecto en [Firebase Console](https://console.firebase.google.com)
   - Descargar `serviceAccountKey.json`
   - Colocar en `config/firebase/`
   - Actualizar credenciales en `.env`

4. **Iniciar servicios**
   ```bash
   docker-compose up -d
   ```

5. **Ejecutar migraciones**
   ```bash
   cd backend
   npm install
   npx prisma migrate dev
   npm run seed  # Datos de prueba
   ```

6. **Iniciar desarrollo**
   ```bash
   npm run dev
   ```

Backend disponible en: http://localhost:3000

## 📖 Configuración

### Variables de Entorno

```env
# Server
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mobile_db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=your-private-key

# AWS S3 (File Upload)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1

# Redis (Caching)
REDIS_URL=redis://localhost:6379

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id

# WebSocket
WS_PORT=3001
```

## 📱 Integración con Apps Móviles

### iOS (Swift)

```swift
// API Client
class APIClient {
    let baseURL = "https://api.yourdomain.com/v1"
    
    func login(email: String, password: String) async throws -> User {
        let url = URL(string: "\(baseURL)/auth/login")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body = ["email": email, "password": password]
        request.httpBody = try JSONEncoder().encode(body)
        
        let (data, _) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode(User.self, from: data)
    }
}
```

### Android (Kotlin)

```kotlin
// Retrofit API Client
interface ApiService {
    @POST("auth/login")
    suspend fun login(@Body credentials: LoginRequest): Response<User>
    
    @GET("users/me")
    suspend fun getCurrentUser(@Header("Authorization") token: String): Response<User>
    
    @Multipart
    @POST("files/upload")
    suspend fun uploadFile(@Part file: MultipartBody.Part): Response<FileResponse>
}
```

### Flutter (Dart)

```dart
// API Client with Dio
class ApiClient {
  final Dio _dio;
  
  ApiClient() : _dio = Dio(BaseOptions(
    baseUrl: 'https://api.yourdomain.com/v1',
  ));
  
  Future<User> login(String email, String password) async {
    final response = await _dio.post('/auth/login', data: {
      'email': email,
      'password': password,
    });
    return User.fromJson(response.data);
  }
}
```

## 🔔 Push Notifications

### Setup FCM (Android)

1. Registrar dispositivo:
```typescript
// Backend endpoint
POST /api/notifications/register
{
  "userId": "user-id",
  "deviceToken": "fcm-token",
  "platform": "android"
}
```

2. Enviar notificación:
```typescript
// Backend code
await fcmService.send({
  token: deviceToken,
  notification: {
    title: 'Nueva mensaje',
    body: 'Tienes un nuevo mensaje'
  },
  data: {
    type: 'chat',
    chatId: 'chat-123'
  }
});
```

### Setup APNs (iOS)

1. Configurar certificados APNs
2. Registrar dispositivo
3. Enviar notificaciones

Ver [docs/push-notifications/README.md](./docs/push-notifications/README.md) para guía completa.

## 📁 File Upload

### Upload de imágenes

```typescript
// Endpoint
POST /api/files/upload
Content-Type: multipart/form-data

// Response
{
  "success": true,
  "data": {
    "url": "https://cdn.yourdomain.com/images/abc123.jpg",
    "key": "images/abc123.jpg",
    "size": 245678,
    "mimeType": "image/jpeg"
  }
}
```

### Client-side (React Native)

```javascript
const uploadImage = async (uri) => {
  const formData = new FormData();
  formData.append('file', {
    uri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  });

  const response = await fetch('http://api.yourdomain.com/v1/files/upload', {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.json();
};
```

## 💬 Real-time Chat

### WebSocket Connection

```typescript
// Client
import io from 'socket.io-client';

const socket = io('http://localhost:3001', {
  auth: {
    token: 'jwt-token'
  }
});

// Join chat room
socket.emit('join-room', { roomId: 'room-123' });

// Send message
socket.emit('message', {
  roomId: 'room-123',
  text: 'Hello!',
  type: 'text'
});

// Receive messages
socket.on('message', (data) => {
  console.log('New message:', data);
});
```

## 🎯 Best Practices

### Performance
- ✅ Implementar paginación en todas las listas
- ✅ Comprimir respuestas (gzip/brotli)
- ✅ Usar CDN para archivos estáticos
- ✅ Cachear respuestas frecuentes con Redis
- ✅ Optimizar queries de base de datos
- ✅ Implementar rate limiting

### Security
- ✅ Validar todos los inputs
- ✅ Sanitizar datos de usuario
- ✅ Usar HTTPS en producción
- ✅ Implementar CORS apropiado
- ✅ Rate limiting por IP y usuario
- ✅ Encriptar datos sensibles
- ✅ Rotación de tokens

### Mobile Optimization
- ✅ Payloads pequeños (< 100KB)
- ✅ Batch requests cuando sea posible
- ✅ Implementar retry logic
- ✅ Manejar conexiones intermitentes
- ✅ Sincronización en background
- ✅ Offline-first architecture

## 🧪 Testing

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Load testing
npm run test:load
```

## 🚀 Deployment

### Deploy a AWS

```bash
# Build Docker image
docker build -t mobile-backend .

# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
docker tag mobile-backend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/mobile-backend:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/mobile-backend:latest

# Deploy to ECS
aws ecs update-service --cluster mobile-cluster --service mobile-backend --force-new-deployment
```

Ver [docs/deployment/README.md](./docs/deployment/README.md) para otras plataformas.

## 📊 Monitoring

- **Logs**: CloudWatch, Datadog, New Relic
- **Metrics**: Prometheus, Grafana
- **Error Tracking**: Sentry
- **APM**: New Relic, DataDog

## 📚 Recursos

- [API Documentation](./docs/api/README.md)
- [Authentication Guide](./docs/authentication/README.md)
- [Push Notifications](./docs/push-notifications/README.md)
- [File Upload Guide](./docs/files/README.md)
- [WebSocket Guide](./docs/websocket/README.md)

## 🔧 Troubleshooting

Ver [docs/troubleshooting.md](./docs/troubleshooting.md)

---

_Backend optimizado para aplicaciones móviles de alta performance_ 📱
