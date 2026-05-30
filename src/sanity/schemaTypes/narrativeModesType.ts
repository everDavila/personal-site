import { defineField, defineType } from 'sanity'

export const narrativeModesImageType = defineType({
  name: 'narrativeModesImage',
  title: 'Imagen por modo narrativo',
  type: 'object',
  options: { collapsible: false },
  fields: [
    defineField({
      name: 'dark',
      title: '🌑 Modo Oscuro',
      type: 'image',
      options: { hotspot: true },
      description: 'Deja vacío si no quieres imagen en modo oscuro.',
    }),
    defineField({
      name: 'light',
      title: '☀️ Modo Claro',
      type: 'image',
      options: { hotspot: true },
      description: 'Deja vacío si no quieres imagen en modo claro.',
    }),
  ],
})

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
