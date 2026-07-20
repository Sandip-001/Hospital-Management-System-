
export type InvestigationStatus = "Ready to Send" | "Ordered" | "Sample Collected" | "Completed" | "Pending";

export type InvestigationCategory =
  | "Hematology"
  | "Biochemistry"
  | "Radiology"
  | "Cardiology"
  | "Microbiology"
  | "Others";

export type InvestigationPriority = "Routine" | "Urgent" | "High";

export interface InvestigationOrderItem {
  id: string;
  investigationName: string;
  category: InvestigationCategory;
  priority: InvestigationPriority;
  sample: string;
  orderDate: string;
  status: InvestigationStatus;
  results: string;
  indication: string;
  additionalInstructions: string;
  fastingRequired: "Yes" | "No" | "Not Applicable";
  timing: string;
  reportUrgency: string;
  expectedReportTime: string;
  repeatAfter: string;
  saveAsFavorite: boolean;
}

export interface InvestigationOrdersPageData {
  items: InvestigationOrderItem[];
  indication: string;
  instructions: string;
}