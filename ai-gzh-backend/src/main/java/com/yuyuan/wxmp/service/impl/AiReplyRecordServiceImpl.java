package com.yuyuan.wxmp.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yuyuan.wxmp.mapper.AiReplyRecordMapper;
import com.yuyuan.wxmp.model.entity.AiReplyRecord;
import com.yuyuan.wxmp.model.enums.WxAiReplyStatusEnum;
import com.yuyuan.wxmp.service.AiReplyRecordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.stereotype.Service;

import java.util.concurrent.*;

/**
 * @author cq
 * @description 针对表【ai_reply_record(AI 回复内容记录)】的数据库操作Service实现
 * @createDate 2025-03-14 19:16:00
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AiReplyRecordServiceImpl extends ServiceImpl<AiReplyRecordMapper, AiReplyRecord>
        implements AiReplyRecordService {

    private final OpenAiChatModel chatModel;

    private static final String SYSTEM_PROMPT = "我想让你充当一个拥有十年开发经验的架构师，对多种编程语言和技术栈有深入的了解，精通编程原理、算法、数据结构以及调试技巧，能够有效地沟通和解释复杂概念，提供清晰、准确、有用的回答，帮助提问者解决问题，并提升个人在专业领域的声誉。回答需要保持专业、尊重和客观，避免使用过于复杂或初学者难以理解的术语。我会问与编程相关的问题，你会回答应该是什么答案，回复内容控制在 200 字以内，在四秒内返回响应，并且回答的内容不要使用 markdown 格式，如果有链接可以使用 HTML 格式展示。";

    @Override
    public String aiReply(String appId, String fromUser, String message, AiReplyRecord aiReplyRecord) {
        CompletableFuture<AiReplyRecord> future = CompletableFuture.supplyAsync(() -> {
            long s = System.currentTimeMillis();
            ChatResponse chatResponse = chatModel.call(
                    new Prompt(
                            new SystemMessage(SYSTEM_PROMPT),
                            new UserMessage(message)
                    ));
            String aiReplyContent = chatResponse.getResult().getOutput().getText();
            aiReplyRecord.setReplyMessage(aiReplyContent);
            this.lambdaUpdate()
                    .eq(AiReplyRecord::getId, aiReplyRecord.getId())
                    .set(AiReplyRecord::getReplyMessage, aiReplyContent)
                    .update();

            long e = System.currentTimeMillis();
            log.info("AI 回复耗时:{}s", (e - s) / 1000.0);
            log.info("AI 回复内容：{}", aiReplyContent);
            return aiReplyRecord;
        }, Executors.newVirtualThreadPerTaskExecutor());
        try {
            AiReplyRecord aiReplyResult = future.get(3, TimeUnit.SECONDS);
            // 修改回复状态
            this.lambdaUpdate()
                    .set(AiReplyRecord::getReplyStatus, WxAiReplyStatusEnum.REPLIED.getValue())
                    .eq(AiReplyRecord::getId, aiReplyResult.getId())
                    .update();
            return aiReplyResult.getReplyMessage();
        } catch (TimeoutException e) {
            // 不取消任务，让后台线程继续完成保存操作
            log.warn("AI 回复超时，返回默认内容（后台任务仍在执行）");
            return null;
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            return null;
        }
    }
}




