import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import Link from "next/link";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, status: true },
  });

  if (!admin || admin.role !== "ADMIN" || admin.status !== "ACTIVE") {
    redirect("/dashboard");
  }
  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "30px 20px 50px",
        fontFamily: "Arial, sans-serif",
        color: "#17213d",
      }}
    >
      <div
        style={{
          maxWidth: "1250px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <header
          style={{
            background: "#101a3a",
            borderRadius: "26px",
            padding: "30px",
            color: "white",
            marginBottom: "25px",
            boxShadow: "0 15px 40px rgba(16,26,58,0.12)",
          }}
        >
          <div
            style={{
              color: "#d4af37",
              fontWeight: "700",
              marginBottom: "8px",
              fontSize: "15px",
            }}
          >
            منصة أ/ عمرو موسى
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "32px",
            }}
          >
            إعدادات المنصة
          </h1>

          <p
            style={{
              margin: 0,
              color: "#d7dbea",
              lineHeight: 1.8,
            }}
          >
            إدارة الإعدادات الأساسية الخاصة بالمنصة والحسابات والنظام.
          </p>
        </header>

        {/* Navigation */}
        <nav
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "14px",
            marginBottom: "25px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
            border: "1px solid #edf0f6",
          }}
        >
          {[
            ["لوحة التحكم", "/admin/dashboard"],
            ["الطلاب", "/admin/students"],
            ["الكورسات", "/admin/courses"],
            ["المحاضرات", "/admin/lessons"],
            ["الواجبات", "/admin/assignments"],
            ["الاختبارات", "/admin/exams"],
            ["النتائج", "/admin/results"],
            ["الاشتراكات", "/admin/subscriptions"],
                        ["الإشعارات", "/admin/notifications"],
            ["الدعم", "/admin/support"],
            ["الإعدادات", "/admin/settings"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              style={{
                textDecoration: "none",
                padding: "10px 15px",
                borderRadius: "11px",
                background:
                  href === "/admin/settings"
                    ? "#101a3a"
                    : "#f3f5f9",
                color:
                  href === "/admin/settings"
                    ? "white"
                    : "#444d63",
                fontSize: "14px",
                fontWeight: "700",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Settings */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Platform */}
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              padding: "25px",
              border: "1px solid #edf0f6",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "15px",
                background: "#f5ead0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "25px",
                marginBottom: "15px",
              }}
            >
              ⚙️
            </div>

            <h2
              style={{
                margin: "0 0 8px",
                color: "#101a3a",
                fontSize: "21px",
              }}
            >
              إعدادات المنصة
            </h2>

            <p
              style={{
                margin: "0 0 20px",
                color: "#777",
                lineHeight: 1.8,
                fontSize: "14px",
              }}
            >
              المعلومات الأساسية الخاصة بالمنصة.
            </p>

            <div style={{ display: "grid", gap: "12px" }}>
              <div
                style={{
                  background: "#f7f8fb",
                  borderRadius: "14px",
                  padding: "14px",
                }}
              >
                <small
                  style={{
                    display: "block",
                    color: "#888",
                    marginBottom: "6px",
                  }}
                >
                  اسم المنصة
                </small>

                <strong>منصة أ/ عمرو موسى</strong>
              </div>

              <div
                style={{
                  background: "#f7f8fb",
                  borderRadius: "14px",
                  padding: "14px",
                }}
              >
                <small
                  style={{
                    display: "block",
                    color: "#888",
                    marginBottom: "6px",
                  }}
                >
                  المادة
                </small>

                <strong>اللغة العربية</strong>
              </div>

              <div
                style={{
                  background: "#f7f8fb",
                  borderRadius: "14px",
                  padding: "14px",
                }}
              >
                <small
                  style={{
                    display: "block",
                    color: "#888",
                    marginBottom: "6px",
                  }}
                >
                  نوع المنصة
                </small>

                <strong>منصة تعليمية</strong>
              </div>
            </div>
          </div>

          {/* Account */}
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              padding: "25px",
              border: "1px solid #edf0f6",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "15px",
                background: "#eef4ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "25px",
                marginBottom: "15px",
              }}
            >
              👤
            </div>

            <h2
              style={{
                margin: "0 0 8px",
                color: "#101a3a",
                fontSize: "21px",
              }}
            >
              الحساب والإدارة
            </h2>

            <p
              style={{
                margin: "0 0 20px",
                color: "#777",
                lineHeight: 1.8,
                fontSize: "14px",
              }}
            >
              إعدادات الحساب والصلاحيات الإدارية.
            </p>

            <div style={{ display: "grid", gap: "12px" }}>
              <div
                style={{
                  background: "#f7f8fb",
                  borderRadius: "14px",
                  padding: "14px",
                }}
              >
                <small
                  style={{
                    display: "block",
                    color: "#888",
                    marginBottom: "6px",
                  }}
                >
                  نظام الصلاحيات
                </small>

                <strong>مدير المنصة</strong>
              </div>

              <div
                style={{
                  background: "#f7f8fb",
                  borderRadius: "14px",
                  padding: "14px",
                }}
              >
                <small
                  style={{
                    display: "block",
                    color: "#888",
                    marginBottom: "6px",
                  }}
                >
                  دور الإدارة
                </small>

                <strong>ADMIN</strong>
              </div>
            </div>
          </div>

          {/* Education */}
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              padding: "25px",
              border: "1px solid #edf0f6",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "15px",
                background: "#e8f7ef",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "25px",
                marginBottom: "15px",
              }}
            >
              📚
            </div>

            <h2
              style={{
                margin: "0 0 8px",
                color: "#101a3a",
                fontSize: "21px",
              }}
            >
              إعدادات التعليم
            </h2>

            <p
              style={{
                margin: "0 0 20px",
                color: "#777",
                lineHeight: 1.8,
                fontSize: "14px",
              }}
            >
              تنظيم المحتوى التعليمي داخل المنصة.
            </p>

            <div style={{ display: "grid", gap: "12px" }}>
              <div
                style={{
                  background: "#f7f8fb",
                  borderRadius: "14px",
                  padding: "14px",
                }}
              >
                <small
                  style={{
                    display: "block",
                    color: "#888",
                    marginBottom: "6px",
                  }}
                >
                  المادة الأساسية
                </small>

                <strong>اللغة العربية</strong>
              </div>

              <div
                style={{
                  background: "#f7f8fb",
                  borderRadius: "14px",
                  padding: "14px",
                }}
              >
                <small
                  style={{
                    display: "block",
                    color: "#888",
                    marginBottom: "6px",
                  }}
                >
                  المحتوى
                </small>

                <strong>دروس + واجبات + اختبارات</strong>
              </div>
            </div>
          </div>

          {/* System */}
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              padding: "25px",
              border: "1px solid #edf0f6",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "15px",
                background: "#f1f2f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "25px",
                marginBottom: "15px",
              }}
            >
              🛡️
            </div>

            <h2
              style={{
                margin: "0 0 8px",
                color: "#101a3a",
                fontSize: "21px",
              }}
            >
              حالة النظام
            </h2>

            <p
              style={{
                margin: "0 0 20px",
                color: "#777",
                lineHeight: 1.8,
                fontSize: "14px",
              }}
            >
              معلومات عامة عن حالة النظام الحالي.
            </p>

            <div style={{ display: "grid", gap: "12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#e8f7ef",
                  color: "#16804b",
                  borderRadius: "14px",
                  padding: "14px",
                }}
              >
                <strong>قاعدة البيانات</strong>
                <span>متصلة</span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#e8f7ef",
                  color: "#16804b",
                  borderRadius: "14px",
                  padding: "14px",
                }}
              >
                <strong>المنصة</strong>
                <span>نشطة</span>
              </div>
            </div>
          </div>

          {/* Important note */}
          <div
            style={{
              background: "#101a3a",
              borderRadius: "24px",
              padding: "25px",
              color: "white",
              boxShadow: "0 10px 30px rgba(16,26,58,0.1)",
            }}
          >
            <div
              style={{
                color: "#d4af37",
                fontSize: "28px",
                marginBottom: "12px",
              }}
            >
              💡
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                fontSize: "21px",
              }}
            >
              ملاحظة
            </h2>

            <p
              style={{
                margin: 0,
                color: "#d7dbea",
                lineHeight: 1.9,
                fontSize: "14px",
              }}
            >
              هذه الصفحة تعرض إعدادات المنصة الحالية بشكل منظم.
              إعدادات الحساب والمعلومات الإدارية سيتم ربطها
              فعليًا ضمن مراحل تطوير النظام والإدارة المتقدمة.
            </p>
          </div>
        </section>

        <footer
          style={{
            textAlign: "center",
            padding: "30px 0 5px",
            color: "#777",
            fontSize: "14px",
          }}
        >
          منصة أ/ عمرو موسى — لوحة الإدارة
        </footer>
      </div>
    </main>
  );
}