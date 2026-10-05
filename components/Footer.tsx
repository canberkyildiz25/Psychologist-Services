import Link from 'next/link';

/** The footer carries the two things a visitor must not miss: none of this is
    real, and this site is not where to turn in an emergency. */
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__grid">
        <div>
          <h2>This is a demonstration</h2>
          <p>
            FIFTY is a portfolio project by Canberk Yıldız. The psychologists, their hours and their fees are invented, and the portraits and
            rooms were made with an image generator. Nothing you type is sent anywhere.
          </p>
          <div className="site-footer__links">
            <Link className="link" href="/people/">
              All psychologists
            </Link>
            <a className="link" href="https://canberkyildiz.netlify.app">
              Canberk&rsquo;s portfolio
            </a>
            <a className="link" href="https://github.com/canberkyildiz25/Psychologist-Services">
              Source on GitHub
            </a>
          </div>
        </div>
        <div>
          <h2>If you need help now</h2>
          <p>
            This site cannot help in an emergency. If you or someone near you is in danger, call your local emergency number: 112 in Türkiye and
            the EU, 999 in the UK, 911 in the US. In the US, the 988 Suicide &amp; Crisis Lifeline answers calls and texts at any hour.
          </p>
        </div>
      </div>
    </footer>
  );
}
