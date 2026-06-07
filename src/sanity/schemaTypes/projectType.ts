import { CaseIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Proyecto',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'localizedString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title.en' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Cliente / Institución',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Rol',
      type: 'localizedString',
    }),
    defineField({
      name: 'year',
      title: 'Año',
      type: 'number',
      validation: (rule) => rule.min(2000).max(2100),
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagen principal',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Texto alternativo', type: 'localizedString' }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Galería',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Texto alternativo', type: 'localizedString' }),
            defineField({ name: 'caption', title: 'Caption', type: 'localizedString' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'summary',
      title: 'Resumen corto',
      type: 'localizedText',
    }),
    defineField({
      name: 'body',
      title: 'Descripción completa',
      type: 'localizedBlockContent',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'featured',
      title: 'Destacado en home',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'hidden',
      title: 'Ocultar del sitio',
      type: 'boolean',
      description: 'Si está activado, este proyecto no aparece en ninguna lista ni es accesible por URL.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title.es',
      client: 'client',
      media: 'mainImage',
      year: 'year',
      hidden: 'hidden',
    },
    prepare({ title, client, media, year, hidden }) {
      return {
        title: (hidden ? '⊘ ' : '') + (title ?? 'Sin título'),
        subtitle: `${client ?? ''} ${year ? `· ${year}` : ''}`,
        media,
      }
    },
  },
})
