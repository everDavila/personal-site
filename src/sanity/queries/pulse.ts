import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import type { Locale } from '@/lib/i18n'
import type { NarrativeMode } from '@/lib/mode'

// ── Tipos ─────────────────────────────────────────────────────────────────

export type PulseSnapshot = {
  date: string                // YYYY-MM-DD, día en que me desperté (Lima)
  sleepMinutes: number | null
  steps: number | null
  source: string
}

type Kind = 'sleep' | 'steps'
// Sueño en cinco rangos: no es lo mismo 3h que 4h 50m
type SleepBucket = 's1' | 's2' | 's3' | 's4' | 's5'
// Pasos en ocho rangos: la meta de la app es 10k, 15k y 20k son hitos raros
type StepsBucket = 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7' | 'p8'
type Bucket = SleepBucket | StepsBucket
export type PulsePage = 'home' | 'contact'

type LocalizedText = Partial<Record<Locale, string>>

type Phrase = {
  kind: Kind
  bucket: Bucket
  page: 'any' | PulsePage
  mode: 'any' | NarrativeMode
  text: LocalizedText
}

export type PulseLine = { value: string; phrase: Record<NarrativeMode, string | null> }

export type Pulse = {
  sleep: PulseLine | null
  steps: PulseLine | null
  // {v} se reemplaza por el valor: el orden de las palabras cambia según el idioma
  labels: { slept: string; walked: string; beforeWriting: string }
}

// ── Rangos ────────────────────────────────────────────────────────────────

function sleepBucket(min: number): SleepBucket {
  if (min < 240) return 's1'   // < 4h
  if (min < 300) return 's2'   // 4–5h
  if (min < 360) return 's3'   // 5–6h
  if (min < 450) return 's4'   // 6–7.5h
  return 's5'                  // ≥ 7.5h
}

function stepsBucket(n: number): StepsBucket {
  if (n < 1500) return 'p1'    // día de casa
  if (n < 3000) return 'p2'    // lo mínimo
  if (n < 5000) return 'p3'    // escritorio
  if (n < 8000) return 'p4'    // día normal con salida
  if (n < 10000) return 'p5'   // casi meta
  if (n < 15000) return 'p6'   // meta cumplida (10k exactos cuentan)
  if (n < 20000) return 'p7'   // hito histórico
  return 'p8'                  // caminata de todo el día
}

// Menos que esto es más probable que sea un día sin pulsera que un día sin moverse
const MIN_STEPS = 300

// ── Textos de respaldo (hasta que existan frases en Sanity) ───────────────

const LABELS: Partial<Record<Locale, Pulse['labels']>> = {
  es: { slept: 'dormí {v}', walked: 'ayer caminé {v} pasos', beforeWriting: 'antes de escribirme' },
  en: { slept: 'slept {v}', walked: 'walked {v} steps yesterday', beforeWriting: 'before you write' },
  pt: { slept: 'dormi {v}', walked: 'ontem caminhei {v} passos', beforeWriting: 'antes de me escrever' },
  zh: { slept: '睡了 {v}', walked: '昨天走了 {v} 步', beforeWriting: '写信之前' },
}

type Pair = [es: string, en: string]

const set = (kind: Kind, bucket: Bucket, page: Phrase['page'], mode: Phrase['mode'], pairs: Pair[]): Phrase[] =>
  pairs.map(([es, en]) => ({ kind, bucket, page, mode, text: { es, en } }))

const FALLBACK_PHRASES: Phrase[] = [
  // Matriz de Ever (2026-10-08). Minúscula inicial y sin punto: la línea entera es metadata.

  // ── Sueño · home · claro (ironía funcional) ──
  ...set('sleep', 's1', 'home', 'light', [
    ['pronóstico: no me hables antes del mediodía', 'forecast: don’t talk to me before noon'],
    ['pronóstico: funciono por pura inercia y cafeína', 'forecast: running on pure inertia and caffeine'],
    ['pronóstico: toda reunión pudo ser un correo', 'forecast: every meeting could have been an email'],
    ['pronóstico: en pie por puro rencor biológico', 'forecast: upright out of pure biological spite'],
  ]),
  ...set('sleep', 's2', 'home', 'light', [
    ['pronóstico: paciencia con fecha de vencimiento', 'forecast: patience with an expiry date'],
    ['pronóstico: leo todo, entiendo la mitad', 'forecast: I read everything, understand half'],
    ['pronóstico: entiendo los requerimientos, no prometo empatía', 'forecast: I get the requirements, no promises on empathy'],
    ['pronóstico: funcional, pero con advertencia de rendimiento', 'forecast: functional, with a performance warning'],
  ]),
  ...set('sleep', 's3', 'home', 'light', [
    ['pronóstico: funcional, entre muchas comillas', 'forecast: functional, in heavy quotation marks'],
    ['pronóstico: aguanto con dignidad hasta las cuatro', 'forecast: holding up with dignity until four'],
    ['pronóstico: nublado, con claros después del café', 'forecast: cloudy, clearing after coffee'],
    ['pronóstico: el sentido del humor se activa a las 3:00 p.m.', 'forecast: sense of humor activates at 3:00 p.m.'],
  ]),
  ...set('sleep', 's4', 'home', 'light', [
    ['pronóstico: paciencia disponible y criterio despierto', 'forecast: patience available, judgment awake'],
    ['pronóstico: hoy discuto con argumentos sólidos', 'forecast: today I argue with solid arguments'],
    ['pronóstico: despejado, con alguna duda aislada', 'forecast: clear, with isolated doubts'],
    ['pronóstico: buen día para alinear producto y diseño sin fricción', 'forecast: good day to align product and design without friction'],
  ]),
  ...set('sleep', 's5', 'home', 'light', [
    ['pronóstico: peligrosamente optimista; desconfíen', 'forecast: dangerously optimistic; be suspicious'],
    ['pronóstico: hoy sí leo los términos y condiciones', 'forecast: today I actually read the terms and conditions'],
    ['pronóstico: alguien va a recibir feedback constructivo', 'forecast: someone is getting constructive feedback'],
    ['pronóstico: capaz de resolver problemas que nadie me pidió arreglar', 'forecast: able to solve problems nobody asked me to fix'],
  ]),

  // ── Sueño · home · oscuro (mínimo esfuerzo / crudo) ──
  ...set('sleep', 's1', 'home', 'dark', [
    ['disponibilidad mínima', 'minimal availability'],
    ['modo ahorro de energía extremo', 'extreme power-saving mode'],
    ['no compilo ni bajo amenaza', 'won’t compile, not even under threat'],
  ]),
  ...set('sleep', 's2', 'home', 'dark', [
    ['disponibilidad reducida', 'reduced availability'],
    ['modo degradación controlada', 'controlled degradation mode'],
    ['capacidad parcial al 50%', 'partial capacity at 50%'],
    ['respuestas limitadas a sí y no', 'answers limited to yes and no'],
  ]),
  ...set('sleep', 's3', 'home', 'dark', [
    ['operativo, con reservas', 'operational, with reservations'],
    ['rendimiento estándar sin fuegos artificiales', 'standard performance, no fireworks'],
    ['procesando en segundo plano', 'processing in the background'],
    ['tolerancia a la ambigüedad en 20%', 'ambiguity tolerance at 20%'],
  ]),
  ...set('sleep', 's4', 'home', 'dark', [
    ['disponibilidad normal', 'normal availability'],
    ['todos los servicios en línea', 'all services online'],
    ['capacidad para refactorizar ideas complejas', 'capacity to refactor complex ideas'],
    ['lucidez en niveles óptimos', 'clarity at optimal levels'],
  ]),
  ...set('sleep', 's5', 'home', 'dark', [
    ['capacidad completa', 'full capacity'],
    ['disponibilidad plena sin peros', 'full availability, no buts'],
    ['demasiada lucidez para un solo backlog', 'too much clarity for a single backlog'],
    ['modo resolutivo sin fricción', 'frictionless problem-solving mode'],
  ]),

  // ── Sueño · contacto (filtro humano, ambos modos) ──
  ...set('sleep', 's1', 'contact', 'any', [
    ['mejor mañana; si es urgente, que sea muy corto', 'tomorrow is better; if urgent, keep it very short'],
    ['déjame un mensaje; respondo cuando vuelva a ser persona', 'leave a message; I’ll reply once I’m a person again'],
    ['si me llamas, asumo que algo se está quemando', 'if you call, I’ll assume something is on fire'],
  ]),
  ...set('sleep', 's2', 'contact', 'any', [
    ['sé breve y al grano, por favor', 'brief and to the point, please'],
    ['redacta pensando que cada palabra te cuesta diez dólares', 'write as if every word costs you ten dollars'],
    ['si es reunión: cámara apagada, por el bien de todos', 'if it’s a meeting: camera off, for everyone’s sake'],
  ]),
  ...set('sleep', 's3', 'contact', 'any', [
    ['escribe al punto; el café ya está haciendo efecto', 'get to the point; the coffee is kicking in'],
    ['acepto feedback estructurado, no monólogos', 'structured feedback welcome, monologues not'],
    ['buen momento para coordinar sin dramatismo', 'good time to coordinate, no drama'],
  ]),
  ...set('sleep', 's4', 'contact', 'any', [
    ['buen día para escribirme; hoy respondo con contexto', 'good day to write; today I reply with context'],
    ['excelente momento para destrabar el proyecto', 'great time to unblock the project'],
    ['respondo con capturas, notas y diagramas', 'I reply with screenshots, notes and diagrams'],
  ]),
  ...set('sleep', 's5', 'contact', 'any', [
    ['hoy hasta leo los adjuntos de cuarenta páginas', 'today I even read forty-page attachments'],
    ['hoy contesto hasta los hilos muertos de mensajes', 'today I even answer dead message threads'],
    ['aprovecha el impulso antes de que se me pase', 'use the momentum before it wears off'],
  ]),

  // ── Pasos · matriz de Ever (2026-10-08). Van detrás de "ayer caminé N pasos ·": nada de "hoy" ni "ahora" ──

  // Tierra · oscuro (crudo, terrestre: misma voz que "no compilo ni bajo amenaza")
  ...set('steps', 'p1', 'any', 'dark', [
    ['físicamente fusionado con la silla', 'physically fused with the chair'],
    ['del sofá a la cafetera y de regreso', 'couch to coffee maker and back'],
    ['ganó la casa por goleada', 'the house won by a landslide'],
    ['radio de acción limitado a la cocina', 'range of action limited to the kitchen'],
  ]),
  ...set('steps', 'p2', 'any', 'dark', [
    ['salí lo justo para que no sospecharan', 'went out just enough to avoid suspicion'],
    ['paseo corto con trámite de por medio', 'short walk with an errand in the middle'],
    ['movilidad básica de supervivencia urbana', 'basic urban survival mobility'],
    ['salí solo para recordar que hay sol', 'went out just to remember the sun exists'],
  ]),
  ...set('steps', 'p3', 'any', 'dark', [
    ['ganó el escritorio otra vez', 'the desk won again'],
    ['la silla me reclama con insistencia', 'the chair keeps calling me back'],
    ['entre tazas de café y pendientes del backlog', 'between coffee cups and backlog items'],
    ['salida rápida a tomar aire y volver a la cueva', 'quick trip for air, then back to the cave'],
  ]),
  ...set('steps', 'p4', 'any', 'dark', [
    ['hubo calle, vereda y aire fresco', 'there was street, sidewalk and fresh air'],
    ['caminata estratégica para desarmar bloqueos', 'strategic walk to dismantle blockers'],
    ['la silla puede esperar su turno', 'the chair can wait its turn'],
    ['pasos suficientes para justificar mi dosis de café', 'enough steps to justify my coffee dose'],
  ]),
  ...set('steps', 'p5', 'any', 'dark', [
    ['sentarme habría sido un error táctico', 'sitting down would have been a tactical error'],
    ['faltó solo una vuelta a la manzana', 'just one more lap around the block'],
    ['resolví media arquitectura caminando', 'solved half an architecture while walking'],
    ['la meta quedó a la vuelta de la esquina', 'the goal was just around the corner'],
  ]),
  ...set('steps', 'p6', 'any', 'dark', [
    ['suela y trámite completados', 'soles and errands, done'],
    ['las piernas cumplieron su jornada legal', 'the legs worked their legal shift'],
    ['el reloj cree que soy atleta; solo fui por pan a otro distrito', 'the watch thinks I’m an athlete; I just went for bread in another district'],
    ['esquivé media ciudad y tres conversaciones', 'dodged half the city and three conversations'],
  ]),
  ...set('steps', 'p7', 'any', 'dark', [
    ['salí a caminar y se me fue de las manos', 'went for a walk and it got out of hand'],
    ['esto definitivamente no pasa todos los días', 'this definitely doesn’t happen every day'],
    ['me gané el derecho vitalicio al ascensor', 'earned lifetime elevator rights'],
    ['caminata que debió haber sido en transporte', 'a walk that should have been a bus ride'],
  ]),
  ...set('steps', 'p8', 'any', 'dark', [
    ['rodillas en mantenimiento de emergencia', 'knees under emergency maintenance'],
    ['debí volver en taxi hace diez kilómetros', 'should have taken a taxi ten kilometers ago'],
    ['o huía de una reunión o cerraba cinco trámites', 'either fleeing a meeting or closing five errands'],
    ['un poco más y cruzaba la frontera', 'a bit more and I’d have crossed the border'],
  ]),

  // Orbital · claro (bitácora del astronauta, el personaje del modo claro)
  ...set('steps', 'p1', 'any', 'light', [
    ['en órbita doméstica', 'in domestic orbit'],
    ['sin salir de la base lunar', 'never left the lunar base'],
    ['misión principal: buscar café', 'primary mission: find coffee'],
    ['propulsores en apagado preventivo', 'thrusters in preventive shutdown'],
  ]),
  ...set('steps', 'p2', 'any', 'light', [
    ['despegue breve', 'brief liftoff'],
    ['exploración local sin riesgos', 'low-risk local exploration'],
    ['impulso mínimo de escape', 'minimum escape thrust'],
    ['operando a tiro de piedra de la base', 'operating a stone’s throw from base'],
  ]),
  ...set('steps', 'p3', 'any', 'light', [
    ['órbita de escritorio fija', 'fixed desk orbit'],
    ['breve paseo hasta la escotilla', 'brief walk to the hatch'],
    ['gravedad de oficina al máximo nivel', 'office gravity at maximum'],
    ['telemetría estable, desplazamientos mínimos', 'stable telemetry, minimal displacement'],
  ]),
  ...set('steps', 'p4', 'any', 'light', [
    ['fuera de la estación espacial', 'outside the space station'],
    ['ruta de reconocimiento en curso', 'reconnaissance route in progress'],
    ['misión activa en terreno irregular', 'active mission on uneven terrain'],
    ['dispersión mental reducida por movimiento', 'mental drift reduced by movement'],
  ]),
  ...set('steps', 'p5', 'any', 'light', [
    ['destino a la vista del radar', 'destination on radar'],
    ['maniobra de aproximación final', 'final approach maneuver'],
    ['último impulso de los propulsores', 'last thruster burn'],
    ['aterrizaje pendiente de confirmación', 'landing pending confirmation'],
  ]),
  ...set('steps', 'p6', 'any', 'light', [
    ['misión cumplida sin novedad', 'mission complete, nothing to report'],
    ['destino principal alcanzado', 'primary destination reached'],
    ['secuencia de reingreso a la base', 're-entry sequence to base'],
    ['batería física en balance óptimo', 'physical battery at optimal balance'],
  ]),
  ...set('steps', 'p7', 'any', 'light', [
    ['fuera de la órbita calculada', 'outside the calculated orbit'],
    ['misión extendida en territorio ajeno', 'extended mission in foreign territory'],
    ['entrada excepcional en la bitácora', 'exceptional logbook entry'],
    ['alerta: entrando en reserva de combustible', 'alert: entering fuel reserve'],
  ]),
  ...set('steps', 'p8', 'any', 'light', [
    ['me pasé de planeta por error de cálculo', 'overshot the planet by miscalculation'],
    ['solicito cápsula de rescate inmediata', 'requesting immediate rescue capsule'],
    ['desgaste estructural severo en el hardware', 'severe structural wear on the hardware'],
    ['deriva cósmica sin retorno asistido', 'cosmic drift, no assisted return'],
  ]),
]

const FALLBACK_LOCALES: Record<Locale, Locale[]> = {
  es: ['es', 'en'],
  en: ['en', 'es'],
  pt: ['pt', 'es', 'en'],
  qu: ['qu', 'es', 'en'],
  zh: ['zh', 'en', 'es'],
}

function resolve<T>(map: Partial<Record<Locale, T>>, locale: Locale): T | null {
  for (const l of FALLBACK_LOCALES[locale]) {
    const v = map[l]
    if (typeof v === 'string' ? v.trim() : v) return v as T
  }
  return null
}

// ── Fechas (siempre hora Lima) ────────────────────────────────────────────

function limaDate(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima' }).format(new Date())
}

/** Fresco = de hoy. "dormí 4h" sin fecha se lee como anoche: un registro viejo mentiría. */
function isFresh(date: string): boolean {
  return date === limaDate()
}

// Semilla estable por día: la frase no cambia en cada recarga
function dailyIndex(seed: string, length: number): number {
  let h = 0
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h % length
}

// ── Formato ───────────────────────────────────────────────────────────────

function formatSleep(min: number): string {
  return `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, '0')}m`
}

function formatSteps(n: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'qu' ? 'es' : locale).format(n)
}

// ── Sanity ────────────────────────────────────────────────────────────────

const snapshotQuery = groq`
  *[_id == "pulseSnapshot"][0] {
    date, sleepMinutes, steps, "source": coalesce(source, "manual")
  }
`

const phrasesQuery = groq`
  *[_type == "pulsePhrase" && active != false] {
    kind,
    "bucket": select(kind == "sleep" => sleepBucket, stepsBucket),
    "page": coalesce(page, "any"),
    "mode": coalesce(mode, "any"),
    text
  }
`

// Solo en desarrollo, para ver el diseño sin datos reales
const MOCK: Omit<PulseSnapshot, 'date'> = { sleepMinutes: 292, steps: 2140, source: 'mock' }

function pickPhrase(
  pool: Phrase[],
  kind: Kind,
  bucket: Bucket,
  page: PulsePage,
  mode: NarrativeMode,
  locale: Locale,
  date: string,
): string | null {
  const matches = pool
    .filter(p => p.kind === kind && p.bucket === bucket)
    .filter(p => p.page === page || p.page === 'any')
    .filter(p => p.mode === mode || p.mode === 'any')
    .map(p => resolve(p.text, locale))
    .filter((t): t is string => !!t)
  if (matches.length === 0) return null
  // Sin el modo en la semilla: una frase "ambos modos" no cambia al alternar el toggle
  return matches[dailyIndex(`${date}:${kind}`, matches.length)]
}

// ── API pública ───────────────────────────────────────────────────────────

export async function getPulse(page: PulsePage, locale: Locale): Promise<Pulse | null> {
  const [stored, sanityPhrases] = await Promise.all([
    client.fetch<PulseSnapshot | null>(snapshotQuery, {}, { next: { revalidate: 0 } }),
    client.fetch<Phrase[]>(phrasesQuery, {}, { next: { revalidate: 0 } }),
  ])

  const snapshot = stored ?? (process.env.NODE_ENV !== 'production' ? { ...MOCK, date: limaDate() } : null)
  if (!snapshot?.date || !isFresh(snapshot.date)) return null

  // Si hay frases en Sanity para un dato, mandan ellas; si no, el respaldo
  const poolFor = (kind: Kind) =>
    sanityPhrases.some(p => p.kind === kind) ? sanityPhrases : FALLBACK_PHRASES

  const line = (kind: Kind, raw: number | null, bucketOf: (n: number) => Bucket, fmt: (n: number) => string): PulseLine | null => {
    if (raw == null) return null
    const bucket = bucketOf(raw)
    const pool   = poolFor(kind)
    return {
      value: fmt(raw),
      phrase: {
        dark:  pickPhrase(pool, kind, bucket, page, 'dark',  locale, snapshot.date),
        light: pickPhrase(pool, kind, bucket, page, 'light', locale, snapshot.date),
      },
    }
  }

  const sleep = line('sleep', snapshot.sleepMinutes, sleepBucket, formatSleep)
  const stepsRaw = snapshot.steps != null && snapshot.steps >= MIN_STEPS ? snapshot.steps : null
  const steps = line('steps', stepsRaw, stepsBucket, n => formatSteps(n, locale))
  if (!sleep && !steps) return null

  return { sleep, steps, labels: resolve(LABELS, locale)! }
}
