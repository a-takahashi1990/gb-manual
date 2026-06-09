"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ProjectStatus, Priority } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const projectSchema = z.object({
  title: z.string().min(1, "タイトルは必須です").max(200),
  description: z.string().max(5000).optional().nullable(),
  status: z.nativeEnum(ProjectStatus),
  priority: z.nativeEnum(Priority),
  dueDate: z.string().optional().nullable(),
  customerId: z.string().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
});

export type ActionState = { error?: string } | undefined;

function emptyToNull(v: FormDataEntryValue | null): string | null {
  const s = typeof v === "string" ? v.trim() : "";
  return s === "" ? null : s;
}

export async function createProject(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "認証が必要です" };

  const parsed = projectSchema.safeParse({
    title: formData.get("title"),
    description: emptyToNull(formData.get("description")),
    status: formData.get("status"),
    priority: formData.get("priority"),
    dueDate: emptyToNull(formData.get("dueDate")),
    customerId: emptyToNull(formData.get("customerId")),
    assigneeId: emptyToNull(formData.get("assigneeId")),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "入力内容が不正です" };
  }

  const data = parsed.data;
  await prisma.project.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      customerId: data.customerId ?? null,
      assigneeId: data.assigneeId ?? null,
      createdById: session.user.id,
    },
  });

  revalidatePath("/projects");
  redirect("/projects");
}

export async function updateProject(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "認証が必要です" };

  const parsed = projectSchema.safeParse({
    title: formData.get("title"),
    description: emptyToNull(formData.get("description")),
    status: formData.get("status"),
    priority: formData.get("priority"),
    dueDate: emptyToNull(formData.get("dueDate")),
    customerId: emptyToNull(formData.get("customerId")),
    assigneeId: emptyToNull(formData.get("assigneeId")),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "入力内容が不正です" };
  }

  const data = parsed.data;
  await prisma.project.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description ?? null,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      customerId: data.customerId ?? null,
      assigneeId: data.assigneeId ?? null,
    },
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  redirect(`/projects/${id}`);
}

// 一覧から手早くステータスだけ変更する用
export async function updateProjectStatus(id: string, status: ProjectStatus) {
  const session = await auth();
  if (!session?.user?.id) return;

  await prisma.project.update({ where: { id }, data: { status } });
  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
}

export async function deleteProject(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  const id = formData.get("id");
  if (typeof id !== "string") return;

  await prisma.project.delete({ where: { id } });
  revalidatePath("/projects");
  redirect("/projects");
}
