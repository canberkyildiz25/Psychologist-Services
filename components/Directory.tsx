'use client';

import Link from 'next/link';
import { useId, useMemo, useState } from 'react';
import { NO_FILTERS, isFiltered, matches, type Filters } from '@/lib/filter';
import { FOCUS, PEOPLE, firstName, meets, portrait } from '@/lib/people';
import { hourLabel, relativeDay, type Slot } from '@/lib/schedule';
import { useOpenSlots } from '@/lib/store';
import { FilterBar } from './FilterBar';
import { ShortlistButton } from './ShortlistButton';

type Order = 'soonest' | 'fee' | 'longest';

/** Everyone in the practice, one row each, with their next free hour. */
export function Directory() {
  const id = useId();
  const live = useOpenSlots();
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [order, setOrder] = useState<Order>('soonest');

  // Slots arrive earliest first, so the first one seen for a person is their next.
  const next = useMemo(() => {
    const byPerson = new Map<string, Slot>();
    for (const slot of live?.slots ?? []) if (!byPerson.has(slot.person)) byPerson.set(slot.person, slot);
    return byPerson;
  }, [live]);

  const people = PEOPLE.filter((person) => matches(person, filters)).sort((a, b) => {
    if (order === 'fee') return a.fee - b.fee;
    if (order === 'longest') return a.since - b.since;
    return (next.get(a.slug)?.start ?? Infinity) - (next.get(b.slug)?.start ?? Infinity);
  });

  return (
    <>
      <FilterBar value={filters} onChange={setFilters}>
        <div className="field">
          <label htmlFor={`${id}-order`}>Order</label>
          <select id={`${id}-order`} className="select" value={order} onChange={(event) => setOrder(event.target.value as Order)}>
            <option value="soonest">Free soonest</option>
            <option value="fee">Lowest fee</option>
            <option value="longest">Longest in practice</option>
          </select>
        </div>
        {isFiltered(filters) && (
          <button type="button" className="btn btn--quiet" onClick={() => setFilters(NO_FILTERS)}>
            Clear
          </button>
        )}
      </FilterBar>

      <p className="tally" role="status">
        {people.length ? `${people.length} of ${PEOPLE.length} psychologists.` : 'Nobody matches all three. Loosen one of them.'}
      </p>

      <ul className="people">
        {people.map((person) => {
          const slot = next.get(person.slug);
          return (
            <li key={person.slug} className="person">
              <Link href={`/people/${person.slug}/`} tabIndex={-1} aria-hidden="true">
                <img
                  className="person__photo"
                  src={portrait(person.slug, 480)}
                  srcSet={`${portrait(person.slug, 160)} 160w, ${portrait(person.slug, 480)} 480w`}
                  sizes="(min-width: 52rem) 8.5rem, 5.5rem"
                  alt=""
                  width={480}
                  height={594}
                  loading="lazy"
                  decoding="async"
                />
              </Link>
              <div className="person__head">
                <h2>
                  <Link className="link" href={`/people/${person.slug}/`}>
                    {person.name}
                  </Link>
                </h2>
                <p className="person__title">
                  {person.title}, in practice since {person.since}
                </p>
              </div>
              <dl className="person__facts">
                <div>
                  <dt>Works with</dt>
                  <dd>{person.focus.map((focus) => FOCUS[focus]).join(', ')}</dd>
                </div>
                <div>
                  <dt>Languages</dt>
                  <dd>{person.languages.join(', ')}</dd>
                </div>
                <div>
                  <dt>Meets</dt>
                  <dd>{meets(person)}</dd>
                </div>
                <div>
                  <dt>Fee</dt>
                  <dd>€{person.fee} for fifty minutes</dd>
                </div>
              </dl>
              <div className="person__side">
                <p className="person__next">
                  {!live ? (
                    <span className="muted">Checking their hours.</span>
                  ) : slot ? (
                    <>
                      Next free <b>{relativeDay(slot.day, live.now)}</b> at <b className="nums">{hourLabel(slot.hour)}</b>
                    </>
                  ) : (
                    <span className="muted">No free hour this week</span>
                  )}
                </p>
                <Link className="btn btn--small" href={`/people/${person.slug}/#hours`}>
                  See {firstName(person)}&rsquo;s hours
                </Link>
                <ShortlistButton slug={person.slug} name={person.name} />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
