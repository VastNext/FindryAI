import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

/**
 * Stripe 初始化脚本：创建/查找 Findry AI 的产品与价格，并打印需要配置的环境变量。
 *
 * 用法：
 *   1. 在 .env 中配置 STRIPE_API_KEY（sk_test_ 或 sk_live_ 均可，脚本会提示当前模式）
 *   2. npx tsx scripts/setup-stripe.ts
 *   3. 按输出把 NEXT_PUBLIC_STRIPE_PRO_PRICE_ID / NEXT_PUBLIC_STRIPE_SPONSOR_PRICE_ID
 *      写入 .env（本地）与 Vercel 项目环境变量（Preview/Production）
 *
 * 幂等：通过 price lookup_key 查找，已存在则直接复用，不会重复建价。
 * 注意：改价时 Stripe 不允许原地修改，需要新建 price 并迁移 lookup_key。
 */

const PRODUCTS = [
  {
    name: "Findry AI Pro Featured",
    description:
      "Featured placement & expedited review for one AI tool listing",
    lookupKey: "findry-pro-featured",
    unitAmount: 19_90, // $19.90 一次性（早鸟价；恢复原价时改为 2900 并新建 price）
    recurring: null,
  },
  {
    name: "Findry AI Sponsor",
    description: "Site-wide sponsor banner, monthly subscription",
    lookupKey: "findry-sponsor-monthly",
    unitAmount: 99_00, // $99 / 月，订阅
    recurring: { interval: "month" as const },
  },
];

async function main() {
  const apiKey = process.env.STRIPE_API_KEY;
  if (!apiKey) {
    console.error(
      "错误: 缺少 STRIPE_API_KEY，请先在 .env 中配置（Stripe Dashboard → Developers → API keys）。",
    );
    process.exit(1);
  }

  const stripe = new Stripe(apiKey, { apiVersion: "2024-04-10" });
  const mode = apiKey.startsWith("sk_test_") ? "TEST" : "LIVE";
  console.log(`当前 Stripe 模式: ${mode}`);

  const priceIds: Record<string, string> = {};

  for (const spec of PRODUCTS) {
    const existing = await stripe.prices.list({
      lookup_keys: [spec.lookupKey],
      expand: ["data.product"],
    });

    if (existing.data.length > 0) {
      const price = existing.data[0];
      priceIds[spec.lookupKey] = price.id;
      console.log(`\n✔ 已存在，复用: ${spec.name}`);
      console.log(`  price id: ${price.id}`);
      continue;
    }

    const product = await stripe.products.create({
      name: spec.name,
      description: spec.description,
      tax_code: "txcd_10501000", // Advertising / Digital Marketing Services
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
    console.log(`\n✔ 已创建: ${spec.name} (product ${product.id})`);
    console.log(`  price id: ${price.id}`);
    console.log(
      `  金额: $${(spec.unitAmount / 100).toFixed(2)}${spec.recurring ? ` / ${spec.recurring.interval}` : " 一次性"}`,
    );
  }

  console.log("\n—— 请将以下变量写入 .env 与 Vercel 项目环境变量 ——");
  console.log("# 已有: STRIPE_API_KEY");
  console.log(
    "# 待补: STRIPE_WEBHOOK_SECRET（Stripe Dashboard → Developers → Webhooks，生产端点 https://findryai.com/api/webhook，事件至少勾选 checkout.session.completed）",
  );
  console.log(
    `# NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=${priceIds["findry-pro-featured"]}（一次性 $19.90）`,
  );
  console.log(
    `# NEXT_PUBLIC_STRIPE_SPONSOR_PRICE_ID=${priceIds["findry-sponsor-monthly"]}（订阅 $99/月）`,
  );
  console.log(
    "\n提示: 本地联调时运行 stripe listen --forward-to localhost:3000/api/webhook，把输出的 whsec_ 配到 STRIPE_WEBHOOK_SECRET",
  );
}

main();
