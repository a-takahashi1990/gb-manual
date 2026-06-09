import { Priority, ProjectStatus, Role } from "@prisma/client";

// ステータスの日本語ラベルと配色（バッジ用）
export const STATUS_LABELS: Record<ProjectStatus, string> = {
  TODO: "未着手",
  IN_PROGRESS: "進行中",
  REVIEW: "レビュー待ち",
  DONE: "完了",
};

export const STATUS_BADGE: Record<ProjectStatus, string> = {
  TODO: "bg-slate-100 text-slate-700 border border-slate-200",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border border-blue-200",
  REVIEW: "bg-amber-100 text-amber-700 border border-amber-200",
  DONE: "bg-emerald-100 text-emerald-700 border border-emerald-200",
};

export const STATUS_ORDER: ProjectStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "REVIEW",
  "DONE",
];

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: "低",
  MEDIUM: "中",
  HIGH: "高",
};

export const PRIORITY_BADGE: Record<Priority, string> = {
  LOW: "bg-slate-100 text-slate-600 border border-slate-200",
  MEDIUM: "bg-sky-100 text-sky-700 border border-sky-200",
  HIGH: "bg-rose-100 text-rose-700 border border-rose-200",
};

export const PRIORITY_ORDER: Priority[] = ["LOW", "MEDIUM", "HIGH"];

export const ROLE_LABELS: Record<Role, string> = {
  admin: "管理者",
  member: "メンバー",
};
