# ⚡ Performance Testing Guide

Guía completa para implementar y ejecutar performance testing efectivo.

## 🎯 Overview

El performance testing asegura que la aplicación cumple con los requisitos de velocidad, escalabilidad y estabilidad bajo diferentes cargas de trabajo.

## 📋 Table of Contents

- [Types of Performance Testing](#types-of-performance-testing)
- [Performance Metrics](#performance-metrics)
- [Tools & Frameworks](#tools--frameworks)
- [Load Testing](#load-testing)
- [Stress Testing](#stress-testing)
- [Web Performance](#web-performance)
- [API Performance](#api-performance)
- [Database Performance](#database-performance)
- [Best Practices](#best-practices)

## 🎭 Types of Performance Testing

### Load Testing
Valida el comportamiento bajo carga esperada

```javascript
// k6 load test example
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests < 500ms
    http_req_failed: ['rate<0.01'],   // Error rate < 1%
  },
};

export default function () {
  const response = http.get('https://api.example.com/users');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

### Stress Testing
Determina el punto de quiebre del sistema

```javascript
// k6 stress test
export let options = {
  stages: [
    { duration: '2m', target: 100 },   // Normal load
    { duration: '5m', target: 200 },   // Above normal
    { duration: '2m', target: 300 },   // Breaking point
    { duration: '5m', target: 400 },   // Beyond breaking point
    { duration: '10m', target: 0 },    // Recovery
  ],
};
```

### Spike Testing
Valida comportamiento ante picos repentinos

```javascript
export let options = {
  stages: [
    { duration: '10s', target: 100 },  // Normal load
    { duration: '1m', target: 1000 },  // Sudden spike
    { duration: '3m', target: 1000 },  // Sustain spike
    { duration: '10s', target: 100 },  // Return to normal
    { duration: '3m', target: 100 },   // Recovery
  ],
};
```

### Soak Testing
Valida estabilidad durante períodos prolongados

```javascript
export let options = {
  stages: [
    { duration: '5m', target: 100 },   // Ramp up
    { duration: '8h', target: 100 },   // Sustained load
    { duration: '5m', target: 0 },     // Ramp down
  ],
};
```

## 📊 Performance Metrics

### Key Performance Indicators

```markdown
## Response Time Metrics

- **Average Response Time**: Media de todos los requests
  - Target: < 200ms
  
- **95th Percentile (p95)**: 95% de requests están por debajo
  - Target: < 500ms
  
- **99th Percentile (p99)**: 99% de requests están por debajo
  - Target: < 1000ms

## Throughput Metrics

- **Requests per Second (RPS)**: Capacidad de procesamiento
  - Target: > 1000 RPS
  
- **Concurrent Users**: Usuarios simultáneos soportados
  - Target: > 5000 users

## Error Metrics

- **Error Rate**: Porcentaje de requests fallidos
  - Target: < 0.1%
  
- **Timeout Rate**: Porcentaje de requests con timeout
  - Target: < 0.01%

## Resource Metrics

- **CPU Utilization**: Uso de CPU
  - Target: < 70% average
  
- **Memory Usage**: Uso de memoria
  - Target: < 80% capacity
  
- **Database Connections**: Pool de conexiones
  - Target: < 70% of pool size
```

## 🛠️ Tools & Frameworks

### k6 (Modern Load Testing)

**Installation:**
```bash
# macOS
brew install k6

# Linux
sudo apt-get install k6

# Windows
choco install k6
```

**Basic Test:**
```javascript
// load-test.js
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 10,        // Virtual users
  duration: '30s', // Test duration
};

export default function () {
  let res = http.get('http://localhost:3000/api/health');
  check(res, { 'status was 200': (r) => r.status == 200 });
}
```

**Run:**
```bash
k6 run load-test.js
```

### Artillery (Flexible Load Testing)

**Configuration:**
```yaml
# load-test.yml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 5
      name: "Warm up"
    - duration: 120
      arrivalRate: 20
      name: "Sustained load"
  plugins:
    metrics-by-endpoint:
      stripQueryString: true

scenarios:
  - name: "User flow"
    flow:
      - get:
          url: "/api/products"
      - post:
          url: "/api/cart"
          json:
            productId: 123
            quantity: 1
      - get:
          url: "/api/cart"
```

**Run:**
```bash
artillery run load-test.yml
```

### Lighthouse (Web Performance)

**CLI Usage:**
```bash
# Install
npm install -g lighthouse

# Run audit
lighthouse https://example.com --output html --output-path ./report.html

# CI mode
lighthouse https://example.com --preset=desktop --quiet --chrome-flags="--headless"
```

**Programmatic:**
```javascript
// lighthouse-test.js
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouse(url) {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance'],
    port: chrome.port
  };
  
  const runnerResult = await lighthouse(url, options);
  
  // Performance score
  const performanceScore = runnerResult.lhr.categories.performance.score * 100;
  console.log(`Performance score: ${performanceScore}`);
  
  // Check metrics
  const metrics = runnerResult.lhr.audits.metrics.details.items[0];
  console.log('First Contentful Paint:', metrics.firstContentfulPaint);
  console.log('Largest Contentful Paint:', metrics.largestContentfulPaint);
  console.log('Time to Interactive:', metrics.interactive);
  
  await chrome.kill();
}

runLighthouse('https://example.com');
```

## 🔥 Load Testing

### API Load Test

```javascript
// api-load-test.js
import http from 'k6/http';
import { check, group, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '3m', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '3m', target: 100 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  group('API endpoints', () => {
    // GET request
    group('List users', () => {
      const res = http.get(`${BASE_URL}/api/users`);
      check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 300ms': (r) => r.timings.duration < 300,
        'has users': (r) => JSON.parse(r.body).data.length > 0,
      });
    });
    
    // POST request
    group('Create user', () => {
      const payload = JSON.stringify({
        email: `user${__VU}@test.com`,
        name: `User ${__VU}`,
        password: 'TestPass123!',
      });
      
      const params = {
        headers: { 'Content-Type': 'application/json' },
      };
      
      const res = http.post(`${BASE_URL}/api/users`, payload, params);
      check(res, {
        'status is 201': (r) => r.status === 201,
        'user created': (r) => JSON.parse(r.body).success === true,
      });
    });
    
    // Authenticated request
    group('Get profile', () => {
      const token = 'Bearer test_token';
      const params = {
        headers: { 'Authorization': token },
      };
      
      const res = http.get(`${BASE_URL}/api/profile`, params);
      check(res, {
        'authenticated': (r) => r.status !== 401,
      });
    });
  });
  
  sleep(1);
}
```

### Database Load Test

```javascript
// db-load-test.js
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  scenarios: {
    reads: {
      executor: 'constant-vus',
      vus: 50,
      duration: '5m',
      exec: 'readScenario',
    },
    writes: {
      executor: 'constant-vus',
      vus: 10,
      duration: '5m',
      exec: 'writeScenario',
    },
  },
  thresholds: {
    'http_req_duration{scenario:reads}': ['p(95)<100'],
    'http_req_duration{scenario:writes}': ['p(95)<500'],
  },
};

export function readScenario() {
  const res = http.get('http://localhost:3000/api/products');
  check(res, { 'read success': (r) => r.status === 200 });
}

export function writeScenario() {
  const payload = JSON.stringify({
    name: `Product ${Date.now()}`,
    price: Math.random() * 100,
  });
  
  const res = http.post(
    'http://localhost:3000/api/products',
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );
  
  check(res, { 'write success': (r) => r.status === 201 });
}
```

## 💥 Stress Testing

### Find Breaking Point

```javascript
// stress-test.js
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },   // Normal load
    { duration: '5m', target: 200 },   // Push it
    { duration: '2m', target: 300 },   // Push harder
    { duration: '5m', target: 400 },   // Beyond limits
    { duration: '2m', target: 500 },   // Breaking point
    { duration: '10m', target: 0 },    // Recovery
  ],
  thresholds: {
    http_req_failed: ['rate<0.1'],     // Allow higher error rate
    http_req_duration: ['p(95)<2000'], // More lenient timing
  },
};

export default function () {
  const res = http.get('http://localhost:3000/api/products');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'not too slow': (r) => r.timings.duration < 2000,
  });
  
  // Log when errors start
  if (res.status !== 200) {
    console.log(`Error at ${__VU} VUs: ${res.status}`);
  }
}
```

## 🌐 Web Performance

### Core Web Vitals

```javascript
// web-vitals-test.js
import { chromium } from 'playwright';

async function measureWebVitals(url) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Inject web-vitals library
  await page.addInitScript(() => {
    window.webVitals = [];
  });
  
  await page.goto(url);
  
  // Measure Core Web Vitals
  const metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      import('https://unpkg.com/web-vitals@3/dist/web-vitals.js')
        .then(({ onCLS, onFID, onLCP }) => {
          const vitals = {};
          
          onCLS((metric) => { vitals.cls = metric.value; });
          onFID((metric) => { vitals.fid = metric.value; });
          onLCP((metric) => { vitals.lcp = metric.value; });
          
          setTimeout(() => resolve(vitals), 5000);
        });
    });
  });
  
  console.log('Core Web Vitals:');
  console.log(`  LCP: ${metrics.lcp}ms (Target: <2500ms)`);
  console.log(`  FID: ${metrics.fid}ms (Target: <100ms)`);
  console.log(`  CLS: ${metrics.cls} (Target: <0.1)`);
  
  await browser.close();
  
  return metrics;
}

measureWebVitals('https://example.com');
```

### Lighthouse CI

```yaml
# lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', {minScore: 0.9}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'categories:best-practices': ['error', {minScore: 0.9}],
        'categories:seo': ['error', {minScore: 0.9}],
        
        // Custom assertions
        'first-contentful-paint': ['error', {maxNumericValue: 2000}],
        'largest-contentful-paint': ['error', {maxNumericValue: 2500}],
        'cumulative-layout-shift': ['error', {maxNumericValue: 0.1}],
        'total-blocking-time': ['error', {maxNumericValue: 300}],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

## 🔌 API Performance

### Response Time Testing

```javascript
// api-performance.test.js
import request from 'supertest';
import app from '../src/app';

describe('API Performance', () => {
  const RESPONSE_TIME_THRESHOLD = 200; // ms
  
  it('GET /api/users should respond within threshold', async () => {
    const start = Date.now();
    
    const response = await request(app)
      .get('/api/users')
      .expect(200);
    
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(RESPONSE_TIME_THRESHOLD);
    expect(response.body.data).toBeInstanceOf(Array);
  });
  
  it('POST /api/users should respond within threshold', async () => {
    const start = Date.now();
    
    await request(app)
      .post('/api/users')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!',
      })
      .expect(201);
    
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(500); // Write operations allowed more time
  });
  
  it('should handle concurrent requests efficiently', async () => {
    const concurrentRequests = 50;
    const start = Date.now();
    
    const promises = Array.from({ length: concurrentRequests }, () =>
      request(app).get('/api/products')
    );
    
    await Promise.all(promises);
    
    const duration = Date.now() - start;
    const avgTime = duration / concurrentRequests;
    
    expect(avgTime).toBeLessThan(RESPONSE_TIME_THRESHOLD);
  });
});
```

## 🗄️ Database Performance

### Query Performance Testing

```javascript
// db-performance.test.js
import { performance } from 'perf_hooks';
import { userRepository } from '../src/repositories/user';

describe('Database Performance', () => {
  it('should query users efficiently', async () => {
    const start = performance.now();
    
    const users = await userRepository.findAll();
    
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(50); // 50ms threshold
    expect(users.length).toBeGreaterThan(0);
  });
  
  it('should use indexes for search', async () => {
    const start = performance.now();
    
    const user = await userRepository.findByEmail('test@example.com');
    
    const duration = performance.now() - start;
    
    // Indexed search should be very fast
    expect(duration).toBeLessThan(10);
  });
  
  it('should handle pagination efficiently', async () => {
    const start = performance.now();
    
    const result = await userRepository.paginate({
      page: 10,
      limit: 50,
    });
    
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(100);
    expect(result.data.length).toBeLessThanOrEqual(50);
  });
});
```

## 📋 Best Practices

### Performance Testing Checklist

```markdown
## Pre-Test Preparation
- [ ] Define performance requirements
- [ ] Identify critical user journeys
- [ ] Prepare test data
- [ ] Setup monitoring tools
- [ ] Establish baseline metrics
- [ ] Configure test environment

## During Testing
- [ ] Start with small load
- [ ] Gradually increase load
- [ ] Monitor system resources
- [ ] Log errors and anomalies
- [ ] Capture performance metrics
- [ ] Record breaking points

## Post-Test Analysis
- [ ] Analyze response times
- [ ] Review error rates
- [ ] Identify bottlenecks
- [ ] Compare against baseline
- [ ] Document findings
- [ ] Create optimization plan
```

### Common Bottlenecks

```markdown
## Application Layer
- [ ] N+1 query problems
- [ ] Missing caching
- [ ] Inefficient algorithms
- [ ] Memory leaks
- [ ] Blocking operations
- [ ] Large payload sizes

## Database Layer
- [ ] Missing indexes
- [ ] Slow queries
- [ ] Connection pool exhaustion
- [ ] Lock contention
- [ ] Inefficient joins
- [ ] Large table scans

## Infrastructure Layer
- [ ] Insufficient CPU/Memory
- [ ] Network latency
- [ ] Disk I/O bottleneck
- [ ] CDN misconfiguration
- [ ] Load balancer issues
- [ ] Auto-scaling delays
```

## 📚 Resources

- [k6 Documentation](https://k6.io/docs/)
- [Artillery Documentation](https://artillery.io/docs/)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)

---

_Performance Testing - Asegurando velocidad y escalabilidad_ ⚡
