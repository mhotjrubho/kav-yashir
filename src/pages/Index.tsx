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

// Webhook URL from environment variable for security
const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL;

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
      // Auto-accept privacy for authenticated users with complete profile
      form.setValue("personalDetails.acceptPrivacy", true);
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

  const formatComplaintDetailsHebrew = (data: ComplaintForm): Record<string, string | boolean | undefined> => {
    switch (data.complaintType) {
      case "no_ride":
      case "no_stop":
      case "delay":
      case "early_departure":
        return {
          "מספר תחנה": data.stationBasedDetails?.stationNumber || "",
          "מספר קו": data.stationBasedDetails?.lineNumber || "",
          "שעת הגעה משוערת": data.stationBasedDetails?.arrivalTime || "",
          "שעת יציאה בפועל": data.stationBasedDetails?.departureTime || "",
          "תאריך האירוע": data.stationBasedDetails?.eventDate || "",
          "תיאור": data.stationBasedDetails?.description || "",
        };
      case "driver_behavior":
        return {
          "מספר קו": data.driverBehaviorDetails?.lineNumber || "",
          "מפעיל": data.driverBehaviorDetails?.operator || "",
          "חלופה": data.driverBehaviorDetails?.alternative || "",
          "תאריך האירוע": data.driverBehaviorDetails?.eventDate || "",
          "שעת האירוע": data.driverBehaviorDetails?.eventTime || "",
          "רב-קו אישי": data.driverBehaviorDetails?.isPersonalRavKav ? "כן" : "לא",
          "מספר רב-קו/רישוי": data.driverBehaviorDetails?.ravKavOrLicense || "",
          "שם הנהג": data.driverBehaviorDetails?.driverName || "",
          "תיאור": data.driverBehaviorDetails?.description || "",
          "מסכים להעיד במשרד התחבורה": data.driverBehaviorDetails?.acceptTestimonyMinistry ? "כן" : "לא",
          "מסכים להעיד בבית משפט": data.driverBehaviorDetails?.acceptTestimonyCourt ? "כן" : "לא",
        };
      case "add_line":
        return {
          "עיר מוצא": data.addLineDetails?.originCity || "",
          "עיר יעד": data.addLineDetails?.destinationCity || "",
          "תיאור": data.addLineDetails?.description || "",
        };
      case "overcrowding":
        return {
          "מספר קו": data.overcrowdingDetails?.lineNumber || "",
          "מפעיל": data.overcrowdingDetails?.operator || "",
          "תאריך האירוע": data.overcrowdingDetails?.eventDate || "",
          "שעת האירוע": data.overcrowdingDetails?.eventTime || "",
          "מיקום האירוע": data.overcrowdingDetails?.eventLocation || "",
          "חלופה": data.overcrowdingDetails?.alternative || "",
          "תיאור": data.overcrowdingDetails?.description || "",
        };
      case "add_frequency":
        return {
          "מספר קו": data.addFrequencyDetails?.lineNumber || "",
          "מפעיל": data.addFrequencyDetails?.operator || "",
          "חלופה": data.addFrequencyDetails?.alternative || "",
          "סיבה": data.addFrequencyDetails?.reason || "",
          "תאריך": data.addFrequencyDetails?.eventDate || "",
          "משעה": data.addFrequencyDetails?.startTime || "",
          "עד שעה": data.addFrequencyDetails?.endTime || "",
          "תיאור": data.addFrequencyDetails?.description || "",
        };
      case "bus_condition":
        return {
          "מספר קו": data.busConditionDetails?.lineNumber || "",
          "מפעיל": data.busConditionDetails?.operator || "",
          "חלופה": data.busConditionDetails?.alternative || "",
          "תאריך האירוע": data.busConditionDetails?.eventDate || "",
          "שעת האירוע": data.busConditionDetails?.eventTime || "",
          "רב-קו אישי": data.busConditionDetails?.isPersonalRavKav ? "כן" : "לא",
          "מספר רב-קו/רישוי": data.busConditionDetails?.ravKavOrLicense || "",
          "תיאור התקלה": data.busConditionDetails?.issueDescription || "",
          "הנסיעה הופסקה": data.busConditionDetails?.tripStopped ? "כן" : "לא",
          "הגיע אוטובוס חלופי": data.busConditionDetails?.replacementBusArrived ? "כן" : "לא",
          "זמן המתנה לאוטובוס חלופי": data.busConditionDetails?.replacementWaitTime || "",
          "האוטובוס הגיע ריק": data.busConditionDetails?.busArrivedEmpty ? "כן" : "לא",
          "מיקום האירוע": data.busConditionDetails?.eventLocation || "",
          "תיאור": data.busConditionDetails?.description || "",
        };
      case "license_violation":
        return {
          "מספר קו": data.licenseViolationDetails?.lineNumber || "",
          "מפעיל": data.licenseViolationDetails?.operator || "",
          "חלופה": data.licenseViolationDetails?.alternative || "",
          "תאריך האירוע": data.licenseViolationDetails?.eventDate || "",
          "שעת האירוע": data.licenseViolationDetails?.eventTime || "",
          "תיאור": data.licenseViolationDetails?.description || "",
        };
      case "other":
        return {
          "תיאור": data.otherDetails?.description || "",
        };
      default:
        return {};
    }
  };

  const onSubmit = async (data: ComplaintForm) => {
    setIsSubmitting(true);
    try {
      // Get current user (may be null for anonymous submissions)
      const { data: { user } } = await supabase.auth.getUser();

      // Generate reference number starting from 41800
      const baseNumber = 41800;
      const timestamp = Date.now();
      const randomPart = Math.floor(Math.random() * 1000);
      const refNum = String(baseNumber + (timestamp % 100000) + randomPart);
      
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
      
      // Send to webhook (optional - won't fail if webhook fails, only if URL is configured)
      if (WEBHOOK_URL) {
        try {
          // Translate complaint type to Hebrew
          const complaintTypeHebrew: Record<string, string> = {
            no_ride: "נסיעה שלא בוצעה",
            no_stop: "אי עצירה בתחנה",
            delay: "איחור",
            early_departure: "יציאה מוקדמת",
            driver_behavior: "התנהגות נהג",
            add_line: "הוספת קו",
            overcrowding: "צפיפות",
            add_frequency: "הוספת תדירות",
            bus_condition: "מצב האוטובוס",
            license_violation: "ביצוע שאינו מתאים לרישיון",
            other: "אחר",
          };

          // Build flat Hebrew webhook payload with ordered columns
          const stationBasedTypes = ["no_ride", "no_stop", "delay", "early_departure"];
          const isStationBased = stationBasedTypes.includes(data.complaintType);
          const stationDetails = data.stationBasedDetails;
          const otherDetails = getComplaintDetails(data) as Record<string, string> | null;

          const hebrewPayload = {
            "תאריך ושעת קבלה": new Date().toLocaleString("he-IL"),
            "שם פרטי": data.personalDetails.firstName,
            "שם משפחה": data.personalDetails.lastName,
            "מספר זהות": data.personalDetails.idNumber,
            "מספר רב-קו": data.personalDetails.ravKavNumber || "",
            "כתובת מייל": data.personalDetails.email,
            "סוג תלונה": complaintTypeHebrew[data.complaintType] || data.complaintType,
            "מספר תחנה": isStationBased ? stationDetails?.stationNumber || "" : "",
            "שם תחנה": "", // יתווסף בהמשך
            "עיר תחנה": "", // יתווסף בהמשך
            "מספר קו": isStationBased ? stationDetails?.lineNumber || "" : otherDetails?.lineNumber || "",
            "חברת קו": otherDetails?.operator || "",
            "תאריך": isStationBased ? stationDetails?.eventDate || "" : otherDetails?.eventDate || "",
            "שעת הגעה לתחנה": isStationBased ? stationDetails?.arrivalTime || "" : "",
            "שעת עזיבה תחנה": isStationBased ? stationDetails?.departureTime || "" : "",
            "תיאור המקרה": isStationBased ? stationDetails?.description || "" : otherDetails?.description || "",
            "קבצים מצורפים": (data.attachments || []).join(", "),
            "קוד פניה": refNum,
            "סטטוס": "",
            "קבצי תגובה ממשרד התחבורה": "",
          };

          await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            mode: "no-cors",
            body: JSON.stringify(hebrewPayload),
          });
        } catch (webhookError) {
          console.error("Webhook error:", webhookError);
        }
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
            {!isAuthenticated && <PersonalDetailsSection form={form} disabled={false} />}
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
