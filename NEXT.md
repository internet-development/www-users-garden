# NEXT.md

This file is Users Garden’s control loop for autonomous runs. Read it top to bottom: complete [PRE WORK], execute [NEXT WORK], then complete [POST WORK]. Finish by writing one justified follow-up into [NEXT WORK] or restoring `No task selected.` The placeholder means stop; it is a complete outcome.

[NEXT WORK] is the only durable task handoff between runs. A current user instruction can supply or override the task. Git state, leftover files, remembered conversations, and an unfinished plan do not authorize work. Higher-priority session instructions and the current user’s explicit decisions take precedence over this file.

Adapted from `../www-set/NEXT.md` at the user’s request. This version preserves its evidence-first workflow, bounded task selection, source review, maintainer-owned runtime verification, documentation upkeep, and stopping rule. The intentional adaptations are Users Garden’s root `AGENTS.md` as the development contract, its account-management source map, and its API, session, credit, organization, and tenant workflows. Set’s simulation rules, public skill catalog, documentation machinery, and six-column layout do not apply here.

## [PRE WORK]

Complete this review before editing files on every run. Future task runs may replace only [NEXT WORK]; changing [PRE WORK] or [POST WORK] requires a current user instruction to revise this control loop.

### Establish the task and its evidence

1. Read the current user request and [NEXT WORK]. State the concrete result being requested and any explicit exclusions. If there is no task in either place, stop without selecting work from the repository. A request to execute this file does not itself select a product change when the task slot is empty.
2. Read the root `AGENTS.md` in full. It is Users Garden’s development contract, not a pointer to Set’s `DEVELOPMENT.md`. Discover and read any nested instructions applicable to the task. Do not import another repository’s documentation structure or assume previously read instructions still apply.
3. Use the source map below to reach the behavior’s owner. Read the task’s callers, data sources, styles, shared components, and affected consumers before changing them. Expand the reading when a dependency or contract is unclear.
4. Inspect available skill descriptions and discover repository `SKILL.md` files. Read an applicable skill in full before applying it. Use only workflows relevant to the authorized task; the presence of a skill does not authorize another workstream.
5. Find the closest existing implementation before building. When the user names a reference repository, inspect its actual source and related styles. Record which behavior is being adopted and how it fits Users Garden. References are the specification; this workspace’s best existing work is the minimum craft bar where the task is silent.
6. Trace any changed API action from its component callback through `pages/index.tsx`, `common/queries.ts`, and the response consumer. Session and viewer lookups also involve `common/server.ts`. Follow unclear contracts into the sibling `repo:apis` at `../apis`; read its own instructions before working there. Establish the request fields, response shape, failure behavior, and refresh path from evidence. Use the locally available production access described in `AGENTS.md` when relevant investigation requires it; infer concrete next steps from actual behavior rather than inventing backend capabilities.
7. The maintainer owns runtime and visual verification unless the current request or higher-priority instructions require checks. Read package scripts and installed tooling when needed for implementation or requested verification. Do not start a separate testing workstream.

Evidence is the current request, [NEXT WORK], workspace and sibling backend files read in this run, and relevant production observations obtained within the authorized scope. Inspect git only when the user explicitly requests it. Do not use history, status, diffs, branches, or uncommitted changes to discover tasks, reconstruct intent, or select follow-ups. The workspace is shared; preserve unrelated work.

### Where to look

These are entry points, not permission to edit every listed file. Follow the actual imports and callbacks for the selected task, including co-located CSS Modules.

| Concern                                                    | Owning files and relevant consumers                                                                                                                                                      |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Development rules and setup                                | `AGENTS.md`, `README.md`, `package.json`, `tsconfig.json`, `.prettierrc`                                                                                                                 |
| Backend contracts and coordinated API improvements         | Sibling `repo:apis` at `../apis`; start with its `AGENTS.md`, then follow the relevant handlers and data models. Local production access is documented in this repository’s `AGENTS.md`. |
| Authentication, current viewer, active view, and callbacks | `pages/index.tsx`, `common/server.ts`, `common/queries.ts`, `modules/cookies.ts`                                                                                                         |
| OAuth callback and decryption                              | `pages/oauth.tsx`, `common/server.ts`, `modules/aes.js`; provider entry points in `pages/index.tsx`                                                                                      |
| Dashboard composition and navigation                       | `scenes/UserGardenDashboard.tsx`, `components/UserGardenAuthenticatedNavigation.tsx`, `system/layouts/DashboardWithSidebarLayout.tsx`                                                    |
| Guide, profile, and account data                           | `components/UserGardenGetStarted.tsx`, `components/UserGardenDashboardProfile.tsx`, `common/utilities.ts`, callbacks in `pages/index.tsx`                                                |
| Password and API-key management                            | `components/UserGardenAccess.tsx`, callbacks in `pages/index.tsx`, `common/queries.ts`                                                                                                   |
| Credits, transactions, and recipients                      | `components/UserGardenWallet.tsx`, credit query functions in `common/queries.ts`                                                                                                         |
| Organizations, membership roles, and public access         | `components/UserGardenOrganizations.tsx`, membership state in `pages/index.tsx`, organization query functions in `common/queries.ts`                                                     |
| Website/application users                                  | `components/UserGardenApplications.tsx`, selected organization in `pages/index.tsx`, `onOrganizationSourceUsers` and membership queries                                                  |
| Office applications, invoices, and upgrades                | `components/UserGardenOffice.tsx`, `components/UserGardenUpgrade.tsx`, corresponding queries, `common/constants.ts`                                                                      |
| Administrative tenant management                           | `components/AdminTenants.tsx`, dashboard/navigation consumers, tenant query functions                                                                                                    |
| Unsubscribe and account deletion                           | `components/UserGardenDanger.tsx`, callbacks in `pages/index.tsx`, corresponding queries                                                                                                 |
| API host, tier thresholds, payouts, and purchase links     | `common/constants.ts`; import the owning value instead of copying it                                                                                                                     |
| Global modal state and rendering                           | `components/Providers.tsx`, `system/providers/ModalContextProvider.tsx`, `system/modals/GlobalModalManager.tsx`, the relevant modal component                                            |
| Shared controls, typography, and layouts                   | `system/`, `components/StandardLayout.tsx`, `components/StandardLayoutSection.tsx`, `components/StandardHeader.tsx`                                                                      |
| Global themes and animation                                | `global.css`, `animations.css`, `common/utilities.ts`, `pages/_app.tsx`, `pages/_document.tsx`                                                                                           |

### Resolve uncertainty without creating friction

- Treat the request as grounded in observed designs or behavior. Do not question whether a reported problem is real merely because the request is terse.
- A short task carries the full quality bar. Bring complete React, TypeScript, CSS, Next.js, API, and account-management expertise; do not reduce effort or polish to match word count.
- Put effort into excellent implementation, visual composition, interaction behavior, and source-level reasoning. Follow the verification scope of the current request and session.
- Do not infer hidden tasks, hidden intent, or unstated acceptance criteria. Resolve ordinary implementation choices from the request, references, and current source, and state material assumptions before proceeding.
- Ask only when essential facts are missing or instructions conflict. Ask one concise, specific question and continue independent authorized work when possible. Do not ask for reassurance or permission to perform work already authorized.
- A proposal or unchecked plan is context unless the current request or [NEXT WORK] explicitly selects it. An observed defect outside the selected task is not permission to fix it. Never turn a layout task into an authentication migration, billing redesign, backend rewrite, or repository-wide cleanup.

### Preserve Users Garden’s product contract

Users Garden is the client-facing dashboard for the Internet Development API. It manages accounts, API access, credits, organizations, application users, office services, and administrative tenants. `AGENTS.md` owns the implementation conventions; the existing API integration defines what the client can request.

- **Keep the client and backend responsibilities clear.** Use `Constants.HOST` and the existing query functions. Centralize ordinary API actions in `common/queries.ts`; preserve the session/viewer helpers in `common/server.ts`. Improve the sibling `../apis` implementation when the selected task requires backend changes, following that repository’s instructions and applicable workspace permissions. Preserve compatibility with its other consumers. Do not add a competing local account store, credit ledger, or authorization service to solve a client task.
- **Preserve request and response contracts.** Keep the endpoint, HTTP method, authentication headers, body fields, and expected response qualifier aligned with the operation. Consumers currently depend on fields such as `data`, `user`, `email`, and `success`, with failed query expectations returning `null`. Read each caller before changing a shared helper; do not turn an error or absent response into a successful empty result.
- **Keep authenticated views in the single-page flow.** `pages/index.tsx` owns the current viewer, session key, active view, and selected organization. `UserGardenDashboard` composes the views and forwards callbacks. Preserve `getServerSideProps` with `Server.setup(context)` and the signed-out entry flow. Do not migrate to the App Router or introduce separate authenticated routes without an explicit task.
- **Keep session changes coherent.** The session cookie is `gardening_session`. Sign-in, OAuth completion, API-key regeneration, and sign-out must keep the cookie, current key, viewer, and subsequent requests consistent. Preserve Google, Apple, and Bluesky entry flows when changing authentication. Keep `API_AES_KEY`, `API_IV_KEY`, and decryption on the server; never expose environment values in client code, logs, examples, or documentation.
- **Respect distinct permission scopes.** Account tiers come from `Constants.Users.tiers`; organization membership roles belong to the relevant membership. Do not infer organization-admin rights from a selected domain or confuse them with account-wide administration. UI visibility is not backend authorization. Preserve the existing distinction between a website’s source users and its organization members.
- **Keep organization actions attached to their target.** Domain, organization ID, membership ID, and user ID are different values. Follow the endpoint’s actual contract. Switching organizations must not send a mutation for a stale selection or display one organization’s members as another’s. Handle absent selections and failed loads in affected flows.
- **Keep credits faithful to the API.** The wallet displays INTDEV credits and reads transaction `amount_cents`; preserve the existing unit, sign, recipient, and balance semantics. Do not silently convert credits to dollars or invent exchange rates, entitlements, payouts, or purchase links. Read the owning constants and API call before changing amounts or presentation. Confirm success from the response and refresh affected data; prevent accidental duplicate submissions in changed transfer flows.
- **Keep consequential actions deliberate.** Preserve the product’s existing confirmation and target-identification behavior for transfers, role changes, member removal, API-key regeneration, tenant changes, unsubscribe, and account deletion. A code change does not authorize performing these actions against real accounts as a verification step. Do not add unrelated approval flows to routine editing.
- **Keep account data edits precise.** Follow `Utilities.sanitizeObject` and the distinction between a field update and a full `forcePush` update. Preserve fields outside the requested edit and refresh the viewer from the backend after successful changes. Do not present an unsaved local edit as persisted data.
- **Keep office, billing, and admin behavior tied to real responses.** Applications, approvals, invoices, subscription state, and upgrades remain separate operations. Do not fabricate approval, payment, or entitlement from a clicked button. Preserve tier checks and the selected tenant when changing administrative controls.

### Preserve the implementation and layout contract

- Use the Next.js Pages Router, React function components, TypeScript, configured path aliases, and plain CSS Modules. No relative imports, Sass, CSS-in-JS, external state-management library, or new dependency without the explicit approval required by `AGENTS.md`.
- Follow `AGENTS.md` for component naming, `export default function`, namespace imports, direct `props` access, explicit prop passing, and `React.useState`/`React.useEffect`. Follow `.prettierrc`. Keep comments minimal and use the established `NOTE(username)` and `TODO(username)` forms.
- Pass feature data and callbacks through props. Reserve context for global concerns such as modals; use the existing provider and modal manager instead of creating another modal system.
- Reuse the dashboard sidebar, standard sections, form controls, tables, and typography. Preserve navigation to account, organization, website, and admin features relevant to the viewer. A feature task is not permission to redesign the whole dashboard.
- Use `global.css` theme tokens, the existing font and typography scale, co-located styles with camelCase class names, and theme-aware box shadows. Preserve the five supported themes. Read the affected layout’s actual breakpoints and sizing; do not import Set’s column dimensions or navigation structure.
- Give controls accessible names, labels, focus states, and honest pending, empty, error, and success states. Keep forms and tables usable on mobile, with keyboards, and at browser zoom. Make recovery possible after failed requests without losing valid input unnecessarily.
- Avoid overlapping mutations and stale results in changed flows. Release listeners and applicable in-flight work on unmount. Keep loading state recoverable after rejection and scope returned data to the viewer or organization that requested it.
- A button or link must do what its label promises. Use actual API results and accurate copy. Keep implementation details out of product flows unless they help the person manage their account or use their API access.

## [NEXT WORK]

No task selected.

## [POST WORK]

Complete every applicable step. Do not rewrite [PRE WORK] or [POST WORK] during ordinary task execution.

### Review the implementation; respect the verification scope

- Review source and affected consumers against the request, reference implementation, and contracts read this run. Reason through responsive sizing, overflow, permissions, state transitions, failure recovery, cleanup, and data flow as part of implementation.
- For changed account operations, follow the full path: user input, validation, target and credential selection, query, response handling, state refresh, and visible result. For shared query or control changes, inspect every affected caller.
- Preserve the source control loop’s default: the maintainer owns runtime and visual verification. Do not run builds, typechecks, test suites, HTTP probes, browser automation, or screenshot checks unless requested by the current user or required by higher-priority session instructions. Do not start servers or request sandbox/network permissions merely to perform unrequested verification.
- Do not create arbitrary tests, temporary verification scripts, broad harnesses, or speculative audits. When checks are requested or required, use existing tooling and keep them focused on the changed behavior. Read the actual package script before invoking it; a documented command is not evidence that it works with the installed version.
- Do not exercise real transfers, send emails, change memberships, rotate keys, alter subscriptions, or delete accounts as a casual smoke test. Implementing these flows and performing an external action are separate scopes.
- Never claim runtime, backend, security, or visual verification from source inspection. Report only commands and results that actually ran, including material limitations. Do not change unrelated configuration or weaken checks to manufacture success.
- Do not inspect past commits. Do not commit, stage files, reset shared work, or use git unless the current user explicitly requests the relevant action. The maintainer handles commits.

### Update the owning documentation in the same run

- Update affected documentation when architecture, routes, setup, commands, API integration, authentication, or user-visible behavior changes. Follow the root `AGENTS.md` and any applicable nested contract. Do not create a parallel `DEVELOPMENT.md` hierarchy just because the source repository has one.
- Keep `README.md` the simplest route to running the application. Change it when setup or user entry points change; do not fill it with internal design detail. Describe environment requirements for the features that actually consume them without including values.
- Keep API behavior grounded in `common/queries.ts` and its consumers. If a selected task adds or changes an integration, document the relevant request, response, failure behavior, and backend dependency where the task’s documentation belongs. Do not publish invented backend guarantees.
- Keep each value with its existing owner. Import tier thresholds, API host, payouts, and links from `common/constants.ts` instead of copying literals. Reference their owner in documentation when a repeated numeric table would drift; do not introduce Set’s skill-token machinery here.
- Update user-facing guide or help copy when a changed workflow makes it inaccurate. Keep the copy about what the person can do and the actual result of the action.
- If no documented or agent-facing contract changed, leave the corresponding documents untouched. Documentation work is scoped by actual changes, not by the presence of Markdown files.
- A requested change to `NEXT.md` must preserve the source control loop’s principles and identify intentional repository-specific adaptations. A routine task may update only [NEXT WORK].

### Close the current request honestly

State what changed and why it serves the requested result. Link the relevant local files. Distinguish implemented behavior from follow-up ideas and source review from runtime verification. If checks ran, report their actual results and material limits. Do not use unsupported readiness percentages or describe a planned feature as complete.

### Select the next task — and know when to stop

Choose a follow-up only from the completed task, the current user request, and evidence gathered for that task. This includes client/backend source and relevant production observations under the access documented in `AGENTS.md`; backend files need not have been edited to establish a concrete API problem. Identify the owning repository when the next change belongs in `../apis`. Do not use git state, stale memory, an unrelated backlog, or an unselected plan to keep the loop running.

A follow-up must identify:

1. The concrete remaining problem and evidence that it exists.
2. The bounded change and affected owning files.
3. The measurable resulting behavior for the maintainer to review.
4. Compatibility boundaries and a clear stopping condition.

Write at most one independently complete task. Do not manufacture cleanup, polish, speculative safeguards, arbitrary assessments, or feature work that the user reserved for later.

Restore `No task selected.` when the current request is satisfied and no concrete, authorized, regression-safe continuation remains; when the selected plan is complete; or when the only candidate is speculative. Stop after recording the placeholder. Do not begin another run yourself.

If a necessary requirement remains blocked, record that specific unresolved requirement and the missing fact or external change. Do not mark incomplete work complete or replace it with an unrelated task. An essential question is not permission to invent the answer.
