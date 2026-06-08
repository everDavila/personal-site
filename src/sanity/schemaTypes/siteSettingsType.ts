import { CogIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Configuración del sitio',
  type: 'document',
  icon: CogIcon,

  groups: [
    { name: 'home',    title: 'Home',     default: true },
    { name: 'about',   title: 'Enfoque'                 },
    { name: 'contact', title: 'Hablemos'                },
    { name: 'pages',   title: 'Páginas'                 },
    { name: 'global',  title: 'Global'                  },
  ],

  fields: [
    // ── HOME ────────────────────────────────────────────────
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'home',
      fields: [
        defineField({ name: 'roleLabel',     title: 'Etiqueta de rol (sobre el titular)', type: 'localizedString' }),
        defineField({ name: 'headline',      title: '🌑 Titular — Modo Oscuro (profesional)', type: 'localizedString' }),
        defineField({ name: 'headlineLight', title: '☀️ Titular — Modo Claro (lúdico)',       type: 'localizedString' }),
        defineField({ name: 'sub',           title: '🌑 Subtítulo — Modo Oscuro', type: 'localizedText' }),
        defineField({ name: 'subLight',      title: '☀️ Subtítulo — Modo Claro', type: 'localizedText' }),
        defineField({ name: 'ctaWork',       title: 'CTA — Ver trabajo (texto)', type: 'localizedString' }),
        defineField({ name: 'ctaCV',         title: 'CTA — Descargar CV (texto)', type: 'localizedString' }),
        defineField({ name: 'heroImage',     title: '🌑 Imagen hero — Modo Oscuro', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'heroImageLight',title: '☀️ Imagen hero — Modo Claro',  type: 'image', options: { hotspot: true } }),
      ],
    }),

    defineField({
      name: 'philosophy',
      title: 'Filosofía (sección home)',
      type: 'narrativeModesText',
      group: 'home',
      description: 'Texto de la sección filosófica del home. Una versión por modo.',
    }),

    defineField({
      name: 'homeAbout',
      title: 'Sobre mí (sección home)',
      type: 'narrativeModesText',
      group: 'home',
      description: 'Texto del bloque "Sobre mí" en el home. Una versión por modo narrativo.',
    }),

    defineField({
      name: 'labCount',
      title: 'Lab — experimentos visibles en home',
      type: 'number',
      group: 'home',
      description: 'Cuántos experimentos se muestran en la sección Lab del home (por defecto: 3).',
      initialValue: 3,
      validation: r => r.min(1).max(10).integer(),
    }),

    defineField({
      name: 'seoHome',
      title: 'SEO — Home',
      type: 'object',
      group: 'home',
      description: 'Lo que aparece en Google cuando buscan tu nombre o sitio.',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'title',       title: 'Título (50–60 car.)',       type: 'localizedString' }),
        defineField({ name: 'description', title: 'Descripción (150–160 car.)', type: 'localizedText'   }),
      ],
    }),

    // ── ENFOQUE / ABOUT ──────────────────────────────────────
    defineField({
      name: 'about',
      title: 'Bio — página /enfoque',
      type: 'narrativeModesText',
      group: 'about',
      description: 'Biografía que aparece en /enfoque. Una versión por modo narrativo.',
    }),

    defineField({
      name: 'seoAbout',
      title: 'SEO — Enfoque',
      type: 'object',
      group: 'about',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'title',       title: 'Título (50–60 car.)',        type: 'localizedString' }),
        defineField({ name: 'description', title: 'Descripción (150–160 car.)', type: 'localizedText'   }),
      ],
    }),

    // ── HABLEMOS / CONTACT ───────────────────────────────────
    defineField({
      name: 'contactIntro',
      title: 'Intro — página /hablemos',
      type: 'narrativeModesText',
      group: 'contact',
      description: 'Texto introductorio en /hablemos. Una versión por modo.',
    }),

    defineField({
      name: 'seoContact',
      title: 'SEO — Hablemos',
      type: 'object',
      group: 'contact',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'title',       title: 'Título (50–60 car.)',        type: 'localizedString' }),
        defineField({ name: 'description', title: 'Descripción (150–160 car.)', type: 'localizedText'   }),
      ],
    }),

    defineField({
      name: 'social',
      title: 'Redes sociales',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url'    }),
        defineField({ name: 'github',   title: 'GitHub',   type: 'url'    }),
        defineField({ name: 'email',    title: 'Email',    type: 'string' }),
      ],
    }),

    // ── PÁGINAS — títulos e imágenes del personaje ───────────
    defineField({
      name: 'pageTitles',
      title: 'Títulos de página — por modo narrativo',
      type: 'object',
      group: 'pages',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'work',       title: 'Proyectos (/work)',            type: 'narrativeModesString' }),
        defineField({ name: 'about',      title: 'Enfoque (/about)',             type: 'narrativeModesString' }),
        defineField({ name: 'contact',    title: 'Hablemos (/contact)',          type: 'narrativeModesString' }),
        defineField({ name: 'experience', title: 'Experiencia (/experience)',    type: 'narrativeModesString' }),
        defineField({ name: 'playground', title: 'Laboratorio (/laboratorio)',   type: 'narrativeModesString' }),
        defineField({ name: 'blog',       title: 'Apuntes (/blog)',              type: 'narrativeModesString' }),
      ],
    }),

    defineField({
      name: 'pageImages',
      title: 'Imagen del personaje por página',
      type: 'object',
      group: 'pages',
      description: 'El personaje en distintas situaciones. Cada modo es independiente — dejar vacío = no aparece.',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'work',       title: 'Proyectos (/work)',           type: 'narrativeModesImage' }),
        defineField({ name: 'about',      title: 'Enfoque (/about)',            type: 'narrativeModesImage' }),
        defineField({ name: 'contact',    title: 'Hablemos (/contact)',         type: 'narrativeModesImage' }),
        defineField({ name: 'experience', title: 'Experiencia (/experience)',   type: 'narrativeModesImage' }),
        defineField({ name: 'playground', title: 'Laboratorio (/laboratorio)',  type: 'narrativeModesImage' }),
        defineField({ name: 'blog',       title: 'Apuntes (/blog)',             type: 'narrativeModesImage' }),
      ],
    }),

    defineField({
      name: 'seoPages',
      title: 'SEO por página',
      type: 'object',
      group: 'pages',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'work', title: 'Proyectos (/work)', type: 'object', options: { collapsible: true, collapsed: true },
          fields: [
            defineField({ name: 'title',       title: 'Título',       type: 'localizedString' }),
            defineField({ name: 'description', title: 'Descripción',  type: 'localizedText'   }),
          ],
        }),
        defineField({ name: 'blog', title: 'Blog · Apuntes (/blog)', type: 'object', options: { collapsible: true, collapsed: true },
          fields: [
            defineField({ name: 'title',       title: 'Título',       type: 'localizedString' }),
            defineField({ name: 'description', title: 'Descripción',  type: 'localizedText'   }),
          ],
        }),
        defineField({ name: 'experience', title: 'Experiencia (/experience)', type: 'object', options: { collapsible: true, collapsed: true },
          fields: [
            defineField({ name: 'title',       title: 'Título',       type: 'localizedString' }),
            defineField({ name: 'description', title: 'Descripción',  type: 'localizedText'   }),
          ],
        }),
        defineField({ name: 'lab', title: 'Laboratorio (/laboratorio)', type: 'object', options: { collapsible: true, collapsed: true },
          fields: [
            defineField({ name: 'title',       title: 'Título',       type: 'localizedString' }),
            defineField({ name: 'description', title: 'Descripción',  type: 'localizedText'   }),
          ],
        }),
      ],
    }),

    // ── GLOBAL ───────────────────────────────────────────────
    defineField({
      name: 'ogImage',
      title: 'Imagen OG (redes sociales)',
      type: 'image',
      group: 'global',
      description: 'Imagen al compartir davila.uno. 1200 × 630 px. Cámbiala para fechas especiales.',
      options: { hotspot: true },
    }),

    defineField({
      name: 'cvUrl',
      title: 'CV — Enlace de descarga (PDF)',
      type: 'url',
      group: 'global',
      description: 'URL pública al PDF del CV — Google Drive, Dropbox, etc.',
    }),

    defineField({
      name: 'footerText',
      title: 'Texto del footer',
      type: 'localizedString',
      group: 'global',
    }),

    defineField({
      name: 'competencies',
      title: 'Competencias',
      type: 'array',
      group: 'global',
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

    defineField({
      name: 'funFacts',
      title: 'Datos curiosos',
      type: 'array',
      group: 'global',
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

    defineField({
      name: 'labels',
      title: 'Textos de interfaz',
      type: 'object',
      group: 'global',
      description: 'Navegación, títulos de página y etiquetas de sección en todos los idiomas.',
      fields: [
        defineField({
          name: 'nav',
          title: 'Navegación',
          type: 'object',
          fields: [
            defineField({ name: 'home',       title: 'Inicio',       type: 'localizedString' }),
            defineField({ name: 'about',      title: 'Sobre mí',     type: 'localizedString' }),
            defineField({ name: 'work',       title: 'Trabajo',      type: 'localizedString' }),
            defineField({ name: 'experience', title: 'Experiencia',  type: 'localizedString' }),
            defineField({ name: 'blog',       title: 'Blog',         type: 'localizedString' }),
            defineField({ name: 'contact',    title: 'Contacto',     type: 'localizedString' }),
            defineField({ name: 'playground', title: 'Playground',   type: 'localizedString' }),
          ],
        }),
        defineField({
          name: 'home',
          title: 'Home — secciones',
          type: 'object',
          fields: [
            defineField({ name: 'philosophyLabel',   title: 'Etiqueta sección filosofía',    type: 'localizedString' }),
            defineField({ name: 'competenciesLabel', title: 'Etiqueta sección competencias', type: 'localizedString' }),
            defineField({ name: 'projectsLabel',     title: 'Etiqueta sección proyectos',    type: 'localizedString' }),
            defineField({ name: 'projectsDesc',      title: 'Descripción sección proyectos', type: 'localizedString' }),
            defineField({ name: 'postsLabel',        title: 'Etiqueta sección posts',        type: 'localizedString' }),
            defineField({ name: 'postsDesc',         title: 'Descripción sección posts',     type: 'localizedString' }),
            defineField({ name: 'moreAbout',         title: 'CTA — Más sobre mí',            type: 'localizedString' }),
            defineField({ name: 'viewExperience',    title: 'CTA — Ver experiencia',         type: 'localizedString' }),
            defineField({ name: 'ctaBlog',           title: 'CTA — Leer blog',               type: 'localizedString' }),
          ],
        }),
        defineField({
          name: 'work',
          title: 'Proyectos (/work)',
          type: 'object',
          fields: [
            defineField({ name: 'title',       title: 'Título de página',  type: 'localizedString' }),
            defineField({ name: 'empty',       title: 'Sin proyectos',     type: 'localizedString' }),
            defineField({ name: 'back',        title: 'Volver',            type: 'localizedString' }),
            defineField({ name: 'clientLabel', title: 'Etiqueta Cliente',  type: 'localizedString' }),
            defineField({ name: 'roleLabel',   title: 'Etiqueta Rol',      type: 'localizedString' }),
            defineField({ name: 'yearLabel',   title: 'Etiqueta Año',      type: 'localizedString' }),
            defineField({ name: 'noContent',   title: 'Sin descripción',   type: 'localizedString' }),
          ],
        }),
        defineField({
          name: 'playground',
          title: 'Laboratorio (/laboratorio)',
          type: 'object',
          fields: [
            defineField({ name: 'title',       title: 'Título de página',   type: 'localizedString' }),
            defineField({ name: 'statsLabel',  title: 'Etiqueta — Estado',  type: 'localizedString' }),
            defineField({ name: 'filterLabel', title: 'Etiqueta — Filtrar', type: 'localizedString' }),
            defineField({ name: 'filterAll',   title: 'Filtro — Todos',     type: 'localizedString' }),
            defineField({ name: 'empty',       title: 'Sin experimentos',   type: 'localizedString' }),
          ],
        }),
        defineField({
          name: 'about',
          title: 'Enfoque (/about)',
          type: 'object',
          fields: [
            defineField({ name: 'title',         title: 'Título de página',     type: 'localizedString' }),
            defineField({ name: 'connect',       title: 'CTA — Conectar',       type: 'localizedString' }),
            defineField({ name: 'seeExperience', title: 'CTA — Ver experiencia',type: 'localizedString' }),
          ],
        }),
        defineField({
          name: 'experience',
          title: 'Experiencia (/experience)',
          type: 'object',
          fields: [
            defineField({ name: 'title',         title: 'Título de página',      type: 'localizedString' }),
            defineField({ name: 'workLabel',     title: 'Sección — Trabajo',     type: 'localizedString' }),
            defineField({ name: 'eduLabel',      title: 'Sección — Educación',   type: 'localizedString' }),
            defineField({ name: 'current',       title: 'Etiqueta — Actual',     type: 'localizedString' }),
            defineField({ name: 'empty',         title: 'Sin contenido',         type: 'localizedString' }),
            defineField({ name: 'downloadCv',    title: 'CTA — Descargar CV',    type: 'localizedString' }),
            defineField({ name: 'featuredLabel', title: 'Sección — Destacados',  type: 'localizedString' }),
            defineField({ name: 'previousLabel', title: 'Sección — Anteriores',  type: 'localizedString' }),
          ],
        }),
        defineField({
          name: 'contact',
          title: 'Hablemos (/contact)',
          type: 'object',
          fields: [
            defineField({ name: 'title',      title: 'Título de página', type: 'localizedString' }),
            defineField({ name: 'emailLabel', title: 'Etiqueta Email',   type: 'localizedString' }),
          ],
        }),
        defineField({
          name: 'blog',
          title: 'Apuntes (/blog)',
          type: 'object',
          fields: [
            defineField({ name: 'title',     title: 'Título de página',        type: 'localizedString' }),
            defineField({ name: 'empty',     title: 'Sin entradas',            type: 'localizedString' }),
            defineField({ name: 'back',      title: 'Volver al blog',          type: 'localizedString' }),
            defineField({ name: 'noContent', title: 'Sin contenido en idioma', type: 'localizedString' }),
          ],
        }),
      ],
    }),
  ],

  preview: {
    prepare: () => ({ title: 'Configuración del sitio' }),
  },
})
