import { ConfigProvider } from 'antd'

const SaleProject: React.FC = () => {
  return (
    <>
      {/* 菜单检索条件栏 */}
      <ConfigProvider
        theme={{
          components: {
            Form: {
              itemMarginBottom: 0,
            },
          },
        }}
      ></ConfigProvider>
    </>
  )
}

export default SaleProject
