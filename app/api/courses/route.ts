import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
      },
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
        0,
      );

      return {
        id: course.id,
        title: course.title,
        subtitle:
          course.description ??
          "شرح المنهج كاملًا بطريقة منظمة ومبسطة",
        grade: course.grade ?? "المرحلة الثانوية",
        subject: course.subject,
        units: course._count.units,
        lectures,
        imageUrl: course.imageUrl,
      };
    });

    return NextResponse.json(formattedCourses);
  } catch (error) {
    console.error("Courses API GET error:", error);

    return NextResponse.json(
      {
        message: "حدث خطأ أثناء تحميل الكورسات",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const title =
      typeof body.title === "string" ? body.title.trim() : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : null;

    const grade =
      typeof body.grade === "string" ? body.grade.trim() : null;

    const imageUrl =
      typeof body.imageUrl === "string"
        ? body.imageUrl.trim()
        : null;

    const isPublished =
      typeof body.isPublished === "boolean"
        ? body.isPublished
        : false;

    if (!title) {
      return NextResponse.json(
        {
          message: "اسم الكورس مطلوب",
        },
        {
          status: 400,
        },
      );
    }

    const course = await prisma.course.create({
      data: {
        title,
        description: description || null,
        grade: grade || null,
        subject: "اللغة العربية",
        imageUrl: imageUrl || null,
        isPublished,
      },
    });

    return NextResponse.json(
      {
        message: "تم إنشاء الكورس بنجاح",
        course,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Courses API POST error:", error);

    return NextResponse.json(
      {
        message: "حدث خطأ أثناء إنشاء الكورس",
      },
      {
        status: 500,
      },
    );
  }
}