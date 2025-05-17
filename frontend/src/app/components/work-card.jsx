import Image from "next/image"
import { ArrowRight } from "lucide-react"
import styles from "./work-card.module.css"

export default function WorkCard({ image, title, description }) {
  return (
    <div className={styles.workCard}>
      <div className={styles.imageContainer}>
        <Image src={image || "/placeholder.svg"} alt={title} fill className={styles.image} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <a href="#" className={styles.link}>
          Detaljnije
          <ArrowRight className={styles.linkIcon} />
        </a>
      </div>
    </div>
  )
}
