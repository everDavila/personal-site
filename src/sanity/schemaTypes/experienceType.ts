import { StarIcon, BookIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const experienceType = defineType({
  name: 'experience',
  title: 'Experiencia',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'workExperience',
      title: 'Experiencia laboral',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          icon: StarIcon,
          fields: [
            defineField({ name: 'company',     title: 'Empresa / Organización', type: 'string', validation: r => r.required() }),
            defineField({ name: 'role',        title: 'Cargo',                 type: 'localizedString' }),
            defineField({ name: 'period',      title: 'Período (ej: 2021 – presente)', type: 'string', validation: r => r.required() }),
            defineField({ name: 'current',     title: '¿Es el trabajo actual?', type: 'boolean', initialValue: false }),
            defineField({ name: 'description', title: 'Descripción',           type: 'localizedText' }),
          ],
          preview: {
            select: { company: 'company', role: 'role', period: 'period' },
            prepare({ company, role, period }) {
              return { title: company, subtitle: `${role?.es ?? ''} · ${period ?? ''}` }
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
            defineField({ name: 'institution', title: 'Institución',           type: 'string', validation: r => r.required() }),
            defineField({ name: 'degree',      title: 'Título / Programa',     type: 'localizedString' }),
            defineField({ name: 'period',      title: 'Período (ej: 2015 – 2020)', type: 'string', validation: r => r.required() }),
            defineField({ name: 'description', title: 'Descripción',           type: 'localizedText' }),
          ],
          preview: {
            select: { institution: 'institution', degree: 'degree', period: 'period' },
            prepare({ institution, degree, period }) {
              return { title: institution, subtitle: `${degree?.es ?? ''} · ${period ?? ''}` }
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
