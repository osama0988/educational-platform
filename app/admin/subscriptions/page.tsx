"use client";

import { useEffect, useState } from "react";

type Plan = {
  id: string;
  plan: "MONTHLY" | "TERM" | "ANNUAL";
  name: string;
  price: string | number;
  durationDays: number;
  isActive: boolean;
};

type User = {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  phone: string;
};

type Code = {
  id: string;
  code: string;
  plan: "MONTHLY" | "TERM" | "ANNUAL";
  price: string | number;
  durationDays: number;
  isUsed: boolean;
  isActive: boolean;
  usedByUser: User | null;
  usedAt: string | null;
  codeExpiresAt: string | null;
  createdAt: string;
};

const plansOrder = ["MONTHLY", "TERM", "ANNUAL"] as const;

function planName(plan: string) {
  if (plan === "MONTHLY") return "شهري";
  if (plan === "TERM") return "ترم";
  if (plan === "ANNUAL") return "سنوي";
  return plan;
}

function money(value: string | number) {
  return new Intl.NumberFormat("ar-EG", {
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function date(value: string | null) {
  if (!value) return "بدون انتهاء";

  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [codes, setCodes] = useState<Code[]>([]);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [selectedPlan, setSelectedPlan] =
    useState<"MONTHLY" | "TERM" | "ANNUAL">("MONTHLY");

  const [expiresAt, setExpiresAt] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError("");

      const [plansRes, codesRes] =
        await Promise.all([
          fetch("/api/admin/subscriptions/plans", {
            cache: "no-store",
          }),
          fetch("/api/admin/subscriptions/codes", {
            cache: "no-store",
          }),
        ]);

      const plansData = await plansRes.json();
      const codesData = await codesRes.json();

      if (!plansRes.ok || !plansData.success) {
        throw new Error(
          plansData.message ||
            "تعذر تحميل الخطط."
        );
      }

      if (!codesRes.ok || !codesData.success) {
        throw new Error(
          codesData.message ||
            "تعذر تحميل الأكواد."
        );
      }

      setPlans(plansData.plans || []);
      setCodes(codesData.codes || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء التحميل."
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

  async function savePlan(plan: Plan) {
    try {
      setBusy(true);
      setError("");
      setMessage("");

      const response = await fetch(
        "/api/admin/subscriptions/plans",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan: plan.plan,
            name: plan.name,
            price: Number(plan.price),
            durationDays: Number(plan.durationDays),
            isActive: plan.isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "تعذر حفظ الخطة."
        );
      }

      setMessage("تم حفظ الخطة.");
      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء حفظ الخطة."
      );
    } finally {
      setBusy(false);
    }
  }

  async function createCode() {
    try {
      setBusy(true);
      setError("");
      setMessage("");

      const response = await fetch(
        "/api/admin/subscriptions/codes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan: selectedPlan,
            codeExpiresAt: expiresAt
              ? new Date(expiresAt).toISOString()
              : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "تعذر إنشاء الكود."
        );
      }

      setMessage(
        `تم إنشاء الكود: ${data.code.code}`
      );

      setExpiresAt("");
      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء إنشاء الكود."
      );
    } finally {
      setBusy(false);
    }
  }

  async function toggleCode(code: Code) {
    try {
      setBusy(true);
      setError("");
      setMessage("");

      const response = await fetch(
        "/api/admin/subscriptions/codes",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: code.id,
            isActive: !code.isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "تعذر تعديل الكود."
        );
      }

      setMessage(data.message);
      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء تعديل الكود."
      );
    } finally {
      setBusy(false);
    }
  }

  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setMessage("تم نسخ الكود.");
      setError("");
    } catch {
      setError("تعذر نسخ الكود.");
    }
  }

  const unused = codes.filter(
    (code) =>
      !code.isUsed &&
      code.isActive
  ).length;

  const used = codes.filter(
    (code) => code.isUsed
  ).length;

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#f7f8fc",
        padding: "35px 18px 70px",
        fontFamily:
          "Arial,Tahoma,sans-serif",
        color: "#172033",
      }}
    >
      <div
        style={{
          maxWidth: "1250px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            margin: "0 0 8px",
            fontSize: "32px",
            fontWeight: 900,
          }}
        >
          إدارة اشتراكات المنصة
        </h1>

        <p
          style={{
            margin: "0 0 25px",
            color: "#667085",
          }}
        >
          إدارة الخطط وإنشاء أكواد تفعيل الاشتراك.
        </p>

        {message && (
          <div
            style={{
              padding: "13px 15px",
              marginBottom: "15px",
              background: "#ecfdf3",
              border: "1px solid #abefc6",
              color: "#067647",
              borderRadius: "13px",
              fontWeight: 800,
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "13px 15px",
              marginBottom: "15px",
              background: "#fef3f2",
              border: "1px solid #fecdca",
              color: "#b42318",
              borderRadius: "13px",
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
              borderRadius: "20px",
              padding: "45px",
              textAlign: "center",
            }}
          >
            جاري التحميل...
          </div>
        ) : (
          <>
            <section
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(180px,1fr))",
                gap: "14px",
                marginBottom: "22px",
              }}
            >
              <Stat
                title="إجمالي الأكواد"
                value={codes.length}
              />

              <Stat
                title="أكواد متاحة"
                value={unused}
              />

              <Stat
                title="أكواد مستخدمة"
                value={used}
              />
            </section>

            <section
              style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "22px",
                marginBottom: "22px",
                border: "1px solid #e4e7ec",
              }}
            >
              <h2 style={{ marginTop: 0 }}>
                خطط الاشتراك
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(270px,1fr))",
                  gap: "15px",
                }}
              >
                {plansOrder.map((key) => {
                  const plan = plans.find(
                    (item) =>
                      item.plan === key
                  );

                  if (!plan) {
                    return (
                      <div
                        key={key}
                        style={{
                          border: "1px dashed #d0d5dd",
                          borderRadius: "15px",
                          padding: "18px",
                        }}
                      >
                        <strong>
                          {planName(key)}
                        </strong>

                        <p
                          style={{
                            color: "#667085",
                          }}
                        >
                          الخطة غير مضافة بعد.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={plan.id}
                      style={{
                        border: "1px solid #e4e7ec",
                        borderRadius: "15px",
                        padding: "18px",
                      }}
                    >
                      <h3
                        style={{
                          marginTop: 0,
                        }}
                      >
                        {planName(plan.plan)}
                      </h3>

                      <label style={label}>
                        اسم الخطة
                        <input
                          value={plan.name}
                          onChange={(e) =>
                            setPlans((current) =>
                              current.map(
                                (item) =>
                                  item.id === plan.id
                                    ? {
                                        ...item,
                                        name: e.target.value,
                                      }
                                    : item
                              )
                            )
                          }
                          style={input}
                        />
                      </label>

                      <label style={label}>
                        السعر بالجنيه
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={plan.price}
                          onChange={(e) =>
                            setPlans((current) =>
                              current.map(
                                (item) =>
                                  item.id === plan.id
                                    ? {
                                        ...item,
                                        price: e.target.value,
                                      }
                                    : item
                              )
                            )
                          }
                          style={input}
                        />
                      </label>

                      <label style={label}>
                        المدة بالأيام
                        <input
                          type="number"
                          min="1"
                          value={plan.durationDays}
                          onChange={(e) =>
                            setPlans((current) =>
                              current.map(
                                (item) =>
                                  item.id === plan.id
                                    ? {
                                        ...item,
                                        durationDays:
                                          Number(
                                            e.target.value
                                          ),
                                      }
                                    : item
                              )
                            )
                          }
                          style={input}
                        />
                      </label>

                      <label
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginBottom: "13px",
                          fontSize: "13px",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={plan.isActive}
                          onChange={(e) =>
                            setPlans((current) =>
                              current.map(
                                (item) =>
                                  item.id === plan.id
                                    ? {
                                        ...item,
                                        isActive:
                                          e.target.checked,
                                      }
                                    : item
                              )
                            )
                          }
                        />

                        الخطة متاحة
                      </label>

                      <button
                        disabled={busy}
                        onClick={() =>
                          savePlan(plan)
                        }
                        style={button}
                      >
                        حفظ الخطة
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            <section
              style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "22px",
                marginBottom: "22px",
                border: "1px solid #e4e7ec",
              }}
            >
              <h2 style={{ marginTop: 0 }}>
                إنشاء كود اشتراك
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(220px,1fr))",
                  gap: "13px",
                }}
              >
                <label style={label}>
                  الخطة
                  <select
                    value={selectedPlan}
                    onChange={(e) =>
                      setSelectedPlan(
                        e.target.value as
                          | "MONTHLY"
                          | "TERM"
                          | "ANNUAL"
                      )
                    }
                    style={input}
                  >
                    {plansOrder.map((key) => {
                      const plan = plans.find(
                        (item) =>
                          item.plan === key
                      );

                      return (
                        <option
                          key={key}
                          value={key}
                          disabled={
                            !plan ||
                            !plan.isActive
                          }
                        >
                          {plan?.name ||
                            planName(key)}
                        </option>
                      );
                    })}
                  </select>
                </label>

                <label style={label}>
                  انتهاء صلاحية الكود
                  <input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) =>
                      setExpiresAt(
                        e.target.value
                      )
                    }
                    style={input}
                  />
                </label>

                <div
                  style={{
                    display: "flex",
                    alignItems: "end",
                  }}
                >
                  <button
                    disabled={busy}
                    onClick={createCode}
                    style={{
                      ...button,
                      width: "100%",
                    }}
                  >
                    إنشاء كود جديد
                  </button>
                </div>
              </div>
            </section>

            <section
              style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "22px",
                border: "1px solid #e4e7ec",
                overflowX: "auto",
              }}
            >
              <h2 style={{ marginTop: 0 }}>
                الأكواد
              </h2>

              {codes.length === 0 ? (
                <div
                  style={{
                    padding: "30px",
                    textAlign: "center",
                    color: "#667085",
                  }}
                >
                  لا توجد أكواد حتى الآن.
                </div>
              ) : (
                <table
                  style={{
                    width: "100%",
                    borderCollapse:
                      "collapse",
                    minWidth: "900px",
                  }}
                >
                  <thead>
                    <tr>
                      {[
                        "الكود",
                        "الخطة",
                        "السعر",
                        "الحالة",
                        "المستخدم",
                        "انتهاء الكود",
                        "الإجراء",
                      ].map((title) => (
                        <th
                          key={title}
                          style={th}
                        >
                          {title}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {codes.map((code) => (
                      <tr key={code.id}>
                        <td style={td}>
                          <div
                            style={{
                              display: "flex",
                              gap: "7px",
                              alignItems:
                                "center",
                            }}
                          >
                            <code
                              dir="ltr"
                              style={{
                                background:
                                  "#f2f4f7",
                                padding:
                                  "6px 9px",
                                borderRadius:
                                  "8px",
                                fontWeight: 900,
                              }}
                            >
                              {code.code}
                            </code>

                            <button
                              onClick={() =>
                                copy(code.code)
                              }
                              style={
                                miniButton
                              }
                            >
                              نسخ
                            </button>
                          </div>
                        </td>

                        <td style={td}>
                          {planName(
                            code.plan
                          )}
                        </td>

                        <td style={td}>
                          {money(
                            code.price
                          )}{" "}
                          جنيه
                        </td>

                        <td style={td}>
                          {code.isUsed
                            ? "مستخدم"
                            : code.isActive
                            ? "متاح"
                            : "معطل"}
                        </td>

                        <td style={td}>
                          {code.usedByUser
                            ? [
                                code.usedByUser
                                  .firstName,
                                code.usedByUser
                                  .middleName,
                                code.usedByUser
                                  .lastName,
                              ]
                                .filter(Boolean)
                                .join(" ")
                            : "لم يستخدم"}
                        </td>

                        <td style={td}>
                          {date(
                            code.codeExpiresAt
                          )}
                        </td>

                        <td style={td}>
                          {!code.isUsed && (
                            <button
                              onClick={() =>
                                toggleCode(
                                  code
                                )
                              }
                              style={{
                                ...miniButton,
                                background:
                                  code.isActive
                                    ? "#fef3f2"
                                    : "#ecfdf3",
                                color:
                                  code.isActive
                                    ? "#b42318"
                                    : "#067647",
                              }}
                            >
                              {code.isActive
                                ? "تعطيل"
                                : "تفعيل"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function Stat({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e4e7ec",
        borderRadius: "17px",
        padding: "18px",
      }}
    >
      <div
        style={{
          color: "#667085",
          fontSize: "13px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "28px",
          fontWeight: 900,
          marginTop: "5px",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const label: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "7px",
  marginBottom: "12px",
  fontSize: "13px",
  fontWeight: 700,
};

const input: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #d0d5dd",
  borderRadius: "10px",
  padding: "10px",
  background: "#fff",
};

const button: React.CSSProperties = {
  border: 0,
  borderRadius: "10px",
  padding: "11px 16px",
  background: "#4f46e5",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};

const miniButton: React.CSSProperties = {
  border: 0,
  borderRadius: "8px",
  padding: "6px 9px",
  background: "#eef2ff",
  color: "#4338ca",
  fontWeight: 800,
  cursor: "pointer",
};

const th: React.CSSProperties = {
  textAlign: "right",
  padding: "12px",
  borderBottom: "1px solid #e4e7ec",
  color: "#667085",
  fontSize: "12px",
};

const td: React.CSSProperties = {
  padding: "12px",
  borderBottom: "1px solid #f0f2f5",
  fontSize: "13px",
};