import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogIn, UserPlus, ArrowRight, Home } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";
import { validateIsraeliId } from "@/lib/israeliIdValidator";
import kavYasharLogo from "@/assets/kav-yashar-logo.png";
import { AuthCityAutocomplete } from "@/components/auth/AuthCityAutocomplete";
import { AuthStreetAutocomplete } from "@/components/auth/AuthStreetAutocomplete";
import { supabase } from "@/integrations/supabase/client";

const loginSchema = z.object({
  email: z.string().email("כתובת מייל לא תקינה"),
  password: z.string().min(6, "סיסמה חייבת להכיל לפחות 6 תווים"),
});

const signUpSchema = z.object({
  firstName: z.string().min(2, "שם פרטי חייב להכיל לפחות 2 תווים"),
  lastName: z.string().min(2, "שם משפחה חייב להכיל לפחות 2 תווים"),
  idNumber: z.string()
    .length(9, "מספר זהות חייב להכיל 9 ספרות")
    .refine(validateIsraeliId, "מספר זהות לא תקין"),
  mobile: z.string().min(9, "מספר טלפון לא תקין"),
  ravKavNumber: z.string().optional(),
  city: z.string().min(2, "יש להזין עיר מגורים"),
  street: z.string().min(2, "יש להזין רחוב"),
  houseNumber: z.string().optional(),
  email: z.string().email("כתובת מייל לא תקינה"),
  password: z.string().min(6, "סיסמה חייבת להכיל לפחות 6 תווים"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "הסיסמאות אינן תואמות",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, isAuthenticated, loading } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      idNumber: "",
      mobile: "",
      ravKavNumber: "",
      city: "",
      street: "",
      houseNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    signUpForm.setValue("street", "");
  };

  const handleLogin = async (data: LoginFormData) => {
    setIsSubmitting(true);
    const { error } = await signIn(data.email, data.password);
    setIsSubmitting(false);

    if (error) {
      toast({
        title: "שגיאה בהתחברות",
        description: error.message === "Invalid login credentials" 
          ? "מייל או סיסמה שגויים" 
          : error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "התחברת בהצלחה",
        description: "ברוך הבא!",
      });
      navigate("/");
    }
  };

  const handleSignUp = async (data: SignUpFormData) => {
    setIsSubmitting(true);
    const { error } = await signUp(data.email, data.password, {
      firstName: data.firstName,
      lastName: data.lastName,
      idNumber: data.idNumber,
      mobile: data.mobile,
      ravKavNumber: data.ravKavNumber || "",
      city: data.city,
      street: data.street,
      houseNumber: data.houseNumber || "",
    });
    setIsSubmitting(false);

    if (error) {
      let message = error.message;
      if (error.message.includes("already registered")) {
        message = "כתובת המייל כבר רשומה במערכת";
      }
      toast({
        title: "שגיאה בהרשמה",
        description: message,
        variant: "destructive",
      });
    } else {
      // Send webhook for new user registration via Edge Function
      try {
        const webhookPayload = {
          type: "new_user_registration",
          "תאריך הרשמה": new Date().toLocaleString("he-IL"),
          "שם פרטי": data.firstName,
          "שם משפחה": data.lastName,
          "מספר זהות": data.idNumber,
          "טלפון": data.mobile,
          "מספר רב-קו": data.ravKavNumber || "",
          "עיר": data.city,
          "רחוב": data.street,
          "מספר בית": data.houseNumber || "",
          "אימייל": data.email,
        };

        await supabase.functions.invoke('send-webhook', {
          body: { type: 'registration', data: webhookPayload },
        });
      } catch (webhookError) {
        console.error("Webhook error:", webhookError);
      }

      toast({
        title: "נרשמת בהצלחה!",
        description: "ברוך הבא! כעת תוכל להגיש תלונות",
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
    <main className="min-h-screen bg-background py-8 px-4" dir="rtl">
      <div className="container max-w-lg">
        <header className="text-center mb-8">
          <img
            src={kavYasharLogo}
            alt="קו ישיר"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            ברוכים הבאים
          </h1>
          <p className="text-muted-foreground">
            התחברו כדי להגיש תלונות למשרד התחבורה
          </p>
        </header>

        <div className="mb-4 text-center">
          <Link to="/">
            <Button variant="outline" size="sm">
              <Home className="me-2 h-4 w-4" />
              המשך כאורח (ללא רישום)
            </Button>
          </Link>
        </div>

        <Card dir="rtl">
          <CardHeader className="pb-4">
            <Tabs defaultValue="login" className="w-full" dir="rtl">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signup" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  הרשמה
                </TabsTrigger>
                <TabsTrigger value="login" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  התחברות
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6">
                <CardTitle className="text-lg mb-2">התחברות לחשבון</CardTitle>
                <CardDescription>
                  הזינו את פרטי ההתחברות שלכם
                </CardDescription>
                <CardContent className="p-0 mt-4">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>כתובת מייל</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="example@email.com"
                                dir="ltr"
                                className="text-left"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>סיסמה</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="הזינו סיסמה"
                                dir="ltr"
                                className="text-left"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "מתחבר..." : "התחברות"}
                        <ArrowRight className="ms-2 h-4 w-4 rotate-180" />
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <CardTitle className="text-lg mb-2">יצירת חשבון חדש</CardTitle>
                <CardDescription>
                  הזינו את כל הפרטים האישיים לצורך הגשת תלונות
                </CardDescription>
                <CardContent className="p-0 mt-4">
                  <Form {...signUpForm}>
                    <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={signUpForm.control}
                          name="firstName"
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
                          control={signUpForm.control}
                          name="lastName"
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
                          control={signUpForm.control}
                          name="idNumber"
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
                          control={signUpForm.control}
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
                        control={signUpForm.control}
                        name="ravKavNumber"
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
                        <AuthCityAutocomplete
                          form={signUpForm}
                          fieldName="city"
                          onCitySelect={handleCitySelect}
                        />
                        <AuthStreetAutocomplete
                          form={signUpForm}
                          fieldName="street"
                          cityName={selectedCity}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="houseNumber"
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

                      <FormField
                        control={signUpForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>כתובת מייל *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="example@email.com"
                                dir="ltr"
                                className="text-left"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={signUpForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                            <FormLabel>סיסמה *</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="לפחות 6 תווים"
                                dir="ltr"
                                className="text-left"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                            <FormLabel>אישור סיסמה *</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="הזינו שוב"
                                dir="ltr"
                                className="text-left"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                          )}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "נרשם..." : "הרשמה"}
                        <ArrowRight className="ms-2 h-4 w-4 rotate-180" />
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}
