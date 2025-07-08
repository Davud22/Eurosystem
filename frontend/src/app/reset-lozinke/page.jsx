"use client";
import styles from "./reset-lozinke.module.css";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetLozinke() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (password !== confirm) {
      setMsg("Lozinke se ne poklapaju!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      });
      const data = await res.json();
      if (res.ok) setMsg("Lozinka uspješno promijenjena! Možete se prijaviti.");
      else setMsg(data.detail || "Greška!");
    } catch {
      setMsg("Greška na serveru!");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <div className={styles.container + " " + styles.error}>Neispravan ili nedostaje token.</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Reset lozinke</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Nova lozinka"
          required
          className={styles.input}
        />
        <input
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="Potvrdite lozinku"
          required
          className={styles.input}
        />
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Mijenjam..." : "Promijeni lozinku"}
        </button>
      </form>
      {msg && (
        <div className={styles.msg + " " + (msg.includes("uspješno") ? styles.success : styles.error)}>{msg}</div>
      )}
    </div>
  );
} 