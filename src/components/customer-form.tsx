"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import type { Customer } from "@prisma/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/submit-button";
import type { ActionState } from "@/lib/actions/projects";

export function CustomerForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  defaults?: Pick<
    Customer,
    "name" | "company" | "email" | "phone" | "memo"
  >;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, undefined);

  return (
    <Card>
      <form action={formAction}>
        <CardContent className="space-y-5 pt-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                顧客名 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={defaults?.name}
                placeholder="例: 佐藤 花子"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">会社名</Label>
              <Input
                id="company"
                name="company"
                defaultValue={defaults?.company ?? ""}
                placeholder="例: 株式会社サクラ商事"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={defaults?.email ?? ""}
                placeholder="例: sato@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">電話番号</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={defaults?.phone ?? ""}
                placeholder="例: 03-1234-5678"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="memo">メモ</Label>
            <Textarea
              id="memo"
              name="memo"
              defaultValue={defaults?.memo ?? ""}
              rows={4}
              placeholder="顧客に関するメモ..."
            />
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
            <Link href="/customers">キャンセル</Link>
          </Button>
          <SubmitButton>{submitLabel}</SubmitButton>
        </CardFooter>
      </form>
    </Card>
  );
}
