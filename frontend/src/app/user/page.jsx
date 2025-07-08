"use client"

import { useState } from "react"
import { User, ShoppingBag, Heart, MessageCircle, Settings, Star, TrendingUp } from "lucide-react"
import Header from "../components/Header/Header"
import styles from "./User.module.css"

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const stats = {
    orders: 3,
    wishlist: 12,
    messages: 2,
    reviews: 8,
  }

  const recentOrders = [
    {
      id: "ORD-001",
      product: "Alarmni sistem Pro",
      status: "U izradi",
      date: "15.12.2024",
      amount: "45.000 RSD",
    },
    {
      id: "ORD-002",
      product: "IP kamera set",
      status: "Isporučeno",
      date: "10.12.2024",
      amount: "28.000 RSD",
    },
  ]

  const recommendedProducts = [
    {
      id: 1,
      name: "Pametni senzor pokreta",
      price: "8.500 RSD",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Wireless alarm",
      price: "15.000 RSD",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  function logout() {
    localStorage.removeItem("access_token");
    fetch("/api/logout").then(() => {
      window.location.replace("/prijava");
    });
  }

  return (
    <div className={styles.userDashboard}>
      <Header />

      <button
        onClick={logout}
        style={{
          position: 'fixed',
          bottom: 40,
          right: 40,
          zIndex: 9999,
          padding: '16px 32px',
          background: '#ff3333',
          color: '#fff',
          border: '2px solid #222',
          borderRadius: 12,
          fontWeight: 'bold',
          fontSize: 22,
          boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
          cursor: 'pointer'
        }}
      >
        Odjava
      </button>

      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>
              <User size={32} />
            </div>
            <div className={styles.userInfo}>
              <h3 className={styles.userName}>Emrah Fazlić</h3>
              <p className={styles.userEmail}>emrah@example.com</p>
              <span className={styles.userRole}>Korisnik</span>
            </div>
          </div>

          <nav className={styles.nav}>
            <button
              onClick={() => setActiveTab("overview")}
              className={`${styles.navItem} ${activeTab === "overview" ? styles.active : ""}`}
            >
              <TrendingUp size={20} />
              Pregled
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`${styles.navItem} ${activeTab === "orders" ? styles.active : ""}`}
            >
              <ShoppingBag size={20} />
              Moje narudžbe
            </button>
            <button
              onClick={() => setActiveTab("wishlist")}
              className={`${styles.navItem} ${activeTab === "wishlist" ? styles.active : ""}`}
            >
              <Heart size={20} />
              Lista želja
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`${styles.navItem} ${activeTab === "messages" ? styles.active : ""}`}
            >
              <MessageCircle size={20} />
              Eurosystem Chat
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`${styles.navItem} ${activeTab === "profile" ? styles.active : ""}`}
            >
              <Settings size={20} />
              Moj profil
            </button>
          </nav>
        </div>

        <main className={styles.main}>
          {activeTab === "overview" && (
            <div className={styles.overview}>
              <div className={styles.welcome}>
                <h1 className={styles.welcomeTitle}>Zdravo, Emrah! 👋</h1>
                <p className={styles.welcomeText}>Dobrodošli nazad u vaš Eurosystem korisnički panel</p>
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <ShoppingBag size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statNumber}>{stats.orders}</h3>
                    <p className={styles.statLabel}>Narudžbe</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <Heart size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statNumber}>{stats.wishlist}</h3>
                    <p className={styles.statLabel}>Lista želja</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <MessageCircle size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statNumber}>{stats.messages}</h3>
                    <p className={styles.statLabel}>Poruke</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <Star size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statNumber}>{stats.reviews}</h3>
                    <p className={styles.statLabel}>Recenzije</p>
                  </div>
                </div>
              </div>

              <div className={styles.contentGrid}>
                <div className={styles.recentOrders}>
                  <h2 className={styles.sectionTitle}>Nedavne narudžbe</h2>
                  <div className={styles.ordersList}>
                    {recentOrders.map((order) => (
                      <div key={order.id} className={styles.orderItem}>
                        <div className={styles.orderInfo}>
                          <h4 className={styles.orderProduct}>{order.product}</h4>
                          <p className={styles.orderId}>#{order.id}</p>
                        </div>
                        <div className={styles.orderMeta}>
                          <span
                            className={`${styles.orderStatus} ${
                              order.status === "Isporučeno" ? styles.delivered : styles.processing
                            }`}
                          >
                            {order.status}
                          </span>
                          <span className={styles.orderDate}>{order.date}</span>
                          <span className={styles.orderAmount}>{order.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.recommendations}>
                  <h2 className={styles.sectionTitle}>Preporučeno za vas</h2>
                  <div className={styles.productsList}>
                    {recommendedProducts.map((product) => (
                      <div key={product.id} className={styles.productItem}>
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className={styles.productImage}
                        />
                        <div className={styles.productInfo}>
                          <h4 className={styles.productName}>{product.name}</h4>
                          <p className={styles.productPrice}>{product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className={styles.ordersSection}>
              <h1 className={styles.pageTitle}>Moje narudžbe</h1>
              <div className={styles.ordersList}>
                {recentOrders.map((order) => (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <h3 className={styles.orderProduct}>{order.product}</h3>
                      <span
                        className={`${styles.orderStatus} ${
                          order.status === "Isporučeno" ? styles.delivered : styles.processing
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className={styles.orderDetails}>
                      <p>Narudžba: #{order.id}</p>
                      <p>Datum: {order.date}</p>
                      <p>Iznos: {order.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className={styles.wishlistSection}>
              <h1 className={styles.pageTitle}>Lista želja</h1>
              <p className={styles.emptyState}>Vaša lista želja je trenutno prazna.</p>
            </div>
          )}

          {activeTab === "messages" && (
            <div className={styles.messagesSection}>
              <h1 className={styles.pageTitle}>Eurosystem Chat</h1>
              <div className={styles.chatContainer}>
                <div className={styles.chatHeader}>
                  <h3>Direktna komunikacija sa Eurosystem timom</h3>
                </div>
                <div className={styles.chatMessages}>
                  <div className={styles.message}>
                    <p>Pozdrav! Kako mogu da vam pomognem sa našim proizvodima?</p>
                    <span className={styles.messageTime}>14:30</span>
                  </div>
                </div>
                <div className={styles.chatInput}>
                  <input type="text" placeholder="Ukucajte poruku..." className={styles.messageInput} />
                  <button className={styles.sendButton}>Pošalji</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className={styles.profileSection}>
              <h1 className={styles.pageTitle}>Moj profil</h1>
              <div className={styles.profileForm}>
                <div className={styles.formGroup}>
                  <label>Ime i prezime</label>
                  <input type="text" defaultValue="Emrah Fazlić" />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input type="email" defaultValue="emrah@example.com" />
                </div>
                <div className={styles.formGroup}>
                  <label>Telefon</label>
                  <input type="tel" defaultValue="+381 64 123 4567" />
                </div>
                <div className={styles.formGroup}>
                  <label>Adresa</label>
                  <input type="text" defaultValue="Beograd, Srbija" />
                </div>
                <button className={styles.saveButton}>Sačuvaj izmjene</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
