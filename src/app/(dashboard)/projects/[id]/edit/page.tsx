import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { updateProject } from "@/lib/actions/projects";
import { ProjectForm } from "@/components/project-form";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const [project, customers, users] = await Promise.all([
    prisma.project.findUnique({ where: { id: params.id } }),
    prisma.customer.findMany({
      select: { id: true, name: true, company: true },
      orderBy: { name: "asc" },
    }),
    prisma.user.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!project) notFound();

  const updateWithId = updateProject.bind(null, project.id);

  return (
    <div className="max-w-2xl">
      <Link
        href={`/projects/${project.id}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        案件詳細へ戻る
      </Link>
      <PageHeader title="案件を編集" />
      <ProjectForm
        action={updateWithId}
        customers={customers}
        users={users}
        defaults={{
          title: project.title,
          description: project.description,
          status: project.status,
          priority: project.priority,
          dueDate: project.dueDate,
          customerId: project.customerId,
          assigneeId: project.assigneeId,
        }}
        submitLabel="保存する"
        cancelHref={`/projects/${project.id}`}
      />
    </div>
  );
}
