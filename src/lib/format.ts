import { format, formatDistanceToNow, isPast } from "date-fns";
import { ja } from "date-fns/locale";

export function formatDate(date: Date | null | undefined): string {
  if (!date) return "—";
  return format(new Date(date), "yyyy/MM/dd", { locale: ja });
}

export function formatDateTime(date: Date | null | undefined): string {
  if (!date) return "—";
  return format(new Date(date), "yyyy/MM/dd HH:mm", { locale: ja });
}

export function formatRelative(date: Date | null | undefined): string {
  if (!date) return "—";
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ja });
}

// 期日が過ぎている（かつ未完了想定）かどうか
export function isOverdue(date: Date | null | undefined): boolean {
  if (!date) return false;
  return isPast(new Date(date));
}

// <input type="date"> 用 yyyy-MM-dd
export function toDateInputValue(date: Date | null | undefined): string {
  if (!date) return "";
  return format(new Date(date), "yyyy-MM-dd");
}
