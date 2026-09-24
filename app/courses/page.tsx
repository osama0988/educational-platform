import { prisma } from "@/src/lib/prisma";
import CoursesClient from "./CoursesClient";
export const dynamic = "force-dynamic";
export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
      subject: "اللغة العربية",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      units: {
        include: {
          lessons: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  const coursesData = courses.map((course) => ({
    id: course.id,
    title: course.title,
    subtitle: course.description ?? "منهج اللغة العربية",
    grade: course.grade ?? "غير محدد",
    units: course.units.length,
    lectures: course.units.reduce(
      (total, unit) => total + unit.lessons.length,
      0
    ),
  }));

  return <CoursesClient courses={coursesData} />;
}