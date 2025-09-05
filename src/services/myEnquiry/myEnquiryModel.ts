import { DefaultPaging } from '@/types/global'

export interface MyEnquiryParams extends DefaultPaging {
  sort: string
  title: string | null
  alternative: boolean
}
