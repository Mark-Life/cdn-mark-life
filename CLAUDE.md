# CDN Mark Life

CDN and file management platform using AWS S3 + CloudFront with Convex backend.

## Architecture

- **Frontend**: Vite + React SPA deployed to S3/CloudFront (`cdn.mark-life.com`)
- **Backend**: Convex (real-time DB, auth via WorkOS, file metadata)
- **Storage**: AWS S3 with account-based prefix isolation (`{accountSlug}/...`)
- **CDN**: CloudFront distribution for media files (`static.mark-life.com`)
- **Infrastructure**: Terraform (S3, CloudFront, Route 53, ACM, IAM)
- **Auth**: WorkOS via Convex AuthKit component

## Monorepo Structure

- `apps/web` — Vite + React SPA
- `apps/convex` — Convex backend functions
- `packages/ui` — Shared shadcn/ui component library
- `packages/env` — Environment variable validation (Zod)
- `packages/typescript-config` — Shared TypeScript config
- `infrastructure/terraform` — AWS infrastructure

## Code Standards

This project uses **Ultracite** (Biome-based) for linting and formatting.

- **Format code**: `bun x ultracite fix`
- **Check for issues**: `bun x ultracite check`

## Commands

- `bun run dev` — Start all apps in dev mode
- `bun run build` — Build all apps
- `bun run check` — Lint check
- `bun run fix` — Auto-fix lint issues
