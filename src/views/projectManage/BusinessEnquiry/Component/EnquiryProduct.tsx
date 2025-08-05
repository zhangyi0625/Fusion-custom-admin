import { memo, useState } from 'react'
import { Button, Input, Space } from 'antd'
import { debounce } from 'lodash-es'
import ProductTransfer from '../../ProductTransfer'

export type EnquiryProductProps = {}

const EnquiryProductCom: React.FC<EnquiryProductProps> = memo(() => {
  const [params, setParams] = useState<{
    visible: boolean
    selected: string[] | null
  }>({
    visible: false,
    selected: null,
  })

  const searchValueChange = debounce((value: any) => {
    console.log(value)
  }, 300)

  const downloadTable = () => {}

  const importProduct = () => {}

  return (
    <>
      <div className="flex items-center justify-between">
        <Input.Search
          placeholder="请输入产品名称/规格型号"
          onChange={(e) => searchValueChange(e.target.value)}
          style={{ width: '272px' }}
        />
        <div>
          <Space>
            <Button onClick={downloadTable} type="default">
              下载询价表
            </Button>
            <Button onClick={importProduct} type="default">
              导入产品
            </Button>
            <Button
              onClick={() => setParams({ visible: true, selected: null })}
              type="primary"
            >
              选择产品
            </Button>
          </Space>
        </div>
      </div>
      <div
        style={{ background: '#fafafa' }}
        className="h-[54px] leading-[54px] w-full mt-[8px]"
      ></div>
      {/* <Table bordered></Table> */}
      <ProductTransfer
        params={params}
        onCancel={() => setParams({ visible: false, selected: null })}
        onOk={(newArr: string[]) =>
          setParams({ visible: false, selected: newArr })
        }
      />
    </>
  )
})

export default EnquiryProductCom
