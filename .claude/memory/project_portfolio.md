---
name: project-portfolio
description: "Portafolio personal davila.uno — stack, arquitectura, estado actual y convenciones (actualizado 2026-06-07)"
metadata: 
  node_type: memory
  type: project
  originSessionId: b2539090-46ae-44ab-954c-8cd5ec511fa8
---

Portafolio personal con blog en davila.uno. Flujo: desarrollo en `dev`, merge a `main` para publicar en Vercel.
Repo: `d:\reposGIT\personalPage` (Windows). GitHub: `everDavila/personal-site`.

**Stack:** Next.js 16.2.6 (App Router, Turbopack) + TypeScript + Sanity v5 + Vercel  
**Styling:** CSS custom properties + inline styles. NO Tailwind en producción.  
**i18n:** next-intl 4.12, 5 locales (es default, en, pt, qu, zh). Solo ES/EN visibles en el switcher.

---

## Sistema de modo narrativo

Dos modos via cookie `narrative-mode`, persistido como `data-mode` en `<html>`:

| | `dark` | `light` |
|---|---|---|
| Tono | Lúdico / astronauta | Profesional / humano |
| Bg | `#0F0F0D` | `#E8E5DF` |
| Acento | `#5A7C94` | `#3D6E5E` |

ModeChooser overlay primera visita. ES: Orbital / Tierra. EN: Orbital / Earth.

---

## Diseño — estado actual (2026-06-07)

**Tokens:**
```
--max-width:        82rem
--spacing-section:  clamp(4rem, 9vw, 7rem)
--transition:       350ms ease
```

**Home — estructura:**
Hero (sin CTAs) → SelectedWork/Misiones → Philosophy → Writing/Apuntes. ExperienceSnapshot eliminado.

**Philosophy:** Toda la sección es `<Link>` a `/about`. Texto en `var(--color-accent)`.

**SelectedWork/Misiones:** Etiqueta modo-aware. Sin CTA header. `padding-block: clamp(1.75rem, 3vw, 2.75rem)`. Headline sin max-width.

**Writing/Apuntes:** CTA modo-aware "Ver todos los apuntes". Descripción desde Sanity.

**Hero:** Solo headline + subtítulo rotativo. Sin botones CTA.

---

## Sanity Studio

**siteSettings — 5 tabs:** Home / Enfoque / Hablemos / Páginas / Global

**Campos `labels.home`:**
- `projectsDesc` — descripción sección Misiones
- `postsDesc` — descripción sección Apuntes

---

## Convenciones críticas

- `proxy.ts` reemplaza `middleware.ts` en Next.js 16
- `export const dynamic = 'force-dynamic'` en todas las páginas
- `setRequestLocale(locale)` antes de cualquier función next-intl
- Si Turbopack se corrompe: `taskkill /F /IM node.exe`, borrar `.next`, reiniciar
- **Flujo:** desarrollar en `dev` → Ever confirma → merge a `main` → Vercel auto-deploy

---

## Estado (2026-06-07)

**En producción:**
- Sistema modo narrativo completo (dark/light, cookie, ModeChooser, ThemeToggle)
- SEO: sitemap, robots, hreflang, OG dinámica, por-página desde Sanity
- Studio organizado con tabs por página
- Laboratorio reemplaza Playground en rutas y labels
- Campo `hidden` en post y playgroundItem
- Página de mantenimiento con env var `MAINTENANCE_MODE`
- Dominio `davila.uno` → Vercel
- Favicon SVG propio, página 404 rediseñada
- Footer EXPLORAR: "Sobre Mí" → `/about`

**Pendiente:**
- Subdominos `lab.davila.uno` y `files.davila.uno` en HostGator
- Registrar sitemap en Google Search Console
- Imágenes PNG del personaje en Sanity (hero dark/light + páginas internas)
- Contenido narrativo real en Sanity (usa NARRATIVE_FALLBACK)
- Habilitar PT en el switcher cuando esté listo
