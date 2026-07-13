export enum UserRole {
  DOCTOR = "doctor",
  ADMISSION = "admission",
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
];