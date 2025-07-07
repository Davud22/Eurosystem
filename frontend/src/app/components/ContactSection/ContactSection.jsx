"use client"

import { useState } from "react"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"
import styles from "./ContactSection.module.css"

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Kontaktirajte nas</h2>
          <p className={styles.description}>Spremni smo da odgovorimo na sva vaša pitanja</p>
        </div>

        <div className={styles.content}>
          <div className={styles.contactInfo}>
            <h3 className={styles.infoTitle}>Informacije</h3>

            <div className={styles.infoItem}>
              <MapPin className={styles.infoIcon} />
              <div>
                <h4 className={styles.infoLabel}>Adresa</h4>
                <p className={styles.infoText}>
                  Bulevar Kralja Aleksandra 73
                  <br />
                  11000 Beograd, Srbija
                </p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <Phone className={styles.infoIcon} />
              <div>
                <h4 className={styles.infoLabel}>Telefon</h4>
                <p className={styles.infoText}>
                  +381 11 123 4567
                  <br />
                  +381 64 123 4567
                </p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <Mail className={styles.infoIcon} />
              <div>
                <h4 className={styles.infoLabel}>Email</h4>
                <p className={styles.infoText}>
                  info@eurosystem.rs
                  <br />
                  podrska@eurosystem.rs
                </p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <Clock className={styles.infoIcon} />
              <div>
                <h4 className={styles.infoLabel}>Radno vrijeme</h4>
                <p className={styles.infoText}>
                  Pon - Pet: 08:00 - 17:00
                  <br />
                  Sub: 09:00 - 14:00
                </p>
              </div>
            </div>

            <div className={styles.map}>
              <div className={styles.mapPlaceholder}>
                <MapPin size={48} />
                <p>Mapa lokacije</p>
              </div>
            </div>
          </div>

          <div className={styles.contactForm}>
            <h3 className={styles.formTitle}>Pošaljite poruku</h3>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Ime i prezime *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="Unesite vaše ime"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="vas@email.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.label}>
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="+381 64 123 4567"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>
                  Poruka *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={styles.textarea}
                  placeholder="Opišite vaš zahtjev ili pitanje..."
                />
              </div>

              <button type="submit" className={styles.submitButton}>
                <Send size={20} />
                Pošalji poruku
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
