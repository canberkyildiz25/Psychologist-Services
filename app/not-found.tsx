import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nobody is in this room',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="main">
      <div className="wrap hero">
        <div>
          <h1>Nobody is in this room.</h1>
          <p className="hero__lede">The page you asked for is not here. The link may be old, or a letter may have gone astray.</p>
          <div className="hero__actions">
            <Link className="btn" href="/#hours">
              See open hours
            </Link>
            <Link className="btn btn--quiet" href="/people/">
              Meet the psychologists
            </Link>
          </div>
        </div>
        <img
          className="hero__image"
          src="/img/waiting-1600.webp"
          srcSet="/img/waiting-800.webp 800w, /img/waiting-1600.webp 1600w"
          sizes="(min-width: 60rem) 46vw, 100vw"
          alt="An empty wooden bench and a small olive tree in a bright room, beside an open door"
          width={1600}
          height={1216}
        />
      </div>
    </main>
  );
}
