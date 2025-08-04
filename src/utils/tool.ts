/**
 * 拷贝对象中部分属性
 * @param source
 * @param keys
 * @param invert
 * @returns
 */
export function filterKeys(source: any, keys: string[], invert?: boolean) {
  return Object.keys(source)
    .filter((key) => (invert ? keys.includes(key) : !keys.includes(key)))
    .reduce((res: any, key) => {
      res[key] = source[key]
      return res
    }, {})
}

/**
 * 根据原有的属性名代替新属性名 根据index匹配 两者长度必须匹配
 * @param arr
 * @param wishName
 * @param newName
 * @returns
 */
export function replaceObjectName(
  arr: any,
  wishName: string[],
  newName: string[]
) {
  if (wishName.length !== newName.length || !arr.length) return
  let refreshArr = []
  arr.map((obj: any) => {
    wishName.map((name: string, index: number) => {
      // if (obj[name]) obj[newName[index]] = obj[name]
      if (obj[name]) Reflect.set(obj, newName[index], obj[name])
    })
  })
  refreshArr = JSON.parse(JSON.stringify(arr))
  return refreshArr
}

interface BuildTreeType {
  label: string
  value: string
  children: BuildTreeType[]
}

/**
 * 使用哈希表来存储节点关系 遍历构建树形结构
 * @param data
 * @returns
 */
export function buildTree(data: any | BuildTreeType[], mapId: string) {
  const map = new Map()
  const tree: BuildTreeType[] = []
  // 将数组元素存入哈希表
  data.forEach((item: any) => {
    map.set(item[mapId], { ...item, children: [] })
  })
  data.forEach((item: any) => {
    if (item.parentId === '0' || !item.parentId) tree.push(map.get(item[mapId]))
    else {
      const parent = map.get(item.parentId)
      parent && parent.children.push(map.get(item[mapId]))
    }
  })
  return tree
}
