import { ArrowRight } from "lucide-react"
import styles from "./service-card.module.css"

export default function ServiceCard({ icon, title, description }) {
  return (
    <div className={styles.serviceCard}>
      <div className={styles.iconWrapper}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <a href="#" className={styles.link}>
        Saznajte više
        <ArrowRight className={styles.linkIcon} />
      </a>
    </div>
  )
}
