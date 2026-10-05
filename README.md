# FIFTY

A demonstration practice where **you pick the hour first and the person
second**. Ten psychologists share one timetable; the week is a grid of hours,
and a square is tinted when someone can see you then.

Live: https://resilient-salmiakki-c08a67.netlify.app

This is a rebuild of Psychologist Services, a course project that listed
psychologists as cards with a booking form on each. The first version is in
the repository's history.

**Nobody on this site exists.** The psychologists, their hours and their fees
are invented, and the portraits and rooms were made with an image generator.
Nothing a visitor types is sent anywhere.

## What it does

- A timetable of every open fifty-minute session for the next seven days,
  tinted by how many people are free. Narrow it by what it is about, how you
  meet and which language.
- Choosing an hour shows who is free in it, then a short request form, then
  a reference.
- A directory of the ten people with their next free hour, sortable by who
  is free soonest, fee or years in practice.
- A page per person with their open hours for the week.
- "Requests": the hours you asked for and a shortlist, kept in the browser.
  No account.
- Light and dark themes, keyboard control of the timetable (arrow keys),
  reduced motion respected, readable without JavaScript.

## How availability works

There is no booking system behind the site. Each person has fixed weekly
hours in `lib/people.ts`, and `lib/schedule.ts` treats a stable share of them
as already taken, using a hash of the person, date and hour. The same hour is
therefore free or taken on every load, and the timetable moves forward with
the clock. Times are İstanbul time (UTC+3); an hour can be asked for until
two hours before it starts.

Because the site is a static export, all of this runs in the browser.

## Stack

Next.js 16 (static export), React 19, TypeScript, Tailwind CSS 4, Zustand for
the browser-side store, Phosphor icons. Lexend and Source Sans 3 through
`next/font`.

```bash
npm install
npm run dev
```

```bash
npm run build
```

`npm run build` writes the site to `out/` and then runs
`scripts/flatten-segments.mjs`, which copies Next's prefetch files to the
names the browser asks for (Next 16 writes them into folders, which a plain
file host answers with 404).

## Layout of the code

| Path | What is there |
| --- | --- |
| `app/` | Pages: home, `people/`, `people/[slug]/`, `requests/`, 404 |
| `components/Timetable.tsx` | The week grid, the phone day view, the filters |
| `components/RequestDialog.tsx` | Who is free, the form, the receipt |
| `components/Directory.tsx` | The list of people with filters and order |
| `lib/people.ts` | The ten invented practitioners |
| `lib/schedule.ts` | Open hours and how dates are said |
| `lib/store.ts` | Requests and shortlist, and the current minute |
| `design.md` | The design system and the reasons behind it |

## Images

The portraits and rooms were generated for this project with Pollinations
(Z-Image Turbo, and Qwen Image for the first room) from prompts that fix the
same light, wall and accent colour, then cut to size as WebP. No photograph
of a real person is used.

## Author

Canberk Yıldız · https://canberkyildiz.netlify.app
