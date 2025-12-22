import { UseFormReturn } from "react-hook-form";
import { Bus, Train, Car } from "lucide-react";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ComplaintForm, TransportType, transportTypeLabels } from "@/types/complaint";
import { cn } from "@/lib/utils";

interface TransportTypeSelectorProps {
  form: UseFormReturn<ComplaintForm>;
}

const transportIcons: Record<TransportType, typeof Bus> = {
  bus: Bus,
  train: Train,
  taxi: Car,
};

export function TransportTypeSelector({ form }: TransportTypeSelectorProps) {
  const selectedType = form.watch("transportType");

  return (
    <div className="form-section animate-fade-in">
      <h2 className="form-section-title">
        בחר סוג תחבורה
      </h2>

      <FormField
        control={form.control}
        name="transportType"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(Object.keys(transportTypeLabels) as TransportType[]).map((type) => {
                const Icon = transportIcons[type];
                const isSelected = selectedType === type;
                
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => field.onChange(type)}
                    className={cn(
                      "flex flex-col items-center gap-3 p-6 rounded-lg border-2 transition-all duration-200",
                      isSelected
                        ? "border-primary bg-accent text-accent-foreground shadow-md"
                        : "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
                    )}
                  >
                    <Icon className={cn(
                      "h-10 w-10 transition-colors",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className={cn(
                      "font-medium text-center",
                      isSelected ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {transportTypeLabels[type]}
                    </span>
                  </button>
                );
              })}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
