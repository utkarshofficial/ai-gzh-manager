package com.yuyuan.wxmp.handler;


import cn.hutool.crypto.digest.DigestUtil;
import com.yuyuan.wxmp.model.dto.wxmpreplyrule.WxReplyContentDTO;
import com.yuyuan.wxmp.model.entity.AiReplyRecord;
import com.yuyuan.wxmp.model.enums.WxAiReplyStatusEnum;
import com.yuyuan.wxmp.model.enums.WxReplyContentTypeEnum;
import com.yuyuan.wxmp.service.AiReplyRecordService;
import com.yuyuan.wxmp.service.WxReplyRuleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class MessageHandler implements WxMpMessageHandler {

    private final WxReplyRuleService wxReplyRuleService;

    private final AiReplyRecordService aiReplyRecordService;

    @Override
    public WxMpXmlOutMessage handle(WxMpXmlMessage wxMpXmlMessage, Map<String, Object> map,
                                    WxMpService wxMpService, WxSessionManager wxSessionManager) {
        String appId = WxMpConfigStorageHolder.get();
        String userMessage = wxMpXmlMessage.getContent();
        String fromUser = wxMpXmlMessage.getFromUser();
        WxMpXmlOutTextMessage defaultReplyMessage = WxMpXmlOutMessage.TEXT().content(String.format("正在思考中，请 10 秒后再次发送原问题：“%s”", userMessage))
                .fromUser(wxMpXmlMessage.getToUser())
                .toUser(fromUser)
                .build();
        // 针对公众号和用户加锁，避免用户短时间内发送同一条信息导致 AI 回复了多次
        synchronized ((appId + fromUser + DigestUtil.md5Hex(userMessage)).intern()) {
            WxReplyContentDTO replyContent = wxReplyRuleService.receiveMessageReply(appId, userMessage);
            if (ObjectUtils.isEmpty(replyContent)) {
                AiReplyRecord replyRecord = aiReplyRecordService.lambdaQuery()
                        .eq(AiReplyRecord::getFromUser, fromUser)
                        .eq(AiReplyRecord::getAppId, appId)
                        .eq(AiReplyRecord::getMessage, userMessage)
                        .eq(AiReplyRecord::getReplyStatus, WxAiReplyStatusEnum.NOT_REPLY.getValue())
                        .one();

                if (ObjectUtils.isEmpty(replyRecord)) {
                    AiReplyRecord aiReplyRecord = new AiReplyRecord();
                    aiReplyRecord.setAppId(appId);
                    aiReplyRecord.setFromUser(fromUser);
                    aiReplyRecord.setMessage(userMessage);
                    aiReplyRecordService.save(aiReplyRecord);
                    aiReplyRecordService.aiReply(appId, fromUser, userMessage, aiReplyRecord);
                    return defaultReplyMessage;
                }
                if (ObjectUtils.isEmpty(replyRecord.getReplyMessage())) {
                    // 如果回复消息为空，代表此时没有 AI 回复
                    return defaultReplyMessage;
                }
                aiReplyRecordService.lambdaUpdate()
                        .set(AiReplyRecord::getReplyStatus, WxAiReplyStatusEnum.REPLIED.getValue())
                        .eq(AiReplyRecord::getId, replyRecord.getId())
                        .update();
                return WxMpXmlOutMessage.TEXT().content(replyRecord.getReplyMessage())
                        .fromUser(wxMpXmlMessage.getToUser())
                        .toUser(fromUser)
                        .build();

            }
            WxReplyContentTypeEnum contentTypeEnum = WxReplyContentTypeEnum.getEnumByValue(replyContent.getContentType());
            if (ObjectUtils.isEmpty(contentTypeEnum)) {
                // 降级回复
                return WxMpXmlOutMessage.TEXT().content("抱歉，我暂时无法理解您的问题。您可以尝试问其他问题，或者提供更多详细信息。")
                        .fromUser(wxMpXmlMessage.getToUser())
                        .toUser(fromUser)
                        .build();
            }
            return wxReplyRuleService.replyByContentType(wxMpXmlMessage, replyContent, contentTypeEnum);
        }
    }
}
