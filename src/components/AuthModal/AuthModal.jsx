import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { registerUser, loginUser } from "../../firebase/auth";
import styles from "./AuthModal.module.css";

const loginSchema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
});

const registerSchema = yup.object({
  name: yup.string().min(3, "Minimum 3 characters").required("Name is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
});

export default function AuthModal({ mode, onClose }) {
  const [tab, setTab] = useState(mode || "login");
  const [showPass, setShowPass] = useState(false);
  const [firebaseError, setFirebaseError] = useState("");

  const isLogin = tab === "login";

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(isLogin ? loginSchema : registerSchema),
  });

  useEffect(() => { setTab(mode || "login"); }, [mode]);

  useEffect(() => {
    reset();
    setFirebaseError("");
    setShowPass(false);
  }, [tab, reset]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onSubmit = async (data) => {
    setFirebaseError("");
    try {
      if (isLogin) {
        await loginUser(data.email, data.password);
      } else {
        await registerUser(data.name, data.email, data.password);
      }
      onClose();
    } catch (err) {
      const msg = err.code === "auth/email-already-in-use"
        ? "This email is already registered."
        : err.code === "auth/invalid-credential"
        ? "Invalid email or password."
        : "Something went wrong. Please try again.";
      setFirebaseError(msg);
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>✕</button>
        <h2 className={styles.title}>{isLogin ? "Log In" : "Registration"}</h2>
        <p className={styles.subtitle}>
          {isLogin
            ? "Welcome back! Please enter your credentials to continue."
            : "Thank you for your interest in our platform! Please provide us with the following information."}
        </p>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          {!isLogin && (
            <div>
              <input className={`${styles.input} ${errors.name ? styles.inputError : ""}`} type="text" placeholder="Name" {...register("name")} />
              {errors.name && <p className={styles.errorMsg}>{errors.name.message}</p>}
            </div>
          )}
          <div>
            <input className={`${styles.input} ${errors.email ? styles.inputError : ""}`} type="email" placeholder="Email" {...register("email")} />
            {errors.email && <p className={styles.errorMsg}>{errors.email.message}</p>}
          </div>
          <div>
            <div className={styles.passWrap}>
              <input className={`${styles.input} ${errors.password ? styles.inputError : ""}`} type={showPass ? "text" : "password"} placeholder="Password" {...register("password")} />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPass((v) => !v)}>
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
            {errors.password && <p className={styles.errorMsg}>{errors.password.message}</p>}
          </div>

          {firebaseError && <p className={styles.firebaseError}>{firebaseError}</p>}

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? "Please wait…" : isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className={styles.switchText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button className={styles.switchBtn} onClick={() => setTab(isLogin ? "register" : "login")}>
            {isLogin ? "Register" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  );
}
