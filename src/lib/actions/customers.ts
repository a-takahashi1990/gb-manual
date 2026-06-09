"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import type { ActionState } from "@/lib/actions/projects";

const customerSchema = z.object({
  name: z.string().min(1, "顧客名は必須です").max(200),
  company: z.string().max(200).optional().nullable(),
  email: z
    .string()
    .email("メールアドレスの形式が不正です")
    .optional()
    .nullable()
    .or(z.literal("")),
  phone: z.string().max(50).optional().nullable(),
  memo: z.string().max(5000).optional().nullable(),
});

function val(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  const s = typeof v === "string" ? v.trim() : "";
  return s === "" ? null : s;
}

function parseCustomer(formData: FormData) {
  return customerSchema.safeParse({
    name: formData.get("name"),
    company: val(formData, "company"),
    email: val(formData, "email"),
    phone: val(formData, "phone"),
    memo: val(formData, "memo"),
  });
}

export async function createCustomer(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "認証が必要です" };

  const parsed = parseCustomer(formData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "入力内容が不正です" };
  }

  const d = parsed.data;
  await prisma.customer.create({
    data: {
      name: d.name,
      company: d.company || null,
      email: d.email || null,
      phone: d.phone || null,
      memo: d.memo || null,
    },
  });

  revalidatePath("/customers");
  redirect("/customers");
}

export async function updateCustomer(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "認証が必要です" };

  const parsed = parseCustomer(formData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "入力内容が不正です" };
  }

  const d = parsed.data;
  await prisma.customer.update({
    where: { id },
    data: {
      name: d.name,
      company: d.company || null,
      email: d.email || null,
      phone: d.phone || null,
      memo: d.memo || null,
    },
  });

  revalidatePath("/customers");
  redirect("/customers");
}

export async function deleteCustomer(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  const id = formData.get("id");
  if (typeof id !== "string") return;

  await prisma.customer.delete({ where: { id } });
  revalidatePath("/customers");
  redirect("/customers");
}
