import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "يجب تسجيل الدخول أولًا.",
        },
        { status: 401 }
      );
    }

    const now = new Date();

    const subscription = await prisma.subscription.findFirst({
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

    return NextResponse.json({
      success: true,
      active: Boolean(subscription),
      subscription,
    });
  } catch (error) {
    console.error("Subscription status error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "تعذر تحميل حالة الاشتراك.",
      },
      { status: 500 }
    );
  }
}