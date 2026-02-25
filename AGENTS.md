# AGENTS.md

## Project Overview

**Users Garden** is a client-facing tool for managing API usage, built with Next.js and React. It provides user account management, credit management, organization management, and user self-management capabilities.

- **License:** MIT (Copyright 2024 Internet Development Studio Company)
- **API Backend:** `https://api.internet.dev`

---

## Tech Stack

- **Next.js** ^16 with Pages Router (not App Router)
- **React** ^19 with function components
- **TypeScript** ^5.9 (strict mode off, strictNullChecks on)
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
```

---

## Path Aliases

Defined in `tsconfig.json`. Always use these aliases instead of relative paths.

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
npm run lint         # Run Next.js linter
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
