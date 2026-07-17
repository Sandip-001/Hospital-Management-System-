
"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft, ArrowRight, Info, Plus, Trash2,
  ClipboardCheck, FileText, CircleAlert, History,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { WARD_ROUND_PATIENTS, getPatientByUhid } from "@/lib/doctor/ipd/ward-round-data";
import { getVitalsForPatient } from "@/lib/doctor/ipd/vitals-data";
import { getDiagnosisData } from "@/lib/doctor/ipd/diagnosis-data";
import { getMedicineOrdersData } from "@/lib/doctor/ipd/medicine-orders-data";
import { MedicineOrdersTable } from "./_components/medicine-orders-table";
import { AddMedicineDialog } from "./_components/add-medicine-dialog";
import { ClearAllMedicinesDialog } from "./_components/clear-all-medicines-dialog";
import type { MedicineOrderItem } from "@/types/doctor/ipd/medicine-order-types";
import { PatientStatusBadge } from "../ward-rounds/_components/patient-status-badge";
import { LatestVitalsMini } from "../clinical-examination/_components/latest-vitals-mini";
import { ChangePatientDialog } from "../ward-rounds/_components/change-patient-dialog";

export default function MedicineOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uhid = searchParams.get("uhid") ?? WARD_ROUND_PATIENTS[0].uhid;

  const patient = useMemo(() => getPatientByUhid(uhid), [uhid]);
  const vitals = useMemo(() => getVitalsForPatient(uhid)[0], [uhid]);
  const diagnosis = useMemo(() => getDiagnosisData(uhid).currentDiagnoses, [uhid]);
  const initialData = useMemo(() => getMedicineOrdersData(uhid), [uhid]);

  const [changePatientOpen, setChangePatientOpen] = useState(false);
  const [addMedicineOpen, setAddMedicineOpen] = useState(false);
  const [clearAllOpen, setClearAllOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MedicineOrderItem | null>(null);

  const [orderDateTime, setOrderDateTime] = useState("2024-05-20T11:15");
  const [searchMedicine, setSearchMedicine] = useState("");
  const [favorite, setFavorite] = useState("");
  const [items, setItems] = useState<MedicineOrderItem[]>(initialData.items);
  const [notes, setNotes] = useState(initialData.notes);

  const filteredItems = useMemo(
    () => items.filter((item) => item.medicineName.toLowerCase().includes(searchMedicine.toLowerCase())),
    [items, searchMedicine]
  );

  const hasPendingMedicine = items.some((item) => item.status === "Pending");
  const activeCount = items.filter((item) => item.status === "Active").length;

  function handleSelectPatient(newUhid: string) {
    console.log("Patient changed in Medicine Orders to:", newUhid);
    router.push(`/doctor/ipd/medicine-orders?uhid=${newUhid}`);
  }

  function handleOpenAddMedicine() {
    setEditingItem(null);
    setAddMedicineOpen(true);
  }

  function handleSaveMedicine(item: MedicineOrderItem) {
    if (editingItem) {
      setItems((prev) => prev.map((row) => (row.id === item.id ? { ...item, status: "Pending" } : row)));
      toast.success("Medicine updated and marked as pending");
    } else {
      setItems((prev) => [...prev, item]);
      toast.success("Medicine added with pending status");
    }
  }

  function handleEdit(item: MedicineOrderItem) {
    console.log("Edit medicine:", item);
    setEditingItem(item);
    setAddMedicineOpen(true);
  }

  function handleDelete(id: string) {
    console.log("Delete medicine:", id);
    setItems((prev) => prev.filter((row) => row.id !== id));
    toast.success("Medicine deleted");
  }

  function handleAddToOrder() {
    console.log("Sending pending medicines to pharmacist for UHID:", uhid);
    setItems((prev) => prev.map((row) => ({ ...row, status: "Active" })));
    toast.success("Medicines sent to pharmacist. Pending items are now active.");
  }

  function handleClearAll() {
    console.log("Clear all medicines for UHID:", uhid);
    setItems([]);
    toast.success("All medicines deleted");
  }

  function handleBack() {
    console.log("Back to Treatment Plan for UHID:", uhid);
    router.push(`/doctor/ipd/treatment-plan?uhid=${uhid}`);
  }

  function handleNextInvestigationOrders() {
    console.log("Navigating to Investigation Orders for UHID:", uhid);
    router.push(`/doctor/ipd/investigation-orders?uhid=${uhid}`);
  }

  function handleQuickAction(label: string) {
    console.log("Quick action:", label, "for", uhid);
    toast.info(label);
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-[1400px] space-y-5">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-600">
                {patient.patientName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
              </span>
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  {patient.patientName} <PatientStatusBadge status={patient.status} />
                </p>
                <p className="text-xs text-slate-400">
                  {patient.age} Y / {patient.gender} · UHID: {patient.uhid} · IPD: {patient.ipdId} · Bed: {patient.wardRoomBed.split("/").pop()?.trim()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:flex lg:items-center lg:gap-8">
              <InfoBlock label="Ward / Room / Bed" value={patient.wardRoomBed} />
              <InfoBlock label="Department" value={patient.department} />
              <InfoBlock label="Attending Doctor" value={patient.admittingDoctor} />
              <InfoBlock label="Admission Date" value={patient.admissionDateTime} />
            </div>

            <Button variant="outline" className="w-full gap-2 lg:w-auto" onClick={() => setChangePatientOpen(true)}>
              Change Patient
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px] lg:items-start">
          <div className="min-w-0 space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-lg font-semibold text-slate-800">Medicine Orders</h1>
                <p className="text-xs text-slate-400">Prescribe and review medicines for the patient.</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="whitespace-nowrap text-xs font-medium text-slate-500">Order Date & Time</label>
                <Input
                  type="datetime-local"
                  value={orderDateTime}
                  onChange={(e) => setOrderDateTime(e.target.value)}
                  className="w-56 text-sm"
                />
              </div>
            </div>

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="space-y-4 py-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px_auto]">
                  <div>
                    <label className="text-xs text-slate-500">Search Medicine</label>
                    <Input
                      className="mt-1"
                      placeholder="Search by medicine name"
                      value={searchMedicine}
                      onChange={(e) => setSearchMedicine(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500">Favorites</label>
                    <Select value={favorite} onValueChange={setFavorite}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select Favorite" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paracetamol">Paracetamol</SelectItem>
                        <SelectItem value="Pantoprazole">Pantoprazole</SelectItem>
                        <SelectItem value="Telmisartan">Telmisartan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      className="w-full gap-2 bg-blue-600 hover:bg-blue-700 md:w-auto"
                      onClick={handleAddToOrder}
                      disabled={!hasPendingMedicine}
                    >
                      <Plus className="h-4 w-4" /> Add to Order
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-semibold text-slate-800">Ordered Medicines ({filteredItems.length})</p>
                  <MedicineOrdersTable items={filteredItems} onEdit={handleEdit} onDelete={handleDelete} />
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Button variant="outline" className="gap-2" onClick={handleOpenAddMedicine}>
                    <Plus className="h-4 w-4" /> Add Medicine
                  </Button>

                  <Button
                    variant="outline"
                    className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => setClearAllOpen(true)}
                    disabled={items.length === 0}
                  >
                    <Trash2 className="h-4 w-4" /> Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="py-4">
                <p className="mb-3 text-sm font-semibold text-slate-800">Order Instructions / Notes (Optional)</p>
                <Textarea rows={5} maxLength={1000} value={notes} onChange={(e) => setNotes(e.target.value)} />
                <p className="text-right text-xs text-slate-400">{notes.length}/1000</p>
              </CardContent>
            </Card>

            <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              <p className="flex items-center gap-2">
                <Info className="h-4 w-4 shrink-0" /> Orders will be sent to pharmacy for verification and dispensing.
              </p>
            </div>

            <div className="flex justify-between gap-2">
              <Button variant="outline" className="gap-2" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" /> Cancel
              </Button>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleNextInvestigationOrders}>
                Next: Review Investigation Orders <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-5 lg:sticky lg:top-6">
            <LatestVitalsMini vitals={vitals} />

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="space-y-3 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800">Allergy / Intolerance</p>
                  <button className="text-xs font-medium text-blue-600 hover:underline">Edit</button>
                </div>
                <p className="text-sm text-slate-600">{initialData.allergies}</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="space-y-3 py-4">
                <p className="text-sm font-semibold text-slate-800">Order Summary</p>
                <SummaryRow label="Total Medicines" value={String(items.length)} />
                <SummaryRow label="Active Orders" value={String(activeCount)} />
                <SummaryRow
                  label="Duration Coverage"
                  value={items.length ? items.reduce((max, row) => Math.max(max, Number.parseInt(row.duration) || 0), 0) + " Days" : "0 Days"}
                />
                <SummaryRow label="Preferred Pharmacy" value={initialData.preferredPharmacy} action="Change" />
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="space-y-1 py-3">
                <p className="mb-2 px-2 text-sm font-semibold text-slate-800">Quick Actions</p>
                <QuickAction icon={ClipboardCheck} label="View Treatment Plan" onClick={() => handleQuickAction("View Treatment Plan")} />
                <QuickAction icon={CircleAlert} label="View Diagnosis" onClick={() => handleQuickAction("View Diagnosis")} />
                <QuickAction icon={FileText} label="View Lab Results" onClick={() => handleQuickAction("View Lab Results")} />
                <QuickAction icon={History} label="Medication History" onClick={() => handleQuickAction("Medication History")} />
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="py-4">
                <p className="mb-3 text-sm font-semibold text-slate-800">Active Clinical Problems</p>
                <div className="space-y-2.5">
                  {diagnosis.map((d) => (
                    <div key={d.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-700">{d.diagnosis}</span>
                      <Badge
                        variant="outline"
                        className={d.isPrimary ? "border-blue-200 bg-blue-50 text-blue-600" : "border-amber-200 bg-amber-50 text-amber-600"}
                      >
                        {d.isPrimary ? "Primary" : "Co-morbidity"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ChangePatientDialog
        patients={WARD_ROUND_PATIENTS}
        currentUhid={patient.uhid}
        open={changePatientOpen}
        onOpenChange={setChangePatientOpen}
        onSelectPatient={handleSelectPatient}
      />

      <AddMedicineDialog
        open={addMedicineOpen}
        onOpenChange={setAddMedicineOpen}
        editingItem={editingItem}
        onSave={handleSaveMedicine}
      />

      <ClearAllMedicinesDialog
        open={clearAllOpen}
        onOpenChange={setClearAllOpen}
        onConfirm={handleClearAll}
      />
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="whitespace-nowrap text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value, action }: { label: string; value: string; action?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-slate-500">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-800">{value}</span>
        {action && <button className="text-xs font-medium text-blue-600 hover:underline">{action}</button>}
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm text-blue-600 hover:bg-blue-50"
    >
      <span className="flex items-center gap-2"><Icon className="h-4 w-4" /> {label}</span>
    </button>
  );
}