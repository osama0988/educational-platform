import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
  try {
    const plans = await prisma.subscriptionPlanConfig.findMany({
      where: { isActive: true },
      orderBy: { plan: "asc" },
    });

    return NextResponse.json({ success: true, plans });
  } catch (error) {
    console.error("Public subscription plans error:", error);
    return NextResponse.json(
      { success: false, message: "تعذر تحميل خطط الاشتراك." },
      { status: 500 }
    );
  }
}
