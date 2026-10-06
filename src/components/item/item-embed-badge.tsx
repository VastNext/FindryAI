"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { CheckIcon, CopyIcon, SparklesIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ItemEmbedBadgeProps {
  itemName: string;
  itemSlug: string;
}

// 徽章支持的三种主题类型
type BadgeTheme = "dark" | "light" | "neutral";

/**
 * 条目详情页嵌入徽章组件
 * 提供亮色、暗色、中性色三种官方徽章预览，支持快速复制 HTML 或 Markdown 代码
 */
export default function ItemEmbedBadge({
  itemName,
  itemSlug,
}: ItemEmbedBadgeProps) {
  // 当前选中的徽章主题：dark (暗色), light (亮色), neutral (中性色)
  const [selectedTheme, setSelectedTheme] = useState<BadgeTheme>("dark");
  // 当前选中的代码格式：html 或 markdown
  const [selectedFormat, setSelectedFormat] = useState<"html" | "markdown">(
    "html",
  );
  // 复制状态提示
  const [copied, setCopied] = useState(false);

  const itemUrl = `${siteConfig.url}/item/${itemSlug}`;
  const badgeUrl = `${siteConfig.url}/badge-${selectedTheme}.svg`;

  // 生成 HTML 与 Markdown 嵌入代码
  const htmlCode = `<a href="${itemUrl}" target="_blank" rel="noopener noreferrer"><img src="${badgeUrl}" alt="Featured on Findry AI" width="220" height="54" /></a>`;
  const markdownCode = `[![${itemName} on Findry AI](${badgeUrl})](${itemUrl})`;

  const currentCode = selectedFormat === "html" ? htmlCode : markdownCode;

  // 复制代码到剪贴板
  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-muted/50 border border-border/60 rounded-xl p-5 flex flex-col gap-4">
      {/* 头部标题与标识 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SparklesIcon className="size-4 text-indigo-500" />
          <h3 className="font-semibold text-sm">Featured Badge</h3>
        </div>
        <Badge variant="outline" className="text-xs text-muted-foreground">
          Embed Code
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Add this badge to the public website for {itemName} to qualify for
        priority review. Keep it there after publication. The badge must appear
        in the HTML of the submitted URL (such as a shared footer).
      </p>

      {/* 主题选择器（亮色 / 暗色 / 中性色） */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          Theme / 主题风格
        </span>
        <div className="grid grid-cols-3 gap-2 bg-background p-1 rounded-lg border border-border/50 text-xs">
          <button
            type="button"
            onClick={() => setSelectedTheme("dark")}
            className={`py-1.5 px-3 rounded-md transition-all font-medium flex items-center justify-center gap-1.5 ${
              selectedTheme === "dark"
                ? "bg-zinc-900 text-white shadow-sm ring-1 ring-zinc-700"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="size-2 rounded-full bg-zinc-950 border border-zinc-700" />
            Dark
          </button>
          <button
            type="button"
            onClick={() => setSelectedTheme("light")}
            className={`py-1.5 px-3 rounded-md transition-all font-medium flex items-center justify-center gap-1.5 ${
              selectedTheme === "light"
                ? "bg-zinc-100 text-zinc-900 shadow-sm ring-1 ring-zinc-300"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="size-2 rounded-full bg-white border border-zinc-300" />
            Light
          </button>
          <button
            type="button"
            onClick={() => setSelectedTheme("neutral")}
            className={`py-1.5 px-3 rounded-md transition-all font-medium flex items-center justify-center gap-1.5 ${
              selectedTheme === "neutral"
                ? "bg-zinc-800 text-zinc-100 shadow-sm ring-1 ring-zinc-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="size-2 rounded-full bg-zinc-700 border border-zinc-500" />
            Neutral
          </button>
        </div>
      </div>

      {/* 视觉预览区域 */}
      <div
        className={`flex justify-center items-center p-4 rounded-lg border transition-colors ${
          selectedTheme === "light"
            ? "bg-zinc-200/80 border-zinc-300"
            : selectedTheme === "neutral"
              ? "bg-zinc-900/90 border-zinc-700"
              : "bg-zinc-950 border-zinc-800"
        }`}
      >
        <Image
          src={badgeUrl}
          alt={`${itemName} featured on Findry AI`}
          width={220}
          height={54}
          unoptimized
          className="h-[46px] w-auto object-contain drop-shadow-sm"
        />
      </div>

      {/* 格式选择与复制代码 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-background p-0.5 rounded-md border border-border/50 text-xs">
            <button
              type="button"
              onClick={() => setSelectedFormat("html")}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedFormat === "html"
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              HTML
            </button>
            <button
              type="button"
              onClick={() => setSelectedFormat("markdown")}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedFormat === "markdown"
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Markdown
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs flex items-center gap-1 px-2.5"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <CheckIcon className="size-3 text-emerald-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <CopyIcon className="size-3" />
                <span>Copy Code</span>
              </>
            )}
          </Button>
        </div>

        <div className="relative">
          <pre className="text-[11px] font-mono bg-zinc-950 text-zinc-300 p-2.5 rounded-md overflow-x-auto whitespace-pre-wrap break-all border border-zinc-800 select-all">
            {currentCode}
          </pre>
        </div>
      </div>
    </div>
  );
}
