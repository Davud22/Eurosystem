"use client"

import { useState } from "react"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import styles from "./Kontakt.module.css"

export default function KontaktPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    setSuccess("")
    setError("")
    try {
      const res = await fetch(`${BACKEND_URL}/user/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message
        })
      })
      if (res.ok) {
        setSuccess("Poruka je uspješno poslana!")
        setForm({ name: "", email: "", phone: "", message: "" })
      } else {
        const data = await res.json()
        setError(data.detail || "Greška pri slanju poruke.")
      }
    } catch (err) {
      setError("Greška pri slanju poruke.")
    }
    setSending(false)
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.contactForm}>
            <h2 className={styles.sectionTitle}>Pošaljite nam poruku</h2>
            <form onSubmit={handleSubmit} className={styles.form} autoComplete="off">
              <div className={styles.formGroup}>
                <label htmlFor="name">Ime i prezime *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="Unesite vaše ime"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="vas@email.com"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Telefon</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="+381 64 123 4567"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="message">Poruka *</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={styles.textarea}
                  placeholder="Opišite vaš zahtjev ili pitanje..."
                />
              </div>
              <button type="submit" disabled={sending} className={styles.submitButton}>
                {sending ? "Šaljem..." : "Pošalji poruku"}
              </button>
              {success && <div style={{ color: 'lightgreen', marginTop: 8 }}>{success}</div>}
              {error && <div style={{ color: 'salmon', marginTop: 8 }}>{error}</div>}
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
