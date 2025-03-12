import AddWxAccount from '@/components/AddWxAccount';
import WxAccountSelector from '@/components/WxAccountSelector';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, Divider, Space } from 'antd';
import React, { useEffect } from 'react';

/**
 * 公众号管理页面
 */
const WxAccountPage: React.FC = () => {
  const { fetchWxAccountList } = useModel('myWxAccount');
  useEffect(() => {
    fetchWxAccountList();
  }, []);
  return (
    <PageContainer title={false}>
      <Card
        title="公众号管理"
        extra={
          <Space split={<Divider type="vertical" />}>
            <AddWxAccount
              onSuccess={() => {
                // 刷新列表或其他操作
                console.log('新增公众号成功，可以在这里刷新列表');
              }}
            />
            <WxAccountSelector />
          </Space>
        }
      ></Card>
    </PageContainer>
  );
};

export default WxAccountPage;
