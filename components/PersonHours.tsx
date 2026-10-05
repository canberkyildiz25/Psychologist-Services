'use client';

import { useState } from 'react';
import { dateShort, hourLabel, weekdayLong, type Slot } from '@/lib/schedule';
import { useFifty, useOpenSlots } from '@/lib/store';
import { RequestDialog } from './RequestDialog';

/** One person's open hours for the next seven days, a row per day. */
export function PersonHours({ slug, name }: { slug: string; name: string }) {
  const live = useOpenSlots();
  const requests = useFifty((state) => state.requests);
  const [open, setOpen] = useState<Slot | null>(null);

  if (!live) {
    return (
      <>
        <p className="muted" role="status">
          Working out the open hours.
        </p>
        <noscript>
          <p className="notice">Open hours are worked out in your browser from the current time, so they need JavaScript.</p>
        </noscript>
      </>
    );
  }

  const mine = new Set(requests.map((request) => request.slot));
  const days = new Map<string, Slot[]>();
  for (const slot of live.slots) {
    if (slot.person !== slug) continue;
    const list = days.get(slot.day);
    if (list) list.push(slot);
    else days.set(slot.day, [slot]);
  }

  if (!days.size) return <p className="muted">{name} has no free hour in the next seven days.</p>;

  return (
    <>
      <div>
        {[...days].map(([day, slots]) => (
          <div key={day} className="their-day">
            <div>
              {weekdayLong(day)}
              <span>{dateShort(day)}</span>
            </div>
            <div className="their-day__hours">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  className="hour"
                  data-level="2"
                  data-mine={mine.has(slot.id) || undefined}
                  aria-label={`${weekdayLong(day)} ${dateShort(day)}, ${hourLabel(slot.hour)}${mine.has(slot.id) ? ', you asked for this hour' : ''}`}
                  onClick={() => setOpen(slot)}
                >
                  {hourLabel(slot.hour)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="their-hours__note">
        All times are İstanbul time (UTC+3). An outlined hour is one you have asked for.
      </p>
      {open && <RequestDialog key={open.id} slots={[open]} onClose={() => setOpen(null)} />}
    </>
  );
}
