import { RocketIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

const CATEGORIES = [
  { title: 'Interfaces', value: 'interfaces' },
  { title: 'Motion', value: 'motion' },
  { title: 'Systems', value: 'systems' },
  { title: 'AI', value: 'ai' },
  { title: 'Experiments', value: 'experiments' },
  { title: 'Tools', value: 'tools' },
]

const STATUSES = [
  { title: 'En proceso', value: 'en_proceso' },
  { title: 'Prototipo', value: 'prototipo' },
  { title: 'Archivado', value: 'archivado' },
  { title: 'Fallido', value: 'fallido' },
]

export const playgroundItemType = defineType({
  name: 'playgroundItem',
  title: 'Playground',
  type: 'document',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'localizedString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: { list: CATEGORIES, layout: 'radio' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: { list: STATUSES, layout: 'radio' },
      initialValue: 'en_proceso',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Año',
      type: 'number',
      validation: (rule) => rule.required().min(2000).max(2100),
    }),
    defineField({
      name: 'description',
      title: 'Descripción corta',
      type: 'localizedText',
    }),
    defineField({
      name: 'image',
      title: 'Imagen de preview',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Texto alternativo', type: 'localizedString' }),
      ],
    }),
    defineField({
      name: 'repoUrl',
      title: 'URL del repositorio',
      type: 'url',
    }),
    defineField({
      name: 'demoUrl',
      title: 'URL de demo / preview',
      type: 'url',
    }),
  ],
  orderings: [
    { title: 'Año (reciente)', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] },
  ],
  preview: {
    select: {
      title: 'title.es',
      category: 'category',
      status: 'status',
      media: 'image',
      year: 'year',
    },
    prepare({ title, category, status, media, year }) {
      return {
        title: title ?? 'Sin título',
        subtitle: `${category ?? ''} · ${status ?? ''} ${year ? `· ${year}` : ''}`,
        media,
      }
    },
  },
})
