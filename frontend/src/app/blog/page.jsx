import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import { Calendar, User, Clock, ArrowRight } from "lucide-react"
import styles from "./Blog.module.css"

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "Kako zaštititi dom tokom odmora",
      excerpt:
        "Praktični savjeti za sigurnost vašeg doma dok ste na putovanju. Saznajte kako da osigurate svoj dom prije odlaska na odmor.",
      content: "Detaljan vodič kroz sve korake koje trebate preduzeti...",
      author: "Marko Petrović",
      date: "15. decembar 2024",
      readTime: "5 min čitanja",
      image: "/placeholder.svg?height=300&width=400",
      category: "Savjeti",
      featured: true,
    },
    {
      id: 2,
      title: "5 prednosti pametne instalacije",
      excerpt: "Zašto je pametna kuća investicija koja se isplati. Otkrijte sve prednosti automatizacije vašeg doma.",
      content: "Pametne instalacije postaju sve popularniji...",
      author: "Ana Jovanović",
      date: "12. decembar 2024",
      readTime: "7 min čitanja",
      image: "/placeholder.svg?height=300&width=400",
      category: "Tehnologija",
      featured: false,
    },
    {
      id: 3,
      title: "Održavanje alarmnih sistema",
      excerpt:
        "Redovno održavanje je ključ dugotrajnosti vašeg sistema. Naučite kako da pravilno održavate svoj alarmni sistem.",
      content: "Alarmni sistemi zahtevaju redovno održavanje...",
      author: "Stefan Nikolić",
      date: "10. decembar 2024",
      readTime: "4 min čitanja",
      image: "/placeholder.svg?height=300&width=400",
      category: "Održavanje",
      featured: false,
    },
    {
      id: 4,
      title: "Trendovi u video nadzoru za 2024",
      excerpt: "Najnoviji trendovi u industriji video nadzora. Šta nas čeka u budućnosti sigurnosnih sistema.",
      content: "Video nadzor se konstantno razvija...",
      author: "Milica Stojanović",
      date: "8. decembar 2024",
      readTime: "6 min čitanja",
      image: "/placeholder.svg?height=300&width=400",
      category: "Tehnologija",
      featured: false,
    },
  ]

  const categories = ["Svi", "Savjeti", "Tehnologija", "Održavanje", "Novosti"]

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.heroTitle}>Eurosystem Blog</h1>
            <p className={styles.heroDescription}>Savjeti, novosti i edukativni sadržaj o sigurnosnim sistemima</p>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.categories}>
            {categories.map((category) => (
              <button key={category} className={styles.categoryButton}>
                {category}
              </button>
            ))}
          </div>

          <div className={styles.blogGrid}>
            {blogPosts.map((post) => (
              <article key={post.id} className={`${styles.blogCard} ${post.featured ? styles.featured : ""}`}>
                <div className={styles.imageContainer}>
                  <img src={post.image || "/placeholder.svg"} alt={post.title} className={styles.blogImage} />
                  <div className={styles.categoryTag}>{post.category}</div>
                </div>

                <div className={styles.blogContent}>
                  <h2 className={styles.blogTitle}>{post.title}</h2>
                  <p className={styles.blogExcerpt}>{post.excerpt}</p>

                  <div className={styles.blogMeta}>
                    <div className={styles.author}>
                      <User size={16} />
                      <span>{post.author}</span>
                    </div>
                    <div className={styles.date}>
                      <Calendar size={16} />
                      <span>{post.date}</span>
                    </div>
                    <div className={styles.readTime}>
                      <Clock size={16} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <button className={styles.readMoreButton}>
                    Čitaj više
                    <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
