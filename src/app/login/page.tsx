import { LoginForm } from "@/components/login-form";
import { ClipboardList } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ClipboardList className="size-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">案件進捗管理システム</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            ログインして続行してください
          </p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-xs text-muted-foreground">
          初期管理者: admin@example.com / admin1234
        </p>
      </div>
    </main>
  );
}
