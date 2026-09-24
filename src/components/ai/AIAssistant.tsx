"use client";

import { FormEvent, useState } from "react";

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function ask(event: FormEvent) {
    event.preventDefault();
    if (!question.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, page: window.location.pathname }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "تعذر الرد.");
      setAnswer(data.answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء السؤال.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="اسأل المساعد الذكي"
        style={{
          position: "fixed", bottom: 22, right: 22, zIndex: 80,
          border: 0, borderRadius: 999, padding: "13px 18px",
          background: "#101a3a", color: "#fff", fontWeight: 900,
          boxShadow: "0 12px 35px rgba(16,26,58,.25)", cursor: "pointer",
        }}
      >
        🤖 اسأل المساعد
      </button>

      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(15,23,42,.45)", padding: 18 }}>
          <div dir="rtl" style={{ maxWidth: 560, margin: "7vh auto 0", background: "#fff", borderRadius: 24, padding: 22, boxShadow: "0 25px 70px rgba(0,0,0,.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              <div><div style={{ color: "#b08a25", fontWeight: 800, fontSize: 12 }}>مساعد المنصة</div><h2 style={{ margin: "4px 0 0", fontSize: 23 }}>🤖 اسأل المساعد الذكي</h2></div>
              <button type="button" onClick={() => setOpen(false)} style={{ border: 0, background: "#f1f3f6", borderRadius: 10, padding: "8px 11px", cursor: "pointer" }}>✕</button>
            </div>
            <p style={{ color: "#667085", lineHeight: 1.8, fontSize: 13 }}>اسأل عن شرح قاعدة، فكرة في الدرس، أو طريقة مذاكرة. المساعد لا يستبدل المعلم ولا يكشف بيانات خاصة.</p>
            {answer && <div style={{ whiteSpace: "pre-wrap", background: "#f7f8fc", border: "1px solid #e4e7ec", borderRadius: 16, padding: 15, lineHeight: 1.9, marginBottom: 12 }}>{answer}</div>}
            {error && <div style={{ background: "#fef3f2", color: "#b42318", borderRadius: 12, padding: 12, marginBottom: 12, fontWeight: 700 }}>{error}</div>}
            <form onSubmit={ask}>
              <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="اكتب سؤالك هنا..." rows={4} maxLength={4000} style={{ width: "100%", resize: "vertical", border: "1px solid #d0d5dd", borderRadius: 14, padding: 13, outline: "none", fontFamily: "inherit" }} />
              <button disabled={loading || !question.trim()} type="submit" style={{ width: "100%", marginTop: 10, border: 0, borderRadius: 13, padding: 13, background: loading ? "#98a2b3" : "#4f46e5", color: "#fff", fontWeight: 900, cursor: loading ? "wait" : "pointer" }}>{loading ? "جاري التفكير..." : "إرسال السؤال"}</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
