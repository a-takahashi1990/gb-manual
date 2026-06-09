"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import type { ActionState } from "@/lib/actions/projects";

const userSchema = z.object({
  name: z.string().min(1, "氏名は必須です").max(100),
  email: z.string().email("メールアドレスの形式が不正です"),
  password: z.string().min(8, "パスワードは8文字以上にしてください").max(100),
  role: z.nativeEnum(Role),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "認証が必要です" };
  if (session.user.role !== "admin")
    return { ok: false as const, error: "管理者権限が必要です" };
  return { ok: true as const, session };
}

// ユーザー招待（メール + パスワード設定）
export async function inviteUser(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const guard = await requireAdmin();
  if (!guard.ok) return { error: guard.error };

  const parsed = userSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "入力内容が不正です" };
  }

  const d = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email: d.email } });
  if (existing) {
    return { error: "このメールアドレスは既に登録されています" };
  }

  const hashed = await bcrypt.hash(d.password, 10);
  await prisma.user.create({
    data: {
      name: d.name,
      email: d.email,
      password: hashed,
      role: d.role,
    },
  });

  revalidatePath("/users");
  redirect("/users");
}

export async function deleteUser(formData: FormData) {
  const guard = await requireAdmin();
  if (!guard.ok) return;

  const id = formData.get("id");
  if (typeof id !== "string") return;

  // 自分自身は削除できない
  if (id === guard.session.user.id) return;

  await prisma.user.delete({ where: { id } });
  revalidatePath("/users");
  redirect("/users");
}
