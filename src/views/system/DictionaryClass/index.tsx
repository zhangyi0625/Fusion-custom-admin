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
import {
  addDictionary,
  deleteDictionary,
  getDictionaryListByPage,
  updateDictionary,
} from '@/services/system/dictionary/dictionaryApi'
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons'
import useParentSize from '@/hooks/useParentSize'
import { SysDictionaryClassType } from '@/services/system/dictionary/dictionaryModel'
import DictonaryClassModal from './DictonaryClassModal'

const DictionaryClass: React.FC = () => {
  const { height } = useParentSize()

  const { modal, message } = App.useApp()

  const [loading, setLoading] = useState<boolean>(false)

  const [tableData, setTableData] = useState([])

  // 将当前编辑行和窗口开关合并为一个状态对象
  const [params, setParams] = useState<{
    visible: boolean
    currentRow: SysDictionaryClassType | null
    view: boolean
  }>({
    visible: false,
    currentRow: null,
    view: false,
  })

  useEffect(() => {
    loadDictionaryList()
  }, [])

  const loadDictionaryList = () => {
    setLoading(true)
    getDictionaryListByPage()
      .then((resp) => {
        setTableData(resp.list)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const columns: TableProps['columns'] = [
    {
      title: '字典名称',
      dataIndex: 'dictName',
      key: 'dictName',
      align: 'center',
      width: 250,
    },
    {
      title: '字典标识',
      dataIndex: 'dictCode',
      key: 'dictCode',
      align: 'center',
      width: 250,
    },
    {
      title: '备注',
      dataIndex: 'comments',
      key: 'comments',
      align: 'center',
      width: 250,
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
                  currentRow: record as SysDictionaryClassType,
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
          </Space>
        )
      },
    },
  ]

  const deleteDic = (id: string) => {
    modal.confirm({
      title: '删除字典分类',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该字典分类吗？数据删除后将无法恢复！',
      onOk() {
        deleteDictionary(id).then(() => {
          // 刷新表格数据
          loadDictionaryList()
        })
      },
    })
  }

  const onAddDicClick = () => {
    setParams({ visible: true, currentRow: null, view: false })
  }

  const onEditOk = async (roleData: SysDictionaryClassType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addDictionary(roleData)
      } else {
        // 编辑数据
        await updateDictionary(roleData)
      }
      message.success(!params.currentRow ? '添加成功' : '修改成功')
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null, view: false })
      loadDictionaryList()
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
        {/* 查询表格 */}
        <Card
          style={{ flex: 1, marginTop: '8px' }}
          styles={{ body: { height: '100%' } }}
        >
          {/* 操作按钮 */}
          <Space className="mb-[20px]">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAddDicClick}
            >
              新增
            </Button>
          </Space>
          <Table
            size="small"
            bordered
            pagination={false}
            dataSource={tableData}
            columns={columns}
            loading={loading}
            rowKey="dictId"
            scroll={{ x: 'max-content', y: height - 128 }}
          />
        </Card>
      </ConfigProvider>
      <DictonaryClassModal
        params={params}
        onOk={onEditOk}
        onCancel={() =>
          setParams({ visible: false, currentRow: null, view: false })
        }
      />
    </>
  )
}

export default DictionaryClass
