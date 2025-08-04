import {
  Button,
  Card,
  Dropdown,
  Empty,
  Input,
  type MenuProps,
  Space,
  Tree,
} from 'antd';
import { memo, useEffect, useRef, useState } from 'react';
import type { DataNode } from 'antd/es/tree';
import {
  addEndpointType,
  deleteEndpointType,
  queryEndpointConfigType,
  updateEndpointType,
} from '@/services/project/endpointTypeConfig/endpointTypeApi';
import { MyIcon } from '@/components/MyIcon';
import { addIcon } from '@/utils/utils';
import EndpointTypeModal from './EndpointTypeModal';
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FolderFilled,
  FolderOpenFilled,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { antdUtils } from '@/utils/antdUtil';

/**
 * 端点类型树
 * @returns
 */
const EndpointTypeTree: React.FC<EndpointTypeTreeProps> = memo(
  ({ onSelect }) => {
    // 树结构数据
    const [treeData, setTreeData] = useState<ConfigTypeNode[]>([]);
    // 树结构展开的节点
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    // 类型编辑窗口
    const [openTypeModal, setOpenTypeModal] = useState<boolean>(false);
    // 当前编辑的类型数据
    const [typeData, setTypeData] = useState<Record<string, any> | null>(null);
    // 右键菜单位置
    const [contextMenuPosition, setContextMenuPosition] = useState<{
      x: number;
      y: number;
    }>({ x: 0, y: 0 });
    // 菜单可见
    const [visible, setVisible] = useState<boolean>(false);
    // 选中的节点
    const [selectedNode, setSelectedNode] = useState<ConfigTypeNode | null>(
      null,
    );
    const dropdownRef = useRef<HTMLDivElement>(null);
    // 点击其他地方关闭菜单
    useEffect(() => {
      // 监听点击事件，如果点击的是dropdown，则不关闭
      const handleClick = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setVisible(false);
        }
      };
      document.addEventListener('click', handleClick);
      return () => {
        document.removeEventListener('click', handleClick);
      };
    }, []);

    // 右键菜单选项
    const contextMenu: MenuProps['items'] = [
      {
        key: 'add',
        label: '添加同级',
        icon: <PlusCircleOutlined />,
        extra: <>⌘ + N</>,
        onClick: () => {
          setTypeData(null);
          setOpenTypeModal(true);
          setVisible(false);
        },
      },
      {
        key: 'addSub',
        label: '添加下级',
        icon: <PlusCircleOutlined />,
        extra: <>⌘ + A</>,
        onClick: () => {
          setTypeData({ parentId: selectedNode?.key });
          setOpenTypeModal(true);
          setVisible(false);
        },
      },
      {
        key: 'edit',
        label: '编辑分类',
        icon: <EditOutlined />,
        extra: <>⌘ + E</>,
        onClick: () => {
          setTypeData(selectedNode);
          setOpenTypeModal(true);
          setVisible(false);
        },
      },
      {
        key: 'delete',
        label: '删除分类',
        extra: <>⌘ + D</>,
        icon: <DeleteOutlined />,
        disabled: selectedNode?.type === 'isConfig',
        onClick: () => {
          // 删除之前判断该分类下是否有配置信息
          if (selectedNode) {
            if (selectedNode.children && selectedNode.children.length > 0) {
              antdUtils.message?.warning('该分类下存在下级分类，无法删除！');
              return;
            }
            if (
              selectedNode.endpointConfigs &&
              selectedNode.endpointConfigs.length > 0
            ) {
              antdUtils.message?.warning('该分类下存在配置信息，无法删除！');
              return;
            }
          }
          antdUtils.modal?.confirm({
            title: '删除分类',
            content: '确定删除该分类？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              // 调用删除
              if (!selectedNode) {
                antdUtils.modal?.error({
                  title: '错误',
                  content: '请选择要删除的分类！',
                });
                return;
              }
              deleteEndpointType(selectedNode.id).then(() => {
                queryData();
              });
            },
            onCancel: () => {
              setVisible(false);
            },
          });
        },
      },
    ];

    useEffect(() => {
      queryData();
    }, []);

    /**
     * 检索
     * @param params 参数
     */
    const queryData = (params?: string) => {
      // 调用查询
      queryEndpointConfigType(params).then((response) => {
        // 内部数据需要进行处理，其中的icon需要处理成对应的组件
        const expanded: string[] = [];
        const data = transformData(response, expanded);
        setTreeData(data);
        setExpandedKeys(expanded);
      });
    };

    /**
     * 数据转换，处理其中的icon
     * @param data 数据
     */
    const transformData = (data: any[], expanded: string[]): any[] => {
      return data.map((item: any) => {
        // 转为树节点需要的key
        item.key = item.id;
        if (item.icon) {
          item.icon =
            item.icon.indexOf('fusion') > -1 ? (
              <MyIcon type={item.icon} />
            ) : (
              addIcon(item.icon)
            );
        }
        item.title = item.typeName;
        if (item.children?.length > 0 || item.endpointConfigs?.length > 0) {
          expanded.push(item.key as string);
        }
        // 分类节点，需要处理children数据
        if (item.children) {
          transformData(item.children, expanded);
        }
        return item;
      });
    };

    // 右键点击事件
    const handleRightClick = (event: any) => {
      event.event.preventDefault();
      // 如果是右键的配置节点，则不响应, 这里类型判断有误dang，需要处理
      if (event.node.isConfig) {
        return;
      }
      const { clientX, clientY } = event.event;
      const { innerWidth, innerHeight } = window;

      // 计算菜单位置，避免溢出
      const menuWidth = 160; // 假设菜单宽度
      const menuHeight = 136; // 假设菜单高度
      const x =
        clientX + menuWidth > innerWidth ? clientX - menuWidth : clientX;
      const y =
        clientY + menuHeight > innerHeight ? clientY - menuHeight : clientY;
      setContextMenuPosition({ x: x, y: y });
      const node = event.node;
      setSelectedNode({
        id: node.id,
        key: node.key,
        title: node.title,
        type: node.type,
        typeName: node.typeName,
        parentId: node.parentId,
        children: node.children,
        endpointConfigs: node.endpointConfigs,
      }); // 获取当前点击节点的 key
      setVisible(true); // 显示右键菜单
    };

    /**
     * 类型数据确定
     * @param typeData 类型数据
     */
    const onTypeEditOk = async (typeData: Record<string, any>) => {
      // 请求后台数据保存
      if (typeData.id) {
        // 编辑
        await updateEndpointType(typeData);
      } else {
        // 新增
        await addEndpointType(typeData);
      }
      // 操作成功，关闭弹窗，刷新数据
      setOpenTypeModal(false);
      queryData();
    };

    // 树节点选中事件
    const onTreeSelect = (selectedKeys: React.Key[], info: any) => {
      const node = info.node;
      setSelectedNode({
        id: node.id,
        key: node.key,
        title: node.title,
        type: node.type,
        typeName: node.typeName,
        parentId: node.parentId,
        children: node.children,
        endpointConfigs: node.endpointConfigs,
      });
      onSelect(info);
      console.log(selectedKeys, info);
    };

    // 新增分类
    const onAddTypeClick = () => {
      setOpenTypeModal(true);
    };

    /**
     * 展开节点
     * @param keys 节点key
     * @param info
     */
    const onExpand = (keys: any, info: any) => {
      if (info.expanded) {
        setExpandedKeys(keys);
      } else {
        //
        setExpandedKeys(
          expandedKeys.filter((key: any) => info.node.id !== key),
        );
      }
    };

    return (
      <>
        <Card style={{ height: '100%' }} title="端点分类列表">
          <Space
            direction="vertical"
            size={8}
            style={{ width: '100%', minHeight: 0 }}
            styles={{ item: { flex: 1, overflowY: 'auto' } }}
          >
            {/* 检索 */}
            <Input.Search
              placeholder="请输入名称检索"
              autoFocus
              onSearch={(value: string) => queryData(value)}
            />
            {/* 树结构 */}
            {/* 如果没有数据则显示为空，手动添加 */}
            <div className="tree">
              {treeData.length === 0 ? (
                <Empty description="暂无分类！">
                  <Button type="primary" onClick={onAddTypeClick}>
                    新增分类
                  </Button>
                </Empty>
              ) : (
                <Tree
                  blockNode
                  showIcon
                  switcherIcon={<DownOutlined />}
                  defaultExpandAll
                  icon={(props: any) => {
                    // 没有isConfig这个属性表明这是类型，不是配置
                    const { isConfig } = props.data;
                    if (!isConfig) {
                      return props.expanded ? (
                        <FolderOpenFilled
                          style={{ fontSize: '16px', color: 'orange' }}
                        />
                      ) : (
                        <FolderFilled
                          style={{ fontSize: '16px', color: 'orange' }}
                        />
                      );
                    }
                    return <></>;
                  }}
                  expandedKeys={expandedKeys}
                  onExpand={onExpand}
                  treeData={treeData}
                  selectedKeys={selectedNode ? [selectedNode.key] : []}
                  onSelect={onTreeSelect}
                  onRightClick={handleRightClick}
                />
              )}
              {/* 右键菜单 */}
              {visible && (
                <div
                  ref={dropdownRef}
                  style={{
                    position: 'fixed',
                    top: contextMenuPosition.y,
                    left: contextMenuPosition.x,
                    zIndex: 1000,
                  }}
                >
                  <Dropdown
                    menu={{ items: contextMenu }}
                    trigger={['click']}
                    open={visible}
                  >
                    <div />
                  </Dropdown>
                </div>
              )}
            </div>
          </Space>
        </Card>
        {/* 类型编辑窗口 */}
        <EndpointTypeModal
          open={openTypeModal}
          onCancel={() => setOpenTypeModal(false)}
          onOk={onTypeEditOk}
          data={typeData}
        />
      </>
    );
  },
);

export default EndpointTypeTree;

/**
 * 树节点数据类型
 */
interface ConfigTypeNode extends DataNode {
  id: string;
  // 节点类型（用于区分是分类还是配置）
  type: string;
  // 类型名
  typeName: string;
  parentId?: string;
  children?: ConfigTypeNode[];
  endpointConfigs?: any[];
}

type EndpointTypeTreeProps = {
  // 节点选中事件
  onSelect: (data: ConfigTypeNode) => void;
};
