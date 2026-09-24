import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/src/lib/prisma";

type RegisterBody = {
  firstName?: unknown;
  middleName?: unknown;
  lastName?: unknown;
  phone?: unknown;
  email?: unknown;
  password?: unknown;
  grade?: unknown;
};

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    let body: RegisterBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "بيانات الطلب غير صحيحة.",
        },
        { status: 400 }
      );
    }

    const firstName = cleanString(body.firstName);
    const middleName = cleanString(body.middleName);
    const lastName = cleanString(body.lastName);
    const phone = cleanString(body.phone);
    const email = cleanString(body.email);
    const password =
      typeof body.password === "string" ? body.password : "";
    const grade = cleanString(body.grade);

    if (!firstName || !lastName || !phone || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "من فضلك أكمل البيانات المطلوبة.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل.",
        },
        { status: 400 }
      );
    }

    const existingPhone = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (existingPhone) {
      return NextResponse.json(
        {
          success: false,
          message: "رقم الهاتف مستخدم بالفعل.",
        },
        { status: 409 }
      );
    }

    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (existingEmail) {
        return NextResponse.json(
          {
            success: false,
            message: "البريد الإلكتروني مستخدم بالفعل.",
          },
          { status: 409 }
        );
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        firstName,
        middleName: middleName || null,
        lastName,
        phone,
        email: email || null,
        passwordHash,
        grade: grade || null,
        role: "STUDENT",
        status: "ACTIVE",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        grade: true,
        role: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "تم إنشاء الحساب بنجاح.",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء إنشاء الحساب.",
      },
      { status: 500 }
    );
  }
}