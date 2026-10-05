'use client';

import Link from 'next/link';
import { useState } from 'react';
import { firstName, personBySlug, portrait } from '@/lib/people';
import { dateLong, endLabel, hourLabel, relativeDay } from '@/lib/schedule';
import { useFifty, useHydrated, useOpenSlots } from '@/lib/store';

/** What this browser remembers: the hours asked for, and the shortlist. */
export function MyRequests() {
  const hydrated = useHydrated();
  const live = useOpenSlots();
  const requests = useFifty((state) => state.requests);
  const shortlist = useFifty((state) => state.shortlist);
  const cancelRequest = useFifty((state) => state.cancelRequest);
  const toggleShortlist = useFifty((state) => state.toggleShortlist);
  // Cancelling asks once more, in place, before it removes anything.
  const [asking, setAsking] = useState<string | null>(null);

  if (!hydrated || !live) {
    return (
      <p className="muted" role="status">
        Looking in this browser.
      </p>
    );
  }

  const ordered = [...requests].sort((a, b) => a.start - b.start);
  const kept = shortlist.flatMap((slug) => personBySlug(slug) ?? []);

  return (
    <>
      <section aria-labelledby="asked">
        <h2 id="asked">Hours you asked for</h2>
        {ordered.length ? (
          <ul className="rows">
            {ordered.map((request) => {
              const person = personBySlug(request.person);
              if (!person) return null;
              const past = request.start < live.now;
              return (
                <li key={request.ref} className="row">
                  <img src={portrait(person.slug, 160)} alt="" width={160} height={198} loading="lazy" decoding="async" />
                  <div>
                    <strong>
                      {dateLong(request.day)}, {hourLabel(request.hour)} to {endLabel(request.hour)}
                    </strong>
                    <span>
                      <Link className="link" href={`/people/${person.slug}/`}>
                        {person.name}
                      </Link>
                      , {request.format === 'room' ? 'in the room in İstanbul' : 'by video call'}. Reference {request.ref}.{past && ' This hour has passed.'}
                    </span>
                  </div>
                  <div className="row__actions">
                    {asking === request.ref ? (
                      <>
                        <button
                          type="button"
                          className="btn btn--small"
                          onClick={() => {
                            cancelRequest(request.ref);
                            setAsking(null);
                          }}
                        >
                          Yes, cancel it
                        </button>
                        <button type="button" className="btn btn--quiet btn--small" onClick={() => setAsking(null)}>
                          Keep it
                        </button>
                      </>
                    ) : (
                      <button type="button" className="btn btn--quiet btn--small" aria-label={`${past ? 'Remove' : 'Cancel'} the request for ${dateLong(request.day)} at ${hourLabel(request.hour)}`} onClick={() => setAsking(request.ref)}>
                        {past ? 'Remove' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="empty">
            <p>You have not asked for an hour yet. The timetable shows every open one for the next seven days.</p>
            <Link className="btn" href="/#hours">
              See open hours
            </Link>
          </div>
        )}
      </section>

      <section aria-labelledby="kept">
        <h2 id="kept">Your shortlist</h2>
        {kept.length ? (
          <ul className="rows">
            {kept.map((person) => {
              const next = live.slots.find((slot) => slot.person === person.slug);
              return (
                <li key={person.slug} className="row">
                  <img src={portrait(person.slug, 160)} alt="" width={160} height={198} loading="lazy" decoding="async" />
                  <div>
                    <strong>
                      <Link className="link" href={`/people/${person.slug}/`}>
                        {person.name}
                      </Link>
                    </strong>
                    <span>
                      {person.title}. {next ? `Next free ${relativeDay(next.day, live.now)} at ${hourLabel(next.hour)}.` : 'No free hour this week.'}
                    </span>
                  </div>
                  <div className="row__actions">
                    <Link className="btn btn--small" href={`/people/${person.slug}/#hours`}>
                      See {firstName(person)}&rsquo;s hours
                    </Link>
                    <button type="button" className="btn btn--quiet btn--small" aria-label={`Take ${person.name} off the shortlist`} onClick={() => toggleShortlist(person.slug)}>
                      Take off
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="empty">
            <p>Nobody is on your shortlist. Add the people you are weighing up, and they will wait here.</p>
            <Link className="btn btn--quiet" href="/people/">
              Meet the psychologists
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
