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
              <Image src="/images/logo.png" alt="Eurosystem" width={160} height={50} className={styles.logo} />
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
                <Link href="/proizvodi/alarmni-sistemi">Alarmni sistemi</Link>
              </li>
              <li>
                <Link href="/proizvodi/videonadzor">Videonadzor</Link>
              </li>
              <li>
                <Link href="/proizvodi/pametne-instalacije">Pametne instalacije</Link>
              </li>
              <li>
                <Link href="/proizvodi/kucni-sistemi">Kućni sistemi</Link>
              </li>
              <li>
                <Link href="/proizvodi/poslovni-sistemi">Poslovni sistemi</Link>
              </li>
            </ul>
          </div>

          <div className={styles.linksSection}>
            <h3 className={styles.sectionTitle}>Kompanija</h3>
            <ul className={styles.linksList}>
              <li>
                <Link href="/o-nama">O nama</Link>
              </li>
              <li>
                <Link href="/nasi-radovi">Naši radovi</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/karijera">Karijera</Link>
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
                <span>Bulevar Kralja Aleksandra 73, Beograd</span>
              </div>
              <div className={styles.contactItem}>
                <Phone size={16} />
                <span>+381 11 123 4567</span>
              </div>
              <div className={styles.contactItem}>
                <Mail size={16} />
                <span>info@eurosystem.rs</span>
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
