import { defineType, defineField, defineArrayMember } from 'sanity'

export const page404Type = defineType({
  name: 'page404',
  title: 'Página 404',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título principal',
      description: 'Frase grande en serif. Ej: "Esta página se perdió dentro del sistema."',
      type: 'localizedString',
    }),
    defineField({
      name: 'body',
      title: 'Descripción',
      description: 'Texto pequeño debajo del título.',
      type: 'localizedString',
    }),
    defineField({
      name: 'notes',
      title: 'Notas del sistema',
      description: 'Frases que rotan en el footer. Puedes agregar o quitar cuando quieras.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'localizedString',
          preview: { select: { title: 'es' } },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Página 404', subtitle: 'Contenido editable del error 404' }),
  },
})
