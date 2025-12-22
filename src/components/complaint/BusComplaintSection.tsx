import { UseFormReturn } from "react-hook-form";
import { Bus } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComplaintForm, busOperators } from "@/types/complaint";

interface BusComplaintSectionProps {
  form: UseFormReturn<ComplaintForm>;
}

export function BusComplaintSection({ form }: BusComplaintSectionProps) {
  const hasRavKav = form.watch("busDetails.hasRavKav");

  return (
    <div className="form-section animate-fade-in">
      <h2 className="form-section-title">
        <Bus className="h-5 w-5 text-primary" />
        פרטי התלונה - אוטובוס / תחבורה ציבורית
      </h2>

      <div className="form-grid">
        <FormField
          control={form.control}
          name="busDetails.operator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>מפעיל *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר מפעיל" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {busOperators.map((operator) => (
                    <SelectItem key={operator.value} value={operator.value}>
                      {operator.label}
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
          name="busDetails.lineNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>מספר קו *</FormLabel>
              <FormControl>
                <Input placeholder="הזן מספר קו" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="busDetails.direction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>כיוון הנסיעה</FormLabel>
              <FormControl>
                <Input placeholder="לדוגמה: תל אביב - ירושלים" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="busDetails.eventDate"
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
          name="busDetails.eventHour"
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
      </div>

      <div className="form-grid mt-4">
        <FormField
          control={form.control}
          name="busDetails.boardingStation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תחנת עלייה</FormLabel>
              <FormControl>
                <Input placeholder="שם התחנה" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="busDetails.boardingCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>עיר התחנה</FormLabel>
              <FormControl>
                <Input placeholder="עיר" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="busDetails.dropoffStation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תחנת ירידה</FormLabel>
              <FormControl>
                <Input placeholder="שם התחנה" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="busDetails.stationAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>כתובת התחנה</FormLabel>
              <FormControl>
                <Input placeholder="כתובת מלאה" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="form-grid mt-4">
        <FormField
          control={form.control}
          name="busDetails.driverName"
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
          name="busDetails.busLicenseNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>מספר רישוי האוטובוס</FormLabel>
              <FormControl>
                <Input placeholder="מספר רישוי" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-4 space-y-4">
        <FormField
          control={form.control}
          name="busDetails.hasRavKav"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>יש לי כרטיס רב-קו</FormLabel>
              </div>
            </FormItem>
          )}
        />

        {hasRavKav && (
          <FormField
            control={form.control}
            name="busDetails.ravKavNumber"
            render={({ field }) => (
              <FormItem className="max-w-xs">
                <FormLabel>מספר רב-קו</FormLabel>
                <FormControl>
                  <Input placeholder="הזן מספר רב-קו" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <div className="mt-6">
        <FormField
          control={form.control}
          name="busDetails.content"
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
