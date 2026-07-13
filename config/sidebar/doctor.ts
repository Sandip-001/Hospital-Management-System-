import { SidebarItem } from "@/types/sidebar";
import { LayoutDashboard, Stethoscope, Activity } from "lucide-react";

const doctorSidebar: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/doctor/dashboard",
    icon: LayoutDashboard,
  },

  {
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
  },

  {
    label: "IPD",
    icon: Activity,
    children: [
      {
        label: "Admissions",
        href: "/doctor/ipd/admissions",
      },
      {
        label: "Rounds",
        href: "/doctor/ipd/rounds",
      },
      {
        label: "Discharge",
        href: "/doctor/ipd/discharge",
      },
    ],
  },
];

export default doctorSidebar;