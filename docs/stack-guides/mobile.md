# 📱 Mobile Development Guide

Cross-platform mobile development with Flutter and React Native.

> **📚 Architecture Patterns:** For comprehensive architecture patterns including Clean Architecture, BLoC, and MVVM, see the [Mobile Architecture Patterns Guide](../architecture/mobile-patterns.md).

## Flutter Best Practices

### Widget Structure
```dart
class UserCard extends StatelessWidget {
  final User user;
  final VoidCallback onTap;
  
  const UserCard({
    Key? key,
    required this.user,
    required this.onTap,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(user.name),
        subtitle: Text(user.email),
        onTap: onTap,
      ),
    );
  }
}
```

### State Management (Bloc)
```dart
// Event
abstract class UserEvent {}
class LoadUsers extends UserEvent {}

// State
abstract class UserState {}
class UserLoading extends UserState {}
class UserLoaded extends UserState {
  final List<User> users;
  UserLoaded(this.users);
}

// Bloc
class UserBloc extends Bloc<UserEvent, UserState> {
  UserBloc() : super(UserLoading()) {
    on<LoadUsers>((event, emit) async {
      emit(UserLoading());
      final users = await repository.fetchUsers();
      emit(UserLoaded(users));
    });
  }
}
```

## Related Documentation

- **[Mobile Architecture Patterns](../architecture/mobile-patterns.md)** - Clean Architecture, BLoC, MVVM
- Full [Flutter Guide](../flutter/README.md)
- [Mobile Tools](../../tools/mobile/README.md)
- [Mobile Prompts](../../prompts/mobile/README.md)

---

**Last Updated**: 2025-11-13
