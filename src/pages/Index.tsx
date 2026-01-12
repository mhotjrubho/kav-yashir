import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ComplaintTypeSelector } from "@/components/complaint/ComplaintTypeSelector";
import { PersonalDetailsSection } from "@/components/complaint/PersonalDetailsSection";
import { StationBasedComplaint } from "@/components/complaint/StationBasedComplaint";
import { DriverBehaviorComplaint } from "@/components/complaint/DriverBehaviorComplaint";
import { AddLineComplaint } from "@/components/complaint/AddLineComplaint";
import { OvercrowdingComplaint } from "@/components/complaint/OvercrowdingComplaint";
import { AddFrequencyComplaint } from "@/components/complaint/AddFrequencyComplaint";
import { BusConditionComplaint } from "@/components/complaint/BusConditionComplaint";
import { LicenseViolationComplaint } from "@/components/complaint/LicenseViolationComplaint";
import { OtherComplaint } from "@/components/complaint/OtherComplaint";
import { SuccessMessage } from "@/components/complaint/SuccessMessage";
import { UserHeader } from "@/components/auth/UserHeader";
import { ComplaintForm, complaintFormSchema, ComplaintType } from "@/types/complaint";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import kavYasharLogo from "@/assets/kav-yashar-logo.png";

export default function Index() {
  const navigate = useNavigate();
  const { profile, isAuthenticated, isProfileComplete, loading } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");

  const form = useForm<ComplaintForm>({
    resolver: zodResolver(complaintFormSchema),
    defaultValues: {
      complaintType: "no_ride",
      personalDetails: {
        firstName: "",
        lastName: "",
        idNumber: "",
        mobile: "",
        ravKavNumber: "",
        city: "",
        street: "",
        houseNumber: "",
        email: "",
        acceptUpdates: false,
        acceptPrivacy: false,
      },
      stationBasedDetails: {
        stationNumber: "",
        lineNumber: "",
        arrivalTime: "",
        departureTime: "",
        eventDate: "",
        description: "",
      },
      driverBehaviorDetails: {
        lineNumber: "",
        operator: "",
        alternative: "",
        eventDate: "",
        eventTime: "",
        isPersonalRavKav: true,
        ravKavOrLicense: "",
        identifierType: undefined,
        driverName: "",
        description: "",
        acceptTestimonyMinistry: false,
        acceptTestimonyCourt: false,
      },
      addLineDetails: {
        originCity: "",
        destinationCity: "",
        description: "",
      },
      overcrowdingDetails: {
        lineNumber: "",
        operator: "",
        eventDate: "",
        eventTime: "",
        eventLocation: "",
        alternative: "",
        description: "",
      },
      addFrequencyDetails: {
        lineNumber: "",
        operator: "",
        alternative: "",
        reason: "",
        eventDate: "",
        startTime: "",
        endTime: "",
        description: "",
      },
      busConditionDetails: {
        lineNumber: "",
        operator: "",
        alternative: "",
        eventDate: "",
        eventTime: "",
        isPersonalRavKav: true,
        ravKavOrLicense: "",
        identifierType: undefined,
        issueDescription: "",
        tripStopped: false,
        replacementBusArrived: undefined,
        replacementWaitTime: "",
        busArrivedEmpty: undefined,
        eventLocation: "",
        description: "",
      },
      licenseViolationDetails: {
        lineNumber: "",
        operator: "",
        alternative: "",
        eventDate: "",
        eventTime: "",
        description: "",
      },
      otherDetails: {
        description: "",
      },
      attachments: [],
    },
  });

  // Pre-fill form with profile data when authenticated
  useEffect(() => {
    if (profile && isProfileComplete) {
      form.setValue("personalDetails.firstName", profile.first_name || "");
      form.setValue("personalDetails.lastName", profile.last_name || "");
      form.setValue("personalDetails.idNumber", profile.id_number || "");
      form.setValue("personalDetails.mobile", profile.mobile || "");
      form.setValue("personalDetails.ravKavNumber", profile.rav_kav_number || "");
      form.setValue("personalDetails.email", profile.email || "");
      form.setValue("personalDetails.city", profile.city || "");
      form.setValue("personalDetails.street", profile.street || "");
      form.setValue("personalDetails.houseNumber", profile.house_number || "");
    }
  }, [profile, isProfileComplete, form]);

  // Redirect to complete profile if authenticated but profile incomplete
  useEffect(() => {
    if (!loading && isAuthenticated && !isProfileComplete) {
      navigate("/complete-profile");
    }
  }, [loading, isAuthenticated, isProfileComplete, navigate]);

  const complaintType = form.watch("complaintType") as ComplaintType;

  const getComplaintDetails = (data: ComplaintForm) => {
    switch (data.complaintType) {
      case "no_ride":
      case "no_stop":
      case "delay":
      case "early_departure":
        return data.stationBasedDetails;
      case "driver_behavior":
        return data.driverBehaviorDetails;
      case "add_line":
        return data.addLineDetails;
      case "overcrowding":
        return data.overcrowdingDetails;
      case "add_frequency":
        return data.addFrequencyDetails;
      case "bus_condition":
        return data.busConditionDetails;
      case "license_violation":
        return data.licenseViolationDetails;
      case "other":
        return data.otherDetails;
      default:
        return null;
    }
  };

  const onSubmit = async (data: ComplaintForm) => {
    setIsSubmitting(true);
    try {
      // Get current user (may be null for anonymous submissions)
      const { data: { user } } = await supabase.auth.getUser();

      // Generate reference number
      const refNum = `KY-${Date.now().toString(36).toUpperCase()}`;
      
      console.log("Submitting complaint:", data);
      
      // Save to database (user_id is optional for anonymous submissions)
      const { error: dbError } = await supabase.from("complaints").insert({
        user_id: user?.id || null,
        reference_number: refNum,
        complaint_type: data.complaintType,
        personal_details: data.personalDetails,
        complaint_details: getComplaintDetails(data),
        attachments: data.attachments || [],
        status: "pending",
      });

      if (dbError) {
        console.error("Database error:", dbError);
        throw new Error("Failed to save complaint");
      }
      
      // Send to webhook (optional - won't fail if webhook fails)
      try {
        await fetch("https://webhook.site/94e1aeb2-1460-4324-ab25-744066524393", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "no-cors",
          body: JSON.stringify({
            referenceNumber: refNum,
            submittedAt: new Date().toISOString(),
            complaintType: data.complaintType,
            personalDetails: data.personalDetails,
            ...data,
          }),
        });
      } catch (webhookError) {
        console.error("Webhook error:", webhookError);
      }
      
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
    // Re-fill personal details from profile
    if (profile && isProfileComplete) {
      form.setValue("personalDetails.firstName", profile.first_name || "");
      form.setValue("personalDetails.lastName", profile.last_name || "");
      form.setValue("personalDetails.idNumber", profile.id_number || "");
      form.setValue("personalDetails.mobile", profile.mobile || "");
      form.setValue("personalDetails.ravKavNumber", profile.rav_kav_number || "");
      form.setValue("personalDetails.email", profile.email || "");
      form.setValue("personalDetails.city", profile.city || "");
      form.setValue("personalDetails.street", profile.street || "");
      form.setValue("personalDetails.houseNumber", profile.house_number || "");
    }
    setIsSuccess(false);
    setReferenceNumber("");
  };

  const renderComplaintForm = () => {
    switch (complaintType) {
      case "no_ride":
      case "no_stop":
      case "delay":
      case "early_departure":
        return <StationBasedComplaint form={form} complaintType={complaintType} />;
      case "driver_behavior":
        return <DriverBehaviorComplaint form={form} />;
      case "add_line":
        return <AddLineComplaint form={form} />;
      case "overcrowding":
        return <OvercrowdingComplaint form={form} />;
      case "add_frequency":
        return <AddFrequencyComplaint form={form} />;
      case "bus_condition":
        return <BusConditionComplaint form={form} />;
      case "license_violation":
        return <LicenseViolationComplaint form={form} />;
      case "other":
        return <OtherComplaint form={form} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">טוען...</div>
      </main>
    );
  }

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
        {/* User Header */}
        <UserHeader />

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
            <PersonalDetailsSection form={form} disabled={isProfileComplete} />
            <ComplaintTypeSelector form={form} />
            {renderComplaintForm()}

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
