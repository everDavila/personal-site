import { defineField, defineType } from 'sanity'

export const narrativeModesStringType = defineType({
  name: 'narrativeModesString',
  title: 'Título por modo narrativo',
  type: 'object',
  options: { collapsible: false },
  fields: [
    defineField({ name: 'dark',  title: '🌑 Modo Oscuro — Lúdico',      type: 'localizedString' }),
    defineField({ name: 'light', title: '☀️ Modo Claro — Profesional',  type: 'localizedString' }),
  ],
})

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
      title: '🌑 Modo Oscuro — Lúdico',
      type: 'localizedText',
      description: 'Tono aventurero, curioso, personal. El astronauta en el espacio.',
    }),
    defineField({
      name: 'light',
      title: '☀️ Modo Claro — Profesional',
      type: 'localizedText',
      description: 'Tono directo, técnico, enfocado en el trabajo.',
    }),
  ],
})
