# Borrador — Huella (Lab / playgroundItem)

Solo español. Inglés y publicación en Sanity después de tu visto bueno.
Fuente: BITACORA.md, CONTEXTO.md y git log de huella (16–18/11/2026). Las horas son aproximadas: corrígelas.

## Ficha

- **Título:** Huella
- **Categoría:** Tools (alternativa: Systems)
- **Estado:** En proceso
- **Año:** 2026
- **Demo:** https://huella.davila.uno
- **Repo:** vacío (es privado)

**Descripción corta:** Un planificador de viaje que sigue funcionando cuando el WiFi del hotel decide que no.

## 01 — La idea

Huella es una pwa/app para planificar y documentar el viaje que quiero hacer a  China en  de 2027. Empiezo solo en Beijing y después me acompaña alguien. La planificación es por persona: solo el hospedaje se divide entre quienes comparten habitación.

Es un mapa con una ruta de 35 ciudades, 78 atracciones con precio, presupuesto, noches por parada y un registro GPS para guardar por dónde pasé. Se planea en el escritorio y se usa en el celular durante el viaje.

Nació como GoChina y terminó llamándose Huella. No quería atarla a un país, y además evoca el rastro que uno deja. (El cambio de nombre fue la decisión más barata del proyecto.)

## 02 — El porqué

Planear un viaje largo por China en hojas de cálculo y pestañas abiertas es posible. También lo es cortarse el pelo con tijeras de cocina.

Necesitaba ver la ruta completa, mover una ciudad y que el presupuesto se enterara solo. Y necesitaba que siguiera sirviendo sin conexión, porque en un tren de alta velocidad el internet es una promesa.

También es un experimento de portafolio. Por eso lo documento desde el primer día, incluidos los errores.

## 03 — Bitácora (entradas)

Formato: fecha · hora aprox. · dimensión · tag.

### 1. 2026-11-16 · 10:00 · Producto · Decisión
**Las 78 atracciones y un presupuesto que se rebela**
Armé 78 atracciones de pago en 31 ciudades. Las 38 imprescindibles entran al presupuesto: unos ¥2,518 por persona.

Todos los precios salen de mi memoria y llevan la etiqueta «est.». Se vuelven «tuyo» cuando los edito yo. No quiero que un número inventado se haga pasar por dato.

### 2. 2026-11-16 · 15:00 · Producto · Duda
**Un vuelo con letra chica**
Sumé el vuelo Lima–Beijing como costo fijo: unos S/ 8,000, convertidos a yuanes. Ahora no sé si ese precio incluye el regreso.

La ruta tampoco cierra: empieza y termina en Hong Kong, cuando debería empezar y terminar en Beijing. Ya está anotado.

### 3. 2026-11-17 · 09:30 · Producto · Decisión
**De GoChina a Huella**
GoChina era un nombre que me ataba a un país. Huella sirve para otros viajes y para el diario, y el rastro GPS ya hace de huella. Descarté Lutu y Xingcheng.

La clave interna de la base local sigue llamándose `gochina-v1`. Renombrarla borraría lo guardado, así que el nombre viejo se queda como fósil.

### 4. 2026-11-17 · 12:00 · Infraestructura · Pivote
**Supabase, adiós**
Había elegido Supabase para guardar el plan en la nube. El plan gratuito permite dos proyectos activos y ya tenía dos: los de Rènshi.

Pausar uno o reutilizarlo habría afectado a Rènshi, así que me cambié a Firebase, que ya conocía de Nimbus. Es un cambio de proveedor y de nada más.

### 5. 2026-11-17 · 16:00 · Producto · Decisión
**Mirar sí, tocar no**
Quien entra sin sesión solo puede mirar. Edito yo, o quien yo invite. El plan lleva mis fechas y mi presupuesto, y no quiero que cualquiera pueda borrar Chengdu.

Lo importante es que el bloqueo no está en el botón apagado. Está en la capa de datos, que rechaza el cambio aunque alguien fuerce la interfaz. Un botón gris es una sugerencia.

### 6. 2026-11-17 · 20:00 · Infraestructura · Hito
**En producción, con un asterisco**
Huella ya está en huella.davila.uno con Firebase real. Sin sesión, las reglas responden 403 a quien intente leer el plan.



### 7. 2026-11-17 · 22:00 · Interfaz · Avance
**Copiar ruta**
Exportar el JSON solo tiene sentido para quien puede editar. Para quien solo mira agregué «Copiar ruta»: el itinerario como texto, con paradas, fechas, transporte y total por persona.

Es lo que le mandaría a quien viaje conmigo. Nadie quiere recibir un archivo con llaves y comillas.

### 8. 2026-11-18 · 10:00 · Producto · Insight
**Todas las paradas tenían una sola noche**
Las 37 paradas tenían 1 noche. Era el mínimo posible y no era un plan, era una carrera con maleta.

Armé dos referencias por ciudad: un mínimo para ver lo esencial y un recomendado para no correr. Salen 35 y 63 noches. Son criterios míos a partir de guías típicas, sin verificar con fuentes. La diferencia entre 35 y 63 es exactamente cuánto me quiero cansar.

### 9. 2026-11-18 · 13:00 · Interfaz · Avance
**Desactivar sin borrar**
Quería probar «¿y si salto esta ciudad?» sin perderla. Cada parada tiene ahora una casilla. Desactivada, sigue en la lista, tachada y gris, pero no cuenta en presupuesto, noches ni mapa. Al reactivarla, el total vuelve igual al original.

Jugar con el viaje sin destruirlo es la mitad del planeamiento.

### 10. 2026-11-18 · 16:00 · Investigación · Decisión
**Wikipedia en vez de sitios oficiales**
Quería un enlace por atracción para ver fotos. Los sitios oficiales suelen estar solo en chino, piden registro o no abren fuera de China.

Usé Wikipedia: la busqué por nombre en caracteres y tomé el enlace en español, si no en inglés, si no en chino. 76 de 78 tienen enlace y los 76 responden. Enlaces oficiales puse cero, porque no pude verificarlos. Un enlace falso es peor que ninguno.

### 11. 2026-11-18 · 20:00 · Proceso · Lección
**Retomar el proyecto en otra computadora**
Cloné el repo en otra PC y quedó corriendo en minutos. Funcionó porque dejé escrito el estado, las decisiones y los pasos, sin secretos.


### Cierre (opcional) · Cierre del día · Pausa
Falta probar el login real y las reglas con un invitado, definir si el vuelo incluye el regreso, y agregar Zhangjiajie, que es donde están las montañas de Avatar. La versión Android viene al final.

## Faltantes que no puedo inventar

- **Capturas:** ninguna entrada tiene imagen. Pendientes: el mapa con la ruta, el modo lectura con el banner, la tarjeta de una parada con «sugerido X–Y», «Copiar ruta», una parada desactivada (gris en el mapa).
- **Horas:** son de relleno, a partir de los commits.
- **Por qué China:** el «porqué» personal (lo que te lleva ahí) solo lo sabes tú. Hoy el texto habla de la utilidad, y la motivación de fondo es tuya.
- **¿Entra el 2026-11-16 a la bitácora pública?** Ese día aparece en el BITACORA.md pero no hay commits que lo respalden.
- **Fuente para validar la estimación de precios:** las cifras salen de memoria. Si lo publicas así, queda dicho en la entrada 1.

---

## Entradas nuevas propuestas (de los commits posteriores, revisión del 18/11)

### A. Antes del 16 de noviembre · Investigación · Insight
**El mapa no salió de la nada**
La ruta inicial no la inventé yo. Partí de una imagen titulada «超级旅游计划» («súper plan de viaje»): un recorrido circular por China con flechas rojas entre ciudades y un número rosa en cada tramo. Parecen precios en yuanes, pero es una lectura mía, no está confirmada.

De ahí salió la ruta de 35 ciudades. También explica por qué empieza y termina en Hong Kong y no en Beijing, que era lo que yo quería. Tomé la ruta y la idea. Los precios y tiempos de Huella son estimaciones propias.

(No conozco al autor de la imagen. No la publico sin su permiso.)

### B. 2026-11-18 · madrugada · Interfaz · Avance
**Más aire**
La interfaz se veía apretada, y el panel de vuelos y costos fijos ocupaba la pantalla aunque no lo necesitara. Hice una crítica de diseño y subí el espaciado, el tamaño de los campos y los botones. El panel de costos arranca cerrado y dice «N conceptos · ¥total».

También arreglé algo que me molestaba: en modo lectura los campos se veían apagados al 55 %. El presupuesto de un visitante era casi ilegible. Ahora se lee como texto normal.

### C. 2026-11-18 · madrugada · Interfaz · Avance
**El aviso que se repetía**
El banner amarillo de «Modo lectura» decía lo mismo que el encabezado, en cada pestaña. Lo quité y dejé el aviso junto a «Entrar». Aproveché para corregir los textos sin tilde: atracción, ubicación, todavía.

Los nombres de las atracciones los dejé sin tilde a propósito («Jardin Yu», «Montana Yandang»): son la clave de los enlaces de Wikipedia y de lo que ya está guardado en cada dispositivo. Corregirlos rompe enlaces y duplica datos. Una tilde puede costar una migración.
