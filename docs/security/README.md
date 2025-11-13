# 🔐 Guía de Seguridad de Aplicaciones

Guía completa de seguridad para el desarrollo de aplicaciones modernas, cubriendo autenticación, autorización, cifrado, y protección contra vulnerabilidades.

## 📋 Tabla de Contenidos

- [Autenticación y Autorización](#autenticación-y-autorización)
  - [JWT Authentication](#jwt-authentication)
  - [OAuth2 & SSO](#oauth2--sso)
  - [Multi-Factor Authentication](#multi-factor-authentication)
  - [RBAC (Control de Acceso Basado en Roles)](#rbac-control-de-acceso-basado-en-roles)
- [Cifrado y Protección de Datos](#cifrado-y-protección-de-datos)
  - [Encryption at Rest](#encryption-at-rest)
  - [Encryption in Transit](#encryption-in-transit)
  - [Password Hashing](#password-hashing)
- [Mitigación OWASP Top 10](#mitigación-owasp-top-10)
- [Gestión de Secretos](#gestión-de-secretos)
- [Configuración Segura](#configuración-segura)
- [Auditoría y Logging](#auditoría-y-logging)

---

## 🔒 Autenticación y Autorización

### JWT Authentication

JSON Web Tokens (JWT) es el estándar de facto para autenticación en aplicaciones modernas.

#### Conceptos Clave

**Access Token**
- Token de corta duración (15 minutos)
- Contiene información del usuario (claims)
- Firmado con clave secreta
- Verificado en cada request

**Refresh Token**
- Token de larga duración (7 días)
- Solo para renovar access tokens
- Almacenado de forma segura
- Puede ser revocado

#### Implementación Básica

```typescript
// Instalación
npm install @nestjs/jwt bcrypt

// Configuración
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
})
export class AuthModule {}
```

#### Generar Tokens

```typescript
import { JwtService } from '@nestjs/jwt';

async generateTokens(user: User) {
  const payload = {
    sub: user.id,
    email: user.email,
    roles: user.roles,
  };

  const [accessToken, refreshToken] = await Promise.all([
    this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    }),
    this.jwtService.signAsync(
      { sub: user.id },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }
    ),
  ]);

  return { accessToken, refreshToken };
}
```

#### Verificar Tokens

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: any) {
    // Verificar que el usuario existe y está activo
    const user = await this.userService.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }
    return { userId: payload.sub, email: payload.email, roles: payload.roles };
  }
}
```

#### Proteger Rutas

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }
}
```

#### Token Blacklisting

```typescript
import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class TokenBlacklistService {
  constructor(private redis: RedisService) {}

  async blacklistToken(token: string, expiresIn: number) {
    const key = `blacklist:${token}`;
    await this.redis.setex(key, expiresIn, 'true');
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const key = `blacklist:${token}`;
    const result = await this.redis.get(key);
    return result === 'true';
  }
}
```

### OAuth2 & SSO

OAuth2 permite autenticación mediante proveedores externos (Google, GitHub, etc.)

#### Google OAuth2 Setup

```typescript
// Instalación
npm install @nestjs/passport passport-google-oauth20

// Configuración
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };

    done(null, user);
  }
}
```

#### OAuth Controller

```typescript
@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Redirect to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Request() req) {
    // Handle Google callback
    const tokens = await this.authService.generateTokens(req.user);
    return { tokens };
  }
}
```

### Multi-Factor Authentication

MFA agrega una capa adicional de seguridad mediante TOTP (Time-based One-Time Password)

#### TOTP Setup

```typescript
// Instalación
npm install speakeasy qrcode

import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class MfaService {
  async generateSecret(userId: string, email: string) {
    const secret = speakeasy.generateSecret({
      name: `YourApp (${email})`,
      issuer: 'YourApp',
    });

    // Guardar secret en base de datos
    await this.userService.updateMfaSecret(userId, secret.base32);

    // Generar QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    return {
      secret: secret.base32,
      qrCode,
    };
  }

  async verifyToken(userId: string, token: string): Promise<boolean> {
    const user = await this.userService.findById(userId);
    
    return speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token,
      window: 2, // Allow 2 time steps (60 seconds)
    });
  }

  async enableMfa(userId: string, token: string): Promise<boolean> {
    const isValid = await this.verifyToken(userId, token);
    
    if (isValid) {
      await this.userService.update(userId, { mfaEnabled: true });
      return true;
    }
    
    return false;
  }
}
```

#### MFA Flow

```typescript
@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // If MFA is enabled, require MFA token
    if (user.mfaEnabled) {
      return {
        requiresMfa: true,
        tempToken: await this.authService.generateTempToken(user.id),
      };
    }

    // Generate regular tokens
    return this.authService.generateTokens(user);
  }

  @Post('mfa/verify')
  async verifyMfa(@Body() verifyDto: MfaVerifyDto) {
    const userId = await this.authService.validateTempToken(verifyDto.tempToken);
    const isValid = await this.mfaService.verifyToken(userId, verifyDto.token);

    if (!isValid) {
      throw new UnauthorizedException('Invalid MFA token');
    }

    const user = await this.userService.findById(userId);
    return this.authService.generateTokens(user);
  }
}
```

### RBAC (Control de Acceso Basado en Roles)

RBAC permite controlar el acceso a recursos basándose en roles y permisos.

#### Definir Roles y Permisos

```typescript
// roles.enum.ts
export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

// permissions.enum.ts
export enum Permission {
  CREATE_USER = 'create:user',
  READ_USER = 'read:user',
  UPDATE_USER = 'update:user',
  DELETE_USER = 'delete:user',
  CREATE_POST = 'create:post',
  READ_POST = 'read:post',
  UPDATE_POST = 'update:post',
  DELETE_POST = 'delete:post',
}
```

#### CASL Integration

```typescript
// Instalación
npm install @casl/ability

import { AbilityBuilder, PureAbility } from '@casl/ability';

export type Action = 'create' | 'read' | 'update' | 'delete' | 'manage';
export type Subject = 'User' | 'Post' | 'Comment' | 'all';

export type AppAbility = PureAbility<[Action, Subject]>;

@Injectable()
export class AbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder(PureAbility);

    if (user.role === Role.SUPER_ADMIN) {
      can('manage', 'all');
    } else if (user.role === Role.ADMIN) {
      can('manage', 'User');
      can('manage', 'Post');
      cannot('delete', 'User', { role: Role.SUPER_ADMIN });
    } else if (user.role === Role.MANAGER) {
      can('read', 'User');
      can(['create', 'read', 'update'], 'Post');
      can('delete', 'Post', { authorId: user.id });
    } else {
      can('read', 'Post');
      can(['create', 'update'], 'Post', { authorId: user.id });
    }

    return build();
  }
}
```

#### Guards de Autorización

```typescript
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from './ability.factory';

@Injectable()
export class AbilityGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredAbility = this.reflector.get<any>('ability', context.getHandler());
    
    if (!requiredAbility) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const ability = this.abilityFactory.createForUser(user);

    const isAllowed = ability.can(requiredAbility.action, requiredAbility.subject);
    
    if (!isAllowed) {
      throw new ForbiddenException('You do not have permission to perform this action');
    }

    return true;
  }
}
```

#### Decoradores de Permisos

```typescript
import { SetMetadata } from '@nestjs/common';

export const CheckAbility = (action: string, subject: string) =>
  SetMetadata('ability', { action, subject });

// Uso
@Controller('posts')
export class PostsController {
  @Post()
  @UseGuards(JwtAuthGuard, AbilityGuard)
  @CheckAbility('create', 'Post')
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AbilityGuard)
  @CheckAbility('delete', 'Post')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
```

---

## 🔐 Cifrado y Protección de Datos

### Encryption at Rest

Cifrado de datos almacenados en base de datos y archivos.

#### Database Encryption (PostgreSQL)

```sql
-- Habilitar extensión pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Crear tabla con campos cifrados
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  encrypted_ssn BYTEA,
  encrypted_credit_card BYTEA
);

-- Insertar datos cifrados
INSERT INTO users (email, encrypted_ssn)
VALUES (
  'user@example.com',
  pgp_sym_encrypt('123-45-6789', 'encryption-key')
);

-- Consultar datos descifrados
SELECT 
  email,
  pgp_sym_decrypt(encrypted_ssn, 'encryption-key') as ssn
FROM users;
```

#### Field-Level Encryption

```typescript
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class FieldEncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;

  constructor() {
    // Key debe ser 32 bytes para AES-256
    this.key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Combinar IV + AuthTag + Encrypted Data
    return iv.toString('hex') + authTag.toString('hex') + encrypted;
  }

  decrypt(encryptedText: string): string {
    const iv = Buffer.from(encryptedText.slice(0, 32), 'hex');
    const authTag = Buffer.from(encryptedText.slice(32, 64), 'hex');
    const encrypted = encryptedText.slice(64);
    
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

// Uso en Entity
@Entity()
export class User {
  @Column()
  email: string;

  @Column({ type: 'text', nullable: true })
  private encryptedSsn: string;

  @Exclude()
  get ssn(): string {
    return this.encryptionService.decrypt(this.encryptedSsn);
  }

  set ssn(value: string) {
    this.encryptedSsn = this.encryptionService.encrypt(value);
  }
}
```

### Encryption in Transit

Asegurar comunicaciones mediante TLS/SSL.

#### HTTPS Configuration (Express/NestJS)

```typescript
import * as https from 'https';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'production') {
    const httpsOptions = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH),
      ca: fs.readFileSync(process.env.SSL_CA_PATH),
    };

    await app.init();
    const server = https.createServer(httpsOptions, app.getHttpAdapter().getInstance());
    await server.listen(443);
  } else {
    await app.listen(3000);
  }
}
```

#### Security Headers

```typescript
import helmet from 'helmet';

app.use(helmet());

// O configuración personalizada
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),
);
```

#### Certificate Pinning (Mobile)

```dart
// Flutter
import 'package:dio/dio.dart';
import 'package:dio/adapter.dart';

class SecureHttpClient {
  static Dio createDio() {
    final dio = Dio();
    
    (dio.httpClientAdapter as DefaultHttpClientAdapter).onHttpClientCreate =
        (client) {
      client.badCertificateCallback =
          (X509Certificate cert, String host, int port) {
        // Verificar el certificado
        return cert.sha256.toString() == 'expected-cert-hash';
      };
      return client;
    };
    
    return dio;
  }
}
```

### Password Hashing

Nunca almacenar contraseñas en texto plano.

#### bcrypt Implementation

```typescript
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private readonly saltRounds = 12;

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

// Uso
const hashedPassword = await this.passwordService.hashPassword('MySecurePassword123!');
const isValid = await this.passwordService.comparePassword('MySecurePassword123!', hashedPassword);
```

#### Argon2 (Recomendado para nuevos proyectos)

```typescript
// Instalación
npm install argon2

import * as argon2 from 'argon2';

@Injectable()
export class PasswordService {
  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,
      parallelism: 4,
    });
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }
}
```

#### Password Strength Validation

```typescript
import * as validator from 'validator';

@Injectable()
export class PasswordValidator {
  validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })) {
      errors.push('Password must contain uppercase, lowercase, number, and special character');
    }

    // Verificar contraseñas comunes
    const commonPasswords = ['password', '12345678', 'qwerty'];
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
```

---

## 🛡️ Mitigación OWASP Top 10

### A01: Broken Access Control

**Prevención**
```typescript
// Siempre verificar permisos en el backend
@Get('users/:id')
@UseGuards(JwtAuthGuard, AbilityGuard)
async getUser(@Param('id') id: string, @Request() req) {
  // Verificar que el usuario puede acceder a este recurso
  if (req.user.id !== id && !req.user.roles.includes('admin')) {
    throw new ForbiddenException();
  }
  
  return this.userService.findOne(id);
}

// Prevenir IDOR (Insecure Direct Object Reference)
@Delete('posts/:id')
@UseGuards(JwtAuthGuard)
async deletePost(@Param('id') id: string, @Request() req) {
  const post = await this.postService.findOne(id);
  
  // Verificar ownership
  if (post.authorId !== req.user.id) {
    throw new ForbiddenException('You can only delete your own posts');
  }
  
  return this.postService.remove(id);
}
```

### A02: Cryptographic Failures

**Prevención**
```typescript
// Usar algoritmos modernos y seguros
const algorithm = 'aes-256-gcm'; // ✅ Bueno
const algorithm = 'des'; // ❌ Malo (obsoleto)

// TLS 1.2+ only
app.use((req, res, next) => {
  const protocol = req.connection.encrypted ? 'https' : 'http';
  if (protocol === 'http' && process.env.NODE_ENV === 'production') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

// Verificar certificados SSL
const httpsAgent = new https.Agent({
  rejectUnauthorized: true, // ✅ Verificar certificados
});
```

### A03: Injection

**SQL Injection Prevention**
```typescript
// ✅ BUENO: Usar ORM o Parameterized Queries
const user = await this.userRepository.findOne({
  where: { email: userEmail },
});

// ✅ BUENO: Query Builder
const users = await this.userRepository
  .createQueryBuilder('user')
  .where('user.email = :email', { email: userEmail })
  .getMany();

// ❌ MALO: String concatenation
const query = `SELECT * FROM users WHERE email = '${userEmail}'`;
```

**NoSQL Injection Prevention**
```typescript
// ✅ BUENO: Validar y sanitizar input
import * as validator from 'validator';

async findUser(email: string) {
  // Validar formato de email
  if (!validator.isEmail(email)) {
    throw new BadRequestException('Invalid email format');
  }
  
  // Sanitizar
  const sanitizedEmail = validator.normalizeEmail(email);
  
  return this.userModel.findOne({ email: sanitizedEmail });
}

// ❌ MALO: Pasar objeto directamente
async findUser(query: any) {
  return this.userModel.findOne(query); // Vulnerable a inyección
}
```

**XSS Prevention**
```typescript
import * as xss from 'xss';

@Injectable()
export class SanitizerService {
  sanitizeHtml(dirty: string): string {
    return xss(dirty, {
      whiteList: {
        p: [],
        br: [],
        strong: [],
        em: [],
      },
    });
  }

  sanitizeText(text: string): string {
    return validator.escape(text);
  }
}

// Frontend (React)
function UserComment({ comment }) {
  // ✅ BUENO: React escapa automáticamente
  return <div>{comment.text}</div>;
  
  // ❌ MALO: dangerouslySetInnerHTML sin sanitizar
  return <div dangerouslySetInnerHTML={{ __html: comment.html }} />;
  
  // ✅ BUENO: dangerouslySetInnerHTML con sanitización
  return <div dangerouslySetInnerHTML={{ __html: sanitize(comment.html) }} />;
}
```

### A04: Insecure Design

**Implementar rate limiting**
```typescript
import rateLimit from 'express-rate-limit';

// Rate limiting global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests
  message: 'Too many requests from this IP',
});

app.use(limiter);

// Rate limiting específico para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // máximo 5 intentos de login
  skipSuccessfulRequests: true,
});

@Post('login')
@UseGuards(loginLimiter)
async login(@Body() loginDto: LoginDto) {
  // ...
}
```

### A05: Security Misconfiguration

**Configuración segura**
```typescript
// ✅ BUENO: Ocultar información sensible
app.disable('x-powered-by');

// ✅ BUENO: Error handling sin exponer detalles
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : 500;

    // No exponer stack traces en producción
    const message = process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : exception instanceof Error
        ? exception.message
        : 'Unknown error';

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### A07: Identification and Authentication Failures

**Prevenir brute force**
```typescript
import * as slowDown from 'express-slow-down';

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 5,
  delayMs: 500,
});

// Account lockout
@Injectable()
export class LoginAttemptsService {
  async recordFailedAttempt(email: string) {
    const key = `login_attempts:${email}`;
    const attempts = await this.redis.incr(key);
    await this.redis.expire(key, 900); // 15 minutos

    if (attempts >= 5) {
      await this.lockAccount(email);
      throw new UnauthorizedException('Account locked due to too many failed attempts');
    }
  }

  async resetAttempts(email: string) {
    await this.redis.del(`login_attempts:${email}`);
  }
}
```

### A09: Security Logging and Monitoring

**Implementar security logging**
```typescript
@Injectable()
export class SecurityLogger {
  async logSecurityEvent(event: SecurityEvent) {
    const logEntry = {
      timestamp: new Date(),
      type: event.type,
      userId: event.userId,
      ip: event.ip,
      userAgent: event.userAgent,
      metadata: event.metadata,
    };

    // Log a archivo
    this.logger.log(JSON.stringify(logEntry));

    // En producción, enviar a SIEM
    if (process.env.NODE_ENV === 'production') {
      await this.sendToSIEM(logEntry);
    }

    // Alertar eventos críticos
    if (this.isCritical(event)) {
      await this.sendAlert(logEntry);
    }
  }
}

// Usar en login
@Post('login')
async login(@Body() loginDto: LoginDto, @Ip() ip: string, @Headers('user-agent') userAgent: string) {
  try {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    
    await this.securityLogger.logSecurityEvent({
      type: 'LOGIN_SUCCESS',
      userId: user.id,
      ip,
      userAgent,
    });
    
    return this.authService.generateTokens(user);
  } catch (error) {
    await this.securityLogger.logSecurityEvent({
      type: 'LOGIN_FAILED',
      userId: null,
      ip,
      userAgent,
      metadata: { email: loginDto.email },
    });
    
    throw error;
  }
}
```

### A10: Server-Side Request Forgery (SSRF)

**Prevención SSRF**
```typescript
@Injectable()
export class UrlValidator {
  private readonly blockedPatterns = [
    /^https?:\/\/(localhost|127\.0\.0\.1)/i,
    /^https?:\/\/192\.168\./i,
    /^https?:\/\/10\./i,
    /^https?:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\./i,
  ];

  validate(url: string): boolean {
    // Verificar formato
    if (!validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true,
    })) {
      throw new BadRequestException('Invalid URL format');
    }

    // Bloquear IPs internas
    if (this.blockedPatterns.some(pattern => pattern.test(url))) {
      throw new BadRequestException('Access to internal URLs is not allowed');
    }

    return true;
  }
}
```

---

## 🔑 Gestión de Secretos

### Variables de Entorno

**NUNCA**
```typescript
// ❌ NUNCA hacer esto
const apiKey = 'sk_live_abcd1234';
const dbPassword = 'mypassword123';
```

**SIEMPRE**
```typescript
// ✅ Usar variables de entorno
const apiKey = process.env.API_KEY;
const dbPassword = process.env.DB_PASSWORD;

// ✅ Validar que existen
if (!apiKey) {
  throw new Error('API_KEY is required');
}
```

### .env Files

```bash
# .env.example (commiteado)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-jwt-secret
API_KEY=your-api-key

# .env (NO commiteado, en .gitignore)
DATABASE_URL=postgresql://realuser:realpass@prod.db.com:5432/prod
JWT_SECRET=actual-secret-key-very-long-and-random
API_KEY=sk_live_real_api_key
```

### HashiCorp Vault

```typescript
import * as vault from 'node-vault';

@Injectable()
export class VaultService {
  private client: any;

  constructor() {
    this.client = vault({
      apiVersion: 'v1',
      endpoint: process.env.VAULT_ADDR,
      token: process.env.VAULT_TOKEN,
    });
  }

  async getSecret(path: string): Promise<any> {
    const result = await this.client.read(path);
    return result.data;
  }

  async setSecret(path: string, data: any): Promise<void> {
    await this.client.write(path, { data });
  }
}

// Uso
const dbCredentials = await this.vaultService.getSecret('secret/database');
const connection = createConnection({
  host: dbCredentials.host,
  username: dbCredentials.username,
  password: dbCredentials.password,
});
```

### AWS Secrets Manager

```typescript
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

@Injectable()
export class AwsSecretsService {
  private client: SecretsManager;

  constructor() {
    this.client = new SecretsManager({
      region: process.env.AWS_REGION,
    });
  }

  async getSecret(secretName: string): Promise<any> {
    const response = await this.client.getSecretValue({
      SecretId: secretName,
    });

    return JSON.parse(response.SecretString);
  }
}
```

---

## ⚙️ Configuración Segura

### Security Headers

```typescript
// main.ts
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", process.env.API_URL],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));
```

### CORS Configuration

```typescript
import * as cors from 'cors';

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### Cookie Security

```typescript
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only
    httpOnly: true, // No accesible desde JavaScript
    sameSite: 'strict', // CSRF protection
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
  },
}));
```

---

## 📊 Auditoría y Logging

### Security Event Logging

```typescript
export enum SecurityEventType {
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILED = 'login_failed',
  LOGOUT = 'logout',
  PASSWORD_CHANGE = 'password_change',
  MFA_ENABLED = 'mfa_enabled',
  PERMISSION_DENIED = 'permission_denied',
  DATA_ACCESS = 'data_access',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
}

@Injectable()
export class AuditService {
  async logEvent(event: {
    type: SecurityEventType;
    userId?: string;
    ip: string;
    userAgent: string;
    metadata?: any;
  }) {
    const auditEntry = {
      timestamp: new Date(),
      ...event,
    };

    // Guardar en base de datos
    await this.auditRepository.save(auditEntry);

    // Log críticos van a SIEM
    if (this.isCritical(event.type)) {
      await this.sendToSIEM(auditEntry);
    }
  }
}
```

### Compliance Logging

```typescript
@Injectable()
export class ComplianceLogger {
  // GDPR: Registrar acceso a datos personales
  async logDataAccess(userId: string, accessedBy: string, dataType: string) {
    await this.auditService.logEvent({
      type: SecurityEventType.DATA_ACCESS,
      userId: accessedBy,
      metadata: {
        targetUserId: userId,
        dataType,
        reason: 'user_request',
      },
    });
  }

  // PCI-DSS: Registrar acceso a datos de tarjetas
  async logPaymentDataAccess(userId: string, action: string) {
    await this.auditService.logEvent({
      type: SecurityEventType.DATA_ACCESS,
      userId,
      metadata: {
        dataType: 'payment',
        action,
        compliance: 'PCI-DSS',
      },
    });
  }
}
```

---

## 🎯 Checklist de Seguridad

### Autenticación
- [ ] Implementar JWT con access y refresh tokens
- [ ] Tokens con expiración corta (15 min)
- [ ] Token blacklisting para logout
- [ ] MFA para usuarios admin
- [ ] Password hashing con bcrypt/Argon2
- [ ] Password strength validation
- [ ] Rate limiting en login
- [ ] Account lockout tras intentos fallidos

### Autorización
- [ ] RBAC implementado
- [ ] Permission checking en todas las rutas
- [ ] Prevenir IDOR
- [ ] Verificar ownership de recursos
- [ ] Principle of least privilege

### Cifrado
- [ ] TLS 1.2+ en producción
- [ ] HTTPS enforcement
- [ ] Certificate pinning (mobile)
- [ ] Field-level encryption para datos sensibles
- [ ] Database encryption at rest
- [ ] Secure password hashing

### OWASP
- [ ] Parameterized queries (SQL injection)
- [ ] Input validation y sanitization
- [ ] Output encoding (XSS)
- [ ] CSRF protection
- [ ] Security headers (CSP, HSTS, etc.)
- [ ] Rate limiting
- [ ] Error handling sin exponer detalles

### Secretos
- [ ] No secrets en código
- [ ] Variables de entorno
- [ ] .env en .gitignore
- [ ] Vault/Secrets Manager en producción
- [ ] Secret rotation policies

### Logging
- [ ] Security event logging
- [ ] Audit trail para datos sensibles
- [ ] SIEM integration
- [ ] Alerting para eventos críticos
- [ ] Compliance logging (GDPR, PCI-DSS)

---

## 📚 Recursos Adicionales

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [NestJS Security](https://docs.nestjs.com/security/authentication)

---

_Guía de Seguridad - Protegiendo aplicaciones modernas_ 🔐
