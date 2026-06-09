import Link from "next/link";
import { UserPlus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { deleteUser } from "@/lib/actions/users";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/delete-button";
import { ROLE_LABELS } from "@/lib/labels";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const session = await auth();
  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div>
      <PageHeader
        title="ユーザー管理"
        description="メンバーの招待・権限を管理します（管理者のみ）"
        action={
          <Button asChild>
            <Link href="/users/new">
              <UserPlus />
              ユーザー招待
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>氏名</TableHead>
                <TableHead className="hidden sm:table-cell">
                  メールアドレス
                </TableHead>
                <TableHead>ロール</TableHead>
                <TableHead className="hidden md:table-cell">登録日</TableHead>
                <TableHead className="w-px text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => {
                const isSelf = u.id === session?.user?.id;
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar name={u.name} className="size-7 text-[10px]" />
                        <span className="font-medium">{u.name}</span>
                        {isSelf && (
                          <span className="text-xs text-muted-foreground">
                            (あなた)
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                      {u.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-700 border border-purple-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }
                      >
                        {ROLE_LABELS[u.role]}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {formatDate(u.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      {!isSelf && (
                        <form action={deleteUser}>
                          <input type="hidden" name="id" value={u.id} />
                          <DeleteButton
                            variant="ghost"
                            size="icon"
                            iconOnly
                            confirmMessage={`「${u.name}」を削除しますか？`}
                          />
                        </form>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
