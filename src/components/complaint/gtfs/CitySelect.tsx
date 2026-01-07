import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { MapPin } from "lucide-react";
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
import { ComplaintForm } from "@/types/complaint";
import { useGtfsValidation } from "@/hooks/useGtfsData";

interface CitySelectProps {
  form: UseFormReturn<ComplaintForm>;
  fieldPath: "licenseViolationDetails.eventCity";
  lineNumberFieldPath: "licenseViolationDetails.lineNumber";
}

export function CitySelect({
  form,
  fieldPath,
  lineNumberFieldPath,
}: CitySelectProps) {
  const { getCitiesForLine, loading } = useGtfsValidation();

  const lineNumber = form.watch(lineNumberFieldPath);

  const cities = useMemo(() => {
    if (!lineNumber) return [];
    return getCitiesForLine(lineNumber);
  }, [lineNumber, getCitiesForLine]);

  const isDisabled = !lineNumber || loading;

  return (
    <FormField
      control={form.control}
      name={fieldPath}
      render={({ field }) => (
        <FormItem>
          <FormLabel>עיר האירוע *</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={isDisabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  placeholder={isDisabled ? "בחר קו תחילה" : "בחר עיר"}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {city}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
