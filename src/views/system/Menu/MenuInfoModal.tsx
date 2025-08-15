import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { QuestionCircleFilled, SettingOutlined } from '@ant-design/icons'
import {
  Dropdown,
  Form,
  Input,
  InputNumber,
  type InputRef,
  Radio,
  Switch,
  Tooltip,
  TreeSelect,
} from 'antd'
import DragModal from '@/components/modal/DragModal'
import { getMenusList } from '@/services/system/menu/menuApi'
import IconPanel from '@/components/IconPanel'

// 菜单信息弹窗的参数
export type MenuInfoModalProps = {
  // 弹窗可见性
  visible: boolean
  // 弹窗需要的数据
  currentRow: Record<string, any> | null
  // 点击确定的回调
  onOk: any
  // 点击取消的回调
  onCancel: any
}

/**
 * 菜单信息编辑弹窗
 * @returns
 */
const MenuInfoModal: React.FC<MenuInfoModalProps> = ({
  visible,
  currentRow,
  onOk,
  onCancel,
}) => {
  // 表单实例
  const [form] = Form.useForm()
  const nameRef = useRef<InputRef>(null)
  const [menuType, setMenuType] = useState<number>(currentRow?.menuType || 1)
  // 目录的dropdown菜单
  const [directory, setDirectory] = useState<any[]>([])
  // 设置对话框加载状态
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!visible) return
    // 组件挂载查询目录数据
    getMenusList({ parentId: '0' }).then((response) => {
      setDirectory(response)
      if (currentRow) {
        // 填充表单数据
        form.setFieldsValue({
          ...currentRow,
          hide: Boolean(currentRow.hide),
        })
        setMenuType(currentRow?.menuType)
      } else {
        // 清空表单数据，表示新增
        form.resetFields()
        form.setFieldsValue({ parentId: response[0].menuId, menuType: 1 })
      }
    })
    setLoading(false)
  }, [currentRow, visible])

  /**
   * 弹窗打开关闭的回调（打开后默认聚焦到名称输入框）
   * @param open 弹窗是否打开
   */
  const onAfterOpenChange = (open: boolean) => {
    if (open) {
      nameRef.current?.focus()
    }
  }

  /**
   * 点击确认的时候先做数据校验
   */
  const handleOk = () => {
    // 字段校验，校验通过的才调用传过来的回调
    form
      .validateFields()
      .then(() => {
        // 清除所有错误
        onOk({
          ...form.getFieldsValue(),
          parentId: menuType === 0 ? '0' : form.getFieldValue('parentId'),
          hide: Number(form.getFieldValue('hide')),
        })
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        form.scrollToField(errorInfo.errorFields[0].name)
        form.focusField(errorInfo.errorFields[0].name)
      })
  }

  /**
   * 选中的图标
   * @param icon 图标名称
   */
  const onSelectIcon = (icon: string) => {
    if (icon) {
      form.setFieldsValue({ icon })
    }
  }

  return (
    <DragModal
      width={800}
      styles={{
        body: {
          padding: '20px 40px',
          height: '500px',
          overflowY: 'auto',
        },
      }}
      title={currentRow ? '编辑菜单数据' : '新增菜单数据'}
      open={visible}
      onOk={handleOk}
      loading={loading}
      onCancel={onCancel}
      afterOpenChange={onAfterOpenChange}
    >
      <Form
        form={form}
        initialValues={{
          menuType: 1,
          isRoute: true,
          hidden: false,
          internalOrExternal: false,
          status: true,
          parentId: '0',
        }}
        labelCol={{ span: 4 }}
      >
        <Form.Item name="menuId" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="menuType" label="菜单类型">
          <Radio.Group
            buttonStyle="solid"
            onChange={(e) => setMenuType(e.target.value)}
          >
            <Radio.Button value={0}>一级菜单</Radio.Button>
            <Radio.Button value={1}>子菜单</Radio.Button>
            <Radio.Button value={2}>权限按钮</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name={'title'}
          label="菜单名称"
          rules={[{ required: true, message: '菜单名称不能为空!' }]}
        >
          <Input autoFocus ref={nameRef} />
        </Form.Item>
        {menuType === 1 && (
          <Form.Item name="parentId" label="上级菜单">
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              placeholder="请选择上级目录"
              treeData={directory}
              fieldNames={{ label: 'title', value: 'menuId' }}
            />
          </Form.Item>
        )}
        <Form.Item
          name="path"
          label={
            <>
              <Tooltip title="访问的路由地址，如为外链，则路由地址需要以`http(s)://开头`">
                <QuestionCircleFilled />
              </Tooltip>
              路由地址
            </>
          }
          rules={[{ required: true, message: '路径不能为空!' }]}
        >
          <Input allowClear autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="component"
          label="前端组件"
          rules={[
            { required: menuType === 1, message: '前端组件配置不能为空!' },
          ]}
        >
          <Input allowClear autoComplete="off" />
        </Form.Item>
        {menuType === 2 && (
          <Form.Item name="authority" label="权限标识">
            <Input allowClear autoComplete="off" />
          </Form.Item>
        )}
        {/* <Form.Item name="componentName" label="组件名称">
          <Input allowClear autoComplete="off" />
        </Form.Item> */}
        {/* <Form.Item name="redirect" label="默认跳转地址">
          <Input allowClear autoComplete="off" />
        </Form.Item> */}
        <Form.Item name="icon" label="菜单图标">
          <Input
            allowClear
            autoComplete="off"
            addonAfter={
              <Dropdown
                trigger={['hover']}
                placement="bottom"
                popupRender={() => <IconPanel onSelect={onSelectIcon} />}
                overlayClassName="w-[360] h-[300] bg-white overflow-y-auto p-2 shadow-xl"
              >
                <SettingOutlined className="cursor-pointer" />
              </Dropdown>
            }
          />
        </Form.Item>
        <Form.Item name="sortNumber" label="排序">
          <InputNumber min={0} autoComplete="off" style={{ width: '200px' }} />
        </Form.Item>
        {/* <Form.Item name="isRoute" label="是否路由菜单">
          <Switch checkedChildren="是" unCheckedChildren="否" />
        </Form.Item> */}
        <Form.Item name="hide" label="隐藏路由">
          <Switch />
        </Form.Item>
        {/* <Form.Item
          name="internalOrExternal"
          label={
            <>
              <Tooltip title="选择是外链，则路由地址需要以`http(s)://开头`">
                <QuestionCircleFilled />
              </Tooltip>
              打开方式
            </>
          }
        >
          <Switch checkedChildren="外部" unCheckedChildren="内部" />
        </Form.Item> */}
        {/* <Form.Item name="status" label="状态">
          <Switch checkedChildren="正常" unCheckedChildren="停用" />
        </Form.Item> */}
      </Form>
    </DragModal>
  )
}
export default MenuInfoModal
