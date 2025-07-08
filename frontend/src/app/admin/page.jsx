"use client"

import { useState } from "react"
import {
  Users,
  Package,
  ShoppingCart,
  MessageSquare,
  FileText,
  Camera,
  BarChart3,
  Mail,
  Settings,
  Eye,
  Star,
  UserPlus,
} from "lucide-react"
import Header from "../components/Header/Header"
import styles from "./Admin.module.css"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const stats = {
    totalUsers: 1247,
    totalOrders: 89,
    totalProducts: 156,
    avgRating: 4.8,
    todayOrders: 12,
    newUsers: 23,
  }

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "Marko Petrović",
      product: "Alarmni sistem Pro",
      status: "pending",
      amount: "45.000 RSD",
      date: "15.12.2024",
    },
    {
      id: "ORD-002",
      customer: "Ana Jovanović",
      product: "IP kamera set",
      status: "processing",
      amount: "28.000 RSD",
      date: "15.12.2024",
    },
    {
      id: "ORD-003",
      customer: "Stefan Nikolić",
      product: "Pametni senzor",
      status: "completed",
      amount: "12.500 RSD",
      date: "14.12.2024",
    },
  ]

  const topProducts = [
    { name: "Alarmni sistem Pro", views: 1234, sales: 45 },
    { name: "IP kamera HD", views: 987, sales: 32 },
    { name: "Pametni senzor pokreta", views: 756, sales: 28 },
    { name: "Wireless alarm", views: 654, sales: 21 },
    { name: "Video interfon", views: 543, sales: 18 },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Na čekanju"
      case "processing":
        return "U izradi"
      case "completed":
        return "Završeno"
      default:
        return status
    }
  }

  function logout() {
    localStorage.removeItem("access_token");
    fetch("/api/logout").then(() => {
      window.location.replace("/prijava");
    });
  }

  return (
    <div className={styles.admin}>
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
          <div className={styles.adminProfile}>
            <div className={styles.avatar}>
              <Settings size={32} />
            </div>
            <div className={styles.adminInfo}>
              <h3 className={styles.adminName}>Admin Panel</h3>
              <p className={styles.adminRole}>Eurosystem CMS</p>
            </div>
          </div>

          <nav className={styles.nav}>
            <button
              onClick={() => setActiveTab("overview")}
              className={`${styles.navItem} ${activeTab === "overview" ? styles.active : ""}`}
            >
              <BarChart3 size={20} />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`${styles.navItem} ${activeTab === "users" ? styles.active : ""}`}
            >
              <Users size={20} />
              Korisnici
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`${styles.navItem} ${activeTab === "products" ? styles.active : ""}`}
            >
              <Package size={20} />
              Proizvodi
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`${styles.navItem} ${activeTab === "orders" ? styles.active : ""}`}
            >
              <ShoppingCart size={20} />
              Narudžbe
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={`${styles.navItem} ${activeTab === "comments" ? styles.active : ""}`}
            >
              <MessageSquare size={20} />
              Komentari
            </button>
            <button
              onClick={() => setActiveTab("blog")}
              className={`${styles.navItem} ${activeTab === "blog" ? styles.active : ""}`}
            >
              <FileText size={20} />
              Blog
            </button>
            <button
              onClick={() => setActiveTab("portfolio")}
              className={`${styles.navItem} ${activeTab === "portfolio" ? styles.active : ""}`}
            >
              <Camera size={20} />
              Naši radovi
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`${styles.navItem} ${activeTab === "email" ? styles.active : ""}`}
            >
              <Mail size={20} />
              Email
            </button>
          </nav>
        </div>

        <main className={styles.main}>
          {activeTab === "overview" && (
            <div className={styles.overview}>
              <div className={styles.header}>
                <h1 className={styles.pageTitle}>Dashboard pregled</h1>
                <p className={styles.pageSubtitle}>Dobrodošli u Eurosystem admin panel</p>
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <Users size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statNumber}>{stats.totalUsers}</h3>
                    <p className={styles.statLabel}>Ukupno korisnika</p>
                    <span className={styles.statChange}>+{stats.newUsers} novo</span>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <ShoppingCart size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statNumber}>{stats.totalOrders}</h3>
                    <p className={styles.statLabel}>Ukupno narudžbi</p>
                    <span className={styles.statChange}>+{stats.todayOrders} danas</span>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <Package size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statNumber}>{stats.totalProducts}</h3>
                    <p className={styles.statLabel}>Proizvodi</p>
                    <span className={styles.statChange}>Aktivni</span>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <Star size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statNumber}>{stats.avgRating}</h3>
                    <p className={styles.statLabel}>Prosečna ocena</p>
                    <span className={styles.statChange}>Odlično</span>
                  </div>
                </div>
              </div>

              <div className={styles.contentGrid}>
                <div className={styles.recentOrders}>
                  <h2 className={styles.sectionTitle}>Nedavne narudžbe</h2>
                  <div className={styles.table}>
                    <div className={styles.tableHeader}>
                      <span>Narudžba</span>
                      <span>Kupac</span>
                      <span>Proizvod</span>
                      <span>Status</span>
                      <span>Iznos</span>
                    </div>
                    {recentOrders.map((order) => (
                      <div key={order.id} className={styles.tableRow}>
                        <span className={styles.orderId}>#{order.id}</span>
                        <span>{order.customer}</span>
                        <span>{order.product}</span>
                        <span className={`${styles.status} ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                        <span className={styles.amount}>{order.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.topProducts}>
                  <h2 className={styles.sectionTitle}>Najpopularniji proizvodi</h2>
                  <div className={styles.productsList}>
                    {topProducts.map((product, index) => (
                      <div key={index} className={styles.productItem}>
                        <div className={styles.productRank}>#{index + 1}</div>
                        <div className={styles.productInfo}>
                          <h4 className={styles.productName}>{product.name}</h4>
                          <div className={styles.productStats}>
                            <span className={styles.productViews}>
                              <Eye size={14} />
                              {product.views}
                            </span>
                            <span className={styles.productSales}>
                              <ShoppingCart size={14} />
                              {product.sales}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className={styles.usersSection}>
              <div className={styles.sectionHeader}>
                <h1 className={styles.pageTitle}>Upravljanje korisnicima</h1>
                <button className={styles.addButton}>
                  <UserPlus size={20} />
                  Dodaj korisnika
                </button>
              </div>
              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  <span>Ime</span>
                  <span>Email</span>
                  <span>Datum registracije</span>
                  <span>Status</span>
                  <span>Akcije</span>
                </div>
                <div className={styles.tableRow}>
                  <span>Marko Petrović</span>
                  <span>marko@example.com</span>
                  <span>10.12.2024</span>
                  <span className={styles.statusActive}>Aktivan</span>
                  <span className={styles.actions}>
                    <button className={styles.editButton}>Uredi</button>
                    <button className={styles.blockButton}>Blokiraj</button>
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className={styles.productsSection}>
              <div className={styles.sectionHeader}>
                <h1 className={styles.pageTitle}>Upravljanje proizvodima</h1>
                <button className={styles.addButton}>
                  <Package size={20} />
                  Dodaj proizvod
                </button>
              </div>
              <p className={styles.emptyState}>
                Ovdje će biti lista proizvoda sa opcijama za dodavanje, uređivanje i brisanje.
              </p>
            </div>
          )}

          {activeTab === "orders" && (
            <div className={styles.ordersSection}>
              <h1 className={styles.pageTitle}>Upravljanje narudžbama</h1>
              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  <span>ID</span>
                  <span>Kupac</span>
                  <span>Proizvod</span>
                  <span>Status</span>
                  <span>Iznos</span>
                  <span>Datum</span>
                  <span>Akcije</span>
                </div>
                {recentOrders.map((order) => (
                  <div key={order.id} className={styles.tableRow}>
                    <span>#{order.id}</span>
                    <span>{order.customer}</span>
                    <span>{order.product}</span>
                    <select defaultValue={order.status} className={styles.statusSelect}>
                      <option value="pending">Na čekanju</option>
                      <option value="processing">U izradi</option>
                      <option value="completed">Završeno</option>
                    </select>
                    <span>{order.amount}</span>
                    <span>{order.date}</span>
                    <span className={styles.actions}>
                      <button className={styles.viewButton}>Pogledaj</button>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "comments" && (
            <div className={styles.commentsSection}>
              <h1 className={styles.pageTitle}>Upravljanje komentarima</h1>
              <p className={styles.emptyState}>Ovdje će biti lista komentara sa opcijama za odobravanje i brisanje.</p>
            </div>
          )}

          {activeTab === "blog" && (
            <div className={styles.blogSection}>
              <div className={styles.sectionHeader}>
                <h1 className={styles.pageTitle}>Blog upravljanje</h1>
                <button className={styles.addButton}>
                  <FileText size={20} />
                  Nova objava
                </button>
              </div>
              <p className={styles.emptyState}>
                Ovdje će biti lista blog objava sa opcijama za dodavanje, uređivanje i brisanje.
              </p>
            </div>
          )}

          {activeTab === "portfolio" && (
            <div className={styles.portfolioSection}>
              <div className={styles.sectionHeader}>
                <h1 className={styles.pageTitle}>Naši radovi</h1>
                <button className={styles.addButton}>
                  <Camera size={20} />
                  Dodaj projekt
                </button>
              </div>
              <p className={styles.emptyState}>
                Ovdje će biti galerija projekata sa opcijama za dodavanje slika i opisa.
              </p>
            </div>
          )}

          {activeTab === "email" && (
            <div className={styles.emailSection}>
              <h1 className={styles.pageTitle}>Email notifikacije</h1>
              <div className={styles.emailForm}>
                <div className={styles.formGroup}>
                  <label>Naslov</label>
                  <input type="text" placeholder="Unesite naslov email-a" />
                </div>
                <div className={styles.formGroup}>
                  <label>Poruka</label>
                  <textarea rows={5} placeholder="Unesite sadržaj poruke"></textarea>
                </div>
                <div className={styles.formGroup}>
                  <label>Pošalji</label>
                  <select>
                    <option>Svim korisnicima</option>
                    <option>Samo aktivnim korisnicima</option>
                    <option>Korisnicima sa narudžbama</option>
                  </select>
                </div>
                <button className={styles.sendEmailButton}>
                  <Mail size={20} />
                  Pošalji email
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
