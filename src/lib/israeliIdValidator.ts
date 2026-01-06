/**
 * Validates an Israeli ID number using the Luhn algorithm variant
 * @param id - The ID number to validate (string of up to 9 digits)
 * @returns true if the ID is valid, false otherwise
 */
export function validateIsraeliId(id: string): boolean {
  // Remove any non-digit characters
  const cleanId = id.replace(/\D/g, "");
  
  // ID must be between 1 and 9 digits
  if (cleanId.length === 0 || cleanId.length > 9) {
    return false;
  }
  
  // Pad with leading zeros to make it 9 digits
  const paddedId = cleanId.padStart(9, "0");
  
  // Calculate the checksum
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = parseInt(paddedId[i], 10);
    
    // Multiply by weight (alternating 1 and 2)
    const weight = (i % 2) + 1;
    let product = digit * weight;
    
    // If product > 9, sum its digits (same as product - 9 for single digit products)
    if (product > 9) {
      product = Math.floor(product / 10) + (product % 10);
    }
    
    sum += product;
  }
  
  // Valid if sum is divisible by 10
  return sum % 10 === 0;
}
