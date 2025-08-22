import { useEffect, useState } from 'react'
import { Button, Drawer, Space, Tree, type TreeProps } from 'antd'
import {
  CloseOutlined,
  DownOutlined,
  FolderFilled,
  FolderOpenFilled,
} from '@ant-design/icons'
import { assignRoleMenu, getRoleMenu } from '@/services/system/role/roleApi'
import { getIcon } from '@/utils/utils'
import { getMenusList } from '@/services/system/menu/menuApi'
import { buildTree } from '@/utils/tool'

export type RoleMenuDrawerProps = {
  open: boolean
  // 角色id（通过角色id查询角色已经分配的菜单）
  roleId: string
  // 点击确定的回调
  onOk: (e: React.MouseEvent<HTMLButtonElement>) => void
  // 点击取消的回调
  onCancel: (e: any) => void
}

/**
 * 角色菜单授权界面
 * @returns
 */
const RoleMenuDrawer: React.FC<RoleMenuDrawerProps> = ({
  open,
  roleId,
  onOk,
  onCancel,
}) => {
  // 树组件的数据
  const [treeData, setTreeData] = useState<any[]>([])
  // 选中的节点
  const [checked, setChecked] = useState<string[]>([])
  // 展开的节点
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])

  useEffect(() => {
    if (!open) return
    // 调用获取所有菜单接口方法 对比角色下的菜单 回显选中数据
    init()
  }, [open])

  const init = () => {
    getMenusList({ sort: 'sortNumber' }).then((result) => {
      getRoleMenu(roleId).then((resp: any) => {
        // 内部包含menuList和menuIds
        const expanded: string[] = []
        // 生成树结构
        const data = transformData(buildTree(result, 'menuId'), expanded)
        const selectData = transformData(resp, []).map(
          (item: { menuId: string }) => item.menuId
        )
        setTreeData(data)
        setChecked(selectData)
        setExpandedKeys(expanded)
      })
    })
  }

  /**
   * 数据转换
   * @param data 原始数据
   * @param expanded 需要展开的数据
   */
  const transformData = (data: any, expanded: string[]) => {
    return data.map((item: any) => {
      if (item.icon) {
        item.icon = getIcon(item.icon)
      }
      if (item.children?.length > 0) {
        expanded.push(item.menuId)
      }
      if (item.children) {
        transformData(item.children, expanded)
      }
      return item
    })
  }

  /**
   * 点击确定的时候的操作
   * @param e
   */
  const handleOk = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 保存分配的菜单数据
    assignRoleMenu({ roleId: roleId, menuIds: checked }).then(() => {
      // 关闭弹窗
      onOk(e)
    })
  }

  /**
   * 处理节点选中
   * @param checkedKeys 选中的节点
   * @param e
   */
  const handleChecked: TreeProps['onCheck'] = (checkedKeysValue) => {
    setChecked(checkedKeysValue as string[])
  }

  return (
    <Drawer
      title="授权菜单"
      width={400}
      open={open}
      closeIcon={false}
      extra={<Button type="text" icon={<CloseOutlined />} onClick={onCancel} />}
      onClose={onCancel}
      classNames={{ footer: 'text-right' }}
      footer={
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={handleOk}>
            确认
          </Button>
        </Space>
      }
    >
      <Tree
        blockNode
        checkable
        showIcon
        switcherIcon={<DownOutlined />}
        defaultExpandAll
        expandedKeys={expandedKeys}
        fieldNames={{ title: 'title', key: 'menuId', children: 'children' }}
        icon={(props: any) => {
          // 没有isLeaf这个属性表明是一级菜单
          const { isLeaf } = props.data
          if (!isLeaf) {
            return props.expanded ? (
              <FolderOpenFilled style={{ fontSize: '16px', color: 'orange' }} />
            ) : (
              <FolderFilled style={{ fontSize: '16px', color: 'orange' }} />
            )
          }
          return <></>
        }}
        treeData={treeData}
        checkedKeys={checked}
        onCheck={handleChecked}
      />
    </Drawer>
  )
}
export default RoleMenuDrawer
