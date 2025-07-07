import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"
import styles from "./BlogPreview.module.css"

export default function BlogPreview() {
  const blogPosts = [
    {
      id: 1,
      title: "Kako zaštititi dom tokom odmora",
      excerpt: "Praktični savjeti za sigurnost vašeg doma dok ste na putovanju...",
      author: "Marko Petrović",
      date: "15. decembar 2024",
      image: "/placeholder.svg?height=200&width=300",
      category: "Savjeti",
      readTime: "5 min čitanja",
    },
    {
      id: 2,
      title: "5 prednosti pametne instalacije",
      excerpt: "Zašto je pametna kuća investicija koja se isplati...",
      author: "Ana Jovanović",
      date: "12. decembar 2024",
      image: "/placeholder.svg?height=200&width=300",
      category: "Tehnologija",
      readTime: "7 min čitanja",
    },
    {
      id: 3,
      title: "Održavanje alarmnih sistema",
      excerpt: "Redovno održavanje je ključ dugotrajnosti vašeg sistema...",
      author: "Stefan Nikolić",
      date: "10. decembar 2024",
      image: "/placeholder.svg?height=200&width=300",
      category: "Održavanje",
      readTime: "4 min čitanja",
    },
  ]

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Najnoviji savjeti i vijesti</h2>
          <p className={styles.description}>Edukativni sadržaj o sigurnosnim sistemima i pametnim tehnologijama</p>
        </div>

        <div className={styles.grid}>
          {blogPosts.map((post) => (
            <article key={post.id} className={styles.card}>
              <div className={styles.imageContainer}>
                <img src={post.image || "/placeholder.svg"} alt={post.title} className={styles.image} />
                <div className={styles.category}>{post.category}</div>
              </div>

              <div className={styles.content}>
                <h3 className={styles.postTitle}>
                  <Link href={`/blog/${post.id}`}>{post.title}</Link>
                </h3>

                <p className={styles.excerpt}>{post.excerpt}</p>

                <div className={styles.meta}>
                  <div className={styles.author}>
                    <User size={16} />
                    <span>{post.author}</span>
                  </div>
                  <div className={styles.date}>
                    <Calendar size={16} />
                    <span>{post.date}</span>
                  </div>
                </div>

                <div className={styles.footer}>
                  <span className={styles.readTime}>{post.readTime}</span>
                  <Link href={`/blog/${post.id}`} className={styles.readMore}>
                    Čitaj više
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.viewAll}>
          <Link href="/blog" className={styles.viewAllButton}>
            Pogledaj sve članke
          </Link>
        </div>
      </div>
    </section>
  )
}
