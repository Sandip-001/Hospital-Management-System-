
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VitalRecordEntry } from "@/types/doctor/ipd/vitals-types";

export function LatestVitalsMini({ vitals }: { vitals: VitalRecordEntry }) {
  const items = [
    { label: "BP", value: vitals.bp, unit: "mmHg" },
    { label: "Pulse", value: String(vitals.pulse), unit: "bpm" },
    { label: "Resp. Rate", value: String(vitals.respRate), unit: "/min" },
    { label: "SpO2", value: String(vitals.spo2), unit: "%" },
    { label: "Temp.", value: String(vitals.temp), unit: "°F" },
    { label: "Pain (NRS)", value: `${vitals.pain}/10`, unit: "" },
  ];
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-3">
        <CardTitle className="text-sm font-semibold text-slate-800">Latest Vitals ({vitals.dateTime})</CardTitle>
        <button className="text-xs font-medium text-blue-600 hover:underline">View All</button>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 pt-4">
        {items.map((it) => (
          <div key={it.label} className="rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2 text-center">
            <p className="text-sm font-bold text-slate-800">{it.value}</p>
            <p className="text-[11px] text-slate-400">{it.label}</p>
            {it.unit && <p className="text-[10px] text-slate-300">{it.unit}</p>}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}