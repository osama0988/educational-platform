import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export default async function AdminResultsPage() {
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

  const attempts = await prisma.assessmentAttempt.findMany({
    where: {
      submittedAt: {
        not: null,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
          phone: true,
          grade: true,
        },
      },
      assignment: {
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
        },
      },
      exam: {
        include: {
          unit: {
            include: {
              course: true,
            },
          },
        },
      },
    },
    orderBy: {
      submittedAt: "desc",
    },
  });

  const examAttempts = attempts.filter(
    (attempt) => attempt.type === "EXAM"
  );

  const assignmentAttempts = attempts.filter(
    (attempt) => attempt.type === "ASSIGNMENT"
  );

  const averagePercentage =
    attempts.length > 0
      ? Math.round(
          attempts.reduce(
            (sum, attempt) =>
              sum + Number(attempt.percentage || 0),
            0
          ) / attempts.length
        )
      : 0;

  const passedCount = attempts.filter(
    (attempt) => Number(attempt.percentage || 0) >= 50
  ).length;

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
              إدارة النتائج
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
            boxShadow:
              "0 18px 45px rgba(16,26,58,0.15)",
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
            متابعة مستوى الطلاب
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "30px",
            }}
          >
            النتائج
          </h1>

          <p
            style={{
              margin: 0,
              color: "#d7dbea",
              fontSize: "14px",
              lineHeight: 1.9,
            }}
          >
            متابعة نتائج الاختبارات والواجبات ومعرفة مستوى الطلاب.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "15px",
            marginBottom: "25px",
          }}
        >
          <InfoCard
            icon="📊"
            title="إجمالي النتائج"
            value={attempts.length}
          />

          <InfoCard
            icon="📋"
            title="نتائج الاختبارات"
            value={examAttempts.length}
          />

          <InfoCard
            icon="📝"
            title="نتائج الواجبات"
            value={assignmentAttempts.length}
          />

          <InfoCard
            icon="⭐"
            title="متوسط الدرجات"
            value={`${averagePercentage}%`}
          />

          <InfoCard
            icon="✅"
            title="ناجحون"
            value={passedCount}
          />
        </section>

        {attempts.length === 0 ? (
          <section
            style={{
              background: "white",
              borderRadius: "24px",
              padding: "65px 25px",
              textAlign: "center",
              border: "1px solid #edf0f6",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                fontSize: "52px",
                marginBottom: "15px",
              }}
            >
              📊
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                fontSize: "22px",
              }}
            >
              لا توجد نتائج حتى الآن
            </h2>

            <p
              style={{
                margin: 0,
                color: "#858c9c",
                fontSize: "13px",
              }}
            >
              ستظهر النتائج هنا بعد أن يبدأ الطلاب في حل الواجبات والاختبارات.
            </p>
          </section>
        ) : (
          <section
            style={{
              background: "white",
              borderRadius: "24px",
              padding: "25px",
              border: "1px solid #edf0f6",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  color: "#9b7a18",
                  fontSize: "12px",
                  fontWeight: "800",
                  marginBottom: "5px",
                }}
              >
                آخر النتائج
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: "22px",
                }}
              >
                نتائج الطلاب
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gap: "12px",
              }}
            >
              {attempts.map((attempt) => {
                const isExam = attempt.type === "EXAM";

                const title = isExam
                  ? attempt.exam?.title || "اختبار"
                  : attempt.assignment?.title || "واجب";

                const courseTitle = isExam
                  ? attempt.exam?.unit?.course.title ||
                    "اللغة العربية"
                  : attempt.assignment?.lesson?.unit?.course
                      .title || "اللغة العربية";

                const unitTitle = isExam
                  ? attempt.exam?.unit?.title || "الوحدة"
                  : attempt.assignment?.lesson?.unit?.title ||
                    "الوحدة";

                const percentage = Number(
                  attempt.percentage || 0
                );

                const passed = percentage >= 50;

                return (
                  <article
                    key={attempt.id}
                    style={{
                      border: "1px solid #edf0f6",
                      borderRadius: "18px",
                      padding: "18px",
                      background: "#fbfcfe",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "15px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "13px",
                          alignItems: "flex-start",
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "14px",
                            background: isExam
                              ? "#f5ead0"
                              : "#eef1f7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "21px",
                            flexShrink: 0,
                          }}
                        >
                          {isExam ? "📋" : "📝"}
                        </div>

                        <div>
                          <div
                            style={{
                              display: "flex",
                              gap: "7px",
                              alignItems: "center",
                              flexWrap: "wrap",
                              marginBottom: "5px",
                            }}
                          >
                            <span
                              style={{
                                color: "#9b7a18",
                                fontSize: "10px",
                                fontWeight: "900",
                              }}
                            >
                              {isExam
                                ? "اختبار"
                                : "واجب"}
                            </span>

                            <span
                              style={{
                                color: "#a0a6b2",
                                fontSize: "10px",
                              }}
                            >
                              •
                            </span>

                            <span
                              style={{
                                color: "#858c9c",
                                fontSize: "10px",
                              }}
                            >
                              {attempt.user.grade ||
                                "غير محدد"}
                            </span>
                          </div>

                          <h3
                            style={{
                              margin: "0 0 6px",
                              fontSize: "16px",
                              lineHeight: 1.5,
                            }}
                          >
                            {title}
                          </h3>

                          <div
                            style={{
                              color: "#858c9c",
                              fontSize: "11px",
                              lineHeight: 1.8,
                            }}
                          >
                            {attempt.user.firstName}{" "}
                            {attempt.user.middleName
                              ? `${attempt.user.middleName} `
                              : ""}
                            {attempt.user.lastName}
                            {" • "}
                            {attempt.user.phone}
                          </div>

                          <div
                            style={{
                              color: "#a0a6b2",
                              fontSize: "10px",
                              marginTop: "4px",
                            }}
                          >
                            {courseTitle}
                            {" • "}
                            {unitTitle}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          textAlign: "center",
                          minWidth: "100px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "25px",
                            fontWeight: "900",
                            color: passed
                              ? "#26734d"
                              : "#b24b4b",
                          }}
                        >
                          {percentage}%
                        </div>

                        <div
                          style={{
                            color: "#858c9c",
                            fontSize: "10px",
                          }}
                        >
                          {attempt.score} /{" "}
                          {attempt.totalPoints}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginTop: "15px",
                        paddingTop: "13px",
                        borderTop:
                          "1px solid #edf0f6",
                      }}
                    >
                      <span
                        style={{
                          background: passed
                            ? "#e9f8ef"
                            : "#fff0f0",
                          color: passed
                            ? "#26734d"
                            : "#b24b4b",
                          padding: "7px 11px",
                          borderRadius: "10px",
                          fontSize: "10px",
                          fontWeight: "900",
                        }}
                      >
                        {passed
                          ? "نتيجة جيدة"
                          : "يحتاج إلى مراجعة"}
                      </span>

                      <span
                        style={{
                          color: "#858c9c",
                          fontSize: "10px",
                        }}
                      >
                        {attempt.submittedAt
                          ? new Date(
                              attempt.submittedAt
                            ).toLocaleString("ar-EG")
                          : "غير محدد"}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
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
        منصة أ/ عمرو موسى — إدارة النتائج
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
  value: number | string;
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "20px",
        border: "1px solid #edf0f6",
        boxShadow:
          "0 10px 30px rgba(0,0,0,0.04)",
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
          fontSize: "25px",
          fontWeight: "900",
        }}
      >
        {value}
      </div>
    </div>
  );
}