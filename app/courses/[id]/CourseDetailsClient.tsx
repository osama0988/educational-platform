"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Lesson = {
  id: string;
  title: string;
};

type Unit = {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
};

type Course = {
  id: string;
  title: string;
  description: string;
  grade: string;
  subject: string;
  units: Unit[];
};

export default function CourseDetailsClient({
  course,
}: {
  course: Course;
}) {
  const [openUnits, setOpenUnits] = useState<string[]>([
    course.units[0]?.id ?? "",
  ]);

  const [search, setSearch] = useState("");

  const toggleUnit = (unitId: string) => {
    setOpenUnits((current) =>
      current.includes(unitId)
        ? current.filter((id) => id !== unitId)
        : [...current, unitId]
    );
  };

  const filteredUnits = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return course.units;
    }

    return course.units
      .map((unit) => ({
        ...unit,
        lessons: unit.lessons.filter(
          (lesson) =>
            lesson.title.toLowerCase().includes(query) ||
            unit.title.toLowerCase().includes(query)
        ),
      }))
      .filter(
        (unit) =>
          unit.lessons.length > 0 ||
          unit.title.toLowerCase().includes(query)
      );
  }, [course.units, search]);

  const totalLessons = course.units.reduce(
    (total, unit) => total + unit.lessons.length,
    0
  );

  /*
   * تقدم الطالب سيتم ربطه بجدول التقدم الحقيقي
   * في خطوة لاحقة.
   */
  const completedLessons = 0;

  const progress =
    totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

  const firstLesson = course.units[0]?.lessons[0];

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f5f7fb] text-[#172033]"
    >
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

      {/* ================= SIDEBAR ================= */}

      <aside className="fixed right-0 top-0 z-40 hidden h-screen w-[270px] border-l border-[#e8ebf1] bg-white xl:block">
        <div className="flex h-full flex-col">
          <div className="flex h-[88px] items-center border-b border-[#eef0f4] px-7">
            <Link
              href="/dashboard"
              className="flex items-center gap-3"
            >
              <Logo />

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

          <div className="mx-5 mt-6 rounded-2xl bg-[#f7f8fa] p-4">
            <div className="flex items-center gap-3">
              <Avatar />

              <div>
                <p className="text-sm font-extrabold text-[#172033]">
                  الطالب
                </p>

                <p className="mt-1 text-[11px] font-medium text-[#9299a8]">
                  {course.grade}
                </p>
              </div>
            </div>
          </div>

          <nav className="mt-7 flex-1 px-4">
            <p className="px-3 pb-3 text-[10px] font-black tracking-wider text-[#a4aab6]">
              القائمة الرئيسية
            </p>

            <div className="space-y-1.5">
              <SidebarItem
                href="/dashboard"
                icon="⌂"
                label="الرئيسية"
              />

              <SidebarItem
                href="/courses"
                icon="▣"
                label="كورساتي"
                active
              />

              <SidebarItem
                href="/lessons"
                icon="▶"
                label="المحاضرات"
              />

              <SidebarItem
                href="/assignments"
                icon="✓"
                label="الواجبات"
              />

              <SidebarItem
                href="/exams"
                icon="✦"
                label="الاختبارات"
              />

              <SidebarItem
                href="/results"
                icon="◈"
                label="النتائج"
              />

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
              <SidebarItem
                href="/profile"
                icon="◎"
                label="حسابي"
              />

              <SidebarItem
                href="/support"
                icon="?"
                label="الدعم والمساعدة"
              />
            </div>
          </nav>

          <div className="border-t border-[#eef0f4] p-5">
            <div className="rounded-2xl bg-[#172033] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  تقدمك الدراسي
                </span>

                <span className="text-xs font-black text-[#d9b35b]">
                  {progress}%
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#d9b35b]"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-[10px] leading-5 text-white/50">
                استمر في التعلم وحافظ على تقدمك.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}

      <div className="xl:mr-[270px]">
        {/* HEADER */}

        <header className="sticky top-0 z-30 border-b border-[#e8ebf1] bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex h-[78px] max-w-[1450px] items-center justify-between px-5 sm:px-8 lg:px-10">
            <div>
              <p className="mb-1 text-[11px] font-bold text-[#a0a6b2]">
                الكورسات
              </p>

              <h1 className="text-lg font-black text-[#172033]">
                تفاصيل الكورس
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/notifications"
                className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#e7eaf0] bg-white text-lg transition hover:border-[#d9b35b]"
              >
                ♢

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#d9b35b]" />
              </Link>

              <div className="hidden h-8 w-px bg-[#e8ebf1] sm:block" />

              <div className="flex items-center gap-3">
                <Avatar />

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

        {/* CONTENT */}

        <div className="mx-auto max-w-[1450px] px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
          {/* MOBILE BRAND */}

          <div className="mb-6 flex items-center justify-between xl:hidden">
            <Link
              href="/dashboard"
              className="flex items-center gap-3"
            >
              <Logo />

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

          {/* BREADCRUMB */}

          <div className="mb-5 flex flex-wrap items-center gap-2 text-[10px] font-bold text-[#a0a6b2]">
            <Link
              href="/dashboard"
              className="hover:text-[#172033]"
            >
              الرئيسية
            </Link>

            <span>←</span>

            <Link
              href="/courses"
              className="hover:text-[#172033]"
            >
              كورساتي
            </Link>

            <span>←</span>

            <span className="text-[#172033]">
              {course.title}
            </span>
          </div>

          {/* COURSE HERO */}

          <section className="relative mb-7 overflow-hidden rounded-[28px] bg-[#172033] p-6 shadow-[0_18px_50px_rgba(23,32,51,.10)] sm:p-8 lg:p-10">
            <div className="absolute -left-20 -top-28 h-72 w-72 rounded-full bg-[#d9b35b]/10 blur-3xl" />

            <div className="absolute -bottom-32 right-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_300px] lg:items-center">
              <div>
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#d9b35b] px-3 py-1.5 text-[9px] font-black text-[#172033]">
                    {course.grade}
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] font-bold text-white/60">
                    {course.subject}
                  </span>
                </div>

                <h2 className="text-2xl font-black leading-[1.5] text-white sm:text-3xl lg:text-4xl">
                  {course.title}
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">
                  {course.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <InfoBadge
                    icon="▣"
                    text={`${course.units.length} وحدات`}
                  />

                  <InfoBadge
                    icon="▶"
                    text={`${totalLessons} محتوى`}
                  />

                  <InfoBadge
                    icon="✦"
                    text="اختبارات دورية"
                  />
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  {firstLesson ? (
                    <Link
                      href={`/courses/${course.id}/lesson/${firstLesson.id}`}
                      className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#d9b35b] px-7 text-[11px] font-black text-[#172033] transition hover:-translate-y-0.5 hover:bg-[#e2c270]"
                    >
                      بدء التعلم
                      <span>←</span>
                    </Link>
                  ) : (
                    <div className="flex h-12 items-center justify-center rounded-xl bg-white/10 px-7 text-[11px] font-bold text-white/40">
                      لا يوجد محتوى بعد
                    </div>
                  )}

                  <Link
                    href="/courses"
                    className="flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-7 text-[11px] font-bold text-white/75 transition hover:bg-white/10"
                  >
                    العودة للكورسات
                  </Link>
                </div>
              </div>

              {/* PROGRESS */}

              <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <p className="text-[10px] font-bold text-white/40">
                  تقدمك في الكورس
                </p>

                <div className="mt-5 flex items-end justify-between">
                  <span className="text-4xl font-black text-white">
                    {progress}%
                  </span>

                  <span className="text-[10px] font-bold text-white/40">
                    {completedLessons} من {totalLessons} محتوى
                  </span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[#d9b35b]"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d9b35b]/10 text-sm text-[#d9b35b]">
                    ✦
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold text-white">
                      ابدأ رحلتك التعليمية
                    </p>

                    <p className="mt-1 text-[9px] text-white/35">
                      تقدمك سيظهر هنا مع بدء التعلم.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SEARCH */}

          <section className="mb-7">
            <div className="flex flex-col gap-4 rounded-2xl border border-[#e8ebf1] bg-white p-4 shadow-[0_8px_30px_rgba(20,30,50,.03)] sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#9da4b0]">
                  ⌕
                </span>

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="ابحث داخل محتوى الكورس..."
                  className="h-12 w-full rounded-xl border border-[#e7eaf0] bg-[#fafbfc] pr-11 pl-4 text-xs font-semibold text-[#172033] outline-none transition placeholder:text-[#b0b5bf] focus:border-[#d9b35b] focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-[#f7f8fa] px-4 py-3">
                <span className="text-sm text-[#a17d31]">
                  ▣
                </span>

                <span className="text-[10px] font-extrabold text-[#6d7584]">
                  {course.units.length} وحدات
                </span>
              </div>
            </div>
          </section>

          {/* COURSE CONTENT */}

          <section>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="mb-1 text-[10px] font-black text-[#b08d3f]">
                  COURSE CONTENT
                </p>

                <h2 className="text-xl font-black text-[#172033]">
                  محتوى الكورس
                </h2>
              </div>

              <span className="text-[10px] font-bold text-[#a0a6b2]">
                {completedLessons}/{totalLessons} محتوى
              </span>
            </div>

            {filteredUnits.length > 0 ? (
              <div className="space-y-4">
                {filteredUnits.map((unit, index) => {
                  const isOpen = openUnits.includes(unit.id);

                  return (
                    <div
                      key={unit.id}
                      className="overflow-hidden rounded-[22px] border border-[#e7eaf0] bg-white shadow-[0_8px_30px_rgba(20,30,50,.025)]"
                    >
                      {/* UNIT HEADER */}

                      <button
                        type="button"
                        onClick={() => toggleUnit(unit.id)}
                        className="flex w-full items-center gap-4 p-5 text-right transition hover:bg-[#fafbfc] sm:p-6"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#172033] text-sm font-black text-[#d9b35b]">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-black text-[#172033]">
                              {unit.title}
                            </h3>

                            <span className="rounded-full bg-[#f5f6f8] px-2.5 py-1 text-[8px] font-bold text-[#8e96a3]">
                              {unit.lessons.length} محتوى
                            </span>
                          </div>

                          <p className="mt-1.5 hidden text-[10px] leading-5 text-[#a0a6b2] sm:block">
                            {unit.description}
                          </p>

                          <div className="mt-2 flex items-center gap-2">
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#edf0f3]">
                              <div
                                className="h-full rounded-full bg-[#d9b35b]"
                                style={{
                                  width: "0%",
                                }}
                              />
                            </div>

                            <span className="text-[8px] font-bold text-[#a0a6b2]">
                              0/{unit.lessons.length}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f7f8fa] text-sm text-[#7f8795] transition ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        >
                          ↓
                        </span>
                      </button>

                      {/* LESSONS */}

                      {isOpen && (
                        <div className="border-t border-[#eef0f3] bg-[#fafbfc] p-3 sm:p-4">
                          <div className="space-y-2">
                            {unit.lessons.map(
                              (lesson, lessonIndex) => (
                                <LessonRow
                                  key={lesson.id}
                                  lesson={lesson}
                                  index={lessonIndex}
                                  courseId={course.id}
                                />
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-[#dfe3e9] bg-white px-6 py-20 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f5f6f8] text-2xl text-[#9ca3af]">
                  ⌕
                </div>

                <h3 className="mt-5 text-base font-black text-[#172033]">
                  لم نجد أي محتوى
                </h3>

                <p className="mt-2 text-xs text-[#9ba2ae]">
                  جرّب تغيير كلمة البحث.
                </p>

                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-5 rounded-xl bg-[#172033] px-5 py-3 text-[11px] font-extrabold text-white transition hover:bg-[#242f46]"
                >
                  عرض كل المحتوى
                </button>
              </div>
            )}
          </section>

          {/* BOTTOM INFO */}

          <section className="mt-8 grid gap-5 lg:grid-cols-2">
            <div className="rounded-[22px] border border-[#e8ebf0] bg-white p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f7f3e9] text-[#a17d31]">
                  ✓
                </div>

                <div>
                  <h3 className="text-sm font-black text-[#172033]">
                    ماذا ستجد داخل الكورس؟
                  </h3>

                  <ul className="mt-3 space-y-2 text-[10px] font-semibold leading-5 text-[#858d9b]">
                    <li>
                      • شرح فيديو منظم لكل موضوع.
                    </li>

                    <li>
                      • ملفات ومراجعات مساعدة.
                    </li>

                    <li>
                      • واجبات بعد الوحدات.
                    </li>

                    <li>
                      • اختبارات لقياس مستوى الاستيعاب.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-[22px] bg-[#172033] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#d9b35b]">
                  ?
                </div>

                <div>
                  <h3 className="text-sm font-black text-white">
                    محتاج مساعدة؟
                  </h3>

                  <p className="mt-2 text-[10px] leading-6 text-white/45">
                    لو واجهتك أي مشكلة أثناء استخدام المنصة،
                    يمكنك التواصل مع الدعم والمساعدة.
                  </p>

                  <Link
                    href="/support"
                    className="mt-4 inline-flex rounded-xl bg-[#d9b35b] px-5 py-3 text-[10px] font-black text-[#172033] transition hover:bg-[#e2c270]"
                  >
                    التواصل مع الدعم
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* FOOTER */}

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
                  href="/courses"
                  className="transition hover:text-[#172033]"
                >
                  كورساتي
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}

/* ================= LOGO ================= */

function Logo() {
  return (
    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#172033] shadow-[0_10px_25px_rgba(23,32,51,.16)]">
      <div className="absolute h-7 w-7 rounded-lg border-2 border-[#d9b35b]" />

      <span className="relative z-10 text-lg font-black text-[#d9b35b]">
        ع
      </span>
    </div>
  );
}

/* ================= AVATAR ================= */

function Avatar() {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#172033] text-sm font-black text-[#d9b35b]">
      ط
    </div>
  );
}

/* ================= SIDEBAR ITEM ================= */

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

      <span className="flex-1 text-xs font-extrabold">
        {label}
      </span>

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

/* ================= INFO BADGE ================= */

function InfoBadge({
  icon,
  text,
}: {
  icon: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5">
      <span className="text-xs text-[#d9b35b]">
        {icon}
      </span>

      <span className="text-[9px] font-bold text-white/55">
        {text}
      </span>
    </div>
  );
}

/* ================= LESSON ROW ================= */

function LessonRow({
  lesson,
  index,
  courseId,
}: {
  lesson: Lesson;
  index: number;
  courseId: string;
}) {
  return (
    <Link
      href={`/courses/${courseId}/lesson/${lesson.id}`}
      className="group flex items-center gap-3 rounded-xl border border-transparent bg-white p-3 transition hover:border-[#e9dfc8] hover:shadow-[0_8px_25px_rgba(20,30,50,.04)]"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#9b7831] shadow-sm">
        ▶
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="truncate text-[11px] font-extrabold text-[#3d4655]">
            {lesson.title}
          </h4>

          <span className="rounded-md bg-[#f0f1f3] px-2 py-1 text-[7px] font-black text-[#9299a5]">
            محتوى {index + 1}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-[8px] font-semibold text-[#a2a8b2]">
            محتوى تعليمي
          </span>
        </div>
      </div>

      <div className="hidden shrink-0 sm:block">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs text-[#8e96a3] shadow-sm transition group-hover:bg-[#172033] group-hover:text-[#d9b35b]">
          ←
        </span>
      </div>
    </Link>
  );
}