import type { ShippingAccounType } from '@/services/customerInformation/shippingAccount/shippingAccountModel'
import { message } from 'antd'
import * as XLSX from 'xlsx'

type ImportXLSXContentType = {
  xlsxHeader: string[]
  xlsxKey: string[]
}

const importXLSXContentType: Record<string, ImportXLSXContentType> = {
  importShippingAccount: {
    xlsxHeader: ['船公司编码', '账号抬头', '登录名', '登录密码', '支付密码'],
    xlsxKey: [
      'carrier',
      'accountHead',
      'account',
      'loginPassword',
      'payPassword',
    ],
  },
  importCabinTask: {
    xlsxHeader: [],
    xlsxKey: [],
  },
}

type importType = Record<string, Omit<ShippingAccounType, 'id' | 'customerId'>>

type ImportSource = 'importShippingAccount' | 'importCabinTask'

export function ImportShippingAccountByXLSX(
  file: File,
  callback: any,
  importSource: ImportSource
) {
  const reader = new FileReader()
  reader.onload = (e) => {
    // e.target.result --> FileReader 完成读取操作后的结果
    const arrayBuffer = e.target ? (e.target.result as ArrayBuffer) : null
    if (!arrayBuffer) return
    // 将 ArrayBuffer（原始二进制数据） 转换为 Uint8Array
    // XLSX 库期望接收 Uint8Array 格式以解析 Excel
    const data = new Uint8Array(arrayBuffer)
    //开始解析
    const workbook = XLSX.read(data, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    //第一列的所有数据
    const jsonData: [string][] = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
    })
    let arr: importType[] = []
    // 校验xlsx title文字匹配xlsxHeader
    if (
      !jsonData[0] ||
      jsonData[0].find(
        (text: string) =>
          !importXLSXContentType[importSource].xlsxHeader.includes(text)
      )
    ) {
      message.error('船司账号导入格式有误，请下载账号导入模版！')
      return
    } else if (!jsonData[1]) {
      message.error('船司账号导入内容不存在！')
      return false
    } else {
      jsonData.slice(1).map((item: string[]) => {
        let params = {}
        for (let i in item) {
          params = {
            ...params,
            [importXLSXContentType[importSource].xlsxKey[i]]: item[i],
          }
        }
        arr.push(params)
      })
      callback(arr)
    }
  }
  reader.readAsArrayBuffer(file) //result as ArrayBuffer的原因
}
