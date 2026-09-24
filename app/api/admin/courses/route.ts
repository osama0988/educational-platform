import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: NextResponse.json(
        { success: false, message: "يجب تسجيل الدخول أولًا." },
        { status: 401 }
      ),
    };
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
    return {
      error: NextResponse.json(
        { success: false, message: "المستخدم غير موجود." },
        { status: 404 }
      ),
    };
  }

  if (user.role !== "ADMIN") {
    return {
      error: NextResponse.json(
        { success: false, message: "غير مصرح لك بهذا الإجراء." },
        { status: 403 }
      ),
    };
  }

  if (user.status !== "ACTIVE") {
    return {
      error: NextResponse.json(
        { success: false, message: "الحساب غير نشط." },
        { status: 403 }
      ),
    };
  }

  return { user };
}

export async function GET() {
  try {
    const access = await requireAdmin();

    if (access.error) {
      return access.error;
    }

    const courses = await prisma.course.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            units: true,
          },
        },
        units: {
          include: {
            _count: {
              select: {
                lessons: true,
              },
            },
          },
        },
      },
    });

    const formattedCourses = courses.map((course) => {
      const lectures = course.units.reduce(
        (total, unit) => total + unit._count.lessons,
        0
      );

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        grade: course.grade,
        subject: course.subject,
        imageUrl: course.imageUrl,
        isPublished: course.isPublished,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        units: course._count.units,
        lectures,
      };
    });

    return NextResponse.json(formattedCourses);
  } catch (error) {
    console.error("Admin courses GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء تحميل الكورسات.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const access = await requireAdmin();

    if (access.error) {
      return access.error;
    }

    const body = await request.json();

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const grade =
      typeof body.grade === "string"
        ? body.grade.trim()
        : "";

    const imageUrl =
      typeof body.imageUrl === "string"
        ? body.imageUrl.trim()
        : "";

    const isPublished =
      typeof body.isPublished === "boolean"
        ? body.isPublished
        : false;

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "اسم الكورس مطلوب.",
        },
        { status: 400 }
      );
    }

    if (!grade) {
      return NextResponse.json(
        {
          success: false,
          message: "الصف الدراسي مطلوب.",
        },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        title,
        description: description || null,
        grade,
        subject: "اللغة العربية",
        imageUrl: imageUrl || null,
        isPublished,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "تم إنشاء الكورس بنجاح.",
        course,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin courses POST error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء إنشاء الكورس.",
      },
      { status: 500 }
    );
  }
}
