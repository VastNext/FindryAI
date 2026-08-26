# Translator Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a native Findry AI `/translator` page that compares Google, Bing, Agnes 2.0, and Agnes 2.5 translations without modifying the source translator repository.

**Architecture:** Copy the source project's translation domain into an isolated `src/lib/translation/` module and expose it through the existing Next.js application's `POST /api/translate` Route Handler. Build a Findry-themed client workbench under `src/components/translator/`, then connect it to a public page, metadata, and navigation entries. Preserve provider-level requests and failure isolation while replacing source-project branding and CSS with existing Tailwind tokens and shadcn/ui components.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS 3, shadcn/ui, Lucide icons, Biome.

---

### Task 1: Port the translation domain and API

**Files:**
- Create: `src/lib/translation/languages.ts`
- Create: `src/lib/translation/types.ts`
- Create: `src/lib/translation/provider.ts`
- Create: `src/lib/translation/validation.ts`
- Create: `src/lib/translation/translate.ts`
- Create: `src/lib/translation/registry.ts`
- Create: `src/lib/translation/providers/google-web.ts`
- Create: `src/lib/translation/providers/bing-web.ts`
- Create: `src/lib/translation/providers/agnes.ts`
- Create: `src/app/api/translate/route.ts`

**Step 1: Copy and narrow domain types**

Copy the source domain files, remove Azure from `providerIds` and the Registry, and translate language labels and all user-facing validation/provider errors to English. Keep provider implementation behavior unchanged except for formatting required by Biome, including Agnes without an application-level timeout.

**Step 2: Add the Route Handler**

Expose `POST /api/translate`, validate JSON, return independent provider results, map aborts to status 499, invalid requests to 400/413, and unknown failures to 500. Keep `runtime = "nodejs"` and `maxDuration = 40`.

**Step 3: Run static verification**

Run: `pnpm lint`

Expected: Biome reports no errors in the new translation domain and API files.

**Step 4: Commit**

```bash
git add src/lib/translation src/app/api/translate/route.ts
git commit -m "feat(translator): add translation API"
```

### Task 2: Build the Findry-themed translation workbench

**Files:**
- Create: `src/components/translator/translator-workbench.tsx`

**Step 1: Port the client state machine**

Preserve the source workbench's per-provider slots, request cancellation, stale-result detection, provider and layout local-storage synchronization, copy feedback, result collapse, and `Ctrl/⌘ + Enter` shortcut. Change fetch target to the native `/api/translate` endpoint and retain one request per Provider.

**Step 2: Rebuild the markup with the existing design system**

Use existing `Button`, `Textarea`, and `Select` primitives plus Lucide icons. Use semantic sections, labels, fieldsets, status text, accessible names, visible focus states, and existing Tailwind color/radius tokens. Do not copy source-project global CSS, top bar, footer, or branding.

Required states:

- Empty input and disabled actions
- Provider selected/unselected
- Idle, pending, success, error, stale, and collapsed results
- Copy success/failure feedback
- Stacked and side-by-side desktop layouts
- Forced stacked layout at 900px and below

**Step 3: Run static verification**

Run: `pnpm lint`

Expected: Biome reports no errors in the workbench or existing files.

**Step 4: Commit**

```bash
git add src/components/translator/translator-workbench.tsx
git commit -m "feat(translator): add translation workbench"
```

### Task 3: Add the public page, metadata, and discovery links

**Files:**
- Create: `src/app/(website)/(public)/translator/page.tsx`
- Modify: `.env.example`
- Modify: `src/app/sitemap.ts`
- Modify: `src/config/marketing.ts`
- Modify: `src/config/footer.ts`
- Modify: `src/components/icons/icons.tsx`

**Step 1: Add the public page**

Create a server page with `constructMetadata` using title `Translator`, an English description, and canonical URL `${siteConfig.url}/translator`. Render an `HeaderSection` followed by the client workbench and a short disclosure that selected text is sent to third-party services and Google/Bing web interfaces may change or be rate limited.

**Step 2: Add navigation entries**

Add `Translator` after `Search` in the marketing navigation and Product footer group. Add a `LanguagesIcon`-backed `translator` entry to the shared icon map for mobile navigation. Add `/translator` to the sitemap and document the optional server-only `AGNES_API_KEY` in `.env.example`.

**Step 3: Run production checks**

Run: `pnpm lint`

Expected: PASS.

Run: `pnpm build`

Expected: Next.js production build succeeds and lists `/translator` plus `/api/translate`.

**Step 4: Commit**

```bash
git add "src/app/(website)/(public)/translator/page.tsx" src/config/marketing.ts src/config/footer.ts src/components/icons/icons.tsx
git commit -m "feat(translator): publish translator page"
```

### Task 4: Verify behavior, visual integration, and source immutability

**Files:**
- Modify only files that require fixes discovered by verification.

**Step 1: Start the development server**

Run: `pnpm dev`

Expected: Findry AI starts locally without compile errors.

**Step 2: Verify desktop behavior**

Open `/translator` at a desktop viewport and verify:

- Navbar and Footer match the rest of Findry AI.
- Google and Bing are selected by default; Agnes models are optional.
- Language swap is disabled while source is Auto Detect and works for explicit languages.
- Batch and per-provider translation work independently.
- Success can be copied, collapsed, and retranslated.
- Provider failures remain isolated and are retryable.
- Editing input/languages after a result marks it stale.
- Stacked/side-by-side preference persists after reload.
- Provider preference persists after reload.
- `Ctrl/⌘ + Enter` triggers translation.

**Step 3: Verify mobile behavior**

Open `/translator` below 900px and verify stacked layout, readable controls, no horizontal overflow, usable mobile navigation, and touch-friendly actions.

**Step 4: Capture a screenshot and fix glaring visual issues**

Capture the completed desktop page. Compare typography, spacing, border radius, colors, Navbar, and Footer with `/blog`. Make one correction pass for any obvious mismatch.

**Step 5: Verify source repository immutability**

Run in `D:\WorkDev\MyShare\vast-translator`:

```bash
git status --short
git rev-parse HEAD
```

Expected: no status output and HEAD equals `59fa5ee3797288db0931b5e80791dc9bad228f4d`.

**Step 6: Run final checks**

Run: `pnpm lint && pnpm build`

Expected: both commands succeed.

### Task 5: Review and ship

**Files:**
- Review all files changed since commit `86a9185`.

**Step 1: Review scope and quality**

Inspect `git status`, `git diff`, and recent commits. Confirm `.ebuilder.state.json` remains untracked and excluded. Review the implementation for correctness, accessibility, project standards, test gaps, and unnecessary complexity. Fix confirmed findings and rerun `pnpm lint && pnpm build`.

**Step 2: Commit verification fixes if needed**

Stage only task-related files and create a conventional commit that describes the complete fix. Do not amend existing commits.

**Step 3: Push the current branch**

Run:

```bash
git push -u origin clone-vast-translator-translator-subpage
```

Expected: the branch is pushed successfully and tracks the remote branch.
