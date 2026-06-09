import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  CalendarClock,
  User as UserIcon,
  Building2,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { deleteProject } from "@/lib/actions/projects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge, PriorityBadge } from "@/components/badges";
import { DeleteButton } from "@/components/delete-button";
import { CommentSection } from "@/components/comment-section";
import { formatDate, isOverdue } from "@/lib/format";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      assignee: true,
      createdBy: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!project) notFound();

  const overdue = project.status !== "DONE" && isOverdue(project.dueDate);

  return (
    <div className="max-w-3xl">
      <Link
        href="/projects"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        案件一覧へ戻る
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <StatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/projects/${project.id}/edit`}>
              <Pencil />
              編集
            </Link>
          </Button>
          <form action={deleteProject}>
            <input type="hidden" name="id" value={project.id} />
            <DeleteButton
              size="sm"
              confirmMessage="この案件を削除しますか？コメントも一緒に削除されます。"
            />
          </form>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* 本文 */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">説明</CardTitle>
            </CardHeader>
            <CardContent>
              {project.description ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {project.description}
                </p>
              ) : (
                <p className="text-sm italic text-muted-foreground">
                  説明はありません。
                </p>
              )}
            </CardContent>
          </Card>

          <div className="mt-6">
            <CommentSection
              projectId={project.id}
              comments={project.comments.map((c) => ({
                id: c.id,
                content: c.content,
                createdAt: c.createdAt,
                userName: c.user.name,
                userId: c.userId,
              }))}
              currentUserId={session!.user.id}
              isAdmin={session!.user.role === "admin"}
            />
          </div>
        </div>

        {/* メタ情報 */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">案件情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <MetaRow icon={<UserIcon className="size-4" />} label="担当者">
                {project.assignee ? (
                  <span className="flex items-center gap-2">
                    <Avatar
                      name={project.assignee.name}
                      className="size-6 text-[10px]"
                    />
                    {project.assignee.name}
                  </span>
                ) : (
                  <span className="text-muted-foreground">未割当</span>
                )}
              </MetaRow>

              <MetaRow icon={<Building2 className="size-4" />} label="顧客">
                {project.customer ? (
                  <span>
                    {project.customer.company || project.customer.name}
                  </span>
                ) : (
                  <span className="text-muted-foreground">なし</span>
                )}
              </MetaRow>

              <MetaRow
                icon={<CalendarClock className="size-4" />}
                label="期日"
              >
                <span
                  className={cn(
                    overdue && "font-semibold text-destructive"
                  )}
                >
                  {formatDate(project.dueDate)}
                  {overdue && "（超過）"}
                </span>
              </MetaRow>

              <div className="border-t pt-3 text-xs text-muted-foreground">
                <p>作成者: {project.createdBy?.name ?? "不明"}</p>
                <p>作成日: {formatDate(project.createdAt)}</p>
                <p>更新日: {formatDate(project.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetaRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {icon}
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}
