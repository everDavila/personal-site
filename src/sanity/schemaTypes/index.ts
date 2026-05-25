import { type SchemaTypeDefinition } from 'sanity'

import { blockContentType } from './blockContentType'
import { localizedStringType, localizedTextType, localizedBlockContentType } from './localizedStringType'
import { categoryType } from './categoryType'
import { postType } from './postType'
import { projectType } from './projectType'
import { authorType } from './authorType'
import { siteSettingsType } from './siteSettingsType'
import { experienceType } from './experienceType'
import { playgroundItemType } from './playgroundItemType'
import { editorialSubtitleType } from './editorialSubtitleType'
import { page404Type } from './page404Type'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    localizedStringType,
    localizedTextType,
    localizedBlockContentType,
    siteSettingsType,
    experienceType,
    categoryType,
    postType,
    projectType,
    authorType,
    playgroundItemType,
    editorialSubtitleType,
    page404Type,
  ],
}
