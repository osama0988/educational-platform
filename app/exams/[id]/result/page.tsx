import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ExamResultPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;
  const userId = session.user.id;

  const exam = await prisma.exam.findUnique({
    where: {
      id,
    },
    include: {
      unit: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!exam) {
    notFound();
  }

  const attempt = await prisma.assessmentAttempt.findFirst({
    where: {
      userId,
      examId: id,
      submittedAt: {
        not: null,
      },
    },
    orderBy: {
      submittedAt: "desc",
    },
  });

  if (!attempt) {
    return (
      <main
        dir="rtl"
        style={{
          minHeight: "100vh",
          background: "#f5f7fb",
          fontFamily: "Arial, sans-serif",
          color: "#101a3a",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <section
            style={{
              background: "white",
              borderRadius: "25px",
              padding: "55px 30px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              border: "1px solid #edf0f6",
            }}
          >
            <div
              style={{
                fontSize: "55px",
                marginBottom: "15px",
              }}
            >
              📊
            </div>

            <h1
              style={{
                margin: "0 0 12px",
                fontSize: "27px",
              }}
            >
              لا توجد نتيجة لهذا الاختبار
            </h1>

            <p
              style={{
                margin: "0 0 25px",
                color: "#777f91",
                lineHeight: 1.8,
                fontSize: "14px",
              }}
            >
              لم يتم تسجيل محاولة مكتملة لهذا الاختبار على حسابك حتى الآن.
            </p>

            <Link
              href={`/exams/${id}`}
              style={{
                display: "inline-block",
                background: "#101a3a",
                color: "white",
                textDecoration: "none",
                padding: "13px 25px",
                borderRadius: "13px",
                fontWeight: "800",
                fontSize: "14px",
              }}
            >
              العودة إلى الاختبار
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const percentage = Number(attempt.percentage);
  const score = Number(attempt.score);
  const totalPoints = Number(attempt.totalPoints);

  let level = "يحتاج إلى مزيد من المراجعة";
  let levelIcon = "📚";

  if (percentage >= 90) {
    level = "ممتاز";
    levelIcon = "🏆";
  } else if (percentage >= 75) {
    level = "جيد جدًا";
    levelIcon = "🌟";
  } else if (percentage >= 60) {
    level = "جيد";
    levelIcon = "👍";
  }

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
              نتيجة الاختبار
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
          maxWidth: "900px",
          margin: "0 auto",
          padding: "40px 20px 70px",
        }}
      >
        <section
          style={{
            background:
              "linear-gradient(135deg, #101a3a 0%, #172652 100%)",
            color: "white",
            borderRadius: "30px",
            padding: "40px 30px",
            textAlign: "center",
            marginBottom: "22px",
            boxShadow: "0 18px 45px rgba(16,26,58,0.15)",
          }}
        >
          <div
            style={{
              fontSize: "55px",
              marginBottom: "12px",
            }}
          >
            {levelIcon}
          </div>

          <div
            style={{
              color: "#e5c75b",
              fontSize: "13px",
              fontWeight: "700",
              marginBottom: "9px",
            }}
          >
            نتيجة الاختبار
          </div>

          <h1
            style={{
              margin: "0 0 10px",
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
            }}
          >
            {exam.unit?.course.title || "منصة أ/ عمرو موسى"}
          </p>
        </section>

        <section
          style={{
            background: "white",
            borderRadius: "25px",
            padding: "30px",
            border: "1px solid #edf0f6",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "10px 0 30px",
              borderBottom: "1px solid #edf0f6",
            }}
          >
            <div
              style={{
                color: "#9298a6",
                fontSize: "13px",
                marginBottom: "8px",
              }}
            >
              درجتك
            </div>

            <div
              style={{
                fontSize: "55px",
                fontWeight: "900",
                color: "#101a3a",
                lineHeight: 1,
              }}
            >
              {score}
              <span
                style={{
                  fontSize: "25px",
                  color: "#9298a6",
                  fontWeight: "700",
                }}
              >
                /{totalPoints}
              </span>
            </div>

            <div
              style={{
                display: "inline-block",
                marginTop: "15px",
                background: "#f5ead0",
                color: "#9b7a18",
                padding: "9px 16px",
                borderRadius: "20px",
                fontWeight: "800",
                fontSize: "14px",
              }}
            >
              {percentage.toFixed(1)}%
            </div>
          </div>

          <div
            style={{
              paddingTop: "25px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "23px",
              }}
            >
              {level}
            </h2>

            <p
              style={{
                margin: 0,
                color: "#777f91",
                fontSize: "14px",
                lineHeight: 1.8,
              }}
            >
              استمر في المذاكرة والتدريب لتحسين مستواك والوصول لأفضل نتيجة.
            </p>
          </div>
        </section>

        <section
          style={{
            background: "white",
            borderRadius: "25px",
            padding: "28px",
            border: "1px solid #edf0f6",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              margin: "0 0 20px",
              fontSize: "21px",
            }}
          >
            تفاصيل المحاولة
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
            }}
          >
            <ResultInfo
              label="الدرجة"
              value={`${score} / ${totalPoints}`}
            />

            <ResultInfo
              label="النسبة"
              value={`${percentage.toFixed(1)}%`}
            />

            <ResultInfo
              label="تاريخ التسليم"
              value={
                attempt.submittedAt
                  ? new Date(attempt.submittedAt).toLocaleString(
                      "ar-EG"
                    )
                  : "غير متاح"
              }
            />

            <ResultInfo
              label="نوع التقييم"
              value="اختبار"
            />
          </div>
        </section>

        <section
          style={{
            background: "#fffaf0",
            border: "1px solid #f0dfaa",
            borderRadius: "22px",
            padding: "23px",
            marginBottom: "25px",
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
                نصيحة دراسية
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#6f6a5b",
                  fontSize: "13px",
                  lineHeight: 1.9,
                }}
              >
                راجع الأسئلة التي أخطأت فيها، ثم أعد مذاكرة الجزء المرتبط
                بها قبل الانتقال للاختبار التالي.
              </p>
            </div>
          </div>
        </section>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/results"
            style={{
              background: "#101a3a",
              color: "white",
              textDecoration: "none",
              padding: "13px 22px",
              borderRadius: "13px",
              fontWeight: "800",
              fontSize: "14px",
            }}
          >
            كل النتائج
          </Link>

          <Link
            href="/exams"
            style={{
              background: "white",
              color: "#101a3a",
              textDecoration: "none",
              padding: "13px 22px",
              borderRadius: "13px",
              fontWeight: "800",
              fontSize: "14px",
              border: "1px solid #dfe3eb",
            }}
          >
            اختبارات أخرى
          </Link>
        </div>
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

function ResultInfo({
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
        borderRadius: "15px",
        padding: "16px",
      }}
    >
      <div
        style={{
          color: "#9298a6",
          fontSize: "11px",
          marginBottom: "7px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: "#101a3a",
          fontSize: "14px",
          fontWeight: "800",
          lineHeight: 1.6,
        }}
      >
        {value}
      </div>
    </div>
  );
}