import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { requireActiveSubscription } from "@/src/lib/access";
import AssignmentClient from "./AssignmentClient";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AssignmentPage({ params }: PageProps) {
  await requireActiveSubscription();

  const { id } = await params;

  const assignment = await prisma.assignment.findUnique({
    where: {
      id,
    },
    include: {
      lesson: {
        include: {
          unit: {
            include: {
              course: true,
            },
          },
        },
      },
      questions: true,
    },
  });

  if (!assignment || !assignment.isPublished) {
    notFound();
  }

  const lesson = assignment.lesson;

  if (
    !lesson ||
    !lesson.isPublished ||
    !lesson.unit.isPublished ||
    !lesson.unit.course.isPublished ||
    lesson.unit.course.subject !== "اللغة العربية"
  ) {
    notFound();
  }

  const questions = [...assignment.questions].sort(
    (a, b) => a.order - b.order
  );

  const assignmentData = {
    id: assignment.id,
    title: assignment.title,
    description: assignment.description,
    totalPoints: assignment.totalPoints,
    lesson: {
      title: lesson.title,
      course: {
        grade: lesson.unit.course.grade,
      },
    },
    questions: questions.map((question) => ({
      id: question.id,
      question: question.question,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      points: question.points,
      order: question.order,
    })),
  };

  return <AssignmentClient assignment={assignmentData} />;
}
