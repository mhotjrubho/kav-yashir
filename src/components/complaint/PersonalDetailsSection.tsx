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
import { ComplaintForm } from "@/types/complaint";

interface PersonalDetailsSectionProps {
  form: UseFormReturn<ComplaintForm>;
}

export function PersonalDetailsSection({ form }: PersonalDetailsSectionProps) {
  return (
    <div className="form-section animate-fade-in">
      <h2 className="form-section-title">
        <User className="h-5 w-5 text-primary" />
        פרטים אישיים
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
              <FormLabel>תעודת זהות *</FormLabel>
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
              <FormLabel>טלפון נייד *</FormLabel>
              <FormControl>
                <Input placeholder="05X-XXXXXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalDetails.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>טלפון נוסף</FormLabel>
              <FormControl>
                <Input placeholder="טלפון נוסף (אופציונלי)" {...field} />
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
              <FormLabel>דוא"ל *</FormLabel>
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
              <FormLabel>עיר *</FormLabel>
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

        <FormField
          control={form.control}
          name="personalDetails.apartment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>דירה</FormLabel>
              <FormControl>
                <Input placeholder="מספר דירה (אופציונלי)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalDetails.zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>מיקוד</FormLabel>
              <FormControl>
                <Input placeholder="מיקוד (אופציונלי)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalDetails.poBox"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ת.ד</FormLabel>
              <FormControl>
                <Input placeholder="תא דואר (אופציונלי)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
