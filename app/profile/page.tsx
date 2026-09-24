import Link from "next/link";
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

function roleLabel(role: string) {
  switch (role) {
    case "STUDENT":
      return "طالب";
    case "ADMIN":
      return "مدير المنصة";
    default:
      return role;
  }
}

function statusLabel(status: string) {
  switch (status) {
    case "ACTIVE":
      return "نشط";
    case "SUSPENDED":
      return "موقوف";
    default:
      return status;
  }
}

function planLabel(plan: string) {
  switch (plan) {
    case "MONTHLY":
      return "شهري";
    case "TERM":
      return "ترم";
    case "ANNUAL":
      return "سنوي";
    default:
      return plan;
  }
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const student = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      subscriptions: {
        include: {},
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!student || student.role !== "STUDENT" || student.status !== "ACTIVE") {
    redirect("/login");
  }

  const fullName = [
    student.firstName,
    student.middleName,
    student.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const activeSubscriptions = student.subscriptions.filter(
    (subscription) => subscription.status === "ACTIVE"
  );

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "25px 18px 50px",
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
            padding: "28px",
            color: "white",
            marginBottom: "22px",
            boxShadow: "0 15px 40px rgba(16,26,58,0.12)",
          }}
        >
          <div
            style={{
              color: "#d4af37",
              fontWeight: "700",
              fontSize: "14px",
              marginBottom: "8px",
            }}
          >
            منصة أ/ عمرو موسى
          </div>

          <h1
            style={{
              margin: "0 0 8px",
              fontSize: "30px",
            }}
          >
            الملف الشخصي
          </h1>

          <p
            style={{
              margin: 0,
              color: "#d7dbea",
              lineHeight: 1.8,
            }}
          >
            بيانات حسابك واشتراكاتك التعليمية.
          </p>
        </header>

        {/* Navigation */}
        <nav
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "13px",
            marginBottom: "22px",
            display: "flex",
            gap: "9px",
            flexWrap: "wrap",
            boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
            border: "1px solid #edf0f6",
          }}
        >
          {[
            ["الرئيسية", "/dashboard"],
            ["الكورسات", "/courses"],
            ["المحاضرات", "/lessons"],
            ["الواجبات", "/assignments"],
            ["الاختبارات", "/exams"],
            ["النتائج", "/results"],
            ["الإشعارات", "/notifications"],
            ["الاشتراكات", "/subscriptions"],
            ["الملف الشخصي", "/profile"],
            ["الدعم", "/support"],
            ["الإعدادات", "/settings"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              style={{
                textDecoration: "none",
                padding: "10px 14px",
                borderRadius: "11px",
                background:
                  href === "/profile" ? "#101a3a" : "#f3f5f9",
                color:
                  href === "/profile" ? "white" : "#444d63",
                fontSize: "14px",
                fontWeight: "700",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Main Grid */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0, 1.4fr) minmax(300px, 0.8fr)",
            gap: "20px",
            marginBottom: "22px",
          }}
        >
          {/* Personal Information */}
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
                display: "flex",
                alignItems: "center",
                gap: "18px",
                marginBottom: "25px",
              }}
            >
              <div
                style={{
                  width: "75px",
                  height: "75px",
                  borderRadius: "22px",
                  background: "#101a3a",
                  color: "#d4af37",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "30px",
                  fontWeight: "700",
                  flexShrink: 0,
                }}
              >
                {student.firstName.charAt(0)}
              </div>

              <div>
                <h2
                  style={{
                    margin: "0 0 7px",
                    color: "#101a3a",
                    fontSize: "23px",
                  }}
                >
                  {fullName}
                </h2>

                <span
                  style={{
                    color: "#8f7018",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  {roleLabel(student.role)}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "13px",
              }}
            >
              <div
                style={{
                  background: "#f7f8fb",
                  borderRadius: "15px",
                  padding: "15px",
                }}
              >
                <small
                  style={{
                    display: "block",
                    color: "#888",
                    marginBottom: "7px",
                  }}
                >
                  الاسم الأول
                </small>

                <strong>{student.firstName}</strong>
              </div>

              <div
                style={{
                  background: "#f7f8fb",
                  borderRadius: "15px",
                  padding: "15px",
                }}
              >
                <small
                  style={{
                    display: "block",
                    color: "#888",
                    marginBottom: "7px",
                  }}
                >
                  الاسم الأوسط
                </small>

                <strong>
                  {student.middleName || "غير مسجل"}
                </strong>
              </div>

              <div
                style={{
                  background: "#f7f8fb",
                  borderRadius: "15px",
                  padding: "15px",
                }}
              >
                <small
                  style={{
                    display: "block",
                    color: "#888",
                    marginBottom: "7px",
                  }}
                >
                  اسم العائلة
                </small>

                <strong>{student.lastName}</strong>
              </div>

              <div
                style={{
                  background: "#f7f8fb",
                  borderRadius: "15px",
                  padding: "15px",
                }}
              >
                <small
                  style={{
                    display: "block",
                    color: "#888",
                    marginBottom: "7px",
                  }}
                >
                  رقم الهاتف
                </small>

                <strong>{student.phone}</strong>
              </div>

              <div
                style={{
                  background: "#f7f8fb",
                  borderRadius: "15px",
                  padding: "15px",
                }}
              >
                <small
                  style={{
                    display: "block",
                    color: "#888",
                    marginBottom: "7px",
                  }}
                >
                  البريد الإلكتروني
                </small>

                <strong>
                  {student.email || "غير مسجل"}
                </strong>
              </div>

              <div
                style={{
                  background: "#f7f8fb",
                  borderRadius: "15px",
                  padding: "15px",
                }}
              >
                <small
                  style={{
                    display: "block",
                    color: "#888",
                    marginBottom: "7px",
                  }}
                >
                  الصف الدراسي
                </small>

                <strong>
                  {student.grade || "غير محدد"}
                </strong>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              padding: "25px",
              border: "1px solid #edf0f6",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            <h2
              style={{
                margin: "0 0 20px",
                color: "#101a3a",
                fontSize: "21px",
              }}
            >
              حالة الحساب
            </h2>

            <div
              style={{
                background: "#e8f7ef",
                color: "#16804b",
                borderRadius: "16px",
                padding: "16px",
                marginBottom: "12px",
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <strong>الحالة</strong>
              <span>{statusLabel(student.status)}</span>
            </div>

            <div
              style={{
                background: "#f7f8fb",
                borderRadius: "16px",
                padding: "16px",
                marginBottom: "12px",
              }}
            >
              <small
                style={{
                  display: "block",
                  color: "#888",
                  marginBottom: "7px",
                }}
              >
                نوع الحساب
              </small>

              <strong>{roleLabel(student.role)}</strong>
            </div>

            <div
              style={{
                background: "#f7f8fb",
                borderRadius: "16px",
                padding: "16px",
              }}
            >
              <small
                style={{
                  display: "block",
                  color: "#888",
                  marginBottom: "7px",
                }}
              >
                تاريخ إنشاء الحساب
              </small>

              <strong>{formatDate(student.createdAt)}</strong>
            </div>
          </div>
        </section>

        {/* Subscriptions */}
        <section
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
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: "0 0 6px",
                  color: "#101a3a",
                  fontSize: "22px",
                }}
              >
                اشتراكاتي
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#777",
                  fontSize: "14px",
                }}
              >
                اشتراكك الحالي يفتح جميع كورسات المنصة.
              </p>
            </div>

            <Link
              href="/subscriptions"
              style={{
                textDecoration: "none",
                background: "#f5ead0",
                color: "#8f7018",
                padding: "10px 15px",
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              إدارة الاشتراكات
            </Link>
          </div>

          {activeSubscriptions.length === 0 ? (
            <div
              style={{
                background: "#f8f9fc",
                borderRadius: "18px",
                padding: "35px 20px",
                textAlign: "center",
                color: "#777",
              }}
            >
              لا يوجد لديك اشتراك نشط حاليًا.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "15px",
              }}
            >
              {activeSubscriptions.map((subscription) => (
      <div
        key={subscription.id}
        style={{
          border: "1px solid #edf0f6",
          borderRadius: "18px",
          padding: "18px",
          background: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <strong style={{ color: "#101a3a" }}>
            اشتراك المنصة
          </strong>

          <span
            style={{
              background: "#e8f7ef",
              color: "#16804b",
              padding: "6px 10px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: "700",
            }}
          >
            نشط
          </span>
        </div>

        <p
          style={{
            margin: "12px 0 0",
            color: "#777",
            fontSize: "13px",
          }}
        >
          {planLabel(subscription.plan)}
        </p>

        <p
          style={{
            margin: "6px 0 0",
            color: "#777",
            fontSize: "13px",
          }}
        >
          ساري حتى {formatDate(subscription.expiresAt)}
        </p>

        <Link
          href="/courses"
          style={{
            display: "block",
            marginTop: "15px",
            textAlign: "center",
            background: "#101a3a",
            color: "white",
            textDecoration: "none",
            padding: "12px",
            borderRadius: "12px",
            fontWeight: "700",
          }}
        >
          الدخول إلى الكورسات
        </Link>
      </div>
    ))}
            </div>
          )}
        </section>

        <footer
          style={{
            textAlign: "center",
            padding: "30px 0 5px",
            color: "#777",
            fontSize: "13px",
          }}
        >
          منصة أ/ عمرو موسى — الملف الشخصي
        </footer>
      </div>
    </main>
  );
}



