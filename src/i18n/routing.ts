import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['es', 'en', 'pt', 'qu', 'zh'],
  defaultLocale: 'es',
  pathnames: {
    '/': '/',

    '/work': {
      es: '/trabajo',
      en: '/work',
      pt: '/trabalho',
      qu: '/llankay',
      zh: '/zuopin',
    },

    '/work/[slug]': {
      es: '/trabajo/[slug]',
      en: '/work/[slug]',
      pt: '/trabalho/[slug]',
      qu: '/llankay/[slug]',
      zh: '/zuopin/[slug]',
    },

    '/blog': {
      es: '/blog',
      en: '/blog',
      pt: '/blog',
      qu: '/blog',
      zh: '/boke',
    },

    '/blog/[slug]': {
      es: '/blog/[slug]',
      en: '/blog/[slug]',
      pt: '/blog/[slug]',
      qu: '/blog/[slug]',
      zh: '/boke/[slug]',
    },

    '/about': {
      es: '/sobre-mi',
      en: '/about',
      pt: '/sobre-mim',
      qu: '/noqamanta',
      zh: '/guanyu',
    },

    '/experience': {
      es: '/experiencia',
      en: '/experience',
      pt: '/experiencia',
      qu: '/llankayhistorial',
      zh: '/jingyan',
    },

    '/contact': {
      es: '/contacto',
      en: '/contact',
      pt: '/contato',
      qu: '/qhariy',
      zh: '/lianxi',
    },

    '/playground': {
      es: '/laboratorio',
      en: '/lab',
      pt: '/laboratorio',
      qu: '/pukllay',
      zh: '/shiyanshi',
    },

    '/playground/[slug]': {
      es: '/laboratorio/[slug]',
      en: '/lab/[slug]',
      pt: '/laboratorio/[slug]',
      qu: '/pukllay/[slug]',
      zh: '/shiyanshi/[slug]',
    },
  },
})
