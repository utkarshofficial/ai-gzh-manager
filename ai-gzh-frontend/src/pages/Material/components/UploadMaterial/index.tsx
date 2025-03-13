import { uploadMaterialUsingPOST } from '@/services/backend/wxMaterialController';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Upload, UploadFile, message } from 'antd';
import { RcFile } from 'antd/es/upload';
import React, { useState } from 'react';
import './index.less';
import { getAcceptFileTypes, getUploadTips, validateFile } from './utils';

interface UploadMaterialProps {
  appId: string; // 微信appId
  currentMaterialType: string; // 当前素材类型
  onSuccess?: () => void; // 上传成功回调
  buttonText?: string; // 按钮文本
  modalTitle?: string; // 弹窗标题
  acceptFileTypes?: string; // 接受文件类型
}

/**
 * 素材上传组件
 */
const UploadMaterial: React.FC<UploadMaterialProps> = ({
  appId,
  currentMaterialType,
  onSuccess,
  buttonText = '上传素材',
  modalTitle = '上传素材',
  acceptFileTypes = 'image/*',
}) => {
  // 控制上传弹窗的显示
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  // 上传文件列表
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  // 上传中状态
  const [uploading, setUploading] = useState<boolean>(false);

  // 打开上传弹窗
  const showModal = () => {
    setIsModalVisible(true);
  };

  // 关闭上传弹窗
  const handleCancel = () => {
    setIsModalVisible(false);
    setFileList([]);
  };

  // 上传前检查文件
  const beforeUpload = (file: RcFile) => {
    // 使用公共验证方法验证文件
    const isValid = validateFile(file, currentMaterialType, acceptFileTypes);
    if (isValid) {
      // 添加到文件列表，但不自动上传
      setFileList([file]);
      return;
    }
    // 此时列表中将不展示此文件，参考：https://ant.design/components/upload-cn#api
    return Upload.LIST_IGNORE;
  };

  // 处理文件列表变化
  const handleChange = ({ fileList }: { fileList: UploadFile[] }) => {
    // 为每个文件添加预览URL
    const newFileList = fileList.map((file) => {
      if (file.originFileObj && !file.url) {
        file.url = URL.createObjectURL(file.originFileObj);
      }
      return file;
    });
    setFileList(newFileList);
  };

  // 执行上传操作
  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('请先选择要上传的文件');
      return;
    }

    const file = fileList[0].originFileObj as File;

    setUploading(true);

    try {
      const response = await uploadMaterialUsingPOST(
        { appId, materialType: currentMaterialType },
        {}, // 可以在这里传递额外的参数
        file,
      );

      if (response.code === 0 && response.data) {
        message.success('上传成功');
        setFileList([]);
        setIsModalVisible(false);
        // 调用成功回调
        onSuccess?.();
      } else {
        message.error(response.message || '上传失败');
      }
    } catch (error) {
      console.error('上传出错:', error);
      message.error('上传失败，请稍后重试');
    } finally {
      setUploading(false);
    }
  };

  /**
   * 弹窗底部按钮
   */
  const modalFooter = [
    <Button key="cancel" onClick={handleCancel}>
      取消
    </Button>,
    <Button
      key="upload"
      type="primary"
      loading={uploading}
      onClick={handleUpload}
      disabled={fileList.length === 0}
    >
      上传
    </Button>,
  ];
  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        {buttonText}
      </Button>

      <Modal title={modalTitle} open={isModalVisible} onCancel={handleCancel} footer={modalFooter}>
        <div className="uploadContainer">
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            maxCount={1}
            accept={getAcceptFileTypes(currentMaterialType, acceptFileTypes)}
          >
            {fileList.length === 0 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>选择文件</div>
              </div>
            )}
          </Upload>
          <div className="upload-tips">
            <p>{getUploadTips(acceptFileTypes, currentMaterialType)}</p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UploadMaterial;
