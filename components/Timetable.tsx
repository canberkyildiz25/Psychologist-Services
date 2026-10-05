'use client';

import { useId, useMemo, useState, type KeyboardEvent } from 'react';
import { NO_FILTERS, isFiltered, matches, type Filters } from '@/lib/filter';
import { PEOPLE, firstName, personBySlug, portrait } from '@/lib/people';
import { FIRST_HOUR, LAST_HOUR, dateLong, dateShort, daysFrom, hourLabel, weekdayLong, weekdayShort, type Slot } from '@/lib/schedule';
import { useFifty, useOpenSlots } from '@/lib/store';
import { FilterBar } from './FilterBar';
import { RequestDialog } from './RequestDialog';

const HOURS = Array.from({ length: LAST_HOUR - FIRST_HOUR + 1 }, (_, index) => FIRST_HOUR + index);
const SUNDAY = 7;

/** One free person is pale, two or three are warmer, four or more are warmest. */
const level = (free: number) => (free >= 4 ? 3 : free >= 2 ? 2 : 1);
const cellKey = (day: string, hour: number) => `${day}_${hour}`;

const STEPS: Record<string, [number, number] | undefined> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

/** The week as a grid of hours. A square is tinted when someone can see you
    then; choosing it shows who. On a phone it is one day at a time. */
export function Timetable() {
  const hint = useId();
  const live = useOpenSlots();
  const requests = useFifty((state) => state.requests);
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [open, setOpen] = useState<Slot[] | null>(null);
  const [pickedDay, setPickedDay] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);

  const view = useMemo(() => {
    if (!live) return null;
    const people = new Set(PEOPLE.filter((person) => matches(person, filters)).map((person) => person.slug));
    const slots = live.slots.filter((slot) => people.has(slot.person));
    const cells = new Map<string, Slot[]>();
    for (const slot of slots) {
      const key = cellKey(slot.day, slot.hour);
      const list = cells.get(key);
      if (list) list.push(slot);
      else cells.set(key, [slot]);
    }
    return { days: daysFrom(live.now), slots, cells, people: people.size };
  }, [live, filters]);

  const filterBar = (
    <FilterBar value={filters} onChange={setFilters}>
      {isFiltered(filters) && (
        <button type="button" className="btn btn--quiet" onClick={() => setFilters(NO_FILTERS)}>
          Clear
        </button>
      )}
    </FilterBar>
  );

  if (!view) {
    return (
      <>
        {filterBar}
        <p className="tally" role="status">
          Working out the open hours.
        </p>
        <noscript>
          <p className="notice">Open hours are worked out in your browser from the current time, so they need JavaScript. The list of psychologists works without it.</p>
        </noscript>
        <div className="grid-week only-wide" aria-hidden="true">
          {Array.from({ length: 8 * (HOURS.length + 1) }, (_, index) => (index % 8 === 0 || index < 8 ? <span key={index} /> : <div key={index} className="skeleton" />))}
        </div>
        <div className="daylist only-narrow" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="skeleton" />
          ))}
        </div>
      </>
    );
  }

  const { days, slots, cells } = view;
  const mine = new Set(requests.map((request) => request.slot));
  const first = slots[0];
  const cursorKey = cursor && cells.has(cursor) ? cursor : first ? cellKey(first.day, first.hour) : null;
  const dayKey = pickedDay && days.some((day) => day.key === pickedDay) ? pickedDay : (first?.day ?? days[0].key);
  const dayHours = HOURS.filter((hour) => cells.has(cellKey(dayKey, hour)));
  const freePeople = new Set(slots.map((slot) => slot.person)).size;

  // One tab stop for the whole grid; the arrow keys move between open hours.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = STEPS[event.key];
    const from = (event.target as HTMLElement).closest<HTMLElement>('button.hour');
    if (!step || !from) return;
    const column = Number(from.dataset.c);
    const row = Number(from.dataset.r);
    let best: HTMLElement | null = null;
    let bestScore = Infinity;
    for (const cell of event.currentTarget.querySelectorAll<HTMLElement>('button.hour')) {
      const dc = Number(cell.dataset.c) - column;
      const dr = Number(cell.dataset.r) - row;
      let score: number;
      if (step[0]) {
        // sideways: the nearest day in that direction, then the nearest hour in it
        if (dc * step[0] <= 0) continue;
        score = Math.abs(dc) * 3 + Math.abs(dr);
      } else {
        // up and down stay inside the day
        if (dc !== 0 || dr * step[1] <= 0) continue;
        score = Math.abs(dr);
      }
      if (score < bestScore) {
        bestScore = score;
        best = cell;
      }
    }
    if (best) {
      event.preventDefault();
      best.focus();
    }
  };

  return (
    <>
      {filterBar}

      <p className="tally" role="status">
        {slots.length ? (
          <>
            <b className="nums">{slots.length}</b> open {slots.length === 1 ? 'hour' : 'hours'} in the next seven days, with {freePeople}{' '}
            {freePeople === 1 ? 'psychologist' : 'psychologists'}.
          </>
        ) : (
          'No open hour matches all three. Loosen one of them.'
        )}
      </p>

      <p id={hint} className="sr-only">
        Use the arrow keys to move between open hours.
      </p>
      <div className="grid-week only-wide" role="group" aria-label="Open hours for the next seven days" aria-describedby={hint} onKeyDown={onKeyDown}>
        {days.map((day, column) => (
          <div key={day.key} className="grid-week__day" style={{ gridColumn: column + 2, gridRow: 1 }} aria-hidden="true">
            <strong>{column === 0 ? 'Today' : weekdayShort(day.key)}</strong>
            <span>{dateShort(day.key)}</span>
          </div>
        ))}
        {HOURS.map((hour, row) => (
          <div key={hour} className="grid-week__hour" style={{ gridColumn: 1, gridRow: row + 2 }} aria-hidden="true">
            {hourLabel(hour)}
          </div>
        ))}
        {days.map((day, column) =>
          day.weekday === SUNDAY ? (
            <div key={day.key} className="grid-week__closed" style={{ gridColumn: column + 2, gridRow: `2 / span ${HOURS.length}` }}>
              <span>Closed on Sundays</span>
            </div>
          ) : (
            HOURS.map((hour, row) => {
              const key = cellKey(day.key, hour);
              const place = { gridColumn: column + 2, gridRow: row + 2 };
              const free = cells.get(key);
              if (!free) return <div key={key} className="hour--none" style={place} aria-hidden="true" />;
              return (
                <button
                  key={key}
                  type="button"
                  className="hour"
                  style={place}
                  data-level={level(free.length)}
                  data-mine={free.some((slot) => mine.has(slot.id)) || undefined}
                  data-c={column}
                  data-r={row}
                  tabIndex={key === cursorKey ? 0 : -1}
                  aria-label={`${dateLong(day.key)}, ${hourLabel(hour)}: ${free.length} free`}
                  onFocus={() => setCursor(key)}
                  onClick={() => setOpen(free)}
                >
                  <span>
                    <b className="nums">{free.length}</b> free
                  </span>
                  <span className="faces">
                    {free.slice(0, 3).map((slot) => (
                      <img key={slot.id} src={portrait(slot.person, 160)} alt="" width={160} height={198} loading="lazy" decoding="async" />
                    ))}
                  </span>
                </button>
              );
            })
          ),
        )}
      </div>

      <div className="only-narrow">
        <div className="daytabs" role="group" aria-label="Day">
          {days.map((day, index) => (
            <button key={day.key} type="button" aria-pressed={day.key === dayKey} onClick={() => setPickedDay(day.key)}>
              {index === 0 ? 'Today' : weekdayShort(day.key)}
              <span>{dateShort(day.key)}</span>
            </button>
          ))}
        </div>
        <div className="daylist">
          {dayHours.map((hour) => {
            const free = cells.get(cellKey(dayKey, hour)) ?? [];
            const names = free.map((slot) => personBySlug(slot.person)).flatMap((person) => (person ? [firstName(person)] : []));
            return (
              <button
                key={hour}
                type="button"
                className="hour"
                data-level={level(free.length)}
                data-mine={free.some((slot) => mine.has(slot.id)) || undefined}
                onClick={() => setOpen(free)}
              >
                <b>{hourLabel(hour)}</b>
                <span>{names.join(', ')}</span>
              </button>
            );
          })}
          {!dayHours.length && <p>{days.find((day) => day.key === dayKey)?.weekday === SUNDAY ? 'The practice is closed on Sundays.' : `Nothing open on ${weekdayLong(dayKey)}. Try another day.`}</p>}
        </div>
      </div>

      <div className="key">
        <span data-level="1">
          <i /> One person free
        </span>
        <span data-level="2">
          <i /> Two or three
        </span>
        <span data-level="3">
          <i /> Four or more
        </span>
        <span>All times are İstanbul time (UTC+3).</span>
      </div>

      {open && <RequestDialog key={open[0].id} slots={open} onClose={() => setOpen(null)} />}
    </>
  );
}
