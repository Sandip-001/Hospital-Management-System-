
"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { MedicineStatusBadge } from "./medicine-status-badge";
import type { MedicineOrderItem } from "@/types/doctor/ipd/medicine-order-types";

interface MedicineOrdersTableProps {
  items: MedicineOrderItem[];
  onEdit: (item: MedicineOrderItem) => void;
  onDelete: (id: string) => void;
}

export function MedicineOrdersTable({ items, onEdit, onDelete }: MedicineOrdersTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="w-10">#</TableHead>
            <TableHead>Medicine Name</TableHead>
            <TableHead>Dose</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Instructions</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} className="py-6 text-center text-sm text-slate-400">
                No medicines added yet.
              </TableCell>
            </TableRow>
          )}
          {items.map((item, index) => (
            <TableRow key={item.id} className="hover:bg-slate-50/60">
              <TableCell className="text-slate-500">{index + 1}</TableCell>
              <TableCell className="min-w-[220px]">
                <p className="font-medium text-slate-800">{item.medicineName}</p>
                <p className="text-xs text-slate-400">{item.strengthForm}</p>
              </TableCell>
              <TableCell className="text-slate-600">{item.dose}</TableCell>
              <TableCell className="text-slate-600">{item.route}</TableCell>
              <TableCell className="min-w-[120px] text-slate-600">
                <p>{item.frequency}</p>
                <p className="text-xs text-slate-400">{item.timing.join(", ")}</p>
              </TableCell>
              <TableCell className="text-slate-600">{item.duration}</TableCell>
              <TableCell className="whitespace-nowrap text-slate-600">{item.startDate}</TableCell>
              <TableCell className="min-w-[160px] text-slate-600">{item.instructions}</TableCell>
              <TableCell><MedicineStatusBadge status={item.status} /></TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600" onClick={() => onEdit(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600" onClick={() => onDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}