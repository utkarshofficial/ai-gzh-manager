import AddWxAccount from '@/components/AddWxAccount';
import WxAccountSelector from '@/components/WxAccountSelector';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, Divider, Empty, Space, Spin, Tabs } from 'antd';
import React, { useEffect } from 'react';
import { ImageList, UploadMaterial } from './components';

/**
 * 素材管理页面
 */
const MaterialPage: React.FC = () => {
  // 获取公众号数据
  const { fetchWxAccountList, wxAccountList, currentWxAccount } = useModel('myWxAccount');
  // 获取素材数据
  const {
    materialTypes,
    currentMaterialType,
    loading,
    fetchMaterialTypes,
    fetchMaterialList,
    changeMaterialType,
  } = useModel('myWxMaterial');

  // 页面加载时获取公众号列表和素材类型
  useEffect(() => {
    fetchWxAccountList();
  }, []);
  useEffect(() => {
    if (wxAccountList.length <= 0) return;
    fetchMaterialTypes();
  }, [wxAccountList.length]);

  // 当素材类型变化时，获取对应的素材列表
  useEffect(() => {
    if (currentMaterialType && currentWxAccount?.appId) {
      fetchMaterialList();
    }
  }, [currentMaterialType]);

  // 处理标签页切换
  const handleTabChange = (key: string) => {
    changeMaterialType(key);
  };

  // 渲染素材内容
  const renderMaterialContent = (type: string) => {
    // 根据素材类型渲染不同的内容
    if (type === 'image') {
      return <ImageList />;
    }

    // 其他类型暂时显示空状态
    return <Empty description="暂无渲染内容" />;
  };

  return (
    <PageContainer title={false}>
      <Card
        title="素材管理"
        extra={
          <Space split={<Divider type="vertical" />}>
            <AddWxAccount
              onSuccess={() => {
                fetchWxAccountList();
              }}
            />
            <WxAccountSelector />
          </Space>
        }
      >
        <Spin spinning={loading}>
          {materialTypes.length > 0 ? (
            <Tabs
              tabBarExtraContent={{
                right: (
                  <UploadMaterial
                    appId={currentWxAccount?.appId || ''}
                    currentMaterialType={currentMaterialType || ''}
                    onSuccess={fetchMaterialList}
                  />
                ),
              }}
              activeKey={currentMaterialType}
              onChange={handleTabChange}
              items={materialTypes.map((type: API.WxMaterialTypeEnum) => ({
                key: type.value || '',
                label: type.label || '',
                children: renderMaterialContent(type.value || ''),
              }))}
            />
          ) : (
            <Empty description="暂无素材类型" />
          )}
        </Spin>
      </Card>
    </PageContainer>
  );
};

export default MaterialPage;
