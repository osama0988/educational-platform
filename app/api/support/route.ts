import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "يجب تسجيل الدخول أولًا." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const subject =
      typeof body.subject === "string" ? body.subject.trim() : "";

    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    const category =
      typeof body.category === "string" ? body.category.trim() : "";

    if (!subject || !message || !category) {
      return NextResponse.json(
        { message: "من فضلك أكمل جميع البيانات المطلوبة." },
        { status: 400 }
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
        { message: "المستخدم غير موجود." },
        { status: 404 }
      );
    }

    if (user.role !== "STUDENT") {
      return NextResponse.json(
        { message: "هذا الطلب متاح للطلاب فقط." },
        { status: 403 }
      );
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        { message: "الحساب غير نشط حاليًا." },
        { status: 403 }
      );
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: user.id,
        subject,
        message,
        category,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "تم إرسال طلب الدعم بنجاح.",
        ticketId: ticket.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Support ticket error:", error);

    return NextResponse.json(
      { message: "حدث خطأ أثناء إرسال طلب الدعم." },
      { status: 500 }
    );
  }
}