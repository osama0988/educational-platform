import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function planLabel(plan: string) {
  if (plan === "MONTHLY") return "اشتراك شهري";
  if (plan === "TERM") return "اشتراك ترم";
  if (plan === "ANNUAL") return "اشتراك سنوي";
  return plan;
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscriptions: {
        orderBy: { expiresAt: "desc" },
      },
      attempts: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          exam: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
      notifications: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const now = new Date();

  const activeSubscription = user.subscriptions.find(
    (subscription) =>
      subscription.status === "ACTIVE" &&
      subscription.expiresAt > now
  );

  const publishedCourses = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    include: {
      units: {
        where: { isPublished: true },
        include: {
          lessons: {
            where: { isPublished: true },
            select: { id: true },
          },
          exams: {
            where: { isPublished: true },
            select: { id: true },
          },
        },
      },
    },
  });

  const totalLessons = publishedCourses.reduce(
    (total, course) =>
      total +
      course.units.reduce(
        (unitTotal, unit) => unitTotal + unit.lessons.length,
        0
      ),
    0
  );

  const totalExams = publishedCourses.reduce(
    (total, course) =>
      total +
      course.units.reduce(
        (unitTotal, unit) => unitTotal + unit.exams.length,
        0
      ),
    0
  );

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <Image src="/rasikh-logo.png" alt="شعار منصة أ/ عمرو موسى" width={48} height={55} style={{ width: 48, height: 55, objectFit: "contain" }} />
            <div>
              <p className="text-sm font-medium text-slate-500">
                منصة أ/ عمرو موسى
              </p>
            <h1 className="mt-1 text-2xl font-extrabold text-slate-900">
              أهلاً بك، {user.firstName} 👋
            </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/courses"
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              الكورسات
            </Link>

            <Link
              href="/profile"
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              حسابي
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 p-8 text-white shadow-xl">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
              لوحة الطالب
            </span>

            <h2 className="mt-5 text-3xl font-extrabold leading-tight md:text-4xl">
              منصتك التعليمية في مكان واحد
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-8 text-indigo-100">
              تابع دروسك، ادخل على الاختبارات والواجبات، وراجع نتائجك من
              لوحة التحكم الخاصة بك.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="rounded-xl bg-white px-6 py-3 font-bold text-indigo-700 transition hover:bg-indigo-50"
              >
                ابدأ التعلم
              </Link>

              <Link
                href="/subscriptions"
                className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-bold text-white transition hover:bg-white/15"
              >
                الاشتراك
              </Link>
            </div>
          </div>
        </div>

        {!activeSubscription && (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h3 className="text-xl font-extrabold text-amber-900">
              لم يتم تفعيل اشتراكك بعد
            </h3>

            <p className="mt-2 leading-7 text-amber-800">
              فعّل كود الاشتراك الخاص بك لفتح جميع الكورسات والمحتوى
              التعليمي على المنصة.
            </p>

            <Link
              href="/subscriptions"
              className="mt-5 inline-flex rounded-xl bg-amber-600 px-5 py-3 font-bold text-white transition hover:bg-amber-700"
            >
              تفعيل الاشتراك
            </Link>
          </div>
        )}

        {activeSubscription && (
          <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-semibold text-emerald-700">
                  الاشتراك الحالي
                </p>

                <h3 className="mt-1 text-2xl font-extrabold text-emerald-900">
                  {planLabel(activeSubscription.plan)}
                </h3>

                <p className="mt-2 text-sm text-emerald-800">
                  صالح حتى {formatDate(activeSubscription.expiresAt)}
                </p>
              </div>

              <Link
                href="/courses"
                className="rounded-xl bg-emerald-600 px-5 py-3 text-center font-bold text-white transition hover:bg-emerald-700"
              >
                فتح جميع الكورسات
              </Link>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              الكورسات المتاحة
            </p>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">
              {publishedCourses.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              الدروس المتاحة
            </p>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">
              {totalLessons}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              الاختبارات
            </p>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">
              {totalExams}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              محاولات الاختبارات
            </p>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">
              {user.attempts.length}
            </p>
          </div>
        </div>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-indigo-600">
                المحتوى التعليمي
              </p>
              <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                الكورسات
              </h2>
            </div>

            <Link
              href="/courses"
              className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
            >
              عرض الكل
            </Link>
          </div>

          {publishedCourses.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="font-bold text-slate-700">
                لا توجد كورسات منشورة حاليًا.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                سيتم ظهور المحتوى هنا بمجرد نشره من لوحة الإدارة.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {publishedCourses.map((course) => {
                const lessons = course.units.reduce(
                  (total, unit) => total + unit.lessons.length,
                  0
                );

                const exams = course.units.reduce(
                  (total, unit) => total + unit.exams.length,
                  0
                );

                return (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
                      📚
                    </div>

                    <h3 className="mt-5 text-xl font-extrabold text-slate-900 group-hover:text-indigo-700">
                      {course.title}
                    </h3>

                    {course.description && (
                      <p className="mt-3 line-clamp-2 text-sm leading-7 text-slate-500">
                        {course.description}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                      <span className="rounded-full bg-slate-100 px-3 py-2">
                        {course.units.length} وحدات
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-2">
                        {lessons} دروس
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-2">
                        {exams} اختبارات
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-indigo-600">
                  آخر النتائج
                </p>
                <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                  الاختبارات الأخيرة
                </h2>
              </div>

              <Link
                href="/results"
                className="text-sm font-bold text-indigo-600"
              >
                كل النتائج
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {user.attempts.length === 0 ? (
                <p className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">
                  لم تدخل أي اختبار حتى الآن.
                </p>
              ) : (
                user.attempts.map((attempt) => (
                  <Link
                    key={attempt.id}
                    href={`/exams/${attempt.examId}/result`}
                    className="block rounded-xl border border-slate-100 p-4 transition hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-slate-800">
                          {attempt.exam?.title ?? "اختبار"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(attempt.createdAt)}
                        </p>
                      </div>

                      <span className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-extrabold text-indigo-700">
                        {attempt.score} / {attempt.totalPoints}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-indigo-600">
                  التنبيهات
                </p>
                <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                  آخر الإشعارات
                </h2>
              </div>

              <Link
                href="/notifications"
                className="text-sm font-bold text-indigo-600"
              >
                كل الإشعارات
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {user.notifications.length === 0 ? (
                <p className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">
                  لا توجد إشعارات جديدة.
                </p>
              ) : (
                user.notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="rounded-xl border border-slate-100 p-4"
                  >
                    <p className="font-bold text-slate-800">
                      {notification.title}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {notification.message}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
          <p className="font-semibold">منصة أ/ عمرو موسى</p>
          <p className="mt-2">
            منصة تعليمية متخصصة في اللغة العربية.
          </p>
        </footer>
      </section>
    </main>
  );
}


