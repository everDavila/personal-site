import { type SchemaTypeDefinition } from 'sanity'

import { blockContentType } from './blockContentType'
import { localizedStringType, localizedTextType, localizedBlockContentType } from './localizedStringType'
import { categoryType } from './categoryType'
import { postType } from './postType'
import { projectType } from './projectType'
import { authorType } from './authorType'
import { siteSettingsType } from './siteSettingsType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    localizedStringType,
    localizedTextType,
    localizedBlockContentType,
    siteSettingsType,
    categoryType,
    postType,
    projectType,
    authorType,
  ],
}
