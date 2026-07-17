
"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Pill, Search } from "lucide-react";
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
import { MEDICINE_SUGGESTIONS } from "@/lib/doctor/ipd/medicine-orders-data";
import type { MedicineOrderItem } from "@/types/doctor/ipd/medicine-order-types";

interface AddMedicineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: MedicineOrderItem | null;
  onSave: (item: MedicineOrderItem) => void;
}

const defaultForm = {
  medicineName: "",
  strengthForm: "500 mg Tablet",
  route: "Oral",
  dose: "500",
  frequency: "TDS (Three a day)",
  duration: "5",
  durationUnit: "Days",
  timing: ["After Food"] as string[],
  startDate: "20 May 2024",
  endDate: "24 May 2024",
  instructions: "Take with a full glass of water.\nDo not exceed the recommended dose.",
  specialInstructions: "Monitor temperature.\nInform doctor if fever persists more than 3 days.",
  indication: "Fever",
  category: "Analgesic / Antipyretic",
  saveAsFavorite: false,
};

export function AddMedicineDialog({ open, onOpenChange, editingItem, onSave }: AddMedicineDialogProps) {
  const [form, setForm] = useState(defaultForm);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setForm({
        medicineName: editingItem.medicineName,
        strengthForm: editingItem.strengthForm,
        route: editingItem.route,
        dose: editingItem.dose.replace(" mg", ""),
        frequency: editingItem.frequency,
        duration: editingItem.duration.replace(" Days", "").replace(" Day", ""),
        durationUnit: "Days",
        timing: editingItem.timing,
        startDate: editingItem.startDate,
        endDate: editingItem.endDate,
        instructions: editingItem.instructions,
        specialInstructions: editingItem.specialInstructions,
        indication: editingItem.indication,
        category: editingItem.category,
        saveAsFavorite: editingItem.saveAsFavorite,
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingItem, open]);

  const filteredSuggestions = useMemo(
    () => MEDICINE_SUGGESTIONS.filter((m) => m.toLowerCase().includes(form.medicineName.toLowerCase())),
    [form.medicineName]
  );

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleTiming(value: string) {
    setForm((prev) => ({
      ...prev,
      timing: prev.timing.includes(value)
        ? prev.timing.filter((t) => t !== value)
        : [...prev.timing, value],
    }));
  }

  function handleSave() {
    if (!form.medicineName || !form.dose || !form.frequency || !form.duration) {
      toast.error("Please fill all required medicine details");
      return;
    }

    const item: MedicineOrderItem = {
      id: editingItem?.id ?? `MED-${Date.now()}`,
      medicineName: form.medicineName,
      strengthForm: form.strengthForm,
      dose: `${form.dose} mg`,
      route: form.route,
      frequency: form.frequency,
      duration: `${form.duration} ${form.durationUnit}`,
      startDate: form.startDate,
      endDate: form.endDate,
      timing: form.timing,
      instructions: form.instructions,
      specialInstructions: form.specialInstructions,
      indication: form.indication,
      category: form.category,
      saveAsFavorite: form.saveAsFavorite,
      status: "Pending",
    };

    console.log(editingItem ? "Updating medicine:" : "Adding medicine:", item);
    onSave(item);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[95vw] !max-w-[980px] max-h-[92vh] overflow-y-auto p-0">
        <DialogHeader className="border-b border-slate-100 px-5 py-4">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
            <Pill className="h-5 w-5 text-blue-600" />
            {editingItem ? "Edit Medicine" : "Add Medicine"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 px-5 py-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="relative lg:col-span-1">
              <Label className="text-xs text-slate-500">Medicine Name *</Label>
              <div className="relative mt-1">
                <Input
                  value={form.medicineName}
                  onChange={(e) => {
                    update("medicineName", e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Paracetamol"
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
                        update("medicineName", item);
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
              <Label className="text-xs text-slate-500">Strength / Form *</Label>
              <Select value={form.strengthForm} onValueChange={(v) => update("strengthForm", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="500 mg Tablet">500 mg Tablet</SelectItem>
                  <SelectItem value="650 mg Tablet">650 mg Tablet</SelectItem>
                  <SelectItem value="40 mg Tablet">40 mg Tablet</SelectItem>
                  <SelectItem value="75 mg Tablet">75 mg Tablet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-slate-500">Route *</Label>
              <Select value={form.route} onValueChange={(v) => update("route", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Oral">Oral</SelectItem>
                  <SelectItem value="IV">IV</SelectItem>
                  <SelectItem value="IM">IM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <div>
              <Label className="text-xs text-slate-500">Dose *</Label>
              <div className="mt-1 flex">
                <Input value={form.dose} onChange={(e) => update("dose", e.target.value)} />
                <span className="flex items-center rounded-r-md border border-l-0 border-slate-200 bg-slate-50 px-3 text-xs text-slate-500">mg</span>
              </div>
            </div>

            <div>
              <Label className="text-xs text-slate-500">Frequency *</Label>
              <Select value={form.frequency} onValueChange={(v) => update("frequency", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="OD (Once a day)">OD (Once a day)</SelectItem>
                  <SelectItem value="BD">BD</SelectItem>
                  <SelectItem value="TDS (Three a day)">TDS (Three a day)</SelectItem>
                  <SelectItem value="QID">QID</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="lg:col-span-2">
              <Label className="text-xs text-slate-500">Duration *</Label>
              <div className="mt-1 flex gap-2">
                <Input value={form.duration} onChange={(e) => update("duration", e.target.value)} />
                <Select value={form.durationUnit} onValueChange={(v) => update("durationUnit", v)}>
                  <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Days">Days</SelectItem>
                    <SelectItem value="Weeks">Weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs text-slate-500">Timing *</p>
            <div className="flex flex-wrap gap-4">
              {["Before Food", "After Food", "At Bedtime", "With Food"].map((t) => (
                <label key={t} className="flex items-center gap-2 text-sm text-slate-600">
                  <Checkbox checked={form.timing.includes(t)} onCheckedChange={() => toggleTiming(t)} />
                  {t}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div>
              <Label className="text-xs text-slate-500">Start Date *</Label>
              <Input className="mt-1" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} />
            </div>
            <div>
              <Label className="text-xs text-slate-500">End Date</Label>
              <Input className="mt-1" value={form.endDate} onChange={(e) => update("endDate", e.target.value)} />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <Checkbox />
                Till Discontinued
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <Label className="text-xs text-slate-500">Instructions To Patient</Label>
              <Textarea className="mt-1" rows={4} maxLength={250} value={form.instructions} onChange={(e) => update("instructions", e.target.value)} />
              <p className="text-right text-xs text-slate-400">{form.instructions.length}/250</p>
            </div>
            <div>
              <Label className="text-xs text-slate-500">Special Instructions (For Nurse / Pharmacy)</Label>
              <Textarea className="mt-1" rows={4} maxLength={250} value={form.specialInstructions} onChange={(e) => update("specialInstructions", e.target.value)} />
              <p className="text-right text-xs text-slate-400">{form.specialInstructions.length}/250</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div>
              <Label className="text-xs text-slate-500">Indication (Reason)</Label>
              <Select value={form.indication} onValueChange={(v) => update("indication", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fever">Fever</SelectItem>
                  <SelectItem value="Pain">Pain</SelectItem>
                  <SelectItem value="Hypertension">Hypertension</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-slate-500">Category</Label>
              <Select value={form.category} onValueChange={(v) => update("category", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Analgesic / Antipyretic">Analgesic / Antipyretic</SelectItem>
                  <SelectItem value="Antiplatelet">Antiplatelet</SelectItem>
                  <SelectItem value="Antihypertensive">Antihypertensive</SelectItem>
                  <SelectItem value="PPI">PPI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-blue-600">
                <Checkbox checked={form.saveAsFavorite} onCheckedChange={(v) => update("saveAsFavorite", Boolean(v))} />
                Add to favorites
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="mb-3 text-sm font-semibold text-slate-800">Drug Information</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-4"><span className="text-slate-500">Composition</span><span className="font-medium text-slate-700">Paracetamol 500 mg</span></div>
                <div className="flex justify-between gap-4"><span className="text-slate-500">Class</span><span className="font-medium text-slate-700">Analgesic / Antipyretic</span></div>
                <div className="flex justify-between gap-4"><span className="text-slate-500">Common Use</span><span className="font-medium text-slate-700">Pain relief, Fever</span></div>
              </div>
              <button className="mt-3 text-sm font-medium text-blue-600 hover:underline">View Full Details</button>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
              <p className="mb-3 text-sm font-semibold text-slate-800">Allergy Check</p>
              <div className="mb-3 rounded-lg bg-white px-3 py-2 text-sm text-emerald-600">
                No known allergy to this medicine.
              </div>
              <div className="rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm text-blue-700">
                Please re-check patient allergies before adding.
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
            {editingItem ? "Save Changes" : "Add Medicine"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}