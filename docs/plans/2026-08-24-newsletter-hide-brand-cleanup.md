# Newsletter Hide And Brand Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Hide newsletter signup UI while preserving the backend capability, and replace current Mkdirs branding with Findry AI.

**Architecture:** Remove the shared newsletter card from route layouts without deleting subscription code. Update current-facing brand strings and examples in focused groups, while explicitly preserving historical reports and necessary upstream attribution.

**Tech Stack:** Next.js 14, React, React Email, Resend, TypeScript, Biome, pnpm.

---

### Task 1: Hide Newsletter UI

**Files:**
- Modify all layouts importing `NewsletterCard` under `src/app/(website)/(public)/`.

1. Remove `NewsletterCard` imports and JSX usage.
2. Search for remaining layout usage; expect only the component definition.
3. Run focused Biome checks.
4. Commit as `feat(newsletter): hide signup cards from public pages`.

### Task 2: Clean Runtime And Email Branding

**Files:**
- Modify email templates under `emails/`.
- Modify current runtime/config/script examples found by the brand audit.

1. Replace user-facing Mkdirs labels with `Findry AI`.
2. Replace current/example `mkdirs.com` URLs with `findryai.com`.
3. Replace default email addresses with `support@findryai.com`.
4. Preserve historical reports and upstream attribution.
5. Run focused Biome checks.
6. Commit as `fix(brand): remove remaining Mkdirs product references`.

### Task 3: Brand README

**Files:**
- Modify: `README.md`
- Modify: `.github/ISSUE_TEMPLATE/config.yml`
- Modify: `package.json`
- Modify: `AGENTS.md`
- Modify: `CLAUDE.md`

1. Rewrite active project identity and links for Findry AI.
2. Preserve Apache license and an explicit upstream-source acknowledgement.
3. Verify links and remaining brand occurrences.
4. Commit as `docs: align repository identity with Findry AI`.

### Task 4: Verify And Deploy

1. Run the allowlisted global brand audit.
2. Run `pnpm build`.
3. Push `main`.
4. Create and push the next `v*` tag.
5. Verify the GitHub Actions run succeeds and production HTML does not render newsletter signup content.
