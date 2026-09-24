"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Lesson = {
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
  filesCount: number;
  assignmentsCount: number;
};

type LessonsClientProps = {
  lessons: Lesson[];
};

export default function LessonsClient({
  lessons,
}: LessonsClientProps) {
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState("الكل");
  const [course, setCourse] = useState("الكل");

  const grades = useMemo(() => {
    const values = lessons
      .map((lesson) => lesson.course.grade)
      .filter((value): value is string => Boolean(value));

    return ["الكل", ...Array.from(new Set(values))];
  }, [lessons]);

  const courses = useMemo(() => {
    return [
      "الكل",
      ...Array.from(
        new Set(lessons.map((lesson) => lesson.course.title))
      ),
    ];
  }, [lessons]);

  const filteredLessons = useMemo(() => {
    const query = search.trim().toLowerCase();

    return lessons.filter((lesson) => {
      const text = [
        lesson.title,
        lesson.description ?? "",
        lesson.unit.title,
        lesson.course.title,
        lesson.course.grade ?? "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        query.length === 0 || text.includes(query);

      const matchesGrade =
        grade === "الكل" || lesson.course.grade === grade;

      const matchesCourse =
        course === "الكل" || lesson.course.title === course;

      return matchesSearch && matchesGrade && matchesCourse;
    });
  }, [lessons, search, grade, course]);

  const totalDuration = useMemo(() => {
    return lessons.reduce(
      (total, lesson) => total + (lesson.duration ?? 0),
      0
    );
  }, [lessons]);

  function formatDuration(minutes: number | null) {
    if (!minutes) {
      return "غير محدد";
    }

    if (minutes < 60) {
      return `${minutes} دقيقة`;
    }

    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;

    if (remaining === 0) {
      return `${hours} ساعة`;
    }

    return `${hours} س ${remaining} د`;
  }

  function formatTotalDuration(minutes: number) {
    if (!minutes) {
      return "—";
    }

    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;

    if (hours === 0) {
      return `${remaining} دقيقة`;
    }

    if (remaining === 0) {
      return `${hours} ساعة`;
    }

    return `${hours} ساعة و ${remaining} دقيقة`;
  }

  function resetFilters() {
    setSearch("");
    setGrade("الكل");
    setCourse("الكل");
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f6f8fc] text-slate-900"
    >
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0f172a] text-lg font-black text-[#d4af37]">
              أ
            </div>

            <div>
              <div className="text-base font-black text-[#0f172a] sm:text-lg">
                منصة أ/ عمرو موسى
              </div>

              <div className="text-xs font-semibold text-slate-500">
                اللغة العربية
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <NavLink href="/dashboard">الرئيسية</NavLink>
            <NavLink href="/courses">الكورسات</NavLink>
            <NavLink href="/lessons" active>
              الدروس
            </NavLink>
            <NavLink href="/assignments">الواجبات</NavLink>
            <NavLink href="/exams">الاختبارات</NavLink>
            <NavLink href="/results">النتائج</NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/notifications"
              className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-[#d4af37] hover:text-[#b18b1e] sm:flex"
            >
              <BellIcon />
            </Link>

            <Link
              href="/profile"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f172a] text-sm font-black text-white"
            >
              ع
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="border-b border-slate-200 bg-white lg:hidden">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3">
          <MobileNavLink href="/dashboard">
            الرئيسية
          </MobileNavLink>

          <MobileNavLink href="/courses">
            الكورسات
          </MobileNavLink>

          <MobileNavLink href="/lessons" active>
            الدروس
          </MobileNavLink>

          <MobileNavLink href="/assignments">
            الواجبات
          </MobileNavLink>

          <MobileNavLink href="/exams">
            الاختبارات
          </MobileNavLink>
        </div>
      </div>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500">
          <Link
            href="/dashboard"
            className="transition hover:text-[#b18b1e]"
          >
            الرئيسية
          </Link>

          <ChevronIcon />

          <span className="text-slate-800">الدروس</span>
        </div>

        {/* Hero */}
        <div className="relative overflow-hidden rounded-[30px] bg-[#0f172a] p-6 text-white shadow-xl sm:p-8 lg:p-10">
          <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-[#d4af37]/10 blur-3xl" />

          <div className="absolute -bottom-24 right-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-2 text-xs font-black text-[#e5c65b]">
                <BookIcon />
                المحتوى التعليمي
              </div>

              <h1 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                دروس اللغة العربية
                <span className="mt-2 block text-[#d4af37]">
                  بطريقة منظمة وواضحة
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-slate-300 sm:text-base">
                اختار الدرس الذي تريد مذاكرته، وشاهد الشرح
                والوحدات والملفات والواجبات المرتبطة به من مكان
                واحد.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Stat
                  icon={<BookIcon />}
                  value={lessons.length}
                  label="درس"
                />

                <Stat
                  icon={<FolderIcon />}
                  value={courses.length - 1}
                  label="كورس"
                />

                <Stat
                  icon={<ClockIcon />}
                  value={formatTotalDuration(totalDuration)}
                  label="إجمالي المدة"
                />
              </div>
            </div>

            <div className="hidden h-36 w-36 items-center justify-center rounded-[32px] border border-white/10 bg-white/5 lg:flex">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37]">
                <BookOpenIcon />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-7 rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_190px_220px_auto]">
            <div>
              <label className="mb-2 block text-sm font-black text-slate-800">
                البحث
              </label>

              <div className="relative">
                <SearchIcon />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  type="text"
                  placeholder="ابحث عن درس أو وحدة..."
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pr-11 pl-4 text-sm font-semibold outline-none transition focus:border-[#d4af37] focus:bg-white focus:ring-4 focus:ring-[#d4af37]/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-slate-800">
                الصف الدراسي
              </label>

              <select
                value={grade}
                onChange={(event) =>
                  setGrade(event.target.value)
                }
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#d4af37]"
              >
                {grades.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-slate-800">
                الكورس
              </label>

              <select
                value={course}
                onChange={(event) =>
                  setCourse(event.target.value)
                }
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#d4af37]"
              >
                {courses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={resetFilters}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-600 transition hover:border-[#d4af37] hover:text-[#a47e11] lg:w-auto"
              >
                إعادة ضبط
              </button>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="mt-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="text-sm font-black text-[#b18b1e]">
              المحتوى المتاح
            </div>

            <h2 className="mt-1 text-2xl font-black text-[#0f172a]">
              الدروس
            </h2>
          </div>

          <div className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-500 shadow-sm ring-1 ring-slate-200">
            تم العثور على{" "}
            <span className="font-black text-[#0f172a]">
              {filteredLessons.length}
            </span>{" "}
            درس
          </div>
        </div>

        {/* Lessons Grid */}
        {filteredLessons.length > 0 ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredLessons.map((lesson, index) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                index={index}
                duration={formatDuration(lesson.duration)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-[26px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <SearchLargeIcon />
            </div>

            <h3 className="mt-5 text-xl font-black text-slate-900">
              لا توجد دروس مطابقة
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-7 text-slate-500">
              جرّب تغيير كلمة البحث أو الفلاتر للوصول إلى
              المحتوى المطلوب.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 rounded-2xl bg-[#0f172a] px-6 py-3 text-sm font-black text-white"
            >
              عرض كل الدروس
            </button>
          </div>
        )}

        {/* Tip */}
        <div className="mt-10 rounded-[26px] border border-[#d4af37]/20 bg-[#fffdf5] p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#d4af37]/15 text-[#a47e11]">
              <LightBulbIcon />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                نصيحة للمذاكرة
              </h3>

              <p className="mt-1 text-sm font-semibold leading-7 text-slate-600">
                شاهد الدرس بتركيز، وراجع الملفات المرفقة،
                وبعدها حل الواجب المرتبط بالدرس لتثبيت
                المعلومات.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-10 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-7 text-center sm:px-6 md:flex-row md:items-center md:justify-between md:text-right lg:px-8">
          <div>
            <div className="font-black text-[#0f172a]">
              منصة أ/ عمرو موسى
            </div>

            <div className="mt-1 text-xs font-semibold text-slate-400">
              منصة تعليمية للغة العربية
            </div>
          </div>

          <div className="text-xs font-semibold text-slate-400">
            جميع الحقوق محفوظة © {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Lesson Card                                                                */
/* -------------------------------------------------------------------------- */

function LessonCard({
  lesson,
  index,
  duration,
}: {
  lesson: Lesson;
  index: number;
  duration: string;
}) {
  return (
    <article className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#d4af37]/40 hover:shadow-xl">
      <div className="relative overflow-hidden bg-[#0f172a] p-5">
        <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#d4af37]/10 blur-2xl" />

        <div className="relative flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d4af37] text-sm font-black text-[#0f172a]">
            {String(index + 1).padStart(2, "0")}
          </div>

          <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-black text-emerald-300">
            متاح
          </div>
        </div>

        <div className="relative mt-6">
          <div className="text-xs font-bold text-[#d4af37]">
            {lesson.course.subject}
          </div>

          <h3 className="mt-2 min-h-[56px] text-lg font-black leading-7 text-white">
            {lesson.title}
          </h3>
        </div>
      </div>

      <div className="p-5">
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="text-[#b18b1e]">
              <FolderIcon />
            </div>

            <div className="min-w-0">
              <div className="text-[11px] font-bold text-slate-400">
                الوحدة
              </div>

              <div className="mt-1 truncate text-sm font-black text-slate-800">
                {lesson.unit.title}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 min-h-[48px] line-clamp-2 text-sm font-semibold leading-6 text-slate-500">
          {lesson.description ||
            "درس منظم ضمن محتوى كورس اللغة العربية."}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <InfoItem
            icon={<ClockIcon />}
            value={duration}
          />

          <InfoItem
            icon={<FileIcon />}
            value={`${lesson.filesCount} ملف`}
          />

          <InfoItem
            icon={<AssignmentIcon />}
            value={`${lesson.assignmentsCount} واجب`}
          />
        </div>

        <Link
          href={`/courses/${lesson.course.id}/lesson/${lesson.id}`}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#0f172a] text-sm font-black text-white transition hover:bg-[#1e293b]"
        >
          مشاهدة الدرس
          <ArrowIcon />
        </Link>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Small Components                                                           */
/* -------------------------------------------------------------------------- */

function NavLink({
  href,
  children,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
        active
          ? "bg-[#0f172a] text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-[#0f172a]"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-xl px-4 py-2 text-xs font-black ${
        active
          ? "bg-[#0f172a] text-white"
          : "bg-slate-50 text-slate-600"
      }`}
    >
      {children}
    </Link>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="text-[#d4af37]">{icon}</div>

      <div>
        <div className="text-sm font-black text-white">
          {value}
        </div>

        <div className="text-[11px] font-semibold text-slate-400">
          {label}
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-2 text-center">
      <div className="flex justify-center text-slate-400">
        {icon}
      </div>

      <div className="mt-1 truncate text-[10px] font-bold text-slate-500">
        {value}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

function SearchIcon() {
  return (
    <svg
      className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function SearchLargeIcon() {
  return (
    <svg
      className="h-7 w-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
      <path d="M4 5.5v16" />
    </svg>
  );
}

function BookOpenIcon() {
  return (
    <svg
      className="h-12 w-12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M2.5 5.5A2.5 2.5 0 0 1 5 3h5.5a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H5a2.5 2.5 0 0 0-2.5 2.5z" />
      <path d="M21.5 5.5A2.5 2.5 0 0 0 19 3h-5.5a3 3 0 0 0-3 3v14a3 3 0 0 1 3-3H19a2.5 2.5 0 0 1 2.5 2.5z" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2h8.5A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v5h4" />
    </svg>
  );
}

function AssignmentIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M7 4h10a2 2 0 0 1 2 2v15H5V6a2 2 0 0 1 2-2Z" />
      <path d="M9 4V2h6v2" />
      <path d="M9 10h6M9 14h6M9 18h4" />
    </svg>
  );
}

function LightBulbIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M8.5 14.5A6 6 0 1 1 15.5 14c-.8.7-1.5 1.5-1.5 3h-4c0-1.5-.7-2.2-1.5-2.5Z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}