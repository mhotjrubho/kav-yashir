import { UseFormReturn } from "react-hook-form";
import { MapPin } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ComplaintForm, ComplaintType, complaintTypeLabels } from "@/types/complaint";
import { FileUploadSection } from "./FileUploadSection";

interface StationBasedComplaintProps {
  form: UseFormReturn<ComplaintForm>;
  complaintType: ComplaintType;
}

export function StationBasedComplaint({ form, complaintType }: StationBasedComplaintProps) {
  const handleFilesChange = (urls: string[]) => {
    form.setValue("attachments", urls);
  };

  return (
    <div className="form-section animate-fade-in">
      <h2 className="form-section-title">
        <MapPin className="h-5 w-5 text-primary" />
        פרטי תלונה - {complaintTypeLabels[complaintType]}
      </h2>

      <div className="form-grid">
        <FormField
          control={form.control}
          name="stationBasedDetails.stationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>מספר תחנה *</FormLabel>
              <FormControl>
                <Input placeholder="הזן מספר תחנה" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stationBasedDetails.lineNumber"
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
          name="stationBasedDetails.arrivalTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>שעת הגעה לתחנה *</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stationBasedDetails.departureTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>שעת עזיבה מהתחנה *</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stationBasedDetails.eventDate"
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
      </div>

      <div className="mt-4">
        <FormField
          control={form.control}
          name="stationBasedDetails.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תיאור המקרה</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="תאר את המקרה (אופציונלי)"
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
