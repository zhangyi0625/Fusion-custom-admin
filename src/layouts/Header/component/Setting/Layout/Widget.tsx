import SelectItem from '../SelectItem';
import SwitchItem from '../SwitchItem';

/**
 * @description: 底部组件
 */
const Widget: React.FC = () => {
  return (
    <>
      {/* 启用全局搜索 */}
      <SwitchItem title="启用全局搜索" category="widget" pKey="globalSearch" />
      {/* 启用主题切换 */}
      <SwitchItem title="启用主题切换" category="widget" pKey="themeToggle" />
      {/* 启用语言切换 */}
      <SwitchItem
        title="启用语言切换"
        category="widget"
        pKey="languageToggle"
      />
      {/* 启用全屏 */}
      <SwitchItem title="启用全屏" category="widget" pKey="fullscreen" />
      {/* 启用通知 */}
      <SwitchItem title="启用通知" category="widget" pKey="notification" />
      {/* 启用锁屏 */}
      <SwitchItem title="启用锁屏" category="widget" pKey="lockScreen" />
      {/* 启用侧边栏切换 */}
      <SwitchItem
        title="启用侧边栏切换"
        category="widget"
        pKey="sidebarToggle"
      />
      {/* 启用刷新 */}
      <SwitchItem title="启用刷新" category="widget" pKey="refresh" />
      {/* 偏好设置位置 */}
      <SelectItem title="偏好设置位置" disabled />
    </>
  );
};
export default Widget;
