"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"
import styles from "./Prijava.module.css"
import { jwtDecode } from "jwt-decode"

export default function PrijavaPage() {
  useEffect(() => {
    document.cookie = "access_token=; Max-Age=0; path=/;";
    localStorage.removeItem("access_token");
    // Popuni email iz localStorage ako postoji
    const savedEmail = localStorage.getItem("remembered_email");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail, rememberMe: true }));
    }
  }, []);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [modal, setModal] = useState({ open: false, message: "" })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setModal({ open: false, message: "" })
    // Pamti email ako je rememberMe označen
    if (formData.rememberMe) {
      localStorage.setItem("remembered_email", formData.email);
    } else {
      localStorage.removeItem("remembered_email");
    }
    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setModal({ open: true, message: data.detail || "Pogrešan email ili lozinka!" })
        setIsLoading(false)
        return
      }
      const data = await res.json()
      localStorage.setItem("access_token", data.access_token)
      document.cookie = `access_token=${data.access_token}; path=/;`;
      const decoded = jwtDecode(data.access_token)
      if (decoded.role === "admin") {
        window.location.href = "/admin"
      } else {
        window.location.href = "/user"
      }
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
  }

  const handleForgotPassword = async () => {
    if (!formData.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      setModal({ open: true, message: "Unesite ispravan email za reset lozinke." });
      return;
    }
    setIsLoading(true);
    setModal({ open: false, message: "" });
    try {
      const res = await fetch("http://localhost:8000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      setModal({ open: true, message: data.msg });
    } catch {
      setModal({ open: true, message: "Greška na serveru!" });
    } finally {
      setIsLoading(false);
    }
  };

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
              {modal.open && (
                <div style={{ background: "#fee", color: "#b00", padding: 12, borderRadius: 8, marginBottom: 16, textAlign: "center" }}>
                  {modal.message}
                </div>
              )}
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
                  <button type="button" onClick={handleForgotPassword} className={styles.forgotLink} disabled={isLoading}>
                    Zaboravili ste lozinku?
                  </button>
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
              <img src="/ipkamera2.png" alt="IP Kamera" className={styles.image} style={{ maxWidth: '420px', height: '300px', borderRadius: '1rem' }} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
