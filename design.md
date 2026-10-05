# Design: FIFTY

Locked design system for the site. Read it before changing a page; amend this
file when the system needs to grow. Written 2026-10-05 for the rebuild of the
Psychologist Services course project on Next.js 16.

## The idea

The first version was a list of psychologist cards with a booking form on
each. That asks the visitor to pick a stranger first and find out afterwards
whether the stranger has time.

FIFTY turns it round: **pick the hour, then the person.** Ten psychologists
share one timetable. The week is drawn as a grid of hours, a square is tinted
when someone can see you then, and choosing a square shows who.

The name is the therapy hour, which is fifty minutes. The mark is fifty
minutes of a clock face: five sixths of a circle.

| What you see | What it means |
| --- | --- |
| A tinted square | At least one person is free in that hour |
| A warmer tint | More people are free: one, two or three, four or more |
| The number and the small faces | How many, and who (up to three shown) |
| An outlined square with a tick | An hour you have asked for |
| A grey square | Nobody is free |
| The tall grey column | Sunday. The practice is closed |

## The look: a quiet practice

Canberk chose "calm and warm". The earlier rebuilds are a dark archive
(Shelfmark), a drawing sheet in pen colours (the portfolio) and a market
stall (MISE), so this one is the plain one.

- **Slate carries the page.** A light grey-blue ground, slate ink.
- **Terracotta is the only accent and it always means the same thing:** an
  hour you can have, or the control that takes you to one. It is never
  decoration.
- **Photographs do the warming.** Every room and portrait is lit the same
  way, against the same slate wall, with one terracotta object in it. The
  interface around them stays plain so they can.
- One radius system (`--r` 12px, `--r-sm` 8px for the squares, `--r-pill`).
  No shadows, no gradients, no glass, no cards floating on cards, no stripe
  down the side of a panel. Sections are separated by a hairline.
- Padding, margins and gaps sit on a 4px scale.
- A dark theme follows the system and can be switched by hand.

Tokens live at the top of `app/globals.css`. Use them by name; do not write
a colour or a font family anywhere else.

| Token | Light | Use |
| --- | --- | --- |
| `--ground` / `--raised` / `--sunk` | grey-blue paper | page, dialog and inputs, empty squares |
| `--ink` / `--ink-2` | slate | text, secondary text (7:1 on the ground) |
| `--line` | hairline | separators only |
| `--edge` | mid slate | the edge of a control (3:1) |
| `--accent` / `--on-accent` | terracotta | the one accent (5.2:1 with its text) |
| `--free-1` `--free-2` `--free-3` | terracotta tints | how many people are free |

## Type

- **Lexend** for headings, controls and anything in the timetable. It was
  drawn to be easy to read and it looks unhurried.
- **Source Sans 3** for running text, at 18px.
- Headings are upright, medium weight, tight. No italics, no all-caps
  labels, no small eyebrow above a heading.
- Figures that line up (hours, counts, fees) use tabular numerals.

## Layout

- Home: headline and one photograph, then the timetable, then why the hour
  is fifty minutes (a bar whose parts are the minutes: 10, 30, 10 and the 10
  that belong to the psychologist), then the ten portraits, then the two
  ways of meeting.
- `/people/`: one row per person, filterable and sortable.
- `/people/[slug]/`: portrait, how they work in their own words, facts, and
  their open hours for the week.
- `/requests/`: what this browser remembers.
- On a phone the navigation is a bar at the bottom, the timetable is one day
  at a time, and the portraits become a row to swipe.

## Honesty

This is a demonstration, and a site about therapy has to be careful what it
pretends.

- **Nobody here exists.** The ten psychologists are invented. Their
  portraits and the rooms were made with an image generator, never taken
  from photographs of real people. The footer of every page says so.
- **No ratings, no reviews, no testimonials.** They would be invented, and
  inventing praise for a therapist is the wrong thing to practise.
- **No booking happens.** The form checks what you type and then drops it.
  Name, email and note are never stored or sent. Only the hour, the person
  and a reference stay, in the browser's local storage.
- **Availability is a sample**, worked out in the browser from fixed weekly
  hours and a stable hash, so the same hour stays free or taken on every
  load. An hour can be asked for until two hours before it starts.
- **Times are İstanbul time**, and the dialog also gives the hour on the
  visitor's own clock when that differs.
- **The footer says where to turn in an emergency**, because some visitors
  to a site like this are not there to look at a portfolio.
- Profile pages are marked `noindex`: a search engine should not list people
  who do not exist.

## Motion

Small and functional: the headline and photograph rise once on load, the
dialog comes up from below and leaves faster than it came, squares and
buttons press in. Hover effects are only for devices that hover. Nothing loops,
nothing scrolls on its own. `prefers-reduced-motion` turns all of it off,
smooth scrolling included.

## Accessibility

- The timetable is one tab stop; arrow keys move between open hours, and
  every square is labelled with its date, hour and count.
- The dialog is a native `<dialog>`: focus is trapped, Escape closes it,
  focus returns to the square. Each step moves focus to its heading.
- Form errors are text tied to their field, and focus goes to the first one.
- Touch targets are at least 44px. Tints never carry meaning alone: the
  number is always printed.
- Without JavaScript the pages read, the directory and profiles are
  complete, and the timetable says why it is empty.
