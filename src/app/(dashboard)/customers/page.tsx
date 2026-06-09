import Link from "next/link";
import { Plus, Pencil, Mail, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deleteCustomer } from "@/lib/actions/customers";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/delete-button";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    include: { _count: { select: { projects: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="顧客マスタ"
        description="取引先・顧客情報を管理します"
        action={
          <Button asChild>
            <Link href="/customers/new">
              <Plus />
              新規顧客
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          {customers.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              顧客がまだ登録されていません。
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>顧客名 / 会社</TableHead>
                  <TableHead className="hidden md:table-cell">連絡先</TableHead>
                  <TableHead className="text-center">案件数</TableHead>
                  <TableHead className="w-px text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="font-medium">{c.name}</div>
                      {c.company && (
                        <div className="text-xs text-muted-foreground">
                          {c.company}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="space-y-1 text-xs text-muted-foreground">
                        {c.email && (
                          <div className="flex items-center gap-1.5">
                            <Mail className="size-3.5" />
                            {c.email}
                          </div>
                        )}
                        {c.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="size-3.5" />
                            {c.phone}
                          </div>
                        )}
                        {!c.email && !c.phone && <span>—</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {c._count.projects}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/customers/${c.id}/edit`}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <form action={deleteCustomer}>
                          <input type="hidden" name="id" value={c.id} />
                          <DeleteButton
                            variant="ghost"
                            size="icon"
                            iconOnly
                            confirmMessage={`「${c.name}」を削除しますか？`}
                          />
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
