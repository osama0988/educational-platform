import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });
}

export async function requireStudent() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "STUDENT") {
    redirect("/dashboard");
  }

  return session;
}

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return session;
}

export async function hasActiveSubscription(
  userId: string
) {
  const now = new Date();

  const subscription =
    await prisma.subscription.findFirst({
      where: {
        userId,
        status: "ACTIVE",
        expiresAt: {
          gt: now,
        },
      },
      select: {
        id: true,
        plan: true,
        startsAt: true,
        expiresAt: true,
        amount: true,
      },
      orderBy: {
        expiresAt: "desc",
      },
    });

  return Boolean(subscription);
}

export async function requireActiveSubscription() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role === "ADMIN") {
    return session;
  }

  const active =
    await hasActiveSubscription(
      session.user.id
    );

  if (!active) {
    redirect("/subscriptions");
  }

  return session;
}