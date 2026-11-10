# AGENTS.md

## Project Overview

**Users Garden** is a client-facing tool for managing API usage, built with Next.js and React. It provides user account management, credit management, organization management, and user self-management capabilities.

- **License:** MIT (Copyright 2024-2026 Internet Development Studio Company). Original project work, including the 3D pond scene and supplied artwork, is free to use with the company copyright and MIT license notice retained. Preserve applicable third-party notices; see `LICENSE.md`, `THIRD_PARTY_NOTICES.md`, and `public/artwork/LICENSE.txt`.
- **API Backend:** `https://api.internet.dev`

---

## Tech Stack

- **Next.js** ^16 with Pages Router (not App Router)
- **React** ^19 with function components
- **TypeScript** ^7.0 (ES2017 target, bundler module resolution, strict mode off, strictNullChecks on)
- **D3** ^7.9 for data visualization
- **CSS Modules** (`.module.css`) for component-scoped styling
- **No state management library** — React Context + local state only

---

## Directory Structure

```
pages/              → Next.js pages (file-based routing)
components/         → Feature-specific UI components
scenes/             → Composite scene components (orchestrate multiple components)
system/             → Design system and reusable components
  ├── layouts/      → Layout system components
  ├── typography/   → Text/heading components (H1-H5, P, Text, etc.)
  ├── forms/        → Form components
  ├── graphs/       → Chart/graph components
  ├── modals/       → Modal system
  ├── documents/    → Document-specific components
  ├── sections/     → Section layout components
  ├── scroll/       → Scrolling components
  ├── animations/   → Animation components
  ├── diagrams/     → Diagram components
  ├── svg/          → SVG icon components
  ├── providers/    → Context providers
  └── detectors/    → Detection utilities
common/             → Shared utilities (constants, queries, server, utilities)
modules/            → Custom modules (cookies, cors, encryption)
compliance/site/    → Generated copy of the shared compliance kit (edit in ../apis, see Compliance Pages)
```

---

## Path Aliases

Defined in `tsconfig.json`. Always use these aliases instead of relative paths.

Alias targets resolve relative to `tsconfig.json` without `baseUrl`; TypeScript 7 no longer supports that option.

| Alias | Maps To |
|---|---|
| `@root/*` | `./*` |
| `@system/*` | `./system/*` |
| `@scenes/*` | `./scenes/*` |
| `@common/*` | `./common/*` |
| `@components/*` | `./components/*` |
| `@pages/*` | `./pages/*` |
| `@modules/*` | `./modules/*` |
| `@data/*` | `./data/*` |
| `@demos/*` | `./demos/*` |

---

## Component Conventions

### File Naming

- Components: `PascalCase.tsx` (e.g., `UserGardenDashboard.tsx`)
- Styles: `PascalCase.module.css` co-located with component
- Component name matches file name exactly

### Component Structure

```tsx
import styles from '@components/ComponentName.module.css';
import * as React from 'react';

export default function ComponentName(props) {
  return <div className={styles.root}>Content</div>;
}
```

### Key Patterns

- Always use `export default function` for components
- Always use `import * as React from 'react'` (not `import React from 'react'`)
- Always import utilities as namespace: `import * as Utilities from '@common/utilities'`
- Always import constants as namespace: `import * as Constants from '@common/constants'`
- Always import queries as namespace: `import * as Queries from '@common/queries'`
- Props are passed directly (not destructured in function signature)
- No prop spreading — pass props explicitly
- Use `React.useState` and `React.useEffect` (not destructured imports)

### Comments

- Use `// NOTE(username)` for explanatory notes
- Use `// TODO(username)` for planned work
- Keep comments minimal; code should be self-explanatory

---

## Styling Conventions

### CSS Modules

Every component has a co-located `.module.css` file. Styles are locally scoped.

### Global Styles

- `global.css` — CSS reset, theme variables, color palette, typography scale
- `animations.css` — Keyframe animations (blur, fade, slideDown, slideUp, slideRight, slideLeft)

### CSS Class Naming

Use camelCase within CSS modules:

- `.root` — Top-level element
- `.container` — Layout wrapper
- `.content` — Content area
- `.sidebar` — Sidebar area
- `.header` / `.footer` — Header/footer sections
- `.button` — Button elements
- `.input`, `.inputGroup` — Form elements
- `.actions` — Action button groups
- `.list` — List containers

### Theme System

Five themes set via `body` class: `theme-light` (default), `theme-dark`, `theme-daybreak`, `theme-blue`, `theme-neon-green`.

All colors use CSS custom properties:

| Variable | Purpose |
|---|---|
| `--theme-background` | Main background |
| `--theme-text` | Text color |
| `--theme-border` | Border color |
| `--theme-primary` | Primary action color |
| `--theme-button` / `--theme-button-text` | Button styling |
| `--theme-success` / `--theme-error` | Status colors |
| `--theme-foreground` | Primary foreground |
| `--theme-foreground-secondary` | Secondary foreground |

### Typography Scale

```
--type-scale-1: 3.815rem  →  --type-scale-7: 1rem
--type-scale-fixed-large: 20px  →  --type-scale-fixed-label: 10px
```

### Font Families

- `--font-family` — System sans-serif stack
- `--font-family-mono` — IosevkaTerm-Regular (primary font)
- `--font-family-serif` — Georgia, Times New Roman

### Borders

Use `box-shadow` instead of `border` for theme-aware borders:

```css
box-shadow: 0 0 0 1px var(--theme-border);
```

### Transitions

Standard transition: `transition: 200ms ease all;`

### Responsive Breakpoints

- `max-width: 768px` — Tablet/mobile
- `max-width: 480px` — Mobile only
- Some components use `960px`, `1024px`, `1248px`, `1440px`

### Spacing

Multiples of 4: `4px, 6px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 128px`. Most common is `24px`.

---

## API Integration

### Backend Workspace and Production Access

- **`repo:apis`** is the sibling backend repository at `../apis` (`/Users/angel/Development/apis`). It owns the API served at `https://api.internet.dev` and is available for coordinated backend improvements when a Users Garden task needs them.
- Trace client requests from `common/queries.ts` and `common/server.ts` into the actual handlers, authorization rules, and data models in `../apis` before assuming an API limitation or introducing a client workaround. Read that repository’s `AGENTS.md` and applicable nested instructions before working there.
- **Production access is available locally**, as confirmed by the maintainer. Use existing local access and relevant production evidence when needed to understand actual behavior, diagnose the selected task, and infer important, concrete next steps. Do not assume the frontend is the only workspace available for completing a feature or fix.
- Ground follow-ups in the client/backend source and observed behavior; record the specific problem, affected repository and files, expected result, and stopping condition in `NEXT.md`. Respect the current task’s scope and any request to reserve the next task for later.
- Keep credentials and private production data out of source, documentation, and tool output. Use read-only investigation where sufficient; production mutations and deployment must follow the current user’s authorization and environment permissions. Local access alone is not evidence that a change has been deployed or verified.

### Request Pattern

```tsx
const response = await fetch(`${Constants.HOST}/api/endpoint`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${key}`,
    'X-API-KEY': key,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});
```

### Query Functions

All API calls are in `common/queries.ts`. Functions follow `on[Action]` naming:

```
onUserAuthenticate, onSetUsername, onSetUserData, onUserChangePassword,
onUserRegenerateAPIKey, onGetAllOrganizations, onOrganizationAddUser, etc.
```

### Authentication

- Cookie-based sessions using `gardening_session` cookie
- Session key passed as `key` prop through component tree
- OAuth support: Google, Apple, Bluesky
- Server-side auth via `Server.setup(context)` in `getServerSideProps`

---

## User Tiers

Defined in `common/constants.ts`:

| Level | Tier |
|---|---|
| 0 | UNVERIFIED |
| 10 | VERIFIED |
| 20 | PAYING |
| 30 | GENERAL_CO_WORKING |
| 40 | PARTNER |
| 100 | ADMIN |

---

## Compliance Pages

`/compliance` and `/compliance/[slug]` (`pages/compliance/index.tsx`, `pages/compliance/[slug].tsx`) render INTDEV's public compliance records, using `getStaticPaths` with `fallback: false` over `COMPLIANCE_SLUGS`. The page bodies come from `compliance/site/`, a generated, byte-identical copy of `../apis/compliance/site/` that `../www-internet-v3` also renders, so both sites show the same page. Never edit `compliance/site/` here. Change it in `../apis` and run `node .claude/skills/compliance-pages/scripts/sync.mjs` there, following `../apis/.claude/skills/compliance-pages/SKILL.md`. The kit is a deliberate exception to the house typography: it uses Geist Serif through `next/font/local` (OFL, `compliance/site/GeistSerif-OFL.txt`) and the mana-www layout, and it sets its own colors regardless of the body theme class. The live deploy and status tables read `https://api.internet.dev/api/status/deploys` and `/api/status` from the browser, and the access, termination, training, vulnerability, deletion, device, infrastructure, and version records, the compliance report, and the release scans read `https://api.internet.dev/api/compliance/*` through the kit's `compliance/site/client.ts`. Every page ends with a Related table generated from the kit's `catalog.ts`. Screenshots live in `compliance/site/images/` and are imported as static images.

## Floor Plan

Floor plan (`USER_FLOOR_PLAN`, `components/UserGardenFloorPlan.tsx`) sits under Office in the ACCOUNT sidebar for every account. It uses the Upgrades page's grid (rows of 25% columns): the plan spans three columns and the selected desk fills the fourth, and a second row groups desks by who holds them (Open, Members, Teams, Layout). Teams are desks held by a partner account (partner is the team plan on Upgrades) or by a typed name; Members are desks held by any other account, admins included. `components/OfficePlan.tsx` draws the plan as an SVG you can drag to pan and scroll or pinch to zoom; it opens framed on the desks. The walls come from `common/office-plan.ts`, generated from Suite 301's vector leasing plan (in inches; regenerate it rather than editing it). Desks come from the API's `GET /api/users/office/desks`: every signed-in account gets positions only, accounts approved for a desk (an approved application and a co-working or partner plan) also get numbers and whether each desk is taken, and admins also get holders. Desk, chair, walkway (as deep as the chair), and nudge sizes are `Constants.Office`; `common/office-geometry.ts` places each chair and walkway from a desk's rotation and finds walkways that run into a wall, desk, or chair. Every list row has two lines: members show their name (the profile's `data.name`, else the username, else the start of the email) over their email, teams show their name over the partner account's email, or over No account for a typed name, and open desks show Open over whether their walkway is clear. For admins, the desk panel also lists when the desk was taken (`assigned_at`), the holder's plan and price, and whether they have paid: the page asks `POST /api/users/subscriptions/get-by-user-id` for each account holding a desk, and no active subscription (Stripe moves a subscription off active when a renewal fails) marks the desk red on the plan and in the lists, counts it in Layout, and offers an Email button. A failed lookup shows as Couldn't check payment, never as unpaid. Admins assign a desk from its panel: an approved account, a name already on another desk (so a team's desks are one pick each), or a newly typed name for an arrangement billed outside users.garden. Edit layout lets them drag desks (shift-click to pick several; arrows nudge 6 in and 36 in with shift; R rotates; Delete removes), then Save layout writes the changes through `create`, `update`, and `delete`. Desks move freely while dragged; `OfficeGeometry.settle` then pushes them flush out of any wall or desk they landed on and, after a drag, snaps them flush to a wall within 12 in or to (or in line with) a desk within 6 in. Only desktops count, so walkways can still run into walls.

## Device Check

Device check (`USER_DEVICE_CHECK`, `components/UserGardenDeviceCheck.tsx`) sits in the COMPLIANCE sidebar for every account. It opens with What you need (`DEVICE_CHECK_REQUIREMENTS` in the kit's `client.ts`: a Mac on a supported macOS, Terminal, and the script, each with Apple's instructions or the download link), then shows one Terminal command (`DEVICE_CHECK_COMMAND` in the shared kit's `compliance/site/client.ts`, which also holds `readDeviceReport`, `isCurrentTeamMember`, and the API calls) that downloads the API's `device-check.sh` to a private temporary folder and runs it with `--copy`, which copies the Mac's report to the clipboard without sending it, and the alternative `DEVICE_CHECK_DOWNLOADED_COMMAND` for running a copy downloaded to `~/Downloads` after reading it. Both run the script only after `shasum -a 256 -c` confirms `DEVICE_CHECK_SCRIPT_SHA256`, the hash the kit pins and the page prints, so they never pipe `curl` into `bash` (the security awareness course forbids running an unread script from the internet). The hash comes from `../apis` with the kit: when the API's script changes, sync the kit and deploy this site with the API, because until both serve the change the command prints `FAILED` and runs nothing. The viewer pastes the report, reviews it, and sends it with their signed-in key through `Queries.onDeviceCheckIn` (a wrapper over the kit's `sendDeviceCheckIn`, with `Constants.HOST`) to `POST /api/compliance/devices/check-in`. Anyone may report, so a new team member can report before joining, but the fleet record lists only current INTDEV team members (`TEAM` in `compliance/site/facts.ts`, minus the termination register; `isCurrentTeamMember`). For them, Your laptops reads their entry from the public `GET /api/compliance/devices`; everyone gets a link to the compliance page that validates the record (`DEVICE_CHECK_RECORD_URL`, `/compliance/removable-media`). The send result and each laptop under Your laptops name what to fix, from the kit's `deviceFixes`, and link to If a check does not pass, which renders every entry of `DEVICE_FIXES` (the fixes a laptop needs first, marked with the laptops that need them): the problem, the System Settings steps, a Terminal command with a copy button where one exists, and Apple's help pages. Change the fix text in `../apis/compliance/site/client.ts`, never here. The API, not this page, validates the report, decides encryption, and refuses a laptop a current member already reported (`409`). The report carries `generated_at` and a `check` seal from the script; the API refuses (`400`) a report that was edited after the script made it, is more than a day old, or comes from an older version of the check, so the page sends the parsed paste unchanged and never rebuilds or edits it. The review rows show when the check ran on the Mac and, from device check 3, Gatekeeper, the XProtect version and install time, whether security responses and security updates install automatically, and the firewall, as macOS reported them. The send result and each laptop under Your laptops show the API's `assessment.anti_malware_active` and `firewall_on`; `null` means the check-in came from before device check 3 and is shown as due for a rerun. Each laptop row and the send result also show the API's patch state (`assessment.patch_current`, with `os_supported` against the kit's `SUPPORTED_MACOS` and `security_updates_on`); the row is omitted when the answering API release does not report it. Never send a report on someone else's behalf. See `../apis/AGENTS.md` under **Compliance Evidence**.

## Training

Training (`USER_TRAINING`, `components/UserGardenTraining.tsx`) sits in the COMPLIANCE sidebar for every account. It opens with Start in Vanta: the training itself is taken in Vanta's employee onboarding (the kit's `VANTA_TRAINING`, https://app.vanta.com/c/internet.dev/employee/onboarding), which covers most of INTDEV's training requirements, and signing the INTDEV courses here is each person's own statement that their training is complete. Nothing reads Vanta. It then lists the kit's `TRAINING_COURSES` (replaced by the courses `GET /api/compliance/training` returns, with their live `due` dates, for current team members), links each course to the security awareness training page (`TRAINING_COURSE_URL`, `/compliance/security-awareness-training`), and for each unsigned course asks the viewer to check the kit's `TRAINING_ACKNOWLEDGEMENT` before signing. Signing calls `Queries.onSignTraining`, a wrapper over the kit's `sendTrainingSignature` with `Constants.HOST`, which posts `{ course_id, version, acknowledgement }` with the signed-in key to `POST /api/compliance/training/sign`; the API refuses a version or acknowledgement that differs from the published course. The viewer's own record comes from `Queries.onGetTrainingRecord` (`readTrainingMember`). A course in the register's November 4, 2026 signatures shows as confirmed by the CEO. Anyone may sign, but the training record lists only current INTDEV team members. Never sign on someone else's behalf. See `../apis/AGENTS.md` under **Compliance Evidence**.

## Compliance Checklist

The sidebar's COMPLIANCE group holds Checklist (`USER_COMPLIANCE`, `components/UserGardenCompliance.tsx`), Device check, and Training, and the Guide shows current team members a Your compliance checklist prompt that opens Checklist. For a current team member, Checklist reads the device fleet and training records (`Queries.onGetDeviceFleet`, `Queries.onGetTrainingRecord`) and lists what is still open: every laptop reported within the fresh window, each laptop's open fixes from `deviceFixes`, and every training course signed for its current version (the record's `courses`), each with a button to the page that finishes it. Its How each item works and What you need sections send people to Vanta's employee onboarding before they sign. A record the API cannot read shows as Unavailable, never Done. Other accounts see that nothing is required of them yet. It also repeats What you need and links to the compliance pages that publish the record.

`Constants.DASHBOARD_HASHES` maps `#compliance`, `#device-check`, and `#training` to these views: `pages/index.tsx` opens the linked view for a signed-in viewer on load, and navigation keeps the hash in step (cleared for every other view) with `history.replaceState`. The device check script prints `https://users.garden/#device-check`. A Google, Apple, or Bluesky sign-in returns through `/oauth`, which drops the hash, so the link opens the Guide after an OAuth sign-in.

## Modal System

- `GlobalModalManager` — Central modal renderer
- `ModalContextProvider` — React Context for modal state
- `useModal()` hook — Access `showModal({ name, message })` function
- Modal types: ERROR, AUTHENTICATION, NAVIGATION, COLOR_PICKER, WEBSITE_PROMPT

---

## Environment Variables

Required for server-side features:

- `API_AES_KEY` — AES encryption key
- `API_IV_KEY` — Initialization vector key

---

## Code Formatting

Prettier configuration (`.prettierrc`):

- Print width: 9999 (no line wrapping)
- 2-space indent, no tabs
- Single quotes, semicolons
- Trailing commas: ES5
- Arrow parens: always

---

## Development Commands

```sh
npm install          # Install dependencies
npm run dev          # Dev server on port 10000
npm run build        # Production build
npm start            # Production server on port 10000
npm run typecheck    # Check TypeScript without emitting files
npm run test:pond    # Check pond simulation and geometry
```

---

## Key Rules

1. **No relative imports** — Always use path aliases (`@system/`, `@components/`, etc.)
2. **No SASS/SCSS** — Use plain CSS with CSS Modules (`.module.css`)
3. **No external state management** — Use React Context + useState only
4. **No CSS-in-JS libraries** — Use CSS Modules for all styling
5. **No new dependencies** without explicit approval
6. **Single page architecture** — `pages/index.tsx` handles all authenticated views
7. **Props over context** — Pass data through props; reserve context for global concerns (modals)
8. **Server-side auth** — Use `getServerSideProps` with `Server.setup()` for session handling
