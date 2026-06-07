---
name: feedback-design
description: "Design philosophy, references, and aesthetic direction for the portfolio — validated preferences"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 700eebda-d067-43f6-9d21-6a60f28198b2
---

Design reference mix (validated by user, mayo 2026):

- **40% Linear** — spacing discipline, density controlada, hover states de solo opacity, monospace metadata, oscuridad sofisticada, interfaces silenciosas
- **25% Information Architects (ia.net)** — editorial minimalism, tipografía dominante, claridad sobre decoración, entorno de lectura de ~66ch
- **20% Paco Coursey (paco.me)** — parece humano, no marca personal optimizada, estructura simple pero personal, CTAs como texto no como botones
- **15% Rauno Freiberg (rauno.me)** — micro-interacciones intencionales, atmósfera, grain, composiciones geométricas, detalles microscópicos

**Why:** El usuario quiere que su sitio se sienta como una persona real, no un portfolio de recruiter. Tiene background en UX y valora la sofisticación visual sin exceso.

**How to apply:**
- No glow futurista, no gradients llamativos, no "startup aesthetic"
- Type lidera el layout — jerarquía por tamaño/peso, no por color
- Hover: solo opacity, nada de transforms o escalas
- Metadata (fechas, tiempos de lectura, labels): monospace, dim, pequeño — consistente en todo el sitio
- Espaciado: grid de 4px/8px, todo snapped — no mix de unidades arbitrarias
- Blog/articles: entorno de lectura limpio, max ~66ch, sin chrome alrededor
- Copy del about/bio: debe sonar como alguien pensando, no como CV optimizado

**Pendiente que el usuario valide:** simplificación del home (actualmente muchas secciones vs. el "una sola superficie" de Paco Coursey).

**What NOT to do:** no copiar el glow futurista de Vercel, no ir demasiado "creative developer Twitter" (Rauno tiene ese riesgo), no hacer el sitio parecer "marca personal para recruiters".

---

## Tokens de color actuales (validados mayo 2026)

**Modo oscuro (lúdico / astronauta):**
- bg: `#0F0F0D`, surface: `#181715`, border: `#272522`
- text: `#F0EFEC`, muted: `#7A7975`, accent: `#5A7C94`

**Modo claro (profesional / humano):**
- bg: `#E8E5DF` ← bajado de #F5F4F0 (muy blanco, golpeaba la vista)
- surface: `#DEDAD3`, border: `#C8C4BC`
- text: `#111110`, muted: `#6A6A67`, accent: `#3D6E5E`

**Transición dark↔light:**
- background: `950ms cubic-bezier(0.45, 0, 0.15, 1)` — arranca lento, no destella
- color: `600ms ease-in-out`
- hovers/UI: `--transition: 250ms ease` (sin cambio)

**Why:** El blanco puro (#F5F4F0) causaba un destello visual al cambiar de modo oscuro. El papel beige cálido (#E8E5DF) reduce el contraste de ~18:1 a ~13:1 y la transición lenta da tiempo al ojo. Validado como "mucho mejor".
