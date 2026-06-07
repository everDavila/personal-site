---
name: feedback-lessons
description: "Lecciones aprendidas por sesión — errores cometidos, patrones que funcionan, qué hacer diferente"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: b2539090-46ae-44ab-954c-8cd5ec511fa8
---

## Sesión 2026-06-06 (tarde) — Labels nav, Sanity vs local

### Error principal: asumir que un campo de Sanity estaba vacío

Declaré `siteSettings.labels.nav = null` sin verificarlo en el Studio ni con GROQ. El campo tenía valores — Ever cambió uno y se vio en el site inmediatamente.

**How to apply:** Antes de decir "ese campo está vacío en Sanity", verificar en el Studio o con una query GROQ directa. Nunca asumir desde el código.

### Lección consolidada: jerarquía Sanity > messages files (confirmada en vivo)

- Labels modo claro → Sanity `siteSettings.labels.nav` (prioridad real, no solo teórica)
- Labels modo oscuro → `DARK_NAV` constante en `Nav.tsx` (siempre local)
- `messages/*.json` es fallback, no fuente primaria en producción

**How to apply:** Cambios de labels modo claro = Sanity Studio. Cambios modo oscuro = código.

### Lección de diseño: 3D transforms solo para elementos grandes

`rotateX(90deg)` en labels de nav (5-7 chars) es demasiado dramático. Crossfade puro (opacity 200ms) es más apropiado para micro-elementos de UI.

**Why:** El usuario lo pidió como "más discreto" — el 3D era teatral para el contexto.
**How to apply:** Reservar transformaciones 3D (`perspective + rotateX/Y`) para bloques grandes (héroe, títulos). Para nav labels, badges, metadata → solo opacity.

---

## Regla general

Guardar en este archivo al final de cada sesión: qué salió mal, qué salió bien, qué no se definió a tiempo y cómo resolverlo mejor la próxima vez.

---

## Sesión 2026-06-03 — Redesign + SEO + Studio

### Errores cometidos

**1. Implementar antes de confirmar visualmente**
- Subí el spacing tan alto que el contenido quedó pegado al techo en páginas internas
- Debí tomar screenshot antes/después antes de proponer el valor final
- **How to apply:** Para cambios de spacing/layout, siempre screenshot comparativo antes de commitear

**2. Iterar demasiado en algo que al final se quitó**
- Los efectos hover del ModeChooser (órbita + tierra) los implementé, refiné 3 veces, y terminaron quitándose
- El usuario los pidió pero nunca confirmó que los quería antes de implementar
- **How to apply:** Para microinteracciones decorativas, preguntar "¿lo prototipamos primero en CSS antes de integrar?" en lugar de ir directo al código

**3. No leer la estructura del componente antes de sugerir CSS**
- El problema del `page-header-grid` lo resolví en 3 intentos (end → center → start) cuando el problema real era que el intro text estaba fuera del grid
- **How to apply:** Leer el JSX del componente antes de tocar el CSS. El problema visual casi siempre tiene raíz estructural

**4. Reportar como deployado cuando no lo estaba**
- Varias veces cambios hechos en local no estaban commiteados — el usuario fue a Vercel y no vio nada
- **How to apply:** Después de cada cambio de código, preguntar explícitamente "¿lo commiteo ahora?" antes de decir "listo"

**5. OG fallback apuntando a URL inexistente**
- Puse `davila.uno/og-home.png` como fallback estático cuando el dominio apunta a WordPress
- **How to apply:** Siempre verificar si el dominio está activo antes de usar URLs de producción como fallback

### Qué funcionó bien

**Screenshots comparativos** — cuando tomé before/after screenshots el feedback fue inmediato y preciso. Hacer esto siempre para cambios visuales.

**Cambios pequeños e iterativos** — el usuario prefiere ver el resultado de cada ajuste antes de seguir. No acumular muchos cambios en un commit.

**Preguntar antes de implementar features opcionales** — cuando pregunté "¿lo hago?" antes de la OG dinámica, la conversación fue más eficiente que cuando asumí.

### Lo que no se definió a tiempo y causó retrabajo

- El ancho ideal del contenedor (`--max-width`) — no había referencia clara. Se llegó a 82rem por iteración
- El comportamiento de `page-header-grid` — nadie definió si la imagen debía alinearse con el título o con todo el bloque
- La nomenclatura Playground→Laboratorio/Lab — se definió tarde, ya había código con "playground" hardcodeado en varios lugares

**Why:** Faltó una decisión inicial sobre estas cosas antes de empezar a codear.  
**How to apply:** Al inicio de una sesión de redesign, listar explícitamente las decisiones de diseño abiertas y resolverlas antes de tocar código.

---

## Sesión 2026-06-05 — Campo hidden + página de mantenimiento

### Error cometido: redirect loop con next-intl

Al crear una página fuera del routing `[locale]` (ej. `/maintenance`) y redirigir a ella desde el middleware, next-intl la intercepta y redirige a `/es/maintenance`. Ese path ya no coincide con el check de exclusión (`startsWith('/maintenance')` sí lo haría pero el orden importa) → loop infinito con `ERR_TOO_MANY_REDIRECTS`.

**Fix:** En `proxy.ts`, poner el check de `/maintenance` PRIMERO y retornar `NextResponse.next()` antes de llegar al check de mantenimiento ni al intlMiddleware:
```ts
if (pathname.startsWith('/maintenance')) return NextResponse.next()
if (MAINTENANCE_MODE) return redirect('/maintenance')
return intlMiddleware(request)
```
**How to apply:** Cualquier página estática fuera del `[locale]` routing debe bypassear next-intl explícitamente en el proxy.

---

## Sesión 2026-06-06 — 404 page + deploy

### Error principal: editar el archivo equivocado

Next.js App Router tiene DOS archivos not-found posibles:
- `src/app/not-found.tsx` — el root, que Next.js usa en la práctica para casi todos los 404s
- `src/app/[locale]/not-found.tsx` — el nested, que raramente se activa

Estuve una sesión entera editando `[locale]/not-found.tsx` mientras el usuario veía `not-found.tsx`. Resultado: ningún cambio visible.

**How to apply:** Antes de editar cualquier archivo que tenga rutas similares (not-found, layout, page), verificar cuál está abierto en el IDE del usuario y cuál es el que realmente se renderiza en el browser. El root siempre tiene prioridad sobre el nested en App Router.

**Fix:** Eliminar `[locale]/not-found.tsx` si existe un root `not-found.tsx` equivalente — un solo archivo de verdad, sin duplicados.

---

### Hydration error: Math.random() en useState

`useState(() => Math.random())` se ejecuta en servidor Y cliente → valores distintos → hydration mismatch.

**Fix:**
```tsx
const [index, setIndex] = useState(0)
useEffect(() => {
  setIndex(Math.floor(Math.random() * notes.length))
}, [notes.length])
```

**How to apply:** Cualquier valor no-determinístico (random, Date.now(), window.*) debe ir en `useEffect`, nunca en el inicializador de `useState`.

---

### Color invisible sobre fondo oscuro

`#4A4845` sobre `#0F0F0D` es prácticamente invisible. El componente renderizaba correctamente pero el usuario no veía nada → asumió que estaba mal ubicado.

**How to apply:** En páginas con fondo `#0F0F0D`, usar mínimo `#7A7775` para texto secundario/muted. Verificar contraste antes de asumir que el componente no está en el DOM.

---

## Regla de commits / GitHub

Siempre incluir descripción clara en el mensaje de commit para lectura rápida en el historial de GitHub. Formato actual que funciona:
```
feat(scope): descripción corta de qué y para qué
```
**Why:** Ever revisa el historial de GitHub y necesita entender cada cambio de un vistazo sin abrir el diff.  
**How to apply:** Antes de commitear, asegurarse que el mensaje responde "¿qué cambió y por qué?" en una línea. Nunca mensajes vagos como "fix" o "update".

---

## Menús en múltiples lugares — labels sí, estructura no

El header (`Nav.tsx`) y el footer (`Footer.tsx`) son secciones distintas con organización propia. Ever no quiere que se sincronice la estructura — cada uno tiene sus propios links y columnas por diseño.

**Lo que SÍ se replica:** los *nombres/labels* de los links que aparecen en ambos (ej. "Laboratorio" en lugar de "Experimentos").

**Lo que NO se replica sin que Ever lo pida:** agregar/quitar links, cambiar columnas, reorganizar secciones.

**Why:** Al arreglar "Experimentos→Laboratorio" en el footer, también cambié la estructura de columnas del footer sin que Ever lo pidiera. Tuve que revertirlo.

**How to apply:** Cambio de label = tocar el archivo de mensajes/traducciones y verificar que el label correcto llegue a ambos componentes. Cambio de estructura = solo si Ever lo pide explícitamente.

---

## Patrón de trabajo que funciona con Ever

1. Ever comparte imagen de referencia + prompt de intención
2. Yo analizo y listo los cambios propuestos ANTES de implementar
3. Ever confirma o ajusta
4. Implemento, tomo screenshot, muestro resultado
5. Ever da feedback preciso sobre lo que ve
6. Ajusto puntualmente
7. Commit + push cuando Ever dice "deploy" o "mándalo"

No acumular. No asumir. No deployar sin confirmación explícita.
