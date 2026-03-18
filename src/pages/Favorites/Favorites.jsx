import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import PsychologistCard from "../../components/PsychologistCard/PsychologistCard";
import { Link } from "react-router-dom";
import styles from "./Favorites.module.css";

export default function Favorites() {
  const { user } = useAuth();
  const { favorites } = useFavorites();

  if (!user) {
    return (
      <main className={styles.page}>
        <div className={styles.empty}>
          <p className={styles.emptyIcon}>🔒</p>
          <h2 className={styles.emptyTitle}>Private page</h2>
          <p className={styles.emptyText}>Please log in to view your favorites.</p>
          <Link to="/" className={styles.backBtn}>Go Home</Link>
        </div>
      </main>
    );
  }

  if (favorites.length === 0) {
    return (
      <main className={styles.page}>
        <div className={styles.empty}>
          <p className={styles.emptyIcon}>♡</p>
          <h2 className={styles.emptyTitle}>No favorites yet</h2>
          <p className={styles.emptyText}>
            Browse psychologists and click the heart icon to save your favorites.
          </p>
          <Link to="/psychologists" className={styles.backBtn}>Browse Psychologists</Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <ul className={styles.list}>
          {favorites.map((p) => (
            <li key={p.id}>
              <PsychologistCard psychologist={p} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
