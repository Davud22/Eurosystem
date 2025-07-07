"use client"

import { useState } from "react"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react"
import styles from "./Kontakt.module.css"

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Kontakt forma poslana:", formData)
    // Ovdje će biti logika za slanje forme
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.heroTitle}>Kontaktirajte nas</h1>
            <p className={styles.heroDescription}>Spremni smo da odgovorimo na sva vaša pitanja i zahtjeve</p>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.contactInfo}>
              <h2 className={styles.sectionTitle}>Informacije o kontaktu</h2>

              <div className={styles.infoCards}>
                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <MapPin size={24} />
                  </div>
                  <div className={styles.infoContent}>
                    <h3 className={styles.infoTitle}>Adresa</h3>
                    <p className={styles.infoText}>
                      Bulevar Kralja Aleksandra 73
                      <br />
                      11000 Beograd, Srbija
                    </p>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <Phone size={24} />
                  </div>
                  <div className={styles.infoContent}>
                    <h3 className={styles.infoTitle}>Telefon</h3>
                    <p className={styles.infoText}>
                      +381 11 123 4567
                      <br />
                      +381 64 123 4567
                    </p>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <Mail size={24} />
                  </div>
                  <div className={styles.infoContent}>
                    <h3 className={styles.infoTitle}>Email</h3>
                    <p className={styles.infoText}>
                      info@eurosystem.rs
                      <br />
                      podrska@eurosystem.rs
                    </p>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <Clock size={24} />
                  </div>
                  <div className={styles.infoContent}>
                    <h3 className={styles.infoTitle}>Radno vrijeme</h3>
                    <p className={styles.infoText}>
                      Pon - Pet: 08:00 - 17:00
                      <br />
                      Sub: 09:00 - 14:00
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.mapSection}>
                <h3 className={styles.mapTitle}>Naša lokacija</h3>
                <div className={styles.mapPlaceholder}>
                  <MapPin size={48} />
                  <p>Interaktivna mapa lokacije</p>
                </div>
              </div>
            </div>

            <div className={styles.contactForm}>
              <h2 className={styles.sectionTitle}>Pošaljite nam poruku</h2>
              <p className={styles.formDescription}>Popunite formu ispod i kontaktiraćemo vas u najkraćem roku</p>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
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

                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                      Email adresa *
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
                </div>

                <div className={styles.formRow}>
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

                  <div className={styles.formGroup}>
                    <label htmlFor="subject" className={styles.label}>
                      Tema *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={styles.select}
                    >
                      <option value="">Izaberite temu</option>
                      <option value="ponuda">Zahtjev za ponudu</option>
                      <option value="podrska">Tehnička podrška</option>
                      <option value="informacije">Opšte informacije</option>
                      <option value="ostalo">Ostalo</option>
                    </select>
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
                    rows={6}
                    className={styles.textarea}
                    placeholder="Opišite vaš zahtjev ili pitanje..."
                  />
                </div>

                <button type="submit" className={styles.submitButton}>
                  <Send size={20} />
                  Pošalji poruku
                </button>
              </form>

              <div className={styles.quickContact}>
                <div className={styles.quickContactItem}>
                  <MessageCircle size={20} />
                  <span>Brza podrška: +381 64 123 4567</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
