export type TweetFeedTab = "all" | "openclaw" | "hermes";

export type TweetFeedData = Record<TweetFeedTab, string[]>;

const MOGE_FEED_URL = "https://moge.ai/ai-daily-feeds";
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_HTML_BYTES = 2_000_000;
const MAX_CHUNK_BYTES = 2_000_000;
const MAX_ACTION_RESPONSE_BYTES = 500_000;
const MAX_SCRIPT_COUNT = 40;
const MAX_TWEETS_PER_TAB = 1_000;
const MIN_TWEETS_PER_TAB = 20;

function validateResponseSize(
  response: Response,
  maximum: number,
  label: string,
) {
  const contentLength = Number(response.headers.get("content-length") || 0);
  if (contentLength > maximum) {
    throw new Error(`${label} is too large: ${contentLength} bytes`);
  }
}

async function readTextWithLimit(
  response: Response,
  maximum: number,
  label: string,
) {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > maximum) {
      await reader.cancel();
      throw new Error(`${label} exceeded the ${maximum}-byte limit`);
    }
    text += decoder.decode(value, { stream: true });
  }
  return text + decoder.decode();
}

async function fetchText(url: string, maximum: number) {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137 Safari/537.36",
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    redirect: "manual",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  validateResponseSize(response, maximum, url);
  return readTextWithLimit(response, maximum, url);
}

function getScriptUrls(html: string) {
  const urls = Array.from(
    html.matchAll(/<script[^>]+src="([^"]+\.js)"/g),
    (match) => {
      const url = new URL(match[1], MOGE_FEED_URL);
      if (
        url.protocol !== "https:" ||
        url.hostname !== "moge.ai" ||
        !url.pathname.startsWith("/_next/static/chunks/")
      ) {
        return "";
      }
      return url.toString();
    },
  );
  return Array.from(new Set(urls.filter(Boolean))).slice(0, MAX_SCRIPT_COUNT);
}

async function discoverServerActionId(html: string) {
  const scriptUrls = getScriptUrls(html);
  if (scriptUrls.length === 0) {
    throw new Error("No JavaScript chunks were found on the MOGE feed page");
  }

  for (const scriptUrl of scriptUrls) {
    try {
      const chunk = await fetchText(scriptUrl, MAX_CHUNK_BYTES);
      if (!chunk.includes("getDirectoryTweets")) continue;
      const match = chunk.match(
        /([a-f0-9]{40,64})[\s\S]{0,300}getDirectoryTweets/,
      );
      if (match?.[1]) return match[1];
    } catch {
      // 单个无关分包失败时继续检查其他分包
    }
  }

  throw new Error("MOGE getDirectoryTweets Server Action was not found");
}

function parseActionResponse(responseText: string) {
  for (const line of responseText.split("\n")) {
    const separator = line.indexOf(":");
    if (separator < 1) continue;
    try {
      const payload = JSON.parse(line.slice(separator + 1)) as {
        data?: unknown;
      };
      if (Array.isArray(payload.data)) return payload.data;
    } catch {
      // React Flight 响应中包含其他记录，忽略不能直接解析的行
    }
  }
  throw new Error("MOGE Server Action response did not contain tweet IDs");
}

function validateTweetIds(value: unknown, tab: TweetFeedTab) {
  if (!Array.isArray(value)) {
    throw new Error(`MOGE ${tab} feed is not an array`);
  }
  const ids = Array.from(
    new Set(
      value.filter((id): id is string => {
        return typeof id === "string" && /^\d{15,25}$/.test(id);
      }),
    ),
  ).slice(0, MAX_TWEETS_PER_TAB);
  if (ids.length < MIN_TWEETS_PER_TAB) {
    throw new Error(`MOGE ${tab} feed only returned ${ids.length} valid IDs`);
  }
  return ids;
}

async function fetchTab(actionId: string, tab: TweetFeedTab) {
  const response = await fetch(MOGE_FEED_URL, {
    method: "POST",
    headers: {
      Accept: "text/x-component",
      "Content-Type": "text/plain;charset=UTF-8",
      "Next-Action": actionId,
      Origin: "https://moge.ai",
      Referer: MOGE_FEED_URL,
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137 Safari/537.36",
    },
    body: JSON.stringify([{ tab }]),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    redirect: "manual",
  });
  if (!response.ok) {
    const errorBody = (await response.text())
      .slice(0, 200)
      .replaceAll("\n", " ");
    throw new Error(
      `MOGE ${tab} action failed: ${response.status}; action=${actionId}; body=${errorBody}`,
    );
  }
  const responseText = await readTextWithLimit(
    response,
    MAX_ACTION_RESPONSE_BYTES,
    `MOGE ${tab} action response`,
  );
  return validateTweetIds(parseActionResponse(responseText), tab);
}

export async function fetchMogeTweetFeed(): Promise<TweetFeedData> {
  const html = await fetchText(MOGE_FEED_URL, MAX_HTML_BYTES);
  const actionId = await discoverServerActionId(html);
  // 顺序请求，避免上游 Cloudflare 将同源并发 Server Action 判为异常流量。
  const all = await fetchTab(actionId, "all");
  const openclaw = await fetchTab(actionId, "openclaw");
  const hermes = await fetchTab(actionId, "hermes");
  return { all, openclaw, hermes };
}
