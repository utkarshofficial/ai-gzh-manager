import { message } from 'antd';

// 图片类型常量
const IMAGE_TYPES = ['image/bmp', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
// 图片大小限制（10MB）
const IMAGE_MAX_SIZE = 10 * 1024 * 1024;

/**
 * 获取上传提示文本
 * @param acceptFileTypes 接受文件类型
 * @param currentMaterialType 当前素材类型
 * @returns 上传提示文本
 */
export const getUploadTips = (acceptFileTypes: string, currentMaterialType: string) => {
  if (currentMaterialType === 'image') {
    return '支持 BMP、PNG、JPEG、JPG、GIF 格式，文件大小不超过 10MB';
  }
  return `支持上传 ${acceptFileTypes.replace('/*', '')} 类型的文件`;
};

/**
 * 获取当前素材类型的接受文件类型
 * @param currentMaterialType 当前素材类型
 * @param acceptFileTypes 接受文件类型
 * @returns 当前素材类型的接受文件类型
 */
export const getAcceptFileTypes = (currentMaterialType: string, acceptFileTypes: string) => {
  if (currentMaterialType === 'image') {
    return '.bmp,.png,.jpeg,.jpg,.gif';
  }
  return acceptFileTypes;
};

/**
 * 验证文件是否符合要求
 * @param file 文件
 * @param currentMaterialType 当前素材类型
 * @param acceptFileTypes 接受文件类型
 * @returns 是否符合要求
 */
export const validateFile = (
  file: File,
  currentMaterialType: string,
  acceptFileTypes: string,
): boolean => {
  // 检查文件类型
  const isImage = currentMaterialType === 'image';

  if (isImage) {
    // 检查图片格式
    const isValidImageType = IMAGE_TYPES.includes(file.type);
    if (!isValidImageType) {
      message.error('只支持 BMP、PNG、JPEG、JPG、GIF 格式的图片');
      return false;
    }

    // 检查图片大小
    const isValidSize = file.size <= IMAGE_MAX_SIZE;
    if (!isValidSize) {
      message.error('图片大小不能超过 10MB');
      return false;
    }
  } else {
    // 其他类型素材的检查
    const isValidType = file.type.startsWith(acceptFileTypes.replace('*', ''));
    if (!isValidType) {
      message.error(`请上传${acceptFileTypes}类型的文件`);
      return false;
    }
  }

  return true;
};
