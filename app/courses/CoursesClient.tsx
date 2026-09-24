"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Course = {
  id: string;
  title: string;
  subtitle: string;
  grade: string;
  status: "مستمر" | "مكتمل" | "لم يبدأ";
  progress: number;
  units: number;
  lectures: number;
  completedLectures: number;
  duration: string;
  lastLesson: string;
  accent: string;
};

type CourseFromDatabase = {
  id: string;
  title: string;
  subtitle: string;
  grade: string;
  units: number;
  lectures: number;
};

type CoursesClientProps = {
  courses: CourseFromDatabase[];
};

const filters = ["الكل", "مستمرة", "لم تبدأ", "مكتملة"];

export default function CoursesClient({ courses }: CoursesClientProps) {
  const [activeFilter, setActiveFilter] = useState("الكل");
  const [search, setSearch] = useState("");

  const preparedCourses: Course[] = useMemo(() => {
    return courses.map((course) => {
      const grade = course.grade || "غير محدد";

      let accent = "الثانوي";

      if (grade.includes("الأول")) {
        accent = "الأولى";
      } else if (grade.includes("الثاني")) {
        accent = "الثانية";
      } else if (grade.includes("الثالث")) {
        accent = "الثالثة";
      }

      return {
        id: course.id,
        title: course.title,
        subtitle: course.subtitle,
        grade,
        status: "لم يبدأ",
        progress: 0,
        units: course.units,
        lectures: course.lectures,
        completedLectures: 0,
        duration: "—",
        lastLesson: "لم تبدأ الدراسة بعد",
        accent,
      };
    });
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const searchValue = search.trim();

    return preparedCourses.filter((course) => {
      const matchesSearch =
        course.title.includes(searchValue) ||
        course.grade.includes(searchValue) ||
        course.subtitle.includes(searchValue);

      const matchesFilter =
        activeFilter === "الكل" ||
        (activeFilter === "مستمرة" && course.status === "مستمر") ||
        (activeFilter === "لم تبدأ" && course.status === "لم يبدأ") ||
        (activeFilter === "مكتملة" && course.status === "مكتمل");

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, search, preparedCourses]);

  const totalLectures = preparedCourses.reduce(
    (total, course) => total + course.lectures,
    0
  );

  const totalCompletedLectures = preparedCourses.reduce(
    (total, course) => total + course.completedLectures,
    0
  );

  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f7fb] text-[#172033]">
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #f5f7fb;
        }

        ::selection {
          background: #d9b35b;
          color: #172033;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* ==================== SIDEBAR ==================== */}
      <aside className="fixed right-0 top-0 z-40 hidden h-screen w-[270px] border-l border-[#e8ebf1] bg-white xl:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-[88px] items-center border-b border-[#eef0f4] px-7">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#172033] shadow-[0_10px_25px_rgba(23,32,51,.16)]">
                <div className="absolute h-7 w-7 rounded-lg border-2 border-[#d9b35b]" />
                <span className="relative z-10 text-lg font-black text-[#d9b35b]">
                  ع
                </span>
              </div>

              <div>
                <div className="text-[15px] font-black text-[#172033]">
                  منصة أ/ عمرو موسى
                </div>
                <div className="mt-0.5 text-[11px] font-semibold text-[#8b93a3]">
                  منصة تعليمية متكاملة
                </div>
              </div>
            </Link>
          </div>

          {/* Student */}
          <div className="mx-5 mt-6 rounded-2xl bg-[#f7f8fa] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#172033] text-sm font-black text-[#d9b35b]">
                ط
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-[#172033]">
                  الطالب
                </p>
                <p className="mt-1 text-[11px] font-medium text-[#9299a8]">
                  طالب منصة أ/ عمرو موسى
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-7 flex-1 px-4">
            <p className="px-3 pb-3 text-[10px] font-black tracking-wider text-[#a4aab6]">
              القائمة الرئيسية
            </p>

            <div className="space-y-1.5">
              <SidebarItem href="/dashboard" icon="⌂" label="الرئيسية" />

              <SidebarItem
                href="/courses"
                icon="▣"
                label="كورساتي"
                active
              />

              <SidebarItem href="/lectures" icon="▶" label="المحاضرات" />

              <SidebarItem href="/assignments" icon="✓" label="الواجبات" />

              <SidebarItem href="/exams" icon="✦" label="الاختبارات" />

              <SidebarItem href="/results" icon="◈" label="النتائج" />

              <SidebarItem
                href="/notifications"
                icon="♢"
                label="الإشعارات"
                badge="3"
              />
            </div>

            <p className="px-3 pb-3 pt-8 text-[10px] font-black tracking-wider text-[#a4aab6]">
              الحساب
            </p>

            <div className="space-y-1.5">
              <SidebarItem href="/profile" icon="◎" label="حسابي" />
              <SidebarItem href="/support" icon="?" label="الدعم والمساعدة" />
            </div>
          </nav>

          {/* Bottom */}
          <div className="border-t border-[#eef0f4] p-5">
            <div className="rounded-2xl bg-[#172033] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  تقدمك الدراسي
                </span>

                <span className="text-xs font-black text-[#d9b35b]">
                  0%
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-0 rounded-full bg-[#d9b35b]" />
              </div>

              <p className="mt-3 text-[10px] leading-5 text-white/50">
                ابدأ أول درس لك لبداية رحلتك التعليمية.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ==================== MAIN ==================== */}
      <div className="xl:mr-[270px]">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-[#e8ebf1] bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex h-[78px] max-w-[1450px] items-center justify-between px-5 sm:px-8 lg:px-10">
            <div>
              <p className="mb-1 text-[11px] font-bold text-[#a0a6b2]">
                لوحة الطالب
              </p>

              <h1 className="text-lg font-black text-[#172033]">
                كورساتي
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#e7eaf0] bg-white text-lg transition hover:border-[#d9b35b] hover:bg-[#fffaf0]"
                aria-label="الإشعارات"
              >
                ♢
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#d9b35b]" />
              </button>

              <div className="hidden h-8 w-px bg-[#e8ebf1] sm:block" />

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#172033] text-sm font-black text-[#d9b35b]">
                  ط
                </div>

                <div className="hidden sm:block">
                  <p className="text-xs font-extrabold text-[#172033]">
                    الطالب
                  </p>

                  <p className="mt-0.5 text-[10px] text-[#9ba2af]">
                    حساب الطالب
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="mx-auto max-w-[1450px] px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
          {/* Mobile brand */}
          <div className="mb-6 flex items-center justify-between xl:hidden">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#172033] text-lg font-black text-[#d9b35b]">
                ع
              </div>

              <div>
                <p className="text-sm font-black text-[#172033]">
                  منصة أ/ عمرو موسى
                </p>

                <p className="text-[10px] text-[#959cab]">
                  منصة تعليمية متكاملة
                </p>
              </div>
            </Link>
          </div>

          {/* Intro */}
          <section className="relative mb-7 overflow-hidden rounded-[28px] bg-[#172033] p-6 shadow-[0_18px_50px_rgba(23,32,51,.10)] sm:p-8 lg:p-10">
            <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[#d9b35b]/10 blur-3xl" />

            <div className="absolute -bottom-28 right-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

            <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d9b35b]" />

                  <span className="text-[10px] font-bold text-white/60">
                    رحلتك التعليمية
                  </span>
                </div>

                <h2 className="text-2xl font-black leading-[1.5] text-white sm:text-3xl">
                  كل كورساتك في مكان واحد
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-7 text-white/55">
                  تابع دروسك، اعرف مستواك، وكمل رحلتك التعليمية من آخر نقطة
                  وصلت إليها.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-5">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-[7px] border-white/10 bg-white/5">
                  <div className="text-center">
                    <div className="text-xl font-black text-[#d9b35b]">
                      0%
                    </div>

                    <div className="mt-0.5 text-[8px] font-bold text-white/40">
                      التقدم
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-white/40">
                    إجمالي التقدم
                  </p>

                  <p className="mt-2 text-sm font-extrabold text-white">
                    ابدأ أول كورس لك وابدأ رحلتك
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
            <StatCard
              icon="▣"
              number={String(preparedCourses.length)}
              label="الكورسات"
              description="المتاحة حاليًا"
            />

            <StatCard
              icon="▶"
              number={String(totalLectures)}
              label="المحاضرات"
              description="إجمالي المحاضرات"
            />

            <StatCard
              icon="✓"
              number={String(totalCompletedLectures)}
              label="محاضرة مكتملة"
              description="تم الانتهاء منها"
            />

            <StatCard
              icon="◈"
              number="0%"
              label="متوسط التقدم"
              description="في كورساتك"
            />
          </section>

          {/* Search / filters */}
          <section className="mb-7">
            <div className="flex flex-col gap-4 rounded-2xl border border-[#e8ebf1] bg-white p-4 shadow-[0_8px_30px_rgba(20,30,50,.03)] lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-[390px]">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#9da4b0]">
                  ⌕
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث عن كورس..."
                  className="h-12 w-full rounded-xl border border-[#e7eaf0] bg-[#fafbfc] pr-11 pl-4 text-xs font-semibold text-[#172033] outline-none transition placeholder:text-[#b0b5bf] focus:border-[#d9b35b] focus:bg-white"
                />
              </div>

              <div className="scrollbar-hide flex max-w-full gap-2 overflow-x-auto">
                {filters.map((filter) => {
                  const active = activeFilter === filter;

                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                      className={`shrink-0 rounded-xl px-5 py-3 text-[11px] font-extrabold transition ${
                        active
                          ? "bg-[#172033] text-white shadow-[0_8px_20px_rgba(23,32,51,.12)]"
                          : "bg-[#f6f7f9] text-[#747c8c] hover:bg-[#eef0f4]"
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Courses */}
          <section>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="mb-1 text-[10px] font-black text-[#b08d3f]">
                  COURSES
                </p>

                <h2 className="text-xl font-black text-[#172033]">
                  الكورسات الخاصة بك
                </h2>
              </div>

              <span className="text-[11px] font-bold text-[#a0a6b2]">
                {filteredCourses.length} كورس
              </span>
            </div>

            {filteredCourses.length > 0 ? (
              <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-[#dfe3e9] bg-white px-6 py-20 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f5f6f8] text-2xl text-[#9ca3af]">
                  ⌕
                </div>

                <h3 className="mt-5 text-base font-black text-[#172033]">
                  لم نجد أي كورسات
                </h3>

                <p className="mt-2 text-xs text-[#9ba2ae]">
                  جرّب تغيير كلمة البحث أو الفلتر المستخدم.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveFilter("الكل");
                  }}
                  className="mt-5 rounded-xl bg-[#172033] px-5 py-3 text-[11px] font-extrabold text-white transition hover:bg-[#242f46]"
                >
                  عرض كل الكورسات
                </button>
              </div>
            )}
          </section>

          {/* Learning tip */}
          <section className="mt-8 overflow-hidden rounded-[24px] border border-[#eee2c8] bg-[#fffaf0] p-6 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#172033] text-xl text-[#d9b35b]">
                ✦
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-black text-[#172033]">
                  نصيحة اليوم
                </h3>

                <p className="mt-1.5 text-xs leading-6 text-[#747b88]">
                  خصص وقتًا ثابتًا للمذاكرة كل يوم، وحاول حل الواجب بعد كل
                  درس مباشرة حتى تثبت المعلومات بشكل أفضل.
                </p>
              </div>

              <Link
                href="/dashboard"
                className="shrink-0 rounded-xl bg-[#172033] px-5 py-3 text-center text-[11px] font-extrabold text-white transition hover:-translate-y-0.5"
              >
                العودة للرئيسية
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-12 border-t border-[#e5e8ed] pt-7">
            <div className="flex flex-col gap-3 text-center text-[10px] font-semibold text-[#a0a6b1] sm:flex-row sm:items-center sm:justify-between sm:text-right">
              <p>
                © 2026 منصة أ/ عمرو موسى — جميع الحقوق محفوظة
              </p>

              <div className="flex justify-center gap-5 sm:justify-start">
                <Link
                  href="/support"
                  className="transition hover:text-[#172033]"
                >
                  الدعم والمساعدة
                </Link>

                <Link
                  href="/"
                  className="transition hover:text-[#172033]"
                >
                  الصفحة الرئيسية
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}

/* ==================== SIDEBAR ITEM ==================== */

function SidebarItem({
  href,
  icon,
  label,
  active = false,
  badge,
}: {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className={`group flex h-12 items-center gap-3 rounded-xl px-3.5 transition ${
        active
          ? "bg-[#172033] text-white shadow-[0_8px_22px_rgba(23,32,51,.10)]"
          : "text-[#697181] hover:bg-[#f6f7f9] hover:text-[#172033]"
      }`}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition ${
          active
            ? "bg-white/10 text-[#d9b35b]"
            : "bg-[#f5f6f8] text-[#8c94a2] group-hover:text-[#172033]"
        }`}
      >
        {icon}
      </span>

      <span className="flex-1 text-xs font-extrabold">{label}</span>

      {badge && (
        <span
          className={`flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-[9px] font-black ${
            active
              ? "bg-[#d9b35b] text-[#172033]"
              : "bg-[#f0e6cf] text-[#8b6c27]"
          }`}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

/* ==================== STAT CARD ==================== */

function StatCard({
  icon,
  number,
  label,
  description,
}: {
  icon: string;
  number: string;
  label: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-[#e8ebf0] bg-white p-5 shadow-[0_8px_30px_rgba(20,30,50,.025)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(20,30,50,.07)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f7f3e9] text-sm font-black text-[#a27d2f] transition group-hover:bg-[#172033] group-hover:text-[#d9b35b]">
          {icon}
        </div>

        <span className="text-[9px] font-bold text-[#b0b5bf]">
          منصة أ/ عمرو موسى
        </span>
      </div>

      <div className="mt-5">
        <p className="text-2xl font-black text-[#172033]">{number}</p>

        <p className="mt-1 text-xs font-extrabold text-[#555e6e]">
          {label}
        </p>

        <p className="mt-1 text-[10px] font-semibold text-[#a2a8b3]">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ==================== COURSE CARD ==================== */

function CourseCard({ course }: { course: Course }) {
  const statusStyles = {
    مستمر: "bg-[#edf7f2] text-[#27845b]",
    مكتمل: "bg-[#f1f3f6] text-[#667080]",
    "لم يبدأ": "bg-[#fff7e7] text-[#9a752c]",
  };

  const progressBar =
    course.progress === 100
      ? "bg-[#27845b]"
      : course.progress > 0
        ? "bg-[#d9b35b]"
        : "bg-[#dfe2e7]";

  return (
    <article className="group overflow-hidden rounded-[24px] border border-[#e7eaf0] bg-white shadow-[0_8px_35px_rgba(20,30,50,.035)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(20,30,50,.09)]">
      {/* Top visual */}
      <div className="relative h-[175px] overflow-hidden bg-[#172033] p-6">
        <div className="absolute -left-10 -top-16 h-44 w-44 rounded-full bg-[#d9b35b]/10 blur-2xl transition duration-500 group-hover:scale-125" />

        <div className="absolute -bottom-20 right-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] font-bold text-white/70">
              {course.grade}
            </span>

            <span
              className={`rounded-full px-3 py-1.5 text-[9px] font-black ${statusStyles[course.status]}`}
            >
              {course.status}
            </span>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1 w-7 rounded-full bg-[#d9b35b]" />

              <span className="text-[9px] font-bold text-white/40">
                منصة أ/ عمرو موسى
              </span>
            </div>

            <h3 className="text-xl font-black text-white">
              {course.title}
            </h3>

            <p className="mt-1 text-[10px] font-medium text-white/45">
              كورس الصف {course.accent} الثانوي
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6">
        <h4 className="text-sm font-black text-[#172033]">
          {course.subtitle}
        </h4>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <CourseMeta label="الوحدات" value={String(course.units)} />

          <CourseMeta label="المحاضرات" value={String(course.lectures)} />

          <CourseMeta label="المدة" value={course.duration} />
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#9299a5]">
              التقدم في الكورس
            </span>

            <span className="text-[11px] font-black text-[#172033]">
              {course.progress}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-[#edf0f3]">
            <div
              className={`h-full rounded-full transition-all ${progressBar}`}
              style={{ width: `${course.progress}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[9px] font-semibold text-[#a2a8b2]">
              {course.completedLectures} من {course.lectures} محاضرة
            </span>

            <span className="text-[9px] font-semibold text-[#a2a8b2]">
              جاهز للبدء
            </span>
          </div>
        </div>

        {/* Last lesson */}
        <div className="mt-5 rounded-xl bg-[#f8f9fb] p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-black text-[#a17d31] shadow-sm">
              ▶
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-bold text-[#a2a8b2]">
                آخر نقطة وصلت إليها
              </p>

              <p className="mt-1 truncate text-[10px] font-extrabold text-[#3e4655]">
                {course.lastLesson}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/courses/${course.id}`}
          className="mt-5 flex h-12 items-center justify-center gap-2 rounded-xl bg-[#172033] text-[11px] font-black text-white transition duration-300 hover:bg-[#242f46] group-hover:shadow-[0_10px_25px_rgba(23,32,51,.12)]"
        >
          <span>ابدأ الكورس</span>

          <span className="text-[#d9b35b]">←</span>
        </Link>
      </div>
    </article>
  );
}

/* ==================== COURSE META ==================== */

function CourseMeta({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#eef0f3] bg-[#fafbfc] px-2 py-3 text-center">
      <p className="text-[8px] font-bold text-[#a2a8b2]">{label}</p>

      <p className="mt-1 text-[10px] font-black text-[#3e4655]">
        {value}
      </p>
    </div>
  );
}