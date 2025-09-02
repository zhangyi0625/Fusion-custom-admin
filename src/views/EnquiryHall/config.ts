type FilterOptionsType = {
  title: string
  value: string | null
}

export const FilterOptions: FilterOptionsType[] = [
  {
    title: '推荐',
    value: null,
  },
  {
    title: '最新发布',
    value: 'new',
  },
  {
    title: '预算最高',
    value: 'price',
  },
]
