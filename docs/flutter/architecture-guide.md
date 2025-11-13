# 🏗️ Flutter Clean Architecture Guide

Guía completa de arquitectura limpia para aplicaciones Flutter con gestión de estado.

## 📋 Tabla de Contenidos

1. [Introducción a Clean Architecture](#introducción-a-clean-architecture)
2. [Capas de la Arquitectura](#capas-de-la-arquitectura)
3. [Dependency Injection](#dependency-injection)
4. [Error Handling](#error-handling)
5. [Testing Strategy](#testing-strategy)
6. [Best Practices](#best-practices)

## Introducción a Clean Architecture

Clean Architecture separa la aplicación en capas independientes, cada una con responsabilidades específicas. Esto facilita el testing, mantenimiento y escalabilidad.

### Principios Fundamentales

1. **Independence of Frameworks**: La lógica de negocio no depende de frameworks
2. **Testability**: Toda la lógica puede ser testeada sin UI, DB, o servicios externos
3. **Independence of UI**: La UI puede cambiar sin afectar la lógica
4. **Independence of Database**: Puedes cambiar de base de datos sin afectar la lógica
5. **Independence of External Agencies**: La lógica no conoce nada del mundo exterior

## Capas de la Arquitectura

### Estructura de Carpetas

```
lib/
├── core/
│   ├── di/                    # Dependency Injection
│   │   ├── injection.dart
│   │   └── injection.config.dart
│   ├── errors/                # Error Handling
│   │   ├── failures.dart
│   │   └── exceptions.dart
│   ├── network/               # Network Layer
│   │   ├── api_client.dart
│   │   ├── network_info.dart
│   │   └── interceptors/
│   ├── utils/                 # Utilities
│   │   ├── constants.dart
│   │   ├── validators.dart
│   │   └── extensions.dart
│   └── usecases/              # Base UseCase
│       └── usecase.dart
├── features/
│   └── [feature_name]/
│       ├── data/
│       │   ├── datasources/
│       │   │   ├── [feature]_local_datasource.dart
│       │   │   └── [feature]_remote_datasource.dart
│       │   ├── models/
│       │   │   └── [model]_model.dart
│       │   └── repositories/
│       │       └── [feature]_repository_impl.dart
│       ├── domain/
│       │   ├── entities/
│       │   │   └── [entity].dart
│       │   ├── repositories/
│       │   │   └── [feature]_repository.dart
│       │   └── usecases/
│       │       ├── get_[entity].dart
│       │       ├── create_[entity].dart
│       │       ├── update_[entity].dart
│       │       └── delete_[entity].dart
│       └── presentation/
│           ├── bloc/           # State Management
│           │   ├── [feature]_bloc.dart
│           │   ├── [feature]_event.dart
│           │   └── [feature]_state.dart
│           ├── pages/
│           │   └── [page]_page.dart
│           └── widgets/
│               └── [widget].dart
└── main.dart
```

### 1. Domain Layer (Capa de Dominio)

La capa más interna, contiene la lógica de negocio pura.

#### Entities

```dart
// domain/entities/user.dart
import 'package:equatable/equatable.dart';

class User extends Equatable {
  final String id;
  final String email;
  final String name;
  final String? avatarUrl;
  final DateTime createdAt;

  const User({
    required this.id,
    required this.email,
    required this.name,
    this.avatarUrl,
    required this.createdAt,
  });

  @override
  List<Object?> get props => [id, email, name, avatarUrl, createdAt];
}
```

#### Repository Interfaces

```dart
// domain/repositories/user_repository.dart
import 'package:dartz/dartz.dart';
import '../../core/errors/failures.dart';
import '../entities/user.dart';

abstract class UserRepository {
  Future<Either<Failure, User>> getUser(String id);
  Future<Either<Failure, List<User>>> getUsers();
  Future<Either<Failure, User>> createUser(User user);
  Future<Either<Failure, User>> updateUser(User user);
  Future<Either<Failure, void>> deleteUser(String id);
}
```

#### UseCases

```dart
// core/usecases/usecase.dart
import 'package:dartz/dartz.dart';
import '../errors/failures.dart';

abstract class UseCase<Type, Params> {
  Future<Either<Failure, Type>> call(Params params);
}

class NoParams {}
```

```dart
// domain/usecases/get_user.dart
import 'package:dartz/dartz.dart';
import '../../core/errors/failures.dart';
import '../../core/usecases/usecase.dart';
import '../entities/user.dart';
import '../repositories/user_repository.dart';

class GetUser implements UseCase<User, GetUserParams> {
  final UserRepository repository;

  GetUser(this.repository);

  @override
  Future<Either<Failure, User>> call(GetUserParams params) async {
    return await repository.getUser(params.id);
  }
}

class GetUserParams {
  final String id;

  GetUserParams({required this.id});
}
```

### 2. Data Layer (Capa de Datos)

Implementa las interfaces del dominio y maneja el acceso a datos.

#### Models

```dart
// data/models/user_model.dart
import 'package:freezed_annotation/freezed_annotation.dart';
import '../../domain/entities/user.dart';

part 'user_model.freezed.dart';
part 'user_model.g.dart';

@freezed
class UserModel with _$UserModel {
  const UserModel._();

  const factory UserModel({
    required String id,
    required String email,
    required String name,
    String? avatarUrl,
    required DateTime createdAt,
  }) = _UserModel;

  factory UserModel.fromJson(Map<String, dynamic> json) =>
      _$UserModelFromJson(json);

  User toEntity() => User(
        id: id,
        email: email,
        name: name,
        avatarUrl: avatarUrl,
        createdAt: createdAt,
      );

  factory UserModel.fromEntity(User user) => UserModel(
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      );
}
```

#### DataSources

```dart
// data/datasources/user_remote_datasource.dart
import 'package:dio/dio.dart';
import '../../core/errors/exceptions.dart';
import '../models/user_model.dart';

abstract class UserRemoteDataSource {
  Future<UserModel> getUser(String id);
  Future<List<UserModel>> getUsers();
  Future<UserModel> createUser(UserModel user);
  Future<UserModel> updateUser(UserModel user);
  Future<void> deleteUser(String id);
}

class UserRemoteDataSourceImpl implements UserRemoteDataSource {
  final Dio dio;

  UserRemoteDataSourceImpl({required this.dio});

  @override
  Future<UserModel> getUser(String id) async {
    try {
      final response = await dio.get('/users/$id');
      return UserModel.fromJson(response.data);
    } on DioException catch (e) {
      if (e.response?.statusCode == 404) {
        throw NotFoundException('User not found');
      }
      throw ServerException(e.message ?? 'Server error');
    }
  }

  @override
  Future<List<UserModel>> getUsers() async {
    try {
      final response = await dio.get('/users');
      final List<dynamic> data = response.data;
      return data.map((json) => UserModel.fromJson(json)).toList();
    } on DioException catch (e) {
      throw ServerException(e.message ?? 'Server error');
    }
  }

  @override
  Future<UserModel> createUser(UserModel user) async {
    try {
      final response = await dio.post('/users', data: user.toJson());
      return UserModel.fromJson(response.data);
    } on DioException catch (e) {
      throw ServerException(e.message ?? 'Server error');
    }
  }

  @override
  Future<UserModel> updateUser(UserModel user) async {
    try {
      final response = await dio.put('/users/${user.id}', data: user.toJson());
      return UserModel.fromJson(response.data);
    } on DioException catch (e) {
      throw ServerException(e.message ?? 'Server error');
    }
  }

  @override
  Future<void> deleteUser(String id) async {
    try {
      await dio.delete('/users/$id');
    } on DioException catch (e) {
      throw ServerException(e.message ?? 'Server error');
    }
  }
}
```

```dart
// data/datasources/user_local_datasource.dart
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../../core/errors/exceptions.dart';
import '../models/user_model.dart';

abstract class UserLocalDataSource {
  Future<UserModel> getCachedUser();
  Future<void> cacheUser(UserModel user);
  Future<void> clearCache();
}

class UserLocalDataSourceImpl implements UserLocalDataSource {
  final SharedPreferences sharedPreferences;
  static const CACHED_USER_KEY = 'CACHED_USER';

  UserLocalDataSourceImpl({required this.sharedPreferences});

  @override
  Future<UserModel> getCachedUser() async {
    final jsonString = sharedPreferences.getString(CACHED_USER_KEY);
    if (jsonString != null) {
      return UserModel.fromJson(json.decode(jsonString));
    } else {
      throw CacheException('No cached user found');
    }
  }

  @override
  Future<void> cacheUser(UserModel user) async {
    await sharedPreferences.setString(
      CACHED_USER_KEY,
      json.encode(user.toJson()),
    );
  }

  @override
  Future<void> clearCache() async {
    await sharedPreferences.remove(CACHED_USER_KEY);
  }
}
```

#### Repository Implementation

```dart
// data/repositories/user_repository_impl.dart
import 'package:dartz/dartz.dart';
import '../../core/errors/failures.dart';
import '../../core/errors/exceptions.dart';
import '../../core/network/network_info.dart';
import '../../domain/entities/user.dart';
import '../../domain/repositories/user_repository.dart';
import '../datasources/user_local_datasource.dart';
import '../datasources/user_remote_datasource.dart';
import '../models/user_model.dart';

class UserRepositoryImpl implements UserRepository {
  final UserRemoteDataSource remoteDataSource;
  final UserLocalDataSource localDataSource;
  final NetworkInfo networkInfo;

  UserRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, User>> getUser(String id) async {
    if (await networkInfo.isConnected) {
      try {
        final userModel = await remoteDataSource.getUser(id);
        await localDataSource.cacheUser(userModel);
        return Right(userModel.toEntity());
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } on NotFoundException catch (e) {
        return Left(NotFoundFailure(e.message));
      }
    } else {
      try {
        final userModel = await localDataSource.getCachedUser();
        return Right(userModel.toEntity());
      } on CacheException {
        return Left(CacheFailure('No cached data available'));
      }
    }
  }

  @override
  Future<Either<Failure, List<User>>> getUsers() async {
    if (await networkInfo.isConnected) {
      try {
        final userModels = await remoteDataSource.getUsers();
        return Right(userModels.map((model) => model.toEntity()).toList());
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      }
    } else {
      return Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, User>> createUser(User user) async {
    if (await networkInfo.isConnected) {
      try {
        final userModel = UserModel.fromEntity(user);
        final created = await remoteDataSource.createUser(userModel);
        return Right(created.toEntity());
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      }
    } else {
      return Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, User>> updateUser(User user) async {
    if (await networkInfo.isConnected) {
      try {
        final userModel = UserModel.fromEntity(user);
        final updated = await remoteDataSource.updateUser(userModel);
        await localDataSource.cacheUser(updated);
        return Right(updated.toEntity());
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      }
    } else {
      return Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, void>> deleteUser(String id) async {
    if (await networkInfo.isConnected) {
      try {
        await remoteDataSource.deleteUser(id);
        return const Right(null);
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      }
    } else {
      return Left(NetworkFailure('No internet connection'));
    }
  }
}
```

### 3. Presentation Layer (Capa de Presentación)

Contiene la UI y la gestión de estado.

Ver `state-management-guide.md` para implementaciones específicas de cada patrón de state management.

## Dependency Injection

### Setup con GetIt + Injectable

```dart
// core/di/injection.dart
import 'package:get_it/get_it.dart';
import 'package:injectable/injectable.dart';
import 'injection.config.dart';

final getIt = GetIt.instance;

@InjectableInit()
Future<void> configureDependencies() async {
  await getIt.init();
}
```

```dart
// core/di/register_module.dart
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:internet_connection_checker/internet_connection_checker.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../network/api_client.dart';

@module
abstract class RegisterModule {
  @lazySingleton
  Dio get dio {
    final dio = Dio(BaseOptions(
      baseUrl: 'https://api.example.com',
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
    ));
    
    // Add interceptors
    dio.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
    ));
    
    return dio;
  }

  @lazySingleton
  InternetConnectionChecker get connectionChecker =>
      InternetConnectionChecker();

  @preResolve
  Future<SharedPreferences> get prefs => SharedPreferences.getInstance();
}
```

```dart
// main.dart
import 'package:flutter/material.dart';
import 'core/di/injection.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Setup DI
  await configureDependencies();
  
  runApp(const MyApp());
}
```

## Error Handling

### Exceptions

```dart
// core/errors/exceptions.dart
class ServerException implements Exception {
  final String message;
  ServerException(this.message);
}

class CacheException implements Exception {
  final String message;
  CacheException(this.message);
}

class NetworkException implements Exception {}

class NotFoundException implements Exception {
  final String message;
  NotFoundException(this.message);
}

class ValidationException implements Exception {
  final String message;
  ValidationException(this.message);
}
```

### Failures

```dart
// core/errors/failures.dart
import 'package:equatable/equatable.dart';

abstract class Failure extends Equatable {
  final String message;
  
  const Failure(this.message);
  
  @override
  List<Object> get props => [message];
}

class ServerFailure extends Failure {
  const ServerFailure(String message) : super(message);
}

class CacheFailure extends Failure {
  const CacheFailure(String message) : super(message);
}

class NetworkFailure extends Failure {
  const NetworkFailure(String message) : super(message);
}

class NotFoundFailure extends Failure {
  const NotFoundFailure(String message) : super(message);
}

class ValidationFailure extends Failure {
  const ValidationFailure(String message) : super(message);
}
```

## Testing Strategy

### Unit Tests

```dart
// test/domain/usecases/get_user_test.dart
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

class MockUserRepository extends Mock implements UserRepository {}

void main() {
  late GetUser useCase;
  late MockUserRepository mockRepository;

  setUp(() {
    mockRepository = MockUserRepository();
    useCase = GetUser(mockRepository);
  });

  const tUserId = '123';
  const tUser = User(
    id: tUserId,
    email: 'test@example.com',
    name: 'Test User',
    createdAt: DateTime(2024, 1, 1),
  );

  test('should get user from repository', () async {
    // Arrange
    when(() => mockRepository.getUser(tUserId))
        .thenAnswer((_) async => const Right(tUser));

    // Act
    final result = await useCase(GetUserParams(id: tUserId));

    // Assert
    expect(result, const Right(tUser));
    verify(() => mockRepository.getUser(tUserId)).called(1);
    verifyNoMoreInteractions(mockRepository);
  });
}
```

### Repository Tests

```dart
// test/data/repositories/user_repository_impl_test.dart
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

class MockUserRemoteDataSource extends Mock implements UserRemoteDataSource {}
class MockUserLocalDataSource extends Mock implements UserLocalDataSource {}
class MockNetworkInfo extends Mock implements NetworkInfo {}

void main() {
  late UserRepositoryImpl repository;
  late MockUserRemoteDataSource mockRemoteDataSource;
  late MockUserLocalDataSource mockLocalDataSource;
  late MockNetworkInfo mockNetworkInfo;

  setUp(() {
    mockRemoteDataSource = MockUserRemoteDataSource();
    mockLocalDataSource = MockUserLocalDataSource();
    mockNetworkInfo = MockNetworkInfo();
    repository = UserRepositoryImpl(
      remoteDataSource: mockRemoteDataSource,
      localDataSource: mockLocalDataSource,
      networkInfo: mockNetworkInfo,
    );
  });

  group('getUser', () {
    const tUserId = '123';
    const tUserModel = UserModel(
      id: tUserId,
      email: 'test@example.com',
      name: 'Test User',
      createdAt: DateTime(2024, 1, 1),
    );
    final tUser = tUserModel.toEntity();

    test('should check if device is online', () async {
      // Arrange
      when(() => mockNetworkInfo.isConnected).thenAnswer((_) async => true);
      when(() => mockRemoteDataSource.getUser(tUserId))
          .thenAnswer((_) async => tUserModel);
      when(() => mockLocalDataSource.cacheUser(tUserModel))
          .thenAnswer((_) async => {});

      // Act
      await repository.getUser(tUserId);

      // Assert
      verify(() => mockNetworkInfo.isConnected);
    });

    group('device is online', () {
      setUp(() {
        when(() => mockNetworkInfo.isConnected).thenAnswer((_) async => true);
      });

      test('should return remote data when call is successful', () async {
        // Arrange
        when(() => mockRemoteDataSource.getUser(tUserId))
            .thenAnswer((_) async => tUserModel);
        when(() => mockLocalDataSource.cacheUser(tUserModel))
            .thenAnswer((_) async => {});

        // Act
        final result = await repository.getUser(tUserId);

        // Assert
        verify(() => mockRemoteDataSource.getUser(tUserId));
        verify(() => mockLocalDataSource.cacheUser(tUserModel));
        expect(result, Right(tUser));
      });

      test('should cache data when call is successful', () async {
        // Arrange
        when(() => mockRemoteDataSource.getUser(tUserId))
            .thenAnswer((_) async => tUserModel);
        when(() => mockLocalDataSource.cacheUser(tUserModel))
            .thenAnswer((_) async => {});

        // Act
        await repository.getUser(tUserId);

        // Assert
        verify(() => mockRemoteDataSource.getUser(tUserId));
        verify(() => mockLocalDataSource.cacheUser(tUserModel));
      });

      test('should return ServerFailure when call fails', () async {
        // Arrange
        when(() => mockRemoteDataSource.getUser(tUserId))
            .thenThrow(ServerException('Server error'));

        // Act
        final result = await repository.getUser(tUserId);

        // Assert
        verify(() => mockRemoteDataSource.getUser(tUserId));
        verifyZeroInteractions(mockLocalDataSource);
        expect(result, const Left(ServerFailure('Server error')));
      });
    });

    group('device is offline', () {
      setUp(() {
        when(() => mockNetworkInfo.isConnected).thenAnswer((_) async => false);
      });

      test('should return cached data when available', () async {
        // Arrange
        when(() => mockLocalDataSource.getCachedUser())
            .thenAnswer((_) async => tUserModel);

        // Act
        final result = await repository.getUser(tUserId);

        // Assert
        verifyZeroInteractions(mockRemoteDataSource);
        verify(() => mockLocalDataSource.getCachedUser());
        expect(result, Right(tUser));
      });

      test('should return CacheFailure when no cache available', () async {
        // Arrange
        when(() => mockLocalDataSource.getCachedUser())
            .thenThrow(CacheException('No cache'));

        // Act
        final result = await repository.getUser(tUserId);

        // Assert
        verifyZeroInteractions(mockRemoteDataSource);
        verify(() => mockLocalDataSource.getCachedUser());
        expect(result, const Left(CacheFailure('No cached data available')));
      });
    });
  });
}
```

## Best Practices

### 1. Separación de Responsabilidades

✅ Cada capa tiene una responsabilidad específica
✅ Domain layer no depende de otras capas
✅ Data layer implementa contratos del domain
✅ Presentation layer solo coordina UI y state

### 2. Dependency Rule

✅ Las dependencias apuntan hacia adentro
✅ Domain no conoce Data ni Presentation
✅ Data implementa interfaces de Domain
✅ Presentation usa Domain a través de UseCases

### 3. Testing

✅ Domain: 100% de coverage (es código crítico)
✅ Data: >90% de coverage
✅ Presentation: >80% de coverage
✅ Usar mocks para todas las dependencias

### 4. Code Organization

✅ Agrupar por features, no por tipos
✅ Mantener archivos pequeños y enfocados
✅ Usar naming conventions consistentes
✅ Documentar decisiones arquitecturales

### 5. Error Handling

✅ Usar Either<Failure, Success> en repositories
✅ Convertir Exceptions en Failures en repositories
✅ Manejar todos los casos de error en UI
✅ Proveer mensajes de error útiles al usuario

### 6. State Management

✅ Mantener estado inmutable
✅ Usar copyWith para actualizaciones
✅ Implementar equals y hashCode (o usar Equatable/Freezed)
✅ Separar state management de business logic

---

_Para más información sobre state management específico, consultar `state-management-guide.md`._
