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

type Kind   = 'sleep' | 'steps'
type Bucket = 'low' | 'mid' | 'high'
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
  labels: { slept: string; walked: string; steps: string; beforeWriting: string }
}

// ── Rangos ────────────────────────────────────────────────────────────────

function sleepBucket(min: number): Bucket {
  if (min < 300) return 'low'
  if (min < 420) return 'mid'
  return 'high'
}

function stepsBucket(n: number): Bucket {
  if (n < 4000) return 'low'
  if (n < 10000) return 'mid'
  return 'high'
}

// ── Textos de respaldo (hasta que existan frases en Sanity) ───────────────

const LABELS: Partial<Record<Locale, Pulse['labels']>> = {
  es: { slept: 'dormí', walked: 'caminé', steps: 'pasos', beforeWriting: 'antes de escribirme' },
  en: { slept: 'slept', walked: 'walked', steps: 'steps', beforeWriting: 'before you write' },
  pt: { slept: 'dormi', walked: 'caminhei', steps: 'passos', beforeWriting: 'antes de me escrever' },
  zh: { slept: '睡了', walked: '走了', steps: '步', beforeWriting: '写信之前' },
}

const FALLBACK_PHRASES: Phrase[] = [
  // Sueño · home
  { kind: 'sleep', bucket: 'low',  page: 'home', mode: 'light', text: { es: 'pronóstico: respuestas cortas, café obligatorio', en: 'forecast: short answers, mandatory coffee' } },
  { kind: 'sleep', bucket: 'mid',  page: 'home', mode: 'light', text: { es: 'pronóstico: paciencia disponible', en: 'forecast: patience available' } },
  { kind: 'sleep', bucket: 'high', page: 'home', mode: 'light', text: { es: 'pronóstico: peligrosamente optimista', en: 'forecast: dangerously optimistic' } },
  { kind: 'sleep', bucket: 'low',  page: 'home', mode: 'dark',  text: { es: 'disponibilidad reducida', en: 'reduced availability' } },
  { kind: 'sleep', bucket: 'mid',  page: 'home', mode: 'dark',  text: { es: 'operativo', en: 'operational' } },
  { kind: 'sleep', bucket: 'high', page: 'home', mode: 'dark',  text: { es: 'capacidad completa', en: 'full capacity' } },
  // Sueño · contacto
  { kind: 'sleep', bucket: 'low',  page: 'contact', mode: 'any', text: { es: 'sé breve', en: 'keep it short' } },
  { kind: 'sleep', bucket: 'mid',  page: 'contact', mode: 'any', text: { es: 'buen momento, sin abusar', en: 'good timing, don’t push it' } },
  { kind: 'sleep', bucket: 'high', page: 'contact', mode: 'any', text: { es: 'hoy hasta leo los adjuntos', en: 'today I even read attachments' } },
  // Pasos
  { kind: 'steps', bucket: 'low',  page: 'any', mode: 'light', text: { es: 'día de escritorio, se nota', en: 'desk day, it shows' } },
  { kind: 'steps', bucket: 'mid',  page: 'any', mode: 'light', text: { es: 'lo justo para decir que salí', en: 'just enough to say I went out' } },
  { kind: 'steps', bucket: 'high', page: 'any', mode: 'light', text: { es: 'Lima recorrida, rodillas en revisión', en: 'Lima covered, knees under review' } },
  { kind: 'steps', bucket: 'low',  page: 'any', mode: 'dark',  text: { es: 'sedentario', en: 'sedentary' } },
  { kind: 'steps', bucket: 'mid',  page: 'any', mode: 'dark',  text: { es: 'moderado', en: 'moderate' } },
  { kind: 'steps', bucket: 'high', page: 'any', mode: 'dark',  text: { es: 'activo', en: 'active' } },
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
    kind, bucket,
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
