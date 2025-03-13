# 建表脚本
# @author <a href="https://github.com/liyupi">程序员鱼皮</a>
# @from <a href="https://yupi.icu">编程导航知识星球</a>

-- 创建库
create database if not exists wx_mp_manage;

-- 切换库
use wx_mp_manage;

-- 用户表
create table if not exists user
(
    id           bigint auto_increment comment 'id' primary key,
    userAccount  varchar(256)                           not null comment '账号',
    userPassword varchar(512)                           not null comment '密码',
    unionId      varchar(256)                           null comment '微信开放平台id',
    mpOpenId     varchar(256)                           null comment '公众号openId',
    userName     varchar(256)                           null comment '用户昵称',
    userAvatar   varchar(1024)                          null comment '用户头像',
    userProfile  varchar(512)                           null comment '用户简介',
    userRole     varchar(256) default 'user'            not null comment '用户角色：user/admin/ban',
    createTime   datetime     default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime   datetime     default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete     tinyint      default 0                 not null comment '是否删除',
    index idx_unionId (unionId)
) comment '用户' collate = utf8mb4_unicode_ci;


create table if not exists `wx_account`
(
    `id`         bigint auto_increment comment 'id' primary key,
    `appId`      char(20)                           not null comment 'appid',
    `name`       varchar(50)                        not null comment '公众号名称',
    `verified`   bit      default false             not null comment '认证状态',
    `secret`     char(32)                           not null comment 'appSecret',
    `token`      varchar(32)                        null comment 'token',
    `aesKey`     varchar(43)                        null comment 'aesKey',
    `userId`     bigint                             not null comment '创建用户 id',
    `createTime` datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    `updateTime` datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    `isDelete`   tinyint  default 0                 not null comment '是否删除',
    index idx_appId (appId),
    index idx_userId (userId)
) comment '微信公众号账号';
