"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, MapPin } from "lucide-react"
import styles from "./OurWork.module.css"

export default function OurWork() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imageIndexes, setImageIndexes] = useState({}) // { [projectId]: index }

  useEffect(() => {
    const fetchLatestProjects = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:8000/admin/projects/latest?limit=3')
        if (!response.ok) {
          throw new Error('Greška pri dohvaćanju podataka')
        }
        const data = await response.json()
        setProjects(data)
      } catch (err) {
        console.error('Greška pri dohvaćanju projekata:', err)
        setError(err.message)
        // Fallback na statičke podatke ako API ne radi
        setProjects([
          {
            id: 1,
            title: "Sigurnosni sistem - Vila Dedinje",
            description: "Kompletna instalacija alarmnog sistema i video nadzora za luksuznu vilu",
            category: "Videonadzor",
            images: ["/placeholder.svg?height=300&width=400"],
            created_at: new Date().toISOString(),
          },
          {
            id: 2,
            title: "Poslovni kompleks - Delta City",
            description: "Napredni sistem kontrole pristupa i video nadzora za trgovinski centar",
            category: "Alarmni sistemi",
            images: ["/placeholder.svg?height=300&width=400"],
            created_at: new Date().toISOString(),
          },
          {
            id: 3,
            title: "Pametna kuća - Zemun",
            description: "Potpuna automatizacija kuće sa pametnim osvetljenjem i klimatizacijom",
            category: "Klima uređaji",
            images: ["/placeholder.svg?height=300&width=400"],
            created_at: new Date().toISOString(),
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchLatestProjects()
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % projects.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length)
  }

  const handlePrevImage = (projectId, imagesLength) => {
    setImageIndexes(prev => ({
      ...prev,
      [projectId]: ((prev[projectId] || 0) - 1 + imagesLength) % imagesLength
    }))
  }

  const handleNextImage = (projectId, imagesLength) => {
    setImageIndexes(prev => ({
      ...prev,
      [projectId]: ((prev[projectId] || 0) + 1) % imagesLength
    }))
  }

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Naši radovi</h2>
            <p className={styles.description}>Pogledajte neke od naših najuspešnijih projekata</p>
          </div>
          <div className={styles.loading}>
            <p>Učitavanje projekata...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error && projects.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Naši radovi</h2>
            <p className={styles.description}>Pogledajte neke od naših najuspešnijih projekata</p>
          </div>
          <div className={styles.error}>
            <p>Greška pri učitavanju projekata. Molimo pokušajte ponovo.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Naši radovi</h2>
          <p className={styles.description}>Pogledajte neke od naših najuspešnijih projekata</p>
        </div>

        {projects.length > 0 && (
          <>
            <div className={styles.slider}>
              <button onClick={prevSlide} className={styles.navButton}>
                <ChevronLeft size={24} />
              </button>

              <div className={styles.slideContainer}>
                <div className={styles.slides} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                  {projects.map((project) => (
                    <div key={project.id} className={styles.slide}>
                      <div className={styles.projectCard}>
                        <div className={styles.imageContainer}>
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
                          <div className={styles.category}>{project.category}</div>
                        </div>
                        <div className={styles.projectContent}>
                          <h3 className={styles.projectTitle}>{project.title}</h3>
                          <p className={styles.projectDescription}>{project.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={nextSlide} className={styles.navButton}>
                <ChevronRight size={24} />
              </button>
            </div>

            <div className={styles.indicators}>
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`${styles.indicator} ${index === currentSlide ? styles.active : ""}`}
                />
              ))}
            </div>
          </>
        )}

        {projects.length === 0 && !loading && !error && (
          <div className={styles.noProjects}>
            <p>Trenutno nema dostupnih projekata.</p>
          </div>
        )}
      </div>
    </section>
  )
}
