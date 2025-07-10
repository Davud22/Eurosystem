"use client"

import { useState } from "react"
import { ArrowLeft, Upload, X, Plus } from "lucide-react"
import Header from "../../components/Header/Header"
import Link from "next/link"
import styles from "./DodajProizvod.module.css"

const BACKEND_URL = "http://localhost:8000";

export default function DodajProizvodPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    images: [],
    specifications: [{ key: "", value: "" }],
    inStock: true,
    featured: false,
  })

  const [dragActive, setDragActive] = useState(false)
  const [modal, setModal] = useState({ open: false, message: "" });

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
      images: formData.images.map(img => img.url),
      specifications: formData.specifications,
      in_stock: formData.inStock,
      featured: formData.featured,
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
    const uploaded = [];
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch(`${BACKEND_URL}/admin/products/images`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          uploaded.push({ url: data.url, name: file.name });
        }
      } catch {}
    }
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...uploaded],
    }));
  }

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }],
    }))
  }

  const updateSpecification = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec)),
    }))
  }

  const removeSpecification = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
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

                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleChange}
                      className={styles.checkbox}
                    />
                    <span>Proizvod je dostupan</span>
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className={styles.checkbox}
                    />
                    <span>Izdvojeni proizvod</span>
                  </label>
                </div>
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
                </div>

                {formData.images.length > 0 && (
                  <div className={styles.imageGrid}>
                    {formData.images.map((image, index) => (
                      <div key={index} className={styles.imagePreview}>
                        <img src={image.url.startsWith('/images/') ? `http://localhost:8000${image.url}` : image.url} alt={image.name} className={styles.previewImage} />
                        <button type="button" onClick={() => removeImage(index)} className={styles.removeImage}>
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Specifikacije */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Specifikacije</h2>
                  <button type="button" onClick={addSpecification} className={styles.addButton}>
                    <Plus size={16} />
                    Dodaj specifikaciju
                  </button>
                </div>

                <div className={styles.specifications}>
                  {formData.specifications.map((spec, index) => (
                    <div key={index} className={styles.specificationRow}>
                      <input
                        type="text"
                        value={spec.key}
                        onChange={(e) => updateSpecification(index, "key", e.target.value)}
                        placeholder="Naziv (npr. Dimenzije)"
                        className={styles.input}
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => updateSpecification(index, "value", e.target.value)}
                        placeholder="Vrijednost (npr. 20x15x5 cm)"
                        className={styles.input}
                      />
                      {formData.specifications.length > 1 && (
                        <button type="button" onClick={() => removeSpecification(index)} className={styles.removeSpec}>
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
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
