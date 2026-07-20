
"use client";

import { Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { InvestigationStatusBadge } from "./investigation-status-badge";
import type { InvestigationOrderItem } from "@/types/doctor/ipd/investigation-order-types";

interface InvestigationOrdersTableProps {
  items: InvestigationOrderItem[];
  onView: (item: InvestigationOrderItem) => void;
  onDelete: (id: string) => void;
}

export function InvestigationOrdersTable({ items, onView, onDelete }: InvestigationOrdersTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="w-10">#</TableHead>
            <TableHead>Investigation Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Sample</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Results</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="py-6 text-center text-sm text-slate-400">
                No investigations added yet.
              </TableCell>
            </TableRow>
          )}
          {items.map((item, index) => (
            <TableRow key={item.id} className="hover:bg-slate-50/60">
              <TableCell className="text-slate-500">{index + 1}</TableCell>
              <TableCell className="font-medium text-slate-800">{item.investigationName}</TableCell>
              <TableCell className="text-slate-600">{item.category}</TableCell>
              <TableCell className="text-slate-600">{item.priority}</TableCell>
              <TableCell className="text-slate-600">{item.sample}</TableCell>
              <TableCell className="whitespace-nowrap text-slate-600">{item.orderDate}</TableCell>
              <TableCell><InvestigationStatusBadge status={item.status} /></TableCell>
              <TableCell className="text-slate-600">{item.results}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600" onClick={() => onView(item)}>
                    <Eye className="h-4 w-4" />
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