import { CustomColumn } from '@/components/searchForm'

export const SelectRouteManageOptions: CustomColumn[] = [
  {
    label: '航线',
    name: 'routeName',
    formType: 'input',
    span: 6,
  },
  {
    label: '目的港',
    name: 'fnds',
    formType: 'normalSelect',
    options: [],
    span: 6,
  },
]
