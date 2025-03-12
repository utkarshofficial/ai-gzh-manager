import { WX_ACCOUNT_GUIDE_COLUMNS } from '@/constants/WxAccountGuide';
import { deleteUsingPost } from '@/services/backend/gongzhonghaozhanghaoguanli';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { message, Modal } from 'antd';
import React, { useState } from 'react';
import UpdateWxAccountModal from './components/UpdateWxAccountModal';

/**
 * 公众号管理组件
 */
const WxAccountGuide: React.FC = () => {
  const { wxAccountList, loading, fetchWxAccountList } = useModel('myWxAccount');
  // 是否显示更新弹窗
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  // 当前选中的公众号
  const [currentWxAccount, setCurrentWxAccount] = useState<API.WxAccountVO | undefined>(undefined);

  /**
   * 处理删除公众号
   * @param record 要删除的公众号记录
   */
  const handleDelete = async (record: API.WxAccountVO) => {
    if (!record.id) {
      message.error('公众号ID不存在');
      return;
    }

    Modal.confirm({
      title: '确认删除',
      content: `确定要删除公众号"${record.name}"吗？此操作不可恢复。`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const result = await deleteUsingPost([record.appId as string]);
          if (result.code === 0) {
            message.success('删除成功');
            fetchWxAccountList();
          } else {
            message.error(result.message || '删除失败');
          }
        } catch (error: any) {
          message.error('删除失败: ' + error.message);
        }
      },
    });
  };

  /**
   * 处理更新公众号
   * @param record 要更新的公众号记录
   */
  const handleUpdate = (record: API.WxAccountVO) => {
    setCurrentWxAccount(record);
    setUpdateModalVisible(true);
  };

  const operateItem: ProColumns<API.WxAccountVO> = {
    title: '操作',
    valueType: 'option',
    key: 'option',
    width: 160,
    render: (_, record) => [
      <a key="update" onClick={() => handleUpdate(record)}>
        更新
      </a>,
      <a key="delete" style={{ color: 'red' }} onClick={() => handleDelete(record)}>
        删除
      </a>,
    ],
  };
  return (
    <>
      <ProTable<API.WxAccountVO>
        headerTitle="公众号管理"
        rowKey="id"
        search={false}
        loading={loading}
        // 禁止查询
        toolBarRender={false}
        dataSource={wxAccountList}
        columns={[...WX_ACCOUNT_GUIDE_COLUMNS, operateItem]}
      />

      {/* 更新公众号弹窗 */}
      <UpdateWxAccountModal
        visible={updateModalVisible}
        onCancel={() => {
          setUpdateModalVisible(false);
          setCurrentWxAccount(undefined);
        }}
        onSuccess={() => {
          setUpdateModalVisible(false);
          setCurrentWxAccount(undefined);
          fetchWxAccountList();
        }}
        values={currentWxAccount}
      />
    </>
  );
};

export default WxAccountGuide;
