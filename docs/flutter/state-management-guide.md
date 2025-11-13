# 📘 Flutter State Management Guide

Guía completa de patrones de gestión de estado en Flutter con ejemplos detallados y mejores prácticas.

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Bloc/Cubit Pattern](#bloccubit-pattern)
3. [Provider Pattern](#provider-pattern)
4. [Riverpod Pattern](#riverpod-pattern)
5. [GetX Pattern](#getx-pattern)
6. [Comparación de Patrones](#comparación-de-patrones)
7. [Guía de Selección](#guía-de-selección)

## Introducción

La gestión de estado es uno de los aspectos más importantes en el desarrollo de aplicaciones Flutter. Elegir el patrón correcto puede marcar la diferencia entre una aplicación mantenible y escalable vs una aplicación difícil de mantener.

### ¿Qué es State Management?

State management es cómo gestionamos y sincronizamos el estado de la aplicación entre diferentes widgets y pantallas. En Flutter, esto incluye:

- **Local State**: Estado que solo afecta un widget
- **App State**: Estado compartido entre múltiples widgets
- **Ephemeral State**: Estado temporal (ej: animaciones)
- **Persistent State**: Estado que debe persistir entre sesiones

## Bloc/Cubit Pattern

### Conceptos Fundamentales

**BLoC (Business Logic Component)** separa la lógica de negocio de la UI usando streams. **Cubit** es una versión simplificada que usa funciones en lugar de events.

### Estructura de Archivos

```
feature/
├── data/
│   ├── models/
│   └── repositories/
├── domain/
│   ├── entities/
│   └── usecases/
└── presentation/
    ├── bloc/
    │   ├── feature_bloc.dart
    │   ├── feature_event.dart
    │   └── feature_state.dart
    ├── pages/
    └── widgets/
```

### Setup de Dependencias

```yaml
# pubspec.yaml
dependencies:
  flutter_bloc: ^8.1.3
  bloc: ^8.1.2
  equatable: ^2.0.5
  freezed_annotation: ^2.4.1

dev_dependencies:
  freezed: ^2.4.5
  build_runner: ^2.4.6
  bloc_test: ^9.1.4
```

### Implementación Completa

#### 1. Entity (Domain Layer)

```dart
// domain/entities/product.dart
import 'package:equatable/equatable.dart';

class Product extends Equatable {
  final String id;
  final String name;
  final String description;
  final double price;
  final String imageUrl;
  final int stock;

  const Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.imageUrl,
    required this.stock,
  });

  bool get isAvailable => stock > 0;

  @override
  List<Object?> get props => [id, name, description, price, imageUrl, stock];
}
```

#### 2. Model (Data Layer)

```dart
// data/models/product_model.dart
import 'package:freezed_annotation/freezed_annotation.dart';
import '../../domain/entities/product.dart';

part 'product_model.freezed.dart';
part 'product_model.g.dart';

@freezed
class ProductModel with _$ProductModel {
  const ProductModel._();

  const factory ProductModel({
    required String id,
    required String name,
    required String description,
    required double price,
    @JsonKey(name: 'image_url') required String imageUrl,
    required int stock,
  }) = _ProductModel;

  factory ProductModel.fromJson(Map<String, dynamic> json) =>
      _$ProductModelFromJson(json);

  Product toEntity() => Product(
        id: id,
        name: name,
        description: description,
        price: price,
        imageUrl: imageUrl,
        stock: stock,
      );

  factory ProductModel.fromEntity(Product product) => ProductModel(
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
      );
}
```

#### 3. Repository (Domain Layer)

```dart
// domain/repositories/product_repository.dart
import 'package:dartz/dartz.dart';
import '../../core/errors/failures.dart';
import '../entities/product.dart';

abstract class ProductRepository {
  Future<Either<Failure, List<Product>>> getProducts();
  Future<Either<Failure, Product>> getProduct(String id);
  Future<Either<Failure, Product>> createProduct(Product product);
  Future<Either<Failure, Product>> updateProduct(Product product);
  Future<Either<Failure, void>> deleteProduct(String id);
}
```

#### 4. Repository Implementation (Data Layer)

```dart
// data/repositories/product_repository_impl.dart
import 'package:dartz/dartz.dart';
import '../../core/errors/failures.dart';
import '../../core/errors/exceptions.dart';
import '../../domain/entities/product.dart';
import '../../domain/repositories/product_repository.dart';
import '../datasources/product_remote_datasource.dart';
import '../models/product_model.dart';

class ProductRepositoryImpl implements ProductRepository {
  final ProductRemoteDataSource remoteDataSource;

  ProductRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Either<Failure, List<Product>>> getProducts() async {
    try {
      final products = await remoteDataSource.getProducts();
      return Right(products.map((model) => model.toEntity()).toList());
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException {
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, Product>> getProduct(String id) async {
    try {
      final product = await remoteDataSource.getProduct(id);
      return Right(product.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NotFoundException {
      return Left(NotFoundFailure('Product not found'));
    }
  }

  @override
  Future<Either<Failure, Product>> createProduct(Product product) async {
    try {
      final model = ProductModel.fromEntity(product);
      final created = await remoteDataSource.createProduct(model);
      return Right(created.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    }
  }

  @override
  Future<Either<Failure, Product>> updateProduct(Product product) async {
    try {
      final model = ProductModel.fromEntity(product);
      final updated = await remoteDataSource.updateProduct(model);
      return Right(updated.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    }
  }

  @override
  Future<Either<Failure, void>> deleteProduct(String id) async {
    try {
      await remoteDataSource.deleteProduct(id);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    }
  }
}
```

#### 5. Bloc Implementation

```dart
// presentation/bloc/product/product_bloc.dart
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:injectable/injectable.dart';
import '../../../domain/entities/product.dart';
import '../../../domain/usecases/get_products.dart';
import '../../../domain/usecases/get_product.dart';
import '../../../domain/usecases/create_product.dart';
import '../../../domain/usecases/update_product.dart';
import '../../../domain/usecases/delete_product.dart';

part 'product_bloc.freezed.dart';
part 'product_event.dart';
part 'product_state.dart';

@injectable
class ProductBloc extends Bloc<ProductEvent, ProductState> {
  final GetProducts getProducts;
  final GetProduct getProduct;
  final CreateProduct createProduct;
  final UpdateProduct updateProduct;
  final DeleteProduct deleteProduct;

  ProductBloc({
    required this.getProducts,
    required this.getProduct,
    required this.createProduct,
    required this.updateProduct,
    required this.deleteProduct,
  }) : super(const ProductState.initial()) {
    on<ProductEvent>((event, emit) async {
      await event.map(
        started: (_) => _onStarted(emit),
        loadProducts: (_) => _onLoadProducts(emit),
        loadProduct: (e) => _onLoadProduct(e, emit),
        createProduct: (e) => _onCreateProduct(e, emit),
        updateProduct: (e) => _onUpdateProduct(e, emit),
        deleteProduct: (e) => _onDeleteProduct(e, emit),
      );
    });
  }

  Future<void> _onStarted(Emitter<ProductState> emit) async {
    emit(const ProductState.loading());
    final result = await getProducts(NoParams());
    result.fold(
      (failure) => emit(ProductState.error(failure.message)),
      (products) => emit(ProductState.loaded(products)),
    );
  }

  Future<void> _onLoadProducts(Emitter<ProductState> emit) async {
    emit(const ProductState.loading());
    final result = await getProducts(NoParams());
    result.fold(
      (failure) => emit(ProductState.error(failure.message)),
      (products) => emit(ProductState.loaded(products)),
    );
  }

  Future<void> _onLoadProduct(
    _LoadProduct event,
    Emitter<ProductState> emit,
  ) async {
    emit(const ProductState.loading());
    final result = await getProduct(GetProductParams(id: event.id));
    result.fold(
      (failure) => emit(ProductState.error(failure.message)),
      (product) => emit(ProductState.productDetail(product)),
    );
  }

  Future<void> _onCreateProduct(
    _CreateProduct event,
    Emitter<ProductState> emit,
  ) async {
    emit(const ProductState.loading());
    final result = await createProduct(
      CreateProductParams(product: event.product),
    );
    result.fold(
      (failure) => emit(ProductState.error(failure.message)),
      (product) {
        emit(ProductState.created(product));
        add(const ProductEvent.loadProducts());
      },
    );
  }

  Future<void> _onUpdateProduct(
    _UpdateProduct event,
    Emitter<ProductState> emit,
  ) async {
    emit(const ProductState.loading());
    final result = await updateProduct(
      UpdateProductParams(product: event.product),
    );
    result.fold(
      (failure) => emit(ProductState.error(failure.message)),
      (product) {
        emit(ProductState.updated(product));
        add(const ProductEvent.loadProducts());
      },
    );
  }

  Future<void> _onDeleteProduct(
    _DeleteProduct event,
    Emitter<ProductState> emit,
  ) async {
    emit(const ProductState.loading());
    final result = await deleteProduct(
      DeleteProductParams(id: event.id),
    );
    result.fold(
      (failure) => emit(ProductState.error(failure.message)),
      (_) {
        emit(const ProductState.deleted());
        add(const ProductEvent.loadProducts());
      },
    );
  }
}
```

#### 6. Events

```dart
// part of product_bloc.dart
@freezed
class ProductEvent with _$ProductEvent {
  const factory ProductEvent.started() = _Started;
  const factory ProductEvent.loadProducts() = _LoadProducts;
  const factory ProductEvent.loadProduct(String id) = _LoadProduct;
  const factory ProductEvent.createProduct(Product product) = _CreateProduct;
  const factory ProductEvent.updateProduct(Product product) = _UpdateProduct;
  const factory ProductEvent.deleteProduct(String id) = _DeleteProduct;
}
```

#### 7. States

```dart
// part of product_bloc.dart
@freezed
class ProductState with _$ProductState {
  const factory ProductState.initial() = _Initial;
  const factory ProductState.loading() = _Loading;
  const factory ProductState.loaded(List<Product> products) = _Loaded;
  const factory ProductState.productDetail(Product product) = _ProductDetail;
  const factory ProductState.created(Product product) = _Created;
  const factory ProductState.updated(Product product) = _Updated;
  const factory ProductState.deleted() = _Deleted;
  const factory ProductState.error(String message) = _Error;
}
```

#### 8. Widget Usage

```dart
// presentation/pages/products_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/product/product_bloc.dart';
import '../widgets/product_card.dart';

class ProductsPage extends StatelessWidget {
  const ProductsPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Products'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _navigateToCreateProduct(context),
          ),
        ],
      ),
      body: BlocConsumer<ProductBloc, ProductState>(
        listener: (context, state) {
          state.maybeWhen(
            created: (product) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Product created successfully')),
              );
            },
            updated: (product) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Product updated successfully')),
              );
            },
            deleted: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Product deleted successfully')),
              );
            },
            error: (message) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text(message)),
              );
            },
            orElse: () {},
          );
        },
        builder: (context, state) {
          return state.maybeWhen(
            loading: () => const Center(child: CircularProgressIndicator()),
            loaded: (products) => _buildProductList(products),
            error: (message) => Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(message),
                  ElevatedButton(
                    onPressed: () => context
                        .read<ProductBloc>()
                        .add(const ProductEvent.loadProducts()),
                    child: const Text('Retry'),
                  ),
                ],
              ),
            ),
            orElse: () => const SizedBox.shrink(),
          );
        },
      ),
    );
  }

  Widget _buildProductList(List<Product> products) {
    if (products.isEmpty) {
      return const Center(child: Text('No products found'));
    }

    return RefreshIndicator(
      onRefresh: () async {
        context.read<ProductBloc>().add(const ProductEvent.loadProducts());
      },
      child: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.7,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
        ),
        itemCount: products.length,
        itemBuilder: (context, index) {
          return ProductCard(product: products[index]);
        },
      ),
    );
  }

  void _navigateToCreateProduct(BuildContext context) {
    Navigator.pushNamed(context, '/products/create');
  }
}
```

### Ventajas de Bloc

✅ Separation of concerns excelente
✅ Testabilidad máxima
✅ Type safety completo
✅ Stream-based reactive
✅ Time-travel debugging
✅ Ideal para aplicaciones enterprise

### Desventajas de Bloc

❌ Curva de aprendizaje alta
❌ Mucho boilerplate
❌ Configuración inicial compleja
❌ Puede ser overkill para apps simples

## Provider Pattern

Provider es el patrón recomendado oficialmente por el equipo de Flutter. Es simple, flexible y fácil de aprender.

### Setup de Dependencias

```yaml
# pubspec.yaml
dependencies:
  provider: ^6.0.5
```

### Implementación Completa

#### 1. ChangeNotifier

```dart
// presentation/providers/product_provider.dart
import 'package:flutter/foundation.dart';
import '../../domain/entities/product.dart';
import '../../domain/usecases/get_products.dart';
import '../../domain/usecases/create_product.dart';
import '../../domain/usecases/update_product.dart';
import '../../domain/usecases/delete_product.dart';

enum ProductStatus { initial, loading, loaded, error, created, updated, deleted }

class ProductProvider extends ChangeNotifier {
  final GetProducts _getProducts;
  final CreateProduct _createProduct;
  final UpdateProduct _updateProduct;
  final DeleteProduct _deleteProduct;

  ProductProvider({
    required GetProducts getProducts,
    required CreateProduct createProduct,
    required UpdateProduct updateProduct,
    required DeleteProduct deleteProduct,
  })  : _getProducts = getProducts,
        _createProduct = createProduct,
        _updateProduct = updateProduct,
        _deleteProduct = deleteProduct;

  ProductStatus _status = ProductStatus.initial;
  List<Product> _products = [];
  Product? _selectedProduct;
  String? _errorMessage;

  ProductStatus get status => _status;
  List<Product> get products => List.unmodifiable(_products);
  Product? get selectedProduct => _selectedProduct;
  String? get errorMessage => _errorMessage;

  bool get isLoading => _status == ProductStatus.loading;
  bool get hasError => _status == ProductStatus.error;

  Future<void> loadProducts() async {
    _setStatus(ProductStatus.loading);

    final result = await _getProducts(NoParams());

    result.fold(
      (failure) => _setError(failure.message),
      (products) {
        _products = products;
        _setStatus(ProductStatus.loaded);
      },
    );
  }

  Future<void> createProduct(Product product) async {
    _setStatus(ProductStatus.loading);

    final result = await _createProduct(
      CreateProductParams(product: product),
    );

    result.fold(
      (failure) => _setError(failure.message),
      (product) {
        _products.add(product);
        _setStatus(ProductStatus.created);
      },
    );
  }

  Future<void> updateProduct(Product product) async {
    _setStatus(ProductStatus.loading);

    final result = await _updateProduct(
      UpdateProductParams(product: product),
    );

    result.fold(
      (failure) => _setError(failure.message),
      (updated) {
        final index = _products.indexWhere((p) => p.id == updated.id);
        if (index != -1) {
          _products[index] = updated;
        }
        _setStatus(ProductStatus.updated);
      },
    );
  }

  Future<void> deleteProduct(String id) async {
    _setStatus(ProductStatus.loading);

    final result = await _deleteProduct(
      DeleteProductParams(id: id),
    );

    result.fold(
      (failure) => _setError(failure.message),
      (_) {
        _products.removeWhere((p) => p.id == id);
        _setStatus(ProductStatus.deleted);
      },
    );
  }

  void _setStatus(ProductStatus status) {
    _status = status;
    _errorMessage = null;
    notifyListeners();
  }

  void _setError(String message) {
    _status = ProductStatus.error;
    _errorMessage = message;
    notifyListeners();
  }
}
```

#### 2. Widget Usage

```dart
// main.dart
void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => ProductProvider(
            getProducts: getIt<GetProducts>(),
            createProduct: getIt<CreateProduct>(),
            updateProduct: getIt<UpdateProduct>(),
            deleteProduct: getIt<DeleteProduct>(),
          )..loadProducts(),
        ),
      ],
      child: const MyApp(),
    ),
  );
}
```

```dart
// presentation/pages/products_page.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/product_provider.dart';

class ProductsPage extends StatelessWidget {
  const ProductsPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Products')),
      body: Consumer<ProductProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (provider.hasError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(provider.errorMessage ?? 'Error'),
                  ElevatedButton(
                    onPressed: () => provider.loadProducts(),
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          }

          return ListView.builder(
            itemCount: provider.products.length,
            itemBuilder: (context, index) {
              final product = provider.products[index];
              return ListTile(
                title: Text(product.name),
                subtitle: Text('\$${product.price}'),
                trailing: IconButton(
                  icon: const Icon(Icons.delete),
                  onPressed: () => provider.deleteProduct(product.id),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
```

### Ventajas de Provider

✅ Simple y fácil de aprender
✅ Recomendado oficialmente por Flutter
✅ Poco boilerplate
✅ Flexible y extensible
✅ Buen rendimiento

### Desventajas de Provider

❌ Menos estructura que Bloc
❌ Requiere BuildContext
❌ Puede llevar a código menos organizado
❌ Testing más manual

## Comparación de Patrones

| Característica | Bloc | Provider | Riverpod | GetX |
|----------------|------|----------|----------|------|
| **Complejidad** | Alta | Media | Media | Baja |
| **Boilerplate** | Alto | Medio | Bajo | Muy Bajo |
| **Testability** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Type Safety** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Learning Curve** | Steep | Moderate | Moderate | Easy |
| **Community** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## Guía de Selección

### Usar Bloc cuando:
- Aplicación enterprise grande
- Equipo con experiencia en arquitectura
- Testing exhaustivo es crítico
- Separation of concerns es prioritario
- Flujos de estado muy complejos

### Usar Provider cuando:
- Aplicación mediana
- Equipo con conocimiento básico-medio de Flutter
- Balance entre simplicidad y estructura
- Proyectos con timeline moderado
- Requerimientos estándar

### Usar Riverpod cuando:
- Proyecto moderno desde cero
- Type safety es crítico
- No quieres depender de BuildContext
- Testing simplificado es importante
- Equipo experimentado en Flutter

### Usar GetX cuando:
- MVP o prototipo rápido
- Equipo pequeño
- Deadline apretado
- Aplicación simple a mediana
- All-in-one solution preferida

---

_Para más información, consultar la documentación oficial de cada patrón._
