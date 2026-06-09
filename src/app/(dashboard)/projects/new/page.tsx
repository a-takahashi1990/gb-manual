import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { createProject } from "@/lib/actions/projects";
import { ProjectForm } from "@/components/project-form";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const [customers, users] = await Promise.all([
    prisma.customer.findMany({
      select: { id: true, name: true, company: true },
      orderBy: { name: "asc" },
    }),
    prisma.user.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="max-w-2xl">
      <Link
        href="/projects"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        案件一覧へ戻る
      </Link>
      <PageHeader title="新規案件" description="新しい案件を作成します" />
      <ProjectForm
        action={createProject}
        customers={customers}
        users={users}
        submitLabel="作成する"
        cancelHref="/projects"
      />
    </div>
  );
}
