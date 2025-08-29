import zhCn from './zh'
import enUs from './en'
import zhCN from 'antd/es/locale/zh_CN'
import enUS from 'antd/locale/en_US'
import { createIntl, createIntlCache } from 'react-intl'

export const reactIntlLangConfig: { [key: string]: { [key: string]: string } } =
  {
    'zh-CN': zhCn,
    'en-US': enUs,
  }

const currentLang = 'zh-CN'

const messages = {
  'zh-CN': zhCn,
  'en-US': enUs,
}

export const antMessages = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

export const getAntMessages = () => antMessages[currentLang]

export const getCurrentMessages = () => messages[currentLang]

export const getCurrentLang = () => currentLang

const cache = createIntlCache()

const intl = createIntl(
  {
    locale: currentLang,
    messages: reactIntlLangConfig[currentLang],
  },
  cache
)

export default intl
