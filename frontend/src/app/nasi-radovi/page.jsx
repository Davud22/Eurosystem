"use client"

import { useState, useEffect } from "react"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import { Star, MapPin, Calendar, Eye, MessageCircle, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import styles from "./NasiRadovi.module.css"

export default function NasiRadoviPage() {
  const [selectedCategory, setSelectedCategory] = useState("Svi")
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imageIndexes, setImageIndexes] = useState({})

  const categories = ["Svi", "Videonadzor", "Alarmni sistemi", "Kapije", "Klima uređaji", "Elektroinstalacioni radovi"]

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:8000/admin/projects")
        if (!response.ok) throw new Error("Greška pri dohvaćanju radova")
        const data = await response.json()
        setProjects(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const filteredProjects =
    selectedCategory === "Svi"
      ? projects
      : projects.filter((project) => project.category === selectedCategory)

  const handlePrevImage = (projectId, imagesLength) => {
    setImageIndexes((prev) => ({
      ...prev,
      [projectId]: ((prev[projectId] || 0) - 1 + imagesLength) % imagesLength,
    }))
  }

  const handleNextImage = (projectId, imagesLength) => {
    setImageIndexes((prev) => ({
      ...prev,
      [projectId]: ((prev[projectId] || 0) + 1) % imagesLength,
    }))
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.heroTitle}>Naši radovi</h1>
            <p className={styles.heroDescription}>Pogledajte neke od naših najuspješnijih projekata i realizacija</p>
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

          {loading ? (
            <div className={styles.loading}>Učitavanje projekata...</div>
          ) : error ? (
            <div className={styles.error}>Greška: {error}</div>
          ) : (
            <div className={styles.projectsGrid}>
              {filteredProjects.length === 0 ? (
                <div className={styles.noProjects}>Nema projekata za odabranu kategoriju.</div>
              ) : (
                filteredProjects.map((project) => (
                  <article key={project.id} className={styles.projectCard}>
                    <div className={`${styles.imageContainer} group`}>
                      {project.images && project.images.length > 0 && (
                        <div className={styles.imageSlider}>
                          {project.images.length > 1 && (
                            <button onClick={() => handlePrevImage(project.id, project.images.length)} className={styles.imageNavButton}>
                              <ChevronLeft size={20} />
                            </button>
                          )}
                          <img
                            src={project.images[imageIndexes[project.id] || 0] || "/placeholder.svg?height=300&width=400"}
                            alt={project.title}
                            className={styles.projectImage}
                          />
                          {project.images.length > 1 && (
                            <button onClick={() => handleNextImage(project.id, project.images.length)} className={styles.imageNavButton}>
                              <ChevronRight size={20} />
                            </button>
                          )}
                        </div>
                      )}
                      <div className={styles.categoryTag}>{project.category}</div>
                    </div>

                    <div className={styles.projectContent}>
                      <h2 className={styles.projectTitle}>{project.title}</h2>
                      <p className={styles.projectDescription}>{project.description}</p>
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
