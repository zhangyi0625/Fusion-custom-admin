import SelectItem from '../SelectItem'
import SwitchItem from '../SwitchItem'
import { SUPPORT_LANGUAGES } from '@/enums/constants'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/stores/store'
import { updatePreferences } from '@/stores/store'

/**
 * 通用
 * @returns
 */
const General: React.FC = () => {
  const dispatch = useDispatch()
  const { locale } = useSelector((state: RootState) => state.preferences.app)

  const handleLangChange = (value: string) => {
    dispatch(updatePreferences('app', 'locale', value))
  }

  return (
    <>
      {/* 语言 */}
      <SelectItem
        title="语言"
        items={SUPPORT_LANGUAGES}
        onChange={handleLangChange}
        value={locale}
      />
      {/* 动态标题 */}
      <SwitchItem title="动态标题" category="app" pKey="dynamicTitle" />
      {/* 水印 */}
      <SwitchItem title="水印" category="app" pKey="watermark" />
      {/* 定时检查更新 */}
      <SwitchItem
        title="定时检查更新"
        category="app"
        pKey="enableCheckUpdates"
      />
    </>
  )
}
export default General
