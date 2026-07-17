// lib/clinical-examination-data.ts
import type { ClinicalExaminationData, LabAlertMini, ClinicalNote } from "@/types/doctor/ipd/clinical-examination-types";

export const CLINICAL_EXAMINATION_DEFAULTS: Record<string, ClinicalExaminationData> = {
  UHID12345685: {
    consciousness: "Alert", built: "Average", posture: "Normal", distress: "No",
    pallor: "Absent", icterus: "Absent", cyanosis: "Absent", clubbing: "Absent",
    jvp: "Normal", oralCavity: "Moist, No lesions",
    respInspection: "Normal chest movement", respPalpation: "Chest expansion equal", respPercussion: "Resonant", respAuscultation: "B/L air entry equal, No added sounds",
    heartRate: "78", rhythm: "Regular", heartSounds: "S1 S2 normal, No murmur", peripheralPulses: "Normal", edema: "Absent",
    abdomenInspection: "No distension", abdomenPalpation: "Soft, Non-tender", abdomenPercussion: "Normal", abdomenAuscultation: "Bowel sounds present", organomegaly: "Absent",
    higherMentalFunctions: "Normal", motorPower: "5/5 in all limbs", tone: "Normal", reflexes: "Normal", sensory: "Intact",
    jointTenderness: "Absent", swelling: "Absent", rangeOfMotion: "Normal",
    skin: "Warm, Dry", rashLesion: "Absent", pressureArea: "No sore",
    otherFindings: "No significant abnormality detected.",
  },
};

export const LAB_ALERTS_MINI: Record<string, LabAlertMini[]> = {
  UHID12345685: [
    { testName: "Hemoglobin (Hb)", value: "13.2", unit: "g/dL", status: "Low" },
    { testName: "Fasting Blood Sugar", value: "124 mg/dL", unit: "", status: "High" },
    { testName: "LDL Cholesterol", value: "118 mg/dL", unit: "", status: "Borderline" },
  ],
};

export const CLINICAL_NOTES: Record<string, ClinicalNote[]> = {
  UHID12345685: [
    { dateTime: "18 May 2024, 11:20 AM", author: "Dr. Amit Verma", note: "Patient admitted with chest pain since 2 days. Provisional diagnosis: Stable Angina." },
  ],
};

export function getClinicalExamination(uhid: string): ClinicalExaminationData {
  return CLINICAL_EXAMINATION_DEFAULTS[uhid] ?? CLINICAL_EXAMINATION_DEFAULTS.UHID12345685;
}
export function getLabAlertsMini(uhid: string) {
  return LAB_ALERTS_MINI[uhid] ?? [];
}
export function getClinicalNotes(uhid: string) {
  return CLINICAL_NOTES[uhid] ?? [];
}