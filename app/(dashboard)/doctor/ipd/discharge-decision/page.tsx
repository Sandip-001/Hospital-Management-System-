// app/ipd/doctor/discharge-decision/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft, CheckCircle2, ChevronRight, FileText, Info, Plus,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { WARD_ROUND_PATIENTS, getPatientByUhid } from "@/lib/doctor/ipd/ward-round-data";
import { getVitalsForPatient } from "@/lib/doctor/ipd/vitals-data";
import { getDiagnosisData } from "@/lib/doctor/ipd/diagnosis-data";
import { getTreatmentPlanData } from "@/lib/doctor/ipd/treatment-plan-data";
import { getMedicineOrdersData } from "@/lib/doctor/ipd/medicine-orders-data";
import { getInvestigationOrdersData } from "@/lib/doctor/ipd/investigation-orders-data";
import { getDischargeDecisionData } from "@/lib/doctor/ipd/discharge-decision-data";
import type { DischargeDecisionType, DischargeMedication, DischargeMode } from "@/types/doctor/ipd/discharge-decision-types";
import { PatientStatusBadge } from "../ward-rounds/_components/patient-status-badge";
import { ChangePatientDialog } from "../ward-rounds/_components/change-patient-dialog";

export default function DischargeDecisionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uhid = searchParams.get("uhid") ?? WARD_ROUND_PATIENTS[0].uhid;

  const patient = useMemo(() => getPatientByUhid(uhid), [uhid]);
  const vitals = useMemo(() => getVitalsForPatient(uhid)[0], [uhid]);
  const diagnosis = useMemo(() => getDiagnosisData(uhid).currentDiagnoses, [uhid]);
  const treatment = useMemo(() => getTreatmentPlanData(uhid), [uhid]);
  const medicines = useMemo(() => getMedicineOrdersData(uhid).items, [uhid]);
  const investigations = useMemo(() => getInvestigationOrdersData(uhid).items, [uhid]);
  const initialData = useMemo(() => getDischargeDecisionData(uhid), [uhid]);

  const [changePatientOpen, setChangePatientOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const [assessmentDateTime, setAssessmentDateTime] = useState("2024-05-20T14:30");
  const [clinicalStable, setClinicalStable] = useState(initialData.clinicalStable);
  const [vitalsNormal, setVitalsNormal] = useState(initialData.vitalsNormal);
  const [primaryDiagnosisControlled, setPrimaryDiagnosisControlled] = useState(initialData.primaryDiagnosisControlled);
  const [labParametersAcceptable, setLabParametersAcceptable] = useState(initialData.labParametersAcceptable);
  const [activityIndependent, setActivityIndependent] = useState(initialData.activityIndependent);
  const [patientWilling, setPatientWilling] = useState(initialData.patientWilling);

  const [dischargeDecision, setDischargeDecision] = useState(initialData.dischargeDecision);
  const [dischargeDateTime, setDischargeDateTime] = useState(initialData.dischargeDateTime);
  const [dischargeMode, setDischargeMode] = useState<DischargeMode>(initialData.dischargeMode);
  const [accompaniedBy, setAccompaniedBy] = useState(initialData.accompaniedBy);
  const [instructionsGivenBy, setInstructionsGivenBy] = useState(initialData.instructionsGivenBy);

  const [followUpDate, setFollowUpDate] = useState(initialData.followUpDate);
  const [followUpWith, setFollowUpWith] = useState(initialData.followUpWith);
  const [visitType, setVisitType] = useState(initialData.visitType);
  const [remarks, setRemarks] = useState(initialData.remarks);
  const [notes, setNotes] = useState(initialData.notes);
  const [medications, setMedications] = useState<DischargeMedication[]>(initialData.medications);

  const overallReady =
    clinicalStable && vitalsNormal && primaryDiagnosisControlled && labParametersAcceptable && activityIndependent && patientWilling;

  function handleSelectPatient(newUhid: string) {
    router.push(`/doctor/ipd/discharge-decision?uhid=${newUhid}`);
  }

  function handleAddMedicine() {
    const row: DischargeMedication = {
      id: `DM-${Date.now()}`,
      medicineName: "New Medicine",
      dose: "—",
      frequency: "—",
      duration: "—",
    };
    setMedications((prev) => [...prev, row]);
    toast.success("Medicine added");
  }

  function handleConfirmDischarge() {
    if (!overallReady) {
      toast.error("Patient is not fully ready for discharge");
      return;
    }
    setConfirmed(true);
    toast.success("Discharge confirmed. Discharge certificate is ready.");
    console.log("Confirm discharge:", {
      uhid,
      assessmentDateTime,
      dischargeDecision,
      dischargeDateTime,
      dischargeMode,
      accompaniedBy,
      instructionsGivenBy,
      followUpDate,
      followUpWith,
      visitType,
      remarks,
      notes,
      medications,
    });
  }

  function handleBack() {
    router.push(`/doctor/ipd/investigation-orders?uhid=${uhid}`);
  }

  function handleSaveDraft() {
    toast.success("Discharge decision saved as draft");
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
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
                <h1 className="text-lg font-semibold text-slate-800">Discharge Decision</h1>
                <p className="text-xs text-slate-400">Evaluate patient status and decide on discharge plan.</p>
              </div>

              <div className="flex items-center gap-2">
                <label className="whitespace-nowrap text-xs font-medium text-slate-500">Assessment Date & Time</label>
                <Input
                  type="datetime-local"
                  value={assessmentDateTime}
                  onChange={(e) => setAssessmentDateTime(e.target.value)}
                  className="w-56 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_0.85fr]">
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="space-y-5 py-4">
                  <SectionTitle title="1. Discharge Readiness Assessment" />
                  <ChecklistRow label="Is the patient clinically stable?" checked={clinicalStable} onChange={setClinicalStable} />
                  <ChecklistRow label="Are vital signs within acceptable range?" checked={vitalsNormal} onChange={setVitalsNormal} />
                  <ChecklistRow label="Is the primary diagnosis under control?" checked={primaryDiagnosisControlled} onChange={setPrimaryDiagnosisControlled} />
                  <ChecklistRow label="Are lab parameters acceptable?" checked={labParametersAcceptable} onChange={setLabParametersAcceptable} />
                  <ChecklistRow label="Is the patient able to perform activities of daily living?" checked={activityIndependent} onChange={setActivityIndependent} />
                  <ChecklistRow label="Is the patient willing for discharge and understands instructions?" checked={patientWilling} onChange={setPatientWilling} />

                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-xs font-medium text-emerald-700">Overall Readiness Status</p>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
                      <CheckCircle2 className="h-4 w-4" />
                      {overallReady ? "Fit for Discharge" : "Not Ready"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm">
                <CardContent className="space-y-4 py-4">
                  <SectionTitle title="2. Discharge Plan" />
                  <Field label="Discharge Decision *">
                    <Select value={dischargeDecision} onValueChange={(value) => setDischargeDecision(value as DischargeDecisionType)}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Discharge to Home">Discharge to Home</SelectItem>
                        <SelectItem value="Discharge to Rehab">Discharge to Rehab</SelectItem>
                        <SelectItem value="Transfer to Another Facility">Transfer to Another Facility</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Discharge Date & Time *">
                    <Input type="datetime-local" className="mt-1" value={dischargeDateTime} onChange={(e) => setDischargeDateTime(e.target.value)} />
                  </Field>

                  <Field label="Mode of Discharge">
                    <div className="grid grid-cols-3 gap-2">
                      {(["Walk Out", "Wheel Chair", "Stretcher"] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setDischargeMode(mode)}
                          className={`rounded-lg border px-3 py-2 text-sm transition ${dischargeMode === mode ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label="Accompanied By">
                    <Input className="mt-1" value={accompaniedBy} onChange={(e) => setAccompaniedBy(e.target.value)} />
                  </Field>

                  <Field label="Discharge Instructions Given By">
                    <Select value={instructionsGivenBy} onValueChange={setInstructionsGivenBy}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dr. Amit Verma">Dr. Amit Verma</SelectItem>
                        <SelectItem value="Dr. Ravi Sharma">Dr. Ravi Sharma</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1fr_0.9fr]">
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="py-4">
                  <div className="mb-3 flex items-center justify-between">
                    <SectionTitle title="3. Medications at Discharge" />
                    <Button variant="outline" size="sm" className="gap-2" onClick={handleAddMedicine}>
                      <Plus className="h-4 w-4" /> Add Medicine
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-slate-100 text-left text-slate-500">
                        <tr>
                          <th className="py-2">Medicine</th>
                          <th>Dose</th>
                          <th>Frequency</th>
                          <th>Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {medications.map((m) => (
                          <tr key={m.id} className="border-b border-slate-50">
                            <td className="py-2 font-medium text-slate-800">{m.medicineName}</td>
                            <td className="text-slate-600">{m.dose}</td>
                            <td className="text-slate-600">{m.frequency}</td>
                            <td className="text-slate-600">{m.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm">
                <CardContent className="space-y-4 py-4">
                  <SectionTitle title="4. Follow-up Plan" />
                  <Field label="Follow-up Date *">
                    <Input type="date" className="mt-1" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />
                  </Field>
                  <Field label="Follow-up With *">
                    <Select value={followUpWith} onValueChange={setFollowUpWith}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dr. Amit Verma (Cardiology)">Dr. Amit Verma (Cardiology)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Visit Type">
                    <Select value={visitType} onValueChange={setVisitType}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPD Follow-up">OPD Follow-up</SelectItem>
                        <SelectItem value="Tele Follow-up">Tele Follow-up</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Remarks (Optional)">
                    <Textarea className="mt-1" rows={4} maxLength={250} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                  </Field>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm">
                <CardContent className="space-y-3 py-4">
                  <SectionTitle title="5. Advice & Instructions to Patient" />
                  <ul className="space-y-2 text-sm text-slate-700">
                    {[
                      "Take all medicines as prescribed.",
                      "Avoid heavy physical exertion for 1 week.",
                      "Follow a low-fat, low-salt diet.",
                      "Report to hospital immediately if you have chest pain, breathlessness, or palpitations.",
                      "Carry this discharge summary during follow-up visit.",
                    ].map((t) => (
                      <li key={t} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="py-4">
                <SectionTitle title="Additional Notes (Optional)" />
                <Textarea className="mt-1" rows={4} maxLength={500} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </CardContent>
            </Card>

            <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              <p className="flex items-center gap-2">
                <Info className="h-4 w-4 shrink-0" /> Once confirmed, the patient will be marked as discharged and bed will be made available for new admission.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
              <Button variant="outline" className="gap-2 sm:w-auto" onClick={handleSaveDraft}>
                <FileText className="h-4 w-4" /> Save as Draft
              </Button>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" className="gap-2" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" /> Cancel
                </Button>
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleConfirmDischarge} disabled={!overallReady}>
                  <ShieldCheck className="h-4 w-4" /> Confirm Discharge
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-5 lg:sticky lg:top-6">
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="py-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800">Patient Summary</p>
                  <Button variant="outline" size="sm">View Full Summary</Button>
                </div>
                <SummaryRow label="Primary Diagnosis" value={diagnosis[0]?.diagnosis ?? "—"} />
                <SummaryRow label="Secondary Diagnosis" value={diagnosis[1]?.diagnosis ?? "—"} />
                <SummaryRow label="Duration of Stay" value="2 Days" />
                <SummaryRow label="Admission Date" value={patient.admissionDateTime} />
                <SummaryRow label="Treating Doctor" value={patient.admittingDoctor} />
                <SummaryRow label="Current Status" value="Stable" />
                <SummaryRow label="Last Updated" value={vitals.dateTime} />
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="py-4">
                <p className="mb-3 text-sm font-semibold text-slate-800">Documents & Checklist</p>
                <ChecklistLink label="Discharge Summary" />
                <ChecklistLink label="Medication Chart" />
                <ChecklistLink label="Investigation Reports" />
                <ChecklistLink label="Procedure Reports" />
                <ChecklistLink label="Consent Forms" />
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="space-y-1 py-3">
                <p className="mb-2 px-2 text-sm font-semibold text-slate-800">Quick Actions</p>
                <QuickAction label="Preview Discharge Summary" />
                <QuickAction label="Print Discharge Summary" />
                <QuickAction label="Send Discharge Summary to Patient" />
                <QuickAction label="Discharge History" />
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
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <p className="text-sm font-semibold text-slate-800">{title}</p>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-slate-500">{label}</label>
      {children}
    </div>
  );
}

function ChecklistRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5">
      <div className="flex items-center gap-2">
        <CheckCircle2 className={`h-4 w-4 ${checked ? "text-emerald-500" : "text-slate-300"}`} />
        <span className="text-sm text-slate-700">{label}</span>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <label className="flex items-center gap-1"><Checkbox checked={checked} onCheckedChange={() => onChange(true)} /> Yes</label>
        <label className="flex items-center gap-1"><Checkbox checked={!checked} onCheckedChange={() => onChange(false)} /> No</label>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-2 text-sm last:border-b-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function ChecklistLink({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5">
      <span className="text-sm text-slate-700">{label}</span>
      <button className="text-xs font-medium text-blue-600 hover:underline">View / Download</button>
    </div>
  );
}

function QuickAction({ label }: { label: string }) {
  return (
    <button className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm text-blue-600 hover:bg-blue-50">
      <span className="flex items-center gap-2">{label}</span>
      <ChevronRight className="h-4 w-4" />
    </button>
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