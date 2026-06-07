import type { MetadataRoute } from 'next'
import { getAllPostSlugsLocalized } from '@/sanity/queries/posts'
import { getAllProjectSlugs } from '@/sanity/queries/projects'

const BASE = 'https://davila.uno'

const STATIC: { es: string; en: string }[] = [
  { es: '/es',               en: '/en'           },
  { es: '/es/trabajo',       en: '/en/work'      },
  { es: '/es/sobre-mi',      en: '/en/about'     },
  { es: '/es/contacto',      en: '/en/contact'   },
  { es: '/es/experiencia',   en: '/en/experience'},
  { es: '/es/laboratorio',   en: '/en/lab'       },
  { es: '/es/blog',          en: '/en/blog'      },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postSlugMaps, projectSlugs] = await Promise.all([
    getAllPostSlugsLocalized(),
    getAllProjectSlugs(),
  ])

  const staticEntries: MetadataRoute.Sitemap = STATIC.map(({ es, en }) => ({
    url:              `${BASE}${es}`,
    lastModified:     new Date(),
    changeFrequency:  'monthly',
    priority:         es === '/es' ? 1.0 : 0.8,
    alternates: {
      languages: { es: `${BASE}${es}`, en: `${BASE}${en}` },
    },
  }))

  const postEntries: MetadataRoute.Sitemap = postSlugMaps.map(slugs => ({
    url:              `${BASE}/es/blog/${slugs.es}`,
    lastModified:     new Date(),
    changeFrequency:  'weekly',
    priority:         0.7,
    alternates: {
      languages: {
        es: `${BASE}/es/blog/${slugs.es}`,
        en: `${BASE}/en/blog/${slugs.en}`,
        pt: `${BASE}/pt/blog/${slugs.pt}`,
      },
    },
  }))

  const projectEntries: MetadataRoute.Sitemap = projectSlugs.map(slug => ({
    url:              `${BASE}/es/trabajo/${slug}`,
    lastModified:     new Date(),
    changeFrequency:  'monthly',
    priority:         0.7,
    alternates: {
      languages: {
        es: `${BASE}/es/trabajo/${slug}`,
        en: `${BASE}/en/work/${slug}`,
      },
    },
  }))

  return [...staticEntries, ...postEntries, ...projectEntries]
}
