
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ExamTextFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function ExamTextField({ label, value, onChange, placeholder }: ExamTextFieldProps) {
  return (
    <div>
      <Label className="text-xs text-slate-500">{label}</Label>
      <Input className="mt-1" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

interface ExamSelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}

export function ExamSelectField({ label, value, onChange, options }: ExamSelectFieldProps) {
  return (
    <div>
      <Label className="text-xs text-slate-500">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
        <SelectContent>
          {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

interface ExamRadioFieldProps {
  label: string;
  value: "Absent" | "Present";
  onChange: (v: "Absent" | "Present") => void;
}

export function ExamRadioField({ label, value, onChange }: ExamRadioFieldProps) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-xs text-slate-500">{label}</Label>
      <div className="flex items-center gap-3">
        {(["Absent", "Present"] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="flex items-center gap-1.5 text-xs text-slate-600"
          >
            <span
              className={cn(
                "flex h-3.5 w-3.5 items-center justify-center rounded-full border-2",
                value === opt ? "border-blue-600" : "border-slate-300"
              )}
            >
              {value === opt && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
            </span>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}