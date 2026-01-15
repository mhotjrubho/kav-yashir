import { z } from "zod";
import { validateIsraeliId } from "@/lib/israeliIdValidator";

// Complaint types
export const complaintTypes = [
  "no_ride",
  "no_stop",
  "delay",
  "early_departure",
  "driver_behavior",
  "add_line",
  "overcrowding",
  "add_frequency",
  "bus_condition",
  "license_violation",
  "other",
] as const;

export type ComplaintType = (typeof complaintTypes)[number];

export const complaintTypeLabels: Record<ComplaintType, string> = {
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

// Bus operators from GTFS agency.txt (filtered for bus operators only)
export const busOperators = [
  { value: "3", label: "אגד" },
  { value: "4", label: "אלקטרה אפיקים תחבורה" },
  { value: "5", label: "דן" },
  { value: "6", label: "ש.א.מ" },
  { value: "7", label: "נסיעות ותיירות" },
  { value: "8", label: "גי.בי.טורס" },
  { value: "10", label: "מועצה אזורית אילות" },
  { value: "14", label: "נתיב אקספרס" },
  { value: "15", label: "מטרופולין" },
  { value: "16", label: "סופרבוס" },
  { value: "18", label: "קווים" },
  { value: "21", label: "כפיר" },
  { value: "23", label: "גלים" },
  { value: "24", label: "מועצה אזורית גולן" },
  { value: "25", label: "אלקטרה אפיקים" },
  { value: "31", label: "דן בדרום" },
  { value: "32", label: "דן באר שבע" },
  { value: "34", label: "תנופה" },
  { value: "35", label: "בית שמש אקספרס" },
  { value: "37", label: "אקסטרה" },
  { value: "38", label: "אקסטרה ירושלים" },
  { value: "135", label: "דרך אגד עוטף ירושלים" },
] as const;

// Frequency request reasons
export const frequencyReasons = [
  { value: "overcrowding", label: "עומס נוסעים" },
  { value: "long_wait", label: "זמני המתנה ארוכים" },
  { value: "extend_hours", label: "הארכת שעות פעילות" },
] as const;

// Personal details schema with Israeli ID validation
export const personalDetailsSchema = z.object({
  firstName: z.string().min(2, "שם פרטי חייב להכיל לפחות 2 תווים"),
  lastName: z.string().min(2, "שם משפחה חייב להכיל לפחות 2 תווים"),
  idNumber: z
    .string()
    .min(5, "מספר זהות חייב להכיל לפחות 5 ספרות")
    .max(9, "מספר זהות חייב להכיל עד 9 ספרות")
    .regex(/^\d+$/, "מספר זהות חייב להכיל ספרות בלבד")
    .refine(validateIsraeliId, "מספר זהות לא תקין"),
  mobile: z.string().regex(/^05\d{8}$/, "מספר טלפון לא תקין"),
  ravKavNumber: z.string().optional(),
  city: z.string().min(2, "יש להזין עיר"),
  street: z.string().min(2, "יש להזין רחוב"),
  houseNumber: z.string().optional().default(""),
  email: z.string().email("כתובת אימייל לא תקינה"),
  acceptUpdates: z.boolean().default(false),
  acceptPrivacy: z.boolean().refine((val) => val === true, "יש לאשר את מדיניות הפרטיות"),
});

// Station-based complaint schema (no_ride, no_stop, delay, early_departure)
export const stationBasedComplaintSchema = z.object({
  stationNumber: z.string().optional().default(""),
  lineNumber: z.string().optional().default(""),
  arrivalTime: z.string().optional().default(""),
  departureTime: z.string().optional().default(""),
  eventDate: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

// Driver behavior complaint schema
export const driverBehaviorComplaintSchema = z.object({
  lineNumber: z.string().optional().default(""),
  operator: z.string().optional().default(""),
  alternative: z.string().optional().default(""),
  eventDate: z.string().optional().default(""),
  eventTime: z.string().optional().default(""),
  isPersonalRavKav: z.boolean().default(true),
  ravKavOrLicense: z.string().optional().default(""),
  identifierType: z.enum(["ravkav", "license"]).optional(),
  driverName: z.string().optional().default(""),
  description: z.string().optional().default(""),
  acceptTestimonyMinistry: z.boolean().default(false),
  acceptTestimonyCourt: z.boolean().default(false),
});

// Add line complaint schema
export const addLineComplaintSchema = z.object({
  originCity: z.string().optional().default(""),
  destinationCity: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

// Overcrowding complaint schema
export const overcrowdingComplaintSchema = z.object({
  lineNumber: z.string().optional().default(""),
  operator: z.string().optional().default(""),
  eventDate: z.string().optional().default(""),
  eventTime: z.string().optional().default(""),
  eventLocation: z.string().optional().default(""),
  alternative: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

// Add frequency complaint schema
export const addFrequencyComplaintSchema = z.object({
  lineNumber: z.string().optional().default(""),
  operator: z.string().optional().default(""),
  alternative: z.string().optional().default(""),
  reason: z.string().optional().default(""),
  eventDate: z.string().optional().default(""),
  startTime: z.string().optional().default(""),
  endTime: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

// Bus condition complaint schema
export const busConditionComplaintSchema = z.object({
  lineNumber: z.string().optional().default(""),
  operator: z.string().optional().default(""),
  alternative: z.string().optional().default(""),
  eventDate: z.string().optional().default(""),
  eventTime: z.string().optional().default(""),
  isPersonalRavKav: z.boolean().default(true),
  ravKavOrLicense: z.string().optional().default(""),
  identifierType: z.enum(["ravkav", "license"]).optional(),
  issueDescription: z.string().optional().default(""),
  tripStopped: z.boolean().default(false),
  replacementBusArrived: z.boolean().optional(),
  replacementWaitTime: z.string().optional().default(""),
  busArrivedEmpty: z.boolean().optional(),
  eventLocation: z.string().optional().default(""),
  description: z.string().optional().default(""),
}).superRefine((data, ctx) => {
  // If not using personal rav-kav, require ravKavOrLicense
  if (!data.isPersonalRavKav && (!data.ravKavOrLicense || data.ravKavOrLicense.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "יש להזין מספר רב-קו או מספר רישוי",
      path: ["ravKavOrLicense"],
    });
  }
});

// License violation complaint schema
export const licenseViolationComplaintSchema = z.object({
  lineNumber: z.string().optional().default(""),
  operator: z.string().optional().default(""),
  alternative: z.string().optional().default(""),
  eventDate: z.string().optional().default(""),
  eventTime: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

// Other complaint schema
export const otherComplaintSchema = z.object({
  description: z.string().optional().default(""),
});

// Full form schema
export const complaintFormSchema = z.object({
  complaintType: z.enum(complaintTypes),
  personalDetails: personalDetailsSchema,
  stationBasedDetails: stationBasedComplaintSchema.optional(),
  driverBehaviorDetails: driverBehaviorComplaintSchema.optional(),
  addLineDetails: addLineComplaintSchema.optional(),
  overcrowdingDetails: overcrowdingComplaintSchema.optional(),
  addFrequencyDetails: addFrequencyComplaintSchema.optional(),
  busConditionDetails: busConditionComplaintSchema.optional(),
  licenseViolationDetails: licenseViolationComplaintSchema.optional(),
  otherDetails: otherComplaintSchema.optional(),
  attachments: z.array(z.string()).optional(),
});

export type PersonalDetails = z.infer<typeof personalDetailsSchema>;
export type StationBasedComplaint = z.infer<typeof stationBasedComplaintSchema>;
export type DriverBehaviorComplaint = z.infer<typeof driverBehaviorComplaintSchema>;
export type AddLineComplaint = z.infer<typeof addLineComplaintSchema>;
export type OvercrowdingComplaint = z.infer<typeof overcrowdingComplaintSchema>;
export type AddFrequencyComplaint = z.infer<typeof addFrequencyComplaintSchema>;
export type BusConditionComplaint = z.infer<typeof busConditionComplaintSchema>;
export type LicenseViolationComplaint = z.infer<typeof licenseViolationComplaintSchema>;
export type OtherComplaint = z.infer<typeof otherComplaintSchema>;
export type ComplaintForm = z.infer<typeof complaintFormSchema>;
