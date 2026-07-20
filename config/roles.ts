export enum UserRole {
  DOCTOR = "doctor",
  ADMISSION = "admission",
  NURSE = "nurse", 
}

export const RoleOptions = [
  {
    label: "Doctor",
    value: UserRole.DOCTOR,
  },
  {
    label: "Admission Desk",
    value: UserRole.ADMISSION,
  },
  {
    label: "Nurse",
    value: UserRole.NURSE,
  },
];