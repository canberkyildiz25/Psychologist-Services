import type { Metadata } from 'next';
import { MyRequests } from '@/components/MyRequests';

export const metadata: Metadata = {
  title: 'Your requests',
  description: 'The hours you asked for and the psychologists on your shortlist. Kept in this browser only.',
  robots: { index: false, follow: true },
};

export default function Requests() {
  return (
    <main id="main" className="wrap">
      <div className="page-head">
        <h1>Your requests</h1>
        <p>Kept in this browser and nowhere else. There is no account, so another device or a cleared browser will not show them.</p>
      </div>
      <div className="mine">
        <div>
          <MyRequests />
        </div>
        <img
          className="mine__image"
          src="/img/stones-800.webp"
          srcSet="/img/stones-800.webp 800w, /img/stones-1600.webp 1216w"
          sizes="20rem"
          alt=""
          width={800}
          height={989}
          loading="lazy"
          decoding="async"
        />
      </div>
    </main>
  );
}
