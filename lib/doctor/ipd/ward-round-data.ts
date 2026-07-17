
import { WardRoundPatient } from "@/types/doctor/ipd/ward-round-types";

export const WARD_ROUND_PATIENTS: WardRoundPatient[] = [
  {
    uhid: "UHID12345685", patientName: "Ravi Sharma", age: 48, gender: "Male", bloodGroup: "B+", status: "Stable",
    wardRoomBed: "Semi Private / Room-2 / B-203", department: "Cardiology", admittingDoctor: "Dr. Amit Verma",
    admissionDateTime: "20 May 2024, 11:30 AM", allergies: ["Penicillin"], ipdId: "IPD240520-0001",
    vitals: { bp: "120/80", pulse: "78", temp: "98.4", rr: "18", spo2: "98", pain: "0", recordedOn: "20 May 2024, 08:00 AM" },
    labHighlights: [
      { name: "Hb", value: "13.2 g/dL", date: "19 May" },
      { name: "WBC", value: "7,400 /µL", date: "19 May" },
      { name: "Creatinine", value: "1.1 mg/dL", date: "19 May" },
      { name: "Troponin-I", value: "0.02 ng/mL", date: "19 May" },
    ],
    currentDiagnosis: "Stable Angina", diagnosisCode: "I20.8",
  },
  {
    uhid: "UHID12345684", patientName: "Neha Singh", age: 36, gender: "Female", bloodGroup: "O+", status: "Under Observation",
    wardRoomBed: "General Ward / Room-5 / G-108", department: "General Medicine", admittingDoctor: "Dr. Priya Nair",
    admissionDateTime: "20 May 2024, 09:45 AM", allergies: [], ipdId: "IPD240520-0002",
    vitals: { bp: "110/70", pulse: "84", temp: "99.1", rr: "20", spo2: "97", pain: "2", recordedOn: "20 May 2024, 08:10 AM" },
    labHighlights: [
      { name: "Hb", value: "11.8 g/dL", date: "19 May" },
      { name: "WBC", value: "9,100 /µL", date: "19 May" },
    ],
    currentDiagnosis: "Viral Fever", diagnosisCode: "A99",
  },
  {
    uhid: "UHID12345683", patientName: "Suresh Yadav", age: 55, gender: "Male", bloodGroup: "A+", status: "Critical",
    wardRoomBed: "ICU / Bed-3 / ICU-03", department: "General Surgery", admittingDoctor: "Dr. Rahul Mehta",
    admissionDateTime: "20 May 2024, 08:50 AM", allergies: ["Sulfa Drugs"], ipdId: "IPD240520-0003",
    vitals: { bp: "90/60", pulse: "110", temp: "100.8", rr: "26", spo2: "92", pain: "6", recordedOn: "20 May 2024, 08:15 AM" },
    labHighlights: [{ name: "Hb", value: "9.4 g/dL", date: "19 May" }],
    currentDiagnosis: "Post-Op Sepsis", diagnosisCode: "A41.9",
  },
];

export function getPatientByUhid(uhid: string) {
  return WARD_ROUND_PATIENTS.find((p) => p.uhid === uhid) ?? WARD_ROUND_PATIENTS[0];
}