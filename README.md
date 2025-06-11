一、项目介绍 - 公众号智能管理系统
------------------

本项目是一款基于 Spring Boot3 + WxJava + Spring AI 的 **公众号智能管理系统**。

公众号运营者可以通过本项目管理多个公众号，实现多公众号的服务器认证、素材管理、回复管理以及菜单栏管理，其中智能回复模块基于 AI 可以智能回复用户的问题。

本平台的核心功能可分为四大类：

1）多公众号管理，用户可添加、删除、修改、查询公众号。

![](https://pic.code-nav.cn/course_picture/1608440217629360130/rVHmCwM26R70oowh.webp "null")

2）素材管理，用户可针对某个公众号进行图片、音频、视频等素材的上传、下载以及删除。

![](https://pic.code-nav.cn/course_picture/1608440217629360130/UDWe9yqsmXWnQPAZ.webp "null")

3）配置自动回复，可配置公众号收到指定消息时回复配置的内容，当用户发的消息不能匹配到配置的内容时，调用 **DeepSeek** 回复用户。

![](https://pic.code-nav.cn/course_picture/1608440217629360130/cX2aHw6rskybbNDK.webp "null")

本项目基于 **Spring AI** 集成了 DeepSeek 实现了用户消息的 AI 自动回复，效果如下图所示：

![](https://pic.code-nav.cn/course_picture/1608440217629360130/4fIafpSbSkjKMMKP.webp)

4）菜单栏管理，可配置公众号的菜单栏，实现了链接、点击事件、小程序等菜单栏的点击以及二级菜单。

![](https://pic.code-nav.cn/course_picture/1608440217629360130/WqvIISGGJlNWUMcn.webp "null")

### 项目三大阶段

1）第一阶段 - 公众号管理系统

第一阶段主要完成多公众号的管理、微信公众号服务器认证、维护多个公众号在内存的实例，解决多公众号统一管理问题。同时介绍了如何使用内网穿透实现公众号的调试功能（微信支付和阿里支付都可以用内网穿透实现本地调试）。

成果：可学习到如何接入公众号服务，如何使用内网穿透调试公众号接口等

![](https://pic.code-nav.cn/course_picture/1608440217629360130/Uxt4mB541uv5Hq70.webp)

2）第二阶段 - 自动回复配置平台。

成果：可用于提供公众号素材服务和 AI 对话服务，如多公众号素材分类汇总管理、AI 聊天室等

该阶段会完成素材相关业务，实现图片、音频、视频三种类型的素材内容上传、下载、删除、查询等功能，为智能回复功能提供基础服务。

![](https://pic.code-nav.cn/course_picture/1608440217629360130/rabQmOstPKGwh9Hk.webp "null")

该阶段还会完成智能回复相关业务，实现在关键字回复、默认回复、被关注回复等多种回复时机回复对应的内容，回复内容实现了文字回复、图片回复、音频回复、视频回复等多种消息类型。

![](https://pic.code-nav.cn/course_picture/1608440217629360130/yo2YCUpeFbCbRdnJ.webp "null")

在智能回复业务中，还利用 Spring AI 完成对 DeepSeek 的调用，实现了公众号智能回复用户信息。

![](https://pic.code-nav.cn/course_picture/1608440217629360130/dbOwcquwxRB5w3zq.webp "null")

3）第三阶段 - 优化与扩展

成果：可用于多公众号菜单栏配置。

该阶段通过引入消息队列、分布式锁等中间件解决了在分布式场景下的一系列问题，还扩展了公众号菜单栏配置功能。

![](https://pic.code-nav.cn/course_picture/1608440217629360130/4AJwgdTiwk2v01nz.webp)

二、项目优势
------

区别于传统 CRUD 管理系统，本项目聚焦于公众号业务，融合微信生态与 AI 技术，实现公众号 AI 对话功能，同时提供了公众号相关的管理功能。本项目根据需求层层递进开发，逐渐实现功能并完成项目扩展。

从这个项目中你可以学到：

*   如何拆解复杂业务，从 0 开始设计实现企业级系统？
*   如何通过 WxJava 库实现对微信公众号的接口调用？
*   如何通过 Spring AI 快速实现 DeepSeek 的调用？
*   如何通过 **Java21** 的**虚拟线程**实现异步的 AI 回复？
*   如何通过内网穿透调试公众号相关服务？
*   如何实现公众号的收到消息自动回复功能？
*   如何实现分布式场景下，各实例之间的公众号服务同步增删？

此外，还能学会很多思考问题、对比方案的方法，提升排查问题、自主解决 Bug 的能力。

三、核心业务流程
--------

### 多公众号管理系统

1）公众号管理：

![](https://pic.code-nav.cn/course_picture/1608440217629360130/Wcvc2wyhDzXwmcRu.svg)

### 公众号自动回复配置平台

1）配置管理：

【管理员】素材管理 -> 配置自动回复类型 -> 配置自动回复内容类型 -> 查询指定素材（图片、音频、视频） -> 完成配置。

![](https://pic.code-nav.cn/course_picture/1608440217629360130/SJ1Pll2mpZY3zUxi.svg)

2）回复流程：

2.1）被关注回复：

![](https://pic.code-nav.cn/course_picture/1608440217629360130/YsDyY9nCpBOcOOw9.svg)

2.2）用户发送消息：

![](https://pic.code-nav.cn/course_picture/1608440217629360130/9XR9xLkVTyovytGU.svg)

四、项目功能梳理
--------

### 第一阶段 - 多公众号管理系统

#### 公众号管理模块

*   管理多公众号
*   查询公众号列表
*   本地公众号 Service 服务维护（不同公众号对应不同的 Service，第一阶段直接全部实例化存本地）
*   公众号认证（内网穿透调试）

### 第二阶段 - 公众号自动回复配置平台

#### 素材管理模块

*   管理永久素材
*   查询素材列表
*   上传 / 下载素材
*   删除素材

#### 自动回复模块

*   配置自动回复

*   设置自动回复类型

*   关键字回复
*   默认回复
*   被关注回复

*   设置回复内容类型

*   文字
*   图片
*   音频
*   视频

*   公众号自动回复功能实现
*   默认回复接入 DeepSeek
*   记录用户和 DeepSeek 的消息记录

### 第三阶段 - 项目优化

*   收到消息回复使用分布式锁
*   分布式场景下各实例同步增删多公众号服务
*   记录用户和 DeepSeek 的消息记录
*   公众号菜单栏管理（只能微信认证的订阅号和服务号才可使用）

五、技术选型
------

### 后端

本项目采用以下技术栈：

*   Spring Boot 3 框架
*   MySQL 数据库 + MyBatis-Plus 框架 + MyBatis X
*   WxJava 接入微信接口
*   ⭐️ Spring AI 接入 DeepSeek
*   ⭐️ JUC 异步编程

### 前端

*   React
*   Umi

*   内置布局
*   国际化
*   权限
*   数据流

*   Ant Design：前端组件库
*   ProComponents：高级表单组件，开箱即用
*   Ant Design Chart：简单好用的 React 图表库
*   Eslint：代码检查工具
*   Prettier：代码格式化工具

六、架构设计
------

![](https://pic.code-nav.cn/course_picture/1608440217629360130/77ZRooYaXPF4oiGL.webp "null")
