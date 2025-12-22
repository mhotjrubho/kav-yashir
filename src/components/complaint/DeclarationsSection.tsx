import { UseFormReturn } from "react-hook-form";
import { Shield } from "lucide-react";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ComplaintForm } from "@/types/complaint";

interface DeclarationsSectionProps {
  form: UseFormReturn<ComplaintForm>;
}

export function DeclarationsSection({ form }: DeclarationsSectionProps) {
  return (
    <div className="form-section animate-fade-in">
      <h2 className="form-section-title">
        <Shield className="h-5 w-5 text-primary" />
        הצהרות
      </h2>

      <div className="space-y-6">
        <FormField
          control={form.control}
          name="firstDeclaration"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-normal">
                <FormLabel className="text-sm font-normal cursor-pointer">
                  אני מצהיר/ה כי כל הפרטים שמסרתי נכונים ומלאים. ידוע לי כי מסירת פרטים כוזבים מהווה עבירה פלילית.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="secondDeclaration"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-normal">
                <FormLabel className="text-sm font-normal cursor-pointer">
                  אני מסכים/ה שפרטי הפנייה יועברו לגורמים הרלוונטיים במשרד התחבורה ולמפעילי התחבורה הציבורית לצורך טיפול בפנייתי.
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
