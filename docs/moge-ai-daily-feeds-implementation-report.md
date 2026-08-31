# MOGE「AI 推文精选」页面实现研究报告

> 研究对象：<https://moge.ai/zh/ai-daily-feeds>
>
> 研究日期：2026-08-31
>
> 研究范围：页面架构、数据链路、推文卡片、筛选、瀑布流、翻译、响应式布局、主题、SEO、监控与可靠性

## 1. 摘要

MOGE 的「AI 推文精选」页面是一个以 Next.js App Router 为基础的客户端动态信息流页面。服务端负责输出页面外壳、国际化文案和经过分类筛选的推文 ID；浏览器随后通过 `react-tweet.vercel.app` 逐条获取推文详情，并使用 JavaScript 瀑布流组件完成不等高卡片的三列布局。

页面核心链路如下：

```text
访问页面
  ↓
Next.js 输出页面外壳并完成 React hydration
  ↓
客户端读取 URL 中的 tab 参数
  ↓
调用 Next.js Server Action 获取推文 ID 数组
  ↓
首批取 20 个 ID，并发请求 react-tweet API
  ↓
渲染作者、正文、图片、视频、长文和操作区
  ↓
InfiniteGrid 测量卡片高度并排成瀑布流
  ↓
距离底部约 600px 时继续追加 20 条
```

页面实现的主要特点是：

- 使用 URL 查询参数保存筛选状态；
- 使用 Next.js Server Action 返回分类后的推文 ID；
- 使用 SWR 获取和缓存单条推文详情；
- 使用 InfiniteGrid 和 ResizeObserver 支持不等高卡片；
- 每批加载 20 条，避免一次渲染全部数据；
- 使用 Google Translate Element 只翻译推文区域；
- 桌面端采用三列瀑布流，移动端使用独立底部导航；
- 通过 Google Analytics 和 `/api/vitals` 收集使用及性能数据。

## 2. 研究方法与网络门禁

该页面依赖 Google、`react-tweet.vercel.app`、X 图片资源等境外服务。如果浏览器没有正确使用代理，页面外壳仍可打开，但推文详情请求会超时，最终只显示标题和空瀑布流。

因此本次有效验证采用以下严格顺序：

1. 使用带代理参数的新浏览器会话：

   ```text
   --proxy http://127.0.0.1:7890
   ```

2. 在同一浏览器会话中先打开 `https://www.google.com/`；
3. 验证页面标题为 `Google`，并确认搜索框、Google 搜索、Gmail 等元素正常出现；
4. 再打开目标页面；
5. 等待动态请求完成，确认推文正文、图片和操作区真实渲染；
6. 检查网络请求状态；
7. 滚动页面并切换不同筛选标签，复测动态行为。

最终验证结果：

| 检查项 | 结果 |
|---|---|
| Google 可访问性门禁 | 通过 |
| `moge.ai` 页面 | 正常 |
| `react-tweet.vercel.app` | 首批请求均返回 200 |
| 首屏推文卡片 | 20 张 |
| 滚动追加后 | 40 张 |
| All 筛选 | 正常 |
| OpenClaw 筛选 | 正常 |
| Hermes Agent 筛选 | 正常 |
| 图片、视频和多图内容 | 正常 |

本报告中的“推文实际表现”结论均来自代理浏览器中的真实渲染，而不是仅根据接口 JSON 推测。

## 3. 技术栈判断

根据 HTML、响应头、React Flight 数据和 JavaScript 分包，可以确认或高置信判断以下技术：

| 层级 | 技术 |
|---|---|
| Web 框架 | Next.js App Router |
| 渲染模型 | React Server Components + Client Components |
| 构建与分包 | Next.js / Turbopack |
| 部署适配 | OpenNext |
| CDN 与边缘防护 | Cloudflare |
| 样式 | Tailwind CSS |
| 无障碍 UI 基础 | Radix UI |
| 推文渲染 | `react-tweet` 体系的客户端组件 |
| 请求状态管理 | SWR |
| 瀑布流 | `@egjs/react-infinitegrid` 体系 |
| 网站国际化 | Next.js 路由国际化与服务端翻译字典 |
| 推文即时翻译 | Google Translate Element |
| 图标 | Lucide 与 Remix Icon |
| 使用分析 | Google Analytics |
| 性能监控 | 自建 `/api/vitals` 接口 |

关键响应头包括：

```text
content-type: text/x-component
x-opennext: 1
server: cloudflare
```

可以据此还原出大致部署链路：

```text
浏览器
  ↓
Cloudflare
  ↓
OpenNext 运行环境
  ↓
Next.js App Router / React Server Components
```

## 4. 页面结构

页面从上到下分为：

1. 桌面端全站导航；
2. Hero 标题和副标题；
3. All、OpenClaw、Hermes Agent 筛选；
4. 推文翻译菜单；
5. 推文瀑布流；
6. 返回顶部按钮；
7. 全站页脚；
8. 移动端固定底部导航。

初始服务端 HTML 中，推文区域只是一个空容器：

```html
<div id="translate-target">
  <div class="tweet-grid"></div>
</div>
```

这说明推文正文不是服务端直接写入 HTML，而是在 hydration 后由客户端加载。

## 5. 页面初始化与数据流

页面加载后，客户端组件执行以下工作：

1. 通过 `useSearchParams()` 读取 `tab`；
2. 从 Local Storage 读取推文翻译语言；
3. 初始化 Google Translate Element；
4. 调用名为 `getDirectoryTweets` 的 Server Action；
5. 清空旧推文 ID；
6. 接收当前分类的 ID 数组；
7. 截取前 20 个 ID 创建首批卡片；
8. 每张卡片通过 SWR 请求单条推文数据；
9. 推文完成渲染后由瀑布流组件重新测量位置。

## 6. All、OpenClaw 与 Hermes Agent 筛选

### 6.1 UI 结构

筛选控件基于 Radix Tabs：

```html
<div role="tablist">
  <button role="tab" data-state="active">All</button>
  <button role="tab" data-state="inactive">OpenClaw</button>
  <button role="tab" data-state="inactive">Hermes Agent</button>
</div>
```

内部值对应：

```ts
const tabs = {
  All: "all",
  OpenClaw: "openclaw",
  HermesAgent: "hermes",
};
```

### 6.2 URL 状态

三个状态对应：

```text
All          /zh/ai-daily-feeds
OpenClaw     /zh/ai-daily-feeds?tab=openclaw
Hermes Agent /zh/ai-daily-feeds?tab=hermes
```

实际浏览器点击后，OpenClaw 和 Hermes Agent 的 URL 查询参数均正确变化。刷新后，页面可从 URL 恢复选中标签。

这种实现带来以下能力：

- 筛选结果可复制分享；
- 刷新后保留状态；
- 浏览器前进、后退可表达筛选历史；
- 服务端和客户端都能理解当前分类。

### 6.3 Server Action 请求

筛选请求不是传统的 `/api/tweets`，而是向当前页面发送 Next.js Server Action POST：

```http
POST /zh/ai-daily-feeds?tab=openclaw
Accept: text/x-component
Content-Type: text/plain;charset=UTF-8
Next-Action: 7f182c5fbaec89f9755a58d3782867cc431f3a2c94
```

请求体：

```json
[{"tab":"openclaw"}]
```

其他标签分别为：

```json
[{"tab":"all"}]
```

```json
[{"tab":"hermes"}]
```

### 6.4 防重复与防竞态

客户端维护：

- 当前请求对应的 `AbortController`；
- 最近一次请求的标签；
- 加载状态；
- 当前推文 ID 数组。

行为近似：

```ts
if (lastRequestedTab === tab) return;

lastRequestedTab = tab;
previousController?.abort();

const controller = new AbortController();
setLoading(true);
setTweetIds([]);

try {
  const result = await getDirectoryTweets({ tab });

  if (!controller.signal.aborted) {
    setTweetIds(result?.data ?? []);
  }
} finally {
  if (!controller.signal.aborted) {
    setLoading(false);
  }
}
```

这可以防止用户快速切换标签时，较慢的旧响应覆盖较新的筛选结果。

### 6.5 真实分类结果

实际渲染验证中：

- All 首张是 Peter Steinberger 关于“用 OpenClaw 构建 OpenClaw”的推文；
- OpenClaw 首张切换为 OpenClaw 官方账号的 “OpenClaw 2.0 has arrived”；
- Hermes Agent 首张切换为介绍 Hermes Agent 能力的推文。

这说明分类由后端维护独立 ID 集合，而不是浏览器对已加载的 All 内容做简单关键词过滤。

## 7. 推文 ID 数据源

Server Action 返回的不是完整推文，而是 ID 数组：

```json
{
  "data": [
    "2094171671838224806",
    "2094135553344049230",
    "2094108089872199834"
  ]
}
```

在研究时抓取到的数据规模为：

| 分类 | 返回 ID 数量 |
|---|---:|
| All | 1000 |
| OpenClaw | 1000 |
| Hermes Agent | 843 |

因此 MOGE 自己的后端主要承担：

- 保存精选推文 ID；
- 维护分类标签；
- 决定排序；
- 按分类返回 ID。

从公开前端无法确认其数据库类型，也无法确认精选过程是全人工、规则筛选还是 AI 辅助，因此不应对其后台采集算法作确定性推断。

## 8. 单条推文详情请求

每个 ID 会请求：

```text
https://react-tweet.vercel.app/api/tweet/{tweetId}
```

例如：

```text
https://react-tweet.vercel.app/api/tweet/2094171671838224806
```

返回数据包括：

- 推文 ID；
- 正文；
- 发布时间；
- 点赞数量；
- 语言；
- 作者名称和用户名；
- 头像；
- 认证状态；
- 图片、视频和媒体尺寸；
- 引用推文；
- Article 或链接卡片数据。

SWR 配置中可以确认：

```ts
{
  revalidateIfStale: false,
  revalidateOnFocus: false,
  shouldRetryOnError: false,
}
```

含义是：

- 页面重新获得焦点时不自动刷新推文；
- 已得到的结果不主动后台重验；
- 请求失败后不自动重试；
- 相同 URL 可由 SWR 缓存和去重。

单卡片状态近似：

```tsx
if (isLoading) return <TweetSkeleton />;
if (error || !data) return null;
return <TweetCard tweet={data} />;
```

在无代理浏览器中，第三方请求超时后卡片会静默消失；在代理正常的浏览器中，首批 20 个详情请求均返回 200，卡片完整显示。

## 9. 推文卡片功能

### 9.1 作者区

每张卡片顶部包含：

- 用户头像；
- 显示名称；
- 用户名；
- 认证状态；
- `View Post` 链接。

作者链接指向：

```text
https://x.com/{screen_name}
```

`View Post` 指向具体推文：

```text
https://x.com/{screen_name}/status/{tweetId}
```

### 9.2 正文

实际页面支持：

- 多段落文本；
- 中英文混排；
- Emoji；
- `@username`；
- Hashtag；
- 普通 URL 与短链接；
- 列表式内容；
- 自动换行。

用户名、Hashtag 和链接均会转换为可点击元素。

### 9.3 图片

真实首屏卡片中同时出现头像、单图、多图、链接缩略图和长文封面。媒体响应包含原始宽高和不同尺寸版本，组件可据此保持图片比例。

### 9.4 视频

页面支持视频卡片，辅助树中可观察到：

```text
Video "Your browser does not support video playback."
▶
```

视频呈现包括：

- 视频封面；
- 居中播放按钮；
- `<video>` 元素；
- 点击播放；
- 浏览器不支持时的 fallback 文本。

### 9.5 多图轮播

实际页面中出现 `1/2`、`1/4` 等指示，说明多图推文采用轮播，而不是把图片全部纵向堆叠。卡片会显示当前序号和总数量，并允许切换媒体。

### 9.6 Twitter Article 与长文预览

页面能够渲染独立标题，例如：

```text
智能体工程模式：代码免费时代的软件工程实践
```

这类内容走 Article 或长文预览分支，可能包含标题、摘要、封面和原文链接，不等同于普通推文正文。

### 9.7 链接卡片

部分推文含嵌入式链接预览，包括：

- 网站标题；
- 摘要；
- 域名；
- 缩略图；
- 可点击卡片区域。

### 9.8 点赞

卡片会显示真实点赞数，辅助语义为：

```text
Like. This Tweet has 55 likes
```

该元素是前往 X 的链接，不是在 MOGE 内执行点赞。MOGE 不需要为此维护用户点赞状态。

### 9.9 Reply

Reply 的辅助语义为：

```text
Reply to this Tweet on Twitter
```

点击后跳往 X 的回复界面，不会在 MOGE 页面内创建评论。

### 9.10 Copy link

每张卡片底部有真正的 `Copy link` 按钮，用于复制原推文地址。该按钮存在复制前后图标和文本状态。

## 10. 瀑布流布局

页面不是 CSS Columns，而是 JavaScript 驱动的 InfiniteGrid。关键配置近似：

```tsx
<InfiniteGrid
  className="tweet-grid"
  gap={20}
  align="center"
  useResizeObserver
  observeChildren
  threshold={600}
  onRequestAppend={loadNextBatch}
  useFit={false}
  useRecycle
  horizontal={false}
  percentage={false}
  isEqualSize={false}
  isConstantSize={false}
  renderOnPropertyChange={false}
  preserveUIOnDestroy={false}
/>
```

### 10.1 为什么需要 ResizeObserver

推文高度受以下因素影响：

- 文本长度；
- 图片数量和比例；
- 视频封面；
- 引用推文；
- Article 和链接卡片；
- 字体、图片的异步加载时间。

`useResizeObserver` 和 `observeChildren` 会在子内容尺寸变化后重新计算卡片位置，避免重叠。

### 10.2 卡片性能属性

每个卡片外层设置：

```css
will-change: transform;
contain: layout style paint;
```

作用是缩小重绘范围，并让瀑布流通过 transform 移动卡片时保持较好的滚动性能。

### 10.3 桌面视觉结构

代理浏览器截图确认桌面端为三列瀑布流：

- 内容区域居中限宽；
- 列间距约 20px；
- 每列卡片宽度相近；
- 卡片按实际高度交错排列；
- 不存在固定行高。

深色卡片采用深蓝灰背景、细边框和圆角，作者名加粗，用户名与时间为灰色，`View Post` 使用亮蓝色，点赞图标为粉红色，Reply 图标为蓝色。

## 11. 无限滚动

Server Action 虽然一次返回数百或 1000 个 ID，但客户端不会同时渲染全部内容。

### 11.1 首批

```ts
const firstBatchSize = Math.min(20, tweetIds.length);
```

实际浏览器验证：

```text
首屏 .tweet-card：20
首屏 article：20
```

### 11.2 后续批次

当距离瀑布流底部约 600px 时触发 `onRequestAppend`，每次再追加 20 条：

```ts
const group = currentGroup + 1;
const start = 20 * group;
const end = Math.min(start + 20, tweetIds.length);
```

实际向下滚动后：

```text
.tweet-card：20 → 40
```

### 11.3 节流与分组

加载逻辑具有：

- 至少约 500ms 的加载间隔；
- `requestAnimationFrame` 中追加新卡片；
- 约 100ms 的加载锁释放延迟；
- `data-grid-groupkey` 标记每一批次。

这可以防止快速滚动导致重复追加和布局抖动。

## 12. 推文翻译

### 12.1 支持语言

翻译菜单支持：

- 原文；
- 英语；
- 葡萄牙语；
- 西班牙语；
- 阿拉伯语；
- 德语；
- 法语；
- 日语；
- 韩语；
- 繁体中文；
- 简体中文。

### 12.2 Google Translate Element

页面载入：

```text
https://translate.google.com/translate_a/element.js
?cb=googleTranslateElementInit
```

初始化行为近似：

```js
new google.translate.TranslateElement(
  {
    pageLanguage: "auto",
    includedLanguages: "en,pt,es,ar,de,fr,ja,ko,zh-TW,zh-CN",
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    autoDisplay: false,
    multilanguagePage: true,
  },
  "google_translate_element",
);
```

### 12.3 状态持久化

选择目标语言后会保存：

```text
localStorage["translate-lang"]
```

并设置：

```text
googtrans=/auto/{language}
```

刷新时组件会读取 Local Storage 并重建 Cookie。

### 12.4 翻译范围隔离

Google Translate 只处理：

```html
<div id="translate-target">
  <!-- 推文瀑布流 -->
</div>
```

Header、Footer、导航、标题和筛选控件会被添加：

```html
class="notranslate"
translate="no"
```

页面还使用 MutationObserver 处理异步追加的新推文，并保护浏览器 `<title>` 不被 Google Translate 改写。

## 13. 网站语言与推文翻译的区别

页面存在两套独立语言系统。

### 13.1 网站界面语言

顶部语言按钮控制 Next.js 路由语言，例如：

```text
/zh
/br
/es
/ru
/de
/fr
/ja
/ko
/tw
```

它会切换全站导航、标题、按钮和 SEO metadata。

### 13.2 推文翻译语言

Hero 右侧翻译按钮只翻译 `#translate-target` 中的推文，不改变路由，也不切换网站 UI 文案。

因此：

```text
网站语言 = Next.js i18n
推文翻译 = Google Translate Element
```

## 14. Hero 与背景效果

Hero 文案为：

```text
为好奇心而精炼
一页掌握 AI 领域最新动态 | 👨‍💻筛选机制改进中...
```

标题采用响应式字号，大致为：

```text
手机：30px
sm：36px
md：48px
```

背景光效不是图片，而是多个绝对定位的 CSS 径向渐变层：

- 超长矩形；
- 统一旋转约 `-45deg`；
- 低透明度蓝色径向渐变；
- 外层 `overflow-hidden`；
- `pointer-events: none`；
- 叠加模糊渐变层。

## 15. 返回顶部

按钮初始状态：

```css
opacity: 0;
pointer-events: none;
transform: translateY(16px);
```

滚动后切换为：

```css
opacity: 1;
pointer-events: auto;
transform: translateY(0);
```

位置：

```text
桌面：右 32px，底部 32px
手机：右 16px，底部 80px
```

手机端底部位置更高，用于避开固定底部导航。

滚动回顶部并非简单调用原生 smooth behavior，而是通过 `requestAnimationFrame` 和三次缓出曲线实现：

```js
1 - Math.pow(1 - progress, 3)
```

## 16. 深浅主题

主题通过 `<html>` 的类控制：

```html
<html class="dark">
```

切换后：

```html
<html class="light">
```

主题按钮同时包含太阳和月亮图标，通过旋转和缩放过渡显示其中一个。页面颜色主要依赖 Tailwind 主题变量，而不是为每个组件手写两套样式。

## 17. 桌面导航与移动导航

### 17.1 桌面端

导航包括：

- 首页；
- AI 工作台；
- 分类目录；
- 排行榜；
- 推文精选；
- Skills；
- 提示词；
- 搜索；
- 网站语言；
- 登录。

桌面 Header 在 `md` 以下隐藏。

### 17.2 移动端

手机宽度下：

- 桌面 Header 隐藏；
- 显示固定底部导航；
- 页面为底部栏预留空间。

底部入口包括：

- AI 工作台；
- 提示词；
- AI 产品；
- Skills；
- 登录。

其中 AI 产品是可展开菜单。

## 18. 页脚与共享功能

页脚包含：

- MOGE 品牌和简介；
- 精选产品；
- 热门产品；
- 趋势分类；
- 提交产品；
- 联系方式；
- 隐私政策；
- 服务条款；
- 主题切换。

桌面使用多列网格，手机收缩为两列。Logo 中的星光 SVG 有空闲旋转、Hover 旋转和 `prefers-reduced-motion` 兼容。

“提交产品”是全站共享弹窗入口。公开翻译字典显示其包含产品官网输入、提交中状态、成功状态、失败提示和 72 小时审核说明。本次研究未向生产系统提交数据。

## 19. 搜索功能边界

Header 中存在全站搜索按钮，公开翻译字典显示其设计包含：

- 自然语言搜索；
- 最近搜索；
- 热门搜索；
- 清空记录；
- 即时结果；
- 查看全部结果；
- 无结果提示；
- 同义词、AI 关键词和英文关键词建议。

但本次页面研究没有观察到有效搜索请求，因此无法从该页面单独确认搜索后端、索引技术或排序算法。搜索属于全站共享功能，不应把推文页面的已确认实现延伸为对搜索系统的确定性判断。

## 20. SEO

页面包含：

- Title；
- Description；
- Canonical；
- 多语言 hreflang；
- Open Graph；
- Twitter Card；
- Manifest；
- favicon；
- apple-touch-icon；
- creator metadata。

主要 metadata：

```text
Title: AI 推文精选动态 - MOGE
Description: 一页掌握 AI 领域最新动态
Canonical: https://moge.ai/zh/ai-daily-feeds
```

由于推文正文主要在客户端加载，初始 HTML 中没有完整推文内容。搜索引擎可直接获取的核心内容主要是标题、副标题、导航和 metadata。

## 21. 分析与性能监控

Google Analytics 会上报：

- `page_view`；
- `scroll`；
- `user_engagement`。

页面还向以下接口发送性能数据：

```http
POST /api/vitals
```

实测 payload 包括 CLS、LCP、路径、最大布局偏移目标、TTFB 和元素渲染延迟。

一次观察到的 CLS 较高，最大偏移目标指向：

```text
#translate-target > .tweet-grid > .tweet-card
```

这符合瀑布流中骨架屏、图片加载和卡片重新测量可能造成布局移动的特征。

## 22. 可靠性与性能风险

### 22.1 第三方详情接口依赖

页面能否显示推文取决于 `react-tweet.vercel.app`。在代理正常的浏览器中接口工作正常；在无法访问该域名的网络环境中，Server Action 虽然已返回 ID，推文卡片仍会全部消失。

问题不在于页面当前必然不可用，而在于：

- 第三方域名是关键运行时依赖；
- 失败时卡片返回 `null`；
- 用户看不到错误原因；
- SWR 配置不自动重试。

### 22.2 缺少明确错误态

当前用户无法区分：

- 分类真的没有内容；
- 网络不可用；
- 第三方接口超时；
- 推文已删除；
- 内容仍在加载。

建议提供“部分动态加载失败”和单卡片重试能力，或至少退化为“在 X 上查看”。

### 22.3 首屏并发

首批 20 个 ID 会产生 20 个详情请求，随后还会加载头像和媒体。建议在自建实现中限制并发，或由服务端批量获取并缓存完整推文。

### 22.4 CLS

推文高度差异较大，异步图片、视频和 Article 内容会让卡片二次测量。可通过以下方式改善：

- 使用更接近真实高度的骨架；
- 利用媒体原始宽高预留空间；
- 服务端预取首屏推文；
- 渐进插入卡片；
- 使用 `contain-intrinsic-size` 等占位策略。

### 22.5 Google Translate 的网络要求

即时翻译依赖 Google 域名。在不能访问 Google 的网络环境中，语言状态可能已经写入 Local Storage 和 Cookie，但正文不会真正翻译。

如果面向网络环境复杂的用户，更稳定的方案是服务端翻译并缓存译文。

### 22.6 不是服务端游标分页

页面会一次返回数百至 1000 个 ID，再由前端分批显示。现有规模下字符串数组成本不高，但数据继续增长时，更合理的是服务端游标分页：

```ts
type FeedPage = {
  items: TweetData[];
  nextCursor: string | null;
};
```

## 23. 推荐复刻架构

如果在本项目中实现类似功能，建议采用以下目录：

```text
src/app/[locale]/ai-daily-feeds/
├── page.tsx
├── loading.tsx
└── actions.ts

src/components/feeds/
├── feeds-view.tsx
├── feeds-hero.tsx
├── feed-tabs.tsx
├── tweet-translation-menu.tsx
├── tweet-waterfall.tsx
├── tweet-card.tsx
├── tweet-skeleton.tsx
├── tweet-error-card.tsx
└── back-to-top.tsx

src/lib/tweets/
├── repository.ts
├── fetch-tweet.ts
├── cache.ts
└── types.ts
```

推荐接口：

```ts
type FeedTab = "all" | "openclaw" | "hermes";

type FeedPage = {
  tweets: TweetData[];
  nextCursor: string | null;
};

async function getFeedPage(input: {
  tab: FeedTab;
  cursor?: string;
  limit: number;
}): Promise<FeedPage>;
```

建议不要让浏览器直接逐条依赖第三方详情接口，而是使用：

```text
浏览器
  ↓
本站 Server Action / API
  ↓
推文数据库与缓存
  ↓
缺失时请求外部数据源
```

本站缓存至少保存：

- 推文正文；
- 作者信息；
- 发布时间；
- 原文地址；
- 媒体 URL 和尺寸；
- 点赞数及最后更新时间；
- 推文删除或失效状态。

## 24. 最终结论

该页面的核心并不是在浏览器中执行复杂的 AI 筛选，而是把以下模块组合起来：

1. 后端维护经过精选和分类的推文 ID；
2. Next.js Server Action 按标签返回 ID；
3. 客户端通过 react-tweet API 获取完整推文；
4. SWR 管理单条推文请求和缓存；
5. InfiniteGrid 将不等高内容排成瀑布流；
6. 每批追加 20 条，实现渐进加载；
7. Google Translate Element 只翻译推文区域；
8. 全站组件提供导航、主题、语言、搜索和提交产品入口。

值得借鉴的部分：

- URL 驱动筛选状态；
- Server Action 与客户端展示层分工明确；
- AbortController 防止筛选竞态；
- ResizeObserver 适配不定高媒体；
- 20 条一批的无限滚动；
- 翻译范围隔离；
- 完整的响应式导航和 SEO metadata；
- 对 Web Vitals 的细粒度归因。

复刻时应优先改进：

- 自建服务端代理和推文缓存；
- 明确的错误态与重试；
- 限制外部请求并发；
- 改善首屏 CLS；
- 使用服务端游标分页；
- 为无法访问 Google 的环境提供可控翻译方案。

总体而言，这是一个结构清楚、交互完整的 Next.js 动态瀑布流页面，但其运行可靠性高度依赖浏览器对 Google、Vercel 和 X 相关资源的网络可达性。研究和验收此类页面时，必须先在同一代理浏览器会话中通过 Google 可访问性门禁，再对动态内容作结论。
