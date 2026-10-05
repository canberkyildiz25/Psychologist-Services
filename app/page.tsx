import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { NextOpen } from '@/components/NextOpen';
import { Timetable } from '@/components/Timetable';
import { PEOPLE, portrait } from '@/lib/people';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

/* How fifty minutes usually divide. The fourth part is the ten that make up
   the hour and belong to the psychologist. */
const PARTS = [
  { minutes: 10, name: 'Arriving', text: 'How the week went, and what you want from today.' },
  { minutes: 30, name: 'The work', text: 'The reason you came. Talking, an exercise, sometimes a long quiet. It goes where you take it.' },
  { minutes: 10, name: 'Closing', text: 'What to take with you, and when you meet next.' },
  { minutes: 10, name: 'The other ten', text: 'Not yours. Notes are written and the room is aired for whoever comes next.' },
];

export default function Home() {
  return (
    <main id="main">
      <div className="wrap hero">
        <div>
          <h1>
            <span>Pick the hour.</span> <span>Then the person.</span>
          </h1>
          <p className="hero__lede">Ten psychologists, one timetable. See every open fifty-minute session this week and ask for the one that fits.</p>
          <div className="hero__actions">
            <a className="btn" href="#hours">
              See open hours
            </a>
            <Link className="btn btn--quiet" href="/people/">
              Meet the psychologists
            </Link>
          </div>
          <NextOpen />
        </div>
        <img
          className="hero__image"
          src="/img/room-1600.webp"
          srcSet="/img/room-800.webp 800w, /img/room-1600.webp 1600w"
          sizes="(min-width: 60rem) 46vw, 100vw"
          alt="Two rounded cream armchairs facing each other across a small stone table with a glass of water, beside a tall window full of morning light"
          width={1600}
          height={1216}
          fetchPriority="high"
        />
      </div>

      <section id="hours" className="section" aria-labelledby="hours-title">
        <div className="wrap">
          <h2 id="hours-title">Open hours, next seven days</h2>
          <p className="section__lede">Each tinted square is an hour when someone can see you. The number says how many people are free. Choose a square to find out who.</p>
          <Timetable />
        </div>
      </section>

      <section className="section" aria-labelledby="fifty-title">
        <div className="wrap">
          <h2 id="fifty-title">Why fifty minutes, not sixty</h2>
          <p className="section__lede">The therapy hour is traditionally fifty minutes. Most sessions fall into three parts, roughly like this.</p>
          <div className="fifty">
            {PARTS.map((part) => (
              <div key={part.name} className="fifty__part" style={{ '--min': part.minutes } as CSSProperties}>
                <div className="fifty__bar" />
                <p className="fifty__min">{part.minutes} minutes</p>
                <h3>{part.name}</h3>
                <p>{part.text}</p>
              </div>
            ))}
          </div>
          <img
            className="band"
            src="/img/light-1600.webp"
            srcSet="/img/light-800.webp 800w, /img/light-1600.webp 1600w"
            sizes="(min-width: 84rem) 77rem, 92vw"
            alt="Morning sunlight and the shadow of leaves moving across a pale wall, above a wooden bench with a small terracotta vase"
            width={1600}
            height={1216}
            loading="lazy"
            decoding="async"
          />
        </div>
      </section>

      <section className="section" aria-labelledby="people-title">
        <div className="wrap">
          <h2 id="people-title">Who you would be talking to</h2>
          <p className="section__lede">
            Psychologists, psychotherapists and a family therapist, working in eight languages between them.{' '}
            <Link className="link" href="/people/">
              Compare all ten
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </p>
        </div>
        <div className="faces-row">
          {PEOPLE.map((person) => (
            <Link key={person.slug} className="face" href={`/people/${person.slug}/`}>
              <div className="face__frame">
                <img
                  src={portrait(person.slug, 480)}
                  srcSet={`${portrait(person.slug, 480)} 480w, ${portrait(person.slug, 960)} 960w`}
                  sizes="(min-width: 84rem) 15rem, (min-width: 52rem) 18vw, 12rem"
                  alt=""
                  width={480}
                  height={594}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <strong>{person.name}</strong>
              <span>{person.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="formats-title">
        <div className="wrap formats">
          <div className="formats__lead">
            <div>
              <h2 id="formats-title">In the room, or wherever you are</h2>
              <p className="section__lede">Five of the ten see people in İstanbul. All ten work by video call, and the hour is the same either way.</p>
            </div>
            <figure>
              <img
                src="/img/chairs-1600.webp"
                srcSet="/img/chairs-800.webp 800w, /img/chairs-1600.webp 1600w"
                sizes="(min-width: 52rem) 55vw, 92vw"
                alt="A rounded cream armchair with a terracotta cushion beside a small stone table holding a glass of water"
                width={1600}
                height={1216}
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                <strong>In the room</strong>
                <span>Two chairs, a door that closes, and water on the table. The practice is a short walk from the Kadıköy ferry.</span>
              </figcaption>
            </figure>
          </div>
          <figure>
            <img
              src="/img/desk-1600.webp"
              srcSet="/img/desk-800.webp 800w, /img/desk-1600.webp 1600w"
              sizes="(min-width: 52rem) 38vw, 92vw"
              alt="A laptop, white headphones, a small plant and a terracotta mug on a pale wooden desk by a window"
              width={1600}
              height={1216}
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <strong>By video call</strong>
              <span>Somewhere you will not be overheard, headphones, and a link that arrives with the confirmation.</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="section" aria-labelledby="closing-title">
        <div className="wrap closing">
          <img
            src="/img/dunes-1600.webp"
            srcSet="/img/dunes-800.webp 800w, /img/dunes-1600.webp 1600w"
            sizes="(min-width: 52rem) 55vw, 92vw"
            alt="Smooth terracotta sand dunes under a pale, misty sky"
            width={1600}
            height={1216}
            loading="lazy"
            decoding="async"
          />
          <div>
            <h2 id="closing-title">Start with one hour.</h2>
            <p>You do not have to find the right person today. Pick a time that is easy to keep, and see how the first fifty minutes feel.</p>
            <a className="btn" href="#hours">
              See open hours
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
