import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/access";

const VALID_PLANS = ["MONTHLY", "TERM", "ANNUAL"] as const;

export async function GET() {
  try {
    const plans = await prisma.subscriptionPlanConfig.findMany({
      orderBy: {
        plan: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      plans,
    });
  } catch (error) {
    console.error("Subscription plans GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "تعذر تحميل خطط الاشتراك.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();

    const plan = body?.plan;

    if (!VALID_PLANS.includes(plan)) {
      return NextResponse.json(
        {
          success: false,
          message: "الخطة غير صحيحة.",
        },
        { status: 400 }
      );
    }

    const name = String(body?.name ?? "").trim();
    const price = Number(body?.price);
    const durationDays = Number(body?.durationDays);
    const isActive = Boolean(body?.isActive);

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "اسم الخطة مطلوب.",
        },
        { status: 400 }
      );
    }

    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "السعر غير صحيح.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(durationDays) ||
      durationDays < 1
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "مدة الاشتراك يجب أن تكون يومًا واحدًا على الأقل.",
        },
        { status: 400 }
      );
    }

    const saved = await prisma.subscriptionPlanConfig.upsert({
      where: {
        plan,
      },
      create: {
        plan,
        name,
        price,
        durationDays,
        isActive,
      },
      update: {
        name,
        price,
        durationDays,
        isActive,
      },
    });

    return NextResponse.json({
      success: true,
      message: "تم حفظ إعدادات الخطة.",
      plan: saved,
    });
  } catch (error) {
    console.error("Subscription plans PATCH error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "غير مصرح أو حدث خطأ أثناء حفظ الخطة.",
      },
      { status: 403 }
    );
  }
}