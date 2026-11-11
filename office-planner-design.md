# Office layout planning

## Problem

The live floor plan combines assignments and geometry. Its editor saves individual desk mutations. Planning must not mutate that data while exploring alternatives, and a fixed rectangle behind every chair is not a circulation model. Desk positions are whole-inch centers; the floor survey and chair dimensions remain approximate.

## Usage (caller's view)

```ts
const draft = Planner.createDraft(liveGeometry, 'Two more desks');
const report = Planner.analyze(draft);
const candidates = await Planner.optimize(draft, { additional: 2, signal, onProgress });
// Choosing a candidate changes only draft.desks.
// Review resolves existing keys to fresh live desks, preserving their holders.
```

## Shape

`common/office-planner.ts` owns geometry-only drafts, pod transforms, boundary parsing, clearance assessment, and bounded seeded search. A draft contains baseline desks, proposed desks, disjoint pods, locked desk keys, rectangular aisle/keep-clear zones, a search rectangle, and a clearance target. Existing desk keys are IDs; new keys never represent assignments.

`components/OfficeLayoutPlanner.tsx` owns the planning session, undo, named browser saves, import/export, cancellation, and candidate selection. Storage is scoped to the signed-in admin and contains no holder data. Explicit save avoids effects that mirror state. Saved documents are validated before use.

`components/OfficePlan.tsx` remains the SVG and gesture surface. Optional planning overlays and rectangle-drawing callbacks reuse its pan/zoom coordinates. It does not know storage or optimization.

`components/UserGardenFloorPlan.tsx` opens the planner for admins and stages a reviewed candidate in its existing editor. It checks the baseline against freshly fetched geometry first. Assignment changes do not invalidate geometry or get overwritten. Applying uses existing CRUD; this is not a transaction or cross-admin lock.

The report distinguishes desktop/chair collisions and protected-zone intrusions from a soft clearance target. Aisles are drawn strips (combine rectangles for bends), not automatically inferred paths. A search rectangle is required for optimization so the algorithm cannot assume every empty part of the suite is furnishable. Pods outside it and pods containing a locked desk remain fixed. Search never deletes existing desks and only returns candidates passing all geometric hard checks.

## Synthesis decision

Two shapes were considered before implementation:

1. **Server-owned scenario documents plus atomic apply.** The page would call createScenario, optimizeScenario, and applyScenario endpoints. This hides persistence and concurrency but requires a new schema, permissions, conflict protocol, and deployment dependency for every planning gesture.
2. **Browser-owned geometry drafts plus pure search.** The page calls createDraft, analyze, and optimize without network writes. A single review boundary resolves geometry back to current live identities. This keeps draft exploration isolated and avoids expanding the desk API.

Use the second shape, with the first shape's explicit baseline/conflict check at review. Keep geometry policy in one module rather than splitting collision, scoring, and candidate validation between UI and optimizer. Saved drafts are local, not collaborative documents.

## Tradeoffs accepted

- Browser-only saves in exchange for no new backend or dependencies; export/import supports transfer and backup.
- Rectangular protected zones in exchange for a small, predictable drawing tool. Several strips describe a bent aisle.
- Bounded seeded heuristic search in exchange for a responsive cancellable tool; no proof of optimality or impossibility.
- Fixed existing pod membership during search in exchange for coherent arrangements. Admins can regroup or ungroup in a draft and search again.
- Existing non-atomic live writes in exchange for leaving the API small. Review is explicit, stale geometry is refused, and failed saves retain the draft for reconciliation.

## Open questions and risks

- Does the traced plan include furniture or door-leaf lines that need explicit correction before using results physically?
- Which actual circulation paths and door swings should admins protect? Drawn zones cannot establish connectivity or regulatory compliance.
- Is local draft storage sufficient, or should a later iteration share scenarios between admins?

## Next implementation step

Implement the pure draft/report/search module, then connect the SVG drawing and planning UI without changing local desk data.
