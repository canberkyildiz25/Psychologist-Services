'use client';

import { useId, type ReactNode } from 'react';
import { LANGUAGES, type Filters } from '@/lib/filter';
import { FOCUS, type Focus, type Format, type Language } from '@/lib/people';

/** Three ways to narrow: what it is about, how you meet, which language. */
export function FilterBar({ value, onChange, children }: { value: Filters; onChange: (next: Filters) => void; children?: ReactNode }) {
  const id = useId();
  return (
    <div className="filters">
      <div className="field">
        <label htmlFor={`${id}-focus`}>What it is about</label>
        <select id={`${id}-focus`} className="select" value={value.focus} onChange={(event) => onChange({ ...value, focus: event.target.value as Focus | '' })}>
          <option value="">Anything</option>
          {Object.entries(FOCUS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor={`${id}-format`}>How you meet</label>
        <select id={`${id}-format`} className="select" value={value.format} onChange={(event) => onChange({ ...value, format: event.target.value as Format | '' })}>
          <option value="">Either way</option>
          <option value="video">By video call</option>
          <option value="room">In the room, İstanbul</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor={`${id}-language`}>Language</label>
        <select
          id={`${id}-language`}
          className="select"
          value={value.language}
          onChange={(event) => onChange({ ...value, language: event.target.value as Language | '' })}
        >
          <option value="">Any language</option>
          {LANGUAGES.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>
      {children}
    </div>
  );
}
