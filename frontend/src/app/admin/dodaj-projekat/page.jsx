"use client";
import { useState } from "react";
import Header from "../../components/Header/Header";
import styles from "../dodaj-proizvod/DodajProizvod.module.css";
import { Upload, X, ArrowLeft } from "lucide-react";
import Link from "next/link";

const BACKEND_URL = "http://localhost:8000";

export default function DodajProjekatPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [],
  });
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [modal, setModal] = useState({ open: false, message: "" });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = async (files) => {
    setUploading(true);
    const uploaded = [];
    for (const file of Array.from(files)) {
      const data = new FormData();
      data.append("file", file);
      try {
        const res = await fetch(`${BACKEND_URL}/admin/blogs/images`, {
          method: "POST",
          body: data,
        });
        const result = await res.json();
        if (result.url) {
          // Dodaj puni URL ako je relativan
          const url = result.url.startsWith("/images/") ? `${BACKEND_URL}${result.url}` : result.url;
          uploaded.push({ url, name: file.name });
        }
      } catch {}
    }
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...uploaded],
    }));
    setUploading(false);
    setMainImageIdx(formData.images.length); // Prikaži zadnje dodanu kao glavnu
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setMainImageIdx(0);
  };

  const handleImageInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        images: formData.images.map((img) => img.url),
      };
      const res = await fetch(`${BACKEND_URL}/admin/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setModal({ open: true, message: "Projekt uspješno dodan!" });
      setTimeout(() => {
        setModal({ open: false, message: "" });
        window.location.href = "/admin";
      }, 1500);
    } catch {
      setModal({ open: true, message: "Greška pri dodavanju projekta!" });
      setTimeout(() => setModal({ open: false, message: "" }), 3000);
    }
  };

  // --- Prikaz slike i thumbnails ---
  const mainImage = formData.images[mainImageIdx]?.url;

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <Link href="/admin" className={styles.backButton}>
              <ArrowLeft size={20} /> Nazad na admin
            </Link>
            <h1 className={styles.title}>Dodaj novi projekt</h1>
            <p className={styles.subtitle}>Unesite informacije o novom projektu</p>
          </div>
          {modal.open && (
            <div style={{ background: "#e0ffe0", color: "#0a0", padding: 12, borderRadius: 8, marginBottom: 16, textAlign: "center", fontWeight: 500 }}>
              {modal.message}
            </div>
          )}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>Naslov *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Unesite naslov projekta"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>Opis *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className={styles.textarea}
                placeholder="Unesite opis projekta..."
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Slike projekta</label>
              <div
                className={styles.blogDropZone}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                style={{ border: dragActive ? "2px solid #3b82f6" : undefined, position: 'relative' }}
              >
                {formData.images.length === 0 ? (
                  <>
                    <Upload size={44} className={styles.uploadIcon} />
                    <p style={{ color: "#888", marginTop: 8, fontSize: 16 }}>Povucite slike ovdje ili kliknite za upload</p>
                    <input type="file" accept="image/*" multiple onChange={handleImageInput} className={styles.fileInput} disabled={uploading} style={{ position: "absolute", left: 0, top: 0, width: '100%', height: '100%', opacity: 0, cursor: "pointer", zIndex: 2 }} />
                  </>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                    {/* Glavna slika */}
                    <div style={{ marginBottom: 12 }}>
                      <img src={mainImage} alt="slika projekta" style={{ maxWidth: 320, maxHeight: 180, borderRadius: 10, background: "#f3f4f6", border: "1.5px solid #e5e7eb" }} />
                    </div>
                    {/* Thumbnails */}
                    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                      {formData.images.map((img, idx) => (
                        <div key={idx} style={{ position: "relative" }}>
                          <img
                            src={img.url}
                            alt="slika projekta"
                            style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 6, border: idx === mainImageIdx ? "2px solid #3b82f6" : "1.5px solid #e5e7eb", cursor: "pointer" }}
                            onClick={() => setMainImageIdx(idx)}
                          />
                          <button type="button" onClick={() => removeImage(idx)} className={styles.removeImage} style={{ position: "absolute", top: 2, right: 2, background: "#fee2e2", borderRadius: "50%", border: "none", padding: 2 }}>
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      <label style={{ display: "flex", alignItems: "center", cursor: "pointer", marginLeft: 8, position: 'relative' }}>
                        <Upload size={24} />
                        <input type="file" accept="image/*" multiple onChange={handleImageInput} style={{ display: "none" }} />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.blogFormActions}>
              <button type="button" className={styles.cancelButton} style={{ minWidth: 140, height: 48, textAlign: "center", display: "inline-flex", alignItems: "center", justifyContent: "center" }} onClick={() => window.location.href = "/admin"}>Otkaži</button>
              <button type="submit" className={styles.submitButton} style={{ minWidth: 140, height: 48, display: "inline-flex", alignItems: "center", justifyContent: "center" }} disabled={uploading}>
                {uploading ? "Učitavanje slika..." : "Dodaj projekt"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 