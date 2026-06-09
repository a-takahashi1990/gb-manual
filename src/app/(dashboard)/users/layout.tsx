import { redirect } from "next/navigation";
import { auth } from "@/auth";

// ユーザー管理は管理者のみ
export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    redirect("/projects");
  }
  return <>{children}</>;
}
