export interface SysOrganizationType {
  organizationId: string | null
  parentId: string
  organizationTypeName: string
  organizationName: string | null
  organizationFullName: string
  sortNumber: number
  comments: string
}

export interface SysOrganizationParams
  extends Pick<SysOrganizationType, 'organizationName'> {
  page: number
  limit: number
}
