# 翻译器子页面集成设计

## 目标

将 `D:\WorkDev\MyShare\vast-translator` 的多引擎文本翻译能力复制并集成到 Findry AI，作为公开的 `/translator` 子页面。源仓库保持只读，集成后的页面沿用 Findry AI 现有设计系统、全站导航与页脚。

## 功能范围

1. 提供 Google、Bing、Agnes 2.0 与 Agnes 2.5 四个翻译服务，不迁移 Azure。
2. 保留翻译器现有高级交互：
   - Provider 选择和桌面布局偏好持久化
   - 批量翻译与单项翻译
   - 独立失败、重试和请求取消
   - 结果复制、折叠与旧结果提示
   - `Ctrl/⌘ + Enter` 快捷翻译
   - 窄屏自动使用上下布局
3. 顶部导航与页脚 Product 分组增加 `Translator` 入口。
4. 页面、状态、按钮和错误信息统一使用英文。

## 集成方案

采用原生迁移，不使用 iframe 或反向代理。把翻译领域模型、Provider、请求校验和 Route Handler 复制到 Findry AI，并按照主站已有组件和 Tailwind Token 重写工作台界面。这样 `/translator` 与主站共享发布、路由、SEO、响应式布局和视觉系统，同时保持翻译功能内部边界清晰。

## 页面与视觉

页面使用公开路由组的 Navbar 与 Footer。顶部使用与 Blog 等页面一致的标题层级，主体放置宽版翻译工作台。

工作台继承主站的背景、前景色、边框、圆角、按钮、焦点状态和暗色模式变量。Provider 仅使用少量状态辨识色，不复制源站独立的品牌顶栏、页脚或全局样式。桌面端可切换上下和左右布局，移动端自动纵向排列。

视觉主张：延续 Findry AI 清爽、克制的中性色界面，把翻译器呈现为导航站内一个高完成度的实用工具，而非嵌入的第二个网站。

内容顺序：页面标题与说明、语言选择和原文输入、Provider 选择与主操作、并列翻译结果、第三方接口风险说明。

交互计划：输入与结果状态使用轻量过渡；Provider 与布局切换沿用现有 hover/focus 反馈；翻译中使用克制的加载状态，不增加新的动画依赖。

## 数据流与服务端边界

浏览器按所选 Provider 分别向 `POST /api/translate` 发起请求，每个结果独立返回和渲染。Route Handler 校验文本、语言和 Provider，再由服务端 Registry 调用对应第三方服务。

Google 与 Bing 不需要密钥。Agnes 2.0 与 Agnes 2.5 共用服务端环境变量 `AGNES_API_KEY`，不得暴露为 `NEXT_PUBLIC_*`。翻译正文不写入数据库或日志，只发送给用户明确选择的第三方服务。

请求文本上限为 5000 字符。常规 Provider 使用 12 秒超时；单个 Provider 失败不影响其他结果。客户端取消请求时，服务端及上游请求随之中止。

## SEO 与导航

`/translator` 提供独立 Metadata，包括标题、描述和 canonical URL。页面属于公开路由，可直接访问并被搜索引擎发现。顶部导航和页脚均提供站内链接。

## 边界

- 不修改 `D:\WorkDev\MyShare\vast-translator` 中的任何文件、提交或配置。
- 不使用 iframe，不依赖 `tr.vastnext.com` 在线状态。
- 不迁移 Azure Provider。
- 不新增登录、历史记录、术语表、文件翻译或其他未要求功能。
- 不改变 Findry AI 其他页面的视觉和行为。

## 验证

- 验证桌面上下/左右布局与移动端纵向布局。
- 验证四个 Provider 的选择、持久化、批量与单项翻译、错误隔离、重试、复制、折叠、旧结果和快捷键。
- 验证导航、页脚、Metadata 和暗色模式适配。
- 运行 `pnpm lint` 与 `pnpm build`。
- 对比源仓库执行前后的 `git status` 与 HEAD，确认零改动。
- 浏览器截图检查页面是否与 Findry AI 现有视觉系统一致。
