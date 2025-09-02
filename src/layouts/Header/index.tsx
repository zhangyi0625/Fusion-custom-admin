import {
  BellOutlined,
  GithubOutlined,
  LockOutlined,
  MailOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Badge, Dropdown, Input, Layout, Skeleton, Space, Tooltip } from 'antd'
import React, { Suspense, useCallback } from 'react'
import { memo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MessageBox from './component/MessageBox'
import FullScreen from './component/FullScreen'
import BreadcrumbNav from './component/BreadcrumbNav'
import UserDropdown from './component/UserDropdown'
import { type RootState, updatePreferences } from '@/stores/store'
import { useLocation, useNavigate } from 'react-router-dom'
import { defaultRoutes } from '@/router/router'
import { RouteObject } from '@/types/route'

const Setting = React.lazy(() => import('./component/Setting'))

/**
 * 顶部布局内容
 */
const Header: React.FC = memo(() => {
  const dispatch = useDispatch()

  const location = useLocation()

  const navigate = useNavigate()
  const [openSetting, setOpenSetting] = useState<boolean>(false)
  // 从全局状态中获取配置是否开启面包屑、图标
  const { breadcrumb } = useSelector((state: RootState) => state.preferences)

  /**
   * 跳转到github
   */
  const routeGitHub = () => {
    // window.open('https://github.com/yecongling/fusion-admin', '_blank')
  }

  /**
   * 检索菜单
   * @param name 菜单名
   */
  const searchMenu = (name: string) => {
    console.log(name)
  }

  const jumpRoute = (item: RouteObject) => {
    console.log(location, 'sss', item)
    navigate(item.path as string)
  }

  return (
    <>
      <Layout.Header
        className="ant-layout-header flex items-center"
        style={{
          borderBottom: '1px solid #e9edf0',
          padding: '0 24px',
        }}
      >
        <p className="text-blue-500 font-semibold text-base">
          销售系统供应商端
        </p>
        <Space
          size="large"
          className="flex flex-1 justify-end items-center toolbox"
        >
          {defaultRoutes.map((item) => (
            <p
              className={
                location.pathname === item.path
                  ? 'text-blue-500'
                  : 'text-stone-500'
              }
              key={item.path}
              onClick={() => jumpRoute(item)}
            >
              <span className="font-semibold cursor-pointer mr-[60px]">
                {item.title}
              </span>
            </p>
          ))}
          <UserDropdown />
        </Space>
      </Layout.Header>
    </>
  )
})
export default Header
