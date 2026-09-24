"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type LessonData = {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  duration: number | null;

  unit: {
    id: string;
    title: string;
  };

  course: {
    id: string;
    title: string;
    grade: string | null;
    subject: string;
  };

  files: {
    id: string;
    name: string;
    url: string;
    type: string | null;
  }[];

  assignments: {
    id: string;
    title: string;
    description: string | null;
    totalPoints: number;
    deadline: string | null;
  }[];
};

type Props = {
  lesson: LessonData;
};

function formatDuration(minutes: number | null) {
  if (!minutes || minutes <= 0) {
    return "غير محددة";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0 && remainingMinutes > 0) {
    return `${hours} ساعة و ${remainingMinutes} دقيقة`;
  }

  if (hours > 0) {
    return `${hours} ساعة`;
  }

  return `${remainingMinutes} دقيقة`;
}

function getFileLabel(type: string | null, name: string) {
  const value = `${type ?? ""} ${name}`.toLowerCase();

  if (value.includes("pdf") || value.endsWith(".pdf")) {
    return "PDF";
  }

  if (
    value.includes("word") ||
    value.endsWith(".doc") ||
    value.endsWith(".docx")
  ) {
    return "DOC";
  }

  if (
    value.includes("excel") ||
    value.endsWith(".xls") ||
    value.endsWith(".xlsx")
  ) {
    return "XLS";
  }

  if (
    value.includes("image") ||
    value.endsWith(".png") ||
    value.endsWith(".jpg") ||
    value.endsWith(".jpeg")
  ) {
    return "IMG";
  }

  return "FILE";
}

function getYoutubeEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtube.com")) {
      if (parsedUrl.pathname === "/watch") {
        const videoId = parsedUrl.searchParams.get("v");

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      if (parsedUrl.pathname.startsWith("/embed/")) {
        return url;
      }
    }

    if (parsedUrl.hostname === "youtu.be") {
      const videoId = parsedUrl.pathname.replace("/", "");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export default function LessonClient({ lesson }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const youtubeUrl = useMemo(() => {
    if (!lesson.videoUrl) {
      return null;
    }

    return getYoutubeEmbedUrl(lesson.videoUrl);
  }, [lesson.videoUrl]);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f6f8fc] text-[#172033]"
    >
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#14213d] shadow-lg">
              <span className="text-xl font-black text-[#d9ad55]">
                أ
              </span>
            </div>

            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-500">
                منصة تعليمية
              </div>

              <div className="text-lg font-black text-[#14213d]">
                أ/ عمرو موسى
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              href="/dashboard"
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-[#14213d]"
            >
              الرئيسية
            </Link>

            <Link
              href="/courses"
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-[#14213d]"
            >
              الكورسات
            </Link>

            <Link
              href="/lessons"
              className="rounded-xl bg-[#14213d] px-4 py-2.5 text-sm font-bold text-white"
            >
              الدروس
            </Link>

            <Link
              href="/assignments"
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-[#14213d]"
            >
              الواجبات
            </Link>

            <Link
              href="/exams"
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-[#14213d]"
            >
              الاختبارات
            </Link>

            <Link
              href="/results"
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-[#14213d]"
            >
              النتائج
            </Link>
          </nav>

          {/* Account */}
          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-[#d9ad55] sm:flex"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14213d] text-sm font-black text-[#d9ad55]">
                ط
              </div>

              <div className="text-right">
                <div className="text-[11px] text-slate-500">
                  حساب الطالب
                </div>

                <div className="text-sm font-black text-[#14213d]">
                  الملف الشخصي
                </div>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg shadow-sm lg:hidden"
              aria-label="فتح القائمة"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
            <div className="mx-auto grid max-w-[1500px] gap-2">
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 font-bold text-slate-700 hover:bg-slate-100"
              >
                الرئيسية
              </Link>

              <Link
                href="/courses"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 font-bold text-slate-700 hover:bg-slate-100"
              >
                الكورسات
              </Link>

              <Link
                href="/lessons"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl bg-slate-100 px-4 py-3 font-black text-[#14213d]"
              >
                الدروس
              </Link>

              <Link
                href="/assignments"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 font-bold text-slate-700 hover:bg-slate-100"
              >
                الواجبات
              </Link>

              <Link
                href="/exams"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 font-bold text-slate-700 hover:bg-slate-100"
              >
                الاختبارات
              </Link>

              <Link
                href="/results"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 font-bold text-slate-700 hover:bg-slate-100"
              >
                النتائج
              </Link>

              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 font-bold text-slate-700 hover:bg-slate-100"
              >
                الملف الشخصي
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ================= PAGE ================= */}
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link
            href="/dashboard"
            className="transition hover:text-[#14213d]"
          >
            الرئيسية
          </Link>

          <span>←</span>

          <Link
            href="/courses"
            className="transition hover:text-[#14213d]"
          >
            الكورسات
          </Link>

          <span>←</span>

          <Link
            href={`/courses/${lesson.course.id}`}
            className="max-w-[250px] truncate transition hover:text-[#14213d]"
          >
            {lesson.course.title}
          </Link>

          <span>←</span>

          <span className="max-w-[250px] truncate font-black text-[#14213d]">
            {lesson.title}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">

          {/* ================= MAIN ================= */}
          <section className="min-w-0">

            {/* Lesson Hero */}
            <div className="relative mb-6 overflow-hidden rounded-[30px] bg-[#14213d] shadow-[0_20px_70px_rgba(20,33,61,0.16)]">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#d9ad55]/10 blur-3xl" />
              <div className="absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

              <div className="relative p-6 sm:p-8 lg:p-10">
                <div className="mb-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-[#f0d18e]">
                    {lesson.course.subject}
                  </span>

                  {lesson.course.grade && (
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/75">
                      {lesson.course.grade}
                    </span>
                  )}

                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/75">
                    {lesson.unit.title}
                  </span>
                </div>

                <h1 className="max-w-4xl text-2xl font-black leading-[1.35] text-white sm:text-3xl lg:text-4xl">
                  {lesson.title}
                </h1>

                {lesson.description && (
                  <p className="mt-4 max-w-3xl text-sm leading-8 text-white/70 sm:text-base">
                    {lesson.description}
                  </p>
                )}

                <div className="mt-7 flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3">
                    <span className="text-[#d9ad55]">
                      ◷
                    </span>

                    <span className="text-sm font-bold text-white">
                      {formatDuration(lesson.duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3">
                    <span className="text-[#d9ad55]">
                      ▱
                    </span>

                    <span className="text-sm font-bold text-white">
                      {lesson.files.length} ملفات
                    </span>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3">
                    <span className="text-[#d9ad55]">
                      ✓
                    </span>

                    <span className="text-sm font-bold text-white">
                      {lesson.assignments.length} واجبات
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Video */}
            <div className="mb-6 overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(20,33,61,0.07)]">
              <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-[#14213d]">
                      شرح الدرس
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      شاهد شرح الدرس من هنا.
                    </p>
                  </div>

                  <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-[#14213d] text-[#d9ad55] sm:flex">
                    ▶
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {lesson.videoUrl ? (
                  youtubeUrl ? (
                    <div className="overflow-hidden rounded-2xl bg-black">
                      <div className="aspect-video">
                        <iframe
                          src={youtubeUrl}
                          title={lesson.title}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="mb-2 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#14213d] text-[#d9ad55]">
                              ▶
                            </div>

                            <h3 className="font-black text-[#14213d]">
                              فيديو الدرس
                            </h3>
                          </div>

                          <p className="text-sm leading-7 text-slate-500">
                            الفيديو متاح ويمكن فتحه من الزر التالي.
                          </p>
                        </div>

                        <a
                          href={lesson.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-xl bg-[#14213d] px-6 py-3 text-sm font-black text-white transition hover:bg-[#1d3158]"
                        >
                          فتح الفيديو
                        </a>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                    <div>
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                        ▶
                      </div>

                      <h3 className="font-black text-[#14213d]">
                        الفيديو غير متاح حاليًا
                      </h3>

                      <p className="mt-2 text-sm leading-7 text-slate-500">
                        سيتم إضافة فيديو الشرح من لوحة الإدارة.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {lesson.description && (
              <div className="mb-6 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(20,33,61,0.06)] sm:p-7">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#14213d] text-[#d9ad55]">
                    i
                  </div>

                  <div>
                    <h2 className="font-black text-[#14213d]">
                      عن الدرس
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      معلومات عن محتوى الدرس
                    </p>
                  </div>
                </div>

                <p className="leading-9 text-slate-600">
                  {lesson.description}
                </p>
              </div>
            )}

            {/* Files */}
            <div className="mb-6 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(20,33,61,0.06)] sm:p-7">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#14213d]">
                    ملفات الدرس
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    الملفات والمذكرات الخاصة بالدرس.
                  </p>
                </div>

                <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-[#f7f3ea] px-3 text-sm font-black text-[#9a7328]">
                  {lesson.files.length}
                </div>
              </div>

              {lesson.files.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {lesson.files.map((file) => (
                    <a
                      key={file.id}
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-[#d9ad55] hover:bg-white hover:shadow-lg"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#14213d] text-[10px] font-black text-[#d9ad55]">
                        {getFileLabel(file.type, file.name)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-black text-[#14213d]">
                          {file.name}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          اضغط لفتح الملف
                        </p>
                      </div>

                      <span className="text-lg text-slate-400 transition group-hover:text-[#d9ad55]">
                        ←
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
                    ▱
                  </div>

                  <h3 className="font-black text-[#14213d]">
                    لا توجد ملفات مرفقة
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    لم تتم إضافة ملفات لهذا الدرس حتى الآن.
                  </p>
                </div>
              )}
            </div>

            {/* Assignments */}
            <div className="mb-6 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(20,33,61,0.06)] sm:p-7">
              <div className="mb-6">
                <h2 className="text-xl font-black text-[#14213d]">
                  واجبات الدرس
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  الواجبات المرتبطة بهذا الدرس.
                </p>
              </div>

              {lesson.assignments.length > 0 ? (
                <div className="space-y-3">
                  {lesson.assignments.map((assignment) => (
                    <Link
                      key={assignment.id}
                      href={`/assignments/${assignment.id}`}
                      className="group block rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-[#d9ad55] hover:bg-white hover:shadow-lg"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#14213d] text-[#d9ad55]">
                          ✓
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <h3 className="font-black text-[#14213d]">
                                {assignment.title}
                              </h3>

                              {assignment.description && (
                                <p className="mt-1 line-clamp-2 text-sm leading-7 text-slate-500">
                                  {assignment.description}
                                </p>
                              )}
                            </div>

                            <span className="shrink-0 self-start rounded-xl bg-[#14213d] px-4 py-2.5 text-xs font-black text-white">
                              فتح الواجب
                            </span>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-600">
                              {assignment.totalPoints} درجة
                            </span>

                            {assignment.deadline && (
                              <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-600">
                                التسليم:{" "}
                                {new Date(
                                  assignment.deadline,
                                ).toLocaleDateString("ar-EG")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
                    ✓
                  </div>

                  <h3 className="font-black text-[#14213d]">
                    لا توجد واجبات حاليًا
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    سيتم إضافة الواجب من لوحة الإدارة عند توفره.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Navigation */}
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href={`/courses/${lesson.course.id}`}
                className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-[#14213d] shadow-sm transition hover:border-[#d9ad55] hover:shadow-md"
              >
                العودة إلى الكورس
              </Link>

              <Link
                href="/lessons"
                className="flex items-center justify-center rounded-2xl bg-[#14213d] px-5 py-4 text-sm font-black text-white shadow-lg shadow-slate-900/10 transition hover:bg-[#1d3158]"
              >
                كل الدروس
              </Link>
            </div>
          </section>

          {/* ================= SIDEBAR ================= */}
          <aside className="space-y-5">

            {/* Course */}
            <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(20,33,61,0.06)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#14213d] text-[#d9ad55]">
                  أ
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-500">
                    الكورس الحالي
                  </div>

                  <div className="truncate font-black text-[#14213d]">
                    {lesson.course.title}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <div className="text-xs text-slate-500">
                    المادة
                  </div>

                  <div className="mt-1 text-sm font-black text-[#14213d]">
                    {lesson.course.subject}
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <div className="text-xs text-slate-500">
                    الوحدة
                  </div>

                  <div className="mt-1 text-sm font-black text-[#14213d]">
                    {lesson.unit.title}
                  </div>
                </div>

                {lesson.course.grade && (
                  <div className="rounded-xl bg-slate-50 px-4 py-3">
                    <div className="text-xs text-slate-500">
                      الصف الدراسي
                    </div>

                    <div className="mt-1 text-sm font-black text-[#14213d]">
                      {lesson.course.grade}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href={`/courses/${lesson.course.id}`}
                className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#14213d] px-4 py-3 text-sm font-black text-white transition hover:bg-[#1d3158]"
              >
                عرض الكورس
              </Link>
            </div>

            {/* Lesson Information */}
            <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(20,33,61,0.06)]">
              <h3 className="mb-4 font-black text-[#14213d]">
                معلومات الدرس
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-xs text-slate-500">
                    المدة
                  </span>

                  <span className="text-sm font-black text-[#14213d]">
                    {formatDuration(lesson.duration)}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-xs text-slate-500">
                    الملفات
                  </span>

                  <span className="text-sm font-black text-[#14213d]">
                    {lesson.files.length}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-xs text-slate-500">
                    الواجبات
                  </span>

                  <span className="text-sm font-black text-[#14213d]">
                    {lesson.assignments.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Learning Advice */}
            <div className="rounded-[30px] border border-[#ead9b5] bg-[#fffaf0] p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#14213d] text-lg text-[#d9ad55]">
                ★
              </div>

              <h3 className="font-black text-[#14213d]">
                نصيحة للطالب
              </h3>

              <p className="mt-2 text-sm leading-8 text-slate-600">
                ركز في الشرح، وبعد الانتهاء راجع الملفات وحل الواجب
                المرتبط بالدرس لتثبيت المعلومات.
              </p>
            </div>

            {/* Support */}
            <div className="overflow-hidden rounded-[30px] bg-[#14213d] p-6 text-white shadow-[0_18px_60px_rgba(20,33,61,0.16)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl text-[#d9ad55]">
                ?
              </div>

              <h3 className="text-lg font-black">
                محتاج مساعدة؟
              </h3>

              <p className="mt-2 text-sm leading-8 text-white/65">
                لو واجهتك مشكلة في الدرس أو الملفات أو الواجب، تقدر
                تتواصل مع الدعم.
              </p>

              <Link
                href="/support"
                className="mt-5 flex items-center justify-center rounded-xl bg-[#d9ad55] px-4 py-3 text-sm font-black text-[#14213d] transition hover:bg-[#e7c477]"
              >
                تواصل مع الدعم
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-4 py-8 text-center sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:text-right">
          <div>
            <div className="font-black text-[#14213d]">
              منصة أ/ عمرو موسى
            </div>

            <div className="mt-1 text-xs text-slate-500">
              منصة تعليمية متخصصة في اللغة العربية.
            </div>
          </div>

          <div className="text-xs text-slate-400">
            جميع الحقوق محفوظة © {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </main>
  );
}