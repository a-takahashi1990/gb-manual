import type { Priority, ProjectStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import {
  PRIORITY_BADGE,
  PRIORITY_LABELS,
  STATUS_BADGE,
  STATUS_LABELS,
} from "@/lib/labels";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return <Badge className={STATUS_BADGE[status]}>{STATUS_LABELS[status]}</Badge>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge className={PRIORITY_BADGE[priority]}>
      {PRIORITY_LABELS[priority]}
    </Badge>
  );
}
