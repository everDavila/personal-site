import { defineField, defineType } from 'sanity'

export const narrativeModesTextType = defineType({
  name: 'narrativeModesText',
  title: 'Texto por modo narrativo',
  type: 'object',
  options: { collapsible: false },
  fields: [
    defineField({
      name: 'dark',
      title: '🌑 Modo Oscuro — Profesional',
      type: 'localizedText',
      description: 'Tono directo, técnico, enfocado en el trabajo.',
    }),
    defineField({
      name: 'light',
      title: '☀️ Modo Claro — Lúdico',
      type: 'localizedText',
      description: 'Tono personal, curioso, más cercano y humano.',
    }),
  ],
})
