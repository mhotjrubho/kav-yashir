import { UseFormReturn } from "react-hook-form";
import { Car } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComplaintForm, taxiTypes } from "@/types/complaint";

interface TaxiComplaintSectionProps {
  form: UseFormReturn<ComplaintForm>;
}

export function TaxiComplaintSection({ form }: TaxiComplaintSectionProps) {
  return (
    <div className="form-section animate-fade-in">
      <h2 className="form-section-title">
        <Car className="h-5 w-5 text-primary" />
        פרטי התלונה - מונית
      </h2>

      <div className="form-grid">
        <FormField
          control={form.control}
          name="taxiDetails.taxiType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>סוג מונית *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סוג מונית" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {taxiTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="taxiDetails.eventDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תאריך האירוע *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="taxiDetails.eventHour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>שעת האירוע *</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="taxiDetails.driverName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>שם הנהג (אם ידוע)</FormLabel>
              <FormControl>
                <Input placeholder="שם הנהג" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="taxiDetails.drivingLicense"
          render={({ field }) => (
            <FormItem>
              <FormLabel>מספר רישיון נהיגה</FormLabel>
              <FormControl>
                <Input placeholder="אם ידוע" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="taxiDetails.eventLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>מיקום האירוע *</FormLabel>
              <FormControl>
                <Input placeholder="כתובת או תיאור המיקום" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-6">
        <FormField
          control={form.control}
          name="taxiDetails.content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תוכן הפנייה *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="תאר את התלונה בפירוט..."
                  className="min-h-[150px] resize-y"
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
