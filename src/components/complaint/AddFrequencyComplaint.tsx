import { UseFormReturn } from "react-hook-form";
import { Clock } from "lucide-react";
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
import { ComplaintForm, busOperators, frequencyReasons } from "@/types/complaint";
import { FileUploadSection } from "./FileUploadSection";

interface AddFrequencyComplaintProps {
  form: UseFormReturn<ComplaintForm>;
}

export function AddFrequencyComplaint({ form }: AddFrequencyComplaintProps) {
  const handleFilesChange = (urls: string[]) => {
    form.setValue("attachments", urls);
  };

  return (
    <div className="form-section animate-fade-in">
      <h2 className="form-section-title">
        <Clock className="h-5 w-5 text-primary" />
        פרטי בקשה - הוספת תדירות
      </h2>

      <div className="form-grid">
        <FormField
          control={form.control}
          name="addFrequencyDetails.lineNumber"
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
          name="addFrequencyDetails.operator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>מפעיל *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר מפעיל" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {busOperators.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
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
          name="addFrequencyDetails.alternative"
          render={({ field }) => (
            <FormItem>
              <FormLabel>חלופה (מוצא ויעד)</FormLabel>
              <FormControl>
                <Input placeholder="לדוגמא: תל אביב - ירושלים" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-4">
        <FormField
          control={form.control}
          name="addFrequencyDetails.reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>סיבת הבקשה להוספה *</FormLabel>
              <div className="space-y-2 mt-2">
                {frequencyReasons.map((reason) => (
                  <div key={reason.value} className="flex items-center gap-2">
                    <Checkbox
                      id={reason.value}
                      checked={field.value === reason.value}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange(reason.value);
                        }
                      }}
                    />
                    <label
                      htmlFor={reason.value}
                      className="text-sm cursor-pointer"
                    >
                      {reason.label}
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="form-grid mt-4">
        <FormField
          control={form.control}
          name="addFrequencyDetails.eventDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תאריך אירוע *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addFrequencyDetails.startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>שעת התחלה של האירוע *</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addFrequencyDetails.endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>שעת סיום של האירוע *</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-4">
        <FormField
          control={form.control}
          name="addFrequencyDetails.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תיאור האירוע *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="תאר את הסיבה לבקשת הוספת תדירות"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-4">
        <FileUploadSection
          onFilesChange={handleFilesChange}
          uploadedUrls={form.watch("attachments") || []}
        />
      </div>
    </div>
  );
}
