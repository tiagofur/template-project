# 📐 PostgreSQL Schema Design Guide

## Introducción

Esta guía cubre las mejores prácticas para diseñar esquemas de bases de datos PostgreSQL normalizados, eficientes y escalables.

## 🎯 Principios de Diseño

### 1. Normalización

#### Objetivo
Eliminar redundancia y garantizar integridad de datos a través de formas normales.

#### Primera Forma Normal (1NF)
**Regla**: Cada columna debe contener valores atómicos (indivisibles).

```sql
-- ❌ Incorrecto
CREATE TABLE employees_bad (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    skills VARCHAR(500)  -- 'Python, Java, SQL'
);

-- ✅ Correcto
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL
);

CREATE TABLE employee_skills (
    employee_id INTEGER REFERENCES employees(id),
    skill_name VARCHAR(50) NOT NULL,
    proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 5),
    PRIMARY KEY (employee_id, skill_name)
);
```

#### Segunda Forma Normal (2NF)
**Regla**: Cumplir 1NF y eliminar dependencias parciales (atributos no-clave deben depender de toda la clave primaria).

```sql
-- ❌ Incorrecto
CREATE TABLE course_registrations_bad (
    student_id INTEGER,
    course_id INTEGER,
    student_name VARCHAR(100),  -- Depende solo de student_id
    course_name VARCHAR(100),   -- Depende solo de course_id
    enrollment_date DATE,
    PRIMARY KEY (student_id, course_id)
);

-- ✅ Correcto
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    credits INTEGER NOT NULL
);

CREATE TABLE enrollments (
    student_id INTEGER REFERENCES students(id),
    course_id INTEGER REFERENCES courses(id),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    grade DECIMAL(5,2),
    PRIMARY KEY (student_id, course_id)
);
```

#### Tercera Forma Normal (3NF)
**Regla**: Cumplir 2NF y eliminar dependencias transitivas.

```sql
-- ❌ Incorrecto
CREATE TABLE orders_bad (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER,
    customer_city VARCHAR(100),     -- Depende de customer_id
    customer_country VARCHAR(100),  -- Depende de customer_id
    order_date DATE
);

-- ✅ Correcto
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    country VARCHAR(100)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    order_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'pending'
);
```

### 2. Tipos de Relaciones

#### Relación Uno a Uno (1:1)

```sql
-- Usuario y su configuración de perfil
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_settings (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'light',
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    notifications_enabled BOOLEAN DEFAULT TRUE
);
```

#### Relación Uno a Muchos (1:N)

```sql
-- Autores y sus libros
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    biography TEXT,
    birth_date DATE
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE RESTRICT,
    title VARCHAR(200) NOT NULL,
    isbn VARCHAR(13) UNIQUE,
    published_date DATE,
    pages INTEGER CHECK (pages > 0)
);

CREATE INDEX idx_books_author_id ON books(author_id);
```

#### Relación Muchos a Muchos (N:M)

```sql
-- Estudiantes y cursos con información de inscripción
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    student_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    credits INTEGER NOT NULL
);

-- Tabla de unión con atributos adicionales
CREATE TABLE student_courses (
    student_id INTEGER REFERENCES students(id),
    course_id INTEGER REFERENCES courses(id),
    semester VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    grade DECIMAL(5,2) CHECK (grade >= 0 AND grade <= 100),
    PRIMARY KEY (student_id, course_id, semester, year)
);

CREATE INDEX idx_student_courses_student ON student_courses(student_id);
CREATE INDEX idx_student_courses_course ON student_courses(course_id);
```

### 3. Naming Conventions

#### Tablas
- **Plural**: `users`, `orders`, `products`
- **Snake case**: `order_items`, `user_preferences`
- **Descriptivo**: Nombres claros que indiquen el contenido

#### Columnas
- **Snake case**: `first_name`, `created_at`, `is_active`
- **Sufijos comunes**:
  - `_id` para foreign keys: `user_id`, `product_id`
  - `_at` para timestamps: `created_at`, `updated_at`
  - `is_` para booleanos: `is_active`, `is_verified`
  - `_count` para contadores: `view_count`, `like_count`

#### Constraints
- **Primary keys**: `pk_table_name`
- **Foreign keys**: `fk_table_column`
- **Unique**: `uq_table_column`
- **Check**: `chk_table_condition`

```sql
CREATE TABLE products (
    id SERIAL,
    name VARCHAR(100) NOT NULL,
    sku VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category_id INTEGER NOT NULL,
    
    CONSTRAINT pk_products PRIMARY KEY (id),
    CONSTRAINT uq_products_sku UNIQUE (sku),
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) 
        REFERENCES categories(id),
    CONSTRAINT chk_products_price CHECK (price >= 0)
);
```

### 4. Tipos de Datos Óptimos

#### Strings
```sql
-- Usar VARCHAR con límite apropiado
email VARCHAR(100)           -- No usar TEXT para emails
username VARCHAR(50)         -- Limitar según necesidad
description TEXT             -- Usar TEXT para contenido largo

-- CHAR solo para valores de longitud fija
country_code CHAR(2)         -- 'US', 'MX', 'CA'
status_code CHAR(1)          -- 'A', 'I', 'D'
```

#### Números
```sql
-- Integers
id SERIAL                    -- Auto-incremento 1-2 billion
count INTEGER               -- -2 billion a +2 billion
big_number BIGINT          -- Números muy grandes
small_enum SMALLINT        -- -32768 a +32767

-- Decimales
price DECIMAL(10,2)        -- Para moneda (exacto)
percentage DECIMAL(5,2)    -- 0.00 a 999.99
scientific DOUBLE PRECISION -- Cálculos científicos
```

#### Fechas y Tiempo
```sql
-- Siempre usar WITH TIME ZONE para timestamps
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

-- DATE para fechas sin hora
birth_date DATE
anniversary_date DATE

-- TIME para horas sin fecha
opening_time TIME
closing_time TIME

-- INTERVAL para duraciones
session_duration INTERVAL
```

#### Booleanos
```sql
is_active BOOLEAN DEFAULT TRUE
is_verified BOOLEAN DEFAULT FALSE
has_access BOOLEAN NOT NULL
```

#### JSON
```sql
-- JSONB para mejor performance y indexing
metadata JSONB
settings JSONB
attributes JSONB

-- Crear índices en campos JSONB
CREATE INDEX idx_metadata_type ON products USING gin(metadata);
CREATE INDEX idx_settings_theme ON users ((settings->>'theme'));
```

### 5. Constraints y Validaciones

#### Primary Keys
```sql
-- Auto-incremento con SERIAL
CREATE TABLE users (
    id SERIAL PRIMARY KEY
);

-- UUID para distribuidos
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
);

-- Composite primary key
CREATE TABLE order_items (
    order_id INTEGER,
    product_id INTEGER,
    PRIMARY KEY (order_id, product_id)
);
```

#### Foreign Keys con Cascade Actions
```sql
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    
    -- Eliminar comentarios si se elimina el post
    CONSTRAINT fk_comments_post 
        FOREIGN KEY (post_id) 
        REFERENCES posts(id) 
        ON DELETE CASCADE,
    
    -- Evitar eliminar usuario con comentarios
    CONSTRAINT fk_comments_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE RESTRICT,
    
    -- Actualizar si cambia el ID
    CONSTRAINT fk_comments_category 
        FOREIGN KEY (category_id) 
        REFERENCES categories(id) 
        ON UPDATE CASCADE
);
```

#### Check Constraints
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    discount_percent INTEGER,
    stock INTEGER NOT NULL,
    
    CONSTRAINT chk_price_positive CHECK (price >= 0),
    CONSTRAINT chk_discount_range CHECK (discount_percent BETWEEN 0 AND 100),
    CONSTRAINT chk_stock_nonnegative CHECK (stock >= 0)
);

-- Check constraints complejos
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    
    CONSTRAINT chk_time_logical CHECK (end_time > start_time),
    CONSTRAINT chk_duration CHECK (end_time - start_time <= INTERVAL '8 hours')
);
```

#### Unique Constraints
```sql
-- Simple unique
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL
);

-- Composite unique
CREATE TABLE product_variations (
    product_id INTEGER,
    size VARCHAR(10),
    color VARCHAR(20),
    UNIQUE (product_id, size, color)
);

-- Unique parcial (conditional)
CREATE UNIQUE INDEX idx_active_email 
ON users(email) 
WHERE status = 'active';
```

## 🏗️ Patrones de Diseño Comunes

### 1. Soft Delete

```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by INTEGER REFERENCES users(id)
);

-- Índice para queries de posts activos
CREATE INDEX idx_posts_active 
ON posts(created_at DESC) 
WHERE is_deleted = FALSE;

-- View para posts activos
CREATE VIEW active_posts AS
SELECT * FROM posts WHERE is_deleted = FALSE;
```

### 2. Audit Trail

```sql
CREATE TABLE base_entity (
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by INTEGER REFERENCES users(id)
);

-- Usar herencia o copiar columnas a cada tabla
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by INTEGER REFERENCES users(id)
);
```

### 3. Versioning

```sql
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    version INTEGER DEFAULT 1,
    is_latest BOOLEAN DEFAULT TRUE
);

-- Solo una versión puede ser latest
CREATE UNIQUE INDEX idx_latest_document 
ON documents(id) 
WHERE is_latest = TRUE;
```

### 4. Multi-tenancy

```sql
-- Tenant ID en todas las tablas
CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    subdomain VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    email VARCHAR(100) NOT NULL,
    UNIQUE (tenant_id, email)
);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON users
    USING (tenant_id = current_setting('app.tenant_id')::INTEGER);
```

## 📊 Denormalización Justificada

### Cuándo Denormalizar

1. **Performance crítica** en queries de lectura frecuentes
2. **Agregaciones costosas** que se calculan frecuentemente
3. **Reports y analytics** que requieren joins complejos

### Ejemplo: Contadores Denormalizados

```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    content TEXT,
    -- Denormalizado para performance
    comment_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id),
    content TEXT
);

-- Trigger para mantener sincronizado
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET comment_count = comment_count + 1 
        WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET comment_count = comment_count - 1 
        WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comment_count
    AFTER INSERT OR DELETE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_post_comment_count();
```

## ✅ Checklist de Diseño

- [ ] Esquema normalizado (mínimo 3NF)
- [ ] Tipos de datos apropiados
- [ ] Primary keys definidas
- [ ] Foreign keys con acciones CASCADE/RESTRICT apropiadas
- [ ] Unique constraints donde corresponda
- [ ] Check constraints para validación
- [ ] Índices en columnas de búsqueda frecuente
- [ ] Índices en foreign keys
- [ ] Naming conventions consistentes
- [ ] Comentarios en tablas y columnas complejas
- [ ] Defaults apropiados
- [ ] NOT NULL donde corresponda
- [ ] Timestamps de auditoría (created_at, updated_at)

## 📚 Recursos Adicionales

- [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html)
- [PostgreSQL Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [Database Normalization](https://en.wikipedia.org/wiki/Database_normalization)

---

_Guía creada por PostgreSQL Specialist Agent_ 🐘
