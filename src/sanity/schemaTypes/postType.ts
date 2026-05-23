import { DocumentTextIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
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
      description: 'Generado desde el título en inglés',
      options: { source: 'title.en' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
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
      title: 'title.es',
      media: 'mainImage',
      date: 'publishedAt',
    },
    prepare({ title, media, date }) {
      const year = date ? new Date(date).getFullYear() : ''
      return { title: title ?? 'Sin título', subtitle: `${year}`, media }
    },
  },
})
