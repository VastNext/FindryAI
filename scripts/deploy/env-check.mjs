#!/usr/bin/env node
// 环境变量阶段检查：只输出变量名与存在性，不输出值。
// 退出码 0=PASS / 20=BLOCKED。
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const manifestPath =
  process.env.ENV_MANIFEST || join(root, "config", "env-manifest.json");

function arg(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 && process.argv[index + 1]
    ? process.argv[index + 1]
    : fallback;
}

const phase = arg("phase", process.env.ENV_PHASE || "runtime");
const environment = arg(
  "environment",
  process.env.ENV_ENVIRONMENT || "production",
);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const entries = Object.entries(manifest.entries).filter(([, spec]) => {
  if (phase === "build") return spec.phase === "build" || spec.phase === "both";
  return spec.phase === "runtime" || spec.phase === "both";
});

const missingRequired = [];
const missingOptional = [];
const invalid = [];
const checks = [];

for (const [name, spec] of entries) {
  const value = process.env[name];
  const present = typeof value === "string" && value.length > 0;
  const required = (spec.required_in || []).includes(environment);
  if (!present) {
    (required ? missingRequired : missingOptional).push(name);
    checks.push({ name, required, present: false });
    continue;
  }
  let valid = true;
  if (spec.validation === "url") {
    try {
      const url = new URL(value);
      valid = url.protocol === "https:" || url.protocol === "http:";
    } catch {
      valid = false;
    }
  } else if (spec.validation === "sanity-id") {
    valid = /^[a-z0-9-]{6,}$/i.test(value);
  } else if (spec.validation === "stripe-price") {
    valid = /^price_[A-Za-z0-9]+$/.test(value);
  } else if (spec.validation === "stripe-key") {
    valid = /^(sk|rk)_(test|live)_/.test(value);
  } else if (spec.validation === "stripe-webhook") {
    valid = /^whsec_/.test(value);
  } else if (spec.validation === "boolean") {
    valid = /^(0|1|true|false)$/i.test(value);
  } else if (spec.validation === "enum") {
    valid = /^(google|deepseek|openai|xai|openrouter)$/.test(value);
  }
  if (!valid) invalid.push(name);
  checks.push({ name, required, present: true, valid });
}

const result = {
  schema_version: 1,
  phase,
  environment,
  status: missingRequired.length || invalid.length ? "BLOCKED" : "PASS",
  missing_required: missingRequired,
  missing_optional: missingOptional,
  invalid,
  checks,
};
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
process.exitCode = result.status === "PASS" ? 0 : 20;
