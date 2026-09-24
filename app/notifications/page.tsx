import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      firstName: true,
      notifications: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const notifications = user.notifications;

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        fontFamily: "Arial, sans-serif",
        color: "#101a3a",
      }}
    >
      <header
        style={{
          background: "#101a3a",
          color: "white",
          padding: "18px 24px",
          position: "sticky",
          top: 0,
          zIndex: 20,
          boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: "1250px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                color: "#d4af37",
                fontSize: "14px",
                fontWeight: "700",
                marginBottom: "5px",
              }}
            >
              منصة أ/ عمرو موسى
            </div>

            <div
              style={{
                fontSize: "20px",
                fontWeight: "800",
              }}
            >
              الإشعارات
            </div>
          </div>

          <nav
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            {[
              ["الرئيسية", "/dashboard"],
              ["الكورسات", "/courses"],
              ["المحاضرات", "/lessons"],
              ["الواجبات", "/assignments"],
              ["الاختبارات", "/exams"],
              ["النتائج", "/results"],
              ["حسابي", "/profile"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                style={{
                  color: "white",
                  textDecoration: "none",
                  padding: "9px 12px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  background: "transparent",
                }}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <div
        style={{
          maxWidth: "1050px",
          margin: "0 auto",
          padding: "40px 20px 60px",
        }}
      >
        <section
          style={{
            background:
              "linear-gradient(135deg, #101a3a 0%, #172652 100%)",
            color: "white",
            borderRadius: "28px",
            padding: "35px",
            marginBottom: "25px",
            boxShadow: "0 18px 45px rgba(16,26,58,0.15)",
          }}
        >
          <div
            style={{
              color: "#e5c75b",
              fontSize: "13px",
              fontWeight: "700",
              marginBottom: "10px",
            }}
          >
            مركز التنبيهات
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "32px",
              lineHeight: 1.4,
            }}
          >
            أهلاً يا {user.firstName} 🔔
          </h1>

          <p
            style={{
              margin: 0,
              color: "#d7dbea",
              fontSize: "15px",
              lineHeight: 1.8,
            }}
          >
            هنا ستجد آخر التنبيهات والتحديثات الخاصة بحسابك ودراستك.
          </p>
        </section>

        <section
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "28px",
            border: "1px solid #edf0f6",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "15px",
              marginBottom: "22px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2
                style={{
                  margin: "0 0 7px",
                  fontSize: "22px",
                }}
              >
                كل الإشعارات
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#777f91",
                  fontSize: "14px",
                }}
              >
                أحدث الإشعارات تظهر أولاً.
              </p>
            </div>

            <div
              style={{
                background: "#f5ead0",
                color: "#9b7a18",
                padding: "9px 14px",
                borderRadius: "20px",
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
                background: "#f8f9fc",
                borderRadius: "18px",
                padding: "55px 25px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "48px",
                  marginBottom: "14px",
                }}
              >
                🔔
              </div>

              <h3
                style={{
                  margin: "0 0 9px",
                  fontSize: "20px",
                }}
              >
                لا توجد إشعارات حاليًا
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#777",
                  fontSize: "14px",
                  lineHeight: 1.8,
                }}
              >
                عندما يكون هناك تحديث أو تنبيه جديد سيظهر هنا.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "13px",
              }}
            >
              {notifications.map((notification) => {
                const notificationDate = new Date(
                  notification.createdAt
                ).toLocaleString("ar-EG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <article
                    key={notification.id}
                    style={{
                      background: notification.isRead
                        ? "#f8f9fc"
                        : "#fff8e4",
                      border: notification.isRead
                        ? "1px solid #edf0f6"
                        : "1px solid #f0dfaa",
                      borderRadius: "18px",
                      padding: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "15px",
                      }}
                    >
                      <div
                        style={{
                          width: "45px",
                          height: "45px",
                          borderRadius: "14px",
                          background: notification.isRead
                            ? "#eef1f6"
                            : "#f5ead0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "20px",
                          flexShrink: 0,
                        }}
                      >
                        {notification.type === "LESSON"
                          ? "📖"
                          : notification.type === "ASSIGNMENT"
                            ? "📝"
                            : notification.type === "EXAM"
                              ? "📋"
                              : notification.type === "RESULT"
                                ? "📊"
                                : "🔔"}
                      </div>

                      <div
                        style={{
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "10px",
                            flexWrap: "wrap",
                            marginBottom: "7px",
                          }}
                        >
                          <h3
                            style={{
                              margin: 0,
                              fontSize: "17px",
                              fontWeight: "800",
                            }}
                          >
                            {notification.title}
                          </h3>

                          {!notification.isRead && (
                            <span
                              style={{
                                background: "#d4af37",
                                color: "#101a3a",
                                padding: "5px 9px",
                                borderRadius: "15px",
                                fontSize: "11px",
                                fontWeight: "800",
                              }}
                            >
                              جديد
                            </span>
                          )}
                        </div>

                        <p
                          style={{
                            margin: "0 0 10px",
                            color: "#666f82",
                            fontSize: "14px",
                            lineHeight: 1.9,
                          }}
                        >
                          {notification.message}
                        </p>

                        <div
                          style={{
                            color: "#9298a6",
                            fontSize: "11px",
                          }}
                        >
                          {notificationDate}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <footer
        style={{
          textAlign: "center",
          padding: "25px 20px",
          color: "#777",
          fontSize: "13px",
        }}
      >
        منصة أ/ عمرو موسى — تعليم اللغة العربية
      </footer>
    </main>
  );
}