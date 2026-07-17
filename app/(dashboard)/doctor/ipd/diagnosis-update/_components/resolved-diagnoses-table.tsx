// app/ipd/doctor/diagnosis-update/_components/resolved-diagnoses-table.tsx
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { ResolvedDiagnosis } from "@/types/doctor/ipd/diagnosis-types";

export function ResolvedDiagnosesTable({ diagnoses, onView }: { diagnoses: ResolvedDiagnosis[]; onView: (d: ResolvedDiagnosis) => void }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead>Diagnosis</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Diagnosed On</TableHead>
            <TableHead>Resolved On</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {diagnoses.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-5 text-center text-sm text-slate-400">No resolved diagnoses.</TableCell>
            </TableRow>
          )}
          {diagnoses.map((d) => (
            <TableRow key={d.id} className="hover:bg-slate-50/60">
              <TableCell className="font-medium text-slate-800">{d.diagnosis}</TableCell>
              <TableCell className="text-slate-500">{d.type}</TableCell>
              <TableCell className="whitespace-nowrap text-slate-500">{d.diagnosedOn}</TableCell>
              <TableCell className="whitespace-nowrap text-slate-500">{d.resolvedOn}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600" onClick={() => onView(d)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}