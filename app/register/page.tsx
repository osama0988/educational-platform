"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    grade: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.phone.trim() ||
      !form.password
    ) {
      setError("من فضلك أكمل البيانات المطلوبة.");
      return;
    }

    if (form.password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("تأكيد كلمة المرور غير مطابق.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          middleName: form.middleName.trim(),
          lastName: form.lastName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          password: form.password,
          grade: form.grade,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message || "حدث خطأ أثناء إنشاء الحساب."
        );
        setLoading(false);
        return;
      }

      setSuccess(
        "تم إنشاء حسابك بنجاح. سيتم تحويلك إلى تسجيل الدخول..."
      );

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch {
      setError(
        "تعذر الاتصال بالخادم. حاول مرة أخرى."
      );
      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #081126 0%, #101a3a 50%, #172653 100%)",
        padding: "35px 18px",
        fontFamily: "Arial, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: "rgba(212, 175, 55, 0.08)",
          top: "-170px",
          right: "-130px",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.04)",
          bottom: "-150px",
          left: "-110px",
        }}
      />

      <section
        style={{
          width: "100%",
          maxWidth: "650px",
          margin: "0 auto",
          background: "rgba(255, 255, 255, 0.98)",
          borderRadius: "28px",
          padding: "40px 34px",
          boxShadow:
            "0 25px 70px rgba(0, 0, 0, 0.3)",
          position: "relative",
          zIndex: 2,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              margin: "0 auto 17px",
              borderRadius: "22px",
              background: "#101a3a",
              color: "#d4af37",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "27px",
              fontWeight: "800",
              boxShadow:
                "0 12px 30px rgba(16, 26, 58, 0.2)",
            }}
          >
            أ
          </div>

          <div
            style={{
              color: "#b08b20",
              fontSize: "15px",
              fontWeight: "800",
              marginBottom: "8px",
            }}
          >
            منصة أ/ عمرو موسى
          </div>

          <h1
            style={{
              margin: "0 0 9px",
              color: "#101a3a",
              fontSize: "30px",
              fontWeight: "800",
            }}
          >
            إنشاء حساب طالب
          </h1>

          <p
            style={{
              margin: 0,
              color: "#737b8f",
              fontSize: "15px",
              lineHeight: 1.8,
            }}
          >
            أنشئ حسابك وابدأ رحلة تعلم اللغة العربية.
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#fff1f1",
              border: "1px solid #ffd3d3",
              color: "#b42318",
              borderRadius: "14px",
              padding: "13px 15px",
              marginBottom: "20px",
              fontSize: "14px",
              fontWeight: "700",
              lineHeight: 1.6,
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "#eefbf3",
              border: "1px solid #c9efd8",
              color: "#16794c",
              borderRadius: "14px",
              padding: "13px 15px",
              marginBottom: "20px",
              fontSize: "14px",
              fontWeight: "700",
              lineHeight: 1.6,
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "17px",
              marginBottom: "18px",
            }}
          >
            <Field
              label="الاسم الأول"
              value={form.firstName}
              onChange={(value) =>
                updateField("firstName", value)
              }
              placeholder="الاسم الأول"
              disabled={loading}
            />

            <Field
              label="الاسم الأوسط"
              value={form.middleName}
              onChange={(value) =>
                updateField("middleName", value)
              }
              placeholder="الاسم الأوسط"
              disabled={loading}
            />

            <Field
              label="اسم العائلة"
              value={form.lastName}
              onChange={(value) =>
                updateField("lastName", value)
              }
              placeholder="اسم العائلة"
              disabled={loading}
            />

            <Field
              label="رقم الهاتف"
              value={form.phone}
              onChange={(value) =>
                updateField("phone", value)
              }
              placeholder="رقم الهاتف"
              type="tel"
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <Field
              label="البريد الإلكتروني"
              value={form.email}
              onChange={(value) =>
                updateField("email", value)
              }
              placeholder="example@email.com"
              type="email"
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="grade"
              style={{
                display: "block",
                color: "#202942",
                fontSize: "14px",
                fontWeight: "800",
                marginBottom: "9px",
              }}
            >
              الصف الدراسي
            </label>

            <select
              id="grade"
              value={form.grade}
              onChange={(event) =>
                updateField("grade", event.target.value)
              }
              disabled={loading}
              style={{
                width: "100%",
                boxSizing: "border-box",
                border: "1px solid #dfe3eb",
                borderRadius: "14px",
                padding: "14px 15px",
                fontSize: "15px",
                outline: "none",
                background: loading ? "#f5f6f8" : "#fff",
                color: form.grade
                  ? "#101a3a"
                  : "#8a91a1",
              }}
            >
              <option value="">
                اختر الصف الدراسي
              </option>
              <optgroup label="المرحلة الإعدادية">
                <option value="الصف الأول الإعدادي">
                  الصف الأول الإعدادي
                </option>
                <option value="الصف الثاني الإعدادي">
                  الصف الثاني الإعدادي
                </option>
                <option value="الصف الثالث الإعدادي">
                  الصف الثالث الإعدادي
                </option>
              </optgroup>
              <optgroup label="المرحلة الثانوية">
                <option value="الصف الأول الثانوي">
                  الصف الأول الثانوي
                </option>
                <option value="الصف الثاني الثانوي">
                  الصف الثاني الثانوي
                </option>
                <option value="الصف الثالث الثانوي">
                  الصف الثالث الثانوي
                </option>
              </optgroup>
            </select>
          </div>

          <PasswordField
            label="كلمة المرور"
            value={form.password}
            onChange={(value) =>
              updateField("password", value)
            }
            show={showPassword}
            onToggle={() =>
              setShowPassword((value) => !value)
            }
            disabled={loading}
          />

          <div style={{ marginTop: "18px" }}>
            <PasswordField
              label="تأكيد كلمة المرور"
              value={form.confirmPassword}
              onChange={(value) =>
                updateField("confirmPassword", value)
              }
              show={showConfirmPassword}
              onToggle={() =>
                setShowConfirmPassword((value) => !value)
              }
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              border: "none",
              borderRadius: "15px",
              padding: "15px",
              marginTop: "25px",
              background: loading
                ? "#69718a"
                : "#101a3a",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "800",
              cursor: loading
                ? "default"
                : "pointer",
              boxShadow: loading
                ? "none"
                : "0 12px 25px rgba(16, 26, 58, 0.2)",
            }}
          >
            {loading
              ? "جاري إنشاء الحساب..."
              : "إنشاء الحساب"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "23px",
            color: "#737b8f",
            fontSize: "14px",
          }}
        >
          لديك حساب بالفعل؟{" "}
          <Link
            href="/login"
            style={{
              color: "#9a7818",
              fontWeight: "800",
              textDecoration: "none",
            }}
          >
            تسجيل الدخول
          </Link>
        </div>

        <div
          style={{
            marginTop: "27px",
            paddingTop: "19px",
            borderTop: "1px solid #edf0f4",
            textAlign: "center",
            color: "#8a91a1",
            fontSize: "12px",
          }}
        >
          جميع الحقوق محفوظة — منصة أ/ عمرو موسى
        </div>
      </section>
    </main>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  disabled?: boolean;
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}: FieldProps) {
  return (
    <div>
      <label
        style={{
          display: "block",
          color: "#202942",
          fontSize: "14px",
          fontWeight: "800",
          marginBottom: "9px",
        }}
      >
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: "100%",
          boxSizing: "border-box",
          border: "1px solid #dfe3eb",
          borderRadius: "14px",
          padding: "14px 15px",
          fontSize: "15px",
          outline: "none",
          background: disabled ? "#f5f6f8" : "#fff",
          color: "#101a3a",
        }}
      />
    </div>
  );
}

type PasswordFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  disabled = false,
}: PasswordFieldProps) {
  return (
    <div>
      <label
        style={{
          display: "block",
          color: "#202942",
          fontSize: "14px",
          fontWeight: "800",
          marginBottom: "9px",
        }}
      >
        {label}
      </label>

      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder="أدخل كلمة المرور"
          disabled={disabled}
          autoComplete={
            label === "كلمة المرور"
              ? "new-password"
              : "new-password"
          }
          style={{
            width: "100%",
            boxSizing: "border-box",
            border: "1px solid #dfe3eb",
            borderRadius: "14px",
            padding: "14px 15px",
            paddingLeft: "58px",
            fontSize: "15px",
            outline: "none",
            background: disabled
              ? "#f5f6f8"
              : "#fff",
            color: "#101a3a",
          }}
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          style={{
            position: "absolute",
            left: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "transparent",
            color: "#737b8f",
            cursor: disabled
              ? "default"
              : "pointer",
            fontSize: "13px",
            fontWeight: "700",
            padding: "8px",
          }}
        >
          {show ? "إخفاء" : "إظهار"}
        </button>
      </div>
    </div>
  );
}