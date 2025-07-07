"use client"

import { useState } from "react"
import Link from "next/link"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"
import styles from "./Prijava.module.css"

export default function PrijavaPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulacija API poziva
    setTimeout(() => {
      console.log("Prijava:", formData)
      setIsLoading(false)
      // Ovdje će biti logika za prijavu
    }, 2000)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleGoogleLogin = () => {
    console.log("Google prijava")
    // Ovdje će biti Google OAuth logika
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.formContainer}>
            <div className={styles.header}>
              <h1 className={styles.title}>Dobrodošli nazad</h1>
              <p className={styles.subtitle}>Prijavite se na vaš Eurosystem nalog</p>
            </div>

            <div className={styles.authCard}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email adresa
                  </label>
                  <div className={styles.inputContainer}>
                    <Mail className={styles.inputIcon} size={20} />
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

                <div className={styles.formGroup}>
                  <label htmlFor="password" className={styles.label}>
                    Lozinka
                  </label>
                  <div className={styles.inputContainer}>
                    <Lock className={styles.inputIcon} size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={styles.input}
                      placeholder="Unesite lozinku"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={styles.passwordToggle}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className={styles.formOptions}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className={styles.checkbox}
                    />
                    <span className={styles.checkboxText}>Zapamti me</span>
                  </label>
                  <Link href="/zaboravljena-lozinka" className={styles.forgotLink}>
                    Zaboravili ste lozinku?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`${styles.submitButton} ${isLoading ? styles.loading : ""}`}
                >
                  {isLoading ? (
                    <div className={styles.spinner}></div>
                  ) : (
                    <>
                      Prijavite se
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>

              <div className={styles.divider}>
                <span className={styles.dividerText}>ili</span>
              </div>

              <button onClick={handleGoogleLogin} className={styles.googleButton}>
                <svg className={styles.googleIcon} viewBox="0 0 24 24" width="20" height="20">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Nastavite sa Google
              </button>

              <div className={styles.signupPrompt}>
                <p>
                  Nemate nalog?{" "}
                  <Link href="/registracija" className={styles.signupLink}>
                    Registrujte se
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className={styles.imageContainer}>
            <div className={styles.heroImage}>
              <img
                src="/placeholder.svg?height=600&width=500"
                alt="Eurosystem sigurnosni sistemi"
                className={styles.image}
              />
            </div>
            <div className={styles.imageOverlay}>
              <h2 className={styles.overlayTitle}>Sigurnost na prvom mjestu</h2>
              <p className={styles.overlayText}>
                Pristupite vašem personalnom panelu i upravljajte sigurnosnim sistemima
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
