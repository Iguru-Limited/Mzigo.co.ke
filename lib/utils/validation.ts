/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (basic validation)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s+()-]{10,}$/
  return phoneRegex.test(phone)
}

/**
 * Validate tracking number format
 */
export function isValidTrackingNumber(trackingNumber: string): boolean {
  // Assuming tracking number should be alphanumeric and at least 6 characters
  return trackingNumber.length >= 6 && /^[a-zA-Z0-9]+$/.test(trackingNumber)
}

/**
 * Validate required fields
 */
export function validateRequired(value: any): boolean {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return value !== null && value !== undefined
}
