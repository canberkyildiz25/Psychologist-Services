'use client';

import { X } from '@phosphor-icons/react';
import Link from 'next/link';
import { useEffect, useId, useRef, useState, type FormEvent, type MouseEvent } from 'react';
import { FORMAT, firstName, meets, personBySlug, portrait, type Format } from '@/lib/people';
import { PRACTICE_OFFSET_HOURS, dateLong, endLabel, hourLabel, type Slot } from '@/lib/schedule';
import { useFifty, type Request } from '@/lib/store';

/* Letters and digits that cannot be mistaken for one another when read aloud
   or copied by hand. */
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const makeRef = () => `F-${Array.from(crypto.getRandomValues(new Uint8Array(6)), (byte) => ALPHABET[byte % ALPHABET.length]).join('')}`;

/* Name, email and note are read to check the form and then dropped: nothing
   is sent, so nothing personal is kept. */
const newRequest = (slot: Slot, format: Format): Request => ({
  ref: makeRef(),
  slot: slot.id,
  person: slot.person,
  day: slot.day,
  hour: slot.hour,
  start: slot.start,
  format,
  made: Date.now(),
});

/** The same instant on the visitor's own clock, when that clock is not İstanbul's. */
function elsewhere(start: number): string | null {
  const date = new Date(start);
  if (date.getTimezoneOffset() === -PRACTICE_OFFSET_HOURS * 60) return null;
  return new Intl.DateTimeFormat('en-GB', { weekday: 'long', hour: '2-digit', minute: '2-digit' }).format(date);
}

interface Errors {
  name?: string;
  email?: string;
}

/** One open hour: who is free in it, then the request form, then the receipt.
    Mounted when an hour is chosen and removed when it closes. */
export function RequestDialog({ slots, onClose }: { slots: Slot[]; onClose: () => void }) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const [chosen, setChosen] = useState<Slot | null>(slots.length === 1 ? slots[0] : null);
  const [done, setDone] = useState<Request | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const requests = useFifty((state) => state.requests);
  const addRequest = useFifty((state) => state.addRequest);

  useEffect(() => {
    const element = dialog.current;
    if (element && !element.open) element.showModal();
  }, []);

  // Each step has a new heading; moving focus to it tells a screen reader
  // that the content changed.
  const asked = chosen && !done ? requests.find((request) => request.slot === chosen.id) : undefined;
  const step = done ? 'done' : asked ? 'asked' : chosen ? 'form' : 'pick';
  const firstStep = useRef(step);
  useEffect(() => {
    if (step !== firstStep.current) heading.current?.focus();
    firstStep.current = '';
  }, [step]);

  const { day, hour, start } = slots[0];
  const local = elsewhere(start);
  const person = chosen ? personBySlug(chosen.person) : undefined;
  const close = () => dialog.current?.close();

  const onBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialog.current) close();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!chosen || !person) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const next: Errors = {};
    if (name.length < 2) next.name = 'Enter the name you would like to be called.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = 'Enter an email address, like name@example.com.';
    setErrors(next);
    if (next.name || next.email) {
      form.querySelector<HTMLElement>(next.name ? '[name="name"]' : '[name="email"]')?.focus();
      return;
    }
    const request = newRequest(chosen, (data.get('format') as Format | null) ?? person.formats[0]);
    addRequest(request);
    setDone(request);
  };

  const title = done ? 'Request noted' : asked ? 'You asked for this hour' : person ? `Ask ${firstName(person)} for this hour` : 'Who would you like to see?';

  return (
    <dialog ref={dialog} className="sheet" aria-labelledby={`${id}-title`} onClose={onClose} onClick={onBackdrop}>
      <div className="sheet__in">
        <div className="sheet__head">
          <div>
            <h2 id={`${id}-title`} ref={heading} tabIndex={-1}>
              {title}
            </h2>
            <p className="sheet__when">
              {dateLong(day)}, {hourLabel(hour)} to {endLabel(hour)}, İstanbul time.
              {local && ` That is ${local} where you are.`}
            </p>
          </div>
          <button type="button" className="icon-btn" onClick={close} aria-label="Close">
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        {step === 'pick' && (
          <ul className="pick">
            {slots.map((slot) => {
              const who = personBySlug(slot.person);
              if (!who) return null;
              const mine = requests.find((request) => request.slot === slot.id);
              const body = (
                <>
                  <img src={portrait(who.slug, 160)} alt="" width={160} height={198} />
                  <span>
                    <span className="pick__name">{who.name}</span>
                    <span className="pick__meta">{mine ? `You asked for this hour. Reference ${mine.ref}.` : `${who.title}. ${meets(who)}.`}</span>
                  </span>
                  <span className="pick__fee">€{who.fee}</span>
                </>
              );
              return (
                <li key={slot.id}>
                  {mine ? (
                    <div className="chosen">{body}</div>
                  ) : (
                    <button type="button" onClick={() => setChosen(slot)}>
                      {body}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {step === 'form' && person && (
          <form className="form" noValidate onSubmit={submit}>
            <div className="chosen">
              <img src={portrait(person.slug, 160)} alt="" width={160} height={198} />
              <span>
                <span className="pick__name">{person.name}</span>
                <span className="pick__meta">{person.title}</span>
              </span>
              <span className="pick__fee">€{person.fee}</span>
            </div>

            <div className="field">
              <label htmlFor={`${id}-name`}>Your name</label>
              <input
                id={`${id}-name`}
                className="input"
                name="name"
                autoComplete="name"
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? `${id}-name-error` : undefined}
              />
              {errors.name && (
                <p id={`${id}-name-error`} className="field__error">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor={`${id}-email`}>Email</label>
              <input
                id={`${id}-email`}
                className="input"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                spellCheck={false}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? `${id}-email-error` : `${id}-email-hint`}
              />
              {errors.email ? (
                <p id={`${id}-email-error`} className="field__error">
                  {errors.email}
                </p>
              ) : (
                <p id={`${id}-email-hint`} className="field__hint">
                  Where the confirmation would go.
                </p>
              )}
            </div>

            {person.formats.length > 1 ? (
              <fieldset className="field">
                <legend className="label">How you would like to meet</legend>
                <div className="choices">
                  {person.formats.map((format, index) => (
                    <label key={format}>
                      <input type="radio" name="format" value={format} defaultChecked={index === 0} />
                      {FORMAT[format]}
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : (
              <p className="muted">
                {firstName(person)} meets by {FORMAT[person.formats[0]].toLowerCase()} only.
              </p>
            )}

            <div className="field">
              <label htmlFor={`${id}-note`}>Anything {firstName(person)} should know first (optional)</label>
              <textarea id={`${id}-note`} className="input" name="note" rows={2} maxLength={600} />
            </div>

            <p className="notice">FIFTY is a demonstration. Nothing is sent, and your name, email and note are not kept. Only the hour you asked for is remembered, in this browser.</p>

            <div className="form__actions">
              <button type="submit" className="btn">
                Ask for this hour
              </button>
              {slots.length > 1 && (
                <button
                  type="button"
                  className="btn btn--quiet"
                  onClick={() => {
                    setErrors({});
                    setChosen(null);
                  }}
                >
                  Choose someone else
                </button>
              )}
            </div>
          </form>
        )}

        {step === 'asked' && asked && person && (
          <div className="done">
            <p>
              You have already asked {person.name} for this hour, {asked.format === 'room' ? 'in the room in İstanbul' : 'by video call'}. Your reference:
            </p>
            <p className="done__ref">{asked.ref}</p>
            <div className="form__actions">
              <Link className="btn" href="/requests/">
                See your requests
              </Link>
              <button type="button" className="btn btn--quiet" onClick={close}>
                Close
              </button>
            </div>
          </div>
        )}

        {step === 'done' && done && person && (
          <div className="done">
            <p>
              You asked {person.name} for this hour, {done.format === 'room' ? 'in the room in İstanbul' : 'by video call'}. Your reference:
            </p>
            <p className="done__ref">{done.ref}</p>
            <p className="notice">
              In a working practice {firstName(person)} would confirm by email within a working day. Here nothing was sent: the request is kept in this
              browser, where you can see it or cancel it.
            </p>
            <div className="form__actions">
              <Link className="btn" href="/requests/">
                See your requests
              </Link>
              <button type="button" className="btn btn--quiet" onClick={close}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}
