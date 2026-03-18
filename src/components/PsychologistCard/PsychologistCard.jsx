import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import AppointmentModal from "../AppointmentModal/AppointmentModal";
import styles from "./PsychologistCard.module.css";

export default function PsychologistCard({ psychologist }) {
  const { user } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [expanded, setExpanded] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const favorite = isFavorite(psychologist.id);

  const handleFavorite = () => {
    if (!user) {
      setShowAuthWarning(true);
      setTimeout(() => setShowAuthWarning(false), 3000);
      return;
    }
    toggleFavorite(psychologist);
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.avatarCol}>
          <div className={styles.avatarWrap}>
            <img
              src={psychologist.avatar_url}
              alt={psychologist.name}
              className={styles.avatar}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(psychologist.name)}&background=ede8f8&color=7c5cbf&size=96&bold=true`;
              }}
            />
            <span className={styles.onlineDot} />
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.topRow}>
            <div className={styles.nameBlock}>
              <p className={styles.label}>Psychologist</p>
              <h3 className={styles.name}>{psychologist.name}</h3>
            </div>
            <div className={styles.metaBlock}>
              <span className={styles.ratingBadge}>
                <span className={styles.star}>⭐</span>
                Rating: {Number(psychologist.rating).toFixed(2)}
              </span>
              <span className={styles.divider}>|</span>
              <span className={styles.price}>
                Price / 1 hour: <span className={styles.priceVal}>{psychologist.price_per_hour}$</span>
              </span>
              <button
                className={`${styles.favBtn} ${favorite ? styles.favActive : ""}`}
                onClick={handleFavorite}
                title={favorite ? "Remove from favorites" : "Add to favorites"}
              >
                {favorite ? "♥" : "♡"}
              </button>
            </div>
          </div>

          {showAuthWarning && (
            <div className={styles.authWarning}>
              Please log in to add psychologists to your favorites.
            </div>
          )}

          <div className={styles.tags}>
            <span className={styles.tag}><span className={styles.tagKey}>Experience: </span><span className={styles.tagVal}>{psychologist.experience}</span></span>
            <span className={styles.tag}><span className={styles.tagKey}>License: </span><span className={styles.tagVal}>{psychologist.license}</span></span>
            <span className={styles.tag}><span className={styles.tagKey}>Specialization: </span><span className={styles.tagVal}>{psychologist.specialization}</span></span>
            <span className={styles.tag}><span className={styles.tagKey}>Initial_consultation: </span><span className={styles.tagVal}>{psychologist.initial_consultation}</span></span>
          </div>

          <p className={styles.about}>{psychologist.about}</p>

          {!expanded && (
            <button className={styles.readMoreBtn} onClick={() => setExpanded(true)}>
              Read more
            </button>
          )}

          {expanded && (
            <>
              <div className={styles.reviews}>
                {(psychologist.reviews || []).map((review, i) => (
                  <div key={i} className={styles.review}>
                    <div className={styles.reviewAvatar}>{review.reviewer.charAt(0)}</div>
                    <div className={styles.reviewBody}>
                      <p className={styles.reviewName}>{review.reviewer}</p>
                      <p className={styles.reviewRating}>
                        <span className={styles.reviewStar}>⭐</span>
                        {Number(review.rating).toFixed(1)}
                      </p>
                      <p className={styles.reviewComment}>{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className={styles.appointmentBtn} onClick={() => setShowAppointment(true)}>
                Make an appointment
              </button>
            </>
          )}
        </div>
      </div>

      {showAppointment && (
        <AppointmentModal psychologist={psychologist} onClose={() => setShowAppointment(false)} />
      )}
    </>
  );
}
