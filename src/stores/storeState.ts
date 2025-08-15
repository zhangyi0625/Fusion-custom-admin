/**
 * 全局的状态（如系统设置、主题等）
 */
import type { CustomerType } from '@/services/customerManage/Customer/CustomerModel'
import type { PayerUnitType } from '@/services/customerManage/PayerUnit/PayerUnitModel'
import type { ProductManageClassType } from '@/services/productManage/productManageModel'
import type { ContractsType } from '@/services/supplierManage/Contracts/ContractsModel'
import type { SysUserType } from '@/services/system/role/roleModel'
import type {
  BreadcrumbStyleType,
  BuiltinThemeType,
  ContentCompactType,
  LayoutHeaderMenuAlignType,
  LayoutHeaderModeType,
  LayoutType,
  LoginExpiredModeType,
  NavigationStyleType,
  PageAnimationType,
  PreferencesButtonPositionType,
  TabsStyleType,
  ThemeModeType,
} from '@/types/app'

// 菜单状态（独立出来，不做持久化）
export interface MenuState {
  // 菜单
  menus: any[]
}

export const initMenuState: MenuState = {
  // 菜单
  menus: [],
}

type SupportedLanguagesType = 'en-US' | 'zh-CN'

// 全局偏好设置
interface AppPreferences {
  /** 检查更新轮询时间 */
  checkUpdatesInterval: number
  /** 是否开启灰色模式 */
  colorGrayMode: boolean
  /** 是否开启色弱模式 */
  colorWeakMode: boolean
  /** 是否开启紧凑模式 */
  compact: boolean
  /** 是否开启内容紧凑模式 */
  contentCompact: ContentCompactType
  /** 应用默认头像 */
  defaultAvatar: string
  /** 开启动态标题 */
  dynamicTitle: boolean
  /** 是否开启检查更新 */
  enableCheckUpdates: boolean
  /** 是否显示偏好设置 */
  enablePreferences: boolean
  /**
   * @zh_CN 是否开启refreshToken
   */
  enableRefreshToken: boolean
  /** 是否移动端（目前考虑暂不支持移动端） - 后续移动端用RN（Flutter）开发 */
  isMobile: boolean
  /** 布局方式 */
  layout: LayoutType
  /** 支持的语言 */
  locale: SupportedLanguagesType
  /** 登录过期模式 */
  loginExpiredMode: LoginExpiredModeType
  /** 应用名 */
  name: string
  /** 偏好设置按钮位置 */
  preferencesButtonPosition: PreferencesButtonPositionType
  /**
   * @zh_CN 是否开启水印
   */
  watermark: boolean
}

/**
 * 面包屑配置
 */
interface BreadcrumbPreferences {
  /** 面包屑是否启用 */
  enable: boolean
  /** 面包屑是否只有一个时隐藏 */
  hideOnlyOne: boolean
  /** 面包屑首页图标是否可见 */
  showHome: boolean
  /** 面包屑图标是否可见 */
  showIcon: boolean
  /** 面包屑风格 */
  styleType: BreadcrumbStyleType
}

/**
 * 顶栏配置
 */
interface HeaderPreferences {
  /** 顶栏是否启用 */
  enable: boolean
  /** 顶栏是否隐藏,css-隐藏 */
  hidden: boolean
  /** 顶栏菜单位置 */
  menuAlign: LayoutHeaderMenuAlignType
  /** header显示模式 */
  mode: LayoutHeaderModeType
}

/**
 * 侧边栏配置
 */
interface SidebarPreferences {
  /** 点击目录时自动激活子菜单   */
  autoActivateChild: boolean
  /** 侧边栏是否折叠 */
  collapsed: boolean
  /** 侧边栏折叠时，是否显示title */
  collapsedShowTitle: boolean
  /** 侧边栏是否可见 */
  enable: boolean
  /** 菜单自动展开状态 */
  expandOnHover: boolean
  /** 侧边栏扩展区域是否折叠 */
  extraCollapse: boolean
  /** 侧边栏是否隐藏 - css */
  hidden: boolean
  /** 侧边栏宽度 */
  width: number
}

/**
 * 底栏配置
 */
interface FooterPreferences {
  /** 底栏是否可见 */
  enable: boolean
  /** 底栏是否固定 */
  fixed: boolean
}

/**
 * logo配置
 */
interface LogoPreferences {
  /** logo是否可见 */
  enable: boolean
  /** logo地址 */
  source: string
}

/**
 * 标签页配置
 */
interface TabbarPreferences {
  /** 是否开启多标签页拖拽 */
  draggable: boolean
  /** 是否开启多标签页 */
  enable: boolean
  /** 标签页高度 */
  height: number
  /** 开启标签页缓存功能 */
  keepAlive: boolean
  /** 是否持久化标签 */
  persist: boolean
  /** 是否开启多标签页图标 */
  showIcon: boolean
  /** 显示最大化按钮 */
  showMaximize: boolean
  /** 显示更多按钮 */
  showMore: boolean
  /** 标签页风格 */
  styleType: TabsStyleType
  /** 是否开启鼠标滚轮响应 */
  wheelable: boolean
}

/**
 * 主题配置
 */
interface ThemePreferences {
  /** 内置主题名 */
  builtinType: BuiltinThemeType
  /** 错误色 */
  colorError: string
  /** 主题色 */
  colorPrimary: string
  /** 成功色 */
  colorSuccess: string
  /** 警告色 */
  colorWarning: string
  /** 当前主题 */
  mode: ThemeModeType
  /** 圆角 */
  radius: string
  /** 是否开启半深色header（只在theme='light'时生效） */
  semiDarkHeader: boolean
  /** 是否开启半深色菜单（只在theme='light'时生效） */
  semiDarkSidebar: boolean
}

/**
 * 动画配置
 */
interface AnimationPreferences {
  /** 页面切换动画是否启用 */
  enable: boolean
  // /** 是否开启页面加载loading */
  loading: boolean
  /** 页面切换动画 */
  name: PageAnimationType | string
  /** 是否开启页面加载进度动画 */
  progress: boolean
}

/**
 * 小部件配置
 */
interface WidgetPreferences {
  /** 是否启用全屏部件 */
  fullscreen: boolean
  /** 是否启用全局搜索部件 */
  globalSearch: boolean
  /** 是否启用语言切换部件 */
  languageToggle: boolean
  /** 是否开启锁屏功能 */
  lockScreen: boolean
  /** 锁屏状态 */
  lockScreenStatus: boolean
  /** 是否显示通知部件 */
  notification: boolean
  /** 显示刷新按钮 */
  refresh: boolean
  /** 是否显示侧边栏显示/隐藏部件 */
  sidebarToggle: boolean
  /** 是否显示主题切换部件 */
  themeToggle: boolean
}

/**
 * 快捷键配置
 */
interface ShortcutKeyPreferences {
  /** 是否启用快捷键-全局 */
  enable: boolean
  /** 是否启用全局锁屏快捷键 */
  globalLockScreen: boolean
  /** 是否启用全局注销快捷键 */
  globalLogout: boolean
  /** 是否启用全局偏好设置快捷键 */
  globalPreferences: boolean
  /** 是否启用全局搜索快捷键 */
  globalSearch: boolean
}

/**
 * 导航配置
 */
interface NavigationPreferences {
  /** 导航菜单手风琴模式 */
  accordion: boolean
  /** 导航菜单是否切割，只在 layout=mixed-nav 生效 */
  split: boolean
  /** 导航菜单风格 */
  styleType: NavigationStyleType
}

/**
 * 版权配置
 */
export interface CopyrightPreferences {
  /** 版权公司名 */
  companyName: string
  /** 版权公司名链接 */
  companySiteLink: string
  /** 版权日期 */
  date: string
  /** 版权是否可见 */
  enable: boolean
  /** 备案号 */
  icp: string
  /** 备案号链接 */
  icpLink: string
  /** 设置面板是否显示*/
  settingShow?: boolean
}

/**
 * 系统配置参数
 */

export interface sysSettingPreferences {
  publicData: any
  publicSetting: any
}

/**
 * 基础数据维护
 */

export interface essentailPreferences {
  // /** 细分航线缓存 */
  // routeData: RouteMangeType[] | undefined
  // /** 起运港缓存 */
  // porPortData: PortManageType[] | undefined
  // /** 目的港缓存 */
  // fndPortData: PortManageType[] | undefined
  // /** 船司数据缓存 */
  // carrierData: CarrierManageType[] | undefined
  // /** 客户数据缓存 */
  // customerData: CustomerManageType[] | undefined
  // /** 关联服务缓存 */
  // relevanceService: ServiceSettingType[] | undefined
  /** 产品分类 */
  productClass: ProductManageClassType[] | undefined
  productDetailClass: Record<string, ProductManageClassType[]> | undefined
  /** 客户数据缓存 */
  customerData: CustomerType[] | undefined
  /** 系统用户数据缓存 */
  userData: SysUserType[] | undefined
  /** 签约单位缓存 */
  contractingData: ContractsType[] | undefined
  /** 付款单位缓存 */
  payerUnitData: PayerUnitType[] | undefined
  [key: string]: any
}

/**
 * 项目整体的偏好设置
 */
export interface Preferences {
  /** 全局偏好设置 */
  app: AppPreferences
  /** 面包屑配置 */
  breadcrumb: BreadcrumbPreferences
  /** 顶栏配置 */
  header: HeaderPreferences
  /** 侧边栏配置 */
  sidebar: SidebarPreferences
  /** 底栏配置 */
  footer: FooterPreferences
  /** logo配置 */
  logo: LogoPreferences
  /** 标签页配置 */
  tabbar: TabbarPreferences
  /** 主题配置 */
  theme: ThemePreferences
  /** 动画配置 */
  animation: AnimationPreferences
  /** 功能配置 */
  widget: WidgetPreferences
  /** 快捷键配置 */
  shortcut: ShortcutKeyPreferences
  /** 导航配置 */
  navigation: NavigationPreferences
  /** 版权配置 */
  copyright: CopyrightPreferences
}
