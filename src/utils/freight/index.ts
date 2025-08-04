import {
  AdditionalChargesModule,
  AdditionalColumnType,
  CostDetailType,
  FreightPriceListType,
} from './type'

/**
 * 排列组合重新划分附加费
 * 1.海运附加费 2.起运港费用 3.目的港费用 4.其他费用
 * chargeMode暂时只有【BL】和 【CONTAINER】
 * CONTAINER 下存在不同箱型的价格需要组合
 * @param price
 * @returns
 */
export const loadAdditionalCharges = (price: FreightPriceListType[] = []) => {
  let additionalCharges = {
    oceanFreight: [],
    porPriceList: [],
    fndPriceList: [],
    otherPriceList: [],
  }
  if (!price || !price.length) return
  else {
    let type = ''
    let porList: string[] = []
    let fndList: string[] = []
    let oceanList: string[] = []
    let otherList: string[] = []
    price.map((item: FreightPriceListType) => {
      item.costDetailList.map((el: CostDetailType) => {
        // 区分类型是票价还是箱型费用
        type = el.chargeType === 'BL' ? 'blPrice' : item.ctnType
        if (el.costCategory === 'POR')
          getJudgePush(el, type, porList, additionalCharges.porPriceList)
        else if (el.costCategory === 'FND' || el.costCategory === 'LAND')
          getJudgePush(el, type, fndList, additionalCharges.fndPriceList)
        else if (el.costCategory === 'OCEAN_EXTRA')
          getJudgePush(el, type, oceanList, additionalCharges.oceanFreight)
        else if (el.costCategory === 'OTHER')
          getJudgePush(el, type, otherList, additionalCharges.otherPriceList)
      })
    })
    return additionalCharges as Omit<AdditionalChargesModule, 'ddPriceList'>
  }
}

/**
 *
 * @param el
 * @param type
 * @param arr
 * @param newArr
 * @returns
 */
export const getJudgePush = (
  el: CostDetailType,
  type: string,
  arr: string[],
  newArr: AdditionalColumnType[]
) => {
  let index = arr.indexOf(el.chargeName)
  if (index === -1) {
    newArr.push({
      [type]: el.price,
      chargeType: el.chargeType,
      chargeName: el.chargeName,
      currency: el.currency,
      isIncludeTotal: el.showOnly != null && el.showOnly ? '否' : '是',
    })
    arr.push(el.chargeName)
  } else newArr[index][type as any] = el.price
  return newArr
}
