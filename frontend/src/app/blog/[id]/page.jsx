"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "../../components/Header/Header";
import styles from "../Blog.module.css";
import { MessageCircle, User, Calendar, X, LogIn, UserPlus } from "lucide-react";

const BACKEND_URL = "http://localhost:8000";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("login");
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [userRating, setUserRating] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const userId = token ? parseJwt(token)?.user_id : null;
  const isLoggedIn = !!token && !!userId;
  console.log("JWT payload:", token ? parseJwt(token) : null);
  console.log("userId:", userId);
  // Detekcija teme
  const isDark = typeof window !== "undefined" && document.documentElement.dataset.theme === "dark";

  useEffect(() => {
    fetch(`${BACKEND_URL}/blogs/${id}`)
      .then(res => res.json())
      .then(data => {
        setBlog(data);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    setLoadingComments(true);
    fetch(`${BACKEND_URL}/comments/${id}`)
      .then(res => res.json())
      .then(data => {
        setComments(data);
        setLoadingComments(false);
      });
  }, [id]);

  useEffect(() => {
    if (token) {
      fetch(`${BACKEND_URL}/blogs/${id}/user-rating`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setUserRating(data.rating));
    }
  }, [id, token]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError("");
    setSuccessMsg("");
    if (!commentText.trim()) {
      setCommentError("Komentar ne može biti prazan.");
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/comments/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          content: commentText.trim(),
        })
      });
      if (!res.ok) throw new Error();
      setCommentText("");
      setSuccessMsg("Komentar uspješno dodan!");
      // Refresh comments
      fetch(`${BACKEND_URL}/comments/${id}`)
        .then(res => res.json())
        .then(data => setComments(data));
    } catch {
      setCommentError("Greška pri slanju komentara.");
    }
  };

  const handleRate = async (rating) => {
    await fetch(`${BACKEND_URL}/blogs/${id}/rate?rating=${rating}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    setUserRating(rating);
    // Refresh blog info (avg_rating)
    fetch(`${BACKEND_URL}/blogs/${id}`)
      .then(res => res.json())
      .then(data => setBlog(data));
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toLocaleDateString("sr-Latn-RS", { day: "2-digit", month: "long", year: "numeric" });
  };

  if (loading) return <div className={styles.page}><Header /><main className={styles.main}><p>Učitavanje...</p></main></div>;
  if (!blog) return <div className={styles.page}><Header /><main className={styles.main}><p>Blog nije pronađen.</p></main></div>;

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container} style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className={styles.blogCard} style={{ padding: 0, overflow: "visible" }}>
            <img
              src={blog.image_url ? (blog.image_url.startsWith("/images/") ? `${BACKEND_URL}${blog.image_url}` : blog.image_url) : "/placeholder.svg"}
              alt={blog.title}
              className={styles.blogImage}
              style={{ width: "100%", height: 320, objectFit: "cover", borderTopLeftRadius: 18, borderTopRightRadius: 18 }}
            />
            <div className={styles.blogContent} style={{ padding: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                <span className={styles.categoryTag}>{blog.category}</span>
                <span style={{ color: "#888", fontSize: 16 }}><User size={16} style={{ marginRight: 4 }} />{blog.author}</span>
                <span style={{ color: "#888", fontSize: 16 }}><Calendar size={16} style={{ marginRight: 4 }} />{formatDate(blog.created_at)}</span>
              </div>
              <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 18 }}>{blog.title}</h1>
              {isLoggedIn && (
                <div style={{ margin: "0 0 18px 0" }}>
                  {[1,2,3,4,5].map(star => (
                    <span
                      key={star}
                      style={{
                        color: userRating && userRating >= star ? "#fbbf24" : "#ccc",
                        fontSize: 28,
                        cursor: userRating ? "default" : "pointer",
                        transition: "color 0.2s"
                      }}
                      onClick={() => !userRating && handleRate(star)}
                    >★</span>
                  ))}
                  {userRating && <span style={{marginLeft: 8, color: "#888"}}>Vaša ocjena: {userRating}</span>}
                </div>
              )}
              <div style={{ fontSize: 20, marginBottom: 24, lineHeight: 1.7 }}>{blog.content}</div>
              <div style={{ color: "#888", fontSize: 17, marginBottom: 18 }}>
                Prosječna ocjena: <b>{blog.avg_rating?.toFixed(1) ?? "-"}</b> | Komentara: <b>{blog.num_comments}</b>
              </div>
            </div>
          </div>

          <section style={{ marginTop: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 18, textAlign: "left" }}>Komentari</h2>
            {loadingComments ? (
              <p>Učitavanje komentara...</p>
            ) : comments.length === 0 ? (
              <p>Nema komentara za ovaj blog.</p>
            ) : (
              <div style={{ marginBottom: 32 }}>
                {comments.map(comment => (
                  <div key={comment.id} style={{ borderBottom: "1px solid #eee", padding: "18px 0", marginBottom: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 2 }}>{comment.author_name}</div>
                    <div style={{ color: "#888", fontSize: 14 }}>{formatDate(comment.created_at)}</div>
                    <div style={{ marginTop: 8, fontSize: 17 }}>{comment.content}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Forma za komentar */}
            {isLoggedIn ? (
              <form onSubmit={handleCommentSubmit} style={{ marginTop: 24, background: isDark ? "#232b39" : "#f4f7ff", borderRadius: 12, padding: 24, boxShadow: isDark ? "0 2px 8px #10151c99" : "0 2px 8px #e0e7ef55", maxWidth: 600 }}>
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Napišite komentar..."
                  rows={4}
                  style={{ width: "100%", borderRadius: 8, border: isDark ? "1px solid #374151" : "1px solid #cbd5e1", padding: 12, fontSize: 16, resize: "vertical", background: isDark ? "#181f2a" : "#fff", color: isDark ? "#fff" : "#222" }}
                />
                {commentError && <div style={{ color: "#b91c1c", marginTop: 8 }}>{commentError}</div>}
                {successMsg && <div style={{ color: "#059669", marginTop: 8 }}>{successMsg}</div>}
                <button type="submit" style={{ marginTop: 14, background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, padding: "10px 28px", fontWeight: 600, fontSize: 17, cursor: "pointer" }}>Pošalji komentar</button>
              </form>
            ) : (
              <div style={{ marginTop: 24 }}>
                <button onClick={() => { setShowModal(true); setModalType("login"); }} style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, padding: "10px 28px", fontWeight: 600, fontSize: 17, cursor: "pointer" }}>
                  Dodaj komentar
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* MODAL za login/registraciju */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: isDark ? "rgba(24,31,42,0.85)" : "rgba(0,0,0,0.5)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            background: isDark ? "#232b39" : "#fff",
            color: isDark ? "#fff" : "#222",
            borderRadius: 16,
            padding: 36,
            minWidth: 320,
            minHeight: 220,
            textAlign: "center",
            position: "relative",
            boxShadow: isDark ? "0 2px 16px #10151c99" : "0 2px 16px #e0e7ef55"
          }}>
            <button onClick={() => setShowModal(false)} style={{ position: "absolute", top: 18, right: 22, background: "none", border: "none", fontSize: 26, fontWeight: 700, color: isDark ? "#aaa" : "#aaa", cursor: "pointer" }} title="Zatvori">×</button>
            <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 18 }}>Morate biti prijavljeni da biste ostavili komentar.</h3>
            <div style={{ display: "flex", gap: 18, marginTop: 32, justifyContent: "center" }}>
              <button onClick={() => { setShowModal(false); router.push("/prijava"); }} style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 600, fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>Prijava</button>
              <button onClick={() => { setShowModal(false); router.push("/registracija"); }} style={{ background: isDark ? "#232b39" : "#fff", color: "#3b82f6", border: "1.5px solid #3b82f6", borderRadius: 8, padding: "10px 24px", fontWeight: 600, fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>Registracija</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 