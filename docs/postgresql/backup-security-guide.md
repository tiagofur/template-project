# 💾 PostgreSQL Backup & Security Guide

## Introducción

Esta guía cubre estrategias de backup, recuperación y seguridad para PostgreSQL, garantizando la protección de datos y cumplimiento de mejores prácticas.

## 💾 Estrategias de Backup

### 1. Backup Lógico con pg_dump

#### Backup Completo de Base de Datos

```bash
# Formato custom (recomendado - comprimido y flexible)
pg_dump -h localhost -U postgres -d mydb \
    -F c \                    # Format: custom
    -b \                      # Include large objects
    -v \                      # Verbose
    -f backup_$(date +%Y%m%d_%H%M%S).dump

# Formato plain SQL (human-readable)
pg_dump -h localhost -U postgres -d mydb \
    -F p \                    # Format: plain
    -f backup_$(date +%Y%m%d).sql

# Con compresión adicional
pg_dump -h localhost -U postgres -d mydb | \
    gzip > backup_$(date +%Y%m%d).sql.gz

# Backup de múltiples bases de datos
pg_dumpall -h localhost -U postgres \
    -f all_databases_$(date +%Y%m%d).sql
```

#### Backup Selectivo

```bash
# Solo esquema (sin datos)
pg_dump -h localhost -U postgres -d mydb \
    --schema-only \
    -f schema_only.sql

# Solo datos (sin esquema)
pg_dump -h localhost -U postgres -d mydb \
    --data-only \
    -f data_only.sql

# Tabla específica
pg_dump -h localhost -U postgres -d mydb \
    -t users \
    -f users_backup.sql

# Múltiples tablas
pg_dump -h localhost -U postgres -d mydb \
    -t users -t orders -t products \
    -f critical_tables.sql

# Excluir tablas (logs, temp data)
pg_dump -h localhost -U postgres -d mydb \
    --exclude-table=logs \
    --exclude-table=temp_data \
    -f backup_without_logs.sql

# Backup por esquema
pg_dump -h localhost -U postgres -d mydb \
    -n public \
    -f public_schema.sql
```

#### Restore desde pg_dump

```bash
# Restore formato custom
pg_restore -h localhost -U postgres -d mydb \
    -v \                      # Verbose
    backup_20240115.dump

# Restore con recreación de base de datos
pg_restore -h localhost -U postgres \
    -d postgres \             # Connect to postgres DB
    -C \                      # Create database
    -v \
    backup_20240115.dump

# Restore con clean (drop objects antes)
pg_restore -h localhost -U postgres -d mydb \
    -c \                      # Clean (drop) before restore
    -v \
    backup_20240115.dump

# Restore formato SQL
psql -h localhost -U postgres -d mydb \
    -f backup_20240115.sql

# Restore tabla específica
pg_restore -h localhost -U postgres -d mydb \
    -t users \
    backup_20240115.dump

# Restore paralelo (más rápido)
pg_restore -h localhost -U postgres -d mydb \
    -j 4 \                    # 4 parallel jobs
    -v \
    backup_20240115.dump
```

### 2. Continuous Archiving (WAL Archiving)

#### Configuración

```conf
# postgresql.conf
wal_level = replica                     # Nivel de logging
archive_mode = on                       # Habilitar archiving
archive_command = 'test ! -f /mnt/archive/%f && cp %p /mnt/archive/%f'
max_wal_senders = 3                     # Número de senders
wal_keep_size = 1GB                     # Mantener WAL files
```

#### Base Backup para PITR (Point-In-Time Recovery)

```bash
# Crear base backup
pg_basebackup -h localhost -U replication \
    -D /backup/base_$(date +%Y%m%d) \
    -P \                      # Progress
    -v \                      # Verbose
    --wal-method=stream       # Stream WAL durante backup

# Con compresión
pg_basebackup -h localhost -U replication \
    -D /backup/base \
    -P -v \
    -z \                      # Compress
    --wal-method=stream

# Con verificación de checksums
pg_basebackup -h localhost -U replication \
    -D /backup/base \
    -P -v \
    --wal-method=stream \
    --checkpoint=fast \
    --verify-checksums
```

#### Point-In-Time Recovery

```bash
# 1. Detener PostgreSQL
systemctl stop postgresql

# 2. Mover/renombrar directorio de datos actual
mv /var/lib/postgresql/14/main /var/lib/postgresql/14/main.old

# 3. Restaurar base backup
cp -r /backup/base /var/lib/postgresql/14/main

# 4. Crear archivo recovery.signal
touch /var/lib/postgresql/14/main/recovery.signal

# 5. Configurar recovery en postgresql.conf
cat >> /var/lib/postgresql/14/main/postgresql.auto.conf << EOF
restore_command = 'cp /mnt/archive/%f %p'
recovery_target_time = '2024-01-15 14:30:00'
# O usar otros targets:
# recovery_target_xid = '12345'
# recovery_target_name = 'before_disaster'
# recovery_target_lsn = '0/3000000'
EOF

# 6. Iniciar PostgreSQL
systemctl start postgresql

# 7. Verificar recovery
psql -c "SELECT pg_is_in_recovery();"
# true = aún en recovery, false = completado
```

### 3. Replicación

#### Streaming Replication Setup

```conf
# Primary Server (postgresql.conf)
wal_level = replica
max_wal_senders = 5
wal_keep_size = 1GB
hot_standby = on

# Primary Server (pg_hba.conf)
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    replication     replication     standby_ip/32           md5
```

```bash
# En Standby Server
# 1. Crear base backup desde primary
pg_basebackup -h primary_host -U replication \
    -D /var/lib/postgresql/14/main \
    -P -v \
    --wal-method=stream

# 2. Crear standby.signal
touch /var/lib/postgresql/14/main/standby.signal

# 3. Configurar conexión a primary
cat >> /var/lib/postgresql/14/main/postgresql.auto.conf << EOF
primary_conninfo = 'host=primary_host port=5432 user=replication password=secret'
EOF

# 4. Iniciar standby
systemctl start postgresql

# 5. Verificar replicación
# En primary:
psql -c "SELECT * FROM pg_stat_replication;"

# En standby:
psql -c "SELECT pg_is_in_recovery();"
```

#### Logical Replication

```sql
-- En Primary
-- 1. Crear publication
CREATE PUBLICATION my_publication FOR TABLE users, orders;

-- O para todas las tablas
CREATE PUBLICATION all_tables FOR ALL TABLES;

-- En Subscriber
-- 2. Crear subscription
CREATE SUBSCRIPTION my_subscription
    CONNECTION 'host=primary_host dbname=mydb user=replication password=secret'
    PUBLICATION my_publication;

-- Verificar estado
SELECT * FROM pg_stat_subscription;
```

## 🔐 Seguridad

### 1. Autenticación y Autorización

#### Crear Roles y Usuarios

```sql
-- Crear rol sin login
CREATE ROLE readonly;
CREATE ROLE readwrite;
CREATE ROLE admin_role;

-- Crear usuario con password
CREATE USER app_user WITH PASSWORD 'SecurePassword123!';
CREATE USER analyst WITH PASSWORD 'AnalystPass456!';
CREATE USER admin WITH PASSWORD 'AdminPass789!' SUPERUSER;

-- Asignar rol a usuario
GRANT readonly TO analyst;
GRANT readwrite TO app_user;
GRANT admin_role TO admin;

-- Password expiration
CREATE USER temp_user WITH 
    PASSWORD 'TempPass!' 
    VALID UNTIL '2024-12-31';

-- Cambiar password
ALTER USER app_user WITH PASSWORD 'NewSecurePassword!';
```

#### Permisos Granulares

```sql
-- Permisos de base de datos
GRANT CONNECT ON DATABASE mydb TO readonly;
REVOKE CONNECT ON DATABASE mydb FROM PUBLIC;

-- Permisos de esquema
GRANT USAGE ON SCHEMA public TO readonly;
GRANT CREATE ON SCHEMA public TO readwrite;

-- Permisos de tabla
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO readwrite;

-- Permisos para tablas futuras
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT SELECT ON TABLES TO readonly;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO readwrite;

-- Permisos de secuencias
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO readwrite;

-- Permisos específicos de columna
GRANT SELECT (id, email, username) ON users TO analyst;
REVOKE SELECT (password_hash, ssn) ON users FROM analyst;

-- Revocar permisos
REVOKE DELETE ON users FROM readwrite;
REVOKE ALL PRIVILEGES ON DATABASE mydb FROM old_user;
```

#### pg_hba.conf Configuration

```conf
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# Local connections
local   all             postgres                                peer
local   all             all                                     scram-sha-256

# IPv4 local connections
host    all             all             127.0.0.1/32            scram-sha-256

# IPv6 local connections
host    all             all             ::1/128                 scram-sha-256

# Application server
host    mydb            app_user        10.0.1.0/24             scram-sha-256

# Read replicas
host    replication     replication     10.0.2.0/24             scram-sha-256

# Deny by default
host    all             all             0.0.0.0/0               reject
```

### 2. Row Level Security (RLS)

```sql
-- Habilitar RLS en tabla
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy: usuarios solo ven sus documentos
CREATE POLICY user_documents_policy ON documents
    FOR SELECT
    TO PUBLIC
    USING (user_id = current_setting('app.current_user_id')::INTEGER);

-- Policy: usuarios solo modifican sus documentos
CREATE POLICY user_documents_update ON documents
    FOR UPDATE
    TO PUBLIC
    USING (user_id = current_setting('app.current_user_id')::INTEGER);

-- Policy: admins ven todo
CREATE POLICY admin_all_access ON documents
    FOR ALL
    TO admin_role
    USING (true)
    WITH CHECK (true);

-- Policy con múltiples condiciones
CREATE POLICY shared_documents ON documents
    FOR SELECT
    USING (
        user_id = current_setting('app.current_user_id')::INTEGER
        OR is_public = true
        OR id IN (
            SELECT document_id FROM document_shares 
            WHERE shared_with_user_id = current_setting('app.current_user_id')::INTEGER
        )
    );

-- Deshabilitar RLS para superusers
ALTER TABLE documents FORCE ROW LEVEL SECURITY;

-- Usar en aplicación
BEGIN;
SET app.current_user_id = 123;
SELECT * FROM documents; -- Solo ve documentos del user 123
COMMIT;
```

### 3. Encriptación

#### Encriptación en Tránsito (SSL/TLS)

```conf
# postgresql.conf
ssl = on
ssl_cert_file = '/path/to/server.crt'
ssl_key_file = '/path/to/server.key'
ssl_ca_file = '/path/to/root.crt'
ssl_ciphers = 'HIGH:MEDIUM:+3DES:!aNULL'
ssl_prefer_server_ciphers = on
```

```conf
# pg_hba.conf - Requerir SSL
hostssl   mydb    app_user    10.0.1.0/24    scram-sha-256
```

#### Encriptación en Reposo

```bash
# Usar filesystem encryption (LUKS, dm-crypt)
# O usar Transparent Data Encryption (TDE) extensions

# pgcrypto para columnas específicas
```

```sql
-- Instalar pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabla con datos encriptados
CREATE TABLE sensitive_data (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    ssn_encrypted BYTEA,
    credit_card_encrypted BYTEA,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar datos encriptados
INSERT INTO sensitive_data (user_id, ssn_encrypted, credit_card_encrypted)
VALUES (
    1,
    pgp_sym_encrypt('123-45-6789', 'encryption_key_here'),
    pgp_sym_encrypt('4111-1111-1111-1111', 'encryption_key_here')
);

-- Leer datos desencriptados
SELECT 
    id,
    user_id,
    pgp_sym_decrypt(ssn_encrypted, 'encryption_key_here') as ssn,
    pgp_sym_decrypt(credit_card_encrypted, 'encryption_key_here') as credit_card
FROM sensitive_data
WHERE user_id = 1;

-- Hash de passwords (one-way)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

-- Insertar con hash
INSERT INTO users (username, password_hash)
VALUES ('john', crypt('user_password', gen_salt('bf', 10)));

-- Verificar password
SELECT (
    crypt('user_password', password_hash) = password_hash
) AS password_match
FROM users 
WHERE username = 'john';
```

### 4. Auditoría

#### Logging Configuration

```conf
# postgresql.conf
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_rotation_age = 1d
log_rotation_size = 100MB

# Qué loguear
log_connections = on
log_disconnections = on
log_duration = off
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
log_lock_waits = on
log_statement = 'ddl'                   # none, ddl, mod, all
log_min_duration_statement = 1000       # Log queries > 1s

# Error logging
log_min_messages = warning
log_min_error_statement = error
```

#### Audit Triggers

```sql
-- Tabla de auditoría
CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(10) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by VARCHAR(100) NOT NULL,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    client_ip INET,
    application_name VARCHAR(100)
);

-- Índices para búsqueda
CREATE INDEX idx_audit_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_changed_at ON audit_log(changed_at DESC);
CREATE INDEX idx_audit_changed_by ON audit_log(changed_by);

-- Function para auditoría
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (
            table_name, record_id, action, new_data, changed_by, 
            client_ip, application_name
        )
        VALUES (
            TG_TABLE_NAME, 
            NEW.id, 
            'INSERT', 
            row_to_json(NEW)::jsonb,
            current_user,
            inet_client_addr(),
            current_setting('application_name', true)
        );
        RETURN NEW;
        
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (
            table_name, record_id, action, old_data, new_data, changed_by,
            client_ip, application_name
        )
        VALUES (
            TG_TABLE_NAME, 
            NEW.id, 
            'UPDATE', 
            row_to_json(OLD)::jsonb,
            row_to_json(NEW)::jsonb,
            current_user,
            inet_client_addr(),
            current_setting('application_name', true)
        );
        RETURN NEW;
        
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (
            table_name, record_id, action, old_data, changed_by,
            client_ip, application_name
        )
        VALUES (
            TG_TABLE_NAME, 
            OLD.id, 
            'DELETE', 
            row_to_json(OLD)::jsonb,
            current_user,
            inet_client_addr(),
            current_setting('application_name', true)
        );
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar a tablas sensibles
CREATE TRIGGER users_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER orders_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
```

#### Queries de Auditoría

```sql
-- Actividad por usuario
SELECT 
    changed_by,
    COUNT(*) as total_actions,
    COUNT(*) FILTER (WHERE action = 'INSERT') as inserts,
    COUNT(*) FILTER (WHERE action = 'UPDATE') as updates,
    COUNT(*) FILTER (WHERE action = 'DELETE') as deletes
FROM audit_log
WHERE changed_at >= NOW() - INTERVAL '24 hours'
GROUP BY changed_by
ORDER BY total_actions DESC;

-- Cambios en registro específico
SELECT 
    action,
    old_data,
    new_data,
    changed_by,
    changed_at
FROM audit_log
WHERE table_name = 'users' AND record_id = 123
ORDER BY changed_at DESC;

-- Detectar cambios sospechosos
SELECT *
FROM audit_log
WHERE action = 'DELETE'
  AND table_name = 'users'
  AND changed_at > NOW() - INTERVAL '1 hour'
ORDER BY changed_at DESC;
```

### 5. Hardening Checklist

```sql
-- Remover public schema privileges
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON DATABASE postgres FROM PUBLIC;

-- Eliminar usuarios default peligrosos
DROP USER IF EXISTS guest;

-- Verificar superusers
SELECT usename FROM pg_user WHERE usesuper = true;

-- Limitar conexiones por usuario
ALTER USER app_user CONNECTION LIMIT 50;

-- Disable functions peligrosas para usuarios no-admin
REVOKE EXECUTE ON FUNCTION pg_read_file(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION pg_ls_dir(text) FROM PUBLIC;
```

## 🔄 Automatización de Backups

### Backup Script Completo

```bash
#!/bin/bash
# backup_postgres.sh

set -e  # Exit on error

# Configuration
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="mydb"
DB_USER="postgres"
BACKUP_DIR="/backups/postgresql"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${DATE}.dump"
LOG_FILE="${BACKUP_DIR}/backup_${DATE}.log"

# Create backup directory
mkdir -p "${BACKUP_DIR}"

# Log function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "${LOG_FILE}"
}

log "Starting backup of database: ${DB_NAME}"

# Create backup
pg_dump -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" \
    -F c -b -v -f "${BACKUP_FILE}" 2>> "${LOG_FILE}"

# Verify backup
if [ -f "${BACKUP_FILE}" ]; then
    SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
    log "Backup completed successfully. Size: ${SIZE}"
    
    # Verify backup integrity
    pg_restore --list "${BACKUP_FILE}" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        log "Backup integrity verified"
    else
        log "ERROR: Backup integrity check failed"
        exit 1
    fi
else
    log "ERROR: Backup file not created"
    exit 1
fi

# Compress backup
gzip "${BACKUP_FILE}"
log "Backup compressed: ${BACKUP_FILE}.gz"

# Upload to S3 (optional)
# aws s3 cp "${BACKUP_FILE}.gz" "s3://my-backups/postgresql/"
# log "Backup uploaded to S3"

# Clean old backups
log "Cleaning backups older than ${RETENTION_DAYS} days"
find "${BACKUP_DIR}" -name "*.dump.gz" -type f -mtime +${RETENTION_DAYS} -delete
find "${BACKUP_DIR}" -name "*.log" -type f -mtime +${RETENTION_DAYS} -delete

log "Backup process completed"
```

### Crontab Configuration

```cron
# Daily backup at 2 AM
0 2 * * * /usr/local/bin/backup_postgres.sh

# Weekly full backup on Sunday at 3 AM
0 3 * * 0 /usr/local/bin/backup_postgres_full.sh

# Hourly WAL archiving check
0 * * * * /usr/local/bin/verify_wal_archiving.sh
```

## ✅ Security Checklist

### Pre-Production
- [ ] Todos los usuarios tienen passwords fuertes
- [ ] Superuser limitado a usuarios específicos
- [ ] SSL/TLS habilitado para todas las conexiones
- [ ] pg_hba.conf configurado con reglas restrictivas
- [ ] RLS habilitado en tablas con datos sensibles
- [ ] Datos sensibles encriptados (SSN, tarjetas, etc.)
- [ ] Auditoría habilitada para tablas críticas
- [ ] Connection limits configurados por usuario
- [ ] Default privileges configurados correctamente
- [ ] Public schema sin privilegios excesivos

### Backup
- [ ] Backups automáticos configurados
- [ ] WAL archiving habilitado para PITR
- [ ] Backups probados (restore test)
- [ ] Backups almacenados fuera del servidor
- [ ] Backups encriptados
- [ ] Retención de backups definida
- [ ] Monitoreo de backups funcionando
- [ ] Documentación de procedimientos de restore

### Monitoring
- [ ] Logging apropiado habilitado
- [ ] Alertas configuradas para:
  - [ ] Failed login attempts
  - [ ] Privilege escalations
  - [ ] Unusual data access patterns
  - [ ] Backup failures
  - [ ] Replication lag
- [ ] Logs centralizados y monitoreados
- [ ] Acceso a logs restringido

## 📚 Recursos Adicionales

- [PostgreSQL Backup & Restore](https://www.postgresql.org/docs/current/backup.html)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)
- [PostgreSQL SSL Support](https://www.postgresql.org/docs/current/ssl-tcp.html)
- [Row Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

---

_Guía creada por PostgreSQL Specialist Agent_ 🐘
