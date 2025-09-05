type FilterOptionsType = {
  title: string
  value: string | null
}

export const FilterOptions: FilterOptionsType[] = [
  {
    title: '推荐',
    value: '',
  },
  {
    title: '最新发布',
    value: 'create_time desc',
  },
  {
    title: '预算最高',
    value: 'estimated_amount desc',
  },
]
