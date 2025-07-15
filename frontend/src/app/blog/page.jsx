"use client"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import { Calendar, User, Clock, ArrowRight } from "lucide-react"
import styles from "./Blog.module.css"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("Svi")

  const categories = ["Svi", "Savjeti", "Tehnologija", "Održavanje", "Novosti", "Alarmni sistemi", "Kapije", "Klima uređaji", "Videonadzor", "Elektroinstalacioni radovi"]

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:8000/blogs")
        if (!response.ok) throw new Error("Greška pri dohvaćanju blogova")
        const data = await response.json()
        setBlogPosts(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  const filteredPosts =
    selectedCategory === "Svi"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory)

  const formatDate = (isoDate) => {
    if (!isoDate) return ""
    const date = new Date(isoDate)
    // Bosanska latinica, ijekavica
    return date.toLocaleDateString("bs-BA", { day: "2-digit", month: "long", year: "numeric" })
  }

  const uniqueCategories = [
    "Svi",
    ...Array.from(new Set(blogPosts.map((post) => post.category).filter(Boolean)))
  ];

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
            {uniqueCategories.map((category) => (
              <button
                key={category}
                className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ""}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className={styles.loading}>Učitavanje blogova...</div>
          ) : error ? (
            <div className={styles.error}>Greška: {error}</div>
          ) : (
            <div className={styles.blogGrid}>
              {filteredPosts.length === 0 ? (
                <div className={styles.noBlogs}>Nema blogova za odabranu kategoriju.</div>
              ) : (
                filteredPosts.map((post) => (
                  <article key={post.id} className={styles.blogCard}>
                    <div className={styles.imageContainer}>
                      <img
                        src={post.image_url ? `http://localhost:8000${post.image_url}` : "/placeholder.svg"}
                        alt={post.title}
                        className={styles.blogImage}
                      />
                      <div className={styles.categoryTag}>{post.category}</div>
                    </div>

                    <div className={styles.blogContent}>
                      <h2 className={styles.blogTitle}>{post.title}</h2>
                      <p className={styles.blogExcerpt}>{post.content.slice(0, 150)}{post.content.length > 150 ? "..." : ""}</p>

                      <div className={styles.blogMeta}>
                        <div className={styles.author}>
                          <User size={16} />
                          <span>{post.author}</span>
                        </div>
                        <div className={styles.date}>
                          <Calendar size={16} />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                        {/* <div className={styles.readTime}>
                          <Clock size={16} />
                          <span>{post.readTime}</span>
                        </div> */}
                      </div>

                      <Link href={`/blog/${post.id}`} className={styles.readMoreButton}>
                        Čitaj više
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
