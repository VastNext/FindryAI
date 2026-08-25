type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD 需要输出原始 JSON；序列化时已转义可结束脚本标签的字符。
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD 使用官方推荐的脚本注入方式
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
