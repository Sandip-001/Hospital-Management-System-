// app/ipd/doctor/clinical-examination/_components/lab-alerts-mini.tsx
import { ArrowDown, ArrowUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LabAlertMini } from "@/types/doctor/ipd/clinical-examination-types";

const config = {
  Low: { Icon: ArrowDown, style: "bg-red-50 text-red-500", textStyle: "text-red-600" },
  High: { Icon: ArrowUp, style: "bg-red-50 text-red-500", textStyle: "text-red-600" },
  Borderline: { Icon: AlertCircle, style: "bg-amber-50 text-amber-500", textStyle: "text-amber-600" },
};

export function LabAlertsMini({ alerts }: { alerts: LabAlertMini[] }) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-3">
        <CardTitle className="text-sm font-semibold text-slate-800">Recent Lab Alerts</CardTitle>
        <button className="text-xs font-medium text-blue-600 hover:underline">View All</button>
      </CardHeader>
      <CardContent className="space-y-2.5 pt-4">
        {alerts.map((a) => {
          const { Icon, style, textStyle } = config[a.status];
          return (
            <div key={a.testName} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-600">
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${style}`}>
                  <Icon className="h-3 w-3" />
                </span>
                {a.testName}
              </span>
              <span className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">{a.value}{a.unit}</span>
                <span className={`text-xs font-medium ${textStyle}`}>{a.status}</span>
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}