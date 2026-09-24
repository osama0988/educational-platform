import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { requireActiveSubscription } from "@/src/lib/access";
import LessonClient from "./LessonClient";

type PageProps = {
  params: Promise<{
    id: string;
    lessonId: string;
  }>;
};

export default async function LessonPage({ params }: PageProps) {
  await requireActiveSubscription();

  const { id, lessonId } = await params;

  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      isPublished: true,
      unit: {
        courseId: id,
        isPublished: true,
        course: {
          isPublished: true,
          subject: "اللغة العربية",
        },
      },
    },
    include: {
      unit: {
        include: {
          course: true,
        },
      },
      files: true,
      assignments: {
        where: {
          isPublished: true,
        },
      },
    },
  });

  if (!lesson) {
    notFound();
  }

  const lessonData = {
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    videoUrl: lesson.videoUrl,
    duration: lesson.duration,

    unit: {
      id: lesson.unit.id,
      title: lesson.unit.title,
    },

    course: {
      id: lesson.unit.course.id,
      title: lesson.unit.course.title,
      grade: lesson.unit.course.grade,
      subject: lesson.unit.course.subject,
    },

    files: lesson.files.map((file) => ({
      id: file.id,
      name: file.name,
      url: file.url,
      type: file.type,
    })),

    assignments: lesson.assignments.map((assignment) => ({
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      totalPoints: assignment.totalPoints,
      deadline: assignment.deadline
        ? assignment.deadline.toISOString()
        : null,
    })),
  };

  return <LessonClient lesson={lessonData} />;
}
