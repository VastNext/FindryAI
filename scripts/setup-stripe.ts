import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const PRODUCTS = [
  {
    name: "Findry AI Pro Featured",
    description:
      "Featured placement & expedited review for one AI tool listing",
    lookupKey: "findry-pro-featured",
    unitAmount: 19_90, // $19.90 一次性早鸟价
    recurring: null,
    taxCode: "txcd_10501000",
  },
  {
    name: "Findry AI Sponsor",
    description: "Site-wide sponsor banner, monthly subscription",
    lookupKey: "findry-sponsor-monthly",
    unitAmount: 99_00, // $99 / 月 订阅
    recurring: { interval: "month" as const },
    taxCode: "txcd_10501000",
  },
];

const WEBHOOK_URL = "https://findryai.com/api/webhook";

async function main() {
  const apiKey = process.env.STRIPE_API_KEY;
  if (!apiKey) {
    console.error("错误: 缺少 STRIPE_API_KEY，请先在 .env 中配置。");
    process.exit(1);
  }

  const stripe = new Stripe(apiKey, { apiVersion: "2024-04-10" });
  const mode = apiKey.startsWith("sk_test_") ? "TEST" : "LIVE";
  console.log(`========================================`);
  console.log(`🚀 开始执行 Stripe 自动化初始化 (${mode} 模式)`);
  console.log(`========================================\n`);

  // 1. 创建 / 复用产品与价格
  const priceIds: Record<string, string> = {};

  for (const spec of PRODUCTS) {
    const existing = await stripe.prices.list({
      lookup_keys: [spec.lookupKey],
      expand: ["data.product"],
    });

    if (existing.data.length > 0) {
      const price = existing.data[0];
      priceIds[spec.lookupKey] = price.id;
      console.log(`✔ 已存在产品与价格，自动复用: ${spec.name}`);
      console.log(`  Price ID: ${price.id}`);
      continue;
    }

    const product = await stripe.products.create({
      name: spec.name,
      description: spec.description,
      tax_code: spec.taxCode,
    });

    const price = await stripe.prices.create({
      product: product.id,
      currency: "usd",
      unit_amount: spec.unitAmount,
      lookup_key: spec.lookupKey,
      transfer_lookup_key: true,
      ...(spec.recurring ? { recurring: spec.recurring } : {}),
    });

    priceIds[spec.lookupKey] = price.id;
    console.log(`✔ 成功创建产品与价格: ${spec.name} (product: ${product.id})`);
    console.log(`  Price ID: ${price.id}`);
    console.log(
      `  金额: $${(spec.unitAmount / 100).toFixed(2)}${spec.recurring ? ` / ${spec.recurring.interval}` : " 一次性"}`,
    );
  }

  // 2. 自动检查或创建 Webhook 端点
  console.log(`\n----------------------------------------`);
  console.log(`🔗 正在配置 Webhook 端点 (${WEBHOOK_URL})...`);
  let webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  const existingWebhooks = await stripe.webhookEndpoints.list({ limit: 10 });
  const matchedWebhook = existingWebhooks.data.find(
    (w) => w.url === WEBHOOK_URL,
  );

  if (matchedWebhook) {
    console.log(`✔ Webhook 端点已存在: ${matchedWebhook.id}`);
    console.log(`  URL: ${matchedWebhook.url}`);
    console.log(`  Status: ${matchedWebhook.status}`);
  } else {
    const newWebhook = await stripe.webhookEndpoints.create({
      url: WEBHOOK_URL,
      enabled_events: [
        "checkout.session.completed",
      ],
      description: "Findry AI Production Webhook Handler",
    });

    console.log(`✔ 成功创建生产 Webhook 端点: ${newWebhook.id}`);
    console.log(`  URL: ${newWebhook.url}`);
    console.log(`  Signing Secret: ${newWebhook.secret}`);
    if (newWebhook.secret) {
      webhookSecret = newWebhook.secret;
    }
  }

  // 3. 自动回写到本地 .env
  console.log(`\n----------------------------------------`);
  console.log(`📝 正在自动回写变量到本地 .env 文件...`);
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf8");

    const proPriceId = priceIds["findry-pro-featured"];
    const sponsorPriceId = priceIds["findry-sponsor-monthly"];

    if (proPriceId) {
      if (/^NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=/m.test(envContent)) {
        envContent = envContent.replace(
          /^NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=.*$/m,
          `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=${proPriceId}`,
        );
      } else {
        envContent += `\nNEXT_PUBLIC_STRIPE_PRO_PRICE_ID=${proPriceId}\n`;
      }
    }

    if (sponsorPriceId) {
      if (/^NEXT_PUBLIC_STRIPE_SPONSOR_PRICE_ID=/m.test(envContent)) {
        envContent = envContent.replace(
          /^NEXT_PUBLIC_STRIPE_SPONSOR_PRICE_ID=.*$/m,
          `NEXT_PUBLIC_STRIPE_SPONSOR_PRICE_ID=${sponsorPriceId}`,
        );
      } else {
        envContent += `NEXT_PUBLIC_STRIPE_SPONSOR_PRICE_ID=${sponsorPriceId}\n`;
      }
    }

    if (webhookSecret) {
      if (/^STRIPE_WEBHOOK_SECRET=/m.test(envContent)) {
        envContent = envContent.replace(
          /^STRIPE_WEBHOOK_SECRET=.*$/m,
          `STRIPE_WEBHOOK_SECRET=${webhookSecret}`,
        );
      } else {
        envContent += `STRIPE_WEBHOOK_SECRET=${webhookSecret}\n`;
      }
    }

    fs.writeFileSync(envPath, envContent, "utf8");
    console.log(`✔ .env 文件更新成功！`);
  }

  console.log(`\n========================================`);
  console.log(`🎉 Stripe 生产环境配置全部就绪！`);
  console.log(`========================================`);
  console.log(`\n请将以下 4 个环境变量同步配置到 Vercel (Production 环境):`);
  console.log(`1. STRIPE_API_KEY`);
  console.log(`2. STRIPE_WEBHOOK_SECRET=${webhookSecret || "已存在"}`);
  console.log(`3. NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=${priceIds["findry-pro-featured"]}`);
  console.log(`4. NEXT_PUBLIC_STRIPE_SPONSOR_PRICE_ID=${priceIds["findry-sponsor-monthly"]}`);
}

main().catch((err) => {
  console.error("执行失败:", err);
  process.exit(1);
});
