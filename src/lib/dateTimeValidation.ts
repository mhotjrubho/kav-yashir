/**
 * Date and Time Validation Utilities
 * 
 * Rules:
 * 1. No future dates or times allowed
 * 2. Departure time must be after arrival time
 * 3. For overnight scenarios (transit), the "day" extends until 04:00 next morning
 */

/**
 * Check if a date is in the future
 */
export function isDateInFuture(dateString: string): boolean {
  if (!dateString) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const inputDate = new Date(dateString);
  inputDate.setHours(0, 0, 0, 0);
  
  return inputDate > today;
}

/**
 * Check if a time is in the future (for today's date)
 */
export function isTimeInFuture(dateString: string, timeString: string): boolean {
  if (!dateString || !timeString) return false;
  
  const now = new Date();
  const inputDate = new Date(dateString);
  
  // If not today, time can be anything
  if (
    inputDate.getDate() !== now.getDate() ||
    inputDate.getMonth() !== now.getMonth() ||
    inputDate.getFullYear() !== now.getFullYear()
  ) {
    return false;
  }
  
  // Parse time
  const [hours, minutes] = timeString.split(":").map(Number);
  const inputDateTime = new Date(inputDate);
  inputDateTime.setHours(hours, minutes, 0, 0);
  
  return inputDateTime > now;
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

/**
 * Get current time in HH:MM format
 */
export function getCurrentTimeString(): string {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
}

/**
 * Validate that departure time is after arrival time
 * Allows departure up to 04:00 the next morning (for overnight transit)
 * 
 * @param arrivalTime - Time of arrival (HH:MM)
 * @param departureTime - Time of departure (HH:MM)
 * @returns true if valid, false if invalid
 */
export function isDepartureAfterArrival(
  arrivalTime: string,
  departureTime: string
): boolean {
  if (!arrivalTime || !departureTime) return true; // Don't validate if empty
  
  const [arrivalHours, arrivalMinutes] = arrivalTime.split(":").map(Number);
  const [departureHours, departureMinutes] = departureTime.split(":").map(Number);
  
  // Convert to minutes from midnight
  let arrivalMinutesFromMidnight = arrivalHours * 60 + arrivalMinutes;
  let departureMinutesFromMidnight = departureHours * 60 + departureMinutes;
  
  // If departure is before 04:00 and arrival is after 20:00, 
  // it's considered overnight (next day)
  const EARLY_MORNING_CUTOFF = 4 * 60; // 04:00 in minutes
  const EVENING_START = 20 * 60; // 20:00 in minutes
  
  if (
    departureMinutesFromMidnight < EARLY_MORNING_CUTOFF &&
    arrivalMinutesFromMidnight >= EVENING_START
  ) {
    // Add 24 hours to departure for overnight calculation
    departureMinutesFromMidnight += 24 * 60;
  }
  
  return departureMinutesFromMidnight > arrivalMinutesFromMidnight;
}

/**
 * Format validation error messages
 */
export const dateTimeErrors = {
  futureDateNotAllowed: "לא ניתן לבחור תאריך עתידי",
  futureTimeNotAllowed: "לא ניתן לבחור שעה עתידית",
  departureMustBeAfterArrival: "שעת העזיבה חייבת להיות אחרי שעת ההגעה",
};
