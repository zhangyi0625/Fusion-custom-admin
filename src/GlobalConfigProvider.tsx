import { ConfigProvider, App as AntdApp } from 'antd'
import App from './App'
import { useSelector } from 'react-redux'
import type { RootState } from './stores/store'
import zhCN from 'antd/locale/zh_CN'
// import 'dayjs/locale/zh-cn';
/**
 * 全局配置组件（为了将antd的ConfigProvider和App嵌套，不然App中的antdUtil中的组件无法使用全局配置）
 */
const GlobalConfigProvider = () => {
  // 获取数据的钩子函数
  const { theme } = useSelector((state: RootState) => state.preferences)
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: theme.colorPrimary,
        },
        components: {
          Layout: {
            headerPadding: '0 16px 0 0',
            headerHeight: '50px',
            headerBg: '#fff',
          },
          Tree: {
            directoryNodeSelectedBg: '#e6f4ff',
            indentSize: 12,
            directoryNodeSelectedColor: 'rgba(0, 0, 0, 0.88)',
          },
        },
      }}
      locale={zhCN}
    >
      <AntdApp style={{ height: '100%' }}>
        <App />
      </AntdApp>
    </ConfigProvider>
  )
}

export default GlobalConfigProvider
