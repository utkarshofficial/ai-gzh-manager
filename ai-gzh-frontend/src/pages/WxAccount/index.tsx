import AddWxAccount from '@/components/AddWxAccount';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Typography } from 'antd';
import React from 'react';

/**
 * 公众号管理页面
 */
const WxAccountPage: React.FC = () => {
  return (
    <PageContainer>
      <Card
        title="公众号管理"
        extra={
          <AddWxAccount
            onSuccess={() => {
              // 刷新列表或其他操作
              console.log('新增公众号成功，可以在这里刷新列表');
            }}
          />
        }
      >
        <Typography.Paragraph>
          在这里可以管理您的公众号，包括新增、编辑、删除等操作。
        </Typography.Paragraph>
        <Typography.Paragraph>
          点击右上角的&quot;新增公众号&quot;按钮，可以添加新的公众号。
        </Typography.Paragraph>
        {/* 这里可以添加公众号列表组件 */}
      </Card>
    </PageContainer>
  );
};

export default WxAccountPage;
