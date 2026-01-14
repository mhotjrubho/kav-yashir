import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { MapPin, AlertCircle } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ComplaintForm, ComplaintType, complaintTypeLabels } from "@/types/complaint";
import { FileUploadSection } from "./FileUploadSection";
import { StopCodeInput } from "./gtfs/StopCodeInput";
import { LineNumberSelect } from "./gtfs/LineNumberSelect";
import { Stop, useGtfsValidation } from "@/hooks/useGtfsData";
import { 
  getTodayDateString, 
  isDateInFuture, 
  isTimeInFuture, 
  isDepartureAfterArrival,
  dateTimeErrors 
} from "@/lib/dateTimeValidation";

interface StationBasedComplaintProps {
  form: UseFormReturn<ComplaintForm>;
  complaintType: ComplaintType;
}

export function StationBasedComplaint({ form, complaintType }: StationBasedComplaintProps) {
  const [validatedStop, setValidatedStop] = useState<Stop | null>(null);
  const [selectedLine, setSelectedLine] = useState<string>("");
  const [linesAtStop, setLinesAtStop] = useState<string[]>([]);
  const [stopsForLine, setStopsForLine] = useState<Stop[]>([]);
  const [timeError, setTimeError] = useState<string | null>(null);
  const { routes, getCitiesForLine, getStopsForLine } = useGtfsValidation();

  const eventDate = form.watch("stationBasedDetails.eventDate");
  const arrivalTime = form.watch("stationBasedDetails.arrivalTime");
  const departureTime = form.watch("stationBasedDetails.departureTime");

  // Validate date and time
  useEffect(() => {
    setTimeError(null);
    
    // Check future date
    if (eventDate && isDateInFuture(eventDate)) {
      setTimeError(dateTimeErrors.futureDateNotAllowed);
      return;
    }
    
    // Check future time
    if (eventDate && arrivalTime && isTimeInFuture(eventDate, arrivalTime)) {
      setTimeError(dateTimeErrors.futureTimeNotAllowed);
      return;
    }
    
    if (eventDate && departureTime && isTimeInFuture(eventDate, departureTime)) {
      setTimeError(dateTimeErrors.futureTimeNotAllowed);
      return;
    }
    
    // Check departure after arrival
    if (arrivalTime && departureTime && !isDepartureAfterArrival(arrivalTime, departureTime)) {
      setTimeError(dateTimeErrors.departureMustBeAfterArrival);
      return;
    }
  }, [eventDate, arrivalTime, departureTime]);

  // When stop is validated, filter lines that pass through this stop
  useEffect(() => {
    if (validatedStop) {
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
        
        // Check if selected line is still valid for this stop
        if (selectedLine && !matchingLines.includes(selectedLine)) {
          setSelectedLine("");
          form.setValue("stationBasedDetails.lineNumber", "");
        }
      } else {
        setLinesAtStop([]);
      }
    } else {
      setLinesAtStop([]);
    }
  }, [validatedStop, routes, form, selectedLine]);

  // When line is selected, filter stops that are on this line
  useEffect(() => {
    if (selectedLine) {
      const stops = getStopsForLine(selectedLine);
      setStopsForLine(stops);
      
      // Check if current stop is still valid for this line
      if (validatedStop && stops.length > 0) {
        const isStopValid = stops.some(s => s.stop_code === validatedStop.stop_code);
        if (!isStopValid) {
          setValidatedStop(null);
          form.setValue("stationBasedDetails.stationNumber", "");
        }
      }
    } else {
      setStopsForLine([]);
    }
  }, [selectedLine, getStopsForLine, validatedStop, form]);

  // Handle line selection
  const handleLineSelected = (lineNumber: string) => {
    setSelectedLine(lineNumber);
  };

  const handleFilesChange = (urls: string[]) => {
    form.setValue("attachments", urls);
  };

  const today = getTodayDateString();

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
          availableStops={stopsForLine.length > 0 ? stopsForLine : undefined}
        />

        <LineNumberSelect
          form={form}
          fieldPath="stationBasedDetails.lineNumber"
          availableLines={linesAtStop.length > 0 ? linesAtStop : undefined}
          onLineSelected={handleLineSelected}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <FormField
          control={form.control}
          name="stationBasedDetails.eventDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תאריך האירוע *</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  max={today}
                  {...field} 
                />
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
      </div>

      {timeError && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{timeError}</AlertDescription>
        </Alert>
      )}

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
