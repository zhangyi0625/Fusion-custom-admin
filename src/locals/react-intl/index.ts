import zhCn from './zh'
import enUs from './en'
import zhCN from 'antd/es/locale/zh_CN'
import enUS from 'antd/locale/en_US'
import { createIntl, createIntlCache } from 'react-intl'

export const reactIntlLangConfig: { [key: string]: { [key: string]: string } } =
  {
    'zh-CN': zhCn,
    'en-US': enUs,
    zh: zhCn,
    en: enUs,
  }

export const antMessages = {
  'zh-CN': zhCN,
  'en-US': enUS,
  zh: zhCN,
  en: enUS,
}

export const getAntMessages = (lang: string) =>
  antMessages[lang as keyof typeof antMessages] || zhCN

export const getCurrentMessages = (lang: string) =>
  reactIntlLangConfig[lang as keyof typeof reactIntlLangConfig] || zhCn

export const createIntlInstance = (lang: string) => {
  const cache = createIntlCache()
  return createIntl(
    {
      locale: lang,
      messages: getCurrentMessages(lang),
    },
    cache,
  )
}
