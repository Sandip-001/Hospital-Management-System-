
"use client";

import { X } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DiagnosisStatusBadge, PrimaryBadge } from "./diagnosis-badges";
import type { CurrentDiagnosis } from "@/types/doctor/ipd/diagnosis-types";

interface CurrentDiagnosesTableProps {
  diagnoses: CurrentDiagnosis[];
  onRemove: (id: string) => void;
}

export function CurrentDiagnosesTable({ diagnoses, onRemove }: CurrentDiagnosesTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="w-10">#</TableHead>
            <TableHead>Diagnosis</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Diagnosed On</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {diagnoses.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-6 text-center text-sm text-slate-400">
                No diagnoses added yet.
              </TableCell>
            </TableRow>
          )}
          {diagnoses.map((d, i) => (
            <TableRow key={d.id} className="hover:bg-slate-50/60">
              <TableCell className="text-slate-500">{i + 1}</TableCell>
              <TableCell>
                <span className="flex items-center gap-2 font-medium text-slate-800">
                  {d.diagnosis} {d.isPrimary && <PrimaryBadge />}
                </span>
              </TableCell>
              <TableCell className="text-slate-500">{d.type}</TableCell>
              <TableCell className="whitespace-nowrap text-slate-500">{d.diagnosedOn}</TableCell>
              <TableCell><DiagnosisStatusBadge status={d.status} /></TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => onRemove(d.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}