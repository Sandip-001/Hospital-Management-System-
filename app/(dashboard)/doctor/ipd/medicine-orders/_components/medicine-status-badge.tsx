
import { Badge } from "@/components/ui/badge";
import type { MedicineStatus } from "@/types/doctor/ipd/medicine-order-types";

const styles: Record<MedicineStatus, string> = {
  Active: "border-emerald-200 bg-emerald-50 text-emerald-600",
  Pending: "border-amber-200 bg-amber-50 text-amber-600",
};

export function MedicineStatusBadge({ status }: { status: MedicineStatus }) {
  return (
    <Badge variant="outline" className={`font-medium ${styles[status]}`}>
      {status}
    </Badge>
  );
}