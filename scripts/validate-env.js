#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * 
 * Validates that all required environment variables are present
 * and properly formatted for the current environment.
 * 
 * Usage:
 *   node scripts/validate-env.js
 *   NODE_ENV=production node scripts/validate-env.js
 */

const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Required variables per environment
const requiredVariables = {
  development: [
    'NODE_ENV',
    'PORT',
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
  ],
  test: [
    'NODE_ENV',
    'PORT',
    'TEST_DATABASE_URL',
    'JWT_SECRET',
  ],
  staging: [
    'NODE_ENV',
    'PORT',
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'SENTRY_DSN',
    'CORS_ORIGIN',
  ],
  production: [
    'NODE_ENV',
    'PORT',
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'SENTRY_DSN',
    'CORS_ORIGIN',
    'ENCRYPTION_KEY',
    'ALLOWED_ORIGINS',
  ],
  preview: [
    'NODE_ENV',
    'PORT',
    'DATABASE_URL',
    'JWT_SECRET',
    'PR_NUMBER',
    'BRANCH_NAME',
  ],
};

// Optional but recommended variables
const recommendedVariables = {
  development: ['LOG_LEVEL', 'DEBUG'],
  test: ['CI', 'TEST_TIMEOUT'],
  staging: ['BACKUP_ENABLED', 'MONITORING_ENABLED'],
  production: [
    'BACKUP_ENABLED',
    'MONITORING_ENABLED',
    'APM_ENABLED',
    'CLOUDWATCH_LOG_GROUP',
    'MIN_REPLICAS',
    'MAX_REPLICAS',
  ],
  preview: ['PREVIEW_LIFETIME_HOURS', 'CLEANUP_ON_PR_CLOSE'],
};

// Validation patterns
const patterns = {
  DATABASE_URL: /^postgresql:\/\/.+:.+@.+:\d+\/.+$/,
  MONGODB_URI: /^mongodb(\+srv)?:\/\/.+/,
  REDIS_URL: /^rediss?:\/\/.+/,
  JWT_SECRET: /.{32,}/, // At least 32 characters
  JWT_ACCESS_SECRET: /.{32,}/,
  JWT_REFRESH_SECRET: /.{32,}/,
  ENCRYPTION_KEY: /^[0-9a-fA-F]{64}$/, // 32 bytes hex = 64 chars
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  PORT: /^\d+$/,
};

// Security warnings for insecure values
const insecurePatterns = {
  JWT_SECRET: [
    'secret',
    'password',
    'test',
    'dev',
    '12345',
    'change',
    'example',
  ],
  JWT_ACCESS_SECRET: ['secret', 'password', 'test', 'dev', '12345'],
  JWT_REFRESH_SECRET: ['secret', 'password', 'test', 'dev', '12345'],
  DB_PASSWORD: ['password', 'admin', '12345', 'postgres'],
};

class EnvironmentValidator {
  constructor() {
    this.env = process.env.NODE_ENV || 'development';
    this.errors = [];
    this.warnings = [];
    this.info = [];
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  validate() {
    this.log('\n🔍 Environment Validation', 'cyan');
    this.log(`Environment: ${this.env}`, 'blue');
    this.log('━'.repeat(50), 'cyan');

    // Load .env file if it exists
    this.loadEnvFile();

    // Validate required variables
    this.validateRequiredVariables();

    // Validate recommended variables
    this.validateRecommendedVariables();

    // Validate patterns
    this.validatePatterns();

    // Check for insecure values
    this.checkInsecureValues();

    // Check for placeholder values
    this.checkPlaceholders();

    // Print results
    this.printResults();

    // Exit with appropriate code
    return this.errors.length === 0;
  }

  loadEnvFile() {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      require('dotenv').config({ path: envPath });
      this.info.push('.env file loaded successfully');
    } else {
      this.warnings.push('.env file not found - using system environment variables');
    }
  }

  validateRequiredVariables() {
    const required = requiredVariables[this.env] || requiredVariables.development;

    required.forEach((varName) => {
      const value = process.env[varName];

      if (!value || value.trim() === '') {
        this.errors.push(`Missing required variable: ${varName}`);
      } else if (value.length < 3) {
        this.warnings.push(`${varName} is too short (less than 3 characters)`);
      }
    });
  }

  validateRecommendedVariables() {
    const recommended = recommendedVariables[this.env] || [];

    recommended.forEach((varName) => {
      const value = process.env[varName];

      if (!value || value.trim() === '') {
        this.info.push(`Recommended variable not set: ${varName}`);
      }
    });
  }

  validatePatterns() {
    Object.keys(patterns).forEach((varName) => {
      const value = process.env[varName];

      if (value && !patterns[varName].test(value)) {
        this.errors.push(`${varName} has invalid format`);
      }
    });
  }

  checkInsecureValues() {
    // Only check in staging and production
    if (this.env !== 'staging' && this.env !== 'production') {
      return;
    }

    Object.keys(insecurePatterns).forEach((varName) => {
      const value = process.env[varName];

      if (value) {
        const lowerValue = value.toLowerCase();
        const hasInsecurePattern = insecurePatterns[varName].some((pattern) =>
          lowerValue.includes(pattern)
        );

        if (hasInsecurePattern) {
          this.errors.push(
            `${varName} contains insecure/default value in ${this.env} environment`
          );
        }
      }
    });
  }

  checkPlaceholders() {
    const placeholderPatterns = [
      'your-',
      'your_',
      'change-this',
      'change_this',
      'example',
      'placeholder',
      'todo',
      '${',
    ];

    Object.keys(process.env).forEach((varName) => {
      const value = process.env[varName];

      if (value) {
        const lowerValue = value.toLowerCase();
        const hasPlaceholder = placeholderPatterns.some((pattern) =>
          lowerValue.includes(pattern)
        );

        if (hasPlaceholder) {
          this.warnings.push(`${varName} appears to contain a placeholder value`);
        }
      }
    });
  }

  printResults() {
    this.log('\n📊 Validation Results', 'cyan');
    this.log('━'.repeat(50), 'cyan');

    // Print errors
    if (this.errors.length > 0) {
      this.log(`\n❌ Errors (${this.errors.length}):`, 'red');
      this.errors.forEach((error) => {
        this.log(`  • ${error}`, 'red');
      });
    }

    // Print warnings
    if (this.warnings.length > 0) {
      this.log(`\n⚠️  Warnings (${this.warnings.length}):`, 'yellow');
      this.warnings.forEach((warning) => {
        this.log(`  • ${warning}`, 'yellow');
      });
    }

    // Print info
    if (this.info.length > 0) {
      this.log(`\nℹ️  Info (${this.info.length}):`, 'blue');
      this.info.forEach((info) => {
        this.log(`  • ${info}`, 'blue');
      });
    }

    // Summary
    this.log('\n━'.repeat(50), 'cyan');
    if (this.errors.length === 0) {
      this.log('✅ Validation passed!', 'green');
    } else {
      this.log('❌ Validation failed!', 'red');
      this.log(`\nPlease fix ${this.errors.length} error(s) before proceeding.`, 'red');
    }
    this.log('');
  }
}

// Run validation
const validator = new EnvironmentValidator();
const success = validator.validate();

process.exit(success ? 0 : 1);
