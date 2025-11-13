# JWT Authentication

**Categoría:** Backend  
**Nivel:** Intermedio  
**Tecnologías:** JWT, Express, Node.js

## Objetivo

Implementar un sistema completo de autenticación basado en JWT (JSON Web Tokens) con refresh tokens, seguro y escalable.

## Contexto

Este prompt genera un sistema de autenticación robusto usando JWT para stateless authentication. Incluye login, logout, refresh tokens, y middleware de protección.

## Prompt

```
Implementa un sistema de autenticación JWT completo para una aplicación {{framework}}.

Requisitos:

1. Endpoints de autenticación:
   - POST /auth/register - Registro de usuarios
   - POST /auth/login - Login (retorna access + refresh token)
   - POST /auth/refresh - Renovar access token
   - POST /auth/logout - Logout (invalidar refresh token)
   - GET /auth/me - Obtener usuario actual

2. Tokens:
   - Access Token: JWT de corta duración (15 minutos)
   - Refresh Token: Token de larga duración (7 días)
   - Refresh tokens almacenados en {{database}} para revocación

3. Seguridad:
   - Passwords hasheados con bcrypt (10 rounds)
   - Validación de input robusta
   - Rate limiting en endpoints de auth
   - CSRF protection
   - Secure httpOnly cookies para refresh tokens

4. Middleware:
   - requireAuth: Verifica access token válido
   - requireRole: Verifica rol específico
   - optionalAuth: Auth opcional

5. Manejo de tokens:
   - Verificar firma y expiración
   - Blacklist para tokens revocados
   - Renovación automática con refresh token
   - Múltiples sesiones por usuario (opcional)

6. Features adicionales:
   - Email verification
   - Password reset flow
   - Change password (requiere password actual)
   - Logout de todas las sesiones

7. Response format:
   ```json
   {
     "success": true,
     "data": {
       "user": { "id": "...", "email": "..." },
       "accessToken": "...",
       "refreshToken": "..."
     }
   }
   ```

8. Tests:
   - Tests de registro y login
   - Tests de renovación de tokens
   - Tests de tokens expirados
   - Tests de middleware

Base de datos: {{database}}
Secret management: {{secret_storage}}
```

## Ejemplo de Uso

### Variables:
- `{{framework}}`: "Express.js"
- `{{database}}`: "PostgreSQL"
- `{{secret_storage}}`: "Environment variables"

## Resultados Esperados

### Auth Controller

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, RefreshToken } = require('../models');

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required'
      });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({
      email,
      passwordHash,
      name
    });
    
    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    
    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        accessToken
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }
    
    // Verify token exists in database
    const tokenRecord = await RefreshToken.findOne({
      where: { token: refreshToken },
      include: [User]
    });
    
    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }
    
    // Generate new access token
    const accessToken = generateAccessToken(tokenRecord.User);
    
    res.json({
      success: true,
      data: { accessToken }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Token refresh failed',
      error: error.message
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    
    if (refreshToken) {
      await RefreshToken.destroy({
        where: { token: refreshToken }
      });
    }
    
    res.clearCookie('refreshToken');
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
};

function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
}

async function generateRefreshToken(user) {
  const token = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  await RefreshToken.create({
    token,
    userId: user.id,
    expiresAt
  });
  
  return token;
}
```

### Auth Middleware

```javascript
const jwt = require('jsonwebtoken');

exports.requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const token = authHeader.substring(7);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

exports.requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }
    
    next();
  };
};
```

## Tips Adicionales

### Para OAuth integration:
```
Agrega endpoints para OAuth providers (Google, GitHub, etc.)
Implementa estrategia de passport.js
```

### Para MFA:
```
Agrega two-factor authentication con TOTP
Genera QR codes para configuración
Verifica códigos 2FA en login
```

---

_JWT Authentication - Autenticación segura y escalable_ 🔐
