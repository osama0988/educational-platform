"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!phone.trim()) {
      setError("من فضلك أدخل رقم الهاتف.");
      return;
    }

    if (!password) {
      setError("من فضلك أدخل كلمة المرور.");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn("credentials", {
       phone: phone.trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("رقم الهاتف أو كلمة المرور غير صحيحة.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.");
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px 18px",
        fontFamily: "Arial, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "380px",
          height: "380px",
          borderRadius: "50%",
          background: "rgba(212, 175, 55, 0.08)",
          top: "-150px",
          right: "-120px",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.04)",
          bottom: "-130px",
          left: "-100px",
        }}
      />

      <section
        style={{
          width: "100%",
          maxWidth: "470px",
          background: "rgba(255, 255, 255, 0.98)",
          borderRadius: "28px",
          padding: "42px 34px",
          boxShadow: "0 25px 70px rgba(0, 0, 0, 0.3)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <Image
            src="/rasikh-logo.png"
            alt="شعار منصة أ/ عمرو موسى"
            width={92}
            height={105}
            priority
            style={{ width: 92, height: 105, objectFit: "contain", margin: "0 auto 12px" }}
          />

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
              margin: "0 0 10px",
              color: "#101a3a",
              fontSize: "30px",
              fontWeight: "800",
            }}
          >
            تسجيل الدخول
          </h1>

          <p
            style={{
              margin: 0,
              color: "#737b8f",
              fontSize: "15px",
              lineHeight: 1.8,
            }}
          >
            سجل دخولك للوصول إلى الدروس والواجبات والاختبارات الخاصة بك.
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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "19px" }}>
            <label
              htmlFor="phone"
              style={{
                display: "block",
                color: "#202942",
                fontSize: "14px",
                fontWeight: "800",
                marginBottom: "9px",
              }}
            >
              رقم الهاتف
            </label>

            <input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="أدخل رقم الهاتف"
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
                color: "#101a3a",
              }}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                color: "#202942",
                fontSize: "14px",
                fontWeight: "800",
                marginBottom: "9px",
              }}
            >
              كلمة المرور
            </label>

            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="أدخل كلمة المرور"
                disabled={loading}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  border: "1px solid #dfe3eb",
                  borderRadius: "14px",
                  padding: "14px 15px",
                  paddingLeft: "58px",
                  fontSize: "15px",
                  outline: "none",
                  background: loading ? "#f5f6f8" : "#fff",
                  color: "#101a3a",
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                disabled={loading}
                aria-label={
                  showPassword
                    ? "إخفاء كلمة المرور"
                    : "إظهار كلمة المرور"
                }
                style={{
                  position: "absolute",
                  left: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  color: "#737b8f",
                  cursor: loading ? "default" : "pointer",
                  fontSize: "13px",
                  fontWeight: "700",
                  padding: "8px",
                }}
              >
                {showPassword ? "إخفاء" : "إظهار"}
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "24px",
            }}
          >
            <Link
              href="/register"
              style={{
                color: "#9a7818",
                fontSize: "13px",
                fontWeight: "800",
                textDecoration: "none",
              }}
            >
              إنشاء حساب جديد
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              border: "none",
              borderRadius: "15px",
              padding: "15px",
              background: loading ? "#69718a" : "#101a3a",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "800",
              cursor: loading ? "default" : "pointer",
              boxShadow: loading
                ? "none"
                : "0 12px 25px rgba(16, 26, 58, 0.2)",
            }}
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <div
          style={{
            marginTop: "28px",
            paddingTop: "20px",
            borderTop: "1px solid #edf0f4",
            textAlign: "center",
            color: "#8a91a1",
            fontSize: "12px",
            lineHeight: 1.8,
          }}
        >
          جميع الحقوق محفوظة — منصة أ/ عمرو موسى
        </div>
      </section>
    </main>
  );
}