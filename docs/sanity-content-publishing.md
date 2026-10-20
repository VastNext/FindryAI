# Sanity content publishing from GitHub Actions

`Publish Sanity content` runs a read-only credential and authenticated Sanity read check when this workflow or publisher is changed. This check never creates a document. Read access alone does not prove that the token permits writes.

## Credentials

Configure under **Settings → Secrets and variables → Actions**, never in source files, manifests, workflow inputs, artifacts, or chat:

- Variables or Secrets: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`.
- Secrets: `SANITY_API_TOKEN` (Sanity token with content write permission).
- Secret: `REVALIDATE_SECRET` if configured on the production site; otherwise `AUTH_SECRET` if production uses it. Only if neither is configured does the site fall back to `SANITY_API_TOKEN`.

The runner first uses GitHub-injected configuration. It can also reuse the existing `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, and `VERCEL_ORG_ID` to resolve only the five allowlisted production variables. Values are held in runner memory and masked; no environment file or credential artifact is created. Sensitive Vercel variables cannot be retrieved and must be supplied separately as Actions Secrets. A GitHub environment-scoped secret requires configuring the job's environment explicitly; this workflow uses repository/organization configuration.

Secrets settings: https://github.com/VastNext/FindryAI/settings/secrets/actions

Variables settings: https://github.com/VastNext/FindryAI/settings/variables/actions

## Content delivery

The assistant researches content and commits a **non-secret content manifest** at `content/publish/<unique-batch>.json` on `main`. The push triggers this workflow. These are content delivery commits; they neither change site code nor create a release tag. No deployment is needed. The current GitHub connector has no workflow-dispatch operation, so a content-only commit is the available automatic trigger; a GitHub operator may alternatively use **Run workflow** with an existing manifest path.

Manifest format: `{"version":1,"documents":[...]}`. Each run accepts at most three `item` or `blogPost` documents matching the current schemas. Items require `name`, `slug.current`, `link`, `description`, and Markdown `introduction`; posts require `title`, `slug.current`, `excerpt`, Portable Text `body`, and a valid existing `author` reference. Optional category/tag/image references must already exist in the dataset. No secrets belong in a manifest. Prepare complete, fact-checked content, source attribution, internal links, images, and taxonomy before enqueueing it.

The publisher checks existing slugs, item links, and drafts. It only creates missing documents using deterministic IDs and `createIfNotExists`; it never replaces existing CMS content. Updating existing articles requires a separate explicit update workflow. Duplicate coverage is skipped. All queries bypass the CDN.

Before creating content, cache authorization is checked. After creation the runner verifies the published document, refreshes caches, and checks the public page HTTP status. Non-2xx visibility is a failed run even if the document already exists; rerunning retries refresh/verification without recreating or overwriting content. HTTP success is a smoke check, not a full rendered-content audit. Check the workflow summary and inspect the live content before reporting success.

Do not resume the daily automation until the read-only preflight passes. For content publication, inspect the matching Actions run and report Sanity document IDs and public URLs; never claim success based only on a commit.
