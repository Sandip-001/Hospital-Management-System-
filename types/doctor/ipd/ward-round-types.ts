
export interface VitalReading {
  bp: string;
  pulse: string;
  temp: string;
  rr: string;
  spo2: string;
  pain: string;
  recordedOn: string;
}

export interface LabHighlight {
  name: string;
  value: string;
  date: string;
}

export interface WardRoundPatient {
  uhid: string;
  patientName: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  bloodGroup: string;
  status: "Stable" | "Critical" | "Under Observation";
  wardRoomBed: string;
  department: string;
  admittingDoctor: string;
  admissionDateTime: string;
  allergies: string[];
  ipdId: string;
  vitals: VitalReading;
  labHighlights: LabHighlight[];
  currentDiagnosis: string;
  diagnosisCode: string;
}