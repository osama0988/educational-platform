import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { requireActiveSubscription } from "@/src/lib/access";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ExamPage({ params }: PageProps) {
  await requireActiveSubscription();

  const { id } = await params;

  const exam = await prisma.exam.findUnique({
    where: {
      id,
    },
    include: {
      unit: {
        include: {
          course: true,
        },
      },
      questions: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!exam || !exam.isPublished) {
    notFound();
  }

  if (
    !exam.unit?.isPublished ||
    !exam.unit?.course.isPublished ||
    exam.unit?.course.subject !== "اللغة العربية"
  ) {
    notFound();
  }

  const questions = [...exam.questions].sort(
    (a, b) => a.order - b.order
  );

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f5f7fb] px-4 py-10"
    >
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="mb-6">
            <p className="text-sm font-bold text-[#a17d31]">
              منصة أ/ عمرو موسى
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#101a3a]">
              {exam.title}
            </h1>

            {exam.description && (
              <p className="mt-3 leading-8 text-slate-600">
                {exam.description}
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-[#f8f9fb] p-5">
            <p className="font-bold text-[#101a3a]">
              عدد الأسئلة: {questions.length}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              صفحة الامتحان الأساسية جاهزة للحماية بالاشتراك.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

