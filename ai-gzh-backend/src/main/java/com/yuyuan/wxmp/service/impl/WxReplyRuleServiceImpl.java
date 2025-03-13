package com.yuyuan.wxmp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yuyuan.wxmp.common.ErrorCode;
import com.yuyuan.wxmp.common.PageRequest;
import com.yuyuan.wxmp.exception.BusinessException;
import com.yuyuan.wxmp.mapper.WxReplyRuleMapper;
import com.yuyuan.wxmp.model.dto.wxmpreplyrule.WxReplyRulePageQueryRequest;
import com.yuyuan.wxmp.model.entity.User;
import com.yuyuan.wxmp.model.entity.WxReplyRule;
import com.yuyuan.wxmp.model.vo.WxReplyRuleVO;
import com.yuyuan.wxmp.service.UserService;
import com.yuyuan.wxmp.service.WxReplyRuleService;
import com.yuyuan.wxmp.utils.WrapperUtil;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author cq
 * @description 针对表【wx_reply_rule(微信公众号回复规则)】的数据库操作Service实现
 * @createDate 2025-03-13 16:52:40
 */
@Service
@RequiredArgsConstructor
public class WxReplyRuleServiceImpl extends ServiceImpl<WxReplyRuleMapper, WxReplyRule>
        implements WxReplyRuleService {

    private final UserService userService;

    @Override
    public Page<WxReplyRuleVO> getPage(Page<WxReplyRule> wxReplyRulePage, QueryWrapper<WxReplyRule> queryWrapper) {
        Page<WxReplyRule> replyRulePage = this.page(wxReplyRulePage, queryWrapper);
        Page<WxReplyRuleVO> resultPage = new Page<>();
        List<WxReplyRule> wxReplyRuleList = replyRulePage.getRecords();


        Set<Long> userIdSet = wxReplyRuleList.stream().map(WxReplyRule::getUserId).collect(Collectors.toSet());
        Map<Long, User> userIdUserListMap;
        if (ObjectUtils.isNotEmpty(userIdSet)) {
            userIdUserListMap = userService.listByIds(userIdSet)
                    .stream()
                    .collect(Collectors.toMap(User::getId, user -> user));
        } else {
            userIdUserListMap = new HashMap<>();
        }
        BeanUtils.copyProperties(replyRulePage, resultPage, "records");

        resultPage.setRecords(
                wxReplyRuleList
                        .stream()
                        .map(wxReplyRule -> {
                            WxReplyRuleVO replyRuleVO = WxReplyRuleVO.obj2VO(wxReplyRule);
                            User createUser = userIdUserListMap.get(wxReplyRule.getUserId());
                            if (ObjectUtils.isNotEmpty(createUser)) {
                                replyRuleVO.setUser(userService.getUserVO(createUser));
                            }
                            return replyRuleVO;
                        })
                        .collect(Collectors.toList())
        );
        return resultPage;
    }


    @Override
    public QueryWrapper<WxReplyRule> getQueryWrapper(WxReplyRulePageQueryRequest wxReplyRulePageQueryRequest) {
        if (wxReplyRulePageQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "请求参数为空");
        }
        String appId = wxReplyRulePageQueryRequest.getAppId();
        String ruleName = wxReplyRulePageQueryRequest.getRuleName();
        String matchValue = wxReplyRulePageQueryRequest.getMatchValue();
        String replyContent = wxReplyRulePageQueryRequest.getReplyContent();
        String eventKey = wxReplyRulePageQueryRequest.getEventKey();
        String ruleDescription = wxReplyRulePageQueryRequest.getRuleDescription();
        Integer replyType = wxReplyRulePageQueryRequest.getReplyType();
        String sortField = wxReplyRulePageQueryRequest.getSortField();
        String sortOrder = wxReplyRulePageQueryRequest.getSortOrder();
        List<PageRequest.Sorter> sorterList = wxReplyRulePageQueryRequest.getSorterList();

        QueryWrapper<WxReplyRule> queryWrapper = Wrappers.query();
        queryWrapper.eq(StringUtils.isNotBlank(appId), "appId", appId);
        queryWrapper.eq(ObjectUtils.isNotEmpty(replyType), "replyType", replyType);
        queryWrapper.like(ObjectUtils.isNotEmpty(eventKey), "eventKey", eventKey);
        queryWrapper.like(StringUtils.isNotBlank(ruleName), "ruleName", ruleName);
        queryWrapper.like(StringUtils.isNotBlank(matchValue), "matchValue", matchValue);
        queryWrapper.like(StringUtils.isNotBlank(replyContent), "replyContent", replyContent);
        queryWrapper.like(StringUtils.isNotBlank(ruleDescription), "ruleDescription", ruleDescription);
        WrapperUtil.handleOrder(queryWrapper, sorterList, sortField, sortOrder);
        return queryWrapper;
    }
}




