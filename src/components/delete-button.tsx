"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * 削除確認付きボタン。form の中に置き、submit 前に confirm を挟む。
 */
export function DeleteButton({
  label = "削除",
  confirmMessage = "本当に削除しますか？この操作は取り消せません。",
  variant = "destructive",
  size = "default",
  iconOnly = false,
}: {
  label?: string;
  confirmMessage?: string;
  variant?: "destructive" | "outline" | "ghost";
  size?: "default" | "sm" | "icon";
  iconOnly?: boolean;
}) {
  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      onClick={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      <Trash2 />
      {!iconOnly && label}
    </Button>
  );
}
