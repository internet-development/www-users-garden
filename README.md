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

The gold frame contains a painted pond with a gentle isometric tilt. Six distinct arrangements contain 18 notched pads and eight flowers or buds, with broad leaves and large ivory, rose, apricot, and lavender blooms. `common/pond-layout.ts` owns the shared projection, elevation, and shear, plus plant placement and the pad shapes used for both rendering and koi navigation. The tree painting appears only as soft reflections near the edges. Four large koi steer through open channels, avoid pads and one another, and choose new destinations as the pond changes.

The koi use the transparent `public/artwork/koi-monet-atlas.png` illustration, generated with the built-in image tool. Its exact prompt is saved beside it as `koi-monet-atlas.prompt.txt`. The four painted varieties have detailed scales, gill covers, eyes, barbels, and fins. The shader bends their bodies and tails, applies the shared isometric projection, and blends them below the water's refraction and highlights. Their simulation sizes are approximately twice the original koi sizes; the same sizes drive navigation clearance. If the illustration cannot load, the procedural koi remain available. The atlas participates in the existing abort, disposal, and context-recovery lifecycle.

`common/pond-life.ts` runs a 28 × 28 Conway field using B3/S23 rules on a wrapping grid, advancing every 1.2 seconds. Its smoothed activity influences the koi's destinations and subtle water color; births produce occasional small ripples. Initial gliders and a small evolving pattern seed the field. A fresh glider enters if the population becomes too small or the field stays unchanged for eight generations. Touching the water adds a ripple and another glider. No grid is shown. Fish steering advances at a fixed 60 Hz; Life, fish, and water all pause with reduced motion, an offscreen frame, or a hidden tab.

The WebGL2 scene has no caption or visible controls and retains the painting fallback when WebGL is unavailable. Textures are prepared once and reused. Local texture loads are canceled on disposal, and late results cannot revive a removed scene. `npm run test:pond` checks the actual Life rules and pattern evolution, varied lily geometry, and five minutes of koi movement with pad clearance and boundary checks. These are local synthetic checks, separate from any SMS or account operations.

## License

MIT (Internet Development Studio Company)
