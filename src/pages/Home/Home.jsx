import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPsychologists } from "../../firebase/database";
import { psychologists as localData } from "../../data/psychologists";
import PsychologistCard from "../../components/PsychologistCard/PsychologistCard";
import styles from "./Home.module.css";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

function AnimatedCard({ psychologist, index }) {
  const [ref, visible] = useInView(0.1);

  return (
    <li
      ref={ref}
      className={`${styles.cardItem} ${visible ? styles.cardVisible : ""}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <PsychologistCard psychologist={psychologist} />
    </li>
  );
}

export default function Home() {
  const [sectionRef, sectionVisible] = useInView(0.05);
  const [preview, setPreview] = useState(localData.slice(0, 3));

  useEffect(() => {
    fetchPsychologists()
      .then((data) => { if (data.length > 0) setPreview(data.slice(0, 3)); })
      .catch(() => {});
  }, []);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1 className={styles.title}>
            The road to the{" "}
            <span className={styles.accent}>depths</span> of the human soul
          </h1>
          <p className={styles.subtitle}>
            We help you to reveal your potential, overcome challenges and find a
            guide in your own life with the help of our experienced
            psychologists.
          </p>
          <Link to="/psychologists" className={styles.ctaBtn}>
            Get started <span className={styles.arrow}>↗</span>
          </Link>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.imgFrame}>
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80"
              alt="Psychologist"
              className={styles.heroImg}
            />
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>✓</div>
            <div>
              <p className={styles.statLabel}>Experienced psychologists</p>
              <p className={styles.statNum}>15,000</p>
            </div>
          </div>
          <div className={styles.floatBubble1}>?</div>
          <div className={styles.floatBubble2}>👤</div>
        </div>
      </section>

      <section className={styles.previewSection} ref={sectionRef}>
        <div className={`${styles.previewHeader} ${sectionVisible ? styles.previewHeaderVisible : ""}`}>
          <h2 className={styles.previewTitle}>Our psychologists</h2>
          <Link to="/psychologists" className={styles.seeAllBtn}>
            See all →
          </Link>
        </div>
        <ul className={styles.previewList}>
          {preview.map((p, i) => (
            <AnimatedCard key={p.id} psychologist={p} index={i} />
          ))}
        </ul>
      </section>
    </main>
  );
}
