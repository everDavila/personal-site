import { CogIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Configuración del sitio',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({ name: 'headline', title: 'Titular', type: 'localizedString' }),
        defineField({ name: 'sub', title: 'Subtítulo', type: 'localizedText' }),
      ],
    }),
    defineField({
      name: 'competencies',
      title: 'Competencias',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Título', type: 'localizedString', validation: r => r.required() }),
            defineField({ name: 'description', title: 'Descripción', type: 'localizedText', validation: r => r.required() }),
          ],
          preview: {
            select: { title: 'title.es' },
          },
        }),
      ],
    }),
    defineField({
      name: 'funFacts',
      title: 'Datos curiosos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Valor (ej: 10+)', type: 'string', validation: r => r.required() }),
            defineField({ name: 'label', title: 'Etiqueta', type: 'localizedString', validation: r => r.required() }),
          ],
          preview: {
            select: { title: 'value', subtitle: 'label.es' },
          },
        }),
      ],
    }),
    defineField({
      name: 'about',
      title: 'Sobre mí (resumen)',
      type: 'localizedText',
    }),
    defineField({
      name: 'social',
      title: 'Redes sociales',
      type: 'object',
      fields: [
        defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
        defineField({ name: 'github', title: 'GitHub', type: 'url' }),
        defineField({ name: 'twitter', title: 'Twitter / X', type: 'url' }),
        defineField({ name: 'email', title: 'Email', type: 'string' }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Configuración del sitio' }),
  },
})
