
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ExamSectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 pb-3">
        <CardTitle className="text-sm font-semibold text-slate-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">{children}</CardContent>
    </Card>
  );
}