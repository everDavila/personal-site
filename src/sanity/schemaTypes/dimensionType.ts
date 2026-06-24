import { defineField, defineType } from 'sanity'

export const dimensionType = defineType({
  name: 'dimension',
  title: 'Dimensiones de bitácora',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'localizedString',
      validation: r => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (clave interna)',
      type: 'slug',
      options: { source: 'name.es' },
      validation: r => r.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Ícono Lucide',
      type: 'string',
      description: 'Nombre exacto del ícono: lightbulb, compass, route, layers...',
      validation: r => r.required(),
    }),
    defineField({
      name: 'whenToUse',
      title: 'Cuándo usar',
      type: 'string',
      description: 'Se muestra como ayuda al elegir la dimensión en la bitácora.',
    }),
    defineField({
      name: 'order',
      title: 'Orden en el selector',
      type: 'number',
    }),
  ],
  orderings: [
    { title: 'Orden', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name.es', subtitle: 'whenToUse' },
    prepare({ title, subtitle }) {
      return { title: title ?? 'Sin nombre', subtitle: subtitle ?? '' }
    },
  },
})
