import { useState, useEffect, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { MapPin, Check, X, Loader2, Search, Hash } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { ComplaintForm } from "@/types/complaint";
import { useGtfsValidation, Stop } from "@/hooks/useGtfsData";
import { cn } from "@/lib/utils";

type SearchMode = "code" | "name";

interface StopCodeInputProps {
  form: UseFormReturn<ComplaintForm>;
  fieldPath: "stationBasedDetails.stationNumber";
  onStopValidated?: (stop: Stop | null) => void;
  availableStops?: Stop[]; // Optional filter for stops on a specific line
}

export function StopCodeInput({
  form,
  fieldPath,
  onStopValidated,
  availableStops,
}: StopCodeInputProps) {
  const { getStopByCode, searchStopsByName, loading } = useGtfsValidation();
  const [validatedStop, setValidatedStop] = useState<Stop | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchMode>("code");
  const [nameSearchOpen, setNameSearchOpen] = useState(false);
  const [nameSearchQuery, setNameSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Stop[]>([]);

  const stopCode = form.watch(fieldPath);

  // Code validation effect
  useEffect(() => {
    if (searchMode !== "code" || !stopCode || loading) {
      if (searchMode === "code") {
        setValidatedStop(null);
        onStopValidated?.(null);
      }
      return;
    }

    setIsValidating(true);
    const timer = setTimeout(() => {
      const stop = getStopByCode(stopCode);
      // If we have filtered stops, validate against that list
      if (stop && availableStops && availableStops.length > 0) {
        const isInFilteredList = availableStops.some(s => s.stop_code === stopCode);
        if (!isInFilteredList) {
          setValidatedStop(null);
          onStopValidated?.(null);
          setIsValidating(false);
          return;
        }
      }
      setValidatedStop(stop || null);
      onStopValidated?.(stop || null);
      setIsValidating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [stopCode, loading, getStopByCode, onStopValidated, searchMode, availableStops]);

  // Name search effect
  useEffect(() => {
    if (!nameSearchQuery || loading) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      // If we have filtered stops, search within those
      if (availableStops && availableStops.length > 0) {
        const query = nameSearchQuery.toLowerCase();
        const results = availableStops
          .filter(stop => 
            stop.stop_name.toLowerCase().includes(query) ||
            stop.city?.toLowerCase().includes(query)
          )
          .slice(0, 30);
        setSearchResults(results);
      } else {
        const results = searchStopsByName(nameSearchQuery, 30);
        setSearchResults(results);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [nameSearchQuery, loading, searchStopsByName, availableStops]);

  const handleStopSelect = useCallback(
    (stop: Stop) => {
      form.setValue(fieldPath, stop.stop_code);
      setValidatedStop(stop);
      onStopValidated?.(stop);
      setNameSearchOpen(false);
      setNameSearchQuery("");
    },
    [form, fieldPath, onStopValidated]
  );

  const toggleSearchMode = () => {
    setSearchMode((prev) => (prev === "code" ? "name" : "code"));
    setValidatedStop(null);
    onStopValidated?.(null);
    form.setValue(fieldPath, "");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValidatedStop(null);
    onStopValidated?.(null);
    form.setValue(fieldPath, "");
    setNameSearchQuery("");
  };

  const isValid = validatedStop !== null;
  const showValidation = searchMode === "code" && stopCode && stopCode.length >= 1 && !loading;

  return (
    <FormField
      control={form.control}
      name={fieldPath}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>מספר תחנה *</FormLabel>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleSearchMode}
              className="h-7 text-xs gap-1"
            >
              {searchMode === "code" ? (
                <>
                  <Search className="h-3 w-3" />
                  חפש לפי שם
                </>
              ) : (
                <>
                  <Hash className="h-3 w-3" />
                  הזן מספר
                </>
              )}
            </Button>
          </div>
          <FormControl>
            {searchMode === "code" ? (
              <div className="relative">
                <Input
                  placeholder="הזן מספר תחנה (לדוגמה: 38831)"
                  {...field}
                  className={cn(
                    "pl-16",
                    showValidation &&
                      (isValid
                        ? "border-green-500 focus-visible:ring-green-500"
                        : "border-red-500 focus-visible:ring-red-500")
                  )}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {field.value && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="p-0.5 hover:bg-muted rounded"
                    >
                      <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
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
            ) : (
              <Popover open={nameSearchOpen} onOpenChange={setNameSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={nameSearchOpen}
                    className={cn(
                      "w-full justify-between font-normal",
                      validatedStop && "border-green-500"
                    )}
                  >
                    {validatedStop ? (
                      <span className="flex items-center gap-2 w-full justify-between">
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-green-500" />
                          {validatedStop.stop_name}
                          {validatedStop.city && ` (${validatedStop.city})`}
                        </span>
                        <X 
                          className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                          onClick={handleClear}
                        />
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        חפש תחנה לפי שם...
                      </span>
                    )}
                    <Search className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full min-w-[300px] p-0" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="הקלד שם תחנה או עיר..."
                      value={nameSearchQuery}
                      onValueChange={setNameSearchQuery}
                    />
                    <CommandList>
                      {loading ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="mr-2 text-sm text-muted-foreground">
                            טוען נתוני תחנות...
                          </span>
                        </div>
                      ) : nameSearchQuery.length < 2 ? (
                        <CommandEmpty>הקלד לפחות 2 תווים לחיפוש</CommandEmpty>
                      ) : searchResults.length === 0 ? (
                        <CommandEmpty>לא נמצאו תחנות</CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {searchResults.map((stop) => (
                            <CommandItem
                              key={stop.stop_id}
                              value={stop.stop_id}
                              onSelect={() => handleStopSelect(stop)}
                              className="flex flex-col items-start gap-0.5"
                            >
                              <div className="flex items-center gap-2 w-full">
                                <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                                <span className="font-medium">
                                  {stop.stop_name}
                                </span>
                                <span className="text-xs text-muted-foreground mr-auto">
                                  קוד: {stop.stop_code}
                                </span>
                              </div>
                              {stop.city && (
                                <span className="text-xs text-muted-foreground pr-5">
                                  {stop.city}
                                </span>
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          </FormControl>
          {validatedStop && searchMode === "code" && (
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
