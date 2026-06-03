import type { StructureResolver } from 'sanity/structure'
import {
  DocumentTextIcon,
  CaseIcon,
  TagIcon,
  UserIcon,
  CogIcon,
  StarIcon,
  RocketIcon,
  SparklesIcon,
  ErrorOutlineIcon,
  HomeIcon,
  EnvelopeIcon,
  EarthGlobeIcon,
} from '@sanity/icons'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('ever davila · studio')
    .items([

      // ── PÁGINAS ───────────────────────────────────────────
      S.listItem()
        .title('Home')
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Home')
        ),

      S.listItem()
        .title('Enfoque')
        .icon(UserIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Enfoque')
        ),

      S.listItem()
        .title('Hablemos')
        .icon(EnvelopeIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Hablemos')
        ),

      S.divider(),

      // ── CONTENIDO ─────────────────────────────────────────
      S.listItem()
        .title('Proyectos')
        .icon(CaseIcon)
        .child(
          S.documentTypeList('project').title('Proyectos')
        ),

      S.listItem()
        .title('Blog · Apuntes')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Blog')
            .items([
              S.documentTypeListItem('post')
                .title('Posts')
                .icon(DocumentTextIcon),
              S.documentTypeListItem('category')
                .title('Categorías')
                .icon(TagIcon),
            ])
        ),

      S.listItem()
        .title('Laboratorio')
        .icon(RocketIcon)
        .child(
          S.documentTypeList('playgroundItem').title('Experimentos')
        ),

      S.listItem()
        .title('Experiencia')
        .icon(StarIcon)
        .child(
          S.document()
            .schemaType('experience')
            .documentId('experience')
            .title('Experiencia')
        ),

      S.divider(),

      // ── CONFIG ────────────────────────────────────────────
      S.listItem()
        .title('Global')
        .icon(EarthGlobeIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Global')
        ),

      S.listItem()
        .title('Subtítulos')
        .icon(SparklesIcon)
        .child(
          S.list()
            .title('Subtítulos por página')
            .items(
              ['home', 'work', 'experience', 'blog', 'playground', 'contact', 'about'].map(page =>
                S.listItem()
                  .title(page.charAt(0).toUpperCase() + page.slice(1))
                  .id(page)
                  .child(
                    S.documentList()
                      .title(`Subtítulos · ${page}`)
                      .filter('_type == "editorialSubtitle" && page == $page')
                      .params({ page })
                      .defaultOrdering([{ field: 'weight', direction: 'desc' }])
                  )
              )
            )
        ),

      S.listItem()
        .title('Página 404')
        .icon(ErrorOutlineIcon)
        .child(
          S.document()
            .schemaType('page404')
            .documentId('page404')
            .title('Página 404')
        ),

      S.listItem()
        .title('Autor')
        .icon(UserIcon)
        .child(
          S.document()
            .schemaType('author')
            .documentId('author')
            .title('Autor')
        ),

    ])
