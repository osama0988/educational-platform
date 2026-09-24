import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

function notificationTypeLabel(type: string) {
  switch (type) {
    case "LESSON":
      return "محاضرة";
    case "ASSIGNMENT":
      return "واجب";
    case "EXAM":
      return "اختبار";
    case "RESULT":
      return "نتيجة";
    case "SYSTEM":
      return "النظام";
    default:
      return type;
  }
}

function notificationTypeStyle(type: string) {
  switch (type) {
    case "LESSON":
      return {
        background: "#eef4ff",
        color: "#315ea8",
      };

    case "ASSIGNMENT":
      return {
        background: "#fff4d6",
        color: "#9b7414",
      };

    case "EXAM":
      return {
        background: "#f4edff",
        color: "#7046a8",
      };

    case "RESULT":
      return {
        background: "#e8f7ef",
        color: "#16804b",
      };

    case "SYSTEM":
      return {
        background: "#f1f2f5",
        color: "#5d6577",
      };

    default:
      return {
        background: "#f1f2f5",
        color: "#555",
      };
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function AdminNotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, status: true },
  });

  if (!admin || admin.role !== "ADMIN" || admin.status !== "ACTIVE") {
    redirect("/dashboard");
  }

  const notifications = await prisma.notification.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const readCount = notifications.filter(
    (notification) => notification.isRead
  ).length;

  const lessonCount = notifications.filter(
    (notification) => notification.type === "LESSON"
  ).length;

  const assignmentCount = notifications.filter(
    (notification) => notification.type === "ASSIGNMENT"
  ).length;

  const examCount = notifications.filter(
    (notification) => notification.type === "EXAM"
  ).length;

  const resultCount = notifications.filter(
    (notification) => notification.type === "RESULT"
  ).length;

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
            إدارة الإشعارات
          </h1>

          <p
            style={{
              margin: 0,
              color: "#d7dbea",
              lineHeight: 1.8,
            }}
          >
            متابعة الإشعارات المرسلة للطلاب وحالات قراءتها.
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
            <a
              key={href}
              href={href}
              style={{
                textDecoration: "none",
                padding: "10px 15px",
                borderRadius: "11px",
                background:
                  href === "/admin/notifications"
                    ? "#101a3a"
                    : "#f3f5f9",
                color:
                  href === "/admin/notifications"
                    ? "white"
                    : "#444d63",
                fontSize: "14px",
                fontWeight: "700",
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Statistics */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "15px",
            marginBottom: "25px",
          }}
        >
          {[
            {
              title: "إجمالي الإشعارات",
              value: notifications.length,
              icon: "🔔",
            },
            {
              title: "غير مقروءة",
              value: unreadCount,
              icon: "📩",
            },
            {
              title: "مقروءة",
              value: readCount,
              icon: "✅",
            },
            {
              title: "إشعارات المحاضرات",
              value: lessonCount,
              icon: "📚",
            },
            {
              title: "إشعارات الواجبات",
              value: assignmentCount,
              icon: "📝",
            },
            {
              title: "إشعارات الاختبارات",
              value: examCount,
              icon: "📋",
            },
            {
              title: "إشعارات النتائج",
              value: resultCount,
              icon: "🏆",
            },
          ].map((stat) => (
            <div
              key={stat.title}
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "20px",
                border: "1px solid #edf0f6",
                boxShadow: "0 8px 25px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  fontSize: "25px",
                  marginBottom: "12px",
                }}
              >
                {stat.icon}
              </div>

              <div
                style={{
                  color: "#70778a",
                  fontSize: "13px",
                  marginBottom: "7px",
                }}
              >
                {stat.title}
              </div>

              <strong
                style={{
                  color: "#101a3a",
                  fontSize: "22px",
                }}
              >
                {stat.value}
              </strong>
            </div>
          ))}
        </section>

        {/* Notifications */}
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
              marginBottom: "22px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: "0 0 6px",
                  color: "#101a3a",
                  fontSize: "23px",
                }}
              >
                جميع الإشعارات
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#777",
                  fontSize: "14px",
                }}
              >
                الإشعارات المسجلة حاليًا في قاعدة البيانات.
              </p>
            </div>

            <div
              style={{
                background: "#f5ead0",
                color: "#8f7018",
                padding: "9px 14px",
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              {notifications.length} إشعار
            </div>
          </div>

          {notifications.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "70px 20px",
                color: "#777",
              }}
            >
              <div
                style={{
                  fontSize: "55px",
                  marginBottom: "15px",
                }}
              >
                🔔
              </div>

              <h3
                style={{
                  margin: "0 0 8px",
                  color: "#101a3a",
                }}
              >
                لا توجد إشعارات حتى الآن
              </h3>

              <p style={{ margin: 0 }}>
                ستظهر الإشعارات هنا عند إرسالها للطلاب.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "14px",
              }}
            >
              {notifications.map((notification) => {
                const typeStyle = notificationTypeStyle(
                  notification.type
                );

                const studentName = [
                  notification.user.firstName,
                  notification.user.middleName,
                  notification.user.lastName,
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <article
                    key={notification.id}
                    style={{
                      border: notification.isRead
                        ? "1px solid #edf0f6"
                        : "1px solid #e6d7a6",
                      borderRadius: "20px",
                      padding: "20px",
                      background: notification.isRead
                        ? "#fff"
                        : "#fffdf6",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "20px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          minWidth: "250px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flexWrap: "wrap",
                            marginBottom: "10px",
                          }}
                        >
                          <span
                            style={{
                              background: typeStyle.background,
                              color: typeStyle.color,
                              padding: "6px 11px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "700",
                            }}
                          >
                            {notificationTypeLabel(
                              notification.type
                            )}
                          </span>

                          <span
                            style={{
                              background: notification.isRead
                                ? "#e8f7ef"
                                : "#fff4d6",
                              color: notification.isRead
                                ? "#16804b"
                                : "#9b7414",
                              padding: "6px 11px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "700",
                            }}
                          >
                            {notification.isRead
                              ? "مقروء"
                              : "غير مقروء"}
                          </span>
                        </div>

                        <h3
                          style={{
                            margin: "0 0 8px",
                            color: "#101a3a",
                            fontSize: "20px",
                          }}
                        >
                          {notification.title}
                        </h3>

                        <p
                          style={{
                            margin: "0 0 15px",
                            color: "#656d80",
                            lineHeight: 1.9,
                          }}
                        >
                          {notification.message}
                        </p>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(180px, 1fr))",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              background: "#f7f8fb",
                              padding: "12px",
                              borderRadius: "12px",
                            }}
                          >
                            <small
                              style={{
                                display: "block",
                                color: "#888",
                                marginBottom: "5px",
                              }}
                            >
                              الطالب
                            </small>

                            <strong>
                              {studentName}
                            </strong>
                          </div>

                          <div
                            style={{
                              background: "#f7f8fb",
                              padding: "12px",
                              borderRadius: "12px",
                            }}
                          >
                            <small
                              style={{
                                display: "block",
                                color: "#888",
                                marginBottom: "5px",
                              }}
                            >
                              رقم الهاتف
                            </small>

                            <strong>
                              {notification.user.phone}
                            </strong>
                          </div>

                          <div
                            style={{
                              background: "#f7f8fb",
                              padding: "12px",
                              borderRadius: "12px",
                            }}
                          >
                            <small
                              style={{
                                display: "block",
                                color: "#888",
                                marginBottom: "5px",
                              }}
                            >
                              تاريخ الإرسال
                            </small>

                            <strong>
                              {formatDate(
                                notification.createdAt
                              )}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer
          style={{
            textAlign: "center",
            padding: "30px 0 5px",
            color: "#777",
            fontSize: "14px",
          }}
        >
          منصة أ/ عمرو موسى — إدارة الإشعارات
        </footer>
      </div>
    </main>
  );
}