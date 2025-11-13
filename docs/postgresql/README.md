# 🐘 PostgreSQL Documentation

Documentación completa para PostgreSQL Database Specialist Agent.

## 📚 Guías Disponibles

### 1. [Schema Design Guide](./schema-design-guide.md)
Guía completa de diseño de esquemas normalizados para PostgreSQL.

**Contenido:**
- ✅ Normalización (1NF, 2NF, 3NF, BCNF)
- ✅ Tipos de relaciones (1:1, 1:N, N:M)
- ✅ Naming conventions
- ✅ Tipos de datos óptimos
- ✅ Constraints y validaciones
- ✅ Patrones de diseño comunes
- ✅ Denormalización justificada

### 2. [Migration Guide](./migration-guide.md)
Mejores prácticas para gestionar migraciones de bases de datos.

**Contenido:**
- ✅ Estructura y versionado de migrations
- ✅ Tipos de migrations (crear, modificar, eliminar)
- ✅ Rollback strategies
- ✅ Zero-downtime migrations
- ✅ Testing de migrations
- ✅ Control de versiones
- ✅ Casos especiales y edge cases

### 3. [Optimization Guide](./optimization-guide.md)
Técnicas avanzadas de optimización y performance tuning.

**Contenido:**
- ✅ EXPLAIN y análisis de query plans
- ✅ Estrategias de indexación (B-tree, GIN, GiST, BRIN, Hash)
- ✅ Query optimization techniques
- ✅ Window functions y CTEs
- ✅ JOIN optimization
- ✅ Particionamiento
- ✅ Materialized views
- ✅ Monitoring y análisis de performance

### 4. [Backup & Security Guide](./backup-security-guide.md)
Estrategias de backup, recuperación y seguridad.

**Contenido:**
- ✅ Backup lógico con pg_dump
- ✅ Continuous archiving y WAL
- ✅ Point-in-time recovery (PITR)
- ✅ Replicación (streaming y logical)
- ✅ Autenticación y autorización
- ✅ Row Level Security (RLS)
- ✅ Encriptación (en tránsito y en reposo)
- ✅ Auditoría y logging
- ✅ Automatización de backups

## 🎯 Uso Rápido

### Para Diseño Inicial
```bash
# Leer schema design guide
cat schema-design-guide.md | grep -A 20 "Normalización"
```

### Para Migrations
```bash
# Ver estructura de migration
cat migration-guide.md | grep -A 30 "Estructura de una Migration"
```

### Para Optimización
```bash
# Ver técnicas de indexación
cat optimization-guide.md | grep -A 50 "Estrategias de Indexación"
```

### Para Backup
```bash
# Ver script de backup
cat backup-security-guide.md | grep -A 100 "Backup Script Completo"
```

## 🔗 Referencias Cruzadas

| Tarea | Guía Principal | Guías Relacionadas |
|-------|---------------|-------------------|
| Crear nueva tabla | Schema Design | Migration Guide |
| Optimizar queries lentas | Optimization | Schema Design (índices) |
| Agregar columna | Migration | Schema Design (tipos de datos) |
| Configurar backups | Backup & Security | - |
| Implementar RLS | Backup & Security | Schema Design (constraints) |
| Crear índices | Optimization | Schema Design, Migration |

## 📖 Orden de Lectura Recomendado

Para nuevos proyectos:
1. **Schema Design Guide** - Diseñar esquema correctamente desde el inicio
2. **Migration Guide** - Configurar sistema de migrations
3. **Backup & Security Guide** - Configurar seguridad y backups
4. **Optimization Guide** - Optimizar según necesidades de performance

Para proyectos existentes:
1. **Optimization Guide** - Identificar y resolver problemas de performance
2. **Migration Guide** - Implementar cambios de manera segura
3. **Backup & Security Guide** - Auditar seguridad y backups
4. **Schema Design Guide** - Referencia para nuevas features

## 🤝 Integración con PostgreSQL Specialist Agent

El [PostgreSQL Specialist Agent](../../agents/postgresql-specialist.md) utiliza estas guías como referencia para:

- Diseñar esquemas normalizados
- Crear migrations eficientes
- Optimizar queries y performance
- Implementar seguridad y backups
- Resolver problemas de base de datos

## ✅ Compliance y Best Practices

Todas las guías siguen:
- ✅ PostgreSQL official documentation
- ✅ Industry best practices
- ✅ ACID principles
- ✅ Security standards (OWASP)
- ✅ Performance optimization guidelines
- ✅ Disaster recovery standards

## 📚 Recursos Externos

- [PostgreSQL Official Docs](https://www.postgresql.org/docs/)
- [PostgreSQL Wiki](https://wiki.postgresql.org/)
- [Use The Index, Luke!](https://use-the-index-luke.com/)
- [PostgreSQL Performance](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)

---

_Documentación creada por PostgreSQL Specialist Agent_ 🐘
