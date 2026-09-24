import { requireActiveSubscription } from "@/src/lib/access";
import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export default async function ExamsPage() {
  await requireActiveSubscription();
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const exams = await prisma.exam.findMany({
    include: {
      unit: {
        include: {
          course: true,
        },
      },
      questions: true,
      attempts: true,
    },
  });

  const publishedExams = exams
    .filter((exam) => exam.isPublished)
    .filter((exam) => !exam.unit || exam.unit.isPublished)
    .filter((exam) => !exam.unit || exam.unit.course.isPublished)
    .sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
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
              الاختبارات
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
              <a
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
              </a>
            ))}
          </nav>
        </div>
      </header>

      <div
        style={{
          maxWidth: "1150px",
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
            قياس مستواك
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "32px",
              lineHeight: 1.4,
            }}
          >
            الاختبارات
          </h1>

          <p
            style={{
              margin: 0,
              color: "#d7dbea",
              fontSize: "15px",
              lineHeight: 1.9,
            }}
          >
            اختبر فهمك للمنهج وتابع نتائجك ومستواك الدراسي.
          </p>
        </section>

        {publishedExams.length === 0 ? (
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
                fontSize: "23px",
              }}
            >
              لا توجد اختبارات متاحة حاليًا
            </h2>

            <p
              style={{
                margin: 0,
                color: "#777f91",
                fontSize: "14px",
              }}
            >
              سيتم إضافة الاختبارات من إدارة المنصة قريبًا.
            </p>
          </section>
        ) : (
          <section
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {publishedExams.map((exam) => {
              const course = exam.unit?.course;
              const unit = exam.unit;

              return (
                <article
                  key={exam.id}
                  style={{
                    background: "white",
                    borderRadius: "23px",
                    padding: "25px",
                    border: "1px solid #edf0f6",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                      marginBottom: "18px",
                    }}
                  >
                    <span
                      style={{
                        background: "#f5ead0",
                        color: "#9b7a18",
                        padding: "7px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "800",
                      }}
                    >
                      اختبار
                    </span>

                    <span
                      style={{
                        color: "#7d8493",
                        fontSize: "12px",
                      }}
                    >
                      {exam.questions.length} سؤال
                    </span>
                  </div>

                  <h2
                    style={{
                      margin: "0 0 10px",
                      fontSize: "21px",
                      lineHeight: 1.5,
                    }}
                  >
                    {exam.title}
                  </h2>

                  <p
                    style={{
                      margin: "0 0 16px",
                      color: "#70778a",
                      fontSize: "14px",
                      lineHeight: 1.8,
                      minHeight: "50px",
                    }}
                  >
                    {exam.description ||
                      "اختبار لقياس مدى فهمك واستيعابك لمحتوى المنهج."}
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(2, minmax(0, 1fr))",
                      gap: "10px",
                      marginBottom: "18px",
                    }}
                  >
                    <div
                      style={{
                        background: "#f8f9fc",
                        borderRadius: "13px",
                        padding: "12px",
                      }}
                    >
                      <div
                        style={{
                          color: "#9298a6",
                          fontSize: "11px",
                          marginBottom: "5px",
                        }}
                      >
                        الدرجة
                      </div>

                      <strong
                        style={{
                          fontSize: "15px",
                        }}
                      >
                        {exam.totalPoints}
                      </strong>
                    </div>

                    <div
                      style={{
                        background: "#f8f9fc",
                        borderRadius: "13px",
                        padding: "12px",
                      }}
                    >
                      <div
                        style={{
                          color: "#9298a6",
                          fontSize: "11px",
                          marginBottom: "5px",
                        }}
                      >
                        المدة
                      </div>

                      <strong
                        style={{
                          fontSize: "15px",
                        }}
                      >
                        {exam.duration
                          ? `${exam.duration} دقيقة`
                          : "مفتوحة"}
                      </strong>
                    </div>
                  </div>

                  {(course || unit) && (
                    <div
                      style={{
                        background: "#fffaf0",
                        border: "1px solid #f0dfaa",
                        borderRadius: "14px",
                        padding: "12px",
                        marginBottom: "18px",
                        fontSize: "12px",
                        color: "#777",
                        lineHeight: 1.8,
                      }}
                    >
                      {course?.title && (
                        <div>
                          <strong style={{ color: "#101a3a" }}>
                            الكورس:
                          </strong>{" "}
                          {course.title}
                        </div>
                      )}

                      {unit?.title && (
                        <div>
                          <strong style={{ color: "#101a3a" }}>
                            الوحدة:
                          </strong>{" "}
                          {unit.title}
                        </div>
                      )}
                    </div>
                  )}

                  <a
                    href={`/exams/${exam.id}`}
                    style={{
                      display: "block",
                      textAlign: "center",
                      background: "#101a3a",
                      color: "white",
                      textDecoration: "none",
                      padding: "13px",
                      borderRadius: "13px",
                      fontWeight: "800",
                      fontSize: "14px",
                    }}
                  >
                    دخول الاختبار
                  </a>
                </article>
              );
            })}
          </section>
        )}

        <section
          style={{
            marginTop: "25px",
            background: "white",
            borderRadius: "22px",
            padding: "25px",
            border: "1px solid #edf0f6",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
            }}
          >
            <div style={{ fontSize: "28px" }}>💡</div>

            <div>
              <h3
                style={{
                  margin: "0 0 7px",
                  fontSize: "18px",
                }}
              >
                نصيحة قبل الاختبار
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#777f91",
                  fontSize: "14px",
                  lineHeight: 1.9,
                }}
              >
                راجع المحاضرات والواجبات جيدًا قبل بدء الاختبار، وخذ وقتك
                في قراءة كل سؤال واختيار الإجابة المناسبة.
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