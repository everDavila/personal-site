'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schema } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'
import { studioTheme } from './src/sanity/studio/theme'
import { StudioLogo } from './src/sanity/studio/StudioLogo'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  theme: studioTheme,
  schema,
  studio: {
    components: {
      logo: StudioLogo,
    },
  },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
