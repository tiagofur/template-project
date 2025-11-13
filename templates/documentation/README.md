# 📚 Plantillas de Documentación

Templates estandarizados para crear documentación clara y consistente en todo el proyecto.

## 📋 Templates Disponibles

| Template | Archivo | Propósito | Uso |
| -------- | ------- | --------- | --- |
| 📖 **README** | `readme-template.md` | Documentación principal del proyecto | Raíz del proyecto |
| 📝 **Changelog** | `changelog-template.md` | Registro de cambios por versión | Raíz del proyecto |
| 👋 **Onboarding** | `onboarding-template.md` | Guía para nuevos desarrolladores | `docs/onboarding/` |
| 🏛️ **ADR** | `adr-template.md` | Architecture Decision Records | `docs/architecture/decisions/` |
| 📊 **API Docs** | `api-endpoint-template.md` | Documentación de endpoints | `docs/api/` |
| ✨ **Feature Docs** | `feature-doc-template.md` | Documentación de features | `docs/features/` |
| 🐛 **Bug Report** | `bug-report-template.md` | Template para reportar bugs | `.github/ISSUE_TEMPLATE/` |
| 💡 **Feature Request** | `feature-request-template.md` | Template para nuevas features | `.github/ISSUE_TEMPLATE/` |
| 🔄 **Pull Request** | `pull-request-template.md` | Template para PRs | `.github/` |

## 🎯 Cómo Usar los Templates

### 1. Seleccionar el Template Apropiado

```bash
# Ver todos los templates disponibles
ls templates/documentation/

# Copiar template a tu ubicación
cp templates/documentation/readme-template.md ./README.md
```

### 2. Personalizar el Contenido

- Reemplazar todos los placeholders `[NOMBRE]` con valores reales
- Eliminar secciones que no apliquen
- Agregar secciones adicionales según necesidad
- Mantener el formato y estructura general

### 3. Validar la Documentación

```bash
# Lint markdown
npx markdownlint-cli2 "**/*.md"

# Check links
npx markdown-link-check README.md

# Spell check
npx cspell "**/*.md"
```

## 📁 Estructura de Documentación Recomendada

```
proyecto/
├── README.md                           # Template: readme-template.md
├── CHANGELOG.md                        # Template: changelog-template.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── LICENSE
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md              # Template: bug-report-template.md
│   │   ├── feature_request.md         # Template: feature-request-template.md
│   │   └── documentation.md
│   └── PULL_REQUEST_TEMPLATE.md       # Template: pull-request-template.md
├── docs/
│   ├── README.md
│   ├── getting-started/
│   ├── architecture/
│   │   └── decisions/
│   │       └── 0001-example.md        # Template: adr-template.md
│   ├── guides/
│   ├── api/
│   │   └── endpoints/
│   │       └── example.md             # Template: api-endpoint-template.md
│   ├── features/
│   │   └── example-feature.md         # Template: feature-doc-template.md
│   └── onboarding/
│       └── new-developers.md          # Template: onboarding-template.md
└── templates/
    └── documentation/
```

## 🎨 Guías de Estilo

### Markdown

- Usar headings jerárquicos (H1 > H2 > H3)
- Incluir tabla de contenidos en docs largos
- Code blocks siempre con lenguaje especificado
- Usar emojis para mejorar legibilidad
- Links descriptivos (no "click aquí")

### Nomenclatura

- `README.md` - Siempre uppercase
- `CHANGELOG.md` - Siempre uppercase
- `kebab-case-for-files.md` - Para docs regulares
- `PascalCaseForComponents.md` - Para documentación de componentes

### Formato de Código

```markdown
## ✅ Correcto

\`\`\`typescript
// Especificar lenguaje y formatear bien
function example() {
  return "hello";
}
\`\`\`

## ❌ Incorrecto

\`\`\`
function example() { return "hello"; }
\`\`\`
```

## 🔍 Checklist de Calidad

Antes de considerar la documentación completa, verificar:

### README

- [ ] Título descriptivo
- [ ] Badges de status
- [ ] Descripción clara del proyecto
- [ ] Quick start funcional
- [ ] Prerequisitos listados
- [ ] Instrucciones de instalación
- [ ] Ejemplos de uso
- [ ] Links a docs detalladas
- [ ] Información de licencia
- [ ] Guía de contribución

### Changelog

- [ ] Sigue Keep a Changelog
- [ ] Usa Semantic Versioning
- [ ] Categorías claras
- [ ] Fechas incluidas
- [ ] Links a versiones

### Documentación Técnica

- [ ] Overview claro
- [ ] Diagramas cuando sea necesario
- [ ] Ejemplos funcionales
- [ ] Troubleshooting
- [ ] Referencias actualizadas

## 📚 Recursos

- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Google Developer Docs Style Guide](https://developers.google.com/style)

---

_Templates creados por Documentation Specialist Agent_ 📚
