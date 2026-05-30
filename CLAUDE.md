@AGENTS.md

---

# Contexto del proyecto — davila.uno

## Quién soy

**Ever Dávila** — UX/UI Analyst y especialista en plataformas digitales, Lima, Perú. Email: ever@davila.uno

- 10+ años en UX/UI para entidades públicas y privadas peruanas
- Actualmente: Analista de Prototipos UX/UI en MEF (Ministerio de Economía y Finanzas)
- Background: CEPLAN, Programa Justicia Penal, Ministerio de Educación, Ministerio del Interior
- Idiomas: español (nativo), inglés (avanzado), portugués (avanzado), chino (básico), quechua (básico)
- Nivel de desarrollo: intermedio en React/Next.js — aprendiendo mientras construimos
- Estilo de trabajo: vibe coding iterativo con Claude. Prefiere acción directa sobre preguntas. Si algo necesita decisión sí/no, procede.

---

## Stack técnico

- **Framework:** Next.js 16.2.6 — App Router, Turbopack, TypeScript
- **CMS:** Sanity v5 — studio en `/studio`, dataset `production`
- **Deploy:** Vercel — proyecto `personal-site-vk7f`, dominio `davila.uno`
- **i18n:** next-intl 4.12 — 5 locales: `es` (default), `en`, `pt`, `qu`, `zh`
- **Styling:** CSS custom properties + inline styles. Tailwind instalado pero NO usar clases Tailwind en producción
- **Repo:** `d:\reposGIT\personalPage` (Windows) / `~/reposGIT/personalPage` (Linux). GitHub: `everDavila/personal-site`

### Env vars (.env.local — NUNCA commitear)
```
NEXT_PUBLIC_SANITY_PROJECT_ID=n69em314
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_TOKEN=...   ← solo para scripts de seed, nunca en producción
```

---

## Convenciones críticas

- `export const dynamic = 'force-dynamic'` en todas las páginas principales
- `setRequestLocale(locale)` **debe llamarse antes de cualquier función next-intl** en páginas con `generateStaticParams`. También en el `[locale]/layout.tsx` antes de `getMessages()`.
- Pages con `generateStaticParams` deben recibir `locale` de `params`, no de `getLocale()`.
- GROQ: `asset->{ url }` con `?.` en todo acceso a image assets: `post.mainImage?.asset?.url`
- Si Turbopack se corrompe: `taskkill /F /IM node.exe` (Windows) / `killall node` (Linux), borrar `.next`, reiniciar `npm run dev`
- Vercel deploy: `git push origin main` — auto-deploy

---

## Sistema de diseño

### Filosofía editorial
Referencias validadas: **Linear 40% / iA 25% / Paco Coursey 20% / Rauno Freiberg 15%**

Objetivo: sitio que parece una **persona real**, no un portfolio de recruiter. Sofisticación visual sin exceso.

### Reglas absolutas
- **Hover:** solo `opacity: 0.65`, nunca transforms, escalas ni cambios de color
- **Tipografía lidera el layout** — jerarquía por tamaño/peso, no por color
- **Metadata** (fechas, tiempos, labels): monospace, dim, pequeño — consistente en todo el sitio
- **No:** glow futurista, gradients llamativos, startup aesthetic, "creative developer Twitter"
- **Blog/articles:** entorno de lectura max `~64ch`, sin chrome alrededor

### Modo narrativo (implementado mayo 2026)
El sitio tiene dos modos seleccionables por el usuario via cookie `narrative-mode`:

| Atributo | `[data-mode="dark"]` | `[data-mode="light"]` |
|---|---|---|
| Tono | Profesional, directo, técnico | Lúdico, personal, curioso |
| Visual | `#0F0F0D` bg, texto claro | `#F5F4F0` bg, texto oscuro |
| Acento | `#5A7C94` (azul) | `#3D6E5E` (verde) |
| Tracking hero | `-0.03em` | `-0.015em` |

El modo se gestiona con:
- `src/lib/mode.ts` — `getMode()` server utility (React cache + cookies)
- `src/app/actions/setMode.ts` — server action para persistir cookie
- `src/components/ui/ModeChooser.tsx` — overlay primera visita
- `src/components/nav/ThemeToggle.tsx` — toggle en nav (○ oscuro / astronauta SVG claro)

### Tipografía
- Serif: Source Serif 4 weight 400, `var(--font-serif)` — títulos editoriales
- Sans: Inter, `var(--font-sans)` — cuerpo/UI
- Mono: ui-monospace — metadata, labels técnicos
- Acento modo oscuro: `#5A7C94` / hover `#8FD3FF`
- Acento modo claro: `#3D6E5E` / hover `#1E4D3C`

---

## Arquitectura de componentes

### Páginas (`src/app/[locale]/`)
Todas usan `PageHeader` de `src/components/ui/PageHeader.tsx` para el slot de imagen del personaje.

- `page.tsx` — Home: Hero + SelectedWork + Philosophy + ExperienceSnapshot + Writing
- `blog/page.tsx` — Lista editorial: post destacado (sin imagen, solo tipografía) + lista compacta
- `blog/[slug]/page.tsx` — Artículo con prev/next navigation
- `work/page.tsx`, `work/[slug]/page.tsx`
- `about/page.tsx`, `experience/page.tsx`, `contact/page.tsx`, `playground/page.tsx`

### Componentes clave
- `src/components/ui/PageHeader.tsx` — grid dos columnas cuando hay imagen, single column sin imagen
- `src/components/ui/ModeChooser.tsx` — overlay primera visita para elegir modo
- `src/components/blog/PostCard.tsx` — featured (sin cover image) + compact variant
- `src/components/nav/ThemeToggle.tsx` — toggle modo narrativo (○ / astronauta SVG flotante)
- `src/components/home/Hero.tsx` — recibe `mode` prop, selecciona headline por modo

---

## Sanity CMS

### Tipos de contenido
- `post` — artículos del blog (localizedBlockContent)
- `project` — proyectos de trabajo
- `playgroundItem` — experimentos
- `experience` — singleton (workExperience + education arrays)
- `siteSettings` — singleton (ver campos abajo)
- `author` — singleton
- `editorialSubtitle` — subtítulos rotativos por página (hora + estación Lima)
- `page404` — singleton editorial
- `category` — categorías blog

### siteSettings — campos importantes
```
hero:
  headline / headlineLight    ← narrativa por modo
  sub / subLight              ← narrativa por modo
  heroImage / heroImageLight  ← imagen hero por modo

philosophy: narrativeModesText { dark, light }  ← texto sección filosofía home
about:       narrativeModesText { dark, light }  ← bio en /about
contactIntro: narrativeModesText { dark, light } ← intro en /contact

pageImages:                                      ← imagen del personaje por página
  work / about / contact / experience / playground / blog
  cada uno: { dark: image, light: image }
  INDEPENDIENTES — dejar vacío = no muestra imagen en ese modo

labels: { nav, home, work, playground, about, experience, contact, blog }
competencies[], funFacts[], social, cvUrl, footerText
```

### Helpers clave (`src/sanity/queries/siteSettings.ts`)
- `lbl(ls, locale, fallback)` — resuelve localizedString con fallback JSON
- `narrativeText(modes, mode, locale, fallback?)` — resuelve NarrativeModes con fallback LocalizedString
- `pageImage(set, mode)` — URL de imagen para el modo actual (sin fallback cruzado)
- `NARRATIVE_FALLBACK` — texto demo en es/en para cuando Sanity no tiene contenido

---

## i18n

- Routing: `src/i18n/routing.ts` con pathnames localizados
- Proxy: `src/proxy.ts` (Next.js 16: reemplaza middleware.ts)
- `localized()` en `src/lib/i18n.ts` — fallback chain: locale → originalLanguage → any → ''
- `BLOG_FALLBACK`: qu→es, zh→en
- Pages con next-intl en SSG: siempre `setRequestLocale(locale)` antes de `getTranslations()`

---

## Personaje / astronauta

El sitio tiene un personaje (astronauta) que aparece en modo claro en las cabeceras de página.
- Cada página tiene su propia imagen del personaje en distintas situaciones
- Se gestiona desde Sanity: `siteSettings.pageImages.[page].light`
- El modo oscuro puede tener su propia imagen o ninguna — son independientes
- CSS utility: `.mode-dark-only` / `.mode-light-only` para mostrar/ocultar por modo
- Toggle en nav: `○` (oscuro) / SVG astronauta flotante (claro) con animación CSS `astronaut-float`

---

## Estado actual (2026-05-30)

**Funcionando en producción:**
- Sistema de modo narrativo completo (dark/light, cookie, ModeChooser, ThemeToggle)
- PageHeader con slot de imagen del personaje en todas las páginas
- Blog: lista limpia sin imagen en post destacado + navegación prev/next en artículos
- OG images generadas automáticamente via `/api/og` (edge runtime)
- Metadatos sociales en post pages (generateMetadata)
- 5 locales completos + editorial subtitle system
- i18n SSG fix: setRequestLocale en layout + pages

**Próximos pasos posibles:**
- Subir imágenes del personaje astronauta a Sanity (por página, por modo)
- Hero image para modo claro (heroImageLight en siteSettings.hero)
- Agregar ModeToggle también en mobile menu si se desea
