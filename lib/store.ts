'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PEOPLE, type Format } from './people';
import { openSlots, type Slot } from './schedule';

/** A request as it is remembered in this browser. Nothing is sent anywhere,
    so only what the page needs to show it again is kept: no name, no email. */
export interface Request {
  ref: string;
  slot: string;
  person: string;
  day: string;
  hour: number;
  start: number;
  format: Format;
  made: number;
}

interface State {
  shortlist: string[];
  requests: Request[];
  toggleShortlist: (slug: string) => void;
  addRequest: (request: Request) => void;
  cancelRequest: (ref: string) => void;
  /** Forget everything: requests and shortlist. */
  reset: () => void;
}

export const useFifty = create<State>()(
  persist(
    (set) => ({
      shortlist: [],
      requests: [],
      toggleShortlist: (slug) =>
        set((state) => ({
          shortlist: state.shortlist.includes(slug) ? state.shortlist.filter((entry) => entry !== slug) : [...state.shortlist, slug],
        })),
      addRequest: (request) => set((state) => ({ requests: [...state.requests.filter((entry) => entry.slot !== request.slot), request] })),
      cancelRequest: (ref) => set((state) => ({ requests: state.requests.filter((entry) => entry.ref !== ref) })),
      reset: () => set({ shortlist: [], requests: [] }),
    }),
    { name: 'fifty', version: 1 },
  ),
);

const never = () => () => {};

/** False on the server and during hydration, true afterwards. */
export const useHydrated = () =>
  useSyncExternalStore(
    never,
    () => true,
    () => false,
  );

/* The current time, to the minute. Open hours depend on it, and the exported
   HTML cannot know it, so anything built on this renders a placeholder until
   the browser has taken over. */
let minute = 0;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;
const tick = () => {
  const next = Math.floor(Date.now() / 60_000);
  if (next !== minute) {
    minute = next;
    listeners.forEach((listener) => listener());
  }
};
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  timer ??= setInterval(tick, 15_000);
  return () => {
    listeners.delete(listener);
    if (!listeners.size && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
};

/** Epoch milliseconds, rounded down to the minute; null before hydration. */
export function useNow(): number | null {
  const value = useSyncExternalStore(
    subscribe,
    () => (minute ||= Math.floor(Date.now() / 60_000)),
    () => 0,
  );
  return value ? value * 60_000 : null;
}

/** Every open hour from now, or null while the page is still static. */
export function useOpenSlots(): { now: number; slots: Slot[] } | null {
  const now = useNow();
  return useMemo(() => (now ? { now, slots: openSlots(now, PEOPLE) } : null), [now]);
}
