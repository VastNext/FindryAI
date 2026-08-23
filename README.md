# Findry AI

Find better AI.

[![License](https://img.shields.io/github/license/VastNext/FindryAI)](LICENSE)

Findry AI is a curated AI tools directory for discovering useful products,
exploring categories, and comparing options in one place.

[Website](https://findryai.com) · [VastNext](https://vastnext.com)

![Findry AI](public/og.png)

## Features

- AI tool listings, categories, collections, tags, and search
- AI-assisted submissions and content generation
- User authentication and dashboard
- Free, paid, and sponsored submissions with Stripe
- Sanity CMS and blog
- Transactional email with Resend
- SEO, analytics, themes, and responsive layouts
- Tag-triggered production deployment to Vercel

## Tech Stack

- [Next.js](https://nextjs.org) — Full-stack React framework
- [React](https://react.dev) — User interface library
- [TypeScript](https://www.typescriptlang.org) — Typed JavaScript
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS framework
- [Sanity](https://www.sanity.io) — Content management system
- [Auth.js](https://authjs.dev) — Authentication and sessions
- [Stripe](https://stripe.com) — Payments
- [Resend](https://resend.com) — Transactional email
- [Vercel](https://vercel.com) — Hosting and deployment

## Development

Install dependencies and start the local server:

```bash
pnpm install
pnpm dev
```

Run the read-only checks and production build:

```bash
pnpm lint
pnpm build
```

Copy `.env.example` to `.env` and configure the required Sanity, Auth.js,
Stripe, Resend, and AI provider credentials before using integrated features.

## Deployment

Production deployments run through GitHub Actions when a `v*` tag is pushed:

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

## Upstream

Findry AI was built from the open-source
[Mkdirs](https://github.com/MkThingsHQ/mkdirs) directory template and has since
been customized for the Findry AI product and VastNext brand. Upstream names,
logos, and trademarks remain the property of their respective owners.

## License

Licensed under the [Apache License 2.0](LICENSE). You may use, modify, and
distribute the code, including for commercial purposes, subject to the terms
of the license.
