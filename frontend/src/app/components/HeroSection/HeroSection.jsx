import Link from "next/link"
import { ArrowRight, Shield, Zap, Eye } from "lucide-react"
import styles from "./HeroSection.module.css"

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.textContent}>
            <h1 className={styles.title}>
              Sigurnosni sistemi i elektroinstalacije <span className={styles.highlight}>budućnosti</span>
            </h1>
            <p className={styles.description}>
              Profesionalni pristup sigurnosti vašeg doma i poslovnog prostora. Specijalizovani smo za alarmne sisteme,
              videonadzor i pametne elektroinstalacije.
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/proizvodi" className="btn btn-primary">
                Pogledaj proizvode
                <ArrowRight size={20} />
              </Link>
              <Link href="/kontakt" className="btn btn-secondary">
                Zatraži ponudu
              </Link>
            </div>
            <div className={styles.features}>
              <div className={styles.feature}>
                <Shield className={styles.featureIcon} />
                <span>Sigurnost</span>
              </div>
              <div className={styles.feature}>
                <Eye className={styles.featureIcon} />
                <span>Nadzor</span>
              </div>
              <div className={styles.feature}>
                <Zap className={styles.featureIcon} />
                <span>Pametne instalacije</span>
              </div>
            </div>
          </div>
          <div className={styles.imageContent}>
            <div className={styles.heroImage}>
              <img src="/placeholder.svg?height=500&width=600" alt="Eurosystem tim u akciji" className={styles.image} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
