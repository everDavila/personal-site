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
      name: 'slug',
      title: 'Slug canónico (legado)',
      type: 'slug',
      description: 'Slug original — mantener para compatibilidad. Usar "Slugs por idioma" para ítems nuevos.',
      options: { source: 'title.es' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'localizedSlug',
      title: 'Slugs por idioma',
      description: 'URL amigable por idioma. Otros idiomas usan el slug en español como fallback.',
      type: 'object',
      fields: [
        defineField({
          name: 'es',
          title: 'Español',
          type: 'slug',
          options: {
            source: (doc: Record<string, unknown>) =>
              (doc.title as Record<string, string>)?.es ?? '',
          },
        }),
        defineField({
          name: 'en',
          title: 'English',
          type: 'slug',
          options: {
            source: (doc: Record<string, unknown>) =>
              (doc.title as Record<string, string>)?.en ?? '',
          },
        }),
      ],
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
      name: 'body',
      title: 'Descripción completa',
      type: 'localizedBlockContent',
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
    defineField({
      name: 'hidden',
      title: 'Ocultar del sitio',
      type: 'boolean',
      description: 'Si está activado, este experimento no aparece en el laboratorio.',
      initialValue: false,
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
      hidden: 'hidden',
    },
    prepare({ title, category, status, media, year, hidden }) {
      return {
        title: (hidden ? '⊘ ' : '') + (title ?? 'Sin título'),
        subtitle: `${category ?? ''} · ${status ?? ''} ${year ? `· ${year}` : ''}`,
        media,
      }
    },
  },
})
