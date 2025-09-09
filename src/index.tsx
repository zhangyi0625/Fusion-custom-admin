import { createRoot } from 'react-dom/client'
import '@/styles/global.scss' // 引入 Sass 文件
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { persistor, store } from '@/stores/store'
import { PersistGate } from 'redux-persist/integration/react'
import { ConfigProvider, Spin } from 'antd'
import GlobalConfigProvider from './GlobalConfigProvider'
import './index.css'
import { IntlProvider } from 'react-intl'
import {
  getAntMessages,
  getCurrentLang,
  reactIntlLangConfig,
} from './locals/react-intl'

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(
    <IntlProvider
      locale={getCurrentLang()}
      messages={reactIntlLangConfig[getCurrentLang()]}
    >
      <ConfigProvider locale={getAntMessages()}>
        <Provider store={store}>
          <PersistGate loading={<Spin />} persistor={persistor}>
            <HashRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <GlobalConfigProvider />
            </HashRouter>
          </PersistGate>
        </Provider>
      </ConfigProvider>
    </IntlProvider>
  )
} else {
  console.error('Root element not found')
}
