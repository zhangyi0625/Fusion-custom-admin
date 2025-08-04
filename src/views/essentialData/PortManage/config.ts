import { CheckboxOptionType, SelectProps } from 'antd'
import type { CustomColumn } from '@/components/searchForm'
import { replaceObjectName } from '@/utils/tool'

type PortSettingSelectType = SelectProps['options'] | CheckboxOptionType[] | any

export const PortSettingSelect: Record<string, PortSettingSelectType> = {
  isPort: [
    {
      value: 'isPor',
      label: '起运港',
    },
    {
      value: 'isFnd',
      label: '目的港',
    },
  ],
  enabled: [
    {
      value: 1,
      label: '启用',
    },
    {
      value: 0,
      label: '不启用',
    },
  ],
  whether: [
    {
      value: 1,
      label: '是',
    },
    {
      value: 0,
      label: '否',
    },
  ],
}

export const SelectPortManageOptions: CustomColumn[] = [
  {
    label: '港口编码',
    name: 'code',
    formType: 'input',
    span: 6,
  },
  {
    label: '港口名称',
    name: 'name',
    formType: 'input',
    span: 6,
  },
  {
    label: '港口标签',
    name: 'tag',
    formType: 'select',
    span: 6,
    options: replaceObjectName(
      PortSettingSelect['isPort'],
      ['label', 'value'],
      ['name', 'id']
    ),
  },
  {
    label: '热门港口',
    name: 'isPopularity',
    formType: 'select',
    options: replaceObjectName(
      PortSettingSelect['whether'],
      ['label', 'value'],
      ['name', 'id']
    ),
    span: 6,
  },
]
