import { UseFormReturn } from "react-hook-form";
import { Route } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ComplaintForm } from "@/types/complaint";

interface AddLineComplaintProps {
  form: UseFormReturn<ComplaintForm>;
}

export function AddLineComplaint({ form }: AddLineComplaintProps) {
  return (
    <div className="form-section animate-fade-in">
      <h2 className="form-section-title">
        <Route className="h-5 w-5 text-primary" />
        פרטי בקשה - הוספת קו
      </h2>

      <div className="form-grid">
        <FormField
          control={form.control}
          name="addLineDetails.originCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>יישוב עלייה *</FormLabel>
              <FormControl>
                <Input placeholder="הזן יישוב מוצא" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addLineDetails.destinationCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>יישוב יעד *</FormLabel>
              <FormControl>
                <Input placeholder="הזן יישוב יעד" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-4">
        <FormField
          control={form.control}
          name="addLineDetails.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תיאור הבקשה *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="תאר את הצורך בקו החדש"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
