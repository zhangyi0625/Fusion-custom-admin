import * as XLSX from 'xlsx'
import { message } from 'antd'
import { BussinesEnquiryProductType } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryModel'
import { isString } from 'lodash-es'
import { filterKeys } from '@/utils/tool'

type ImportXLSXContentType = {
  xlsxHeader: string[]
  xlsxKey: string[]
}

const importXLSXContentType: Record<string, ImportXLSXContentType> = {
  ImportEnquiry: {
    xlsxHeader: [
      '序号',
      '型号规格',
      '单位',
      '数量',
      '单价（元）',
      '金额（元）',
    ],
    xlsxKey: [
      'index',
      'productModel/productSpec',
      'productUnit',
      'qty',
      'price',
      'amount',
    ],
  },
  // ImportEnquiry: {
  //   xlsxHeader: [],
  //   xlsxKey: [],
  // },
}

type importType = BussinesEnquiryProductType[]

type ImportSource = 'ImportEnquiry'

export function loadAnalysis(
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
    // 截取头部询价编号
    let no = jsonData[0] as unknown as string[][5]
    // 去除头部标题和尾部栏目(表格内容一定包含序号)
    let sliceJsonData = jsonData.filter(
      (item) => item[0] && !isString(item[0]) && Number(item[0])
    )
    let arr: importType[] = []
    // 校验剩余内容是否符合格式标准
    if (
      sliceJsonData.find(
        (item: string[]) =>
          item.length < 4 ||
          item.length > importXLSXContentType[importSource].xlsxKey.length
      )
    ) {
      message.error('询价表导入格式有误，请下载正确的询价表导入模版！')
      return
    } else {
      sliceJsonData.map((item: string[]) => {
        let params: any = {}
        for (let i in item) {
          params = {
            ...params,
            [importXLSXContentType[importSource].xlsxKey[i]]: item[i],
          }
        }
        if (params['productModel/productSpec']) {
          params = {
            ...filterKeys(
              params,
              ['productUnit', 'qty', 'price', 'amount'],
              true
            ),
            productModel: params['productModel/productSpec']?.split('/')[0],
            productSpec: params['productModel/productSpec']?.split('/')[1],
            productName: params['productModel/productSpec'],
          }
        }
        arr.push(params)
      })
      console.log(sliceJsonData.slice(1), 'jsonData', sliceJsonData, arr, no)
      callback(arr)
    }
  }
  reader.readAsArrayBuffer(file) //result as ArrayBuffer的原因
}
