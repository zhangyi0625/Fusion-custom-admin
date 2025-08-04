export interface ServiceSettingType {
  id?: null | string | number
  carrier: string
  mqExchange: string
  mqPassword: string
  mqPort: number
  mqQueue: string
  mqRoutingKey: string
  serverName: string
  mqUsername: string
  mqVirtualHost: string
  routeFndIds: string[]
  startType: 'HIGH_FREQ' | 'IMMEDIATE' | string
}
