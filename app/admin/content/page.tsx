"use client";

import { useEffect, useMemo, useState } from "react";

type Course = { id: string; title: string; grade: string | null; isPublished: boolean; units: Unit[] };
type Unit = { id: string; courseId: string; title: string; isPublished: boolean; lessons: Lesson[]; exams: Exam[] };
type Lesson = { id: string; unitId: string; title: string; videoUrl: string | null; isPublished: boolean; files: FileRow[]; assignments: Assignment[] };
type FileRow = { id: string; name: string; url: string; type: string | null };
type Assignment = { id: string; title: string; isPublished: boolean; questions: Question[] };
type Exam = { id: string; title: string; isPublished: boolean; questions: Question[] };
type Question = { id: string; question: string; optionA: string; optionB: string; optionC: string; optionD: string; correctAnswer: string; points: number };

async function api(method: string, body?: unknown) {
  const response = await fetch("/api/admin/content", { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined, cache: "no-store" });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.message || "حدث خطأ.");
  return data;
}

export default function AdminContentPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const allUnits = useMemo(() => courses.flatMap((course) => course.units.map((unit) => ({ ...unit, courseTitle: course.title }))), [courses]);
  const allLessons = useMemo(() => allUnits.flatMap((unit) => unit.lessons.map((lesson) => ({ ...lesson, unitTitle: unit.title, courseTitle: unit.courseTitle }))), [allUnits]);
  const allAssignments = useMemo(() => allLessons.flatMap((lesson) => lesson.assignments), [allLessons]);
  const allExams = useMemo(() => allUnits.flatMap((unit) => unit.exams), [allUnits]);

  async function load() {
    setLoading(true); setError("");
    try { const data = await api("GET"); setCourses(data.courses || []); }
    catch (e) { setError(e instanceof Error ? e.message : "تعذر تحميل المحتوى."); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function add(entity: string, payload: Record<string, unknown>) {
    setMessage(""); setError("");
    try { await api("POST", { entity, ...payload }); setMessage("تمت الإضافة بنجاح."); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : "تعذر الحفظ."); }
  }
  async function toggle(entity: string, id: string, isPublished: boolean) {
    setMessage(""); setError("");
    try { await api("PATCH", { entity, id, isPublished: !isPublished, ...(entity === "course" ? { title: courses.find(x=>x.id===id)?.title, grade: courses.find(x=>x.id===id)?.grade || "غير محدد", description: "" } : entity === "unit" ? { title: allUnits.find(x=>x.id===id)?.title } : { title: allLessons.find(x=>x.id===id)?.title, description: "" }) }); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : "تعذر التحديث."); }
  }
  async function remove(entity: string, id: string) {
    if (!confirm("هل تريد حذف هذا العنصر؟")) return;
    setMessage(""); setError("");
    try { await api("DELETE", { entity, id }); setMessage("تم الحذف."); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : "تعذر الحذف."); }
  }

  const box = { background: "#fff", border: "1px solid #e4e7ec", borderRadius: 18, padding: 18 } as const;
  const input = { width: "100%", border: "1px solid #d0d5dd", borderRadius: 10, padding: 10, marginTop: 7, boxSizing: "border-box" as const };

  if (loading) return <main dir="rtl" style={{ minHeight: "100vh", padding: 30, background: "#f5f7fb" }}>جاري تحميل مركز إدارة المحتوى...</main>;

  return <main dir="rtl" style={{ minHeight: "100vh", background: "#f5f7fb", padding: "25px 18px 70px", fontFamily: "Arial,Tahoma,sans-serif", color: "#172033" }}>
    <div style={{ maxWidth: 1300, margin: "0 auto" }}>
      <header style={{ background: "linear-gradient(135deg,#101a3a,#24366e)", color: "#fff", borderRadius: 24, padding: 28, marginBottom: 20 }}><div style={{ color: "#e5c75b", fontWeight: 800, fontSize: 13 }}>لوحة الإدارة</div><h1 style={{ margin: "8px 0", fontSize: 30 }}>مركز التحكم في المحتوى</h1><p style={{ margin: 0, color: "#d7dbea", lineHeight: 1.8 }}>إضافة وإدارة الكورسات والوحدات والمحاضرات والفيديوهات والملفات والواجبات والاختبارات.</p></header>
    {message && <div style={{ ...box, marginBottom: 12, color: "#067647", background: "#ecfdf3" }}>{message}</div>}
    {error && <div style={{ ...box, marginBottom: 12, color: "#b42318", background: "#fef3f2" }}>{error}</div>}

    <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 15 }}>
      <form style={box} onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); void add("course", { title: f.get("title"), grade: f.get("grade"), description: f.get("description"), imageUrl: f.get("imageUrl"), isPublished: f.get("published") === "on" }); e.currentTarget.reset(); }}><h2 style={{ marginTop: 0 }}>➕ كورس جديد</h2><input name="title" placeholder="اسم الكورس" required style={input}/><input name="grade" placeholder="الصف الدراسي" required style={input}/><textarea name="description" placeholder="وصف الكورس" style={{...input, minHeight:70}}/><input name="imageUrl" placeholder="رابط صورة الكورس (اختياري)" style={input}/><label style={{display:"block",marginTop:10}}><input name="published" type="checkbox"/> نشر فورًا</label><button style={{marginTop:12,width:"100%",padding:11,border:0,borderRadius:10,background:"#4f46e5",color:"#fff",fontWeight:800}}>إضافة الكورس</button></form>
      <form style={box} onSubmit={(e) => { e.preventDefault(); const f=new FormData(e.currentTarget); void add("unit", { courseId: f.get("courseId"), title:f.get("title"), description:f.get("description"), order:Number(f.get("order")||0), isPublished:f.get("published")==="on" }); e.currentTarget.reset(); }}><h2 style={{marginTop:0}}>➕ وحدة جديدة</h2><select name="courseId" required style={input}><option value="">اختر الكورس</option>{courses.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select><input name="title" placeholder="اسم الوحدة" required style={input}/><textarea name="description" placeholder="الوصف" style={{...input,minHeight:60}}/><input name="order" type="number" placeholder="الترتيب" style={input}/><label style={{display:"block",marginTop:10}}><input name="published" type="checkbox"/> نشر فورًا</label><button style={{marginTop:12,width:"100%",padding:11,border:0,borderRadius:10,background:"#4f46e5",color:"#fff",fontWeight:800}}>إضافة الوحدة</button></form>
      <form style={box} onSubmit={(e) => { e.preventDefault(); const f=new FormData(e.currentTarget); void add("lesson", { unitId:f.get("unitId"), title:f.get("title"), description:f.get("description"), videoUrl:f.get("videoUrl"), duration:Number(f.get("duration")||0)||null, order:Number(f.get("order")||0), isPublished:f.get("published")==="on" }); e.currentTarget.reset(); }}><h2 style={{marginTop:0}}>🎥 محاضرة / فيديو</h2><select name="unitId" required style={input}><option value="">اختر الوحدة</option>{allUnits.map(u=><option key={u.id} value={u.id}>{u.courseTitle} — {u.title}</option>)}</select><input name="title" placeholder="عنوان المحاضرة" required style={input}/><input name="videoUrl" placeholder="رابط الفيديو" style={input}/><input name="duration" type="number" placeholder="المدة بالدقائق" style={input}/><input name="order" type="number" placeholder="الترتيب" style={input}/><textarea name="description" placeholder="وصف المحاضرة" style={{...input,minHeight:60}}/><label style={{display:"block",marginTop:10}}><input name="published" type="checkbox"/> نشر فورًا</label><button style={{marginTop:12,width:"100%",padding:11,border:0,borderRadius:10,background:"#059669",color:"#fff",fontWeight:800}}>إضافة المحاضرة</button></form>
      <form style={box} onSubmit={(e) => { e.preventDefault(); const f=new FormData(e.currentTarget); void add("assignment", { lessonId:f.get("lessonId"), title:f.get("title"), description:f.get("description"), totalPoints:Number(f.get("totalPoints")||0), deadline:f.get("deadline") || null, isPublished:f.get("published")==="on" }); e.currentTarget.reset(); }}><h2 style={{marginTop:0}}>📝 واجب جديد</h2><select name="lessonId" required style={input}><option value="">اختر المحاضرة</option>{allLessons.map(l=><option key={l.id} value={l.id}>{l.courseTitle} — {l.unitTitle} — {l.title}</option>)}</select><input name="title" placeholder="عنوان الواجب" required style={input}/><textarea name="description" placeholder="وصف الواجب" style={{...input,minHeight:60}}/><input name="totalPoints" type="number" placeholder="إجمالي الدرجات" style={input}/><input name="deadline" type="datetime-local" style={input}/><label style={{display:"block",marginTop:10}}><input name="published" type="checkbox"/> نشر فورًا</label><button style={{marginTop:12,width:"100%",padding:11,border:0,borderRadius:10,background:"#7c3aed",color:"#fff",fontWeight:800}}>إضافة الواجب</button></form>
      <form style={box} onSubmit={(e) => { e.preventDefault(); const f=new FormData(e.currentTarget); void add("exam", { unitId:f.get("unitId"), title:f.get("title"), description:f.get("description"), totalPoints:Number(f.get("totalPoints")||0), duration:Number(f.get("duration")||0)||null, startsAt:f.get("startsAt") || null, endsAt:f.get("endsAt") || null, isPublished:f.get("published")==="on" }); e.currentTarget.reset(); }}><h2 style={{marginTop:0}}>🧪 اختبار جديد</h2><select name="unitId" required style={input}><option value="">اختر الوحدة</option>{allUnits.map(u=><option key={u.id} value={u.id}>{u.courseTitle} — {u.title}</option>)}</select><input name="title" placeholder="عنوان الاختبار" required style={input}/><textarea name="description" placeholder="وصف الاختبار" style={{...input,minHeight:60}}/><input name="totalPoints" type="number" placeholder="إجمالي الدرجات" style={input}/><input name="duration" type="number" placeholder="المدة بالدقائق" style={input}/><input name="startsAt" type="datetime-local" style={input}/><input name="endsAt" type="datetime-local" style={input}/><label style={{display:"block",marginTop:10}}><input name="published" type="checkbox"/> نشر فورًا</label><button style={{marginTop:12,width:"100%",padding:11,border:0,borderRadius:10,background:"#dc2626",color:"#fff",fontWeight:800}}>إضافة الاختبار</button></form>
      <form style={box} onSubmit={(e) => { e.preventDefault(); const f=new FormData(e.currentTarget); void add("question", { kind:f.get("kind"), parentId:f.get("parentId"), question:f.get("question"), optionA:f.get("optionA"), optionB:f.get("optionB"), optionC:f.get("optionC"), optionD:f.get("optionD"), correctAnswer:f.get("correctAnswer"), points:Number(f.get("points")||1), order:Number(f.get("order")||0) }); e.currentTarget.reset(); }}><h2 style={{marginTop:0}}>❓ سؤال جديد</h2><select name="kind" required style={input}><option value="assignment">سؤال واجب</option><option value="exam">سؤال اختبار</option></select><select name="parentId" required style={input}><option value="">اختر التقييم</option>{allAssignments.map(a=><option key={`a-${a.id}`} value={a.id}>واجب: {a.title}</option>)}{allExams.map(x=><option key={`e-${x.id}`} value={x.id}>اختبار: {x.title}</option>)}</select><textarea name="question" placeholder="نص السؤال" required style={{...input,minHeight:70}}/><input name="optionA" placeholder="الاختيار A" required style={input}/><input name="optionB" placeholder="الاختيار B" required style={input}/><input name="optionC" placeholder="الاختيار C" required style={input}/><input name="optionD" placeholder="الاختيار D" required style={input}/><input name="correctAnswer" placeholder="الإجابة الصحيحة (بنفس نص الاختيار)" required style={input}/><input name="points" type="number" placeholder="الدرجة" style={input}/><input name="order" type="number" placeholder="الترتيب" style={input}/><button style={{marginTop:12,width:"100%",padding:11,border:0,borderRadius:10,background:"#0f766e",color:"#fff",fontWeight:800}}>إضافة السؤال</button></form>
      <form style={box} onSubmit={(e) => { e.preventDefault(); const f=new FormData(e.currentTarget); void add("file", { lessonId:f.get("lessonId"), name:f.get("name"), url:f.get("url"), type:f.get("type") }); e.currentTarget.reset(); }}><h2 style={{marginTop:0}}>📎 ملف للمحاضرة</h2><select name="lessonId" required style={input}><option value="">اختر المحاضرة</option>{allUnits.flatMap(u=>u.lessons.map(l=><option key={l.id} value={l.id}>{u.courseTitle} — {u.title} — {l.title}</option>))}</select><input name="name" placeholder="اسم الملف" required style={input}/><input name="url" placeholder="رابط الملف" required style={input}/><input name="type" placeholder="PDF / DOCX / ..." style={input}/><button style={{marginTop:12,width:"100%",padding:11,border:0,borderRadius:10,background:"#d97706",color:"#fff",fontWeight:800}}>إضافة الملف</button></form>
    </section>

    <section style={{ ...box, marginTop: 20 }}><h2 style={{marginTop:0}}>📚 المحتوى الحالي</h2>{courses.length===0 ? <p>لا توجد كورسات بعد.</p> : courses.map(course=><div key={course.id} style={{border:"1px solid #eaecf0",borderRadius:16,padding:15,marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}><div><strong>{course.title}</strong><div style={{fontSize:12,color:"#667085",marginTop:4}}>{course.grade || "بدون صف"}</div></div><div style={{display:"flex",gap:7}}><button onClick={()=>void toggle("course",course.id,course.isPublished)} style={{border:0,borderRadius:9,padding:"7px 10px",cursor:"pointer"}}>{course.isPublished?"إخفاء":"نشر"}</button><button onClick={()=>void remove("course",course.id)} style={{border:0,borderRadius:9,padding:"7px 10px",background:"#fee4e2",color:"#b42318",cursor:"pointer"}}>حذف</button></div></div>{course.units.map(unit=><div key={unit.id} style={{marginTop:12,padding:12,background:"#f8fafc",borderRadius:13}}><div style={{display:"flex",justifyContent:"space-between",gap:8}}><strong>📖 {unit.title}</strong><button onClick={()=>void toggle("unit",unit.id,unit.isPublished)} style={{border:0,borderRadius:8,padding:"5px 8px"}}>{unit.isPublished?"إخفاء":"نشر"}</button></div>{unit.lessons.map(lesson=><div key={lesson.id} style={{marginTop:9,padding:10,background:"#fff",borderRadius:11,border:"1px solid #eaecf0"}}><div style={{display:"flex",justifyContent:"space-between",gap:8}}><span>🎥 {lesson.title}</span><div><button onClick={()=>void toggle("lesson",lesson.id,lesson.isPublished)} style={{border:0,borderRadius:7,padding:"4px 7px"}}>{lesson.isPublished?"إخفاء":"نشر"}</button> <button onClick={()=>void remove("lesson",lesson.id)} style={{border:0,borderRadius:7,padding:"4px 7px",background:"#fee4e2",color:"#b42318"}}>حذف</button></div></div><div style={{fontSize:12,color:"#667085",marginTop:5}}>{lesson.videoUrl || "لا يوجد فيديو"} · ملفات: {lesson.files.length} · واجبات: {lesson.assignments.length}</div></div>)}</div>)}</div>)}</section>
      <section style={{ ...box, marginTop: 20 }}><h2 style={{marginTop:0}}>📝 الاختبارات والواجبات الحالية</h2>{allAssignments.map(a=><div key={`assignment-${a.id}`} style={{padding:12,borderBottom:"1px solid #eaecf0",display:"flex",justifyContent:"space-between",gap:8}}><span>📝 {a.title} · أسئلة: {a.questions.length}</span><button onClick={()=>void remove("assignment",a.id)} style={{border:0,borderRadius:8,padding:"5px 9px",background:"#fee4e2",color:"#b42318"}}>حذف</button></div>)}{allExams.map(x=><div key={`exam-${x.id}`} style={{padding:12,borderBottom:"1px solid #eaecf0",display:"flex",justifyContent:"space-between",gap:8}}><span>🧪 {x.title} · أسئلة: {x.questions.length}</span><button onClick={()=>void remove("exam",x.id)} style={{border:0,borderRadius:8,padding:"5px 9px",background:"#fee4e2",color:"#b42318"}}>حذف</button></div>)}</section>
    </div>
  </main>;
}
