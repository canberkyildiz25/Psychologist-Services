import type { Person } from './people';

/* Open hours. FIFTY has no booking system behind it, so availability is a
   sample: each person offers fixed hours on fixed weekdays, and a stable
   pseudo-random share of those hours is treated as already taken. "Stable"
   matters: the same hour stays free or taken however often the page is
   loaded, so the timetable behaves like a real one. */

/** The practice keeps İstanbul time, which is UTC+3 all year. */
export const PRACTICE_OFFSET_HOURS = 3;
export const SESSION_MINUTES = 50;
/** An hour can be requested until this long before it starts. */
const LEAD_MS = 2 * 60 * 60 * 1000;
export const DAYS_SHOWN = 7;
export const FIRST_HOUR = 8;
export const LAST_HOUR = 19;

export interface Slot {
  id: string;
  person: string;
  /** Practice date, YYYY-MM-DD. */
  day: string;
  hour: number;
  /** Start as epoch milliseconds. */
  start: number;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** The practice's calendar date and weekday at a given instant. */
function practiceDate(ms: number) {
  const shifted = new Date(ms + PRACTICE_OFFSET_HOURS * 3_600_000);
  return {
    key: `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}`,
    // 1 = Monday ... 7 = Sunday
    weekday: ((shifted.getUTCDay() + 6) % 7) + 1,
  };
}

const startOf = (day: string, hour: number) => {
  const [y, m, d] = day.split('-').map(Number);
  return Date.UTC(y, m - 1, d, hour - PRACTICE_OFFSET_HOURS);
};

/** The next seven practice dates, starting today. */
export function daysFrom(now: number): { key: string; weekday: number }[] {
  return Array.from({ length: DAYS_SHOWN }, (_, i) => practiceDate(now + i * 86_400_000));
}

/** FNV-1a, reduced to 0..99. Decides which offered hours are already taken. */
function share(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0) % 100;
}

/** Every hour that can still be requested in the next seven days, earliest first. */
export function openSlots(now: number, people: Person[]): Slot[] {
  const slots: Slot[] = [];
  for (const { key, weekday } of daysFrom(now)) {
    for (const person of people) {
      for (const hour of person.hours[weekday as 1 | 2 | 3 | 4 | 5 | 6] ?? []) {
        const id = `${person.slug}_${key}_${pad(hour)}`;
        const start = startOf(key, hour);
        if (start < now + LEAD_MS) continue;
        if (share(id) < person.busy) continue;
        slots.push({ id, person: person.slug, day: key, hour, start });
      }
    }
  }
  return slots.sort((a, b) => a.start - b.start || a.person.localeCompare(b.person));
}

/* ---------- Saying dates and times ---------- */

const asDate = (day: string) => {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
const fmt = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', ...options });

export const weekdayShort = (day: string) => fmt({ weekday: 'short' }).format(asDate(day));
export const weekdayLong = (day: string) => fmt({ weekday: 'long' }).format(asDate(day));
export const dateShort = (day: string) => fmt({ day: 'numeric', month: 'short' }).format(asDate(day));
export const dateLong = (day: string) => fmt({ weekday: 'long', day: 'numeric', month: 'long' }).format(asDate(day));

export const hourLabel = (hour: number) => `${pad(hour)}:00`;
export const endLabel = (hour: number) => `${pad(hour)}:${SESSION_MINUTES}`;

/** "today", "tomorrow" or the weekday, relative to the practice's date now. */
export function relativeDay(day: string, now: number): string {
  const [today, tomorrow] = daysFrom(now);
  if (day === today.key) return 'today';
  if (day === tomorrow.key) return 'tomorrow';
  return `on ${weekdayLong(day)}`;
}
