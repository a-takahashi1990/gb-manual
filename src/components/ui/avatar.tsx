import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * シンプルなイニシャル表示用アバター。
 */
function Avatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const initial = name?.trim().charAt(0).toUpperCase() || "?";
  return (
    <span
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground",
        className
      )}
      title={name}
    >
      {initial}
    </span>
  );
}

export { Avatar };
