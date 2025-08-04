import * as AntdIcon from '@ant-design/icons';
import { Pagination } from 'antd';
import React from 'react';
import { useEffect, useState } from 'react';

// antd中所有的图标库
const iconList: any[] = Object.values(AntdIcon).filter(
  (icon) => typeof icon !== 'function',
);
/**
 * 图标面板组件
 */
const IconPanel: React.FC<IconPanelProps> = (props) => {
  const { onSelect } = props;
  // 当前选中的图标
  const [selectedIcon, setSelectedIcon] = useState<string>('');
  // 当前分页
  const [currentPage, setCurrentPage] = useState<number>(1);
  // 每页显示的图标数量(10个8行)
  const [pageSize, _setPageSize] = useState<number>(80);
  // 当前页显示的图标
  const [paginatedIcons, setPaginatedIcons] = useState<any[]>([]);

  // 计算当前页需要显示的图标
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedIcons(iconList.slice(startIndex, endIndex));
  }, [currentPage, pageSize]);

  // 处理图标选中
  const handleIconClick = (icon: string) => {
    setSelectedIcon(icon);
    onSelect(icon);
  };

  return (
    <>
      <div className="icon-panel flex flex-wrap gap-2 p-4">
        {paginatedIcons.map((icon) => (
          <div
            key={icon.displayName}
            className={`icon-item cursor-pointer hover:bg-[#ddd] w-[20px] text-center ${
              selectedIcon === icon.displayName ? 'bg-[#1890ff] text-white' : ''
            }`}
            onClick={() => handleIconClick(icon.displayName)}
          >
            {React.createElement(icon, { style: { fontSize: '18px' } })}
          </div>
        ))}
      </div>
      {/* 分页组件 */}
      <Pagination
        className="absolute bottom-2"
        current={currentPage}
        size="small"
        pageSize={pageSize}
        total={iconList.length}
        onChange={(page) => setCurrentPage(page)}
      />
    </>
  );
};
export default IconPanel;

/**
 * 选择图标时候调用的回调，返回当前选中的图标
 */
export interface IconPanelProps {
  onSelect: (icon: string) => void;
}
