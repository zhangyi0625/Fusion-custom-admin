import type React from 'react'
import { memo, useEffect, useState } from 'react'
import {
  Layout,
  Image,
  Spin,
  Menu,
  type MenuProps,
  Button,
  Divider,
  Space,
  Segmented,
  Tooltip,
  ConfigProvider,
  Empty,
} from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { type RootState, updatePreferences } from '@/stores/store.ts'
import logo from '@/assets/images/icon-192.png'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import './leftMenu.scss'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  QuestionCircleOutlined,
  SunOutlined,
} from '@ant-design/icons'
import type { RouteItem } from '@/types/route'
import { getIcon, getOpenKeys, searchRoute } from '@/utils/utils'

type MenuItem = Required<MenuProps>['items'][number]

/**
 * 左边的菜单栏
 */
const LeftMenu: React.FC = memo(() => {
  // 从状态库中获取状态
  const { sidebar, theme, navigation } = useSelector(
    (state: RootState) => state.preferences
  )
  const { menus } = useSelector((state: RootState) => state.menuState)
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  // 定义一些状态变量
  const [menuList, setMenuList] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(false)
  const [openKeys, setOpenKeys] = useState<string[]>([])

  const { collapsed, width } = sidebar
  let { mode } = theme
  if (mode === 'auto') {
    mode = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }
  // 是否暗黑模式
  const isDark = mode === 'dark'

  const titleColor = isDark ? '#fff' : '#1890ff'

  const getItem = (
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group'
  ): MenuItem => {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem
  }

  // 处理后台返回菜单 key 值为 antd 菜单需要的 key 值
  const deepLoopFloat = (menuList: RouteItem[], newArr: MenuItem[] = []) => {
    for (const item of menuList) {
      // 如果不能显示的菜单不显示
      if (item.menuType === 2) {
        continue
      }
      // 下面判断代码解释 *** !item?.children?.length   ==>   (!item.children || item.children.length === 0)
      if (!item?.children?.length) {
        newArr.push(getItem(item.title, item.path, getIcon(item.icon)))
        continue
      }
      newArr.push(
        getItem(
          item.title,
          item.path,
          getIcon(item.icon),
          deepLoopFloat(item.children)
        )
      )
    }
    return newArr
  }

  /**
   * 菜单点击跳转
   */
  const clickMenu: MenuProps['onClick'] = ({ key }: { key: string }) => {
    // 配置外置跳转路由
    // if (route.meta.isLink) window.open(route.meta.isLink, "_blank");
    navigate(key)
  }

  // 刷新页面菜单保持高亮
  useEffect(() => {
    const openKey = getOpenKeys(pathname)
    // 判断如果是二级路由，不在左边菜单那种的就不去更新
    const route = searchRoute(pathname, menus)
    if (route && Object.keys(route).length) {
      const title = route.title
      if (title) document.title = `${title} - 在舱光速抢舱管理平台`
      if (!collapsed) setOpenKeys(openKey)
    }
  }, [pathname, collapsed, menus])

  // 设置当前展开的 subMenu
  const onOpenChange = (openKeys: string[]) => {
    if (openKeys.length < 1) return setOpenKeys(openKeys)
    const latestOpenKey = openKeys[openKeys.length - 1]
    if (latestOpenKey.includes(openKeys[0])) return setOpenKeys(openKeys)
    setOpenKeys([latestOpenKey])
  }

  // 组件挂载加载菜单
  useEffect(() => {
    if (!menus || menus.length === 0) return
    setLoading(true)
    const menu = deepLoopFloat(menus, [])
    setMenuList(menu)
    setLoading(false)
  }, [menus])

  return (
    <Layout.Sider
      trigger={null}
      collapsedWidth={48}
      className="scroll ant-menu"
      style={{
        overflowX: 'hidden',
        zIndex: 999,
        boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.08)',
      }}
      collapsible
      width={width}
      theme={mode}
      collapsed={collapsed}
    >
      <div className="flex justify-between items-center toolbox">
        <Link to="/" style={{ width: '100%' }}>
          <div className="h-16 flex items-center justify-center">
            <Image width={25} src={logo} preview={false} />
            {!collapsed && (
              <p
                style={{
                  fontWeight: 'bold',
                  margin: '0 12px',
                  fontSize: '16px',
                  color: titleColor,
                }}
              >
                销售协同管理系统
              </p>
            )}
          </div>
        </Link>
      </div>
      <Spin wrapperClassName="side-menu" spinning={loading} tip="加载中">
        {menuList.length > 0 ? (
          <Menu
            mode="inline"
            theme={mode}
            defaultSelectedKeys={[pathname]}
            openKeys={navigation.accordion ? openKeys : undefined}
            items={menuList}
            onClick={clickMenu}
            onOpenChange={onOpenChange}
          />
        ) : (
          <Empty description={<>暂无菜单，请检查用户角色是否具有菜单！</>} />
        )}
      </Spin>
      <Divider style={{ margin: '8px 0' }} />
      <div
        className="flex justify-center content-center"
        style={{
          height: collapsed ? '140px' : '40px',
        }}
      >
        <Space
          direction={collapsed ? 'vertical' : 'horizontal'}
          align="center"
          className="justify-center"
        >
          <ConfigProvider
            theme={{
              components: {
                Segmented: {
                  itemHoverColor: isDark ? '#eee' : 'rgba(0,0,0,0.88)',
                  itemColor: isDark ? '#fff' : 'rgba(0, 0, 0, 0.65)',
                  itemSelectedBg: isDark ? '#1677ff' : '#fff',
                  itemSelectedColor: isDark ? '#fff' : 'rgba(0,0,0,0.88)',
                  trackBg: isDark ? '#001529' : '#f5f5f5',
                },
              },
            }}
          >
            <Segmented
              onChange={(value) =>
                dispatch(updatePreferences('theme', 'mode', value))
              }
              vertical={collapsed}
              size="small"
              options={[
                {
                  label: collapsed ? '' : 'light',
                  value: 'light',
                  icon: <SunOutlined />,
                },
                {
                  label: collapsed ? '' : 'dark',
                  value: 'dark',
                  icon: <MoonOutlined />,
                },
              ]}
            />
          </ConfigProvider>
          <Tooltip title="帮助文档">
            <Button
              size="small"
              color="default"
              variant="filled"
              shape="circle"
              icon={
                <QuestionCircleOutlined
                  style={{ color: isDark ? 'white' : 'black' }}
                />
              }
            />
          </Tooltip>
          <Button
            size="small"
            color="default"
            variant="filled"
            shape="circle"
            style={{
              cursor: 'pointer',
              fontSize: '16px',
            }}
            icon={
              collapsed ? (
                <MenuUnfoldOutlined
                  style={{ color: isDark ? 'white' : 'black' }}
                />
              ) : (
                <MenuFoldOutlined
                  style={{ color: isDark ? 'white' : 'black' }}
                />
              )
            }
            onClick={() =>
              dispatch(updatePreferences('sidebar', 'collapsed', !collapsed))
            }
            className="btnbor"
          />
        </Space>
      </div>
    </Layout.Sider>
  )
})

export default LeftMenu
