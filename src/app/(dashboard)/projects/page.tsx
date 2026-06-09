import Link from "next/link";
import { Plus, CalendarClock } from "lucide-react";
import type { ProjectStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge, PriorityBadge } from "@/components/badges";
import { STATUS_LABELS, STATUS_ORDER } from "@/lib/labels";
import { cn } from "@/lib/utils";
import { formatDate, isOverdue } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const statusFilter = STATUS_ORDER.includes(
    searchParams.status as ProjectStatus
  )
    ? (searchParams.status as ProjectStatus)
    : undefined;

  const projects = await prisma.project.findMany({
    where: statusFilter ? { status: statusFilter } : undefined,
    include: {
      customer: true,
      assignee: true,
      _count: { select: { comments: true } },
    },
    orderBy: [{ updatedAt: "desc" }],
  });

  return (
    <div>
      <PageHeader
        title="案件一覧"
        description="チームの案件と進捗状況を管理します"
        action={
          <Button asChild>
            <Link href="/projects/new">
              <Plus />
              新規案件
            </Link>
          </Button>
        }
      />

      {/* ステータスフィルタ */}
      <div className="mb-6 flex flex-wrap gap-2">
        <FilterChip label="すべて" href="/projects" active={!statusFilter} />
        {STATUS_ORDER.map((s) => (
          <FilterChip
            key={s}
            label={STATUS_LABELS[s]}
            href={`/projects?status=${s}`}
            active={statusFilter === s}
          />
        ))}
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            案件がまだありません。「新規案件」から作成してください。
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            const overdue = p.status !== "DONE" && isOverdue(p.dueDate);
            return (
              <Link key={p.id} href={`/projects/${p.id}`} className="group">
                <Card className="h-full transition-shadow group-hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <StatusBadge status={p.status} />
                      <PriorityBadge priority={p.priority} />
                    </div>
                    <CardTitle className="line-clamp-2 pt-1 text-base">
                      {p.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    {p.description ? (
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {p.description}
                      </p>
                    ) : (
                      <p className="text-sm italic text-muted-foreground/60">
                        説明なし
                      </p>
                    )}
                    {p.customer && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        顧客: {p.customer.company || p.customer.name}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="justify-between border-t pt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {p.assignee ? (
                        <>
                          <Avatar
                            name={p.assignee.name}
                            className="size-6 text-[10px]"
                          />
                          <span className="truncate">{p.assignee.name}</span>
                        </>
                      ) : (
                        <span className="italic">担当者未割当</span>
                      )}
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-1",
                        overdue && "font-semibold text-destructive"
                      )}
                    >
                      <CalendarClock className="size-3.5" />
                      {formatDate(p.dueDate)}
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input bg-background text-muted-foreground hover:bg-accent"
      )}
    >
      {label}
    </Link>
  );
}
