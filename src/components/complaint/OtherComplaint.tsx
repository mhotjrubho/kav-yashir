import { UseFormReturn } from "react-hook-form";
import { MessageSquare } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ComplaintForm } from "@/types/complaint";
import { FileUploadSection } from "./FileUploadSection";

interface OtherComplaintProps {
  form: UseFormReturn<ComplaintForm>;
}

export function OtherComplaint({ form }: OtherComplaintProps) {
  const handleFilesChange = (urls: string[]) => {
    form.setValue("attachments", urls);
  };

  return (
    <div className="form-section animate-fade-in">
      <h2 className="form-section-title">
        <MessageSquare className="h-5 w-5 text-primary" />
        פרטי תלונה - אחר
      </h2>

      <div className="mt-4">
        <FormField
          control={form.control}
          name="otherDetails.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תיאור מלא *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="תאר את הנושא בפירוט"
                  className="min-h-[150px]"
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
