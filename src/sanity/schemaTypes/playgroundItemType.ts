import { RocketIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

const DIMENSIONS = [
  { title: 'Idea',              value: 'lightbulb'     },
  { title: 'Producto',          value: 'target'        },
  { title: 'Interfaz',          value: 'layers'        },
  { title: 'Implementación',    value: 'code-2'        },
  { title: 'Infraestructura',   value: 'cloud'         },
  { title: 'Aprendizaje',       value: 'book-open'     },
  { title: 'Hito',              value: 'zap'           },
  { title: 'Investigación',     value: 'compass'       },
  { title: 'Testing',           value: 'flask-conical' },
  { title: 'Contenido',         value: 'pen-line'      },
  { title: 'Datos',             value: 'activity'      },
  { title: 'Diseño de sistema', value: 'layout-grid'   },
  { title: 'Accesibilidad',     value: 'eye'           },
  { title: 'Proceso',           value: 'route'         },
]

// Misma lista con descripción de "cuándo usar" — se muestra en Studio bajo cada opción
const DIMENSION_OPTIONS = [
  { title: 'Idea',              value: 'lightbulb',     description: 'El concepto original, el "¿y si…?"'                           },
  { title: 'Investigación',     value: 'compass',       description: 'Benchmarks, referencias, análisis previo a diseñar'           },
  { title: 'Proceso',           value: 'route',         description: 'Metodología, flujo de trabajo, cómo estás abordando el proyecto' },
  { title: 'Producto',          value: 'target',        description: 'Decisiones de alcance, dirección, estrategia'                 },
  { title: 'Interfaz',          value: 'layers',        description: 'Diseño visual, interacción, pantallas'                        },
  { title: 'Contenido',         value: 'pen-line',      description: 'UX writing, copy, naming, voz del producto'                  },
  { title: 'Diseño de sistema', value: 'layout-grid',   description: 'Tokens, componentes, patrones reutilizables'                 },
  { title: 'Implementación',    value: 'code-2',        description: 'Código, lógica, features'                                    },
  { title: 'Infraestructura',   value: 'cloud',         description: 'Deploy, auth, base de datos, servicios externos'             },
  { title: 'Testing',           value: 'flask-conical', description: 'Pruebas con usuarios, validación, QA'                        },
  { title: 'Datos',             value: 'activity',      description: 'Métricas, analytics, números que informaron decisiones'      },
  { title: 'Accesibilidad',     value: 'eye',           description: 'Contraste, a11y, lectores de pantalla'                       },
  { title: 'Aprendizaje',       value: 'book-open',     description: 'Reflexión técnica o de proceso'                              },
  { title: 'Hito',              value: 'zap',           description: 'Momento importante que merece destacarse visualmente'        },
]

const CATEGORIES = [
  { title: 'Interfaces', value: 'interfaces' },
  { title: 'Motion', value: 'motion' },
  { title: 'Systems', value: 'systems' },
  { title: 'AI', value: 'ai' },
  { title: 'Experiments', value: 'experiments' },
  { title: 'Tools', value: 'tools' },
]

const STATUSES = [
  { title: 'En proceso',  value: 'en_proceso' },
  { title: 'Completado',  value: 'completado' },
  { title: 'Archivado',   value: 'archivado'  },
  { title: 'Fallido',     value: 'fallido'    },
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
      title: 'Descripción completa (legacy)',
      description: 'Campo original — reemplazado por Idea, Porqué y Bitácora. Mantener para compatibilidad.',
      type: 'localizedBlockContent',
    }),

    // ── Secciones de detalle ─────────────────────────────────
    defineField({
      name: 'idea',
      title: '01 — La Idea',
      type: 'localizedBlockContent',
      description: 'Qué es y de dónde surge el experimento.',
    }),
    defineField({
      name: 'why',
      title: '02 — El Porqué',
      type: 'localizedBlockContent',
      description: 'Motivación, contexto, problema que busca resolver.',
    }),

    // ── Bitácora ─────────────────────────────────────────────
    defineField({
      name: 'logEntries',
      title: '03 — Bitácora',
      type: 'array',
      description: 'Línea de tiempo del experimento. Ordenar de más antiguo a más reciente.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'date',
              title: 'Fecha',
              type: 'date',
              validation: r => r.required(),
            }),
            defineField({
              name: 'time',
              title: 'Hora (HH:MM, 24h)',
              type: 'string',
              placeholder: '14:30',
            }),
            defineField({
              name: 'dimension',
              title: 'Dimensión',
              description: '¿En qué área del proyecto ocurrió este momento?',
              type: 'string',
              options: { list: DIMENSION_OPTIONS, layout: 'radio' },
              validation: r => r.required(),
            }),
            defineField({
              name: 'tag',
              title: 'Tag (tipo de momento)',
              description: 'Qué tipo de momento fue — Decisión, Fallo, Hito, etc.',
              type: 'reference',
              to: [{ type: 'logTag' }],
            }),
            defineField({
              name: 'description',
              title: 'Descripción',
              type: 'localizedText',
            }),
            defineField({
              name: 'images',
              title: 'Imágenes',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'image',
                  options: { hotspot: true },
                  fields: [
                    defineField({
                      name: 'caption',
                      title: 'Caption',
                      type: 'localizedString',
                    }),
                  ],
                }),
              ],
            }),
          ],
          preview: {
            select: {
              date:      'date',
              dimension: 'dimension',
              tagName:   'tag.name.es',
            },
            prepare({ date, dimension, tagName }) {
              const dim = DIMENSIONS.find(d => d.value === dimension)?.title ?? dimension ?? '—'
              return {
                title:    `${dim}${tagName ? ` · ${tagName}` : ''}`,
                subtitle: date ?? '',
              }
            },
          },
        }),
      ],
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
