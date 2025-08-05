import { memo } from 'react'

export type BaseInfoComProps = {}

const BaseInfoCom: React.FC<BaseInfoComProps> = memo(() => {
  return (
    <>
      <div className="grid grid-cols-2 text-gray-500 gap-y-[10px] mb-[30px]">
        <p>项目编号：</p>
        <p>项目名称：</p>
        <p>客户名称：</p>
        <p>状态：</p>
        <p>付款方：</p>
        <p>预计采购日期：</p>
        <p>项目类型：</p>
        <p>金额：</p>
        <p>付款方式：</p>
        <p>备注：</p>
        <p>业务员：</p>
        <p>我司签约：</p>
        <p>创建者：</p>
        <p>创建时间：</p>
      </div>
    </>
  )
})

export default BaseInfoCom
