import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PersonHours } from '@/components/PersonHours';
import { ShortlistButton } from '@/components/ShortlistButton';
import { FOCUS, PEOPLE, firstName, meets, personBySlug, portrait } from '@/lib/people';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return PEOPLE.map((person) => ({ slug: person.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const person = personBySlug((await params).slug);
  if (!person) return {};
  return {
    title: person.name,
    description: `${person.name}, ${person.title.toLowerCase()} at FIFTY, a demonstration practice. ${person.about}`,
    alternates: { canonical: `/people/${person.slug}/` },
    // These people do not exist; a search engine should not list them as if they did.
    robots: { index: false, follow: true },
  };
}

export default async function Profile({ params }: Props) {
  const person = personBySlug((await params).slug);
  if (!person) notFound();

  return (
    <main id="main" className="wrap">
      <Link className="crumb" href="/people/">
        <ArrowLeft size={18} aria-hidden="true" />
        All psychologists
      </Link>

      <div className="profile">
        <div className="profile__left">
          <img
            className="profile__photo"
            src={portrait(person.slug, 960)}
            srcSet={`${portrait(person.slug, 480)} 480w, ${portrait(person.slug, 960)} 960w`}
            sizes="(min-width: 56rem) 22rem, 90vw"
            alt={`Portrait of ${person.name}`}
            width={960}
            height={1187}
            fetchPriority="high"
          />
        </div>

        <div>
          <h1>{person.name}</h1>
          <p className="profile__title">
            {person.title}, in practice since {person.since}
          </p>
          <p className="profile__about">{person.about}</p>

          <dl className="facts">
            <div>
              <dt>Works with</dt>
              <dd>{person.focus.map((focus) => FOCUS[focus]).join(', ')}</dd>
            </div>
            <div>
              <dt>Approach</dt>
              <dd>{person.approach.join(', ')}</dd>
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

          <div className="profile__keep">
            <ShortlistButton slug={person.slug} name={person.name} />
          </div>

          <section id="hours" className="their-hours" aria-labelledby="hours-title">
            <h2 id="hours-title">{firstName(person)}&rsquo;s open hours</h2>
            <PersonHours slug={person.slug} name={firstName(person)} />
          </section>
        </div>
      </div>
    </main>
  );
}
