import { CogIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Configuración del sitio',
  type: 'document',
  icon: CogIcon,
  fields: [
    // ── Hero ────────────────────────────────────────────────
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({ name: 'headline', title: 'Titular', type: 'localizedString' }),
        defineField({ name: 'sub',      title: 'Subtítulo / párrafo', type: 'localizedText' }),
        defineField({ name: 'ctaWork',  title: 'CTA — Ver trabajo (texto)', type: 'localizedString' }),
        defineField({ name: 'ctaCV',    title: 'CTA — Descargar CV (texto)', type: 'localizedString' }),
      ],
    }),

    // ── CV ──────────────────────────────────────────────────
    defineField({
      name: 'cvUrl',
      title: 'CV — Enlace de descarga (PDF)',
      type: 'url',
      description: 'URL pública al PDF del CV — Google Drive, Dropbox, etc.',
    }),

    // ── Filosofía / About homepage ───────────────────────────
    defineField({
      name: 'philosophy',
      title: 'Filosofía / Sobre mí (homepage)',
      description: 'Texto editorial breve. 2-3 oraciones. Aparece como sección en el home.',
      type: 'localizedText',
    }),

    // ── Footer ──────────────────────────────────────────────
    defineField({
      name: 'footerText',
      title: 'Texto del footer',
      description: 'Ej: "Currently designing digital systems in Peru."',
      type: 'localizedString',
    }),

    // ── Competencias ─────────────────────────────────────────
    defineField({
      name: 'competencies',
      title: 'Competencias',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title',       title: 'Título',      type: 'localizedString', validation: r => r.required() }),
            defineField({ name: 'description', title: 'Descripción', type: 'localizedText',   validation: r => r.required() }),
          ],
          preview: { select: { title: 'title.es' } },
        }),
      ],
    }),

    // ── Fun Facts ────────────────────────────────────────────
    defineField({
      name: 'funFacts',
      title: 'Datos curiosos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Valor (ej: 10+)',  type: 'string',          validation: r => r.required() }),
            defineField({ name: 'label', title: 'Etiqueta',         type: 'localizedString', validation: r => r.required() }),
          ],
          preview: { select: { title: 'value', subtitle: 'label.es' } },
        }),
      ],
    }),

    // ── About page ───────────────────────────────────────────
    defineField({
      name: 'about',
      title: 'Sobre mí (página /about)',
      type: 'localizedText',
    }),

    // ── Social ──────────────────────────────────────────────
    defineField({
      name: 'social',
      title: 'Redes sociales',
      type: 'object',
      fields: [
        defineField({ name: 'linkedin', title: 'LinkedIn',    type: 'url'    }),
        defineField({ name: 'github',   title: 'GitHub',      type: 'url'    }),
        defineField({ name: 'twitter',  title: 'Twitter / X', type: 'url'    }),
        defineField({ name: 'email',    title: 'Email',       type: 'string' }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Configuración del sitio' }),
  },
})
