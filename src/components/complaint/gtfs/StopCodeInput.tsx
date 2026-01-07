import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { MapPin, Check, X, Loader2 } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ComplaintForm } from "@/types/complaint";
import { useGtfsValidation, Stop } from "@/hooks/useGtfsData";

interface StopCodeInputProps {
  form: UseFormReturn<ComplaintForm>;
  fieldPath: "stationBasedDetails.stationNumber";
  onStopValidated?: (stop: Stop | null) => void;
}

export function StopCodeInput({
  form,
  fieldPath,
  onStopValidated,
}: StopCodeInputProps) {
  const { getStopByCode, isValidStopCode, loading } = useGtfsValidation();
  const [validatedStop, setValidatedStop] = useState<Stop | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const stopCode = form.watch(fieldPath);

  useEffect(() => {
    if (!stopCode || stopCode.length < 3 || loading) {
      setValidatedStop(null);
      onStopValidated?.(null);
      return;
    }

    setIsValidating(true);
    // Small delay for UX
    const timer = setTimeout(() => {
      const stop = getStopByCode(stopCode);
      setValidatedStop(stop || null);
      onStopValidated?.(stop || null);
      setIsValidating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [stopCode, loading, getStopByCode, onStopValidated]);

  const isValid = validatedStop !== null;
  const showValidation = stopCode && stopCode.length >= 3 && !loading;

  return (
    <FormField
      control={form.control}
      name={fieldPath}
      render={({ field }) => (
        <FormItem>
          <FormLabel>מספר תחנה *</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                placeholder="הזן מספר תחנה (לדוגמה: 38831)"
                {...field}
                className={`pl-10 ${
                  showValidation
                    ? isValid
                      ? "border-green-500 focus-visible:ring-green-500"
                      : "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                {loading || isValidating ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : showValidation ? (
                  isValid ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )
                ) : (
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </FormControl>
          {validatedStop && (
            <FormDescription className="text-green-600 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {validatedStop.stop_name}
              {validatedStop.city && ` (${validatedStop.city})`}
            </FormDescription>
          )}
          {showValidation && !isValid && !isValidating && (
            <FormDescription className="text-red-500">
              מספר תחנה לא נמצא במערכת
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
