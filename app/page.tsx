"use client";

import { useState } from "react";
import Image from "next/image";

const grades = [
  { number: "01", stage: "إعدادي", title: "الصف الأول الإعدادي", desc: "ابدأ تأسيسك في اللغة العربية" },
  { number: "02", stage: "إعدادي", title: "الصف الثاني الإعدادي", desc: "طور مستواك وابنِ أساسًا قويًا" },
  { number: "03", stage: "إعدادي", title: "الصف الثالث الإعدادي", desc: "استعد للمرحلة القادمة بثقة" },
  { number: "01", stage: "ثانوي", title: "الصف الأول الثانوي", desc: "ابدأ المرحلة الثانوية بشكل منظم" },
  { number: "02", stage: "ثانوي", title: "الصف الثاني الثانوي", desc: "طور مستواك واستعد للاختبارات" },
  { number: "03", stage: "ثانوي", title: "الصف الثالث الثانوي", desc: "مراجعة وتدريب واستعداد شامل" },
];

const features = [
  ["▶", "محاضرات فيديو", "شرح منظم وسهل الوصول إليه."],
  ["▣", "مذكرات وملفات", "كل الملفات التعليمية في مكان واحد."],
  ["✓", "واجبات", "تدريب مستمر بعد المحاضرات."],
  ["✎", "اختبارات", "اختبر مستواك واعرف نتيجتك."],
  ["◈", "متابعة المستوى", "تابع نتائجك وتقدمك باستمرار."],
];

export default function Home() {
  const [menu, setMenu] = useState(false);

  return (
    <main dir="rtl">
      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: Tahoma, Arial, sans-serif;
          background: #f7f9fc;
          color: #172033;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        button {
          font-family: inherit;
        }

        .top {
          background: linear-gradient(90deg, #16213e, #233b70);
          color: white;
          text-align: center;
          padding: 9px 15px;
          font-size: 13px;
        }

        .top b {
          color: #f8c94a;
        }

        .header {
          background: white;
          border-bottom: 1px solid #e8ebf1;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav {
          max-width: 1250px;
          height: 78px;
          margin: auto;
          padding: 0 25px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .brandIcon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #f1b82d, #d9930a);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 23px;
          font-weight: 900;
          box-shadow: 0 7px 20px #d99b2d45;
        }

        .brandLogo {
          width: 54px;
          height: 62px;
          object-fit: contain;
        }

        .brandText b {
          display: block;
          color: #18233d;
          font-size: 18px;
        }

        .brandText span {
          color: #7a8497;
          font-size: 11px;
        }

        .links {
          display: flex;
          align-items: center;
          gap: 26px;
          color: #4d586d;
          font-size: 14px;
          font-weight: 700;
        }

        .links a:hover {
          color: #d3920e;
        }

        .actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .login {
          padding: 11px 16px;
          color: #24365f;
          font-weight: 800;
        }

        .signup {
          background: #e3a51c;
          color: white;
          padding: 12px 19px;
          border-radius: 9px;
          font-weight: 800;
        }

        .menu {
          display: none;
          border: 0;
          background: #f1f4fa;
          border-radius: 9px;
          width: 43px;
          height: 43px;
          font-size: 22px;
          cursor: pointer;
        }

        .hero {
          background:
            radial-gradient(circle at 85% 15%, #f4c84d30, transparent 28%),
            linear-gradient(135deg, #101b35 0%, #1e315d 55%, #263e73 100%);
          color: white;
          min-height: 620px;
          padding: 75px 25px;
          position: relative;
          overflow: hidden;
        }

        .hero:before {
          content: "";
          position: absolute;
          width: 430px;
          height: 430px;
          border: 70px solid #ffffff08;
          border-radius: 50%;
          left: -160px;
          bottom: -210px;
        }

        .heroInner {
          max-width: 1200px;
          margin: auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 65px;
          align-items: center;
          text-align: center;
        }

        .heroInner > div:first-child {
          width: 100%;
        }

        .hero p {
          margin-left: auto;
          margin-right: auto;
        }

        .heroBtns,
        .heroStats {
          justify-content: center;
        }

        .heroSmall {
          display: inline-block;
          background: #ffffff12;
          border: 1px solid #ffffff1f;
          color: #f7ce62;
          border-radius: 30px;
          padding: 9px 15px;
          font-size: 13px;
          font-weight: 800;
          margin-bottom: 19px;
        }

        .hero h1 {
          font-size: clamp(39px, 5vw, 67px);
          line-height: 1.2;
          margin-bottom: 20px;
          font-weight: 900;
        }

        .hero h1 span {
          color: #f4c443;
        }

        .hero p {
          max-width: 590px;
          color: #d6deee;
          line-height: 2;
          font-size: 17px;
          margin-bottom: 28px;
        }

        .heroBtns {
          display: flex;
          gap: 11px;
          flex-wrap: wrap;
        }

        .heroPrimary {
          background: #e5a91d;
          color: white;
          padding: 15px 25px;
          border-radius: 10px;
          font-weight: 900;
          box-shadow: 0 10px 25px #00000025;
        }

        .heroSecondary {
          border: 1px solid #ffffff30;
          background: #ffffff0d;
          padding: 15px 23px;
          border-radius: 10px;
          font-weight: 800;
        }

        .heroStats {
          display: flex;
          gap: 35px;
          margin-top: 37px;
        }

        .heroStats strong {
          display: block;
          font-size: 20px;
          color: white;
        }

        .heroStats span {
          color: #aeb9cf;
          font-size: 11px;
          margin-top: 4px;
          display: block;
        }

        .section {
          padding: 85px 25px;
        }

        .container {
          max-width: 1200px;
          margin: auto;
        }

        .heading {
          text-align: center;
          margin-bottom: 42px;
        }

        .tag {
          color: #c78c0d;
          font-size: 12px;
          font-weight: 900;
          margin-bottom: 9px;
          display: block;
        }

        .heading h2 {
          color: #17233e;
          font-size: clamp(28px, 4vw, 40px);
          margin-bottom: 10px;
        }

        .heading p {
          color: #778196;
          line-height: 1.9;
          max-width: 610px;
          margin: auto;
          font-size: 14px;
        }

        .grades {
          background: white;
        }

        .gradeGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .grade {
          background: #fff;
          border: 1px solid #e4e8ef;
          border-radius: 19px;
          padding: 25px;
          position: relative;
          overflow: hidden;
          transition: .25s;
        }

        .grade:hover {
          transform: translateY(-5px);
          box-shadow: 0 17px 40px #17233e12;
          border-color: #e9c76b;
        }

        .gradeNumber {
          color: #e3a61d;
          font-size: 43px;
          font-weight: 900;
          opacity: .25;
        }

        .grade h3 {
          color: #1c2b4d;
          font-size: 18px;
          margin: 5px 0 9px;
        }

        .grade p {
          color: #7b8494;
          font-size: 13px;
          line-height: 1.8;
          margin-bottom: 18px;
        }

        .grade a {
          color: #bd8107;
          font-weight: 900;
          font-size: 13px;
        }

        .features {
          background: #f7f9fc;
        }

        .featureGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 17px;
        }

        .feature {
          background: white;
          border: 1px solid #e5e9ef;
          border-radius: 17px;
          padding: 25px;
          transition: .25s;
        }

        .feature:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 35px #17233e0b;
        }

        .featureIcon {
          width: 49px;
          height: 49px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          background: #fff5d8;
          color: #bc820b;
          font-weight: 900;
          font-size: 20px;
          margin-bottom: 17px;
        }

        .feature h3 {
          color: #202d48;
          font-size: 17px;
          margin-bottom: 8px;
        }

        .feature p {
          color: #788397;
          font-size: 13px;
          line-height: 1.9;
        }

        .learning {
          background: white;
        }

        .learningBox {
          background: linear-gradient(135deg, #17233f, #263f76);
          color: white;
          border-radius: 25px;
          padding: 55px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 45px;
          align-items: center;
        }

        .learningBox h2 {
          font-size: 35px;
          line-height: 1.4;
          margin-bottom: 15px;
        }

        .learningBox p {
          color: #cbd5e8;
          line-height: 2;
          font-size: 14px;
        }

        .steps {
          display: grid;
          gap: 13px;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #ffffff0d;
          border: 1px solid #ffffff12;
          padding: 15px;
          border-radius: 13px;
        }

        .stepNum {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #e5aa22;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
        }

        .step b {
          display: block;
          font-size: 14px;
        }

        .step span {
          color: #aeb9cf;
          font-size: 11px;
        }

        .subscribe {
          background: #f7f9fc;
        }

        .subscribeBox {
          background: white;
          border: 1px solid #e3e7ee;
          border-radius: 22px;
          padding: 45px;
          text-align: center;
        }

        .subscribeBox h2 {
          font-size: 32px;
          color: #182540;
          margin-bottom: 10px;
        }

        .subscribeBox p {
          color: #778196;
          margin-bottom: 25px;
        }

        .planTags {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          margin: 25px 0;
        }

        .planTags span {
          border: 1px solid #e2e6ed;
          border-radius: 9px;
          padding: 10px 17px;
          background: #fafbfd;
          color: #556176;
          font-size: 12px;
          font-weight: 800;
        }

        .cta {
          background: linear-gradient(135deg, #e8ae25, #c8880b);
          color: white;
          text-align: center;
          padding: 65px 25px;
        }

        .cta h2 {
          font-size: 36px;
          margin-bottom: 10px;
        }

        .cta p {
          color: #fff8df;
          margin-bottom: 24px;
        }

        .cta a {
          display: inline-block;
          background: white;
          color: #9d6900;
          padding: 14px 27px;
          border-radius: 10px;
          font-weight: 900;
        }

        .footer {
          background: #101a31;
          color: white;
          padding: 55px 25px 20px;
        }

        .footerGrid {
          max-width: 1200px;
          margin: auto;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 40px;
        }

        .footer .brandText b {
          color: white;
        }

        .footer p {
          color: #8f9bb2;
          font-size: 12px;
          line-height: 1.9;
          margin-top: 15px;
          max-width: 320px;
        }

        .footer h4 {
          margin-bottom: 17px;
          font-size: 14px;
        }

        .footerLinks {
          display: grid;
          gap: 11px;
        }

        .footerLinks a {
          color: #8f9bb2;
          font-size: 12px;
        }

        .footerLinks a:hover {
          color: #e9b22c;
        }

        .copyright {
          max-width: 1200px;
          margin: 40px auto 0;
          padding-top: 19px;
          border-top: 1px solid #1f2a42;
          color: #68748b;
          font-size: 11px;
          display: flex;
          justify-content: space-between;
        }

        @media (max-width: 900px) {
          .links,
          .actions {
            display: none;
          }

          .menu {
            display: block;
          }

          .heroInner {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .hero p {
            margin-left: auto;
            margin-right: auto;
          }

          .heroBtns,
          .heroStats {
            justify-content: center;
          }

          .dashboard {
            max-width: 600px;
            margin: auto;
          }

          .gradeGrid,
          .featureGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .learningBox {
            grid-template-columns: 1fr;
          }

          .footerGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .nav {
            height: 70px;
          }

          .hero {
            padding: 55px 18px;
          }

          .hero h1 {
            font-size: 39px;
          }

          .hero p {
            font-size: 14px;
          }

          .heroStats {
            gap: 18px;
          }

          .section {
            padding: 65px 18px;
          }

          .gradeGrid,
          .featureGrid {
            grid-template-columns: 1fr;
          }

          .learningBox,
          .subscribeBox {
            padding: 28px 20px;
          }

          .footerGrid {
            grid-template-columns: 1fr;
          }

          .copyright {
            display: block;
            line-height: 2;
          }
        }
      `}</style>

      <div className="top">
        <b>منصة أ/ عمرو موسى</b> — تعلم اللغة العربية بطريقة منظمة وأسهل
      </div>

      <header className="header">
        <nav className="nav">
          <a href="#home" className="brand">
            <Image className="brandLogo" src="/rasikh-logo.png" alt="شعار منصة أ/ عمرو موسى" width={54} height={62} priority />
            <div className="brandText">
              <b>منصة أ/ عمرو موسى</b>
              <span>اللغة العربية</span>
            </div>
          </a>

          <div className="links">
            <a href="#home">الرئيسية</a>
            <a href="#grades">الصفوف</a>
            <a href="#features">مميزات المنصة</a>
            <a href="#learning">طريقة الدراسة</a>
            <a href="#subscribe">الاشتراكات</a>
          </div>

          <div className="actions">
            <a href="/login" className="login">تسجيل الدخول</a>
            <a href="/login" className="signup">إنشاء حساب</a>
          </div>

          <button className="menu" onClick={() => setMenu(!menu)}>☰</button>
        </nav>

        {menu && (
          <div style={{
            background: "white",
            padding: "18px",
            display: "grid",
            gap: "15px",
            textAlign: "center",
            fontWeight: 800
          }}>
            <a href="#home">الرئيسية</a>
            <a href="#grades">الصفوف</a>
            <a href="#features">مميزات المنصة</a>
            <a href="#learning">طريقة الدراسة</a>
            <a href="#subscribe">الاشتراكات</a>
            <a href="/login" style={{color:"#c78c0d"}}>تسجيل الدخول</a>
          </div>
        )}
      </header>

      <section className="hero" id="home">
        <div className="heroInner">
          <div>
            <span className="heroSmall">منصة تعليمية متخصصة في اللغة العربية</span>

            <h1>
              افهم العربي
              <br />
              <span>مش بس احفظه.</span>
            </h1>

            <p>
              منصة أ/ عمرو موسى بتجمع لك المحاضرات والملفات والواجبات
              والاختبارات في تجربة تعليمية واحدة، منظمة من أول درس لحد
              متابعة نتيجتك.
            </p>

            <div className="heroBtns">
              <a href="#grades" className="heroPrimary">
                ابدأ التعلم الآن ←
              </a>
              <a href="#features" className="heroSecondary">
                اكتشف المنصة
              </a>
            </div>

            <div className="heroStats">
              <div>
                <strong>دروس</strong>
                <span>محتوى منظم</span>
              </div>
              <div>
                <strong>واجبات</strong>
                <span>تدريب مستمر</span>
              </div>
              <div>
                <strong>اختبارات</strong>
                <span>قياس المستوى</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="section grades" id="grades">
        <div className="container">
          <div className="heading">
            <span className="tag">اختر صفك الدراسي</span>
            <h2>ابدأ من المكان المناسب لك</h2>
            <p>
              اختر صفك للوصول إلى المحتوى التعليمي والمواد والاختبارات الخاصة
              بك.
            </p>
          </div>

          <div className="gradeGrid">
            {grades.map((grade) => (
              <div className="grade" key={grade.number}>
                <div className="gradeNumber">{grade.number}</div>
                <h3>{grade.title}</h3>
                <p>{grade.desc}</p>
                <a href="/login">استكشف المحتوى ←</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section features" id="features">
        <div className="container">
          <div className="heading">
            <span className="tag">كل أدوات التعلم</span>
            <h2>كل اللي تحتاجه في منصة واحدة</h2>
            <p>
              نظام متكامل يساعد الطالب على التعلم والتدريب والاختبار ومتابعة
              النتائج.
            </p>
          </div>

          <div className="featureGrid">
            {features.map(([icon, title, desc]) => (
              <div className="feature" key={title}>
                <div className="featureIcon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section learning" id="learning">
        <div className="container">
          <div className="learningBox">
            <div>
              <span className="tag">طريقة الدراسة</span>
              <h2>من أول المحاضرة لحد النتيجة</h2>
              <p>
                المنصة هتنظم رحلة الطالب بحيث يعرف يدخل على المحتوى الخاص به،
                يشاهد المحاضرات، يحصل على الملفات، يحل الواجبات ويدخل
                الاختبارات ويتابع نتائجه.
              </p>
            </div>

            <div className="steps">
              <div className="step">
                <div className="stepNum">1</div>
                <div>
                  <b>أنشئ حسابك</b>
                  <span>سجل بياناتك وابدأ رحلتك</span>
                </div>
              </div>

              <div className="step">
                <div className="stepNum">2</div>
                <div>
                  <b>اختر المحتوى</b>
                  <span>حدد الصف والكورس المناسب</span>
                </div>
              </div>

              <div className="step">
                <div className="stepNum">3</div>
                <div>
                  <b>ذاكر وتدرب</b>
                  <span>محاضرات وامتحانات وواجبات</span>
                </div>
              </div>

              <div className="step">
                <div className="stepNum">4</div>
                <div>
                  <b>اختبر نفسك</b>
                  <span>اختبارات ونتائج ومتابعة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section subscribe" id="subscribe">
        <div className="container">
          <div className="subscribeBox">
            <span className="tag">الاشتراكات</span>
            <h2>اشترك بكود تفعيل بسيط</h2>
            <p>
              اختر خطة الاشتراك المناسبة، اطلب كود التفعيل عبر WhatsApp، ثم
              أدخل الكود داخل المنصة لفتح جميع الكورسات المتاحة لك.
            </p>

            <div className="planTags">
              <span>شهري</span>
              <span>ترم</span>
              <span>سنوي</span>
              <span>كود اشتراك</span>
            </div>

            <a href="/subscriptions" className="heroPrimary">
              عرض خطط الاشتراك
            </a>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>جاهز تبدأ؟ 🚀</h2>
        <p>ابدأ رحلتك التعليمية مع منصة أ/ عمرو موسى.</p>
        <a href="/login">ابدأ الآن</a>
      </section>

      <footer className="footer">
        <div className="footerGrid">
          <div>
            <div className="brand">
              <Image className="brandLogo" src="/rasikh-logo.png" alt="شعار منصة أ/ عمرو موسى" width={54} height={62} priority />
              <div className="brandText">
                <b>منصة أ/ عمرو موسى</b>
                <span>اللغة العربية</span>
              </div>
            </div>

            <p>
              منصة تعليمية متخصصة في اللغة العربية، تجمع المحتوى والتدريب
              والاختبارات في تجربة واحدة.
            </p>
          </div>

          <div>
            <h4>المنصة</h4>
            <div className="footerLinks">
              <a href="#home">الرئيسية</a>
              <a href="#grades">الصفوف</a>
              <a href="#features">المميزات</a>
              <a href="#learning">طريقة الدراسة</a>
            </div>
          </div>

          <div>
            <h4>حساب الطالب</h4>
            <div className="footerLinks">
              <a href="/login">تسجيل الدخول</a>
              <a href="/login">إنشاء حساب</a>
              <a href="#">الاشتراكات</a>
              <a href="#">النتائج</a>
            </div>
          </div>

          <div>
            <h4>المساعدة</h4>
            <div className="footerLinks">
              <a href="#">الأسئلة الشائعة</a>
              <a href="#">الدعم</a>
              <a href="#">تواصل معنا</a>
              <a href="#">سياسة الخصوصية</a>
            </div>
          </div>
        </div>

        <div className="copyright">
          <span>© 2027 منصةأ/ عمرو موسى — جميع الحقوق محفوظة</span>
          <span>اللغة العربية</span>
        </div>
      </footer>
    </main>
  );
}
