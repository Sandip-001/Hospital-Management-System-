
"use client";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, FlaskConical, Printer } from "lucide-react";
import type { InvestigationOrderItem } from "@/types/doctor/ipd/investigation-order-types";

export function InvestigationViewDialog({
  open,
  onOpenChange,
  item,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InvestigationOrderItem | null;
}) {
  if (!item) return null;

  const isCompleted = item.status === "Completed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[95vw] !max-w-[980px] max-h-[92vh] overflow-y-auto p-0">
        <DialogHeader className="border-b border-slate-100 px-5 py-4">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
            <FlaskConical className="h-5 w-5 text-blue-600" />
            {isCompleted ? "Test Result Report" : "Test Details"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 py-5">
          {isCompleted ? (
            <CompletedReport item={item} />
          ) : (
            <TestDetailsPanel item={item} />
          )}

          <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
            {isCompleted && (
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Printer className="h-4 w-4" /> Print Report
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CompletedReport({ item }: { item: InvestigationOrderItem }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-lg font-bold text-slate-900">Leads Hospital Laboratory</p>
          <p className="text-sm text-slate-500">Final Diagnostic Report</p>
        </div>
        <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50">{item.status}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Info label="Test" value={item.investigationName} />
        <Info label="Category" value={item.category} />
        <Info label="Sample" value={item.sample} />
        <Info label="Order Date" value={item.orderDate} />
      </div>

      <Separator className="my-4" />

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
          <div>
            <p className="font-medium text-slate-800">Result</p>
            <p className="text-sm text-slate-500">Within expected range</p>
          </div>
          <p className="text-xl font-bold text-slate-900">Normal</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Info label="Reference Range" value="—" />
          <Info label="Verified By" value="Laboratory Incharge" />
          <Info label="Report Time" value={item.expectedReportTime} />
        </div>
      </div>
    </div>
  );
}

function TestDetailsPanel({ item }: { item: InvestigationOrderItem }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-slate-900">{item.investigationName}</p>
          <p className="text-sm text-slate-500">{item.category}</p>
        </div>
        <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50">{item.status}</Badge>
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Info label="Priority" value={item.priority} />
        <Info label="Sample" value={item.sample} />
        <Info label="Fasting Required" value={item.fastingRequired} />
        <Info label="Timing" value={item.timing} />
        <Info label="Report Urgency" value={item.reportUrgency} />
        <Info label="Expected Report Time" value={item.expectedReportTime} />
      </div>

      <Separator className="my-4" />

      <div className="space-y-3">
        <Info label="Clinical Indication / Reason" value={item.indication || "—"} />
        <Info label="Additional Instructions" value={item.additionalInstructions || "—"} />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}