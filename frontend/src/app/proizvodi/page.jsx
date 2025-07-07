import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import { Shield, Camera, Zap, Star, ShoppingCart } from "lucide-react"
import styles from "./Proizvodi.module.css"

export default function ProizvodiPage() {
  const categories = [
    {
      id: 1,
      name: "Alarmni sistemi",
      description: "Napredni sistemi za zaštitu doma i poslovnih prostora",
      icon: Shield,
      products: [
        {
          id: 1,
          name: "Alarmni sistem Pro",
          price: "45.000 RSD",
          rating: 4.8,
          image: "/placeholder.svg?height=200&width=200",
          description: "Profesionalni alarmni sistem sa bežičnim senzorima",
        },
        {
          id: 2,
          name: "Wireless Alarm Basic",
          price: "25.000 RSD",
          rating: 4.5,
          image: "/placeholder.svg?height=200&width=200",
          description: "Osnovni bežični alarmni sistem za manje prostorije",
        },
      ],
    },
    {
      id: 2,
      name: "Videonadzor",
      description: "HD kamere i sistemi za video nadzor",
      icon: Camera,
      products: [
        {
          id: 3,
          name: "IP kamera HD Set",
          price: "28.000 RSD",
          rating: 4.7,
          image: "/placeholder.svg?height=200&width=200",
          description: "Set od 4 HD IP kamere sa NVR sistemom",
        },
        {
          id: 4,
          name: "4K Security Camera",
          price: "35.000 RSD",
          rating: 4.9,
          image: "/placeholder.svg?height=200&width=200",
          description: "Ultra HD 4K kamera sa noćnim vidom",
        },
      ],
    },
    {
      id: 3,
      name: "Pametne instalacije",
      description: "Automatizacija i pametno upravljanje",
      icon: Zap,
      products: [
        {
          id: 5,
          name: "Pametni senzor pokreta",
          price: "8.500 RSD",
          rating: 4.6,
          image: "/placeholder.svg?height=200&width=200",
          description: "Bežični senzor pokreta sa pametnim funkcijama",
        },
        {
          id: 6,
          name: "Smart Home Hub",
          price: "22.000 RSD",
          rating: 4.8,
          image: "/placeholder.svg?height=200&width=200",
          description: "Centralni hub za upravljanje pametnim uređajima",
        },
      ],
    },
  ]

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.heroTitle}>Naši proizvodi</h1>
            <p className={styles.heroDescription}>Kompletna ponuda sigurnosnih sistema i pametnih instalacija</p>
          </div>
        </div>

        <div className={styles.container}>
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <section key={category.id} className={styles.categorySection}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryIcon}>
                    <IconComponent size={32} />
                  </div>
                  <div>
                    <h2 className={styles.categoryTitle}>{category.name}</h2>
                    <p className={styles.categoryDescription}>{category.description}</p>
                  </div>
                </div>

                <div className={styles.productsGrid}>
                  {category.products.map((product) => (
                    <div key={product.id} className={styles.productCard}>
                      <div className={styles.productImage}>
                        <img src={product.image || "/placeholder.svg"} alt={product.name} />
                      </div>
                      <div className={styles.productContent}>
                        <h3 className={styles.productName}>{product.name}</h3>
                        <p className={styles.productDescription}>{product.description}</p>
                        <div className={styles.productRating}>
                          <div className={styles.stars}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < Math.floor(product.rating) ? styles.starFilled : styles.starEmpty}
                              />
                            ))}
                          </div>
                          <span className={styles.ratingText}>({product.rating})</span>
                        </div>
                        <div className={styles.productFooter}>
                          <span className={styles.productPrice}>{product.price}</span>
                          <button className={styles.addToCartButton}>
                            <ShoppingCart size={16} />
                            Dodaj u korpu
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </main>

      <Footer />
    </div>
  )
}
