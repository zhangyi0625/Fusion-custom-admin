import type React from 'react'
import { Key, useEffect, useState } from 'react'
import useParentSize from '@/hooks/useParentSize'

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
} from 'antd'
import { DownOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import {
  getOrganizationListByPage,
  addOrganization,
  updateOrganization,
  deleteOrganization,
  deleteBatchOrganization,
  getOrganizationList,
} from '@/services/system/organization/organization'
import { SearchTable } from 'customer-search-form-table'
import AddOrganization from './AddOrganization'
import { buildTree, filterKeys } from '@/utils/tool'
import type {
  SysOrganizationParams,
  SysOrganizationType,
} from '@/services/system/organization/organizationModel'

/**
 * 系统角色维护
 * @returns
 */
const Organization: React.FC = () => {
  const { modal, message } = App.useApp()

  const { parentRef, height } = useParentSize()

  const [immediate, setImmediate] = useState<boolean>(true)

  // 当前选中的行数据
  const [selRows, setSelectedRows] = useState<string[]>([])

  // 将当前编辑行和窗口开关合并为一个状态对象
  const [params, setParams] = useState<{
    visible: boolean
    currentRow: any
  }>({
    visible: false,
    currentRow: null,
  })

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<SysOrganizationParams>({
      page: 1,
      limit: 10,
      organizationName: null,
      parentId: null,
    })

  useEffect(() => {
    getAllOranization()
  }, [])

  const [treeData, setTreeData] = useState([])

  // 表格的列配置
  const columns: TableProps['columns'] = [
    {
      title: '机构名称',
      dataIndex: 'organizationName',
      key: 'organizationName',
      align: 'center',
    },
    {
      title: '机构全称',
      dataIndex: 'organizationFullName',
      key: 'organizationFullName',
      align: 'center',
      width: 150,
    },
    {
      title: '机构代码',
      dataIndex: 'organizationCode',
      key: 'organizationCode',
      align: 'center',
    },
    {
      title: '机构类型',
      dataIndex: 'organizationType',
      key: 'organizationType',
      align: 'center',
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
                setParams({ visible: true, currentRow: record })
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

  const getAllOranization = () => {
    getOrganizationList().then((resp) => {
      let newArr = resp.map((item: SysOrganizationType) => {
        return {
          ...item,
          title: item.organizationName,
          key: item.organizationId,
        }
      })
      let parId = newArr.find(
        (item: SysOrganizationType) => item.parentId === '0'
      ).organizationId
      setTreeData(buildTree(newArr, 'organizationId') as any)
      setSearchDefaultForm({ ...searchDefaultForm, parentId: parId })
    })
    setTimeout(() => {
      setImmediate(false)
    }, 300)
  }

  const onUpdateSearch = (info?: SysOrganizationType | unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value)
    )
    let pageInfo = filterKeys(searchDefaultForm, ['page', 'limit'], true)
    setSearchDefaultForm({
      ...pageInfo,
      ...filteredObj,
    })
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
      setParams({ visible: false, currentRow: null })
      onUpdateSearch()
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
          // 刷新表格数据
          onUpdateSearch({ ...searchDefaultForm })
          // 清空选择项
          setSelectedRows([])
        })
      },
    })
  }

  const addRow = () => {
    setParams({
      visible: true,
      currentRow: null,
    })
  }

  const treeClick = (e: Key[]) => {
    setSearchDefaultForm({ ...searchDefaultForm, parentId: e[0] as string })
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
              <Tree
                defaultExpandAll
                switcherIcon={<DownOutlined />}
                treeData={treeData}
                onSelect={treeClick}
                defaultSelectedKeys={[searchDefaultForm.parentId] as string[]}
              />
            </div>
            <div className="flex-1 ml-[24px] h-full">
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
                      <Button type="primary" onClick={addRow}>
                        新增
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
                rowKey="organizationId"
                scroll={{ x: 'max-content', y: height - 158 }}
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
        parentId={searchDefaultForm.parentId}
        params={params}
        onCancel={() => setParams({ visible: false, currentRow: null })}
        onOk={onEditOk}
      />
    </>
  )
}
export default Organization
