# 🔍 Guía de SEO Básico para React

## Introducción

Esta guía cubre las mejores prácticas de SEO para aplicaciones React, incluyendo técnicas para SPAs, SSR con Next.js, y optimizaciones generales para mejorar el posicionamiento en motores de búsqueda.

## Desafíos de SEO en SPAs React

### Problemas Comunes

1. **JavaScript Rendering**: Crawlers pueden no ejecutar JS correctamente
2. **Meta Tags Dinámicos**: Difícil cambiar meta tags por ruta
3. **Tiempo de Carga Inicial**: Bundle grande puede afectar performance
4. **Content Flash**: Contenido carga después de JS
5. **Links Internos**: Cliente-side routing puede no ser rastreado correctamente

### Soluciones

- ✅ Server-Side Rendering (SSR) con Next.js
- ✅ Static Site Generation (SSG)
- ✅ Pre-rendering para SPAs
- ✅ Optimización de performance
- ✅ Meta tags management

## Meta Tags Esenciales

### 1. Title y Description

```tsx
// components/SEO.tsx
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
}

export function SEO({ title, description, canonical }: SEOProps) {
  const siteUrl = 'https://yoursite.com';
  const fullCanonical = canonical || window.location.href;
  
  return (
    <Helmet>
      {/* Title */}
      <title>{title}</title>
      
      {/* Meta Description */}
      <meta name="description" content={description} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonical} />
    </Helmet>
  );
}

// Uso:
<SEO
  title="Mi Página - Sitio Web"
  description="Una descripción convincente de 150-160 caracteres que anime a hacer clic"
  canonical="https://yoursite.com/page"
/>
```

**Mejores Prácticas:**
- ✅ Title: 50-60 caracteres
- ✅ Description: 150-160 caracteres
- ✅ Incluir keywords relevantes naturalmente
- ✅ Único por página
- ✅ Call-to-action en description

### 2. Open Graph (Facebook, LinkedIn)

```tsx
export function SEO({
  title,
  description,
  image = '/default-og-image.jpg',
  type = 'website',
}: SEOProps) {
  const siteUrl = 'https://yoursite.com';
  const fullImageUrl = image.startsWith('http')
    ? image
    : `${siteUrl}${image}`;
  
  return (
    <Helmet>
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:site_name" content="Your Site Name" />
      
      {/* Image dimensions (recommended) */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    </Helmet>
  );
}
```

**Dimensiones Recomendadas:**
- OG Image: 1200 x 630 px
- Formato: JPG o PNG
- Tamaño: < 5 MB

### 3. Twitter Cards

```tsx
<Helmet>
  {/* Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@yourusername" />
  <meta name="twitter:creator" content="@yourusername" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={fullImageUrl} />
</Helmet>
```

### 4. Metadata Adicional

```tsx
<Helmet>
  {/* Robots */}
  <meta name="robots" content="index, follow" />
  
  {/* Language */}
  <html lang="es" />
  
  {/* Author */}
  <meta name="author" content="Your Name" />
  
  {/* Keywords (menos importante ahora) */}
  <meta name="keywords" content="react, seo, web development" />
  
  {/* Viewport */}
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</Helmet>
```

## Structured Data (Schema.org)

### JSON-LD para Rich Snippets

```tsx
// components/StructuredData.tsx
export function ArticleStructuredData({
  title,
  description,
  image,
  author,
  publishedDate,
  modifiedDate,
}: ArticleSchema) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": image,
    "author": {
      "@type": "Person",
      "name": author,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Your Site Name",
      "logo": {
        "@type": "ImageObject",
        "url": "https://yoursite.com/logo.png"
      }
    },
    "datePublished": publishedDate,
    "dateModified": modifiedDate,
  };
  
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
```

### Tipos Comunes de Schema

#### Breadcrumb List

```tsx
export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
  
  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
}
```

#### Organization

```tsx
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company",
  "url": "https://yoursite.com",
  "logo": "https://yoursite.com/logo.png",
  "sameAs": [
    "https://www.facebook.com/yourpage",
    "https://www.twitter.com/yourhandle",
    "https://www.linkedin.com/company/yourcompany"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-555-5555",
    "contactType": "Customer Service"
  }
};
```

#### Product (E-commerce)

```tsx
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "image": "https://yoursite.com/product.jpg",
  "description": "Product description",
  "brand": {
    "@type": "Brand",
    "name": "Brand Name"
  },
  "offers": {
    "@type": "Offer",
    "price": "29.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://yoursite.com/product"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "127"
  }
};
```

## Server-Side Rendering (Next.js)

### App Router (Next.js 13+)

#### Metadata API

```tsx
// app/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home - Your Site',
  description: 'Welcome to our site',
  openGraph: {
    title: 'Home - Your Site',
    description: 'Welcome to our site',
    images: ['/og-image.jpg'],
  },
};

export default function HomePage() {
  return <div>Home Page</div>;
}
```

#### Dynamic Metadata

```tsx
// app/blog/[slug]/page.tsx
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const post = await fetchPost(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: 'article',
      publishedTime: post.publishedDate,
      authors: [post.author],
    },
  };
}

export default async function BlogPost({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const post = await fetchPost(params.slug);
  return <article>{/* Post content */}</article>;
}
```

### Pages Router (Next.js 12 y anteriores)

```tsx
// pages/index.tsx
import Head from 'next/head';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Home - Your Site</title>
        <meta name="description" content="Welcome to our site" />
        <meta property="og:title" content="Home - Your Site" />
        <meta property="og:description" content="Welcome to our site" />
        <meta property="og:image" content="/og-image.jpg" />
      </Head>
      
      <main>{/* Content */}</main>
    </>
  );
}
```

### Static Site Generation (SSG)

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetchAllPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const post = await fetchPost(params.slug);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

## Pre-rendering para SPAs

### react-snap

```bash
npm install --save-dev react-snap
```

```json
// package.json
{
  "scripts": {
    "build": "react-scripts build",
    "postbuild": "react-snap"
  },
  "reactSnap": {
    "include": [
      "/",
      "/about",
      "/blog"
    ],
    "minifyHtml": {
      "collapseWhitespace": true,
      "removeComments": true
    }
  }
}
```

### react-helmet-async Setup

```tsx
// index.tsx
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
  document.getElementById('root')
);
```

## Optimización de URLs

### 1. URLs Amigables

```tsx
// ❌ Mal
/article?id=123

// ✅ Bien
/blog/como-optimizar-react-para-seo
```

### 2. React Router para SEO

```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 3. Canonical URLs

```tsx
// En cada página
<Helmet>
  <link rel="canonical" href="https://yoursite.com/current-page" />
</Helmet>
```

## Sitemap y Robots.txt

### Sitemap.xml (Next.js)

```tsx
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchAllPosts();
  
  const blogUrls = posts.map((post) => ({
    url: `https://yoursite.com/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  return [
    {
      url: 'https://yoursite.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://yoursite.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...blogUrls,
  ];
}
```

### Robots.txt (Next.js)

```tsx
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://yoursite.com/sitemap.xml',
  };
}
```

### Robots.txt (SPA)

```txt
# public/robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://yoursite.com/sitemap.xml
```

## Performance y Core Web Vitals

### 1. Largest Contentful Paint (LCP)

**Objetivo**: < 2.5s

```tsx
// Optimización de imágenes
<img
  src="/hero-image.jpg"
  alt="Hero"
  loading="eager"  // Para above-the-fold
  fetchpriority="high"
  width={1200}
  height={600}
/>

// Next.js Image optimization
import Image from 'next/image';

<Image
  src="/hero-image.jpg"
  alt="Hero"
  priority
  width={1200}
  height={600}
/>
```

### 2. First Input Delay (FID) / Interaction to Next Paint (INP)

**Objetivo**: FID < 100ms, INP < 200ms

```tsx
// Code splitting
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 3. Cumulative Layout Shift (CLS)

**Objetivo**: < 0.1

```tsx
// Especificar dimensiones de imágenes
<img
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
/>

// Reservar espacio para contenido dinámico
<div className="min-h-[300px]">
  {loading ? <Skeleton /> : <Content />}
</div>
```

## Internal Linking

### Breadcrumbs

```tsx
function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex gap-2">
        {items.map((item, index) => (
          <li key={item.url}>
            {index > 0 && <span>/</span>}
            {index === items.length - 1 ? (
              <span aria-current="page">{item.name}</span>
            ) : (
              <Link to={item.url}>{item.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Uso:
<Breadcrumb
  items={[
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: 'Current Post', url: '/blog/current-post' },
  ]}
/>
```

### Related Content

```tsx
function RelatedPosts({ posts }: { posts: Post[] }) {
  return (
    <section>
      <h2>Related Articles</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

## Contenido y HTML Semántico

### 1. Headings Jerárquicos

```tsx
// ✅ Correcto
<article>
  <h1>Título Principal del Artículo</h1>
  <section>
    <h2>Sección 1</h2>
    <h3>Subsección 1.1</h3>
  </section>
  <section>
    <h2>Sección 2</h2>
  </section>
</article>
```

### 2. Semantic HTML

```tsx
function BlogPost() {
  return (
    <article>
      <header>
        <h1>Post Title</h1>
        <time dateTime="2024-01-01">January 1, 2024</time>
      </header>
      
      <section>
        <h2>Introduction</h2>
        <p>Content...</p>
      </section>
      
      <section>
        <h2>Main Content</h2>
        <p>More content...</p>
      </section>
      
      <footer>
        <p>Author: John Doe</p>
      </footer>
    </article>
  );
}
```

## Mobile Optimization

### 1. Responsive Design

```tsx
// Tailwind CSS responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

### 2. Mobile-First Approach

```css
/* Mobile first */
.container {
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
  }
}
```

## Herramientas de Testing

### Google Tools

1. **Google Search Console**
   - Monitorear indexación
   - Ver queries de búsqueda
   - Identificar errores

2. **PageSpeed Insights**
   - Core Web Vitals
   - Performance suggestions

3. **Mobile-Friendly Test**
   - Verificar compatibilidad móvil

### Lighthouse

```bash
# CLI
npm install -g lighthouse

lighthouse https://yoursite.com --view
```

```tsx
// En componente (desarrollo)
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('web-vitals').then(({ getCLS, getFID, getLCP }) => {
        getCLS(console.log);
        getFID(console.log);
        getLCP(console.log);
      });
    }
  }, []);
  
  return <div>App</div>;
}
```

## SEO Checklist

### Técnico
- [ ] Sitemap.xml generado y submitted
- [ ] Robots.txt configurado
- [ ] Canonical URLs en todas las páginas
- [ ] URLs amigables (no parámetros)
- [ ] HTTPS habilitado
- [ ] 404 page personalizada
- [ ] Redirects 301 para páginas movidas

### Meta Tags
- [ ] Title único por página (50-60 chars)
- [ ] Description única por página (150-160 chars)
- [ ] Open Graph tags completos
- [ ] Twitter Card tags
- [ ] Alt text en todas las imágenes

### Contenido
- [ ] Un H1 por página
- [ ] Headings jerárquicos
- [ ] HTML semántico
- [ ] Internal linking
- [ ] Contenido único y valioso
- [ ] Keywords naturales

### Performance
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Lighthouse score > 90
- [ ] Mobile-friendly
- [ ] Page load < 3s

### Schema Markup
- [ ] Organization schema
- [ ] Breadcrumb schema
- [ ] Article schema (para blog)
- [ ] Product schema (para e-commerce)

## Recursos

### Herramientas
- [Google Search Console](https://search.google.com/search-console)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Schema Markup Validator](https://validator.schema.org/)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

### Documentación
- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org Documentation](https://schema.org/)
- [Next.js SEO](https://nextjs.org/learn/seo/introduction-to-seo)

### Monitoreo
- [Google Analytics](https://analytics.google.com/)
- [Google Search Console](https://search.google.com/search-console)
- [Ahrefs](https://ahrefs.com/) (paid)
- [SEMrush](https://www.semrush.com/) (paid)

---

**Última actualización**: 2024

_SEO es un proceso continuo. Monitorea regularmente y ajusta según métricas y cambios en algoritmos._
