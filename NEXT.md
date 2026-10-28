# NEXT.md

This file is Users Garden’s control loop for autonomous runs. Read it top to bottom: complete [PRE WORK], execute [NEXT WORK], then complete [POST WORK]. Finish by writing one justified follow-up into [NEXT WORK] or restoring `No task selected.` The placeholder means stop; it is a complete outcome.

[NEXT WORK] is the only durable task handoff between runs. A current user instruction can supply or override the task. Git state, leftover files, remembered conversations, and an unfinished plan do not authorize work. Higher-priority session instructions and the current user’s explicit decisions take precedence over this file.

Adapted from `../www-set/NEXT.md` at the user’s request. This version preserves its evidence-first workflow, bounded task selection, source review, maintainer-owned runtime verification, documentation upkeep, and stopping rule. The intentional adaptations are Users Garden’s root `AGENTS.md` as the development contract, its account-management source map, and its API, session, credit, organization, and tenant workflows. Set’s simulation rules, public skill catalog, documentation machinery, and six-column layout do not apply here.

## [PRE WORK]

Use this section to gather the context needed for the selected task. Begin with instructions and affected contracts, then expand source reading as evidence requires. Preparation may continue alongside independent authorized work; an unrelated documentation gap or unavailable nonessential check is not a prerequisite for useful progress. Future task runs may replace only [NEXT WORK]; changing [PRE WORK] or [POST WORK] requires a current user instruction to revise this control loop.

### Establish the task and repository boundaries

1. Read the current user request and [NEXT WORK]. Identify the requested behavior, scope, intended result, explicit exclusions, and compatibility constraints. A current user instruction can override the on-disk task. If neither selects work, stop without discovering a replacement task from the repository. Preserve unresolved authorized work and distinguish it from optional proposals.
2. Read applicable parent instructions and every first-party `AGENTS.md` in the workspace, including hidden directories. Read any referenced `DEVELOPMENT.md` or other owning contract. Follow the deepest applicable instructions within the current session’s authority. Users Garden’s root `AGENTS.md` is its development contract; do not import Set’s documentation structure or implementation rules.
3. Enumerate first-party source, tests, configuration, scripts, documentation, and skills before narrowing the source review. Include hidden directories and track what has actually been read. Exclude `.git` internals, dependencies, generated/build output such as `.next` and `tsconfig.tsbuildinfo`, binaries, and credentials. Do not follow symlinks or enter nested Git repositories implicitly. Identify excluded boundaries explicitly rather than treating their contents as reviewed.
4. Establish edit boundaries from current files and the user’s instructions. Preserve unrelated and user-owned content. Inspect Git only when explicitly authorized; do not use history, status, diffs, branches, or uncommitted changes to infer intent or select work. When ownership or baseline provenance is uncertain, state that uncertainty instead of attributing existing changes or failures to this task.
5. Inspect available skill descriptions and inventory every first-party `SKILL.md`, including hidden skill directories. Read each discovered workflow and its applicability; read supporting resources in depth when relevant. Distinguish development workflows from public API guides, fixtures, vendored material, and archives. Apply only relevant skills within the selected task and higher-priority instructions; their existence does not authorize another workstream or external action.

### Read the complete documentation inventory

Recursively inventory and read every first-party `.md`, `.markdown`, and `.mdx` file, including instruction and skill folders. Do not rely solely on an ignore-aware file listing or on the initial inventory below. Keep a coverage record that distinguishes enumerated files, fully read contents, claims checked against source, and exact unread or unverified areas. If output is truncated, read the missing portion before marking the document as read.

The repository’s initial Markdown inventory is `AGENTS.md`, `LICENSE.md`, `NEXT.md`, `README.md`, and `THIRD_PARTY_NOTICES.md`. Re-enumerate it for each run; this list is a starting point, not a coverage limit. Discover newly added documents and instructions. Read referenced non-Markdown contracts when relevant, including `public/artwork/LICENSE.txt`, without treating generated artwork or dependency trees as first-party documentation.

Relate every document to its implementation owners. Cross-check affected claims, local links, commands, examples, configuration, and ownership rules against actual source and tests. In particular, distinguish setup requirements from optional feature configuration, synthetic preview behavior from live API behavior, and plans from implemented features. Identify known stale statements and the evidence needed to reconcile them during [POST WORK]. Accurate documents need no gratuitous rewrite.

Whole-document coverage does not require certifying every unrelated algorithm, shader, numerical claim, or lifecycle path. Mark unrelated claims that remain unverified precisely and continue work that does not depend on them. Missing access to a sibling repository or live service is a coverage limitation unless the selected task actually depends on that evidence. Do not convert documentation review into an unauthorized subsystem audit.

### Trace the affected implementation

Use the source map to find the behavior’s owner, then read its actual callers, inputs, state transitions, styles, shared controls, tests, and affected consumers. Expand through transitive dependencies wherever the contract is unclear. A file’s presence or an isolated search result is not enough to understand its behavior.

| Concern | Entry points and owners |
|---|---|
| Development contract, setup, dependencies, and formatting | `AGENTS.md`, `README.md`, `package.json`, available lockfiles, `tsconfig.json`, `.prettierrc`, and configuration under `.github/` |
| Page bootstrap and global styling | `pages/_app.tsx`, `pages/_document.tsx`, `components/Providers.tsx`, `global.css`, and `animations.css` |
| Authentication, viewer, active view, and callbacks | `pages/index.tsx`, `common/server.ts`, `common/queries.ts`, and `modules/cookies.ts` |
| OAuth completion and server-side decryption | `pages/oauth.tsx`, `common/server.ts`, and `modules/aes.js`; provider entry points in `pages/index.tsx` |
| Dashboard composition and navigation | `scenes/UserGardenDashboard.tsx`, `components/UserGardenAuthenticatedNavigation.tsx`, and `system/layouts/DashboardWithSidebarLayout.tsx` |
| Guide, profile, account data, and phone settings | `components/UserGardenGetStarted.tsx`, `components/UserGardenDashboardProfile.tsx`, `components/UserGardenSmsSettings.tsx`, `common/utilities.ts`, and callbacks in `pages/index.tsx` |
| SMS contracts, consent copy, and examples | `common/sms.ts`, `common/sms-examples.ts`, SMS and phone functions in `common/queries.ts`, `components/SmsConsentNotice.tsx`, and `components/SmsServiceExamples.tsx` |
| Public SMS preview | `pages/settings-preview.tsx`, `scenes/UserGardenSettingsPreview.tsx`, and the shared SMS components; preview callbacks keep their state locally |
| Password and API-key management | `components/UserGardenAccess.tsx`, callbacks in `pages/index.tsx`, and `common/queries.ts` |
| Credits, transactions, and recipients | `components/UserGardenWallet.tsx`, credit callbacks and queries, and `common/constants.ts` |
| Organizations, membership roles, and application users | `components/UserGardenOrganizations.tsx`, `components/UserGardenApplications.tsx`, selected-organization state in `pages/index.tsx`, and organization queries |
| Office applications, invoices, upgrades, and administrative tenants | `components/UserGardenOffice.tsx`, `components/UserGardenUpgrade.tsx`, `components/AdminTenants.tsx`, dashboard/navigation consumers, and corresponding queries |
| Unsubscribe and account deletion | `components/UserGardenDanger.tsx`, callbacks in `pages/index.tsx`, and corresponding queries |
| Shared controls, layouts, typography, and graphs | `system/`, `components/StandardLayout.tsx`, `components/StandardLayoutSection.tsx`, and `components/StandardHeader.tsx`; D3 consumers are under `system/graphs/` |
| Modal state and rendering | `components/Providers.tsx`, `system/providers/ModalContextProvider.tsx`, `system/modals/GlobalModalManager.tsx`, and the affected modal |
| Pond rendering and resource lifecycle | `components/WaterFrame.tsx`, `common/water.ts`, its `common/water-*.ts` dependencies, and co-located component styles |
| Pond geometry, projection, Life, navigation, and tests | `common/pond-layout.ts`, `common/pond-projection.ts`, `common/pond-life.ts`, `common/pond-navigation.ts`, and `tests/pond.test.cjs` |
| Backend contracts | Sibling `repo:apis` at `/Users/angel/Development/apis`; read its own instructions before tracing relevant handlers, validation, authorization, and data models |
| License and attribution | `LICENSE.md`, `THIRD_PARTY_NOTICES.md`, `public/artwork/LICENSE.txt`, and applicable source notices |

Find the closest established implementation before designing a change. When a reference repository is explicitly named, inspect its actual source and styles within its repository boundaries and identify which behavior applies. References do not authorize unrelated changes.

Investigate apparent dead code through direct callers, dynamic imports, file-based routing, exported interfaces, scripts, tests, and other relevant entry points before proposing removal. Absence from one search is not proof of nonuse. Dependency updates do not independently authorize removing shared components or vendored utilities.

### Establish dependency and tooling compatibility

Read the manifest, available lockfiles, compiler configuration, package scripts, and relevant automation before selecting implementation steps. Distinguish declared version ranges, locked resolutions, installed versions, and versions confirmed from the package registry. Do not describe a version as latest solely because it appears in the workspace.

For a dependency-update task, inspect release information, engine requirements, peer dependencies, and the library interfaces this application actually uses. Consider Next.js with React and React DOM together, React and Node type packages, TypeScript, `ts-node`, D3, and other declared packages. Preserve deliberate dependency choices and range conventions except where the selected update requires a change. Use the installation and verification authority already supplied by that task; routine project-local steps do not need a new approval gate. New dependencies still require the explicit approval specified by `AGENTS.md`, and unrelated software installation or upgrades remain outside scope. If the task leaves a material supported-runtime policy decision unresolved, identify that decision while continuing independent work.

Read these concrete compatibility surfaces rather than assuming the documented commands work:

- `package.json` defines development and production servers on port 10000, a Next.js production build, a `lint` script invoking `next lint`, and `test:pond` invoking Node’s test runner. Check the selected Next.js CLI’s actual support for the lint command and discover any existing lint configuration before relying on it.
- Compare `package.json`’s Node engine declaration and README setup instructions with the target packages’ requirements and relevant automation. `.github/build.yml` currently specifies Node 16 and invokes installation, lint, and build steps; establish whether configuration files are active in their actual locations before treating them as executed CI.
- `tsconfig.json` uses ES2017, bundler module resolution, explicit path aliases without `baseUrl`, `strictNullChecks`, and the Next.js plugin. Inspect input validation and type boundaries touched by compiler or type-package changes. Do not weaken configuration to hide compatibility failures.
- `tests/pond.test.cjs` uses `node:test` and the TypeScript JavaScript API’s `transpileModule` to load pond modules. Its loader is a compatibility consumer of TypeScript even though it is outside the application bundle. Its synthetic geometry and movement checks do not establish browser rendering or account-flow correctness.
- Inspect scripts and automation for lockfile-dependent commands such as `npm ci`, and separate lockfile requirements from package installation choices. Do not infer that a package is removable merely because its name appears only in the manifest or lockfile; consider tooling and transitive integration first.

Identify useful existing baseline checks and their prerequisites for the verification work in [POST WORK]. Where baseline checks are permitted and useful during preparation, use them to distinguish existing failures from regressions. Keep checks relevant to the selected change; neither the absence of a general test suite nor an unavailable optional tool authorizes a new testing infrastructure workstream.

### Understand the product contracts that must remain compatible

- **Client and backend ownership:** ordinary client actions belong in `common/queries.ts`; viewer/session helpers also make requests in `common/server.ts`. Use `Constants.HOST`. Trace a changed action from its component callback through page state, query, response consumer, and refresh behavior. Follow unclear contracts into `../apis` before assuming an API limitation or introducing a client workaround. Backend access is available for tasks that require it, subject to that repository’s instructions and actual permissions.
- **Response and failure behavior:** inspect each operation’s method, headers, body, expected qualifier, and error handling. The generic query helper and typed SMS helpers have different failure contracts; do not flatten them into a successful empty result. Read every affected consumer of a shared helper.
- **Routing and sessions:** keep authenticated views in the `pages/index.tsx` flow, with `UserGardenDashboard` composing them and `Server.setup(context)` supplying server-side session data. Preserve `gardening_session` coherence across sign-in, OAuth, API-key regeneration, sign-out, and subsequent requests. The public `/settings-preview` route is a separate established entry point. Do not migrate routers or introduce new authenticated routes without a selected task.
- **Secrets and external effects:** identify authentication, authorization, input validation, filesystem access, and external actions touched by the change. Keep decryption and `API_AES_KEY`/`API_IV_KEY` server-side. SMS credentials belong to the backend. Do not expose values in source, prompts, logs, examples, or tests. Read-only production investigation may be relevant under existing authorization, but access alone does not authorize sending messages, transfers, account changes, migrations, or deployment.
- **Permission and target identity:** distinguish account tiers from organization membership roles, and organization IDs from domains, membership IDs, and user IDs. Preserve the distinction between organization members and a website’s source users. Inspect stale selections and asynchronous responses when changing organization flows; UI visibility is not backend authorization.
- **Account data and SMS:** inspect `Utilities.sanitizeObject`, partial updates, `forcePush`, and viewer refresh before editing account data. Preserve the editable `viewer.data.phone` string independently of SMS availability and consent state. Saving or clearing a phone number is distinct from requesting consent or stopping an existing subscription. The preview uses local callbacks; it must not acquire live API side effects through shared-component changes. Distinguish documented backend guarantees and illustrative workflows from behavior established by the frontend source.
- **Credits and consequential actions:** preserve INTDEV credit units, transaction `amount_cents`, signs, recipients, balances, and the constants that own purchase links and thresholds. Preserve existing confirmation and target-identification behavior. Inspect duplicate submission, rejection recovery, successful response validation, and refresh paths in affected mutations.
- **Office, billing, and administration:** applications, approvals, invoices, subscriptions, upgrades, and tenant changes are distinct operations. Trace real response semantics and permission checks rather than deriving success or entitlement from a clicked control.

### Inspect implementation and visual contracts relevant to the change

Follow `AGENTS.md` and `.prettierrc`: Pages Router, React function components, configured aliases, namespace imports, explicit props, React local state, and plain CSS Modules. Reuse existing dependencies, controls, layouts, typography, and modal infrastructure. Pass feature data and callbacks through props; reserve context for established global concerns.

For UI work or framework changes affecting rendering, inspect the actual design-system components, theme variables, fonts, spacing, sizing, and responsive rules in the affected composition. Preserve the five themes and established navigation. Trace loading, empty, error, success, focus, keyboard, mobile, and zoom behavior. Identify overlapping mutations, stale results, listener cleanup, and recovery after rejection. Keep product copy tied to what the interface actually does.

For graphics or lifecycle changes, trace `WaterFrame` into `createWater` and the affected modules. Understand coordinate spaces, shared geometry, shaders, simulation clocks, visibility, reduced motion, pointer interaction, texture loading, cancellation, context recovery, and disposal before changing them. Preserve the painting fallback and shared-resource lifetimes. A dependency task does not require an unrelated shader audit, simulation redesign, or benchmark framework.

Resolve routine decisions from the request, references, and source evidence. State material assumptions and ask a focused question only when missing information genuinely prevents further useful authorized work. Keep the selected task bounded while collecting enough context to implement it correctly.

## [NEXT WORK]

Can we make sure the package.json is updated to the latest versions and make sure it all works correctly.

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

### Mandatory owner rules

These owner rules are mandatory and take precedence over conflicting permissions elsewhere in this document or in optional skills.

- The owner makes every commit and is its sole author. Agents never create commits for the owner, impersonate the owner, add agent co-authorship, or execute commit instructions from skills. Leave changes for the owner to review and commit.
- The owner always performs final visual verification. Agents must still reason thoroughly about correctness and run meaningful automated tests and checks that are relevant and permitted. Report exact checks, failures, and remaining visual review; passing tests or screenshots never substitute for the owner's acceptance. Record remaining visual checks for the owner without pausing authorized implementation or reporting to wait for that review.
- Use the best available configured models and sufficient context, compute, and tokens for extensive, in-depth analysis and excellent implementation. Do not reduce rigor, skip relevant reading, truncate the solution, or downgrade models to save token usage. These projects are complex. Delegated agents must use the best configured parent-provider model and appropriate reasoning effort; do not choose cheaper or weaker models for interpreting skills. Wait for all delegated agents, collect and integrate their results, and finish the authorized task before returning the final report. A promise to pick up after background agents finish is not a final recap. Respect actual platform limits and report concrete gaps rather than claiming unlimited resources or expanding the authorized scope.
- NEXT WORK contains only the authorized task: requested behavior, scope, task-specific constraints, and intended result. PRE WORK contains preparation and source-reading instructions. POST WORK contains verification commands, documentation and skill maintenance, cleanup, reporting, owner review, and the stop protocol. Do not copy these standing workflow policies into NEXT WORK or turn them into extra tasks. Preserve explicit task requirements; when documentation or testing itself is the requested deliverable, it remains part of the task.
- The owner permits deleting package-lock.json during authorized repository work. Keep package.json clean and deliberate; preserve its carefully selected dependencies and version constraints except for updates required by the selected task. Do not require preserving or regenerating package-lock.json. This lockfile permission alone does not authorize unrelated installs, upgrades, other lockfile deletions, or changes to unrelated repositories; it does not cancel installation or upgrade authority already provided by the selected task. Check whether existing scripts require the lockfile and report any affected commands, such as npm ci.
- After successful NEXT WORK, update every affected document, instruction, skill, schema, example, and reference in the same work cycle. Inventory and audit ALL first-party Markdown files throughout the workspace, including nested and hidden instruction/skill folders and .md, .markdown, and .mdx files; never narrow the audit to a named shortlist. Cross-check the full documentation set against actual source code, callers, configuration, and tests at the depth needed for the selected task and affected claims. Do not require certification of unrelated implementation details or metrics as an invented completion gate. Reconcile stale information and investigate dead-code candidates with evidence; remove code only when it is verified unused and within the authorized scope. Preserve accurate content, read-only documents, credentials, dependencies, and nested repository boundaries. Report exact unread or unverified areas and distinguish measured facts from assumptions; do not claim complete reconciliation from a sample.
- Use PRE WORK to gather context and POST WORK to reconcile results, not as rigid serial permission gates. Make routine decisions from the evidence and continue independent authorized work. An unavailable nonessential check is a limitation to report, not a reason to halt the task. Stop only when no authorized task remains or a genuine blocker prevents further useful work. Respect actual permissions and task dependencies; never turn a missing optional check into an invented prerequisite. Do not end a run merely because one pass is done or many files have changed while useful authorized work remains. If a real platform, context, or time limit forces an incomplete ending, report the specific observed limit and continuation point instead of inventing an owner blocker.
- When an authorized task is genuinely blocked, preserve it in NEXT WORK and add a concise task-specific blocker under the exact heading `### Owner input required`: what prevents progress, the exact question or decision needed from the owner, and what remains to do after the answer. Continue any independent authorized work first. Do not replace unresolved work with No task selected. Keep generic workflow rules, completed-work reports, and unavailable nonessential checks out of NEXT WORK; those belong in POST WORK or the final recap. A reported limitation is not automatically a blocker. Waiting for your own delegated agents is not an owner question: wait for them, collect their reports, and continue the authorized task.
- After successful NEXT WORK, preserve any remaining authorized tasks. When none remain, replace the NEXT WORK body with exactly: No task selected. Then stop. A runner that continues until this phrase appears must treat it as the stop signal. Never invent follow-up work to keep a loop alive, and never launch another run yourself unless the controlling system explicitly authorizes it.
- Maintain documentation as an accurate account of the current implemented codebase. Do not append decision diaries, retrospective histories, superseded rationale, or records of past conversations after each task, and never treat hypothetical or remembered past decisions as evidence of current behavior. Keep legitimate planning files and named versions when they organize work, preserve compatibility, or describe what may come next; label proposals as plans, not implemented facts. Update or remove stale claims within the authorized scope. Historical narratives do not override current source, explicit requirements, or observed results.
- At the end of POST WORK, provide an exhaustive Markdown recap of this run. Begin with why the run ended: finished with No task selected., owner input required, remaining authorized work, failed, or stopped. State the evidence for that status, any exact owner question, and what remains; never equate a provider ending its turn with completing the task. Then cover: selected task and scope; every implemented change and affected file or interface; technical and design rationale for this run; exact tests and commands with results; failures, skipped checks, limitations, unresolved work, and owner visual-review needs; documentation changes; and the final NEXT WORK state. Distinguish observed facts from assumptions and never fabricate measurements or expose credentials. OS-Adjutant archives the report outside the project, under its private recaps folder beside SOUL.md and SELF.md, as {repo}-{date}-{time}-{change-name}.md with a unique run suffix. Return the complete report as the final response so the application can save it; do not create project-local history files or modify SOUL.md or SELF.md. This private run archive is evidence of that run, not a replacement for the current codebase as the source of truth.

