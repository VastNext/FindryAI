# VastNext Footer And Safe Lint Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the legacy Mkdirs footer attribution with VastNext branding and make the default lint command read-only.

**Architecture:** Keep the existing footer button component and visual language, changing only its copy, destination, and icon asset. Prevent future accidental repository-wide rewrites by reserving `pnpm lint` for diagnostics and keeping mutations behind explicitly named fix/format commands.

**Tech Stack:** Next.js 14, React, Tailwind CSS, Biome, pnpm.

---

### Task 1: Make lint read-only

**Files:**
- Modify: `package.json`
- Modify: `AGENTS.md`

1. Change `lint` from `biome check --write .` to `biome check .`.
2. Update the command documentation to state that lint is read-only and that only `lint:fix` and `format` write files.
3. Run `pnpm lint` and compare `git status --short` before and after; expect no new modifications.
4. Commit the safety change separately.

### Task 2: Replace footer attribution

**Files:**
- Modify: `src/components/shared/built-with-button.tsx`
- Create: `public/brand/vastnext-mark.svg`

1. Copy VastNext's official `favicon.svg` into the local brand asset directory.
2. Change the footer destination to `https://vastnext.com`.
3. Change the attribution to `Built by VastNext` and use the VastNext mark with descriptive alt text.
4. Run focused Biome checks and a production build.
5. Commit the footer change separately.
6. Push `main`, create the next `v*` tag, and confirm GitHub Actions deploys the production site successfully.
