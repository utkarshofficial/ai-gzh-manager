import { pageUsingGet } from '@/services/backend/gongzhonghaozhanghaoguanli';
import { useCallback, useState } from 'react';

/**
 * 公众号数据流模型
 * 管理公众号列表和当前选中的公众号
 */
export default () => {
  // 公众号列表
  const [wxAccountList, setWxAccountList] = useState<API.WxAccountVO[]>([]);
  // 当前选中的公众号
  const [currentWxAccount, setCurrentWxAccount] = useState<API.WxAccountVO | undefined>(undefined);
  // 加载状态
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * 获取公众号列表
   */
  const fetchWxAccountList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await pageUsingGet({
        pageSize: 100, // 设置较大的页面大小，确保能获取所有公众号
        current: 1,
      });
      if (res.code === 0 && res.data) {
        const accountList = res.data.records || [];
        setWxAccountList(accountList);

        // 如果有公众号且当前未选中任何公众号，则默认选中第一个
        if (accountList.length > 0 && !currentWxAccount) {
          setCurrentWxAccount(accountList[0]);
        }
      }
    } catch (error) {
      console.error('获取公众号列表失败:', error);
    } finally {
      setLoading(false);
    }
  }, [currentWxAccount]);

  /**
   * 切换当前选中的公众号
   * @param wxAccount 要选中的公众号
   */
  const switchWxAccount = useCallback((wxAccount: API.WxAccountVO) => {
    setCurrentWxAccount(wxAccount);
  }, []);

  return {
    wxAccountList,
    currentWxAccount,
    loading,
    fetchWxAccountList,
    switchWxAccount,
    setCurrentWxAccount,
  };
};
