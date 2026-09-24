"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  points: number;
  order: number;
};

type AssignmentData = {
  id: string;
  title: string;
  description: string | null;
  totalPoints: number;
  lesson: {
    title: string;
    course: {
      grade: string | null;
    };
  };
  questions: Question[];
};

type Props = {
  assignment: AssignmentData;
};

export default function AssignmentClient({
  assignment,
}: Props) {
  const router = useRouter();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const questions = [...assignment.questions].sort(
    (a, b) => a.order - b.order
  );

  const answeredCount = questions.filter(
    (question) => answers[question.id]
  ).length;

  function handleAnswer(
    questionId: string,
    answer: string
  ) {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));

    setError("");
  }

  async function handleSubmit() {
    if (submitting) return;

    const unansweredQuestions = questions.filter(
      (question) => !answers[question.id]
    );

    if (unansweredQuestions.length > 0) {
      setError(
        `من فضلك أجب عن جميع الأسئلة قبل الإرسال. متبقي ${unansweredQuestions.length} سؤال.`
      );

      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });

      return;
    }

    const confirmed = window.confirm(
      "هل أنت متأكد من إرسال الواجب؟ بعد الإرسال لن تتمكن من تعديله."
    );

    if (!confirmed) return;

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(
        `/api/assignments/${assignment.id}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "حدث خطأ أثناء إرسال الواجب."
        );
      }

      router.push(
        `/assignments/${assignment.id}/result?attemptId=${data.attemptId}`
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء إرسال الواجب."
      );

      setSubmitting(false);
    }
  }

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        fontFamily: "Arial, sans-serif",
        padding: "30px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <header
          style={{
            background: "#101a3a",
            color: "#fff",
            borderRadius: "24px",
            padding: "30px",
            marginBottom: "25px",
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
              margin: "0 0 10px",
              fontSize: "30px",
            }}
          >
            {assignment.title}
          </h1>

          <p
            style={{
              margin: 0,
              color: "#d8dbea",
              lineHeight: 1.8,
            }}
          >
            {assignment.description ||
              "حل أسئلة الواجب وتأكد من مراجعة إجاباتك قبل الإرسال."}
          </p>
        </header>

        {/* Information */}
        <section
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "22px",
            marginBottom: "25px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "14px",
            }}
          >
            <div
              style={{
                background: "#f7f8fb",
                borderRadius: "14px",
                padding: "16px",
              }}
            >
              <div
                style={{
                  color: "#777",
                  fontSize: "13px",
                }}
              >
                المحاضرة
              </div>

              <strong
                style={{
                  display: "block",
                  marginTop: "6px",
                  color: "#101a3a",
                }}
              >
                {assignment.lesson.title}
              </strong>
            </div>

            <div
              style={{
                background: "#f7f8fb",
                borderRadius: "14px",
                padding: "16px",
              }}
            >
              <div
                style={{
                  color: "#777",
                  fontSize: "13px",
                }}
              >
                عدد الأسئلة
              </div>

              <strong
                style={{
                  display: "block",
                  marginTop: "6px",
                  color: "#101a3a",
                }}
              >
                {questions.length} سؤال
              </strong>
            </div>

            <div
              style={{
                background: "#f7f8fb",
                borderRadius: "14px",
                padding: "16px",
              }}
            >
              <div
                style={{
                  color: "#777",
                  fontSize: "13px",
                }}
              >
                الدرجة الكلية
              </div>

              <strong
                style={{
                  display: "block",
                  marginTop: "6px",
                  color: "#101a3a",
                }}
              >
                {assignment.totalPoints} درجة
              </strong>
            </div>

            <div
              style={{
                background: "#f7f8fb",
                borderRadius: "14px",
                padding: "16px",
              }}
            >
              <div
                style={{
                  color: "#777",
                  fontSize: "13px",
                }}
              >
                الصف
              </div>

              <strong
                style={{
                  display: "block",
                  marginTop: "6px",
                  color: "#101a3a",
                }}
              >
                {assignment.lesson.course.grade ||
                  "غير محدد"}
              </strong>
            </div>
          </div>
        </section>

        {/* Questions */}
        <section>
          {questions.length === 0 ? (
            <div
              style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "60px 25px",
                textAlign: "center",
                boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  fontSize: "48px",
                  marginBottom: "15px",
                }}
              >
                📝
              </div>

              <h2
                style={{
                  color: "#101a3a",
                  margin: "0 0 10px",
                }}
              >
                لم تتم إضافة أسئلة بعد
              </h2>

              <p
                style={{
                  color: "#777",
                  margin: 0,
                }}
              >
                سيتم إضافة أسئلة الواجب من لوحة الإدارة.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              {questions.map((question, index) => {
                const options = [
                  {
                    key: "A",
                    text: question.optionA,
                  },
                  {
                    key: "B",
                    text: question.optionB,
                  },
                  {
                    key: "C",
                    text: question.optionC,
                  },
                  {
                    key: "D",
                    text: question.optionD,
                  },
                ].filter((option) => option.text);

                return (
                  <article
                    key={question.id}
                    style={{
                      background: "#fff",
                      borderRadius: "20px",
                      padding: "25px",
                      boxShadow:
                        "0 8px 25px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "15px",
                        marginBottom: "20px",
                      }}
                    >
                      <h2
                        style={{
                          margin: 0,
                          color: "#101a3a",
                          fontSize: "19px",
                          lineHeight: 1.8,
                        }}
                      >
                        <span
                          style={{
                            color: "#d4af37",
                            marginLeft: "7px",
                          }}
                        >
                          {index + 1}.
                        </span>

                        {question.question}
                      </h2>

                      <span
                        style={{
                          whiteSpace: "nowrap",
                          background: "#f5ead0",
                          color: "#9b7a18",
                          padding: "6px 10px",
                          borderRadius: "10px",
                          fontSize: "12px",
                          fontWeight: "700",
                        }}
                      >
                        {question.points} درجة
                      </span>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gap: "10px",
                      }}
                    >
                      {options.map((option) => {
                        const selected =
                          answers[question.id] ===
                          option.key;

                        return (
                          <label
                            key={option.key}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              border: selected
                                ? "2px solid #d4af37"
                                : "1px solid #e5e8ef",
                              borderRadius: "14px",
                              padding: "14px",
                              cursor: "pointer",
                              color: "#333",
                              background: selected
                                ? "#fffaf0"
                                : "#fafbfc",
                              transition: "0.2s",
                            }}
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={option.key}
                              checked={selected}
                              onChange={() =>
                                handleAnswer(
                                  question.id,
                                  option.key
                                )
                              }
                            />

                            <span
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: selected
                                  ? "#d4af37"
                                  : "#101a3a",
                                color: selected
                                  ? "#101a3a"
                                  : "#fff",
                                fontWeight: "700",
                                fontSize: "13px",
                                flexShrink: 0,
                              }}
                            >
                              {option.key}
                            </span>

                            <span
                              style={{
                                lineHeight: 1.7,
                                flex: 1,
                              }}
                            >
                              {option.text}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#fff1f1",
              border: "1px solid #f0b8b8",
              color: "#a33",
              borderRadius: "14px",
              padding: "14px 16px",
              marginTop: "18px",
              lineHeight: 1.7,
              fontWeight: "600",
            }}
          >
            {error}
          </div>
        )}

        {/* Submit */}
        {questions.length > 0 && (
          <section
            style={{
              background: "#101a3a",
              borderRadius: "22px",
              padding: "28px",
              marginTop: "22px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                color: "#fff",
                margin: "0 0 8px",
                fontSize: "22px",
              }}
            >
              جاهز لإرسال الواجب؟
            </h2>

            <p
              style={{
                color: "#d8dbea",
                margin: "0 0 10px",
              }}
            >
              تمت الإجابة عن {answeredCount} من{" "}
              {questions.length} سؤال.
            </p>

            <p
              style={{
                color: "#d8dbea",
                margin: "0 0 20px",
              }}
            >
              راجع إجاباتك جيدًا قبل الإرسال.
            </p>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                border: 0,
                background: "#d4af37",
                color: "#101a3a",
                padding: "14px 35px",
                borderRadius: "13px",
                fontWeight: "800",
                fontSize: "16px",
                cursor: submitting
                  ? "wait"
                  : "pointer",
                opacity: submitting ? 0.65 : 1,
              }}
            >
              {submitting
                ? "جاري إرسال الواجب..."
                : "إرسال الواجب"}
            </button>
          </section>
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