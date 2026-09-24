import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { requireActiveSubscription } from "@/src/lib/access";
import CourseDetailsClient from "./CourseDetailsClient";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CourseDetailsPage({ params }: PageProps) {
  await requireActiveSubscription();

  const { id } = await params;

  const course = await prisma.course.findFirst({
    where: {
      id,
      isPublished: true,
      subject: "اللغة العربية",
    },
    include: {
      units: {
        where: {
          isPublished: true,
        },
        orderBy: {
          order: "asc",
        },
        include: {
          lessons: {
            where: {
              isPublished: true,
            },
            orderBy: {
              order: "asc",
            },
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  const courseData = {
    id: course.id,
    title: course.title,
    description:
      course.description ??
      "شرح منهج اللغة العربية بطريقة منظمة ومبسطة.",
    grade: course.grade ?? "غير محدد",
    subject: course.subject,
    units: course.units.map((unit) => ({
      id: unit.id,
      title: unit.title,
      description: unit.description ?? "",
      lessons: unit.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
      })),
    })),
  };

  return <CourseDetailsClient course={courseData} />;
}
