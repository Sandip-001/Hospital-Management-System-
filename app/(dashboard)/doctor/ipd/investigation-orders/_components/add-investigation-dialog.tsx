
"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { FlaskConical, Search } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { INVESTIGATION_SUGGESTIONS } from "@/lib/doctor/ipd/investigation-orders-data";
import type { InvestigationCategory, InvestigationOrderItem, InvestigationPriority } from "@/types/doctor/ipd/investigation-order-types";

interface AddInvestigationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: InvestigationOrderItem | null;
  onSave: (item: InvestigationOrderItem) => void;
}

const defaultForm = {
  investigationName: "",
  category: "Hematology" as InvestigationCategory,
  priority: "Routine" as InvestigationPriority,
  sample: "EDTA Whole Blood",
  fastingRequired: "No" as "Yes" | "No" | "Not Applicable",
  timing: "Select Timing",
  indication: "",
  additionalInstructions: "",
  reportUrgency: "Routine",
  expectedReportTime: "24 Hours",
  repeatAfter: "Select",
  saveAsFavorite: false,
};

export function AddInvestigationDialog({ open, onOpenChange, editingItem, onSave }: AddInvestigationDialogProps) {
  const [form, setForm] = useState(defaultForm);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setForm({
        investigationName: editingItem.investigationName,
        category: editingItem.category,
        priority: editingItem.priority,
        sample: editingItem.sample,
        fastingRequired: editingItem.fastingRequired,
        timing: editingItem.timing || "Select Timing",
        indication: editingItem.indication,
        additionalInstructions: editingItem.additionalInstructions,
        reportUrgency: editingItem.reportUrgency,
        expectedReportTime: editingItem.expectedReportTime,
        repeatAfter: editingItem.repeatAfter || "Select",
        saveAsFavorite: editingItem.saveAsFavorite,
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingItem, open]);

  const filteredSuggestions = useMemo(
    () => INVESTIGATION_SUGGESTIONS.filter((i) => i.toLowerCase().includes(form.investigationName.toLowerCase())),
    [form.investigationName]
  );

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    if (!form.investigationName || !form.category || !form.priority) {
      toast.error("Please fill all required investigation details");
      return;
    }

    const item: InvestigationOrderItem = {
      id: editingItem?.id ?? `INV-${Date.now()}`,
      investigationName: form.investigationName,
      category: form.category,
      priority: form.priority,
      sample: form.sample,
      orderDate: new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "Ready to Send",
      results: "Pending",
      indication: form.indication,
      additionalInstructions: form.additionalInstructions,
      fastingRequired: form.fastingRequired,
      timing: form.timing,
      reportUrgency: form.reportUrgency,
      expectedReportTime: form.expectedReportTime,
      repeatAfter: form.repeatAfter,
      saveAsFavorite: form.saveAsFavorite,
    };

    console.log(editingItem ? "Updating investigation:" : "Adding investigation:", item);
    onSave(item);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[95vw] !max-w-[980px] max-h-[92vh] overflow-y-auto p-0">
        <DialogHeader className="border-b border-slate-100 px-5 py-4">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
            <FlaskConical className="h-5 w-5 text-blue-600" />
            {editingItem ? "Edit Investigation" : "Add New Investigation"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 px-5 py-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="relative lg:col-span-1">
              <Label className="text-xs text-slate-500">Investigation / Test Name *</Label>
              <div className="relative mt-1">
                <Input
                  value={form.investigationName}
                  onChange={(e) => {
                    update("investigationName", e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search investigation"
                  className="pr-9"
                />
                <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
              </div>

              {searchOpen && filteredSuggestions.length > 0 && (
                <div className="absolute z-20 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
                  {filteredSuggestions.slice(0, 6).map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-blue-50"
                      onClick={() => {
                        update("investigationName", item);
                        setSearchOpen(false);
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label className="text-xs text-slate-500">Investigation Category *</Label>
              <Select value={form.category} onValueChange={(v) => update("category", v as InvestigationCategory)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hematology">Hematology</SelectItem>
                  <SelectItem value="Biochemistry">Biochemistry</SelectItem>
                  <SelectItem value="Radiology">Radiology</SelectItem>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Microbiology">Microbiology</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-slate-500">Priority *</Label>
              <Select value={form.priority} onValueChange={(v) => update("priority", v as InvestigationPriority)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Routine">Routine</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div>
              <Label className="text-xs text-slate-500">Sample Type *</Label>
              <Select value={form.sample} onValueChange={(v) => update("sample", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EDTA Whole Blood">EDTA Whole Blood</SelectItem>
                  <SelectItem value="Serum">Serum</SelectItem>
                  <SelectItem value="Plasma">Plasma</SelectItem>
                  <SelectItem value="Urine">Urine</SelectItem>
                  <SelectItem value="Swab">Swab</SelectItem>
                  <SelectItem value="—">—</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-slate-500">Fasting Required</Label>
              <div className="mt-2 flex flex-wrap gap-4">
                {(["Yes", "No", "Not Applicable"] as const).map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm text-slate-600">
                    <Checkbox checked={form.fastingRequired === opt} onCheckedChange={() => update("fastingRequired", opt)} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs text-slate-500">Timing / When to Collect</Label>
              <Select value={form.timing} onValueChange={(v) => update("timing", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Before Food">Before Food</SelectItem>
                  <SelectItem value="After Food">After Food</SelectItem>
                  <SelectItem value="At Bedtime">At Bedtime</SelectItem>
                  <SelectItem value="Anytime">Anytime</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <Label className="text-xs text-slate-500">Clinical Indication / Reason *</Label>
              <Textarea
                className="mt-1"
                rows={4}
                maxLength={500}
                value={form.indication}
                onChange={(e) => update("indication", e.target.value)}
                placeholder="Enter reason for ordering this investigation"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-500">Additional Instructions (Optional)</Label>
              <Textarea
                className="mt-1"
                rows={4}
                maxLength={500}
                value={form.additionalInstructions}
                onChange={(e) => update("additionalInstructions", e.target.value)}
                placeholder="Special instructions for lab/radiology"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div>
              <Label className="text-xs text-slate-500">Report Urgency</Label>
              <Select value={form.reportUrgency} onValueChange={(v) => update("reportUrgency", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Routine">Routine</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-slate-500">Expected Report Time</Label>
              <Select value={form.expectedReportTime} onValueChange={(v) => update("expectedReportTime", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Immediate">Immediate</SelectItem>
                  <SelectItem value="2 Hours">2 Hours</SelectItem>
                  <SelectItem value="24 Hours">24 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-slate-500">Repeat After (If Needed)</Label>
              <Select value={form.repeatAfter} onValueChange={(v) => update("repeatAfter", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Select">Select</SelectItem>
                  <SelectItem value="1 Day">1 Day</SelectItem>
                  <SelectItem value="3 Days">3 Days</SelectItem>
                  <SelectItem value="1 Week">1 Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="mb-3 text-sm font-semibold text-slate-800">Investigation Information</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-4"><span className="text-slate-500">Test Code</span><span className="font-medium text-slate-700">—</span></div>
                <div className="flex justify-between gap-4"><span className="text-slate-500">Method</span><span className="font-medium text-slate-700">—</span></div>
                <div className="flex justify-between gap-4"><span className="text-slate-500">Preparation</span><span className="font-medium text-slate-700">—</span></div>
              </div>
              <button className="mt-3 text-sm font-medium text-blue-600 hover:underline">View Full Test Details</button>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
              <p className="mb-3 text-sm font-semibold text-slate-800">Favorites</p>
              <label className="flex items-center gap-2 text-sm text-blue-600">
                <Checkbox checked={form.saveAsFavorite} onCheckedChange={(v) => update("saveAsFavorite", Boolean(v))} />
                Add to favorites
              </label>
              <div className="mt-4 rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm text-blue-700">
                Please confirm sample requirement before sending.
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
            {editingItem ? "Save Changes" : "Add Investigation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}