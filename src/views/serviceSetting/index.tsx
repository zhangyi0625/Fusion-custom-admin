import type React from 'react'
import { useEffect, useState } from 'react'
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  Table,
  type TableProps,
} from 'antd'
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons'
import useParentSize from '@/hooks/useParentSize'
import {
  addServiceSetting,
  deleteServiceSetting,
  getServiceSetting,
  updateServiceSetting,
} from '@/services/setting'
import type { ServiceSettingType } from '../../services/setting/serviceSettingModel'
import ServiceSettingInfo from './ServiceSettingInfo'
import { ServiceSettingForm } from './config'

const ServiceSetting: React.FC = () => {
  const { height } = useParentSize()

  const { modal, message } = App.useApp()

  const [loading, setLoading] = useState<boolean>(false)

  const [tableData, setTableData] = useState([])

  // 将当前编辑行和窗口开关合并为一个状态对象
  const [params, setParams] = useState<{
    visible: boolean
    currentRow: ServiceSettingType | null
    view: boolean
  }>({
    visible: false,
    currentRow: null,
    view: false,
  })

  useEffect(() => {
    loadServiceSettingList()
    console.log('useEffect')
  }, [])

  const loadServiceSettingList = () => {
    setLoading(true)
    getServiceSetting()
      .then((resp) => {
        setTableData(resp.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const columns: TableProps['columns'] = [
    {
      title: '服务编号',
      dataIndex: 'serverNo',
      key: 'serverNo',
      align: 'center',
      width: 120,
    },
    {
      title: '服务名称',
      dataIndex: 'serverName',
      key: 'serverName',
      align: 'center',
      width: 120,
    },
    {
      title: '船司',
      dataIndex: 'carrier',
      key: 'carrier',
      align: 'center',
      width: 80,
    },
    {
      title: '主机地址',
      key: 'mqHost',
      align: 'center',
      width: 200,
      render(value) {
        return (
          <div>
            {value.mqHost}:{value.mqPort}
          </div>
        )
      },
    },
    {
      title: '主机账号',
      dataIndex: 'mqUsername',
      key: 'mqUsername',
      align: 'center',
      width: 150,
    },
    {
      title: '主机虚拟地址',
      dataIndex: 'mqVirtualHost',
      key: 'mqVirtualHost',
      align: 'center',
      width: 150,
    },
    {
      title: '细分航线',
      dataIndex: 'routeFndIds',
      key: 'routeFndIds',
      align: 'center',
      width: 250,
    },
    {
      title: '启动类型',
      key: 'startType',
      align: 'center',
      width: 150,
      render(value) {
        let arr = ServiceSettingForm.find(
          (item) => item.name === 'startType'
        )?.options
        return (
          <div>
            {
              arr?.find((item) =>
                value.startType.split(',').includes(item.value)
              )?.label
            }
          </div>
        )
      },
    },
    {
      title: '修改时间',
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
                setParams({
                  visible: true,
                  currentRow: record as ServiceSettingType,
                  view: true,
                })
              }}
            >
              修改
            </Button>
            <Button
              type="link"
              danger
              size="small"
              onClick={() => deleteDic(record.id)}
            >
              删除
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                setParams({
                  visible: true,
                  currentRow: record as ServiceSettingType,
                  view: true,
                })
              }}
            >
              维护航线
            </Button>
          </Space>
        )
      },
    },
  ]

  const deleteDic = (id: string) => {
    modal.confirm({
      title: '删除服务',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该服务吗？数据删除后将无法恢复！',
      onOk() {
        deleteServiceSetting(id).then(() => {
          // 刷新表格数据
          loadServiceSettingList()
        })
      },
    })
  }

  const onAddServiceSetting = () => {
    setParams({ visible: true, currentRow: null, view: false })
  }

  const onEditOk = async (roleData: ServiceSettingType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addServiceSetting(roleData)
      } else {
        // 编辑数据
        await updateServiceSetting(roleData)
      }
      message.success(!params.currentRow ? '添加成功' : '修改成功')
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null, view: false })
      loadServiceSettingList()
    } catch (error) {}
  }
  return (
    <>
      {/* 菜单检索条件栏 */}
      <ConfigProvider
        theme={{
          components: {
            Form: {
              itemMarginBottom: 0,
            },
          },
        }}
      >
        <Card
          style={{ flex: 1, marginTop: '8px' }}
          styles={{ body: { height: '100%' } }}
        >
          <Space className="mb-[20px]">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAddServiceSetting}
            >
              添加服务
            </Button>
          </Space>
          <Table
            size="small"
            bordered
            pagination={false}
            dataSource={tableData}
            columns={columns}
            loading={loading}
            rowKey="id"
            scroll={{ x: 'max-content', y: height - 128 }}
          />
        </Card>
      </ConfigProvider>
      <ServiceSettingInfo
        params={params}
        onOk={onEditOk}
        onCancel={() =>
          setParams({ visible: false, currentRow: null, view: false })
        }
      />
    </>
  )
}

export default ServiceSetting
