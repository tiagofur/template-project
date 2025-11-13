# ⚡ PostgreSQL Optimization Guide

## Introducción

Esta guía cubre técnicas avanzadas de optimización para PostgreSQL, incluyendo estrategias de indexación, query tuning, y mejoras de performance.

## 🎯 Fundamentos de Optimización

### 1. EXPLAIN y EXPLAIN ANALYZE

#### Entender Query Plans

```sql
-- Ver plan sin ejecutar
EXPLAIN
SELECT * FROM users WHERE email = 'user@example.com';

-- Ver plan con estadísticas reales
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'user@example.com';

-- Ver más detalles
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, COSTS, SETTINGS)
SELECT u.*, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;
```

#### Interpretar Resultados

```sql
-- Ejemplo de salida:
Seq Scan on users  (cost=0.00..10.50 rows=100 width=64) (actual time=0.010..0.250 rows=100 loops=1)
  Filter: (email = 'user@example.com')
  Rows Removed by Filter: 9900
Planning Time: 0.125 ms
Execution Time: 0.300 ms

-- Conceptos clave:
-- cost: Estimación de costo (startup..total)
-- rows: Filas estimadas
-- actual time: Tiempo real (startup..total)
-- loops: Número de veces que se ejecutó el nodo
```

#### Tipos de Scan

```sql
-- Sequential Scan (lento para tablas grandes)
Seq Scan on large_table

-- Index Scan (rápido, usa índice)
Index Scan using idx_users_email on users

-- Index Only Scan (más rápido, solo índice)
Index Only Scan using idx_users_email_covering on users

-- Bitmap Heap Scan (eficiente para múltiples condiciones)
Bitmap Heap Scan on products
  Recheck Cond: ((price > 100) AND (category_id = 5))
  -> Bitmap Index Scan on idx_products_price
  -> Bitmap Index Scan on idx_products_category
```

## 🚀 Estrategias de Indexación

### 1. Índices B-Tree (Default)

#### Índices Simples
```sql
-- Para búsquedas exactas y rangos
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_created ON orders(created_at);

-- Con orden específico
CREATE INDEX idx_users_created_desc ON users(created_at DESC);

-- Para ordenamiento
SELECT * FROM users ORDER BY created_at DESC;
-- Usa idx_users_created_desc eficientemente
```

#### Índices Compuestos
```sql
-- El orden de columnas importa!
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- Eficiente para:
SELECT * FROM orders WHERE user_id = 123 AND status = 'pending';
SELECT * FROM orders WHERE user_id = 123; -- Usa solo primera columna

-- NO eficiente para:
SELECT * FROM orders WHERE status = 'pending'; -- No usa user_id
```

**Regla**: Columnas más selectivas primero, o columnas usadas en WHERE antes que en ORDER BY.

```sql
-- Ejemplo optimizado
CREATE INDEX idx_orders_composite ON orders(
    user_id,        -- Alta selectividad
    status,         -- Media selectividad  
    created_at DESC -- Para ordenamiento
);

-- Query optimizada
SELECT * FROM orders 
WHERE user_id = 123 AND status = 'completed'
ORDER BY created_at DESC
LIMIT 10;
```

#### Índices Parciales
```sql
-- Solo indexa subset de datos
CREATE INDEX idx_active_users ON users(email) 
WHERE status = 'active';

-- Más pequeño y eficiente para:
SELECT * FROM users WHERE email = 'user@example.com' AND status = 'active';

-- Ejemplos útiles
CREATE INDEX idx_pending_orders ON orders(created_at DESC)
WHERE status IN ('pending', 'processing');

CREATE INDEX idx_recent_logs ON logs(created_at DESC)
WHERE created_at > NOW() - INTERVAL '30 days';
```

#### Índices con INCLUDE (Covering Index)
```sql
-- Evita acceso a tabla
CREATE INDEX idx_users_email_covering ON users(email)
INCLUDE (first_name, last_name, created_at);

-- Query puede resolverse solo con índice
SELECT email, first_name, last_name, created_at
FROM users
WHERE email = 'user@example.com';
-- Usa Index Only Scan (más rápido)
```

### 2. Índices Especializados

#### Hash Index
```sql
-- Solo para igualdad (=)
-- No soporta range queries (<, >, BETWEEN)
CREATE INDEX idx_users_uuid_hash ON users USING hash(uuid);

-- Útil solo para:
SELECT * FROM users WHERE uuid = 'a1b2c3d4-...';
```

#### GIN Index (Generalized Inverted Index)
```sql
-- Para arrays, JSONB, full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Array search
CREATE INDEX idx_tags_gin ON posts USING gin(tags);
SELECT * FROM posts WHERE tags @> ARRAY['postgresql', 'database'];

-- JSONB search
CREATE INDEX idx_metadata_gin ON products USING gin(metadata);
SELECT * FROM products WHERE metadata @> '{"color": "red"}';

-- Full-text search
CREATE INDEX idx_content_fts ON articles 
USING gin(to_tsvector('english', content));

SELECT * FROM articles 
WHERE to_tsvector('english', content) @@ to_tsquery('postgresql & optimization');

-- Trigram search (fuzzy matching)
CREATE INDEX idx_products_name_trgm ON products 
USING gin(name gin_trgm_ops);

SELECT * FROM products WHERE name ILIKE '%postgre%';
```

#### GiST Index (Generalized Search Tree)
```sql
-- Para geometría, rangos, full-text
CREATE INDEX idx_locations_gist ON locations USING gist(coordinates);

-- Rangos solapados
CREATE EXTENSION btree_gist;
CREATE INDEX idx_bookings_range ON bookings 
USING gist(room_id, tsrange(start_time, end_time));

-- Evitar overlapping bookings
SELECT * FROM bookings 
WHERE room_id = 101 
  AND tsrange(start_time, end_time) && tsrange('2024-01-15 10:00', '2024-01-15 12:00');
```

#### BRIN Index (Block Range Index)
```sql
-- Para tablas muy grandes con datos ordenados
-- Mucho más pequeño que B-tree
CREATE INDEX idx_logs_created_brin ON logs USING brin(created_at);

-- Eficiente para:
SELECT * FROM logs 
WHERE created_at BETWEEN '2024-01-01' AND '2024-01-31';

-- Mejor para:
-- - Tablas > 100GB
-- - Datos naturalmente ordenados (timestamps, IDs)
-- - Queries de rango
```

### 3. Análisis de Índices

#### Índices No Utilizados
```sql
-- Encontrar índices sin uso
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND schemaname = 'public'
  AND indexrelname NOT LIKE '%pkey'
ORDER BY pg_relation_size(indexrelid) DESC;
```

#### Índices Redundantes
```sql
-- Estos índices son redundantes:
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
-- idx_orders_user es redundante (puede usar idx_orders_user_status)

-- Encontrar duplicados
SELECT 
    a.indexname as index1,
    b.indexname as index2,
    a.indexdef
FROM pg_indexes a
JOIN pg_indexes b ON a.tablename = b.tablename
WHERE a.indexname < b.indexname
  AND a.indexdef = b.indexdef
  AND a.schemaname = 'public';
```

## 📊 Query Optimization

### 1. Common Table Expressions (CTEs)

```sql
-- CTE simple para legibilidad
WITH active_users AS (
    SELECT id, email, created_at
    FROM users
    WHERE status = 'active'
      AND email_verified = true
)
SELECT 
    au.email,
    COUNT(o.id) as order_count
FROM active_users au
LEFT JOIN orders o ON au.id = o.user_id
GROUP BY au.email;

-- CTE recursivo para jerarquías
WITH RECURSIVE category_tree AS (
    -- Base case
    SELECT id, name, parent_id, 0 as level
    FROM categories
    WHERE parent_id IS NULL
    
    UNION ALL
    
    -- Recursive case
    SELECT c.id, c.name, c.parent_id, ct.level + 1
    FROM categories c
    INNER JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT * FROM category_tree ORDER BY level, name;

-- Materialized CTE (optimización)
WITH MATERIALIZED expensive_calculation AS (
    SELECT user_id, SUM(amount) as total
    FROM transactions
    WHERE created_at >= NOW() - INTERVAL '1 year'
    GROUP BY user_id
    HAVING SUM(amount) > 10000
)
SELECT u.email, ec.total
FROM users u
INNER JOIN expensive_calculation ec ON u.id = ec.user_id;
```

### 2. Window Functions

```sql
-- Ranking
SELECT 
    product_name,
    category_id,
    price,
    ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY price DESC) as price_rank,
    RANK() OVER (PARTITION BY category_id ORDER BY sales_count DESC) as sales_rank,
    DENSE_RANK() OVER (ORDER BY price DESC) as overall_rank
FROM products;

-- Agregaciones móviles
SELECT 
    order_date,
    daily_revenue,
    -- Running total
    SUM(daily_revenue) OVER (
        ORDER BY order_date 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) as running_total,
    -- 7-day moving average
    AVG(daily_revenue) OVER (
        ORDER BY order_date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as moving_avg_7d,
    -- Lead/Lag
    LAG(daily_revenue, 1) OVER (ORDER BY order_date) as prev_day,
    LEAD(daily_revenue, 1) OVER (ORDER BY order_date) as next_day
FROM daily_sales;

-- Percentiles
SELECT 
    product_id,
    sales_amount,
    NTILE(4) OVER (ORDER BY sales_amount) as quartile,
    PERCENT_RANK() OVER (ORDER BY sales_amount) as percent_rank,
    CUME_DIST() OVER (ORDER BY sales_amount) as cumulative_dist
FROM product_sales;
```

### 3. JOIN Optimization

#### LATERAL JOIN
```sql
-- Más eficiente que subquery correlacionado
SELECT 
    u.username,
    recent.order_date,
    recent.total_amount
FROM users u
CROSS JOIN LATERAL (
    SELECT order_date, total_amount
    FROM orders o
    WHERE o.user_id = u.id
    ORDER BY o.created_at DESC
    LIMIT 5
) recent
WHERE u.status = 'active';

-- vs Subquery (menos eficiente)
SELECT 
    u.username,
    (SELECT order_date FROM orders WHERE user_id = u.id ORDER BY created_at DESC LIMIT 1)
FROM users u;
```

#### Semi-join y Anti-join
```sql
-- EXISTS (semi-join) - más eficiente que IN
SELECT u.email
FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.user_id = u.id 
      AND o.total_amount > 1000
);

-- vs IN (puede ser menos eficiente)
SELECT u.email
FROM users u
WHERE u.id IN (
    SELECT user_id FROM orders WHERE total_amount > 1000
);

-- NOT EXISTS (anti-join)
SELECT u.email
FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.user_id = u.id
);
```

#### JOIN Order
```sql
-- PostgreSQL optimiza automáticamente, pero ayuda:
-- 1. Tablas pequeñas primero
-- 2. Filtros restrictivos aplicados temprano

-- ❌ Menos eficiente
SELECT *
FROM large_table l
JOIN small_table s ON l.id = s.large_table_id
WHERE s.active = true;

-- ✅ Más eficiente
SELECT *
FROM small_table s
JOIN large_table l ON s.large_table_id = l.id
WHERE s.active = true;
```

### 4. Subquery Optimization

```sql
-- ❌ Subquery en SELECT (ejecuta por cada fila)
SELECT 
    u.username,
    (SELECT COUNT(*) FROM orders WHERE user_id = u.id) as order_count
FROM users u;

-- ✅ JOIN o CTE (ejecuta una vez)
SELECT 
    u.username,
    COALESCE(oc.order_count, 0) as order_count
FROM users u
LEFT JOIN (
    SELECT user_id, COUNT(*) as order_count
    FROM orders
    GROUP BY user_id
) oc ON u.id = oc.user_id;
```

## 🎯 Técnicas Avanzadas

### 1. Particionamiento

```sql
-- Particionar por rango (fecha)
CREATE TABLE logs (
    id BIGSERIAL,
    user_id INTEGER,
    action VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
) PARTITION BY RANGE (created_at);

-- Crear particiones
CREATE TABLE logs_2024_01 PARTITION OF logs
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE logs_2024_02 PARTITION OF logs
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Query automáticamente usa partición correcta (partition pruning)
SELECT * FROM logs 
WHERE created_at BETWEEN '2024-01-15' AND '2024-01-20';
-- Solo escanea logs_2024_01

-- Particionar por lista (región)
CREATE TABLE sales (
    id SERIAL,
    region VARCHAR(50),
    amount DECIMAL(12,2)
) PARTITION BY LIST (region);

CREATE TABLE sales_north PARTITION OF sales
    FOR VALUES IN ('north', 'northeast', 'northwest');
```

### 2. Materialized Views

```sql
-- Crear vista materializada
CREATE MATERIALIZED VIEW mv_user_statistics AS
SELECT 
    u.id,
    u.email,
    COUNT(DISTINCT o.id) as total_orders,
    SUM(o.total_amount) as lifetime_value,
    MAX(o.created_at) as last_order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.email;

-- Crear índices
CREATE UNIQUE INDEX idx_mv_user_stats_id ON mv_user_statistics(id);
CREATE INDEX idx_mv_user_stats_ltv ON mv_user_statistics(lifetime_value DESC);

-- Refresh (bloquea lecturas)
REFRESH MATERIALIZED VIEW mv_user_statistics;

-- Refresh concurrente (no bloquea, requiere UNIQUE index)
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_user_statistics;
```

### 3. Parallel Queries

```sql
-- Configurar paralelismo
SET max_parallel_workers_per_gather = 4;
SET parallel_setup_cost = 1000;
SET parallel_tuple_cost = 0.1;

-- Query usará parallel workers automáticamente
EXPLAIN ANALYZE
SELECT category_id, COUNT(*), AVG(price)
FROM products
WHERE price > 10
GROUP BY category_id;

-- Forzar parallel scan (si es apropiado)
SET force_parallel_mode = on;
```

### 4. Connection Pooling

```sql
-- Configurar pg_bouncer (external)
-- En postgresql.conf:
max_connections = 200
shared_buffers = 4GB
effective_cache_size = 12GB
```

## 📈 Monitoring y Análisis

### 1. Query Performance

```sql
-- Habilitar pg_stat_statements
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Queries más lentas
SELECT 
    query,
    calls,
    total_exec_time,
    mean_exec_time,
    max_exec_time,
    stddev_exec_time,
    rows
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_stat_statements%'
ORDER BY mean_exec_time DESC
LIMIT 20;

-- Queries más frecuentes
SELECT 
    query,
    calls,
    mean_exec_time,
    total_exec_time
FROM pg_stat_statements
ORDER BY calls DESC
LIMIT 20;
```

### 2. Table Statistics

```sql
-- Estadísticas de tabla
SELECT 
    schemaname,
    tablename,
    n_live_tup as live_rows,
    n_dead_tup as dead_rows,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    last_vacuum,
    last_autovacuum,
    last_analyze
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;

-- Tamaño de tablas
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - 
                   pg_relation_size(schemaname||'.'||tablename)) AS index_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 3. Cache Hit Ratio

```sql
-- Buffer cache hit ratio (debe ser > 95%)
SELECT 
    sum(heap_blks_read) as heap_read,
    sum(heap_blks_hit) as heap_hit,
    sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) as ratio
FROM pg_statio_user_tables;

-- Por tabla
SELECT 
    schemaname,
    tablename,
    heap_blks_hit,
    heap_blks_read,
    CASE 
        WHEN (heap_blks_hit + heap_blks_read) > 0 
        THEN heap_blks_hit::float / (heap_blks_hit + heap_blks_read)
        ELSE 0 
    END as cache_hit_ratio
FROM pg_statio_user_tables
WHERE schemaname = 'public'
ORDER BY heap_blks_read DESC;
```

### 4. Locks y Blocking

```sql
-- Ver bloqueos activos
SELECT 
    blocked_locks.pid AS blocked_pid,
    blocked_activity.usename AS blocked_user,
    blocking_locks.pid AS blocking_pid,
    blocking_activity.usename AS blocking_user,
    blocked_activity.query AS blocked_query,
    blocking_activity.query AS blocking_query
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks 
    ON blocking_locks.locktype = blocked_locks.locktype
    AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

## 🛠️ Configuración PostgreSQL

### postgresql.conf Optimizations

```conf
# Memory
shared_buffers = 4GB                    # 25% of RAM
effective_cache_size = 12GB             # 75% of RAM
work_mem = 64MB                         # Por operación
maintenance_work_mem = 1GB              # Para VACUUM, CREATE INDEX

# WAL
wal_buffers = 16MB
checkpoint_completion_target = 0.9
min_wal_size = 1GB
max_wal_size = 4GB

# Query Planning
random_page_cost = 1.1                  # Para SSD (default 4.0 para HDD)
effective_io_concurrency = 200          # Para SSD

# Parallelism
max_parallel_workers_per_gather = 4
max_parallel_workers = 8
max_worker_processes = 8

# Autovacuum
autovacuum = on
autovacuum_max_workers = 4
autovacuum_naptime = 10s
```

## ✅ Checklist de Optimización

### Query Level
- [ ] EXPLAIN ANALYZE ejecutado y analizado
- [ ] Índices apropiados creados
- [ ] Sin table scans en tablas grandes (>10K rows)
- [ ] JOINs optimizados (orden correcto)
- [ ] CTEs usados para legibilidad
- [ ] Window functions usados en lugar de subqueries
- [ ] Queries parametrizadas (prepared statements)

### Index Level
- [ ] Índices en foreign keys
- [ ] Índices compuestos para queries comunes
- [ ] Índices parciales para subsets frecuentes
- [ ] Covering indexes para queries críticas
- [ ] Índices no utilizados eliminados
- [ ] Estadísticas actualizadas (ANALYZE)

### Database Level
- [ ] VACUUM configurado apropiadamente
- [ ] pg_stat_statements habilitado
- [ ] Configuración de memoria optimizada
- [ ] Connection pooling configurado
- [ ] Monitoring configurado
- [ ] Backups automatizados

## 📚 Recursos Adicionales

- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Use The Index, Luke!](https://use-the-index-luke.com/)
- [PostgreSQL Query Optimization](https://www.postgresql.org/docs/current/performance-tips.html)
- [Explain Visualizer](https://explain.dalibo.com/)

---

_Guía creada por PostgreSQL Specialist Agent_ 🐘
