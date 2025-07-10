"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import styles from "../../Admin.module.css";
import { MessageSquare, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const BACKEND_URL = "http://localhost:8000";

export default function BlogDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [modal, setModal] = useState({ open: false, message: "", type: "success" });

  useEffect(() => {
    fetch(`${BACKEND_URL}/admin/blogs/${id}`)
      .then(res => res.json())
      .then(data => {
        setBlog(data);
        setLoading(false);
      });
  }, [id]);

  const fetchComments = () => {
    setLoadingComments(true);
    fetch(`${BACKEND_URL}/comments/blog/${id}`)
      .then(res => res.json())
      .then(data => {
        setComments(data);
        setLoadingComments(false);
      });
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/blogs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setModal({ open: true, message: "Blog uspješno obrisan!", type: "success" });
      setTimeout(() => {
        setModal({ open: false, message: "" });
        router.push("/admin?tab=blog");
      }, 1200);
    } catch {
      setModal({ open: true, message: "Greška pri brisanju!", type: "error" });
      setTimeout(() => setModal({ open: false, message: "" }), 2000);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/comments/${commentId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setComments(comments => comments.filter(c => c.id !== commentId));
    } catch {
      setModal({ open: true, message: "Greška pri brisanju komentara!", type: "error" });
      setTimeout(() => setModal({ open: false, message: "" }), 2000);
    }
  };

  if (loading) return <div className={styles.page}><Header /><main className={styles.main}><p>Učitavanje...</p></main><Footer /></div>;
  if (!blog) return <div className={styles.page}><Header /><main className={styles.main}><p>Blog nije pronađen.</p></main><Footer /></div>;

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container} style={{ maxWidth: 900, margin: "0 auto" }}>
          {/* Uklonjen Nazad na blog link */}
          <div className={styles.productCard} style={{ display: "flex", flexDirection: "row", gap: 48, alignItems: "flex-start", padding: 48, borderRadius: 22, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", background: "var(--bg-primary)", maxWidth: 1100, margin: "0 auto" }}>
            <img
              src={blog.image_url ? (blog.image_url.startsWith("/images/") ? `${BACKEND_URL}${blog.image_url}` : blog.image_url) : "/placeholder.svg"}
              alt={blog.title}
              className={styles.productImage}
              style={{ width: 340, height: 240, objectFit: "cover", border: "3px solid #ddd", background: "#fff", borderRadius: 16 }}
            />
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 44, fontWeight: 800, marginBottom: 16, letterSpacing: -1 }}>{blog.title}</h1>
              <div style={{ color: "#888", fontSize: 20, marginBottom: 16 }}>
                Autor: <b>{blog.author}</b> | {new Date(blog.created_at).toLocaleDateString("bs-BA")}<br/>
                Komentara: <b>{blog.num_comments}</b> | Ocjena: <b>{blog.avg_rating?.toFixed(1) ?? "-"}</b>
              </div>
              <div style={{ fontSize: 22, marginBottom: 24, lineHeight: 1.6 }}>{blog.content}</div>
              <div style={{ display: "flex", gap: 32, marginTop: 32, justifyContent: "center", alignItems: "center" }}>
                <button className={styles.blogActionButton} onClick={() => { setShowComments(true); fetchComments(); }}>
                  <MessageSquare size={22} style={{ marginRight: 10 }} /> Komentari
                </button>
                <button className={styles.blogDeleteButton} onClick={() => setShowDelete(true)}>
                  <Trash2 size={22} style={{ marginRight: 10 }} /> Obriši
                </button>
              </div>
            </div>
          </div>
          {/* MODAL KOMENTARI */}
          {showComments && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent} style={{ maxWidth: 700, minHeight: 350, padding: 40, position: "relative", boxShadow: "0 8px 32px rgba(0,0,0,0.25)", borderRadius: 18 }}>
                <button onClick={() => setShowComments(false)} style={{ position: "absolute", top: 24, right: 28, background: "none", border: "none", fontSize: 26, fontWeight: 700, color: "#aaa", cursor: "pointer" }} title="Zatvori">×</button>
                <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 18, textAlign: "center" }}>Komentari</h2>
                {loadingComments ? (
                  <p style={{ textAlign: "center", fontSize: 18 }}>Učitavanje...</p>
                ) : comments.length === 0 ? (
                  <p style={{ textAlign: "center", fontSize: 18 }}>Nema komentara za ovaj blog.</p>
                ) : (
                  <div style={{ marginTop: 16, maxHeight: 350, overflowY: "auto" }}>
                    {comments.map(comment => (
                      <div key={comment.id} style={{ borderBottom: "1px solid #eee", padding: "18px 0", marginBottom: 8 }}>
                        <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 2 }}>{comment.author_full_name}</div>
                        <div style={{ color: "#888", fontSize: 15 }}>{new Date(comment.created_at).toLocaleString("bs-BA")}</div>
                        <div style={{ marginTop: 8, fontSize: 18 }}>{comment.content}</div>
                        <button onClick={() => handleDeleteComment(comment.id)} className={styles.blogCommentDeleteButton} style={{ marginTop: 10, fontSize: 15, padding: "7px 18px", borderRadius: 8 }}>Obriši</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {/* MODAL OBRISI */}
          {showDelete && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent} style={{ maxWidth: 520, minHeight: 220, padding: 48, borderRadius: 18, textAlign: "center" }}>
                <h3 style={{ fontSize: 28, fontWeight: 800, marginBottom: 18 }}>Jeste li sigurni da želite obrisati ovaj blog?</h3>
                <div style={{ display: "flex", gap: 18, marginTop: 32, justifyContent: "center" }}>
                  <button onClick={handleDelete} className={styles.blogDeleteButton} style={{ fontSize: 19, padding: "12px 32px", borderRadius: 10 }}>Obriši</button>
                  <button onClick={() => setShowDelete(false)} className={styles.cancelButton} style={{ fontSize: 19, padding: "12px 32px", borderRadius: 10 }}>Otkaži</button>
                </div>
              </div>
            </div>
          )}
          {/* MODAL PORUKA */}
          {modal.open && (
            <div style={{ background: modal.type === "success" ? "#e0ffe0" : "#fee2e2", color: modal.type === "success" ? "#0a0" : "#b91c1c", padding: 12, borderRadius: 8, margin: "24px auto", textAlign: "center", fontWeight: 500, maxWidth: 400 }}>{modal.message}</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
} 