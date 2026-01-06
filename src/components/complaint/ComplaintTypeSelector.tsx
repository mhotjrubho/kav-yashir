import { UseFormReturn } from "react-hook-form";
import { FileText } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComplaintForm, complaintTypes, complaintTypeLabels } from "@/types/complaint";

interface ComplaintTypeSelectorProps {
  form: UseFormReturn<ComplaintForm>;
}

export function ComplaintTypeSelector({ form }: ComplaintTypeSelectorProps) {
  return (
    <div className="form-section animate-fade-in">
      <h2 className="form-section-title">
        <FileText className="h-5 w-5 text-primary" />
        סוג התלונה
      </h2>

      <FormField
        control={form.control}
        name="complaintType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>בחר סוג תלונה *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג תלונה" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {complaintTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {complaintTypeLabels[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
