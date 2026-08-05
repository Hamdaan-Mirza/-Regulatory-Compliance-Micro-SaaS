# -Regulatory-Compliance-Micro-SaaS
```
-Regulatory-Compliance-Micro-SaaS
├─ README.md
├─ apps
│  ├─ api
│  │  ├─ api
│  │  │  └─ upload.ts
│  │  └─ package.json
│  └─ web
│     └─ package.json
├─ package.json
├─ packages
│  ├─ db
│  │  ├─ package.json
│  │  └─ src
│  │     └─ index.ts
│  └─ types
│     ├─ package.json
│     ├─ src
│     │  └─ index.ts
│     └─ tsconfig.json
├─ pnpm-workspace.yaml
└─ turbo.json

```


# Install pnpm if you don't have it
npm install -g pnpm

# Install Supabase CLI (for migrations/local dev)
npm install -g supabase

# Install Cloudflare's Wrangler CLI globally is optional — it's already a devDependency
# in apps/web and apps/api, so `pnpm wrangler ...` works without a global install

# From repo root — installs everything for every app/package
pnpm install

# Add a dependency to a specific package (never cd in and run npm/yarn)
pnpm --filter @complystack/web add zod
pnpm --filter @complystack/api add hono
pnpm --filter @complystack/types add -D typescript

# Add a dependency to the root (rare — tooling like turbo, eslint configs)
pnpm add -w -D eslint

# Update all dependencies
pnpm update -r

# Check for outdated packages
pnpm outdated -r

# DEVELOPMENT 
# Run everything at once (web + api dev servers in parallel, via Turborepo)
pnpm dev

# Run just one app
pnpm --filter @complystack/web dev
pnpm --filter @complystack/api dev

# Type-check everything
pnpm type-check

# Lint everything
pnpm lint

# Test everything
pnpm test

# Run tests with UI or coverage (once vitest is setup)
pnpm turbo run test

# Type-check or lint just one package
pnpm --filter @complystack/types type-check

# Building and Deploying cloudflare pages
cd apps/web

# Build for Cloudflare Pages
pnpm build
pnpm pages:build

# Preview the Cloudflare build locally before deploying
pnpm preview

# Deploy to Cloudflare Pages
pnpm deploy

# Or, from root using filters:
pnpm --filter @complystack/web build
pnpm --filter @complystack/web deploy

# Building & deploying the backend (Cloudflare Workers)

cd apps/api

# Run the Worker locally
pnpm dev
# (equivalent to: wrangler dev)

# Log in to Cloudflare (once, or after token expiry)
pnpm exec wrangler login

# Set a secret (service role key — do this once per environment)
pnpm exec wrangler secret put SUPABASE_SERVICE_ROLE_KEY

# List currently set secrets (names only, not values)
pnpm exec wrangler secret list

# Deploy to production
pnpm deploy
# (equivalent to: wrangler deploy)

# Deploy to a specific environment defined in wrangler.toml
pnpm exec wrangler deploy --env staging

# Tail live logs from the deployed Worker
pnpm exec wrangler tail

# Supabase (local dev, migrations, types)

# Link your local project to your Supabase project (once)
supabase login
supabase link --project-ref your-project-ref

# Start local Supabase stack (Postgres, Auth, Storage emulated locally)
supabase start

# Stop it
supabase stop

# Create a new migration file
supabase migration new add_compliance_documents_table

# Apply migrations to your local DB
supabase db reset

# Push local migrations to your remote (hosted) Supabase project
supabase db push

# Pull the remote schema down as a migration (if you changed something in the dashboard)
supabase db pull

# Generate TypeScript types directly from your live schema
# (useful to cross-check against packages/types/src/index.ts by hand)
supabase gen types typescript --project-id your-project-ref > supabase.types.ts

# Turborepo-specific

# Run any task across all packages that define it
pnpm turbo run build
pnpm turbo run lint

# Run a task only for packages that changed since a git ref (fast CI checks)
pnpm turbo run build --filter=...[origin/main]

# Clear the local Turborepo cache if something seems stale/wrong
pnpm turbo run build --force
rm -rf .turbo apps/*/.turbo packages/*/.turbo

# Cleaning up when somethings broken

# Nuke all node_modules and reinstall from scratch
pnpm clean
pnpm install

# If pnpm itself seems confused about the workspace
rm -rf node_modules apps/*/node_modules packages/*/node_modules pnpm-lock.yaml
pnpm install

