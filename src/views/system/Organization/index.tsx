import { Key, useEffect, useRef, useState } from 'react'
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  type TableProps,
  TablePaginationConfig,
  Form,
  Row,
  Col,
  Tree,
  Input,
  Empty,
  Dropdown,
  MenuProps,
} from 'antd'
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  PlusCircleOutlined,
} from '@ant-design/icons'
import {
  getOrganizationListByPage,
  addOrganization,
  updateOrganization,
  deleteOrganization,
  deleteBatchOrganization,
  getOrganizationList,
} from '@/services/system/organization/organization'
import useParentSize from '@/hooks/useParentSize'
import { SearchTable } from 'customer-search-form-table'
import AddOrganization from './AddOrganization'
import type {
  SysOrganizationParams,
  SysOrganizationType,
} from '@/services/system/organization/organizationModel'
import { buildTree, filterKeys } from '@/utils/tool'

type SysOrganizationTypeWithKey = SysOrganizationType & { key: Key }

/**
 * 系统组织机构维护
 * @returns
 */
const Organization: React.FC = () => {
  const { modal, message } = App.useApp()

  const { parentRef, height } = useParentSize()

  const [immediate, setImmediate] = useState<boolean>(true)

  const organizationKeys = [
    'key',
    'organizationId',
    'parentId',
    'organizationTypeName',
    'organizationName',
    'organizationFullName',
    'sortNumber',
    'comments',
  ]

  // 右键菜单位置
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    x: number
    y: number
  }>({ x: 0, y: 0 })

  const [visible, setVisible] = useState<boolean>(false)

  // 选中的节点
  const [selectedNode, setSelectedNode] =
    useState<SysOrganizationTypeWithKey | null>(null)

  // 当前选中的行数据
  const [selRows, setSelectedRows] = useState<string[]>([])

  const dropdownRef = useRef<HTMLDivElement>(null)

  // 将当前编辑行和窗口开关合并为一个状态对象
  const [params, setParams] = useState<{
    visible: boolean
    currentRow: SysOrganizationType | null
    parentId: string | null
  }>({
    visible: false,
    currentRow: null,
    parentId: null,
  })

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<SysOrganizationParams>({
      page: 1,
      limit: 10,
      organizationName: null,
      parentId: null,
    })

  // 点击其他地方关闭菜单
  useEffect(() => {
    // 监听点击事件，如果点击的是dropdown，则不关闭
    const handleClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setVisible(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  useEffect(() => {
    setImmediate(true)
    getAllOranization('first')
  }, [])

  const [treeData, setTreeData] = useState([])

  // 表格的列配置
  const columns: TableProps['columns'] = [
    {
      title: '机构名称',
      dataIndex: 'organizationName',
      key: 'organizationName',
      align: 'center',
      width: 180,
    },
    {
      title: '机构全称',
      dataIndex: 'organizationFullName',
      key: 'organizationFullName',
      align: 'center',
      width: 180,
    },
    {
      title: '机构代码',
      dataIndex: 'organizationCode',
      key: 'organizationCode',
      align: 'center',
      width: 120,
    },
    {
      title: '机构类型',
      dataIndex: 'organizationType',
      key: 'organizationType',
      align: 'center',
      width: 120,
    },
    {
      title: '机构类型名称',
      dataIndex: 'organizationTypeName',
      key: 'organizationTypeName',
      align: 'center',
      width: 150,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      align: 'center',
      width: 200,
    },
    {
      title: '操作',
      width: '14%',
      dataIndex: 'action',
      fixed: 'right',
      align: 'center',
      render(_, record) {
        return (
          <Space size={0}>
            <Button
              type="link"
              size="small"
              onClick={() => {
                setParams({
                  visible: true,
                  currentRow: record as SysOrganizationType,
                  parentId: record.parentId,
                })
              }}
            >
              修改
            </Button>
            <Button
              type="link"
              danger
              size="small"
              onClick={() => deleteDic(record.organizationId)}
            >
              删除
            </Button>
          </Space>
        )
      },
    },
  ]

  // 右键菜单选项
  const contextMenu: MenuProps['items'] = [
    {
      key: 'add',
      label: '添加同级',
      icon: <PlusCircleOutlined />,
      extra: <>⌘ + N</>,
      disabled: selectedNode?.parentId === '0',
      onClick: () => {
        setParams({
          visible: true,
          currentRow: null,
          parentId: selectedNode?.parentId as string,
        })
        setVisible(false)
      },
    },
    {
      key: 'addSub',
      label: '添加下级',
      icon: <PlusCircleOutlined />,
      extra: <>⌘ + A</>,
      onClick: () => {
        setParams({
          visible: true,
          currentRow: null,
          parentId: selectedNode?.organizationId as string,
        })
        setVisible(false)
      },
    },
    {
      key: 'edit',
      label: '编辑机构',
      icon: <EditOutlined />,
      extra: <>⌘ + E</>,
      onClick: () => {
        setParams({
          visible: true,
          currentRow: selectedNode,
          parentId: selectedNode?.parentId as string,
        })
        setVisible(false)
      },
    },
    {
      key: 'delete',
      label: '删除机构',
      extra: <>⌘ + D</>,
      icon: <DeleteOutlined />,
      onClick: () => deleteDic(selectedNode?.organizationId as string),
    },
  ]

  const getAllOranization = (isFirst?: string) => {
    getOrganizationList().then((resp) => {
      let newArr = resp.map((item: SysOrganizationType) => {
        return {
          ...item,
          title: item.organizationName,
          key: item.organizationId,
        }
      })
      let parId = newArr.find(
        (item: SysOrganizationTypeWithKey) => item.parentId === '0'
      ).organizationId
      setTreeData(buildTree(newArr, 'organizationId') as any)
      isFirst &&
        setSelectedNode(
          filterKeys(
            newArr.filter(
              (item: SysOrganizationTypeWithKey) => item.key === parId
            )[0],
            organizationKeys,
            true
          )
        )
      isFirst
        ? setSearchDefaultForm({ ...searchDefaultForm, parentId: parId })
        : setSearchDefaultForm({ ...searchDefaultForm })
    })
    setTimeout(() => {
      setImmediate(false)
    }, 300)
  }

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      page: pagination.current as number,
      limit: pagination.pageSize as number,
    })
  }

  /**
   * 点击确定的回调
   * @param roleData 租户数据
   */
  const onEditOk = async (OrganizationData: SysOrganizationType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addOrganization(OrganizationData)
      } else {
        // 编辑数据
        await updateOrganization(OrganizationData)
      }
      message.success(!params.currentRow ? '添加成功' : '修改成功')
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null, parentId: null })
      getAllOranization()
    } catch (error) {}
  }

  const deleteDic = (id: string[] | string, type?: string) => {
    // 删除操作需要二次确定
    modal.confirm({
      title: `${type ? '批量' : ''}删除组织机构`,
      icon: <ExclamationCircleFilled />,
      content: `确定${
        type ? '批量' : ''
      }删除组织机构吗？数据删除后将无法恢复！`,
      onOk() {
        // 调用删除接口，删除成功后刷新页面数据
        ;(type
          ? deleteBatchOrganization(id as string[])
          : deleteOrganization(id as string)
        ).then(() => {
          getAllOranization()
          // 清空选择项
          setSelectedRows([])
        })
      },
    })
  }

  const treeClick = (e: React.Key[], info: any) => {
    const node = info.node
    setSelectedNode(e.length ? filterKeys(node, organizationKeys, true) : null)
    setSearchDefaultForm({
      ...searchDefaultForm,
      parentId: e.length ? (e[0] as string) : null,
    })
  }

  // 右击点击事件
  const handleRightClick = (event: any) => {
    event.event.preventDefault()
    // 如果是右键的配置节点，则不响应, 这里类型判断有误dang，需要处理
    if (event.node.isConfig) {
      return
    }
    const { clientX, clientY } = event.event
    const { innerWidth, innerHeight } = window

    // 计算菜单位置，避免溢出
    const menuWidth = 160 // 假设菜单宽度
    const menuHeight = 136 // 假设菜单高度
    const x = clientX + menuWidth > innerWidth ? clientX - menuWidth : clientX
    const y =
      clientY + menuHeight > innerHeight ? clientY - menuHeight : clientY
    setContextMenuPosition({ x: x, y: y })
    const node = event.node
    setSelectedNode(filterKeys(node, organizationKeys, true))
    setVisible(true)
  }

  return (
    <>
      {/* 菜单检索条件栏 */}
      <ConfigProvider>
        <Card
          style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
          styles={{ body: { height: '100%' } }}
          ref={parentRef}
          loading={immediate}
        >
          <div className="flex items-start h-full">
            <div
              className={`w-[220px] rounded-[2px] h-full border-1 border-slate-100 p-[10px]`}
            >
              {!treeData.length ? (
                <Empty
                  className="mt-[20px]"
                  description="暂无权限机构！"
                ></Empty>
              ) : (
                <Tree
                  defaultExpandAll
                  switcherIcon={<DownOutlined />}
                  treeData={treeData}
                  selectedKeys={selectedNode ? [selectedNode.key] : []}
                  defaultSelectedKeys={[searchDefaultForm.parentId] as string[]}
                  onSelect={treeClick}
                  onRightClick={handleRightClick}
                />
              )}
              {visible && (
                <div
                  ref={dropdownRef}
                  style={{
                    position: 'fixed',
                    top: contextMenuPosition.y,
                    left: contextMenuPosition.x,
                    zIndex: 1000,
                  }}
                >
                  <Dropdown
                    menu={{ items: contextMenu }}
                    trigger={['click']}
                    open={visible}
                  >
                    <div />
                  </Dropdown>
                </div>
              )}
            </div>
            <div
              className="ml-[24px] h-full"
              style={{ width: 'calc(100% - 250px)' }}
            >
              <Form labelCol={{ span: 6 }}>
                <Row gutter={24} style={{ margin: '0' }}>
                  <Col span={8}>
                    <Form.Item name="model">
                      <Input
                        value={searchDefaultForm.organizationName as string}
                        placeholder="机构名称"
                        allowClear
                        onChange={(e: any) =>
                          setSearchDefaultForm({
                            ...searchDefaultForm,
                            organizationName: e.target.value,
                          })
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Space>
                      <Button
                        type="primary"
                        onClick={() =>
                          setParams({
                            visible: true,
                            currentRow: null,
                            parentId: selectedNode?.parentId as string,
                          })
                        }
                      >
                        新增
                      </Button>
                      <Button
                        type="default"
                        danger
                        disabled={selRows.length === 0}
                        onClick={() => deleteDic(selRows, 'batch')}
                      >
                        批量删除
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Form>
              <SearchTable
                size="middle"
                columns={columns}
                bordered
                totalKey="count"
                fetchResultKey="list"
                isPagination={true}
                pageIndexKey="page"
                pageSizeKey="limit"
                rowKey="organizationId"
                scroll={{ x: 'max-content', y: height - 168 }}
                fetchData={getOrganizationListByPage}
                searchFilter={searchDefaultForm}
                isSelection={true}
                onUpdatePagination={onUpdatePagination}
                onUpdateSelection={(options: string[]) =>
                  setSelectedRows(options)
                }
              />
            </div>
          </div>
        </Card>
      </ConfigProvider>
      <AddOrganization
        params={params}
        onCancel={() =>
          setParams({ visible: false, currentRow: null, parentId: null })
        }
        onOk={onEditOk}
      />
    </>
  )
}
export default Organization
