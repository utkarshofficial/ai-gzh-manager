package com.yuyuan.wxmp.handler;


import com.yuyuan.wxmp.model.dto.wxmpreplyrule.WxReplyContentDTO;
import com.yuyuan.wxmp.model.enums.WxReplyContentTypeEnum;
import com.yuyuan.wxmp.service.WxReplyRuleService;
import lombok.RequiredArgsConstructor;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.common.session.WxSessionManager;
import me.chanjar.weixin.mp.api.WxMpMessageHandler;
import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.bean.message.WxMpXmlMessage;
import me.chanjar.weixin.mp.bean.message.WxMpXmlOutMessage;
import me.chanjar.weixin.mp.bean.message.WxMpXmlOutTextMessage;
import me.chanjar.weixin.mp.util.WxMpConfigStorageHolder;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * 关注处理器
 *
 * @author <a href="https://github.com/liyupi">程序员鱼皮</a>
 * @from <a href="https://yupi.icu">编程导航知识星球</a>
 **/
@Component
@RequiredArgsConstructor
public class SubscribeHandler implements WxMpMessageHandler {

    private final WxReplyRuleService wxReplyRuleService;

    @Override
    public WxMpXmlOutMessage handle(WxMpXmlMessage wxMpXmlMessage, Map<String, Object> map,
                                    WxMpService wxMpService, WxSessionManager wxSessionManager) throws WxErrorException {
        String appId = WxMpConfigStorageHolder.get();
        WxReplyContentDTO replyContent = wxReplyRuleService.replySubscribe(appId);
        WxMpXmlOutTextMessage defaultReply = WxMpXmlOutMessage.TEXT().content("感谢关注")
                .fromUser(wxMpXmlMessage.getToUser())
                .toUser(wxMpXmlMessage.getFromUser())
                .build();
        if (ObjectUtils.isEmpty(replyContent)) {
            return defaultReply;
        }
        WxReplyContentTypeEnum contentTypeEnum = WxReplyContentTypeEnum.getEnumByValue(replyContent.getContentType());
        if (ObjectUtils.isEmpty(contentTypeEnum)) {
            return defaultReply;
        }
        return wxReplyRuleService.replyByContentType(wxMpXmlMessage, replyContent, contentTypeEnum);
    }
}
