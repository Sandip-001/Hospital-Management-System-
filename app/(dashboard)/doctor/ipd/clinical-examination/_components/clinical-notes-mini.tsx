// app/ipd/doctor/clinical-examination/_components/clinical-notes-mini.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ClinicalNote } from "@/types/doctor/ipd/clinical-examination-types";

export function ClinicalNotesMini({ notes }: { notes: ClinicalNote[] }) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-3">
        <CardTitle className="text-sm font-semibold text-slate-800">Clinical Notes (This Admission)</CardTitle>
        <button className="text-xs font-medium text-blue-600 hover:underline">View All</button>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {notes.map((n, i) => (
          <div key={i} className="rounded-lg border border-slate-100 bg-slate-50/60 p-2.5">
            <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
              <span>{n.dateTime}</span>
              <span>By {n.author}</span>
            </div>
            <p className="text-xs leading-snug text-slate-600">{n.note}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}