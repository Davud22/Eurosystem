"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star, MapPin } from "lucide-react"
import styles from "./OurWork.module.css"

export default function OurWork() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const projects = [
    {
      id: 1,
      title: "Sigurnosni sistem - Vila Dedinje",
      description: "Kompletna instalacija alarmnog sistema i video nadzora za luksuznu vilu",
      image: "/placeholder.svg?height=300&width=400",
      rating: 5,
      location: "Beograd, Dedinje",
      category: "Kućni sistemi",
    },
    {
      id: 2,
      title: "Poslovni kompleks - Delta City",
      description: "Napredni sistem kontrole pristupa i video nadzora za trgovinski centar",
      image: "/placeholder.svg?height=300&width=400",
      rating: 5,
      location: "Beograd, Novi Beograd",
      category: "Poslovni sistemi",
    },
    {
      id: 3,
      title: "Pametna kuća - Zemun",
      description: "Potpuna automatizacija kuće sa pametnim osvetljenjem i klimatizacijom",
      image: "/placeholder.svg?height=300&width=400",
      rating: 5,
      location: "Beograd, Zemun",
      category: "Pametne instalacije",
    },
    {
      id: 4,
      title: "Fabrika - Kragujevac",
      description: "Industrijski sigurnosni sistem sa perimetarskom zaštitom",
      image: "/placeholder.svg?height=300&width=400",
      rating: 5,
      location: "Kragujevac",
      category: "Industrijski sistemi",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % projects.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length)
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Naši radovi</h2>
          <p className={styles.description}>Pogledajte neke od naših najuspešnijih projekata</p>
        </div>

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
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className={styles.projectImage}
                      />
                      <div className={styles.category}>{project.category}</div>
                    </div>
                    <div className={styles.projectContent}>
                      <h3 className={styles.projectTitle}>{project.title}</h3>
                      <p className={styles.projectDescription}>{project.description}</p>
                      <div className={styles.projectMeta}>
                        <div className={styles.rating}>
                          {[...Array(project.rating)].map((_, i) => (
                            <Star key={i} className={styles.star} />
                          ))}
                        </div>
                        <div className={styles.location}>
                          <MapPin size={16} />
                          <span>{project.location}</span>
                        </div>
                      </div>
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
      </div>
    </section>
  )
}
