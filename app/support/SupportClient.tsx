"use client";

import { FormEvent, useState } from "react";

export default function SupportClient() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true); setMessage(""); setError("");
    try {
      const response = await fetch("/api/support", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subject: form.get("subject"), category: form.get("category"), message: form.get("message") }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "تعذر إرسال الطلب.");
      setMessage("تم إرسال طلب الدعم بنجاح. ستظهر حالته في نفس الصفحة.");
      event.currentTarget.reset();
      window.setTimeout(() => window.location.reload(), 500);
    } catch (err) { setError(err instanceof Error ? err.message : "حدث خطأ أثناء الإرسال."); }
    finally { setLoading(false); }
  }

  return <>
    {message && <div style={{background:"#ecfdf3",border:"1px solid #abefc6",color:"#067647",borderRadius:14,padding:14,marginBottom:15,fontWeight:800}}>{message}</div>}
    {error && <div style={{background:"#fef3f2",border:"1px solid #fecdca",color:"#b42318",borderRadius:14,padding:14,marginBottom:15,fontWeight:800}}>{error}</div>}
    <section style={{background:"#fff",border:"1px solid #edf0f6",borderRadius:24,padding:26,boxShadow:"0 10px 30px rgba(0,0,0,.05)",marginBottom:20}}>
      <h2 style={{margin:"0 0 8px",fontSize:22}}>📝 فتح طلب دعم</h2>
      <p style={{margin:"0 0 18px",color:"#667085",lineHeight:1.8}}>اكتب المشكلة بالتفصيل حتى تقدر الإدارة تساعدك بسرعة.</p>
      <form onSubmit={submit} style={{display:"grid",gap:12}}>
        <input name="subject" required maxLength={160} placeholder="عنوان المشكلة" style={{border:"1px solid #d0d5dd",borderRadius:12,padding:13,fontFamily:"inherit"}} />
        <select name="category" required defaultValue="TECHNICAL" style={{border:"1px solid #d0d5dd",borderRadius:12,padding:13,fontFamily:"inherit"}}><option value="TECHNICAL">مشكلة تقنية</option><option value="LESSON">مشكلة في محاضرة أو محتوى</option><option value="PAYMENT">الاشتراك أو كود التفعيل</option><option value="ACCOUNT">الحساب وتسجيل الدخول</option><option value="OTHER">أخرى</option></select>
        <textarea name="message" required maxLength={5000} rows={6} placeholder="اشرح المشكلة هنا..." style={{border:"1px solid #d0d5dd",borderRadius:12,padding:13,fontFamily:"inherit",resize:"vertical"}} />
        <button disabled={loading} type="submit" style={{border:0,borderRadius:12,padding:13,background:loading?"#98a2b3":"#101a3a",color:"#fff",fontWeight:900}}>{loading?"جاري الإرسال...":"إرسال طلب الدعم"}</button>
      </form>
    </section>
  </>;
}
