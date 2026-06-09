"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  Users,
  Building2,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import type { Role } from "@prisma/client";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/actions/auth";
import { Avatar } from "@/components/ui/avatar";
import { ROLE_LABELS } from "@/lib/labels";

const navItems = [
  { href: "/projects", label: "案件", icon: ClipboardList },
  { href: "/customers", label: "顧客", icon: Building2 },
  { href: "/users", label: "ユーザー", icon: Users, adminOnly: true },
];

export function Sidebar({
  user,
}: {
  user: { name: string; email: string; role: Role };
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
      {navItems.map((item) => {
        if (item.adminOnly && user.role !== "admin") return null;
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="border-t p-3">
      <div className="mb-2 flex items-center gap-3 px-1 py-2">
        <Avatar name={user.name} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {ROLE_LABELS[user.role]}
          </p>
        </div>
      </div>
      <form action={logout}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="size-4" />
          ログアウト
        </button>
      </form>
    </div>
  );

  const brand = (
    <div className="flex h-16 items-center gap-2 border-b px-5">
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <ClipboardList className="size-4" />
      </div>
      <span className="font-bold tracking-tight">案件管理</span>
    </div>
  );

  return (
    <>
      {/* モバイルヘッダ */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ClipboardList className="size-4" />
          </div>
          <span className="font-bold">案件管理</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-md p-2 hover:bg-accent"
          aria-label="メニューを開く"
        >
          <Menu className="size-5" />
        </button>
      </div>
      <div className="h-14 lg:hidden" />

      {/* オーバーレイ */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* サイドバー本体 */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between lg:block">
          {brand}
          <button
            onClick={() => setOpen(false)}
            className="absolute right-3 top-5 rounded-md p-2 hover:bg-accent lg:hidden"
            aria-label="メニューを閉じる"
          >
            <X className="size-5" />
          </button>
        </div>
        {nav}
        {footer}
      </aside>
    </>
  );
}
