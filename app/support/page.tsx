import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import SupportClient from "./SupportClient";

function statusLabel(status: string) {
  if (status === "OPEN") return "مفتوح";
  if (status === "IN_PROGRESS") return "قيد المتابعة";
  if (status === "RESOLVED") return "تم الحل";
  return "مغلق";
}

function statusStyle(status: string) {
  if (status === "OPEN") {
    return {
      background: "#fff4d6",
      color: "#9b7a18",
    };
  }

  if (status === "IN_PROGRESS") {
    return {
      background: "#e9f1ff",
      color: "#315c9e",
    };
  }

  if (status === "RESOLVED") {
    return {
      background: "#e9f8ef",
      color: "#26734d",
    };
  }

  return {
    background: "#f0f1f5",
    color: "#666",
  };
}

function categoryLabel(category: string) {
  if (category === "TECHNICAL") return "مشكلة تقنية";
  if (category === "LESSON") return "مشكلة في محاضرة أو محتوى";
  if (category === "PAYMENT") return "الاشتراكات";
  if (category === "OTHER") return "أخرى";

  return category;
}

function formatDate(date: Date) {
  return date.toLocaleString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function SupportPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      firstName: true,
      role: true,
      status: true,
      supportTickets: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (
    !user ||
    user.role !== "STUDENT" ||
    user.status !== "ACTIVE"
  ) {
    redirect("/login");
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
      {/* ================= HEADER ================= */}

      <header
        style={{
          background: "#101a3a",
          color: "white",
          padding: "18px 24px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
          position: "sticky",
          top: 0,
          zIndex: 20,
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
              الدعم والمساعدة
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

      {/* ================= CONTENT ================= */}

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "40px 20px 60px",
        }}
      >
        {/* ================= HERO ================= */}

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
            مركز المساعدة
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "32px",
              lineHeight: 1.4,
            }}
          >
            محتاج مساعدة يا {user.firstName}؟
          </h1>

          <p
            style={{
              margin: 0,
              color: "#d7dbea",
              fontSize: "15px",
              lineHeight: 1.9,
            }}
          >
            يمكنك متابعة طلبات الدعم الخاصة بك والتواصل مع إدارة
            المنصة.
          </p>
        </section>

        {/* ================= CONTACT OPTIONS ================= */}

        <section
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "30px",
            border: "1px solid #edf0f6",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            marginBottom: "22px",
          }}
        >
          <h2
            style={{
              margin: "0 0 20px",
              fontSize: "22px",
            }}
          >
            طرق التواصل
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(230px, 1fr))",
              gap: "15px",
            }}
          >
            <div
              style={{
                background: "#f8f9fc",
                borderRadius: "18px",
                padding: "22px",
              }}
            >
              <div
                style={{
                  fontSize: "30px",
                  marginBottom: "10px",
                }}
              >
                💬
              </div>

              <h3
                style={{
                  margin: "0 0 8px",
                }}
              >
                الدعم الفني
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#777f91",
                  lineHeight: 1.7,
                  fontSize: "14px",
                }}
              >
                أرسل طلب دعم من خلال حسابك وسيتم التعامل معه
                من الإدارة.
              </p>
            </div>

            <div
              style={{
                background: "#f8f9fc",
                borderRadius: "18px",
                padding: "22px",
              }}
            >
              <div
                style={{
                  fontSize: "30px",
                  marginBottom: "10px",
                }}
              >
                📚
              </div>

              <h3
                style={{
                  margin: "0 0 8px",
                }}
              >
                مشاكل المحاضرات
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#777f91",
                  lineHeight: 1.7,
                  fontSize: "14px",
                }}
              >
                لو عندك مشكلة في محاضرة أو ملف أو واجب، اذكرها
                في طلب الدعم.
              </p>
            </div>

            <div
              style={{
                background: "#f8f9fc",
                borderRadius: "18px",
                padding: "22px",
              }}
            >
              <div
                style={{
                  fontSize: "30px",
                  marginBottom: "10px",
                }}
              >
                💳
              </div>

              <h3
                style={{
                  margin: "0 0 8px",
                }}
              >
                الاشتراكات
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#777f91",
                  lineHeight: 1.7,
                  fontSize: "14px",
                }}
              >
                لأي مشكلة متعلقة بالاشتراك، أرسل طلبًا
                للإدارة.
              </p>
            </div>
          </div>
        </section>

        <section style={{ background: "white", borderRadius: "24px", padding: "30px", border: "1px solid #edf0f6", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", marginBottom: "22px" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: "22px" }}>📞 أرقام وطرق التواصل</h2>
          <p style={{ margin: "0 0 20px", color: "#777f91", lineHeight: 1.8 }}>لو عندك مشكلة عاجلة أو محتاج مساعدة مباشرة، استخدم الطريقة المناسبة.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 14 }}>
            <a href="tel:+201274561940" style={{ textDecoration: "none", color: "inherit", background: "#f8f9fc", borderRadius: 18, padding: 20 }}><div style={{fontSize:28}}>📞</div><h3 style={{margin:"8px 0 5px"}}>اتصال مباشر</h3><div style={{fontWeight:800, color:"#172033"}}>01274561940</div><p style={{margin:"7px 0 0",fontSize:12,color:"#667085"}}>للاستفسارات والمشاكل المهمة.</p></a>
            <a href="https://wa.me/201274561940" target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "inherit", background: "#f0fdf4", borderRadius: 18, padding: 20 }}><div style={{fontSize:28}}>💬</div><h3 style={{margin:"8px 0 5px"}}>WhatsApp</h3><div style={{fontWeight:800, color:"#166534"}}>01274561940</div><p style={{margin:"7px 0 0",fontSize:12,color:"#667085"}}>للتواصل وطلب كود الاشتراك.</p></a>
            <a href="mailto:osamatahasaleh83@gmail.com" style={{ textDecoration: "none", color: "inherit", background: "#eff6ff", borderRadius: 18, padding: 20 }}><div style={{fontSize:28}}>✉️</div><h3 style={{margin:"8px 0 5px"}}>البريد الإلكتروني</h3><div style={{fontWeight:800,wordBreak:"break-word"}}>osamatahasaleh83@gmail.com</div><p style={{margin:"7px 0 0",fontSize:12,color:"#667085"}}>للمشاكل التي تحتاج شرحًا أو مرفقات.</p></a>
            <div style={{ background: "#fffbeb", borderRadius: 18, padding: 20 }}><div style={{fontSize:28}}>🕐</div><h3 style={{margin:"8px 0 5px"}}>مواعيد الدعم</h3><div style={{fontWeight:800}}>كل الأيام ما عدا الجمعة والسبت</div><p style={{margin:"7px 0 0",fontSize:12,color:"#667085"}}>يمكنك إرسال التذكرة في أي وقت.</p></div>
          </div>
        </section>

        <SupportClient />

        {/* ================= CURRENT TICKETS ================= */}

        <section
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "30px",
            border: "1px solid #edf0f6",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "15px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: "0 0 7px",
                  fontSize: "22px",
                }}
              >
                طلبات الدعم الخاصة بك
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#777f91",
                  fontSize: "14px",
                }}
              >
                يمكنك متابعة حالة الطلبات التي أرسلتها.
              </p>
            </div>

            <div
              style={{
                background: "#f5ead0",
                color: "#9b7a18",
                padding: "9px 14px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              {user.supportTickets.length} طلب
            </div>
          </div>

          {user.supportTickets.length === 0 ? (
            <div
              style={{
                background: "#f8f9fc",
                borderRadius: "18px",
                padding: "50px 25px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "48px",
                  marginBottom: "14px",
                }}
              >
                🎧
              </div>

              <h3
                style={{
                  margin: "0 0 9px",
                  fontSize: "20px",
                }}
              >
                لا توجد طلبات دعم
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#777",
                  fontSize: "14px",
                  lineHeight: 1.8,
                }}
              >
                لم تقم بإرسال أي طلب دعم حتى الآن.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "14px",
              }}
            >
              {user.supportTickets.map((ticket) => {
                const status = statusStyle(ticket.status);

                return (
                  <article
                    key={ticket.id}
                    style={{
                      border: "1px solid #edf0f6",
                      borderRadius: "18px",
                      padding: "20px",
                      background: "#fff",
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
                          flex: 1,
                        }}
                      >
                        <h3
                          style={{
                            margin: "0 0 8px",
                            fontSize: "18px",
                          }}
                        >
                          {ticket.subject}
                        </h3>

                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                            marginBottom: "10px",
                          }}
                        >
                          <span
                            style={{
                              background: "#f5f6f8",
                              color: "#697181",
                              padding: "6px 10px",
                              borderRadius: "15px",
                              fontSize: "11px",
                              fontWeight: "700",
                            }}
                          >
                            {categoryLabel(ticket.category)}
                          </span>
                        </div>

                        <div
                          style={{
                            color: "#777f91",
                            fontSize: "13px",
                            lineHeight: 1.8,
                          }}
                        >
                          {ticket.message}
                        </div>
                      </div>

                      <span
                        style={{
                          background: status.background,
                          color: status.color,
                          padding: "7px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "800",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {statusLabel(ticket.status)}
                      </span>
                    </div>

                    <div
                      style={{
                        marginTop: "15px",
                        paddingTop: "12px",
                        borderTop: "1px solid #edf0f6",
                        color: "#9298a6",
                        fontSize: "11px",
                      }}
                    >
                      تاريخ الطلب: {formatDate(ticket.createdAt)}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ================= FOOTER ================= */}

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