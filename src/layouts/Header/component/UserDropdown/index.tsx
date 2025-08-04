import { App, Avatar, Divider, Dropdown, theme, type MenuProps } from 'antd'
import avatar from '@/assets/images/avatar.png'
import { useNavigate } from 'react-router-dom'
import {
  ExclamationCircleOutlined,
  FileMarkdownOutlined,
  LockOutlined,
  LogoutOutlined,
  QuestionCircleFilled,
  SyncOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { logout } from '@/services/login/loginApi'
import type { ReactNode } from 'react'
import React from 'react'
import { updatePreferences } from '@/stores/store'
import { useDispatch } from 'react-redux'

const { useToken } = theme

/**
 * 用户信息下拉框
 * @returns
 */
const UserDropdown: React.FC = () => {
  const dispatch = useDispatch()
  const { token } = useToken()
  const { modal } = App.useApp()

  const navigate = useNavigate()

  // 菜单栏
  const items: MenuProps['items'] = [
    {
      key: 'doc',
      label: '文档',
      icon: <FileMarkdownOutlined />,
    },
    {
      key: '1',
      label: '个人中心',
      icon: <UserOutlined />,
      disabled: false,
      onClick: () => {
        // 个人中心做成一个弹窗，内部可以修改
      },
    },
    {
      key: 'help',
      label: '问题 & 帮助',
      icon: <QuestionCircleFilled />,
    },
    {
      type: 'divider',
    },
    {
      key: '3',
      label: '刷新缓存',
      icon: <SyncOutlined />,
      onClick: () => {
        /**
         * 后端的缓存信息（相当于把缓存数据刷新）
         * 清除local storage所有redux数据 为了重新缓存新数据
         */
        localStorage.clear()
        window.location.reload()
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'lock',
      label: '锁屏',
      icon: <LockOutlined />,
      onClick: () => {
        dispatch(updatePreferences('widget', 'lockScreenStatus', true))
      },
    },
    {
      type: 'divider',
    },
    {
      key: '4',
      label: '退出登录',
      icon: <LogoutOutlined />,
      disabled: false,
      extra: 'alt + Q',
      onClick: () => {
        modal.confirm({
          title: '退出登录',
          icon: <ExclamationCircleOutlined />,
          content: '确认退出登录吗？',
          okText: '确认',
          onOk: () => {
            const token = sessionStorage.getItem('token')

            // 清除后端的信息
            logout(token as string)
            // 清空token
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('roleId')
            sessionStorage.removeItem('isLogin')
            sessionStorage.removeItem('loginUser')

            // 修改回document.title
            document.title = '销售协同管理系统 - 登录'
            // 退出到登录页面
            navigate('/login')
          },
          cancelText: '取消',
        })
      },
    },
  ]

  /**
   * 内容样式
   */
  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  }

  /**
   * 自定义渲染
   * @param menus 菜单
   * @returns
   */
  const renderDropdown = (menus: ReactNode) => {
    return (
      <div className="dropdownContent" style={contentStyle}>
        <div className="avatar flex items-center p-3">
          <Avatar size="large" src={avatar} />
        </div>
        <Divider style={{ margin: '2px 0' }} />
        {React.cloneElement(menus as React.ReactElement, {
          style: { boxShadow: 'none' },
        })}
      </div>
    )
  }

  return (
    <>
      <Dropdown
        menu={{ items }}
        popupRender={renderDropdown}
        placement="bottomLeft"
        overlayStyle={{ width: 240 }}
      >
        <div className="login-user flex items-center cursor-pointer justify-between h-[50] transition-all duration-300">
          <Avatar size="default" src={avatar} />
          <span style={{ margin: '0 0 0 6px' }}>
            {sessionStorage.getItem('loginUser') || 'username'}
          </span>
        </div>
      </Dropdown>
    </>
  )
}

export default UserDropdown
