# 🔄 PostgreSQL Migration Guide

## Introducción

Esta guía cubre las mejores prácticas para gestionar migraciones de bases de datos PostgreSQL de manera segura, eficiente y versionada.

## 🎯 Principios de Migrations

### 1. Versionado y Orden

```
migrations/
├── 001_initial_schema.sql
├── 002_add_users_table.sql
├── 003_add_products_table.sql
├── 004_add_orders_table.sql
├── 005_add_user_email_index.sql
└── rollbacks/
    ├── 002_add_users_table_rollback.sql
    ├── 003_add_products_table_rollback.sql
    └── ...
```

**Convenciones**:
- Números secuenciales con ceros al inicio (001, 002, etc.)
- Nombres descriptivos del cambio
- Una migración por concepto/feature
- Siempre crear rollback correspondiente

### 2. Estructura de una Migration

```sql
-- migrations/001_create_users_table.sql
-- Description: Create initial users table with authentication
-- Author: Team Name
-- Date: 2024-01-15
-- Dependencies: None

-- =============================================
-- MIGRATION UP
-- =============================================

BEGIN;

-- Crear tipos enumerados si es necesario
CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');

-- Crear tabla principal
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    status user_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CONSTRAINT chk_email_format 
        CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    CONSTRAINT chk_username_length 
        CHECK (char_length(username) >= 3)
);

-- Crear índices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Agregar comentarios
COMMENT ON TABLE users IS 'Main users table for authentication';
COMMENT ON COLUMN users.uuid IS 'External UUID for API usage';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password';

-- Registrar migración (si usas tabla de control)
INSERT INTO schema_migrations (version, description, applied_at)
VALUES ('001', 'Create users table', NOW());

COMMIT;
```

### 3. Rollback Correspondiente

```sql
-- rollbacks/001_create_users_table_rollback.sql
-- Description: Rollback users table creation
-- Date: 2024-01-15

BEGIN;

-- Eliminar tabla
DROP TABLE IF EXISTS users CASCADE;

-- Eliminar tipos
DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS user_status;

-- Remover registro de migración
DELETE FROM schema_migrations WHERE version = '001';

COMMIT;
```

## 🚀 Tipos de Migrations

### 1. Crear Tablas

```sql
-- migrations/002_create_products.sql
BEGIN;

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT chk_price_positive CHECK (price >= 0),
    CONSTRAINT chk_stock_nonnegative CHECK (stock >= 0)
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_products_slug ON products(slug);

COMMIT;
```

### 2. Agregar Columnas

```sql
-- migrations/003_add_user_profile_fields.sql
-- Description: Add profile fields to users table
-- Date: 2024-01-20

BEGIN;

-- Agregar columnas con defaults para no romper datos existentes
ALTER TABLE users 
    ADD COLUMN first_name VARCHAR(50),
    ADD COLUMN last_name VARCHAR(50),
    ADD COLUMN phone VARCHAR(20),
    ADD COLUMN avatar_url VARCHAR(500),
    ADD COLUMN bio TEXT,
    ADD COLUMN birth_date DATE,
    ADD COLUMN timezone VARCHAR(50) DEFAULT 'UTC',
    ADD COLUMN language VARCHAR(10) DEFAULT 'en';

-- Hacer NOT NULL después si es necesario
-- (primero poblar datos existentes)
-- ALTER TABLE users ALTER COLUMN first_name SET NOT NULL;

-- Agregar constraints
ALTER TABLE users ADD CONSTRAINT chk_birth_date 
    CHECK (birth_date IS NULL OR birth_date <= CURRENT_DATE);

-- Crear índices si son necesarios
CREATE INDEX idx_users_name ON users(first_name, last_name);

COMMENT ON COLUMN users.timezone IS 'User timezone for date/time display';

COMMIT;
```

### 3. Modificar Columnas

```sql
-- migrations/004_modify_product_description.sql
-- Description: Change product description to allow longer text
-- Date: 2024-01-25

BEGIN;

-- Cambiar tipo de dato
ALTER TABLE products 
    ALTER COLUMN description TYPE TEXT;

-- Cambiar default
ALTER TABLE products 
    ALTER COLUMN stock SET DEFAULT 100;

-- Agregar/quitar NOT NULL
ALTER TABLE products 
    ALTER COLUMN description DROP NOT NULL;

-- Renombrar columna
ALTER TABLE products 
    RENAME COLUMN is_active TO status;

COMMIT;
```

### 4. Eliminar Columnas

```sql
-- migrations/005_remove_deprecated_fields.sql
-- Description: Remove deprecated user fields
-- Date: 2024-02-01

BEGIN;

-- IMPORTANTE: Hacer backup antes de eliminar columnas
-- Eliminar constraints primero si existen
ALTER TABLE users DROP CONSTRAINT IF EXISTS chk_old_field;

-- Eliminar índices asociados
DROP INDEX IF EXISTS idx_users_old_field;

-- Eliminar columna
ALTER TABLE users DROP COLUMN IF EXISTS old_field CASCADE;

COMMIT;
```

### 5. Crear Índices

```sql
-- migrations/006_add_performance_indexes.sql
-- Description: Add indexes for common queries
-- Date: 2024-02-05

BEGIN;

-- Índices simples
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Índices compuestos (orden importa!)
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_orders_status_created ON orders(status, created_at DESC);

-- Índices parciales
CREATE INDEX idx_active_orders ON orders(created_at DESC) 
WHERE status IN ('pending', 'processing');

-- Índices con INCLUDE (covering index)
CREATE INDEX idx_orders_user_covering ON orders(user_id) 
INCLUDE (status, total_amount, created_at);

-- Índices para texto
CREATE INDEX idx_products_name_trgm ON products 
USING gin(name gin_trgm_ops);

COMMIT;
```

### 6. Modificar Constraints

```sql
-- migrations/007_update_constraints.sql
-- Description: Update product constraints
-- Date: 2024-02-10

BEGIN;

-- Eliminar constraint existente
ALTER TABLE products DROP CONSTRAINT IF EXISTS chk_price_positive;

-- Agregar nuevo constraint
ALTER TABLE products ADD CONSTRAINT chk_price_range 
    CHECK (price >= 0.01 AND price <= 999999.99);

-- Modificar foreign key
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS fk_order_items_product;
ALTER TABLE order_items ADD CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id) REFERENCES products(id) 
    ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;
```

### 7. Migración de Datos

```sql
-- migrations/008_migrate_user_data.sql
-- Description: Split full_name into first_name and last_name
-- Date: 2024-02-15

BEGIN;

-- Paso 1: Agregar nuevas columnas
ALTER TABLE users 
    ADD COLUMN first_name VARCHAR(50),
    ADD COLUMN last_name VARCHAR(50);

-- Paso 2: Migrar datos existentes
UPDATE users 
SET 
    first_name = COALESCE(split_part(full_name, ' ', 1), ''),
    last_name = CASE 
        WHEN array_length(string_to_array(full_name, ' '), 1) > 1 
        THEN substring(full_name from position(' ' in full_name) + 1)
        ELSE ''
    END
WHERE full_name IS NOT NULL;

-- Paso 3: Validar migración
DO $$
DECLARE
    unmigrated_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO unmigrated_count
    FROM users
    WHERE full_name IS NOT NULL AND (first_name IS NULL OR first_name = '');
    
    IF unmigrated_count > 0 THEN
        RAISE EXCEPTION 'Migration failed: % users not migrated', unmigrated_count;
    END IF;
END $$;

-- Paso 4: Hacer NOT NULL
ALTER TABLE users 
    ALTER COLUMN first_name SET NOT NULL,
    ALTER COLUMN last_name SET NOT NULL;

-- Paso 5: Eliminar columna antigua (comentado por seguridad)
-- ALTER TABLE users DROP COLUMN full_name;

COMMIT;
```

### 8. Crear Triggers

```sql
-- migrations/009_add_updated_at_trigger.sql
-- Description: Add automatic updated_at trigger
-- Date: 2024-02-20

BEGIN;

-- Crear función trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a tablas existentes
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMIT;
```

### 9. Particionamiento

```sql
-- migrations/010_partition_logs_table.sql
-- Description: Convert logs table to partitioned table
-- Date: 2024-03-01

BEGIN;

-- Paso 1: Renombrar tabla existente
ALTER TABLE logs RENAME TO logs_old;

-- Paso 2: Crear tabla particionada
CREATE TABLE logs (
    id BIGSERIAL,
    user_id INTEGER,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Paso 3: Crear particiones iniciales
CREATE TABLE logs_2024_01 PARTITION OF logs
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE logs_2024_02 PARTITION OF logs
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

CREATE TABLE logs_2024_03 PARTITION OF logs
    FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');

-- Paso 4: Migrar datos
INSERT INTO logs SELECT * FROM logs_old;

-- Paso 5: Verificar migración
DO $$
DECLARE
    old_count BIGINT;
    new_count BIGINT;
BEGIN
    SELECT COUNT(*) INTO old_count FROM logs_old;
    SELECT COUNT(*) INTO new_count FROM logs;
    
    IF old_count != new_count THEN
        RAISE EXCEPTION 'Migration failed: counts do not match (old: %, new: %)', 
            old_count, new_count;
    END IF;
END $$;

-- Paso 6: Crear índices en particiones
CREATE INDEX idx_logs_2024_01_user ON logs_2024_01(user_id);
CREATE INDEX idx_logs_2024_02_user ON logs_2024_02(user_id);
CREATE INDEX idx_logs_2024_03_user ON logs_2024_03(user_id);

-- Paso 7: Drop tabla antigua (comentado por seguridad)
-- DROP TABLE logs_old;

COMMIT;
```

## 🛡️ Mejores Prácticas

### 1. Siempre Usar Transacciones

```sql
BEGIN;
-- Todas las operaciones aquí
COMMIT;

-- En caso de error, hacer rollback
-- ROLLBACK;
```

### 2. Agregar Columnas NOT NULL Seguramente

```sql
BEGIN;

-- Paso 1: Agregar columna nullable con default
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;

-- Paso 2: Poblar datos existentes si es necesario
UPDATE users SET email_verified = TRUE WHERE email IS NOT NULL;

-- Paso 3: Hacer NOT NULL
ALTER TABLE users ALTER COLUMN email_verified SET NOT NULL;

COMMIT;
```

### 3. Renombrar vs Recrear

```sql
-- ✅ Rápido: Renombrar (solo metadata)
ALTER TABLE old_table_name RENAME TO new_table_name;
ALTER TABLE users RENAME COLUMN old_col TO new_col;

-- ❌ Lento: Recrear columna (copia todos los datos)
-- Evitar si la tabla es grande
ALTER TABLE users ALTER COLUMN data TYPE JSONB USING data::JSONB;
```

### 4. Índices CONCURRENTLY

```sql
-- Para bases de datos en producción
-- No bloquea escrituras pero toma más tiempo
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);

-- Drop también puede ser concurrente
DROP INDEX CONCURRENTLY idx_old_index;
```

### 5. Validar Constraints Sin Bloqueo

```sql
-- Agregar constraint sin validar (instantáneo)
ALTER TABLE products 
    ADD CONSTRAINT chk_price_positive 
    CHECK (price >= 0) NOT VALID;

-- Validar en segundo plano
ALTER TABLE products 
    VALIDATE CONSTRAINT chk_price_positive;
```

### 6. Testing de Migrations

```sql
-- Crear base de datos de prueba
CREATE DATABASE test_migrations;

-- Ejecutar migrations
\i migrations/001_initial.sql
\i migrations/002_add_users.sql
-- ...

-- Ejecutar rollbacks en orden inverso
\i rollbacks/002_add_users_rollback.sql
\i rollbacks/001_initial_rollback.sql

-- Verificar que todo vuelva al estado inicial
```

## 📊 Control de Migrations

### Schema Migrations Table

```sql
-- Crear tabla de control de migrations
CREATE TABLE schema_migrations (
    id SERIAL PRIMARY KEY,
    version VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    applied_by VARCHAR(100) DEFAULT CURRENT_USER,
    execution_time_ms INTEGER,
    checksum VARCHAR(64)
);

CREATE INDEX idx_migrations_version ON schema_migrations(version);
```

### Script de Ejecución

```bash
#!/bin/bash
# run_migrations.sh

DB_NAME="mydb"
MIGRATIONS_DIR="./migrations"

for migration in $MIGRATIONS_DIR/*.sql; do
    version=$(basename "$migration" .sql)
    
    # Verificar si ya se aplicó
    applied=$(psql -d $DB_NAME -tAc \
        "SELECT 1 FROM schema_migrations WHERE version='$version'")
    
    if [ -z "$applied" ]; then
        echo "Applying migration: $version"
        
        # Medir tiempo de ejecución
        start_time=$(date +%s%3N)
        psql -d $DB_NAME -f "$migration"
        end_time=$(date +%s%3N)
        
        execution_time=$((end_time - start_time))
        
        echo "Migration $version completed in ${execution_time}ms"
    else
        echo "Migration $version already applied, skipping"
    fi
done
```

## ⚠️ Casos Especiales

### Zero-Downtime Migrations

```sql
-- Problema: Agregar columna NOT NULL en tabla grande

-- ❌ Incorrecto: Bloquea tabla
ALTER TABLE large_table ADD COLUMN new_col VARCHAR(100) NOT NULL;

-- ✅ Correcto: Multi-paso sin downtime

-- Paso 1: Agregar columna nullable con default
ALTER TABLE large_table ADD COLUMN new_col VARCHAR(100) DEFAULT 'default_value';

-- Paso 2: Actualizar app para escribir en nueva columna
-- (deploy de aplicación)

-- Paso 3: Backfill datos viejos en lotes
DO $$
DECLARE
    batch_size INTEGER := 10000;
    updated INTEGER;
BEGIN
    LOOP
        UPDATE large_table
        SET new_col = 'migrated_value'
        WHERE id IN (
            SELECT id FROM large_table
            WHERE new_col = 'default_value'
            LIMIT batch_size
        );
        
        GET DIAGNOSTICS updated = ROW_COUNT;
        EXIT WHEN updated = 0;
        
        COMMIT;
        PERFORM pg_sleep(0.1); -- Pausa para no sobrecargar
    END LOOP;
END $$;

-- Paso 4: Hacer NOT NULL
ALTER TABLE large_table ALTER COLUMN new_col SET NOT NULL;

-- Paso 5: Remover default si ya no es necesario
ALTER TABLE large_table ALTER COLUMN new_col DROP DEFAULT;
```

## ✅ Checklist de Migration

Antes de ejecutar en producción:

- [ ] Migration está en transacción (BEGIN/COMMIT)
- [ ] Rollback script creado y probado
- [ ] Migration probada en base de datos de desarrollo
- [ ] Migration probada con datos de producción clonados
- [ ] Índices se crean con CONCURRENTLY en producción
- [ ] Constraints se validan con NOT VALID primero
- [ ] Backup completo realizado
- [ ] Tiempo estimado de ejecución conocido
- [ ] Plan de rollback definido
- [ ] Stakeholders notificados si hay downtime
- [ ] Monitoreo preparado para detectar issues

## 📚 Recursos Adicionales

- [PostgreSQL ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)
- [PostgreSQL Indexes](https://www.postgresql.org/docs/current/indexes.html)
- [Zero-Downtime Migrations](https://www.braintreepayments.com/blog/safe-operations-for-high-volume-postgresql/)

---

_Guía creada por PostgreSQL Specialist Agent_ 🐘
