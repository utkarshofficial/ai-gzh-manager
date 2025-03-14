package com.yuyuan.wxmp.handler;


import com.yuyuan.wxmp.model.dto.wxmpreplyrule.WxReplyContentDTO;
import com.yuyuan.wxmp.model.enums.WxReplyContentTypeEnum;
import com.yuyuan.wxmp.service.WxReplyRuleService;
import lombok.RequiredArgsConstructor;
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
 * 消息处理器
 *
 * @author <a href="https://github.com/liyupi">程序员鱼皮</a>
 * @from <a href="https://yupi.icu">编程导航知识星球</a>
 **/
@Component
@RequiredArgsConstructor
public class MessageHandler implements WxMpMessageHandler {

    private final WxReplyRuleService wxReplyRuleService;

    @Override
    public WxMpXmlOutMessage handle(WxMpXmlMessage wxMpXmlMessage, Map<String, Object> map,
                                    WxMpService wxMpService, WxSessionManager wxSessionManager) {
        String appId = WxMpConfigStorageHolder.get();
        WxReplyContentDTO replyContent = wxReplyRuleService.receiveMessageReply(appId, wxMpXmlMessage.getContent());
        WxMpXmlOutTextMessage defaultReply = WxMpXmlOutMessage.TEXT().content("抱歉，我暂时无法理解您的问题。您可以尝试问其他问题，或者提供更多详细信息。")
                .fromUser(wxMpXmlMessage.getToUser())
                .toUser(wxMpXmlMessage.getFromUser())
                .build();
        if (ObjectUtils.isEmpty(replyContent)) {
            return defaultReply;
        }
        WxReplyContentTypeEnum contentTypeEnum = WxReplyContentTypeEnum.getEnumByValue(replyContent.getContentType());
        if (ObjectUtils.isEmpty(contentTypeEnum)) {
            // 降级回复
            return defaultReply;
        }
        return wxReplyRuleService.replyByContentType(wxMpXmlMessage, replyContent, contentTypeEnum);
    }
}
