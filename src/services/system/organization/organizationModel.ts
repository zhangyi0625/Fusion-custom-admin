export interface SysOrganizationType {
  organizationId: string | null
  parentId: string | null
  organizationTypeName: string
  organizationName: string | null
  organizationFullName: string
  sortNumber: number
  comments: string
}

export interface SysOrganizationParams
  extends Pick<SysOrganizationType, 'organizationName' | 'parentId'> {
  page: number
  limit: number
}
