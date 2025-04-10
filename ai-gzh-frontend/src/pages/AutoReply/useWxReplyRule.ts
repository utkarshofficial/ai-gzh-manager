import {
  deleteWxReplyRuleByIdsUsingPOST,
  listWxMpReplyRuleByPageUsingGET,
} from '@/services/backend/wxReplyRuleController';
import { message } from 'antd';
import { useCallback, useState } from 'react';

/**
 * 微信自动回复规则 Hook
 * 用于管理自动回复规则的数据和操作
 */
const useWxReplyRule = () => {
  // 回复规则列表
  const [replyRuleList, setReplyRuleList] = useState<API.WxReplyRuleVO[]>([]);
  // 加载状态
  const [loading, setLoading] = useState<boolean>(false);
  // 分页信息
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  /**
   * 获取回复规则列表
   * @param params 查询参数
   */
  const fetchReplyRuleList = useCallback(
    async (params?: API.listWxMpReplyRuleByPageUsingGETParams) => {
      setLoading(true);
      try {
        const res = await listWxMpReplyRuleByPageUsingGET({
          current: pagination.current,
          pageSize: pagination.pageSize,
          ...params,
        });
        if (res.code === 0 && res.data) {
          setReplyRuleList(res.data.records || []);
          setPagination({
            ...pagination,
            total: res.data.total || 0,
          });
        }
      } catch (error) {
        console.error('获取回复规则列表失败:', error);
        message.error('获取回复规则列表失败');
      } finally {
        setLoading(false);
      }
    },
    [pagination.current, pagination.pageSize],
  );

  /**
   * 删除回复规则
   * @param ids 要删除的规则ID数组
   */
  const deleteReplyRules = useCallback(async (ids: number[]): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await deleteWxReplyRuleByIdsUsingPOST(ids);
      if (res.code === 0 && res.data) {
        message.success('删除成功');
        return true;
      } else {
        message.error(res.message || '删除失败');
        return false;
      }
    } catch (error) {
      console.error('删除回复规则失败:', error);
      message.error('删除回复规则失败');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 处理表格分页变化
   */
  const handleTableChange = useCallback(
    (page: number, pageSize?: number) => {
      const newPagination = {
        ...pagination,
        current: page,
        pageSize: pageSize || pagination.pageSize,
      };
      setPagination(newPagination);
      fetchReplyRuleList({
        current: newPagination.current,
        pageSize: newPagination.pageSize,
      });
    },
    [pagination, fetchReplyRuleList],
  );

  return {
    replyRuleList,
    loading,
    pagination,
    fetchReplyRuleList,
    deleteReplyRules,
    handleTableChange,
  };
};

export default useWxReplyRule;
