import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styles from "./AppointmentModal.module.css";

const schema = yup.object({
  name: yup.string().min(2, "Minimum 2 characters").required("Name is required"),
  phone: yup.string().min(7, "Enter a valid phone number").required("Phone is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  comment: yup.string().required("Comment is required"),
});

const TIME_SLOTS = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30",
];

export default function AppointmentModal({ psychologist, onClose }) {
  const [selectedTime, setSelectedTime] = useState("09:30");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { phone: "+380" },
  });

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 400));
    alert(`Appointment booked with ${psychologist.name} at ${selectedTime}!`);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>✕</button>
        <h2 className={styles.title}>Make an appointment with a psychologists</h2>
        <p className={styles.subtitle}>
          You are on the verge of changing your life for the better. Fill out the short form
          below to book your personal appointment with a professional psychologist. We guarantee
          confidentiality and respect for your privacy.
        </p>

        <div className={styles.psychInfo}>
          <img src={psychologist.avatar_url} alt={psychologist.name} className={styles.psychAvatar} />
          <div>
            <p className={styles.psychLabel}>Your psychologist</p>
            <p className={styles.psychName}>{psychologist.name}</p>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <input className={`${styles.input} ${errors.name ? styles.inputError : ""}`} type="text" placeholder="Name" {...register("name")} />
            {errors.name && <p className={styles.errorMsg}>{errors.name.message}</p>}
          </div>

          <div className={styles.row}>
            <div>
              <input className={`${styles.input} ${errors.phone ? styles.inputError : ""}`} type="tel" placeholder="+380" {...register("phone")} />
              {errors.phone && <p className={styles.errorMsg}>{errors.phone.message}</p>}
            </div>
            <div className={styles.timeWrap}>
              <div className={styles.timeInput}>
                <span>{selectedTime}</span>
                <span className={styles.clockIcon}>🕐</span>
              </div>
              <div className={styles.timeDropdown}>
                <p className={styles.meetingLabel}>Meeting time</p>
                <ul className={styles.timeList}>
                  {TIME_SLOTS.map((t) => (
                    <li key={t} className={`${styles.timeItem} ${t === selectedTime ? styles.timeActive : ""}`} onClick={() => setSelectedTime(t)}>
                      {t.replace(":", " : ")}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <input className={`${styles.input} ${errors.email ? styles.inputError : ""}`} type="email" placeholder="Email" {...register("email")} />
            {errors.email && <p className={styles.errorMsg}>{errors.email.message}</p>}
          </div>

          <div>
            <textarea className={`${styles.input} ${styles.textarea} ${errors.comment ? styles.inputError : ""}`} placeholder="Comment" rows={3} {...register("comment")} />
            {errors.comment && <p className={styles.errorMsg}>{errors.comment.message}</p>}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
