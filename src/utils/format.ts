/**
 * 时间格式化
 * @param time
 * @param format
 * @returns
 */
export function formatTime(time: string | number, format: string) {
  if (time == null || format == '' || time == '' || time == undefined) {
    return ''
  }
  if (arguments.length === 0) {
    return null
  }
  'string' == typeof time && (time = time.replace(/-/g, '/'))
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'],
    arr = [],
    date = new Date(time)
  arr.push(date.getFullYear()) //Y
  arr.push((date.getMonth() + 1).toString().padStart(2, '0')) //M
  arr.push(date.getDate().toString().padStart(2, '0')) //D
  arr.push(date.getHours().toString().padStart(2, '0')) //h
  arr.push(date.getMinutes().toString().padStart(2, '0')) //m
  arr.push(date.getSeconds().toString().padStart(2, '0')) //s
  for (var i = 0; i < arr.length; i++) {
    format = format.replace(formateArr[i], arr[i].toString())
  }
  return format
}

/**
 * 格式话数据 24h内展示小时数，1天以上展示上次获取到得日期
 * @param data
 * @param num
 * @returns
 */
export function formatUpdated(data: any, num: number) {
  if (data !== null && data !== undefined && num !== 0) {
    data = data.replace(/-/g, '/')
    var ms = new Date().getTime() - new Date(data).getTime()
    var hours = parseInt(
      String((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    )
    var mins = parseInt(String((ms % (1000 * 60 * 60)) / (1000 * 60)))
    if (hours === 0) {
      if (mins === 0) {
        return '最近更新：1分钟内'
      } else {
        return '最近更新：' + mins + '分钟前'
      }
    } else if (hours > 0 && hours <= 24) {
      return '最近更新：' + hours + '小时前'
    } else {
      // return s.formatTime(data, "Y/M/D");
    }
  } else {
    return ''
  }
}
