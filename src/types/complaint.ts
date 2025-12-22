import { z } from "zod";

export const transportTypes = ["bus", "train", "taxi"] as const;
export type TransportType = typeof transportTypes[number];

export const transportTypeLabels: Record<TransportType, string> = {
  bus: "אוטובוס / תחבורה ציבורית",
  train: "רכבת",
  taxi: "מונית",
};

// Bus operators list
export const busOperators = [
  { value: "1", label: "אגד" },
  { value: "2", label: "דן" },
  { value: "3", label: "אגד תעבורה" },
  { value: "4", label: "קווים" },
  { value: "5", label: "מטרופולין" },
  { value: "6", label: "סופרבוס" },
  { value: "7", label: "נתיב אקספרס" },
  { value: "8", label: "אפיקים" },
  { value: "9", label: "גלים" },
  { value: "10", label: "ש.א.מ" },
  { value: "11", label: "אחר" },
] as const;

// Train types
export const trainTypes = [
  { value: "1", label: "רכבת ישראל" },
  { value: "2", label: "הרכבת הקלה ירושלים" },
  { value: "3", label: "הרכבת הקלה תל אביב" },
] as const;

// Taxi types
export const taxiTypes = [
  { value: "1", label: "מונית מיוחדת" },
  { value: "2", label: "מונית שירות" },
] as const;

// Train stations
export const trainStations = [
  { value: "1", label: "תל אביב - סבידור מרכז" },
  { value: "2", label: "תל אביב - השלום" },
  { value: "3", label: "תל אביב - האוניברסיטה" },
  { value: "4", label: "חיפה - מרכז השמונה" },
  { value: "5", label: "חיפה - חוף הכרמל" },
  { value: "6", label: "ירושלים - יצחק נבון" },
  { value: "7", label: "באר שבע - מרכז" },
  { value: "8", label: "נתב\"ג" },
  { value: "9", label: "הרצליה" },
  { value: "10", label: "נתניה" },
  { value: "11", label: "חדרה - מערב" },
  { value: "12", label: "עכו" },
  { value: "13", label: "נהריה" },
  { value: "14", label: "אשדוד" },
  { value: "15", label: "אשקלון" },
  { value: "16", label: "רחובות" },
  { value: "17", label: "לוד" },
  { value: "18", label: "ראשון לציון" },
  { value: "19", label: "פתח תקווה" },
  { value: "20", label: "מודיעין - מרכז" },
  { value: "21", label: "אחר" },
] as const;

// Personal details schema
export const personalDetailsSchema = z.object({
  firstName: z.string().min(2, "שם פרטי חייב להכיל לפחות 2 תווים"),
  lastName: z.string().min(2, "שם משפחה חייב להכיל לפחות 2 תווים"),
  idNumber: z.string().regex(/^\d{9}$/, "תעודת זהות חייבת להכיל 9 ספרות"),
  mobile: z.string().regex(/^05\d{8}$/, "מספר נייד לא תקין"),
  phone: z.string().optional(),
  fax: z.string().optional(),
  email: z.string().email("כתובת אימייל לא תקינה"),
  city: z.string().min(2, "יש להזין עיר"),
  street: z.string().min(2, "יש להזין רחוב"),
  houseNumber: z.string().min(1, "יש להזין מספר בית"),
  apartment: z.string().optional(),
  poBox: z.string().optional(),
  zipCode: z.string().optional(),
});

// Bus complaint schema
export const busComplaintSchema = z.object({
  hasRavKav: z.boolean().default(false),
  ravKavNumber: z.string().optional(),
  operator: z.string().min(1, "יש לבחור מפעיל"),
  driverName: z.string().optional(),
  busLicenseNumber: z.string().optional(),
  eventDate: z.string().min(1, "יש להזין תאריך"),
  eventHour: z.string().min(1, "יש להזין שעה"),
  lineNumber: z.string().min(1, "יש להזין מספר קו"),
  direction: z.string().optional(),
  boardingStation: z.string().optional(),
  boardingCity: z.string().optional(),
  dropoffStation: z.string().optional(),
  stationAddress: z.string().optional(),
  content: z.string().min(10, "תוכן הפנייה חייב להכיל לפחות 10 תווים"),
});

// Train complaint schema
export const trainComplaintSchema = z.object({
  trainType: z.string().min(1, "יש לבחור סוג רכבת"),
  eventDate: z.string().min(1, "יש להזין תאריך"),
  eventHour: z.string().min(1, "יש להזין שעה"),
  startStation: z.string().min(1, "יש לבחור תחנת מוצא"),
  destStation: z.string().min(1, "יש לבחור תחנת יעד"),
  trainNumber: z.string().optional(),
  content: z.string().min(10, "תוכן הפנייה חייב להכיל לפחות 10 תווים"),
});

// Taxi complaint schema
export const taxiComplaintSchema = z.object({
  taxiType: z.string().min(1, "יש לבחור סוג מונית"),
  driverName: z.string().optional(),
  drivingLicense: z.string().optional(),
  eventDate: z.string().min(1, "יש להזין תאריך"),
  eventHour: z.string().min(1, "יש להזין שעה"),
  eventLocation: z.string().min(2, "יש להזין מיקום האירוע"),
  content: z.string().min(10, "תוכן הפנייה חייב להכיל לפחות 10 תווים"),
});

// Full form schema
export const complaintFormSchema = z.object({
  transportType: z.enum(transportTypes),
  personalDetails: personalDetailsSchema,
  busDetails: busComplaintSchema.optional(),
  trainDetails: trainComplaintSchema.optional(),
  taxiDetails: taxiComplaintSchema.optional(),
  firstDeclaration: z.boolean().refine((val) => val === true, "יש לאשר את ההצהרה"),
  secondDeclaration: z.boolean().refine((val) => val === true, "יש לאשר את ההצהרה"),
  attachments: z.array(z.string()).optional(),
});

export type PersonalDetails = z.infer<typeof personalDetailsSchema>;
export type BusComplaint = z.infer<typeof busComplaintSchema>;
export type TrainComplaint = z.infer<typeof trainComplaintSchema>;
export type TaxiComplaint = z.infer<typeof taxiComplaintSchema>;
export type ComplaintForm = z.infer<typeof complaintFormSchema>;
