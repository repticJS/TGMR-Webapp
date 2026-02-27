# TGMR Webapp (Next.js)

Next.js app for viewing TGMR team/player Minecraft achievements.

## Routes

- `/team/{uuid}`
- `/player/{uuid}`

Each page always renders the full achievement catalog and shows completion status:

- `✓` for completed achievements
- `○` for not-yet-completed achievements

The world selector is populated from achievement `world_id` values (e.g. UUIDs), and the list is shown for one selected `world_id` at a time.

If no world IDs exist yet, the dropdown shows `None` and the full achievement catalog is still displayed.

## Quick lookup from home page

The `/` page now includes a UUID finder:

- Select your team and click **Go to team page**
- Select your player and click **Go to player page**
- If API lookup is unavailable, you can still paste team/player UUIDs manually and navigate

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000/team/<uuid>` or `http://localhost:3000/player/<uuid>`.
