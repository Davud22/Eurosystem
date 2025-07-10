"use client"

import { useState } from "react"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import { Star, MapPin, Calendar, Eye, MessageCircle, Heart } from "lucide-react"
import styles from "./NasiRadovi.module.css"

export default function NasiRadoviPage() {
  const [selectedCategory, setSelectedCategory] = useState("Svi")

  const categories = ["Svi", "Videonadzor", "Alarmni sistemi", "Kapije", "Klima uređaji", "Elektroinstalacioni radovi"]

  const projects = [
    {
      id: 1,
      title: "Sigurnosni sistem - Vila Dedinje",
      description: "Kompletna instalacija alarmnog sistema i video nadzora za luksuznu vilu sa perimetarskom zaštitom",
      image: "/placeholder.svg?height=300&width=400",
      category: "Videonadzor",
      location: "Beograd, Dedinje",
      date: "Novembar 2024",
      rating: 5,
      views: 1234,
      comments: 8,
      likes: 45,
      featured: true,
    },
    {
      id: 2,
      title: "Poslovni kompleks - Delta City",
      description: "Napredni sistem kontrole pristupa i video nadzora za trgovinski centar",
      image: "/placeholder.svg?height=300&width=400",
      category: "Alarmni sistemi",
      location: "Beograd, Novi Beograd",
      date: "Oktobar 2024",
      rating: 5,
      views: 987,
      comments: 12,
      likes: 67,
      featured: false,
    },
    {
      id: 3,
      title: "Pametna kuća - Zemun",
      description: "Potpuna automatizacija kuće sa pametnim osvetljenjem i klimatizacijom",
      image: "/placeholder.svg?height=300&width=400",
      category: "Klima uređaji",
      location: "Beograd, Zemun",
      date: "Septembar 2024",
      rating: 5,
      views: 756,
      comments: 6,
      likes: 34,
      featured: false,
    },
    {
      id: 4,
      title: "Fabrika - Kragujevac",
      description: "Industrijski sigurnosni sistem sa perimetarskom zaštitom i kontrolom pristupa",
      image: "/placeholder.svg?height=300&width=400",
      category: "Alarmni sistemi",
      location: "Kragujevac",
      date: "Avgust 2024",
      rating: 5,
      views: 543,
      comments: 4,
      likes: 28,
      featured: false,
    },
    {
      id: 5,
      title: "Stambena zgrada - Novi Sad",
      description: "Video interfon sistem i kontrola pristupa za stambenu zgradu",
      image: "/placeholder.svg?height=300&width=400",
      category: "Videonadzor",
      location: "Novi Sad",
      date: "Juli 2024",
      rating: 4,
      views: 432,
      comments: 3,
      likes: 19,
      featured: false,
    },
    {
      id: 6,
      title: "Restoran - Skadarlija",
      description: "Kompletni sigurnosni sistem za restoran sa video nadzorom i alarmom",
      image: "/placeholder.svg?height=300&width=400",
      category: "Elektroinstalacioni radovi",
      location: "Beograd, Skadarlija",
      date: "Juni 2024",
      rating: 5,
      views: 321,
      comments: 7,
      likes: 41,
      featured: false,
    },
  ]

  const filteredProjects =
    selectedCategory === "Svi" ? projects : projects.filter((project) => project.category === selectedCategory)

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.heroTitle}>Naši radovi</h1>
            <p className={styles.heroDescription}>Pogledajte neke od naših najuspešnijih projekata i realizacija</p>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.categories}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ""}`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className={styles.projectsGrid}>
            {filteredProjects.map((project) => (
              <article key={project.id} className={`${styles.projectCard} ${project.featured ? styles.featured : ""}`}>
                <div className={`${styles.imageContainer} group`}>
                  <img src={project.image || "/placeholder.svg"} alt={project.title} className={styles.projectImage} />
                  <div className={styles.categoryTag}>{project.category}</div>
                  <div className={styles.imageOverlay}>
                    <button className={styles.likeButton}>
                      <Heart size={20} />
                    </button>
                  </div>
                </div>

                <div className={styles.projectContent}>
                  <h2 className={styles.projectTitle}>{project.title}</h2>
                  <p className={styles.projectDescription}>{project.description}</p>

                  <div className={styles.projectMeta}>
                    <div className={styles.location}>
                      <MapPin size={16} />
                      <span>{project.location}</span>
                    </div>
                    <div className={styles.date}>
                      <Calendar size={16} />
                      <span>{project.date}</span>
                    </div>
                  </div>

                  <div className={styles.rating}>
                    <div className={styles.stars}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={i < project.rating ? styles.starFilled : styles.starEmpty} />
                      ))}
                    </div>
                    <span className={styles.ratingText}>({project.rating}.0)</span>
                  </div>

                  <div className={styles.projectStats}>
                    <div className={styles.stat}>
                      <Eye size={16} />
                      <span>{project.views}</span>
                    </div>
                    <div className={styles.stat}>
                      <MessageCircle size={16} />
                      <span>{project.comments}</span>
                    </div>
                    <div className={styles.stat}>
                      <Heart size={16} />
                      <span>{project.likes}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.loadMore}>
            <button className={styles.loadMoreButton}>Učitaj više projekata</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
