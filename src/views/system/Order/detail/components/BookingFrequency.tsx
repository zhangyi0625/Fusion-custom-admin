import { memo, useState } from 'react'
import {
  App,
  Button,
  Checkbox,
  GetProp,
  Input,
  Radio,
  RadioChangeEvent,
} from 'antd'
import type { CheckboxGroupProps } from 'antd/es/checkbox'
import { postLoginOrderAccount, postBookingFrequency } from '@/services/order'
import { filterKeys } from '@/utils/tool'

interface BookingFrequencyProps {
  id: string
}

type ParamsOptionsType = {
  label: string
  type: string
  options: string[] | CheckboxGroupProps<string>['options']
  defaultValue: string | string[]
}

type Params = {
  cronPattern: string
  frequencyType: string
  hourRange: string
}

const cheboxOptions = [
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
]

const radioOptions = [
  {
    label: '每30秒执行一次',
    value: 'EVERY_30_SECONDS',
  },
  {
    label: '每40秒执行一次',
    value: 'EVERY_40_SECONDS',
  },
  {
    label: '每50秒执行一次',
    value: 'EVERY_50_SECONDS',
  },
  {
    label: '每1分钟执行一次',
    value: 'EVERY_MINUTE',
  },
  {
    label: '每2分钟执行一次',
    value: 'EVERY_2_MINUTES',
  },
  {
    label: '每3分钟执行一次',
    value: 'EVERY_3_MINUTES',
  },
]

const BookingFrequency: React.FC<BookingFrequencyProps> = memo(({ id }) => {
  const API = process.env.VITE_STATIC_API

  const { message } = App.useApp()

  const [loadingParams, setLoadingParams] = useState<boolean>(false)

  const [loadingCron, setLoadingCron] = useState<boolean>(false)

  const [params, setParams] = useState<Partial<Params>>({})

  const paramsOptions: ParamsOptionsType[] = [
    {
      label: '设置时间段',
      type: 'checkbox',
      options: cheboxOptions,
      defaultValue: ['08'],
    },
    {
      label: '设置频率',
      type: 'radio',
      options: radioOptions,
      defaultValue: 'EVERY_30_SECONDS',
    },
  ]

  const [cronOptions, setCronOptions] = useState<
    (Pick<ParamsOptionsType, 'label' | 'options'> & {
      value?: string[]
    })[]
  >([
    {
      label: '表达式字段',
      options: ['秒', '分钟', '小时', '日', '月', '星期'],
      value: ['', '', '', '', '', ''],
    },
    {
      label: 'Cron表达式',
      options: [],
    },
  ])

  const loginAccount = async () => {
    await postLoginOrderAccount(id)
  }

  const radioChange = (e: RadioChangeEvent) => {
    setParams({ ...params, frequencyType: e.target.value })
  }

  const checkboxChange: GetProp<typeof Checkbox.Group, 'onChange'> = (
    checkedValues
  ) => {
    setParams({ ...params, hourRange: checkedValues.join(',') ?? '' })
  }

  const inputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    let text = ''
    cronOptions.map((item) => {
      if (item.value) {
        ;(item.value as string[])[index] = e.target.value
        text = item.value.join(' ')
      }
    })
    setCronOptions(cronOptions)
    setParams({ ...params, cronPattern: text })
  }

  const submitEdit = (type: string) => {
    type === 'params' ? setLoadingParams(true) : setLoadingCron(true)
    let info = filterKeys(params, ['cronPattern'], type !== 'params')
    postBookingFrequency(id, info)
      .then(() => {
        message.success('修改成功')
        setTimeout(() => {
          type === 'params' ? setLoadingParams(false) : setLoadingCron(false)
          setParams({})
        }, 300)
      })
      .catch(() => {
        type === 'params' ? setLoadingParams(false) : setLoadingCron(false)
      })
  }
  return (
    <>
      <div
        className="flex items-center w-[430px] py-[16px] rounded-md"
        style={{ background: '#fffbe6', border: '1px solid #fff1b8' }}
      >
        <img
          src={API + '/static/website/icon/warning.png'}
          className="w-[16px] h-[16px] ml-[20px]"
          alt=""
        />
        <p className="ml-[4px]">修改订舱频率，建议先完成船司账号预登录</p>
        <div
          className="cursor-pointer bg-amber-500 text-white text-center w-[80px] h-[28px] leading-[28px] rounded-sm font-medium ml-[35px]"
          onClick={loginAccount}
        >
          登录账号
        </div>
      </div>
      <div className="">
        <div className="flex items-center justify-between my-[25px]">
          <p>按参数修改</p>
          <Button
            type="primary"
            loading={loadingParams}
            onClick={() => submitEdit('params')}
          >
            提交修改
          </Button>
        </div>
        {paramsOptions.map((item) => (
          <div
            className="flex border-collapse border border-slate-200"
            key={item.label}
          >
            <div className="w-[116px] p-[15px] bg-slate-100 text-center">
              {item.label}
            </div>
            <div className="p-[15px] flex-1">
              {item.type === 'checkbox' && (
                <Checkbox.Group
                  options={item.options}
                  defaultValue={item.defaultValue as string[]}
                  onChange={checkboxChange}
                />
              )}
              {item.type === 'radio' && (
                <Radio.Group
                  options={item.options}
                  defaultValue={item.defaultValue}
                  onChange={radioChange}
                />
              )}
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between mt-[25px]">
          <p>按表达式修改</p>
          <Button
            type="primary"
            loading={loadingCron}
            onClick={() => submitEdit('cron')}
          >
            提交修改
          </Button>
        </div>
        <div className="px-[16px] mt-[20px] border border-slate-200">
          {cronOptions.map((item) => (
            <div className="flex items-center mb-[20px]" key={item.label}>
              <p className="whitespace-nowrap mr-[5px]">{item.label}：</p>
              {item.options?.length ? (
                item.options.map((text, index) => (
                  <div className="flex flex-col" key={index}>
                    <div className="text-center">{text.toString()}</div>
                    <Input onChange={(e) => inputChange(e, index)} />
                  </div>
                ))
              ) : (
                <Input.TextArea disabled value={params.cronPattern} />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
})

export default BookingFrequency
