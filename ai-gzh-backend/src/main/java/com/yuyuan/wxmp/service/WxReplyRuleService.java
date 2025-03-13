package com.yuyuan.wxmp.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.yuyuan.wxmp.model.dto.wxmpreplyrule.WxReplyRulePageQueryRequest;
import com.yuyuan.wxmp.model.entity.WxReplyRule;
import com.yuyuan.wxmp.model.vo.WxReplyRuleVO;

/**
* @author cq
* @description 针对表【wx_reply_rule(微信公众号回复规则)】的数据库操作Service
* @createDate 2025-03-13 16:52:40
*/
public interface WxReplyRuleService extends IService<WxReplyRule> {

    /**
     * 获取查询包装器
     *
     * @param wxReplyRulePageQueryRequest 回复规则分页查询DTO
     * @return {@link QueryWrapper}<{@link WxReplyRule}>
     */
    QueryWrapper<WxReplyRule> getQueryWrapper(WxReplyRulePageQueryRequest wxReplyRulePageQueryRequest);

    /**
     * 查询分页
     *
     * @param wxReplyRulePage 回复规则分页数据
     * @param queryWrapper    查询包装器
     * @return {@link Page }<{@link WxReplyRuleVO }>
     */
    Page<WxReplyRuleVO> getPage(Page<WxReplyRule> wxReplyRulePage, QueryWrapper<WxReplyRule> queryWrapper);


}
