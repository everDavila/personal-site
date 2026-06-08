import { TagIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

const COLOR_KEYS = [
  { title: 'Hipótesis — violeta',     value: 'hipotesis'  },
  { title: 'Decisión — verde',        value: 'decision'   },
  { title: 'Exploración — azul',      value: 'exploracion'},
  { title: 'Avance — ámbar',          value: 'avance'     },
  { title: 'Completado — verde agua', value: 'completado' },
  { title: 'Lección — ocre',          value: 'leccion'    },
  { title: 'Hito — rosa',             value: 'hito'       },
  { title: 'Fallo — rojo apagado',    value: 'fallo'      },
  { title: 'Pivote — magenta',        value: 'pivote'     },
  { title: 'Insight — amarillo',      value: 'insight'    },
  { title: 'Duda — gris azulado',     value: 'duda'       },
  { title: 'Pausa — gris neutro',     value: 'pausa'      },
  { title: 'Validación — verde claro',value: 'validacion' },
]

export const logTagType = defineType({
  name: 'logTag',
  title: 'Tags de bitácora',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre del tag',
      type: 'localizedString',
      validation: r => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (clave interna)',
      type: 'slug',
      description: 'Identificador único para CSS y filtros. Ej: hipotesis, decision.',
      options: { source: 'name.es' },
      validation: r => r.required(),
    }),
    defineField({
      name: 'colorKey',
      title: 'Color',
      type: 'string',
      description: 'Determina el color de la etiqueta en la bitácora.',
      options: { list: COLOR_KEYS, layout: 'radio' },
      validation: r => r.required(),
    }),
  ],
  preview: {
    select: { title: 'name.es', subtitle: 'colorKey' },
    prepare({ title, subtitle }) {
      return { title: title ?? 'Sin nombre', subtitle }
    },
  },
})
