import { UseFormReturn } from "react-hook-form";
import { User } from "lucide-react";
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

interface PersonalDetailsSectionProps {
  form: UseFormReturn<ComplaintForm>;
}

export function PersonalDetailsSection({ form }: PersonalDetailsSectionProps) {
  return (
    <div className="form-section animate-fade-in">
      <h2 className="form-section-title">
        <User className="h-5 w-5 text-primary" />
        פרטי הרשמה
      </h2>
      
      <div className="form-grid">
        <FormField
          control={form.control}
          name="personalDetails.firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>שם פרטי *</FormLabel>
              <FormControl>
                <Input placeholder="הזן שם פרטי" {...field} />
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
                <Input placeholder="הזן שם משפחה" {...field} />
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
                <Input placeholder="9 ספרות" maxLength={9} {...field} />
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
                <Input placeholder="05X-XXXXXXX" {...field} />
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
                <Input placeholder="מספר רב-קו (אופציונלי)" {...field} />
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
                <Input type="email" placeholder="example@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="form-grid mt-4">
        <FormField
          control={form.control}
          name="personalDetails.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>עיר מגורים *</FormLabel>
              <FormControl>
                <Input placeholder="הזן עיר מגורים" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalDetails.street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>רחוב *</FormLabel>
              <FormControl>
                <Input placeholder="הזן שם רחוב" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalDetails.houseNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>מספר בית *</FormLabel>
              <FormControl>
                <Input placeholder="מספר בית" {...field} />
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
