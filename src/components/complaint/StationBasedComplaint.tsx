import { useState, useEffect } from "react";
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
import { StopCodeInput } from "./gtfs/StopCodeInput";
import { LineNumberSelect } from "./gtfs/LineNumberSelect";
import { Stop, useGtfsValidation } from "@/hooks/useGtfsData";

interface StationBasedComplaintProps {
  form: UseFormReturn<ComplaintForm>;
  complaintType: ComplaintType;
}

export function StationBasedComplaint({ form, complaintType }: StationBasedComplaintProps) {
  const [validatedStop, setValidatedStop] = useState<Stop | null>(null);
  const [linesAtStop, setLinesAtStop] = useState<string[]>([]);
  const { routes } = useGtfsValidation();

  // When stop is validated, filter lines that pass through this stop
  useEffect(() => {
    if (validatedStop) {
      // For now, we show all lines since we don't have stop_times.txt
      // In a full implementation, this would filter based on stop_times
      // Here we'll use a simple approach based on route descriptions containing the city
      const stopCity = validatedStop.city;
      if (stopCity) {
        const matchingLines = routes
          .filter(route => route.route_long_name?.includes(stopCity))
          .map(route => route.route_short_name)
          .filter((line, index, arr) => arr.indexOf(line) === index)
          .sort((a, b) => {
            const numA = parseInt(a) || 0;
            const numB = parseInt(b) || 0;
            return numA - numB;
          });
        setLinesAtStop(matchingLines);
      } else {
        setLinesAtStop([]);
      }
      // Clear line number when stop changes
      form.setValue("stationBasedDetails.lineNumber", "");
    } else {
      setLinesAtStop([]);
    }
  }, [validatedStop, routes, form]);

  const handleFilesChange = (urls: string[]) => {
    form.setValue("attachments", urls);
  };

  return (
    <div className="form-section animate-fade-in">
      <h2 className="form-section-title">
        <MapPin className="h-5 w-5 text-primary" />
        פרטי תלונה - {complaintTypeLabels[complaintType]}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StopCodeInput
          form={form}
          fieldPath="stationBasedDetails.stationNumber"
          onStopValidated={setValidatedStop}
        />

        <LineNumberSelect
          form={form}
          fieldPath="stationBasedDetails.lineNumber"
          availableLines={linesAtStop}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
