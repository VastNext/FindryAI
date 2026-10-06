import assert from "node:assert/strict";
import test from "node:test";
import { classifyBadgeResponse, hasBadge } from "./badge-verification";

const site = new URL("https://product.example/");

test("识别三种有效徽章及旧版默认徽章", () => {
  for (const name of [
    "badge.svg",
    "badge-dark.svg",
    "badge-light.svg",
    "badge-neutral.svg",
  ]) {
    assert.equal(
      hasBadge(
        `<a href="https://findryai.com/item/demo"><img src="https://findryai.com/${name}" /></a>`,
        site,
      ),
      true,
    );
  }
});

test("反链和徽章必须属于同一个链接", () => {
  assert.equal(
    hasBadge(
      '<a href="https://findryai.com"><span>Findry</span></a><img src="https://findryai.com/badge.svg">',
      site,
    ),
    false,
  );
  assert.equal(
    hasBadge(
      '<a href="https://findryai.com.evil.test"><img src="https://findryai.com/badge.svg"></a>',
      site,
    ),
    false,
  );
  assert.equal(
    hasBadge(
      '<a href="https://findryai.com"><img src="https://evil.test/badge.svg"></a>',
      site,
    ),
    false,
  );
});

test("网络/服务器异常不得当作撤下徽章", () => {
  assert.equal(
    classifyBadgeResponse(503, "text/html", "", site).status,
    "unavailable",
  );
  assert.equal(
    classifyBadgeResponse(200, "text/html", "<p>未放徽章</p>", site).status,
    "missing",
  );
  assert.equal(
    classifyBadgeResponse(
      200,
      "text/html",
      "<title>Just a moment...</title>",
      site,
    ).status,
    "unavailable",
  );
});

test("隐藏元素不能获得徽章资格", () => {
  assert.equal(
    hasBadge(
      '<div hidden><a href="https://findryai.com"><img src="https://findryai.com/badge.svg"></a></div>',
      site,
    ),
    false,
  );
  assert.equal(
    hasBadge(
      '<a href="https://findryai.com" style="display:none"><img src="https://findryai.com/badge.svg"></a>',
      site,
    ),
    false,
  );
  assert.equal(
    hasBadge(
      '<template><a href="https://findryai.com"><img src="https://findryai.com/badge.svg"></a></template>',
      site,
    ),
    false,
  );
  assert.equal(
    hasBadge(
      '<a href="https://findryai.com"><span hidden><img src="https://findryai.com/badge.svg"></span></a>',
      site,
    ),
    false,
  );
});
