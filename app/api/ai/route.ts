import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

const DEFAULT_SYSTEM_PROMPT = `أنت مساعد تعليمي داخل منصة أ/ عمرو موسى لتعليم اللغة العربية.
- أجب بالعربية الواضحة وبأسلوب مناسب للطلاب.
- اشرح الفكرة خطوة بخطوة عند الحاجة، ولا تعطِ إجابات غامضة.
- إذا كان السؤال متعلقًا بمحتوى المنصة ولا تملك المعلومات الكافية عنه، قل بوضوح إنك لا تملك هذه المعلومة بدل اختلاقها.
- ساعد الطالب على الفهم والتعلم، ولا تنتحل دور المعلم أو الإدارة.
- لا تكشف أي مفاتيح أو أسرار أو بيانات خاصة بالمنصة.
- لا تساعد في الغش أثناء اختبار جارٍ؛ يمكنك شرح المفهوم أو التدريب على سؤال مشابه.`;

function extractText(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const value = data as Record<string, unknown>;
  if (typeof value.output_text === "string") return value.output_text.trim();

  const output = Array.isArray(value.output) ? value.output : [];
  const chunks: string[] = [];
  for (const item of output) {
    if (!item || typeof item !== "object") continue;
    const content = (item as Record<string, unknown>).content;
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      if (!part || typeof part !== "object") continue;
      const text = (part as Record<string, unknown>).text;
      if (typeof text === "string") chunks.push(text);
    }
  }
  return chunks.join("\n").trim();
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "يجب تسجيل الدخول أولًا." },
        { status: 401 }
      );
    }

    if (session.user.role !== "STUDENT") {
      return NextResponse.json(
        { success: false, message: "المساعد متاح للطلاب فقط." },
        { status: 403 }
      );
    }

    const apiKey = process.env.AI_API_KEY;
    const baseUrl = (process.env.AI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
    const model = process.env.AI_MODEL || "gpt-5.6-luna";

    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "مساعد الذكاء الاصطناعي غير مفعّل حاليًا." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const question = typeof body?.question === "string" ? body.question.trim() : "";
    const page = typeof body?.page === "string" ? body.page.slice(0, 200) : "";

    if (!question) {
      return NextResponse.json(
        { success: false, message: "اكتب سؤالك أولًا." },
        { status: 400 }
      );
    }
    if (question.length > 4000) {
      return NextResponse.json(
        { success: false, message: "السؤال طويل جدًا. اختصره قليلًا." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { firstName: true, grade: true, status: true },
    });

    if (!user || user.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, message: "الحساب غير نشط حاليًا." },
        { status: 403 }
      );
    }

    const input = [
      { role: "system", content: DEFAULT_SYSTEM_PROMPT },
      {
        role: "user",
        content: `اسم الطالب: ${user.firstName}\nالصف: ${user.grade || "غير محدد"}\nالصفحة الحالية: ${page || "غير محددة"}\n\nسؤال الطالب:\n${question}`,
      },
    ];

    const response = await fetch(`${baseUrl}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, input }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      console.error("AI provider error:", response.status, data);
      return NextResponse.json(
        { success: false, message: "تعذر الحصول على رد المساعد حاليًا." },
        { status: 502 }
      );
    }

    const answer = extractText(data);
    if (!answer) {
      return NextResponse.json(
        { success: false, message: "لم يصل رد واضح من المساعد." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, answer });
  } catch (error) {
    console.error("AI assistant error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ أثناء تشغيل المساعد." },
      { status: 500 }
    );
  }
}
