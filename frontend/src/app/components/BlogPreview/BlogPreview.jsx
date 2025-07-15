"use client"

import Link from "next/link"
import { Calendar, User, ArrowRight, MessageCircle, Star } from "lucide-react"
import styles from "./BlogPreview.module.css"
import { useState, useEffect } from "react"

export default function BlogPreview() {
  const [blogPosts, setBlogPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:8000/blogs/top?limit=3")
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

  const formatDate = (isoDate) => {
    if (!isoDate) return ""
    const date = new Date(isoDate)
    // Ručno formatiranje datuma: 14. 07. 2025.
    const dan = String(date.getDate()).padStart(2, '0')
    const mjesec = String(date.getMonth() + 1).padStart(2, '0')
    const godina = date.getFullYear()
    return `${dan}. ${mjesec}. ${godina}.`
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Najnoviji savjeti i vijesti</h2>
          <p className={styles.description}>Edukativni sadržaj o sigurnosnim sistemima i pametnim tehnologijama</p>
        </div>

        {loading ? (
          <div className={styles.loading}>Učitavanje blogova...</div>
        ) : error ? (
          <div className={styles.error}>Greška: {error}</div>
        ) : (
          <div className={styles.grid}>
            {blogPosts.map((post) => (
              <article key={post.id} className={styles.card}>
                <div className={styles.imageContainer}>
                  <img src={post.image_url ? `http://localhost:8000${post.image_url}` : "/placeholder.svg"} alt={post.title} className={styles.image} />
                  <div className={styles.category}>{post.category}</div>
                </div>

                <div className={styles.content}>
                  <h3 className={styles.postTitle}>
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>

                  <p className={styles.excerpt}>{post.content.slice(0, 150)}{post.content.length > 150 ? "..." : ""}</p>

                  <div className={styles.meta}>
                    <div className={styles.author}>
                      <User size={16} />
                      <span>{post.author}</span>
                    </div>
                    <div className={styles.date}>
                      <Calendar size={16} />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                  </div>

                  <div className={styles.footer}>
                    <span className={styles.readTime}>
                      <MessageCircle size={16} /> {post.num_comments} komentara
                    </span>
                    <span className={styles.readTime}>
                      <Star size={16} style={{ color: '#fbbf24', marginRight: 2 }} /> {post.avg_rating.toFixed(1)}
                    </span>
                    <Link href={`/blog/${post.id}`} className={styles.readMoreButton}>
                      Čitaj više
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className={styles.viewAll}>
          <Link href="/blog" className={styles.viewAllButton}>
            Pogledaj sve članke
          </Link>
        </div>
      </div>
    </section>
  )
}
