import React, { useEffect, useState } from 'react'
import { Col, Form, Input, Row, Select } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, setEssentail } from '@/stores/store'
import DragModal from '@/components/modal/DragModal'
import type { ServiceSettingType } from '@/services/setting/serviceSettingModel'
import { getCarrierManageList } from '@/services/essential/carrierManage/carrierManageApi'
import { getRouteManageList } from '@/services/customerInformation/routeManage/routeManageApi'
import { essentailPreferences } from '@/stores/storeState'
import type { RouteMangeType } from '@/services/customerInformation/routeManage/routeManageModel'
import { ServiceSettingForm } from './config'
import { replaceObjectName } from '@/utils/tool'

export interface ServiceSettingInfoProps {
  params: {
    visible: boolean
    currentRow: ServiceSettingType | null
    view: boolean
  }
  onOk: (params: ServiceSettingType) => void
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const ServiceSettingInfo: React.FC<ServiceSettingInfoProps> = ({
  params,
  onOk,
  onCancel,
}) => {
  const { visible, currentRow, view } = params

  const [form] = Form.useForm()

  const dispatch = useDispatch()

  const essential = useSelector((state: RootState) => state.essentail)

  const [formMap, setFormMap] = useState(ServiceSettingForm)

  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!visible) return
    if (currentRow) {
      form.setFieldsValue(currentRow)
    } else {
      form.resetFields()
    }
    if (!essential.carrierData?.length || !essential.routeData?.length) {
      loadSearchList()
    } else {
      getReduxData()
    }
  }, [visible, essential])

  // 重新更新查询部分数据 并存储进redux
  const loadSearchList = () => {
    setLoading(true)
    Promise.all([
      getRouteManageList(),
      getCarrierManageList({ enabled: 1 }),
    ]).then((resp) => {
      let key = ['routeData', 'carrierData']
      key.map((_, index: number) => {
        dispatch(setEssentail({ value: resp[index], key: key[index] }))
      })
      getReduxData()
    })
  }

  const getReduxData = () => {
    let { routeData = [], carrierData = [] } = essential
    let newRoute = routeData.map((item: RouteMangeType) => {
      return {
        value: item.id,
        label: item.routeName,
      }
    })
    let carrier = carrierData.map((item) => {
      return {
        label: item.code,
        value: item.code,
      }
    })
    console.log(carrierData, 'carrierData', essential)

    ServiceSettingForm.map((item) => {
      if (item.name === 'carrier' || item.name === 'routeFndIds') {
        item.options = item.name === 'carrier' ? carrier : newRoute
      }
    })
    console.log(ServiceSettingForm, 'ServiceSettingForm')

    setFormMap([...formMap])
    setLoading(false)
  }

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        onOk(form.getFieldsValue())
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        form.scrollToField(errorInfo.errorFields[0].name)
        form.focusField(errorInfo.errorFields[0].name)
      })
  }
  return (
    <DragModal
      width="60%"
      open={visible}
      title={currentRow ? '修改服务' : '添加服务'}
      okButtonProps={{ className: view ? 'hidden' : '' }}
      onOk={handleOk}
      onCancel={onCancel}
      loading={loading}
    >
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Row gutter={24}>
          {formMap.map((item) => (
            <Col span={item.span} key={item.name}>
              <Form.Item
                key={item.name}
                label={item.label}
                name={item.name}
                rules={
                  item.isRules
                    ? [
                        {
                          required: true,
                          message: `请选择${item.label}`,
                        },
                      ]
                    : []
                }
              >
                {item.formType === 'input' && (
                  <Input placeholder={`请输入${item.label}`} allowClear />
                )}
                {item.formType === 'select' && (
                  <Select
                    options={(item.options || []).map((item) => ({
                      label: item.label,
                      value: item.value,
                    }))}
                    filterOption
                    mode={item.name === 'routeFndIds' ? 'multiple' : undefined}
                    placeholder={`请选择${item.label}`}
                  ></Select>
                )}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </DragModal>
  )
}

export default ServiceSettingInfo
