# 📱 Mobile Architecture Patterns

Complete guide to mobile architecture patterns for Flutter and React Native applications.

## Overview

Mobile architecture patterns help organize code for maintainability, testability, and scalability in mobile applications. This guide covers patterns applicable to both Flutter and React Native.

---

## 1. Clean Architecture (Mobile)

### Description

Clean Architecture for mobile applications follows the same principles as backend Clean Architecture but adapted for mobile-specific concerns like UI state, navigation, and platform features.

### Structure

```
┌─────────────────────────────────────┐
│      Presentation Layer             │  ← Widgets, UI, State Management
├─────────────────────────────────────┤
│      Application Layer              │  ← Use Cases, Business Logic
├─────────────────────────────────────┤
│      Domain Layer                   │  ← Entities, Repository Interfaces
├─────────────────────────────────────┤
│      Data Layer                     │  ← API, DB, Repository Impl
└─────────────────────────────────────┘
```

### When to Use

✅ **Use When:**
- Building large, complex mobile applications
- Long-term maintenance is priority
- Need high testability
- Multiple developers working on the app
- Want platform independence (easier to port)

❌ **Avoid When:**
- Simple apps with basic CRUD operations
- Rapid prototyping or MVP
- Small team with limited experience
- Tight deadlines

### Implementation Example (Flutter)

```dart
// 1. DOMAIN LAYER - Entities
// lib/domain/entities/product.dart
import 'package:equatable/equatable.dart';

class Product extends Equatable {
  final String id;
  final String name;
  final String description;
  final double price;
  final String imageUrl;
  final bool isAvailable;

  const Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.imageUrl,
    required this.isAvailable,
  });

  @override
  List<Object?> get props => [id, name, description, price, imageUrl, isAvailable];
}

// 2. DOMAIN LAYER - Repository Interface
// lib/domain/repositories/product_repository.dart
import 'package:dartz/dartz.dart';
import '../../core/errors/failures.dart';
import '../entities/product.dart';

abstract class ProductRepository {
  Future<Either<Failure, List<Product>>> getProducts();
  Future<Either<Failure, Product>> getProduct(String id);
  Future<Either<Failure, Product>> createProduct(Product product);
  Future<Either<Failure, void>> deleteProduct(String id);
}

// 3. DOMAIN LAYER - Use Cases
// lib/domain/usecases/get_products.dart
import 'package:dartz/dartz.dart';
import '../../core/errors/failures.dart';
import '../../core/usecases/usecase.dart';
import '../entities/product.dart';
import '../repositories/product_repository.dart';

class GetProducts implements UseCase<List<Product>, NoParams> {
  final ProductRepository repository;

  GetProducts(this.repository);

  @override
  Future<Either<Failure, List<Product>>> call(NoParams params) async {
    return await repository.getProducts();
  }
}

// lib/core/usecases/usecase.dart
import 'package:dartz/dartz.dart';
import '../errors/failures.dart';

abstract class UseCase<Type, Params> {
  Future<Either<Failure, Type>> call(Params params);
}

class NoParams {}

// 4. DATA LAYER - Models
// lib/data/models/product_model.dart
import '../../domain/entities/product.dart';

class ProductModel extends Product {
  const ProductModel({
    required String id,
    required String name,
    required String description,
    required double price,
    required String imageUrl,
    required bool isAvailable,
  }) : super(
          id: id,
          name: name,
          description: description,
          price: price,
          imageUrl: imageUrl,
          isAvailable: isAvailable,
        );

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      price: (json['price'] as num).toDouble(),
      imageUrl: json['imageUrl'],
      isAvailable: json['isAvailable'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'price': price,
      'imageUrl': imageUrl,
      'isAvailable': isAvailable,
    };
  }
}

// 5. DATA LAYER - Data Sources
// lib/data/datasources/product_remote_datasource.dart
import 'package:dio/dio.dart';
import '../../core/errors/exceptions.dart';
import '../models/product_model.dart';

abstract class ProductRemoteDataSource {
  Future<List<ProductModel>> getProducts();
  Future<ProductModel> getProduct(String id);
  Future<ProductModel> createProduct(ProductModel product);
  Future<void> deleteProduct(String id);
}

class ProductRemoteDataSourceImpl implements ProductRemoteDataSource {
  final Dio dio;

  ProductRemoteDataSourceImpl({required this.dio});

  @override
  Future<List<ProductModel>> getProducts() async {
    try {
      final response = await dio.get('/products');
      final List<dynamic> data = response.data;
      return data.map((json) => ProductModel.fromJson(json)).toList();
    } on DioException catch (e) {
      throw ServerException(e.message ?? 'Server error');
    }
  }

  @override
  Future<ProductModel> getProduct(String id) async {
    try {
      final response = await dio.get('/products/$id');
      return ProductModel.fromJson(response.data);
    } on DioException catch (e) {
      if (e.response?.statusCode == 404) {
        throw NotFoundException('Product not found');
      }
      throw ServerException(e.message ?? 'Server error');
    }
  }

  @override
  Future<ProductModel> createProduct(ProductModel product) async {
    try {
      final response = await dio.post('/products', data: product.toJson());
      return ProductModel.fromJson(response.data);
    } on DioException catch (e) {
      throw ServerException(e.message ?? 'Server error');
    }
  }

  @override
  Future<void> deleteProduct(String id) async {
    try {
      await dio.delete('/products/$id');
    } on DioException catch (e) {
      throw ServerException(e.message ?? 'Server error');
    }
  }
}

// 6. DATA LAYER - Repository Implementation
// lib/data/repositories/product_repository_impl.dart
import 'package:dartz/dartz.dart';
import '../../core/errors/exceptions.dart';
import '../../core/errors/failures.dart';
import '../../core/network/network_info.dart';
import '../../domain/entities/product.dart';
import '../../domain/repositories/product_repository.dart';
import '../datasources/product_remote_datasource.dart';

class ProductRepositoryImpl implements ProductRepository {
  final ProductRemoteDataSource remoteDataSource;
  final NetworkInfo networkInfo;

  ProductRepositoryImpl({
    required this.remoteDataSource,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, List<Product>>> getProducts() async {
    if (await networkInfo.isConnected) {
      try {
        final products = await remoteDataSource.getProducts();
        return Right(products);
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      }
    } else {
      return Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, Product>> getProduct(String id) async {
    if (await networkInfo.isConnected) {
      try {
        final product = await remoteDataSource.getProduct(id);
        return Right(product);
      } on NotFoundException catch (e) {
        return Left(NotFoundFailure(e.message));
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      }
    } else {
      return Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, Product>> createProduct(Product product) async {
    if (await networkInfo.isConnected) {
      try {
        final productModel = ProductModel(
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          imageUrl: product.imageUrl,
          isAvailable: product.isAvailable,
        );
        final created = await remoteDataSource.createProduct(productModel);
        return Right(created);
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      }
    } else {
      return Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, void>> deleteProduct(String id) async {
    if (await networkInfo.isConnected) {
      try {
        await remoteDataSource.deleteProduct(id);
        return const Right(null);
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      }
    } else {
      return Left(NetworkFailure('No internet connection'));
    }
  }
}

// 7. PRESENTATION LAYER - State Management (BLoC)
// See BLoC section below for detailed implementation
```

### React Native Implementation

```typescript
// 1. Domain Layer - Entities
// src/domain/entities/Product.ts
export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly imageUrl: string,
    public readonly isAvailable: boolean
  ) {}
}

// 2. Domain Layer - Repository Interface
// src/domain/repositories/ProductRepository.ts
import { Product } from '../entities/Product';

export interface ProductRepository {
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product>;
  createProduct(product: Product): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
}

// 3. Domain Layer - Use Cases
// src/domain/usecases/GetProducts.ts
import { Product } from '../entities/Product';
import { ProductRepository } from '../repositories/ProductRepository';

export class GetProducts {
  constructor(private repository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return await this.repository.getProducts();
  }
}

// 4. Data Layer - API Client
// src/data/api/ProductApi.ts
import axios from 'axios';

export interface ProductDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
}

export class ProductApi {
  private baseUrl = 'https://api.example.com';

  async getProducts(): Promise<ProductDTO[]> {
    const response = await axios.get(`${this.baseUrl}/products`);
    return response.data;
  }

  async getProduct(id: string): Promise<ProductDTO> {
    const response = await axios.get(`${this.baseUrl}/products/${id}`);
    return response.data;
  }

  async createProduct(product: ProductDTO): Promise<ProductDTO> {
    const response = await axios.post(`${this.baseUrl}/products`, product);
    return response.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/products/${id}`);
  }
}

// 5. Data Layer - Repository Implementation
// src/data/repositories/ProductRepositoryImpl.ts
import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { ProductApi, ProductDTO } from '../api/ProductApi';

export class ProductRepositoryImpl implements ProductRepository {
  constructor(private api: ProductApi) {}

  async getProducts(): Promise<Product[]> {
    const dtos = await this.api.getProducts();
    return dtos.map(this.toDomain);
  }

  async getProduct(id: string): Promise<Product> {
    const dto = await this.api.getProduct(id);
    return this.toDomain(dto);
  }

  async createProduct(product: Product): Promise<Product> {
    const dto = this.toDTO(product);
    const created = await this.api.createProduct(dto);
    return this.toDomain(created);
  }

  async deleteProduct(id: string): Promise<void> {
    await this.api.deleteProduct(id);
  }

  private toDomain(dto: ProductDTO): Product {
    return new Product(
      dto.id,
      dto.name,
      dto.description,
      dto.price,
      dto.imageUrl,
      dto.isAvailable
    );
  }

  private toDTO(product: Product): ProductDTO {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      isAvailable: product.isAvailable,
    };
  }
}

// 6. Presentation Layer - View (React Component)
// src/presentation/screens/ProductListScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { Product } from '../../domain/entities/Product';
import { GetProducts } from '../../domain/usecases/GetProducts';

interface Props {
  getProductsUseCase: GetProducts;
}

export const ProductListScreen: React.FC<Props> = ({ getProductsUseCase }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const result = await getProductsUseCase.execute();
      setProducts(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          <Text>{item.name}</Text>
          <Text>${item.price}</Text>
        </View>
      )}
    />
  );
};
```

### Pros and Cons

**Pros:**
- ✅ Highly testable (each layer can be tested independently)
- ✅ Framework independent (easier to migrate platforms)
- ✅ Clear separation of concerns
- ✅ Scalable for large apps
- ✅ Easy to add new features

**Cons:**
- ❌ Initial complexity and setup time
- ❌ More files and boilerplate
- ❌ Steeper learning curve
- ❌ Can be overkill for simple apps

---

## 2. BLoC (Business Logic Component)

### Description

BLoC pattern separates business logic from UI using Streams. It's particularly popular in Flutter. Events go into the BLoC, states come out, and the UI reacts to state changes.

### Structure

```
┌──────────┐
│   UI     │
└────┬─────┘
     │ dispatches Events
┌────▼─────┐
│   BLoC   │  ← Business Logic
└────┬─────┘
     │ emits States
┌────▼─────┐
│   UI     │  ← Reacts to States
└──────────┘
```

### When to Use

✅ **Use When:**
- Building Flutter applications
- Need predictable state management
- Want to separate UI from business logic
- Testing is important
- Complex state transitions

❌ **Avoid When:**
- Simple apps with minimal state
- Using React Native (use Redux/MobX instead)
- Team unfamiliar with reactive programming
- Rapid prototyping

### Implementation Example (Flutter)

```dart
// 1. Events
// lib/presentation/bloc/product/product_event.dart
import 'package:equatable/equatable.dart';
import '../../../domain/entities/product.dart';

abstract class ProductEvent extends Equatable {
  const ProductEvent();

  @override
  List<Object?> get props => [];
}

class LoadProducts extends ProductEvent {}

class LoadProduct extends ProductEvent {
  final String id;

  const LoadProduct(this.id);

  @override
  List<Object?> get props => [id];
}

class CreateProduct extends ProductEvent {
  final Product product;

  const CreateProduct(this.product);

  @override
  List<Object?> get props => [product];
}

class DeleteProduct extends ProductEvent {
  final String id;

  const DeleteProduct(this.id);

  @override
  List<Object?> get props => [id];
}

// 2. States
// lib/presentation/bloc/product/product_state.dart
import 'package:equatable/equatable.dart';
import '../../../domain/entities/product.dart';

abstract class ProductState extends Equatable {
  const ProductState();

  @override
  List<Object?> get props => [];
}

class ProductInitial extends ProductState {}

class ProductLoading extends ProductState {}

class ProductsLoaded extends ProductState {
  final List<Product> products;

  const ProductsLoaded(this.products);

  @override
  List<Object?> get props => [products];
}

class ProductLoaded extends ProductState {
  final Product product;

  const ProductLoaded(this.product);

  @override
  List<Object?> get props => [product];
}

class ProductError extends ProductState {
  final String message;

  const ProductError(this.message);

  @override
  List<Object?> get props => [message];
}

class ProductCreated extends ProductState {
  final Product product;

  const ProductCreated(this.product);

  @override
  List<Object?> get props => [product];
}

class ProductDeleted extends ProductState {}

// 3. BLoC
// lib/presentation/bloc/product/product_bloc.dart
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../domain/usecases/get_products.dart';
import '../../../domain/usecases/get_product.dart';
import '../../../domain/usecases/create_product.dart';
import '../../../domain/usecases/delete_product.dart';
import '../../../core/usecases/usecase.dart';
import 'product_event.dart';
import 'product_state.dart';

class ProductBloc extends Bloc<ProductEvent, ProductState> {
  final GetProducts getProductsUseCase;
  final GetProduct getProductUseCase;
  final CreateProduct createProductUseCase;
  final DeleteProduct deleteProductUseCase;

  ProductBloc({
    required this.getProductsUseCase,
    required this.getProductUseCase,
    required this.createProductUseCase,
    required this.deleteProductUseCase,
  }) : super(ProductInitial()) {
    on<LoadProducts>(_onLoadProducts);
    on<LoadProduct>(_onLoadProduct);
    on<CreateProduct>(_onCreateProduct);
    on<DeleteProduct>(_onDeleteProduct);
  }

  Future<void> _onLoadProducts(
    LoadProducts event,
    Emitter<ProductState> emit,
  ) async {
    emit(ProductLoading());

    final result = await getProductsUseCase(NoParams());

    result.fold(
      (failure) => emit(ProductError(failure.message)),
      (products) => emit(ProductsLoaded(products)),
    );
  }

  Future<void> _onLoadProduct(
    LoadProduct event,
    Emitter<ProductState> emit,
  ) async {
    emit(ProductLoading());

    final result = await getProductUseCase(GetProductParams(id: event.id));

    result.fold(
      (failure) => emit(ProductError(failure.message)),
      (product) => emit(ProductLoaded(product)),
    );
  }

  Future<void> _onCreateProduct(
    CreateProduct event,
    Emitter<ProductState> emit,
  ) async {
    emit(ProductLoading());

    final result = await createProductUseCase(
      CreateProductParams(product: event.product),
    );

    result.fold(
      (failure) => emit(ProductError(failure.message)),
      (product) => emit(ProductCreated(product)),
    );
  }

  Future<void> _onDeleteProduct(
    DeleteProduct event,
    Emitter<ProductState> emit,
  ) async {
    emit(ProductLoading());

    final result = await deleteProductUseCase(
      DeleteProductParams(id: event.id),
    );

    result.fold(
      (failure) => emit(ProductError(failure.message)),
      (_) => emit(ProductDeleted()),
    );
  }
}

// 4. UI - Widget
// lib/presentation/pages/product_list_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/product/product_bloc.dart';
import '../bloc/product/product_event.dart';
import '../bloc/product/product_state.dart';
import '../widgets/product_card.dart';

class ProductListPage extends StatelessWidget {
  const ProductListPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Products'),
      ),
      body: BlocBuilder<ProductBloc, ProductState>(
        builder: (context, state) {
          if (state is ProductInitial) {
            // Trigger loading
            context.read<ProductBloc>().add(LoadProducts());
            return const Center(child: CircularProgressIndicator());
          }

          if (state is ProductLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state is ProductError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    state.message,
                    style: const TextStyle(color: Colors.red),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      context.read<ProductBloc>().add(LoadProducts());
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          }

          if (state is ProductsLoaded) {
            if (state.products.isEmpty) {
              return const Center(child: Text('No products found'));
            }

            return RefreshIndicator(
              onRefresh: () async {
                context.read<ProductBloc>().add(LoadProducts());
              },
              child: ListView.builder(
                itemCount: state.products.length,
                itemBuilder: (context, index) {
                  final product = state.products[index];
                  return ProductCard(
                    product: product,
                    onDelete: () {
                      context.read<ProductBloc>().add(DeleteProduct(product.id));
                    },
                    onTap: () {
                      // Navigate to detail page
                    },
                  );
                },
              ),
            );
          }

          if (state is ProductDeleted) {
            // Reload products after delete
            context.read<ProductBloc>().add(LoadProducts());
            return const Center(child: CircularProgressIndicator());
          }

          return const Center(child: Text('Unknown state'));
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Navigate to create product page
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}

// 5. Dependency Injection
// lib/injection_container.dart
import 'package:get_it/get_it.dart';
import 'presentation/bloc/product/product_bloc.dart';
import 'domain/usecases/get_products.dart';
import 'domain/usecases/get_product.dart';
import 'domain/usecases/create_product.dart';
import 'domain/usecases/delete_product.dart';
import 'domain/repositories/product_repository.dart';
import 'data/repositories/product_repository_impl.dart';
import 'data/datasources/product_remote_datasource.dart';

final sl = GetIt.instance;

Future<void> init() async {
  // BLoC
  sl.registerFactory(
    () => ProductBloc(
      getProductsUseCase: sl(),
      getProductUseCase: sl(),
      createProductUseCase: sl(),
      deleteProductUseCase: sl(),
    ),
  );

  // Use Cases
  sl.registerLazySingleton(() => GetProducts(sl()));
  sl.registerLazySingleton(() => GetProduct(sl()));
  sl.registerLazySingleton(() => CreateProduct(sl()));
  sl.registerLazySingleton(() => DeleteProduct(sl()));

  // Repository
  sl.registerLazySingleton<ProductRepository>(
    () => ProductRepositoryImpl(
      remoteDataSource: sl(),
      networkInfo: sl(),
    ),
  );

  // Data Sources
  sl.registerLazySingleton<ProductRemoteDataSource>(
    () => ProductRemoteDataSourceImpl(dio: sl()),
  );

  // External
  sl.registerLazySingleton(() => Dio());
  sl.registerLazySingleton(() => InternetConnectionChecker());
}
```

### Testing BLoC

```dart
// test/presentation/bloc/product_bloc_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dartz/dartz.dart';
import 'package:bloc_test/bloc_test.dart';

class MockGetProducts extends Mock implements GetProducts {}

void main() {
  late ProductBloc bloc;
  late MockGetProducts mockGetProducts;

  setUp(() {
    mockGetProducts = MockGetProducts();
    bloc = ProductBloc(
      getProductsUseCase: mockGetProducts,
      getProductUseCase: mockGetProduct,
      createProductUseCase: mockCreateProduct,
      deleteProductUseCase: mockDeleteProduct,
    );
  });

  test('initial state should be ProductInitial', () {
    expect(bloc.state, equals(ProductInitial()));
  });

  blocTest<ProductBloc, ProductState>(
    'should emit [ProductLoading, ProductsLoaded] when data is gotten successfully',
    build: () {
      when(() => mockGetProducts(any()))
          .thenAnswer((_) async => Right(tProductList));
      return bloc;
    },
    act: (bloc) => bloc.add(LoadProducts()),
    expect: () => [
      ProductLoading(),
      ProductsLoaded(tProductList),
    ],
  );

  blocTest<ProductBloc, ProductState>(
    'should emit [ProductLoading, ProductError] when getting data fails',
    build: () {
      when(() => mockGetProducts(any()))
          .thenAnswer((_) async => Left(ServerFailure('Server error')));
      return bloc;
    },
    act: (bloc) => bloc.add(LoadProducts()),
    expect: () => [
      ProductLoading(),
      const ProductError('Server error'),
    ],
  );
}
```

### Pros and Cons

**Pros:**
- ✅ Predictable state management
- ✅ Testable business logic
- ✅ Clear separation of UI and logic
- ✅ Great for complex state transitions
- ✅ Reactive and responsive

**Cons:**
- ❌ Boilerplate code (events, states, bloc)
- ❌ Learning curve for streams/reactive programming
- ❌ Flutter-specific (not for React Native)
- ❌ Can be complex for simple scenarios

---

## 3. MVVM (Mobile)

### Description

MVVM for mobile separates the UI (View) from presentation logic (ViewModel) and data (Model). ViewModels expose observable state that Views bind to.

### Structure

```
┌──────────┐
│   View   │  ← Widgets/Components
└────┬─────┘
     │ observes
┌────▼─────────┐
│  ViewModel   │  ← Presentation Logic, State
└────┬─────────┘
     │ uses
┌────▼─────┐
│  Model   │  ← Data, Business Logic
└──────────┘
```

### When to Use

✅ **Use When:**
- Need separation between UI and logic
- Want testable presentation logic
- Complex UI state management
- Data binding is beneficial
- Cross-platform mobile development

❌ **Avoid When:**
- Simple apps with minimal logic
- Team unfamiliar with pattern
- Rapid prototyping
- Very dynamic UIs

### Implementation Example (Flutter with Provider)

```dart
// 1. Model
// lib/models/product.dart
class Product {
  final String id;
  final String name;
  final double price;
  final String imageUrl;

  Product({
    required this.id,
    required this.name,
    required this.price,
    required this.imageUrl,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      name: json['name'],
      price: (json['price'] as num).toDouble(),
      imageUrl: json['imageUrl'],
    );
  }
}

// 2. Service
// lib/services/product_service.dart
import 'package:dio/dio.dart';
import '../models/product.dart';

class ProductService {
  final Dio _dio;

  ProductService(this._dio);

  Future<List<Product>> getProducts() async {
    final response = await _dio.get('/products');
    return (response.data as List)
        .map((json) => Product.fromJson(json))
        .toList();
  }

  Future<void> deleteProduct(String id) async {
    await _dio.delete('/products/$id');
  }
}

// 3. ViewModel
// lib/viewmodels/product_list_viewmodel.dart
import 'package:flutter/foundation.dart';
import '../models/product.dart';
import '../services/product_service.dart';

class ProductListViewModel extends ChangeNotifier {
  final ProductService _productService;

  ProductListViewModel(this._productService);

  List<Product> _products = [];
  bool _isLoading = false;
  String? _error;
  String _searchQuery = '';

  // Getters
  List<Product> get products => _products;
  bool get isLoading => _isLoading;
  String? get error => _error;
  String get searchQuery => _searchQuery;

  // Computed properties
  List<Product> get filteredProducts {
    if (_searchQuery.isEmpty) return _products;
    return _products
        .where((p) => p.name.toLowerCase().contains(_searchQuery.toLowerCase()))
        .toList();
  }

  bool get hasProducts => _products.isNotEmpty;
  int get productCount => _products.length;

  // Commands (methods)
  Future<void> loadProducts() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _products = await _productService.getProducts();
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = 'Failed to load products: $e';
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> deleteProduct(String id) async {
    try {
      await _productService.deleteProduct(id);
      _products.removeWhere((p) => p.id == id);
      notifyListeners();
    } catch (e) {
      _error = 'Failed to delete product: $e';
      notifyListeners();
    }
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}

// 4. View
// lib/views/product_list_view.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../viewmodels/product_list_viewmodel.dart';
import '../widgets/product_card.dart';

class ProductListView extends StatelessWidget {
  const ProductListView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => ProductListViewModel(
        context.read<ProductService>(),
      )..loadProducts(),
      child: Scaffold(
        appBar: AppBar(title: const Text('Products')),
        body: Consumer<ProductListViewModel>(
          builder: (context, viewModel, child) {
            if (viewModel.isLoading && !viewModel.hasProducts) {
              return const Center(child: CircularProgressIndicator());
            }

            if (viewModel.error != null) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      viewModel.error!,
                      style: const TextStyle(color: Colors.red),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: viewModel.loadProducts,
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              );
            }

            return Column(
              children: [
                // Search bar
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: TextField(
                    onChanged: viewModel.setSearchQuery,
                    decoration: const InputDecoration(
                      hintText: 'Search products...',
                      prefixIcon: Icon(Icons.search),
                    ),
                  ),
                ),

                // Product count
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Text(
                    '${viewModel.filteredProducts.length} of ${viewModel.productCount} products',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ),

                // Product list
                Expanded(
                  child: viewModel.hasProducts
                      ? RefreshIndicator(
                          onRefresh: viewModel.loadProducts,
                          child: ListView.builder(
                            itemCount: viewModel.filteredProducts.length,
                            itemBuilder: (context, index) {
                              final product = viewModel.filteredProducts[index];
                              return ProductCard(
                                product: product,
                                onDelete: () => viewModel.deleteProduct(product.id),
                              );
                            },
                          ),
                        )
                      : const Center(child: Text('No products found')),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
```

### React Native Implementation (with MobX)

```typescript
// 1. Model
// src/models/Product.ts
export class Product {
  constructor(
    public id: string,
    public name: string,
    public price: number,
    public imageUrl: string
  ) {}
}

// 2. Service
// src/services/ProductService.ts
import axios from 'axios';
import { Product } from '../models/Product';

export class ProductService {
  async getProducts(): Promise<Product[]> {
    const response = await axios.get('/api/products');
    return response.data.map(
      (item: any) => new Product(item.id, item.name, item.price, item.imageUrl)
    );
  }

  async deleteProduct(id: string): Promise<void> {
    await axios.delete(`/api/products/${id}`);
  }
}

// 3. ViewModel
// src/viewmodels/ProductListViewModel.ts
import { makeAutoObservable, runInAction } from 'mobx';
import { Product } from '../models/Product';
import { ProductService } from '../services/ProductService';

export class ProductListViewModel {
  products: Product[] = [];
  isLoading = false;
  error: string | null = null;
  searchQuery = '';

  constructor(private productService: ProductService) {
    makeAutoObservable(this);
  }

  // Computed
  get filteredProducts(): Product[] {
    if (!this.searchQuery) return this.products;
    return this.products.filter((p) =>
      p.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  get hasProducts(): boolean {
    return this.products.length > 0;
  }

  // Actions
  async loadProducts(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const products = await this.productService.getProducts();
      runInAction(() => {
        this.products = products;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to load products';
        this.isLoading = false;
      });
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await this.productService.deleteProduct(id);
      runInAction(() => {
        this.products = this.products.filter((p) => p.id !== id);
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to delete product';
      });
    }
  }

  setSearchQuery(query: string): void {
    this.searchQuery = query;
  }
}

// 4. View
// src/views/ProductListScreen.tsx
import React, { useEffect, useMemo } from 'react';
import { View, FlatList, TextInput, Text } from 'react-native';
import { observer } from 'mobx-react-lite';
import { ProductListViewModel } from '../viewmodels/ProductListViewModel';
import { ProductService } from '../services/ProductService';
import { ProductCard } from '../components/ProductCard';

export const ProductListScreen: React.FC = observer(() => {
  const viewModel = useMemo(
    () => new ProductListViewModel(new ProductService()),
    []
  );

  useEffect(() => {
    viewModel.loadProducts();
  }, []);

  if (viewModel.isLoading && !viewModel.hasProducts) {
    return <Text>Loading...</Text>;
  }

  if (viewModel.error) {
    return (
      <View>
        <Text>{viewModel.error}</Text>
        <Button title="Retry" onPress={() => viewModel.loadProducts()} />
      </View>
    );
  }

  return (
    <View>
      <TextInput
        placeholder="Search products..."
        value={viewModel.searchQuery}
        onChangeText={(text) => viewModel.setSearchQuery(text)}
      />
      <Text>
        {viewModel.filteredProducts.length} of {viewModel.products.length} products
      </Text>
      <FlatList
        data={viewModel.filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onDelete={() => viewModel.deleteProduct(item.id)}
          />
        )}
      />
    </View>
  );
});
```

### Pros and Cons

**Pros:**
- ✅ Clear separation of concerns
- ✅ Testable presentation logic
- ✅ Reusable ViewModels
- ✅ Data binding simplifies UI updates
- ✅ Works well with both Flutter and React Native

**Cons:**
- ❌ Learning curve
- ❌ More boilerplate
- ❌ Can be complex for simple screens
- ❌ Requires state management library

---

## Decision Matrix

| Pattern | Flutter | React Native | Complexity | Testability | Learning Curve |
|---------|---------|--------------|------------|-------------|----------------|
| **Clean Architecture** | ✅ | ✅ | High | Excellent | High |
| **BLoC** | ✅ | ❌ | Medium-High | Excellent | Medium-High |
| **MVVM** | ✅ | ✅ | Medium | Excellent | Medium |

## Combining Patterns

Clean Architecture + BLoC/MVVM is a common combination:

```
Clean Architecture (Overall Structure)
├── Domain Layer
├── Data Layer
└── Presentation Layer
    └── BLoC/MVVM (State Management)
```

## Related Documentation

- [Backend Architecture Patterns](./backend-patterns.md)
- [Frontend Architecture Patterns](./frontend-patterns.md)
- [Flutter Architecture Guide](../flutter/architecture-guide.md)
- [Flutter State Management](../flutter/state-management-guide.md)
- [Mobile Development Guide](../stack-guides/mobile.md)

---

**Last Updated**: 2025-11-13
