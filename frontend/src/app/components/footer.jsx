import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import styles from "./footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          {/* Company Info */}
          <div className={styles.footerColumn}>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logop-u2eKMBIV6MMwesIQ6nkdrYCs0gqcVV.png"
              alt="Eurosystem Logo"
              width={180}
              height={60}
              className={styles.footerLogo}
            />
            <p className={styles.footerText}>
              Profesionalna rješenja za sigurnosne sisteme i elektroinstalacije. Zaštitite ono što vam je najvažnije.
            </p>
            <div className={styles.socialLinks}>
              <Link href="#" className={styles.socialLink}>
                <Facebook className={styles.socialIcon} />
              </Link>
              <Link href="#" className={styles.socialLink}>
                <Instagram className={styles.socialIcon} />
              </Link>
              <Link href="#" className={styles.socialLink}>
                <Twitter className={styles.socialIcon} />
              </Link>
              <Link href="#" className={styles.socialLink}>
                <Linkedin className={styles.socialIcon} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerHeading}>Brzi linkovi</h3>
            <ul className={styles.footerLinks}>
              <li>
                <Link href="/" className={styles.footerLink}>
                  Početna
                </Link>
              </li>
              <li>
                <Link href="/proizvodi" className={styles.footerLink}>
                  Proizvodi
                </Link>
              </li>
              <li>
                <Link href="/usluge" className={styles.footerLink}>
                  Usluge
                </Link>
              </li>
              <li>
                <Link href="/nasi-radovi" className={styles.footerLink}>
                  Naši radovi
                </Link>
              </li>
              <li>
                <Link href="/blog" className={styles.footerLink}>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className={styles.footerLink}>
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerHeading}>Naše usluge</h3>
            <ul className={styles.footerLinks}>
              <li>
                <Link href="/usluge/sigurnosni-sistemi" className={styles.footerLink}>
                  Sigurnosni sistemi
                </Link>
              </li>
              <li>
                <Link href="/usluge/video-nadzor" className={styles.footerLink}>
                  Video nadzor
                </Link>
              </li>
              <li>
                <Link href="/usluge/alarmni-sistemi" className={styles.footerLink}>
                  Alarmni sistemi
                </Link>
              </li>
              <li>
                <Link href="/usluge/elektroinstalacije" className={styles.footerLink}>
                  Elektroinstalacije
                </Link>
              </li>
              <li>
                <Link href="/usluge/pametne-kuce" className={styles.footerLink}>
                  Pametne kuće
                </Link>
              </li>
              <li>
                <Link href="/usluge/kontrola-pristupa" className={styles.footerLink}>
                  Kontrola pristupa
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerHeading}>Kontakt informacije</h3>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <MapPin className={styles.contactIcon} />
                <span>Ulica Primjera 123, 71000 Sarajevo</span>
              </li>
              <li className={styles.contactItem}>
                <Phone className={styles.contactIcon} />
                <span>+387 33 123 456</span>
              </li>
              <li className={styles.contactItem}>
                <Mail className={styles.contactIcon} />
                <span>info@eurosystem.ba</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} Eurosystem. Sva prava pridržana.</p>
        </div>
      </div>
    </footer>
  )
}
