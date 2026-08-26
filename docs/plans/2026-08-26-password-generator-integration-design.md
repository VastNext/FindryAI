# 密码生成器集成设计

## 目标

将现有密码生成器作为 FindryAI 的原生公开功能发布到 `/password-generator`，使其共享导航站的页头、页尾、字体、颜色、明暗主题、响应式规则和部署流程。现有 `D:\WorkDev\MyShare\password-generator` 仓库仅作为只读功能参考，不做任何修改。

## 方案选择

采用“原生移植”而非 Git submodule、iframe 或独立反向代理：

- 在 FindryAI 仓库内维护 Next.js 客户端组件和无框架依赖的生成算法。
- 不引入第二套 Vite、React 19 或 Tailwind 4 构建链。
- 不复制独立站的页头、页尾和主题 CSS，改用 FindryAI 现有布局与设计令牌。
- 原始项目保持独立、可继续单独演进；本次不会向其写入文件或提交。

submodule 会把两套前端构建系统带入同一个部署单元，并不能自然共享本站主题；iframe 或反向代理则会破坏一致的导航、SEO、可访问性和页面体验，因此不采用。

## 页面与交互

新增公开页面 `/password-generator`，由服务端页面负责 metadata 和结构化数据，由客户端生成器负责交互。

页面继续提供：

- 随机密码、易记口令、PIN 码三种模式。
- 长度、字符类型、易混淆字符、词数、分隔符、首字母大写、尾部数字等原有选项。
- 基于熵值的实时强度反馈。
- 使用 Web Crypto API 在浏览器本地生成密码。
- 一键复制、重新生成和六语言切换。
- 关于与隐私说明，明确密码不会离开浏览器。

页面使用 FindryAI 的 `Navbar`、`Footer`、主题变量、字体和 UI 原语。内容区保持紧凑的工具型布局，在桌面端居中显示，在移动端采用单列并保证触控目标尺寸。

主导航新增 `Password Generator` 入口，并在移动导航中使用钥匙图标。页面加入 sitemap，canonical URL 指向 `https://findryai.com/password-generator`。

## 代码边界

- `src/app/(website)/(public)/password-generator/page.tsx`：页面 metadata、结构化数据与外壳。
- `src/components/password-generator/`：生成器客户端界面及局部组件。
- `src/lib/password-generator.ts`：密码学随机生成和强度估算，不依赖 React。
- `src/lib/password-word-list.ts`：易记口令词表。
- `src/config/marketing.ts` 与图标映射：主导航入口。
- sitemap 生成逻辑：新增静态 URL。

实现保持最小边界，不创建新仓库、不添加 submodule、不引入新依赖，也不添加服务端密码处理接口。

## 安全与错误处理

- 随机数只使用 `crypto.getRandomValues`，并采用拒绝采样避免模偏差。
- 随机模式至少保留一种字符类型；用户取消最后一种时给出明确提示，不生成空密码。
- 复制优先使用 Clipboard API，失败时显示错误提示，不记录密码内容。
- 页面不把密码写入 URL、Cookie、localStorage、日志、分析事件或服务端。
- 语言偏好可存入 localStorage，但只保存 locale，不保存生成结果。

## 验收与验证

- `pnpm lint` 通过。
- `pnpm build` 通过，且 `/password-generator` 正常生成。
- 浏览器验证三种模式、选项联动、复制、语言切换、明暗主题、移动端和桌面端布局。
- 浏览器网络面板确认生成操作不产生请求。
- 检查 `D:\WorkDev\MyShare\password-generator` 的 Git 状态与任务开始前一致。
