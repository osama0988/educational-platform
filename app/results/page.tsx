import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export default async function ResultsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  const attempts = await prisma.assessmentAttempt.findMany({
    where: {
      userId,
      submittedAt: {
        not: null,
      },
    },
    include: {
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
              النتائج
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
              ["الإشعارات", "/notifications"],
              ["حسابي", "/profile"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                style={{
                  color: "white",
                  textDecoration: "none",
                  padding: "9px 12px",
                  borderRadius: "10px",
                  fontSize: "13px",
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "40px 20px 70px",
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
            متابعة مستواك
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "32px",
              lineHeight: 1.4,
            }}
          >
            نتائجك الدراسية
          </h1>

          <p
            style={{
              margin: 0,
              color: "#d7dbea",
              fontSize: "15px",
              lineHeight: 1.9,
            }}
          >
            تابع نتائج الواجبات والاختبارات التي قمت بتسليمها.
          </p>
        </section>

        {attempts.length === 0 ? (
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
              📊
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                fontSize: "23px",
              }}
            >
              لا توجد نتائج حتى الآن
            </h2>

            <p
              style={{
                margin: "0 0 22px",
                color: "#777f91",
                fontSize: "14px",
                lineHeight: 1.8,
              }}
            >
              بعد تسليم واجب أو اختبار وظهور نتيجته ستظهر هنا.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/assignments"
                style={{
                  background: "#101a3a",
                  color: "white",
                  textDecoration: "none",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  fontWeight: "800",
                  fontSize: "13px",
                }}
              >
                الواجبات
              </Link>

              <Link
                href="/exams"
                style={{
                  background: "white",
                  color: "#101a3a",
                  textDecoration: "none",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  fontWeight: "800",
                  fontSize: "13px",
                  border: "1px solid #dfe3eb",
                }}
              >
                الاختبارات
              </Link>
            </div>
          </section>
        ) : (
          <section
            style={{
              display: "grid",
              gap: "15px",
            }}
          >
            {attempts.map((attempt) => {
              const isExam = attempt.type === "EXAM";

              const title = isExam
                ? attempt.exam?.title || "اختبار"
                : attempt.assignment?.title || "واجب";

              const courseTitle = isExam
                ? attempt.exam?.unit?.course.title
                : attempt.assignment?.lesson?.unit.course.title;

              const unitTitle = isExam
                ? attempt.exam?.unit?.title
                : attempt.assignment?.lesson?.unit.title;

              const percentage = Number(attempt.percentage);
              const score = Number(attempt.score);
              const totalPoints = Number(attempt.totalPoints);

              let level = "يحتاج إلى مراجعة";
              let levelBackground = "#fff4d6";
              let levelColor = "#9b7a18";

              if (percentage >= 90) {
                level = "ممتاز";
                levelBackground = "#e9f8ef";
                levelColor = "#26734d";
              } else if (percentage >= 75) {
                level = "جيد جدًا";
                levelBackground = "#e9f1ff";
                levelColor = "#315c9e";
              } else if (percentage >= 60) {
                level = "جيد";
                levelBackground = "#eef5ff";
                levelColor = "#315c9e";
              }

              return (
                <article
                  key={attempt.id}
                  style={{
                    background: "white",
                    borderRadius: "22px",
                    padding: "23px",
                    border: "1px solid #edf0f6",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
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
                        alignItems: "flex-start",
                        gap: "14px",
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "14px",
                          background: "#f5ead0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "22px",
                          flexShrink: 0,
                        }}
                      >
                        {isExam ? "📋" : "📝"}
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
                          {isExam ? "اختبار" : "واجب"}
                        </div>

                        <h2
                          style={{
                            margin: "0 0 6px",
                            fontSize: "19px",
                          }}
                        >
                          {title}
                        </h2>

                        <div
                          style={{
                            color: "#777f91",
                            fontSize: "12px",
                            lineHeight: 1.8,
                          }}
                        >
                          {courseTitle || "اللغة العربية"}
                          {unitTitle ? ` • ${unitTitle}` : ""}
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        background: levelBackground,
                        color: levelColor,
                        padding: "7px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "800",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {level}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(170px, 1fr))",
                      gap: "10px",
                      marginTop: "20px",
                    }}
                  >
                    <ResultBox
                      label="الدرجة"
                      value={`${score} / ${totalPoints}`}
                    />

                    <ResultBox
                      label="النسبة"
                      value={`${percentage.toFixed(1)}%`}
                    />

                    <ResultBox
                      label="تاريخ التسليم"
                      value={
                        attempt.submittedAt
                          ? new Date(
                              attempt.submittedAt
                            ).toLocaleDateString("ar-EG")
                          : "غير متاح"
                      }
                    />
                  </div>

                  <div
                    style={{
                      marginTop: "18px",
                      paddingTop: "15px",
                      borderTop: "1px solid #edf0f6",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "15px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        color: "#9298a6",
                        fontSize: "12px",
                      }}
                    >
                      استمر في المراجعة والتدريب لتحسين مستواك.
                    </span>

                    {isExam && (
                      <Link
                        href={`/exams/${attempt.examId}/result`}
                        style={{
                          background: "#101a3a",
                          color: "white",
                          textDecoration: "none",
                          padding: "10px 16px",
                          borderRadius: "11px",
                          fontWeight: "800",
                          fontSize: "12px",
                        }}
                      >
                        عرض النتيجة
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}

        <section
          style={{
            marginTop: "22px",
            background: "#fffaf0",
            border: "1px solid #f0dfaa",
            borderRadius: "22px",
            padding: "23px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "13px",
            }}
          >
            <div style={{ fontSize: "27px" }}>💡</div>

            <div>
              <h3
                style={{
                  margin: "0 0 7px",
                  fontSize: "17px",
                }}
              >
                تابع تطورك
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#6f6a5b",
                  fontSize: "13px",
                  lineHeight: 1.9,
                }}
              >
                النتيجة مش مجرد رقم؛ استخدمها لمعرفة الأجزاء التي تحتاج
                إلى مراجعة وتدريب أكثر.
              </p>
            </div>
          </div>
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

function ResultBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: "#f8f9fc",
        border: "1px solid #edf0f6",
        borderRadius: "14px",
        padding: "14px",
      }}
    >
      <div
        style={{
          color: "#9298a6",
          fontSize: "11px",
          marginBottom: "6px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: "#101a3a",
          fontSize: "14px",
          fontWeight: "800",
        }}
      >
        {value}
      </div>
    </div>
  );
}