import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Save } from "lucide-react";
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
import kavYasharLogo from "@/assets/kav-yashar-logo.png";

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
  house_number: z.string().min(1, "יש להזין מספר בית"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { profile, updateProfile, isAuthenticated, isProfileComplete, loading } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (!loading && isProfileComplete) {
      navigate("/");
    }
  }, [isProfileComplete, loading, navigate]);

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
    }
  }, [profile, form]);

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
        description: "כעת תוכל להגיש תלונות",
      });
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">טוען...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="container max-w-lg">
        <header className="text-center mb-8">
          <img
            src={kavYasharLogo}
            alt="קו ישיר"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            השלמת פרטי פרופיל
          </h1>
          <p className="text-muted-foreground">
            יש להשלים את הפרטים האישיים לפני הגשת תלונה
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              פרטים אישיים
            </CardTitle>
            <CardDescription>
              פרטים אלו ישמשו לזיהויך מול משרד התחבורה
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
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>עיר מגורים *</FormLabel>
                        <FormControl>
                          <Input placeholder="עיר" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>רחוב *</FormLabel>
                        <FormControl>
                          <Input placeholder="רחוב" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="house_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>מספר בית *</FormLabel>
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
                      שמירת פרטים והמשך
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
