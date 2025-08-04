import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { sysSettingPreferences } from './storeState'

export const initPublicSetting: sysSettingPreferences = {
  publicData: [],
  publicSetting: [],
}

// 系统slice
export const sysSettingSlice = createSlice({
  // slice名称
  name: 'setting',
  //初始值
  initialState: initPublicSetting,
  //设置值
  reducers: {
    setPublicData(state: sysSettingPreferences, action: PayloadAction<any[]>) {
      state.publicData = action.payload[0]
      state.publicSetting = action.payload[1]
    },
  },
})
