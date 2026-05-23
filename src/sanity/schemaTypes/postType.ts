import { DocumentTextIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

const LOCALES = [
  { title: 'Español', value: 'es' },
  { title: 'English', value: 'en' },
  { title: 'Português', value: 'pt' },
  { title: 'Quechua', value: 'qu' },
  { title: '中文', value: 'zh' },
]

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'originalLanguage',
      title: 'Idioma original',
      description: 'Idioma en el que escribiste este post. Se usará como fallback en otros idiomas.',
      type: 'string',
      options: {
        list: LOCALES,
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'es',
      validation: (rule) => rule.required(),
    }),
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
      description: 'Generado desde el título en el idioma original',
      options: {
        source: (doc: Record<string, unknown>) => {
          const lang = (doc.originalLanguage as string) || 'es'
          const title = doc.title as Record<string, string> | undefined
          return title?.[lang] ?? ''
        },
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
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
      name: 'excerpt',
      title: 'Resumen',
      type: 'localizedText',
    }),
    defineField({
      name: 'categories',
      title: 'Categorías',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: { type: 'category' } })],
    }),
    defineField({
      name: 'body',
      title: 'Contenido',
      type: 'localizedBlockContent',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      originalLanguage: 'originalLanguage',
      media: 'mainImage',
      date: 'publishedAt',
    },
    prepare({ title, originalLanguage, media, date }) {
      const lang = originalLanguage || 'es'
      const displayTitle = title?.[lang] ?? title?.es ?? 'Sin título'
      const year = date ? new Date(date).getFullYear() : ''
      const langLabel = LOCALES.find(l => l.value === lang)?.title ?? lang
      return {
        title: displayTitle,
        subtitle: `${langLabel} · ${year}`,
        media,
      }
    },
  },
})
