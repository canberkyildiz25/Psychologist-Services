'use client';

import { BookmarkSimple } from '@phosphor-icons/react';
import { useFifty, useHydrated } from '@/lib/store';

/** Keeps a psychologist on the visitor's shortlist, in this browser. */
export function ShortlistButton({ slug, name }: { slug: string; name: string }) {
  const hydrated = useHydrated();
  const kept = useFifty((state) => state.shortlist.includes(slug));
  const toggle = useFifty((state) => state.toggleShortlist);
  const on = hydrated && kept;
  return (
    <button type="button" className="btn btn--quiet btn--small keep" aria-pressed={on} aria-label={`${on ? 'On your shortlist' : 'Add to shortlist'}: ${name}`} onClick={() => toggle(slug)}>
      <BookmarkSimple size={20} weight={on ? 'fill' : 'regular'} aria-hidden="true" />
      {on ? 'On your shortlist' : 'Add to shortlist'}
    </button>
  );
}
