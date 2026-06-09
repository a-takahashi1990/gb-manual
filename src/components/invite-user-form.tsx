"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { inviteUser } from "@/lib/actions/users";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/submit-button";
import { ROLE_LABELS } from "@/lib/labels";

export function InviteUserForm() {
  const [state, formAction] = useFormState(inviteUser, undefined);

  return (
    <Card>
      <form action={formAction}>
        <CardContent className="space-y-5 pt-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              氏名 <span className="text-destructive">*</span>
            </Label>
            <Input id="name" name="name" placeholder="例: 山田 太郎" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              メールアドレス <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="例: yamada@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              初期パスワード <span className="text-destructive">*</span>
            </Label>
            <Input
              id="password"
              name="password"
              type="text"
              placeholder="8文字以上"
              minLength={8}
              required
            />
            <p className="text-xs text-muted-foreground">
              招待後、本人にこのパスワードを共有してください（8文字以上）。
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">ロール</Label>
            <Select id="role" name="role" defaultValue="member">
              <option value="member">{ROLE_LABELS.member}</option>
              <option value="admin">{ROLE_LABELS.admin}</option>
            </Select>
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
            <Link href="/users">キャンセル</Link>
          </Button>
          <SubmitButton>招待する</SubmitButton>
        </CardFooter>
      </form>
    </Card>
  );
}
