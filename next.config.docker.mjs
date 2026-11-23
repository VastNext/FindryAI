// Docker/自托管构建入口。
// 复用 next.config.mjs 的全部路由、重定向与图片配置，只追加 standalone 输出，
// 避免两份配置漂移导致容器内丢失 /sitemap.xml rewrite 与旧路径重定向。
import nextConfig from "./next.config.mjs";

/** @type {import('next').NextConfig} */
export default {
  ...nextConfig,
  output: "standalone",
};
