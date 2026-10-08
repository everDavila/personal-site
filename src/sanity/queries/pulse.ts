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
  // ── Sueño · home · claro ──
  ...set('sleep', 's1', 'home', 'light', [
    ['pronóstico: no me hables antes del mediodía', 'forecast: don’t talk to me before noon'],
    ['pronóstico: funciono por inercia y cafeína', 'forecast: running on inertia and caffeine'],
    ['pronóstico: toda reunión pudo ser un correo', 'forecast: every meeting could have been an email'],
  ]),
  ...set('sleep', 's2', 'home', 'light', [
    ['pronóstico: respuestas cortas, café obligatorio', 'forecast: short answers, mandatory coffee'],
    ['pronóstico: paciencia con fecha de vencimiento', 'forecast: patience with an expiry date'],
    ['pronóstico: leo todo, entiendo la mitad', 'forecast: I read everything, understand half'],
  ]),
  ...set('sleep', 's3', 'home', 'light', [
    ['pronóstico: funcional, con asterisco', 'forecast: functional, with an asterisk'],
    ['pronóstico: aguanto hasta las cuatro', 'forecast: good until four p.m.'],
    ['pronóstico: nublado, con claros después del café', 'forecast: cloudy, clearing after coffee'],
  ]),
  ...set('sleep', 's4', 'home', 'light', [
    ['pronóstico: paciencia disponible', 'forecast: patience available'],
    ['pronóstico: hoy discuto con argumentos', 'forecast: today I argue with arguments'],
    ['pronóstico: despejado, alguna duda aislada', 'forecast: clear, with isolated doubts'],
  ]),
  ...set('sleep', 's5', 'home', 'light', [
    ['pronóstico: peligrosamente optimista', 'forecast: dangerously optimistic'],
    ['pronóstico: hoy sí leo los términos y condiciones', 'forecast: today I actually read the terms and conditions'],
    ['pronóstico: alguien va a recibir feedback constructivo', 'forecast: someone is getting constructive feedback'],
  ]),

  // ── Sueño · home · oscuro ──
  ...set('sleep', 's1', 'home', 'dark', [
    ['disponibilidad mínima', 'minimal availability'],
    ['modo ahorro de energía', 'power-saving mode'],
  ]),
  ...set('sleep', 's2', 'home', 'dark', [
    ['disponibilidad reducida', 'reduced availability'],
    ['capacidad parcial', 'partial capacity'],
  ]),
  ...set('sleep', 's3', 'home', 'dark', [
    ['operativo, con reservas', 'operational, with reservations'],
    ['rendimiento estable, sin margen', 'stable output, no margin'],
  ]),
  ...set('sleep', 's4', 'home', 'dark', [
    ['operativo', 'operational'],
    ['disponibilidad normal', 'normal availability'],
  ]),
  ...set('sleep', 's5', 'home', 'dark', [
    ['capacidad completa', 'full capacity'],
    ['disponibilidad plena', 'full availability'],
  ]),

  // ── Sueño · contacto (ambos modos) ──
  ...set('sleep', 's1', 'contact', 'any', [
    ['mejor mañana', 'tomorrow would be better'],
    ['si es urgente, que sea corto', 'if it’s urgent, keep it short'],
  ]),
  ...set('sleep', 's2', 'contact', 'any', [
    ['sé breve', 'keep it short'],
    ['al grano, por favor', 'straight to the point, please'],
  ]),
  ...set('sleep', 's3', 'contact', 'any', [
    ['buen momento, sin abusar', 'good timing, don’t push it'],
    ['escribe; el café hará el resto', 'write; coffee will do the rest'],
  ]),
  ...set('sleep', 's4', 'contact', 'any', [
    ['buen día para escribirme', 'good day to write'],
    ['hoy respondo con contexto', 'today I reply with context'],
  ]),
  ...set('sleep', 's5', 'contact', 'any', [
    ['hoy hasta leo los adjuntos', 'today I even read attachments'],
    ['hoy contesto hasta los hilos largos', 'today I even answer long threads'],
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
