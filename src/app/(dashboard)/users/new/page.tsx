import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { InviteUserForm } from "@/components/invite-user-form";
import { PageHeader } from "@/components/page-header";

export default function NewUserPage() {
  return (
    <div className="max-w-2xl">
      <Link
        href="/users"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        ユーザー一覧へ戻る
      </Link>
      <PageHeader
        title="ユーザー招待"
        description="メールアドレスとパスワードを設定して新しいメンバーを追加します"
      />
      <InviteUserForm />
    </div>
  );
}
