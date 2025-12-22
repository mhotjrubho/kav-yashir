import { UseFormReturn } from "react-hook-form";
import { Train } from "lucide-react";
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
import { ComplaintForm, trainTypes, trainStations } from "@/types/complaint";

interface TrainComplaintSectionProps {
  form: UseFormReturn<ComplaintForm>;
}

export function TrainComplaintSection({ form }: TrainComplaintSectionProps) {
  return (
    <div className="form-section animate-fade-in">
      <h2 className="form-section-title">
        <Train className="h-5 w-5 text-primary" />
        פרטי התלונה - רכבת
      </h2>

      <div className="form-grid">
        <FormField
          control={form.control}
          name="trainDetails.trainType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>סוג רכבת *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סוג רכבת" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {trainTypes.map((type) => (
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
          name="trainDetails.eventDate"
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
          name="trainDetails.eventHour"
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
          name="trainDetails.startStation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תחנת מוצא *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר תחנת מוצא" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {trainStations.map((station) => (
                    <SelectItem key={station.value} value={station.value}>
                      {station.label}
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
          name="trainDetails.destStation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תחנת יעד *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר תחנת יעד" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {trainStations.map((station) => (
                    <SelectItem key={station.value} value={station.value}>
                      {station.label}
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
          name="trainDetails.trainNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>מספר רכבת</FormLabel>
              <FormControl>
                <Input placeholder="אם ידוע" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-6">
        <FormField
          control={form.control}
          name="trainDetails.content"
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
