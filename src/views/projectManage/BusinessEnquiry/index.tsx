import { Card, ConfigProvider } from 'antd'
import { SearchForm, SearchTable } from 'customer-search-form-table'

const BusinessEnquiry: React.FC = () => {
  const onUpdateSearch = (info?: unknown) => {
    console.log(info, 'info')
    // setColumns(columns);
  }

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
      >
        {/* <Card>
          <SearchForm
            columns={column}
            gutterWidth={24}
            labelPosition="left"
            showRow={2}
            btnSeparate={true}
            isShowReset={true}
            isShowExpend={true}
            iconHidden={true}
            searchBtnText="查询"
            onUpdateSearch={onUpdateSearch}
          />
        </Card> */}
      </ConfigProvider>
    </>
  )
}

export default BusinessEnquiry
