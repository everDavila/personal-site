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
type StepsBucket = 'low' | 'mid' | 'high'
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
  if (n < 4000) return 'low'
  if (n < 10000) return 'mid'
  return 'high'
}

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

  // ── Pasos ──
  ...set('steps', 'low',  'any', 'light', [['día de escritorio, se nota', 'desk day, it shows']]),
  ...set('steps', 'mid',  'any', 'light', [['lo justo para decir que salí', 'just enough to say I went out']]),
  ...set('steps', 'high', 'any', 'light', [['Lima recorrida, rodillas en revisión', 'Lima covered, knees under review']]),
  ...set('steps', 'low',  'any', 'dark',  [['sedentario', 'sedentary']]),
  ...set('steps', 'mid',  'any', 'dark',  [['moderado', 'moderate']]),
  ...set('steps', 'high', 'any', 'dark',  [['activo', 'active']]),
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
  return matches[dailyIndex(`${date}:${kind}:${mode}`, matches.length)]
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
  const steps = line('steps', snapshot.steps, stepsBucket, n => formatSteps(n, locale))
  if (!sleep && !steps) return null

  return { sleep, steps, labels: resolve(LABELS, locale)! }
}
