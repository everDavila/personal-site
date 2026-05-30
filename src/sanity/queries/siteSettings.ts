import { client } from '../lib/client'
import type { Locale } from '@/lib/i18n'

export type LocalizedString = {
  es?: string; en?: string; pt?: string; qu?: string; zh?: string
}

export type NarrativeModes = {
  dark?:  LocalizedString | null
  light?: LocalizedString | null
}

export type Competency = {
  title: LocalizedString
  description: LocalizedString
}

export type FunFact = {
  value: string
  label: LocalizedString
}

export type UILabels = {
  nav?: {
    home?: LocalizedString; about?: LocalizedString; work?: LocalizedString
    experience?: LocalizedString; blog?: LocalizedString; contact?: LocalizedString
    playground?: LocalizedString
  }
  home?: {
    philosophyLabel?: LocalizedString; competenciesLabel?: LocalizedString
    projectsLabel?: LocalizedString; postsLabel?: LocalizedString
    moreAbout?: LocalizedString; viewExperience?: LocalizedString; ctaBlog?: LocalizedString
  }
  work?: {
    title?: LocalizedString; empty?: LocalizedString; back?: LocalizedString
    clientLabel?: LocalizedString; roleLabel?: LocalizedString
    yearLabel?: LocalizedString; noContent?: LocalizedString
  }
  playground?: {
    title?: LocalizedString; statsLabel?: LocalizedString; filterLabel?: LocalizedString
    filterAll?: LocalizedString; empty?: LocalizedString
  }
  about?: {
    title?: LocalizedString; connect?: LocalizedString; seeExperience?: LocalizedString
  }
  experience?: {
    title?: LocalizedString; workLabel?: LocalizedString; eduLabel?: LocalizedString
    current?: LocalizedString; empty?: LocalizedString; downloadCv?: LocalizedString
    featuredLabel?: LocalizedString; previousLabel?: LocalizedString
  }
  contact?: {
    title?: LocalizedString; emailLabel?: LocalizedString
  }
  blog?: {
    title?: LocalizedString; empty?: LocalizedString; back?: LocalizedString
    noContent?: LocalizedString
  }
}

export type SiteSettings = {
  hero: {
    roleLabel:     LocalizedString
    headline:      LocalizedString
    headlineLight?: LocalizedString | null
    sub:           LocalizedString
    subLight?:     LocalizedString | null
    ctaWork:       LocalizedString
    ctaCV:         LocalizedString
    heroImage:     { asset: { url: string } } | null
  }
  cvUrl?:       string | null
  philosophy?:  NarrativeModes | null
  contactIntro?: NarrativeModes | null
  footerText?:  LocalizedString | null
  competencies: Competency[]
  funFacts:     FunFact[]
  about?:       NarrativeModes | null
  social: {
    linkedin?: string
    github?:   string
    email?:    string
  }
  labels?: UILabels
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function lbl(ls: LocalizedString | undefined, locale: string, fallback: string): string {
  return ls?.[locale as keyof LocalizedString] || fallback
}

/** Resolve a NarrativeModes field for the given mode + locale, with an optional LocalizedString fallback. */
export function narrativeText(
  modes: NarrativeModes | null | undefined,
  mode: 'dark' | 'light',
  locale: Locale,
  fallback?: LocalizedString | null
): string | null {
  const ls = modes?.[mode] ?? modes?.dark ?? fallback ?? null
  if (!ls) return null
  return ls[locale] ?? ls.es ?? ls.en ?? null
}

// ── Demo fallback text (used while Sanity content is not yet filled) ─────────
export const NARRATIVE_FALLBACK = {
  dark: {
    philosophy: {
      es: 'Diseño sistemas digitales para que funcionen en el mundo real, no en el ideario de Silicon Valley. Cada interfaz es una pregunta sobre quién tiene acceso y quién no.',
      en: 'I design digital systems to work in the real world. Every interface is a question about who gets access and who doesn\'t.',
    } as LocalizedString,
    about: {
      es: 'Diseñador UX/UI con enfoque en sistemas digitales complejos para el sector público peruano. He trabajado en la intersección del diseño centrado en el usuario y la política pública digital, buscando que los servicios del Estado sean accesibles para todos.',
      en: 'UX/UI designer focused on complex digital systems for the Peruvian public sector, working at the intersection of user-centered design and digital public policy.',
    } as LocalizedString,
    contactIntro: {
      es: 'Si trabajas en un proyecto que requiere rigor, estrategia y diseño centrado en el usuario, conversemos.',
      en: 'If you\'re working on a project that requires rigor, strategy, and user-centered design, let\'s talk.',
    } as LocalizedString,
    heroHeadline: {
      es: 'Diseñador de sistemas digitales complejos.',
      en: 'Designer of complex digital systems.',
    } as LocalizedString,
  },
  light: {
    philosophy: {
      es: 'Me llevo bien con los problemas difíciles. Los sistemas complejos me parecen fascinantes — como puzzles enormes donde cada pieza importa. Y sí, también dibujo garabatos cuando pienso.',
      en: 'I get along well with hard problems. Complex systems fascinate me — like enormous puzzles where every piece matters.',
    } as LocalizedString,
    about: {
      es: 'Soy ese tipo que se pregunta por qué los trámites del Estado son tan confusos. Entonces los diseño mejor. Trabajo con datos, personas, burocracia y, a veces, mucha cafeína. Me apasiona hacer que cosas complicadas sean fáciles de usar.',
      en: 'I\'m the kind of person who wonders why government processes are so confusing — then designs them better. I work with data, people, bureaucracy, and sometimes a lot of caffeine.',
    } as LocalizedString,
    contactIntro: {
      es: '¿Tienes un proyecto interesante? Cuéntame. Me gustan los desafíos raros, las conversaciones honestas y los problemas que valen la pena resolver.',
      en: 'Have an interesting project? Tell me about it. I like unusual challenges, honest conversations, and problems worth solving.',
    } as LocalizedString,
    heroHeadline: {
      es: 'Hago que lo difícil sea fácil de usar.',
      en: 'I make the difficult easy to use.',
    } as LocalizedString,
  },
}

// ── Query ─────────────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch(
    `*[_type == "siteSettings" && _id == "siteSettings"][0]{
      hero {
        roleLabel, headline, headlineLight,
        sub, subLight,
        ctaWork, ctaCV,
        heroImage { asset->{ url } }
      },
      cvUrl,
      philosophy { dark, light },
      contactIntro { dark, light },
      footerText,
      competencies[] { title, description },
      funFacts[] { value, label },
      about { dark, light },
      social,
      labels {
        nav { home, about, work, experience, blog, contact, playground },
        home { philosophyLabel, competenciesLabel, projectsLabel, postsLabel, moreAbout, viewExperience, ctaBlog },
        work { title, empty, back, clientLabel, roleLabel, yearLabel, noContent },
        playground { title, statsLabel, filterLabel, filterAll, empty },
        about { title, connect, seeExperience },
        experience { title, workLabel, eduLabel, current, empty, downloadCv, featuredLabel, previousLabel },
        contact { title, emailLabel },
        blog { title, empty, back, noContent },
      },
    }`,
    {},
    { next: { revalidate: 0 } }
  )
}
