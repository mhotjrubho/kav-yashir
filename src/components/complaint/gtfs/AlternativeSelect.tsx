import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { ArrowLeftRight } from "lucide-react";
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

type AlternativeFieldPath =
  | "driverBehaviorDetails.alternative"
  | "overcrowdingDetails.alternative"
  | "addFrequencyDetails.alternative"
  | "busConditionDetails.alternative";

type LineNumberFieldPath =
  | "driverBehaviorDetails.lineNumber"
  | "overcrowdingDetails.lineNumber"
  | "addFrequencyDetails.lineNumber"
  | "busConditionDetails.lineNumber";

type OperatorFieldPath =
  | "driverBehaviorDetails.operator"
  | "overcrowdingDetails.operator"
  | "addFrequencyDetails.operator"
  | "busConditionDetails.operator";

interface AlternativeSelectProps {
  form: UseFormReturn<ComplaintForm>;
  fieldPath: AlternativeFieldPath;
  lineNumberFieldPath: LineNumberFieldPath;
  operatorFieldPath: OperatorFieldPath;
}

export function AlternativeSelect({
  form,
  fieldPath,
  lineNumberFieldPath,
  operatorFieldPath,
}: AlternativeSelectProps) {
  const { getAlternatives, loading } = useGtfsValidation();

  const lineNumber = form.watch(lineNumberFieldPath);
  const operatorId = form.watch(operatorFieldPath);

  const alternatives = useMemo(() => {
    if (!lineNumber) return [];
    return getAlternatives(lineNumber, operatorId);
  }, [lineNumber, operatorId, getAlternatives]);

  const isDisabled = !lineNumber || loading;

  return (
    <FormField
      control={form.control}
      name={fieldPath}
      render={({ field }) => (
        <FormItem>
          <FormLabel>חלופה (מוצא ויעד)</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={isDisabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  placeholder={isDisabled ? "בחר קו תחילה" : "בחר חלופה"}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {alternatives.map((alt) => (
                <SelectItem key={alt.value} value={alt.value}>
                  <span className="flex items-center gap-2">
                    <ArrowLeftRight className="h-4 w-4" />
                    {alt.label}
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
