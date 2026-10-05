import { PEOPLE, type Focus, type Format, type Language, type Person } from './people';

/** What a visitor can narrow by. An empty string means "do not narrow". */
export interface Filters {
  focus: Focus | '';
  format: Format | '';
  language: Language | '';
}

export const NO_FILTERS: Filters = { focus: '', format: '', language: '' };

export const isFiltered = (filters: Filters) => Boolean(filters.focus || filters.format || filters.language);

export const matches = (person: Person, filters: Filters) =>
  (!filters.focus || person.focus.includes(filters.focus)) &&
  (!filters.format || person.formats.includes(filters.format)) &&
  (!filters.language || person.languages.includes(filters.language));

/** English first, since everyone here works in it; the rest in alphabetical order. */
export const LANGUAGES: Language[] = [...new Set(PEOPLE.flatMap((person) => person.languages))].sort((a, b) =>
  a === 'English' ? -1 : b === 'English' ? 1 : a.localeCompare(b),
);
