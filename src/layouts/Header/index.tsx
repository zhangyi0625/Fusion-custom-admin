import { Layout, Space } from 'antd'
import React, { memo } from 'react'
import UserDropdown from './component/UserDropdown'
import { useLocation, useNavigate } from 'react-router-dom'
import { defaultRoutes } from '@/router/router'
import { RouteObject } from '@/types/route'

/**
 * 顶部布局内容
 */
const Header: React.FC = memo(() => {
  const location = useLocation()

  const navigate = useNavigate()

  const jumpRoute = (item: RouteObject) => {
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
          {defaultRoutes
            .filter((el) => !el.caseSensitive)
            .map((item) => (
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
