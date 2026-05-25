import { client } from '../lib/client'
import type { Locale } from '@/lib/i18n'

type LocalizedString = Record<Locale, string>

export type Page404Data = {
  title: LocalizedString
  body:  LocalizedString
  notes: LocalizedString[]
}

const DEFAULTS: Page404Data = {
  title: {
    es: 'Esta página se perdió dentro del sistema.',
    en: 'This page got lost somewhere inside the system.',
    pt: 'Esta página se perdeu dentro do sistema.',
    qu: 'Kay p\'anqa systema ukupi chinkasqa.',
    zh: '此页面在系统深处迷失了。',
  },
  body: {
    es: 'El enlace ya no existe, fue movido o terminó atrapado en algún proceso digital imposible de rastrear.',
    en: 'The link no longer exists, was moved, or disappeared into a beautifully confusing digital process.',
    pt: 'O link não existe mais, foi movido ou desapareceu num processo digital impossível de rastrear.',
    qu: 'Chay ch\'aqra manaña kanchu, kuyuchisqam.',
    zh: '链接已不存在，已被移动，或消失在某个无法追踪的数字流程中。',
  },
  notes: [
    { es: 'Probablemente no era un buen flujo desde el inicio.', en: 'Probably not a great user flow to begin with.', pt: 'Provavelmente não era um bom fluxo desde o início.', qu: 'Mana allin ñan karqachu.', zh: '这个流程从一开始就不太好。' },
    { es: 'La burocracia digital llega siempre.',              en: 'Digital bureaucracy strikes again.',              pt: 'A burocracia digital sempre chega.',                qu: 'Sistima pantasqam.',         zh: '数字官僚主义再次出击。' },
    { es: 'Algunas arquitecturas colapsan en silencio.',       en: 'Some architectures collapse silently.',          pt: 'Algumas arquiteturas colapsam em silêncio.',       qu: 'Wakin ruwaykuna upallallam.', zh: '有些架构会悄然崩溃。' },
    { es: 'Al menos este error es honesto.',                   en: 'At least this error is honest.',                 pt: 'Pelo menos este erro é honesto.',                  qu: 'Kay pantay cheqam.',          zh: '至少这个错误是诚实的。' },
    { es: 'La interfaz sigue calmada pese a las circunstancias.', en: 'The interface remains calm despite the circumstances.', pt: 'A interface permanece calma apesar das circunstâncias.', qu: 'Interfaz sumaqtam kausayan.', zh: '尽管如此，界面依然保持平静。' },
  ],
}

export async function getPage404(): Promise<Page404Data> {
  const data = await client.fetch<Page404Data | null>(
    `*[_type == "page404" && _id == "page404"][0]{ title, body, notes }`,
    {},
    { next: { revalidate: 3600 } }
  )
  if (!data) return DEFAULTS
  return {
    title: { ...DEFAULTS.title, ...data.title },
    body:  { ...DEFAULTS.body,  ...data.body  },
    notes: data.notes?.length ? data.notes : DEFAULTS.notes,
  }
}
