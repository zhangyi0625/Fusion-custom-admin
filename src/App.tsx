import { Spin, App as AntdApp, Skeleton } from 'antd'
import type React from 'react'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { Router } from '@/router/router'
import { antdUtils } from '@/utils/antdUtil'

/**
 * 主应用
 */
const App: React.FC = () => {
  // 触发更新的钩子函数
  const dispatch = useDispatch()
  // 应用加载中
  const [loading, setLoading] = useState<boolean>(false)
  // 路由跳转
  const navigate = useNavigate()
  const location = useLocation()
  // 方便非react组件内部使用
  const { notification, message, modal } = AntdApp.useApp()

  // 组件挂载完成后加载用户菜单
  useEffect(() => {
    // 设置antd组件的实例(用于非react组件内部使用)
    antdUtils.setMessageInstance(message)
    antdUtils.setNotificationInstance(notification)
    antdUtils.setModalInstance(modal)
    // 去后台查询菜单，也需要判定当前是否登录，未登录的话就跳转登录页面
    const isLogin = sessionStorage.getItem('isLogin')
    if (
      isLogin === 'false' ||
      !isLogin ||
      location.pathname === '/supplierLogin'
    ) {
      navigate('/supplierLogin')
    } else {
      // getMenuData()
      setLoading(false)
    }
  }, [location.pathname, navigate])

  return (
    <>
      {loading ? (
        <Spin size="large" fullscreen style={{ fontSize: 48 }} />
      ) : (
        <Suspense fallback={<Skeleton />}>
          <Router />
        </Suspense>
      )}
    </>
  )
}
export default App
