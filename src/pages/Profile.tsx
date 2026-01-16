import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Save, ArrowRight, FileText, Clock, CheckCircle, AlertCircle, Home, ChevronDown, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";
import { validateIsraeliId } from "@/lib/israeliIdValidator";
import { supabase } from "@/integrations/supabase/client";
import kavYasharLogo from "@/assets/kav-yashar-logo.png";
import { CityAutocomplete } from "@/components/complaint/CityAutocomplete";
import { StreetAutocomplete } from "@/components/complaint/StreetAutocomplete";
import { ComplaintForm as ComplaintFormType } from "@/types/complaint";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Complaint {
  id: string;
  reference_number: string;
  complaint_type: string;
  status: string;
  created_at: string;
  personal_details: unknown;
  complaint_details: unknown;
  attachments: string[] | null;
}

const profileSchema = z.object({
  first_name: z.string().min(2, "שם פרטי חייב להכיל לפחות 2 תווים"),
  last_name: z.string().min(2, "שם משפחה חייב להכיל לפחות 2 תווים"),
  id_number: z.string()
    .length(9, "מספר זהות חייב להכיל 9 ספרות")
    .refine(validateIsraeliId, "מספר זהות לא תקין"),
  mobile: z.string().min(9, "מספר טלפון לא תקין"),
  rav_kav_number: z.string().optional(),
  city: z.string().min(2, "יש להזין עיר מגורים"),
  street: z.string().min(2, "יש להזין רחוב"),
  house_number: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const complaintTypeLabels: Record<string, string> = {
  no_ride: "אי ביצוע נסיעה",
  no_stop: "אי עצירה בתחנה",
  delay: "איחור",
  early_departure: "הקדמה",
  driver_behavior: "התנהגות נהג / פקח",
  add_line: "הוספת קו",
  overcrowding: "עומס בקו",
  add_frequency: "הוספת תדירות",
  bus_condition: "תקינות האוטובוס",
  license_violation: "ביצוע שאינו מתאים לרישיון הקו",
  other: "אחר",
};

const statusLabels: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "ממתין לטיפול", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  in_progress: { label: "בטיפול", color: "bg-blue-100 text-blue-800", icon: AlertCircle },
  resolved: { label: "טופל", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { label: "נדחה", color: "bg-red-100 text-red-800", icon: AlertCircle },
};

export default function Profile() {
  const navigate = useNavigate();
  const { profile, updateProfile, isAuthenticated, loading, user } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [complaintsLoading, setComplaintsLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState(profile?.city || "");

  // Create a wrapper form for city/street autocomplete
  const dummyForm = useForm<ComplaintFormType>({
    defaultValues: {
      personalDetails: {
        city: profile?.city || "",
        street: profile?.street || "",
      }
    }
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      id_number: profile?.id_number || "",
      mobile: profile?.mobile || "",
      rav_kav_number: profile?.rav_kav_number || "",
      city: profile?.city || "",
      street: profile?.street || "",
      house_number: profile?.house_number || "",
    },
  });

  // Sync dummy form with main form
  useEffect(() => {
    const city = dummyForm.watch("personalDetails.city");
    const street = dummyForm.watch("personalDetails.street");
    if (city) form.setValue("city", city);
    if (street) form.setValue("street", street);
  }, [dummyForm.watch("personalDetails.city"), dummyForm.watch("personalDetails.street")]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (profile) {
      form.reset({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        id_number: profile.id_number || "",
        mobile: profile.mobile || "",
        rav_kav_number: profile.rav_kav_number || "",
        city: profile.city || "",
        street: profile.street || "",
        house_number: profile.house_number || "",
      });
      dummyForm.setValue("personalDetails.city", profile.city || "");
      dummyForm.setValue("personalDetails.street", profile.street || "");
      setSelectedCity(profile.city || "");
    }
  }, [profile, form, dummyForm]);

  // Fetch user's complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("complaints")
          .select("id, reference_number, complaint_type, status, created_at, personal_details, complaint_details, attachments")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setComplaints(data || []);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setComplaintsLoading(false);
      }
    };

    if (user) {
      fetchComplaints();
    }
  }, [user]);

  const handleSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    const { error } = await updateProfile(data);
    setIsSubmitting(false);

    if (error) {
      toast({
        title: "שגיאה בעדכון הפרופיל",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "הפרופיל עודכן בהצלחה",
      });
    }
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    form.setValue("city", city);
    form.setValue("street", "");
    dummyForm.setValue("personalDetails.street", "");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">טוען...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background py-8 px-4" dir="rtl">
      <div className="container max-w-2xl">
        <header className="text-center mb-8">
          <img
            src={kavYasharLogo}
            alt="קו ישיר"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            הפרופיל שלי
          </h1>
          <p className="text-muted-foreground">
            ניהול פרטים אישיים וצפייה בתלונות
          </p>
        </header>

        <div className="mb-4">
          <Link to="/">
            <Button variant="outline" size="sm">
              <Home className="ml-2 h-4 w-4" />
              חזרה לדף הבית
            </Button>
          </Link>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              פרטים אישיים
            </CardTitle>
            <CardDescription>
              עדכן את הפרטים האישיים שלך
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>שם פרטי *</FormLabel>
                        <FormControl>
                          <Input placeholder="שם פרטי" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>שם משפחה *</FormLabel>
                        <FormControl>
                          <Input placeholder="שם משפחה" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="id_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>מספר זהות *</FormLabel>
                        <FormControl>
                          <Input placeholder="9 ספרות" maxLength={9} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>מספר טלפון *</FormLabel>
                        <FormControl>
                          <Input placeholder="05X-XXXXXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="rav_kav_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>מספר רב-קו</FormLabel>
                      <FormControl>
                        <Input placeholder="מספר רב-קו (אופציונלי)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <CityAutocomplete 
                    form={dummyForm} 
                    disabled={false} 
                    onCitySelect={handleCitySelect} 
                  />

                  <StreetAutocomplete 
                    form={dummyForm} 
                    disabled={false} 
                    cityName={selectedCity} 
                  />

                  <FormField
                    control={form.control}
                    name="house_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>מספר בית</FormLabel>
                        <FormControl>
                          <Input placeholder="מספר" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full mt-6" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "שומר..." : (
                    <>
                      <Save className="ml-2 h-4 w-4" />
                      שמירת שינויים
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Complaints Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              התלונות שלי
            </CardTitle>
            <CardDescription>
              צפייה בכל התלונות שהגשת
            </CardDescription>
          </CardHeader>
          <CardContent>
            {complaintsLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                טוען תלונות...
              </div>
            ) : complaints.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground mb-4">עדיין לא הגשת תלונות</p>
                <Link to="/">
                  <Button variant="outline">
                    הגש תלונה ראשונה
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {complaints.map((complaint) => {
                  const statusInfo = statusLabels[complaint.status] || statusLabels.pending;
                  const StatusIcon = statusInfo.icon;
                  const details = complaint.complaint_details as Record<string, unknown> | null;
                  
                  return (
                    <AccordionItem key={complaint.id} value={complaint.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 text-right w-full">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">
                                {complaintTypeLabels[complaint.complaint_type] || complaint.complaint_type}
                              </span>
                              <Badge variant="outline" className={statusInfo.color}>
                                <StatusIcon className="h-3 w-3 ml-1" />
                                {statusInfo.label}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <span>מספר פניה: {complaint.reference_number}</span>
                              <span className="mx-2">•</span>
                              <span>
                                {new Date(complaint.created_at).toLocaleDateString("he-IL", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-4 space-y-4">
                          {/* Complaint Details */}
                          {details && Object.keys(details).length > 0 && (
                            <div className="bg-muted/50 rounded-lg p-4">
                              <h4 className="font-medium mb-3">פרטי התלונה</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                {Object.entries(details).map(([key, value]) => {
                                  if (value === undefined || value === null || value === "") return null;
                                  const hebrewLabels: Record<string, string> = {
                                    stationNumber: "מספר תחנה",
                                    lineNumber: "מספר קו",
                                    arrivalTime: "שעת הגעה",
                                    departureTime: "שעת עזיבה",
                                    eventDate: "תאריך האירוע",
                                    eventTime: "שעת האירוע",
                                    description: "תיאור",
                                    operator: "מפעיל",
                                    alternative: "חלופה",
                                    driverName: "שם הנהג",
                                    isPersonalRavKav: "רב-קו אישי",
                                    ravKavOrLicense: "מספר רב-קו/רישוי",
                                    issueDescription: "תיאור התקלה",
                                    eventLocation: "מיקום",
                                    originCity: "עיר מוצא",
                                    destinationCity: "עיר יעד",
                                    reason: "סיבה",
                                    startTime: "משעה",
                                    endTime: "עד שעה",
                                  };
                                  return (
                                    <div key={key}>
                                      <span className="text-muted-foreground">{hebrewLabels[key] || key}: </span>
                                      <span className="font-medium">
                                        {typeof value === "boolean" ? (value ? "כן" : "לא") : String(value)}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          
                          {/* Attachments */}
                          {complaint.attachments && complaint.attachments.length > 0 && (
                            <div className="bg-muted/50 rounded-lg p-4">
                              <h4 className="font-medium mb-3 flex items-center gap-2">
                                <Paperclip className="h-4 w-4" />
                                קבצים מצורפים
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {complaint.attachments.map((url, idx) => (
                                  <a 
                                    key={idx}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline flex items-center gap-1"
                                  >
                                    <FileText className="h-3 w-3" />
                                    קובץ {idx + 1}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Ministry Response placeholder */}
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <h4 className="font-medium mb-2 text-blue-800">תגובת משרד התחבורה</h4>
                            <p className="text-sm text-blue-700">
                              {complaint.status === "resolved" 
                                ? "התלונה טופלה. קבצי תגובה יוצגו כאן בהמשך."
                                : "טרם התקבלה תגובה ממשרד התחבורה."}
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
