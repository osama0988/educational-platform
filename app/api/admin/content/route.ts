import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

async function adminAccess() {
  const session = await auth();
  if (!session?.user?.id) return { error: NextResponse.json({ success: false, message: "يجب تسجيل الدخول أولًا." }, { status: 401 }) };
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true, status: true } });
  if (!user || user.role !== "ADMIN" || user.status !== "ACTIVE") return { error: NextResponse.json({ success: false, message: "غير مصرح لك." }, { status: 403 }) };
  return { ok: true };
}

export async function GET() {
  try {
    const access = await adminAccess();
    if (access.error) return access.error;
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        units: { orderBy: { order: "asc" }, include: {
          lessons: { orderBy: { order: "asc" }, include: { files: true, assignments: { include: { questions: true } } } },
          exams: { orderBy: { createdAt: "desc" }, include: { questions: true } },
        } },
      },
    });
    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error("Admin content GET error:", error);
    return NextResponse.json({ success: false, message: "تعذر تحميل المحتوى." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const access = await adminAccess();
    if (access.error) return access.error;
    const body = await request.json();
    const entity = body?.entity;

    if (entity === "course") {
      const title = String(body.title || "").trim();
      const grade = String(body.grade || "").trim();
      if (!title || !grade) return NextResponse.json({ success: false, message: "اسم الكورس والصف مطلوبان." }, { status: 400 });
      const course = await prisma.course.create({ data: { title, grade, subject: "اللغة العربية", description: String(body.description || "").trim() || null, imageUrl: String(body.imageUrl || "").trim() || null, isPublished: Boolean(body.isPublished) } });
      return NextResponse.json({ success: true, course }, { status: 201 });
    }

    if (entity === "unit") {
      const courseId = String(body.courseId || "");
      const title = String(body.title || "").trim();
      if (!courseId || !title) return NextResponse.json({ success: false, message: "الكورس واسم الوحدة مطلوبان." }, { status: 400 });
      const unit = await prisma.unit.create({ data: { courseId, title, description: String(body.description || "").trim() || null, order: Number.isInteger(body.order) ? body.order : 0, isPublished: Boolean(body.isPublished) } });
      return NextResponse.json({ success: true, unit }, { status: 201 });
    }

    if (entity === "lesson") {
      const unitId = String(body.unitId || "");
      const title = String(body.title || "").trim();
      if (!unitId || !title) return NextResponse.json({ success: false, message: "الوحدة واسم المحاضرة مطلوبان." }, { status: 400 });
      const lesson = await prisma.lesson.create({ data: { unitId, title, description: String(body.description || "").trim() || null, videoUrl: String(body.videoUrl || "").trim() || null, duration: Number.isInteger(body.duration) ? body.duration : null, order: Number.isInteger(body.order) ? body.order : 0, isPublished: Boolean(body.isPublished) } });
      return NextResponse.json({ success: true, lesson }, { status: 201 });
    }

    if (entity === "file") {
      const lessonId = String(body.lessonId || "");
      const name = String(body.name || "").trim();
      const url = String(body.url || "").trim();
      if (!lessonId || !name || !url) return NextResponse.json({ success: false, message: "اسم الملف والرابط والمحاضرة مطلوبة." }, { status: 400 });
      const file = await prisma.lessonFile.create({ data: { lessonId, name, url, type: String(body.type || "").trim() || null } });
      return NextResponse.json({ success: true, file }, { status: 201 });
    }

    if (entity === "assignment" || entity === "exam") {
      const title = String(body.title || "").trim();
      if (!title) return NextResponse.json({ success: false, message: "عنوان التقييم مطلوب." }, { status: 400 });
      if (entity === "assignment") {
        const assignment = await prisma.assignment.create({ data: { lessonId: body.lessonId ? String(body.lessonId) : null, title, description: String(body.description || "").trim() || null, totalPoints: Number.isInteger(body.totalPoints) ? body.totalPoints : 0, deadline: body.deadline ? new Date(body.deadline) : null, isPublished: Boolean(body.isPublished) } });
        return NextResponse.json({ success: true, assignment }, { status: 201 });
      }
      const exam = await prisma.exam.create({ data: { unitId: body.unitId ? String(body.unitId) : null, title, description: String(body.description || "").trim() || null, totalPoints: Number.isInteger(body.totalPoints) ? body.totalPoints : 0, duration: Number.isInteger(body.duration) ? body.duration : null, startsAt: body.startsAt ? new Date(body.startsAt) : null, endsAt: body.endsAt ? new Date(body.endsAt) : null, isPublished: Boolean(body.isPublished) } });
      return NextResponse.json({ success: true, exam }, { status: 201 });
    }

    if (entity === "question") {
      const kind = body.kind === "exam" ? "exam" : "assignment";
      const question = String(body.question || "").trim();
      const options = [body.optionA, body.optionB, body.optionC, body.optionD].map((x) => String(x || "").trim());
      const correctAnswer = String(body.correctAnswer || "").trim();
      if (!question || options.some((x) => !x) || !correctAnswer) return NextResponse.json({ success: false, message: "السؤال وكل الاختيارات والإجابة الصحيحة مطلوبة." }, { status: 400 });
      if (kind === "assignment") {
        const row = await prisma.assignmentQuestion.create({ data: { assignmentId: String(body.parentId), question, optionA: options[0], optionB: options[1], optionC: options[2], optionD: options[3], correctAnswer, points: Number.isInteger(body.points) ? body.points : 1, order: Number.isInteger(body.order) ? body.order : 0 } });
        return NextResponse.json({ success: true, question: row }, { status: 201 });
      }
      const row = await prisma.examQuestion.create({ data: { examId: String(body.parentId), question, optionA: options[0], optionB: options[1], optionC: options[2], optionD: options[3], correctAnswer, points: Number.isInteger(body.points) ? body.points : 1, order: Number.isInteger(body.order) ? body.order : 0 } });
      return NextResponse.json({ success: true, question: row }, { status: 201 });
    }

    return NextResponse.json({ success: false, message: "نوع المحتوى غير معروف." }, { status: 400 });
  } catch (error) {
    console.error("Admin content POST error:", error);
    return NextResponse.json({ success: false, message: "حدث خطأ أثناء إضافة المحتوى." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const access = await adminAccess();
    if (access.error) return access.error;
    const body = await request.json();
    const entity = body?.entity;
    const id = String(body?.id || "");
    if (!id) return NextResponse.json({ success: false, message: "المعرّف مطلوب." }, { status: 400 });

    if (entity === "course") {
      const row = await prisma.course.update({ where: { id }, data: { title: String(body.title || "").trim(), description: String(body.description || "").trim() || null, grade: String(body.grade || "").trim(), imageUrl: String(body.imageUrl || "").trim() || null, isPublished: Boolean(body.isPublished) } });
      return NextResponse.json({ success: true, row });
    }
    if (entity === "unit") {
      const row = await prisma.unit.update({ where: { id }, data: { title: String(body.title || "").trim(), description: String(body.description || "").trim() || null, order: Number.isInteger(body.order) ? body.order : 0, isPublished: Boolean(body.isPublished) } });
      return NextResponse.json({ success: true, row });
    }
    if (entity === "lesson") {
      const row = await prisma.lesson.update({ where: { id }, data: { title: String(body.title || "").trim(), description: String(body.description || "").trim() || null, videoUrl: String(body.videoUrl || "").trim() || null, duration: Number.isInteger(body.duration) ? body.duration : null, order: Number.isInteger(body.order) ? body.order : 0, isPublished: Boolean(body.isPublished) } });
      return NextResponse.json({ success: true, row });
    }
    if (entity === "file") {
      const row = await prisma.lessonFile.update({ where: { id }, data: { name: String(body.name || "").trim(), url: String(body.url || "").trim(), type: String(body.type || "").trim() || null } });
      return NextResponse.json({ success: true, row });
    }
    if (entity === "assignment") {
      const row = await prisma.assignment.update({ where: { id }, data: { title: String(body.title || "").trim(), description: String(body.description || "").trim() || null, totalPoints: Number.isInteger(body.totalPoints) ? body.totalPoints : 0, deadline: body.deadline ? new Date(body.deadline) : null, isPublished: Boolean(body.isPublished) } });
      return NextResponse.json({ success: true, row });
    }
    if (entity === "exam") {
      const row = await prisma.exam.update({ where: { id }, data: { title: String(body.title || "").trim(), description: String(body.description || "").trim() || null, totalPoints: Number.isInteger(body.totalPoints) ? body.totalPoints : 0, duration: Number.isInteger(body.duration) ? body.duration : null, startsAt: body.startsAt ? new Date(body.startsAt) : null, endsAt: body.endsAt ? new Date(body.endsAt) : null, isPublished: Boolean(body.isPublished) } });
      return NextResponse.json({ success: true, row });
    }
    return NextResponse.json({ success: false, message: "نوع المحتوى غير معروف." }, { status: 400 });
  } catch (error) {
    console.error("Admin content PATCH error:", error);
    return NextResponse.json({ success: false, message: "تعذر تحديث المحتوى." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const access = await adminAccess();
    if (access.error) return access.error;
    const body = await request.json();
    const entity = body?.entity;
    const id = String(body?.id || "");
    if (!id) return NextResponse.json({ success: false, message: "المعرّف مطلوب." }, { status: 400 });
    if (entity === "course") await prisma.course.delete({ where: { id } });
    else if (entity === "unit") await prisma.unit.delete({ where: { id } });
    else if (entity === "lesson") await prisma.lesson.delete({ where: { id } });
    else if (entity === "file") await prisma.lessonFile.delete({ where: { id } });
    else if (entity === "assignment") await prisma.assignment.delete({ where: { id } });
    else if (entity === "exam") await prisma.exam.delete({ where: { id } });
    else if (entity === "assignmentQuestion") await prisma.assignmentQuestion.delete({ where: { id } });
    else if (entity === "examQuestion") await prisma.examQuestion.delete({ where: { id } });
    else return NextResponse.json({ success: false, message: "نوع المحتوى غير معروف." }, { status: 400 });
    return NextResponse.json({ success: true, message: "تم الحذف بنجاح." });
  } catch (error) {
    console.error("Admin content DELETE error:", error);
    return NextResponse.json({ success: false, message: "تعذر الحذف. قد يكون العنصر مرتبطًا ببيانات أخرى." }, { status: 409 });
  }
}
