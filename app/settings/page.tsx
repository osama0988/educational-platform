import Link from "next/link";

const settingsSections = [
  {
    title: "الحساب الشخصي",
    icon: "👤",
    items: [
      {
        title: "الملف الشخصي",
        description: "عرض وتحديث بيانات حسابك الشخصية",
        href: "/profile",
        icon: "🪪",
      },
      {
        title: "الأمان وكلمة المرور",
        description: "إدارة كلمة المرور وحماية حسابك",
        href: "/profile",
        icon: "🔐",
      },
    ],
  },
  {
    title: "التعلم",
    icon: "📚",
    items: [
      {
        title: "دوراتي",
        description: "الوصول إلى الكورسات المشترك بها",
        href: "/courses",
        icon: "🎓",
      },
      {
        title: "الاشتراكات",
        description: "عرض حالة اشتراكك وخطة التفعيل الحالية",
        href: "/subscriptions",
        icon: "💳",
      },
      {
        title: "النتائج",
        description: "متابعة نتائج الواجبات والاختبارات",
        href: "/results",
        icon: "📊",
      },
    ],
  },
  {
    title: "المساعدة والدعم",
    icon: "🛟",
    items: [
      {
        title: "الإشعارات",
        description: "متابعة آخر التنبيهات والتحديثات",
        href: "/notifications",
        icon: "🔔",
      },
      {
        title: "الدعم الفني",
        description: "تواصل مع إدارة منصة أ/ عمرو موسى",
        href: "/support",
        icon: "💬",
      },
    ],
  },
];

export default function SettingsPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f5f7fb] text-[#172033]"
    >
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#172554] text-xl font-black text-[#d4af37] shadow-sm">
              أ
            </div>

            <div>
              <div className="text-base font-black text-[#172554] sm:text-lg">
                منصة أ/ عمرو موسى
              </div>
              <div className="text-xs font-medium text-slate-500">
                منصة تعليمية متكاملة
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#172554] transition hover:border-[#d4af37] hover:bg-[#fffbeb]"
          >
            العودة للوحة التحكم
          </Link>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/dashboard" className="transition hover:text-[#172554]">
            لوحة التحكم
          </Link>
          <span>←</span>
          <span className="font-bold text-[#172554]">الإعدادات</span>
        </div>

        {/* Intro */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-[#172554] p-6 text-white shadow-xl sm:p-8">
          <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[#d4af37]/10 blur-2xl" />
          <div className="absolute -bottom-20 right-10 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl" />

          <div className="relative">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-white/10 px-4 py-2 text-xs font-bold text-[#f5d77a]">
              ⚙️ إعدادات الحساب
            </div>

            <h1 className="mb-3 text-2xl font-black sm:text-3xl">
              إعدادات المنصة
            </h1>

            <p className="max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
              من هنا تقدر توصل بسرعة إلى إعدادات حسابك، دوراتك، اشتراكاتك،
              الإشعارات والدعم الفني.
            </p>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section) => (
            <section
              key={section.title}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              {/* Section Header */}
              <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fffbeb] text-xl">
                  {section.icon}
                </div>

                <div>
                  <h2 className="font-black text-[#172554]">
                    {section.title}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    إعدادات وخيارات القسم
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
                {section.items.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[#d4af37]/40 hover:bg-[#fffbeb] hover:shadow-sm"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-xl shadow-sm ring-1 ring-slate-100 transition group-hover:ring-[#d4af37]/30">
                      {item.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-black text-[#172554]">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-xs leading-6 text-slate-500">
                        {item.description}
                      </p>
                    </div>

                    <span className="text-lg font-bold text-slate-300 transition group-hover:-translate-x-1 group-hover:text-[#d4af37]">
                      ←
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Platform Info */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#172554] text-lg text-[#d4af37]">
                ℹ️
              </div>

              <div>
                <h2 className="font-black text-[#172554]">
                  عن المنصة
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  معلومات أساسية عن منصة أ/ عمرو موسى
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-2 text-xs font-bold text-slate-500">
                المنصة
              </div>
              <div className="font-black text-[#172554]">
                منصة أ/ عمرو موسى
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-2 text-xs font-bold text-slate-500">
                المادة
              </div>
              <div className="font-black text-[#172554]">
                اللغة العربية
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-2 text-xs font-bold text-slate-500">
                نوع الحساب
              </div>
              <div className="font-black text-[#172554]">
                طالب
              </div>
            </div>
          </div>
        </section>

        {/* Help Card */}
        <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-[#d4af37]/20 bg-[#fffbeb] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <div className="mb-1 font-black text-[#172554]">
              محتاج مساعدة؟
            </div>

            <p className="text-sm leading-6 text-slate-600">
              لو عندك مشكلة في الحساب أو الاشتراك أو محتوى الدورة، تقدر
              تتواصل مع الدعم الفني.
            </p>
          </div>

          <Link
            href="/support"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#172554] px-5 py-3 text-sm font-black text-white transition hover:bg-[#1e3a8a]"
          >
            تواصل مع الدعم
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-10 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-right lg:px-8">
          <p>
            © {new Date().getFullYear()} منصة أ/ عمرو موسى — جميع الحقوق
            محفوظة
          </p>

          <div className="flex justify-center gap-4 sm:justify-start">
            <Link
              href="/dashboard"
              className="transition hover:text-[#172554]"
            >
              لوحة التحكم
            </Link>

            <Link
              href="/support"
              className="transition hover:text-[#172554]"
            >
              الدعم الفني
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}