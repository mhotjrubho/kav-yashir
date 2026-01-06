import { UseFormReturn } from "react-hook-form";
import { UserX } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ComplaintForm, busOperators } from "@/types/complaint";
import { FileUploadSection } from "./FileUploadSection";

interface DriverBehaviorComplaintProps {
  form: UseFormReturn<ComplaintForm>;
}

export function DriverBehaviorComplaint({ form }: DriverBehaviorComplaintProps) {
  const isPersonalRavKav = form.watch("driverBehaviorDetails.isPersonalRavKav");

  const handleFilesChange = (urls: string[]) => {
    form.setValue("attachments", urls);
  };

  return (
    <div className="form-section animate-fade-in">
      <h2 className="form-section-title">
        <UserX className="h-5 w-5 text-primary" />
        פרטי תלונה - התנהגות נהג / פקח
      </h2>

      <div className="form-grid">
        <FormField
          control={form.control}
          name="driverBehaviorDetails.lineNumber"
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
          name="driverBehaviorDetails.operator"
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
          name="driverBehaviorDetails.alternative"
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

        <FormField
          control={form.control}
          name="driverBehaviorDetails.eventDate"
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
          name="driverBehaviorDetails.eventTime"
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
          name="driverBehaviorDetails.driverName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>שם הנהג / הפקח (אם ידוע)</FormLabel>
              <FormControl>
                <Input placeholder="שם הנהג או הפקח" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-4">
        <FormField
          control={form.control}
          name="driverBehaviorDetails.isPersonalRavKav"
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
                  מספר הרב-קו שנסעתי איתו זהה לרב-קו האישי שלי המעודכן במערכת
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        {!isPersonalRavKav && (
          <div className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="driverBehaviorDetails.identifierType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>סוג מספר לזיהוי</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="ravkav" id="ravkav" />
                        <Label htmlFor="ravkav">מספר רב-קו</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="license" id="license" />
                        <Label htmlFor="license">מספר רישוי</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="driverBehaviorDetails.ravKavOrLicense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>מספר רב-קו / מספר רישוי</FormLabel>
                  <FormControl>
                    <Input placeholder="הזן מספר" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>

      <div className="mt-4">
        <FormField
          control={form.control}
          name="driverBehaviorDetails.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תיאור המקרה *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="תאר את המקרה בפירוט"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-6 space-y-4">
        <FormField
          control={form.control}
          name="driverBehaviorDetails.acceptTestimonyMinistry"
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
                  אני מאשר/ת מסירת עדות למשרד התחבורה
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="driverBehaviorDetails.acceptTestimonyCourt"
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
                  אני מאשר/ת מסירת עדות בבית משפט
                </FormLabel>
              </div>
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
