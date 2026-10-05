'use client';

import { personBySlug } from '@/lib/people';
import { hourLabel, relativeDay } from '@/lib/schedule';
import { useOpenSlots } from '@/lib/store';

/** One line under the hero: the earliest hour anyone can be seen. */
export function NextOpen() {
  const live = useOpenSlots();
  if (!live) return <p className="hero__next" aria-hidden="true" />;

  const first = live.slots[0];
  if (!first) return <p className="hero__next">No hour is open in the next seven days.</p>;

  const together = live.slots.filter((slot) => slot.start === first.start);
  const who = together.length === 1 ? `with ${personBySlug(first.person)?.name}` : `with ${together.length} people free`;
  return (
    <p className="hero__next">
      <i aria-hidden="true" />
      <span>
        The earliest open hour is {relativeDay(first.day, live.now)} at {hourLabel(first.hour)}, {who}.
      </span>
    </p>
  );
}
