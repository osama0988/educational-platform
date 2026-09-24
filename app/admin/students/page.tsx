import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export default async function AdminDashboardPage() {
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
      lastName: true,
      role: true,
    },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [
    studentsCount,
    coursesCount,
    lessonsCount,
    assignmentsCount,
    examsCount,
    subscriptionsCount,
    ticketsCount,
    notificationsCount,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        role: "STUDENT",
      },
    }),

    prisma.course.count(),

    prisma.lesson.count(),

    prisma.assignment.count(),

    prisma.exam.count(),

    prisma.subscription.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.supportTicket.count({
      where: {
        status: {
          in: ["OPEN", "IN_PROGRESS"],
        },
      },
    }),

    prisma.notification.count(),
  ]);

  const recentStudents = await prisma.user.findMany({
    where: {
      role: "STUDENT",
    },
    select: {
      id: true,
      firstName: true,
      middleName: true,
      lastName: true,
      phone: true,
      grade: true,
      status: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });

  const recentTickets = await prisma.supportTicket.findMany({
    where: {
      status: {
        in: ["OPEN", "IN_PROGRESS"],
      },
    },
    select: {
      id: true,
      subject: true,
      status: true,
      createdAt: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const adminName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    "مدير المنصة";

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
          boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: "1350px",
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
                fontWeight: "800",
                marginBottom: "5px",
              }}
            >
              منصة أ/ عمرو موسى
            </div>

            <div
              style={{
                fontSize: "20px",
                fontWeight: "900",
              }}
            >
              لوحة الإدارة
            </div>
          </div>

          <nav
            style={{
              display: "flex",
              gap: "7px",
              flexWrap: "wrap",
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
                            ["الدعم", "/admin/support"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                style={{
                  color: "white",
                  textDecoration: "none",
                  padding: "9px 11px",
                  borderRadius: "10px",
                  fontSize: "12px",
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
          maxWidth: "1350px",
          margin: "0 auto",
          padding: "35px 20px 70px",
        }}
      >
        <section
          style={{
            background:
              "linear-gradient(135deg, #101a3a 0%, #182755 100%)",
            color: "white",
            borderRadius: "28px",
            padding: "34px",
            marginBottom: "25px",
            boxShadow: "0 18px 45px rgba(16,26,58,0.15)",
          }}
        >
          <div
            style={{
              color: "#e5c75b",
              fontSize: "13px",
              fontWeight: "800",
              marginBottom: "9px",
            }}
          >
            مرحبًا بك
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "30px",
            }}
          >
            أهلًا يا {adminName}
          </h1>

          <p
            style={{
              margin: 0,
              color: "#d7dbea",
              fontSize: "14px",
              lineHeight: 1.9,
            }}
          >
            من هنا تقدر تدير الطلاب والكورسات والمحاضرات والواجبات
            والاختبارات والاشتراكات والدعم.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "15px",
            marginBottom: "25px",
          }}
        >
          <StatCard
            icon="👨‍🎓"
            title="الطلاب"
            value={studentsCount}
            href="/admin/students"
          />

          <StatCard
            icon="📚"
            title="الكورسات"
            value={coursesCount}
            href="/admin/courses"
          />

          <StatCard
            icon="🎥"
            title="المحاضرات"
            value={lessonsCount}
            href="/admin/lessons"
          />

          <StatCard
            icon="📝"
            title="الواجبات"
            value={assignmentsCount}
            href="/admin/assignments"
          />

          <StatCard
            icon="📋"
            title="الاختبارات"
            value={examsCount}
            href="/admin/exams"
          />

          <StatCard
            icon="🔑"
            title="الاشتراكات النشطة"
            value={subscriptionsCount}
            href="/admin/subscriptions"
          />

          <StatCard
            icon="🎧"
            title="طلبات الدعم"
            value={ticketsCount}
            href="/admin/support"
          />

          <StatCard
            icon="🔔"
            title="الإشعارات"
            value={notificationsCount}
            href="/admin/notifications"
          />
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          <Panel title="أحدث الطلاب" icon="👨‍🎓">
            {recentStudents.length === 0 ? (
              <Empty text="لا يوجد طلاب حتى الآن." />
            ) : (
              <div style={{ display: "grid", gap: "10px" }}>
                {recentStudents.map((student) => (
                  <div
                    key={student.id}
                    style={{
                      border: "1px solid #edf0f6",
                      borderRadius: "14px",
                      padding: "13px",
                      background: "#fafbfc",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: "800",
                            fontSize: "14px",
                            marginBottom: "4px",
                          }}
                        >
                          {student.firstName}{" "}
                          {student.middleName
                            ? `${student.middleName} `
                            : ""}
                          {student.lastName}
                        </div>

                        <div
                          style={{
                            color: "#858c9c",
                            fontSize: "12px",
                          }}
                        >
                          {student.phone}
                        </div>
                      </div>

                      <span
                        style={{
                          background:
                            student.status === "ACTIVE"
                              ? "#e9f8ef"
                              : "#fff0f0",
                          color:
                            student.status === "ACTIVE"
                              ? "#26734d"
                              : "#a13b3b",
                          padding: "6px 9px",
                          borderRadius: "18px",
                          fontSize: "10px",
                          fontWeight: "800",
                        }}
                      >
                        {student.status === "ACTIVE"
                          ? "نشط"
                          : "موقوف"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <a
              href="/admin/students"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "14px",
                padding: "11px",
                borderRadius: "11px",
                background: "#101a3a",
                color: "white",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: "800",
              }}
            >
              عرض كل الطلاب
            </a>
          </Panel>

          <Panel title="طلبات الدعم المفتوحة" icon="🎧">
            {recentTickets.length === 0 ? (
              <Empty text="لا توجد طلبات دعم مفتوحة." />
            ) : (
              <div style={{ display: "grid", gap: "10px" }}>
                {recentTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    style={{
                      border: "1px solid #edf0f6",
                      borderRadius: "14px",
                      padding: "13px",
                      background: "#fafbfc",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "800",
                        fontSize: "13px",
                        marginBottom: "5px",
                      }}
                    >
                      {ticket.subject}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "10px",
                        color: "#777f91",
                        fontSize: "11px",
                      }}
                    >
                      <span>
                        {ticket.user.firstName}{" "}
                        {ticket.user.lastName}
                      </span>

                      <span>
                        {ticket.status === "OPEN"
                          ? "مفتوح"
                          : "قيد المتابعة"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <a
              href="/admin/support"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "14px",
                padding: "11px",
                borderRadius: "11px",
                background: "#101a3a",
                color: "white",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: "800",
              }}
            >
              فتح مركز الدعم
            </a>
          </Panel>
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
        منصة أ/ عمرو موسى — لوحة إدارة المنصة
      </footer>
    </main>
  );
}

function StatCard({
  icon,
  title,
  value,
  href,
}: {
  icon: string;
  title: string;
  value: number;
  href: string;
}) {
  return (
    <a
      href={href}
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "20px",
        textDecoration: "none",
        color: "#101a3a",
        border: "1px solid #edf0f6",
        boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "13px",
          background: "#f5ead0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          marginBottom: "12px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#858c9c",
          fontSize: "12px",
          marginBottom: "6px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "26px",
          fontWeight: "900",
        }}
      >
        {value}
      </div>
    </a>
  );
}

function Panel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        background: "white",
        borderRadius: "22px",
        padding: "20px",
        border: "1px solid #edf0f6",
        boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "9px",
          marginBottom: "16px",
        }}
      >
        <span style={{ fontSize: "20px" }}>{icon}</span>

        <h2
          style={{
            margin: 0,
            fontSize: "18px",
          }}
        >
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: "30px 15px",
        textAlign: "center",
        color: "#858c9c",
        fontSize: "13px",
        background: "#fafbfc",
        borderRadius: "14px",
      }}
    >
      {text}
    </div>
  );
}


