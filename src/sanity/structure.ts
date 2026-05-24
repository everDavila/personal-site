import type { StructureResolver } from 'sanity/structure'
import {
  DocumentTextIcon,
  CaseIcon,
  TagIcon,
  UserIcon,
  CogIcon,
  StarIcon,
  RocketIcon,
} from '@sanity/icons'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('ever davila · studio')
    .items([

      // ── Blog ──────────────────────────────
      S.listItem()
        .title('Blog')
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

      // ── Trabajo ───────────────────────────
      S.listItem()
        .title('Proyectos')
        .icon(CaseIcon)
        .child(
          S.documentTypeList('project').title('Proyectos')
        ),

      // ── Playground ────────────────────────
      S.listItem()
        .title('Playground')
        .icon(RocketIcon)
        .child(
          S.documentTypeList('playgroundItem').title('Experimentos')
        ),

      // ── Experiencia ───────────────────────
      S.listItem()
        .title('Experiencia & Estudios')
        .icon(StarIcon)
        .child(
          S.document()
            .schemaType('experience')
            .documentId('experience')
            .title('Experiencia & Estudios')
        ),

      S.divider(),

      // ── Configuración ─────────────────────
      S.listItem()
        .title('Configuración del sitio')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Configuración del sitio')
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
