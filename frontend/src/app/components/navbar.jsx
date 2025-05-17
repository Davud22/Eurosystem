"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, ShoppingCart } from "lucide-react"
import LoginModal from "./login-modal"
import RegisterModal from "./register-modal"
import styles from "./navbar.module.css"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const openLoginModal = () => {
    setIsLoginModalOpen(true)
    setIsMenuOpen(false)
  }

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true)
    setIsMenuOpen(false)
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.navbar}>
            {/* Logo */}
            <Link href="/" className={styles.logo}>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logop-u2eKMBIV6MMwesIQ6nkdrYCs0gqcVV.png"
                alt="Eurosystem Logo"
                width={180}
                height={60}
                className={styles.logoImage}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className={styles.desktopNav}>
              <Link href="/" className={styles.navLink}>
                Početna
              </Link>
              <Link href="/proizvodi" className={styles.navLink}>
                Proizvodi
              </Link>
              <Link href="/usluge" className={styles.navLink}>
                Usluge
              </Link>
              <Link href="/nasi-radovi" className={styles.navLink}>
                Naši radovi
              </Link>
              <Link href="/blog" className={styles.navLink}>
                Blog
              </Link>
              <Link href="/kontakt" className={styles.navLink}>
                Kontakt
              </Link>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className={styles.authButtons}>
              <button className={styles.iconButton}>
                <ShoppingCart className={styles.cartIcon} />
              </button>
              <button className={styles.outlineButton} onClick={openLoginModal}>
                Prijava
              </button>
              <button className={styles.primaryButton} onClick={openRegisterModal}>
                Registracija
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button className={styles.menuButton} onClick={toggleMenu}>
              {isMenuOpen ? <X className={styles.menuIcon} /> : <Menu className={styles.menuIcon} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            <div className={styles.container}>
              <nav className={styles.mobileNav}>
                <Link href="/" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
                  Početna
                </Link>
                <Link href="/proizvodi" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
                  Proizvodi
                </Link>
                <Link href="/usluge" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
                  Usluge
                </Link>
                <Link href="/nasi-radovi" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
                  Naši radovi
                </Link>
                <Link href="/blog" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
                  Blog
                </Link>
                <Link href="/kontakt" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
                  Kontakt
                </Link>
                <div className={styles.mobileAuthButtons}>
                  <button className={styles.mobileOutlineButton} onClick={openLoginModal}>
                    Prijava
                  </button>
                  <button className={styles.mobilePrimaryButton} onClick={openRegisterModal}>
                    Registracija
                  </button>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onRegisterClick={() => {
          setIsLoginModalOpen(false)
          setIsRegisterModalOpen(true)
        }}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onLoginClick={() => {
          setIsRegisterModalOpen(false)
          setIsLoginModalOpen(true)
        }}
      />
    </>
  )
}
