# 🔐 Security Templates

Plantillas de código para implementar funcionalidades de seguridad en aplicaciones modernas.

## 📋 Contenido

### Authentication
- [JWT Service Template](#jwt-service-template)
- [OAuth2 Strategy Template](#oauth2-strategy-template)
- [MFA Service Template](#mfa-service-template)

### Authorization
- [RBAC Guard Template](#rbac-guard-template)
- [Ability Factory Template](#ability-factory-template)
- [Permission Decorators](#permission-decorators)

### Encryption
- [Crypto Service Template](#crypto-service-template)
- [Password Service Template](#password-service-template)
- [Field Encryption Template](#field-encryption-template)

### Security Middleware
- [Rate Limiting](#rate-limiting-template)
- [Security Headers](#security-headers-template)
- [CSRF Protection](#csrf-protection-template)
- [Input Sanitization](#input-sanitization-template)

### Configuration
- [Environment Variables](#environment-variables-template)
- [Security Config](#security-config-template)

---

## JWT Service Template

```typescript
// templates/security/jwt.service.template.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokenPair(payload: JwtPayload): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(
        { sub: payload.sub },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        }
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
```

**Uso:**
```bash
# Instalar dependencias
npm install @nestjs/jwt bcrypt
npm install -D @types/bcrypt

# Variables de entorno requeridas
JWT_ACCESS_SECRET=your-access-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
```

---

## OAuth2 Strategy Template

```typescript
// templates/security/oauth2.strategy.template.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
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

**Controller:**
```typescript
@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Request() req) {
    return this.authService.handleOAuthLogin(req.user);
  }
}
```

---

## MFA Service Template

```typescript
// templates/security/mfa.service.template.ts
import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class MfaService {
  async generateSecret(userId: string, email: string) {
    const secret = speakeasy.generateSecret({
      name: `{{APP_NAME}} (${email})`,
      issuer: '{{APP_NAME}}',
    });

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    return {
      secret: secret.base32,
      qrCode,
    };
  }

  verifyToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2,
    });
  }

  generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  }
}
```

**Uso:**
```bash
npm install speakeasy qrcode
npm install -D @types/qrcode
```

---

## RBAC Guard Template

```typescript
// templates/security/rbac.guard.template.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const hasRole = requiredRoles.some(role => user.roles?.includes(role));
    
    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
```

**Decorator:**
```typescript
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// Uso
@Get('admin')
@Roles('admin', 'super_admin')
@UseGuards(JwtAuthGuard, RbacGuard)
adminOnly() {
  return 'Admin only content';
}
```

---

## Ability Factory Template

```typescript
// templates/security/ability.factory.template.ts
import { Injectable } from '@nestjs/common';
import { AbilityBuilder, PureAbility } from '@casl/ability';

export type Action = 'create' | 'read' | 'update' | 'delete' | 'manage';
export type Subject = 'User' | 'Post' | 'Comment' | 'all';
export type AppAbility = PureAbility<[Action, Subject]>;

@Injectable()
export class AbilityFactory {
  createForUser(user: any) {
    const { can, cannot, build } = new AbilityBuilder(PureAbility);

    if (user.role === 'super_admin') {
      can('manage', 'all');
    } else if (user.role === 'admin') {
      can('manage', 'User');
      can('manage', 'Post');
      cannot('delete', 'User', { role: 'super_admin' });
    } else if (user.role === 'user') {
      can('read', 'Post');
      can(['create', 'update'], 'Post', { authorId: user.id });
      can('update', 'User', { id: user.id });
    }

    return build();
  }
}
```

**Uso:**
```bash
npm install @casl/ability
```

---

## Crypto Service Template

```typescript
// templates/security/crypto.service.template.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly encryptionKey: Buffer;

  constructor(private configService: ConfigService) {
    const key = this.configService.get<string>('ENCRYPTION_KEY');
    this.encryptionKey = Buffer.from(key, 'hex');
  }

  encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.encryptionKey, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    return iv.toString('hex') + tag.toString('hex') + encrypted;
  }

  decrypt(ciphertext: string): string {
    const iv = Buffer.from(ciphertext.slice(0, 32), 'hex');
    const tag = Buffer.from(ciphertext.slice(32, 64), 'hex');
    const encrypted = ciphertext.slice(64);

    const decipher = crypto.createDecipheriv(this.algorithm, this.encryptionKey, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  hash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
```

**Generar encryption key:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Password Service Template

```typescript
// templates/security/password.service.template.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as validator from 'validator';

@Injectable()
export class PasswordService {
  private readonly saltRounds = 12;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

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

    const commonPasswords = ['password', '12345678', 'qwerty', 'abc123'];
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

## Rate Limiting Template

```typescript
// templates/security/rate-limit.middleware.template.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP',
    standardHeaders: true,
    legacyHeaders: false,
  });

  use(req: Request, res: Response, next: NextFunction) {
    this.limiter(req, res, next);
  }
}

// Aplicar globalmente
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware).forRoutes('*');
  }
}
```

---

## Security Headers Template

```typescript
// templates/security/helmet.middleware.template.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

@Injectable()
export class HelmetMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    })(req, res, next);
  }
}
```

---

## Input Sanitization Template

```typescript
// templates/security/input-sanitizer.service.template.ts
import { Injectable } from '@nestjs/common';
import * as validator from 'validator';
import * as xss from 'xss';

@Injectable()
export class InputSanitizer {
  sanitizeString(input: string): string {
    if (!input) return input;
    
    const cleaned = xss(input, {
      whiteList: {},
      stripIgnoreTag: true,
    });

    return validator.trim(cleaned);
  }

  sanitizeEmail(email: string): string {
    if (!email) return email;
    
    const normalized = validator.normalizeEmail(email, {
      all_lowercase: true,
    });

    return normalized || email;
  }

  sanitizeUrl(url: string): string {
    if (!url) return url;

    if (!validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true,
    })) {
      throw new Error('Invalid URL format');
    }

    const blockedPatterns = [
      /^https?:\/\/(localhost|127\.0\.0\.1)/i,
      /^https?:\/\/192\.168\./i,
      /^https?:\/\/10\./i,
    ];

    if (blockedPatterns.some(pattern => pattern.test(url))) {
      throw new Error('Access to internal URLs is not allowed');
    }

    return url;
  }
}
```

---

## Environment Variables Template

```bash
# templates/security/.env.security.template

# Application
NODE_ENV=production
PORT=3000

# JWT
JWT_ACCESS_SECRET=generate-32-char-secret-here
JWT_REFRESH_SECRET=generate-32-char-secret-here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Encryption
ENCRYPTION_KEY=64-char-hex-string-for-aes-256

# OAuth2
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/auth/google/callback

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
DATABASE_SSL=true

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Security
SESSION_SECRET=generate-32-char-secret-here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Monitoring
SIEM_ENDPOINT=https://siem.yourdomain.com
```

---

## Security Config Template

```typescript
// templates/security/security.config.template.ts
export const securityConfig = {
  jwt: {
    accessExpiry: '15m',
    refreshExpiry: '7d',
  },

  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    saltRounds: 12,
  },

  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
    loginMax: 5,
  },

  session: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: 'strict' as const,
    },
  },

  cors: {
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },

  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  },

  mfa: {
    issuer: 'YourApp',
    window: 2,
    backupCodesCount: 10,
  },
};
```

---

## 🚀 Quick Start

### 1. Setup JWT Authentication

```bash
# Install dependencies
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/bcrypt @types/passport-jwt

# Generate secrets
node -e "console.log('JWT_ACCESS_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Setup RBAC

```bash
npm install @casl/ability

# Copy templates
cp templates/security/rbac.guard.template.ts src/auth/guards/rbac.guard.ts
cp templates/security/ability.factory.template.ts src/auth/ability.factory.ts
```

### 3. Setup Security Middleware

```bash
npm install helmet express-rate-limit cors

# Copy templates
cp templates/security/helmet.middleware.template.ts src/middleware/helmet.middleware.ts
cp templates/security/rate-limit.middleware.template.ts src/middleware/rate-limit.middleware.ts
```

### 4. Setup Encryption

```bash
# Generate encryption key
node -e "console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('hex'))"

# Copy template
cp templates/security/crypto.service.template.ts src/encryption/crypto.service.ts
```

---

## 📚 Documentación Relacionada

- [Guía de Seguridad](../../docs/security/README.md)
- [Security Specialist Agent](../../agents/security-specialist.md)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

_Security Templates - Implementaciones seguras listas para usar_ 🔐
