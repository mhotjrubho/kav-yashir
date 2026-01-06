import { UseFormReturn } from "react-hook-form";
import { AlertTriangle } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComplaintForm, busOperators } from "@/types/complaint";
import { FileUploadSection } from "./FileUploadSection";

interface LicenseViolationComplaintProps {
  form: UseFormReturn<ComplaintForm>;
}

export function LicenseViolationComplaint({ form }: LicenseViolationComplaintProps) {
  const handleFilesChange = (urls: string[]) => {
    form.setValue("attachments", urls);
  };

  return (
    <div className="form-section animate-fade-in">
      <h2 className="form-section-title">
        <AlertTriangle className="h-5 w-5 text-primary" />
        פרטי תלונה - ביצוע שאינו מתאים לרישיון הקו
      </h2>

      <div className="form-grid">
        <FormField
          control={form.control}
          name="licenseViolationDetails.lineNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>מספר קו *</FormLabel>
              <FormControl>
                <Input placeholder="הזן מספר קו" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="licenseViolationDetails.operator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>מפעיל *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר מפעיל" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {busOperators.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="licenseViolationDetails.eventCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>עיר האירוע *</FormLabel>
              <FormControl>
                <Input placeholder="הזן עיר" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="licenseViolationDetails.eventDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תאריך האירוע *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="licenseViolationDetails.eventTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>שעת האירוע *</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-4">
        <FormField
          control={form.control}
          name="licenseViolationDetails.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תיאור המקרה *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="תאר את החריגה מרישיון הקו"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-4">
        <FileUploadSection
          onFilesChange={handleFilesChange}
          uploadedUrls={form.watch("attachments") || []}
        />
      </div>
    </div>
  );
}
