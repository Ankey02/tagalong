# Tagalong

A group trip planner built as a multi-step form with Next.js, Tailwind CSS, Zustand and Framer Motion. Friends open the same link, fill in the plan together, vote on where to stay and what to do, and see each other's changes as they happen. It is a frontend-only project.

## What it does

- **Five-step form**: where and when, budget and travel, where to stay, things to do, and a final itinerary. Each step is validated before you can move on.
- **Eighteen destinations in three regions** (India, Asia, Europe), each with its own illustration and activity ideas. The budget range and stay prices adjust to the region, and any other place can be typed in.
- **Live collaboration**: every window on the same trip link edits one shared plan. You see who is here, which step they are on, and which field they are typing in.
- **Voting**: one vote each on the stay, and any number of votes on activities. The list re-orders itself as votes come in.
- **Live boarding pass**: a ticket beside the form fills in as the group decides, and gets a "Confirmed" stamp when anyone confirms the trip.
- **Auto itinerary**: the voted activities are spread across the days of the trip, most popular first. The plan can be copied as text.
- **Saved drafts**: the trip is stored in the browser, so a refresh or a closed tab loses nothing.
- **Animation with a purpose**: the sky moves from dawn to night across the five steps, the progress bar is a flight route, and steps slide in the direction you are moving. All motion is turned off for people who ask their device to reduce motion.
- **Works on phones** and with a keyboard.

## How the live sync works

| Part | How | Where |
|---|---|---|
| Shared data | The trip is a flat map of entries: `key -> { value, time, author }` | `src/store/trip-store.ts` |
| Sending changes | Each change is sent to the other windows over a `BroadcastChannel` named after the trip id | `commit()` |
| Resolving conflicts | Last write wins per key: a window keeps an incoming entry only if it is newer than its own | `merge()` |
| Votes | Every vote has its own key (`vote:<activity>:<person>`), so two people voting at once never overwrite each other | `toggleActivityVote()` |
| Joining late | A new window says hello and the others reply with the full plan | `receive()` |
| Presence | Each window sends a small heartbeat with its name, colour, step and focused field | `init()` |
| Saving | The entries are written to `localStorage` on every change | `commit()` |

`BroadcastChannel` reaches tabs and windows of the same browser, which is enough to demonstrate the collaboration with no server. To sync between different devices, the two functions that send and receive messages would be pointed at a WebSocket; the rest of the app would not change.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router), React, TypeScript |
| Styling | Tailwind CSS v4 with design tokens in `globals.css` |
| State | Zustand |
| Animation | Framer Motion |
| Components | shadcn/ui style: small components built with `class-variance-authority`, `clsx` and `tailwind-merge` |

## Run it locally

You need Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. To see the collaboration, click **Invite**, then **Open a second window**, and join as another person.

On a Mac you can also double-click `start.command`.

## Project structure

```
src/app/                    page, layout and global styles
src/store/trip-store.ts     shared state, live sync, saving, step navigation
src/lib/trip.ts             builds the trip from entries, validation, itinerary
src/lib/data.ts             destinations, stays, budget split, step names
src/components/trip-planner.tsx   the page shell and step transitions
src/components/steps/       one file per step
src/components/sky.tsx      the animated background
src/components/route-progress.tsx   the flight-route step bar
src/components/boarding-pass.tsx    the live ticket
src/components/ui/          button, input, label, avatar
```

## Limits

- Live sync is between tabs and windows of one browser. There is no server.
- Destinations, activity ideas, budget ranges and stay prices are sample data for planning, not live prices.
- There are no accounts. Anyone with the trip link in the same browser can edit the plan.
