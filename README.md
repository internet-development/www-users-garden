# Users Garden

A tool for clients to manage their usage of the [Internet Development](https://internet.dev) API. Manage accounts, credits, organizations, and application users.

## Setup

Requires Node.js >= 18.

```sh
npm install
npm run dev
```

Visit `http://localhost:10000`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 10000 |
| `npm run build` | Production build |
| `npm start` | Start production server on port 10000 |
| `npm run lint` | Run linter |

## Environment Variables

Optional, for server-side features:

- `API_AES_KEY` — AES encryption key
- `API_IV_KEY` — Initialization vector key

## License

MIT (Internet Development Studio Company)
