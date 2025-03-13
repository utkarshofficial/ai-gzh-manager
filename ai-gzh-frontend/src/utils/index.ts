/**
 * 下载二进制文件
 * @param binaryData 二进制数据
 * @param fileName 文件名
 */
export const downloadBinaryFile = (binaryData: ArrayBuffer, fileName: string) => {
  // 创建一个 Blob 对象
  const blob = new Blob([binaryData]);

  // 创建一个下载链接
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;

  // 模拟点击下载链接
  link.click();

  // 释放 URL 对象
  window.URL.revokeObjectURL(link.href);
};
