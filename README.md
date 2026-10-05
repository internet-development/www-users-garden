# Users Garden

A tool for clients to manage their usage of the [Internet Development](https://internet.dev) API. Manage accounts, credits, organizations, and application users.

## Setup

Requires Node.js >= 18.

```sh
npm install
npm run dev
```

Visit `http://localhost:10000`.

Visit `http://localhost:10000/settings-preview` for the public SMS review page, also linked as **SMS Policy** directly below **Acceptable Use Policy** at the bottom of the sign-in page. It includes the framed interactive pond, the same phone settings component used by signed-in accounts, the exact consent prompt once, and three columns of message conversations. Its introduction uses the INTDEV SVG, with a SIGN IN link in the top bar. Preview interactions stay in memory and never call the API or send a text.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 10000 |
| `npm run build` | Production build |
| `npm start` | Start production server on port 10000 |
| `npm run lint` | Run linter |
| `npm run test:pond` | Check Conway rules, lily geometry, and koi navigation |

## Environment Variables

Optional, for server-side features:

- `API_AES_KEY` — AES encryption key
- `API_IV_KEY` — Initialization vector key

See `.env.example` for empty local placeholders. SMS credentials belong on the sibling API backend (`../apis`), which owns the Twilio integration; use its `.env.sms.example`. No Twilio credentials belong in browser code or `NEXT_PUBLIC_*` variables.

## Text messages

After signing in, **Text messages** is the first section at the top of **Settings**, with the customer-care number and your phone input immediately visible. Every signed-in user can save, change, or clear their number, including users who have not verified their e-mail. Saving the number does not send a message, subscribe the user, or require the SMS endpoints to be available.

The editable number is stored in the existing **`users.data.phone` JSONB field** and returned as **`viewer.data.phone`**. `onSaveUserPhone` in `common/queries.ts` uses the existing `/api/users/update` endpoint with `{ id, updates: { phone }, forcePush: false }`, preserving other application data. The number stays a string in international format, such as `+12025550123`; clearing it saves an empty string. A subsequent `/api/users/viewer` read confirms the stored value and refreshes the dashboard. The general application-data editor also preserves phone strings. No migration or new environment variable is needed to save a number.

Text-message consent is a separate action. Once the SMS service is available, verified users can review the exact prompt from [internet.dev/consent](https://internet.dev/consent) and explicitly request a text. That action links the number through `/api/users/sms/save`, then calls `/api/users/sms/request-consent`. Only a `YES` reply to the prompt enables service texts; `NO` declines, `HELP` provides help, and `CANCEL` stops messages. Clearing the editable account number does not opt out an existing SMS subscription; reply `CANCEL` to stop texts. The request checkbox and a delivered message do not establish consent.

`/api/users/sms/status` returns `{ success: true, data: { contact, available } }`. Status is loaded independently, so failed or unavailable SMS requests never disable phone saving or replace the number returned in the viewer. Refresh status never sends a text. Retries of the same consent request reuse its ID, with a server limit of one per minute and five per day. The backend's separate, server-managed `users.data.sms` record holds consent and delivery state; it is excluded from ordinary user reads and preserved during application-data updates. It does not replace the editable `data.phone` field.

Backend setup is documented under **Users Garden SMS** in `../apis/AGENTS.md`. Apply its explicit `migrate-sms` migration, configure the sender and signed webhooks, and then enable the feature with the server variables. Missing configuration leaves sending unavailable. Configuration alone does not prove carrier registration, delivery, or deployment. No live texts are required to use the preview.

Once connected, `TOKENS` reads the user's current INTDEV credit balance without converting `amount_cents` to dollars. The live `DESK` handler reads workspace application status. The preview's desk-payment date and coverage month are sample values owned by `common/sms-examples.ts`; its cancellation and invoice instructions follow DANGER → Cancel your subscription and OFFICE → Your payment history. The billing-date response, organization/application permission request, and organization invitation are **illustrative future workflows**. Preview interactions do not book desks, cancel subscriptions, create memberships, or grant application permissions.

The gold frame contains a painted pond with a pronounced isometric tilt and a diagonal far bank. A layered tree line of poplars, alders, a willow, and distant hills reflects into the water. Six arrangements contain 18 notched lily pads and eight flowers or buds; larger foreground leaves and smaller distant flowers emphasize depth. Leaves have fine radial veins and warm edges, while cupped petals catch soft light. `common/pond-layout.ts` owns the shared projection, bank height, plant placement, and elliptical pad boundaries used for rendering and navigation.

The koi use the transparent `public/artwork/koi-monet-overhead.png` atlas: four varieties viewed from above, with overlapping scales, gill contours, paired fins, eyes, and barbels. The landscape uses `public/artwork/pond-treeline-monet.png`. Both assets were generated with the built-in image tool; their exact prompts are saved beside them as `.prompt.txt` files. The fish have rounded lighting, translucent fins, submerged shadows, and nine-point spines that bend along their actual swimming path. `common/pond-navigation.ts` finds connected open water, builds a closed circuit around the lily groups, and smooths it while retaining body clearance and room for the pads to drift. Fish advance continuously around that circuit, varying their pace with the living field and spacing from the koi ahead. The two middle lily arrangements leave open channels on both sides. Procedural koi and trees remain available if either illustration fails to load; loaded textures share the existing abort, disposal, and context-recovery lifecycle.

`common/pond-projection.ts` owns the transforms between pond coordinates, screen positions, and the water simulation. Ripples propagate on a 256 × 256 heightfield in the pond plane, so circular waves appear as tilted ellipses in the frame. The company's wave solver stores current and previous heights, uses a nine-point stencil for propagation, and injects compact polynomial disturbances with a raised center and lowered ring. Pointer drops, koi bow waves and tail strokes, lily bobbing, surface normals, and refraction use the same projection. The shoreline bounds the simulated water; touching the trees does not create a ripple. Wave crests and troughs produce subtle light and dark bands, and the tree reflections respond to the projected surface normals.

`common/pond-life.ts` runs a 28 × 28 Conway field using B3/S23 rules on a wrapping grid, advancing every 1.2 seconds. Its smoothed activity influences the koi's pace and subtle water color; births produce occasional small ripples. Initial gliders and a small evolving pattern seed the field. A fresh glider enters if the population becomes too small or the field stays unchanged for eight generations. Touching the water adds a ripple and another glider. No grid is shown. Fish motion advances at a fixed 60 Hz; Life, fish, and water all pause with reduced motion, an offscreen frame, or a hidden tab.

`common/water-noise.ts` uses a project-specific integer hash of lattice coordinates for procedural water texture variation and fallback koi markings. Its deterministic values feed the existing smooth noise interpolation.

The WebGL2 scene has no caption or visible controls and retains the painting fallback when WebGL is unavailable. The existing INTDEV SVG wordmark sits inside the water at the lower right as a subtle white signature, scales with the frame, and lets pointer interactions pass through to the pond. The figure's accessible label and hover title credit Internet Development Studio Company; the title also states the MIT reuse terms. Textures are prepared once and reused. Local texture loads are canceled on disposal, and late results cannot revive a removed scene. `npm run test:pond` checks the Life rules, lily geometry, coordinate round-trips, ripple foreshortening, and thirty minutes of koi movement. It checks body clearance, repeated laps, continuous motion in every eight-second window, and the absence of position jumps. These are local synthetic checks, separate from any SMS or account operations.

## License and attribution

Users Garden and its original code, design, documentation, 3D pond scene, and supplied artwork are by [Internet Development Studio Company](https://internet.dev).

Copyright (c) 2024-2026 Internet Development Studio Company.

Free to use, copy, modify, and distribute, including commercially, under the [MIT License](LICENSE.md), provided you retain the company copyright notice and the full MIT license notice in all copies or substantial portions of the work. This includes the scene in `components/WaterFrame.tsx`, the `common/water*.ts` and `common/pond-*.ts` modules, and the artwork and prompts in `public/artwork/`. The [artwork license](public/artwork/LICENSE.txt) is also served at `/artwork/LICENSE.txt` so the notice can accompany reused images.

Suggested credit for a website or credits page:

> Users Garden / 3D pond scene by Internet Development Studio Company — https://internet.dev. Used under the MIT License.

A visible credit is appreciated; MIT requires retaining the copyright and license notices, rather than a particular on-screen placement. A short credit does not replace the full license notice.

Third-party code and dependencies retain their own authorship and licenses. Preserve the applicable notices in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md), source files, and dependencies when reusing them.
