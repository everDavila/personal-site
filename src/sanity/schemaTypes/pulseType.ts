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
      name: 'bucket',
      title: 'Rango',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Sueño: bajo < 5h · medio 5–7h · alto ≥ 7h. Pasos: bajo < 4.000 · medio < 10.000 · alto ≥ 10.000.',
      options: {
        list: [
          { title: 'Bajo', value: 'low' },
          { title: 'Medio', value: 'mid' },
          { title: 'Alto', value: 'high' },
        ],
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
    select: { text: 'text', kind: 'kind', bucket: 'bucket', page: 'page', mode: 'mode', active: 'active' },
    prepare({ text, kind, bucket, page, mode, active }) {
      return {
        title: text?.es || text?.en || '(sin texto)',
        subtitle: `${kind} · ${bucket} · ${page ?? 'any'} · ${mode ?? 'any'}${active === false ? ' · inactiva' : ''}`,
      }
    },
  },
})
