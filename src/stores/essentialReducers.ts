import { createSlice } from '@reduxjs/toolkit'
import { essentailPreferences } from './storeState'

export type Category = keyof essentailPreferences

export const initEssential: essentailPreferences = {
  // routeData: undefined,
  // porPortData: undefined,
  // fndPortData: undefined,
  // carrierData: undefined,
  // customerData: undefined,
  // relevanceService: undefined,
  productClass: undefined,
  productDetailClass: undefined,
  customerData: undefined,
  userData: undefined,
  contractingData: undefined,
  payerUnitData: undefined,
}

export const essentialSlice = createSlice({
  name: 'essential',
  initialState: initEssential,
  reducers: {
    setEssentail(
      state: essentailPreferences,
      action: {
        payload: { value: essentailPreferences; key: string }
      }
    ) {
      const { key, value } = action.payload
      state[key] = value
      sessionStorage.setItem('initEssential', JSON.stringify({ ...state }))
    },
    // 清空所有数据缓存
    cleanEssential() {
      return initEssential
    },
  },
})
