package com.yuyuan.wxmp.aop;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.mp.api.WxMpService;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;

import java.lang.reflect.Method;
import java.lang.reflect.Parameter;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class SwitchAppIdAop {

    private final WxMpService wxMpService;

    @Around("execution(* com.yuyuan..wxmp.controller..*.*(..))")
    public Object extractAppId(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        Object[] args = joinPoint.getArgs();

        for (int i = 0; i < method.getParameters().length; i++) {
            Parameter parameter = method.getParameters()[i];
            PathVariable pathVariable = AnnotationUtils.findAnnotation(parameter, PathVariable.class);
            if (pathVariable != null) {
                String variableName = pathVariable.value().isEmpty() ? parameter.getName() : pathVariable.value();
                if ("appId".equalsIgnoreCase(variableName)) {
                    String appId = (String) args[i];
                    log.info("当前使用的 appId：{}", appId);
                    // 切换公众号
                    wxMpService.switchover(appId);
                    break;
                }
            }
        }
        return joinPoint.proceed();
    }
}