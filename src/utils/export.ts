import { message, type TableProps } from 'antd'
import * as XLSX from 'xlsx'
import XLSXJSStyle from 'xlsx-js-style'
import FileSaver from 'file-saver'

type TableColumns = TableProps['columns']

/**
 * 导出表格数据
 * @param tableData 表格数据
 * @param tableColumns 表头数据
 * @param fileName 文件名称
 * @param sheetName excel
 * @param merges 合并单元格
 */
export function ExportTableDataByXLSX(
  tableData: unknown[] = [],
  tableColumns: TableColumns = [],
  fileName: string = 'fileName',
  sheetName: string = 'sheetName',
  merges: any[] = []
) {
  if (!tableData.length) {
    message.error('表格数据为空，导出数据失败～')
    return
  }
  const data: any[] = []
  let index = 0
  // const keyArray: string[] = tableColumns.map((item) => item.key as string); //获取key
  const titleArr: string[] = tableColumns.map((item) => item.title as string) //获取表头
  tableData.forEach((item: any, index: number) => {
    const arr: string[] = tableColumns.map((key) => {
      return key.key
        ? item[key.key as string] ?? ''
        : typeof key.render === 'function'
        ? (() => {
            const rendered = key.render(item, item, index)
            // If it's a React element, get its children, else use as is
            if (
              rendered &&
              typeof rendered === 'object' &&
              'props' in rendered
            ) {
              return (rendered as any).props?.children
            }
            return rendered ?? ''
          })()
        : ''
    })
    data.push(arr)
  })
  data.splice(0, 0, titleArr)
  const itemWidth = [] // 设置列宽
  const itemHeight = [] // 设置行高

  const ws: any = XLSX.utils.aoa_to_sheet(data)
  const wb = XLSX.utils.book_new()

  for (const key in ws) {
    index++
    itemHeight.push({ hch: 30 })
    itemWidth.push({ wch: 50 })
    if (key != '!rows' && key != '!merges' && key != '!ref') {
      ws[key].s = {
        alignment: {
          horizontal: 'center', //水平居中
          vertical: 'center', //垂直居中
          wrapText: true,
        },
        border: {
          //边框
          bottom: {
            style: 'thin',
            color: 'FF000000',
          },
          left: {
            style: 'thin',
            color: 'FF000000',
          },
          right: {
            style: 'thin',
            color: 'FF000000',
          },
        },
      }
    }
  }

  ws['!merges'] = merges

  ws['!cols'] = itemWidth
  ws['!rows'] = itemHeight
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  const wbout = XLSXJSStyle.write(wb, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'array',
  })
  try {
    FileSaver.saveAs(
      new Blob([wbout], { type: 'application/octet-stream' }),
      `${fileName}.xlsx`
    )
  } catch (error) {
    message.error('文件导出异常，请联系相关人员～')
  }
}
