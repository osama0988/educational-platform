import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminExamDetailsPage({
  params,
}: PageProps) {
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

  const { id } = await params;

  const exam = await prisma.exam.findUnique({
    where: { id },
    include: {
      unit: {
        include: {
          course: true,
        },
      },
      questions: {
        orderBy: {
          order: "asc",
        },
      },
      attempts: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              middleName: true,
              lastName: true,
              phone: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!exam) {
    notFound();
  }

  const submittedAttempts = exam.attempts.filter(
    (attempt) => attempt.submittedAt !== null
  );

  const averagePercentage =
    submittedAttempts.length > 0
      ? Math.round(
          submittedAttempts.reduce(
            (sum, attempt) =>
              sum + Number(attempt.percentage || 0),
            0
          ) / submittedAttempts.length
        )
      : 0;

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
              إدارة الاختبار
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
              <Link
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
              </Link>
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
        <Link
          href="/admin/exams"
          style={{
            display: "inline-block",
            color: "#8c6d12",
            textDecoration: "none",
            fontSize: "13px",
            fontWeight: "800",
            marginBottom: "18px",
          }}
        >
          ← العودة إلى الاختبارات
        </Link>

        <section
          style={{
            background:
              "linear-gradient(135deg, #101a3a 0%, #182755 100%)",
            color: "white",
            borderRadius: "28px",
            padding: "34px",
            marginBottom: "22px",
            boxShadow:
              "0 18px 45px rgba(16,26,58,0.15)",
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
            <div style={{ flex: 1 }}>
              <div
                style={{
                  color: "#e5c75b",
                  fontSize: "12px",
                  fontWeight: "800",
                  marginBottom: "9px",
                }}
              >
                {exam.unit?.course.grade ||
                  "اللغة العربية"}
              </div>

              <h1
                style={{
                  margin: "0 0 12px",
                  fontSize: "30px",
                  lineHeight: 1.5,
                }}
              >
                {exam.title}
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "#d7dbea",
                  fontSize: "14px",
                  lineHeight: 1.9,
                }}
              >
                {exam.description ||
                  "اختبار لقياس مستوى الطلاب في هذه الوحدة."}
              </p>
            </div>

            <span
              style={{
                background: exam.isPublished
                  ? "#e9f8ef"
                  : "rgba(255,255,255,0.12)",
                color: exam.isPublished
                  ? "#26734d"
                  : "#ffffff",
                padding: "9px 14px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "900",
              }}
            >
              {exam.isPublished
                ? "منشور للطلاب"
                : "غير منشور"}
            </span>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "14px",
            marginBottom: "22px",
          }}
        >
          <StatCard
            icon="📄"
            label="عدد الأسئلة"
            value={exam.questions.length}
          />

          <StatCard
            icon="⭐"
            label="إجمالي الدرجات"
            value={exam.totalPoints}
          />

          <StatCard
            icon="⏱️"
            label="مدة الاختبار"
            value={
              exam.duration
                ? `${exam.duration} دقيقة`
                : "غير محددة"
            }
          />

          <StatCard
            icon="👨‍🎓"
            label="المحاولات المسلمة"
            value={submittedAttempts.length}
          />

          <StatCard
            icon="📊"
            label="متوسط النتائج"
            value={`${averagePercentage}%`}
          />
        </section>

        <section
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "25px",
            border: "1px solid #edf0f6",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.04)",
            marginBottom: "22px",
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
              معلومات الاختبار
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: "22px",
              }}
            >
              بيانات الاختبار
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
            }}
          >
            <InfoRow
              label="الكورس"
              value={
                exam.unit?.course.title ||
                "غير محدد"
              }
            />

            <InfoRow
              label="الوحدة"
              value={
                exam.unit?.title ||
                "غير محددة"
              }
            />

            <InfoRow
              label="المادة"
              value={
                exam.unit?.course.subject ||
                "اللغة العربية"
              }
            />

            <InfoRow
              label="الصف الدراسي"
              value={
                exam.unit?.course.grade ||
                "غير محدد"
              }
            />

            <InfoRow
              label="بداية الاختبار"
              value={
                exam.startsAt
                  ? new Date(
                      exam.startsAt
                    ).toLocaleString("ar-EG")
                  : "غير محددة"
              }
            />

            <InfoRow
              label="نهاية الاختبار"
              value={
                exam.endsAt
                  ? new Date(
                      exam.endsAt
                    ).toLocaleString("ar-EG")
                  : "غير محددة"
              }
            />
          </div>
        </section>

        <section
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "25px",
            border: "1px solid #edf0f6",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.04)",
            marginBottom: "22px",
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
              محتوى الاختبار
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: "22px",
              }}
            >
              الأسئلة
            </h2>
          </div>

          {exam.questions.length === 0 ? (
            <div
              style={{
                background: "#f8f9fc",
                borderRadius: "16px",
                padding: "35px 20px",
                textAlign: "center",
                color: "#777f91",
                fontSize: "14px",
              }}
            >
              لا توجد أسئلة مضافة إلى هذا الاختبار حتى الآن.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "15px",
              }}
            >
              {exam.questions.map((question, index) => (
                <div
                  key={question.id}
                  style={{
                    border: "1px solid #edf0f6",
                    borderRadius: "18px",
                    padding: "20px",
                    background: "#fbfcfe",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                      marginBottom: "15px",
                    }}
                  >
                    <span
                      style={{
                        background: "#101a3a",
                        color: "white",
                        padding: "7px 11px",
                        borderRadius: "10px",
                        fontSize: "11px",
                        fontWeight: "900",
                      }}
                    >
                      السؤال {index + 1}
                    </span>

                    <span
                      style={{
                        color: "#9b7a18",
                        fontSize: "12px",
                        fontWeight: "900",
                      }}
                    >
                      {question.points} درجة
                    </span>
                  </div>

                  <h3
                    style={{
                      margin: "0 0 15px",
                      fontSize: "16px",
                      lineHeight: 1.8,
                    }}
                  >
                    {question.question}
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: "9px",
                    }}
                  >
                    <Option
                      letter="أ"
                      text={question.optionA}
                      correct={
                        question.correctAnswer === "A"
                      }
                    />

                    <Option
                      letter="ب"
                      text={question.optionB}
                      correct={
                        question.correctAnswer === "B"
                      }
                    />

                    <Option
                      letter="ج"
                      text={question.optionC}
                      correct={
                        question.correctAnswer === "C"
                      }
                    />

                    <Option
                      letter="د"
                      text={question.optionD}
                      correct={
                        question.correctAnswer === "D"
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

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
              متابعة الطلاب
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: "22px",
              }}
            >
              آخر المحاولات
            </h2>
          </div>

          {submittedAttempts.length === 0 ? (
            <div
              style={{
                background: "#f8f9fc",
                borderRadius: "16px",
                padding: "35px 20px",
                textAlign: "center",
                color: "#777f91",
                fontSize: "14px",
              }}
            >
              لا توجد محاولات مسلمة لهذا الاختبار حتى الآن.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "10px",
              }}
            >
              {submittedAttempts.slice(0, 10).map(
                (attempt) => (
                  <div
                    key={attempt.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "15px",
                      flexWrap: "wrap",
                      padding: "15px",
                      borderRadius: "15px",
                      background: "#f8f9fc",
                      border: "1px solid #edf0f6",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: "900",
                          fontSize: "14px",
                          marginBottom: "4px",
                        }}
                      >
                        {attempt.user.firstName}{" "}
                        {attempt.user.middleName
                          ? `${attempt.user.middleName} `
                          : ""}
                        {attempt.user.lastName}
                      </div>

                      <div
                        style={{
                          color: "#858c9c",
                          fontSize: "11px",
                        }}
                      >
                        {attempt.user.phone}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span
                        style={{
                          background: "#e9f8ef",
                          color: "#26734d",
                          padding: "7px 10px",
                          borderRadius: "10px",
                          fontSize: "12px",
                          fontWeight: "900",
                        }}
                      >
                        {Number(
                          attempt.percentage || 0
                        )}
                        %
                      </span>

                      <span
                        style={{
                          color: "#555",
                          fontSize: "11px",
                        }}
                      >
                        {attempt.score} /{" "}
                        {attempt.totalPoints}
                      </span>
                    </div>
                  </div>
                )
              )}
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
        منصة أ/ عمرو موسى — إدارة الاختبارات
      </footer>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
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
          width: "43px",
          height: "43px",
          borderRadius: "13px",
          background: "#f5ead0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "19px",
          marginBottom: "11px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#858c9c",
          fontSize: "11px",
          marginBottom: "6px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "22px",
          fontWeight: "900",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function InfoRow({
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
          fontSize: "10px",
          marginBottom: "6px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: "#101a3a",
          fontSize: "13px",
          fontWeight: "800",
          lineHeight: 1.6,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Option({
  letter,
  text,
  correct,
}: {
  letter: string;
  text: string;
  correct: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "9px",
        padding: "11px",
        borderRadius: "12px",
        border: correct
          ? "1px solid #d4af37"
          : "1px solid #edf0f6",
        background: correct
          ? "#fff9e8"
          : "white",
      }}
    >
      <span
        style={{
          width: "27px",
          height: "27px",
          borderRadius: "8px",
          background: correct
            ? "#d4af37"
            : "#eef1f6",
          color: correct
            ? "white"
            : "#555",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "11px",
          fontWeight: "900",
          flexShrink: 0,
        }}
      >
        {letter}
      </span>

      <span
        style={{
          color: "#4f5666",
          fontSize: "12px",
          lineHeight: 1.7,
          fontWeight: correct ? "800" : "500",
        }}
      >
        {text}
      </span>

      {correct ? (
        <span
          style={{
            marginRight: "auto",
            color: "#9b7a18",
            fontSize: "10px",
            fontWeight: "900",
          }}
        >
          الإجابة الصحيحة
        </span>
      ) : null}
    </div>
  );
}