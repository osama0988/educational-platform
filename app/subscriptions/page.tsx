import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import SubscribeClient from "./SubscribeClient";

export default async function SubscriptionsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "STUDENT") {
    redirect("/dashboard");
  }

  return <SubscribeClient />;
}