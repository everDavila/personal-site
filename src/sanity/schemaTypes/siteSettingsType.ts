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
        defineField({ name: 'roleLabel',     title: 'Etiqueta de rol (sobre el titular)', type: 'localizedString' }),
        defineField({ name: 'headline',      title: '🌑 Titular — Modo Oscuro (profesional)', type: 'localizedString' }),
        defineField({ name: 'headlineLight', title: '☀️ Titular — Modo Claro (lúdico)',       type: 'localizedString' }),
        defineField({ name: 'sub',           title: '🌑 Subtítulo — Modo Oscuro', type: 'localizedText' }),
        defineField({ name: 'subLight',      title: '☀️ Subtítulo — Modo Claro', type: 'localizedText' }),
        defineField({ name: 'ctaWork',        title: 'CTA — Ver trabajo (texto)', type: 'localizedString' }),
        defineField({ name: 'ctaCV',          title: 'CTA — Descargar CV (texto)', type: 'localizedString' }),
        defineField({ name: 'heroImage',      title: '🌑 Imagen hero — Modo Oscuro', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'heroImageLight', title: '☀️ Imagen hero — Modo Claro',  type: 'image', options: { hotspot: true } }),
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
      title: 'Filosofía (homepage) — por modo narrativo',
      description: 'Aparece en la sección de filosofía del home. Escribe una versión para cada modo.',
      type: 'narrativeModesText',
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
      title: 'Sobre mí (página /about) — por modo narrativo',
      description: 'Biografía que aparece en /about. Escribe una versión para cada modo.',
      type: 'narrativeModesText',
    }),

    // ── Contact intro ────────────────────────────────────────
    defineField({
      name: 'contactIntro',
      title: 'Intro de contacto (página /contact) — por modo narrativo',
      description: 'Texto introductorio antes de los enlaces. Puede ser null si prefieres no mostrarlo.',
      type: 'narrativeModesText',
    }),

    // ── Títulos de página por modo narrativo ─────────────────
    defineField({
      name: 'pageTitles',
      title: 'Títulos de página — por modo narrativo',
      description: 'Título del <h1> de cada página. Modo oscuro = profesional/formal. Modo claro = más personal.',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'work',       title: 'Trabajo (/work)',            type: 'narrativeModesString' }),
        defineField({ name: 'about',      title: 'Sobre mí (/about)',          type: 'narrativeModesString' }),
        defineField({ name: 'contact',    title: 'Contacto (/contact)',        type: 'narrativeModesString' }),
        defineField({ name: 'experience', title: 'Experiencia (/experience)',  type: 'narrativeModesString' }),
        defineField({ name: 'playground', title: 'Playground (/playground)',   type: 'narrativeModesString' }),
        defineField({ name: 'blog',       title: 'Blog/Apuntes (/blog)',       type: 'narrativeModesString' }),
      ],
    }),

    // ── Imágenes del personaje por página ────────────────────
    defineField({
      name: 'pageImages',
      title: 'Imágenes del personaje por página',
      description: 'El personaje en distintas situaciones. Sube solo el modo que tengas — cada uno es independiente.',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'work',       title: 'Proyectos (/work)',          type: 'narrativeModesImage' }),
        defineField({ name: 'about',      title: 'Enfoque (/about)',           type: 'narrativeModesImage' }),
        defineField({ name: 'contact',    title: 'Hablemos (/contact)',        type: 'narrativeModesImage' }),
        defineField({ name: 'experience', title: 'Experiencia (/experience)',  type: 'narrativeModesImage' }),
        defineField({ name: 'playground', title: 'Experimentos (/playground)', type: 'narrativeModesImage' }),
        defineField({ name: 'blog',       title: 'Apuntes (/blog)',            type: 'narrativeModesImage' }),
      ],
    }),

    // ── Social ──────────────────────────────────────────────
    defineField({
      name: 'social',
      title: 'Redes sociales',
      type: 'object',
      fields: [
        defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url'    }),
        defineField({ name: 'github',   title: 'GitHub',   type: 'url'    }),
        defineField({ name: 'email',    title: 'Email',    type: 'string' }),
      ],
    }),

    // ── Textos de interfaz ───────────────────────────────────
    defineField({
      name: 'labels',
      title: 'Textos de interfaz',
      description: 'Navegación, títulos de página y etiquetas de sección en todos los idiomas.',
      type: 'object',
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
            defineField({ name: 'postsLabel',        title: 'Etiqueta sección posts',        type: 'localizedString' }),
            defineField({ name: 'moreAbout',         title: 'CTA — Más sobre mí',            type: 'localizedString' }),
            defineField({ name: 'viewExperience',    title: 'CTA — Ver experiencia',         type: 'localizedString' }),
            defineField({ name: 'ctaBlog',           title: 'CTA — Leer blog',               type: 'localizedString' }),
          ],
        }),
        defineField({
          name: 'work',
          title: 'Trabajo (/work)',
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
          title: 'Playground (/playground)',
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
          title: 'Sobre mí (/about)',
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
          title: 'Contacto (/contact)',
          type: 'object',
          fields: [
            defineField({ name: 'title',      title: 'Título de página', type: 'localizedString' }),
            defineField({ name: 'emailLabel', title: 'Etiqueta Email',   type: 'localizedString' }),
          ],
        }),
        defineField({
          name: 'blog',
          title: 'Blog (/blog)',
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
