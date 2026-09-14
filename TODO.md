# 待办事项 (TODO)

## 商业化与支付 (Monetization & Payments)
- [ ] **Stripe 后台配置促销码 `FAZIER20`**
  - **背景**：已在 Fazier 提交页面登记了 20% OFF 的专属 Offer。项目代码 `src/actions/create-checkout-session.ts` 中已开启 `allow_promotion_codes: true`，结算页面自带优惠券输入框。
  - **操作步骤**：
    1. 登录 [Stripe Dashboard](https://dashboard.stripe.com/)。
    2. 进入 **Product catalog (产品目录)** -> **Coupons (优惠券)**。
    3. 点击 **+ New**：
       - Name: `Fazier Launch Special`
       - Type: `Percentage discount` (20%)
       - Duration: `Once` 或 `Forever`
    4. 勾选 **Use customer-facing promotion codes**，设置代码为：`FAZIER20`。
    5. 保存生效。
