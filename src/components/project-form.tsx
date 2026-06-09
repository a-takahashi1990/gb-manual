"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import type { Customer, Priority, ProjectStatus, User } from "@prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/submit-button";
import {
  PRIORITY_LABELS,
  PRIORITY_ORDER,
  STATUS_LABELS,
  STATUS_ORDER,
} from "@/lib/labels";
import { toDateInputValue } from "@/lib/format";
import type { ActionState } from "@/lib/actions/projects";

type ProjectDefaults = {
  title: string;
  description: string | null;
  status: ProjectStatus;
  priority: Priority;
  dueDate: Date | null;
  customerId: string | null;
  assigneeId: string | null;
};

export function ProjectForm({
  action,
  customers,
  users,
  defaults,
  submitLabel,
  cancelHref,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  customers: Pick<Customer, "id" | "name" | "company">[];
  users: Pick<User, "id" | "name">[];
  defaults?: ProjectDefaults;
  submitLabel: string;
  cancelHref: string;
}) {
  const [state, formAction] = useFormState(action, undefined);

  return (
    <Card>
      <form action={formAction}>
        <CardContent className="space-y-5 pt-6">
          <div className="space-y-2">
            <Label htmlFor="title">
              タイトル <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              defaultValue={defaults?.title}
              placeholder="例: コーポレートサイトリニューアル"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={defaults?.description ?? ""}
              rows={4}
              placeholder="案件の詳細を入力..."
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status">ステータス</Label>
              <Select
                id="status"
                name="status"
                defaultValue={defaults?.status ?? "TODO"}
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">優先度</Label>
              <Select
                id="priority"
                name="priority"
                defaultValue={defaults?.priority ?? "MEDIUM"}
              >
                {PRIORITY_ORDER.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABELS[p]}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assigneeId">担当者</Label>
              <Select
                id="assigneeId"
                name="assigneeId"
                defaultValue={defaults?.assigneeId ?? ""}
              >
                <option value="">（未割当）</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerId">顧客</Label>
              <Select
                id="customerId"
                name="customerId"
                defaultValue={defaults?.customerId ?? ""}
              >
                <option value="">（なし）</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company ? `${c.company} / ${c.name}` : c.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">期日</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                defaultValue={toDateInputValue(defaults?.dueDate)}
              />
            </div>
          </div>

          {state?.error && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-end gap-2 border-t pt-6">
          <Button asChild variant="outline">
            <Link href={cancelHref}>キャンセル</Link>
          </Button>
          <SubmitButton>{submitLabel}</SubmitButton>
        </CardFooter>
      </form>
    </Card>
  );
}
