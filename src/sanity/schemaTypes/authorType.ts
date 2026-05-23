import { UserIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const authorType = defineType({
  name: 'author',
  title: 'Autor',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Foto',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'bio',
      title: 'Biografía',
      type: 'localizedText',
    }),
    defineField({
      name: 'role',
      title: 'Rol / Cargo',
      type: 'localizedString',
    }),
    defineField({
      name: 'social',
      title: 'Redes sociales',
      type: 'object',
      fields: [
        defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
        defineField({ name: 'github', title: 'GitHub', type: 'url' }),
        defineField({ name: 'twitter', title: 'Twitter / X', type: 'url' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'name', media: 'photo' },
  },
})
