import { useState, useRef, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { MapPin, Loader2, Check } from "lucide-react";
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
import { useIsraeliCities } from "@/hooks/useIsraeliLocations";
import { ComplaintForm } from "@/types/complaint";

interface CityAutocompleteProps {
  form: UseFormReturn<ComplaintForm>;
  disabled?: boolean;
  onCitySelect?: (city: string) => void;
}

export function CityAutocomplete({
  form,
  disabled = false,
  onCitySelect,
}: CityAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { cities, isLoading } = useIsraeliCities(searchQuery);

  const currentValue = form.watch("personalDetails.city");

  const handleSelect = (cityName: string) => {
    form.setValue("personalDetails.city", cityName, { shouldValidate: true });
    // Clear street when city changes
    form.setValue("personalDetails.street", "", { shouldValidate: false });
    setOpen(false);
    setSearchQuery("");
    onCitySelect?.(cityName);
  };

  return (
    <FormField
      control={form.control}
      name="personalDetails.city"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>עיר מגורים *</FormLabel>
          <Popover open={open && !disabled} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <div className="relative">
                  <Input
                    ref={inputRef}
                    placeholder="הזן שם ישוב"
                    value={open ? searchQuery : field.value || ""}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (!open) setOpen(true);
                    }}
                    onFocus={() => {
                      if (!disabled) {
                        setOpen(true);
                        setSearchQuery(field.value || "");
                      }
                    }}
                    disabled={disabled}
                    className="pr-10"
                  />
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandList>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="mr-2">טוען...</span>
                    </div>
                  ) : cities.length === 0 ? (
                    <CommandEmpty>לא נמצאו ישובים</CommandEmpty>
                  ) : (
                    <CommandGroup>
                      {cities.map((city) => (
                        <CommandItem
                          key={city.id}
                          value={city.name}
                          onSelect={() => handleSelect(city.name)}
                        >
                          <Check
                            className={cn(
                              "ml-2 h-4 w-4",
                              currentValue === city.name
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {city.name}
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
