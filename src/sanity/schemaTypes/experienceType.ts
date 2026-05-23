import { StarIcon, BookIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const experienceType = defineType({
  name: 'experience',
  title: 'Experiencia',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'cvUrl',
      title: 'Enlace para descargar CV (PDF)',
      type: 'url',
      description: 'URL directa al PDF — puede ser Google Drive, Dropbox, etc. con acceso público.',
    }),
    defineField({
      name: 'workExperience',
      title: 'Experiencia laboral',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          icon: StarIcon,
          fields: [
            defineField({ name: 'company',     title: 'Empresa / Organización', type: 'string',         validation: r => r.required() }),
            defineField({ name: 'logo',        title: 'Logo de la empresa',     type: 'image',          options: { hotspot: true } }),
            defineField({ name: 'role',        title: 'Cargo',                  type: 'localizedString' }),
            defineField({ name: 'period',      title: 'Período (ej: 2021 – presente)', type: 'string',  validation: r => r.required() }),
            defineField({ name: 'current',     title: '¿Es el trabajo actual?', type: 'boolean',        initialValue: false }),
            defineField({ name: 'description', title: 'Descripción',            type: 'localizedText'  }),
            defineField({
              name: 'tags',
              title: 'Tags',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
              options: { layout: 'tags' },
            }),
          ],
          preview: {
            select: { company: 'company', role: 'role', period: 'period', media: 'logo' },
            prepare({ company, role, period, media }) {
              return { title: company, subtitle: `${role?.es ?? ''} · ${period ?? ''}`, media }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'education',
      title: 'Estudios',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          icon: BookIcon,
          fields: [
            defineField({ name: 'institution', title: 'Institución',              type: 'string',         validation: r => r.required() }),
            defineField({ name: 'logo',        title: 'Logo de la institución',   type: 'image',          options: { hotspot: true } }),
            defineField({ name: 'degree',      title: 'Título / Programa',        type: 'localizedString' }),
            defineField({ name: 'period',      title: 'Período (ej: 2015 – 2020)', type: 'string',        validation: r => r.required() }),
            defineField({ name: 'description', title: 'Descripción',              type: 'localizedText'  }),
            defineField({
              name: 'tags',
              title: 'Tags',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
              options: { layout: 'tags' },
            }),
          ],
          preview: {
            select: { institution: 'institution', degree: 'degree', period: 'period', media: 'logo' },
            prepare({ institution, degree, period, media }) {
              return { title: institution, subtitle: `${degree?.es ?? ''} · ${period ?? ''}`, media }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Experiencia & Estudios' }
    },
  },
})
