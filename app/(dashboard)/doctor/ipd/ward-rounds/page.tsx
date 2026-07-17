
"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Search, ChevronDown, Save, ArrowRight, Info, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { PatientStatusBadge } from "./_components/patient-status-badge";
import { RoundProgressTracker } from "./_components/round-progress-tracker";
import { ChangePatientDialog } from "./_components/change-patient-dialog";
import { VitalsWidget } from "./_components/vitals-widget";
import { LabHighlightsWidget } from "./_components/lab-highlights-widget";
import { QuickActionsWidget } from "./_components/quick-actions-widget";
import { WARD_ROUND_PATIENTS, getPatientByUhid } from "@/lib/doctor/ipd/ward-round-data";

export default function DoctorWardRoundPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialUhid = searchParams.get("uhid") ?? WARD_ROUND_PATIENTS[0].uhid;

  const [selectedUhid, setSelectedUhid] = useState(initialUhid);
  const [changePatientOpen, setChangePatientOpen] = useState(false);
  const [roundDateTime, setRoundDateTime] = useState("2024-05-20T10:15");
  const [subjective, setSubjective] = useState("Complains of mild chest discomfort on exertion since 2 days.\nNo breathlessness at rest. No palpitations. Appetite normal.");
  const [intervalHistory, setIntervalHistory] = useState("Patient reports slight improvement in symptoms.");
  const [objective, setObjective] = useState("Patient is conscious, oriented, comfortable at rest.\nNo cyanosis, clubbing, edema.");
  const [doctorNotes, setDoctorNotes] = useState("");

  const patient = useMemo(() => getPatientByUhid(selectedUhid), [selectedUhid]);

  function handleSelectPatient(uhid: string) {
    console.log("Patient changed to:", uhid);
    setSelectedUhid(uhid);
    toast.success(`Switched to ${getPatientByUhid(uhid).patientName}`);
  }

  function handleReviewVitals() {
    console.log("Navigating to Review Vitals for UHID:", patient.uhid);
    router.push(`/doctor/ipd/review-vitals?uhid=${patient.uhid}`);
  }

  function handleSaveDraft() {
    console.log("Saving ward round as draft:", { uhid: patient.uhid, subjective, intervalHistory, objective, doctorNotes });
    toast.success("Ward round saved as draft");
  }

  function handleQuickAction(label: string) {
    console.log("Quick action:", label, "for", patient.uhid);
    toast.info(label);
  }

  return (
    <div className="min-h-screen ">
      <div className="mx-auto max-w-[1400px] space-y-5">
        {/* Select Patient bar */}
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:max-w-xs">
              <label className="mb-1.5 block text-xs font-medium text-slate-500">Select Patient</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input readOnly placeholder="Search by Name / UHID / IPD No. / Bed" className="cursor-pointer pl-9" onClick={() => setChangePatientOpen(true)} />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setChangePatientOpen(true)}
              className="flex flex-1 items-center gap-3 rounded-lg border border-slate-100 px-3 py-2 text-left hover:bg-slate-50 sm:flex-initial sm:min-w-[280px]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-600">
                {patient.patientName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  {patient.patientName}
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">Current</span>
                </p>
                <p className="text-xs text-slate-400">{patient.age} Y / {patient.gender} · UHID: {patient.uhid}</p>
                <p className="text-xs text-slate-400">IPD: {patient.ipdId} · Bed: {patient.wardRoomBed.split("/").pop()?.trim()}</p>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
            </button>

            <Button variant="outline" className="w-full gap-2 sm:w-auto" onClick={() => setChangePatientOpen(true)}>
              Change Patient
            </Button>
          </CardContent>
        </Card>

        {/* Patient info strip */}
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-3 lg:grid-cols-7">
            <div className="col-span-2 flex items-center gap-3 sm:col-span-3 lg:col-span-1">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-600">
                {patient.patientName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
              </span>
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  {patient.patientName} <PatientStatusBadge status={patient.status} />
                </p>
                <p className="text-xs text-slate-400">{patient.age} Y / {patient.gender} · Blood Group: {patient.bloodGroup}</p>
              </div>
            </div>
            <InfoBlock label="Ward / Room / Bed" value={patient.wardRoomBed} />
            <InfoBlock label="Department" value={patient.department} />
            <InfoBlock label="Admitting Doctor" value={patient.admittingDoctor} />
            <InfoBlock label="Admission Date & Time" value={patient.admissionDateTime} />
            <InfoBlock
              label="Allergies"
              value={patient.allergies.length ? `${patient.allergies[0]}${patient.allergies.length > 1 ? ` +${patient.allergies.length - 1}` : ""}` : "None"}
            />
          </CardContent>
        </Card>

        {/* Main layout */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]">
          <div className="space-y-5">
            {/* Progress tracker */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="py-4">
                <p className="mb-3 text-sm font-semibold text-slate-800">Doctor Ward Round Progress</p>
                <RoundProgressTracker activeStep={1} />
              </CardContent>
            </Card>

            {/* Ward round form */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="space-y-5 py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-base font-semibold text-slate-800">Doctor Ward Round</h2>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-slate-500">Round Date & Time</label>
                    <div className="relative">
                      <Input
                        type="datetime-local"
                        value={roundDateTime}
                        onChange={(e) => setRoundDateTime(e.target.value)}
                        className="w-56 pr-8 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Subjective (Patient Complaints)">
                    <Textarea rows={4} value={subjective} onChange={(e) => setSubjective(e.target.value)} />
                  </FormField>
                  <FormField label="Interval History">
                    <Textarea rows={4} value={intervalHistory} onChange={(e) => setIntervalHistory(e.target.value)} />
                  </FormField>
                  <FormField label="Objective (General Observation)">
                    <Textarea rows={4} value={objective} onChange={(e) => setObjective(e.target.value)} />
                  </FormField>
                  <FormField label="Notes (Doctor)">
                    <Textarea
                      rows={4}
                      placeholder="Enter your notes..."
                      maxLength={2000}
                      value={doctorNotes}
                      onChange={(e) => setDoctorNotes(e.target.value)}
                    />
                    <p className="mt-1 text-right text-xs text-slate-400">{doctorNotes.length}/2000</p>
                  </FormField>
                </div>

                <div className="flex justify-end">
                  <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleReviewVitals}>
                    Review Vitals <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Footer note bar */}
            <div className="flex flex-col gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-sm text-blue-700">
                <Info className="h-4 w-4 shrink-0" />
                Proceed step by step to complete the ward round. You can save as draft and continue later.
              </p>
              <Button variant="outline" size="sm" className="gap-2 bg-white" onClick={handleSaveDraft}>
                <Save className="h-3.5 w-3.5" /> Save as Draft
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <VitalsWidget vitals={patient.vitals} />
            <LabHighlightsWidget labs={patient.labHighlights} />
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="space-y-2 py-4">
                <p className="text-sm font-semibold text-slate-800">Current Diagnosis</p>
                <div className="flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2">
                  <span className="text-sm font-medium text-blue-700">{patient.currentDiagnosis}</span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-blue-600">{patient.diagnosisCode}</span>
                </div>
              </CardContent>
            </Card>
            {/*<QuickActionsWidget onAction={handleQuickAction} /> */}
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
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</label>
      {children}
    </div>
  );
}