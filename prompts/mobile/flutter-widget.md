# Flutter Widget

**Categoría:** Mobile  
**Nivel:** Básico  
**Tecnologías:** Flutter, Dart

## Objetivo

Crear un widget Flutter reutilizable, bien estructurado y siguiendo las mejores prácticas de Flutter.

## Contexto

Este prompt genera widgets Flutter personalizados con estado apropiado, animaciones opcionales y diseño responsive. Ideal para crear componentes UI consistentes en aplicaciones Flutter.

## Prompt

```
Crea un widget Flutter llamado {{WidgetName}} que {{functionality}}.

Requisitos:

1. Tipo de widget:
   - {{widget_type}} (StatelessWidget o StatefulWidget)
   - Use const constructor cuando sea posible
   - Immutable properties

2. Propiedades requeridas:
   {{list_properties}}

3. Funcionalidad:
   {{describe_behavior}}

4. Diseño:
   - Material Design 3
   - Responsive (adapta a diferentes tamaños)
   - Soporte para themes (light/dark)
   - Animaciones suaves (si aplica)

5. Estado (si es StatefulWidget):
   - State management apropiado
   - Dispose de resources
   - Lifecycle methods correctos

6. Accesibilidad:
   - Semantics widgets
   - Contraste adecuado
   - Tamaños táctiles apropiados (min 48x48)

7. Performance:
   - Const constructors donde sea posible
   - Keys apropiadas si es necesario
   - Evitar rebuilds innecesarios

8. Testing:
   - Widget tests básicos
   - Golden tests (opcional)
   - Tests de interacción

Estructura de archivos:
```
widgets/
├── {{widget_name}}/
│   ├── {{widget_name}}.dart
│   ├── {{widget_name}}_state.dart (si tiene estado complejo)
│   └── {{widget_name}}_test.dart
```
```

## Ejemplo de Uso

### Variables a reemplazar:

- `{{WidgetName}}`: "CustomButton"
- `{{functionality}}`: "muestre un botón personalizable con diferentes estilos y estados"
- `{{widget_type}}`: "StatelessWidget"
- `{{list_properties}}`: "label, onPressed, buttonStyle (primary/secondary/outlined), isLoading, isDisabled"
- `{{describe_behavior}}`: "Botón que cambia de estilo según el tipo, muestra loading spinner cuando isLoading es true, y está deshabilitado cuando isDisabled es true"

## Resultados Esperados

### Widget Principal (custom_button.dart)

```dart
import 'package:flutter/material.dart';

/// Un botón personalizable con diferentes estilos y estados.
///
/// Ejemplo:
/// ```dart
/// CustomButton(
///   label: 'Click me',
///   onPressed: () => print('Pressed'),
///   buttonStyle: ButtonStyle.primary,
/// )
/// ```
class CustomButton extends StatelessWidget {
  /// Texto que se muestra en el botón
  final String label;

  /// Callback cuando se presiona el botón
  final VoidCallback? onPressed;

  /// Estilo visual del botón
  final ButtonStyle buttonStyle;

  /// Si es true, muestra un indicador de carga
  final bool isLoading;

  /// Si es true, el botón está deshabilitado
  final bool isDisabled;

  /// Widget opcional a mostrar antes del label
  final Widget? leadingIcon;

  /// Widget opcional a mostrar después del label
  final Widget? trailingIcon;

  /// Tamaño del botón
  final ButtonSize size;

  const CustomButton({
    Key? key,
    required this.label,
    required this.onPressed,
    this.buttonStyle = ButtonStyle.primary,
    this.isLoading = false,
    this.isDisabled = false,
    this.leadingIcon,
    this.trailingIcon,
    this.size = ButtonSize.medium,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    // Determinar colores según el estilo
    Color backgroundColor;
    Color foregroundColor;
    Color? borderColor;

    switch (buttonStyle) {
      case ButtonStyle.primary:
        backgroundColor = colorScheme.primary;
        foregroundColor = colorScheme.onPrimary;
        borderColor = null;
        break;
      case ButtonStyle.secondary:
        backgroundColor = colorScheme.secondary;
        foregroundColor = colorScheme.onSecondary;
        borderColor = null;
        break;
      case ButtonStyle.outlined:
        backgroundColor = Colors.transparent;
        foregroundColor = colorScheme.primary;
        borderColor = colorScheme.primary;
        break;
    }

    // Determinar padding según el tamaño
    EdgeInsets padding;
    double fontSize;

    switch (size) {
      case ButtonSize.small:
        padding = const EdgeInsets.symmetric(horizontal: 12, vertical: 8);
        fontSize = 14;
        break;
      case ButtonSize.medium:
        padding = const EdgeInsets.symmetric(horizontal: 16, vertical: 12);
        fontSize = 16;
        break;
      case ButtonSize.large:
        padding = const EdgeInsets.symmetric(horizontal: 24, vertical: 16);
        fontSize = 18;
        break;
    }

    final isDisabledOrLoading = isDisabled || isLoading;

    return Semantics(
      button: true,
      enabled: !isDisabledOrLoading,
      label: label,
      child: Material(
        color: isDisabledOrLoading
            ? backgroundColor.withOpacity(0.5)
            : backgroundColor,
        borderRadius: BorderRadius.circular(8),
        child: InkWell(
          onTap: isDisabledOrLoading ? null : onPressed,
          borderRadius: BorderRadius.circular(8),
          child: Container(
            padding: padding,
            decoration: BoxDecoration(
              border: borderColor != null
                  ? Border.all(
                      color: isDisabledOrLoading
                          ? borderColor.withOpacity(0.5)
                          : borderColor,
                      width: 2,
                    )
                  : null,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (isLoading)
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(
                          foregroundColor,
                        ),
                      ),
                    ),
                  )
                else if (leadingIcon != null)
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: leadingIcon!,
                  ),
                Text(
                  label,
                  style: TextStyle(
                    color: isDisabledOrLoading
                        ? foregroundColor.withOpacity(0.5)
                        : foregroundColor,
                    fontSize: fontSize,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                if (!isLoading && trailingIcon != null)
                  Padding(
                    padding: const EdgeInsets.only(left: 8),
                    child: trailingIcon!,
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Estilos disponibles para el botón
enum ButtonStyle {
  primary,
  secondary,
  outlined,
}

/// Tamaños disponibles para el botón
enum ButtonSize {
  small,
  medium,
  large,
}
```

### Tests (custom_button_test.dart)

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'custom_button.dart';

void main() {
  group('CustomButton', () {
    testWidgets('renders with label', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CustomButton(
              label: 'Test Button',
              onPressed: () {},
            ),
          ),
        ),
      );

      expect(find.text('Test Button'), findsOneWidget);
    });

    testWidgets('calls onPressed when tapped', (WidgetTester tester) async {
      var pressed = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CustomButton(
              label: 'Test Button',
              onPressed: () => pressed = true,
            ),
          ),
        ),
      );

      await tester.tap(find.byType(CustomButton));
      await tester.pump();

      expect(pressed, isTrue);
    });

    testWidgets('does not call onPressed when disabled',
        (WidgetTester tester) async {
      var pressed = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CustomButton(
              label: 'Test Button',
              onPressed: () => pressed = true,
              isDisabled: true,
            ),
          ),
        ),
      );

      await tester.tap(find.byType(CustomButton));
      await tester.pump();

      expect(pressed, isFalse);
    });

    testWidgets('shows loading indicator when isLoading is true',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CustomButton(
              label: 'Test Button',
              onPressed: () {},
              isLoading: true,
            ),
          ),
        ),
      );

      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });

    testWidgets('applies primary style correctly',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CustomButton(
              label: 'Test Button',
              onPressed: () {},
              buttonStyle: ButtonStyle.primary,
            ),
          ),
        ),
      );

      final material = tester.widget<Material>(
        find.descendant(
          of: find.byType(CustomButton),
          matching: find.byType(Material),
        ),
      );

      expect(material.color, isNotNull);
    });

    testWidgets('renders with leading icon', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CustomButton(
              label: 'Test Button',
              onPressed: () {},
              leadingIcon: const Icon(Icons.star),
            ),
          ),
        ),
      );

      expect(find.byIcon(Icons.star), findsOneWidget);
    });
  });
}
```

## Tips Adicionales

### Con animación:

```
Agrega AnimatedContainer para animar cambios de tamaño/color.
Usa Hero widget para transiciones entre pantallas.
```

### Con GestureDetector avanzado:

```
Reemplaza InkWell con GestureDetector para gestos personalizados:
- onLongPress
- onDoubleTap
- onHorizontalDrag
```

### Con tema personalizado:

```
Crea un CustomButtonTheme para configurar estilos globalmente.
Usa Theme.of(context).extension<CustomButtonTheme>().
```

## Casos de Uso

- ✅ Botones de acción
- ✅ Formularios
- ✅ Navigation
- ✅ CTAs
- ✅ Cards interactivas

---

_Flutter Widget - Construyendo componentes reutilizables_ 🎨
