
import { Badge } from "@/components/ui/badge";
import type { InvestigationStatus } from "@/types/doctor/ipd/investigation-order-types";

const styles: Record<InvestigationStatus, string> = {
  "Ready to Send": "border-amber-200 bg-amber-50 text-amber-600",
  Ordered: "border-blue-200 bg-blue-50 text-blue-600",
  "Sample Collected": "border-orange-200 bg-orange-50 text-orange-600",
  Completed: "border-emerald-200 bg-emerald-50 text-emerald-600",
  Pending: "border-slate-200 bg-slate-50 text-slate-500",
};

export function InvestigationStatusBadge({ status }: { status: InvestigationStatus }) {
  return (
    <Badge variant="outline" className={`font-medium ${styles[status]}`}>
      {status}
    </Badge>
  );
}