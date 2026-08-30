import { ROLE_LABELS } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const roleVariants = {
  cashier: "default" as const,
  manager: "brand" as const,
  admin: "warning" as const,
};

export function RoleBadge({ role }: { role: string }) {
  return (
    <Badge variant={roleVariants[role as keyof typeof roleVariants] || "default"}>
      {ROLE_LABELS[role] || role}
    </Badge>
  );
}
