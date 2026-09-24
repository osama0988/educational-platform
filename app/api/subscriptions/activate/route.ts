import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

function addCalendarMonths(date: Date, months: number) {
  const result = new Date(date);

  const originalDay = result.getDate();

  result.setDate(1);
  result.setMonth(result.getMonth() + months);

  const lastDayOfTargetMonth = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0
  ).getDate();

  result.setDate(
    Math.min(originalDay, lastDayOfTargetMonth)
  );

  return result;
}

function addCalendarYears(date: Date, years: number) {
  const result = new Date(date);

  const originalDay = result.getDate();
  const originalMonth = result.getMonth();

  result.setDate(1);
  result.setFullYear(result.getFullYear() + years);

  const lastDayOfTargetMonth = new Date(
    result.getFullYear(),
    originalMonth + 1,
    0
  ).getDate();

  result.setMonth(originalMonth);
  result.setDate(
    Math.min(originalDay, lastDayOfTargetMonth)
  );

  return result;
}

function calculateExpiresAt(
  startsAt: Date,
  plan: "MONTHLY" | "TERM" | "ANNUAL",
  durationDays: number
) {
  if (plan === "MONTHLY") {
    return addCalendarMonths(startsAt, 1);
  }

  if (plan === "ANNUAL") {
    return addCalendarYears(startsAt, 1);
  }

  const expiresAt = new Date(startsAt);

  expiresAt.setDate(
    expiresAt.getDate() + durationDays
  );

  return expiresAt;
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
        { success: false, message: "هذا الإجراء متاح للطلاب فقط." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const rawCode = body?.code;

    if (typeof rawCode !== "string") {
      return NextResponse.json(
        { success: false, message: "من فضلك أدخل كود الاشتراك." },
        { status: 400 }
      );
    }

    const code = rawCode.trim().toUpperCase();

    if (!code) {
      return NextResponse.json(
        { success: false, message: "من فضلك أدخل كود الاشتراك." },
        { status: 400 }
      );
    }

    const now = new Date();

    const result = await prisma.$transaction(async (tx) => {
      const subscriptionCode = await tx.subscriptionCode.findUnique({
        where: { code },
      });

      if (!subscriptionCode) {
        throw new Error("INVALID_CODE");
      }

      if (!subscriptionCode.isActive) {
        throw new Error("INACTIVE_CODE");
      }

      if (subscriptionCode.isUsed) {
        throw new Error("USED_CODE");
      }

      if (
        subscriptionCode.codeExpiresAt &&
        subscriptionCode.codeExpiresAt <= now
      ) {
        throw new Error("EXPIRED_CODE");
      }

      const claimed = await tx.subscriptionCode.updateMany({
        where: {
          id: subscriptionCode.id,
          isUsed: false,
          isActive: true,
        },
        data: {
          isUsed: true,
          usedByUserId: session.user.id,
          usedAt: now,
        },
      });

      if (claimed.count !== 1) {
        throw new Error("USED_CODE");
      }

      const currentSubscription = await tx.subscription.findFirst({
        where: {
          userId: session.user.id,
          status: "ACTIVE",
          expiresAt: {
            gt: now,
          },
        },
        orderBy: {
          expiresAt: "desc",
        },
      });

      const startsAt =
        currentSubscription && currentSubscription.expiresAt > now
          ? currentSubscription.expiresAt
          : now;

      const expiresAt = calculateExpiresAt(
        startsAt,
        subscriptionCode.plan,
        subscriptionCode.durationDays
      );

      const subscription = await tx.subscription.create({
        data: {
          userId: session.user.id,
          sourceCodeId: subscriptionCode.id,
          plan: subscriptionCode.plan,
          amount: subscriptionCode.price,
          status: "ACTIVE",
          startsAt,
          expiresAt,
        },
      });

      return {
        plan: subscription.plan,
        startsAt: subscription.startsAt,
        expiresAt: subscription.expiresAt,
      };
    });

    return NextResponse.json({
      success: true,
      message: "تم تفعيل الاشتراك بنجاح.",
      subscription: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case "INVALID_CODE":
          return NextResponse.json(
            { success: false, message: "كود الاشتراك غير صحيح." },
            { status: 400 }
          );

        case "INACTIVE_CODE":
          return NextResponse.json(
            { success: false, message: "هذا الكود غير فعال." },
            { status: 400 }
          );

        case "USED_CODE":
          return NextResponse.json(
            { success: false, message: "هذا الكود تم استخدامه من قبل." },
            { status: 400 }
          );

        case "EXPIRED_CODE":
          return NextResponse.json(
            { success: false, message: "انتهت صلاحية كود الاشتراك." },
            { status: 400 }
          );
      }
    }

    console.error("Subscription activation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء تفعيل الاشتراك. حاول مرة أخرى.",
      },
      { status: 500 }
    );
  }
}