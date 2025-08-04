import type React from 'react';
import { memo, useState } from 'react';
import {
  App,
  Button,
  type ColorPickerProps,
  ConfigProvider,
  Drawer,
  Segmented,
  Space,
  Tabs,
  type TabsProps,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { resetPreferences, type RootState } from '@/stores/store';
import {
  ClearOutlined,
  CloseOutlined,
  CopyOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import Block from './Block';
import Theme from './Theme';
import Layout from './Layout';
import Shortcut from './Shortcut';
import General from './Common/General';
import Animation from './Common/Animation';

/**
 * 系统设置界面组件的属性配置
 */
export interface SettingProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/* 系统配置界面 */
const Setting: React.FC<SettingProps> = memo(({ open, setOpen }) => {
  // 从全局状态库中获取数据
  const { theme } = useSelector((state: RootState) => state.preferences);
  const dispatch = useDispatch();
  const { colorPrimary } = theme;
  const [value, setValue] = useState<ColorPickerProps['value']>(colorPrimary);
  const [selectedkey, setSelectedKey] = useState<string>('theme');
  const { modal, message } = App.useApp();

  // 分段器的值
  const segmentedItems = [
    {
      label: '外观',
      value: 'theme',
    },
    {
      label: '布局',
      value: 'layout',
    },
    {
      label: '快捷键',
      value: 'shortcut',
    },
    {
      label: '通用',
      value: 'common',
    },
  ];

  // Tabs的选项
  const tabsItems: TabsProps['items'] = [
    {
      key: 'theme',
      label: '',
      children: <Theme />,
    },
    {
      key: 'layout',
      label: '',
      children: <Layout />,
    },
    {
      key: 'shortcut',
      label: '',
      children: (
        <Block title="全局">
          <Shortcut />
        </Block>
      ),
    },
    {
      key: 'common',
      label: '',
      children: (
        <>
          <Block title="通用">
            <General />
          </Block>
          <Block title="动画">
            <Animation />
          </Block>
        </>
      ),
    },
  ];

  /**
   * 重置所有偏好设置
   */
  const resetPreference = () => {
    modal.confirm({
      title: '重置偏好设置',
      content: '重置所有偏好设置？重置后系统偏好设置将恢复为默认状态！',
      onOk: () => {
        dispatch(resetPreferences());
        message.success('偏好设置已重置');
      },
    });
  };

  return (
    <>
      <Drawer
        title={
          <div
            className="title"
            style={{ fontSize: '16px', fontWeight: 'normal' }}
          >
            <h2
              style={{
                margin: 0,
                textAlign: 'left',
                fontSize: 'inherit',
                fontWeight: '500',
              }}
            >
              偏好设置
            </h2>
            <p
              className="subTitle"
              style={{
                fontSize: '.75rem',
                lineHeight: '1rem',
                marginTop: '.25rem',
                marginBottom: '0',
              }}
            >
              自定义偏好设置 & 实时预览
            </p>
          </div>
        }
        extra={
          <Space>
            <RedoOutlined />
            <CloseOutlined onClick={() => setOpen(false)} />
          </Space>
        }
        styles={{ header: { padding: '12px 16px' }, body: { padding: '12px' } }}
        placement="right"
        open={open}
        closeIcon={false}
        footer={
          <Space size={16}>
            <Button type="primary" icon={<CopyOutlined />} disabled>
              复制偏好设置
            </Button>
            <Button icon={<ClearOutlined />} onClick={resetPreference}>
              重置偏好设置
            </Button>
          </Space>
        }
        onClose={() => setOpen(false)}
      >
        {/* Segmented */}
        <ConfigProvider
          theme={{ components: { Segmented: { trackPadding: '4px' } } }}
        >
          <Segmented
            block
            options={segmentedItems}
            onChange={(key: string) => {
              setSelectedKey(key);
            }}
            value={selectedkey}
          />
        </ConfigProvider>
        {/* Tabs */}
        <Tabs
          activeKey={selectedkey}
          items={tabsItems}
          tabBarStyle={{ marginBottom: '8px' }}
        />
      </Drawer>
    </>
  );
});

Setting.propTypes = {};
export default Setting;
