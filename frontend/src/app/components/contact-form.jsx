"use client"

import { useState } from "react"
import styles from "./contact-form.module.css"
import { Send } from "lucide-react"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({ name: "", email: "", phone: "", message: "" })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {isSubmitted ? (
        <div className={styles.successMessage}>
          <p className={styles.successTitle}>Poruka uspješno poslana!</p>
          <p className={styles.successText}>Kontaktiraćemo vas u najkraćem mogućem roku.</p>
        </div>
      ) : (
        <>
          <div className={styles.formFields}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Ime i prezime
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email adresa
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>
                Telefon
              </label>
              <input id="phone" name="phone" value={formData.phone} onChange={handleChange} className={styles.input} />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>
                Poruka
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className={styles.textarea}
              />
            </div>
          </div>

          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? (
              <span className={styles.loadingText}>
                <svg className={styles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle
                    className={styles.spinnerCircle}
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className={styles.spinnerPath}
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Slanje...
              </span>
            ) : (
              <span className={styles.buttonText}>
                Pošalji poruku
                <Send className={styles.sendIcon} />
              </span>
            )}
          </button>
        </>
      )}
    </form>
  )
}
