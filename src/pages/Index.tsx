import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { TransportTypeSelector } from "@/components/complaint/TransportTypeSelector";
import { PersonalDetailsSection } from "@/components/complaint/PersonalDetailsSection";
import { BusComplaintSection } from "@/components/complaint/BusComplaintSection";
import { TrainComplaintSection } from "@/components/complaint/TrainComplaintSection";
import { TaxiComplaintSection } from "@/components/complaint/TaxiComplaintSection";
import { FileUploadSection } from "@/components/complaint/FileUploadSection";
import { DeclarationsSection } from "@/components/complaint/DeclarationsSection";
import { SuccessMessage } from "@/components/complaint/SuccessMessage";
import { ComplaintForm, complaintFormSchema } from "@/types/complaint";
import kavYasharLogo from "@/assets/kav-yashar-logo.png";

export default function Index() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");

  const form = useForm<ComplaintForm>({
    resolver: zodResolver(complaintFormSchema),
    defaultValues: {
      transportType: "bus",
      personalDetails: {
        firstName: "",
        lastName: "",
        idNumber: "",
        mobile: "",
        phone: "",
        fax: "",
        email: "",
        city: "",
        street: "",
        houseNumber: "",
        apartment: "",
        poBox: "",
        zipCode: "",
      },
      busDetails: {
        hasRavKav: false,
        ravKavNumber: "",
        operator: "",
        driverName: "",
        busLicenseNumber: "",
        eventDate: "",
        eventHour: "",
        lineNumber: "",
        direction: "",
        boardingStation: "",
        boardingCity: "",
        dropoffStation: "",
        stationAddress: "",
        content: "",
      },
      trainDetails: {
        trainType: "",
        eventDate: "",
        eventHour: "",
        startStation: "",
        destStation: "",
        trainNumber: "",
        content: "",
      },
      taxiDetails: {
        taxiType: "",
        driverName: "",
        drivingLicense: "",
        eventDate: "",
        eventHour: "",
        eventLocation: "",
        content: "",
      },
      firstDeclaration: false,
      secondDeclaration: false,
      attachments: [],
    },
  });

  const transportType = form.watch("transportType");

  const onSubmit = async (data: ComplaintForm) => {
    setIsSubmitting(true);
    try {
      // Generate reference number
      const refNum = `KY-${Date.now().toString(36).toUpperCase()}`;
      
      console.log("Submitting complaint:", data);
      
      // TODO: Send to email and Google Sheets via edge function
      
      setReferenceNumber(refNum);
      setIsSuccess(true);
      
      toast({
        title: "התלונה נשלחה בהצלחה",
        description: `מספר פנייה: ${refNum}`,
      });
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "שגיאה בשליחה",
        description: "אירעה שגיאה בשליחת התלונה. נסה שוב.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewComplaint = () => {
    form.reset();
    setIsSuccess(false);
    setReferenceNumber("");
  };

  const handleFilesChange = (urls: string[]) => {
    form.setValue("attachments", urls);
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-background py-8 px-4">
        <div className="container max-w-3xl">
          <SuccessMessage
            referenceNumber={referenceNumber}
            onNewComplaint={handleNewComplaint}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="container max-w-3xl">
        {/* Header */}
        <header className="text-center mb-8">
          <img
            src={kavYasharLogo}
            alt="קו ישיר"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            הגשת תלונה למשרד התחבורה
          </h1>
          <p className="text-muted-foreground">
            באמצעות ארגון קו ישיר
          </p>
        </header>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TransportTypeSelector form={form} />
            <PersonalDetailsSection form={form} />
            
            {transportType === "bus" && <BusComplaintSection form={form} />}
            {transportType === "train" && <TrainComplaintSection form={form} />}
            {transportType === "taxi" && <TaxiComplaintSection form={form} />}
            
            <FileUploadSection
              onFilesChange={handleFilesChange}
              uploadedUrls={form.watch("attachments") || []}
            />
            
            <DeclarationsSection form={form} />

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="min-w-[200px]"
              >
                {isSubmitting ? (
                  "שולח..."
                ) : (
                  <>
                    <Send className="ml-2 h-5 w-5" />
                    שליחת התלונה
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground border-t border-border pt-6">
          <p>© {new Date().getFullYear()} ארגון קו ישיר. כל הזכויות שמורות.</p>
        </footer>
      </div>
    </main>
  );
}
