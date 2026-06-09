"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const commentSchema = z.object({
  content: z.string().min(1, "コメントを入力してください").max(2000),
  projectId: z.string().min(1),
});

export async function createComment(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  const parsed = commentSchema.safeParse({
    content: formData.get("content"),
    projectId: formData.get("projectId"),
  });
  if (!parsed.success) return;

  await prisma.comment.create({
    data: {
      content: parsed.data.content,
      projectId: parsed.data.projectId,
      userId: session.user.id,
    },
  });

  revalidatePath(`/projects/${parsed.data.projectId}`);
}

export async function deleteComment(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  const id = formData.get("id");
  const projectId = formData.get("projectId");
  if (typeof id !== "string" || typeof projectId !== "string") return;

  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) return;

  // 自分のコメントのみ削除可（管理者は例外的に削除可）
  if (comment.userId !== session.user.id && session.user.role !== "admin") {
    return;
  }

  await prisma.comment.delete({ where: { id } });
  revalidatePath(`/projects/${projectId}`);
}
