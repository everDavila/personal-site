# Propuesta de diseño — qué tomar de fabbianz.com y adhamdannaway.com

Rama: `worktree-propuesta-diseno-referencias`. Solo propuesta: no se tocó código del sitio.

## De dónde sale el análisis (y sus límites)

- Estructura y copy: lectura del texto de ambas páginas.
- Tipografía, color, anchos y transiciones: CSS descargado de cada sitio. Es el CSS completo, no lo que se ve renderizado, así que puede incluir reglas sin uso.
- No pude ver capturas (no hay navegador conectado). Lo visual (aire, ritmo, imágenes) queda sin verificar.

| | fabbianz.com | adhamdannaway.com |
|---|---|---|
| Fuente | Raleway 200–700 + Kristi (manuscrita, de acento) | Proxima Nova (comercial, pesos light a bold) |
| Color | Azul vivo `#2789e9`, oscuro `#1c2431`, grises | `#333`, `#757575`, `#ddd`; acentos salmón `#e1ae9e` y dorado `#dfae36` |
| Ancho | 1100 px | 68 rem / 1040 px |
| Transiciones | `all` 300–450 ms | `opacity` y `color` 300 ms |
| Modo oscuro | No | No |
| Idea central | «Transformo usuarios en clientes»: venta de resultados | Diseñador y `<coder>`: autoridad con libro y cursos |

## Qué implementar, adaptar o solo analizar

### Implementar (encaja con el sistema actual)

| De | Qué | Cómo queda en el sitio |
|---|---|---|
| Adham | Navegación corta en minúscula, repetida en el pie, con «Volver arriba» | Mismo menú en el footer. Enlace mono, pequeño y tenue |
| Adham | Tarjeta de proyecto: título + categoría en texto pequeño | En Work: título en serif, categoría y año en mono tenue. Sin imagen obligatoria |
| Adham | Transición solo de `opacity` | Ya es nuestra regla: `opacity: 0.65` al hover |
| Fabbian | Contacto multicanal con `mailto:` de asunto prellenado | En `/contact`: correo, LinkedIn y agenda. El asunto ya viene escrito |
| Fabbian | Experiencia en una línea: cargo · entidad · año | `ExperienceSnapshot` ya va por ahí. Unificar el formato |

### Adaptar (la idea sí, la forma no)

| De | Qué | Adaptación |
|---|---|---|
| Fabbian | Hero de una frase + un solo CTA | Un CTA («Escríbeme» o «Ver trabajo»), no dos. La frase cambia por modo y sin tono de venta |
| Fabbian | Encabezados como preguntas («¿Quién soy?») | Solo en modo claro, que es el lúdico. En oscuro quedan afirmaciones |
| Fabbian | Proceso en 4 pasos numerados | «Cómo trabajo» en About: números en mono, título serif, 2 líneas por paso. Los pasos y el texto los pones tú |
| Adham | Hero con dos identidades (diseño y código) | Una línea mono tenue bajo el titular: `UX/UI · prototipos · código`. Sin bloques grandes |
| Adham | `<coder>` como marca | Solo si te late. Es un guiño, no estructura |

### Solo analizar (no copiar)

- **Raleway, Proxima Nova y Kristi:** ya tenemos Source Serif + Inter + mono, validados con Linear, iA, Paco y Rauno. Una manuscrita rompe el tono editorial.
- **Azul `#2789e9` y el dorado:** demasiado saturados. Nuestros acentos (`#5A7C94`, `#3D6E5E`) son apagados a propósito.
- **Transiciones `all` de 450 ms:** chocan con la regla de hover solo por opacidad.
- **Chat flotante que pide el nombre:** captación de leads. Es lo que el sitio quiere evitar.
- **«Transformo usuarios en clientes»:** es marketing de conversión. El sitio debe parecer una persona, no un recruiter.
- **Cursos, libro y sección «learn»:** modelo de negocio de Adham. No aplica hoy. Si algún día hay algo así, entra por el Lab.
- **Logos de clientes:** son entidades públicas (MEF, CEPLAN, etc.). Usarlos exige permiso. Mejor la lista en texto, como ya está.

## Boceto del home propuesto

```
nav:  davila.uno            work  blog  lab  about  contact     ○

[hero]  titular serif (por modo)
        UX/UI · prototipos · código           ← línea mono tenue (nueva)
        [ Escríbeme ]                         ← un solo CTA

[trabajo]   título serif ........ categoría · año   (mono, tenue)
            título serif ........ categoría · año

[cómo trabajo]   01 Descubrir   02 Estructurar   03 Diseñar   04 Probar   ← nuevo, 4 pasos
[experiencia]    cargo · entidad · año   (una línea cada uno)
[escritura]      lista compacta
[lab]            2–3 experimentos

footer:  mismo menú · volver arriba ↑
```

## Cambios por orden de costo

1. Footer con el menú y «Volver arriba». Una hora.
2. Contacto con `mailto:` prellenado. Una hora.
3. Formato único cargo · entidad · año. Dos horas.
4. Categoría y año en mono en la lista de Work. Dos horas.
5. Hero con CTA único y línea mono. Medio día, más el texto por modo en Sanity.
6. Sección «Cómo trabajo». Medio día, y necesita tu texto.

## Decisiones tuyas

1. ¿Entra «Cómo trabajo»? Si sí, los 4 pasos son tuyos: no los invento.
2. ¿El CTA del hero es «Escríbeme» o «Ver trabajo»?
3. ¿Encabezados como preguntas en modo claro?
4. ¿La línea `UX/UI · prototipos · código` te representa o suena a etiqueta de recruiter?

## Nota técnica

La skill `front-end-developer` pide Tailwind. Aquí rige el CLAUDE.md del proyecto: variables CSS e inline styles, sin clases Tailwind en producción. Esta propuesta sigue el segundo.
