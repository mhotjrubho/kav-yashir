import { UseFormReturn } from "react-hook-form";
import { Users } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ComplaintForm } from "@/types/complaint";
import { FileUploadSection } from "./FileUploadSection";
import { LineNumberSelect } from "./gtfs/LineNumberSelect";
import { OperatorSelect } from "./gtfs/OperatorSelect";
import { AlternativeSelect } from "./gtfs/AlternativeSelect";

interface OvercrowdingComplaintProps {
  form: UseFormReturn<ComplaintForm>;
}

export function OvercrowdingComplaint({ form }: OvercrowdingComplaintProps) {
  const handleFilesChange = (urls: string[]) => {
    form.setValue("attachments", urls);
  };

  return (
    <div className="form-section animate-fade-in">
      <h2 className="form-section-title">
        <Users className="h-5 w-5 text-primary" />
        פרטי תלונה - עומס בקו
      </h2>

      <div className="form-grid">
        <LineNumberSelect
          form={form}
          fieldPath="overcrowdingDetails.lineNumber"
        />

        <OperatorSelect
          form={form}
          fieldPath="overcrowdingDetails.operator"
          lineNumberFieldPath="overcrowdingDetails.lineNumber"
        />

        <FormField
          control={form.control}
          name="overcrowdingDetails.eventDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תאריך *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="overcrowdingDetails.eventTime"
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

        <FormField
          control={form.control}
          name="overcrowdingDetails.eventLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>מיקום אירוע *</FormLabel>
              <FormControl>
                <Input placeholder="הזן מיקום" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <AlternativeSelect
          form={form}
          fieldPath="overcrowdingDetails.alternative"
          lineNumberFieldPath="overcrowdingDetails.lineNumber"
          operatorFieldPath="overcrowdingDetails.operator"
        />
      </div>

      <div className="mt-4">
        <FormField
          control={form.control}
          name="overcrowdingDetails.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תיאור העומס</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="תאר את מצב העומס (אופציונלי)"
                  className="min-h-[100px]"
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
