# Propuesta — estructura y forma de venderse (fabbianz.com y adhamdannaway.com)

Rama: `worktree-propuesta-diseno-referencias`. Solo propuesta, sin código del sitio.
Enfoque: estructura de la página y cómo cada uno se presenta. Color y tipografía quedan fuera.

Límites: el análisis sale del texto de las páginas, no de verlas renderizadas. La página `/learn` de Adham da 404, así que su oferta educativa se infiere solo de su about y de su home.

## 1. Cómo se vende cada uno

### Fabbian: vende un resultado a una empresa

Orden de la página, tal como aparece:

1. Hero: «Transformo usuarios en clientes». Una promesa, un CTA («Contactar»).
2. «¿Cómo te puedo ayudar?»: proceso de 4 pasos (Discovery/Research, Arquitectura y Marketing, Experiencia e Interfaz, Implementación y Optimización).
3. «¿Quién soy?»: «Consultor en UX con foco en eCommerce», más de 10 años, equipos multidisciplinarios.
4. «¿Con quién he trabajado?»: empresas con logo, rol y año (Telefónica, Entel, BancoEstado, Interbank…).
5. Proyectos personales: 6 tarjetas con título, una línea y «Ver más».
6. «¿Hablamos?»: correo, LinkedIn, Twitter y agenda.

Cómo funciona como venta:
- **Un nicho y un problema:** eCommerce y conversión. La frase «usuarios en clientes» se repite en el hero, en el proceso y en la bio.
- **Autoridad por trayectoria:** años y empresas reconocibles, cada una en una línea (empresa · rol · año). Sin testimonios ni cifras de resultados.
- **El visitante es el protagonista:** los títulos le hablan («¿Cómo te puedo ayudar?»).
- **Contacto tres veces:** botón del hero, sección final y un chat flotante.
- **Los proyectos personales** muestran iniciativa, aparte del trabajo para clientes.

### Adham: vende autoridad y productos propios, no servicios

Orden de la página:

1. Presentación con una promesa: «turning complex problems into simple, beautiful and intuitive designs».
2. Su vida personal (cocina, jardinería), el doble perfil de diseñador y programador, datos curiosos y barras de habilidades en tono de broma.
3. Prensa y charlas, como prueba social.
4. Libro *Practical UI* como oferta principal.
5. Sistema de diseño en Figma como segunda oferta.
6. Historia personal y blog.

Cómo funciona como venta:
- **Autoridad, no oferta de servicios:** casi dos décadas, libro, charlas. Casi no hay contacto directo.
- **Lo humano va primero:** el humor y lo personal abren la confianza antes de ofrecer algo.
- **Portafolio de 16 proyectos** en una lista: miniatura, título y categoría. Sin problema, rol ni resultado en el listado. Orden cronológico inverso, sin filtros.
- **Afirmaciones sin evidencia:** «used by millions of people», sin cifras ni clientes nombrados.
- **Varios CTA a sus productos:** «Read the book», «View the design system», «View featured work».

## 2. Qué tomar, adaptar o solo analizar

### Implementar

| De | Qué | En davila.uno |
|---|---|---|
| Fabbian | Experiencia en una línea: entidad · rol · año | Unificar el formato en home y `/experience`. Texto, no logos |
| Fabbian | Contacto repetido en puntos clave (hero, cierre del home, pie) | Un solo enlace a `/contact` en esos tres lugares. Sin chat flotante |
| Fabbian | Contacto con correo de asunto prellenado | En `/contact`, junto a LinkedIn y agenda |
| Adham | Portafolio como tarjetas: miniatura, título, categoría | Mantener la lista actual y sumar **una línea de rol o resultado**, que es lo que a Adham le falta |

### Adaptar

| De | Qué | Adaptación |
|---|---|---|
| Fabbian | Proceso en 4 pasos | «Cómo trabajo» sin jerga de embudo ni conversión. Es proceso UX público; los pasos los escribes tú |
| Fabbian | Proyectos personales como prueba de iniciativa | Ya existe: el **Lab** (Huella, Nimbus, Rènshi, LivingMusic). Subirlo en el home con una línea por proyecto |
| Fabbian | Títulos que le hablan al visitante | Solo en modo claro. En oscuro, afirmaciones directas |
| Adham | Lo humano antes de lo profesional | Ya tienes `funFacts` en Sanity. Darles lugar antes de la experiencia, en modo claro |
| Adham | Doble perfil (diseño y código) | Una línea tenue bajo el titular. No dos bloques |
| Adham | Autoridad por prensa y charlas | Solo si tienes charlas, artículos o publicaciones para mostrar |

### Solo analizar (no copiar)

- **Venta de conversión y eCommerce:** es el nicho de Fabbian. Tu terreno es plataformas digitales para el Estado y entidades privadas. Es otro posicionamiento.
- **Logos de clientes:** son entidades públicas y exigen permiso.
- **Chat que pide el nombre:** captación de leads.
- **Libro y sistema de diseño como productos:** es su modelo de negocio. Hoy no tienes equivalente.
- **16 proyectos en lista plana:** diluye. Mejor 4 a 6 curados.
- **Barras de habilidades de broma:** es su humor, no el tuyo.
- **Afirmaciones sin evidencia:** «millones de usuarios» sin dato. Si vas a afirmar algo, que sea con un dato.
- **Contacto casi ausente (Adham):** funciona porque vende libros, no horas.

## 3. Esqueleto propuesto para el home

```
1. Hero        titular por modo + línea de rol + un CTA
2. Trabajo     4–6 proyectos: título · categoría · año + una línea de rol/resultado
3. Cómo trabajo  4 pasos (nuevo; texto tuyo)
4. Lab         lo que construyo por gusto: 3–4 experimentos con una línea cada uno
5. Experiencia entidad · rol · año
6. Escritura   lista compacta
7. Cierre      un enlace a /contact

Modo claro: funFacts antes de la experiencia y títulos como preguntas.
```

## 4. Decisión previa: ¿qué vende el sitio?

Fabbian vende servicios, Adham vende autoridad y productos. Antes de tocar el home hay que fijar qué quieres que haga quien llega.

1. **Trabajo o consultoría:** el hero y el cierre llevan un CTA claro y el proceso gana peso.
2. **Ser leído y reconocido:** el Lab y el blog suben, y el contacto baja.
3. **Ambas:** el home sirve a las dos cosas con un solo CTA suave.

Con la respuesta se decide cuánto del lado Fabbian entra.

## 5. Decisiones tuyas

1. ¿Qué vende el sitio hoy: trabajo, lectura o ambas?
2. ¿Entra «Cómo trabajo»? Si sí, los 4 pasos son tuyos.
3. ¿Tienes charlas, artículos o publicaciones para mostrar como autoridad?
4. ¿Subimos el Lab al home con una línea por proyecto?
5. ¿Una línea de rol o resultado por proyecto de Work? Hay que escribirla para cada uno.
