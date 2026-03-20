# Frontend Plan — CDN Mark Life

## Current State

The backend is **fully functional** (auth, accounts, files, S3 presigned uploads, CloudFront invalidation) but the frontend is a **blank slate** — just a centered sign-in/sign-out button on a single route. 55 shadcn components are installed and ready. OKLCH color system is configured with light/dark theme support.

---

## Aesthetic Direction: Swiss Industrial File Manager

Clean, utilitarian, precise — inspired by Swiss design principles meets developer tooling. Think Linear/Vercel's density with Dieter Rams' restraint. Monospace accents for file paths and metadata, generous use of the existing blue primary for interactive elements, warm yellow secondary for highlights/selections.

**Typography**: `"DM Sans"` for UI, `"JetBrains Mono"` for file paths/metadata/code.

---

## Route Structure

```
/                → Dashboard (overview)
/files           → File browser (uses auto-resolved account)
/files?prefix=x  → File browser at specific prefix
```

---

## Build Order

### Phase 1 — App Shell & Auth Gate ✅

**Files to create/modify:**

- `apps/web/src/components/app-shell.tsx` — Sidebar layout using shadcn `Sidebar` + `SidebarProvider`
- `apps/web/src/components/auth-gate.tsx` — Wraps authenticated routes, shows sign-in for unauthenticated users
- Update `apps/web/src/app.tsx` — Add layout wrapper + route structure

**What it does:**

- Collapsible sidebar with: account name/slug display, navigation (Files, Settings)
- Top bar with user avatar, email, sign-out
- Uses shadcn: `Sidebar`, `Avatar`, `DropdownMenu`, `Separator`, `Button`, `Skeleton`

---

### Phase 2 — Account Provisioning & Context

Accounts are **tenants** — each authenticated user maps to one account. There is no user-facing account management UI. Instead, the system auto-provisions an account on first login and resolves it automatically.

**Backend changes needed:**

- Add `accountId` field to the `users` table (links user → account)
- In the `user.created` auth event, auto-create an account (slug derived from email/name) and link it to the new user
- Add a `accounts.getMyAccount` query that returns the current user's account

**Files to create/modify:**

- `apps/web/src/hooks/use-account.ts` — Hook that calls `accounts.getMyAccount`, provides account context to the app
- Update `apps/web/src/components/app-shell.tsx` — Remove account switcher from sidebar, show current account slug/name in sidebar header instead

**What it does:**

- On user registration, an account is auto-created and linked to the user
- The frontend resolves the current user's account automatically — no selection or switching needed
- All file operations use this account context implicitly
- Uses shadcn: `Skeleton` (loading state while account resolves)

---

### Phase 3 — File Browser (Core Feature)

**Files to create:**

- `apps/web/src/pages/files.tsx` — Main file browser page
- `apps/web/src/components/file-table.tsx` — Table view of files
- `apps/web/src/components/file-breadcrumb.tsx` — Path breadcrumb navigation
- `apps/web/src/components/file-upload.tsx` — Drag & drop upload zone + progress
- `apps/web/src/components/file-actions.tsx` — Context menu / actions dropdown

**What it does:**

- Table view with columns: name, type, size, uploaded by, date — using shadcn `Table`
- Breadcrumb path navigation (`accountSlug / images / ...`)
- Prefix-based "folder" browsing (`files.list` with prefix filter)
- Click file → copy CDN URL (`static.mark-life.com/{s3Key}`)
- Drag-and-drop upload zone with progress indicator
- File deletion with confirmation dialog
- Uses shadcn: `Table`, `Breadcrumb`, `DropdownMenu`, `Dialog`, `Progress`, `Badge`, `ContextMenu`, `Sonner` (toasts)

---

### Phase 4 — Upload Flow

**Files to create:**

- `apps/web/src/components/upload-dropzone.tsx` — Full drag-and-drop zone
- `apps/web/src/hooks/use-file-upload.ts` — Hook wrapping presigned URL flow

**What it does:**

1. User drops files or clicks to select
2. Calls `files.getUploadUrl` action for presigned S3 URL
3. PUTs file directly to S3 from browser
4. Calls `files.recordUpload` mutation to save metadata
5. Real-time table updates via Convex subscription

- Uses shadcn: `Progress`, `Sonner`, `Badge`, `Spinner`

---

### Phase 5 — Dashboard & Polish

**Files to modify:**

- `apps/web/src/pages/dashboard.tsx` — Rebuild as actual dashboard

**What it does:**

- Account summary cards (file count, total size per account)
- Recent uploads list
- Quick upload shortcut
- Uses shadcn: `Card`, `Chart` (recharts), `Table`, `Badge`

---

## Available Backend API

### Queries

| Function | Args | Description |
|---|---|---|
| `auth.getCurrentUser` | `{}` | Get authenticated user |
| `accounts.list` | `{}` | List all accounts |
| `accounts.getBySlug` | `{ slug }` | Get account by slug |
| `files.list` | `{ accountId, prefix? }` | List files with optional prefix filter |

### Mutations

| Function | Args | Description |
|---|---|---|
| `accounts.create` | `{ name, slug }` | Create new account |
| `files.recordUpload` | `{ accountId, s3Key, fileName, contentType, sizeBytes, uploadedBy }` | Record file metadata after S3 upload |

### Actions

| Function | Args | Description |
|---|---|---|
| `files.getUploadUrl` | `{ accountSlug, filePath, contentType }` | Get presigned S3 upload URL |
| `files.deleteFile` | `{ fileId }` | Delete from S3 + invalidate CloudFront + remove metadata |

---

## Installed shadcn Components

Accordion, Alert, AlertDialog, AspectRatio, Avatar, Badge, Breadcrumb, Button, ButtonGroup, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Combobox, Command, ContextMenu, Dialog, Direction, Drawer, DropdownMenu, Empty, Field, HoverCard, Input, InputGroup, InputOTP, Item, KBD, Label, Menubar, NativeSelect, NavigationMenu, Pagination, Popover, Progress, RadioGroup, Resizable, ScrollArea, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Spinner, Switch, Table, Tabs, Textarea, Toggle, ToggleGroup, Tooltip
