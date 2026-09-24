import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

function statusLabel(status: string) {
  switch (status) {
    case "OPEN":
      return "مفتوحة";
    case "IN_PROGRESS":
      return "قيد المتابعة";
    case "RESOLVED":
      return "تم الحل";
    case "CLOSED":
      return "مغلقة";
    default:
      return status;
  }
}

function statusStyle(status: string) {
  switch (status) {
    case "OPEN":
      return {
        background: "#fff4d6",
        color: "#9b7414",
      };

    case "IN_PROGRESS":
      return {
        background: "#eef4ff",
        color: "#315ea8",
      };

    case "RESOLVED":
      return {
        background: "#e8f7ef",
        color: "#16804b",
      };

    case "CLOSED":
      return {
        background: "#f1f2f5",
        color: "#666",
      };

    default:
      return {
        background: "#f1f2f5",
        color: "#555",
      };
  }
}

function categoryLabel(category: string) {
  switch (category.toLowerCase()) {
    case "payment":
      return "الاشتراك";
    case "subscription":
      return "الاشتراك";
    case "course":
      return "الكورس";
    case "lesson":
      return "المحاضرة";
    case "assignment":
      return "الواجب";
    case "exam":
      return "الاختبار";
    case "technical":
      return "مشكلة تقنية";
    case "account":
      return "الحساب";
    default:
      return category;
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

export default async function AdminSupportPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, status: true },
  });

  if (!admin || admin.role !== "ADMIN" || admin.status !== "ACTIVE") {
    redirect("/dashboard");
  }

  const tickets = await prisma.supportTicket.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const openCount = tickets.filter(
    (ticket) => ticket.status === "OPEN"
  ).length;

  const inProgressCount = tickets.filter(
    (ticket) => ticket.status === "IN_PROGRESS"
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) => ticket.status === "RESOLVED"
  ).length;

  const closedCount = tickets.filter(
    (ticket) => ticket.status === "CLOSED"
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
            الدعم الفني
          </h1>

          <p
            style={{
              margin: 0,
              color: "#d7dbea",
              lineHeight: 1.8,
            }}
          >
            متابعة استفسارات ومشكلات الطلاب وطلبات الدعم.
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
                  href === "/admin/support"
                    ? "#101a3a"
                    : "#f3f5f9",
                color:
                  href === "/admin/support"
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
              title: "إجمالي الطلبات",
              value: tickets.length,
              icon: "🎧",
            },
            {
              title: "طلبات مفتوحة",
              value: openCount,
              icon: "🔔",
            },
            {
              title: "قيد المتابعة",
              value: inProgressCount,
              icon: "🔄",
            },
            {
              title: "تم حلها",
              value: resolvedCount,
              icon: "✅",
            },
            {
              title: "مغلقة",
              value: closedCount,
              icon: "📁",
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

        {/* Tickets */}
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
                طلبات الدعم
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#777",
                  fontSize: "14px",
                }}
              >
                جميع طلبات الدعم المسجلة في قاعدة البيانات.
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
              {tickets.length} طلب
            </div>
          </div>

          {tickets.length === 0 ? (
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
                🎧
              </div>

              <h3
                style={{
                  margin: "0 0 8px",
                  color: "#101a3a",
                }}
              >
                لا توجد طلبات دعم حتى الآن
              </h3>

              <p style={{ margin: 0 }}>
                ستظهر طلبات الطلاب هنا عند إرسالها.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "15px",
              }}
            >
              {tickets.map((ticket) => {
                const currentStatusStyle =
                  statusStyle(ticket.status);

                const studentName = [
                  ticket.user.firstName,
                  ticket.user.middleName,
                  ticket.user.lastName,
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <article
                    key={ticket.id}
                    style={{
                      border: "1px solid #edf0f6",
                      borderRadius: "20px",
                      padding: "20px",
                      background: "#fff",
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
                              background:
                                currentStatusStyle.background,
                              color:
                                currentStatusStyle.color,
                              padding: "6px 11px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "700",
                            }}
                          >
                            {statusLabel(ticket.status)}
                          </span>

                          <span
                            style={{
                              background: "#f5ead0",
                              color: "#8f7018",
                              padding: "6px 11px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "700",
                            }}
                          >
                            {categoryLabel(ticket.category)}
                          </span>
                        </div>

                        <h3
                          style={{
                            margin: "0 0 8px",
                            color: "#101a3a",
                            fontSize: "20px",
                          }}
                        >
                          {ticket.subject}
                        </h3>

                        <p
                          style={{
                            margin: "0 0 15px",
                            color: "#656d80",
                            lineHeight: 1.9,
                          }}
                        >
                          {ticket.message}
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

                            <strong>{studentName}</strong>
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

                            <strong>{ticket.user.phone}</strong>
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
                              تاريخ الطلب
                            </small>

                            <strong>
                              {formatDate(ticket.createdAt)}
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
                              آخر تحديث
                            </small>

                            <strong>
                              {formatDate(ticket.updatedAt)}
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
          منصة أ/ عمرو موسى — الدعم الفني
        </footer>
      </div>
    </main>
  );
}