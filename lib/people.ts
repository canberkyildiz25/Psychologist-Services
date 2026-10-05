/* The practice. Every person here is invented, and so are their portraits:
   FIFTY is a demonstration, and the site says so wherever it matters. */

export type Focus = 'anxiety' | 'low-mood' | 'trauma' | 'relationships' | 'grief' | 'burnout' | 'teens' | 'sleep' | 'adhd';
export type Format = 'video' | 'room';
export type Language = 'English' | 'Turkish' | 'German' | 'Spanish' | 'Arabic' | 'Polish' | 'Norwegian' | 'Japanese';

export const FOCUS: Record<Focus, string> = {
  anxiety: 'Anxiety and panic',
  'low-mood': 'Low mood',
  trauma: 'Trauma',
  relationships: 'Relationships',
  grief: 'Grief and loss',
  burnout: 'Work and burnout',
  teens: 'Teenagers',
  sleep: 'Sleep',
  adhd: 'Adult ADHD',
};

export const FORMAT: Record<Format, string> = {
  video: 'Video call',
  room: 'In the room, İstanbul',
};

export interface Person {
  slug: string;
  name: string;
  /** Professional title as it would appear on a door plate. */
  title: string;
  since: number;
  focus: Focus[];
  approach: string[];
  languages: Language[];
  formats: Format[];
  /** Fee for one fifty-minute session, in euros. */
  fee: number;
  /** Two plain sentences on how they work. */
  about: string;
  /** Hours they offer on each weekday (1 = Monday ... 6 = Saturday), practice time. */
  hours: Partial<Record<1 | 2 | 3 | 4 | 5 | 6, number[]>>;
  /** Out of 100: how much of the offered time is usually already taken. */
  busy: number;
}

export const PEOPLE: Person[] = [
  {
    slug: 'elif-karaaslan',
    name: 'Dr. Elif Karaaslan',
    title: 'Clinical psychologist',
    since: 2008,
    focus: ['anxiety', 'low-mood', 'sleep'],
    approach: ['CBT', 'CBT for insomnia'],
    languages: ['Turkish', 'English'],
    formats: ['room', 'video'],
    fee: 110,
    about:
      'I work in a structured way: we agree what you want to change and check every few weeks whether it is changing. Sessions usually end with one small thing to try before the next.',
    hours: { 1: [9, 10, 11, 14, 15], 2: [9, 10, 11], 3: [14, 15, 16, 17], 4: [9, 10, 11, 14], 5: [9, 10] },
    busy: 62,
  },
  {
    slug: 'jonas-lindqvist',
    name: 'Jonas Lindqvist',
    title: 'Psychotherapist',
    since: 2015,
    focus: ['burnout', 'anxiety', 'adhd'],
    approach: ['ACT', 'Compassion-focused therapy'],
    languages: ['English', 'German'],
    formats: ['video'],
    fee: 85,
    about:
      'Most people I see are worn out by work and unsure whether the problem is the job or them. We look at what you are carrying, what you can put down, and what matters enough to keep.',
    hours: { 1: [16, 17, 18, 19], 2: [16, 17, 18, 19], 3: [8, 9, 10], 4: [16, 17, 18, 19], 6: [10, 11, 12] },
    busy: 48,
  },
  {
    slug: 'amara-okafor',
    name: 'Dr. Amara Okafor',
    title: 'Clinical psychologist',
    since: 2011,
    focus: ['trauma', 'anxiety', 'grief'],
    approach: ['EMDR', 'Trauma-focused CBT'],
    languages: ['English'],
    formats: ['video', 'room'],
    fee: 120,
    about:
      'Trauma work goes at the speed your body allows, and the first sessions are about feeling steady, not about retelling. I explain every step before we take it, and you can stop at any point.',
    hours: { 1: [10, 11, 13, 14], 2: [10, 11, 13, 14, 15], 4: [10, 11, 13, 14], 5: [10, 11, 13] },
    busy: 70,
  },
  {
    slug: 'defne-yalcin',
    name: 'Defne Yalçın',
    title: 'Couples and family therapist',
    since: 2013,
    focus: ['relationships', 'teens'],
    approach: ['Emotionally focused therapy', 'Family systems'],
    languages: ['Turkish', 'English'],
    formats: ['room', 'video'],
    fee: 130,
    about:
      'I see couples and families together, because the pattern between people is usually easier to change than any one person. I do not take sides, and I will say so if I notice myself doing it.',
    hours: { 2: [17, 18, 19], 3: [10, 11, 12, 17, 18], 4: [17, 18, 19], 5: [14, 15, 16], 6: [10, 11, 12, 13] },
    busy: 58,
  },
  {
    slug: 'mateo-ruiz',
    name: 'Dr. Mateo Ruiz',
    title: 'Clinical psychologist',
    since: 2004,
    focus: ['low-mood', 'grief', 'relationships'],
    approach: ['Psychodynamic therapy'],
    languages: ['Spanish', 'English'],
    formats: ['video'],
    fee: 95,
    about:
      'I listen for what keeps repeating: in your week, in your history, and in the room with me. This is slower work than a skills course, and it suits people who want to understand why as well as what.',
    hours: { 1: [12, 13, 14, 15], 2: [12, 13, 14], 3: [12, 13, 14, 15, 16], 4: [12, 13], 5: [12, 13, 14, 15] },
    busy: 44,
  },
  {
    slug: 'hana-kobayashi',
    name: 'Hana Kobayashi',
    title: 'Counselling psychologist',
    since: 2018,
    focus: ['anxiety', 'burnout', 'sleep'],
    approach: ['CBT', 'Mindfulness-based cognitive therapy'],
    languages: ['Japanese', 'English'],
    formats: ['video'],
    fee: 70,
    about:
      'I keep sessions practical and write a short summary after each one so nothing depends on your memory. If something I suggest does not fit your life, we change the suggestion, not your life.',
    hours: { 1: [8, 9, 10, 11], 3: [8, 9, 10, 11], 4: [8, 9], 5: [8, 9, 10, 11, 12], 6: [9, 10] },
    busy: 40,
  },
  {
    slug: 'selin-aydemir',
    name: 'Dr. Selin Aydemir',
    title: 'Child and adolescent psychologist',
    since: 2010,
    focus: ['teens', 'anxiety', 'adhd'],
    approach: ['CBT', 'Parent work'],
    languages: ['Turkish', 'English', 'German'],
    formats: ['room', 'video'],
    fee: 100,
    about:
      'I see teenagers on their own and their parents separately, with clear rules about what stays private. The first meeting is for the young person to decide whether they want to come back.',
    hours: { 1: [15, 16, 17, 18], 2: [15, 16, 17, 18], 3: [15, 16, 17], 4: [15, 16, 17, 18], 6: [9, 10, 11] },
    busy: 66,
  },
  {
    slug: 'tomasz-wrona',
    name: 'Tomasz Wrona',
    title: 'Psychotherapist',
    since: 2016,
    focus: ['adhd', 'burnout', 'low-mood'],
    approach: ['Schema therapy', 'CBT'],
    languages: ['Polish', 'English'],
    formats: ['video'],
    fee: 75,
    about:
      'I work with adults who were told for years to try harder. We map what actually helps you start, keep going and stop, then build a week around that instead of around willpower.',
    hours: { 1: [18, 19], 2: [9, 10, 18, 19], 3: [18, 19], 4: [9, 10, 11, 18, 19], 5: [16, 17, 18] },
    busy: 46,
  },
  {
    slug: 'leila-haddad',
    name: 'Dr. Leila Haddad',
    title: 'Clinical psychologist',
    since: 2007,
    focus: ['trauma', 'grief', 'low-mood'],
    approach: ['EMDR', 'Narrative therapy'],
    languages: ['Arabic', 'English', 'Turkish'],
    formats: ['room', 'video'],
    fee: 115,
    about:
      'Many of the people I see have left a country as well as a past. We work in whichever language the memory lives in, and we make room for what was lost as well as what hurt.',
    hours: { 1: [9, 10, 11, 12], 2: [14, 15, 16], 3: [9, 10, 11, 12], 5: [9, 10, 11, 14, 15] },
    busy: 60,
  },
  {
    slug: 'ingrid-solberg',
    name: 'Ingrid Solberg',
    title: 'Psychotherapist',
    since: 2012,
    focus: ['grief', 'relationships', 'sleep'],
    approach: ['Person-centred therapy'],
    languages: ['Norwegian', 'English'],
    formats: ['video'],
    fee: 80,
    about:
      'I do not arrive with a plan for you. I follow what you bring, at your pace, and I say plainly what I notice. People often come to me after a loss that everyone else expects them to be over.',
    hours: { 2: [11, 12, 13, 19], 3: [19], 4: [11, 12, 13, 19], 5: [11, 12, 13], 6: [11, 12, 13, 14] },
    busy: 42,
  },
];

export const personBySlug = (slug: string) => PEOPLE.find((person) => person.slug === slug);

export const years = (person: Person, now = new Date()) => now.getFullYear() - person.since;

/** "Elif" from "Dr. Elif Karaaslan". */
export const firstName = (person: Person) => person.name.replace(/^Dr\.\s+/, '').split(' ')[0];

/** Portraits are stored at three widths; the files are a shade taller than 4:5. */
export const portrait = (slug: string, width: 160 | 480 | 960) => `/img/people/${slug}-${width}.webp`;

/** "In the room in İstanbul, or by video call" */
export const meets = (person: Person) => (person.formats.includes('room') ? 'In the room in İstanbul, or by video call' : 'By video call');
