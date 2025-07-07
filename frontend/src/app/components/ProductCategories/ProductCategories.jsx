import Link from "next/link"
import { Shield, Camera, Zap, Home, Building, Wrench } from "lucide-react"
import styles from "./ProductCategories.module.css"

export default function ProductCategories() {
  const categories = [
    {
      id: 1,
      name: "Alarmni sistemi",
      description: "Napredni sistemi za zaštitu doma i poslovnih prostora",
      icon: Shield,
      color: "blue",
      href: "/proizvodi/alarmni-sistemi",
    },
    {
      id: 2,
      name: "Videonadzor",
      description: "HD kamere i sistemi za video nadzor",
      icon: Camera,
      color: "green",
      href: "/proizvodi/videonadzor",
    },
    {
      id: 3,
      name: "Pametne instalacije",
      description: "Automatizacija i pametno upravljanje",
      icon: Zap,
      color: "purple",
      href: "/proizvodi/pametne-instalacije",
    },
    {
      id: 4,
      name: "Kućni sistemi",
      description: "Rešenja za privatne domove",
      icon: Home,
      color: "orange",
      href: "/proizvodi/kucni-sistemi",
    },
    {
      id: 5,
      name: "Poslovni sistemi",
      description: "Profesionalna rešenja za firme",
      icon: Building,
      color: "red",
      href: "/proizvodi/poslovni-sistemi",
    },
    {
      id: 6,
      name: "Održavanje",
      description: "Servis i održavanje postojećih sistema",
      icon: Wrench,
      color: "gray",
      href: "/proizvodi/odrzavanje",
    },
  ]

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Naši proizvodi i usluge</h2>
          <p className={styles.description}>Kompletna rešenja za sigurnost i automatizaciju</p>
        </div>

        <div className={styles.grid}>
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Link key={category.id} href={category.href} className={`${styles.card} card`}>
                <div className={`${styles.iconContainer} ${styles[category.color]}`}>
                  <IconComponent className={styles.icon} />
                </div>
                <h3 className={styles.cardTitle}>{category.name}</h3>
                <p className={styles.cardDescription}>{category.description}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.learnMore}>Saznaj više →</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
