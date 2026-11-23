# Borrador 2 — Huella (Lab / playgroundItem)

Solo español. Inglés y publicación en Sanity después de tu visto bueno.
Fuente: BITACORA.md de Huella y su git log (18/11 desde la 01:00 hasta el 22/11 00:12). Lo ya publicado llega hasta el 18/11 20:00 («Cambiar de computadora sin volver a empezar»).

Formato: fecha · hora aprox. · dimensión · tag.
Las horas salen de los commits. Ojo: tus 11 entradas publicadas llevan las horas que tú diste (10:00, 13:00… del 16 al 18) y no coinciden con los commits (esas cosas se hicieron entre las 00:00 y la 01:00 del 18). Si dejo las horas reales, estas entradas nuevas se mezclan con las tuyas del mismo día. Dime si prefieres que las ordene todas después de las 20:00 del 18, o que las deje con la hora real.

Cosas que NO entraron por ser microcambios: alto fijo de las fotos, panel «Capas» con casillas enormes, número de la lista que lleva al mapa, botón «Agregar lugar» arriba, nombre primero en las atracciones de cada parada, orden de Explorar. Si alguna te parece historia, la añado.

---

## 18 de noviembre

### 1. 2026-11-18 · 01:00 · Interfaz · Avance
**Más aire**
La interfaz se veía apretada. Corrí una crítica de diseño sobre las cuatro pestañas y la lista fue larga: todo pegado, letras chicas y un panel de vuelos y costos fijos que ocupaba media pantalla aunque nadie lo hubiera pedido.

Subí el espaciado, agrandé campos y botones y dejé ese panel cerrado, con una sola línea que dice cuántos conceptos tiene y cuánto suman. Además, en modo lectura los campos se veían apagados al 55 %: el presupuesto de un visitante era casi ilegible. Ahora se lee como texto normal.

Captura pendiente: antes y después del panel de costos fijos.

### 2. 2026-11-18 · 01:10 · Interfaz · Avance
**El aviso que se repetía**
El banner amarillo de «Modo lectura» decía lo mismo que el encabezado, en cada pestaña. Lo quité y dejé el aviso junto al botón «Entrar», que es donde alguien lo va a buscar.

De paso corregí las tildes que faltaban en los textos: atracción, ubicación, todavía. Los nombres de las atracciones los dejé sin tilde a propósito («Jardin Yu», «Montana Yandang»): son la llave de los enlaces de Wikipedia y de lo que ya está guardado en cada dispositivo. Corregirlos rompe enlaces y duplica datos.

Una tilde puede costar una migración.

### 3. 2026-11-18 · 01:20 · Investigación · Insight
**El mapa no salió de la nada**
La ruta inicial no la inventé yo. Partí de una imagen titulada «超级旅游计划» («súper plan de viaje»): un recorrido circular por China con flechas rojas entre ciudades y un número rosa en cada tramo. Parecen precios en yuanes, pero es una lectura mía, no está confirmada.

De ahí salió la ruta de 35 ciudades. También explica por qué empezaba y terminaba en Hong Kong y no en Beijing. Tomé la ruta y la idea. Los precios y tiempos de Huella son estimaciones propias.

(No conozco al autor de la imagen. No la publico sin su permiso.)

### 4. 2026-11-18 · 01:30 · Infraestructura · Decisión
**Un mapa que se cae no debería llevarse la app**
El mapa se crea con una librería que exige WebGL. En un celular viejo, o con el ahorro de energía apretando, podía fallar y dejar toda la app en blanco. Y en pleno viaje lo que más voy a usar es la lista, el presupuesto y el registro.

Ahora Huella detecta si el mapa puede abrirse y, si no, muestra un aviso y deja todo lo demás funcionando. Lo probé forzando el fallo en el navegador. Un dispositivo real sin WebGL todavía no lo tengo, así que ahí sigue la duda.

### 5. 2026-11-18 · 02:00 · Interfaz · Hito
**De hoja de cálculo a algo que parece app**
Le pasé a Claude un prototipo en HTML y el pedido de rediseño. Antes de construir lo analizamos, y el plan quedó por fases.

Primero la base: espaciado en múltiplos de 8, una paleta nueva y un interruptor de tema. Después la cabecera y el itinerario como línea de tiempo, donde cada ciudad se ve limpia y sus opciones aparecen solo al abrirla. Explorar pasó a ser una galería con espacio para fotos. Mi recorrido distingue la ruta planificada (naranja) de la realizada (morado).

Los menús que todavía no hacen nada dicen «Pronto». Es más honesto que fingir.

Captura pendiente: el itinerario antes y después, y Mi recorrido con las dos rutas.

### 6. 2026-11-18 · 02:05 · Producto · Decisión
**La cifra que sobraba**
Quería un presupuesto más limpio y con una dona para ver adónde se va el dinero. Arriba hay tres tarjetas grandes: total estimado, gasto por día y lo que ya pagué. Debajo, la dona, los escenarios de transporte y, solo donde de verdad se compara, barras de estimado contra real.

Quité una línea que decía «Diferencia vs. lo estimado». Comparaba pagos parciales con el total de todo el viaje, así que daba una cifra engañosa.

Prefiero un espacio vacío con una explicación a un número que miente.

Captura pendiente: la dona y las tarjetas.

### 7. 2026-11-18 · 10:50 · Producto · Hito
**La ruta por fin empieza donde aterriza mi vuelo**
La ruta ahora empieza y termina en Beijing. Es el mismo círculo del mapa original, girado. El Hong Kong del final desapareció y, con él, el pendiente que arrastraba desde el primer día.

También entró Zhangjiajie, las montañas de Avatar, con dos o tres noches y tres atracciones. Y un teatro de Chongqing con platea giratoria de 360 grados. No pude abrir su web ni confirmar el precio en yuanes, así que va como opcional y con el aviso de verificarlo antes de reservar.

Los planes que ya tenía guardados se actualizan solos, sin perder noches ni hoteles.

### 8. 2026-11-18 · 11:00 · Producto · Decisión
**Querer algo no es lo mismo que tenerlo en el plan**
Una estrella de sí o no se quedó corta. Ahora cada atracción tiene un nivel: sí o sí, me gustaría mucho, si alcanza y descartada. Descartada se atenúa pero no se borra, porque suena a algo que puedo revertir. «Excluir» sonaba a eliminar.

Aparte hay otro eje, el estado: pendiente, programada, visitada o saltada. «Saltada» es lo que quería y no pudo ser. «Descartada», lo que nunca quise. Parecen lo mismo hasta que hay que explicárselo a la app.

Y lo que agrego yo arranca fuera del presupuesto, para que el total refleje solo lo que decido.

### 9. 2026-11-18 · 11:10 · Investigación · Insight
**Mi mapa no sabía dónde estaban las cosas**
Descubrí que 33 de mis 82 atracciones no existían en el mapa. Tenían nombre y precio, pero no ubicación. Las montañas de Avatar, entre ellas.

Las busqué una por una en OpenStreetMap con su nombre en chino, a una consulta por segundo, y las crucé con Wikipedia. Donde coincidían, listo. Donde no, a mano. La primera respuesta para el Parque Forestal de Zhangjiajie era en realidad Tianmen. El templo Kaiyuan de Quanzhou cayó en Taiwán.

Quedaron 79 de 82. Son puntos de referencia: una montaña grande se marca en un solo punto.

### 10. 2026-11-18 · 11:20 · Producto · Avance
**La app no conocía las montañas de Avatar**
Si una atracción no estaba en mi lista, tenía que agregar la ciudad y escribir el lugar a mano. Ahora hay una sola caja: sugiere ciudades de una lista propia mientras escribes y busca lugares en Wikipedia. Wikipedia entiende apodos: «avatar mountains» llega al Parque Forestal de Zhangjiajie. En español, en cambio, me llevó a otra montaña.

Las fotos vienen del mismo lugar. Un botón las baja una por una, sin abusar de Wikimedia, y las guarda en el dispositivo con autor y licencia a la vista. 71 de 78 atracciones tienen foto. Las otras 7 siguen con un degradado.

Nada se guarda sin que yo lo confirme.

### 11. 2026-11-18 · 11:25 · Producto · Avance
**Un día tiene ocho horas, aunque el parque diga dieciséis**
Cada ciudad tiene tantos días como noches, y cada día cuenta con ocho horas útiles. «Completar mis días» reparte las atracciones: primero los sí o sí, que nunca se sacan por otra cosa, y luego los opcionales, de más a menos queridos, prefiriendo los que quedan cerca entre sí.

Faltaba algo obvio: moverse toma tiempo. Ahora el plan descuenta el traslado entre lugares con un modelo simple y declarado, y en Zhangjiajie con tres noches Tianmen dejó de caber.

Son supuestos míos, no horarios de transporte reales.

### 12. 2026-11-18 · 11:30 · Producto · Decisión
**Una ruta que no sea solo grandes ciudades**
Pedí pueblos. Cada parada puede marcarse como pueblo o villa, hay un filtro y un panel con seis candidatos cerca de la ruta: Fenghuang, Hongcun, Xidi, Zhouzhuang, Tongli y Pingyao. Cada uno dice a cuántos kilómetros queda de mi parada más cercana. Pingyao está a unos 226 de Shijiazhuang, que ya es un desvío en serio.

La lista salió de memoria, sin fuente. Las coordenadas sí se contrastaron con OpenStreetMap. Los precios y las noches son estimaciones, y el panel lo avisa.

### 13. 2026-11-18 · 11:40 · Interfaz · Avance
**Un ícono de iglesia en China confundiría**
Cada atracción ahora tiene un tipo (templo, museo, montaña, mercado…) y cada tipo un ícono en el mapa. Usé una librería de íconos con licencia libre. Le faltaba la pagoda. Un templo con el ícono de iglesia y su cruz habría confundido en China, así que el de templo está dibujado a mano, en el mismo estilo.

El mapa tuvo su drama: los pines no aparecían porque las capas se creaban antes que sus imágenes, y las etiquetas les ganaban el choque de espacio.

Captura pendiente: el mapa con los íconos.

### 14. 2026-11-18 · 11:50 · Proceso · Lección
**El primer despliegue falló por un correo**
Desplegué Huella a producción desde la línea de comandos de Vercel y el primer intento falló. Mis commits llevaban como autor un correo distinto al de la identidad del repo, y Vercel exige que el autor pertenezca al equipo. Como los commits eran locales, reescribí la autoría y reintenté.

Lección: no tocar la identidad de git del repo. El bug era un correo.

### 15. 2026-11-18 · 13:47 · Producto · Decisión
**Mis fotos no viven en la app**
Las fotos del viaje las voy a tomar con una cámara y las voy a publicar, ya curadas, en Instagram. Huella no las guarda ni las importa: solo enlaza. Hay un enlace por parada y uno para todo el viaje.

Lo discutimos antes de construir. Guardar fotos obligaba a reducirlas, llenar el almacenamiento del navegador y, para la nube, pasar a un plan de pago. Incrustar Instagram pide una clave de desarrollador, carga scripts de terceros y no funciona sin conexión. Y me advirtieron algo sensato: publicar unos días después del viaje, para no mostrar dónde estoy en tiempo real.

---

## 21 de noviembre

### 16. 2026-11-21 · 10:24 · Infraestructura · Lección
**«No se pudo guardar»**
Eso era todo lo que decía la app, y yo no tenía forma de saber por qué. Lo primero fue hacer que el aviso diga la causa: ahora añade el código del error entre paréntesis y el detalle sale en la consola.

Salió permission-denied. Las reglas de seguridad ya estaban publicadas, pero faltaba crear a mano mi propia invitación en la base de datos, un documento con mi correo. Es el paso 4 del README. Nunca lo había hecho en el proyecto real.

El paso 4 existe por algo.

### 17. 2026-11-21 · 10:40 · Interfaz · Lección
**No era el color**
Seleccionaba una ciudad en el mapa y no se distinguía de las demás: negra con borde negro. Pedí rojo fuerte, o incluso doble anillo. El primer intento, cambiar solo los colores, tampoco se veía.

La razón: Shenyang son dos paradas, la 3 y la 6, y el punto blanco de la 6 se dibujaba encima del rojo de la 3. Ahora la parada seleccionada vive en su propia capa, siempre arriba, con un círculo rojo y un segundo anillo.

El bug no estaba en el color. Estaba en quién se dibujaba primero.

### 18. 2026-11-21 · 10:54 · Producto · Decisión
**El inicio del viaje no existía**
Mi plan empezó a decir que el viaje arrancaba en Guangzhou, y yo vuelo a Beijing. No pudimos reproducir qué lo cambió. Lo que sí encontramos: el «inicio» no existía como dato. Era solo la primera parada de la lista, y agregar o reordenar podía cambiarlo sin que nadie lo decidiera.

Un campo aparte de «ciudad de inicio» podía contradecir la lista real, así que no lo creé. Elegir el inicio ahora gira la ruta: si es un círculo, el viaje empieza y termina en la ciudad elegida con el mismo recorrido. Pide confirmación, se puede deshacer y la parada 1 lleva la etiqueta «Inicio».

### 19. 2026-11-21 · 10:59 · Producto · Fallo
**Beijing, cuatro veces**
Busqué «beijing», la agregué y seguía apareciendo. Llegué a verla cuatro veces. Pasaba con todas las ciudades, y de paso explicó por qué mi plan tenía a Beijing repetida tantas veces.

Cada alta creaba una parada nueva y, además, un registro de ciudad, así que la lista de sugerencias repetía la ciudad una vez por cada parada. Ahora elegir una ciudad que ya está en la ruta te lleva a su parada, sin agregar nada. Lo que ya estaba duplicado en un plan guardado no se limpia solo.

### 20. 2026-11-21 · 11:25 · Investigación · Decisión
**Un restaurante que Google conoce y yo no**
Vi un restaurante en un video. En Google Maps aparece, pero ni Wikipedia ni OpenStreetMap lo tienen. La salida obvia era la API de Google Places y la descarté: la clave quedaría pública en el navegador, hay riesgo de cobro si alguien abusa y dentro de China Google no funciona sin VPN.

Ahora pego un enlace largo de Google Maps, o unas coordenadas, y el lugar entra a la parada más cercana, fuera del presupuesto y con un comentario mío para recordar por qué lo agregué. Y un detalle: en China continental Google usa un sistema de coordenadas desplazado, así que el pin cae a unos 550 metros. La app lo corrige con una aproximación. Aproximación, no exactitud.

Pendiente: probarlo con un restaurante de verdad.

### 21. 2026-11-21 · 11:33 · Interfaz · Decisión
**Primero todos verdes. Después todos ámbar**
En el mapa el color de cada pin era la prioridad. Al principio casi todo salía verde, porque 39 de las 83 atracciones traían una estrella vieja que se leía como «sí o sí». La corregí, y entonces salió todo ámbar, porque todo arranca como «si alcanza».

Cambié la regla: el color ahora es el tipo de lugar, agrupado (naturaleza verde, agua turquesa, pueblos naranja, historia marrón, cultura violeta…). Evité el rojo porque es el de la parada seleccionada. La prioridad quedó en la forma: los sí o sí son más grandes y llevan un borde dorado.

Pendiente: ver cómo se leen al aire libre y si el dorado se distingue del naranja de los pueblos.

Captura pendiente: el mapa con los colores por tipo.

### 22. 2026-11-21 · 22:54 · Interfaz · Avance
**Un pin pequeño, una ficha grande**
Los pines son chicos y yo quería ver la tarjeta al tocarlos, y saber a qué ciudad pertenece cada atracción. Ahora tocar un pin abre una ficha con el nombre, el tipo, la prioridad, el precio y mi comentario. El nombre y la foto llevan a Wikipedia. Al seleccionar una ciudad salen líneas rojas hasta cada una de sus atracciones.

Las líneas primero eran grises, finas y punteadas, y se camuflaban con las carreteras. «No las veo», dije. Luego: «en algunas sí, en otras no». Beijing y Shenyang aparecen dos veces en la ruta y las atracciones estaban guardadas solo en la primera visita. Ahora una ciudad cuenta como un lugar, no como una parada.

Captura pendiente: la ficha y las líneas.

### 23. 2026-11-21 · 23:21 · Proceso · Lección
**Una evaluación externa, ocho afirmaciones, ocho aciertos**
Pegué una evaluación externa de la app y pedí analizarla antes de creerle. Ocho afirmaciones concretas, las comprobé contra el código y todas eran ciertas. Duele un poco, pero ordena.

La primera tanda fue la de errores que afectan datos y confianza. Explorar sumaba atracciones descartadas y saltadas; ahora hay una sola regla de presupuesto para todas las pantallas. El diálogo de conflicto de sincronización tenía un «Cancelar» que sobrescribía la nube; ahora hay tres botones («Usar la nube», «Usar este dispositivo», «Decidir después») y cerrar nunca sobrescribe. Quitar algo se puede deshacer, e importar muestra una vista previa y guarda un respaldo.

El flujo con dos dispositivos reales todavía no lo probé.

### 24. 2026-11-21 · 23:26 · Interfaz · Avance
**Planear en la compu, viajar con el celular**
La segunda tanda fue el celular. El estado de guardado ya no se esconde en pantallas angostas: es un punto de color. Un mapa que ocupaba siempre el 42 % de la pantalla era un buen mapa y una mala lista, así que ahora elijo entre Lista, Ambos y Mapa. Las pestañas recuerdan mis filtros y búsquedas. Quité las opciones «Pronto» que no hacían nada. Y hay un panel de «Antes de viajar: sin conexión» que dice qué funciona sin internet y qué no.

Lo probé a 390 píxeles de ancho en el navegador. En un celular de verdad, todavía no.

### 25. 2026-11-21 · 23:51 · Producto · Decisión
**El 1 de marzo nunca fue una decisión**
Mi viaje tenía una fecha de inicio por defecto: el 1 de marzo de 2027. Nadie la eligió. Todavía no sé el mes, quizá abril. Ahora el viaje es solo «2027» y los días son «Día 1, Día 2…» hasta que ponga una fecha. Los planes que tenían esa fecha sin que yo la hubiera escrito pasan a «sin fecha».

También hay una meta: días disponibles y presupuesto objetivo en soles, y la app me dice cuánto me paso o me sobra. Elegí días y soles, no fecha de regreso, porque la fecha todavía no existe. Y el primer día de cada ciudad pierde las horas del trayecto: Changsha, tras un tren de casi tres horas, ya no vale ocho.

No es un error. Es la regla nueva.

---

## 22 de noviembre

### 26. 2026-11-22 · 00:12 · Proceso · Lección
**«Sigue rompiéndose, ¿lo revisaste?»**
La tarjeta de la parada se cortaba por la derecha. Claude ya la había probado.

La había probado como visitante, donde los campos se ven distintos, o a 1400 píxeles sin pulsar «Completar mis días». El fallo solo aparece con sesión y después de esa acción: al salir el botón «Deshacer», la fila de botones era más ancha que la tarjeta y la estiraba entera, 19 píxeles fuera del panel.

Lección: probar con sesión y después de la acción que cambia el contenido, no solo en el estado inicial.

---

## Pendientes y dudas para ti

- **Horas:** ¿las dejo con la hora real de los commits o las ordeno después de tus entradas del 18 a las 20:00? Y si quieres, puedo también ajustar las 11 ya publicadas a su hora real.
- **Capturas:** ninguna entrada tiene imagen. Las visuales (1, 5, 6, 13, 21, 22) las marqué con «Captura pendiente».
- **Entrada 3 (la imagen del mapa):** dice que no conoces al autor y que no la publicas. Confírmame si el texto te parece bien o si prefieres omitirla.
- **Voz:** las escribí siguiendo tus muestras, pero no son tuyas. Corrígelas tú.
