import AddWxAccount from '@/components/AddWxAccount';
import WxAccountSelector from '@/components/WxAccountSelector';
import { PageContainer } from '@ant-design/pro-components';
import { useModel, useSearchParams } from '@umijs/max';
import { Card, Divider, Empty, Space, Spin, Tabs } from 'antd';
import React, { useEffect } from 'react';
import { AudioList, ImageList, UploadMaterial } from './components';
import { getAcceptFileTypes } from './components/UploadMaterial/utils';

/**
 * 素材管理页面
 */
const MaterialPage: React.FC = () => {
  // 获取公众号数据
  const { fetchWxAccountList, wxAccountList, currentWxAccount } = useModel('myWxAccount');
  // 当前选中的素材类型
  const [searchParams, setSearchParams] = useSearchParams();
  const currentMaterialType = searchParams.get('tab');
  const { materialTypes, loading, fetchMaterialTypes, fetchMaterialList } =
    useModel('myWxMaterial');

  // 页面加载时获取公众号列表和素材类型
  useEffect(() => {
    fetchWxAccountList();
  }, []);
  useEffect(() => {
    if (wxAccountList.length <= 0) return;
    fetchMaterialTypes(currentMaterialType || '', setSearchParams);
  }, [wxAccountList.length]);

  // 当素材类型变化时，获取对应的素材列表
  useEffect(() => {
    if (currentMaterialType && currentWxAccount?.appId && currentMaterialType) {
      fetchMaterialList({
        AccountId: currentWxAccount?.id?.toString() || '',
        materialType: currentMaterialType,
      });
    }
  }, [currentMaterialType, currentMaterialType, currentWxAccount?.appId]);

  // 渲染素材内容
  const renderMaterialContent = (type: string) => {
    // 根据素材类型渲染不同的内容
    if (type === 'image') {
      return <ImageList />;
    }

    if (type === 'voice') {
      return <AudioList />;
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
              destroyInactiveTabPane
              tabBarExtraContent={{
                right: (
                  <UploadMaterial
                    appId={currentWxAccount?.appId || ''}
                    currentMaterialType={currentMaterialType || ''}
                    onSuccess={() =>
                      fetchMaterialList({
                        AccountId: currentWxAccount?.id?.toString() || '',
                        materialType: currentMaterialType || '',
                      })
                    }
                    acceptFileTypes={getAcceptFileTypes(currentMaterialType || '', '')}
                  />
                ),
              }}
              activeKey={currentMaterialType || ''}
              onChange={(key) => {
                setSearchParams({ tab: key });
              }}
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
