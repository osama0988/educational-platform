import { NextResponse } from "next/server";
import { randomInt } from "crypto";
import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/access";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateCode() {
  const parts: string[] = [];

  for (let block = 0; block < 3; block++) {
    let part = "";

    for (let i = 0; i < 4; i++) {
      part += ALPHABET[randomInt(ALPHABET.length)];
    }

    parts.push(part);
  }

  return parts.join("-");
}

const VALID_PLANS = ["MONTHLY", "TERM", "ANNUAL"] as const;

type Plan = (typeof VALID_PLANS)[number];

export async function GET() {
  try {
    await requireAdmin();

    const codes = await prisma.subscriptionCode.findMany({
      include: {
        usedByUser: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      codes,
    });
  } catch (error) {
    console.error("Admin subscription codes GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "غير مصرح أو حدث خطأ أثناء تحميل الأكواد.",
      },
      { status: 403 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();

    const plan = body?.plan as Plan;

    if (!VALID_PLANS.includes(plan)) {
      return NextResponse.json(
        {
          success: false,
          message: "خطة الاشتراك غير صحيحة.",
        },
        { status: 400 }
      );
    }

    const config = await prisma.subscriptionPlanConfig.findUnique({
      where: {
        plan,
      },
    });

    if (!config) {
      return NextResponse.json(
        {
          success: false,
          message:
            "لم يتم إعداد هذه الخطة بعد. اضبط السعر والمدة أولًا.",
        },
        { status: 400 }
      );
    }

    if (!config.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "هذه الخطة متوقفة حاليًا.",
        },
        { status: 400 }
      );
    }

    if (Number(config.price) < 0 || config.durationDays < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "إعدادات الخطة غير صالحة.",
        },
        { status: 400 }
      );
    }

    let codeExpiresAt: Date | null = null;

    if (body?.codeExpiresAt) {
      const parsed = new Date(body.codeExpiresAt);

      if (Number.isNaN(parsed.getTime())) {
        return NextResponse.json(
          {
            success: false,
            message: "تاريخ انتهاء الكود غير صحيح.",
          },
          { status: 400 }
        );
      }

      if (parsed <= new Date()) {
        return NextResponse.json(
          {
            success: false,
            message: "تاريخ انتهاء الكود يجب أن يكون في المستقبل.",
          },
          { status: 400 }
        );
      }

      codeExpiresAt = parsed;
    }

    let code = "";

    for (let attempt = 0; attempt < 10; attempt++) {
      const candidate = generateCode();

      const exists = await prisma.subscriptionCode.findUnique({
        where: {
          code: candidate,
        },
        select: {
          id: true,
        },
      });

      if (!exists) {
        code = candidate;
        break;
      }
    }

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          message: "تعذر إنشاء كود فريد. حاول مرة أخرى.",
        },
        { status: 500 }
      );
    }

    const created = await prisma.subscriptionCode.create({
      data: {
        code,
        plan,
        price: config.price,
        durationDays: config.durationDays,
        isUsed: false,
        isActive: true,
        codeExpiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      message: "تم إنشاء كود الاشتراك بنجاح.",
      code: created,
    });
  } catch (error) {
    console.error("Admin subscription codes POST error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء إنشاء كود الاشتراك.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();

    if (typeof body?.id !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "معرف الكود غير صحيح.",
        },
        { status: 400 }
      );
    }

    if (typeof body?.isActive !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "حالة الكود غير صحيحة.",
        },
        { status: 400 }
      );
    }

    const existing = await prisma.subscriptionCode.findUnique({
      where: {
        id: body.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "الكود غير موجود.",
        },
        { status: 404 }
      );
    }

    if (existing.isUsed && body.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "لا يمكن إعادة تفعيل كود تم استخدامه.",
        },
        { status: 400 }
      );
    }

    const updated = await prisma.subscriptionCode.update({
      where: {
        id: body.id,
      },
      data: {
        isActive: body.isActive,
      },
    });

    return NextResponse.json({
      success: true,
      message: body.isActive
        ? "تم تفعيل الكود."
        : "تم تعطيل الكود.",
      code: updated,
    });
  } catch (error) {
    console.error("Admin subscription codes PATCH error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء تعديل الكود.",
      },
      { status: 500 }
    );
  }
}