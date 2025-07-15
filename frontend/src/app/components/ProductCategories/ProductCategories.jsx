import Link from "next/link"
import { Shield, Camera, DoorOpen, Thermometer, Zap } from "lucide-react"
import styles from "./ProductCategories.module.css"

export default function ProductCategories() {
  const categories = [
    {
      id: 1,
      name: "Videonadzor",
      description: "HD kamere i sistemi za video nadzor",
      icon: Camera,
      color: "green",
      href: "/proizvodi/videonadzor",
    },
    {
      id: 2,
      name: "Alarmni sistemi",
      description: "Napredni sistemi za zaštitu doma i poslovnih prostora",
      icon: Shield,
      color: "blue",
      href: "/proizvodi/alarmni-sistemi",
    },
    {
      id: 3,
      name: "Kapije",
      description: "Automatske i sigurnosne kapije za vaš dom ili firmu",
      icon: DoorOpen,
      color: "orange",
      href: "/proizvodi/kapije",
    },
    {
      id: 4,
      name: "Klima uređaji",
      description: "Ugradnja i održavanje klima uređaja",
      icon: Thermometer,
      color: "purple",
      href: "/proizvodi/klima-uredjaji",
    },
    {
      id: 5,
      name: "Elektroinstalacioni radovi",
      description: "Kompletne elektroinstalacije za objekte",
      icon: Zap,
      color: "red",
      href: "/proizvodi/elektroinstalacioni-radovi",
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
