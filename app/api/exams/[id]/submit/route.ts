import { requireActiveSubscription } from "@/src/lib/access";
import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  context: RouteContext
) {
  await requireActiveSubscription();
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "يجب تسجيل الدخول أولًا." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "المستخدم غير موجود." },
        { status: 404 }
      );
    }

    if (user.role !== "STUDENT") {
      return NextResponse.json(
        { success: false, message: "هذا الإجراء متاح للطلاب فقط." },
        { status: 403 }
      );
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, message: "الحساب غير نشط حاليًا." },
        { status: 403 }
      );
    }

    const activeSubscription =
      await prisma.subscription.findFirst({
        where: {
          userId: user.id,
          status: "ACTIVE",
          expiresAt: {
            gt: new Date(),
          },
        },
        select: {
          id: true,
        },
      });

    if (!activeSubscription) {
      return NextResponse.json(
        {
          success: false,
          message: "يجب أن يكون لديك اشتراك فعال لاستخدام الامتحانات.",
        },
        { status: 403 }
      );
    }

    const { id: examId } = await context.params;

    const body = await request.json();

    const answers =
      body &&
      typeof body.answers === "object" &&
      body.answers !== null
        ? body.answers
        : {};

    const exam = await prisma.exam.findUnique({
      where: {
        id: examId,
      },
      include: {
        questions: {
          orderBy: {
            order: "asc",
          },
        },
        unit: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json(
        {
          success: false,
          message: "الامتحان غير موجود.",
        },
        { status: 404 }
      );
    }

    if (!exam.isPublished) {
      return NextResponse.json(
        {
          success: false,
          message: "هذا الامتحان غير متاح حاليًا.",
        },
        { status: 403 }
      );
    }

    if (
      exam.unit &&
      (
        !exam.unit.isPublished ||
        !exam.unit.course.isPublished ||
        exam.unit.course.subject !== "اللغة العربية"
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "هذا الامتحان غير متاح حاليًا.",
        },
        { status: 403 }
      );
    }

    const now = new Date();

    if (exam.startsAt && now < exam.startsAt) {
      return NextResponse.json(
        {
          success: false,
          message: "الامتحان لم يبدأ بعد.",
        },
        { status: 403 }
      );
    }

    if (exam.endsAt && now > exam.endsAt) {
      return NextResponse.json(
        {
          success: false,
          message: "انتهى وقت هذا الامتحان.",
        },
        { status: 403 }
      );
    }

    const previousAttempt =
      await prisma.assessmentAttempt.findFirst({
        where: {
          userId: user.id,
          examId: exam.id,
          type: "EXAM",
          submittedAt: {
            not: null,
          },
        },
        orderBy: {
          submittedAt: "desc",
        },
      });

    if (previousAttempt) {
      return NextResponse.json(
        {
          success: false,
          message: "لقد قمت بإرسال هذا الامتحان من قبل.",
          attemptId: previousAttempt.id,
        },
        { status: 409 }
      );
    }

    let score = 0;
    let totalPoints = 0;

    const answerData = exam.questions.map((question) => {
      totalPoints += question.points;

      const submittedAnswer =
        typeof answers[question.id] === "string"
          ? answers[question.id].trim()
          : null;

      const isCorrect =
        submittedAnswer !== null &&
        submittedAnswer.toLowerCase() ===
          question.correctAnswer.trim().toLowerCase();

      const points = isCorrect ? question.points : 0;

      if (isCorrect) {
        score += points;
      }

      return {
        questionId: question.id,
        answer: submittedAnswer,
        isCorrect,
        points,
      };
    });

    const percentage =
      totalPoints > 0
        ? Number(((score / totalPoints) * 100).toFixed(2))
        : 0;

    const attempt = await prisma.$transaction(async (tx) => {
      const createdAttempt =
        await tx.assessmentAttempt.create({
          data: {
            userId: user.id,
            examId: exam.id,
            type: "EXAM",
            score,
            totalPoints,
            percentage,
            submittedAt: new Date(),
          },
        });

      if (answerData.length > 0) {
        await tx.assessmentAnswer.createMany({
          data: answerData.map((answer) => ({
            attemptId: createdAttempt.id,
            userId: user.id,
            questionId: answer.questionId,
            answer: answer.answer,
            isCorrect: answer.isCorrect,
            points: answer.points,
          })),
        });
      }

      return createdAttempt;
    });

    return NextResponse.json(
      {
        success: true,
        message: "تم إرسال الامتحان وحساب النتيجة بنجاح.",
        attemptId: attempt.id,
        score,
        totalPoints,
        percentage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Exam submission error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء إرسال الامتحان.",
      },
      { status: 500 }
    );
  }
}
