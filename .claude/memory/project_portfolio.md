---
name: project-portfolio
description: "Portafolio personal davila.uno — stack, arquitectura, estado actual y convenciones (actualizado 2026-06-03)"
metadata: 
  node_type: memory
  type: project
  originSessionId: b2539090-46ae-44ab-954c-8cd5ec511fa8
---

Portafolio personal con blog en davila.uno. Commits directos a `main`.
Repo: `d:\reposGIT\personalPage` (Windows). GitHub: `everDavila/personal-site`.

**Stack:** Next.js 16.2.6 (App Router, Turbopack) + TypeScript + Sanity v5 + Vercel  
**Styling:** CSS custom properties + inline styles. NO Tailwind en producción.  
**i18n:** next-intl 4.12, 5 locales (es default, en, pt, qu, zh). Solo ES/EN visibles en el switcher.

**Why:** El dominio `davila.uno` todavía apunta a WordPress. El sitio Next.js vive en `personal-site-vk7f.vercel.app`. Sanity Studio en `/studio` de esa URL.

---

## Sistema de modo narrativo

Dos modos via cookie `narrative-mode`, persistido como `data-mode` en `<html>`:

| | `dark` | `light` |
|---|---|---|
| Tono | Lúdico / astronauta | Profesional / humano |
| Bg | `#0F0F0D` | `#E8E5DF` |
| Acento | `#5A7C94` | `#3D6E5E` |

**ModeChooser** (overlay primera visita):
- Movido del root layout al `[locale]/layout.tsx` — tiene acceso al locale
- Textos en ES/EN vía `messages/modeChooser` (question, darkLabel/darkDesc, lightLabel/lightDesc, footer)
- ES: Orbital / Tierra | EN: Orbital / Earth
- Fade-out 700ms al elegir modo (`leaving` state → opacity: 0 → `onTransitionEnd` → setVisible false)

---

## Diseño — estado actual (2026-06-03)

**Tokens actualizados:**
```
--max-width:        82rem  (antes 64rem — más editorial)
--spacing-section:  clamp(8rem, 18vw, 14rem)  (entre secciones home)
--transition:       350ms ease  (antes 250ms — más deliberado)
```

**Clases layout:**
- `.section` — páginas home (spacing completo)
- `.section-inner` — secciones dentro de home: `clamp(5rem, 10vw, 8rem)`
- `.section-page` — páginas internas: top `clamp(6rem, 13vw, 10rem)`, bottom normal

**PageHeader:**
- `.page-header-grid` → `align-items: start` (imagen alineada arriba con el título)
- `.page-header-image` → `clamp(180px, 22vw, 350px)` de ancho (antes 160px máx)
- El texto de intro (contactIntro) va DENTRO de PageHeader para que la imagen se centre con el bloque completo

**Philosophy section:**
- Two-column grid: `7rem` label | `1fr` texto
- Texto: `clamp(1.5rem, 2.8vw, 2.25rem)` — pausa editorial real
- CSS classes: `.philosophy-section`, `.philosophy-grid`, `.philosophy-para`, `.philosophy-cta`

**ExperienceSnapshot:**
- Solo 2 entradas en home (`.slice(0, 2)`)
- Dot acento (`var(--color-accent)`) + período en acento para rol activo (detecta "presente/present")
- Tags ultra-pequeñas: `0.5625rem`, `opacity: 0.55`
- Formación: títulos en serif bold

**SelectedWork:**
- Sin label "TRABAJO SELECCIONADO" — solo link "Casos de estudio →" a la derecha
- Project row padding: `clamp(3rem, 5vw, 5rem)`

---

## i18n — nomenclatura actualizada

| Ruta interna | ES | EN |
|---|---|---|
| `/playground` | `/laboratorio` | `/lab` |
| Nav label | Laboratorio | Lab |

PT preparado con `/laboratorio`. QU y ZH sin cambiar (ocultos).

---

## Sanity Studio — estructura (reorganizado 2026-06-03)

**Sidebar:**
- Home / Enfoque / Hablemos (abren siteSettings con tab distinto)
- Proyectos / Blog · Apuntes / Laboratorio / Experiencia
- Global / Subtítulos / Página 404 / Autor

**siteSettings — 5 tabs:**
- **Home**: hero, philosophy, SEO home
- **Enfoque**: about bio, SEO about
- **Hablemos**: contactIntro, social, SEO contact
- **Páginas**: pageTitles, pageImages, SEO (work/blog/experience/lab)
- **Global**: ogImage, cvUrl, footerText, labels, competencies, funFacts

**Nota:** El campo `Autor` en Sanity no se usa en ninguna parte del sitio — remanente del starter template.

---

## SEO (implementado 2026-06-03)

- `robots.txt`: crawlers permitidos, `/studio` bloqueado, apunta al sitemap
- `sitemap.xml`: páginas estáticas (ES/EN) + posts + proyectos dinámicos con `alternates`
- `hreflang`: todas las páginas via `[locale]/layout.tsx` `generateMetadata`
- **OG image dinámica**: campo `ogImage` en siteSettings → actualizable por temporada desde Studio
- **SEO por página** editable desde Sanity: `seoHome`, `seoAbout`, `seoContact`, `seoPages.{work|blog|experience|lab}`
- Helper `resolveSeo(fields, locale, fallback)` en `siteSettings.ts`
- `generateMetadata` en todas las páginas internas + locale layout

---

## Subtítulos editoriales — modo narrativo

Campo `mode` en `editorialSubtitleType`:
- `any` — aparece en ambos modos (default, retrocompatible)
- `dark` — solo modo oscuro
- `light` — solo modo claro

GROQ filtra por modo a nivel de base de datos. Todas las páginas pasan `mode` a `getPageSubtitle` / `getPageSubtitleData`.

---

## Imágenes del personaje — convención

PNG fondo blanco `#FFFFFF`. CSS aplica blend automáticamente:
- Claro: `mix-blend-mode: multiply`
- Oscuro: `filter: invert(1)` + `mix-blend-mode: screen`

Resoluciones: Hero `800×1000px`, páginas internas `400×500px`, OG `1200×630px`.

---

## Convenciones críticas

- `proxy.ts` en Next.js 16 reemplaza `middleware.ts`
- `export const dynamic = 'force-dynamic'` en todas las páginas
- `setRequestLocale(locale)` antes de cualquier función next-intl
- Si Turbopack se corrompe: `taskkill /F /IM node.exe`, borrar `.next`, reiniciar
- Deploy: push a `main` → Vercel auto-deploy (~2 min)

---

## Estado (2026-06-06, commit `90521b1`)

**En producción:**
- Redesign editorial: max-width 82rem, espaciado generoso, filosofía como pausa
- ModeChooser con fade-out suave y textos en ES/EN
- SEO completo: sitemap, robots, hreflang, OG dinámica, por-página desde Sanity
- Studio organizado por página con tabs
- Subtítulos editoriales diferenciados por modo narrativo
- Laboratorio reemplaza Playground en nomenclatura y rutas
- Solo ES/EN visibles en el switcher de idioma
- **Campo `hidden: boolean`** en `post` y `playgroundItem` — checkbox en Studio para ocultar sin eliminar. Filtrado `hidden != true` en todas las queries GROQ (lista, detalle, slugs, prev/next). `status` en lab sigue siendo semántico (tag del estado del proyecto), independiente de visibilidad.
- **Página de mantenimiento** en `src/app/maintenance/page.tsx` — estática, ES/EN con toggle client-side, imagen desktop (`/public/mantenimiento.jpg`) + imagen mobile (`/public/mantenimiento-mobile.jpg`). Ambas con `filter: invert(1)` + `mix-blend-mode: screen`. Toggle activado por env var `MAINTENANCE_MODE=true` en Vercel (o `.env.local` para local). El proxy `src/proxy.ts` intercepta todas las rutas excepto `/maintenance`, `/api` y `/studio`. IMPORTANTE: `/maintenance` debe bypassear next-intl con `NextResponse.next()` antes del check de mantenimiento — si no, next-intl redirige a `/es/maintenance` que no está excluido → redirect loop infinito.

**También en producción (2026-06-06):**
- Dominio `davila.uno` conectado a Vercel (A record `216.198.79.1`, CNAME `www` → Vercel). HostGator sigue activo para experimentos/carpetas — se usarán subdominos (`lab.davila.uno`) para separar.
- Favicon SVG propio (`src/app/icon.svg`) basado en el LogoMark — letra D con trazo, responde a prefers-color-scheme.
- Footer mobile: 2 columnas (logo full width en top, nav/recursos/social en grid 2col).
- Página 404 (`src/app/not-found.tsx`) rediseñada: LogoMark en nav, imagen `error-404.jpg` con `filter: invert(1)` + `mix-blend-mode: screen`, RotatingNote encima del CTA, sin 404 fantasma ni capas decorativas, fondo limpio `#0F0F0D`. Botones CTA en fila (nowrap) en mobile. Solo LAST_SIGNAL (sin TRACE_ID). "Ir al inicio" (sin "Volver").
- `src/app/[locale]/not-found.tsx` eliminado — solo existe el root `not-found.tsx`.

**Pendiente:**
- Crear subdominos `lab.davila.uno` y `files.davila.uno` en HostGator cPanel → Subdomains
- Registrar sitemap en Google Search Console
- Subir imágenes PNG del personaje a Sanity (hero dark/light + páginas internas)
- Contenido narrativo real en Sanity (sigue usando NARRATIVE_FALLBACK en varios campos)
- PT tiene contenido decente (Ever lo domina) — habilitarlo en el switcher cuando esté listo
