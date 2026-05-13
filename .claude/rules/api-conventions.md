# REST API Conventions

## Base

- Custom router (`core/Router/`), **not** WP REST API.
- Base URL: `PM_Vars.rest_url` (e.g., `https://site.tld/wp-json/pm/v2/`).
- Route files: `routes/*.php`, auto-loaded.

## Auth

| Layer | Value |
|---|---|
| Nonce header | `X-WP-Nonce: PM_Vars.permission` |
| Required param | `is_admin: PM_Vars.is_admin` on EVERY request |
| Permission gate | One+ permission class chained on the route |

`PM_Vars.permission` (NOT `PM_Vars.nonce`) — this is intentional and historical. Don't "fix" it.

## Methods & paths

- `GET projects/{project_id}/tasks` — list
- `GET projects/{project_id}/tasks/{task_id}` — show
- `POST projects/{project_id}/tasks` — create
- `POST projects/{project_id}/tasks/{task_id}/update` — update (yes, POST not PUT — match existing)
- `POST projects/{project_id}/tasks/{task_id}/delete` — delete (yes, POST not DELETE — match existing)

PUT and DELETE are used for some routes (`/attach-users`, `/boards`) — match the closest existing route in the same feature.

## Includes (Fractal)

- Opt-in via `?with=relation1,relation2`.
- **Never `?include=`** — the league/fractal default isn't wired up; only `with` is parsed.
- Available includes declared on the transformer as `$availableIncludes`.

## Pagination

- `?per_page=20&page=1`
- Backend returns Fractal collection with paginator meta:
  ```json
  {
    "data": [...],
    "meta": { "pagination": { "total": 0, "count": 0, "per_page": 20, "current_page": 1, "total_pages": 1 } }
  }
  ```

## Request body

- Frontend `useApi.js` sends POST/PUT/DELETE as JSON to the PHP side. Earlier docs claimed form-urlencoded — that was the Vue era. The current `useApi` sends JSON; the backend reads via `WP_REST_Request` which accepts both.
- GET uses query string with nested-key bracket serialization (`buildQueryString` in `useApi.js`).

## Response shapes

- Resource: `{ "data": { ... } }`
- Collection: `{ "data": [ ... ], "meta": { ... } }`
- Errors: prefer `WP_Error` returns from controller for the router to surface as 4xx. Otherwise structured object with `error` and `message`.

## Data-type contracts (sender side)

| Field | Wire type | DB type |
|---|---|---|
| Task `status` | INTEGER `0` or `1` | TINYINT |
| Project `status` | STRING `'incomplete'/'complete'/'archived'/'favourite'` | VARCHAR |
| User attach/detach `users` | STRING `'1,5,12'` | n/a (parsed) |
| Task `assignees` on update | full ARRAY of user IDs | replaces |
| Task `estimation` | INTEGER seconds | INT |
| Dates | ISO 8601 string | DATETIME |

## Versioning

- The `v2` in the base URL is the only version moniker. New endpoints are added; existing ones are not re-versioned.
- If a breaking change is unavoidable, add a sibling route (e.g., `/v3/projects/...`) — confirm with the team first.

## Adding a new endpoint

See `.claude/commands/add-endpoint.md` for the scaffold checklist.
