import { useState, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { Home, Loader2, Check } from "lucide-react";
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
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useIsraeliStreets } from "@/hooks/useIsraeliLocations";

interface AuthStreetAutocompleteProps {
  form: UseFormReturn<any>;
  fieldName: string;
  disabled?: boolean;
  cityName: string;
}

export function AuthStreetAutocomplete({
  form,
  fieldName,
  disabled = false,
  cityName,
}: AuthStreetAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { streets, isLoading } = useIsraeliStreets(cityName, searchQuery);

  const currentValue = form.watch(fieldName);
  const isDisabled = disabled || !cityName;

  const handleSelect = (streetName: string) => {
    form.setValue(fieldName, streetName, { shouldValidate: true });
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>רחוב *</FormLabel>
          <Popover open={open && !isDisabled} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <div className="relative">
                  <Input
                    ref={inputRef}
                    placeholder={
                      !cityName ? "יש לבחור ישוב תחילה" : "הזן שם רחוב"
                    }
                    value={open ? searchQuery : field.value || ""}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (!open) setOpen(true);
                    }}
                    onFocus={() => {
                      if (!isDisabled) {
                        setOpen(true);
                        setSearchQuery(field.value || "");
                      }
                    }}
                    disabled={isDisabled}
                    className="pe-10"
                    dir="rtl"
                  />
                  <Home className="absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="end" dir="rtl">
              <Command>
                <CommandList>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="mr-2">טוען...</span>
                    </div>
                  ) : streets.length === 0 ? (
                    <CommandEmpty>לא נמצאו רחובות</CommandEmpty>
                  ) : (
                    <CommandGroup>
                      {streets.map((street) => (
                        <CommandItem
                          key={street.id}
                          value={street.name}
                          onSelect={() => handleSelect(street.name)}
                        >
                          <Check
                            className={cn(
                              "ml-2 h-4 w-4",
                              currentValue === street.name
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {street.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
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
