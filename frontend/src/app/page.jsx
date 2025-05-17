import Image from "next/image"
import HeroImage from "./components/hero-image"
import ServiceCard from "./components/service-card"
import ContactForm from "./components/contact-form"
import WorkCard from "./components/work-card"

import {
  ChevronRight,
  Shield,
  Zap,
  Lock,
  Phone,
  Mail,
  MapPin,
  CheckCircle
} from "lucide-react"
import styles from "./page.module.css"


export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Sigurnosni sistemi za vaš dom i poslovanje</h1>
            <p className={styles.heroText}>
              Profesionalna rješenja za sigurnosne sisteme i elektroinstalacije. Zaštitite ono što vam je najvažnije.
            </p>
            <div className={styles.buttonGroup}>
              <button className={styles.primaryButton}>
                Naši proizvodi
                <ChevronRight className={styles.buttonIcon} />
              </button>
              <button className={styles.outlineButton}>Kontaktirajte nas</button>
            </div>
          </div>
          <div className={styles.heroImageContainer}>
            <HeroImage />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Naše usluge</h2>
            <p className={styles.sectionDescription}>
              Pružamo kompletna rješenja za sigurnosne sisteme i elektroinstalacije prilagođene vašim potrebama.
            </p>
          </div>

          <div className={styles.servicesGrid}>
            <ServiceCard
              icon={<Shield className={styles.serviceIcon} />}
              title="Sigurnosni sistemi"
              description="Napredni alarmni sistemi, video nadzor i kontrola pristupa za maksimalnu sigurnost."
            />
            <ServiceCard
              icon={<Zap className={styles.serviceIcon} />}
              title="Elektroinstalacije"
              description="Profesionalne elektroinstalacije za stambene i poslovne objekte."
            />
            <ServiceCard
              icon={<Lock className={styles.serviceIcon} />}
              title="Pametne kuće"
              description="Integrirani sistemi za automatizaciju i kontrolu vašeg doma ili poslovnog prostora."
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.featuresContent}>
            <div className={styles.featuresText}>
              <h2 className={styles.sectionTitle}>Zašto odabrati Eurosystem?</h2>
              <ul className={styles.featuresList}>
                <li className={styles.featureItem}>
                  <CheckCircle className={styles.featureIcon} />
                  <p>Profesionalni tim sa dugogodišnjim iskustvom</p>
                </li>
                <li className={styles.featureItem}>
                  <CheckCircle className={styles.featureIcon} />
                  <p>Najnovija tehnologija i oprema</p>
                </li>
                <li className={styles.featureItem}>
                  <CheckCircle className={styles.featureIcon} />
                  <p>Prilagođena rješenja prema vašim potrebama</p>
                </li>
                <li className={styles.featureItem}>
                  <CheckCircle className={styles.featureIcon} />
                  <p>Brza i pouzdana tehnička podrška</p>
                </li>
                <li className={styles.featureItem}>
                  <CheckCircle className={styles.featureIcon} />
                  <p>Garancija na sve proizvode i usluge</p>
                </li>
              </ul>
            </div>
            <div className={styles.featuresImage}>
              <div className={styles.imageWrapper}>
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="Eurosystem features"
                  width={800}
                  height={600}
                  className={styles.image}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Works Section */}
      <section className={styles.worksSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Naši radovi</h2>
            <p className={styles.sectionDescription}>Pogledajte neke od naših uspješno realizovanih projekata.</p>
          </div>

          <div className={styles.worksGrid}>
            <WorkCard
              image="/placeholder.svg?height=300&width=400"
              title="Sigurnosni sistem za poslovni objekat"
              description="Implementacija kompletnog sigurnosnog sistema za poslovni centar."
            />
            <WorkCard
              image="/placeholder.svg?height=300&width=400"
              title="Pametna kuća"
              description="Instalacija sistema pametne kuće sa daljinskim upravljanjem."
            />
            <WorkCard
              image="/placeholder.svg?height=300&width=400"
              title="Video nadzor"
              description="Postavljanje sistema video nadzora za stambeni kompleks."
            />
          </div>

          <div className={styles.buttonContainer}>
            <button className={styles.primaryButton}>
              Pogledajte sve radove
              <ChevronRight className={styles.buttonIcon} />
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactContent}>
            <div className={styles.contactInfo}>
              <h2 className={styles.sectionTitle}>Kontaktirajte nas</h2>
              <p className={styles.contactText}>
                Imate pitanje ili trebate ponudu? Pošaljite nam poruku i odgovorićemo vam u najkraćem mogućem roku.
              </p>

              <div className={styles.contactDetails}>
                <div className={styles.contactItem}>
                  <Phone className={styles.contactIcon} />
                  <div>
                    <h3 className={styles.contactItemTitle}>Telefon</h3>
                    <p>+387 33 123 456</p>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <Mail className={styles.contactIcon} />
                  <div>
                    <h3 className={styles.contactItemTitle}>Email</h3>
                    <p>info@eurosystem.ba</p>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <MapPin className={styles.contactIcon} />
                  <div>
                    <h3 className={styles.contactItemTitle}>Adresa</h3>
                    <p>Ulica Primjera 123, 71000 Sarajevo</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.contactForm}>
              <div className={styles.formWrapper}>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
