"use client";

import { useEffect, useMemo, useState } from "react";

type Plan = {
  id: string;
  plan: "MONTHLY" | "TERM" | "ANNUAL";
  name: string;
  price: string | number;
  durationDays: number;
  isActive: boolean;
};

type Subscription = {
  id: string;
  plan: "MONTHLY" | "TERM" | "ANNUAL";
  startsAt: string;
  expiresAt: string;
  amount: string | number;
};

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_TEACHER_WHATSAPP || "";

function formatPrice(value: string | number) {
  return new Intl.NumberFormat("ar-EG", {
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

function getPlanDurationText(plan: Plan) {
  if (plan.plan === "MONTHLY") {
    return "شهر كامل";
  }

  if (plan.plan === "ANNUAL") {
    return "سنة كاملة";
  }

  return `مدة ${plan.durationDays} يوم`;
}

function getSubscriptionPlanName(plan: Subscription["plan"]) {
  if (plan === "MONTHLY") {
    return "الاشتراك الشهري";
  }

  if (plan === "ANNUAL") {
    return "الاشتراك السنوي";
  }

  return "اشتراك الترم";
}

function whatsappUrl(plan: Plan) {
  if (!WHATSAPP_NUMBER) return "#";

  const durationText = getPlanDurationText(plan);

  const message =
    `السلام عليكم ورحمة الله وبركاته\n\n` +
    `أرغب في طلب كود تفعيل للاشتراك في منصة أ/ عمرو موسى.\n\n` +
    `الخطة المطلوبة: ${plan.name}\n` +
    `مدة الاشتراك: ${durationText}\n` +
    `السعر: ${formatPrice(plan.price)} جنيه\n\n` +
    `نوع الاشتراك: اشتراك شامل لجميع محتويات المنصة.\n\n` +
    `برجاء إرسال كود التفعيل بعد إتمام الطلب.\n` +
    `وشكرًا لحضرتك.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;
}

export default function SubscribeClient() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] =
    useState<Subscription | null>(null);

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const activePlans = useMemo(
    () => plans.filter((plan) => plan.isActive),
    [plans]
  );

  async function load() {
    try {
      setLoading(true);
      setError("");

      const [plansResponse, statusResponse] =
        await Promise.all([
          fetch("/api/subscriptions/plans", {
            cache: "no-store",
          }),
          fetch("/api/subscriptions/status", {
            cache: "no-store",
          }),
        ]);

      const plansData = await plansResponse.json();
      const statusData = await statusResponse.json();

      if (!plansResponse.ok || !plansData.success) {
        throw new Error(
          plansData.message ||
            "تعذر تحميل خطط الاشتراك."
        );
      }

      if (!statusResponse.ok || !statusData.success) {
        throw new Error(
          statusData.message ||
            "تعذر تحميل حالة الاشتراك."
        );
      }

      setPlans(plansData.plans || []);

      setSubscription(
        statusData.active
          ? statusData.subscription
          : null
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء تحميل الاشتراكات."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  async function activateCode() {
    const normalized = code.trim().toUpperCase();

    if (!normalized) {
      setError("من فضلك أدخل كود الاشتراك.");
      setMessage("");
      return;
    }

    try {
      setActivating(true);
      setError("");
      setMessage("");

      const response = await fetch(
        "/api/subscriptions/activate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: normalized,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "تعذر تفعيل الاشتراك."
        );
      }

      setMessage(
        `تم تفعيل الاشتراك بنجاح حتى ${formatDate(
          data.subscription.expiresAt
        )}.`
      );

      setCode("");
      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء تفعيل الاشتراك."
      );
    } finally {
      setActivating(false);
    }
  }

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#f7f8fc 0%,#fff 100%)",
        padding: "35px 18px 70px",
        fontFamily: "Arial,Tahoma,sans-serif",
        color: "#172033",
      }}
    >
      <div
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
        }}
      >
        <section
          style={{
            textAlign: "center",
            marginBottom: "35px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "#eef2ff",
              color: "#4f46e5",
              padding: "7px 14px",
              borderRadius: "999px",
              fontWeight: 800,
              fontSize: "13px",
              marginBottom: "12px",
            }}
          >
            منصة أ/ عمرو موسى
          </div>

          <h1
            style={{
              fontSize: "34px",
              margin: 0,
              fontWeight: 900,
            }}
          >
            اشتراك المنصة
          </h1>

          <p
            style={{
              color: "#667085",
              marginTop: "10px",
              lineHeight: 1.8,
            }}
          >
            اختر خطة الاشتراك المناسبة، اطلب كود التفعيل
            من المدرس عبر WhatsApp، ثم أدخل الكود هنا.
          </p>
        </section>

        {message && (
          <div
            style={{
              maxWidth: "850px",
              margin: "0 auto 18px",
              background: "#ecfdf3",
              border: "1px solid #abefc6",
              color: "#067647",
              borderRadius: "15px",
              padding: "14px 16px",
              fontWeight: 800,
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              maxWidth: "850px",
              margin: "0 auto 18px",
              background: "#fef3f2",
              border: "1px solid #fecdca",
              color: "#b42318",
              borderRadius: "15px",
              padding: "14px 16px",
              fontWeight: 800,
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e4e7ec",
              borderRadius: "22px",
              padding: "45px",
              textAlign: "center",
              color: "#667085",
            }}
          >
            جاري تحميل الاشتراك...
          </div>
        ) : (
          <>
            {subscription && (
              <section
                style={{
                  background:
                    "linear-gradient(135deg,#111827,#312e81)",
                  color: "#fff",
                  borderRadius: "24px",
                  padding: "25px",
                  marginBottom: "25px",
                  boxShadow:
                    "0 18px 45px rgba(15,23,42,.15)",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    opacity: 0.8,
                    marginBottom: "8px",
                  }}
                >
                  اشتراكك الحالي
                </div>

                <h2
                  style={{
                    margin: "0 0 12px",
                    fontSize: "25px",
                  }}
                >
                  اشتراك المنصة مفعل
                </h2>

                <div
                  style={{
                    display: "grid",
                    gap: "7px",
                    fontSize: "14px",
                    opacity: 0.95,
                  }}
                >
                  <div>
                    الخطة:{" "}
                    <strong>
                      {getSubscriptionPlanName(
                        subscription.plan
                      )}
                    </strong>
                  </div>

                  <div>
                    يبدأ:{" "}
                    <strong>
                      {formatDate(
                        subscription.startsAt
                      )}
                    </strong>
                  </div>

                  <div>
                    ينتهي:{" "}
                    <strong>
                      {formatDate(
                        subscription.expiresAt
                      )}
                    </strong>
                  </div>
                </div>
              </section>
            )}

            <section
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(250px,1fr))",
                gap: "18px",
                marginBottom: "28px",
              }}
            >
              {activePlans.map((plan) => (
                <article
                  key={plan.id}
                  style={{
                    background: "#fff",
                    border: "1px solid #e4e7ec",
                    borderRadius: "22px",
                    padding: "23px",
                    boxShadow:
                      "0 10px 35px rgba(15,23,42,.06)",
                  }}
                >
                  <div
                    style={{
                      color: "#667085",
                      fontSize: "13px",
                      marginBottom: "7px",
                    }}
                  >
                    خطة الاشتراك
                  </div>

                  <h2
                    style={{
                      margin: 0,
                      fontSize: "22px",
                    }}
                  >
                    {plan.name}
                  </h2>

                  <div
                    style={{
                      margin: "18px 0 8px",
                      fontSize: "30px",
                      fontWeight: 900,
                    }}
                  >
                    {formatPrice(plan.price)}
                    <span
                      style={{
                        fontSize: "13px",
                        marginRight: "5px",
                        color: "#667085",
                      }}
                    >
                      جنيه
                    </span>
                  </div>

                  <div
                    style={{
                      color: "#667085",
                      fontSize: "13px",
                      marginBottom: "17px",
                    }}
                  >
                    {getPlanDurationText(plan)}
                  </div>

                  <a
                    aria-label={`طلب كود ${plan.name} عبر واتساب`}
                    href={whatsappUrl(plan)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) => {
                      if (!WHATSAPP_NUMBER) {
                        event.preventDefault();
                        setError(
                          "رقم WhatsApp الخاص بالمدرس لم يتم ضبطه بعد."
                        );
                      }
                    }}
                    style={{
                      display: "block",
                      textAlign: "center",
                      textDecoration: "none",
                      background: "#16a34a",
                      color: "#fff",
                      borderRadius: "12px",
                      padding: "12px",
                      fontWeight: 900,
                    }}
                  >
                    الحصول على الكود عبر واتساب
                  </a>
                </article>
              ))}
            </section>

            <section
              style={{
                maxWidth: "700px",
                margin: "0 auto",
                background: "#fff",
                border: "1px solid #e4e7ec",
                borderRadius: "22px",
                padding: "25px",
                boxShadow:
                  "0 10px 35px rgba(15,23,42,.05)",
              }}
            >
              <h2
                style={{
                  margin: "0 0 8px",
                  fontSize: "21px",
                }}
              >
                لديك كود اشتراك؟
              </h2>

              <p
                style={{
                  margin: "0 0 18px",
                  color: "#667085",
                  fontSize: "13px",
                }}
              >
                أدخل الكود الذي استلمته من المدرس لتفعيل
                الاشتراك.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <input
                  value={code}
                  onChange={(event) =>
                    setCode(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      activateCode();
                    }
                  }}
                  placeholder="XXXX-XXXX-XXXX"
                  dir="ltr"
                  style={{
                    flex: 1,
                    minWidth: "230px",
                    border:
                      "1px solid #d0d5dd",
                    borderRadius: "12px",
                    padding: "13px",
                    fontSize: "15px",
                    fontWeight: 800,
                    letterSpacing: "1px",
                    textAlign: "center",
                    outline: "none",
                  }}
                />

                <button
                  type="button"
                  onClick={activateCode}
                  disabled={activating}
                  style={{
                    border: 0,
                    borderRadius: "12px",
                    padding: "13px 22px",
                    background: activating
                      ? "#98a2b3"
                      : "#4f46e5",
                    color: "#fff",
                    fontWeight: 900,
                    cursor: activating
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  {activating
                    ? "جاري التفعيل..."
                    : "تفعيل الاشتراك"}
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

