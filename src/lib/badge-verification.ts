import { Resolver } from "node:dns/promises";
import http from "node:http";
import https from "node:https";
import { isIP } from "node:net";
import { parseDocument } from "htmlparser2";

export type BadgeCheck = {
  status: "verified" | "missing" | "unavailable";
  message: string;
};

// 仅将成功读取的 HTML 判为「缺失」，站点/网络/内容类型异常均为「不可用」。
export function classifyBadgeResponse(
  status: number,
  contentType: string,
  html: string,
  page: URL,
): BadgeCheck {
  if (status !== 200 || !contentType.toLowerCase().includes("text/html")) {
    return { status: "unavailable", message: "站点未返回可验证的 HTML 页面" };
  }
  if (
    /<title[^>]*>[^<]*(?:captcha|just a moment|checking your browser|access denied)[^<]*<\/title>/i.test(
      html,
    )
  ) {
    return { status: "unavailable", message: "站点返回访问验证页面" };
  }
  return hasBadge(html, page)
    ? { status: "verified", message: "徽章验证成功" }
    : { status: "missing", message: "页面中未找到有效的 Findry AI 徽章" };
}

const MAX_BYTES = 1024 * 1024;
const TIMEOUT_MS = 8000;

function publicAddress(address: string) {
  if (isIP(address) === 4) {
    const [a, b, c] = address.split(".").map(Number);
    return !(
      a === 0 ||
      a === 10 ||
      a === 127 ||
      a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 192 && b === 0) ||
      (a === 198 && b >= 18 && b <= 19) ||
      (a === 198 && b === 51 && c === 100) ||
      (a === 203 && b === 0 && c === 113)
    );
  }
  // 仅连接公网 IPv4，避免 IPv6 特殊地址段及 IPv4 映射地址绕过过滤。
  return false;
}

function badgeInHtml(html: string, page: URL) {
  const document = parseDocument(html);
  const visible = (node: (typeof document.children)[number]) => {
    const attrs = "attribs" in node ? node.attribs : {};
    return !(
      "hidden" in attrs ||
      attrs["aria-hidden"] === "true" ||
      /(?:display\s*:\s*none|visibility\s*:\s*hidden)/i.test(attrs.style || "")
    );
  };
  const visit = (
    nodes: typeof document.children,
    parentVisible = true,
  ): boolean => {
    for (const node of nodes) {
      const currentVisible = parentVisible && visible(node);
      if (
        !currentVisible ||
        ("name" in node &&
          (node.name === "template" || node.name === "noscript"))
      )
        continue;
      if (node.type === "tag" && node.name === "a" && node.attribs?.href) {
        try {
          const href = new URL(node.attribs.href, page);
          if (
            href.protocol === "https:" &&
            href.hostname === "findryai.com" &&
            href.port === "" &&
            (href.pathname === "/" || href.pathname.startsWith("/item/"))
          ) {
            const findImage = (children: typeof document.children): boolean =>
              children.some((child) => {
                if (
                  child.type === "tag" &&
                  child.name === "img" &&
                  child.attribs?.src &&
                  visible(child)
                ) {
                  try {
                    const src = new URL(child.attribs.src, page);
                    return (
                      src.protocol === "https:" &&
                      src.hostname === "findryai.com" &&
                      src.port === "" &&
                      [
                        "/badge.svg",
                        "/badge-dark.svg",
                        "/badge-light.svg",
                        "/badge-neutral.svg",
                      ].includes(src.pathname)
                    );
                  } catch {
                    return false;
                  }
                }
                return visible(child) && "children" in child && child.children
                  ? findImage(child.children)
                  : false;
              });
            if ("children" in node && node.children && findImage(node.children))
              return true;
          }
        } catch {
          /* 忽略无效链接。 */
        }
      }
      if (
        "children" in node &&
        node.children &&
        visit(node.children, currentVisible)
      )
        return true;
    }
    return false;
  };
  return visit(document.children);
}

export function hasBadge(html: string, page: URL): boolean {
  return badgeInHtml(html, page);
}

export async function checkBadge(
  link: string,
  redirects = 0,
): Promise<BadgeCheck> {
  let url: URL;
  try {
    url = new URL(link);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      !url.hostname ||
      url.username ||
      url.password ||
      url.port !== "" ||
      isIP(url.hostname)
    ) {
      return { status: "unavailable", message: "站点地址不是允许的公网网址" };
    }
    const resolver = new Resolver();
    const addresses = await Promise.race([
      resolver.resolve4(url.hostname),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("DNS 超时")), TIMEOUT_MS),
      ),
    ]);
    if (
      !addresses.length ||
      addresses.some((address) => !publicAddress(address))
    ) {
      return { status: "unavailable", message: "站点地址解析到非公网地址" };
    }
    // 固定经校验的 IP，避免连接时二次 DNS 查询造成重绑定。
    const address = addresses[0];
    return await new Promise<BadgeCheck>((resolve) => {
      let settled = false;
      const finish = (result: BadgeCheck) => {
        if (settled) return;
        settled = true;
        resolve(result);
      };
      const request = (url.protocol === "https:" ? https : http).get(
        url,
        {
          headers: {
            accept: "text/html",
            "accept-encoding": "identity",
            "user-agent": "FindryAI-BadgeCheck/1.0",
          },
          lookup: (_host, _options, callback) => callback(null, address, 4),
        },
        (response) => {
          if ([301, 302, 303, 307, 308].includes(response.statusCode || 0)) {
            response.resume();
            const location = response.headers.location;
            if (!location || redirects >= 3) {
              finish({ status: "unavailable", message: "站点重定向无法完成" });
              return;
            }
            try {
              const next = new URL(location, url);
              const base = url.hostname.replace(/^www\./, "");
              if (
                next.hostname.replace(/^www\./, "") !== base ||
                next.protocol !== "https:" ||
                next.port
              ) {
                finish({
                  status: "unavailable",
                  message: "站点跳转到了其他域名",
                });
                return;
              }
              void checkBadge(next.href, redirects + 1)
                .then(finish)
                .catch(() =>
                  finish({
                    status: "unavailable",
                    message: "站点跳转验证失败",
                  }),
                );
            } catch {
              finish({ status: "unavailable", message: "无效的站点跳转地址" });
            }
            return;
          }
          if (
            response.statusCode !== 200 ||
            !response.headers["content-type"]
              ?.toLowerCase()
              .includes("text/html")
          ) {
            response.resume();
            finish({
              status: "unavailable",
              message: "站点未返回可验证的 HTML 页面",
            });
            return;
          }
          const chunks: Buffer[] = [];
          let size = 0;
          response.on("data", (chunk: Buffer) => {
            size += chunk.length;
            if (size > MAX_BYTES) {
              request.destroy();
              finish({
                status: "unavailable",
                message: "站点响应超过大小限制",
              });
            } else chunks.push(chunk);
          });
          response.on("end", () => {
            finish(
              classifyBadgeResponse(
                200,
                response.headers["content-type"] || "",
                Buffer.concat(chunks).toString("utf8"),
                url,
              ),
            );
          });
          response.on("error", () =>
            finish({ status: "unavailable", message: "读取站点内容失败" }),
          );
        },
      );
      const timer = setTimeout(
        () => request.destroy(new Error("请求超时")),
        TIMEOUT_MS,
      );
      request.on("close", () => clearTimeout(timer));
      request.on("error", () =>
        finish({ status: "unavailable", message: "站点暂时无法访问" }),
      );
    });
  } catch {
    return { status: "unavailable", message: "站点暂时无法访问" };
  }
}
