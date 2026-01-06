import { UseFormReturn } from "react-hook-form";
import { Users } from "lucide-react";
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
import { ComplaintForm, busOperators } from "@/types/complaint";
import { FileUploadSection } from "./FileUploadSection";

interface OvercrowdingComplaintProps {
  form: UseFormReturn<ComplaintForm>;
}

export function OvercrowdingComplaint({ form }: OvercrowdingComplaintProps) {
  const handleFilesChange = (urls: string[]) => {
    form.setValue("attachments", urls);
  };

  return (
    <div className="form-section animate-fade-in">
      <h2 className="form-section-title">
        <Users className="h-5 w-5 text-primary" />
        פרטי תלונה - עומס בקו
      </h2>

      <div className="form-grid">
        <FormField
          control={form.control}
          name="overcrowdingDetails.lineNumber"
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
          name="overcrowdingDetails.operator"
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
          name="overcrowdingDetails.eventDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תאריך *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="overcrowdingDetails.eventTime"
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
          name="overcrowdingDetails.eventLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>מיקום אירוע *</FormLabel>
              <FormControl>
                <Input placeholder="הזן מיקום" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="overcrowdingDetails.alternative"
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
          name="overcrowdingDetails.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תיאור העומס</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="תאר את מצב העומס (אופציונלי)"
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
