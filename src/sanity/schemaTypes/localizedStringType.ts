import { defineType, defineField } from 'sanity'

export const localizedStringType = defineType({
  name: 'localizedString',
  title: 'Texto localizado',
  type: 'object',
  fields: [
    defineField({ name: 'es', title: 'Español', type: 'string' }),
    defineField({ name: 'en', title: 'English', type: 'string' }),
    defineField({ name: 'pt', title: 'Português', type: 'string' }),
    defineField({ name: 'qu', title: 'Quechua', type: 'string' }),
    defineField({ name: 'zh', title: '中文', type: 'string' }),
  ],
})

export const localizedTextType = defineType({
  name: 'localizedText',
  title: 'Texto largo localizado',
  type: 'object',
  fields: [
    defineField({ name: 'es', title: 'Español', type: 'text' }),
    defineField({ name: 'en', title: 'English', type: 'text' }),
    defineField({ name: 'pt', title: 'Português', type: 'text' }),
    defineField({ name: 'qu', title: 'Quechua', type: 'text' }),
    defineField({ name: 'zh', title: '中文', type: 'text' }),
  ],
})

export const localizedBlockContentType = defineType({
  name: 'localizedBlockContent',
  title: 'Contenido localizado',
  type: 'object',
  fields: [
    defineField({ name: 'es', title: 'Español', type: 'blockContent' }),
    defineField({ name: 'en', title: 'English', type: 'blockContent' }),
    defineField({ name: 'pt', title: 'Português', type: 'blockContent' }),
    defineField({ name: 'qu', title: 'Quechua', type: 'blockContent' }),
    defineField({ name: 'zh', title: '中文', type: 'blockContent' }),
  ],
})
