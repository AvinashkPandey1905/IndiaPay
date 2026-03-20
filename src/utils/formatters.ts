/**
 * Formats a number into Indian Rupee (INR) currency string.
 */
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a date string into 'DD MMM YYYY' format.
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

/**
 * Masks a phone number for security.
 * Example: 9876543210 -> ******3210
 */
export const maskPhone = (phone: string): string => {
  return '******' + phone.slice(-4);
};
