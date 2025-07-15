"use client"

import { useState } from "react"
import { ArrowLeft, Upload, X, Plus } from "lucide-react"
import Header from "../../components/Header/Header"
import Link from "next/link"
import styles from "./DodajProizvod.module.css"
import { useAuth } from "../../../hooks/useAuth"

const BACKEND_URL = "http://localhost:8000";

export default function DodajProizvodPage() {
  // Prvo svi hooks - redoslijed mora biti konzistentan
  const { user, loading, error, logout } = useAuth('admin')
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    images: [],
  })

  const [dragActive, setDragActive] = useState(false)
  const [modal, setModal] = useState({ open: false, message: "" });

  // Ako se učitava, prikaži loading
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Učitavanje...
      </div>
    )
  }

  // Ako nema korisnika, neće se prikazati (useAuth će preusmjeriti)
  if (!user) {
    return null
  }

  const categories = [
    "Videonadzor",
    "Alarmni sistemi",
    "Kapije", 
    "Klima uređaji",
    "Elektroinstalacioni radovi"
  ]

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Pripremi podatke za backend
    const priceValue = formData.price.replace(',', '.');
    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(priceValue),
      category: formData.category,
      image_url: formData.images[0]?.url || "",
      in_stock: true,
      featured: false,
    };
    try {
      const res = await fetch(`${BACKEND_URL}/admin/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setModal({ open: true, message: "Greška prilikom dodavanja proizvoda!" });
        setTimeout(() => setModal({ open: false, message: "" }), 3000);
        return;
      }
      setModal({ open: true, message: "Uspješno dodan proizvod!" });
      setTimeout(() => {
        setModal({ open: false, message: "" });
        window.location.href = "/admin";
      }, 1500);
    } catch {
      setModal({ open: true, message: "Greška na serveru!" });
      setTimeout(() => setModal({ open: false, message: "" }), 3000);
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFiles = async (files) => {
    if (formData.images.length >= 1) return; // već postoji slika
    const file = files[0];
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch(`${BACKEND_URL}/admin/products/images`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({
          ...prev,
          images: [{ url: data.url, name: file.name }],
        }));
      }
    } catch {}
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <Link href="/admin" className={styles.backButton}>
              <ArrowLeft size={20} />
              Nazad na admin
            </Link>
            <h1 className={styles.title}>Dodaj novi proizvod</h1>
            <p className={styles.subtitle}>Unesite informacije o novom proizvodu</p>
          </div>
          {modal.open && (
            <div style={{ background: "#e0ffe0", color: "#0a0", padding: 12, borderRadius: 8, marginBottom: 16, textAlign: "center", fontWeight: 500 }}>
              {modal.message}
            </div>
          )}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              {/* Osnovne informacije */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Osnovne informacije</h2>

                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Naziv proizvoda *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="Unesite naziv proizvoda"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="description" className={styles.label}>
                    Opis proizvoda *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className={styles.textarea}
                    placeholder="Detaljno opišite proizvod..."
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="price" className={styles.label}>
                      Cijena (KM) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      required
                      className={styles.input}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="category" className={styles.label}>
                      Kategorija *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className={styles.select}
                    >
                      <option value="">Izaberite kategoriju</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Ukloni checkboxGroup */}
              </div>

              {/* Slike */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Slike proizvoda</h2>
                <div
                  className={`${styles.dropZone} ${dragActive ? styles.dragActive : ""}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  style={{ position: 'relative' }}
                >
                  <Upload size={48} className={styles.uploadIcon} />
                  <p className={styles.dropText}>
                    Povucite slike ovdje ili <span className={styles.browseText}>pregledajte</span>
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFiles(e.target.files)}
                    className={styles.fileInput}
                  />
                  {formData.images.length === 1 && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2 }}>
                      <div style={{ position: 'relative', width: 180, height: 180, borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px #0002', background: '#fff' }}>
                        {/* Overlay za zamračenje teksta ispod slike */}
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(20, 22, 34, 0.75)', zIndex: 1 }}></div>
                        <img src={formData.images[0].url.startsWith('/images/') ? `http://localhost:8000${formData.images[0].url}` : formData.images[0].url} alt="slika" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', position: 'relative', zIndex: 2 }} />
                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, images: [] }))} style={{ position: 'absolute', top: 8, right: 8, background: '#f44', color: '#fff', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 700, fontSize: 18, boxShadow: '0 1px 4px #0003', zIndex: 3 }}>×</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <Link href="/admin" className={styles.cancelButton} style={{ minWidth: 110, textAlign: "center" }}>
                Otkaži
              </Link>
              <button type="submit" className={styles.submitButton} style={{ minWidth: 140 }}>
                Dodaj proizvod
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
