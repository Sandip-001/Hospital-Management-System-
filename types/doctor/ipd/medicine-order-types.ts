
export type MedicineStatus = "Pending" | "Active";

export interface MedicineOrderItem {
  id: string;
  medicineName: string;
  strengthForm: string;
  dose: string;
  route: string;
  frequency: string;
  duration: string;
  startDate: string;
  endDate: string;
  timing: string[];
  instructions: string;
  specialInstructions: string;
  indication: string;
  category: string;
  saveAsFavorite: boolean;
  status: MedicineStatus;
}

export interface MedicineOrdersPageData {
  items: MedicineOrderItem[];
  notes: string;
  allergies: string;
  preferredPharmacy: string;
}