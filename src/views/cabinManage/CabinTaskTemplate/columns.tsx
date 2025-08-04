import { TableProps } from 'antd'
import { formatTime } from '@/utils/format'
import { CustomColumn } from '@/components/searchForm'

type formSettingType = Pick<
  CustomColumn,
  'label' | 'name' | 'formType' | 'isRules' | 'options'
>

export const getTemplateSetting = (carrier?: string, statusType?: string) => {
  const columns = [
    {
      title: '任务编号',
      key: 'taskNo',
      align: 'center',
      width: 100,
      render(value) {
        return (
          <div className="text-blue-500 cursor-pointer underline text-sm">
            {value.taskNo}
          </div>
        )
      },
    },
    {
      title: '船公司',
      key: 'carrier',
      dataIndex: 'carrier',
      align: 'center',
      width: 80,
    },
    {
      title: '起运港',
      key: 'porCode',
      dataIndex: 'porCode',
      align: 'center',
      width: 100,
    },
    {
      title: '目的港',
      key: 'fndCode',
      dataIndex: 'fndCode',
      align: 'center',
      width: 100,
    },
    {
      title: '船司航线',
      key: 'route',
      dataIndex: 'routeFndName',
      align: 'center',
      width: 100,
    },
    {
      title: '客户名称',
      key: 'customerName',
      align: 'center',
      width: 300,
      render(value) {
        return (
          <div className="text-blue-500 cursor-pointer underline text-sm">
            {value.customerName}
          </div>
        )
      },
    },
    {
      title: 'ETD',
      key: 'etd',
      align: 'center',
      width: 180,
      render(value) {
        return <div>{formatTime(value.etd, 'M-D')}</div>
      },
    },
    {
      title: '箱型',
      key: 'ctntype',
      dataIndex: 'ctnType',
      align: 'center',
    },
    {
      title: '箱型/票数',
      key: 'ctnQty',
      align: 'center',
      width: 120,
      render(value) {
        return (
          <div>
            {value.ctnQty} / {value.ctnTicket}
          </div>
        )
      },
    },
    carrier === 'MSK' && {
      title: '额外免箱',
      key: 'extra',
      align: 'center',
      width: 150,
      render(value) {
        return <div>{value.extra?.extentDndFreeDays ?? '-'}</div>
      },
    },
    carrier === 'MSK' && {
      title: 'rollable',
      key: 'extra',
      align: 'center',
      width: 150,
      render(value) {
        return <div>{value.extra?.withRollable ? '需要' : '不需要'}</div>
      },
    },
    carrier === 'MSK' && {
      title: '合约号',
      key: 'extra',
      align: 'center',
      width: 120,
      render(value) {
        return <div>{value.extra?.contractNo ?? ''}</div>
      },
    },
    {
      title: '价格上限',
      dataIndex: 'priceLimit',
      key: 'priceLimit',
      align: 'center',
      width: 120,
    },
    {
      title: '抢舱模式',
      dataIndex: 'startType',
      key: 'startType',
      align: 'center',
      hidden: statusType === 'NOT_STARTED',
      width: 120,
    },
    {
      title: '创建时间',
      key: 'createTime',
      align: 'center',
      width: 180,
      render(value) {
        return <div>{formatTime(value.createTime, 'Y-M-D h:m')}</div>
      },
    },
  ] as TableProps['columns']

  const formSetting: Record<string, formSettingType[]> = {
    MSK: [
      {
        label: '关联约号',
        isRules: false,
        name: 'contractNo',
        formType: 'input',
      },
      {
        label: '免箱期',
        isRules: true,
        name: 'extentDndFreeDays',
        formType: 'inputNumber',
      },
      {
        label: 'rollable',
        isRules: true,
        formType: 'radio',
        name: 'withRollable',
        options: [
          {
            label: '需要',
            value: 1,
          },
          {
            label: '不需要',
            value: 0,
          },
        ],
      },
    ],
  }

  const operationColumns: TableProps['columns'] = [
    {
      title: '操作人',
      key: 'userName',
      dataIndex: 'userName',
      align: 'center',
    },
    {
      title: '操作时间',
      key: 'updateTime',
      align: 'center',
      render(value) {
        return <div>{formatTime(value.updateTime, 'Y-M-D h:m')}</div>
      },
    },
    {
      title: '操作信息',
      key: 'etd',
      align: 'center',
      dataIndex: 'content',
    },
  ]
  return {
    columns: columns,
    formSetting: formSetting,
    operationColumns: operationColumns,
  }
}
