import React, { useEffect, useState } from 'react'
import { Button, Drawer, Space, Tree, TreeProps } from 'antd'
import { CloseOutlined, DownOutlined } from '@ant-design/icons'
import { getUserAuthority, getUserList } from '@/services/system/user/userApi'
import { getOrganizationList } from '@/services/system/organization/organization'
import type { SysOrganizationType } from '@/services/system/organization/organizationModel'
import type { SysUserType } from '@/services/system/role/roleModel'

export type UserAuthorityProps = {
  params: {
    visible: boolean
    userId: string
  }
  onCancel: () => void
  onOk: (selected: string[]) => void
}

interface ReGroupSysOrganizationType extends SysOrganizationType {
  children: ReGroupSysOrganizationChildType[]
}

interface ReGroupSysOrganizationChildType {
  parentdId: string
  organizationId: string
  organizationName: string
}

const UserAuthority: React.FC<UserAuthorityProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, userId } = params

  const [treeData, setTreeData] = useState<any[]>([])

  const [checked, setChecked] = useState<string[]>([])

  const [expandedKeys, setExpandedKeys] = useState<string[]>([])

  const [userList, setUserList] = useState<SysUserType[]>([])

  useEffect(() => {
    if (!visible) return
    init()
  }, [visible])

  const init = () => {
    Promise.all([
      getUserList(),
      getOrganizationList(),
      getUserAuthority(userId),
    ]).then((result) => {
      setUserList(result[0])
      const expanded: string[] = []
      result[1].map((item: ReGroupSysOrganizationType) => {
        item.children = []
        let userData = result[0].filter(
          (userItem: SysUserType) => userItem.userId !== userId
        )
        userData.map((el: SysUserType) => {
          if (item.organizationId === el.organizationId) {
            item.children.push({
              ...el,
              parentdId: el.organizationId,
              organizationId: el.userId as string,
              organizationName: el.username,
            })
          }
        })
      })
      const userIdList = result[0].map((item: SysUserType) => item.userId)
      const isSelectData = result[2].filter((el: { viewId: string }) =>
        userIdList.includes(el.viewId)
      )
      const selectData = isSelectData.map(
        (item: { viewId: string }) => item.viewId
      )
      transformData(result[1], expanded)
      setTreeData(result[1])
      setExpandedKeys(expanded)
      setChecked(selectData)
    })
  }

  const transformData = (data: any, expanded: string[]) => {
    return data.map((item: any) => {
      if (item.children?.length > 0) {
        expanded.push(item.organizationId)
      }
      if (item.children) {
        transformData(item.children, expanded)
      }
      return item
    })
  }

  const handleChecked: TreeProps['onCheck'] = (checkedKeysValue) => {
    let newArr: string[] = []
    userList.map((item) => {
      if ((checkedKeysValue as string[]).includes(item.userId as string))
        newArr.push(item.userId as string)
    })
    setChecked(newArr)
  }

  const handleOk = () => {
    console.log(checked)
  }
  return (
    <>
      <Drawer
        title="权限分配"
        width={500}
        open={visible}
        closeIcon={false}
        extra={
          <Button type="text" icon={<CloseOutlined />} onClick={onCancel} />
        }
        onClose={onCancel}
        classNames={{ footer: 'text-right' }}
        footer={
          <Space>
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" onClick={() => onOk(checked)}>
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
          fieldNames={{
            title: 'organizationName',
            key: 'organizationId',
            children: 'children',
          }}
          treeData={treeData}
          checkedKeys={checked}
          onCheck={handleChecked}
        />
      </Drawer>
    </>
  )
}

export default UserAuthority
