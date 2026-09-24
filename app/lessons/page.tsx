import { requireActiveSubscription } from "@/src/lib/access";
import { prisma } from "@/src/lib/prisma";

export default async function LessonsPage() {
  await requireActiveSubscription();
  const lessons = await prisma.lesson.findMany({
    include: {
      unit: {
        include: {
          course: true,
        },
      },
      files: true,
      assignments: true,
    },
  });

  const publishedLessons = lessons
    .filter((lesson) => lesson.isPublished)
    .filter((lesson) => lesson.unit.isPublished)
    .filter((lesson) => lesson.unit.course.isPublished)
    .sort((a, b) => {
      if (a.unit.order !== b.unit.order) {
        return a.unit.order - b.unit.order;
      }

      return a.order - b.order;
    });

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            background: "#101a3a",
            color: "white",
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
              margin: 0,
              fontSize: "32px",
              marginBottom: "12px",
            }}
          >
            المحاضرات
          </h1>

          <p
            style={{
              margin: 0,
              color: "#d7dbea",
              fontSize: "16px",
            }}
          >
            جميع المحاضرات المتاحة لك في اللغة العربية.
          </p>
        </header>

        {publishedLessons.length === 0 ? (
          <section
            style={{
              background: "white",
              borderRadius: "22px",
              padding: "60px 30px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                fontSize: "50px",
                marginBottom: "15px",
              }}
            >
              📚
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                color: "#101a3a",
              }}
            >
              لا توجد محاضرات متاحة حاليًا
            </h2>

            <p
              style={{
                margin: 0,
                color: "#777",
              }}
            >
              سيتم إضافة المحاضرات من الإدارة قريبًا.
            </p>
          </section>
        ) : (
          <section
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {publishedLessons.map((lesson) => {
              const assignmentsCount = lesson.assignments.filter(
                (assignment) => assignment.isPublished
              ).length;

              return (
                <article
                  key={lesson.id}
                  style={{
                    background: "white",
                    borderRadius: "22px",
                    padding: "25px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                    border: "1px solid #edf0f6",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      background: "#f5ead0",
                      color: "#9b7a18",
                      padding: "7px 12px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: "700",
                      marginBottom: "15px",
                    }}
                  >
                    {lesson.unit.course.grade || "اللغة العربية"}
                  </div>

                  <h2
                    style={{
                      color: "#101a3a",
                      fontSize: "21px",
                      margin: "0 0 10px",
                    }}
                  >
                    {lesson.title}
                  </h2>

                  <p
                    style={{
                      color: "#70778a",
                      lineHeight: 1.8,
                      minHeight: "55px",
                      margin: "0 0 18px",
                    }}
                  >
                    {lesson.description ||
                      "محاضرة من محاضرات منهج اللغة العربية."}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
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
                      📁 {lesson.files.length} ملف
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
                      📝 {assignmentsCount} واجب
                    </span>

                    {lesson.duration ? (
                      <span
                        style={{
                          background: "#f3f5f9",
                          padding: "8px 11px",
                          borderRadius: "10px",
                          fontSize: "13px",
                          color: "#555",
                        }}
                      >
                        ⏱️ {lesson.duration} دقيقة
                      </span>
                    ) : null}
                  </div>

                  <a
                    href={`/courses/${lesson.unit.course.id}/lesson/${lesson.id}`}
                    style={{
                      display: "block",
                      textAlign: "center",
                      background: "#101a3a",
                      color: "white",
                      textDecoration: "none",
                      padding: "13px",
                      borderRadius: "13px",
                      fontWeight: "700",
                    }}
                  >
                    دخول المحاضرة
                  </a>
                </article>
              );
            })}
          </section>
        )}

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