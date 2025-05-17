"use client"

import { useState } from "react"
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import styles from "./register-modal.module.css"

export default function RegisterModal({ isOpen, onClose, onLoginClick }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle registration logic here
    console.log("Registration attempt with:", formData)
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* Close button */}
        <button onClick={onClose} className={styles.closeButton}>
          <X className={styles.closeIcon} />
        </button>

        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Registracija</h2>
          <p className={styles.modalSubtitle}>Kreirajte vaš Eurosystem račun</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formFields}>
            <div className={styles.nameFields}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName" className={styles.label}>
                  Ime
                </label>
                <div className={styles.inputWrapper}>
                  <div className={styles.inputIcon}>
                    <User className={styles.icon} />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    placeholder="Ime"
                    className={styles.input}
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastName" className={styles.label}>
                  Prezime
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  placeholder="Prezime"
                  className={styles.input}
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email adresa
              </label>
              <div className={styles.inputWrapper}>
                <div className={styles.inputIcon}>
                  <Mail className={styles.icon} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="vasa@email.com"
                  className={styles.input}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Lozinka
              </label>
              <div className={styles.inputWrapper}>
                <div className={styles.inputIcon}>
                  <Lock className={styles.icon} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={styles.input}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className={styles.icon} /> : <Eye className={styles.icon} />}
                </button>
              </div>
              <p className={styles.passwordHint}>
                Lozinka mora sadržavati najmanje 8 karaktera, uključujući veliko slovo i broj.
              </p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Potvrdite lozinku
              </label>
              <div className={styles.inputWrapper}>
                <div className={styles.inputIcon}>
                  <Lock className={styles.icon} />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={styles.input}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className={styles.icon} /> : <Eye className={styles.icon} />}
                </button>
              </div>
            </div>

            <div className={styles.termsCheckbox}>
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
                className={styles.checkbox}
              />
              <label htmlFor="agreeTerms" className={styles.termsLabel}>
                Slažem se sa{" "}
                <a href="#" className={styles.termsLink}>
                  Uslovima korištenja
                </a>{" "}
                i{" "}
                <a href="#" className={styles.termsLink}>
                  Politikom privatnosti
                </a>
              </label>
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            Registracija
          </button>

          <div className={styles.divider}>
            <span className={styles.dividerText}>Ili se registrujte putem</span>
          </div>

          <button type="button" className={styles.googleButton}>
            <svg className={styles.googleIcon} viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Google
          </button>

          <div className={styles.loginPrompt}>
            Već imate račun?{" "}
            <button type="button" className={styles.loginLink} onClick={onLoginClick}>
              Prijavite se
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
