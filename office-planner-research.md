# A specialized solver for office layouts

This is a research proposal, not implemented behavior. Implementation is paused while we reconsider the search design. The existing planner still lacks seat-to-entrance route validation.

## Recommendation

Build a small, browser-side solver that combines procedural desk-layout patterns with finite placement choices and an independent circulation validator. Search over alternative aisle arrangements as well as desk arrangements. Treat existing pods as disposable unless the operator locks their desks.

A feasible candidate must preserve every original desk identity, respect fixed geometry, and provide usable access from every seat to a confirmed entrance. Capacity and comfort rank candidates only after those checks pass. The tool must not silently reduce a required clearance to fit another desk.

This combines the desk-specific construction methods in the supplied WeWork paper [1] with width-aware circulation from furniture-layout research [2] and the explicit treatment of paths as layout variables in other work [3, 4]. It is a proposal for our floor, not a claim that any cited algorithm solves our exact problem unchanged.

## What the supplied paper actually does

*Augmented space planning: Using procedural generation to automate desk layouts* describes a family of constructive algorithms, rather than a general constraint-programming solver [1]. Its inputs are a room polygon, door locations, obstacles, and space standards.

The algorithms try several ways to arrange desks:

- Follow the perimeter clockwise, counterclockwise, or longest wall first.
- Fill walls on each side of the door in a consistent order.
- For selected walls, choose wall-facing desks, a back-to-back bank, or no desks.
- Extend banks toward the room's center and try an end-cap desk.
- Slide a rejected placement along its wall in one-inch increments before giving up.

The constraints include door separation, chair-use clearance, separation between desk banks, and obstacle avoidance. Banks can contain at most five desks along their depth. These are the paper's rules, not dimensions or limits we should adopt without review.

The option to leave a wall empty is particularly relevant. Filling every available edge can prevent a better arrangement elsewhere. Our current optimizer greedily adds desks after moving existing pods, so it does not explore that trade-off well.

The study compares generated layouts against 13,211 human-designed offices across 120 locations. Each office contains 1 to 20 people. Under its strict rules, the algorithm matches human desk counts in 77% of offices and exceeds them in another 6%. A relaxed variant reaches a reported 97% match-or-better rate, partly by allowing a two-foot desk-clearance zone [1, sections "Layout validation" and "Bending the rules"].

Those numbers are capacity comparisons, not evidence of globally optimal layouts, equal comfort, or suitability for our roughly 40-desk suite. We should not copy the relaxed clearance or promise a 97% success rate. The paper describes local circulation-related constraints, but does not describe an explicit route check from every seat to the entrance.

Its interface is also worth keeping: generate several distinct alternatives, explain their differences, and let the designer choose and adjust one. Autonomous generation does not require autonomous application to live data.

## Research that addresses the missing circulation model

### Walking space has width

Merrell and colleagues' *Interactive Furniture Layout Using Interior Design Guidelines* models a person as a disk and expands furniture and walls by that disk. The remaining space describes where the person's center can move. The method evaluates circulation through the number of connected components in that space [2, section 2.1].

This is the useful idea behind a width-aware route check. A line drawn through a narrow gap is not proof that someone can walk through it. The paper uses an 18-inch radius, but that is an experimental model, not a clearance standard for this office.

For our planner, the stronger acceptance rule is that every seat's departure area connects to a confirmed entrance through the allowed walking space. Counting free-space components alone is insufficient: an inaccessible pocket behind a cabinet is irrelevant, while an isolated occupied seat is a failure.

Seat access and shared circulation need different geometry. A seated person must be able to leave their own chair, but a shared aisle cannot assume that everyone else's occupied chairs disappear. The rear space at desk 36 is a dead end, not necessarily a through-aisle. It should pass or fail based on its seat access, not a universal rear-aisle requirement.

### Paths can move along with furniture

Yu and colleagues' *Make it Home* optimizes furniture arrangements and pathways between doors. A pathway has width, represented by rectangles along a curve. The search can change both furniture placements and pathway control points [3, sections 4.2 and 4.3].

For us, that suggests trying alternative shared aisle arrangements instead of requiring the operator to draw every aisle. We do not need its learned furniture priors or curved pathways. Straight sections with bends fit this floor and are easier to explain.

Its pathway and accessibility terms are optimization costs. We should not use those costs as the final acceptance test. A low total cost can still hide a blocked seat.

### Connectivity can be a hard constraint

*Computational Network Design from Functional Specifications* uses integer programming to choose a network from candidate edges. The model separates required connectivity from objectives such as network length and travel distance. It also combines corridor networks with room placements [4, sections 4 and 5.2].

That is a useful distinction for our design: a candidate aisle must join the entrance-connected network, not merely occupy an empty rectangle near a desk. A disconnected aisle is not access.

*Automated generation of circulations within a floorplan* constructs spanning and reduced corridor systems from room-adjacency graphs [5]. It supports entry points, corridor thickness, and privacy distinctions. However, its construction shifts room walls to create corridors. Our walls are fixed, so its geometry algorithm is not a direct fit. The transferable idea is to compare connected circulation networks rather than treat circulation as leftover floor area. The paper also lists building-code and accessibility constraints as future work.

## What constraint solving adds

A finite-domain constraint solver starts with choices, removes incompatible choices, and backtracks when a decision leaves no valid continuation. MiniZinc's search documentation explains propagation and the first-fail strategy, which chooses the variable with the fewest remaining values [6].

For example, suppose a bank can occupy one of several positions. Selecting one position eliminates overlapping desks and any arrangement that blocks a required route. If a mandatory desk has no remaining placement, the solver reverses that decision immediately instead of nudging the same crowded arrangement repeatedly.

For identical desks, a useful formulation selects anonymous placement slots first. Let `z[p]` indicate whether slot `p` is used. If two slots conflict, their constraint is `z[p] + z[q] <= 1`. Locked placements are required. Invalid static placements never enter the candidate set. The selected slot count must accommodate all existing desks and can include additional desks up to the requested limit.

That pairwise conflict model handles packing, but not circulation by itself. Several individually acceptable desks can collectively block a passage. Connectivity needs its own graph check during search and again on every complete candidate.

After solving geometry, match existing desk IDs to slots, with locked identities fixed and movement as a preference. This avoids searching permutations of otherwise identical desks. It must preserve every original ID and its fresh assignment when the operator later reviews the draft.

## A practical small solver for this planner

### Generate several plausible arrangements from scratch

Start with confirmed entrances, actual walls, columns, door clearances, equipment exclusions, and locked desks. Preserve the operator's search area as the scope for changes. Desks outside that area stay fixed, but access routes may travel through the rest of the office.

Generate candidates from wall-facing runs, back-to-back banks of different lengths, single rows, end caps, and selected standalone placements. Try both orientations, offsets, and empty edges. These patterns propose positions; they do not force current pods to survive.

Run a separate least-disruption search if useful, but do not make the current layout the starting point for every candidate. A full-restructure mode should rebuild all unlocked placements.

### Search across aisle alternatives

Generate several connected aisle arrangements around fixed obstacles, such as a central aisle, an offset aisle, or an aisle with branches. Treat each arrangement as a search hypothesis, not a permanent precondition. Reserve its width while placing desks, then revise or reject the arrangement if it limits the layout unnecessarily.

Connect each seat's departure area to that network. Shared path sections become suggested aisles. The operator can inspect the paths, lock a useful aisle, or reject it. The solver must also avoid blocking required kitchen and equipment access, not just desk access.

No algorithm can infer all those destinations and exclusions reliably from decorative PDF lines. The operator should confirm the structural inputs once. After that, layout exploration can be largely autonomous.

### Prune and backtrack within a bounded search

Precompute static validity and pairwise placement conflicts. Use compact sets to remove incompatible placements after each decision. Prefer decisions that constrain many other choices. Use a capacity upper bound to stop exploring branches that cannot improve the best candidate.

Check route connectivity as placements accumulate. If a placed seat has no route even while all unfilled space remains available, adding furniture cannot restore access in that branch. Backtrack. Alternative aisle arrangements or removal of an earlier placement belong to another branch.

Use a time or node budget, deterministic seeds, cancellation, and a worker so search does not block dragging or typing. Keep several geometrically distinct feasible results. A timeout means "no better layout found within this search," not "another desk is impossible."

Candidate placement generation restricts the search space. Even an exhaustive search over those candidates proves only a result for that discrete model, not the maximum capacity of the physical room.

### Validate independently before showing a suggestion

The acceptance check should verify:

- Every original desk exists exactly once, and locks remain unchanged.
- Desktops and occupied-chair envelopes fit inside the suite without collisions.
- Door clearances, fixed equipment, and protected zones remain clear.
- Every seat has a usable departure connection to an entrance-connected route.
- Every route maintains the required width along its segments and around bends.
- Aisle connections do not cut diagonally through obstacle corners or pass through walls.

A grid can make route search inexpensive, but point samples alone are not enough. Use conservative obstacle expansion and validate the swept route geometry. Narrow passages need particular care because grid alignment can wrongly admit or reject them. Route widths remain explicit planning inputs, not claims of accessibility or fire-code compliance.

Only then rank alternatives by added capacity, comfort, travel distance, aisle area, and disruption. Keep hard minimums separate from comfort targets. Offer both a capacity-focused option and one with more comfortable space at the existing desk count. The best recommendation may add no desks.

## Why not start with a general solver dependency?

Google's OR-Tools CP-SAT already supports integer variables, optional intervals, and two-dimensional non-overlap constraints [7, 8]. It distinguishes a feasible result from a proven optimum, a proven infeasible model, and an unfinished search. Those result distinctions are worth copying.

However, rectangle non-overlap does not provide seat access, door semantics, or connected aisles automatically. We still need to design those constraints. Adding OR-Tools now would also change the current no-new-runtime-dependencies design and likely require a separate runtime integration.

I recommend the specialized TypeScript approach first, with an independent geometry and routing validator. If it struggles on our real layouts, an isolated Python CP-SAT experiment could compare identical placement choices and constraints. We should agree to that dependency before making it part of the app. Comparing identical models would separate weaknesses in search from missing physical rules.

## What to verify before implementation expands

The current `common/office-planner.ts` moves fixed pods using a penalty score, then greedily inserts additional desks. Its final `assess` check covers collisions and clearance but has no route test. Increasing the iteration count cannot supply that missing constraint.

The underlying floor data also needs review. `WALL_SEGMENTS` currently contains straight drawing segments at least 24 inches long. That is not a semantic wall model: shorter column edges can be omitted, while door leaves and fixture lines can be included. Confirm entrances and door openings rather than turning the existing text label into an exit assumption.

First build the route validator and use the reported impractical layout as a regression example. Then add from-scratch pattern generation and aisle alternatives. Useful checks include a trapped seat with ample local clearance, a narrow bottleneck, a disconnected drawn aisle, an occupied chair obstructing a shared passage, a usable dead-end seat, and a route blocked outside the search area.

Evaluate generated candidates against operator-reviewed layouts, not desk count alone. All experiments must use copies. Keep the existing fresh-baseline review and explicit save process for live desks and assignments.

## Sources

1. Anderson, Bailey, Heumann, and Davis. *Augmented space planning: Using procedural generation to automate desk layouts*, 2018. Read the supplied full text, including its algorithms, constraints, validation, and interface sections. [Supplied access link](https://journals.sagepub.com/eprint/KumUk4AE8tsngPnqENDX/full). [DOI](https://doi.org/10.1177/1478077118778586).
2. Merrell et al. *Interactive Furniture Layout Using Interior Design Guidelines*, 2011. Sections 2.1 and 3 describe circulation, clearance, and suggestion generation. [Author-hosted paper](https://paulmerrell.org/furnitureLayout2.pdf). [Stanford project](https://graphics.stanford.edu/projects/furniture/).
3. Yu et al. *Make it Home: Automatic Optimization of Furniture Arrangement*, 2011. Sections 4.2 and 4.3 describe movable pathways and ergonomic objectives. [Author-hosted paper](https://web.cs.ucla.edu/~dt/papers/siggraph11/siggraph11.pdf).
4. Peng et al. *Computational Network Design from Functional Specifications*, 2015. Sections 4 and 5.2 describe constrained networks and corridor-aware floorplanning. [Full text](https://arxiv.org/html/1510.09203v1).
5. Shiksha et al. *Automated generation of circulations within a floorplan*, 2025. The methodology and limitations distinguish corridor generation from code compliance. [Full text](https://www.cambridge.org/core/journals/ai-edam/article/automated-generation-of-circulations-within-a-floorplan/17830B95C3A0B8120CE87C6F8610AA66).
6. MiniZinc Handbook, *Search*. Primary documentation for finite-domain search, propagation, first-fail selection, and backtracking. [Documentation](https://docs.minizinc.org/en/stable/mzn_search.html).
7. Google OR-Tools, *CP-SAT Solver*. Integer modeling and solve statuses. [Documentation](https://developers.google.com/optimization/cp/cp_solver).
8. Google OR-Tools, `CpModel.add_no_overlap_2d`. Primary implementation and documentation of optional, axis-aligned rectangle non-overlap. [Source](https://github.com/google/or-tools/blob/stable/ortools/sat/python/cp_model.py).
