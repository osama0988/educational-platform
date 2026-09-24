import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ attemptId?: string }>;
};

function messageFor(percentage: number) {
  if (percentage >= 90) return { title: "ممتاز جدًا! 🎉", text: "أداء رائع. راجع الملاحظات واستمر على نفس المستوى." };
  if (percentage >= 75) return { title: "أداء ممتاز 👏", text: "نتيجة قوية. راجع أي إجابة أخطأت فيها لتثبت المعلومة." };
  if (percentage >= 50) return { title: "نتيجة جيدة 👍", text: "راجع النقاط التي أخطأت فيها وحاول تحسينها في التدريب القادم." };
  return { title: "نحتاج إلى مراجعة أكثر 💪", text: "راجع الدرس بهدوء ثم استخدم الأسئلة للتدريب مرة أخرى." };
}

export default async function AssignmentResultPage({ params, searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const query = await searchParams;

  const assignment = await prisma.assignment.findUnique({
    where: { id },
    select: { id: true, title: true, totalPoints: true },
  });
  if (!assignment) notFound();

  const attempt = await prisma.assessmentAttempt.findFirst({
    where: {
      id: query.attemptId,
      userId: session.user.id,
      assignmentId: id,
      type: "ASSIGNMENT",
      submittedAt: { not: null },
    },
    include: { answers: true },
  });

  if (!attempt) {
    const latest = await prisma.assessmentAttempt.findFirst({
      where: { userId: session.user.id, assignmentId: id, type: "ASSIGNMENT", submittedAt: { not: null } },
      orderBy: { submittedAt: "desc" },
      select: { id: true },
    });
    if (!latest) notFound();
    redirect(`/assignments/${id}/result?attemptId=${latest.id}`);
  }

  const questions = await prisma.assignmentQuestion.findMany({
    where: { assignmentId: id },
    orderBy: { order: "asc" },
  });

  const answerMap = new Map(attempt.answers.map((answer) => [answer.questionId, answer]));
  const percentage = Number(attempt.percentage);
  const correct = attempt.answers.filter((answer) => answer.isCorrect).length;
  const wrong = questions.length - correct;
  const message = messageFor(percentage);

  return (
    <main dir="rtl" className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div><p className="text-xs font-bold text-[#b08a25]">منصة أ/ عمرو موسى</p><h1 className="text-lg font-black">نتيجة الواجب</h1></div>
          <Link href="/dashboard" className="rounded-xl bg-[#111827] px-4 py-2 text-sm font-bold text-white">لوحة التحكم</Link>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-[28px] bg-[#111827] px-6 py-10 text-center text-white shadow-xl">
          <p className="text-sm font-bold text-[#f4c542]">{assignment.title}</p>
          <div className="mx-auto mt-6 flex h-40 w-40 items-center justify-center rounded-full border-[9px] border-[#f4c542] bg-white/5">
            <div><div className="text-4xl font-black">{percentage}%</div><div className="mt-1 text-sm text-slate-300">{attempt.score} من {attempt.totalPoints}</div></div>
          </div>
          <h2 className="mt-6 text-2xl font-black">{message.title}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-300">{message.text}</p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[['الإجابات الصحيحة', correct, 'text-emerald-600'], ['الإجابات الخاطئة', wrong, 'text-red-600'], ['إجمالي الأسئلة', questions.length, 'text-slate-900']].map(([label, value, cls]) => <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-bold text-slate-500">{label}</p><p className={`mt-2 text-3xl font-black ${cls}`}>{value}</p></div>)}
        </div>
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-xl font-black">مراجعة الإجابات</h2>
          <div className="mt-5 space-y-4">
            {questions.map((question, index) => {
              const answer = answerMap.get(question.id);
              const selected = answer?.answer || "لم تتم الإجابة";
              const correctAnswer = question.correctAnswer;
              return <article key={question.id} className={`rounded-2xl border p-5 ${answer?.isCorrect ? 'border-emerald-200 bg-emerald-50/40' : 'border-red-200 bg-red-50/40'}`}>
                <div className="flex gap-3"><span className="font-black">{index + 1}.</span><p className="font-bold leading-7">{question.question}</p></div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2 text-sm"><div className="rounded-xl bg-white p-3"><span className="font-bold text-slate-500">إجابتك:</span> {selected}</div><div className="rounded-xl bg-white p-3"><span className="font-bold text-slate-500">الإجابة الصحيحة:</span> {correctAnswer}</div></div>
              </article>;
            })}
          </div>
        </section>
        <div className="mt-6 flex flex-wrap gap-3"><Link href="/assignments" className="rounded-xl bg-[#111827] px-5 py-3 font-bold text-white">العودة للواجبات</Link><Link href="/dashboard" className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700">العودة للوحة التحكم</Link></div>
      </section>
    </main>
  );
}
