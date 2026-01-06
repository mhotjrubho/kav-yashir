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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ComplaintForm, busOperators } from "@/types/complaint";
import { FileUploadSection } from "./FileUploadSection";

interface BusConditionComplaintProps {
  form: UseFormReturn<ComplaintForm>;
}

export function BusConditionComplaint({ form }: BusConditionComplaintProps) {
  const isPersonalRavKav = form.watch("busConditionDetails.isPersonalRavKav");
  const tripStopped = form.watch("busConditionDetails.tripStopped");
  const replacementBusArrived = form.watch("busConditionDetails.replacementBusArrived");

  const handleFilesChange = (urls: string[]) => {
    form.setValue("attachments", urls);
  };

  return (
    <div className="form-section animate-fade-in">
      <h2 className="form-section-title">
        <Bus className="h-5 w-5 text-primary" />
        פרטי תלונה - תקינות האוטובוס
      </h2>

      <div className="form-grid">
        <FormField
          control={form.control}
          name="busConditionDetails.lineNumber"
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
          name="busConditionDetails.operator"
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
          name="busConditionDetails.alternative"
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
          name="busConditionDetails.eventDate"
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
          name="busConditionDetails.eventTime"
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

      <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-4">
        <FormField
          control={form.control}
          name="busConditionDetails.isPersonalRavKav"
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
              name="busConditionDetails.identifierType"
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
                        <RadioGroupItem value="ravkav" id="bus-ravkav" />
                        <Label htmlFor="bus-ravkav">מספר רב-קו</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="license" id="bus-license" />
                        <Label htmlFor="bus-license">מספר רישוי</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="busConditionDetails.ravKavOrLicense"
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
          name="busConditionDetails.issueDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תיאור התקלה *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="תאר את התקלה באוטובוס"
                  className="min-h-[100px]"
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
          name="busConditionDetails.tripStopped"
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
                  האם הנסיעה הופסקה עקב התקלה?
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        {tripStopped && (
          <div className="mr-6 space-y-4">
            <FormField
              control={form.control}
              name="busConditionDetails.replacementBusArrived"
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
                      האם הגיע אוטובוס חלופי?
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {replacementBusArrived && (
              <div className="mr-6 space-y-4">
                <FormField
                  control={form.control}
                  name="busConditionDetails.replacementWaitTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>תוך כמה זמן? (דקות)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="מספר דקות"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="busConditionDetails.busArrivedEmpty"
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
                          האם האוטובוס הגיע ריק?
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="form-grid mt-4">
        <FormField
          control={form.control}
          name="busConditionDetails.eventLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>מיקום האירוע</FormLabel>
              <FormControl>
                <Input placeholder="הזן מיקום" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-4">
        <FormField
          control={form.control}
          name="busConditionDetails.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תיאור המקרה</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="תיאור נוסף (אופציונלי)"
                  className="min-h-[80px]"
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
