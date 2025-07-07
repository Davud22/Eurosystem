"use client"

import { useState } from "react"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react"
import styles from "./Korpa.module.css"

export default function KorpaPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Alarmni sistem Pro",
      price: 45000,
      quantity: 1,
      image: "/placeholder.svg?height=100&width=100",
      description: "Profesionalni alarmni sistem sa bežičnim senzorima",
    },
    {
      id: 2,
      name: "IP kamera HD Set",
      price: 28000,
      quantity: 2,
      image: "/placeholder.svg?height=100&width=100",
      description: "Set od 4 HD IP kamere sa NVR sistemom",
    },
  ])

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(id)
      return
    }
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("sr-RS").format(price) + " RSD"
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.heroTitle}>Vaša korpa</h1>
            <p className={styles.heroDescription}>Pregledajte odabrane proizvode i završite kupovinu</p>
          </div>
        </div>

        <div className={styles.container}>
          {cartItems.length === 0 ? (
            <div className={styles.emptyCart}>
              <ShoppingBag size={64} className={styles.emptyIcon} />
              <h2 className={styles.emptyTitle}>Vaša korpa je prazna</h2>
              <p className={styles.emptyDescription}>Dodajte proizvode u korpu da biste nastavili sa kupovinom</p>
              <a href="/proizvodi" className={styles.shopButton}>
                Pogledaj proizvode
              </a>
            </div>
          ) : (
            <div className={styles.cartContent}>
              <div className={styles.cartItems}>
                <h2 className={styles.sectionTitle}>Proizvodi u korpi ({cartItems.length})</h2>

                {cartItems.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      <img src={item.image || "/placeholder.svg"} alt={item.name} />
                    </div>

                    <div className={styles.itemDetails}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <p className={styles.itemDescription}>{item.description}</p>
                      <span className={styles.itemPrice}>{formatPrice(item.price)}</span>
                    </div>

                    <div className={styles.itemControls}>
                      <div className={styles.quantityControls}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className={styles.quantityButton}
                        >
                          <Minus size={16} />
                        </button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className={styles.quantityButton}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className={styles.itemTotal}>{formatPrice(item.price * item.quantity)}</div>

                      <button onClick={() => removeItem(item.id)} className={styles.removeButton}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.cartSummary}>
                <h2 className={styles.summaryTitle}>Pregled narudžbe</h2>

                <div className={styles.summaryDetails}>
                  <div className={styles.summaryRow}>
                    <span>Ukupno proizvoda:</span>
                    <span>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
                  </div>

                  <div className={styles.summaryRow}>
                    <span>Subtotal:</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>

                  <div className={styles.summaryRow}>
                    <span>Dostava:</span>
                    <span>Besplatno</span>
                  </div>

                  <div className={styles.summaryDivider}></div>

                  <div className={styles.summaryTotal}>
                    <span>Ukupno:</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>

                <button className={styles.checkoutButton}>
                  Nastavi sa kupovinom
                  <ArrowRight size={20} />
                </button>

                <div className={styles.paymentMethods}>
                  <p className={styles.paymentTitle}>Načini plaćanja:</p>
                  <div className={styles.paymentIcons}>
                    <span className={styles.paymentMethod}>Kartica</span>
                    <span className={styles.paymentMethod}>Keš</span>
                    <span className={styles.paymentMethod}>Čekovi</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
