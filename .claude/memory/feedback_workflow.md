---
name: feedback-workflow
description: "Flujo de trabajo con ramas — dev para desarrollo, main solo para publicar en Vercel"
metadata:
  type: feedback
---

Siempre trabajar en la rama `dev`. Solo mergear a `main` cuando Ever confirme que está ok.

**Why:** Los commits directos a `main` se publican automáticamente en Vercel (davila.uno). Si algo rompe, el sitio cae en producción sin red de seguridad ni rollback rápido.

**How to apply:**
- Al iniciar una sesión: `git checkout dev`
- Todos los commits van a `dev`
- Vercel genera una preview URL por rama para revisar antes de publicar
- Cuando Ever dice "todo bien, súbelo" → `git checkout main && git merge dev && git push origin main`
- Nunca commitear directo a `main` salvo que Ever lo pida explícitamente
