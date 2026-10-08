import { defineField, defineType } from 'sanity'

// ── Pulso: snapshot diario (lo escribe el cron) ───────────────────────────
// Solo totales del día. Nunca horas de dormir/despertar: dicen cuándo no estoy.

export const pulseSnapshotType = defineType({
  name: 'pulseSnapshot',
  title: 'Pulso · último registro',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Fecha (día en que me desperté, hora Lima)',
      type: 'date',
      validation: Rule => Rule.required(),
      description: 'Si no es de hoy, el sitio no muestra nada.',
    }),
    defineField({
      name: 'sleepMinutes',
      title: 'Sueño total (minutos)',
      type: 'number',
      validation: Rule => Rule.min(0).max(1440),
    }),
    defineField({
      name: 'steps',
      title: 'Pasos (día anterior)',
      type: 'number',
      validation: Rule => Rule.min(0),
    }),
    defineField({
      name: 'source',
      title: 'Fuente',
      type: 'string',
      initialValue: 'manual',
      options: {
        list: [
          { title: 'Manual', value: 'manual' },
          { title: 'Export JSON', value: 'export' },
          { title: 'Huawei Health Kit', value: 'huawei' },
          { title: 'Strava', value: 'strava' },
        ],
      },
    }),
  ],
  preview: {
    select: { date: 'date', sleep: 'sleepMinutes', steps: 'steps', source: 'source' },
    prepare({ date, sleep, steps, source }) {
      const s = typeof sleep === 'number' ? `${Math.floor(sleep / 60)}h ${sleep % 60}m` : '—'
      return { title: `${date ?? 'sin fecha'} · ${s}`, subtitle: `${steps ?? '—'} pasos · ${source ?? ''}` }
    },
  },
})

// ── Pulso: frases por rango ───────────────────────────────────────────────

const SLEEP_RANGES = [
  { title: '< 4h', value: 's1' },
  { title: '4–5h', value: 's2' },
  { title: '5–6h', value: 's3' },
  { title: '6–7.5h', value: 's4' },
  { title: '≥ 7.5h', value: 's5' },
]

const STEPS_RANGES = [
  { title: '< 1.500 · día de casa', value: 'p1' },
  { title: '1.500–3.000 · lo mínimo', value: 'p2' },
  { title: '3.000–5.000 · escritorio', value: 'p3' },
  { title: '5.000–8.000 · día normal', value: 'p4' },
  { title: '8.000–10.000 · casi meta', value: 'p5' },
  { title: '10.000–15.000 · meta cumplida', value: 'p6' },
  { title: '15.000–20.000 · hito histórico', value: 'p7' },
  { title: '≥ 20.000 · caminata loca', value: 'p8' },
]

const RANGE_LABELS: Record<string, string> = Object.fromEntries(
  [...SLEEP_RANGES, ...STEPS_RANGES].map(r => [r.value, r.title.split(' · ')[0]]),
)

export const pulsePhraseType = defineType({
  name: 'pulsePhrase',
  title: 'Pulso · frase',
  type: 'document',
  fields: [
    defineField({
      name: 'kind',
      title: 'Dato',
      type: 'string',
      validation: Rule => Rule.required(),
      initialValue: 'sleep',
      options: {
        list: [
          { title: 'Sueño', value: 'sleep' },
          { title: 'Pasos', value: 'steps' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'sleepBucket',
      title: 'Rango de sueño',
      type: 'string',
      hidden: ({ document }) => document?.kind !== 'sleep',
      validation: Rule => Rule.custom((value, { document }) =>
        document?.kind === 'sleep' && !value ? 'Elige un rango' : true),
      options: {
        list: SLEEP_RANGES,
        layout: 'radio',
      },
    }),
    defineField({
      name: 'stepsBucket',
      title: 'Rango de pasos',
      type: 'string',
      hidden: ({ document }) => document?.kind !== 'steps',
      validation: Rule => Rule.custom((value, { document }) =>
        document?.kind === 'steps' && !value ? 'Elige un rango' : true),
      options: {
        list: STEPS_RANGES,
        layout: 'radio',
      },
    }),
    defineField({
      name: 'page',
      title: 'Página',
      type: 'string',
      initialValue: 'any',
      options: {
        list: [
          { title: 'Cualquiera', value: 'any' },
          { title: 'Home', value: 'home' },
          { title: 'Contacto', value: 'contact' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'mode',
      title: 'Modo narrativo',
      type: 'string',
      initialValue: 'any',
      options: {
        list: [
          { title: 'Ambos', value: 'any' },
          { title: '🌑 Oscuro', value: 'dark' },
          { title: '☀️ Claro', value: 'light' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'text',
      title: 'Frase',
      type: 'localizedString',
      description: 'Ej: "pronóstico: respuestas cortas". Cambia una vez al día, no en cada visita.',
    }),
    defineField({
      name: 'active',
      title: 'Activa',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { text: 'text', kind: 'kind', sleepBucket: 'sleepBucket', stepsBucket: 'stepsBucket', page: 'page', mode: 'mode', active: 'active' },
    prepare({ text, kind, sleepBucket, stepsBucket, page, mode, active }) {
      const range = RANGE_LABELS[(kind === 'sleep' ? sleepBucket : stepsBucket) as string] ?? '—'
      return {
        title: text?.es || text?.en || '(sin texto)',
        subtitle: `${kind === 'sleep' ? 'sueño' : 'pasos'} ${range} · ${page ?? 'any'} · ${mode ?? 'any'}${active === false ? ' · inactiva' : ''}`,
      }
    },
  },
})
