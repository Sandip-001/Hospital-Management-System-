// app/ipd/doctor/clinical-examination/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Info, Save, StickyNote, FileText, ClipboardList, Upload, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { WARD_ROUND_PATIENTS, getPatientByUhid } from "@/lib/doctor/ipd/ward-round-data";
import { getVitalsForPatient } from "@/lib/doctor/ipd/vitals-data";
import { getClinicalExamination, getLabAlertsMini, getClinicalNotes } from "@/lib/doctor/ipd/clinical-examination-data";
import { ExamSectionCard } from "./_components/exam-section-card";
import { ExamTextField, ExamSelectField, ExamRadioField } from "./_components/exam-field";
import { LatestVitalsMini } from "./_components/latest-vitals-mini";
import { LabAlertsMini } from "./_components/lab-alerts-mini";
import { ClinicalNotesMini } from "./_components/clinical-notes-mini";
import type { ClinicalExaminationData } from "@/types/doctor/ipd/clinical-examination-types";
import { PatientStatusBadge } from "../ward-rounds/_components/patient-status-badge";
import { RoundProgressTracker } from "../ward-rounds/_components/round-progress-tracker";

export default function ClinicalExaminationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uhid = searchParams.get("uhid") ?? WARD_ROUND_PATIENTS[0].uhid;

  const patient = useMemo(() => getPatientByUhid(uhid), [uhid]);
  const vitals = useMemo(() => getVitalsForPatient(uhid)[0], [uhid]);
  const labAlerts = useMemo(() => getLabAlertsMini(uhid), [uhid]);
  const notes = useMemo(() => getClinicalNotes(uhid), [uhid]);

  const [examDateTime, setExamDateTime] = useState("2024-05-20T10:30");
  const [form, setForm] = useState<ClinicalExaminationData>(() => getClinicalExamination(uhid));

  function update<K extends keyof ClinicalExaminationData>(key: K, value: ClinicalExaminationData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleBack() {
    console.log("Back to Review Lab Results for UHID:", uhid);
    router.push(`/ipd/doctor/review-lab-results?uhid=${uhid}`);
  }

  function handleSaveDraft() {
    console.log("Save clinical examination as draft:", { uhid, examDateTime, ...form });
    toast.success("Clinical examination saved as draft");
  }

  function handleSaveAndNext() {
    console.log("Save & Next: Diagnosis Update for UHID:", uhid, { examDateTime, ...form });
    toast.success("Clinical examination saved");
    router.push(`/doctor/ipd/diagnosis-update?uhid=${uhid}`);
  }

  function handleQuickAction(label: string) {
    console.log("Quick action:", label, "for", uhid);
    toast.info(label);
  }

  return (
    <div className="min-h-screen overflow-x-hidden ">
      <div className="mx-auto w-full max-w-[1400px] space-y-5">
        {/* Patient header */}
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
            <Button variant="outline" className="w-full gap-2 lg:w-auto">Change Patient</Button>
          </CardContent>
        </Card>

        {/* Progress tracker */}
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="py-5">
            <p className="mb-4 text-sm font-semibold text-slate-800">Doctor Ward Round Progress</p>
            <RoundProgressTracker activeStep={4} />
          </CardContent>
        </Card>

        {/* Main layout */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px] lg:items-start">
          <div className="min-w-0 space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-base font-semibold text-slate-800">Clinical Examination</h1>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-500">Examination Date & Time</label>
                <Input type="datetime-local" value={examDateTime} onChange={(e) => setExamDateTime(e.target.value)} className="w-56 text-sm" />
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm text-blue-700">
              <Info className="h-4 w-4 shrink-0" /> Perform a comprehensive clinical examination and record findings.
            </div>

            {/* Exam grid: 3 columns on desktop */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <ExamSectionCard title="General Appearance">
                <div className="grid grid-cols-2 gap-3">
                  <ExamSelectField label="Consciousness" value={form.consciousness} onChange={(v) => update("consciousness", v)} options={["Alert", "Verbal", "Pain", "Unresponsive"]} />
                  <ExamSelectField label="Built" value={form.built} onChange={(v) => update("built", v)} options={["Thin", "Average", "Obese"]} />
                  <ExamSelectField label="Posture" value={form.posture} onChange={(v) => update("posture", v)} options={["Normal", "Abnormal"]} />
                  <ExamSelectField label="Distress" value={form.distress} onChange={(v) => update("distress", v)} options={["No", "Mild", "Severe"]} />
                </div>
              </ExamSectionCard>

              <ExamSectionCard title="Head, Eye, Ear, Nose, Throat (HEENT)">
                <ExamRadioField label="Pallor" value={form.pallor} onChange={(v) => update("pallor", v)} />
                <ExamRadioField label="Icterus" value={form.icterus} onChange={(v) => update("icterus", v)} />
                <ExamRadioField label="Cyanosis" value={form.cyanosis} onChange={(v) => update("cyanosis", v)} />
                <ExamRadioField label="Clubbing" value={form.clubbing} onChange={(v) => update("clubbing", v)} />
                <ExamSelectField label="JVP" value={form.jvp} onChange={(v) => update("jvp", v)} options={["Normal", "Raised"]} />
                <ExamTextField label="Oral Cavity" value={form.oralCavity} onChange={(v) => update("oralCavity", v)} />
              </ExamSectionCard>

              <ExamSectionCard title="Respiratory System">
                <ExamTextField label="Inspection" value={form.respInspection} onChange={(v) => update("respInspection", v)} />
                <ExamTextField label="Palpation" value={form.respPalpation} onChange={(v) => update("respPalpation", v)} />
                <ExamTextField label="Percussion" value={form.respPercussion} onChange={(v) => update("respPercussion", v)} />
                <ExamTextField label="Auscultation" value={form.respAuscultation} onChange={(v) => update("respAuscultation", v)} />
              </ExamSectionCard>

              <ExamSectionCard title="Cardiovascular System">
                <div className="grid grid-cols-2 gap-3">
                  <ExamTextField label="Heart Rate" value={form.heartRate} onChange={(v) => update("heartRate", v)} placeholder="bpm" />
                  <ExamSelectField label="Rhythm" value={form.rhythm} onChange={(v) => update("rhythm", v)} options={["Regular", "Irregular"]} />
                </div>
                <ExamTextField label="Heart Sounds" value={form.heartSounds} onChange={(v) => update("heartSounds", v)} />
                <div className="grid grid-cols-2 gap-3">
                  <ExamSelectField label="Peripheral Pulses" value={form.peripheralPulses} onChange={(v) => update("peripheralPulses", v)} options={["Normal", "Weak", "Absent"]} />
                  <ExamRadioField label="Edema" value={form.edema} onChange={(v) => update("edema", v)} />
                </div>
              </ExamSectionCard>

              <ExamSectionCard title="Abdomen">
                <ExamTextField label="Inspection" value={form.abdomenInspection} onChange={(v) => update("abdomenInspection", v)} />
                <ExamTextField label="Palpation" value={form.abdomenPalpation} onChange={(v) => update("abdomenPalpation", v)} />
                <ExamTextField label="Percussion" value={form.abdomenPercussion} onChange={(v) => update("abdomenPercussion", v)} />
                <ExamTextField label="Auscultation" value={form.abdomenAuscultation} onChange={(v) => update("abdomenAuscultation", v)} />
                <ExamRadioField label="Organomegaly" value={form.organomegaly} onChange={(v) => update("organomegaly", v)} />
              </ExamSectionCard>

              <ExamSectionCard title="Central Nervous System">
                <ExamSelectField label="Higher Mental Functions" value={form.higherMentalFunctions} onChange={(v) => update("higherMentalFunctions", v)} options={["Normal", "Impaired"]} />
                <ExamTextField label="Motor Power" value={form.motorPower} onChange={(v) => update("motorPower", v)} />
                <ExamSelectField label="Tone" value={form.tone} onChange={(v) => update("tone", v)} options={["Normal", "Increased", "Decreased"]} />
                <ExamSelectField label="Reflexes" value={form.reflexes} onChange={(v) => update("reflexes", v)} options={["Normal", "Exaggerated", "Diminished"]} />
                <ExamSelectField label="Sensory" value={form.sensory} onChange={(v) => update("sensory", v)} options={["Intact", "Impaired"]} />
              </ExamSectionCard>

              <ExamSectionCard title="Musculoskeletal System">
                <ExamRadioField label="Joint Tenderness" value={form.jointTenderness} onChange={(v) => update("jointTenderness", v)} />
                <ExamRadioField label="Swelling" value={form.swelling} onChange={(v) => update("swelling", v)} />
                <ExamSelectField label="Range Of Motion" value={form.rangeOfMotion} onChange={(v) => update("rangeOfMotion", v)} options={["Normal", "Restricted"]} />
              </ExamSectionCard>

              <ExamSectionCard title="Integumentary System">
                <ExamTextField label="Skin" value={form.skin} onChange={(v) => update("skin", v)} />
                <ExamTextField label="Rash / Lesion" value={form.rashLesion} onChange={(v) => update("rashLesion", v)} />
                <ExamTextField label="Pressure Area" value={form.pressureArea} onChange={(v) => update("pressureArea", v)} />
              </ExamSectionCard>

              <ExamSectionCard title="Other Findings / Additional Notes">
                <Textarea
                  rows={7}
                  maxLength={1000}
                  value={form.otherFindings}
                  onChange={(e) => update("otherFindings", e.target.value)}
                />
                <p className="text-right text-xs text-slate-400">{form.otherFindings.length}/1000</p>
              </ExamSectionCard>
            </div>

            {/* Footer note */}
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              <p className="flex items-center gap-2">
                <Info className="h-4 w-4 shrink-0" /> All fields are optional. Enter applicable findings and observations.
              </p>
            </div>

            {/* Action bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2" onClick={handleSaveDraft}>
                  <Save className="h-4 w-4" /> Save as Draft
                </Button>
                <Button variant="outline" className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50" onClick={handleSaveDraft}>
                  Save & Next
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleSaveAndNext}>
                  Next: Diagnosis Update <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5 lg:sticky lg:top-6">
            <LatestVitalsMini vitals={vitals} />
            <LabAlertsMini alerts={labAlerts} />
            <ClinicalNotesMini notes={notes} />
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="space-y-1 py-3">
                <p className="mb-2 px-2 text-sm font-semibold text-slate-800">Quick Actions</p>
                <QuickAction icon={ClipboardList} label="View Vitals History" onClick={() => handleQuickAction("View Vitals History")} />
                <QuickAction icon={FileText} label="View Lab Results" onClick={() => handleQuickAction("View Lab Results")} />
                <QuickAction icon={StickyNote} label="Add Clinical Note" onClick={() => handleQuickAction("Add Clinical Note")} />
                <QuickAction icon={Upload} label="Upload Document" onClick={() => handleQuickAction("Upload Document")} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
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

function QuickAction({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm text-blue-600 hover:bg-blue-50">
      <span className="flex items-center gap-2"><Icon className="h-4 w-4" /> {label}</span>
    </button>
  );
}