import type { Metadata } from 'next';
import { EraseButton } from '@/components/EraseButton';
import { AUTHOR, SOURCE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About and privacy',
  description: 'What FIFTY is, what is real and what is invented, what the site keeps in your browser and how to erase it, and how it was made.',
  alternates: { canonical: '/about/' },
};

export default function About() {
  return (
    <main id="main" className="wrap">
      <div className="page-head">
        <h1>About FIFTY</h1>
        <p>A small, complete practice site, built to show how finding a therapy session could start with the hour instead of the person.</p>
      </div>

      <img
        className="band band--slim"
        src="/img/lake-1600.webp"
        srcSet="/img/lake-800.webp 800w, /img/lake-1600.webp 1600w"
        sizes="(min-width: 84rem) 77rem, 92vw"
        alt="A wooden jetty leading out over a still lake in morning mist"
        width={1600}
        height={1216}
        fetchPriority="high"
      />

      <div className="about">
        <section aria-labelledby="real">
          <h2 id="real">What is real and what is not</h2>
          <p>The timetable, the filters, the request form and the shortlist all work. The practice does not exist.</p>
          <p>
            The ten psychologists, their hours and their fees are invented. Their portraits and the rooms were made with an image generator, never
            taken from photographs of real people. No request leaves your browser, and nobody will write back.
          </p>
        </section>

        <section aria-labelledby="kept">
          <h2 id="kept">What is kept, and where</h2>
          <p>FIFTY has no accounts, no cookies, no analytics and no third-party scripts.</p>
          <p>
            Three things are saved in this browser&rsquo;s local storage so the site can show them again: the hours you asked for (the hour, the
            person, how you chose to meet and a reference), your shortlist, and your choice of light or dark. Your name, email and note are checked
            when you send the form and then discarded.
          </p>
          <EraseButton />
        </section>

        <section aria-labelledby="access">
          <h2 id="access">Accessibility</h2>
          <p>
            The site aims to meet WCAG 2.2 at level AA. Everything works from the keyboard: the timetable is a single tab stop, and the arrow keys
            move between open hours.
          </p>
          <p>
            Text keeps a contrast of at least 4.5 to 1 in both themes, touch targets are at least 44 pixels, and motion is switched off when your
            system asks for less of it. The pages read without JavaScript, though the timetable needs it.
          </p>
        </section>

        <section aria-labelledby="made">
          <h2 id="made">How it was made</h2>
          <p>
            Designed and built by{' '}
            <a className="link" href={AUTHOR.url}>
              Canberk Yıldız
            </a>{' '}
            with Next.js, React and TypeScript, and set in Albert Sans. The photographs were generated from prompts that fix one light, one wall
            and one accent colour, so that eighteen pictures read as one place.
          </p>
          <p>
            It began as a course exercise: a list of cards with a booking form on each. That version is in the history of the{' '}
            <a className="link" href={SOURCE}>
              repository
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
