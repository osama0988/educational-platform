import { requireActiveSubscription } from "@/src/lib/access";
import { prisma } from "@/src/lib/prisma";

export default async function AssignmentsPage() {
  await requireActiveSubscription();
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
    },
  });

  const publishedAssignments = assignments
    .filter((assignment) => assignment.isPublished)
    .filter((assignment) => {
      if (!assignment.lesson) return false;
      if (!assignment.lesson.isPublished) return false;
      if (!assignment.lesson.unit.isPublished) return false;
      if (!assignment.lesson.unit.course.isPublished) return false;

      return true;
    })
    .sort((a, b) => {
      const aDate = a.createdAt.getTime();
      const bDate = b.createdAt.getTime();

      return bDate - aDate;
    });

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        fontFamily: "Arial, sans-serif",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <header
          style={{
            background: "#101a3a",
            color: "#fff",
            borderRadius: "24px",
            padding: "35px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              color: "#d4af37",
              fontWeight: "700",
              marginBottom: "10px",
            }}
          >
            منصة أ/ عمرو موسى
          </div>

          <h1
            style={{
              margin: "0 0 12px",
              fontSize: "32px",
            }}
          >
            الواجبات
          </h1>

          <p
            style={{
              margin: 0,
              color: "#d8dbea",
              lineHeight: 1.8,
            }}
          >
            حل واجباتك وتابع تدريباتك في منهج اللغة العربية.
          </p>
        </header>

        {/* Empty state */}
        {publishedAssignments.length === 0 ? (
          <section
            style={{
              background: "#fff",
              borderRadius: "22px",
              padding: "65px 25px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
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
                color: "#101a3a",
              }}
            >
              لا توجد واجبات متاحة حاليًا
            </h2>

            <p
              style={{
                margin: 0,
                color: "#777",
              }}
            >
              سيتم إضافة الواجبات من الإدارة قريبًا.
            </p>
          </section>
        ) : (
          <>
            {/* Stats */}
            <section
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
                marginBottom: "25px",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: "18px",
                  padding: "22px",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    color: "#777",
                    fontSize: "14px",
                    marginBottom: "8px",
                  }}
                >
                  إجمالي الواجبات
                </div>

                <strong
                  style={{
                    fontSize: "28px",
                    color: "#101a3a",
                  }}
                >
                  {publishedAssignments.length}
                </strong>
              </div>

              <div
                style={{
                  background: "#fff",
                  borderRadius: "18px",
                  padding: "22px",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    color: "#777",
                    fontSize: "14px",
                    marginBottom: "8px",
                  }}
                >
                  إجمالي الأسئلة
                </div>

                <strong
                  style={{
                    fontSize: "28px",
                    color: "#101a3a",
                  }}
                >
                  {publishedAssignments.reduce(
                    (total, assignment) =>
                      total + assignment.questions.length,
                    0
                  )}
                </strong>
              </div>
            </section>

            {/* Assignments */}
            <section
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {publishedAssignments.map((assignment) => {
                const lesson = assignment.lesson;

                return (
                  <article
                    key={assignment.id}
                    style={{
                      background: "#fff",
                      borderRadius: "22px",
                      padding: "25px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                      border: "1px solid #edf0f6",
                    }}
                  >
                    {/* Course */}
                    <div
                      style={{
                        display: "inline-block",
                        background: "#f5ead0",
                        color: "#9b7a18",
                        padding: "7px 12px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: "700",
                        marginBottom: "14px",
                      }}
                    >
                      {lesson?.unit?.course?.grade ||
                        "اللغة العربية"}
                    </div>

                    {/* Title */}
                    <h2
                      style={{
                        margin: "0 0 10px",
                        color: "#101a3a",
                        fontSize: "21px",
                        lineHeight: 1.5,
                      }}
                    >
                      {assignment.title}
                    </h2>

                    {/* Description */}
                    <p
                      style={{
                        color: "#70778a",
                        lineHeight: 1.8,
                        minHeight: "55px",
                        margin: "0 0 18px",
                      }}
                    >
                      {assignment.description ||
                        "واجب تدريبي على محتوى المحاضرة."}
                    </p>

                    {/* Lesson */}
                    {lesson && (
                      <div
                        style={{
                          background: "#f7f8fb",
                          borderRadius: "13px",
                          padding: "12px",
                          marginBottom: "16px",
                          color: "#555",
                          fontSize: "14px",
                        }}
                      >
                        📚 المحاضرة:{" "}
                        <strong>{lesson.title}</strong>
                      </div>
                    )}

                    {/* Info */}
                    <div
                      style={{
                        display: "flex",
                        gap: "9px",
                        flexWrap: "wrap",
                        marginBottom: "20px",
                      }}
                    >
                      <span
                        style={{
                          background: "#f3f5f9",
                          padding: "8px 11px",
                          borderRadius: "10px",
                          fontSize: "13px",
                          color: "#555",
                        }}
                      >
                        📝 {assignment.questions.length} سؤال
                      </span>

                      <span
                        style={{
                          background: "#f3f5f9",
                          padding: "8px 11px",
                          borderRadius: "10px",
                          fontSize: "13px",
                          color: "#555",
                        }}
                      >
                        ⭐ {assignment.totalPoints} درجة
                      </span>

                      {assignment.deadline && (
                        <span
                          style={{
                            background: "#f3f5f9",
                            padding: "8px 11px",
                            borderRadius: "10px",
                            fontSize: "13px",
                            color: "#555",
                          }}
                        >
                          ⏰{" "}
                          {new Intl.DateTimeFormat("ar-EG", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }).format(assignment.deadline)}
                        </span>
                      )}
                    </div>

                    {/* Button */}
                    <a
                      href={`/assignments/${assignment.id}`}
                      style={{
                        display: "block",
                        textAlign: "center",
                        background: "#101a3a",
                        color: "#fff",
                        textDecoration: "none",
                        padding: "14px",
                        borderRadius: "13px",
                        fontWeight: "700",
                      }}
                    >
                      دخول الواجب
                    </a>
                  </article>
                );
              })}
            </section>
          </>
        )}

        {/* Footer */}
        <footer
          style={{
            textAlign: "center",
            padding: "35px 0 10px",
            color: "#777",
            fontSize: "14px",
          }}
        >
          منصة أ/ عمرو موسى — تعليم اللغة العربية
        </footer>
      </div>
    </main>
  );
}