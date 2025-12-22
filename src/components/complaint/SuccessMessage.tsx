import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessMessageProps {
  referenceNumber: string;
  onNewComplaint: () => void;
}

export function SuccessMessage({ referenceNumber, onNewComplaint }: SuccessMessageProps) {
  return (
    <div className="form-section animate-fade-in text-center py-12">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle2 className="h-12 w-12 text-success" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-foreground mb-4">
        התלונה נשלחה בהצלחה!
      </h2>
      
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        פנייתך התקבלה ותטופל בהקדם. שמור את מספר הפנייה לצורך מעקב.
      </p>
      
      <div className="bg-accent rounded-lg p-6 max-w-sm mx-auto mb-8">
        <p className="text-sm text-muted-foreground mb-2">מספר פנייה:</p>
        <p className="text-2xl font-bold text-primary font-mono">{referenceNumber}</p>
      </div>
      
      <Button onClick={onNewComplaint} variant="outline" size="lg">
        הגשת תלונה נוספת
      </Button>
    </div>
  );
}
