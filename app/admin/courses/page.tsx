import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export default async function AdminCoursesPage() {
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

  const courses = await prisma.course.findMany({
    include: {
      units: {
        include: {
          lessons: {
            select: {
              id: true,
              isPublished: true,
            },
          },
          exams: {
            select: {
              id: true,
              isPublished: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const publishedCourses = courses.filter(
    (course) => course.isPublished
  ).length;

  const totalUnits = courses.reduce(
    (total, course) => total + course.units.length,
    0
  );

  const totalLessons = courses.reduce(
    (total, course) =>
      total +
      course.units.reduce(
        (unitTotal, unit) => unitTotal + unit.lessons.length,
        0
      ),
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
              إدارة الكورسات
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
            المحتوى التعليمي
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "30px",
            }}
          >
            الكورسات
          </h1>

          <p
            style={{
              margin: 0,
              color: "#d7dbea",
              fontSize: "14px",
              lineHeight: 1.9,
            }}
          >
            إدارة كورسات اللغة العربية والوحدات والمحاضرات والاختبارات
            المرتبطة بكل كورس.
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
            icon="📚"
            title="إجمالي الكورسات"
            value={courses.length}
          />

          <InfoCard
            icon="✅"
            title="الكورسات المنشورة"
            value={publishedCourses}
          />

          <InfoCard
            icon="📖"
            title="إجمالي الوحدات"
            value={totalUnits}
          />

          <InfoCard
            icon="🎥"
            title="إجمالي المحاضرات"
            value={totalLessons}
          />
        </section>

        {courses.length === 0 ? (
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
              📚
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                fontSize: "22px",
              }}
            >
              لا توجد كورسات حتى الآن
            </h2>

            <p
              style={{
                margin: 0,
                color: "#858c9c",
                fontSize: "13px",
              }}
            >
              عند إضافة الكورسات من الإدارة ستظهر هنا.
            </p>
          </section>
        ) : (
          <section
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(310px, 1fr))",
              gap: "20px",
            }}
          >
            {courses.map((course) => {
              const unitsCount = course.units.length;

              const lessonsCount = course.units.reduce(
                (total, unit) => total + unit.lessons.length,
                0
              );

              const examsCount = course.units.reduce(
                (total, unit) => total + unit.exams.length,
                0
              );

              return (
                <article
                  key={course.id}
                  style={{
                    background: "white",
                    borderRadius: "24px",
                    padding: "22px",
                    border: "1px solid #edf0f6",
                    boxShadow:
                      "0 12px 35px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      marginBottom: "18px",
                    }}
                  >
                    <div
                      style={{
                        width: "54px",
                        height: "54px",
                        borderRadius: "16px",
                        background: "#f5ead0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "25px",
                      }}
                    >
                      📚
                    </div>

                    <span
                      style={{
                        background: course.isPublished
                          ? "#e9f8ef"
                          : "#f3f5f9",
                        color: course.isPublished
                          ? "#26734d"
                          : "#777f91",
                        padding: "7px 11px",
                        borderRadius: "18px",
                        fontSize: "11px",
                        fontWeight: "800",
                      }}
                    >
                      {course.isPublished
                        ? "منشور"
                        : "مسودة"}
                    </span>
                  </div>

                  <div
                    style={{
                      color: "#9b7a18",
                      fontSize: "11px",
                      fontWeight: "800",
                      marginBottom: "6px",
                    }}
                  >
                    {course.grade || "كل الصفوف"}
                  </div>

                  <h2
                    style={{
                      margin: "0 0 9px",
                      fontSize: "21px",
                      lineHeight: 1.5,
                    }}
                  >
                    {course.title}
                  </h2>

                  <p
                    style={{
                      margin: "0 0 18px",
                      color: "#777f91",
                      fontSize: "13px",
                      lineHeight: 1.9,
                      minHeight: "50px",
                    }}
                  >
                    {course.description ||
                      "كورس اللغة العربية على منصة أ/ عمرو موسى."}
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(2, 1fr)",
                      gap: "9px",
                      marginBottom: "18px",
                    }}
                  >
                    <MiniStat
                      label="الوحدات"
                      value={unitsCount}
                    />

                    <MiniStat
                      label="المحاضرات"
                      value={lessonsCount}
                    />

                    <MiniStat
                      label="الاختبارات"
                      value={examsCount}
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
                      href={`/courses/${course.id}`}
                      style={{
                        flex: 1,
                        minWidth: "130px",
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
                      عرض الكورس
                    </a>

                    <a
                      href="/admin/lessons"
                      style={{
                        flex: 1,
                        minWidth: "130px",
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
                      إدارة المحتوى
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
        منصة أ/ عمرو موسى — إدارة الكورسات
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
  value: number;
}) {
  return (
    <div
      style={{
        background: "#f8f9fc",
        border: "1px solid #edf0f6",
        borderRadius: "12px",
        padding: "11px",
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
          fontSize: "17px",
          fontWeight: "900",
        }}
      >
        {value}
      </div>
    </div>
  );
}


