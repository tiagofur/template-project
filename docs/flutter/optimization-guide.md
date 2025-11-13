# ⚡ Flutter Performance Optimization Guide

Guía completa de optimización de rendimiento para aplicaciones Flutter, enfocada en gestión de estado y rebuilds.

## 📋 Tabla de Contenidos

1. [Widget Rebuild Optimization](#widget-rebuild-optimization)
2. [State Management Performance](#state-management-performance)
3. [List & Grid Optimization](#list--grid-optimization)
4. [Image & Media Optimization](#image--media-optimization)
5. [Async Operations](#async-operations)
6. [Memory Management](#memory-management)
7. [Profiling & Debugging](#profiling--debugging)

## Widget Rebuild Optimization

### 1. Const Constructors

**Problema**: Widgets innecesariamente recreados en cada rebuild.

**Solución**: Usar const constructors siempre que sea posible.

```dart
// ❌ MAL
Widget build(BuildContext context) {
  return Column(
    children: [
      Text('Title'),
      SizedBox(height: 16),
      MyWidget(),
    ],
  );
}

// ✅ BIEN
Widget build(BuildContext context) {
  return Column(
    children: const [
      Text('Title'),
      SizedBox(height: 16),
      MyWidget(),
    ],
  );
}
```

### 2. Extract Widgets

**Problema**: Rebuilds innecesarios de widgets que no cambian.

**Solución**: Extraer widgets que no dependen del estado.

```dart
// ❌ MAL
class MyPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<CounterBloc, CounterState>(
      builder: (context, state) {
        return Column(
          children: [
            Text('Static Header'), // Se rebuilds innecesariamente
            Text('Counter: ${state.count}'),
          ],
        );
      },
    );
  }
}

// ✅ BIEN
class MyPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const _StaticHeader(), // No se rebuilds
        BlocBuilder<CounterBloc, CounterState>(
          builder: (context, state) {
            return Text('Counter: ${state.count}');
          },
        ),
      ],
    );
  }
}

class _StaticHeader extends StatelessWidget {
  const _StaticHeader();

  @override
  Widget build(BuildContext context) {
    return const Text('Static Header');
  }
}
```

### 3. Build Method Optimization

**Problema**: Build method demasiado complejo.

**Solución**: Dividir en widgets más pequeños.

```dart
// ❌ MAL
@override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(
      title: Text('My App'),
      actions: [
        IconButton(icon: Icon(Icons.search), onPressed: () {}),
        IconButton(icon: Icon(Icons.settings), onPressed: () {}),
      ],
    ),
    body: ListView.builder(
      itemCount: items.length,
      itemBuilder: (context, index) {
        return Card(
          child: ListTile(
            leading: CircleAvatar(child: Text(items[index].initial)),
            title: Text(items[index].name),
            subtitle: Text(items[index].description),
            trailing: IconButton(
              icon: Icon(Icons.more_vert),
              onPressed: () {},
            ),
          ),
        );
      },
    ),
  );
}

// ✅ BIEN
@override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: _buildAppBar(),
    body: _buildBody(),
  );
}

PreferredSizeWidget _buildAppBar() {
  return AppBar(
    title: const Text('My App'),
    actions: const [
      _SearchAction(),
      _SettingsAction(),
    ],
  );
}

Widget _buildBody() {
  return ListView.builder(
    itemCount: items.length,
    itemBuilder: (context, index) => _ItemCard(item: items[index]),
  );
}
```

## State Management Performance

### 1. Selective Listening con Bloc

**Problema**: Widget se rebuilds cuando cambia cualquier parte del estado.

**Solución**: Usar BlocSelector para escuchar solo campos específicos.

```dart
// ❌ MAL - Rebuilds cuando cambia cualquier cosa en UserState
BlocBuilder<UserBloc, UserState>(
  builder: (context, state) {
    return state.maybeWhen(
      loaded: (user) => Text(user.name),
      orElse: () => const SizedBox(),
    );
  },
)

// ✅ BIEN - Solo rebuilds cuando cambia el nombre
BlocSelector<UserBloc, UserState, String?>(
  selector: (state) => state.maybeWhen(
    loaded: (user) => user.name,
    orElse: () => null,
  ),
  builder: (context, name) {
    return Text(name ?? '');
  },
)
```

### 2. Provider con Selector

**Problema**: Consumer rebuilds en cada cambio.

**Solución**: Usar Selector para filtrar cambios.

```dart
// ❌ MAL
Consumer<UserProvider>(
  builder: (context, provider, child) {
    return Text(provider.user?.name ?? '');
  },
)

// ✅ BIEN
Selector<UserProvider, String?>(
  selector: (context, provider) => provider.user?.name,
  builder: (context, name, child) {
    return Text(name ?? '');
  },
)
```

### 3. Riverpod con select

**Problema**: Widget se rebuilds en cada cambio de estado.

**Solución**: Usar select para observar solo lo necesario.

```dart
// ❌ MAL
@override
Widget build(BuildContext context, WidgetRef ref) {
  final user = ref.watch(userProvider);
  return user.when(
    data: (user) => Text(user.name),
    loading: () => const CircularProgressIndicator(),
    error: (error, stack) => Text('Error: $error'),
  );
}

// ✅ BIEN
@override
Widget build(BuildContext context, WidgetRef ref) {
  final userName = ref.watch(
    userProvider.select((state) => state.value?.name),
  );
  return Text(userName ?? '');
}
```

### 4. Debouncing & Throttling

**Problema**: Demasiados eventos disparados (ej: búsqueda en tiempo real).

**Solución**: Implementar debouncing o throttling.

```dart
// Debouncing con Bloc
import 'package:rxdart/rxdart.dart';

class SearchBloc extends Bloc<SearchEvent, SearchState> {
  SearchBloc() : super(const SearchState.initial()) {
    on<SearchQueryChanged>(
      _onSearchQueryChanged,
      transformer: debounce(const Duration(milliseconds: 300)),
    );
  }

  EventTransformer<E> debounce<E>(Duration duration) {
    return (events, mapper) => events.debounceTime(duration).flatMap(mapper);
  }

  Future<void> _onSearchQueryChanged(
    SearchQueryChanged event,
    Emitter<SearchState> emit,
  ) async {
    // Perform search
    emit(const SearchState.loading());
    final results = await searchUseCase(SearchParams(query: event.query));
    results.fold(
      (failure) => emit(SearchState.error(failure.message)),
      (results) => emit(SearchState.loaded(results)),
    );
  }
}
```

```dart
// Throttling con Riverpod
import 'package:riverpod/riverpod.dart';
import 'package:rxdart/rxdart.dart';

class SearchNotifier extends StateNotifier<AsyncValue<List<Item>>> {
  final SearchRepository _repository;
  final _searchController = PublishSubject<String>();

  SearchNotifier(this._repository) : super(const AsyncValue.loading()) {
    _searchController
        .debounceTime(const Duration(milliseconds: 300))
        .distinct()
        .listen(_performSearch);
  }

  void search(String query) {
    _searchController.add(query);
  }

  Future<void> _performSearch(String query) async {
    state = const AsyncValue.loading();
    try {
      final results = await _repository.search(query);
      state = AsyncValue.data(results);
    } catch (error, stackTrace) {
      state = AsyncValue.error(error, stackTrace);
    }
  }

  @override
  void dispose() {
    _searchController.close();
    super.dispose();
  }
}
```

## List & Grid Optimization

### 1. ListView.builder vs ListView

**Problema**: Crear todos los items de una vez consume mucha memoria.

**Solución**: Usar builder constructors.

```dart
// ❌ MAL - Crea todos los widgets de una vez
ListView(
  children: items.map((item) => ItemWidget(item)).toList(),
)

// ✅ BIEN - Crea widgets bajo demanda
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ItemWidget(items[index]),
)
```

### 2. Keys para Performance

**Problema**: Flutter no puede identificar qué items cambiaron en una lista.

**Solución**: Usar keys apropiadas.

```dart
// ❌ MAL - Sin keys
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return ItemWidget(item: items[index]);
  },
)

// ✅ BIEN - Con ValueKey
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return ItemWidget(
      key: ValueKey(items[index].id),
      item: items[index],
    );
  },
)
```

### 3. Lazy Loading & Pagination

**Problema**: Cargar todos los datos de una vez es lento.

**Solución**: Implementar pagination.

```dart
class ProductListPage extends StatefulWidget {
  const ProductListPage({Key? key}) : super(key: key);

  @override
  State<ProductListPage> createState() => _ProductListPageState();
}

class _ProductListPageState extends State<ProductListPage> {
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    context.read<ProductBloc>().add(const ProductEvent.loadProducts());
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_isBottom) {
      context.read<ProductBloc>().add(const ProductEvent.loadMoreProducts());
    }
  }

  bool get _isBottom {
    if (!_scrollController.hasClients) return false;
    final maxScroll = _scrollController.position.maxScrollExtent;
    final currentScroll = _scrollController.offset;
    return currentScroll >= (maxScroll * 0.9);
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ProductBloc, ProductState>(
      builder: (context, state) {
        return state.maybeWhen(
          loaded: (products, hasMore, isLoadingMore) {
            return ListView.builder(
              controller: _scrollController,
              itemCount: hasMore ? products.length + 1 : products.length,
              itemBuilder: (context, index) {
                if (index >= products.length) {
                  return const Center(child: CircularProgressIndicator());
                }
                return ProductCard(product: products[index]);
              },
            );
          },
          orElse: () => const Center(child: CircularProgressIndicator()),
        );
      },
    );
  }
}
```

### 4. AutomaticKeepAlive para Tabs

**Problema**: Tabs se reconstruyen cada vez que cambias de tab.

**Solución**: Usar AutomaticKeepAliveClientMixin.

```dart
class ProductsTab extends StatefulWidget {
  const ProductsTab({Key? key}) : super(key: key);

  @override
  State<ProductsTab> createState() => _ProductsTabState();
}

class _ProductsTabState extends State<ProductsTab>
    with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context); // Required!
    return ListView.builder(
      itemCount: products.length,
      itemBuilder: (context, index) => ProductCard(products[index]),
    );
  }
}
```

## Image & Media Optimization

### 1. Cached Network Images

**Problema**: Descargar imágenes repetidamente consume ancho de banda.

**Solución**: Usar cached_network_image.

```dart
// ❌ MAL
Image.network('https://example.com/image.jpg')

// ✅ BIEN
CachedNetworkImage(
  imageUrl: 'https://example.com/image.jpg',
  placeholder: (context, url) => const CircularProgressIndicator(),
  errorWidget: (context, url, error) => const Icon(Icons.error),
  memCacheWidth: 400, // Limitar tamaño en memoria
  memCacheHeight: 400,
)
```

### 2. Image Size & Format

**Problema**: Cargar imágenes full-size desperdicia memoria.

**Solución**: Redimensionar y optimizar imágenes.

```dart
// Especificar dimensiones
Image.network(
  'https://example.com/image.jpg',
  width: 200,
  height: 200,
  fit: BoxFit.cover,
  cacheWidth: 400, // Resize en decode
  cacheHeight: 400,
)

// Para assets
Image.asset(
  'assets/images/large_image.jpg',
  cacheWidth: 400,
  cacheHeight: 400,
)
```

### 3. Lazy Loading de Imágenes

**Problema**: Cargar todas las imágenes de una lista consume memoria.

**Solución**: Las imágenes se cargan solo cuando están visibles (ListView.builder hace esto automáticamente).

## Async Operations

### 1. Future vs Stream

**Problema**: Usar Future para múltiples valores.

**Solución**: Usar Stream cuando hay múltiples valores en el tiempo.

```dart
// ❌ MAL - Polling con Future
Future<void> pollData() async {
  while (true) {
    await Future.delayed(const Duration(seconds: 5));
    final data = await fetchData();
    // Process data
  }
}

// ✅ BIEN - Stream
Stream<Data> watchData() {
  return Stream.periodic(
    const Duration(seconds: 5),
    (_) => fetchData(),
  ).asyncMap((future) => future);
}
```

### 2. Cancelación de Operations

**Problema**: Operations continúan aunque el widget se dispose.

**Solución**: Cancelar operations en dispose.

```dart
class MyWidget extends StatefulWidget {
  @override
  State<MyWidget> createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  StreamSubscription? _subscription;

  @override
  void initState() {
    super.initState();
    _subscription = dataStream.listen((data) {
      // Handle data
    });
  }

  @override
  void dispose() {
    _subscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

### 3. Compute para Heavy Operations

**Problema**: Operaciones pesadas bloquean la UI.

**Solución**: Usar compute para ejecutar en isolate.

```dart
// Heavy computation
List<Photo> parsePhotos(String responseBody) {
  final parsed = jsonDecode(responseBody).cast<Map<String, dynamic>>();
  return parsed.map<Photo>((json) => Photo.fromJson(json)).toList();
}

// En el widget
Future<List<Photo>> fetchPhotos() async {
  final response = await http.get(Uri.parse('https://api.example.com/photos'));
  
  // Parse en isolate separado
  return compute(parsePhotos, response.body);
}
```

## Memory Management

### 1. Dispose Controllers

**Problema**: Memory leaks por no dispose controllers.

**Solución**: Siempre dispose controllers y subscriptions.

```dart
class MyWidget extends StatefulWidget {
  @override
  State<MyWidget> createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  late TextEditingController _controller;
  late ScrollController _scrollController;
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController();
    _scrollController = ScrollController();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 1),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

### 2. Avoid setState during build

**Problema**: Llamar setState durante build causa rebuilds infinitos.

**Solución**: Usar addPostFrameCallback o initState.

```dart
// ❌ MAL
@override
Widget build(BuildContext context) {
  if (someCondition) {
    setState(() {
      // This causes infinite rebuild
    });
  }
  return Container();
}

// ✅ BIEN
@override
void initState() {
  super.initState();
  WidgetsBinding.instance.addPostFrameCallback((_) {
    setState(() {
      // Safe to call here
    });
  });
}
```

### 3. RepaintBoundary

**Problema**: Rebuilds innecesarios de widgets complejos.

**Solución**: Usar RepaintBoundary para aislar repaints.

```dart
RepaintBoundary(
  child: ComplexWidget(), // No se repinta cuando parent cambia
)
```

## Profiling & Debugging

### 1. Performance Overlay

Activar performance overlay para ver FPS:

```dart
MaterialApp(
  showPerformanceOverlay: true,
  // ...
)
```

### 2. DevTools

Usar Flutter DevTools para:
- **Widget Inspector**: Ver árbol de widgets y rebuilds
- **Performance**: Analizar frame rendering
- **Memory**: Detectar memory leaks
- **Network**: Monitorear requests

```bash
flutter pub global activate devtools
flutter pub global run devtools
```

### 3. Debug Rebuild Indicators

```dart
// Mostrar cuando un widget se rebuilds
class DebugRebuildWidget extends StatelessWidget {
  final Widget child;
  final String name;

  const DebugRebuildWidget({
    Key? key,
    required this.child,
    required this.name,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    debugPrint('REBUILD: $name');
    return child;
  }
}
```

### 4. Timeline Analysis

```dart
import 'dart:developer';

Future<void> expensiveOperation() async {
  Timeline.startSync('ExpensiveOperation');
  try {
    // Your code here
  } finally {
    Timeline.finishSync();
  }
}
```

## Performance Checklist

### Widget Optimization
- [ ] Usar const constructors siempre que sea posible
- [ ] Extraer widgets estáticos
- [ ] Dividir build methods complejos
- [ ] Usar keys apropiadas en listas

### State Management
- [ ] Implementar selective listening (Selector, BlocSelector, select)
- [ ] Usar debouncing/throttling para input frecuente
- [ ] Mantener estado inmutable
- [ ] Evitar rebuilds innecesarios

### Lists & Grids
- [ ] Usar builder constructors
- [ ] Implementar pagination
- [ ] Usar AutomaticKeepAlive para tabs
- [ ] Limitar número de items renderizados

### Images
- [ ] Usar cached_network_image
- [ ] Especificar cacheWidth/cacheHeight
- [ ] Optimizar tamaños de imagen
- [ ] Lazy loading de imágenes

### Async
- [ ] Cancelar subscriptions en dispose
- [ ] Usar compute para operaciones pesadas
- [ ] Preferir Streams sobre polling
- [ ] Manejar errores apropiadamente

### Memory
- [ ] Dispose todos los controllers
- [ ] Cancelar timers y subscriptions
- [ ] Evitar setState durante build
- [ ] Usar RepaintBoundary estratégicamente

### Profiling
- [ ] Usar DevTools regularmente
- [ ] Analizar frame rendering
- [ ] Monitorear memory usage
- [ ] Identificar y eliminar memory leaks

## Herramientas Recomendadas

```yaml
# pubspec.yaml
dependencies:
  cached_network_image: ^3.3.0
  rxdart: ^0.27.7

dev_dependencies:
  flutter_lints: ^3.0.0
  integration_test: ^0.5.0
```

---

_Para más información sobre arquitectura y state management, consultar `architecture-guide.md` y `state-management-guide.md`._
