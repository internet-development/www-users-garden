# NEXT.md

This file is Users Garden’s control loop for autonomous runs. Read it top to bottom: complete [PRE WORK], execute [NEXT WORK], then complete [POST WORK]. Finish by writing one justified follow-up into [NEXT WORK] or restoring `No task selected.` The placeholder means stop; it is a complete outcome.

[NEXT WORK] is the only durable task handoff between runs. A current user instruction can supply or override the task. Git state, leftover files, remembered conversations, and an unfinished plan do not authorize work. Higher-priority session instructions and the current user’s explicit decisions take precedence over this file.

Adapted from `../www-set/NEXT.md` at the user’s request. This version preserves its evidence-first workflow, bounded task selection, source review, maintainer-owned runtime verification, documentation upkeep, and stopping rule. The intentional adaptations are Users Garden’s root `AGENTS.md` as the development contract, its account-management source map, and its API, session, credit, organization, and tenant workflows. Set’s simulation rules, public skill catalog, documentation machinery, and six-column layout do not apply here.

## [PRE WORK]

Use this section to gather the context the selected task needs. Start with instructions and the contracts the task affects, then read more source as the evidence requires. Preparation can run alongside independent authorized work. An unrelated documentation gap or an unavailable nonessential check does not block useful progress. Future task runs may replace only [NEXT WORK]. Changing [PRE WORK] or [POST WORK] requires a current user instruction to revise this control loop.

### Establish the task and repository boundaries

1. Read the current user request and [NEXT WORK]. Identify the requested behavior, scope, intended result, explicit exclusions, and compatibility constraints. A current user instruction can override the task recorded on disk. If neither selects any work, stop. Do not invent a task or pick a replacement from the repository. Keep unresolved authorized work separate from optional proposals.
2. Read applicable parent instructions and every first-party `AGENTS.md` in the workspace, including those in hidden directories. Read any referenced `DEVELOPMENT.md` or other owning contract before editing. Follow the deepest applicable instructions, within the current session's authority. Each repository's own instructions are its development contract. Do not import documentation structure or implementation rules from a sibling or reference repository unless its instructions say to. Exclude dependencies and unrelated nested Git repositories.
3. Before narrowing the source review, list the first-party architecture, source, tests, configuration, scripts, documentation, and skills. Include hidden directories and keep track of what you have actually read. Exclude `.git` internals, dependencies, generated or build output, binaries, and credentials. Do not follow symlinks or enter nested Git repositories implicitly. Name each excluded boundary explicitly instead of treating its contents as reviewed. Prioritize the selected task and its dependencies. Keep reading source until you understand the affected behavior and claims. You do not need to certify every unrelated source file unless the selected task explicitly asks for that audit. If a file cannot be read, or the full review exceeds the available context, state the exact gap instead of claiming complete coverage. Then continue any authorized work that does not depend on the missing information.
4. Identify the current edit boundaries from the current files and the user's instructions. Note which existing changes are relevant to the task and owned by the user, and keep them separate from the work you are about to do. Preserve unrelated and user-owned content. Do not infer tasks or intent from Git state. Do not inspect Git history, status, diffs, branches, or uncommitted changes where repository instructions prohibit it. If ownership or baseline provenance is uncertain, say so rather than attributing existing changes or failures to this task.
5. Review the available skill descriptions and inventory every first-party `SKILL.md`, including hidden skill directories. Carefully read each workflow and its applicability, and read supporting resources in depth when they are relevant. Distinguish developer workflows from public API guides, fixtures, vendored skills, and archived skills. Do not run a skill just because it exists. Apply only skills that fit the selected task and higher-priority instructions. A skill's existence does not authorize another workstream or an external action, and no skill overrides the owner-only commit policy.

### Read the complete documentation inventory

Recursively inventory and read every first-party `.md`, `.markdown`, and `.mdx` file across the workspace, including hidden instruction and skill folders. Do not rely only on an ignore-aware file listing, a previous inventory, or a shortlist of familiar files. Keep a coverage record that separates four states: files enumerated, contents fully read, claims checked against source, and exact areas still unread or unverified. If output is truncated, read the missing portion before marking the document as read. Respect boundaries for dependencies, generated files, symlinks, and nested Git repositories.

Re-enumerate the documentation on every run, because earlier inventories are starting points rather than coverage limits. Look for newly added documents and instructions. When relevant, read referenced non-Markdown contracts such as license, notice, or attribution files. Do not treat generated assets or dependency trees as first-party documentation.

Connect every document to the code that implements what it describes. Check the affected claims, local links, commands, examples, configuration, and ownership rules against the actual source and tests. In particular, separate:

- required setup from optional feature configuration
- synthetic, preview, or mock behavior from live-service behavior
- plans from implemented features

Identify known stale statements and the evidence [POST WORK] will need to reconcile them. Accurate documents do not need a gratuitous rewrite.

Covering whole documents does not mean certifying every unrelated algorithm, numerical claim, or lifecycle path. Mark unrelated claims that stay unverified precisely, and continue work that does not depend on them. Missing access to a sibling repository or live service is a coverage limitation unless the selected task actually depends on that evidence. Report precise coverage gaps and keep doing independent useful work. Do not turn documentation review into an unauthorized subsystem audit.

### Trace the affected implementation

After the required review of instructions, skills, and selected documentation, trace the affected source, tests, consumers, and transitive dependencies thoroughly. Use the file inventory to build a map from each concern to its owning entry points and modules. Typical concerns include:

- the development contract
- setup and dependencies
- formatting
- application bootstrap and global styling
- authentication and session handling
- feature composition and navigation
- shared controls and layouts
- global providers
- rendering or simulation subsystems
- tests
- external backends
- license and attribution

Trace the entry points, modules, state ownership, data flow, and external boundaries that [NEXT WORK] affects. Find the owner of the behavior, then read its actual callers, inputs, state transitions, styles, shared controls, tests, and affected consumers. Follow transitive dependencies wherever the contract is unclear, and keep reading wherever uncertainty remains. A file's existence or a single search hit is not enough to understand its behavior.

Find the closest established implementation pattern before designing a change. Identify the callers whose behavior must stay compatible. When a reference repository is explicitly named, inspect its actual source and styles within its own repository boundaries, and decide which of its behavior applies. Read a sibling or backend repository's own instructions before tracing its handlers, validation, authorization, or data models. References do not authorize unrelated changes.

Before proposing removal of apparently dead code, check direct callers, dynamic imports, file-based or convention-based routing, exported interfaces, scripts, tests, and other relevant entry points. Absence from one search does not prove the code is unused. A dependency update does not by itself authorize removing shared components or vendored utilities.

Keep implementation within the authorized task and any enabled owner maintenance policy.

### Establish dependency and tooling compatibility

Read the manifests and lockfiles that actually exist, along with compiler configuration, package scripts, and relevant automation, before choosing implementation steps. Remove obsolete prerequisites that point to missing files. Verify the installed runtime and the library interfaces the task uses. Distinguish:

- declared version ranges
- locked resolutions
- installed versions
- versions confirmed from the package registry

Do not call a version the latest just because it appears in the workspace. Reuse established dependencies.

For a dependency-update task:

- Inspect release information, engine requirements, peer dependencies, and the library interfaces the project actually uses.
- Update tightly coupled packages together, such as a framework and its runtime peers, matching type packages, compilers, loaders, and test-runner integrations.
- Keep deliberate dependency choices and range conventions unless the selected update requires a change.
- The task's authorization covers the necessary project-local installation and verification, unless an explicit owner or repository instruction forbids them. Use the authorization the task already supplies, and do not add a separate approval gate for routine steps.
- If repository instructions require explicit approval for new dependencies, follow that requirement.
- Do not install unrelated software, perform unrelated upgrades, or override an explicit prohibition.
- A change to the supported runtime contract still needs an owner decision when the task does not establish that policy. Identify that decision and continue independent work in the meantime.
- The owner permits deleting `package-lock.json`. Keep `package.json` dependencies deliberate.

Read the actual compatibility surfaces instead of assuming documented commands work:

- Compare each package script with the selected tool's actual CLI support, for example a lint script that depends on a subcommand a framework may have changed or removed. Find any existing lint, format, or test configuration before relying on it.
- Compare the manifest's runtime or engine declaration, the README setup instructions, and the runtime versions in automation with what the target packages require. Confirm that automation files sit where the CI system actually reads them before treating them as executed CI.
- Inspect the compiler configuration's target, module resolution, path aliases, strictness flags, and plugins. Do not weaken configuration to hide compatibility failures.
- Treat test loaders, build scripts, and other tooling that call compiler or library APIs directly as compatibility consumers, even when they sit outside the application bundle. Note what each existing test actually establishes and what it does not. For example, synthetic unit checks do not prove browser rendering or end-to-end flows.
- Find lockfile-dependent commands in scripts and automation, such as clean-install commands. Keep lockfile requirements separate from package installation choices. Do not assume a package can be removed just because its name appears only in the manifest or lockfile. Check tooling and transitive integration first.

For TypeScript work, inspect the existing compiler and lint configuration, input validation, type boundaries, and established patterns so the implementation fits the project.

### Record the baseline

Before making changes, inspect and record the current files and the relevant baseline behavior. Identify useful existing baseline checks and their prerequisites. Run them when permitted, so you can separate pre-existing failures from new regressions. Repair failures that the enabled owner maintenance policy covers, and preserve user edits. Keep checks relevant to the selected change. Neither a missing general test suite nor an unavailable optional tool authorizes a new testing-infrastructure workstream.

### Understand the contracts that must remain compatible

- **Security boundaries:** Identify the authentication, authorization, secret handling, input validation, filesystem access, and external side effects the task touches. Preserve least privilege. Keep credentials and secrets out of prompts, source, logs, examples, and tests. Keep decryption and secret material on the side of the boundary the project assigns it to.
- **API, authentication, data, or migration work:** Inspect validation, permissions, response schemas, persistence guarantees, fixtures, and every affected consumer.
  - Trace each changed action from its UI or caller through state, the client request helper, the backend handler, the response consumer, and the refresh behavior.
  - Inspect each operation's method, headers, body, expected response shape, and error handling.
  - Shared request helpers may have different failure contracts. Do not flatten a failure into a successful empty result.
  - Before assuming an API limitation or adding a client-side workaround, follow unclear contracts into the owning backend, within that repository's instructions and your actual permissions.
  - Distinguish public usage guides from development instructions, and documented backend guarantees from illustrative workflows.
  - Consult current official online documentation through applicable skills.
  - Preserve existing records and secrets.
- **Routing and sessions:** Preserve the established routing model and session coherence across sign-in, third-party authorization callbacks, credential regeneration, sign-out, and later requests. Do not migrate routers or add new authenticated routes without a selected task. Make sure public or preview entry points with local-only behavior do not pick up live side effects through changes to shared components.
- **Permission and target identity:** Distinguish account tiers from membership roles. Keep identifiers of different entity types distinct. Inspect stale selections and asynchronous responses when changing flows that switch between targets. UI visibility is not backend authorization.
- **Consequential actions:** For mutations involving money, credits, messaging, subscriptions, billing, approvals, administrative changes, or deletion, preserve units, signs, recipients, balances, and the constants that own links and thresholds. Preserve existing confirmation and target-identification behavior. Inspect duplicate submissions, recovery after rejection, validation of successful responses, and refresh paths. Treat related operations as distinct, and trace real response semantics and permission checks instead of inferring success or entitlement from a clicked control.
- **Authorization for side effects:** A skill alone does not authorize live-service calls, migrations, or deployment. Explicit task or owner authorization does authorize the operations it states. Reuse that authorization without adding another permission gate, and keep to any read-only or other side-effect limits it sets. Access to a system does not by itself authorize sending messages, making transfers, changing accounts, running migrations, or deploying.

### Inspect implementation and visual contracts relevant to the change

Follow the repository's documented conventions and formatter configuration: routing model, component style, import style, path aliases, prop typing, state management, and styling approach. Reuse existing dependencies, controls, layouts, typography, and modal or overlay infrastructure. Pass feature data and callbacks the way the project already does, and reserve global context for concerns that are already established as global.

For UI work, or framework changes that affect rendering, inspect the actual design-system components, tokens, theme variables, typography, spacing, sizing, layout rhythm, interaction states, and responsive rules in the affected composition. Also inspect the closest reference implementation. Preserve the application's routing and styling conventions, supported themes, and established navigation. Identify the existing loading, error, empty, success, focus, keyboard, mobile, zoom, and responsive states that are relevant. Identify overlapping mutations, stale results, listener cleanup, and recovery after rejection. Keep product copy tied to what the interface actually does.

For native, graphics, animation, or physics work, trace the affected subsystem from its component entry point into its modules. Before changing anything, understand coordinate spaces, resource ownership, shared geometry, shaders, simulation clocks, visibility, reduced motion, pointer interaction, asset loading, cancellation, context recovery, and teardown. Preserve visual fidelity, simulation semantics, fallbacks, and shared-resource lifetimes. Do not introduce unrelated benchmark or rendering infrastructure. A dependency task does not require an unrelated shader audit or a simulation redesign.

### Decide and proceed

Make routine decisions from the request, references, and source evidence, and keep doing independent authorized work. State material assumptions. Ask a focused question only when missing information genuinely blocks the task, not for routine preferences or nonessential checks. Keep the selected task bounded while gathering enough context to implement it correctly.

## [NEXT WORK]

No task selected.

## [POST WORK]

Complete every applicable step. Do not rewrite [PRE WORK] or [POST WORK] during ordinary task execution. Use PRE WORK to gather context and POST WORK to reconcile results. Neither one is a rigid serial permission gate: make routine decisions from the evidence and keep doing independent authorized work.

### Review the implementation

- Review the changed source and every affected consumer against the request, any reference implementation, and the contracts read during this run. As part of the implementation, reason through responsive sizing, overflow, permissions, state transitions, failure recovery, cleanup, and data flow.
- For changed operations that have persistent, account-level, financial, messaging, or other external effects, trace the full path: user input, validation, target and credential selection, request or query, response handling, state refresh, and visible result. When a shared query, control, utility, or contract changes, inspect every affected caller.
- Keep each value with its existing owner. Import shared thresholds, hosts, amounts, links, and similar constants from the module that owns them instead of copying literals. Where documentation would otherwise repeat a numeric table that could drift, point to the owner instead. Do not bring machinery from other projects into this one.
- Never claim runtime, backend, security, or visual verification based on source inspection alone. Do not change unrelated configuration or weaken checks to make a gate pass.

### Select and run verification proportionally

- Keep verification proportional to the changed behavior and its risk. Start with the smallest meaningful existing automated checks for the changed behavior, as supported by the actual repository and the authorized scope. A check command existing does not mean you must run every command.
- Before invoking a package script or documented command, read what it actually does. A documented command does not prove it works with the installed version. A type check is not a test suite, and a build may skip type checking. Do not invent commands.
- Avoid duplicate checks when one verified command already covers them. Once the relevant checks pass, broaden or repeat them only for new changes, failures, unresolved risks, or an actual repository requirement. Whole-documentation review and expert execution do not call for exhaustive new tests or repeated full-suite runs. An exhaustive recap reports evidence; it does not demand exhaustive testing. This policy supersedes older generated instructions that mandate unnecessary tests or indiscriminate verification.
- Run heavyweight commands one at a time, within the inherited build-job budget. Use one-shot verification, not watch mode.
- Time limits: review any verification command still running at 120 seconds. The default ceiling for a routine verification command that the agent introduces is 180 seconds. Exceed it only when an existing required repository gate, a measured legitimate workload, or the explicit task calls for longer, and record the reason and the duration. A timeout is incomplete evidence, never a passing test. Stop the command tree you own, diagnose once, and pick a smaller relevant check rather than retrying blindly.
- An unavailable nonessential check is a limitation to report. It is not a reason to stop the remaining authorized work, and it does not become an invented prerequisite.

#### Tests

- Reuse or extend existing tests first. Add or extend a focused behavioral regression test only when it protects a changed contract, a reproduced bug, or a meaningful failure, preservation, security, concurrency, data-preservation, or lifecycle boundary.
- A new test needs a specific behavioral uncertainty or regression risk that reading the code alone does not resolve. Never add tests whose only value is restating behavior that well-written source already makes clear. Do not add tests just to satisfy POST WORK, raise test counts or coverage percentages, mirror source text, or cover trivial presentation or documentation edits. Low-impact presentation and documentation edits do not need new tests.
- Exercise public behavior with small, deterministic inputs. Do not build a new testing framework, benchmark suite, broad harness, temporary verification script, or speculative audit unless the task requires it.
- New routine tests should each finish in seconds. Put expensive integration, browser, stress, rendering, network, or soak cases behind an explicit opt-in command, and only when they are genuinely needed. Keep costly diagnostics opt-in. Do not add sleeps or long polling just to make a test pass.
- Keep required existing checks and security and preservation coverage. Never delete, disable, weaken, or fake tests to meet a time target.

#### Type checking, formatting, and linting

- If the affected language has a configured type-check command and the relevant check has not already covered it, run that actual command with its existing compiler settings. Fix errors the change introduced, plus pre-existing failures that the enabled owner maintenance policy covers. Do not hide errors with broad casts, `any`, exclusions, or disabled compiler checks.
- Use the repository's pinned formatter and linter. Limit edits to the authorized task and the enabled owner maintenance, and report the exact results. Do not suppress warnings to get the gate to pass.

#### Build

- Build the affected target once, with a verified command and environment, when a build is relevant, authorized, and not already covered by a successful required check. Before running it, identify build hooks and any generated-file side effects.
- Fix build failures and missing resources that the enabled owner maintenance policy covers, including verified pre-existing failures. A successful build is not live acceptance; keep the two separate.

#### External APIs and live services

- Check the latest official online documentation for any external APIs, SDKs, authentication, and service behavior relevant to the selected task, using applicable skills. Reading public documentation needs no extra approval.
- When the task or owner explicitly authorizes them, run the specified external API calls and live verification, including authenticated read-only checks. Honor authorization already given instead of asking again, and stay within the authorized operations and side-effect limits.
- If authorization is genuinely missing or conflicting, confirm the specific service, operations, and effects once before making the dependent calls. Continue independent work in the meantime.
- Do not let generic POST WORK or skill cautions about live services become a blanket ban that defeats an explicitly authorized test. Keep the actual task-specific limits: permission to read does not authorize sending messages or emails, transfers, membership or subscription changes, key rotation, account deletion, configuration changes, deployment, purchases, or other writes. Building such a flow and performing the external action are separate scopes. Never run irreversible external actions as a casual smoke test.
- Keep credentials out of all output. Report exactly what remote reads establish and what still needs a separately authorized end-to-end test. Do not infer deployed configuration from local environment values.

#### Deterministic generation, simulations, and mirrored implementations

- If deterministic generation, simulations, or mirrored implementations change, verify the relevant seeds, content versions, clocks, serialization, output parity, and invariants with focused, permitted checks.
- Keep cosmetic randomness separate from outcomes. Distinguish exact results from samples and assumptions.

#### Performance and resources

- If the task changes a performance-sensitive path and measurement is authorized, measure with representative inputs and existing tools. Otherwise, reason through the hot-path cost and report any performance claims as unmeasured.
- Where relevant, check memory, process cleanup, network use, and long-running work. Report observed measurements and any regressions.

#### Accessibility and visual review

- Review keyboard navigation, focus, accessible names, contrast, reduced motion, sizing, overflow, and the affected interaction states. Where permitted, use relevant automated accessibility or behavior checks.
- Give the owner concrete visual review points. The owner does the final visual verification. Do not claim owner visual acceptance, and do not build new screenshot infrastructure just to stand in for it.

### Dependencies and routine maintenance

- Read version constraints from the current manifest. Authorized tasks may upgrade versions. Keep explicit owner or task-specific compatibility constraints, and treat them as distinct from stale descriptions of the current baseline.
- Routine maintenance in the selected repository is already authorized during an authorized task:
  - correct verified stale facts in NEXT.md, instructions, documentation, examples, and configuration;
  - fix build or test failures you encounter;
  - investigate reported security findings and apply appropriate local fixes;
  - make justified project or dependency version bumps under the repository's versioning rules.
- Do not leave known false statements in place just because they sit outside the primary feature, and do not ask for fresh permission for these repairs.
- Before changing a claim, compare it against current source, manifests, scripts, and trusted advisories. Read referenced files only if they exist. Remove obsolete prerequisites that point to missing files, including package-lock.json references when that file is absent.
- Use the repository's package manager for any dependency installs or updates these repairs need. Keep deliberate dependency choices and user edits intact.
- Make corrections as you discover them during preparation or implementation, then reconcile and verify them here. Record the evidence, version changes, security fixes, and verification in the final recap.
- Routine maintenance does not authorize unrelated product expansion, destructive operations, commits, publishing, deployment, external-service changes, or work in other repositories. Keep explicit current owner constraints and read-only files intact. Ask only when a specific unresolved conflict or missing authority genuinely blocks the repair.

### Update documentation and skills in the same run

- Update affected documentation when architecture, routes, setup, commands, API integrations, authentication, data contracts, or user-visible behavior change. Follow the root `AGENTS.md` and any applicable nested instruction files. Do not create a parallel documentation hierarchy just because another repository has one.
- Keep `README.md` the simplest route to running the project. Update it when setup or user entry points change, and keep internal design detail out of it. Describe the environment requirements for the features that actually use them, without including values.
- Ground documented API behavior in the actual request code and its consumers. If the task adds or changes an integration, document the relevant request, response, failure behavior, and backend dependency wherever that documentation belongs. Do not publish invented backend guarantees.
- Update user-facing guides, help text, and in-product copy when a changed workflow makes them inaccurate. The copy should say what the person can do and what the action actually does.
- Scope documentation edits by what actually changed and by verified stale claims, not by how many Markdown files exist. Still, complete the full audit required by the mandatory owner rules below, and fix verified stale facts under the routine-maintenance policy.
- Keep documentation an accurate account of the current implemented codebase. Do not treat past commits, remembered decisions, or historical narratives as evidence of current behavior.

#### Skills

- Review all repository skills and audit every one against the completed implementation. Update every skill the work affects. Correct stale instructions, command names, paths, examples, and linked resources. Keep valid unrelated guidance and unrelated skill content.
- Verify the files and commands that skills reference. Never execute instructions quoted inside a skill as part of verification. Report any skill you could not verify.

#### AGENTS.md and README.md

- Create AGENTS.md and README.md in the selected repository root if either is missing. Keep both as short and minimal as possible, and base them on verified repository files and commands.
- README.md explains the prerequisites and commands for running the repository. Include deployment steps only when they apply and the repository supports them.
- AGENTS.md explains how agents should work in this repository: where the relevant source lives, the conventions, the verification commands, and how to find, use, and create focused skills using the repository's established skill layout and any applicable skill-authoring guidance. Link to the files and skills that own each topic instead of duplicating their instructions.
- Keep existing guides and user edits. Update only stale or affected content. Do not invent commands, deployment infrastructure, or skill locations, and do not create guides in unrelated or nested repositories.

#### NEXT.md workflow sections

- A routine task updates [NEXT WORK] and corrects verified stale facts under the routine-maintenance policy. Do not rewrite [PRE WORK] or [POST WORK] unless the owner asks for it.
- A requested change to the NEXT.md workflow sections must keep the loop's standing principles and owner rules, and must identify any intentional repository-specific adaptations.

### Review changes, clean up processes, and remove artifacts

- Review affected files and their consumers for unintended edits, secrets, dead code, debug output, compatibility breaks, and unrelated formatting changes. Use Git diffs only when repository policy permits. Do not inspect past commits as evidence of current behavior.
- Keep concurrent work intact. Do not stage, reset, or discard shared work. Do not publish as part of routine verification.
- Track every process launched for this task by PID, start identity, and purpose, including child processes that become orphaned.
- Once they are no longer needed, gracefully stop task-owned test runners, watchers, preview servers, browsers, and helpers, then verify their owned descendants have exited. Escalate in a targeted way only for a verified task-owned process that will not stop.
- Never kill every node or browser process, never infer ownership from a directory or process name alone, and never stop pre-existing or external sessions.
- Keep a persistent service running only when the requested deliverable needs it, and report its purpose and how the owner can stop it.
- Put disposable fixtures, scripts, screenshots, traces, profiles, logs, downloads, and experimental harnesses in a system temporary directory or an established ignored artifact location.
- Before the final report, remove task-created disposable outputs and any excess helper software that is not an intended deliverable. Keep useful focused regression tests, required fixtures, requested review artifacts, and deliberate project dependencies.
- Where repository policy permits, review affected files and untracked paths and compare them with the pre-task baseline. Name any remaining artifacts explicitly.
- Git status alone does not prove ownership. Leave user changes and unfamiliar or pre-existing files alone, and report uncertain leftovers instead of deleting them.
- Do not add ignore rules just to hide accidental debris. Do not stage or commit files as part of cleanup.
- Explain any cleanup failure, or any process or artifact you deliberately kept, in the private recap rather than in repository run diaries.

### Update NEXT WORK and know when to stop

- After NEXT WORK succeeds, keep any remaining authorized tasks in NEXT WORK, accurate enough that a fresh session can continue from repository files alone.
- Draw a continuation only from the completed task, the current owner request, and evidence gathered for that task. That evidence can include client or backend source and relevant production observations made under access documented in `AGENTS.md`; backend files need not have been edited to establish a concrete API problem. If the next change belongs in a different repository, name that repository instead of editing it. Do not use git state, stale memory, an unrelated backlog, or an unselected plan to keep the loop running.
- A recorded continuation must identify:
  1. The concrete remaining problem and the evidence that it exists.
  2. The bounded change and the owning files it affects.
  3. The measurable result for the owner to review.
  4. Compatibility boundaries and a clear stopping condition.
- Record only authorized, regression-safe continuations, each one independently complete. Do not manufacture cleanup, polish, speculative safeguards, arbitrary assessments, or feature work that the owner reserved for later.
- When no authorized task remains (the current request is satisfied, the selected plan is complete, or the only candidates are speculative), replace the NEXT WORK body with exactly: No task selected. Then stop. Do not start another run yourself unless the controlling system explicitly authorizes it.
- If a necessary requirement is genuinely blocked, follow the blocker protocol in the mandatory owner rules below. Do not mark incomplete work complete or swap in an unrelated task. An essential question is not permission to invent the answer.

### Close the current request honestly

- Summarize the changes, the verification, and any remaining blockers. Say what changed and how it serves the requested result, and link the relevant local files.
- Record the changed behavior, the exact verification commands and their results, known limitations, and the next manual review step.
- Separate implemented behavior from follow-up ideas, source review from runtime verification, and tests from behavior observed live. Report only commands and results that actually ran, along with blocked or unrun checks and material limitations.
- Do not use unsupported readiness percentages, and do not describe a planned feature as complete.

### Mandatory owner rules

These owner rules are mandatory. They take precedence over conflicting permissions anywhere else in this document or in optional skills.

- The owner makes every commit and is its sole author. Agents never create commits for the owner, impersonate the owner, add agent co-authorship, or execute commit instructions from skills. Leave changes for the owner to review and commit.
- The owner always performs final visual verification. Agents must still reason thoroughly about correctness and run meaningful automated checks relevant to the changed behavior, following the focused-verification policy. Final visual review is not an instruction to create new tests or screenshot infrastructure. Report exact checks, failures, and remaining visual review. Passing tests or screenshots never substitute for the owner's acceptance. Record remaining visual checks for the owner without pausing authorized implementation or reporting to wait for that review.
- Use the best available configured models and enough context, compute, and tokens for extensive, in-depth analysis and excellent implementation. Do not reduce rigor, skip relevant reading, truncate the solution, or downgrade models to save tokens. These projects are complex. Delegated agents must use the best configured parent-provider model with appropriate reasoning effort; do not choose cheaper or weaker models for interpreting skills. Wait for all delegated agents, collect and integrate their results, and finish the authorized task before returning the final report. A promise to pick up after background agents finish is not a final recap. Keep to the verification and resource budgets: expert execution does not mean maximum parallelism, exhaustive new tests, or repeated checks. Respect actual platform limits and report concrete gaps rather than claiming unlimited resources or expanding the authorized scope.
- NEXT WORK contains only the authorized task: requested behavior, scope, task-specific constraints, and intended result. PRE WORK contains preparation and source-reading instructions. POST WORK contains verification commands, documentation and skill maintenance, cleanup, reporting, owner review, and the stop protocol. Do not copy these standing workflow policies into NEXT WORK or turn them into extra tasks. Keep explicit task requirements; when documentation or testing is itself the requested deliverable, it stays part of the task.
- The owner permits deleting package-lock.json during authorized repository work. Keep package.json clean and deliberate, and keep its carefully selected dependency modules. Read version constraints from the current manifest; authorized tasks may upgrade versions. Keep explicit owner or task-specific compatibility constraints. Do not require preserving or regenerating package-lock.json. This lockfile permission alone does not authorize unrelated installs, upgrades, other lockfile deletions, or changes to unrelated repositories, and it does not cancel installation or upgrade authority the selected task already provides. Check whether existing scripts require the lockfile and report any affected commands, such as npm ci.
- After NEXT WORK succeeds, update every affected document, instruction, skill, schema, example, and reference in the same work cycle. Inventory and audit ALL first-party Markdown files throughout the workspace, including nested and hidden instruction and skill folders and .md, .markdown, and .mdx files; never narrow the audit to a named shortlist. Cross-check the full documentation set against actual source code, callers, configuration, and tests, at the depth the selected task and affected claims need. Do not require certification of unrelated implementation details or metrics as an invented completion gate. Reconcile stale information and investigate dead-code candidates with evidence; remove code only when it is verified unused and within the authorized scope. Keep accurate content, read-only documents, credentials, dependencies, and nested repository boundaries intact. Report exactly which areas went unread or unverified, and distinguish measured facts from assumptions; do not claim complete reconciliation from a sample.
- Use PRE WORK to gather context and POST WORK to reconcile results, not as rigid serial permission gates. Make routine decisions from the evidence and continue independent authorized work. An unavailable nonessential check is a limitation to report, not a reason to halt the task. Stop only when no authorized task remains or a genuine blocker prevents further useful work. Respect actual permissions and task dependencies, and never turn a missing optional check into an invented prerequisite. Do not end a run just because one pass is done or many files have changed while useful authorized work remains. If a real platform, context, or time limit forces an incomplete ending, report the specific observed limit and the continuation point instead of inventing an owner blocker.
- When an authorized task is genuinely blocked, keep it in NEXT WORK and add a concise task-specific blocker under the exact heading `### Owner input required`. State what prevents progress, the exact question or decision needed from the owner, and what remains to do after the answer. Do any independent authorized work first. Use the interactive owner-question tool when it is available. If interactive input is unavailable, keep the exact question and the remaining task in NEXT WORK, tell the owner to add the answer there and start a fresh RUN, and end the run instead of waiting on a response channel that does not exist. Do not replace unresolved work with No task selected. Keep generic workflow rules, completed-work reports, and unavailable nonessential checks out of NEXT WORK; those belong in POST WORK or the final recap. A reported limitation is not automatically a blocker. Waiting for your own delegated agents is not an owner question: wait for them, collect their reports, and continue the authorized task.
- After NEXT WORK succeeds, keep any remaining authorized tasks. When none remain, replace the NEXT WORK body with exactly: No task selected. Then stop. A runner that continues until this phrase appears must treat it as the stop signal. Never invent follow-up work to keep a loop alive, and never launch another run yourself unless the controlling system explicitly authorizes it.
- Maintain documentation as an accurate account of the current implemented codebase. Do not append decision diaries, retrospective histories, superseded rationale, or records of past conversations after each task, and never treat hypothetical or remembered past decisions as evidence of current behavior. Keep legitimate planning files and named versions when they organize work, preserve compatibility, or describe what may come next, and label proposals as plans, not implemented facts. Update or remove verified stale claims under the enabled routine-maintenance policy; do not keep obsolete facts as if they were current requirements. Historical narratives do not override current source, explicit requirements, or observed results.
- At the end of POST WORK, provide an exhaustive Markdown recap of this run:
  - Begin with why the run ended: finished with No task selected., owner input required, remaining authorized work, failed, or stopped. Give the evidence for that status, any exact owner question, and what remains. Never treat a provider ending its turn as completing the task.
  - Next, summarize what went well and what material concerns remain, following the application-provided completion summary format and explaining its completed/total deliverable counts. Never invent a completion percentage.
  - Then cover: the selected task and scope; every implemented change and each affected file or interface; the technical and design rationale for this run; exact tests and commands with their results; failures, skipped checks, limitations, unresolved work, and owner visual-review needs; documentation changes; and the final NEXT WORK state.
  - Distinguish observed facts from assumptions. Never fabricate measurements or expose credentials.
  - OS-Adjutant archives the report outside the project, in its private recaps folder beside SOUL.md and SELF.md, as {repo}-{date}-{time}-{change-name}.md with a unique run suffix. Return the complete report as the final response so the application can save it. Do not create project-local history files or modify SOUL.md or SELF.md.
  - This private run archive is evidence of that run. It does not replace the current codebase as the source of truth.

### Selected owner rules

These owner rules reflect the checked POST WORK options.

- Keep verification proportional to the changed behavior and risk. First use the smallest relevant existing test/check selection. Add or extend a focused regression test only when it protects a changed contract, a reproduced bug, or a meaningful preservation, security, concurrency, or lifecycle boundary. Never add tests whose only value is restating behavior already clear from well-written source code. A new test needs a specific behavioral uncertainty or regression risk that inspection alone does not resolve. Do not add tests just to satisfy POST WORK, increase test counts or coverage percentages, mirror source text, or test trivial presentation/documentation edits. Do not create a new testing framework or benchmark suite unless the task requires it. New routine individual tests should finish in seconds; expensive integration, browser, stress, rendering, network, or soak cases belong behind an explicit opt-in command when genuinely needed. Do not add sleeps or long polling merely to make a test pass. Review a verification command still running at 120 seconds; use 180 seconds as the default ceiling for an agent-introduced routine verification command unless an existing required repository gate, measured legitimate workload, or explicit task calls for longer. Record the reason and duration of an exception. A timeout is incomplete evidence, never a passing test; stop the owned command tree, diagnose once, and choose a smaller relevant check rather than blindly retrying. Preserve required existing checks and security/preservation coverage; never delete, disable, weaken, or fake tests to meet a time target. Run heavyweight commands sequentially within the inherited build-job budget. Avoid duplicate checks when one verified command already covers them. After relevant checks pass, broaden or repeat only for new changes, failures, unresolved risks, or an actual repository requirement. Whole-documentation review and expert execution do not require exhaustive new tests or repeated full-suite runs. An exhaustive recap reports evidence; it is not a demand for exhaustive testing. This policy supersedes older generated instructions that mandate unnecessary tests or indiscriminate verification.
- Before finishing POST WORK, reconcile task-owned processes and artifacts. Track processes launched for this task by PID, start identity, and purpose, including child processes that become orphaned. Use one-shot verification rather than watch mode. Gracefully stop task-owned test runners, watchers, preview servers, browsers, and helpers once they are no longer needed, then verify their owned descendants have exited; use targeted escalation only for a verified task-owned process that will not stop. Never kill every node/browser process, infer ownership merely from a directory/name, or stop pre-existing/external sessions. Retain a persistent service only when the requested deliverable needs it and report its purpose and how the owner can stop it. Put disposable fixtures, scripts, screenshots, traces, profiles, logs, downloads, and experimental harnesses in a system temporary directory or an established ignored artifact location. Remove task-created disposable outputs and excess helper software that are not intended deliverables before the final report. Keep useful focused regression tests, required fixtures, requested review artifacts, and deliberate project dependencies. Review affected files and untracked paths when repository policy permits, compare them with the pre-task baseline, and identify remaining artifacts explicitly. Git status alone does not prove ownership: preserve user changes and unfamiliar/pre-existing files, and report uncertain leftovers instead of deleting them. Do not add ignore rules merely to hide accidental debris, stage files, or commit as part of cleanup. Explain any cleanup failure or intentionally retained process/artifact in the private recap rather than leaving repository run diaries.
- The owner always performs final visual verification. Agents must still reason thoroughly about correctness and run meaningful automated checks relevant to the changed behavior, following the focused-verification policy. Final visual review is not an instruction to create new tests or screenshot infrastructure. Report exact checks, failures, and remaining visual review; passing tests or screenshots never substitute for the owner's acceptance. Record remaining visual checks for the owner without pausing authorized implementation or reporting to wait for that review.
- Use the best available configured models and sufficient context, compute, and tokens for extensive, in-depth analysis and excellent implementation. Do not reduce rigor, skip relevant reading, truncate the solution, or downgrade models to save token usage. These projects are complex. Delegated agents must use the best configured parent-provider model and appropriate reasoning effort; do not choose cheaper or weaker models for interpreting skills. Wait for all delegated agents, collect and integrate their results, and finish the authorized task before returning the final report. A promise to pick up after background agents finish is not a final recap. Preserve verification and resource budgets; expert execution does not mean maximum parallelism, exhaustive new tests, or repeated checks. Respect actual platform limits and report concrete gaps rather than claiming unlimited resources or expanding the authorized scope.
- NEXT WORK contains only the authorized task: requested behavior, scope, task-specific constraints, and intended result. PRE WORK contains preparation and source-reading instructions. POST WORK contains verification commands, documentation and skill maintenance, cleanup, reporting, owner review, and the stop protocol. Do not copy these standing workflow policies into NEXT WORK or turn them into extra tasks. Preserve explicit task requirements; when documentation or testing itself is the requested deliverable, it remains part of the task.
- The owner permits deleting package-lock.json during authorized repository work. Keep package.json clean and deliberate; preserve its carefully selected dependency modules. Read version constraints from the current manifest instead of freezing them in generated PRE WORK; authorized tasks may upgrade versions. Retain explicit owner or task-specific compatibility constraints. Do not require preserving or regenerating package-lock.json. This lockfile permission alone does not authorize unrelated installs, upgrades, other lockfile deletions, or changes to unrelated repositories; it does not cancel installation or upgrade authority already provided by the selected task. Check whether existing scripts require the lockfile and report any affected commands, such as npm ci.
- Consult the latest official online documentation for external APIs, SDKs, authentication and service behavior relevant to the selected task, using applicable skills. Reading public documentation does not require an additional approval. Explicit task or owner authorization permits the specified external API calls and live verification, including authenticated read-only checks; honor authorization already given instead of asking again. When authorization is genuinely missing or conflicting, confirm the specific service, operations and effects once before the dependent calls, while continuing independent work. Do not turn generic POST WORK or skill cautions about live services into a blanket prohibition that defeats an explicitly authorized test. Reconcile superseded generic restrictions in the regenerated POST WORK while preserving actual task-specific limits: permission to read does not authorize SMS sends, configuration changes, deployment, purchases, or other writes. Keep credentials out of output. Report exactly what remote reads establish and what still requires a separately authorized end-to-end test; do not infer deployed configuration from local environment values.
- During an authorized task, routine maintenance in the selected repository is already authorized: correct verified stale facts in NEXT.md, instructions, documentation, examples, and configuration; repair build or test failures encountered; investigate reported security findings and apply appropriate local fixes; and make justified project or dependency version bumps under the repository's versioning rules. Do not leave known false statements untouched merely because they are outside the primary feature, or ask for renewed permission for these repairs. Compare current source, manifests, scripts, and trusted advisories before changing a claim. Read referenced files only when they exist; remove obsolete missing-file prerequisites, including package-lock.json references when that file is absent. Preserve explicit compatibility targets and distinguish them from stale descriptions of the current baseline. Use the repository's package manager for dependency installation or updates needed by these repairs, preserving deliberate dependency choices and user edits. Make corrections when discovered during preparation or implementation, then reconcile and verify them during POST WORK. Record the evidence, version changes, security fixes, and verification in the final recap. This does not authorize unrelated product expansion, destructive operations, commits, publishing, deployment, external-service changes, or work in other repositories. Preserve explicit current owner constraints and read-only files; ask only when a specific unresolved conflict or missing authority genuinely blocks the repair.
- After successful NEXT WORK, update every affected document, instruction, skill, schema, example, and reference in the same work cycle. Inventory and audit ALL first-party Markdown files throughout the workspace, including nested and hidden instruction/skill folders and .md, .markdown, and .mdx files; never narrow the audit to a named shortlist. Cross-check the full documentation set against actual source code, callers, configuration, and tests at the depth needed for the selected task and affected claims. Do not require certification of unrelated implementation details or metrics as an invented completion gate. Reconcile stale information and investigate dead-code candidates with evidence; remove code only when it is verified unused and within the authorized scope. Preserve accurate content, read-only documents, credentials, dependencies, and nested repository boundaries. Report exact unread or unverified areas and distinguish measured facts from assumptions; do not claim complete reconciliation from a sample.
- During POST WORK, create AGENTS.md and README.md in the selected repository root if either is missing. Keep both as concise and minimal as possible, grounded in verified repository files and commands. README.md explains the prerequisites and commands to run the repository, plus deployment steps only when applicable and supported by the repository. AGENTS.md explains how agents should work in this repository: relevant source locations, conventions, verification commands, and how to find, use, and create focused skills using the repository's established skill layout and applicable skill-authoring guidance. Link to owning files and skills instead of duplicating instructions. Preserve existing guides and user edits; update only stale or affected content. Do not invent commands, deployment infrastructure, or skill locations, and do not create guides in unrelated or nested repositories.
- Use PRE WORK to gather context and POST WORK to reconcile results, not as rigid serial permission gates. Make routine decisions from the evidence and continue independent authorized work. An unavailable nonessential check is a limitation to report, not a reason to halt the task. Stop only when no authorized task remains or a genuine blocker prevents further useful work. Respect actual permissions and task dependencies; never turn a missing optional check into an invented prerequisite. Do not end a run merely because one pass is done or many files have changed while useful authorized work remains. If a real platform, context, or time limit forces an incomplete ending, report the specific observed limit and continuation point instead of inventing an owner blocker.
- When an authorized task is genuinely blocked, preserve it in NEXT WORK and add a concise task-specific blocker under the exact heading `### Owner input required`: what prevents progress, the exact question or decision needed from the owner, and what remains to do after the answer. Continue any independent authorized work first. Use the interactive owner-question tool when available. If interactive input is unavailable, preserve the exact question and remaining task in NEXT WORK, tell the owner to add the answer there and start a fresh RUN, and end the run instead of waiting for an unavailable response channel. Do not replace unresolved work with No task selected. Keep generic workflow rules, completed-work reports, and unavailable nonessential checks out of NEXT WORK; those belong in POST WORK or the final recap. A reported limitation is not automatically a blocker. Waiting for your own delegated agents is not an owner question: wait for them, collect their reports, and continue the authorized task.
- After successful NEXT WORK, preserve any remaining authorized tasks. When none remain, replace the NEXT WORK body with exactly: No task selected. Then stop. A runner that continues until this phrase appears must treat it as the stop signal. Never invent follow-up work to keep a loop alive, and never launch another run yourself unless the controlling system explicitly authorizes it.
- Maintain documentation as an accurate account of the current implemented codebase. Do not append decision diaries, retrospective histories, superseded rationale, or records of past conversations after each task, and never treat hypothetical or remembered past decisions as evidence of current behavior. Keep legitimate planning files and named versions when they organize work, preserve compatibility, or describe what may come next; label proposals as plans, not implemented facts. Update or remove verified stale claims using the enabled routine-maintenance policy; do not preserve obsolete facts as if they were current requirements. Historical narratives do not override current source, explicit requirements, or observed results.
- At the end of POST WORK, provide an exhaustive Markdown recap of this run. Begin with why the run ended: finished with No task selected., owner input required, remaining authorized work, failed, or stopped. State the evidence for that status, any exact owner question, and what remains; never equate a provider ending its turn with completing the task. Then summarize what went well and what material concerns remain, following the application-provided completion summary format and explaining its completed/total deliverable counts. Never invent a completion percentage. Then cover: selected task and scope; every implemented change and affected file or interface; technical and design rationale for this run; exact tests and commands with results; failures, skipped checks, limitations, unresolved work, and owner visual-review needs; documentation changes; and the final NEXT WORK state. Distinguish observed facts from assumptions and never fabricate measurements or expose credentials. OS-Adjutant archives the report outside the project, under its private recaps folder beside SOUL.md and SELF.md, as {repo}-{date}-{time}-{change-name}.md with a unique run suffix. Return the complete report as the final response so the application can save it; do not create project-local history files or modify SOUL.md or SELF.md. This private run archive is evidence of that run, not a replacement for the current codebase as the source of truth.

