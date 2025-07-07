"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, Sun, Moon, ShoppingCart } from "lucide-react"
import { useTheme } from "../ThemeProvider"
import styles from "./Header.module.css"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const navigation = [
    { name: "Početna", href: "/" },
    { name: "Proizvodi", href: "/proizvodi" },
    { name: "Naši radovi", href: "/nasi-radovi" },
    { name: "Blog", href: "/blog" },
    { name: "Kontakt", href: "/kontakt" },
  ]

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        <div className={styles.logoContainer}>
          <Link href="/">
            <Image src="/images/logo.png" alt="Eurosystem" width={180} height={60} className={styles.logo} />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} className={styles.navLink}>
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          <button onClick={toggleTheme} className={styles.themeToggle}>
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <Link href="/korpa" className={styles.actionButton}>
            <ShoppingCart size={20} />
          </Link>

          <Link href="/prijava" className="btn btn-outline">
            Prijava
          </Link>

          <Link href="/registracija" className="btn btn-primary">
            Registracija
          </Link>

          {/* Mobile menu button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={styles.mobileMenuButton}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className={styles.mobileNav}>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={styles.mobileNavLink}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className={styles.mobileActions}>
            <Link href="/prijava" className="btn btn-outline">
              Prijava
            </Link>
            <Link href="/registracija" className="btn btn-primary">
              Registracija
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
