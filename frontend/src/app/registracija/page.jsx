"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Check } from "lucide-react"
import styles from "./Registracija.module.css"

export default function RegistracijaPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    newsletter: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [modal, setModal] = useState({ open: false, message: "" })

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setModal({ open: false, message: "" })
    if (formData.password !== formData.confirmPassword) {
      setModal({ open: true, message: "Lozinke se ne poklapaju!" })
      setIsLoading(false)
      return
    }
    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      })
      if (res.status === 409) {
        setModal({ open: true, message: "Email već postoji!" })
        setIsLoading(false)
        return
      }
      if (!res.ok) {
        setModal({ open: true, message: "Greška prilikom registracije!" })
        setIsLoading(false)
        return
      }
      setModal({ open: true, message: "Registracija uspješna! Preusmjeravanje na login..." })
      setTimeout(() => {
        window.location.href = "/prijava"
      }, 1500)
    } catch (err) {
      setModal({ open: true, message: "Greška na serveru!" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    if (name === "password") {
      checkPasswordStrength(value)
    }
  }

  const checkPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    setPasswordStrength(strength)
  }

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "Slaba"
      case 2:
      case 3:
        return "Srednja"
      case 4:
      case 5:
        return "Jaka"
      default:
        return ""
    }
  }

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "#ef4444"
      case 2:
      case 3:
        return "#f59e0b"
      case 4:
      case 5:
        return "#10b981"
      default:
        return "#e5e7eb"
    }
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.formContainer}>
            <div className={styles.header}>
              <h1 className={styles.title}>Kreirajte nalog</h1>
              <p className={styles.subtitle}>Pridružite se Eurosystem zajednici</p>
            </div>
            <div className={styles.authCard}>
              {modal.open && (
                <div style={{ background: "#fee", color: "#b00", padding: 12, borderRadius: 8, marginBottom: 16, textAlign: "center" }}>
                  {modal.message}
                </div>
              )}
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName" className={styles.label}>
                      Ime
                    </label>
                    <div className={styles.inputContainer}>
                      <User className={styles.inputIcon} size={20} />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        placeholder="Vaše ime"
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="lastName" className={styles.label}>
                      Prezime
                    </label>
                    <div className={styles.inputContainer}>
                      <User className={styles.inputIcon} size={20} />
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        placeholder="Vaše prezime"
                      />
                    </div>
                  </div>
                </div>

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
                  <label htmlFor="phone" className={styles.label}>
                    Telefon
                  </label>
                  <div className={styles.inputContainer}>
                    <Phone className={styles.inputIcon} size={20} />
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
                  {formData.password && (
                    <div className={styles.passwordStrength}>
                      <div className={styles.strengthBar}>
                        <div
                          className={styles.strengthFill}
                          style={{
                            width: `${(passwordStrength / 5) * 100}%`,
                            backgroundColor: getPasswordStrengthColor(),
                          }}
                        />
                      </div>
                      <span className={styles.strengthText} style={{ color: getPasswordStrengthColor() }}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword" className={styles.label}>
                    Potvrdite lozinku
                  </label>
                  <div className={styles.inputContainer}>
                    <Lock className={styles.inputIcon} size={20} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className={styles.input}
                      placeholder="Potvrdite lozinku"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={styles.passwordToggle}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <span className={styles.errorText}>Lozinke se ne poklapaju</span>
                  )}
                </div>

                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      required
                      className={styles.checkbox}
                    />
                    <span className={styles.checkboxText}>
                      Slažem se sa{" "}
                      <Link href="/uslovi-koriscenja" className={styles.link}>
                        uslovima korišćenja
                      </Link>{" "}
                      i{" "}
                      <Link href="/politika-privatnosti" className={styles.link}>
                        politikom privatnosti
                      </Link>
                    </span>
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleChange}
                      className={styles.checkbox}
                    />
                    <span className={styles.checkboxText}>Želim da primam newsletter sa novostima i ponudama</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !formData.agreeToTerms}
                  className={`${styles.submitButton} ${isLoading ? styles.loading : ""}`}
                >
                  {isLoading ? (
                    <div className={styles.spinner}></div>
                  ) : (
                    <>
                      Kreiraj nalog
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>

              <div className={styles.loginPrompt}>
                <p>
                  Već imate nalog?{" "}
                  <Link href="/prijava" className={styles.loginLink}>
                    Prijavite se
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className={styles.imageContainer}>
            <div className={styles.heroImage}>
              <img src="/ipkamera2.png" alt="IP Kamera" className={styles.image} style={{ maxWidth: '420px', height: '300px', borderRadius: '1rem' }} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
