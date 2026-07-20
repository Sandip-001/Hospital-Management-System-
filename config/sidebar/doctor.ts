import { SidebarItem } from "@/types/sidebar";
import { LayoutDashboard, Stethoscope, Activity } from "lucide-react";

const doctorSidebar: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/doctor/dashboard",
    icon: LayoutDashboard,
  },

  /*{
    label: "OPD",
    icon: Stethoscope,
    children: [
      {
        label: "Patients",
        href: "/doctor/opd/patients",
      },
      {
        label: "Appointments",
        href: "/doctor/opd/appointments",
      },
      {
        label: "Prescriptions",
        href: "/doctor/opd/prescriptions",
      },
    ],
  },*/

  {
    label: "IPD",
    icon: Activity,
    children: [
      {
        label: "Doctor Ward Rounds",
        href: "/doctor/ipd/ward-rounds",
      },
      {
        label: "Review Vitals",
        href: "/doctor/ipd/review-vitals",
      },
      {
        label: "Review Lab Results",
        href: "/doctor/ipd/review-lab-results",
      },
      {
        label: "Clinical Examination",
        href: "/doctor/ipd/clinical-examination",
      },
      {
        label: "Diagnosis Update",
        href: "/doctor/ipd/diagnosis-update",
      },
      {
        label: "Treatment Plan",
        href: "/doctor/ipd/treatment-plan",
      },
      {
        label: "Medicine Orders",
        href: "/doctor/ipd/medicine-orders",
      },
      {
        label: "Investigation Orders",
        href: "/doctor/ipd/investigation-orders",
      },
      {
        label: "Discharge Decision",
        href: "/doctor/ipd/discharge-decision", 
      },
    ],
  },
];

export default doctorSidebar;