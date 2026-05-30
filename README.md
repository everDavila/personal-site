# davila.uno — Portafolio personal

Portafolio personal y blog de [Ever Dávila](https://davila.uno).

**Stack:** Next.js 16 · TypeScript · Sanity CMS v5 · Vercel · next-intl (5 locales)  
**Repo:** `everDavila/personal-site` — deploy automático en push a `main`

---

## Setup rápido

```bash
git clone https://github.com/everDavila/personal-site.git
cd personal-site
```

Copia `.env.local` desde tu otra máquina, luego:

```bash
node setup.mjs
```

El script valida el env, instala dependencias y te dice qué correr.

---

## Variables de entorno

Archivo `.env.local` en la raíz — **nunca se commitea**.

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=n69em314
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_TOKEN=...        # solo para scripts de seed
```

---

## Comandos

```bash
npm run dev       # http://localhost:3000 (Turbopack)
npm run build     # build de producción
npm run lint      # ESLint
```

Sanity Studio: [http://localhost:3000/studio](http://localhost:3000/studio)  
Lab de micro-interacciones: [http://localhost:3000/es/lab](http://localhost:3000/es/lab) *(rama exp/microinteractions)*

---

## Sistema de modo narrativo

El sitio tiene dos modos seleccionables por el usuario, persistidos en cookie `narrative-mode`:

| | `[data-mode="dark"]` | `[data-mode="light"]` |
|---|---|---|
| Tono | Lúdico, aventurero | Profesional, directo |
| Ícono | Astronauta | Humano |
| Bg | `#0F0F0D` | `#E8E5DF` |
| Acento | `#5A7C94` azul | `#3D6E5E` verde |

### Cómo funciona (sin re-render)

`ThemeToggle` escribe `document.documentElement.dataset.mode` → CSS reacciona de inmediato:

- Textos narrativos: `.n-slot > .n-d / .n-l` con flip 3D (`rotateX 380ms`)
- Imágenes: `.mode-dark-only / .mode-light-only` (display:none instantáneo)
- Colores: `body` transition `950ms cubic-bezier(0.45, 0, 0.15, 1)` — sin destello
- Cookie: Server Action persiste para la carga inicial

### Componentes clave

| Componente | Propósito |
|---|---|
| `src/components/nav/ThemeToggle.tsx` | Pill 60×24px, burst ring, sin `router.refresh()` |
| `src/components/ui/ModeChooser.tsx` | Overlay primera visita |
| `src/components/ui/PageHeader.tsx` | `imageSet: {dark, light}` — ambas imágenes en DOM |
| `src/components/home/Hero.tsx` | Ambos headlines en DOM con `.n-slot` |
| `src/components/home/Philosophy.tsx` | Ambos textos en DOM con `.n-slot` |

### Clases CSS narrativas

```css
.n-slot          /* grid stacking — hijos en la misma celda */
.n-d             /* rotateX(0) en dark, rotateX(90deg) en light */
.n-l             /* rotateX(-90deg) en dark, rotateX(0) en light */
.mode-dark-only  /* display:none en light */
.mode-light-only /* display:none en dark */
```

---

## Estructura del proyecto

```
src/
  app/
    [locale]/          # Páginas (server components)
      lab/             # Experimentos de micro-interacciones — no indexado
    actions/setMode.ts # Server action — persiste cookie de modo
    globals.css        # Tokens de diseño + clases narrativas
  components/
    home/              # Hero, Philosophy, ExperienceSnapshot, Writing
    nav/               # Nav, ThemeToggle
    ui/                # PageHeader, ModeChooser
    blog/              # PostCard
    playground/        # PlaygroundClient
  sanity/
    schemaTypes/       # Tipos Sanity
    queries/           # GROQ + tipos TypeScript + NARRATIVE_FALLBACK
  i18n/                # Routing next-intl
  lib/                 # mode.ts, i18n.ts
messages/              # Strings i18n (es, en, pt, qu, zh)
```

---

## Tipos de contenido Sanity

| Tipo | Propósito |
|---|---|
| `siteSettings` | Singleton principal |
| `siteSettings.pageTitles` | H1 de cada página por modo (dark/light) |
| `siteSettings.pageImages` | Imagen del personaje por página y modo |
| `experience` | Historial laboral + educación |
| `post` | Blog (localizedBlockContent) |
| `project` | Proyectos de portafolio |
| `playgroundItem` | Experimentos |
| `editorialSubtitle` | Subtítulos rotativos por página |
| `page404` | 404 editable |

### Campos narrativos en siteSettings

```
hero.headline / headlineLight          titular hero
philosophy { dark, light }             sección filosofía home
about { dark, light }                  bio en /about
contactIntro { dark, light }           intro en /contact
pageTitles.{página} { dark, light }    h1 de cada página
pageImages.{página} { dark, light }    imagen del personaje
```

### Textos de fallback satíricos (modo oscuro/lúdico)

Configurados en `NARRATIVE_FALLBACK` — activos mientras Sanity esté vacío:

- Trabajo → *"Cosas que hice y que alguien pagó"*
- Apuntes → *"Apuntes que nadie pidió"*
- Experiencia → *"El currículum que RRHH ignora"*
- Sobre mí → *"El ser humano detrás del PDF"*
- Contacto → *"Escríbeme (respondo, a veces)"*
- Experimentos → *"Experimentos con sobrevivientes"*

---

## i18n

5 locales: `es` (default) · `en` · `pt` · `qu` · `zh`

- Proxy: `src/proxy.ts` (Next.js 16 — reemplaza middleware.ts)
- Fallbacks: `qu → es`, `zh → en` para blog
- `setRequestLocale(locale)` debe ir antes de cualquier función next-intl en páginas SSG

---

## Tokens de diseño

```
Tipografía
  --font-serif   Source Serif 4 weight 400  (títulos editoriales)
  --font-sans    Inter                       (cuerpo/UI)
  --font-mono    ui-monospace                (metadata, labels)

Transición modo
  background     950ms cubic-bezier(0.45, 0, 0.15, 1)
  color          600ms ease-in-out
  hover/UI       250ms ease  (--transition)

Hover
  Solo opacity: 0.65 — nunca transforms ni cambios de color
```

---

## Ramas

| Rama | Estado |
|---|---|
| `main` | Producción — auto-deploy Vercel |
| `exp/microinteractions` | Lab de transiciones (`/es/lab`) |

---

## Deploy

Push a `main` → Vercel auto-deploy (proyecto `personal-site-vk7f`, dominio `davila.uno`).
