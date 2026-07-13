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
    label: "Front Desk",
    value: UserRole.ADMISSION,
  },
];