import AddWxAccount from '@/components/AddWxAccount';
import ClearWxAccounts from '@/components/ClearWxAccounts';
import WxAccountGuide from '@/components/WxAccountGuide';
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
            <ClearWxAccounts
              onSuccess={() => {
                fetchWxAccountList();
              }}
            />
            <AddWxAccount
              onSuccess={() => {
                fetchWxAccountList();
              }}
            />
            <WxAccountSelector />
          </Space>
        }
      >
        <WxAccountGuide />
      </Card>
    </PageContainer>
  );
};

export default WxAccountPage;
