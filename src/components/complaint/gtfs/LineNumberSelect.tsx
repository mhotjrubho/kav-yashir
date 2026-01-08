import { useState, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { Bus, Search } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ComplaintForm } from "@/types/complaint";
import { useGtfsValidation } from "@/hooks/useGtfsData";
import { cn } from "@/lib/utils";

type LineNumberFieldPath =
  | "stationBasedDetails.lineNumber"
  | "driverBehaviorDetails.lineNumber"
  | "overcrowdingDetails.lineNumber"
  | "addFrequencyDetails.lineNumber"
  | "busConditionDetails.lineNumber"
  | "licenseViolationDetails.lineNumber";

interface LineNumberSelectProps {
  form: UseFormReturn<ComplaintForm>;
  fieldPath: LineNumberFieldPath;
  onLineSelected?: (lineNumber: string) => void;
  availableLines?: string[]; // Optional filter for lines at a specific stop
}

export function LineNumberSelect({
  form,
  fieldPath,
  onLineSelected,
  availableLines,
}: LineNumberSelectProps) {
  const { allLineNumbers, loading } = useGtfsValidation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const value = form.watch(fieldPath);

  // Use availableLines if provided, otherwise use all lines
  const linesToShow = availableLines && availableLines.length > 0 ? availableLines : allLineNumbers;

  const filteredLines = useMemo(() => {
    if (!search) return linesToShow.slice(0, 50);
    return linesToShow
      .filter((line) => line.includes(search))
      .slice(0, 50);
  }, [linesToShow, search]);

  return (
    <FormField
      control={form.control}
      name={fieldPath}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>מספר קו *</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={loading}
                >
                  {field.value ? (
                    <span className="flex items-center gap-2">
                      <Bus className="h-4 w-4" />
                      קו {field.value}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      בחר מספר קו
                    </span>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="חפש מספר קו..."
                  value={search}
                  onValueChange={setSearch}
                  className="text-right"
                />
                <CommandList>
                  <CommandEmpty>לא נמצאו קווים</CommandEmpty>
                  <CommandGroup>
                    {filteredLines.map((line) => (
                      <CommandItem
                        key={line}
                        value={line}
                        onSelect={() => {
                          field.onChange(line);
                          onLineSelected?.(line);
                          setOpen(false);
                          setSearch("");
                        }}
                      >
                        <Bus
                          className={cn(
                            "ml-2 h-4 w-4",
                            value === line ? "opacity-100" : "opacity-40"
                          )}
                        />
                        קו {line}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
