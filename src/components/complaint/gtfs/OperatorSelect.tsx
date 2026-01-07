import { useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { Building2 } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
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

type OperatorFieldPath =
  | "driverBehaviorDetails.operator"
  | "overcrowdingDetails.operator"
  | "addFrequencyDetails.operator"
  | "busConditionDetails.operator"
  | "licenseViolationDetails.operator";

type LineNumberFieldPath =
  | "driverBehaviorDetails.lineNumber"
  | "overcrowdingDetails.lineNumber"
  | "addFrequencyDetails.lineNumber"
  | "busConditionDetails.lineNumber"
  | "licenseViolationDetails.lineNumber";

interface OperatorSelectProps {
  form: UseFormReturn<ComplaintForm>;
  fieldPath: OperatorFieldPath;
  lineNumberFieldPath: LineNumberFieldPath;
  onOperatorSelected?: (operatorId: string) => void;
}

export function OperatorSelect({
  form,
  fieldPath,
  lineNumberFieldPath,
  onOperatorSelected,
}: OperatorSelectProps) {
  const { getOperatorsForLine, loading } = useGtfsValidation();

  const lineNumber = form.watch(lineNumberFieldPath);
  const currentOperator = form.watch(fieldPath);

  const availableOperators = useMemo(() => {
    if (!lineNumber) return [];
    return getOperatorsForLine(lineNumber);
  }, [lineNumber, getOperatorsForLine]);

  // Auto-select if only one operator
  useEffect(() => {
    if (availableOperators.length === 1 && !currentOperator) {
      form.setValue(fieldPath, availableOperators[0].agency_id);
      onOperatorSelected?.(availableOperators[0].agency_id);
    }
  }, [availableOperators, currentOperator, form, fieldPath, onOperatorSelected]);

  // Clear operator if line changes and current operator is not valid
  useEffect(() => {
    if (currentOperator && availableOperators.length > 0) {
      const isValid = availableOperators.some(
        (op) => op.agency_id === currentOperator
      );
      if (!isValid) {
        form.setValue(fieldPath, "");
      }
    }
  }, [lineNumber, availableOperators, currentOperator, form, fieldPath]);

  const isDisabled = !lineNumber || loading;

  return (
    <FormField
      control={form.control}
      name={fieldPath}
      render={({ field }) => (
        <FormItem>
          <FormLabel>מפעיל *</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              onOperatorSelected?.(value);
            }}
            value={field.value}
            disabled={isDisabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={isDisabled ? "בחר קו תחילה" : "בחר מפעיל"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {availableOperators.map((operator) => (
                <SelectItem key={operator.agency_id} value={operator.agency_id}>
                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {operator.agency_name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {availableOperators.length === 0 && lineNumber && (
            <FormDescription className="text-amber-600">
              לא נמצאו מפעילים לקו זה
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
