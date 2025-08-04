import { CustomColumn } from '@/components/searchForm'
import { CarrierManageType } from '@/services/essential/carrierManage/carrierManageModel'
import { CustomerManageType } from '@/services/essential/customerManage/customerManageModel'
import { replaceObjectName } from '@/utils/tool'
import { TableProps } from 'antd'
import { useCallback, useState } from 'react'
import { SelectShippingAccountOptions } from './config'

type ShippingAccountColumnsType = 'tableColumns' | 'searchFilter' | 'form'

type SelectOptionsType = {
  carrierData: CarrierManageType[] | unknown
  customerData: CustomerManageType | unknown
  serverData: unknown
}

export default function getShippingAccountColumns(
  type: ShippingAccountColumnsType,
  selectOptions: SelectOptionsType,
  judgeFilter: {
    judge: boolean
  }
) {
  console.log(selectOptions, 'selectOptions', judgeFilter)

  const searchFilter = [
    {
      label: '船公司',
      name: 'carrier',
      formType: 'normalSelect',
      options: selectOptions.carrierData
        ? replaceObjectName(
            selectOptions.carrierData,
            ['code', 'code'],
            ['label', 'value']
          )
        : [],
      span: 6,
    },
    {
      label: '客户名称',
      name: 'customerId',
      formType: 'normalSelect',
      options: selectOptions.customerData
        ? replaceObjectName(
            selectOptions.customerData,
            ['id', 'name'],
            ['value', 'label']
          )
        : [],
      span: 6,
    },
    {
      label: '船司账号',
      name: 'account',
      formType: 'input',
      span: 6,
    },
    {
      label: '是否启用',
      name: 'isEnable',
      formType: 'normalSelect',
      options: [
        {
          label: '启用',
          value: 1,
        },
        {
          label: '不启用',
          value: 0,
        },
      ],
      span: 6,
    },
    {
      label: '关联服务',
      name: 'serverName',
      formType: 'select',
      options: [],
      hidden: !judgeFilter.judge,
      span: 6,
    },
    {
      label: '查询状态',
      name: 'isQuery',
      formType: 'select',
      hidden: judgeFilter.judge,
      options: [
        {
          label: '是',
          value: 1,
        },
        {
          label: '否',
          value: 0,
        },
      ],
      span: 6,
    },
  ]

  // console.log(searchFilter, 'searchFilter()')

  const tableColumns: TableProps['columns'] = []
  const form: any = []

  return {
    tableColumns: tableColumns,
    searchFilter: searchFilter,
    form: form,
  }[type]
}
