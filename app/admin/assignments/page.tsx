import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export default async function AdminAssignmentsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  const admin = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!admin || admin.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const assignments = await prisma.assignment.findMany({
    include: {
      lesson: {
        include: {
          unit: {
            include: {
              course: true,
            },
          },
        },
      },
      questions: true,
      attempts: {
        select: {
          id: true,
          submittedAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const publishedAssignments = assignments.filter(
    (assignment) => assignment.isPublished
  ).length;

  const totalQuestions = assignments.reduce(
    (total, assignment) =>
      total + assignment.questions.length,
    0
  );

  const submittedAttempts = assignments.reduce(
    (total, assignment) =>
      total +
      assignment.attempts.filter(
        (attempt) => attempt.submittedAt !== null
      ).length,
    0
  );

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
            maxWidth: "1400px",
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
              إدارة الواجبات
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
          maxWidth: "1400px",
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
            التقييم والتدريب
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "30px",
            }}
          >
            الواجبات
          </h1>

          <p
            style={{
              margin: 0,
              color: "#d7dbea",
              fontSize: "14px",
              lineHeight: 1.9,
            }}
          >
            إدارة واجبات المحاضرات والأسئلة وعدد المحاولات والنتائج.
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
          <InfoCard
            icon="📝"
            title="إجمالي الواجبات"
            value={assignments.length}
          />

          <InfoCard
            icon="✅"
            title="الواجبات المنشورة"
            value={publishedAssignments}
          />

          <InfoCard
            icon="📄"
            title="إجمالي الأسئلة"
            value={totalQuestions}
          />

          <InfoCard
            icon="👨‍🎓"
            title="المحاولات المسلمة"
            value={submittedAttempts}
          />
        </section>

        {assignments.length === 0 ? (
          <section
            style={{
              background: "white",
              borderRadius: "24px",
              padding: "65px 25px",
              textAlign: "center",
              border: "1px solid #edf0f6",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                fontSize: "52px",
                marginBottom: "15px",
              }}
            >
              📝
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                fontSize: "22px",
              }}
            >
              لا توجد واجبات حتى الآن
            </h2>

            <p
              style={{
                margin: 0,
                color: "#858c9c",
                fontSize: "13px",
              }}
            >
              عند إضافة الواجبات ستظهر هنا.
            </p>
          </section>
        ) : (
          <section
            style={{
              display: "grid",
              gap: "15px",
            }}
          >
            {assignments.map((assignment) => {
              const submittedAttempts =
                assignment.attempts.filter(
                  (attempt) => attempt.submittedAt !== null
                ).length;

              return (
                <article
                  key={assignment.id}
                  style={{
                    background: "white",
                    borderRadius: "22px",
                    padding: "22px",
                    border: "1px solid #edf0f6",
                    boxShadow:
                      "0 10px 30px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "15px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "14px",
                        alignItems: "flex-start",
                        flex: 1,
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
                          fontSize: "24px",
                          flexShrink: 0,
                        }}
                      >
                        📝
                      </div>

                      <div>
                        <div
                          style={{
                            color: "#9b7a18",
                            fontSize: "11px",
                            fontWeight: "800",
                            marginBottom: "5px",
                          }}
                        >
                          {assignment.lesson?.unit.course.grade ||
                            "اللغة العربية"}
                        </div>

                        <h2
                          style={{
                            margin: "0 0 6px",
                            fontSize: "19px",
                            lineHeight: 1.5,
                          }}
                        >
                          {assignment.title}
                        </h2>

                        <div
                          style={{
                            color: "#858c9c",
                            fontSize: "12px",
                            lineHeight: 1.8,
                          }}
                        >
                          {assignment.lesson?.unit.course.title ||
                            "اللغة العربية"}

                          {" • "}

                          {assignment.lesson?.unit.title ||
                            "الوحدة"}

                          {" • "}

                          {assignment.lesson?.title ||
                            "المحاضرة"}
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        background: assignment.isPublished
                          ? "#e9f8ef"
                          : "#f3f5f9",
                        color: assignment.isPublished
                          ? "#26734d"
                          : "#777f91",
                        padding: "7px 11px",
                        borderRadius: "18px",
                        fontSize: "11px",
                        fontWeight: "800",
                      }}
                    >
                      {assignment.isPublished
                        ? "منشور"
                        : "مسودة"}
                    </span>
                  </div>

                  <p
                    style={{
                      color: "#6f7788",
                      fontSize: "13px",
                      lineHeight: 1.9,
                      margin: "18px 0",
                    }}
                  >
                    {assignment.description ||
                      "واجب تدريبي مرتبط بالمحاضرة."}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "9px",
                      flexWrap: "wrap",
                      marginBottom: "18px",
                    }}
                  >
                    <MiniStat
                      label="الأسئلة"
                      value={assignment.questions.length}
                    />

                    <MiniStat
                      label="الدرجات"
                      value={assignment.totalPoints}
                    />

                    <MiniStat
                      label="المحاولات"
                      value={submittedAttempts}
                    />

                    <MiniStat
                      label="الموعد"
                      value={
                        assignment.deadline
                          ? new Date(
                              assignment.deadline
                            ).toLocaleDateString("ar-EG")
                          : "غير محدد"
                      }
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "9px",
                      flexWrap: "wrap",
                    }}
                  >
                    <a
                      href={`/assignments/${assignment.id}`}
                      style={{
                        flex: 1,
                        minWidth: "170px",
                        textAlign: "center",
                        background: "#101a3a",
                        color: "white",
                        textDecoration: "none",
                        padding: "12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "800",
                      }}
                    >
                      عرض الواجب
                    </a>

                    <a
                      href="/admin/results"
                      style={{
                        flex: 1,
                        minWidth: "170px",
                        textAlign: "center",
                        background: "#f5ead0",
                        color: "#8c6d12",
                        textDecoration: "none",
                        padding: "12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "800",
                      }}
                    >
                      متابعة النتائج
                    </a>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>

      <footer
        style={{
          textAlign: "center",
          padding: "25px 20px",
          color: "#777",
          fontSize: "13px",
        }}
      >
        منصة أ/ عمرو موسى — إدارة الواجبات
      </footer>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: number;
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "20px",
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
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div
      style={{
        background: "#f8f9fc",
        border: "1px solid #edf0f6",
        borderRadius: "12px",
        padding: "10px 13px",
        minWidth: "95px",
      }}
    >
      <div
        style={{
          color: "#9298a6",
          fontSize: "10px",
          marginBottom: "5px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: "#101a3a",
          fontSize: "13px",
          fontWeight: "900",
        }}
      >
        {value}
      </div>
    </div>
  );
}