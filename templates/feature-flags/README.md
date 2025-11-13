# 🎭 Feature Flags System

Feature flags (also known as feature toggles) allow you to enable or disable features without deploying new code. This enables safer deployments, gradual rollouts, A/B testing, and quick rollbacks.

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Feature Flag Types](#feature-flag-types)
- [Implementation Patterns](#implementation-patterns)
- [Environment Configuration](#environment-configuration)
- [Best Practices](#best-practices)
- [Advanced Usage](#advanced-usage)

## Overview

### Why Use Feature Flags?

1. **Gradual Rollouts**: Deploy to a percentage of users first
2. **A/B Testing**: Test multiple variations of a feature
3. **Kill Switches**: Quickly disable problematic features
4. **Trunk-Based Development**: Merge code before it's ready for users
5. **Environment Control**: Different features in dev vs production
6. **User Segmentation**: Enable features for specific user groups

## Quick Start

### 1. Define Feature Flags in Environment

```bash
# .env
FEATURE_NEW_UI=true
FEATURE_BETA_FEATURES=false
FEATURE_EXPERIMENTAL=false
FEATURE_PAYMENT_V2=false
FEATURE_ANALYTICS=true
```

### 2. Basic Usage (Backend)

```typescript
// config/features.ts
export const features = {
  newUI: process.env.FEATURE_NEW_UI === 'true',
  betaFeatures: process.env.FEATURE_BETA_FEATURES === 'true',
  experimental: process.env.FEATURE_EXPERIMENTAL === 'true',
  paymentV2: process.env.FEATURE_PAYMENT_V2 === 'true',
  analytics: process.env.FEATURE_ANALYTICS === 'true',
};

// Usage in code
import { features } from './config/features';

if (features.newUI) {
  // Use new UI components
} else {
  // Use old UI components
}
```

### 3. Basic Usage (Frontend)

```typescript
// config/features.ts
export const features = {
  newUI: import.meta.env.VITE_FEATURE_NEW_UI === 'true',
  betaFeatures: import.meta.env.VITE_FEATURE_BETA_FEATURES === 'true',
};

// React component
import { features } from './config/features';

function Dashboard() {
  return (
    <>
      {features.newUI ? (
        <NewDashboard />
      ) : (
        <LegacyDashboard />
      )}
    </>
  );
}
```

## Feature Flag Types

### 1. Release Toggles

**Purpose**: Control unreleased features  
**Lifetime**: Short-term (days to weeks)  
**Scope**: All users

```bash
# Enable new feature in staging, disabled in production
FEATURE_NEW_CHECKOUT=true  # staging
FEATURE_NEW_CHECKOUT=false  # production
```

### 2. Experiment Toggles (A/B Testing)

**Purpose**: A/B testing and experiments  
**Lifetime**: Medium-term (weeks to months)  
**Scope**: Percentage of users

```bash
FEATURE_EXPERIMENT_NEW_ALGORITHM=true
EXPERIMENT_NEW_ALGORITHM_PERCENTAGE=10  # 10% of users
```

### 3. Ops Toggles (Circuit Breakers)

**Purpose**: Control operational aspects  
**Lifetime**: Long-term  
**Scope**: System-wide

```bash
# Can be changed at runtime to handle load
FEATURE_CACHE_ENABLED=true
FEATURE_RATE_LIMITING=true
FEATURE_EXTERNAL_API_ENABLED=true
```

### 4. Permission Toggles

**Purpose**: Premium features or user-specific access  
**Lifetime**: Permanent  
**Scope**: User-based

```bash
FEATURE_PREMIUM_ANALYTICS=true
FEATURE_API_ACCESS=true
FEATURE_ADMIN_PANEL=true
```

## Implementation Patterns

### Pattern 1: Simple Environment-Based

**Best for**: Static flags that change per environment

```typescript
// config/features.ts
export const features = {
  newUI: process.env.FEATURE_NEW_UI === 'true',
  betaMode: process.env.FEATURE_BETA === 'true',
};
```

**Pros**: Simple, fast, no external dependencies  
**Cons**: Requires deployment to change, no granular control

### Pattern 2: Database-Driven

**Best for**: Dynamic flags that need runtime changes

```typescript
class FeatureFlagService {
  async isEnabled(flagName: string, userId?: string): Promise<boolean> {
    const flag = await this.db.findOne({ name: flagName });
    
    if (!flag || !flag.enabled) return false;
    
    // Check rollout percentage
    if (userId && flag.rolloutPercentage < 100) {
      return this.isInRollout(userId, flag.rolloutPercentage);
    }
    
    return true;
  }
}
```

**Pros**: Change at runtime, gradual rollouts  
**Cons**: Database dependency, more complex

## Environment Configuration

### Development Environment

```bash
# Enable all features for testing
FEATURE_NEW_UI=true
FEATURE_BETA_FEATURES=true
FEATURE_EXPERIMENTAL=true
FEATURE_ANALYTICS=false
```

### Production Environment

```bash
# Conservative - only stable features
FEATURE_NEW_UI=false
FEATURE_BETA_FEATURES=false
FEATURE_EXPERIMENTAL=false
FEATURE_ANALYTICS=true
```

## Best Practices

### 1. Naming Conventions

```bash
# Good - Clear, descriptive names
FEATURE_NEW_CHECKOUT_FLOW=true
FEATURE_ENABLE_DARK_MODE=true
FEATURE_PAYMENT_V2=true

# Bad - Vague names
FEATURE_NEW=true
FEATURE_TEST=true
```

### 2. Default to Safe State

```typescript
// Always default to false/safe state
const features = {
  experimentalAPI: process.env.FEATURE_EXPERIMENTAL_API === 'true',
};
```

### 3. Clean Up Old Flags

```typescript
// Mark flags with creation date and owner
const features = {
  // TODO: Remove after 2025-12-01 - @john
  oldCheckout: process.env.FEATURE_OLD_CHECKOUT === 'true',
};
```

### 4. Type Safety

```typescript
type FeatureFlags = {
  newUI: boolean;
  betaFeatures: boolean;
  experimental: boolean;
};

const features: FeatureFlags = {
  newUI: process.env.FEATURE_NEW_UI === 'true',
  betaFeatures: process.env.FEATURE_BETA_FEATURES === 'true',
  experimental: process.env.FEATURE_EXPERIMENTAL === 'true',
};
```

## Advanced Usage

### Percentage Rollouts

```typescript
class FeatureFlagService {
  isInRollout(userId: string, percentage: number): boolean {
    const hash = this.consistentHash(userId);
    return (hash % 100) < percentage;
  }
  
  private consistentHash(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = ((hash << 5) - hash) + input.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}
```

### User Targeting

```typescript
function isFeatureEnabled(flag: string, context: FeatureContext): boolean {
  const config = featureConfigs[flag];
  
  // Check role-based access
  if (config.allowedRoles?.length > 0) {
    if (!context.roles.some(r => config.allowedRoles.includes(r))) {
      return false;
    }
  }
  
  return true;
}
```

## 📊 Feature Flag Lifecycle

```
1. Creation
   ↓
2. Development (all environments enabled)
   ↓
3. Staging (QA testing)
   ↓
4. Production (0% rollout)
   ↓
5. Gradual Rollout (10% → 50% → 100%)
   ↓
6. Full Release (flag becomes default)
   ↓
7. Cleanup (remove flag code)
```

## 🔗 Related Documentation

- [Environment Configuration](../environments/README.md)
- [Deployment Strategies](../../docs/cicd/deployment-strategies.md)

---

**Last Updated**: 2025-11-13  
**Maintained By**: Engineering Team
