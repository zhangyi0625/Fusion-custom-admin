export interface RouteMangeType {
  id?: string | null
  routeName: string
  fnds: string | string[]
}

export interface RouteMangeParams extends Partial<RouteMangeType> {
  page: number
  limit: number
}
