import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { User, Lock } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ComplaintForm } from "@/types/complaint";
import { CityAutocomplete } from "./CityAutocomplete";
import { StreetAutocomplete } from "./StreetAutocomplete";

interface PersonalDetailsSectionProps {
  form: UseFormReturn<ComplaintForm>;
  disabled?: boolean;
}

export function PersonalDetailsSection({ form, disabled = false }: PersonalDetailsSectionProps) {
  const [selectedCity, setSelectedCity] = useState(form.getValues("personalDetails.city") || "");
  
  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };
  
  return (
    <div className="form-section animate-fade-in">
      <h2 className="form-section-title">
        <User className="h-5 w-5 text-primary" />
        פרטי הרשמה
        {disabled && (
          <span className="flex items-center gap-1 text-xs font-normal text-muted-foreground mr-2">
            <Lock className="h-3 w-3" />
            מבוסס על הפרופיל שלך
          </span>
        )}
      </h2>
      
      <div className="form-grid">
        <FormField
          control={form.control}
          name="personalDetails.firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>שם פרטי *</FormLabel>
              <FormControl>
                <Input placeholder="הזן שם פרטי" {...field} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalDetails.lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>שם משפחה *</FormLabel>
              <FormControl>
                <Input placeholder="הזן שם משפחה" {...field} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalDetails.idNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>מספר זהות *</FormLabel>
              <FormControl>
                <Input placeholder="9 ספרות" maxLength={9} {...field} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalDetails.mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>מספר טלפון *</FormLabel>
              <FormControl>
                <Input placeholder="05X-XXXXXXX" {...field} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalDetails.ravKavNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>מספר רב-קו</FormLabel>
              <FormControl>
                <Input placeholder="מספר רב-קו (אופציונלי)" {...field} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalDetails.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>כתובת מייל *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="example@email.com" {...field} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="form-grid mt-4">
        {disabled ? (
          <FormField
            control={form.control}
            name="personalDetails.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>עיר מגורים *</FormLabel>
                <FormControl>
                  <Input placeholder="הזן עיר מגורים" {...field} disabled={disabled} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <CityAutocomplete form={form} disabled={disabled} onCitySelect={handleCitySelect} />
        )}

        {disabled ? (
          <FormField
            control={form.control}
            name="personalDetails.street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>רחוב *</FormLabel>
                <FormControl>
                  <Input placeholder="הזן שם רחוב" {...field} disabled={disabled} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <StreetAutocomplete form={form} disabled={disabled} cityName={selectedCity} />
        )}

        <FormField
          control={form.control}
          name="personalDetails.houseNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>מספר בית</FormLabel>
              <FormControl>
                <Input placeholder="מספר בית (אופציונלי)" {...field} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4 mt-6">
        <FormField
          control={form.control}
          name="personalDetails.acceptUpdates"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="font-normal cursor-pointer">
                  אני מאשר/ת קבלת עדכונים
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalDetails.acceptPrivacy"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="font-normal cursor-pointer">
                  אני מאשר/ת את מדיניות הפרטיות *
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
