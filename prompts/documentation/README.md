# 📚 Prompts de Documentación

Biblioteca de prompts especializados para tareas de documentación.

## 📋 Categorías de Prompts

| Categoría | Archivo | Propósito |
| --------- | ------- | --------- |
| 📖 READMEs | `readme-prompts.md` | Crear y mejorar READMEs |
| 📝 Changelogs | `changelog-prompts.md` | Mantener changelogs |
| 📊 Diagramas | `diagram-prompts.md` | Crear diagramas técnicos |
| 🏛️ Arquitectura | `architecture-prompts.md` | Documentar arquitectura |
| 📚 APIs | `api-documentation-prompts.md` | Documentar APIs |
| 👋 Onboarding | `onboarding-prompts.md` | Guías de onboarding |

## 🎯 Cómo Usar los Prompts

### 1. Seleccionar el Prompt Apropiado

Navega a la categoría correcta según tu necesidad de documentación.

### 2. Copiar y Personalizar

Copia el prompt y personalízalo con la información específica de tu proyecto.

### 3. Ejecutar con AI Agent

Usa el prompt con tu agente de documentación preferido (Documentation Specialist).

### 4. Revisar y Refinar

Siempre revisa el output generado y ajusta según necesidades específicas.

## 📚 Mejores Prácticas

### Para READMEs

- Mantén el README conciso pero completo
- Incluye badges para status visual rápido
- Quick start debe ser funcional en < 5 minutos
- Links a documentación detallada, no todo en el README

### Para Changelogs

- Sigue Keep a Changelog estrictamente
- Usa Semantic Versioning
- Agrupa cambios por categoría (Added, Changed, Fixed, etc.)
- Incluye links a PRs/issues cuando sea relevante

### Para Diagramas

- Usa Mermaid para diagramas simples (versionables)
- Incluye leyendas cuando sea necesario
- Mantén nivel de detalle apropiado a la audiencia
- Actualiza diagramas cuando cambie la arquitectura

### Para Documentación de API

- Sigue OpenAPI/Swagger cuando sea posible
- Incluye ejemplos de requests y responses completos
- Documenta error codes y casos edge
- Mantén sincronizado con el código

## 🔍 Tips de Documentación

### Escribir para la Audiencia

```markdown
## ✅ Bueno

> Esta API permite crear usuarios. Requiere autenticación Bearer token.

## ❌ Malo

> POST /users endpoint para crear users. Auth needed.
```

### Usar Ejemplos Concretos

```markdown
## ✅ Bueno

\`\`\`bash
curl -X POST https://api.example.com/users \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
\`\`\`

## ❌ Malo

\`\`\`
POST /users with token and data
\`\`\`
```

### Mantener Actualizado

- Documenta mientras desarrollas, no después
- Incluye actualizaciones de docs en PRs
- Audita documentación regularmente
- Remove documentación obsoleta

## 🚀 Comandos Rápidos

### Generar README

```markdown
@documentation-specialist "Crear README para [proyecto] que [descripción]. 
Stack: [tecnologías]. Features principales: [lista]"
```

### Actualizar Changelog

```markdown
@documentation-specialist "Actualizar CHANGELOG.md con cambios de versión [x.y.z]. 
Cambios: [lista de PRs o features]"
```

### Crear Diagrama

```markdown
@documentation-specialist "Crear diagrama C4 de [componente/sistema]. 
Componentes: [lista]. Interacciones: [descripción]"
```

### Documentar API

```markdown
@documentation-specialist "Documentar endpoint [METHOD /path]. 
Params: [lista]. Response: [estructura]. Auth: [tipo]"
```

## 📊 Checklist de Calidad

Antes de finalizar documentación:

- [ ] Sin typos obvios
- [ ] Links funcionan
- [ ] Ejemplos de código ejecutan
- [ ] Formato consistente
- [ ] Información actualizada
- [ ] Apropiado para la audiencia
- [ ] Screenshots actualizados (si aplica)
- [ ] Diagramas sincronizados con código

---

_Prompts curados por Documentation Specialist Agent_ 📚
