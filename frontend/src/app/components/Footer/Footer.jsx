import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import styles from "./Footer.module.css"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.brandSection}>
            <div className={styles.logoContainer}>
              <Link href="/">
                <img src="/euro-system-logo.png" alt="Euro System Logo" className={styles.logo} style={{ height: "60px", width: "auto", display: "block", marginBottom: "1rem" }} />
              </Link>
            </div>
            <p className={styles.brandDescription}>
              Profesionalni sigurnosni sistemi i elektroinstalacije. Vaša sigurnost je naš prioritet.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div className={styles.linksSection}>
            <h3 className={styles.sectionTitle}>Proizvodi</h3>
            <ul className={styles.linksList}>
              <li>
                <Link href="/proizvodi/videonadzor">Videonadzor</Link>
              </li>
              <li>
                <Link href="/proizvodi/alarmni-sistemi">Alarmni sistemi</Link>
              </li>
              <li>
                <Link href="/proizvodi/kapije">Kapije</Link>
              </li>
              <li>
                <Link href="/proizvodi/klima-uredjaji">Klima uređaji</Link>
              </li>
              <li>
                <Link href="/proizvodi/elektroinstalacioni-radovi">Elektroinstalacioni radovi</Link>
              </li>
            </ul>
          </div>

          <div className={styles.linksSection}>
            <h3 className={styles.sectionTitle}>Kompanija</h3>
            <ul className={styles.linksList}>
              <li>
                <Link href="/nasi-radovi">Naši radovi</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/kontakt">Kontakt</Link>
              </li>
            </ul>
          </div>

          <div className={styles.contactSection}>
            <h3 className={styles.sectionTitle}>Kontakt</h3>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <MapPin size={16} />
                <span>Donja Lovnica bb, 72220 Zavidovići, Bosna i Hercegovina</span>
              </div>
              <div className={styles.contactItem}>
                <Phone size={16} />
                <span>+387 62 118 125</span>
              </div>
              <div className={styles.contactItem}>
                <Mail size={16} />
                <span>eurosystemor@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>© {currentYear} Eurosystem. Sva prava zadržana.</p>
            <div className={styles.legalLinks}>
              <Link href="/politika-privatnosti">Politika privatnosti</Link>
              <Link href="/uslovi-koriscenja">Uslovi korišćenja</Link>
              <Link href="/kolacici">Kolačići</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
